export const metadata = { title: 'Terms of Service — CareerMentor' };

export default function TermsPage() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-12">
			<h1 className="text-3xl font-bold">Terms of Service</h1>
			<div className="mt-6 space-y-5 text-on-surface-variant">
				<p>
					CareerMentor is provided free of charge, “as is”, to help you build and analyze
					resumes. By using it you agree to these terms.
				</p>
				<section>
					<h2 className="font-bold text-on-surface">Your content</h2>
					<p>You own the resumes you create. You are responsible for the accuracy of your content.</p>
				</section>
				<section>
					<h2 className="font-bold text-on-surface">Fair use</h2>
					<p>Don&apos;t abuse the service, attempt to break it, or use it for unlawful purposes.</p>
				</section>
				<section>
					<h2 className="font-bold text-on-surface">No warranty</h2>
					<p>
						The ATS score and suggestions are guidance, not guarantees of interview or hiring
						outcomes.
					</p>
				</section>
			</div>
		</div>
	);
}
