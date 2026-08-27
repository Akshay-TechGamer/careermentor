import type { CSSProperties, ReactNode } from 'react';
import {
	FONT_FAMILY,
	marginPad,
	resolveSectionOrder,
	SECTION_META,
	spacingGap,
	SPACING_GAP,
	textScale,
	type CoreSectionKey,
	type ResumeData,
} from '@/lib/types';
import { getTemplate } from '@/lib/templates/registry';

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
	const accent = data.style?.accent ?? template.accent;
	const layout = data.style?.layout ?? template.layout;
	const fontFamily = FONT_FAMILY[data.style?.font ?? 'sans'];

	// Spacing + margin presets, exposed as CSS variables the layouts read.
	const vars = {
		'--rz-gap': `${spacingGap(data.style)}px`,
		'--rz-pad': `${marginPad(data.style)}px`,
		'--rz-fs': `${textScale(data.style)}`,
	} as CSSProperties;

	const inner =
		layout === 'twoColumn' ? (
			<TwoColumn data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'headerBand' ? (
			<HeaderBand data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'sidebarLeft' ? (
			<SidebarLeft data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'sidebarRight' ? (
			<SidebarRight data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'labelLeft' ? (
			<LabelLeft data={data} accent={accent} fontFamily={fontFamily} />
		) : (
			<SingleColumn data={data} accent={accent} fontFamily={fontFamily} academic={layout === 'academic'} />
		);

	return (
		<div className="w-full h-full" style={vars}>
			{inner}
		</div>
	);
}

function Contact({ data }: { data: ResumeData }) {
	const p = data.personal;
	const items = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return <p className="text-[calc(11px_*_var(--rz-fs))] opacity-80">{items.join('  •  ')}</p>;
}

function SectionTitle({ children, accent }: { children: ReactNode; accent: string }) {
	return (
		<h2
			className="text-[calc(12px_*_var(--rz-fs))] font-bold uppercase tracking-wide mb-1.5 pb-1 border-b"
			style={{ color: accent, borderColor: `${accent}55`, marginTop: 'var(--rz-gap, 16px)' }}
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
						<span className="font-bold text-[calc(12.5px_*_var(--rz-fs))]">{e.role || 'Role'}</span>
						<span className="text-[calc(10.5px_*_var(--rz-fs))] opacity-70 whitespace-nowrap font-[family-name:var(--font-mono)]">
							{dateRange(e.start, e.end, e.current)}
						</span>
					</div>
					<div className="text-[calc(11.5px_*_var(--rz-fs))] opacity-80">{e.company}</div>
					<ul className="mt-1 list-disc pl-4 space-y-0.5">
						{e.bullets.filter(Boolean).map((b, i) => (
							<li key={i} className="text-[calc(11px_*_var(--rz-fs))] leading-snug">
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
						<span className="font-bold text-[calc(12px_*_var(--rz-fs))]">{e.degree || 'Degree'}</span>
						<span className="text-[calc(10.5px_*_var(--rz-fs))] opacity-70 font-[family-name:var(--font-mono)]">
							{dateRange(e.start, e.end, false)}
						</span>
					</div>
					<div className="text-[calc(11.5px_*_var(--rz-fs))] opacity-80">{e.school}</div>
					{e.details && <div className="text-[calc(11px_*_var(--rz-fs))] opacity-80">{e.details}</div>}
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
					className="text-[calc(10.5px_*_var(--rz-fs))] rounded px-1.5 py-0.5"
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

function CustomBlocks({ data, accent }: { data: ResumeData; accent: string }) {
	const sections = (data.sections ?? []).filter((s) => s.items.some((it) => it.primary || it.secondary));
	if (sections.length === 0) return null;
	return (
		<>
			{sections.map((sec) => {
				const items = sec.items.filter((it) => it.primary || it.secondary);
				const layout = sec.layout ?? SECTION_META[sec.type].defaultLayout;
				const isLink = sec.type === 'links';
				const secStyle = isLink ? { color: accent } : { opacity: 0.72 };
				return (
					<div key={sec.id}>
						<SectionTitle accent={accent}>{sec.heading}</SectionTitle>
						{layout === 'inline' ? (
							<div className="text-[calc(11px_*_var(--rz-fs))] leading-relaxed">
								{items.map((it, i) => (
									<span key={it.id}>
										<span className="font-semibold">{it.primary}</span>
										{it.secondary && (
											<span style={secStyle}>
												{isLink ? ' ' : ' ('}
												{it.secondary}
												{isLink ? '' : ')'}
											</span>
										)}
										{i < items.length - 1 && <span className="opacity-40">{'   ·   '}</span>}
									</span>
								))}
							</div>
						) : layout === 'twocol' ? (
							<div className="space-y-0.5">
								{items.map((it) => (
									<div key={it.id} className="text-[calc(11.5px_*_var(--rz-fs))] flex justify-between gap-3">
										<span className="font-semibold">{it.primary}</span>
										{it.secondary && (
											<span className="whitespace-nowrap" style={secStyle}>
												{it.secondary}
											</span>
										)}
									</div>
								))}
							</div>
						) : layout === 'bulleted' ? (
							<ul className="list-disc pl-4 space-y-0.5">
								{items.map((it) => (
									<li key={it.id} className="text-[calc(11px_*_var(--rz-fs))]">
										<span className="font-semibold">{it.primary}</span>
										{it.secondary && <span style={secStyle}> — {it.secondary}</span>}
									</li>
								))}
							</ul>
						) : (
							<div className="space-y-1">
								{items.map((it) => (
									<div key={it.id}>
										<div className="text-[calc(11.5px_*_var(--rz-fs))] font-semibold">{it.primary}</div>
										{it.secondary && (
											<div className="text-[calc(10.5px_*_var(--rz-fs))]" style={secStyle}>
												{it.secondary}
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				);
			})}
		</>
	);
}

function SingleColumn({
	data,
	accent,
	fontFamily,
	academic,
}: {
	data: ResumeData;
	accent: string;
	fontFamily: string;
	academic: boolean;
}) {
	const p = data.personal;
	return (
		<div
			className="bg-white text-[#111c2d] w-full h-full"
			style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}
		>
			<header className={academic ? 'text-center' : ''}>
				<h1 className="text-[calc(24px_*_var(--rz-fs))] font-extrabold leading-tight" style={{ color: accent }}>
					{p.fullName || 'Your Name'}
				</h1>
				<div className="text-[calc(13px_*_var(--rz-fs))] font-semibold opacity-90">{p.title}</div>
				<div className={academic ? 'flex justify-center mt-1' : 'mt-1'}>
					<Contact data={data} />
				</div>
			</header>

			{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'skills', 'projects'])}

			<CustomBlocks data={data} accent={accent} />
		</div>
	);
}

/** Renders the requested core sections in the user's chosen order. */
function orderedCoreBlocks(data: ResumeData, accent: string, allowed: CoreSectionKey[]) {
	const p = data.personal;
	const blocks: Record<CoreSectionKey, ReactNode> = {
		summary: p.summary ? (
			<>
				<SectionTitle accent={accent}>Summary</SectionTitle>
				<p className="text-[calc(11.5px_*_var(--rz-fs))] leading-snug">{p.summary}</p>
			</>
		) : null,
		experience: data.experience.length > 0 ? (
			<>
				<SectionTitle accent={accent}>Experience</SectionTitle>
				<ExperienceBlock data={data} />
			</>
		) : null,
		education: data.education.length > 0 ? (
			<>
				<SectionTitle accent={accent}>Education</SectionTitle>
				<EducationBlock data={data} />
			</>
		) : null,
		skills: data.skills.length > 0 ? (
			<>
				<SectionTitle accent={accent}>Skills</SectionTitle>
				<SkillsBlock data={data} accent={accent} />
			</>
		) : null,
		projects: data.projects.length > 0 ? (
			<>
				<SectionTitle accent={accent}>Projects</SectionTitle>
				{data.projects.map((pr) => (
					<div key={pr.id} className="mb-1.5">
						<span className="font-bold text-[calc(12px_*_var(--rz-fs))]">{pr.name}</span>
						<span className="text-[calc(11px_*_var(--rz-fs))] opacity-80"> — {pr.description}</span>
					</div>
				))}
			</>
		) : null,
	};
	const gaps = data.style?.sectionGaps ?? {};
	return resolveSectionOrder(data)
		.filter((k) => allowed.includes(k))
		.map((k) => {
			const g = gaps[k];
			const style = g ? ({ '--rz-gap': `${SPACING_GAP[g]}px` } as CSSProperties) : undefined;
			return (
				<div key={k} style={style}>
					{blocks[k]}
				</div>
			);
		});
}

function TwoColumn({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	return (
		<div className="bg-white text-[#111c2d] w-full h-full flex" style={{ fontFamily }}>
			<aside className="w-1/3 p-5 text-white" style={{ background: accent }}>
				<div className="text-center">
					{p.photo && (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={p.photo}
							alt=""
							className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2 border-white/50"
						/>
					)}
					<h1 className="text-[calc(18px_*_var(--rz-fs))] font-extrabold leading-tight">{p.fullName || 'Your Name'}</h1>
					<div className="text-[calc(11px_*_var(--rz-fs))] opacity-90 font-semibold">{p.title}</div>
				</div>

				<div className="mt-5">
					<h2 className="text-[calc(11px_*_var(--rz-fs))] font-bold uppercase tracking-wide opacity-90">Contact</h2>
					<div className="mt-1 space-y-0.5 text-[calc(10.5px_*_var(--rz-fs))] opacity-90 break-words">
						{[p.email, p.phone, p.location, ...p.links.map((l) => l.url)]
							.filter(Boolean)
							.map((c, i) => (
								<div key={i}>{c}</div>
							))}
					</div>
				</div>

				{data.skills.length > 0 && (
					<div className="mt-4">
						<h2 className="text-[calc(11px_*_var(--rz-fs))] font-bold uppercase tracking-wide opacity-90">Skills</h2>
						<div className="mt-1.5">
							<SkillsBlock data={data} accent={accent} light />
						</div>
					</div>
				)}

				{data.education.length > 0 && (
					<div className="mt-4">
						<h2 className="text-[calc(11px_*_var(--rz-fs))] font-bold uppercase tracking-wide opacity-90">Education</h2>
						<div className="mt-1 space-y-1.5">
							{data.education.map((e) => (
								<div key={e.id} className="text-[calc(10.5px_*_var(--rz-fs))] opacity-90">
									<div className="font-bold">{e.degree}</div>
									<div>{e.school}</div>
									<div className="opacity-80">{dateRange(e.start, e.end, false)}</div>
								</div>
							))}
						</div>
					</div>
				)}
			</aside>

			<main className="flex-1" style={{ padding: 'var(--rz-pad, 32px)' }}>
				{orderedCoreBlocks(data, accent, ['summary', 'experience', 'projects'])}
				<CustomBlocks data={data} accent={accent} />
			</main>
		</div>
	);
}

function SidebarHeading({ children, accent }: { children: ReactNode; accent: string }) {
	return (
		<h2 className="text-[calc(11px_*_var(--rz-fs))] font-bold uppercase tracking-wide mb-1.5" style={{ color: accent }}>
			{children}
			<span className="block mt-0.5 h-[2px] w-6" style={{ background: accent }} />
		</h2>
	);
}

/* Oslo-style: colored header band with centered photo + name, single column body */
function HeaderBand({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily }}>
			<div style={{ background: accent }} className="text-white px-8 py-7 text-center">
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2 border-white/50" />
				)}
				<h1 className="text-[calc(24px_*_var(--rz-fs))] font-extrabold leading-tight">{p.fullName || 'Your Name'}</h1>
				<div className="text-[calc(11px_*_var(--rz-fs))] tracking-[0.2em] uppercase opacity-90 mt-0.5">{p.title}</div>
				{contact.length > 0 && (
					<div className="mt-2 text-[calc(10.5px_*_var(--rz-fs))] opacity-90">{contact.join('     •     ')}</div>
				)}
			</div>
			<div style={{ padding: 'var(--rz-pad, 32px)' }}>
				{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'skills', 'projects'])}
				<CustomBlocks data={data} accent={accent} />
			</div>
		</div>
	);
}

/* Berlin/Amsterdam-style: big name, then a plain left sidebar (info, skill bars,
   education) + main content column */
function SidebarLeft({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header>
				<h1 className="text-[calc(26px_*_var(--rz-fs))] font-extrabold uppercase leading-none tracking-tight" style={{ color: accent }}>
					{p.fullName || 'Your Name'}
				</h1>
				<div className="text-[calc(13px_*_var(--rz-fs))] font-semibold opacity-80 mt-1">{p.title}</div>
			</header>
			<div className="h-px w-full my-4" style={{ background: `${accent}40` }} />
			<div className="flex gap-7">
				<aside className="w-[34%] shrink-0 space-y-4">
					{contact.length > 0 && (
						<div>
							<SidebarHeading accent={accent}>Info</SidebarHeading>
							<div className="space-y-1 text-[calc(10.5px_*_var(--rz-fs))] break-words">
								{contact.map((c, i) => (
									<div key={i}>{c}</div>
								))}
							</div>
						</div>
					)}
					{data.skills.length > 0 && (
						<div>
							<SidebarHeading accent={accent}>Skills</SidebarHeading>
							<div className="space-y-1.5">
								{data.skills.map((s, i) => (
									<div key={i}>
										<div className="text-[calc(10.5px_*_var(--rz-fs))] mb-0.5">{s}</div>
										<div className="h-1 rounded-full bg-black/10">
											<div className="h-1 rounded-full" style={{ width: `${72 + (i % 3) * 9}%`, background: accent }} />
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					{data.education.length > 0 && (
						<div>
							<SidebarHeading accent={accent}>Education</SidebarHeading>
							{data.education.map((e) => (
								<div key={e.id} className="text-[calc(10.5px_*_var(--rz-fs))] mb-1.5">
									<div className="font-bold">{e.degree}</div>
									<div className="opacity-80">{e.school}</div>
									<div className="opacity-70 font-[family-name:var(--font-mono)]">{[e.start, e.end].filter(Boolean).join(' – ')}</div>
								</div>
							))}
						</div>
					)}
				</aside>
				<main className="flex-1">
					{orderedCoreBlocks(data, accent, ['summary', 'experience', 'projects'])}
					<CustomBlocks data={data} accent={accent} />
				</main>
			</div>
		</div>
	);
}

/* Paris/Lisbon-style: big name + photo, main content left, details/skills right */
function SidebarRight({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-[calc(26px_*_var(--rz-fs))] font-extrabold leading-none" style={{ color: accent }}>
						{p.fullName || 'Your Name'}
					</h1>
					<div className="text-[calc(14px_*_var(--rz-fs))] font-bold mt-1" style={{ color: accent }}>
						{p.title}
					</div>
				</div>
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-16 h-16 rounded-full object-cover shrink-0" />
				)}
			</header>
			<div className="h-px w-full my-4" style={{ background: `${accent}30` }} />
			<div className="flex gap-7">
				<main className="flex-1">
					{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'projects'])}
				</main>
				<aside className="w-[32%] shrink-0 space-y-4">
					{contact.length > 0 && (
						<div>
							<SidebarHeading accent={accent}>Details</SidebarHeading>
							<div className="space-y-0.5 text-[calc(10.5px_*_var(--rz-fs))] break-words">
								{contact.map((c, i) => (
									<div key={i}>{c}</div>
								))}
							</div>
						</div>
					)}
					{data.skills.length > 0 && (
						<div>
							<SidebarHeading accent={accent}>Skills</SidebarHeading>
							<div className="space-y-1.5">
								{data.skills.map((s, i) => (
									<div key={i}>
										<div className="text-[calc(10.5px_*_var(--rz-fs))] mb-0.5">{s}</div>
										<div className="h-1 rounded-full bg-black/10">
											<div className="h-1 rounded-full" style={{ width: `${72 + (i % 3) * 9}%`, background: accent }} />
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					<CustomBlocks data={data} accent={accent} />
				</aside>
			</div>
		</div>
	);
}

/* London/Milan-style: centered name, each section labelled down the left margin */
function LabelLeft({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	const Row = ({ label, children }: { label: string; children: ReactNode }) => (
		<div className="flex gap-5 py-2.5 border-t border-black/10">
			<div className="w-24 shrink-0 label-caps pt-0.5" style={{ color: accent }}>
				{label}
			</div>
			<div className="flex-1">{children}</div>
		</div>
	);
	const customs = (data.sections ?? []).filter((s) => s.items.some((it) => it.primary || it.secondary));
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="text-center mb-4">
				<h1 className="text-[calc(24px_*_var(--rz-fs))] font-extrabold" style={{ color: accent }}>
					{p.fullName || 'Your Name'}
					{p.title ? `, ${p.title}` : ''}
				</h1>
				{contact.length > 0 && (
					<div className="text-[calc(10.5px_*_var(--rz-fs))] opacity-80 mt-1">{contact.join('     •     ')}</div>
				)}
			</header>
			{p.summary && (
				<Row label="Profile">
					<p className="text-[calc(11.5px_*_var(--rz-fs))] leading-snug">{p.summary}</p>
				</Row>
			)}
			{data.experience.length > 0 && (
				<Row label="Experience">
					<ExperienceBlock data={data} />
				</Row>
			)}
			{data.education.length > 0 && (
				<Row label="Education">
					<EducationBlock data={data} />
				</Row>
			)}
			{data.skills.length > 0 && (
				<Row label="Skills">
					<SkillsBlock data={data} accent={accent} />
				</Row>
			)}
			{customs.map((sec) => (
				<Row key={sec.id} label={sec.heading}>
					<div className="space-y-0.5">
						{sec.items
							.filter((it) => it.primary || it.secondary)
							.map((it) => (
								<div key={it.id} className="text-[calc(11px_*_var(--rz-fs))]">
									<span className="font-semibold">{it.primary}</span>
									{it.secondary && (
										<span style={sec.type === 'links' ? { color: accent } : { opacity: 0.72 }}>
											{' — '}
											{it.secondary}
										</span>
									)}
								</div>
							))}
					</div>
				</Row>
			))}
		</div>
	);
}
