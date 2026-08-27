import type { ResumeData } from '@/lib/types';

export type Tone = 'professional' | 'warm' | 'confident';

export interface CoverLetterInput {
	company: string;
	jobTitle: string;
	manager: string;
	tone: Tone;
}

function lower1(s: string): string {
	return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

export function generateCoverLetter(data: ResumeData, input: CoverLetterInput): string {
	const p = data.personal;
	const name = p.fullName || 'Your Name';
	const role = input.jobTitle.trim() || p.title || 'the role';
	const company = input.company.trim() || 'your company';
	const skills = data.skills.slice(0, 4).join(', ');
	const bullets = data.experience.flatMap((e) => e.bullets).filter(Boolean);
	const topBullet = [...bullets].sort((a, b) => b.length - a.length)[0] || '';
	const years = data.experience.length;

	const greeting = input.manager.trim() ? `Dear ${input.manager.trim()},` : 'Dear Hiring Manager,';

	const opener: Record<Tone, string> = {
		professional: `I am writing to express my strong interest in the ${role} position at ${company}. With a background as ${p.title || 'a dedicated professional'}, I am confident I can add real value to your team.`,
		warm: `I was genuinely excited to come across the ${role} opening at ${company} — it lines up closely with my background and the kind of work I love doing.`,
		confident: `The ${role} role at ${company} is exactly where I can make an immediate impact. My track record speaks to the results your team is looking for.`,
	};

	const strengths = skills
		? `Across my career I have built strengths in ${skills}, and I focus on outcomes over activity.`
		: `I focus on outcomes over activity and bring the core skills this role requires.`;

	const proof = topBullet ? ` In a recent role, I ${lower1(topBullet).replace(/\.$/, '')}.` : '';

	const fit = `What draws me to ${company} is the opportunity to apply this experience where it matters. I am confident my ${years > 0 ? 'hands-on experience' : 'skills and drive'} would translate quickly into results for the ${role} role.`;

	const closing = `I would welcome the chance to discuss how I can contribute to ${company}. Thank you for your time and consideration.`;

	return [greeting, '', opener[input.tone], '', `${strengths}${proof}`, '', fit, '', closing, '', 'Sincerely,', name].join(
		'\n',
	);
}
