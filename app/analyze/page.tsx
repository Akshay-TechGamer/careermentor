'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CircleAlert, TriangleAlert, CircleCheck, Sparkles, ArrowRight } from 'lucide-react';
import type { ResumeData } from '@/lib/types';
import { analyzeResume, type BreakdownItem } from '@/lib/analyzer/analyze';
import { loadDraft, saveDraft, type Draft } from '@/lib/data/draftStore';
import { ScoreGauge } from '@/components/analysis/ScoreGauge';

const STATUS_STYLE: Record<string, { bar: string; chipBg: string; chipFg: string; Icon: typeof CircleCheck }> = {
	critical: { bar: 'var(--color-danger)', chipBg: 'var(--color-danger-bg)', chipFg: 'var(--color-danger)', Icon: CircleAlert },
	warning: { bar: 'var(--color-warning)', chipBg: 'var(--color-warning-bg)', chipFg: 'var(--color-warning)', Icon: TriangleAlert },
	perfect: { bar: 'var(--color-success)', chipBg: 'var(--color-success-bg)', chipFg: 'var(--color-success)', Icon: CircleCheck },
};

export default function AnalyzePage() {
	const [draft, setDraft] = useState<Draft | null>(null);
	const [jd, setJd] = useState('');

	useEffect(() => {
		setDraft(loadDraft());
	}, []);

	const result = useMemo(
		() => (draft ? analyzeResume(draft.data, jd) : null),
		[draft, jd],
	);

	const applyFix = (before: string, after: string) => {
		if (!draft) return;
		const data: ResumeData = structuredClone(draft.data);
		if (data.personal.summary === before) {
			data.personal.summary = after;
		}
		data.experience.forEach((e) => {
			e.bullets = e.bullets.map((b) => (b === before ? after : b));
		});
		data.education.forEach((e) => {
			if (e.details === before) e.details = after;
		});
		const next = { ...draft, data };
		setDraft(next);
		saveDraft(next);
	};

	const applyAll = (item: BreakdownItem) => {
		item.fixes.forEach((f) => applyFix(f.before, f.after));
	};

	if (!draft) {
		return (
			<div className="mx-auto max-w-lg px-4 py-24 text-center">
				<h1 className="text-2xl font-bold">Nothing to analyze yet</h1>
				<p className="mt-2 text-on-surface-variant">Build a resume first, then come back for your ATS score.</p>
				<Link href="/build" className="btn btn-primary mt-6 mx-auto">
					Start building <ArrowRight className="w-4 h-4" />
				</Link>
			</div>
		);
	}

	const r = result!;
	return (
		<div className="mx-auto max-w-3xl px-4 py-8">
			{/* Score card */}
			<div className="card p-6 md:p-8 text-center">
				<h1 className="text-2xl md:text-3xl font-bold">Resume Score</h1>
				<p className="mt-1 text-on-surface-variant">
					{r.score >= 80
						? 'Strong — your resume is well optimized for ATS systems.'
						: r.score >= 60
							? 'Good start — a few improvements will help you stand out.'
							: 'Your resume needs some improvements to stand out to ATS systems.'}
				</p>
				<div className="mt-6 flex justify-center">
					<ScoreGauge score={r.score} />
				</div>
				<div className="mt-6 flex justify-center gap-3">
					<span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold font-[family-name:var(--font-mono)]" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
						<CircleAlert className="w-4 h-4" /> {r.critical} Critical
					</span>
					<span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold font-[family-name:var(--font-mono)]" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
						<TriangleAlert className="w-4 h-4" /> {r.warnings} Warnings
					</span>
				</div>
			</div>

			{/* Job-description keyword match */}
			<div className="card p-5 mt-6">
				<label className="flex items-center gap-2 font-bold">
					<Sparkles className="w-5 h-5 text-primary" /> Tailor to a job
				</label>
				<p className="text-sm text-on-surface-variant mt-1">
					Paste a job description to check keyword match against your resume.
				</p>
				<textarea
					className="input min-h-24 mt-3"
					placeholder="Paste the job description here…"
					value={jd}
					onChange={(e) => setJd(e.target.value)}
				/>
			</div>

			<h2 className="text-xl font-bold mt-8 mb-3">Analysis Breakdown</h2>
			<div className="space-y-4">
				{r.breakdown.map((item) => {
					const s = STATUS_STYLE[item.status];
					return (
						<div key={item.key} className="card p-5 border-l-4" style={{ borderLeftColor: s.bar }}>
							<div className="flex items-start justify-between gap-3">
								<h3 className="flex items-center gap-2 font-bold text-lg">
									<s.Icon className="w-5 h-5" style={{ color: s.bar }} /> {item.title}
								</h3>
								<span className="label-caps rounded-full px-2.5 py-1 whitespace-nowrap" style={{ background: s.chipBg, color: s.chipFg }}>
									{item.chip}
								</span>
							</div>
							<p className="mt-2 text-on-surface-variant">{item.message}</p>

							{item.fixes.length > 0 && (
								<div className="mt-3 rounded-lg bg-surface-low p-3 space-y-2">
									<p className="text-sm line-through opacity-60">{item.fixes[0].before}</p>
									<p className="text-sm text-primary flex items-start gap-1.5">
										<ArrowRight className="w-4 h-4 mt-0.5 shrink-0" /> {item.fixes[0].after}
									</p>
									<button className="btn btn-primary w-full mt-1" onClick={() => applyAll(item)}>
										Fix All ({item.fixes.length})
									</button>
								</div>
							)}
						</div>
					);
				})}
			</div>

			<div className="mt-8 flex gap-3">
				<Link href="/build" className="btn btn-outline flex-1">Back to editor</Link>
				<Link href="/preview" className="btn btn-primary flex-1">Export PDF</Link>
			</div>
		</div>
	);
}
