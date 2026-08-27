import Link from 'next/link';

export function Footer() {
	return (
		<footer className="hidden md:block border-t border-outline-variant/50 bg-surface-low mt-16">
			<div className="mx-auto max-w-6xl px-4 py-8 text-center">
				<div className="font-extrabold text-primary text-lg font-[family-name:var(--font-display)]">
					CareerMentor
				</div>
				<nav className="mt-3 flex justify-center gap-6 text-sm text-on-surface-variant">
					<Link href="/privacy" className="hover:text-primary underline">
						Privacy Policy
					</Link>
					<Link href="/terms" className="hover:text-primary underline">
						Terms of Service
					</Link>
					<Link href="/analyze" className="hover:text-primary underline">
						Analyzer
					</Link>
				</nav>
				<p className="mt-4 text-xs text-outline">
					© {new Date().getFullYear()} CareerMentor · Free professional resume intelligence.
				</p>
			</div>
		</footer>
	);
}
