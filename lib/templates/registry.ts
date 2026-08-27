// Resume template catalog. Each template maps to a base layout + accent so one
// renderer can produce many distinct looks from the same resume data.

export type TemplateLayout =
	| 'classic'
	| 'twoColumn'
	| 'academic'
	| 'headerBand'
	| 'sidebarLeft'
	| 'labelLeft';

const PHOTO_LAYOUTS: TemplateLayout[] = ['twoColumn', 'headerBand'];

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
	headingFont: 'display' | 'body';
	/** Two-column templates show a headshot; single-column ones don't. */
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

const RAW: Omit<Template, 'hasPhoto'>[] = [
	{
		slug: 'the-professional',
		name: 'The Professional',
		category: 'Professional',
		tags: ['Classic', 'ATS-friendly', 'Versatile'],
		blurb: 'A clean, dependable layout that works for almost any role.',
		layout: 'classic',
		accent: '#0f52ba',
		headingFont: 'display',
	},
	{
		slug: 'the-director',
		name: 'The Director',
		category: 'Executive',
		tags: ['Executive', 'Minimalist', 'Traditional'],
		blurb: 'Clean lines and quiet authority for senior and executive roles.',
		layout: 'classic',
		accent: '#111c2d',
		headingFont: 'display',
	},
	{
		slug: 'the-executive',
		name: 'The Executive',
		category: 'Professional',
		tags: ['Director', 'Minimalist', 'Refined'],
		blurb: 'A refined single-column layout that leads with impact.',
		layout: 'classic',
		accent: '#003c90',
		headingFont: 'display',
	},
	{
		slug: 'the-innovator',
		name: 'The Innovator',
		category: 'Creative',
		tags: ['Creative', '2-Column', 'Modern'],
		blurb: 'Stand out with subtle flair and a modern two-column grid.',
		layout: 'twoColumn',
		accent: '#6d28d9',
		headingFont: 'display',
	},
	{
		slug: 'the-designer',
		name: 'The Designer',
		category: 'Creative',
		tags: ['Creative', 'Bold', 'Portfolio'],
		blurb: 'A colorful two-column layout for design and creative fields.',
		layout: 'twoColumn',
		accent: '#db2777',
		headingFont: 'display',
	},
	{
		slug: 'the-starter',
		name: 'The Starter',
		category: 'Student',
		tags: ['Entry Level', 'Clear', 'Structured'],
		blurb: 'Perfect for recent graduates and first-time job seekers.',
		layout: 'classic',
		accent: '#0891b2',
		headingFont: 'display',
	},
	{
		slug: 'the-scholar',
		name: 'The Scholar',
		category: 'Student',
		tags: ['Student', 'Internships', 'Structured'],
		blurb: 'Optimized for students, internships and early careers.',
		layout: 'twoColumn',
		accent: '#0f766e',
		headingFont: 'display',
	},
	{
		slug: 'the-educator',
		name: 'The Educator',
		category: 'Academic',
		tags: ['Academic', 'Teacher', 'Structured'],
		blurb: 'A structured layout for teachers and education professionals.',
		layout: 'academic',
		accent: '#0f52ba',
		headingFont: 'display',
	},
	{
		slug: 'the-professor',
		name: 'The Professor',
		category: 'Academic',
		tags: ['Academic', 'CV', 'Comprehensive'],
		blurb: 'A comprehensive CV layout for academic and research roles.',
		layout: 'academic',
		accent: '#7c2d12',
		headingFont: 'display',
	},
	{
		slug: 'the-developer',
		name: 'The Developer',
		category: 'Technical',
		tags: ['Technical', 'Engineering', 'Skills-first'],
		blurb: 'Showcase technical skills and projects clearly.',
		layout: 'twoColumn',
		accent: '#1d4ed8',
		headingFont: 'display',
	},
	{
		slug: 'the-minimalist',
		name: 'The Minimalist',
		category: 'Professional',
		tags: ['Minimal', 'ATS-friendly', 'Simple'],
		blurb: 'Maximum readability with zero distractions — great for ATS.',
		layout: 'classic',
		accent: '#334155',
		headingFont: 'body',
	},
	{
		slug: 'the-manager',
		name: 'The Manager',
		category: 'Professional',
		tags: ['Leadership', 'Balanced', 'Modern'],
		blurb: 'A balanced layout for team leads and mid-senior managers.',
		layout: 'twoColumn',
		accent: '#1e40af',
		headingFont: 'display',
	},
	{
		slug: 'the-classic',
		name: 'The Classic',
		category: 'Professional',
		tags: ['Timeless', 'Serif-ready', 'ATS-friendly'],
		blurb: 'A timeless single-column layout that never goes out of style.',
		layout: 'classic',
		accent: '#1e293b',
		headingFont: 'display',
	},
	{
		slug: 'the-modern',
		name: 'The Modern',
		category: 'Professional',
		tags: ['Two-column', 'Fresh', 'Balanced'],
		blurb: 'A fresh two-column layout with a calm, modern feel.',
		layout: 'twoColumn',
		accent: '#0e7490',
		headingFont: 'display',
	},
	{
		slug: 'the-elegant',
		name: 'The Elegant',
		category: 'Executive',
		tags: ['Refined', 'Understated', 'Leadership'],
		blurb: 'Understated elegance for senior and leadership roles.',
		layout: 'classic',
		accent: '#3f3f46',
		headingFont: 'display',
	},
	{
		slug: 'the-bold',
		name: 'The Bold',
		category: 'Creative',
		tags: ['Colorful', 'Two-column', 'Standout'],
		blurb: 'A confident, colorful two-column layout that stands out.',
		layout: 'twoColumn',
		accent: '#c026d3',
		headingFont: 'display',
	},
	{
		slug: 'the-analyst',
		name: 'The Analyst',
		category: 'Technical',
		tags: ['Data', 'Compact', 'Structured'],
		blurb: 'A compact, structured layout for data and analytics roles.',
		layout: 'classic',
		accent: '#0369a1',
		headingFont: 'display',
	},

	// City collection (inspired by the classic resume families)
	{
		slug: 'amsterdam',
		name: 'Amsterdam',
		category: 'Professional',
		tags: ['Sidebar', 'Skills', 'Balanced'],
		blurb: 'A calm left-sidebar layout with rated skills and clear sections.',
		layout: 'sidebarLeft',
		accent: '#334155',
		headingFont: 'display',
	},
	{
		slug: 'london',
		name: 'London',
		category: 'Professional',
		tags: ['Label-left', 'Editorial', 'Clean'],
		blurb: 'An editorial layout with section labels down the left margin.',
		layout: 'labelLeft',
		accent: '#1d4ed8',
		headingFont: 'display',
	},
	{
		slug: 'berlin',
		name: 'Berlin',
		category: 'Executive',
		tags: ['Bold name', 'Sidebar', 'Strong'],
		blurb: 'A bold, confident sidebar layout led by a large name.',
		layout: 'sidebarLeft',
		accent: '#111c2d',
		headingFont: 'display',
	},
	{
		slug: 'paris',
		name: 'Paris',
		category: 'Creative',
		tags: ['Photo', 'Two-column', 'Warm'],
		blurb: 'A warm two-column layout with a photo and colored heading.',
		layout: 'twoColumn',
		accent: '#9a3412',
		headingFont: 'display',
	},
	{
		slug: 'oslo',
		name: 'Oslo',
		category: 'Professional',
		tags: ['Header band', 'Photo', 'Centered'],
		blurb: 'A striking colored header band with a centered photo and name.',
		layout: 'headerBand',
		accent: '#1f2937',
		headingFont: 'display',
	},
	{
		slug: 'madrid',
		name: 'Madrid',
		category: 'Professional',
		tags: ['Single column', 'Fresh', 'Readable'],
		blurb: 'A fresh single-column layout that reads beautifully.',
		layout: 'classic',
		accent: '#0f766e',
		headingFont: 'display',
	},
	{
		slug: 'milan',
		name: 'Milan',
		category: 'Creative',
		tags: ['Label-left', 'Stylish', 'Modern'],
		blurb: 'A stylish label-left layout for creative professionals.',
		layout: 'labelLeft',
		accent: '#7c3aed',
		headingFont: 'display',
	},
	{
		slug: 'geneva',
		name: 'Geneva',
		category: 'Executive',
		tags: ['Sidebar', 'Refined', 'Corporate'],
		blurb: 'A refined corporate sidebar layout for senior roles.',
		layout: 'sidebarLeft',
		accent: '#1e3a8a',
		headingFont: 'display',
	},
	{
		slug: 'copenhagen',
		name: 'Copenhagen',
		category: 'Creative',
		tags: ['Header band', 'Modern', 'Photo'],
		blurb: 'A modern colored-header layout with a friendly feel.',
		layout: 'headerBand',
		accent: '#0e7490',
		headingFont: 'display',
	},
	{
		slug: 'rome',
		name: 'Rome',
		category: 'Executive',
		tags: ['Classic', 'Authoritative', 'Serif-ready'],
		blurb: 'A classic, authoritative single-column layout.',
		layout: 'classic',
		accent: '#991b1b',
		headingFont: 'display',
	},
	{
		slug: 'chicago',
		name: 'Chicago',
		category: 'Technical',
		tags: ['Two-column', 'Skills-first', 'Structured'],
		blurb: 'A structured two-column layout that leads with skills.',
		layout: 'twoColumn',
		accent: '#1d4ed8',
		headingFont: 'display',
	},
	{
		slug: 'dublin',
		name: 'Dublin',
		category: 'Student',
		tags: ['Header band', 'Approachable', 'Entry level'],
		blurb: 'An approachable header-band layout for students and grads.',
		layout: 'headerBand',
		accent: '#059669',
		headingFont: 'display',
	},
	{
		slug: 'prague',
		name: 'Prague',
		category: 'Technical',
		tags: ['Label-left', 'Precise', 'Developer'],
		blurb: 'A precise label-left layout for engineers and developers.',
		layout: 'labelLeft',
		accent: '#0369a1',
		headingFont: 'display',
	},
	{
		slug: 'rio',
		name: 'Rio',
		category: 'Creative',
		tags: ['Two-column', 'Vibrant', 'Photo'],
		blurb: 'A vibrant two-column layout that brings energy to your resume.',
		layout: 'twoColumn',
		accent: '#ea580c',
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
 * and the "Recommended for you" surface.
 */
export function recommendTemplate(text: string): string {
	const t = text.toLowerCase();
	const has = (...words: string[]) => words.some((w) => t.includes(w));
	if (has('professor', 'phd', 'ph.d', 'research', 'publication', 'dissertation', 'academic')) {
		return 'the-professor';
	}
	if (has('teacher', 'lecturer', 'curriculum', 'classroom', 'education ', 'pedagog')) {
		return 'the-educator';
	}
	if (has('ceo', 'cto', 'cfo', 'vp ', 'vice president', 'director', 'head of', 'executive', 'p&l')) {
		return 'the-director';
	}
	if (has('developer', 'engineer', 'software', 'programmer', 'devops', 'full stack', 'backend', 'frontend')) {
		return 'the-developer';
	}
	if (has('designer', 'ux', 'ui', 'creative', 'brand', 'illustrat', 'figma', 'portfolio')) {
		return 'the-innovator';
	}
	if (has('intern', 'student', 'graduate', 'fresher', 'coursework', 'gpa', 'b.tech', 'bachelor')) {
		return 'the-starter';
	}
	if (has('manager', 'lead', 'supervisor', 'team of')) {
		return 'the-manager';
	}
	return 'the-professional';
}
