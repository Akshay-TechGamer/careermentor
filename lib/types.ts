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
}

export interface CertificationItem {
	id: string;
	name: string;
	issuer: string;
	year: string;
}

export interface ResumeData {
	personal: PersonalInfo;
	experience: ExperienceItem[];
	education: EducationItem[];
	skills: string[];
	projects: ProjectItem[];
	certifications: CertificationItem[];
}

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
