// The resume data model — stored as jsonb in resume_builder_resumes.data

export interface ContactLink {
	label: string;
	url: string;
}

export interface PersonalInfo {
	fullName: string;
	title: string;
	email: string;
	phone: string;
	location: string;
	links: ContactLink[];
	summary: string;
	/** Optional headshot as a data URL — shown only by photo templates. */
	photo?: string;
}

export interface ExperienceItem {
	id: string;
	role: string;
	company: string;
	start: string;
	end: string;
	current: boolean;
	bullets: string[];
}

export interface EducationItem {
	id: string;
	degree: string;
	school: string;
	start: string;
	end: string;
	details: string;
}

export interface ProjectItem {
	id: string;
	name: string;
	description: string;
	link: string;
	/** Your role on the project (e.g. "Team Lead", "Solo project"). */
	role?: string;
	/** Tech stack, comma-separated (e.g. "React, Node.js, Supabase"). */
	tech?: string;
	start?: string;
	end?: string;
	/** Highlight bullets (impact, results). */
	bullets?: string[];
}

export interface CertificationItem {
	id: string;
	name: string;
	issuer: string;
	year: string;
}

export type FontChoice = 'sans' | 'serif' | 'grotesk';
export type SpacingChoice = 'compact' | 'cozy' | 'roomy';
export type MarginChoice = 'narrow' | 'normal' | 'wide';
export type TextSize = 'small' | 'medium' | 'large';

export interface ResumeStyle {
	accent?: string;
	layout?: 'classic' | 'twoColumn' | 'academic';
	font?: FontChoice;
	/** Vertical spacing between sections (global). */
	spacing?: SpacingChoice;
	/** Page margins (outer padding). */
	margin?: MarginChoice;
	/** Overall text size. */
	textSize?: TextSize;
	/** Per-section spacing overrides (keyed by core section key). */
	sectionGaps?: Record<string, SpacingChoice>;
	/** Show skill level bars/dots (default true). Off = plain text skills. */
	showSkillLevels?: boolean;
}

/** Section-gap (px) for each spacing preset. */
export const SPACING_GAP: Record<SpacingChoice, number> = { compact: 8, cozy: 16, roomy: 26 };
/** Page padding (px) for each margin preset. */
export const MARGIN_PAD: Record<MarginChoice, number> = { narrow: 22, normal: 32, wide: 46 };
/** Text scale multiplier for each size. */
export const TEXT_SCALE: Record<TextSize, number> = { small: 0.92, medium: 1, large: 1.1 };

export function spacingGap(style?: ResumeStyle): number {
	return SPACING_GAP[style?.spacing ?? 'cozy'];
}
export function marginPad(style?: ResumeStyle): number {
	return MARGIN_PAD[style?.margin ?? 'normal'];
}
export function textScale(style?: ResumeStyle): number {
	return TEXT_SCALE[style?.textSize ?? 'medium'];
}

export type SectionType = 'certifications' | 'languages' | 'awards' | 'links' | 'custom';

/** How a custom section lays its items out — user-controllable. */
export type CustomLayout = 'stacked' | 'inline' | 'twocol' | 'bulleted';

export interface CustomSectionItem {
	id: string;
	primary: string;
	secondary: string;
}

export interface CustomSection {
	id: string;
	type: SectionType;
	heading: string;
	layout?: CustomLayout;
	items: CustomSectionItem[];
}

export interface SectionMeta {
	label: string;
	heading: string;
	primary: string;
	secondary: string;
	isLink?: boolean;
	secondaryOptional?: boolean;
	defaultLayout: CustomLayout;
}

export const CUSTOM_LAYOUTS: { key: CustomLayout; label: string }[] = [
	{ key: 'stacked', label: 'Stacked' },
	{ key: 'twocol', label: 'Two column' },
	{ key: 'bulleted', label: 'Bulleted' },
	{ key: 'inline', label: 'Inline' },
];

export const SECTION_META: Record<SectionType, SectionMeta> = {
	certifications: { label: 'Certifications', heading: 'Certifications', primary: 'Certification name', secondary: 'Issuer · Year', defaultLayout: 'twocol' },
	languages: { label: 'Languages', heading: 'Languages', primary: 'Language', secondary: 'Proficiency (e.g. Fluent)', defaultLayout: 'inline' },
	awards: { label: 'Awards & Honors', heading: 'Awards & Honors', primary: 'Award', secondary: 'Year', defaultLayout: 'twocol' },
	links: { label: 'Links / Website', heading: 'Links', primary: 'Label (e.g. Portfolio)', secondary: 'URL', isLink: true, defaultLayout: 'stacked' },
	custom: { label: 'Custom section', heading: 'Custom Section', primary: 'Detail', secondary: 'Note (optional)', secondaryOptional: true, defaultLayout: 'bulleted' },
};

export const SECTION_ORDER: SectionType[] = ['links', 'certifications', 'languages', 'awards', 'custom'];

export type CoreSectionKey = 'summary' | 'experience' | 'education' | 'skills' | 'projects';

export const CORE_SECTION_LABELS: Record<CoreSectionKey, string> = {
	summary: 'Summary',
	experience: 'Experience',
	education: 'Education',
	skills: 'Skills',
	projects: 'Projects',
};

export const DEFAULT_SECTION_ORDER: CoreSectionKey[] = [
	'summary',
	'experience',
	'education',
	'skills',
	'projects',
];

/** Skill rating scale: 1 (basic) to 5 (expert). */
export const SKILL_LEVEL_MAX = 5;
export const DEFAULT_SKILL_LEVEL = 4;

/** The level for a skill: stored value, or a sensible default. */
export function skillLevelFor(data: ResumeData, name: string): number {
	const stored = data.skillLevels?.[name];
	if (stored != null && stored >= 1 && stored <= SKILL_LEVEL_MAX) {
		return stored;
	}
	return DEFAULT_SKILL_LEVEL;
}

/** Standard language proficiency options (label + dots out of 5). */
export const LANGUAGE_LEVELS: { label: string; dots: number }[] = [
	{ label: 'Native', dots: 5 },
	{ label: 'Fluent', dots: 5 },
	{ label: 'Professional', dots: 4 },
	{ label: 'Intermediate', dots: 3 },
	{ label: 'Conversational', dots: 2 },
	{ label: 'Basic', dots: 1 },
];

/** Dots (1–5) for a language proficiency label, or null if it's free text. */
export function languageDots(text: string): number | null {
	const t = text.trim().toLowerCase();
	const hit = LANGUAGE_LEVELS.find((l) => l.label.toLowerCase() === t);
	return hit ? hit.dots : null;
}

export interface ResumeData {
	personal: PersonalInfo;
	experience: ExperienceItem[];
	education: EducationItem[];
	skills: string[];
	/** Per-skill level (1–5), keyed by skill name. Missing = default level. */
	skillLevels?: Record<string, number>;
	projects: ProjectItem[];
	certifications: CertificationItem[];
	/** User-added extra sections (certifications, languages, links, custom…). */
	sections?: CustomSection[];
	/** Order of the core sections in the rendered resume. */
	sectionOrder?: CoreSectionKey[];
	/** Optional per-resume design overrides on top of the chosen template. */
	style?: ResumeStyle;
}

/** The section order with any missing/legacy keys appended in default order. */
export function resolveSectionOrder(data: ResumeData): CoreSectionKey[] {
	const saved = data.sectionOrder ?? [];
	const merged = [...saved];
	for (const k of DEFAULT_SECTION_ORDER) {
		if (!merged.includes(k)) merged.push(k);
	}
	return merged;
}

export const FONT_FAMILY: Record<FontChoice, string> = {
	sans: 'var(--font-body)',
	serif: 'Georgia, "Times New Roman", serif',
	grotesk: 'var(--font-mono)',
};

export const ACCENT_PRESETS: string[] = [
	'#0f52ba',
	'#003c90',
	'#111c2d',
	'#0f766e',
	'#6d28d9',
	'#db2777',
	'#b91c1c',
	'#c2410c',
	'#1d4ed8',
	'#334155',
];

export interface ResumeRow {
	id: string;
	user_id: string;
	title: string;
	template_slug: string;
	data: ResumeData;
	ats_score: number | null;
	is_public: boolean;
	public_slug: string | null;
	created_at: string;
	updated_at: string;
}

export function emptyResume(): ResumeData {
	return {
		personal: {
			fullName: '',
			title: '',
			email: '',
			phone: '',
			location: '',
			links: [],
			summary: '',
		},
		experience: [],
		education: [],
		skills: [],
		projects: [],
		certifications: [],
	};
}

export function sampleResume(): ResumeData {
	return {
		personal: {
			fullName: 'Jane Doe',
			title: 'Senior UX Designer',
			email: 'jane.doe@example.com',
			phone: '+1 (555) 123-4567',
			location: 'San Francisco, CA',
			links: [{ label: 'LinkedIn', url: 'linkedin.com/in/janedoe' }],
			summary:
				'Senior UX Designer with 6+ years crafting enterprise products used by millions. Led design systems and research-driven redesigns that lifted retention and cut task time.',
		},
		experience: [
			{
				id: 'e1',
				role: 'Senior UX Designer',
				company: 'TechCorp Inc.',
				start: '2021',
				end: '',
				current: true,
				bullets: [
					'Led the redesign of the core enterprise dashboard, improving user retention by 25% and reducing task completion time by 40%.',
					'Built and maintained a 60-component design system adopted by 4 product teams.',
				],
			},
		],
		education: [
			{
				id: 'ed1',
				degree: 'B.A. Human-Computer Interaction',
				school: 'State University',
				start: '2014',
				end: '2018',
				details: '',
			},
		],
		skills: ['User Research', 'Figma', 'Prototyping', 'Design Systems', 'Accessibility'],
		projects: [],
		certifications: [],
	};
}
