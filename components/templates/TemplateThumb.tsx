import type { Template } from '@/lib/templates/registry';

// A lightweight, self-contained visual preview of a template (no external
// images). Reflects the layout + accent so each template looks distinct.

function Lines({ n, className = '' }: { n: number; className?: string }) {
	return (
		<div className={`space-y-1 ${className}`}>
			{Array.from({ length: n }).map((_, i) => (
				<div key={i} className="h-1 rounded-full bg-black/10" style={{ width: `${90 - (i % 3) * 18}%` }} />
			))}
		</div>
	);
}

function Bars({ n, accent }: { n: number; accent: string }) {
	return (
		<div className="space-y-1">
			{Array.from({ length: n }).map((_, i) => (
				<div key={i} className="h-1 rounded-full bg-black/10">
					<div className="h-1 rounded-full" style={{ width: `${60 + (i % 3) * 15}%`, background: accent }} />
				</div>
			))}
		</div>
	);
}

export function TemplateThumb({ template }: { template: Template }) {
	const accent = template.accent;
	const layout = template.layout;

	const inner = () => {
		if (layout === 'twoColumn') {
			return (
				<div className="flex h-full">
					<div className="w-1/3 h-full p-2" style={{ background: accent }}>
						<div className="w-8 h-8 rounded-full bg-white/30 mx-auto" />
						<div className="mt-2 space-y-1">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="h-1 rounded-full bg-white/40" style={{ width: `${80 - i * 8}%` }} />
							))}
						</div>
					</div>
					<div className="flex-1 p-2.5">
						<div className="h-1.5 w-3/5 rounded" style={{ background: accent }} />
						<div className="mt-1 h-1 w-2/5 rounded-full bg-black/20" />
						<div className="mt-3">
							<Lines n={4} />
						</div>
						<div className="mt-3">
							<Lines n={4} />
						</div>
					</div>
				</div>
			);
		}
		if (layout === 'headerBand') {
			return (
				<div className="h-full">
					<div className="p-2 text-center" style={{ background: accent }}>
						<div className="w-6 h-6 rounded-full bg-white/30 mx-auto" />
						<div className="mt-1 h-1.5 w-1/2 rounded bg-white/60 mx-auto" />
						<div className="mt-1 h-1 w-1/3 rounded-full bg-white/40 mx-auto" />
					</div>
					<div className="p-3">
						<div className="h-1 w-1/4 rounded" style={{ background: accent }} />
						<Lines n={3} className="mt-1" />
						<div className="h-1 w-1/4 rounded mt-3" style={{ background: accent }} />
						<Lines n={3} className="mt-1" />
					</div>
				</div>
			);
		}
		if (layout === 'sidebarLeft') {
			return (
				<div className="h-full p-3">
					<div className="h-2 w-3/5 rounded" style={{ background: accent }} />
					<div className="mt-2 h-px w-full" style={{ background: `${accent}55` }} />
					<div className="flex gap-2 mt-2">
						<div className="w-1/3">
							<div className="h-1 w-3/4 rounded mb-1" style={{ background: accent }} />
							<Bars n={4} accent={accent} />
						</div>
						<div className="flex-1">
							<div className="h-1 w-1/3 rounded" style={{ background: accent }} />
							<Lines n={4} className="mt-1" />
						</div>
					</div>
				</div>
			);
		}
		if (layout === 'sidebarRight') {
			return (
				<div className="h-full p-3">
					<div className="flex items-start justify-between">
						<div className="h-2 w-2/5 rounded" style={{ background: accent }} />
						<div className="w-5 h-5 rounded-full bg-black/10" />
					</div>
					<div className="mt-2 h-px w-full" style={{ background: `${accent}55` }} />
					<div className="flex gap-2 mt-2">
						<div className="flex-1">
							<div className="h-1 w-1/3 rounded" style={{ background: accent }} />
							<Lines n={4} className="mt-1" />
						</div>
						<div className="w-1/3">
							<div className="h-1 w-3/4 rounded mb-1" style={{ background: accent }} />
							<Bars n={4} accent={accent} />
						</div>
					</div>
				</div>
			);
		}
		if (layout === 'labelLeft') {
			return (
				<div className="h-full p-3">
					<div className="h-1.5 w-1/2 rounded mx-auto" style={{ background: accent }} />
					<div className="mt-3 space-y-2">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex gap-2 border-t border-black/10 pt-1.5">
								<div className="w-1/4 h-1 rounded" style={{ background: accent }} />
								<div className="flex-1">
									<Lines n={2} />
								</div>
							</div>
						))}
					</div>
				</div>
			);
		}
		// classic / academic
		return (
			<div className="h-full p-3">
				<div className={template.layout === 'academic' ? 'text-center' : ''}>
					<div
						className="h-2 w-1/2 rounded"
						style={{ background: accent, marginInline: template.layout === 'academic' ? 'auto' : '' }}
					/>
					<div
						className="mt-1 h-1 w-1/3 rounded-full bg-black/20"
						style={{ marginInline: template.layout === 'academic' ? 'auto' : '' }}
					/>
				</div>
				<div className="mt-2 h-px w-full" style={{ background: accent, opacity: 0.4 }} />
				{[0, 1, 2].map((i) => (
					<div key={i} className="mt-2.5">
						<div className="h-1 w-1/4 rounded" style={{ background: accent }} />
						<Lines n={i === 2 ? 2 : 3} className="mt-1" />
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="aspect-[4/3] p-5 flex items-center justify-center">
			<div className="w-full max-w-[220px] aspect-[1/1.3] bg-white rounded shadow-sm overflow-hidden text-[6px]">
				{inner()}
			</div>
		</div>
	);
}
