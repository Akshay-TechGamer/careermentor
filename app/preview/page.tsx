'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Download, ArrowLeft, Loader2, FileType2 } from 'lucide-react';
import { loadDraft, type Draft } from '@/lib/data/draftStore';
import { ResumePaper } from '@/components/resume/ResumePaper';
import { downloadResumePdf } from '@/lib/pdf/downloadPdf';
import { downloadDocx } from '@/lib/docx/downloadDocx';

export default function PreviewPage() {
	const [draft, setDraft] = useState<Draft | null>(null);
	const [busy, setBusy] = useState(false);
	const [wordBusy, setWordBusy] = useState(false);
	const sheetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setDraft(loadDraft());
	}, []);

	const onDownload = async () => {
		if (!draft || !sheetRef.current) return;
		setBusy(true);
		try {
			await downloadResumePdf(sheetRef.current, draft.data, draft.templateSlug, draft.title || 'resume');
		} catch (e) {
			alert('Could not generate the PDF. Please try again.');
			console.error(e);
		} finally {
			setBusy(false);
		}
	};

	const onWord = async () => {
		if (!draft) return;
		setWordBusy(true);
		try {
			await downloadDocx(draft.data, draft.title || 'resume');
		} catch (e) {
			console.error(e);
		} finally {
			setWordBusy(false);
		}
	};

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
			<div className="no-print sticky top-16 z-30 bg-surface/90 backdrop-blur border-b border-outline-variant/50">
				<div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
					<Link href="/build" className="btn btn-ghost">
						<ArrowLeft className="w-4 h-4" /> Back
					</Link>
					<div className="flex items-center gap-2">
						<button className="btn btn-outline" onClick={onWord} disabled={wordBusy}>
							{wordBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileType2 className="w-4 h-4" />}
							<span className="hidden sm:inline">Word</span>
						</button>
						<button className="btn btn-primary" onClick={onDownload} disabled={busy}>
							{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
							Download PDF
						</button>
					</div>
				</div>
			</div>

			<div className="py-8 px-4 bg-surface-dim/40">
				<div className="mx-auto w-full max-w-[794px]">
					<ResumePaper data={draft.data} templateSlug={draft.templateSlug} sheetRef={sheetRef} />
				</div>
			</div>
		</div>
	);
}
