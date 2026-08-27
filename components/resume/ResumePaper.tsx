'use client';

import { useEffect, useRef, useState } from 'react';
import type { ResumeData } from '@/lib/types';
import { ResumeRenderer } from './ResumeRenderer';

const A4_W = 794; // px @96dpi
const A4_H = 1123;

// Renders the resume at true A4 width, scaled to fit the container. The sheet is
// always at least one full A4 page (the renderer enforces the minimum height)
// and grows when content runs onto more pages.
export function ResumePaper({
	data,
	templateSlug,
	className = '',
}: {
	data: ResumeData;
	templateSlug: string;
	className?: string;
}) {
	const outerRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0.5);
	const [height, setHeight] = useState(A4_H);

	useEffect(() => {
		const outer = outerRef.current;
		const inner = innerRef.current;
		if (!outer || !inner) return;
		const update = () => {
			setScale(outer.clientWidth / A4_W);
			setHeight(Math.max(inner.offsetHeight, A4_H));
		};
		const ro = new ResizeObserver(update);
		ro.observe(outer);
		ro.observe(inner);
		update();
		return () => ro.disconnect();
	}, []);

	return (
		<div ref={outerRef} className={`w-full ${className}`} style={{ height: height * scale }}>
			<div
				ref={innerRef}
				className="origin-top-left shadow-[var(--shadow-card)] bg-white"
				style={{ width: A4_W, transform: `scale(${scale})` }}
			>
				<ResumeRenderer data={data} templateSlug={templateSlug} />
			</div>
		</div>
	);
}
