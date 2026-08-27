import type { Template } from '@/lib/templates/registry';

// A lightweight, self-contained visual preview of a template (no external
// images). Reflects the layout + accent so each template looks distinct.

function Lines({ n, className = '' }: { n: number; className?: string }) {
	return (
		<div className={`space-y-1 ${className}`}>
			{Array.from({ length: n }).map((_, i) => (
				<div
					key={i}
					className="h-1 rounded-full bg-black/10"
					style={{ width: `${90 - (i % 3) * 18}%` }}
				/>
			))}
		</div>
	);
}

export function TemplateThumb({ template }: { template: Template }) {
	const accent = template.accent;
	return (
		<div className="aspect-[4/3] p-5 flex items-center justify-center">
			<div className="w-full max-w-[220px] aspect-[1/1.3] bg-white rounded shadow-sm overflow-hidden text-[6px]">
				{template.layout === 'twoColumn' ? (
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
				) : (
					<div className="h-full p-3">
						<div
							className={template.layout === 'academic' ? 'text-center' : ''}
						>
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
						<div className="mt-2.5">
							<div className="h-1 w-1/4 rounded" style={{ background: accent }} />
							<Lines n={3} className="mt-1" />
						</div>
						<div className="mt-2.5">
							<div className="h-1 w-1/4 rounded" style={{ background: accent }} />
							<Lines n={3} className="mt-1" />
						</div>
						<div className="mt-2.5">
							<div className="h-1 w-1/4 rounded" style={{ background: accent }} />
							<Lines n={2} className="mt-1" />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
