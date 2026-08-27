// Resume template catalog. Each template is a distinct combination of layout +
// accent + font so no two read the same (variety without pure colour-clones).

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

type Raw = Omit<Template, 'hasPhoto'>;

const RAW: Raw[] = [
	// ---- Classic (single column) ----
	{ slug: 'the-professional', name: 'The Professional', category: 'Professional', tags: ['Single column', 'ATS-friendly', 'Versatile'], blurb: 'A clean, dependable single-column layout for almost any role.', layout: 'classic', accent: '#0f52ba', font: 'sans', headingFont: 'display' },
	{ slug: 'the-elegant', name: 'The Elegant', category: 'Executive', tags: ['Serif', 'Refined', 'Leadership'], blurb: 'A refined serif single-column layout for senior roles.', layout: 'classic', accent: '#1e293b', font: 'serif', headingFont: 'display' },
	{ slug: 'the-minimalist', name: 'The Minimalist', category: 'Technical', tags: ['Minimal', 'Mono', 'Focused'], blurb: 'A stripped-back layout with monospaced accents.', layout: 'classic', accent: '#334155', font: 'grotesk', headingFont: 'body' },
	{ slug: 'madrid', name: 'Madrid', category: 'Professional', tags: ['Single column', 'Fresh', 'Readable'], blurb: 'A fresh, readable single-column layout in calm teal.', layout: 'classic', accent: '#0f766e', font: 'sans', headingFont: 'display' },
	{ slug: 'rome', name: 'Rome', category: 'Executive', tags: ['Classic', 'Authoritative', 'Serif'], blurb: 'A classic, authoritative serif layout in deep burgundy.', layout: 'classic', accent: '#991b1b', font: 'serif', headingFont: 'display' },
	{ slug: 'seoul', name: 'Seoul', category: 'Professional', tags: ['Modern', 'Formal', 'Indigo'], blurb: 'A modern, formal single-column layout in indigo.', layout: 'classic', accent: '#4338ca', font: 'sans', headingFont: 'display' },

	// ---- Two-column (colored sidebar + photo) ----
	{ slug: 'the-innovator', name: 'The Innovator', category: 'Creative', tags: ['Two-column', 'Photo', 'Purple'], blurb: 'A modern two-column layout with a colored sidebar and photo.', layout: 'twoColumn', accent: '#6d28d9', font: 'sans', headingFont: 'display' },
	{ slug: 'barcelona', name: 'Barcelona', category: 'Creative', tags: ['Two-column', 'Editorial', 'Serif'], blurb: 'A bold, editorial two-column layout in crimson.', layout: 'twoColumn', accent: '#be123c', font: 'serif', headingFont: 'display' },
	{ slug: 'chicago', name: 'Chicago', category: 'Technical', tags: ['Two-column', 'Skills-first', 'Blue'], blurb: 'A structured two-column layout that leads with skills.', layout: 'twoColumn', accent: '#1d4ed8', font: 'sans', headingFont: 'display' },
	{ slug: 'rio', name: 'Rio', category: 'Creative', tags: ['Two-column', 'Vibrant', 'Orange'], blurb: 'A vibrant two-column layout with energetic orange.', layout: 'twoColumn', accent: '#ea580c', font: 'sans', headingFont: 'display' },
	{ slug: 'paris', name: 'Paris', category: 'Creative', tags: ['Two-column', 'Warm', 'Serif'], blurb: 'A warm serif two-column layout with a photo.', layout: 'twoColumn', accent: '#9a3412', font: 'serif', headingFont: 'display' },

	// ---- Academic (centered CV) ----
	{ slug: 'the-scholar', name: 'The Scholar', category: 'Academic', tags: ['Academic', 'CV', 'Traditional'], blurb: 'A traditional, centered academic CV layout.', layout: 'academic', accent: '#7c2d12', font: 'serif', headingFont: 'display' },
	{ slug: 'ivy', name: 'Ivy', category: 'Academic', tags: ['Academic', 'Formal', 'Deep teal'], blurb: 'A formal academic layout in deep teal.', layout: 'academic', accent: '#134e4a', font: 'serif', headingFont: 'display' },
	{ slug: 'brussels', name: 'Brussels', category: 'Academic', tags: ['Academic', 'Teacher', 'Indigo'], blurb: 'A structured academic layout for teaching roles.', layout: 'academic', accent: '#3730a3', font: 'serif', headingFont: 'display' },

	// ---- Header band (colored top + centered photo) ----
	{ slug: 'oslo', name: 'Oslo', category: 'Professional', tags: ['Header band', 'Photo', 'Dark'], blurb: 'A striking dark header band with a centered photo.', layout: 'headerBand', accent: '#1f2937', font: 'sans', headingFont: 'display' },
	{ slug: 'copenhagen', name: 'Copenhagen', category: 'Creative', tags: ['Header band', 'Serif', 'Teal'], blurb: 'A modern teal header band with a friendly feel.', layout: 'headerBand', accent: '#0e7490', font: 'serif', headingFont: 'display' },
	{ slug: 'dublin', name: 'Dublin', category: 'Student', tags: ['Header band', 'Entry level', 'Green'], blurb: 'An approachable green header band for students and grads.', layout: 'headerBand', accent: '#059669', font: 'sans', headingFont: 'display' },
	{ slug: 'berkeley', name: 'Berkeley', category: 'Student', tags: ['Header band', 'Modern', 'Blue'], blurb: 'A modern blue header band for entry-level candidates.', layout: 'headerBand', accent: '#2563eb', font: 'sans', headingFont: 'display' },
	{ slug: 'singapore', name: 'Singapore', category: 'Academic', tags: ['Header band', 'Serif', 'Maroon'], blurb: 'A refined maroon header band for educators.', layout: 'headerBand', accent: '#7c2d12', font: 'serif', headingFont: 'display' },

	// ---- Sidebar left (bold name + skill bars) ----
	{ slug: 'berlin', name: 'Berlin', category: 'Professional', tags: ['Left sidebar', 'Skill bars', 'Charcoal'], blurb: 'A bold name over a left sidebar with rated skills.', layout: 'sidebarLeft', accent: '#111c2d', font: 'sans', headingFont: 'display' },
	{ slug: 'geneva', name: 'Geneva', category: 'Executive', tags: ['Left sidebar', 'Serif', 'Navy'], blurb: 'A refined navy sidebar layout for senior roles.', layout: 'sidebarLeft', accent: '#1e3a8a', font: 'serif', headingFont: 'display' },
	{ slug: 'amsterdam', name: 'Amsterdam', category: 'Professional', tags: ['Left sidebar', 'Balanced', 'Teal'], blurb: 'A calm teal sidebar layout with clear sections.', layout: 'sidebarLeft', accent: '#0f766e', font: 'sans', headingFont: 'display' },
	{ slug: 'zurich', name: 'Zurich', category: 'Executive', tags: ['Left sidebar', 'Mono', 'Plum'], blurb: 'A precise plum sidebar layout with mono accents.', layout: 'sidebarLeft', accent: '#6d28d9', font: 'grotesk', headingFont: 'display' },
	{ slug: 'elite', name: 'Elite', category: 'Executive', tags: ['Left sidebar', 'Serif', 'Maroon'], blurb: 'A commanding serif sidebar layout for executives.', layout: 'sidebarLeft', accent: '#7c2d12', font: 'serif', headingFont: 'display' },

	// ---- Sidebar right (photo + details right) ----
	{ slug: 'lisbon', name: 'Lisbon', category: 'Creative', tags: ['Right sidebar', 'Photo', 'Blue'], blurb: 'Main content left with a photo and details rail on the right.', layout: 'sidebarRight', accent: '#1d4ed8', font: 'sans', headingFont: 'display' },
	{ slug: 'toronto', name: 'Toronto', category: 'Professional', tags: ['Right sidebar', 'Serif', 'Teal'], blurb: 'A clean serif layout with skills in a right rail.', layout: 'sidebarRight', accent: '#0f766e', font: 'serif', headingFont: 'display' },
	{ slug: 'vancouver', name: 'Vancouver', category: 'Creative', tags: ['Right sidebar', 'Warm', 'Amber'], blurb: 'A warm amber layout with a supportive right column.', layout: 'sidebarRight', accent: '#b45309', font: 'sans', headingFont: 'display' },
	{ slug: 'shanghai', name: 'Shanghai', category: 'Professional', tags: ['Right sidebar', 'Mono', 'Indigo'], blurb: 'A precise indigo layout with mono accents.', layout: 'sidebarRight', accent: '#4338ca', font: 'grotesk', headingFont: 'display' },

	// ---- Label left (editorial) ----
	{ slug: 'london', name: 'London', category: 'Professional', tags: ['Label-left', 'Editorial', 'Serif'], blurb: 'An editorial layout with section labels down the left margin.', layout: 'labelLeft', accent: '#0f766e', font: 'serif', headingFont: 'display' },
	{ slug: 'milan', name: 'Milan', category: 'Creative', tags: ['Label-left', 'Stylish', 'Purple'], blurb: 'A stylish label-left layout with a modern colour pop.', layout: 'labelLeft', accent: '#7c3aed', font: 'sans', headingFont: 'display' },
	{ slug: 'prague', name: 'Prague', category: 'Technical', tags: ['Label-left', 'Precise', 'Mono'], blurb: 'A precise label-left layout for engineers.', layout: 'labelLeft', accent: '#0369a1', font: 'grotesk', headingFont: 'display' },
	{ slug: 'annie-grey', name: 'Annie Grey', category: 'Executive', tags: ['Label-left', 'Director', 'Serif'], blurb: 'A refined editorial layout for directors and leaders.', layout: 'labelLeft', accent: '#3f3f46', font: 'serif', headingFont: 'display' },
];

export const TEMPLATES: Template[] = RAW.map((t) => ({
	...t,
	hasPhoto: PHOTO_LAYOUTS.includes(t.layout),
}));

export function getTemplate(slug: string): Template {
	return TEMPLATES.find((t) => t.slug === slug) ?? TEMPLATES[0];
}

/**
 * Recommends a template slug from resume text/keywords — always returns a slug
 * that exists.
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
		return 'berkeley';
	}
	return 'the-professional';
}
