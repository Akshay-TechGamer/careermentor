'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getResume } from '@/lib/data/resumesRepo';
import type { ResumeRow } from '@/lib/types';
import { ResumePaper } from '@/components/resume/ResumePaper';
import { downloadResumePdf } from '@/lib/pdf/downloadPdf';

export default function PublicResumePage() {
	const params = useParams<{ id: string }>();
	const [row, setRow] = useState<ResumeRow | null | undefined>(undefined);
	const [busy, setBusy] = useState(false);
	const sheetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		getResume(params.id)
			.then((r) => setRow(r))
			.catch(() => setRow(null));
	}, [params.id]);

	if (row === undefined) {
		return (
			<div className="flex justify-center py-32 text-outline">
				<Loader2 className="w-6 h-6 animate-spin" />
			</div>
		);
	}

	if (!row) {
		return (
			<div className="mx-auto max-w-lg px-4 py-24 text-center">
				<h1 className="text-2xl font-bold">Resume not found</h1>
				<p className="mt-2 text-on-surface-variant">This resume is private or the link is invalid.</p>
				<Link href="/" className="btn btn-primary mt-6 mx-auto">
					Build your own — free
				</Link>
			</div>
		);
	}

	const download = async () => {
		if (!sheetRef.current) return;
		setBusy(true);
		try {
			await downloadResumePdf(sheetRef.current, row.data, row.template_slug, row.title);
		} finally {
			setBusy(false);
		}
	};

	return (
		<div>
			<div className="sticky top-16 z-30 bg-surface/90 backdrop-blur border-b border-outline-variant/50">
				<div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
					<span className="font-semibold truncate">{row.title}</span>
					<button className="btn btn-primary" onClick={download} disabled={busy}>
						{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
						Download PDF
					</button>
				</div>
			</div>

			<div className="py-8 px-4 bg-surface-dim/40">
				<div className="mx-auto w-full max-w-[794px]">
					<ResumePaper data={row.data} templateSlug={row.template_slug} sheetRef={sheetRef} />
				</div>
			</div>

			<div className="text-center pb-10">
				<Link href="/" className="text-sm text-primary font-semibold">
					Made with CareerMentor — build your own free →
				</Link>
			</div>
		</div>
	);
}
