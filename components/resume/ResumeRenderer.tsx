import type { CSSProperties, ReactNode } from 'react';
import {
	FONT_FAMILY,
	languageDots,
	marginPad,
	resolveSectionOrder,
	SECTION_META,
	skillLevelFor,
	spacingGap,
	SPACING_GAP,
	textScale,
	type CoreSectionKey,
	type ResumeData,
} from '@/lib/types';
import { getTemplate } from '@/lib/templates/registry';

// Renders a resume document from data + template. Used for live preview and
// PDF export. Always at least one full A4 sheet (794x1123px @96dpi); grows
// taller when the content overflows onto more pages.

/** A4 height in CSS px at 96dpi (matches the 794px width the app renders at). */
export const A4_HEIGHT_PX = 1123;

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
		) : layout === 'tintRail' ? (
			<TintRail data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'dashCenter' ? (
			<DashCenter data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'darkFrame' ? (
			<DarkFrame data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'labelBox' ? (
			<LabelBox data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'bandCenter' ? (
			<BandCenter data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'editorial' ? (
			<Editorial data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'numberedMono' ? (
			<NumberedMono data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'colorRight' ? (
			<ColorRight data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'blobs' ? (
			<Blobs data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'monogramBand' ? (
			<MonogramBand data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'europass' ? (
			<Europass data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'boldBars' ? (
			<BoldBars data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'kicker' ? (
			<Kicker data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'photoRight' ? (
			<PhotoRight data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'centerSplit' ? (
			<CenterSplit data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'panelRight' ? (
			<PanelRight data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'boxedTable' ? (
			<BoxedTable data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'ruledBands' ? (
			<RuledBands data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'fullColor' ? (
			<FullColor data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'railCards' ? (
			<RailCards data={data} accent={accent} fontFamily={fontFamily} />
		) : layout === 'softBand' ? (
			<SoftBand data={data} accent={accent} fontFamily={fontFamily} />
		) : (
			<SingleColumn data={data} accent={accent} fontFamily={fontFamily} academic={layout === 'academic'} />
		);

	// A single-track grid stretches the layout to fill at least one full A4
	// sheet (colored sidebars/bands run the whole page), growing with content.
	return (
		<div
			className="w-full grid"
			style={{ ...vars, gridTemplateRows: `minmax(${A4_HEIGHT_PX}px, auto)` }}
		>
			{inner}
		</div>
	);
}

function Contact({ data }: { data: ResumeData }) {
	const p = data.personal;
	const items = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return <p className="text-[calc(11px_*_var(--rz-fs))] opacity-80">{items.join('  •  ')}</p>;
}

type TitleVariant = 'underline' | 'double' | 'band' | 'dash' | 'box';

function SectionTitle({
	children,
	accent,
	variant = 'underline',
}: {
	children: ReactNode;
	accent: string;
	variant?: TitleVariant;
}) {
	if (variant === 'dash') {
		return (
			<h2
				className="text-[calc(12px_*_var(--rz-fs))] font-bold uppercase tracking-[0.2em] text-center mb-2 flex items-center justify-center gap-3"
				style={{ color: accent, marginTop: 'var(--rz-gap, 16px)' }}
			>
				<span className="w-6 h-px" style={{ background: accent }} />
				{children}
				<span className="w-6 h-px" style={{ background: accent }} />
			</h2>
		);
	}
	if (variant === 'box') {
		return (
			<h2 className="mb-2" style={{ marginTop: 'var(--rz-gap, 16px)' }}>
				<span
					className="inline-block text-white text-[calc(11.5px_*_var(--rz-fs))] font-bold uppercase tracking-wide px-2.5 py-1"
					style={{ background: accent }}
				>
					{children}
				</span>
			</h2>
		);
	}
	if (variant === 'double') {
		return (
			<h2
				className="text-[calc(12px_*_var(--rz-fs))] font-bold uppercase tracking-wider mb-1.5 py-1 border-t-2 border-b"
				style={{ color: accent, borderColor: accent, marginTop: 'var(--rz-gap, 16px)' }}
			>
				{children}
			</h2>
		);
	}
	if (variant === 'band') {
		return (
			<h2
				className="text-[calc(11.5px_*_var(--rz-fs))] font-bold uppercase tracking-[0.1em] text-center mb-2 py-1 bg-black/10 border-y border-black/60"
				style={{ marginTop: 'var(--rz-gap, 16px)' }}
			>
				{children}
			</h2>
		);
	}
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

/** Whether skill level bars/dots are shown (user-controlled, default on). */
function showLevels(data: ResumeData): boolean {
	return data.style?.showSkillLevels !== false;
}

/* Two-column skill grid with accent underline bars (resume.io "Stockholm" look). */
function SkillGrid({ data, accent }: { data: ResumeData; accent: string }) {
	if (data.skills.length === 0) return null;
	const levels = showLevels(data);
	return (
		<div className="grid grid-cols-2 gap-x-8 gap-y-2">
			{data.skills.map((s, i) => (
				<div key={i}>
					<div className="text-[calc(11px_*_var(--rz-fs))]">{s}</div>
					{levels && (
						<div className="mt-1 h-[3px] bg-black/10">
							<div
								className="h-[3px]"
								style={{ width: `${skillLevelFor(data, s) * 20}%`, background: accent }}
							/>
						</div>
					)}
				</div>
			))}
		</div>
	);
}

/* Stacked skill bars for narrow sidebars. `light` renders white-on-accent. */
function SkillBars({ data, accent, light }: { data: ResumeData; accent: string; light?: boolean }) {
	if (data.skills.length === 0) return null;
	const levels = showLevels(data);
	return (
		<div className="space-y-1.5">
			{data.skills.map((s, i) => (
				<div key={i}>
					<div className={`text-[calc(10.5px_*_var(--rz-fs))] mb-0.5 ${light ? 'opacity-95' : ''}`}>{s}</div>
					{levels && (
						<div className={`h-[3px] ${light ? 'bg-white/25' : 'bg-black/10'}`}>
							<div
								className="h-[3px]"
								style={{ width: `${skillLevelFor(data, s) * 20}%`, background: light ? '#fff' : accent }}
							/>
						</div>
					)}
				</div>
			))}
		</div>
	);
}

/* Dot-rated skills (resume.io "Milan" look). Filled dots = the user's level. */
function SkillDots({ data, accent }: { data: ResumeData; accent: string }) {
	if (data.skills.length === 0) return null;
	const levels = showLevels(data);
	return (
		<div className="space-y-1.5">
			{data.skills.map((s, i) => (
				<div key={i}>
					<div className="text-[calc(10.5px_*_var(--rz-fs))] mb-0.5">{s}</div>
					{levels && <DotRow filled={skillLevelFor(data, s)} accent={accent} />}
				</div>
			))}
		</div>
	);
}

function DotRow({ filled, accent }: { filled: number; accent: string }) {
	return (
		<div className="flex gap-1">
			{Array.from({ length: 5 }).map((_, d) => (
				<span
					key={d}
					className="w-[7px] h-[7px] rounded-full"
					style={{ background: d < filled ? accent : 'rgba(0,0,0,0.15)' }}
				/>
			))}
		</div>
	);
}

/* Inline proficiency dots after a recognised language level (e.g. "Fluent"). */
function LangDots({ text, accent }: { text: string; accent: string }) {
	const filled = languageDots(text);
	if (filled == null) return null;
	return (
		<span className="inline-flex gap-[3px] ml-1.5">
			{Array.from({ length: 5 }).map((_, d) => (
				<span
					key={d}
					className="w-[6px] h-[6px] rounded-full inline-block"
					style={{ background: d < filled ? accent : 'rgba(0,0,0,0.15)' }}
				/>
			))}
		</span>
	);
}

function CustomBlocks({ data, accent, variant }: { data: ResumeData; accent: string; variant?: TitleVariant }) {
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
						<SectionTitle accent={accent} variant={variant}>{sec.heading}</SectionTitle>
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
										{sec.type === 'languages' && it.secondary && <LangDots text={it.secondary} accent={accent} />}
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
											<span className="whitespace-nowrap flex items-center" style={secStyle}>
												{it.secondary}
												{sec.type === 'languages' && <LangDots text={it.secondary} accent={accent} />}
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
										{sec.type === 'languages' && it.secondary && <LangDots text={it.secondary} accent={accent} />}
									</li>
								))}
							</ul>
						) : (
							<div className="space-y-1">
								{items.map((it) => (
									<div key={it.id}>
										<div className="text-[calc(11.5px_*_var(--rz-fs))] font-semibold">{it.primary}</div>
										{it.secondary && (
											<div className="text-[calc(10.5px_*_var(--rz-fs))] flex items-center" style={secStyle}>
												{it.secondary}
												{sec.type === 'languages' && <LangDots text={it.secondary} accent={accent} />}
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

/** Projects with actual content — an empty just-added card doesn't render. */
function filledProjects(data: ResumeData) {
	return data.projects.filter(
		(pr) => pr.name || pr.description || (pr.bullets ?? []).some(Boolean),
	);
}

/* Full project entries: name + link, dates right, role · tech, description,
   highlight bullets. Shared by every layout so no field silently drops. */
function ProjectsBlock({ data, accent }: { data: ResumeData; accent: string }) {
	return (
		<>
			{filledProjects(data).map((pr) => {
				const dates = [pr.start, pr.end].filter(Boolean).join(' – ');
				const bullets = (pr.bullets ?? []).filter(Boolean);
				return (
					<div key={pr.id} className="mb-2.5">
						<div className="flex justify-between items-baseline gap-2">
							<span className="text-[calc(12px_*_var(--rz-fs))]">
								<span className="font-bold">{pr.name || 'Project'}</span>
								{pr.link && (
									<a
										href={pr.link.startsWith('http') ? pr.link : `https://${pr.link}`}
										className="font-normal text-[calc(10.5px_*_var(--rz-fs))] ml-2 break-all"
										style={{ color: accent }}
									>
										{pr.link.replace(/^https?:\/\//, '')}
									</a>
								)}
							</span>
							{dates && (
								<span className="text-[calc(10.5px_*_var(--rz-fs))] opacity-70 whitespace-nowrap font-[family-name:var(--font-mono)]">
									{dates}
								</span>
							)}
						</div>
						{(pr.role || pr.tech) && (
							<div className="text-[calc(11px_*_var(--rz-fs))]">
								{pr.role && <span className="opacity-80">{pr.role}</span>}
								{pr.role && pr.tech && <span className="opacity-40"> · </span>}
								{pr.tech && (
									<span className="font-medium" style={{ color: accent }}>
										{pr.tech}
									</span>
								)}
							</div>
						)}
						{pr.description && (
							<p className="text-[calc(11px_*_var(--rz-fs))] opacity-90 leading-snug">{pr.description}</p>
						)}
						{bullets.length > 0 && (
							<ul className="mt-0.5 list-disc pl-4 space-y-0.5">
								{bullets.map((b, i) => (
									<li key={i} className="text-[calc(11px_*_var(--rz-fs))] leading-snug">
										{b}
									</li>
								))}
							</ul>
						)}
					</div>
				);
			})}
		</>
	);
}

/** Renders the requested core sections in the user's chosen order. */
function orderedCoreBlocks(data: ResumeData, accent: string, allowed: CoreSectionKey[], variant?: TitleVariant) {
	const p = data.personal;
	const blocks: Record<CoreSectionKey, ReactNode> = {
		summary: p.summary ? (
			<>
				<SectionTitle accent={accent} variant={variant}>Summary</SectionTitle>
				<p className="text-[calc(11.5px_*_var(--rz-fs))] leading-snug">{p.summary}</p>
			</>
		) : null,
		experience: data.experience.length > 0 ? (
			<>
				<SectionTitle accent={accent} variant={variant}>Experience</SectionTitle>
				<ExperienceBlock data={data} />
			</>
		) : null,
		education: data.education.length > 0 ? (
			<>
				<SectionTitle accent={accent} variant={variant}>Education</SectionTitle>
				<EducationBlock data={data} />
			</>
		) : null,
		skills: data.skills.length > 0 ? (
			<>
				<SectionTitle accent={accent} variant={variant}>Skills</SectionTitle>
				<SkillGrid data={data} accent={accent} />
			</>
		) : null,
		projects: filledProjects(data).length > 0 ? (
			<>
				<SectionTitle accent={accent} variant={variant}>Projects</SectionTitle>
				<ProjectsBlock data={data} accent={accent} />
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
							<SkillBars data={data} accent={accent} light />
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
			{/* Madrid-style band: square photo left, caps name, contact right */}
			<div style={{ background: accent }} className="text-white flex items-center gap-5 px-8 py-6">
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-20 h-20 rounded-md object-cover shrink-0" />
				)}
				<div className="flex-1 min-w-0">
					<h1 className="text-[calc(25px_*_var(--rz-fs))] font-extrabold uppercase leading-none tracking-tight">
						{p.fullName || 'Your Name'}
					</h1>
					<div className="text-[calc(11px_*_var(--rz-fs))] tracking-[0.18em] uppercase opacity-90 mt-1.5">{p.title}</div>
				</div>
				{contact.length > 0 && (
					<div className="text-right text-[calc(10px_*_var(--rz-fs))] opacity-90 space-y-0.5 shrink-0 max-w-[38%]">
						{contact.map((c, i) => (
							<div key={i} className="truncate">
								{c}
							</div>
						))}
					</div>
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
					{p.photo && (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={p.photo} alt="" className="w-24 h-24 rounded-full object-cover" />
					)}
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
							<SkillDots data={data} accent={accent} />
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
			{/* Stockholm-style header: small rounded-square photo beside a dark name */}
			<header className="flex items-center gap-4">
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
				)}
				<div>
					<h1 className="text-[calc(26px_*_var(--rz-fs))] font-extrabold leading-none">
						{p.fullName || 'Your Name'}
					</h1>
					<div className="text-[calc(12px_*_var(--rz-fs))] opacity-70 mt-1">{p.title}</div>
				</div>
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
							<SkillBars data={data} accent={accent} />
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
					<SkillGrid data={data} accent={accent} />
				</Row>
			)}
			{filledProjects(data).length > 0 && (
				<Row label="Projects">
					<ProjectsBlock data={data} accent={accent} />
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

/* Geneva-style: the entire page in the accent color with white type */
function FullColor({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div className="w-full h-full text-white" style={{ background: accent, fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="flex items-center gap-5">
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-[72px] h-[72px] rounded-sm object-cover shrink-0 border border-white/30" />
				)}
				<div className="flex-1 min-w-0">
					<h1 className="text-[calc(25px_*_var(--rz-fs))] font-extrabold leading-tight">{p.fullName || 'Your Name'}</h1>
					<div className="text-[calc(12px_*_var(--rz-fs))] opacity-90 mt-0.5">{p.title}</div>
				</div>
				{contact.length > 0 && (
					<div className="text-right text-[calc(10px_*_var(--rz-fs))] opacity-90 space-y-0.5 shrink-0 max-w-[38%]">
						{contact.map((c, i) => (
							<div key={i} className="truncate">
								{c}
							</div>
						))}
					</div>
				)}
			</header>
			<div className="h-px w-full mt-4 bg-white/30" />
			{orderedCoreBlocks(data, '#ffffff', ['summary', 'experience', 'education', 'skills', 'projects'])}
			<CustomBlocks data={data} accent="#ffffff" />
		</div>
	);
}

/* Toronto-style: grey card sections, highlighted job titles, right card rail */
function RailCards({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	const Card = ({ title, children }: { title: string; children: ReactNode }) => (
		<div className="rounded-xl bg-black/[0.05] p-4" style={{ marginTop: 'var(--rz-gap, 16px)' }}>
			<h2 className="text-[calc(14px_*_var(--rz-fs))] font-extrabold mb-1.5">{title}</h2>
			{children}
		</div>
	);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="flex items-center gap-4">
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-16 h-16 object-cover shrink-0 rounded-sm" style={{ background: accent }} />
				)}
				<div className="min-w-0">
					<h1 className="text-[calc(28px_*_var(--rz-fs))] font-extrabold leading-none tracking-tight">
						{p.fullName || 'Your Name'}
					</h1>
					<div className="text-[calc(12px_*_var(--rz-fs))] font-semibold mt-1" style={{ color: accent }}>
						{p.title}
					</div>
				</div>
			</header>
			<div className="flex gap-6 mt-2">
				<main className="flex-1 min-w-0">
					{p.summary && (
						<Card title="Profile">
							<p className="text-[calc(11px_*_var(--rz-fs))] leading-snug">{p.summary}</p>
						</Card>
					)}
					{data.experience.length > 0 && (
						<div style={{ marginTop: 'var(--rz-gap, 16px)' }}>
							<h2 className="text-[calc(16px_*_var(--rz-fs))] font-extrabold mb-2">Employment History</h2>
							{data.experience.map((e) => (
								<div key={e.id} className="mb-3">
									<span className="inline-block text-white font-bold text-[calc(11.5px_*_var(--rz-fs))] px-1.5 py-0.5 bg-[#16181d]">
										{[e.role || 'Role', e.company].filter(Boolean).join(' at ')}
									</span>
									<div className="text-[calc(10.5px_*_var(--rz-fs))] opacity-70 mt-0.5 font-[family-name:var(--font-mono)]">
										{[e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ')}
									</div>
									<ul className="mt-1 list-disc pl-4 space-y-0.5">
										{e.bullets.filter(Boolean).map((b, i) => (
											<li key={i} className="text-[calc(11px_*_var(--rz-fs))] leading-snug">
												{b}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					)}
					{data.education.length > 0 && (
						<div style={{ marginTop: 'var(--rz-gap, 16px)' }}>
							<h2 className="text-[calc(16px_*_var(--rz-fs))] font-extrabold mb-2">Education</h2>
							<EducationBlock data={data} />
						</div>
					)}
					{filledProjects(data).length > 0 && (
						<div style={{ marginTop: 'var(--rz-gap, 16px)' }}>
							<h2 className="text-[calc(16px_*_var(--rz-fs))] font-extrabold mb-2">Projects</h2>
							<ProjectsBlock data={data} accent={accent} />
						</div>
					)}
				</main>
				<aside className="w-[34%] shrink-0">
					{contact.length > 0 && (
						<Card title="Details">
							<div className="space-y-0.5 text-[calc(10px_*_var(--rz-fs))] break-words">
								{contact.map((c, i) => (
									<div key={i}>{c}</div>
								))}
							</div>
						</Card>
					)}
					{data.skills.length > 0 && (
						<Card title="Skills">
							<SkillBars data={data} accent={accent} />
						</Card>
					)}
					{(data.sections ?? [])
						.filter((s) => s.items.some((it) => it.primary || it.secondary))
						.map((sec) => (
							<Card key={sec.id} title={sec.heading}>
								<div className="space-y-1">
									{sec.items
										.filter((it) => it.primary || it.secondary)
										.map((it) => (
											<div key={it.id} className="text-[calc(10.5px_*_var(--rz-fs))]">
												<span className="font-semibold">{it.primary}</span>
												{it.secondary && (
													<span
														className="ml-1"
														style={sec.type === 'links' ? { color: accent } : { opacity: 0.72 }}
													>
														{it.secondary}
													</span>
												)}
												{sec.type === 'languages' && it.secondary && <LangDots text={it.secondary} accent={accent} />}
											</div>
										))}
								</div>
							</Card>
						))}
				</aside>
			</div>
		</div>
	);
}

/* Copenhagen-style: soft tinted intro panel with a big statement, plain body */
function SoftBand({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	return (
		<div className="bg-white text-[#111c2d] w-full h-full flex flex-col" style={{ fontFamily }}>
			<div style={{ background: `${accent}14`, padding: 'var(--rz-pad, 32px)' }}>
				<div className="flex items-start justify-between gap-5">
					<div className="flex items-center gap-4 min-w-0">
						{p.photo && (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={p.photo} alt="" className="w-16 h-16 rounded-sm object-cover shrink-0" />
						)}
						<div className="min-w-0">
							<h1 className="text-[calc(17px_*_var(--rz-fs))] font-extrabold tracking-wide uppercase">
								{p.fullName || 'Your Name'}
							</h1>
							<div className="text-[calc(11px_*_var(--rz-fs))] font-semibold opacity-80 mt-0.5">{p.title}</div>
							{p.location && (
								<div className="text-[calc(10px_*_var(--rz-fs))] opacity-70 mt-1 pt-1 border-t border-black/20">
									{p.location}
								</div>
							)}
						</div>
					</div>
					<div className="text-right text-[calc(10.5px_*_var(--rz-fs))] font-semibold space-y-0.5 shrink-0">
						{[p.email, p.phone, ...p.links.map((l) => l.url)].filter(Boolean).map((c, i) => (
							<div key={i}>{c}</div>
						))}
					</div>
				</div>
				{p.summary && (
					<p className="mt-5 text-[calc(16px_*_var(--rz-fs))] leading-snug font-medium">{p.summary}</p>
				)}
				{data.skills.length > 0 && (
					<div className="mt-5">
						<div className="label-caps mb-2 opacity-70">Skills</div>
						<div className="grid grid-cols-3 gap-x-6 gap-y-1.5">
							{data.skills.map((s, i) => (
								<div key={i} className="text-[calc(10.5px_*_var(--rz-fs))] flex items-baseline gap-2">
									<span className="w-3 h-[2px] shrink-0 -translate-y-[3px]" style={{ background: accent }} />
									{s}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
			<div className="flex-1" style={{ padding: 'var(--rz-pad, 32px)', paddingTop: 8 }}>
				{orderedCoreBlocks(data, accent, ['experience', 'education', 'projects'])}
				<CustomBlocks data={data} accent={accent} />
			</div>
		</div>
	);
}

/* Helsinki-style: single column, photo top-right, double-ruled headings */
function PhotoRight({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.location, p.phone, p.email, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="flex items-start justify-between gap-6">
				<div className="min-w-0">
					<h1 className="text-[calc(26px_*_var(--rz-fs))] font-extrabold uppercase leading-tight" style={{ color: accent }}>
						{p.fullName || 'Your Name'}
					</h1>
					<div className="text-[calc(13px_*_var(--rz-fs))] font-bold uppercase tracking-wide mt-0.5">{p.title}</div>
					{contact.length > 0 && (
						<div className="text-[calc(10.5px_*_var(--rz-fs))] opacity-80 mt-1.5">{contact.join(' | ')}</div>
					)}
				</div>
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-20 h-20 rounded-sm object-cover shrink-0" />
				)}
			</header>
			{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'skills', 'projects'], 'double')}
			<CustomBlocks data={data} accent={accent} variant="double" />
		</div>
	);
}

/* New York-style: centered photo + name header over a two-column body */
function CenterSplit({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	const RailHeading = ({ children }: { children: ReactNode }) => (
		<h2 className="text-[calc(11px_*_var(--rz-fs))] font-bold uppercase tracking-[0.15em] text-center mb-2" style={{ color: accent }}>
			⊙ {children} ⊙
		</h2>
	);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="text-center">
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-16 h-16 rounded-sm object-cover mx-auto mb-2" />
				)}
				<h1 className="text-[calc(24px_*_var(--rz-fs))] font-extrabold uppercase tracking-[0.08em] leading-tight">
					{p.fullName || 'Your Name'}
				</h1>
				{(p.title || p.location || p.phone) && (
					<div className="text-[calc(10px_*_var(--rz-fs))] uppercase tracking-[0.15em] opacity-70 mt-1">
						{[p.title, p.location, p.phone].filter(Boolean).join('   |   ')}
					</div>
				)}
			</header>
			<div className="flex gap-8 mt-6">
				<aside className="w-[30%] shrink-0 space-y-5 text-center">
					{contact.length > 0 && (
						<div>
							<RailHeading>Details</RailHeading>
							<div className="space-y-1 text-[calc(10px_*_var(--rz-fs))] break-words">
								{contact.map((c, i) => (
									<div key={i}>{c}</div>
								))}
							</div>
						</div>
					)}
					{data.skills.length > 0 && (
						<div>
							<RailHeading>Skills</RailHeading>
							<div className="space-y-2.5">
								{data.skills.map((s, i) => (
									<div key={i}>
										<div className="text-[calc(10.5px_*_var(--rz-fs))] mb-1">{s}</div>
										<div
											className="h-[2px] mx-auto"
											style={{
												width: showLevels(data) ? `${skillLevelFor(data, s) * 20}%` : '100%',
												background: accent,
											}}
										/>
									</div>
								))}
							</div>
						</div>
					)}
					{(data.sections ?? [])
						.filter((s) => s.items.some((it) => it.primary || it.secondary))
						.map((sec) => (
							<div key={sec.id}>
								<RailHeading>{sec.heading}</RailHeading>
								<div className="space-y-2.5 text-[calc(10.5px_*_var(--rz-fs))]">
									{sec.items
										.filter((it) => it.primary || it.secondary)
										.map((it) => (
											<div key={it.id}>
												<div>
													<span className="font-semibold">{it.primary}</span>
													{sec.type !== 'languages' && it.secondary && (
														<span className="opacity-70"> — {it.secondary}</span>
													)}
												</div>
												{sec.type === 'languages' ? (
													<div
														className="h-[2px] mx-auto mt-1"
														style={{
															width: `${(languageDots(it.secondary) ?? 5) * 20}%`,
															background: accent,
														}}
													/>
												) : null}
											</div>
										))}
								</div>
							</div>
						))}
				</aside>
				<main className="flex-1 min-w-0">
					{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'projects'])}
				</main>
			</div>
		</div>
	);
}

/* Stockholm-style: white header, tinted right panel with progress-bar skills */
function PanelRight({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	const pad = 'var(--rz-pad, 32px)';
	return (
		<div className="bg-white text-[#111c2d] w-full h-full flex flex-col" style={{ fontFamily }}>
			<header className="flex items-center gap-4 border-b border-black/10" style={{ padding: pad, paddingTop: 24, paddingBottom: 18 }}>
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
				)}
				<div className="min-w-0">
					<h1 className="text-[calc(24px_*_var(--rz-fs))] font-extrabold leading-none">{p.fullName || 'Your Name'}</h1>
					<div className="text-[calc(11.5px_*_var(--rz-fs))] opacity-70 mt-1">{p.title}</div>
				</div>
			</header>
			<div className="flex-1 flex items-stretch">
				<main className="flex-1 min-w-0" style={{ padding: pad, paddingTop: 8 }}>
					{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'projects'])}
				</main>
				<aside className="w-[30%] shrink-0 bg-black/[0.04]" style={{ padding: 20 }}>
					{contact.length > 0 && (
						<div className="mb-5">
							<h2 className="text-[calc(11px_*_var(--rz-fs))] font-extrabold mb-1.5">Details</h2>
							<div className="space-y-0.5 text-[calc(10px_*_var(--rz-fs))] break-words opacity-90">
								{contact.map((c, i) => (
									<div key={i}>{c}</div>
								))}
							</div>
						</div>
					)}
					{data.skills.length > 0 && (
						<div className="mb-5">
							<h2 className="text-[calc(11px_*_var(--rz-fs))] font-extrabold mb-1.5">Skills</h2>
							<SkillBars data={data} accent={accent} />
						</div>
					)}
					{(data.sections ?? [])
						.filter((s) => s.items.some((it) => it.primary || it.secondary))
						.map((sec) => (
							<div key={sec.id} className="mb-5">
								<h2 className="text-[calc(11px_*_var(--rz-fs))] font-extrabold mb-1.5">{sec.heading}</h2>
								<div className="space-y-1 text-[calc(10.5px_*_var(--rz-fs))]">
									{sec.items
										.filter((it) => it.primary || it.secondary)
										.map((it) => (
											<div key={it.id}>
												<span className="font-semibold">{it.primary}</span>
												{it.secondary && <span className="opacity-70"> {it.secondary}</span>}
												{sec.type === 'languages' && it.secondary && <LangDots text={it.secondary} accent={accent} />}
											</div>
										))}
								</div>
							</div>
						))}
				</aside>
			</div>
		</div>
	);
}

/* Tokyo-style: boxed sections with header bars and a dated work-history table */
function BoxedTable({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	const Bar = ({ children }: { children: ReactNode }) => (
		<div
			className="text-[calc(11.5px_*_var(--rz-fs))] font-bold px-3 py-1.5 bg-black/[0.06] border border-black/15"
			style={{ marginTop: 'var(--rz-gap, 16px)' }}
		>
			{children}
		</div>
	);
	const Box = ({ children }: { children: ReactNode }) => (
		<div className="border border-t-0 border-black/15 px-3 py-2.5">{children}</div>
	);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="flex items-end justify-between gap-4 pb-3 border-b-2" style={{ borderColor: accent }}>
				<div>
					<h1 className="text-[calc(22px_*_var(--rz-fs))] font-bold leading-tight">{p.fullName || 'Your Name'}</h1>
					<div className="text-[calc(11.5px_*_var(--rz-fs))] opacity-75">{p.title}</div>
				</div>
				{contact.length > 0 && (
					<div className="text-right text-[calc(9.5px_*_var(--rz-fs))] opacity-75 space-y-0.5">
						{contact.map((c, i) => (
							<div key={i}>{c}</div>
						))}
					</div>
				)}
			</header>
			{p.summary && (
				<>
					<Bar>Summary</Bar>
					<Box>
						<p className="text-[calc(11px_*_var(--rz-fs))] leading-snug">{p.summary}</p>
					</Box>
				</>
			)}
			{data.skills.length > 0 && (
				<>
					<Bar>Skills &amp; Expertise</Bar>
					<Box>
						<ul className="list-disc pl-4 grid grid-cols-2 gap-x-6 gap-y-0.5">
							{data.skills.map((s, i) => (
								<li key={i} className="text-[calc(10.5px_*_var(--rz-fs))]">
									{s}
								</li>
							))}
						</ul>
					</Box>
				</>
			)}
			{data.experience.length > 0 && (
				<>
					<Bar>Work History</Bar>
					{data.experience.map((e) => (
						<div key={e.id} className="flex border border-t-0 border-black/15">
							<div className="w-24 shrink-0 px-2 py-2.5 border-r border-black/15 text-[calc(9.5px_*_var(--rz-fs))] opacity-75">
								{[e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ')}
							</div>
							<div className="flex-1 px-3 py-2.5 min-w-0">
								<div className="font-bold text-[calc(11.5px_*_var(--rz-fs))]">{e.company || e.role}</div>
								{e.company && e.role && (
									<div className="text-[calc(10.5px_*_var(--rz-fs))] opacity-80">{e.role}</div>
								)}
								<ul className="mt-1 list-disc pl-4 space-y-0.5">
									{e.bullets.filter(Boolean).map((b, i) => (
										<li key={i} className="text-[calc(10.5px_*_var(--rz-fs))] leading-snug">
											{b}
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</>
			)}
			{data.education.length > 0 && (
				<>
					<Bar>Education</Bar>
					{data.education.map((e) => (
						<div key={e.id} className="flex border border-t-0 border-black/15">
							<div className="w-24 shrink-0 px-2 py-2.5 border-r border-black/15 text-[calc(9.5px_*_var(--rz-fs))] opacity-75">
								{[e.start, e.end].filter(Boolean).join(' – ')}
							</div>
							<div className="flex-1 px-3 py-2.5 min-w-0">
								<div className="font-bold text-[calc(11.5px_*_var(--rz-fs))]">{e.degree || 'Degree'}</div>
								<div className="text-[calc(10.5px_*_var(--rz-fs))] opacity-80">{e.school}</div>
								{e.details && <div className="text-[calc(10.5px_*_var(--rz-fs))] opacity-80">{e.details}</div>}
							</div>
						</div>
					))}
				</>
			)}
			{filledProjects(data).length > 0 && (
				<>
					<Bar>Projects</Bar>
					<Box>
						<ProjectsBlock data={data} accent={accent} />
					</Box>
				</>
			)}
			{(data.sections ?? [])
				.filter((s) => s.items.some((it) => it.primary || it.secondary))
				.map((sec) => (
					<div key={sec.id}>
						<Bar>{sec.heading}</Bar>
						<Box>
							<div className="space-y-0.5">
								{sec.items
									.filter((it) => it.primary || it.secondary)
									.map((it) => (
										<div key={it.id} className="text-[calc(10.5px_*_var(--rz-fs))]">
											<span className="font-semibold">{it.primary}</span>
											{it.secondary && <span className="opacity-75"> — {it.secondary}</span>}
										</div>
									))}
							</div>
						</Box>
					</div>
				))}
		</div>
	);
}

/* Santiago-style: centered serif name, grey section bands, diamond entries
   with dotted leader lines to right-aligned dates, italic descriptions */
function RuledBands({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const links = p.links.map((l) => l.url).filter(Boolean);
	const LeaderRow = ({ title, right }: { title: ReactNode; right: string }) => (
		<div className="flex items-baseline gap-2">
			<span className="font-bold text-[calc(11.5px_*_var(--rz-fs))] shrink-0">
				<span style={{ color: accent }}>❖ </span>
				{title}
			</span>
			<span className="flex-1 border-b border-dotted border-black/40 translate-y-[-3px]" />
			{right && <span className="text-[calc(9.5px_*_var(--rz-fs))] opacity-75 whitespace-nowrap shrink-0">{right}</span>}
		</div>
	);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="text-center">
				<h1 className="text-[calc(24px_*_var(--rz-fs))] font-bold leading-tight" style={{ color: accent }}>
					{p.fullName || 'Your Name'}
				</h1>
				<div className="text-[calc(12px_*_var(--rz-fs))] font-semibold opacity-85">{p.title}</div>
				{p.location && <div className="text-[calc(10px_*_var(--rz-fs))] opacity-75 mt-0.5">{p.location}</div>}
			</header>
			<div className="mt-3 border-t-2 border-black" />
			{(p.phone || p.email || links.length > 0) && (
				<div className="flex justify-between gap-4 py-1.5 text-[calc(10px_*_var(--rz-fs))] font-semibold">
					<span>{p.phone}</span>
					<span>{[p.email, ...links].filter(Boolean).join('  ·  ')}</span>
				</div>
			)}
			<div className="border-t border-black" />
			{p.summary && (
				<>
					<SectionTitle accent={accent} variant="band">Profile</SectionTitle>
					<p className="text-[calc(11px_*_var(--rz-fs))] italic leading-snug">{p.summary}</p>
				</>
			)}
			{data.experience.length > 0 && (
				<>
					<SectionTitle accent={accent} variant="band">Experience</SectionTitle>
					{data.experience.map((e) => (
						<div key={e.id} className="mb-3">
							<LeaderRow
								title={[e.role || 'Role', e.company].filter(Boolean).join(' - ')}
								right={[e.start, e.current ? 'Current' : e.end].filter(Boolean).join(' - ')}
							/>
							<ul className="mt-1 list-disc pl-5 space-y-0.5">
								{e.bullets.filter(Boolean).map((b, i) => (
									<li key={i} className="text-[calc(10.5px_*_var(--rz-fs))] italic leading-snug">
										{b}
									</li>
								))}
							</ul>
						</div>
					))}
				</>
			)}
			{data.education.length > 0 && (
				<>
					<SectionTitle accent={accent} variant="band">Education</SectionTitle>
					{data.education.map((e) => (
						<div key={e.id} className="mb-2.5">
							<LeaderRow
								title={[e.degree || 'Degree', e.school].filter(Boolean).join(', ')}
								right={[e.start, e.end].filter(Boolean).join(' - ')}
							/>
							{e.details && (
								<div className="text-[calc(10.5px_*_var(--rz-fs))] italic opacity-85 mt-0.5 pl-5">{e.details}</div>
							)}
						</div>
					))}
				</>
			)}
			{data.skills.length > 0 && (
				<>
					<SectionTitle accent={accent} variant="band">Skills</SectionTitle>
					<div className="grid grid-cols-2 gap-x-8 gap-y-1">
						{data.skills.map((s, i) => (
							<div key={i} className="text-[calc(10.5px_*_var(--rz-fs))]">
								<span style={{ color: accent }}>❖ </span>
								{s}
							</div>
						))}
					</div>
				</>
			)}
			{filledProjects(data).length > 0 && (
				<>
					<SectionTitle accent={accent} variant="band">Projects</SectionTitle>
					<ProjectsBlock data={data} accent={accent} />
				</>
			)}
			<CustomBlocks data={data} accent={accent} variant="band" />
		</div>
	);
}

/* Amsterdam-style: boxed name header over a grey-tinted left rail */
function TintRail({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="text-center">
				<div className="inline-block border-[3px] px-8 py-3" style={{ borderColor: accent }}>
					<h1 className="text-[calc(22px_*_var(--rz-fs))] font-extrabold uppercase tracking-wide leading-tight" style={{ color: accent }}>
						{p.fullName || 'Your Name'}
					</h1>
					<div className="text-[calc(10.5px_*_var(--rz-fs))] uppercase tracking-[0.2em] opacity-80 mt-0.5">{p.title}</div>
				</div>
			</header>
			<div className="flex gap-6 mt-5">
				<aside className="w-[30%] shrink-0 bg-black/[0.04] p-4 space-y-4">
					{contact.length > 0 && (
						<div>
							<SidebarHeading accent={accent}>Info</SidebarHeading>
							<div className="space-y-1 text-[calc(10px_*_var(--rz-fs))] break-words">
								{contact.map((c, i) => (
									<div key={i}>{c}</div>
								))}
							</div>
						</div>
					)}
					{data.skills.length > 0 && (
						<div>
							<SidebarHeading accent={accent}>Skills</SidebarHeading>
							<SkillDots data={data} accent={accent} />
						</div>
					)}
					{(data.sections ?? [])
						.filter((s) => s.items.some((it) => it.primary || it.secondary))
						.map((sec) => (
							<div key={sec.id}>
								<SidebarHeading accent={accent}>{sec.heading}</SidebarHeading>
								<div className="space-y-1 text-[calc(10px_*_var(--rz-fs))]">
									{sec.items
										.filter((it) => it.primary || it.secondary)
										.map((it) => (
											<div key={it.id}>
												<span className="font-semibold">{it.primary}</span>
												{it.secondary && <span className="opacity-70"> {it.secondary}</span>}
											</div>
										))}
								</div>
							</div>
						))}
				</aside>
				<main className="flex-1 min-w-0">
					{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'projects'])}
				</main>
			</div>
		</div>
	);
}

/* Annie Grey-style: framed name and dash-flanked centered headings */
function DashCenter({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="text-center">
				<div className="inline-block border px-10 py-3" style={{ borderColor: accent }}>
					<h1 className="text-[calc(22px_*_var(--rz-fs))] font-bold tracking-[0.12em] uppercase leading-tight">
						{p.fullName || 'Your Name'}
					</h1>
					<div className="text-[calc(10.5px_*_var(--rz-fs))] uppercase tracking-[0.25em] mt-1" style={{ color: accent }}>
						{p.title}
					</div>
				</div>
				{contact.length > 0 && (
					<div className="text-[calc(10px_*_var(--rz-fs))] opacity-75 mt-2">{contact.join('   ·   ')}</div>
				)}
			</header>
			{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'skills', 'projects'], 'dash')}
			<CustomBlocks data={data} accent={accent} variant="dash" />
		</div>
	);
}

/* Chicago-style: dark full-bleed page, hairline frame, label gutter */
function DarkFrame({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	const Row = ({ label, children }: { label: string; children: ReactNode }) => (
		<div className="flex gap-5 pt-3 mt-1">
			<div className="w-24 shrink-0 text-[calc(9px_*_var(--rz-fs))] uppercase tracking-[0.2em] text-white/60 pt-0.5">
				{label}
			</div>
			<div className="flex-1 min-w-0">{children}</div>
		</div>
	);
	const customs = (data.sections ?? []).filter((s) => s.items.some((it) => it.primary || it.secondary));
	return (
		<div className="w-full h-full text-white" style={{ background: accent, fontFamily, padding: 14 }}>
			<div className="w-full h-full border border-white/25" style={{ padding: 'var(--rz-pad, 32px)' }}>
				<header className="flex items-center gap-5">
					{p.photo && (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={p.photo} alt="" className="w-16 h-16 rounded-full object-cover shrink-0 border border-white/40" />
					)}
					<div className="flex-1 min-w-0">
						<h1 className="text-[calc(28px_*_var(--rz-fs))] font-extrabold leading-none">{p.fullName || 'Your Name'}</h1>
						<div className="text-[calc(10px_*_var(--rz-fs))] uppercase tracking-[0.3em] text-white/70 mt-1.5">{p.title}</div>
					</div>
					{contact.length > 0 && (
						<div className="text-right text-[calc(9.5px_*_var(--rz-fs))] text-white/75 space-y-0.5 shrink-0 max-w-[36%]">
							{contact.map((c, i) => (
								<div key={i} className="truncate">
									{c}
								</div>
							))}
						</div>
					)}
				</header>
				<div className="h-px w-full bg-white/25 mt-4" />
				{p.summary && (
					<Row label="Profile">
						<p className="text-[calc(11px_*_var(--rz-fs))] leading-snug text-white/90">{p.summary}</p>
					</Row>
				)}
				{data.experience.length > 0 && (
					<Row label="History">
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
						<div className="grid grid-cols-2 gap-x-8 gap-y-1">
							{data.skills.map((s, i) => (
								<div key={i} className="text-[calc(10.5px_*_var(--rz-fs))] flex items-center gap-2">
									<span className="w-[7px] h-[7px] rounded-full border border-white/70 shrink-0" />
									{s}
								</div>
							))}
						</div>
					</Row>
				)}
				{filledProjects(data).length > 0 && (
					<Row label="Projects">
						<ProjectsBlock data={data} accent="#ffffff" />
					</Row>
				)}
				{customs.map((sec) => (
					<Row key={sec.id} label={sec.heading}>
						<div className="space-y-0.5">
							{sec.items
								.filter((it) => it.primary || it.secondary)
								.map((it) => (
									<div key={it.id} className="text-[calc(10.5px_*_var(--rz-fs))]">
										<span className="font-semibold">{it.primary}</span>
										{it.secondary && <span className="text-white/70"> — {it.secondary}</span>}
									</div>
								))}
						</div>
					</Row>
				))}
			</div>
		</div>
	);
}

/* Madrid-style: yellow header block + photo, black label-box headings */
function LabelBox({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const dark = '#171f33';
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily }}>
			<div className="flex items-stretch">
				{p.photo ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-28 object-cover shrink-0" />
				) : (
					<div className="w-10 shrink-0" style={{ background: dark }} />
				)}
				<div className="flex-1 px-7 py-6" style={{ background: accent, color: dark }}>
					<h1 className="text-[calc(26px_*_var(--rz-fs))] font-extrabold uppercase leading-none tracking-tight">
						{p.fullName || 'Your Name'}
					</h1>
					<div className="text-[calc(11px_*_var(--rz-fs))] font-bold uppercase tracking-[0.2em] mt-1.5">{p.title}</div>
					{contact.length > 0 && (
						<div className="text-[calc(10px_*_var(--rz-fs))] mt-2 opacity-80">{contact.join('   ·   ')}</div>
					)}
				</div>
			</div>
			<div style={{ padding: 'var(--rz-pad, 32px)', paddingTop: 10 }}>
				{orderedCoreBlocks(data, dark, ['summary', 'experience', 'education', 'skills', 'projects'], 'box')}
				<CustomBlocks data={data} accent={dark} variant="box" />
			</div>
		</div>
	);
}

/* Oslo-style: dark centered band with circular photo, serif body */
function BandCenter({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily }}>
			<div style={{ background: accent }} className="text-white px-8 py-7 text-center">
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-2.5 border-2 border-white/40" />
				)}
				<h1 className="text-[calc(25px_*_var(--rz-fs))] font-bold leading-tight">{p.fullName || 'Your Name'}</h1>
				<div className="text-[calc(11px_*_var(--rz-fs))] tracking-[0.25em] uppercase opacity-85 mt-1">{p.title}</div>
				{contact.length > 0 && (
					<div className="mt-2.5 pt-2.5 border-t border-white/25 text-[calc(10px_*_var(--rz-fs))] opacity-85">
						{contact.join('     ·     ')}
					</div>
				)}
			</div>
			<div style={{ padding: 'var(--rz-pad, 32px)', paddingTop: 12 }}>
				{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'skills', 'projects'])}
				<CustomBlocks data={data} accent={accent} />
			</div>
		</div>
	);
}

/* Rome-style: editorial stacked name + large portrait, numbered sections */
function Editorial({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	const customs = (data.sections ?? []).filter((s) => s.items.some((it) => it.primary || it.secondary));
	// Deterministic section numbering (a render-time counter breaks hydration).
	const nums: string[] = [];
	if (p.summary) nums.push('profile');
	if (data.experience.length > 0) nums.push('experience');
	if (data.education.length > 0) nums.push('education');
	if (data.skills.length > 0) nums.push('skills');
	if (filledProjects(data).length > 0) nums.push('projects');
	customs.forEach((sec) => nums.push(sec.id));
	const NumTitle = ({ id, children }: { id: string; children: ReactNode }) => (
		<h2
			className="flex items-center gap-2.5 text-[calc(14px_*_var(--rz-fs))] font-bold uppercase tracking-wider"
			style={{ color: accent, marginTop: 'var(--rz-gap, 16px)', marginBottom: 8 }}
		>
			<span
				className="w-6 h-6 rounded-full border flex items-center justify-center text-[calc(10px_*_var(--rz-fs))] shrink-0"
				style={{ borderColor: accent }}
			>
				{nums.indexOf(id) + 1}
			</span>
			{children}
		</h2>
	);
	return (
		<div className="bg-[#f8f8f8] text-[#2d2d2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="flex items-start justify-between gap-6">
				<div className="min-w-0 pt-2">
					<h1 className="text-[calc(34px_*_var(--rz-fs))] font-extrabold uppercase leading-[1.05] tracking-tight">
						{p.fullName || 'Your Name'}
					</h1>
					<div className="text-[calc(11px_*_var(--rz-fs))] uppercase tracking-[0.3em] opacity-70 mt-2">{p.title}</div>
					{contact.length > 0 && (
						<div className="text-[calc(10px_*_var(--rz-fs))] opacity-75 mt-3 space-y-0.5">
							{contact.map((c, i) => (
								<div key={i}>{c}</div>
							))}
						</div>
					)}
				</div>
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-32 h-40 object-cover shrink-0 grayscale" />
				)}
			</header>
			{p.summary && (
				<>
					<NumTitle id="profile">Profile</NumTitle>
					<p className="text-[calc(11px_*_var(--rz-fs))] leading-snug">{p.summary}</p>
				</>
			)}
			{data.experience.length > 0 && (
				<>
					<NumTitle id="experience">Experience</NumTitle>
					<ExperienceBlock data={data} />
				</>
			)}
			{data.education.length > 0 && (
				<>
					<NumTitle id="education">Education</NumTitle>
					<EducationBlock data={data} />
				</>
			)}
			{data.skills.length > 0 && (
				<>
					<NumTitle id="skills">Skills</NumTitle>
					<div className="grid grid-cols-2 gap-x-10">
						<SkillDots data={data} accent={accent} />
					</div>
				</>
			)}
			{filledProjects(data).length > 0 && (
				<>
					<NumTitle id="projects">Projects</NumTitle>
					<ProjectsBlock data={data} accent={accent} />
				</>
			)}
			{customs.map((sec) => (
				<div key={sec.id}>
					<NumTitle id={sec.id}>{sec.heading}</NumTitle>
					<div className="space-y-0.5">
						{sec.items
							.filter((it) => it.primary || it.secondary)
							.map((it) => (
								<div key={it.id} className="text-[calc(10.5px_*_var(--rz-fs))]">
									<span className="font-semibold">{it.primary}</span>
									{it.secondary && <span className="opacity-70"> — {it.secondary}</span>}
								</div>
							))}
					</div>
				</div>
			))}
		</div>
	);
}

/* Singapore/Vancouver-style: 01/02 mono numbered sections, optional hex photo */
function NumberedMono({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	const customs = (data.sections ?? []).filter((s) => s.items.some((it) => it.primary || it.secondary));
	// Deterministic section numbering (a render-time counter breaks hydration).
	const nums: string[] = [];
	if (p.summary) nums.push('profile');
	if (data.experience.length > 0) nums.push('experience');
	if (data.education.length > 0) nums.push('education');
	if (data.skills.length > 0) nums.push('skills');
	if (filledProjects(data).length > 0) nums.push('projects');
	customs.forEach((sec) => nums.push(sec.id));
	const MonoTitle = ({ id, children }: { id: string; children: ReactNode }) => (
		<h2
			className="flex items-baseline gap-2.5 text-[calc(13px_*_var(--rz-fs))] font-bold uppercase tracking-[0.15em] border-b border-black/15 pb-1"
			style={{ marginTop: 'var(--rz-gap, 16px)', marginBottom: 8 }}
		>
			<span className="font-[family-name:var(--font-mono)]" style={{ color: accent }}>
				{String(nums.indexOf(id) + 1).padStart(2, '0')}
			</span>
			{children}
		</h2>
	);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="text-center">
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={p.photo}
						alt=""
						className="w-20 h-[88px] object-cover mx-auto mb-2"
						style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
					/>
				)}
				<h1 className="text-[calc(23px_*_var(--rz-fs))] font-extrabold uppercase tracking-[0.06em] leading-tight">
					{p.fullName || 'Your Name'}
				</h1>
				<div className="text-[calc(10.5px_*_var(--rz-fs))] uppercase tracking-[0.25em] mt-1" style={{ color: accent }}>
					{p.title}
				</div>
				{contact.length > 0 && (
					<div className="text-[calc(10px_*_var(--rz-fs))] opacity-75 mt-2">{contact.join('   ·   ')}</div>
				)}
			</header>
			{p.summary && (
				<>
					<MonoTitle id="profile">Profile</MonoTitle>
					<p className="text-[calc(11px_*_var(--rz-fs))] leading-snug">{p.summary}</p>
				</>
			)}
			{data.experience.length > 0 && (
				<>
					<MonoTitle id="experience">Experience</MonoTitle>
					{data.experience.map((e) => (
						<div key={e.id} className="mb-2.5">
							<div className="flex justify-between items-center gap-2">
								<span className="font-bold text-[calc(12px_*_var(--rz-fs))]">
									{[e.role || 'Role', e.company].filter(Boolean).join(' · ')}
								</span>
								<span
									className="text-[calc(9.5px_*_var(--rz-fs))] font-[family-name:var(--font-mono)] px-1.5 py-0.5 rounded whitespace-nowrap"
									style={{ background: `${accent}14`, color: accent }}
								>
									{[e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ')}
								</span>
							</div>
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
			)}
			{data.education.length > 0 && (
				<>
					<MonoTitle id="education">Education</MonoTitle>
					<EducationBlock data={data} />
				</>
			)}
			{data.skills.length > 0 && (
				<>
					<MonoTitle id="skills">Skills</MonoTitle>
					<SkillGrid data={data} accent={accent} />
				</>
			)}
			{filledProjects(data).length > 0 && (
				<>
					<MonoTitle id="projects">Projects</MonoTitle>
					<ProjectsBlock data={data} accent={accent} />
				</>
			)}
			{customs.map((sec) => (
				<div key={sec.id}>
					<MonoTitle id={sec.id}>{sec.heading}</MonoTitle>
					<div className="space-y-0.5">
						{sec.items
							.filter((it) => it.primary || it.secondary)
							.map((it) => (
								<div key={it.id} className="text-[calc(10.5px_*_var(--rz-fs))]">
									<span className="font-semibold">{it.primary}</span>
									{it.secondary && <span className="opacity-70"> — {it.secondary}</span>}
								</div>
							))}
					</div>
				</div>
			))}
		</div>
	);
}

/* Sydney-style: mirrored two-column — colored sidebar on the RIGHT */
function ColorRight({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	return (
		<div className="bg-white text-[#111c2d] w-full h-full flex" style={{ fontFamily }}>
			<main className="flex-1 min-w-0" style={{ padding: 'var(--rz-pad, 32px)' }}>
				<header>
					<h1 className="text-[calc(25px_*_var(--rz-fs))] font-extrabold leading-tight" style={{ color: accent }}>
						{p.fullName || 'Your Name'}
					</h1>
					<div className="text-[calc(12px_*_var(--rz-fs))] font-semibold uppercase tracking-wide opacity-80 mt-0.5">
						{p.title}
					</div>
				</header>
				{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'projects'])}
				<CustomBlocks data={data} accent={accent} />
			</main>
			<aside className="w-1/3 p-5 text-white" style={{ background: accent }}>
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={p.photo} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-white/40" />
				)}
				<h2 className="text-[calc(11px_*_var(--rz-fs))] font-bold uppercase tracking-wide opacity-90">Details</h2>
				<div className="mt-1 space-y-0.5 text-[calc(10px_*_var(--rz-fs))] opacity-90 break-words">
					{[p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean).map((c, i) => (
						<div key={i}>{c}</div>
					))}
				</div>
				{data.skills.length > 0 && (
					<div className="mt-4">
						<h2 className="text-[calc(11px_*_var(--rz-fs))] font-bold uppercase tracking-wide opacity-90">Skills</h2>
						<div className="mt-1.5">
							<SkillBars data={data} accent={accent} light />
						</div>
					</div>
				)}
			</aside>
		</div>
	);
}

/* Lisbon/Rio-style: tinted page with organic corner shapes */
function Blobs({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div
			className="w-full h-full text-[#111c2d] relative overflow-hidden"
			style={{ background: `${accent}10`, fontFamily }}
		>
			<div className="absolute -top-16 -left-16 w-56 h-56 rounded-full" style={{ background: `${accent}22` }} />
			<div className="absolute -bottom-20 -right-14 w-64 h-64 rounded-full" style={{ background: `${accent}1c` }} />
			<div className="absolute top-1/3 -right-20 w-40 h-40 rounded-full" style={{ background: `${accent}14` }} />
			<div className="relative z-10 h-full" style={{ padding: 'var(--rz-pad, 32px)' }}>
				<header className="text-center">
					{p.photo && (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={p.photo}
							alt=""
							className="w-20 h-[88px] object-cover mx-auto mb-2"
							style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
						/>
					)}
					<h1 className="text-[calc(26px_*_var(--rz-fs))] font-extrabold uppercase tracking-wide leading-tight" style={{ color: accent }}>
						{p.fullName || 'Your Name'}
					</h1>
					<div className="text-[calc(11px_*_var(--rz-fs))] uppercase tracking-[0.25em] opacity-80 mt-1">{p.title}</div>
					{contact.length > 0 && (
						<div className="text-[calc(10px_*_var(--rz-fs))] opacity-75 mt-1.5">{contact.join('  ·  ')}</div>
					)}
				</header>
				<div className="flex gap-7 mt-4">
					<aside className="w-[30%] shrink-0 text-center">
						{data.skills.length > 0 && (
							<div>
								<h2 className="text-[calc(11px_*_var(--rz-fs))] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>
									Skills
								</h2>
								<div className="text-left">
									<SkillBars data={data} accent={accent} />
								</div>
							</div>
						)}
						{(data.sections ?? [])
							.filter((s) => s.items.some((it) => it.primary || it.secondary))
							.map((sec) => (
								<div key={sec.id} className="mt-4">
									<h2 className="text-[calc(11px_*_var(--rz-fs))] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: accent }}>
										{sec.heading}
									</h2>
									<div className="space-y-1 text-[calc(10.5px_*_var(--rz-fs))]">
										{sec.items
											.filter((it) => it.primary || it.secondary)
											.map((it) => (
												<div key={it.id}>
													<span className="font-semibold">{it.primary}</span>
													{it.secondary && <span className="opacity-70"> {it.secondary}</span>}
												</div>
											))}
									</div>
								</div>
							))}
					</aside>
					<main className="flex-1 min-w-0">
						{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'projects'])}
					</main>
				</div>
			</div>
		</div>
	);
}

/* Zurich-style: navy monogram band, two-column body, bronze bars, footer strip */
function MonogramBand({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const bronze = '#b08d5f';
	const initials = (p.fullName || 'Y N')
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase())
		.join('');
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full flex flex-col" style={{ fontFamily }}>
			<div style={{ background: accent }} className="text-white text-center px-8 py-6">
				<div
					className="w-12 h-12 rounded-full border flex items-center justify-center mx-auto mb-2 text-[calc(15px_*_var(--rz-fs))] tracking-widest"
					style={{ borderColor: bronze, color: bronze }}
				>
					{initials}
				</div>
				<h1 className="text-[calc(21px_*_var(--rz-fs))] font-bold uppercase tracking-[0.25em] leading-tight">
					{p.fullName || 'Your Name'}
				</h1>
				<div className="text-[calc(10px_*_var(--rz-fs))] uppercase tracking-[0.3em] opacity-80 mt-1">{p.title}</div>
			</div>
			<div className="flex-1 flex gap-7" style={{ padding: 'var(--rz-pad, 32px)', paddingBottom: 16 }}>
				<main className="flex-1 min-w-0">
					{data.experience.length > 0 && (
						<>
							<SectionTitle accent={accent}>Work Experience</SectionTitle>
							<ExperienceBlock data={data} />
						</>
					)}
					{filledProjects(data).length > 0 && (
						<>
							<SectionTitle accent={accent}>Projects</SectionTitle>
							<ProjectsBlock data={data} accent={accent} />
						</>
					)}
				</main>
				<aside className="w-[38%] shrink-0">
					{p.summary && (
						<>
							<SectionTitle accent={accent}>Personal Statement</SectionTitle>
							<p className="text-[calc(10.5px_*_var(--rz-fs))] leading-snug">{p.summary}</p>
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
							<SkillBars data={data} accent={bronze} />
						</>
					)}
					<CustomBlocks data={data} accent={accent} />
				</aside>
			</div>
			{contact.length > 0 && (
				<div className="border-t border-black/15 text-center text-[calc(9.5px_*_var(--rz-fs))] opacity-80 py-3 px-6">
					{contact.join('     ·     ')}
				</div>
			)}
		</div>
	);
}

/* Denver-style: "Hey there" greeting intro with a timeline of roles */
function Kicker({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	return (
		<div className="bg-white text-[#111c2d] w-full h-full flex" style={{ fontFamily }}>
			<aside className="w-[32%] shrink-0 border-r border-black/10 space-y-5" style={{ padding: 'var(--rz-pad, 32px)' }}>
				{p.photo && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={p.photo}
						alt=""
						className="w-24 h-24 rounded-full object-cover ring-2 ring-offset-4 mx-auto"
						style={{ ['--tw-ring-color' as string]: accent }}
					/>
				)}
				{contact.length > 0 && (
					<div>
						<SidebarHeading accent={accent}>Contact</SidebarHeading>
						<div className="space-y-1 text-[calc(10px_*_var(--rz-fs))] break-words">
							{contact.map((c, i) => (
								<div key={i}>{c}</div>
							))}
						</div>
					</div>
				)}
				{data.skills.length > 0 && (
					<div>
						<SidebarHeading accent={accent}>Skills</SidebarHeading>
						<div className="space-y-0.5 text-[calc(10.5px_*_var(--rz-fs))]">
							{data.skills.map((s, i) => (
								<div key={i}>{s}</div>
							))}
						</div>
					</div>
				)}
				{(data.sections ?? [])
					.filter((s) => s.items.some((it) => it.primary || it.secondary))
					.map((sec) => (
						<div key={sec.id}>
							<SidebarHeading accent={accent}>{sec.heading}</SidebarHeading>
							<div className="space-y-1 text-[calc(10px_*_var(--rz-fs))]">
								{sec.items
									.filter((it) => it.primary || it.secondary)
									.map((it) => (
										<div key={it.id}>
											<span className="font-semibold">{it.primary}</span>
											{it.secondary && <span className="opacity-70"> {it.secondary}</span>}
										</div>
									))}
							</div>
						</div>
					))}
			</aside>
			<main className="flex-1 min-w-0" style={{ padding: 'var(--rz-pad, 32px)' }}>
				<div className="text-[calc(10px_*_var(--rz-fs))] uppercase tracking-[0.3em] opacity-60">Hey there, I am</div>
				<h1 className="text-[calc(28px_*_var(--rz-fs))] font-extrabold leading-tight mt-1">{p.fullName || 'Your Name'}</h1>
				<div className="text-[calc(12px_*_var(--rz-fs))] opacity-70">{p.title}</div>
				{p.summary && <p className="text-[calc(11px_*_var(--rz-fs))] leading-snug mt-3">{p.summary}</p>}
				{data.experience.length > 0 && (
					<>
						<SectionTitle accent={accent}>Experience</SectionTitle>
						<div className="border-l border-black/15 pl-4 space-y-3">
							{data.experience.map((e) => (
								<div key={e.id} className="relative">
									<span
										className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full"
										style={{ background: accent }}
									/>
									<div className="flex justify-between items-baseline gap-2">
										<span className="font-bold text-[calc(12px_*_var(--rz-fs))]">{e.role || 'Role'}</span>
										<span className="text-[calc(10px_*_var(--rz-fs))] opacity-70 whitespace-nowrap font-[family-name:var(--font-mono)]">
											{[e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ')}
										</span>
									</div>
									<div className="text-[calc(11px_*_var(--rz-fs))] opacity-80">{e.company}</div>
									<ul className="mt-1 list-disc pl-4 space-y-0.5">
										{e.bullets.filter(Boolean).map((b, i) => (
											<li key={i} className="text-[calc(10.5px_*_var(--rz-fs))] leading-snug">
												{b}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</>
				)}
				{data.education.length > 0 && (
					<>
						<SectionTitle accent={accent}>Education</SectionTitle>
						<EducationBlock data={data} />
					</>
				)}
				{filledProjects(data).length > 0 && (
					<>
						<SectionTitle accent={accent}>Projects</SectionTitle>
						<ProjectsBlock data={data} accent={accent} />
					</>
				)}
			</main>
		</div>
	);
}

/* Berlin-style: stacked bold name, labelled info rail with thick black bars,
   vertical divider, letterspaced main headings */
function BoldBars({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const RailTitle = ({ children }: { children: ReactNode }) => (
		<h2 className="text-[calc(12.5px_*_var(--rz-fs))] font-extrabold uppercase tracking-[0.15em] mb-2 pb-1 border-b border-black/60">
			{children}
		</h2>
	);
	const ThickBar = ({ width }: { width: string }) => (
		<div className="h-[7px] bg-black/15">
			<div className="h-[7px]" style={{ width, background: accent }} />
		</div>
	);
	const InfoItem = ({ label, value }: { label: string; value: string }) => (
		<div className="mb-2">
			<div className="text-[calc(9px_*_var(--rz-fs))] font-bold uppercase tracking-[0.15em]">{label}</div>
			<div className="text-[calc(10px_*_var(--rz-fs))] opacity-80 break-words">{value}</div>
		</div>
	);
	return (
		<div className="bg-white text-[#16181d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header>
				<h1 className="text-[calc(30px_*_var(--rz-fs))] font-extrabold uppercase leading-[1.05] tracking-tight max-w-[70%]">
					{p.fullName || 'Your Name'}
				</h1>
				<div className="text-[calc(11px_*_var(--rz-fs))] opacity-60 mt-1.5">{p.title}</div>
			</header>
			<div className="flex mt-5">
				<aside className="w-[32%] shrink-0 pr-6 border-r border-black/15 space-y-5">
					{(p.location || p.phone || p.email || p.links.length > 0) && (
						<div>
							<RailTitle>Info</RailTitle>
							{p.location && <InfoItem label="Address" value={p.location} />}
							{p.phone && <InfoItem label="Phone" value={p.phone} />}
							{p.email && <InfoItem label="Email" value={p.email} />}
							{p.links.map((l, i) => (
								<InfoItem key={i} label={l.label || 'Link'} value={l.url} />
							))}
						</div>
					)}
					{data.skills.length > 0 && (
						<div>
							<RailTitle>Skills</RailTitle>
							<div className="space-y-2">
								{data.skills.map((s, i) => (
									<div key={i}>
										<div className="text-[calc(10.5px_*_var(--rz-fs))] mb-1">{s}</div>
										<ThickBar width={showLevels(data) ? `${skillLevelFor(data, s) * 20}%` : '100%'} />
									</div>
								))}
							</div>
						</div>
					)}
					{(data.sections ?? [])
						.filter((s) => s.items.some((it) => it.primary || it.secondary))
						.map((sec) => (
							<div key={sec.id}>
								<RailTitle>{sec.heading}</RailTitle>
								<div className="space-y-2">
									{sec.items
										.filter((it) => it.primary || it.secondary)
										.map((it) =>
											sec.type === 'languages' ? (
												<div key={it.id}>
													<div className="text-[calc(10.5px_*_var(--rz-fs))] mb-1">{it.primary}</div>
													<ThickBar width={`${(languageDots(it.secondary) ?? 5) * 20}%`} />
												</div>
											) : (
												<div key={it.id} className="text-[calc(10px_*_var(--rz-fs))]">
													<span className="font-semibold">{it.primary}</span>
													{it.secondary && <span className="opacity-70"> — {it.secondary}</span>}
												</div>
											),
										)}
								</div>
							</div>
						))}
				</aside>
				<main className="flex-1 pl-6 min-w-0">
					{orderedCoreBlocks(data, accent, ['summary', 'experience', 'education', 'projects'])}
				</main>
			</div>
		</div>
	);
}

/* London (software engineer)-style: Europass serif — centered name, thick rule,
   hanging left section labels, full-width hairline rules, plain skills rows */
function Europass({ data, accent, fontFamily }: { data: ResumeData; accent: string; fontFamily: string }) {
	const p = data.personal;
	const contact = [p.location, p.phone, p.email, ...p.links.map((l) => l.url)].filter(Boolean);
	const Row = ({ label, children }: { label: string; children: ReactNode }) => (
		<div className="border-t border-black/25 pt-2.5" style={{ marginTop: 'var(--rz-gap, 16px)' }}>
			<div className="flex gap-5">
				<div className="w-24 shrink-0 text-[calc(9.5px_*_var(--rz-fs))] font-bold uppercase tracking-[0.2em] pt-0.5">
					{label}
				</div>
				<div className="flex-1 min-w-0">{children}</div>
			</div>
		</div>
	);
	return (
		<div className="bg-white text-[#16181d] w-full h-full" style={{ fontFamily, padding: 'var(--rz-pad, 32px)' }}>
			<header className="text-center">
				<h1 className="text-[calc(18px_*_var(--rz-fs))] font-bold leading-tight">
					{p.fullName || 'Your Name'}
					{p.title ? `, ${p.title}` : ''}
				</h1>
				{contact.length > 0 && (
					<div className="text-[calc(10px_*_var(--rz-fs))] opacity-80 mt-1">{contact.join('  ·  ')}</div>
				)}
			</header>
			<div className="mt-3 border-t-2" style={{ borderColor: accent }} />
			{p.summary && (
				<Row label="Profile">
					<p className="text-[calc(11px_*_var(--rz-fs))] leading-snug">{p.summary}</p>
				</Row>
			)}
			{data.experience.length > 0 && (
				<Row label="Experience">
					{data.experience.map((e) => (
						<div key={e.id} className="mb-3">
							<div className="flex justify-between items-baseline gap-2">
								<span className="font-bold text-[calc(12px_*_var(--rz-fs))]">
									{e.role || 'Role'}
									{e.company && <span className="font-normal"> — {e.company}</span>}
								</span>
								<span className="text-[calc(9.5px_*_var(--rz-fs))] opacity-70 whitespace-nowrap">
									{[e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ')}
								</span>
							</div>
							<ul className="mt-1 list-disc pl-4 space-y-0.5">
								{e.bullets.filter(Boolean).map((b, i) => (
									<li key={i} className="text-[calc(10.5px_*_var(--rz-fs))] leading-snug">
										{b}
									</li>
								))}
							</ul>
						</div>
					))}
				</Row>
			)}
			{data.education.length > 0 && (
				<Row label="Education">
					<EducationBlock data={data} />
				</Row>
			)}
			{filledProjects(data).length > 0 && (
				<Row label="Projects">
					<ProjectsBlock data={data} accent={accent} />
				</Row>
			)}
			{data.skills.length > 0 && (
				<Row label="Skills">
					<p className="text-[calc(10.5px_*_var(--rz-fs))] leading-relaxed">{data.skills.join(', ')}</p>
				</Row>
			)}
			{(data.sections ?? [])
				.filter((s) => s.items.some((it) => it.primary || it.secondary))
				.map((sec) => (
					<Row key={sec.id} label={sec.heading}>
						<div className="space-y-0.5">
							{sec.items
								.filter((it) => it.primary || it.secondary)
								.map((it) => (
									<div key={it.id} className="text-[calc(10.5px_*_var(--rz-fs))] flex justify-between gap-3">
										<span className="font-semibold">{it.primary}</span>
										{it.secondary && <span className="opacity-75">{it.secondary}</span>}
									</div>
								))}
						</div>
					</Row>
				))}
		</div>
	);
}
