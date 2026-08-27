import Link from 'next/link';
import {
	ArrowRight,
	BadgeCheck,
	LayoutGrid,
	Sparkles,
	ShieldCheck,
	FileDown,
	TriangleAlert,
} from 'lucide-react';

export default function HomePage() {
	return (
		<div className="mx-auto max-w-6xl px-4">
			{/* Hero */}
			<section className="pt-10 pb-8 md:pt-16 md:grid md:grid-cols-2 md:gap-12 md:items-center">
				<div>
					<span className="inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-1.5 label-caps text-primary">
						<BadgeCheck className="w-4 h-4" /> Always free, always premium
					</span>
					<h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
						Build a{' '}
						<span className="text-primary underline decoration-4 decoration-primary/40">Winning</span>{' '}
						Resume.
					</h1>
					<p className="mt-4 text-lg text-on-surface-variant max-w-md">
						Professional templates and instant analysis to get you hired faster — with an ATS
						score, keyword matching, and one-click fixes.
					</p>
					<div className="mt-7 flex flex-wrap gap-3">
						<Link href="/build" className="btn btn-primary text-base">
							Build My Resume <ArrowRight className="w-5 h-5" />
						</Link>
						<Link href="/templates" className="btn btn-outline text-base">
							Browse templates
						</Link>
					</div>
				</div>

				{/* Preview mock */}
				<div className="relative mt-12 md:mt-0">
					<div className="card p-5 relative">
						<div className="flex items-center justify-between">
							<div className="space-y-2 w-2/3">
								<div className="h-3 rounded bg-primary-container w-4/5" />
								<div className="h-2.5 rounded bg-surface-high w-3/5" />
							</div>
							<div className="w-9 h-9 rounded-full bg-primary-container/70 flex items-center justify-center text-primary">
								<Sparkles className="w-4 h-4" />
							</div>
						</div>
						<div className="mt-5 space-y-2.5">
							<div className="h-2.5 rounded bg-surface-high w-full" />
							<div className="h-2.5 rounded bg-surface-high w-11/12" />
							<div className="h-2.5 rounded bg-surface-high w-2/3" />
						</div>
						<div className="mt-4 flex gap-2">
							<span className="chip">React</span>
							<span className="chip">UI / UX</span>
							<span className="chip">Figma</span>
						</div>

						{/* AI suggestion tooltip */}
						<div className="absolute -left-3 top-24 card px-3 py-2 shadow-[var(--shadow-float)] max-w-[190px]">
							<div className="flex items-center gap-1.5 label-caps text-warning">
								<TriangleAlert className="w-3.5 h-3.5" /> AI Suggestion
							</div>
							<p className="mt-1 text-sm text-on-surface">Use stronger action verbs here.</p>
						</div>
					</div>

					{/* Score badge */}
					<div className="absolute -right-2 -bottom-6 card px-4 py-3 flex items-center gap-3">
						<span className="w-11 h-11 rounded-full border-2 border-success text-success font-bold font-[family-name:var(--font-mono)] flex items-center justify-center">
							92
						</span>
						<div className="text-sm font-semibold leading-tight">
							Resume
							<br />
							Score
						</div>
					</div>
				</div>
			</section>

			{/* Feature cards */}
			<section className="mt-16 md:mt-20 grid gap-4 md:grid-cols-3">
				<Feature
					Icon={LayoutGrid}
					title="12+ Pro Templates"
					body="Modern, ATS-friendly designs across every category that stand out to recruiters."
				/>
				<Feature
					Icon={Sparkles}
					title="Instant Analysis"
					body="Real-time feedback on impact verbs, formatting, keywords and grammar to fix errors fast."
				/>
				<Feature
					Icon={ShieldCheck}
					title="ATS-Ready & Free"
					body="Beat applicant tracking systems with a clean, keyword-matched resume. No paywall."
				/>
			</section>

			{/* How it works */}
			<section className="mt-16 md:mt-24">
				<h2 className="text-2xl md:text-3xl font-bold text-center">How it works</h2>
				<div className="mt-8 grid gap-4 md:grid-cols-3">
					<Step
						n={1}
						title="Pick a template"
						body="Choose from professional, student, academic, executive, creative and technical styles."
					/>
					<Step
						n={2}
						title="Fill in your sections"
						body="Add experience, education and skills in a guided, card-based editor that autosaves."
					/>
					<Step
						n={3}
						title="Analyze & export"
						body="Get your ATS score, apply one-click fixes, then export a polished PDF."
					/>
				</div>
			</section>

			{/* Free tools */}
			<section className="mt-16 md:mt-20">
				<h2 className="text-2xl md:text-3xl font-bold text-center">More free tools</h2>
				<div className="mt-8 grid gap-4 md:grid-cols-3">
					<ToolLink href="/analyze" title="Analyze or import a resume" body="Upload a PDF, DOCX or LinkedIn profile for an instant score and one-click import." />
					<ToolLink href="/cover-letter" title="Cover letter generator" body="Draft a tailored cover letter from your resume in seconds." />
					<ToolLink href="/build" title="Design your own template" body="Pick a layout, then customize colors, fonts and photo to make it yours." />
				</div>
			</section>

			{/* CTA */}
			<section className="my-16 md:my-24 card p-8 md:p-12 text-center">
				<h2 className="text-2xl md:text-3xl font-bold">Ready to get hired faster?</h2>
				<p className="mt-3 text-on-surface-variant">Start building in seconds — no signup required.</p>
				<Link href="/build" className="btn btn-primary text-base mt-6 mx-auto">
					<FileDown className="w-5 h-5" /> Build my resume
				</Link>
			</section>
		</div>
	);
}

function Feature({ Icon, title, body }: { Icon: typeof LayoutGrid; title: string; body: string }) {
	return (
		<div className="card p-6">
			<div className="w-12 h-12 rounded-lg bg-primary text-on-primary flex items-center justify-center">
				<Icon className="w-6 h-6" />
			</div>
			<h3 className="mt-4 text-lg font-bold">{title}</h3>
			<p className="mt-1.5 text-on-surface-variant">{body}</p>
		</div>
	);
}

function ToolLink({ href, title, body }: { href: string; title: string; body: string }) {
	return (
		<Link href={href} className="card p-6 transition hover:shadow-[var(--shadow-float)] hover:-translate-y-0.5 flex flex-col">
			<h3 className="text-lg font-bold flex items-center gap-2">
				{title} <ArrowRight className="w-4 h-4 text-primary" />
			</h3>
			<p className="mt-1.5 text-on-surface-variant">{body}</p>
		</Link>
	);
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
	return (
		<div className="card p-6">
			<span className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center">
				{n}
			</span>
			<h3 className="mt-4 text-lg font-bold">{title}</h3>
			<p className="mt-1.5 text-on-surface-variant">{body}</p>
		</div>
	);
}
