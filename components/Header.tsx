'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, UserCircle2 } from 'lucide-react';
import { getCurrentUser, onAuthChange } from '@/lib/data/authRepo';

const NAV = [
	{ href: '/build', label: 'Build' },
	{ href: '/templates', label: 'Templates' },
	{ href: '/analyze', label: 'Analyze' },
	{ href: '/cover-letter', label: 'Cover Letter' },
	{ href: '/profile', label: 'Profile' },
];

export function Header() {
	const pathname = usePathname();
	const [initial, setInitial] = useState<string | null>(null);

	useEffect(() => {
		getCurrentUser().then((u) => setInitial(u?.email?.[0]?.toUpperCase() ?? null));
		return onAuthChange((u) => setInitial(u?.email?.[0]?.toUpperCase() ?? null));
	}, []);

	return (
		<header className="sticky top-0 z-40 bg-surface/90 backdrop-blur border-b border-outline-variant/50">
			<div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
				<Link href="/" className="flex items-center gap-2 text-primary font-extrabold text-xl">
					<FileText className="w-6 h-6" strokeWidth={2.4} />
					<span className="font-[family-name:var(--font-display)]">CareerMentor</span>
				</Link>

				<nav className="hidden md:flex items-center gap-7">
					{NAV.map((item) => {
						const active = pathname === item.href || pathname.startsWith(item.href + '/');
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`text-sm font-semibold transition ${
									active ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
								}`}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<Link
					href="/profile"
					aria-label="Profile"
					className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary"
				>
					{initial ? (
						<span className="font-semibold text-sm">{initial}</span>
					) : (
						<UserCircle2 className="w-6 h-6" />
					)}
				</Link>
			</div>
		</header>
	);
}
