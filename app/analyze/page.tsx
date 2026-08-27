'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
	CircleAlert,
	TriangleAlert,
	CircleCheck,
	Sparkles,
	ArrowRight,
	Upload,
	Loader2,
	X,
	Wand2,
	FilePlus2,
} from 'lucide-react';
import type { ResumeData } from '@/lib/types';
import { analyzeResume, analyzeText, type AnalysisResult, type BreakdownItem } from '@/lib/analyzer/analyze';
import { loadDraft, saveDraft, type Draft } from '@/lib/data/draftStore';
import { extractText, ACCEPTED } from '@/lib/upload/extractText';
import { parseResumeText } from '@/lib/upload/parseResume';
import { getTemplate, recommendTemplate } from '@/lib/templates/registry';
import { ScoreGauge } from '@/components/analysis/ScoreGauge';
import { TemplateThumb } from '@/components/templates/TemplateThumb';

const STATUS = {
	critical: { bar: 'var(--color-danger)', bg: 'var(--color-danger-bg)', fg: 'var(--color-danger)', Icon: CircleAlert },
	warning: { bar: 'var(--color-warning)', bg: 'var(--color-warning-bg)', fg: 'var(--color-warning)', Icon: TriangleAlert },
	perfect: { bar: 'var(--color-success)', bg: 'var(--color-success-bg)', fg: 'var(--color-success)', Icon: CircleCheck },
} as const;

function ScoreHeader({ result }: { result: AnalysisResult }) {
	return (
		<div className="text-center">
			<div className="flex justify-center">
				<ScoreGauge score={result.score} />
			</div>
			<div className="mt-4 flex justify-center gap-3">
				<span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold font-[family-name:var(--font-mono)]" style={{ background: STATUS.critical.bg, color: STATUS.critical.fg }}>
					<CircleAlert className="w-4 h-4" /> {result.critical} Critical
				</span>
				<span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold font-[family-name:var(--font-mono)]" style={{ background: STATUS.warning.bg, color: STATUS.warning.fg }}>
					<TriangleAlert className="w-4 h-4" /> {result.warnings} Warnings
				</span>
			</div>
		</div>
	);
}

function BreakdownCard({ item, onFixAll }: { item: BreakdownItem; onFixAll?: (i: BreakdownItem) => void }) {
	const s = STATUS[item.status];
	return (
		<div className="card p-5 border-l-4" style={{ borderLeftColor: s.bar }}>
			<div className="flex items-start justify-between gap-3">
				<h3 className="flex items-center gap-2 font-bold text-lg">
					<s.Icon className="w-5 h-5" style={{ color: s.bar }} /> {item.title}
				</h3>
				<span className="label-caps rounded-full px-2.5 py-1 whitespace-nowrap" style={{ background: s.bg, color: s.fg }}>
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
					{onFixAll && (
						<button className="btn btn-primary w-full mt-1" onClick={() => onFixAll(item)}>
							Fix All ({item.fixes.length})
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export default function AnalyzePage() {
	const router = useRouter();
	const [draft, setDraft] = useState<Draft | null>(null);
	const [jd, setJd] = useState('');

	// upload flow
	const [uploading, setUploading] = useState(false);
	const [uploadName, setUploadName] = useState('');
	const [uploadText, setUploadText] = useState('');
	const [uploadResult, setUploadResult] = useState<AnalysisResult | null>(null);
	const [recommended, setRecommended] = useState<string | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);

	useEffect(() => {
		setDraft(loadDraft());
	}, []);

	const draftResult = useMemo(() => (draft ? analyzeResume(draft.data, jd) : null), [draft, jd]);

	const onUpload = async (file: File) => {
		setUploadError(null);
		setUploading(true);
		try {
			const text = await extractText(file);
			if (text.trim().length < 40) {
				throw new Error('Could not read enough text from that file. Try a text-based PDF or DOCX.');
			}
			setUploadText(text);
			setUploadResult(analyzeText(text));
			setRecommended(recommendTemplate(text));
			setUploadName(file.name);
		} catch (e) {
			setUploadError(e instanceof Error ? e.message : 'Could not analyze that file.');
		} finally {
			setUploading(false);
		}
	};

	const onImport = () => {
		const parsed = parseResumeText(uploadText);
		const next: Draft = {
			id: null,
			title: parsed.personal.fullName ? `${parsed.personal.fullName}'s Resume` : 'Imported Resume',
			templateSlug: recommended ?? 'the-professional',
			data: parsed,
		};
		saveDraft(next);
		router.push('/build');
	};

	const applyFix = (before: string, after: string) => {
		if (!draft) return;
		const data: ResumeData = structuredClone(draft.data);
		if (data.personal.summary === before) data.personal.summary = after;
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
	const applyAll = (item: BreakdownItem) => item.fixes.forEach((f) => applyFix(f.before, f.after));

	return (
		<div className="mx-auto max-w-3xl px-4 py-8">
			<h1 className="text-2xl md:text-3xl font-bold">Resume Analyzer</h1>
			<p className="mt-1 text-on-surface-variant">Free ATS-style scoring and one-click improvements.</p>

			{/* Upload card */}
			<div className="card p-5 mt-5">
				<label className="flex items-center gap-2 font-bold">
					<Upload className="w-5 h-5 text-primary" /> Already have a resume?
				</label>
				<p className="text-sm text-on-surface-variant mt-1">
					Upload a PDF, DOCX or TXT — or your LinkedIn profile (open it, “More → Save to PDF”)
					— for instant analysis, a template recommendation, and one-click import.
				</p>
				<label className="btn btn-outline mt-3 cursor-pointer">
					{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
					{uploading ? 'Reading…' : 'Upload resume'}
					<input
						type="file"
						accept={ACCEPTED}
						className="hidden"
						disabled={uploading}
						onChange={(e) => {
							const f = e.target.files?.[0];
							if (f) onUpload(f);
							e.target.value = '';
						}}
					/>
				</label>
				{uploadError && <p className="mt-3 text-danger text-sm font-semibold">{uploadError}</p>}
			</div>

			{/* Uploaded-resume result */}
			{uploadResult && (
				<div className="mt-6">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold">Analysis of “{uploadName}”</h2>
						<button className="btn-ghost p-2 rounded" onClick={() => setUploadResult(null)} aria-label="Dismiss">
							<X className="w-5 h-5" />
						</button>
					</div>
					<div className="card p-6 mt-3">
						<ScoreHeader result={uploadResult} />
					</div>

					<button className="btn btn-primary w-full mt-4" onClick={onImport}>
						<FilePlus2 className="w-4 h-4" /> Import into the editor to fix &amp; improve
					</button>

					{recommended && (
						<div className="card p-5 mt-4 flex items-center gap-4">
							<div className="w-28 shrink-0 rounded-lg overflow-hidden bg-surface-container">
								<TemplateThumb template={getTemplate(recommended)} />
							</div>
							<div className="min-w-0">
								<div className="label-caps text-primary flex items-center gap-1.5">
									<Wand2 className="w-3.5 h-3.5" /> Recommended template
								</div>
								<h3 className="text-lg font-bold mt-1">{getTemplate(recommended).name}</h3>
								<p className="text-sm text-on-surface-variant">{getTemplate(recommended).blurb}</p>
								<Link href={`/build?template=${recommended}`} className="btn btn-primary mt-3">
									Build with this template <ArrowRight className="w-4 h-4" />
								</Link>
							</div>
						</div>
					)}

					<div className="space-y-4 mt-4">
						{uploadResult.breakdown.map((item) => (
							<BreakdownCard key={item.key} item={item} />
						))}
					</div>
				</div>
			)}

			{/* Current-resume analysis */}
			{!uploadResult && draftResult && (
				<div className="mt-6">
					<div className="card p-6 md:p-8 text-center">
						<h2 className="text-xl md:text-2xl font-bold">Your current resume</h2>
						<p className="mt-1 text-on-surface-variant">
							{draftResult.score >= 80 ? 'Strong — well optimized for ATS.' : draftResult.score >= 60 ? 'Good start — a few fixes will help.' : 'Needs some improvements to stand out.'}
						</p>
						<div className="mt-5">
							<ScoreHeader result={draftResult} />
						</div>
					</div>

					<div className="card p-5 mt-6">
						<label className="flex items-center gap-2 font-bold">
							<Sparkles className="w-5 h-5 text-primary" /> Tailor to a job
						</label>
						<p className="text-sm text-on-surface-variant mt-1">Paste a job description to check keyword match.</p>
						<textarea className="input min-h-24 mt-3" placeholder="Paste the job description here…" value={jd} onChange={(e) => setJd(e.target.value)} />
					</div>

					<h2 className="text-xl font-bold mt-8 mb-3">Analysis Breakdown</h2>
					<div className="space-y-4">
						{draftResult.breakdown.map((item) => (
							<BreakdownCard key={item.key} item={item} onFixAll={applyAll} />
						))}
					</div>

					<div className="mt-8 flex gap-3">
						<Link href="/build" className="btn btn-outline flex-1">Back to editor</Link>
						<Link href="/preview" className="btn btn-primary flex-1">Export PDF</Link>
					</div>
				</div>
			)}

			{!uploadResult && !draftResult && (
				<div className="mt-10 text-center">
					<p className="text-on-surface-variant">Build a resume or upload one above to see your score.</p>
					<Link href="/build" className="btn btn-primary mt-5 mx-auto">
						Start building <ArrowRight className="w-4 h-4" />
					</Link>
				</div>
			)}
		</div>
	);
}
