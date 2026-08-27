'use client';

import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type {
	EducationItem,
	ExperienceItem,
	ProjectItem,
	ResumeData,
} from '@/lib/types';

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
export function PersonalSection({ data, update }: { data: ResumeData; update: Update }) {
	const p = data.personal;
	const set = (patch: Partial<typeof p>) =>
		update((d) => ({ ...d, personal: { ...d.personal, ...patch } }));
	return (
		<div className="grid gap-4 sm:grid-cols-2">
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
