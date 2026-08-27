import { emptyResume, type ResumeData, type ExperienceItem } from '@/lib/types';

// Best-effort parse of raw resume / LinkedIn-PDF text into structured fields.
// Not perfect — meant to give a head start the user then edits.

const HEADERS: { key: string; re: RegExp }[] = [
	{ key: 'summary', re: /^(summary|profile|objective|about( me)?)\b/i },
	{ key: 'experience', re: /^(experience|work (history|experience)|employment|professional experience)\b/i },
	{ key: 'education', re: /^(education|academics?)\b/i },
	{ key: 'skills', re: /^(skills|technical skills|core competencies|expertise)\b/i },
	{ key: 'projects', re: /^(projects?|selected projects)\b/i },
];

function id(): string {
	try {
		return crypto.randomUUID();
	} catch {
		return `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
	}
}

export function parseResumeText(raw: string): ResumeData {
	const data = emptyResume();
	const text = raw.replace(/\r/g, '');
	const lines = text.split('\n').map((l) => l.trim());
	const nonEmpty = lines.filter(Boolean);

	// Contact
	data.personal.email = (text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [''])[0];
	data.personal.phone = (text.match(/(\+?\d[\d\s().\-]{7,}\d)/) || [''])[0];
	const linkedin = (text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[\w\-/%]+/i) || [''])[0];
	if (linkedin) data.personal.links = [{ label: 'LinkedIn', url: linkedin }];

	// Name + title = first lines that aren't contact info
	const topClean = nonEmpty.filter((l) => !/@|\d{3}/.test(l) && !HEADERS.some((h) => h.re.test(l)));
	if (topClean[0]) data.personal.fullName = topClean[0];
	if (topClean[1] && topClean[1].length < 60) data.personal.title = topClean[1];

	// Bucket lines by section
	const buckets: Record<string, string[]> = {};
	let current = 'header';
	for (const line of lines) {
		if (!line) continue;
		const h = HEADERS.find((x) => x.re.test(line) && line.length < 40);
		if (h) {
			current = h.key;
			buckets[current] = buckets[current] ?? [];
			continue;
		}
		(buckets[current] = buckets[current] ?? []).push(line);
	}

	if (buckets.summary?.length) {
		data.personal.summary = buckets.summary.join(' ').slice(0, 600);
	}

	if (buckets.skills?.length) {
		data.skills = buckets.skills
			.join(', ')
			.split(/[,•|\n·]/)
			.map((s) => s.trim())
			.filter((s) => s.length > 1 && s.length < 40)
			.slice(0, 20);
	}

	if (buckets.experience?.length) {
		const entries: ExperienceItem[] = [];
		let cur: ExperienceItem | null = null;
		const looksLikeHeader = (l: string) =>
			/(19|20)\d\d/.test(l) || / at | – | — |,\s*[A-Z]/.test(l);
		for (const l of buckets.experience) {
			if (looksLikeHeader(l) && l.length < 90) {
				cur = { id: id(), role: l, company: '', start: '', end: '', current: false, bullets: [] };
				entries.push(cur);
			} else if (cur) {
				cur.bullets.push(l);
			} else {
				cur = { id: id(), role: 'Experience', company: '', start: '', end: '', current: false, bullets: [l] };
				entries.push(cur);
			}
		}
		data.experience = entries.slice(0, 8);
	}

	if (buckets.education?.length) {
		data.education = [
			{
				id: id(),
				degree: buckets.education[0] ?? '',
				school: buckets.education[1] ?? '',
				start: '',
				end: '',
				details: buckets.education.slice(2).join(' '),
			},
		];
	}

	return data;
}
