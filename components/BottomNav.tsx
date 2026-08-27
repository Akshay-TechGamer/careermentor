'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PencilRuler, LayoutGrid, BarChart3, UserCircle2 } from 'lucide-react';

const TABS = [
	{ href: '/build', label: 'Build', Icon: PencilRuler },
	{ href: '/templates', label: 'Templates', Icon: LayoutGrid },
	{ href: '/analyze', label: 'Analyze', Icon: BarChart3 },
	{ href: '/profile', label: 'Profile', Icon: UserCircle2 },
];

export function BottomNav() {
	const pathname = usePathname();
	return (
		<nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-lowest border-t border-outline-variant/60">
			<div className="mx-auto max-w-lg grid grid-cols-4">
				{TABS.map(({ href, label, Icon }) => {
					const active = pathname === href || pathname.startsWith(href + '/');
					return (
						<Link
							key={href}
							href={href}
							className={`flex flex-col items-center gap-1 py-2.5 text-xs font-semibold transition ${
								active ? 'text-primary' : 'text-on-surface-variant'
							}`}
						>
							<span
								className={`flex items-center justify-center rounded-lg px-4 py-1 ${
									active ? 'bg-surface-high' : ''
								}`}
							>
								<Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
							</span>
							{label}
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
