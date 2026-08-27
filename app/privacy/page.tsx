export const metadata = { title: 'Privacy Policy — CareerMentor' };

export default function PrivacyPage() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-12 prose-sm">
			<h1 className="text-3xl font-bold">Privacy Policy</h1>
			<p className="mt-4 text-on-surface-variant">
				CareerMentor is free and privacy-first. We store only what you choose to save.
			</p>
			<div className="mt-6 space-y-5 text-on-surface-variant">
				<section>
					<h2 className="font-bold text-on-surface">What we store</h2>
					<p>
						Your email (for sign-in) and the resumes you save. Draft resumes stay in your
						browser until you save them to your account.
					</p>
				</section>
				<section>
					<h2 className="font-bold text-on-surface">How analysis works</h2>
					<p>
						Resume analysis runs locally with rule-based checks. Your resume text is not sent to
						any third-party AI service.
					</p>
				</section>
				<section>
					<h2 className="font-bold text-on-surface">Your control</h2>
					<p>
						You can export or delete your data any time from your Profile. Deleting a resume
						removes it permanently.
					</p>
				</section>
			</div>
		</div>
	);
}
