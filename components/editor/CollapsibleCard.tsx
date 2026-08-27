'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function CollapsibleCard({
	title,
	action,
	defaultOpen = true,
	children,
}: {
	title: string;
	action?: ReactNode;
	defaultOpen?: boolean;
	children: ReactNode;
}) {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<section className="card p-5 md:p-6">
			<div className="flex items-center justify-between gap-3">
				<button
					type="button"
					className="flex items-center gap-2 text-left"
					onClick={() => setOpen((o) => !o)}
				>
					<h2 className="text-xl font-bold">{title}</h2>
					<ChevronDown
						className={`w-5 h-5 text-outline transition ${open ? 'rotate-180' : ''}`}
					/>
				</button>
				<div className="flex items-center gap-2">{action}</div>
			</div>
			{open && <div className="mt-4">{children}</div>}
		</section>
	);
}
