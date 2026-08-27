import type { ResumeData } from '@/lib/types';
import { getTemplate, type Template } from '@/lib/templates/registry';

// Renders a resume document from data + template. Used for live preview and
// (via a print stylesheet) PDF export. Sized to A4 proportions.

function dateRange(start: string, end: string, current: boolean): string {
	const e = current ? 'Present' : end;
	return [start, e].filter(Boolean).join(' – ');
}

export function ResumeRenderer({
	data,
	templateSlug,
}: {
	data: ResumeData;
	templateSlug: string;
}) {
	const template = getTemplate(templateSlug);
	if (template.layout === 'twoColumn') {
		return <TwoColumn data={data} template={template} />;
	}
	return <SingleColumn data={data} template={template} academic={template.layout === 'academic'} />;
}

function Contact({ data }: { data: ResumeData }) {
	const p = data.personal;
	const items = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return <p className="text-[11px] opacity-80">{items.join('  •  ')}</p>;
}

function SectionTitle({ children, accent }: { children: React.ReactNode; accent: string }) {
	return (
		<h2
			className="text-[12px] font-bold uppercase tracking-wide mt-4 mb-1.5 pb-1 border-b"
			style={{ color: accent, borderColor: `${accent}55` }}
		>
			{children}
		</h2>
	);
}

function ExperienceBlock({ data }: { data: ResumeData }) {
	if (data.experience.length === 0) return null;
	return (
		<>
			{data.experience.map((e) => (
				<div key={e.id} className="mb-2.5">
					<div className="flex justify-between items-baseline gap-2">
						<span className="font-bold text-[12.5px]">{e.role || 'Role'}</span>
						<span className="text-[10.5px] opacity-70 whitespace-nowrap font-[family-name:var(--font-mono)]">
							{dateRange(e.start, e.end, e.current)}
						</span>
					</div>
					<div className="text-[11.5px] opacity-80">{e.company}</div>
					<ul className="mt-1 list-disc pl-4 space-y-0.5">
						{e.bullets.filter(Boolean).map((b, i) => (
							<li key={i} className="text-[11px] leading-snug">
								{b}
							</li>
						))}
					</ul>
				</div>
			))}
		</>
	);
}

function EducationBlock({ data }: { data: ResumeData }) {
	if (data.education.length === 0) return null;
	return (
		<>
			{data.education.map((e) => (
				<div key={e.id} className="mb-2">
					<div className="flex justify-between items-baseline gap-2">
						<span className="font-bold text-[12px]">{e.degree || 'Degree'}</span>
						<span className="text-[10.5px] opacity-70 font-[family-name:var(--font-mono)]">
							{dateRange(e.start, e.end, false)}
						</span>
					</div>
					<div className="text-[11.5px] opacity-80">{e.school}</div>
					{e.details && <div className="text-[11px] opacity-80">{e.details}</div>}
				</div>
			))}
		</>
	);
}

function SkillsBlock({ data, accent, light }: { data: ResumeData; accent: string; light?: boolean }) {
	if (data.skills.length === 0) return null;
	return (
		<div className="flex flex-wrap gap-1.5">
			{data.skills.map((s, i) => (
				<span
					key={i}
					className="text-[10.5px] rounded px-1.5 py-0.5"
					style={
						light
							? { background: 'rgba(255,255,255,0.18)' }
							: { background: `${accent}18`, color: accent }
					}
				>
					{s}
				</span>
			))}
		</div>
	);
}

function SingleColumn({
	data,
	template,
	academic,
}: {
	data: ResumeData;
	template: Template;
	academic: boolean;
}) {
	const p = data.personal;
	const accent = template.accent;
	return (
		<div className="bg-white text-[#111c2d] w-full h-full p-8 font-[family-name:var(--font-body)]">
			<header className={academic ? 'text-center' : ''}>
				<h1 className="text-[24px] font-extrabold leading-tight" style={{ color: accent }}>
					{p.fullName || 'Your Name'}
				</h1>
				<div className="text-[13px] font-semibold opacity-90">{p.title}</div>
				<div className={academic ? 'flex justify-center mt-1' : 'mt-1'}>
					<Contact data={data} />
				</div>
			</header>

			{p.summary && (
				<>
					<SectionTitle accent={accent}>Summary</SectionTitle>
					<p className="text-[11.5px] leading-snug">{p.summary}</p>
				</>
			)}

			{data.experience.length > 0 && (
				<>
					<SectionTitle accent={accent}>Experience</SectionTitle>
					<ExperienceBlock data={data} />
				</>
			)}

			{data.education.length > 0 && (
				<>
					<SectionTitle accent={accent}>Education</SectionTitle>
					<EducationBlock data={data} />
				</>
			)}

			{data.skills.length > 0 && (
				<>
					<SectionTitle accent={accent}>Skills</SectionTitle>
					<SkillsBlock data={data} accent={accent} />
				</>
			)}

			{data.projects.length > 0 && (
				<>
					<SectionTitle accent={accent}>Projects</SectionTitle>
					{data.projects.map((pr) => (
						<div key={pr.id} className="mb-1.5">
							<span className="font-bold text-[12px]">{pr.name}</span>
							<span className="text-[11px] opacity-80"> — {pr.description}</span>
						</div>
					))}
				</>
			)}
		</div>
	);
}

function TwoColumn({ data, template }: { data: ResumeData; template: Template }) {
	const p = data.personal;
	const accent = template.accent;
	return (
		<div className="bg-white text-[#111c2d] w-full h-full flex font-[family-name:var(--font-body)]">
			<aside className="w-1/3 p-5 text-white" style={{ background: accent }}>
				<h1 className="text-[19px] font-extrabold leading-tight">{p.fullName || 'Your Name'}</h1>
				<div className="text-[12px] opacity-90 font-semibold">{p.title}</div>

				<div className="mt-4">
					<h2 className="text-[11px] font-bold uppercase tracking-wide opacity-90">Contact</h2>
					<div className="mt-1 space-y-0.5 text-[10.5px] opacity-90 break-words">
						{[p.email, p.phone, p.location, ...p.links.map((l) => l.url)]
							.filter(Boolean)
							.map((c, i) => (
								<div key={i}>{c}</div>
							))}
					</div>
				</div>

				{data.skills.length > 0 && (
					<div className="mt-4">
						<h2 className="text-[11px] font-bold uppercase tracking-wide opacity-90">Skills</h2>
						<div className="mt-1.5">
							<SkillsBlock data={data} accent={accent} light />
						</div>
					</div>
				)}

				{data.education.length > 0 && (
					<div className="mt-4">
						<h2 className="text-[11px] font-bold uppercase tracking-wide opacity-90">Education</h2>
						<div className="mt-1 space-y-1.5">
							{data.education.map((e) => (
								<div key={e.id} className="text-[10.5px] opacity-90">
									<div className="font-bold">{e.degree}</div>
									<div>{e.school}</div>
									<div className="opacity-80">{dateRange(e.start, e.end, false)}</div>
								</div>
							))}
						</div>
					</div>
				)}
			</aside>

			<main className="flex-1 p-6">
				{p.summary && (
					<>
						<SectionTitle accent={accent}>Profile</SectionTitle>
						<p className="text-[11.5px] leading-snug">{p.summary}</p>
					</>
				)}
				<SectionTitle accent={accent}>Experience</SectionTitle>
				<ExperienceBlock data={data} />
				{data.projects.length > 0 && (
					<>
						<SectionTitle accent={accent}>Projects</SectionTitle>
						{data.projects.map((pr) => (
							<div key={pr.id} className="mb-1.5">
								<span className="font-bold text-[12px]">{pr.name}</span>
								<span className="text-[11px] opacity-80"> — {pr.description}</span>
							</div>
						))}
					</>
				)}
			</main>
		</div>
	);
}
