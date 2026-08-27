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
	| 'labelLeft'
	| 'fullColor'
	| 'railCards'
	| 'softBand'
	| 'photoRight'
	| 'centerSplit'
	| 'panelRight'
	| 'boxedTable'
	| 'ruledBands'
	| 'tintRail'
	| 'dashCenter'
	| 'darkFrame'
	| 'labelBox'
	| 'bandCenter'
	| 'editorial'
	| 'numberedMono'
	| 'colorRight'
	| 'blobs'
	| 'monogramBand'
	| 'kicker'
	| 'boldBars';

const PHOTO_LAYOUTS: TemplateLayout[] = [
	'twoColumn',
	'headerBand',
	'sidebarRight',
	'fullColor',
	'railCards',
	'softBand',
	'photoRight',
	'centerSplit',
	'panelRight',
	'sidebarLeft',
	'darkFrame',
	'labelBox',
	'bandCenter',
	'editorial',
	'numberedMono',
	'colorRight',
	'blobs',
	'kicker',
];

/** Whether a layout renders the headshot — drives the photo-upload UI too. */
export function layoutHasPhoto(layout: string | undefined): boolean {
	return layout != null && PHOTO_LAYOUTS.includes(layout as TemplateLayout);
}

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
	{ slug: 'madrid', name: 'Madrid', category: 'Student', tags: ['Yellow header', 'Label boxes', 'Bold'], blurb: 'A bold yellow header with black label-box headings.', layout: 'labelBox', accent: '#fbd737', font: 'sans', headingFont: 'display' },
	{ slug: 'rome', name: 'Rome', category: 'Creative', tags: ['Editorial', 'Numbered', 'Portrait'], blurb: 'An editorial layout with a large portrait and numbered sections.', layout: 'editorial', accent: '#2d2d2d', font: 'serif', headingFont: 'display' },
	{ slug: 'seoul', name: 'Seoul', category: 'Professional', tags: ['Modern', 'Formal', 'Indigo'], blurb: 'A modern, formal single-column layout in indigo.', layout: 'classic', accent: '#4338ca', font: 'sans', headingFont: 'display' },

	// ---- Two-column (colored sidebar + photo) ----
	{ slug: 'the-innovator', name: 'The Innovator', category: 'Creative', tags: ['Two-column', 'Photo', 'Purple'], blurb: 'A modern two-column layout with a colored sidebar and photo.', layout: 'twoColumn', accent: '#6d28d9', font: 'sans', headingFont: 'display' },
	{ slug: 'barcelona', name: 'Barcelona', category: 'Creative', tags: ['Two-column', 'Editorial', 'Serif'], blurb: 'A bold, editorial two-column layout in crimson.', layout: 'twoColumn', accent: '#be123c', font: 'serif', headingFont: 'display' },
	{ slug: 'chicago', name: 'Chicago', category: 'Executive', tags: ['Dark page', 'Framed', 'Label gutter'], blurb: 'A dark full-bleed page with a hairline frame and label gutter.', layout: 'darkFrame', accent: '#141b2e', font: 'serif', headingFont: 'display' },
	{ slug: 'rio', name: 'Rio', category: 'Creative', tags: ['Organic shapes', 'Hex photo', 'Terracotta'], blurb: 'A creative tinted page with organic shapes and a hex photo.', layout: 'blobs', accent: '#c05f3c', font: 'sans', headingFont: 'display' },
	{ slug: 'paris', name: 'Paris', category: 'Creative', tags: ['Serif', 'Crimson', 'Right rail'], blurb: 'A crimson serif layout with a slim right skills rail.', layout: 'sidebarRight', accent: '#b91c1c', font: 'serif', headingFont: 'display' },

	// ---- Academic (centered CV) ----
	{ slug: 'the-scholar', name: 'The Scholar', category: 'Academic', tags: ['Academic', 'CV', 'Traditional'], blurb: 'A traditional, centered academic CV layout.', layout: 'academic', accent: '#7c2d12', font: 'serif', headingFont: 'display' },
	{ slug: 'ivy', name: 'Ivy', category: 'Academic', tags: ['Academic', 'Formal', 'Deep teal'], blurb: 'A formal academic layout in deep teal.', layout: 'academic', accent: '#134e4a', font: 'serif', headingFont: 'display' },
	{ slug: 'brussels', name: 'Brussels', category: 'Academic', tags: ['Academic', 'Teacher', 'Indigo'], blurb: 'A structured academic layout for teaching roles.', layout: 'academic', accent: '#3730a3', font: 'serif', headingFont: 'display' },

	// ---- Header band (colored top + centered photo) ----
	{ slug: 'oslo', name: 'Oslo', category: 'Executive', tags: ['Dark band', 'Centered photo', 'Serif'], blurb: 'A charcoal header band with a centered portrait and serif type.', layout: 'bandCenter', accent: '#33393f', font: 'serif', headingFont: 'display' },
	{ slug: 'copenhagen', name: 'Copenhagen', category: 'Creative', tags: ['Soft band', 'Statement', 'Cream'], blurb: 'A cream intro panel with a big statement opening.', layout: 'softBand', accent: '#8a6d4a', font: 'serif', headingFont: 'display' },
	{ slug: 'dublin', name: 'Dublin', category: 'Professional', tags: ['Green sidebar', 'Photo', 'Progress bars'], blurb: 'A forest-green sidebar with a photo and progress-bar skills.', layout: 'twoColumn', accent: '#1d5c47', font: 'serif', headingFont: 'display' },
	{ slug: 'berkeley', name: 'Berkeley', category: 'Student', tags: ['Header band', 'Modern', 'Blue'], blurb: 'A modern blue header band for entry-level candidates.', layout: 'headerBand', accent: '#2563eb', font: 'sans', headingFont: 'display' },
	{ slug: 'singapore', name: 'Singapore', category: 'Professional', tags: ['Numbered', 'Mono', 'Date chips'], blurb: 'Numbered mono section indexes with tinted date chips.', layout: 'numberedMono', accent: '#1e40af', font: 'sans', headingFont: 'display' },

	// ---- Sidebar left (bold name + skill bars) ----
	{ slug: 'berlin', name: 'Berlin', category: 'Professional', tags: ['Bold name', 'Black bars', 'Divider'], blurb: 'A stacked bold name with labelled info and thick black skill bars.', layout: 'boldBars', accent: '#16181d', font: 'sans', headingFont: 'display' },
	{ slug: 'geneva', name: 'Geneva', category: 'Executive', tags: ['Left sidebar', 'Serif', 'Navy'], blurb: 'A refined navy sidebar layout for senior roles.', layout: 'sidebarLeft', accent: '#1e3a8a', font: 'serif', headingFont: 'display' },
	{ slug: 'amsterdam', name: 'Amsterdam', category: 'Professional', tags: ['Framed name', 'Tinted rail', 'Navy'], blurb: 'A boxed name header over a tinted rail with dot-rated skills.', layout: 'tintRail', accent: '#1b2a4a', font: 'sans', headingFont: 'display' },
	{ slug: 'zurich', name: 'Zurich', category: 'Executive', tags: ['Monogram band', 'Two column', 'Bronze'], blurb: 'A navy monogram band over two columns with bronze bars.', layout: 'monogramBand', accent: '#1a2438', font: 'serif', headingFont: 'display' },
	{ slug: 'elite', name: 'Elite', category: 'Executive', tags: ['Left sidebar', 'Serif', 'Maroon'], blurb: 'A commanding serif sidebar layout for executives.', layout: 'sidebarLeft', accent: '#7c2d12', font: 'serif', headingFont: 'display' },

	// ---- Sidebar right (photo + details right) ----
	{ slug: 'lisbon', name: 'Lisbon', category: 'Creative', tags: ['Organic shapes', 'Lavender', 'Photo'], blurb: 'A lavender page with organic shapes for creative roles.', layout: 'blobs', accent: '#1e3a8a', font: 'sans', headingFont: 'display' },
	{ slug: 'toronto', name: 'Toronto', category: 'Professional', tags: ['Right sidebar', 'Serif', 'Teal'], blurb: 'A clean serif layout with skills in a right rail.', layout: 'sidebarRight', accent: '#0f766e', font: 'serif', headingFont: 'display' },
	{ slug: 'vancouver', name: 'Vancouver', category: 'Creative', tags: ['Hex photo', 'Numbered', 'Blue'], blurb: 'A hexagon portrait over numbered mono sections.', layout: 'numberedMono', accent: '#2743a6', font: 'sans', headingFont: 'display' },
	{ slug: 'shanghai', name: 'Shanghai', category: 'Professional', tags: ['Soft band', 'Sage', 'Calm'], blurb: 'A muted sage intro panel with a calm, airy body.', layout: 'softBand', accent: '#6b7f52', font: 'sans', headingFont: 'display' },

	// ---- From the user's design library ----
	{ slug: 'helsinki', name: 'Helsinki', category: 'Professional', tags: ['Photo right', 'Double rules', 'Blue'], blurb: 'A crisp single column with a top-right photo and double-ruled headings.', layout: 'photoRight', accent: '#1d4ed8', font: 'sans', headingFont: 'display' },
	{ slug: 'new-york', name: 'New York', category: 'Professional', tags: ['Centered photo', 'Split', 'Minimal'], blurb: 'A centered photo header over a clean two-column body.', layout: 'centerSplit', accent: '#16181d', font: 'sans', headingFont: 'display' },
	{ slug: 'stockholm', name: 'Stockholm', category: 'Professional', tags: ['Right panel', 'Skill bars', 'Blue'], blurb: 'A tinted right panel with progress-bar skills — a classic favourite.', layout: 'panelRight', accent: '#2563eb', font: 'sans', headingFont: 'display' },
	{ slug: 'tokyo', name: 'Tokyo', category: 'Professional', tags: ['Boxed sections', 'Table', 'Structured'], blurb: 'A structured, boxed layout inspired by the Japanese work-history CV.', layout: 'boxedTable', accent: '#334155', font: 'sans', headingFont: 'body' },
	{ slug: 'santiago', name: 'Santiago', category: 'Executive', tags: ['Traditional', 'Ruled bands', 'Serif'], blurb: 'A traditional serif layout with centred section bands and rules.', layout: 'ruledBands', accent: '#111c2d', font: 'serif', headingFont: 'display' },

	// ---- Full color (entire page in accent, white text) ----
	{ slug: 'moscow', name: 'Moscow', category: 'Executive', tags: ['Full color', 'Bold', 'Serif'], blurb: 'A striking full-color page in deep blue with white type.', layout: 'fullColor', accent: '#1e40af', font: 'serif', headingFont: 'display' },
	{ slug: 'cape-town', name: 'Cape Town', category: 'Creative', tags: ['Full color', 'Confident', 'Teal'], blurb: 'A confident full-color page in deep teal.', layout: 'fullColor', accent: '#134e4a', font: 'sans', headingFont: 'display' },

	// ---- Rail cards (grey card sections + highlighted titles) ----
	{ slug: 'boston', name: 'Boston', category: 'Professional', tags: ['Cards', 'Highlights', 'Teal'], blurb: 'Card-style sections with bold highlighted job titles.', layout: 'railCards', accent: '#0e7490', font: 'sans', headingFont: 'display' },
	{ slug: 'sydney', name: 'Sydney', category: 'Professional', tags: ['Right sidebar', 'Navy', 'Skill bars'], blurb: 'A full-height navy right rail with white skill bars.', layout: 'colorRight', accent: '#1e3a5f', font: 'sans', headingFont: 'display' },

	// ---- Soft band (tinted intro panel) ----
	{ slug: 'vienna', name: 'Vienna', category: 'Creative', tags: ['Soft band', 'Statement', 'Serif'], blurb: 'A soft tinted intro panel with a big opening statement.', layout: 'softBand', accent: '#a16207', font: 'serif', headingFont: 'display' },
	{ slug: 'athens', name: 'Athens', category: 'Professional', tags: ['Soft band', 'Minimal', 'Slate'], blurb: 'A calm tinted header panel with a minimal body.', layout: 'softBand', accent: '#334155', font: 'sans', headingFont: 'display' },

	// ---- Kicker (greeting intro + timeline) ----
	{ slug: 'denver', name: 'Denver', category: 'Creative', tags: ['Greeting', 'Timeline', 'Grayscale'], blurb: 'A friendly Hey-there intro with a timeline of roles.', layout: 'kicker', accent: '#1f2937', font: 'sans', headingFont: 'display' },

	// ---- Label left (editorial) ----
	{ slug: 'london', name: 'London', category: 'Professional', tags: ['Label-left', 'Editorial', 'Serif'], blurb: 'An editorial layout with section labels down the left margin.', layout: 'labelLeft', accent: '#0f766e', font: 'serif', headingFont: 'display' },
	{ slug: 'milan', name: 'Milan', category: 'Professional', tags: ['Hairline sidebar', 'Gold', 'Dots'], blurb: 'A hairline-split sidebar with gold headings and dot skills.', layout: 'sidebarLeft', accent: '#b08d5f', font: 'sans', headingFont: 'display' },
	{ slug: 'prague', name: 'Prague', category: 'Technical', tags: ['Label-left', 'Precise', 'Mono'], blurb: 'A precise label-left layout for engineers.', layout: 'labelLeft', accent: '#0369a1', font: 'grotesk', headingFont: 'display' },
	{ slug: 'annie-grey', name: 'Annie Grey', category: 'Executive', tags: ['Framed name', 'Gold dashes', 'Centered'], blurb: 'A gold-framed name with dash-flanked centered headings.', layout: 'dashCenter', accent: '#a8842c', font: 'serif', headingFont: 'display' },
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
