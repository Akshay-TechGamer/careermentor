'use client';

import { useEffect, useRef, useState } from 'react';
import type { ResumeData } from '@/lib/types';
import { ResumeRenderer } from './ResumeRenderer';

const A4_W = 794; // px @96dpi

// Renders the resume at true A4 width, scaled to fit the container, and sized to
// the content height (so short resumes don't leave a big empty coloured area).
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
	const [height, setHeight] = useState(600);

	useEffect(() => {
		const outer = outerRef.current;
		const inner = innerRef.current;
		if (!outer || !inner) return;
		const update = () => {
			setScale(outer.clientWidth / A4_W);
			setHeight(Math.max(inner.offsetHeight, 300));
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
