'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Wand2, Download, Copy, Check, ArrowRight, Loader2 } from 'lucide-react';
import { loadDraft, type Draft } from '@/lib/data/draftStore';
import { generateCoverLetter, type Tone } from '@/lib/cover/coverLetter';
import { downloadTextPdf } from '@/lib/pdf/downloadPdf';

const TONES: { key: Tone; label: string }[] = [
	{ key: 'professional', label: 'Professional' },
	{ key: 'warm', label: 'Warm' },
	{ key: 'confident', label: 'Confident' },
];

export default function CoverLetterPage() {
	const [draft, setDraft] = useState<Draft | null>(null);
	const [company, setCompany] = useState('');
	const [jobTitle, setJobTitle] = useState('');
	const [manager, setManager] = useState('');
	const [tone, setTone] = useState<Tone>('professional');
	const [letter, setLetter] = useState('');
	const [copied, setCopied] = useState(false);
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		setDraft(loadDraft());
	}, []);

	const generate = () => {
		if (!draft) return;
		setLetter(generateCoverLetter(draft.data, { company, jobTitle, manager, tone }));
	};

	const copy = async () => {
		await navigator.clipboard.writeText(letter);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const download = async () => {
		setBusy(true);
		try {
			await downloadTextPdf(letter, `${draft?.title || 'cover'}-letter`);
		} finally {
			setBusy(false);
		}
	};

	if (!draft) {
		return (
			<div className="mx-auto max-w-lg px-4 py-24 text-center">
				<h1 className="text-2xl font-bold">Build a resume first</h1>
				<p className="mt-2 text-on-surface-variant">
					Your cover letter is generated from your resume details.
				</p>
				<Link href="/build" className="btn btn-primary mt-6 mx-auto">
					Start building <ArrowRight className="w-4 h-4" />
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-3xl px-4 py-8">
			<h1 className="text-2xl md:text-3xl font-bold">Cover Letter Generator</h1>
			<p className="mt-1 text-on-surface-variant">
				Instantly draft a tailored cover letter from your resume — free, no AI cost.
			</p>

			<div className="card p-5 mt-6 grid gap-4 sm:grid-cols-2">
				<label className="block">
					<span className="field-label">Company</span>
					<input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" />
				</label>
				<label className="block">
					<span className="field-label">Job title</span>
					<input className="input" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Senior Engineer" />
				</label>
				<label className="block sm:col-span-2">
					<span className="field-label">Hiring manager (optional)</span>
					<input className="input" value={manager} onChange={(e) => setManager(e.target.value)} placeholder="e.g. Priya Sharma" />
				</label>
				<div className="sm:col-span-2">
					<span className="field-label">Tone</span>
					<div className="flex gap-2">
						{TONES.map((t) => (
							<button key={t.key} className={`chip ${tone === t.key ? 'chip-on' : ''}`} onClick={() => setTone(t.key)}>
								{t.label}
							</button>
						))}
					</div>
				</div>
				<div className="sm:col-span-2">
					<button className="btn btn-primary w-full" onClick={generate}>
						<Wand2 className="w-4 h-4" /> {letter ? 'Regenerate' : 'Generate cover letter'}
					</button>
				</div>
			</div>

			{letter && (
				<div className="mt-6">
					<textarea
						className="input min-h-[420px] font-[family-name:var(--font-body)] leading-relaxed"
						value={letter}
						onChange={(e) => setLetter(e.target.value)}
					/>
					<div className="flex gap-3 mt-3">
						<button className="btn btn-outline flex-1" onClick={copy}>
							{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy'}
						</button>
						<button className="btn btn-primary flex-1" onClick={download} disabled={busy}>
							{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download PDF
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
