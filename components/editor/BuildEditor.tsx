'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { Eye, Download, BarChart3, Check, Loader2, X, Share2, Copy } from 'lucide-react';
import type { ResumeData } from '@/lib/types';
import { getTemplate } from '@/lib/templates/registry';
import { analyzeResume } from '@/lib/analyzer/analyze';
import { ensureSession, getCurrentUser } from '@/lib/data/authRepo';
import { createResume, getResume, updateResume } from '@/lib/data/resumesRepo';
import { loadDraft, newDraft, saveDraft, type Draft } from '@/lib/data/draftStore';
import { CollapsibleCard } from './CollapsibleCard';
import {
	PersonalSection,
	ExperienceSection,
	EducationSection,
	SkillsSection,
	ProjectsSection,
	CustomizeSection,
	CustomSectionsEditor,
	SectionOrderEditor,
} from './sections';
import { ResumePaper } from '@/components/resume/ResumePaper';

type SaveState = 'idle' | 'saving' | 'saved';

export function BuildEditor() {
	const params = useSearchParams();
	const [draft, setDraft] = useState<Draft | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [saveState, setSaveState] = useState<SaveState>('idle');
	const [showPreview, setShowPreview] = useState(false);
	const [shareUrl, setShareUrl] = useState<string | null>(null);
	const [sharing, setSharing] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Initialise the working draft.
	useEffect(() => {
		let active = true;
		(async () => {
			const u = await getCurrentUser();
			if (!active) return;
			setUser(u);

			const idParam = params.get('id');
			const templateParam = params.get('template');

			if (idParam) {
				const row = await getResume(idParam);
				if (row && active) {
					setDraft({ id: row.id, title: row.title, templateSlug: row.template_slug, data: row.data });
					return;
				}
			}
			const existing = loadDraft();
			if (existing) {
				// Picking a template applies its full design — clear any prior
				// layout/accent/font overrides so the new template shows through.
				setDraft(
					templateParam && templateParam !== existing.templateSlug
						? {
								...existing,
								templateSlug: templateParam,
								data: { ...existing.data, style: { font: getTemplate(templateParam).font } },
							}
						: existing,
				);
			} else {
				setDraft(newDraft(templateParam ?? 'the-professional', true));
			}
		})();
		return () => {
			active = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Debounced persist (localStorage always; DB when we have a row).
	const persist = useCallback(
		(next: Draft, u: User | null) => {
			saveDraft(next);
			if (timer.current) clearTimeout(timer.current);
			if (u && next.id) {
				setSaveState('saving');
				timer.current = setTimeout(async () => {
					try {
						await updateResume(next.id as string, {
							title: next.title,
							template_slug: next.templateSlug,
							data: next.data,
							ats_score: analyzeResume(next.data).score,
						});
						setSaveState('saved');
					} catch {
						setSaveState('idle');
					}
				}, 900);
			}
		},
		[],
	);

	const apply = (next: Draft) => {
		setDraft(next);
		persist(next, user);
	};
	const update = (fn: (d: ResumeData) => ResumeData) => {
		if (!draft) return;
		apply({ ...draft, data: fn(draft.data) });
	};

	const onSave = async () => {
		if (!draft) return;
		setSaveState('saving');
		try {
			// Start (or reuse) a guest session so saving just works — no email.
			const u = user ?? (await ensureSession());
			if (!user) setUser(u);
			if (draft.id) {
				await updateResume(draft.id, {
					title: draft.title,
					template_slug: draft.templateSlug,
					data: draft.data,
					ats_score: analyzeResume(draft.data).score,
				});
			} else {
				const row = await createResume({
					userId: u.id,
					title: draft.title,
					templateSlug: draft.templateSlug,
					data: draft.data,
					atsScore: analyzeResume(draft.data).score,
				});
				apply({ ...draft, id: row.id });
			}
			setSaveState('saved');
		} catch {
			setSaveState('idle');
		}
	};

	const onShare = async () => {
		if (!draft) return;
		setSharing(true);
		try {
			const u = user ?? (await ensureSession());
			if (!user) setUser(u);
			let rowId = draft.id;
			if (!rowId) {
				const row = await createResume({
					userId: u.id,
					title: draft.title,
					templateSlug: draft.templateSlug,
					data: draft.data,
					atsScore: analyzeResume(draft.data).score,
				});
				rowId = row.id;
				apply({ ...draft, id: rowId });
			} else {
				await updateResume(rowId, {
					title: draft.title,
					template_slug: draft.templateSlug,
					data: draft.data,
				});
			}
			await updateResume(rowId, { is_public: true });
			const url = `${window.location.origin}/r/${rowId}`;
			setShareUrl(url);
			try {
				await navigator.clipboard.writeText(url);
			} catch {
				/* clipboard may be blocked */
			}
		} finally {
			setSharing(false);
		}
	};

	if (!draft) {
		return (
			<div className="flex items-center justify-center py-32 text-outline">
				<Loader2 className="w-6 h-6 animate-spin" />
			</div>
		);
	}

	const score = analyzeResume(draft.data).score;
	const template = getTemplate(draft.templateSlug);

	return (
		<div className="mx-auto max-w-6xl px-4 py-6">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-3 justify-between">
				<div className="flex items-center gap-3 min-w-0">
					<input
						className="input max-w-56 font-semibold"
						value={draft.title}
						onChange={(e) => apply({ ...draft, title: e.target.value })}
						aria-label="Resume title"
					/>
					<Link href="/templates" className="text-sm text-primary font-semibold whitespace-nowrap">
						{template.name} ↗
					</Link>
				</div>
				<div className="flex items-center gap-2">
					<span
						className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold font-[family-name:var(--font-mono)]"
						style={{
							background: score >= 80 ? 'var(--color-success-bg)' : score >= 60 ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
							color: score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)',
						}}
					>
						{score}/100
					</span>
					<button className="btn btn-outline lg:hidden" onClick={() => setShowPreview(true)}>
						<Eye className="w-4 h-4" /> Preview
					</button>
					<Link href="/analyze" className="btn btn-outline">
						<BarChart3 className="w-4 h-4" /> <span className="hidden sm:inline">Analyze</span>
					</Link>
					<Link href="/preview" className="btn btn-outline">
						<Download className="w-4 h-4" /> <span className="hidden sm:inline">PDF</span>
					</Link>
					<button className="btn btn-outline" onClick={onShare} disabled={sharing}>
						{sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
						<span className="hidden sm:inline">Share</span>
					</button>
					<button className="btn btn-primary" onClick={onSave}>
						{saveState === 'saving' ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : saveState === 'saved' ? (
							<Check className="w-4 h-4" />
						) : null}
						Save
					</button>
				</div>
			</div>

			{shareUrl && (
				<div className="mt-3 card p-3 flex items-center gap-2 text-sm">
					<Share2 className="w-4 h-4 text-primary shrink-0" />
					<a href={shareUrl} target="_blank" rel="noopener" className="text-primary truncate flex-1">
						{shareUrl}
					</a>
					<button
						className="btn-ghost p-1.5 rounded"
						onClick={() => navigator.clipboard?.writeText(shareUrl)}
						aria-label="Copy link"
					>
						<Copy className="w-4 h-4" />
					</button>
					<span className="label-caps text-success whitespace-nowrap">Public · copied</span>
				</div>
			)}

			<div className="mt-6 grid lg:grid-cols-[1fr_460px] gap-6 items-start">
				{/* Editor */}
				<div className="space-y-4">
					<CollapsibleCard title="🎨 Design & Customize" defaultOpen={false}>
						<CustomizeSection data={draft.data} update={update} />
					</CollapsibleCard>
					<CollapsibleCard title="↕ Section order" defaultOpen={false}>
						<SectionOrderEditor data={draft.data} update={update} />
					</CollapsibleCard>
					<CollapsibleCard title="Personal Info">
						<PersonalSection
							data={draft.data}
							update={update}
							showPhoto={(draft.data.style?.layout ?? template.layout) === 'twoColumn'}
						/>
					</CollapsibleCard>
					<CollapsibleCard title="Experience">
						<ExperienceSection data={draft.data} update={update} />
					</CollapsibleCard>
					<CollapsibleCard title="Education">
						<EducationSection data={draft.data} update={update} />
					</CollapsibleCard>
					<CollapsibleCard title="Skills">
						<SkillsSection data={draft.data} update={update} />
					</CollapsibleCard>
					<CollapsibleCard title="Projects" defaultOpen={false}>
						<ProjectsSection data={draft.data} update={update} />
					</CollapsibleCard>
					<CollapsibleCard title="➕ Additional sections" defaultOpen={false}>
						<CustomSectionsEditor data={draft.data} update={update} />
					</CollapsibleCard>
				</div>

				{/* Sticky preview (desktop) */}
				<div className="hidden lg:block sticky top-20">
					<div className="card p-4">
						<div className="label-caps text-on-surface-variant mb-2">Live preview</div>
						<ResumePaper data={draft.data} templateSlug={draft.templateSlug} />
					</div>
				</div>
			</div>

			{/* Mobile preview modal */}
			{showPreview && (
				<div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-3" onClick={() => setShowPreview(false)}>
					<div className="bg-surface rounded-xl w-full max-w-md max-h-[88vh] overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-bold text-lg">Preview</h3>
							<button onClick={() => setShowPreview(false)} aria-label="Close">
								<X className="w-5 h-5" />
							</button>
						</div>
						<ResumePaper data={draft.data} templateSlug={draft.templateSlug} />
						<Link href="/preview" className="btn btn-primary w-full mt-4">
							<Download className="w-4 h-4" /> Export PDF
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
