'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import { loadDraft, type Draft } from '@/lib/data/draftStore';
import { ResumeRenderer } from '@/components/resume/ResumeRenderer';

export default function PreviewPage() {
	const [draft, setDraft] = useState<Draft | null>(null);

	useEffect(() => {
		setDraft(loadDraft());
	}, []);

	if (!draft) {
		return (
			<div className="mx-auto max-w-lg px-4 py-24 text-center">
				<h1 className="text-2xl font-bold">No resume found</h1>
				<Link href="/build" className="btn btn-primary mt-6 mx-auto">
					Build one
				</Link>
			</div>
		);
	}

	return (
		<div>
			{/* Toolbar */}
			<div className="no-print sticky top-16 z-30 bg-surface/90 backdrop-blur border-b border-outline-variant/50">
				<div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
					<Link href="/build" className="btn btn-ghost">
						<ArrowLeft className="w-4 h-4" /> Back
					</Link>
					<div className="text-sm text-on-surface-variant hidden sm:block">
						Tip: choose “Save as PDF” in the print dialog.
					</div>
					<button className="btn btn-primary" onClick={() => window.print()}>
						<Download className="w-4 h-4" /> Download PDF
					</button>
				</div>
			</div>

			{/* A4 sheet */}
			<div className="py-8 px-4 flex justify-center bg-surface-dim/40">
				<div
					className="print-sheet bg-white shadow-[var(--shadow-card)]"
					style={{ width: 794, minHeight: 1123 }}
				>
					<ResumeRenderer data={draft.data} templateSlug={draft.templateSlug} />
				</div>
			</div>
		</div>
	);
}
