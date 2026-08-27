// Resume template catalog. Each template is a distinct combination of layout +
// accent + font so no two look alike (curated to avoid repetition).

import type { FontChoice } from '@/lib/types';

export type TemplateLayout =
	| 'classic'
	| 'twoColumn'
	| 'academic'
	| 'headerBand'
	| 'sidebarLeft'
	| 'sidebarRight'
	| 'labelLeft';

const PHOTO_LAYOUTS: TemplateLayout[] = ['twoColumn', 'headerBand', 'sidebarRight'];

export type TemplateCategory =
	| 'Professional'
	| 'Executive'
	| 'Student'
	| 'Academic'
	| 'Creative'
	| 'Technical';

export interface Template {
	slug: string;
	name: string;
	category: TemplateCategory;
	tags: string[];
	blurb: string;
	layout: TemplateLayout;
	accent: string;
	/** Seeds the resume font so same-layout templates still look distinct. */
	font: FontChoice;
	headingFont: 'display' | 'body';
	/** Photo layouts show a headshot; single-column ones don't. */
	hasPhoto: boolean;
}

export const CATEGORIES: TemplateCategory[] = [
	'Professional',
	'Executive',
	'Student',
	'Academic',
	'Creative',
	'Technical',
];

// A curated set — each entry is visually distinct (unique layout/colour/font mix).
const RAW: Omit<Template, 'hasPhoto'>[] = [
	{
		slug: 'the-professional',
		name: 'The Professional',
		category: 'Professional',
		tags: ['Single column', 'ATS-friendly', 'Versatile'],
		blurb: 'A clean, dependable single-column layout that suits almost any role.',
		layout: 'classic',
		accent: '#0f52ba',
		font: 'sans',
		headingFont: 'display',
	},
	{
		slug: 'the-elegant',
		name: 'The Elegant',
		category: 'Executive',
		tags: ['Serif', 'Refined', 'Leadership'],
		blurb: 'A refined serif single-column layout for senior and executive roles.',
		layout: 'classic',
		accent: '#1e293b',
		font: 'serif',
		headingFont: 'display',
	},
	{
		slug: 'the-minimalist',
		name: 'The Minimalist',
		category: 'Technical',
		tags: ['Minimal', 'Mono', 'Focused'],
		blurb: 'A stripped-back, technical layout with monospaced accents.',
		layout: 'classic',
		accent: '#334155',
		font: 'grotesk',
		headingFont: 'body',
	},
	{
		slug: 'berlin',
		name: 'Berlin',
		category: 'Professional',
		tags: ['Left sidebar', 'Skill bars', 'Bold name'],
		blurb: 'A bold name over a left sidebar of contact, rated skills and education.',
		layout: 'sidebarLeft',
		accent: '#111c2d',
		font: 'sans',
		headingFont: 'display',
	},
	{
		slug: 'lisbon',
		name: 'Lisbon',
		category: 'Creative',
		tags: ['Right sidebar', 'Photo', 'Modern'],
		blurb: 'Main content on the left with a photo and a details rail on the right.',
		layout: 'sidebarRight',
		accent: '#1d4ed8',
		font: 'sans',
		headingFont: 'display',
	},
	{
		slug: 'the-innovator',
		name: 'The Innovator',
		category: 'Creative',
		tags: ['Two-column', 'Colored sidebar', 'Photo'],
		blurb: 'A modern two-column layout with a colored sidebar and headshot.',
		layout: 'twoColumn',
		accent: '#6d28d9',
		font: 'sans',
		headingFont: 'display',
	},
	{
		slug: 'barcelona',
		name: 'Barcelona',
		category: 'Creative',
		tags: ['Two-column', 'Editorial', 'Serif'],
		blurb: 'A bold, editorial two-column layout with serif type.',
		layout: 'twoColumn',
		accent: '#be123c',
		font: 'serif',
		headingFont: 'display',
	},
	{
		slug: 'oslo',
		name: 'Oslo',
		category: 'Professional',
		tags: ['Header band', 'Centered photo', 'Striking'],
		blurb: 'A striking dark header band with a centered photo and name.',
		layout: 'headerBand',
		accent: '#1f2937',
		font: 'sans',
		headingFont: 'display',
	},
	{
		slug: 'copenhagen',
		name: 'Copenhagen',
		category: 'Student',
		tags: ['Header band', 'Friendly', 'Entry level'],
		blurb: 'A friendly teal header-band layout for students and new grads.',
		layout: 'headerBand',
		accent: '#0e7490',
		font: 'serif',
		headingFont: 'display',
	},
	{
		slug: 'london',
		name: 'London',
		category: 'Professional',
		tags: ['Label-left', 'Editorial', 'Serif'],
		blurb: 'An editorial layout with section labels down the left margin.',
		layout: 'labelLeft',
		accent: '#0f766e',
		font: 'serif',
		headingFont: 'display',
	},
	{
		slug: 'milan',
		name: 'Milan',
		category: 'Creative',
		tags: ['Label-left', 'Stylish', 'Modern'],
		blurb: 'A stylish label-left layout with a modern colour pop.',
		layout: 'labelLeft',
		accent: '#7c3aed',
		font: 'sans',
		headingFont: 'display',
	},
	{
		slug: 'the-scholar',
		name: 'The Scholar',
		category: 'Academic',
		tags: ['Academic', 'CV', 'Traditional'],
		blurb: 'A traditional, centered academic CV layout.',
		layout: 'academic',
		accent: '#7c2d12',
		font: 'serif',
		headingFont: 'display',
	},
];

export const TEMPLATES: Template[] = RAW.map((t) => ({
	...t,
	hasPhoto: PHOTO_LAYOUTS.includes(t.layout),
}));

export function getTemplate(slug: string): Template {
	return TEMPLATES.find((t) => t.slug === slug) ?? TEMPLATES[0];
}

/**
 * Recommends a template slug from resume text/keywords — used by the analyzer
 * and the "Recommended for you" surface. Returns a slug that exists.
 */
export function recommendTemplate(text: string): string {
	const t = text.toLowerCase();
	const has = (...words: string[]) => words.some((w) => t.includes(w));
	if (has('professor', 'phd', 'ph.d', 'research', 'publication', 'dissertation', 'academic', 'teacher', 'lecturer')) {
		return 'the-scholar';
	}
	if (has('ceo', 'cto', 'cfo', 'vp ', 'vice president', 'director', 'head of', 'executive', 'p&l')) {
		return 'the-elegant';
	}
	if (has('developer', 'engineer', 'software', 'programmer', 'devops', 'data', 'analyst', 'full stack', 'backend', 'frontend')) {
		return 'the-minimalist';
	}
	if (has('designer', 'ux', 'ui', 'creative', 'brand', 'illustrat', 'figma', 'portfolio', 'photograph')) {
		return 'the-innovator';
	}
	if (has('intern', 'student', 'graduate', 'fresher', 'coursework', 'gpa', 'b.tech', 'bachelor')) {
		return 'copenhagen';
	}
	return 'the-professional';
}
