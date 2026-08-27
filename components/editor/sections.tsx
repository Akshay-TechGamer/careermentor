'use client';

import { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, RotateCcw, Check, Sparkles, GripVertical } from 'lucide-react';
import {
	ACCENT_PRESETS,
	CORE_SECTION_LABELS,
	CUSTOM_LAYOUTS,
	resolveSectionOrder,
	SECTION_META,
	SECTION_ORDER,
	type CoreSectionKey,
	type CustomLayout,
	type CustomSection,
	type EducationItem,
	type ExperienceItem,
	type FontChoice,
	type MarginChoice,
	type ProjectItem,
	type ResumeData,
	type SectionType,
	type SpacingChoice,
} from '@/lib/types';
import { improveBullets } from '@/lib/analyzer/analyze';

type Update = (fn: (d: ResumeData) => ResumeData) => void;

function id(): string {
	try {
		return crypto.randomUUID();
	} catch {
		return `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
	}
}

function move<T>(arr: T[], from: number, to: number): T[] {
	if (to < 0 || to >= arr.length) return arr;
	const next = arr.slice();
	const [item] = next.splice(from, 1);
	next.splice(to, 0, item);
	return next;
}

/* ---------------- Personal ---------------- */
async function fileToAvatar(file: File): Promise<string> {
	const dataUrl = await new Promise<string>((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(r.result as string);
		r.onerror = reject;
		r.readAsDataURL(file);
	});
	// Downscale to a small square JPEG so it stays light in storage.
	return new Promise<string>((resolve) => {
		const img = new Image();
		img.onload = () => {
			const size = 400;
			const canvas = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				resolve(dataUrl);
				return;
			}
			const min = Math.min(img.width, img.height);
			const sx = (img.width - min) / 2;
			const sy = (img.height - min) / 2;
			ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
			resolve(canvas.toDataURL('image/jpeg', 0.82));
		};
		img.onerror = () => resolve(dataUrl);
		img.src = dataUrl;
	});
}

export function PersonalSection({
	data,
	update,
	showPhoto = false,
}: {
	data: ResumeData;
	update: Update;
	showPhoto?: boolean;
}) {
	const p = data.personal;
	const set = (patch: Partial<typeof p>) =>
		update((d) => ({ ...d, personal: { ...d.personal, ...patch } }));
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{showPhoto && (
				<div className="sm:col-span-2 flex items-center gap-4">
					<div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container flex items-center justify-center shrink-0">
						{p.photo ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={p.photo} alt="Headshot" className="w-full h-full object-cover" />
						) : (
							<span className="label-caps text-outline">Photo</span>
						)}
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="btn btn-outline text-sm cursor-pointer">
							{p.photo ? 'Change photo' : 'Upload photo'}
							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={async (e) => {
									const f = e.target.files?.[0];
									if (f) set({ photo: await fileToAvatar(f) });
								}}
							/>
						</label>
						{p.photo && (
							<button className="btn-ghost text-danger text-sm text-left px-1" onClick={() => set({ photo: undefined })}>
								Remove photo
							</button>
						)}
						<span className="text-xs text-on-surface-variant">Shown on photo templates.</span>
					</div>
				</div>
			)}
			<Labeled label="Full Name">
				<input className="input" value={p.fullName} onChange={(e) => set({ fullName: e.target.value })} />
			</Labeled>
			<Labeled label="Professional Title">
				<input className="input" value={p.title} onChange={(e) => set({ title: e.target.value })} />
			</Labeled>
			<Labeled label="Email">
				<input className="input" value={p.email} onChange={(e) => set({ email: e.target.value })} />
			</Labeled>
			<Labeled label="Phone">
				<input className="input" value={p.phone} onChange={(e) => set({ phone: e.target.value })} />
			</Labeled>
			<Labeled label="Location">
				<input className="input" value={p.location} onChange={(e) => set({ location: e.target.value })} />
			</Labeled>
			<Labeled label="LinkedIn / Website">
				<input
					className="input"
					value={p.links[0]?.url ?? ''}
					onChange={(e) => set({ links: e.target.value ? [{ label: 'Link', url: e.target.value }] : [] })}
				/>
			</Labeled>
			<div className="sm:col-span-2">
				<Labeled label="Professional Summary">
					<textarea
						className="input min-h-24"
						value={p.summary}
						onChange={(e) => set({ summary: e.target.value })}
						placeholder="2–3 sentences on who you are and your biggest wins."
					/>
				</Labeled>
			</div>
		</div>
	);
}

/* ---------------- Experience ---------------- */
export function ExperienceSection({ data, update }: { data: ResumeData; update: Update }) {
	const setItem = (i: number, patch: Partial<ExperienceItem>) =>
		update((d) => ({
			...d,
			experience: d.experience.map((e, idx) => (idx === i ? { ...e, ...patch } : e)),
		}));
	const remove = (i: number) =>
		update((d) => ({ ...d, experience: d.experience.filter((_, idx) => idx !== i) }));
	const reorder = (i: number, dir: -1 | 1) =>
		update((d) => ({ ...d, experience: move(d.experience, i, i + dir) }));

	return (
		<div className="space-y-3">
			{data.experience.map((e, i) => (
				<EntryCard
					key={e.id}
					onRemove={() => remove(i)}
					onUp={() => reorder(i, -1)}
					onDown={() => reorder(i, 1)}
				>
					<div className="grid gap-3 sm:grid-cols-2">
						<Labeled label="Role">
							<input className="input" value={e.role} onChange={(ev) => setItem(i, { role: ev.target.value })} />
						</Labeled>
						<Labeled label="Company">
							<input className="input" value={e.company} onChange={(ev) => setItem(i, { company: ev.target.value })} />
						</Labeled>
						<Labeled label="Start">
							<input className="input" value={e.start} placeholder="2021" onChange={(ev) => setItem(i, { start: ev.target.value })} />
						</Labeled>
						<Labeled label="End">
							<input
								className="input disabled:opacity-50"
								value={e.end}
								placeholder="2023"
								disabled={e.current}
								onChange={(ev) => setItem(i, { end: ev.target.value })}
							/>
						</Labeled>
					</div>
					<label className="mt-2 flex items-center gap-2 text-sm text-on-surface-variant">
						<input type="checkbox" checked={e.current} onChange={(ev) => setItem(i, { current: ev.target.checked })} />
						I currently work here
					</label>
					<Labeled label="Achievements (one per line)" className="mt-2">
						<textarea
							className="input min-h-28"
							value={e.bullets.join('\n')}
							onChange={(ev) => setItem(i, { bullets: ev.target.value.split('\n') })}
							placeholder="Led the redesign of… improving retention by 25%."
						/>
					</Labeled>
					{e.bullets.some((b) => b.trim()) && (
						<div className="flex flex-wrap items-center gap-2 mt-2">
							<button
								type="button"
								className="btn btn-outline text-sm"
								onClick={() => setItem(i, { bullets: improveBullets(e.bullets.filter(Boolean)) })}
							>
								<Sparkles className="w-4 h-4" /> Improve writing
							</button>
							<button
								type="button"
								disabled
								title="Coming soon"
								className="btn btn-ghost text-sm opacity-60 cursor-not-allowed"
							>
								<Sparkles className="w-4 h-4" /> AI Rewrite (Pro)
								<span className="label-caps rounded-full px-2 py-0.5 ml-1 bg-surface-container text-on-surface-variant">
									Soon
								</span>
							</button>
						</div>
					)}
				</EntryCard>
			))}
			<AddButton
				label="Add experience"
				onClick={() =>
					update((d) => ({
						...d,
						experience: [
							...d.experience,
							{ id: id(), role: '', company: '', start: '', end: '', current: false, bullets: [''] },
						],
					}))
				}
			/>
		</div>
	);
}

/* ---------------- Education ---------------- */
export function EducationSection({ data, update }: { data: ResumeData; update: Update }) {
	const setItem = (i: number, patch: Partial<EducationItem>) =>
		update((d) => ({ ...d, education: d.education.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) }));
	const remove = (i: number) =>
		update((d) => ({ ...d, education: d.education.filter((_, idx) => idx !== i) }));
	return (
		<div className="space-y-3">
			{data.education.map((e, i) => (
				<EntryCard key={e.id} onRemove={() => remove(i)}>
					<div className="grid gap-3 sm:grid-cols-2">
						<Labeled label="Degree">
							<input className="input" value={e.degree} onChange={(ev) => setItem(i, { degree: ev.target.value })} />
						</Labeled>
						<Labeled label="School">
							<input className="input" value={e.school} onChange={(ev) => setItem(i, { school: ev.target.value })} />
						</Labeled>
						<Labeled label="Start">
							<input className="input" value={e.start} onChange={(ev) => setItem(i, { start: ev.target.value })} />
						</Labeled>
						<Labeled label="End">
							<input className="input" value={e.end} onChange={(ev) => setItem(i, { end: ev.target.value })} />
						</Labeled>
					</div>
					<Labeled label="Details (optional)" className="mt-2">
						<input className="input" value={e.details} onChange={(ev) => setItem(i, { details: ev.target.value })} />
					</Labeled>
				</EntryCard>
			))}
			<AddButton
				label="Add education"
				onClick={() =>
					update((d) => ({
						...d,
						education: [...d.education, { id: id(), degree: '', school: '', start: '', end: '', details: '' }],
					}))
				}
			/>
		</div>
	);
}

/* ---------------- Skills ---------------- */
export function SkillsSection({ data, update }: { data: ResumeData; update: Update }) {
	return (
		<div>
			<div className="flex flex-wrap gap-2">
				{data.skills.map((s, i) => (
					<span key={i} className="chip chip-on cursor-default">
						{s}
						<button
							className="ml-1.5"
							onClick={() => update((d) => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }))}
							aria-label={`Remove ${s}`}
						>
							×
						</button>
					</span>
				))}
			</div>
			<input
				className="input mt-3"
				placeholder="Type a skill and press Enter"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						const v = e.currentTarget.value.trim();
						if (v) {
							update((d) => ({ ...d, skills: [...d.skills, v] }));
							e.currentTarget.value = '';
						}
					}
				}}
			/>
		</div>
	);
}

/* ---------------- Projects ---------------- */
export function ProjectsSection({ data, update }: { data: ResumeData; update: Update }) {
	const setItem = (i: number, patch: Partial<ProjectItem>) =>
		update((d) => ({ ...d, projects: d.projects.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) }));
	const remove = (i: number) =>
		update((d) => ({ ...d, projects: d.projects.filter((_, idx) => idx !== i) }));
	return (
		<div className="space-y-3">
			{data.projects.map((p, i) => (
				<EntryCard key={p.id} onRemove={() => remove(i)}>
					<div className="grid gap-3">
						<Labeled label="Name">
							<input className="input" value={p.name} onChange={(ev) => setItem(i, { name: ev.target.value })} />
						</Labeled>
						<Labeled label="Description">
							<input className="input" value={p.description} onChange={(ev) => setItem(i, { description: ev.target.value })} />
						</Labeled>
					</div>
				</EntryCard>
			))}
			<AddButton
				label="Add project"
				onClick={() =>
					update((d) => ({
						...d,
						projects: [...d.projects, { id: id(), name: '', description: '', link: '' }],
					}))
				}
			/>
		</div>
	);
}

/* ---------------- Customize (design your template) ---------------- */
const LAYOUTS: { key: 'classic' | 'twoColumn' | 'academic'; label: string }[] = [
	{ key: 'classic', label: 'Single column' },
	{ key: 'twoColumn', label: 'Two column' },
	{ key: 'academic', label: 'Academic' },
];
const FONTS: { key: FontChoice; label: string }[] = [
	{ key: 'sans', label: 'Modern' },
	{ key: 'serif', label: 'Classic' },
	{ key: 'grotesk', label: 'Technical' },
];
const SPACINGS: { key: SpacingChoice; label: string }[] = [
	{ key: 'compact', label: 'Compact' },
	{ key: 'cozy', label: 'Cozy' },
	{ key: 'roomy', label: 'Roomy' },
];
const MARGINS: { key: MarginChoice; label: string }[] = [
	{ key: 'narrow', label: 'Narrow' },
	{ key: 'normal', label: 'Normal' },
	{ key: 'wide', label: 'Wide' },
];

export function CustomizeSection({ data, update }: { data: ResumeData; update: Update }) {
	const style = data.style ?? {};
	const setStyle = (patch: Partial<ResumeData['style']>) =>
		update((d) => ({ ...d, style: { ...d.style, ...patch } }));

	return (
		<div className="space-y-5">
			<div>
				<span className="field-label">Accent color</span>
				<div className="flex flex-wrap items-center gap-2">
					{ACCENT_PRESETS.map((c) => (
						<button
							key={c}
							type="button"
							onClick={() => setStyle({ accent: c })}
							className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
							style={{ background: c, borderColor: style.accent === c ? '#111c2d' : 'transparent' }}
							aria-label={`Accent ${c}`}
						>
							{style.accent === c && <Check className="w-4 h-4 text-white" />}
						</button>
					))}
					<label className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer relative">
						<input
							type="color"
							value={style.accent ?? '#0f52ba'}
							onChange={(e) => setStyle({ accent: e.target.value })}
							className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
							aria-label="Custom accent color"
						/>
					</label>
				</div>
			</div>

			<div>
				<span className="field-label">Layout</span>
				<div className="flex flex-wrap gap-2">
					{LAYOUTS.map((l) => (
						<button
							key={l.key}
							type="button"
							className={`chip ${style.layout === l.key ? 'chip-on' : ''}`}
							onClick={() => setStyle({ layout: l.key })}
						>
							{l.label}
						</button>
					))}
				</div>
			</div>

			<div>
				<span className="field-label">Font style</span>
				<div className="flex flex-wrap gap-2">
					{FONTS.map((f) => (
						<button
							key={f.key}
							type="button"
							className={`chip ${(style.font ?? 'sans') === f.key ? 'chip-on' : ''}`}
							onClick={() => setStyle({ font: f.key })}
						>
							{f.label}
						</button>
					))}
				</div>
			</div>

			<div>
				<span className="field-label">Spacing</span>
				<div className="flex flex-wrap gap-2">
					{SPACINGS.map((s) => (
						<button
							key={s.key}
							type="button"
							className={`chip ${(style.spacing ?? 'cozy') === s.key ? 'chip-on' : ''}`}
							onClick={() => setStyle({ spacing: s.key })}
						>
							{s.label}
						</button>
					))}
				</div>
			</div>

			<div>
				<span className="field-label">Page margins</span>
				<div className="flex flex-wrap gap-2">
					{MARGINS.map((m) => (
						<button
							key={m.key}
							type="button"
							className={`chip ${(style.margin ?? 'normal') === m.key ? 'chip-on' : ''}`}
							onClick={() => setStyle({ margin: m.key })}
						>
							{m.label}
						</button>
					))}
				</div>
			</div>

			{(style.accent || style.layout || style.font || style.spacing || style.margin) && (
				<button
					type="button"
					className="btn btn-ghost text-sm"
					onClick={() => update((d) => ({ ...d, style: {} }))}
				>
					<RotateCcw className="w-4 h-4" /> Reset to template defaults
				</button>
			)}
		</div>
	);
}

/* ---------------- Core section order (drag to reorder) ---------------- */
export function SectionOrderEditor({ data, update }: { data: ResumeData; update: Update }) {
	const order = resolveSectionOrder(data);
	const [dragIdx, setDragIdx] = useState<number | null>(null);

	const setOrder = (next: CoreSectionKey[]) => update((d) => ({ ...d, sectionOrder: next }));
	const moveTo = (from: number, to: number) => {
		if (to < 0 || to >= order.length) return;
		const n = order.slice();
		const [x] = n.splice(from, 1);
		n.splice(to, 0, x);
		setOrder(n);
	};

	return (
		<div>
			<p className="text-sm text-on-surface-variant mb-2">
				Drag (or use the arrows) to reorder how sections appear on your resume.
			</p>
			<ul className="space-y-1.5">
				{order.map((key, i) => (
					<li
						key={key}
						draggable
						onDragStart={() => setDragIdx(i)}
						onDragEnd={() => setDragIdx(null)}
						onDragOver={(e) => e.preventDefault()}
						onDrop={() => {
							if (dragIdx !== null && dragIdx !== i) moveTo(dragIdx, i);
							setDragIdx(null);
						}}
						className={`flex items-center gap-2 rounded-lg border border-outline-variant/70 bg-surface-lowest px-3 py-2 cursor-grab ${
							dragIdx === i ? 'opacity-40' : ''
						}`}
					>
						<GripVertical className="w-4 h-4 text-outline shrink-0" />
						<span className="flex-1 font-medium">{CORE_SECTION_LABELS[key]}</span>
						<button className="btn-ghost p-1 rounded" onClick={() => moveTo(i, i - 1)} aria-label="Move up">
							<ArrowUp className="w-4 h-4" />
						</button>
						<button className="btn-ghost p-1 rounded" onClick={() => moveTo(i, i + 1)} aria-label="Move down">
							<ArrowDown className="w-4 h-4" />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

/* ---------------- Custom / extra sections ---------------- */
export function CustomSectionsEditor({ data, update }: { data: ResumeData; update: Update }) {
	const sections = data.sections ?? [];
	const [addType, setAddType] = useState<SectionType>('links');

	const setSections = (fn: (s: CustomSection[]) => CustomSection[]) =>
		update((d) => ({ ...d, sections: fn(d.sections ?? []) }));

	const setItem = (si: number, ii: number, patch: Partial<{ primary: string; secondary: string }>) =>
		setSections((s) =>
			s.map((sec, idx) =>
				idx === si ? { ...sec, items: sec.items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) } : sec,
			),
		);
	const addItem = (si: number) =>
		setSections((s) =>
			s.map((sec, idx) =>
				idx === si ? { ...sec, items: [...sec.items, { id: id(), primary: '', secondary: '' }] } : sec,
			),
		);
	const removeItem = (si: number, ii: number) =>
		setSections((s) =>
			s.map((sec, idx) => (idx === si ? { ...sec, items: sec.items.filter((_, j) => j !== ii) } : sec)),
		);

	const addSection = () => {
		const meta = SECTION_META[addType];
		setSections((s) => [
			...s,
			{
				id: id(),
				type: addType,
				heading: meta.heading,
				layout: meta.defaultLayout,
				items: [{ id: id(), primary: '', secondary: '' }],
			},
		]);
	};

	const setLayout = (si: number, layout: CustomLayout) =>
		setSections((s) => s.map((sec, idx) => (idx === si ? { ...sec, layout } : sec)));

	return (
		<div className="space-y-4">
			{sections.map((sec, si) => {
				const meta = SECTION_META[sec.type];
				return (
					<div key={sec.id} className="rounded-lg border border-outline-variant/70 bg-surface-low p-4">
						<div className="flex items-center gap-2 mb-2">
							<input
								className="input font-semibold"
								value={sec.heading}
								onChange={(e) =>
									setSections((s) => s.map((x, idx) => (idx === si ? { ...x, heading: e.target.value } : x)))
								}
							/>
							<button className="btn-ghost p-1.5 rounded" onClick={() => setSections((s) => move(s, si, si - 1))} aria-label="Move up">
								<ArrowUp className="w-4 h-4" />
							</button>
							<button className="btn-ghost p-1.5 rounded" onClick={() => setSections((s) => move(s, si, si + 1))} aria-label="Move down">
								<ArrowDown className="w-4 h-4" />
							</button>
							<button className="btn-ghost p-1.5 rounded text-danger" onClick={() => setSections((s) => s.filter((_, idx) => idx !== si))} aria-label="Delete section">
								<Trash2 className="w-4 h-4" />
							</button>
						</div>
						<div className="flex flex-wrap items-center gap-1.5 mb-3">
							<span className="text-xs text-on-surface-variant mr-1">Layout:</span>
							{CUSTOM_LAYOUTS.map((l) => (
								<button
									key={l.key}
									type="button"
									className={`chip text-xs py-1 ${(sec.layout ?? meta.defaultLayout) === l.key ? 'chip-on' : ''}`}
									onClick={() => setLayout(si, l.key)}
								>
									{l.label}
								</button>
							))}
						</div>
						<div className="space-y-2">
							{sec.items.map((it, ii) => (
								<div key={it.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] items-center">
									<input className="input" placeholder={meta.primary} value={it.primary} onChange={(e) => setItem(si, ii, { primary: e.target.value })} />
									<input className="input" placeholder={meta.secondary} value={it.secondary} onChange={(e) => setItem(si, ii, { secondary: e.target.value })} />
									<button className="btn-ghost p-2 rounded text-danger justify-self-start" onClick={() => removeItem(si, ii)} aria-label="Remove item">
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							))}
						</div>
						<button className="mt-2 text-primary text-sm font-semibold flex items-center gap-1.5" onClick={() => addItem(si)}>
							<Plus className="w-4 h-4" /> Add {sec.type === 'links' ? 'link' : 'item'}
						</button>
					</div>
				);
			})}

			<div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-outline-variant p-3">
				<span className="text-sm text-on-surface-variant">Add a section:</span>
				<select className="input max-w-52" value={addType} onChange={(e) => setAddType(e.target.value as SectionType)}>
					{SECTION_ORDER.map((t) => (
						<option key={t} value={t}>
							{SECTION_META[t].label}
						</option>
					))}
				</select>
				<button className="btn btn-primary" onClick={addSection}>
					<Plus className="w-4 h-4" /> Add
				</button>
			</div>
		</div>
	);
}

/* ---------------- shared ---------------- */
function Labeled({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
	return (
		<label className={`block ${className}`}>
			<span className="field-label">{label}</span>
			{children}
		</label>
	);
}

function EntryCard({
	children,
	onRemove,
	onUp,
	onDown,
}: {
	children: React.ReactNode;
	onRemove: () => void;
	onUp?: () => void;
	onDown?: () => void;
}) {
	return (
		<div className="rounded-lg border border-outline-variant/70 bg-surface-low p-4">
			<div className="flex justify-end gap-1 mb-1">
				{onUp && (
					<button className="btn-ghost p-1.5 rounded" onClick={onUp} aria-label="Move up">
						<ArrowUp className="w-4 h-4" />
					</button>
				)}
				{onDown && (
					<button className="btn-ghost p-1.5 rounded" onClick={onDown} aria-label="Move down">
						<ArrowDown className="w-4 h-4" />
					</button>
				)}
				<button className="btn-ghost p-1.5 rounded text-danger" onClick={onRemove} aria-label="Delete">
					<Trash2 className="w-4 h-4" />
				</button>
			</div>
			{children}
		</div>
	);
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full rounded-lg border border-dashed border-outline-variant py-3 text-primary font-semibold flex items-center justify-center gap-2 hover:bg-surface-low"
		>
			<Plus className="w-4 h-4" /> {label}
		</button>
	);
}
