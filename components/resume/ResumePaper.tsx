'use client';

import { useEffect, useRef, useState } from 'react';
import type { ResumeData } from '@/lib/types';
import { ResumeRenderer } from './ResumeRenderer';

const A4_W = 794; // px @96dpi
const A4_H = 1123;

// Renders the resume at true A4 size, scaled to fit the container width so the
// live preview matches the exported PDF proportions.
export function ResumePaper({
	data,
	templateSlug,
	className = '',
}: {
	data: ResumeData;
	templateSlug: string;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0.5);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const ro = new ResizeObserver(() => {
			setScale(el.clientWidth / A4_W);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	return (
		<div ref={ref} className={`w-full ${className}`} style={{ height: A4_H * scale }}>
			<div
				className="origin-top-left shadow-[var(--shadow-card)]"
				style={{ width: A4_W, height: A4_H, transform: `scale(${scale})` }}
			>
				<ResumeRenderer data={data} templateSlug={templateSlug} />
			</div>
		</div>
	);
}
