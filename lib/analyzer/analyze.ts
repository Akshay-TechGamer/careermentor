// Rule-based resume analyzer — zero cost, no external API. Produces an
// ATS-style score plus an actionable breakdown. The shape is LLM-ready: a
// smarter engine can be swapped in later behind the same AnalysisResult.

import type { ResumeData } from '@/lib/types';

export type IssueStatus = 'perfect' | 'warning' | 'critical';

export interface Fix {
	before: string;
	after: string;
}

export interface BreakdownItem {
	key: string;
	title: string;
	status: IssueStatus;
	chip: string;
	message: string;
	fixes: Fix[];
}

export interface KeywordMatch {
	percent: number;
	matched: string[];
	missing: string[];
}

export interface AnalysisResult {
	score: number;
	critical: number;
	warnings: number;
	breakdown: BreakdownItem[];
	keyword: KeywordMatch | null;
}

// Weak sentence openers → a stronger action verb.
const WEAK_OPENERS: { re: RegExp; verb: string }[] = [
	{ re: /^\s*responsible for\s+/i, verb: 'Led' },
	{ re: /^\s*was responsible for\s+/i, verb: 'Led' },
	{ re: /^\s*helped (to )?\s*/i, verb: 'Drove' },
	{ re: /^\s*worked on\s+/i, verb: 'Built' },
	{ re: /^\s*worked with\s+/i, verb: 'Partnered with' },
	{ re: /^\s*assisted (with|in)?\s*/i, verb: 'Supported' },
	{ re: /^\s*duties included\s+/i, verb: 'Delivered' },
	{ re: /^\s*in charge of\s+/i, verb: 'Directed' },
	{ re: /^\s*participated in\s+/i, verb: 'Contributed to' },
	{ re: /^\s*involved in\s+/i, verb: 'Drove' },
	{ re: /^\s*tasked with\s+/i, verb: 'Owned' },
	{ re: /^\s*handled\s+/i, verb: 'Managed' },
];

const MISSPELLINGS: Record<string, string> = {
	recieve: 'receive',
	recieved: 'received',
	teh: 'the',
	definately: 'definitely',
	seperate: 'separate',
	occured: 'occurred',
	acheive: 'achieve',
	acheived: 'achieved',
	managment: 'management',
	responsibilty: 'responsibility',
	responsibilies: 'responsibilities',
	sucessful: 'successful',
	sucessfully: 'successfully',
	enviroment: 'environment',
	developement: 'development',
	colleauge: 'colleague',
	experiance: 'experience',
	profesional: 'professional',
};

const STOPWORDS = new Set(
	'a an and or the of to in for with on at by from as is are be this that your you we our i will can has have had using used across into over under more most than then them they it its'.split(
		' ',
	),
);

function allBullets(data: ResumeData): string[] {
	return data.experience.flatMap((e) => e.bullets).filter((b) => b.trim().length > 0);
}

function resumeText(data: ResumeData): string {
	const p = data.personal;
	return [
		p.title,
		p.summary,
		...data.skills,
		...data.experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
		...data.education.map((e) => `${e.degree} ${e.school} ${e.details}`),
		...data.projects.map((pr) => `${pr.name} ${pr.description}`),
	]
		.join(' ')
		.toLowerCase();
}

function detectDateFormat(v: string): string | null {
	const s = v.trim();
	if (!s) {
		return null;
	}
	if (/^\d{4}$/.test(s)) {
		return 'YYYY';
	}
	if (/^(0?[1-9]|1[0-2])\/\d{2,4}$/.test(s)) {
		return 'MM/YYYY';
	}
	if (/^[A-Za-z]{3,9}\.?\s+\d{4}$/.test(s)) {
		return 'Mon YYYY';
	}
	return 'other';
}

function impactVerbs(data: ResumeData): BreakdownItem {
	const bullets = allBullets(data);
	const fixes: Fix[] = [];
	for (const b of bullets) {
		for (const w of WEAK_OPENERS) {
			if (w.re.test(b)) {
				const after = b.replace(w.re, `${w.verb} `).replace(/\s+/g, ' ').trim();
				fixes.push({ before: b, after });
				break;
			}
		}
	}
	const weak = fixes.length;
	let status: IssueStatus = 'perfect';
	if (weak >= 3) {
		status = 'critical';
	} else if (weak >= 1) {
		status = 'warning';
	}
	return {
		key: 'impact',
		title: 'Impact Verbs',
		status,
		chip: status === 'perfect' ? 'Strong' : status === 'warning' ? 'Warning' : 'Needs Work',
		message:
			weak === 0
				? 'Your bullet points lead with strong action verbs. Great work.'
				: `You are using weak openers like "responsible for" or "helped" in ${weak} bullet${weak === 1 ? '' : 's'}. Lead with results-driven verbs instead.`,
		fixes: fixes.slice(0, 5),
	};
}

function quantifiedImpact(data: ResumeData): BreakdownItem {
	const bullets = allBullets(data);
	const withNumbers = bullets.filter((b) => /\d/.test(b)).length;
	const total = bullets.length || 1;
	const ratio = withNumbers / total;
	let status: IssueStatus = 'perfect';
	if (ratio < 0.3) {
		status = 'critical';
	} else if (ratio < 0.5) {
		status = 'warning';
	}
	return {
		key: 'quantified',
		title: 'Quantified Results',
		status,
		chip: status === 'perfect' ? 'Strong' : status === 'warning' ? 'Warning' : 'Needs Work',
		message:
			bullets.length === 0
				? 'Add experience bullet points with measurable results (numbers, %, $).'
				: `${withNumbers} of ${bullets.length} bullets include measurable results. Recruiters look for numbers — aim for at least half.`,
		fixes: [],
	};
}

function completeness(data: ResumeData): BreakdownItem {
	const p = data.personal;
	const missing: string[] = [];
	if (!p.email.trim()) missing.push('email');
	if (!p.phone.trim()) missing.push('phone');
	if (!p.location.trim()) missing.push('location');
	if (!p.title.trim()) missing.push('professional title');
	if (!p.summary.trim()) missing.push('summary');
	if (data.experience.length === 0) missing.push('experience');
	if (data.education.length === 0) missing.push('education');
	if (data.skills.length === 0) missing.push('skills');
	let status: IssueStatus = 'perfect';
	if (missing.some((m) => ['email', 'experience', 'title'].includes(m))) {
		status = 'critical';
	} else if (missing.length > 0) {
		status = 'warning';
	}
	return {
		key: 'completeness',
		title: 'Essential Sections',
		status,
		chip: status === 'perfect' ? 'Complete' : status === 'warning' ? 'Warning' : 'Needs Work',
		message:
			missing.length === 0
				? 'All essential sections are present.'
				: `Missing or empty: ${missing.join(', ')}. ATS parsers expect these.`,
		fixes: [],
	};
}

function formatting(data: ResumeData): BreakdownItem {
	const dates = [
		...data.experience.flatMap((e) => [e.start, e.end]),
		...data.education.flatMap((e) => [e.start, e.end]),
	];
	const formats = new Set(
		dates.map(detectDateFormat).filter((f): f is string => f !== null && f !== 'other'),
	);
	const status: IssueStatus = formats.size > 1 ? 'warning' : 'perfect';
	return {
		key: 'formatting',
		title: 'Formatting',
		status,
		chip: status === 'perfect' ? 'Consistent' : 'Warning',
		message:
			formats.size > 1
				? `Inconsistent date formats detected (${[...formats].join(', ')}). Pick one style across the resume.`
				: 'Dates and structure are consistent.',
		fixes: [],
	};
}

function grammar(data: ResumeData): BreakdownItem {
	const bullets = [
		data.personal.summary,
		...allBullets(data),
		...data.education.map((e) => e.details),
	].filter((b) => b.trim().length > 0);
	const issues: Fix[] = [];
	for (const b of bullets) {
		if (/\s{2,}/.test(b)) {
			issues.push({ before: b, after: b.replace(/\s{2,}/g, ' ') });
			continue;
		}
		if (/(^|\s)i(\s|$)/.test(b)) {
			issues.push({ before: b, after: b.replace(/(^|\s)i(\s|$)/g, '$1I$2') });
			continue;
		}
		const lower = b.toLowerCase();
		const bad = Object.keys(MISSPELLINGS).find((m) => new RegExp(`\\b${m}\\b`).test(lower));
		if (bad) {
			issues.push({
				before: b,
				after: b.replace(new RegExp(`\\b${bad}\\b`, 'i'), MISSPELLINGS[bad]),
			});
		}
	}
	let status: IssueStatus = 'perfect';
	if (issues.length >= 3) {
		status = 'critical';
	} else if (issues.length >= 1) {
		status = 'warning';
	}
	return {
		key: 'grammar',
		title: 'Grammar & Spelling',
		status,
		chip: status === 'perfect' ? 'Perfect' : status === 'warning' ? 'Warning' : 'Needs Work',
		message:
			issues.length === 0
				? 'No obvious spelling or spacing issues found.'
				: `Found ${issues.length} likely issue${issues.length === 1 ? '' : 's'} (spelling, spacing or capitalization).`,
		fixes: issues.slice(0, 5),
	};
}

function keywordMatch(data: ResumeData, jobDescription: string): KeywordMatch {
	const jdWords = jobDescription
		.toLowerCase()
		.replace(/[^a-z0-9+#. ]/g, ' ')
		.split(/\s+/)
		.filter((w) => w.length >= 3 && !STOPWORDS.has(w));
	const freq = new Map<string, number>();
	for (const w of jdWords) {
		freq.set(w, (freq.get(w) ?? 0) + 1);
	}
	const keywords = [...freq.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 15)
		.map(([w]) => w);
	const text = resumeText(data);
	const matched = keywords.filter((k) => text.includes(k));
	const missing = keywords.filter((k) => !text.includes(k));
	const percent = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0;
	return { percent, matched, missing };
}

export function analyzeResume(data: ResumeData, jobDescription?: string): AnalysisResult {
	const items = [
		impactVerbs(data),
		quantifiedImpact(data),
		completeness(data),
		formatting(data),
		grammar(data),
	];

	// Weighted score.
	const weights: Record<string, number> = {
		impact: 25,
		quantified: 20,
		completeness: 20,
		formatting: 15,
		grammar: 20,
	};
	const statusScore: Record<IssueStatus, number> = { perfect: 1, warning: 0.55, critical: 0.15 };
	let score = 0;
	for (const item of items) {
		score += weights[item.key] * statusScore[item.status];
	}

	const keyword = jobDescription && jobDescription.trim() ? keywordMatch(data, jobDescription) : null;
	if (keyword) {
		const kwItem: BreakdownItem = {
			key: 'keywords',
			title: 'Job Match',
			status: keyword.percent >= 70 ? 'perfect' : keyword.percent >= 45 ? 'warning' : 'critical',
			chip: `${keyword.percent}% match`,
			message:
				keyword.missing.length === 0
					? 'Your resume covers the key terms from this job.'
					: `Missing keywords from the job description: ${keyword.missing.slice(0, 8).join(', ')}.`,
			fixes: [],
		};
		items.push(kwItem);
		// Blend keyword match into the overall score (10% weight).
		score = score * 0.9 + keyword.percent * 0.1;
	}

	const critical = items.filter((i) => i.status === 'critical').length;
	const warnings = items.filter((i) => i.status === 'warning').length;

	return {
		score: Math.max(0, Math.min(100, Math.round(score))),
		critical,
		warnings,
		breakdown: items,
		keyword,
	};
}
