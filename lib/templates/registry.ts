// Resume template catalog. Each template maps to a base layout + accent so one
// renderer can produce many distinct looks from the same resume data.

export type TemplateLayout = 'classic' | 'twoColumn' | 'academic';

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
}

export const CATEGORIES: TemplateCategory[] = [
	'Professional',
	'Executive',
	'Student',
	'Academic',
	'Creative',
	'Technical',
];

export const TEMPLATES: Template[] = [
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
];

export function getTemplate(slug: string): Template {
	return TEMPLATES.find((t) => t.slug === slug) ?? TEMPLATES[0];
}
