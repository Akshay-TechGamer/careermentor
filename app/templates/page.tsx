'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { CATEGORIES, TEMPLATES, type TemplateCategory } from '@/lib/templates/registry';
import { TemplateThumb } from '@/components/templates/TemplateThumb';

export default function TemplatesPage() {
	const router = useRouter();
	const [query, setQuery] = useState('');
	const [cat, setCat] = useState<TemplateCategory | 'All'>('All');

	const filtered = TEMPLATES.filter((t) => {
		const matchesCat = cat === 'All' || t.category === cat;
		const q = query.trim().toLowerCase();
		const matchesQuery =
			!q ||
			t.name.toLowerCase().includes(q) ||
			t.category.toLowerCase().includes(q) ||
			t.tags.some((tag) => tag.toLowerCase().includes(q));
		return matchesCat && matchesQuery;
	});

	const pick = (slug: string) => router.push(`/build?template=${slug}`);

	return (
		<div className="mx-auto max-w-6xl px-4 py-8">
			<h1 className="text-3xl md:text-4xl font-bold">Professional Template Library</h1>
			<p className="mt-2 text-on-surface-variant">
				Select a professionally designed template to start building your next great resume.
			</p>

			{/* Search */}
			<div className="relative mt-6 max-w-xl">
				<Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
				<input
					className="input pl-11"
					placeholder="Search templates…"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</div>

			{/* Category pills */}
			<div className="mt-4 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
				<button
					className={`chip ${cat === 'All' ? 'chip-on' : ''}`}
					onClick={() => setCat('All')}
				>
					All
				</button>
				{CATEGORIES.map((c) => (
					<button
						key={c}
						className={`chip ${cat === c ? 'chip-on' : ''}`}
						onClick={() => setCat(c)}
					>
						{c}
					</button>
				))}
			</div>

			{/* Grid */}
			<div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{filtered.map((t) => (
					<button
						key={t.slug}
						onClick={() => pick(t.slug)}
						className="card overflow-hidden text-left transition hover:shadow-[var(--shadow-float)] hover:-translate-y-0.5"
					>
						<div className="relative bg-surface-container">
							<span className="absolute top-3 right-3 z-10 rounded bg-primary text-on-primary label-caps px-2 py-1">
								Free
							</span>
							<TemplateThumb template={t} />
						</div>
						<div className="p-4">
							<h3 className="text-lg font-bold">{t.name}</h3>
							<p className="mt-0.5 text-sm text-on-surface-variant">{t.tags.join(' • ')}</p>
						</div>
					</button>
				))}
			</div>

			{filtered.length === 0 && (
				<p className="mt-16 text-center text-on-surface-variant">
					No templates match “{query}”. Try another search or category.
				</p>
			)}
		</div>
	);
}
