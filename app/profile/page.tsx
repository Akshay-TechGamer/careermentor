'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { FileText, Trash2, Download, Loader2, Plus, UserCircle2, ArrowRight, Copy, Pencil } from 'lucide-react';
import { getCurrentUser, signOut } from '@/lib/data/authRepo';
import { listResumes, deleteResume, duplicateResume, renameResume } from '@/lib/data/resumesRepo';
import { clearDraft } from '@/lib/data/draftStore';
import type { ResumeRow } from '@/lib/types';

export default function ProfilePage() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [resumes, setResumes] = useState<ResumeRow[]>([]);
	const [clearing, setClearing] = useState(false);

	useEffect(() => {
		getCurrentUser().then((u) => {
			setUser(u);
			setLoading(false);
			if (u) {
				listResumes(u.id)
					.then(setResumes)
					.catch(() => undefined);
			}
		});
	}, []);

	const exportData = () => {
		const blob = new Blob([JSON.stringify({ resumes }, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'careermentor-data.json';
		a.click();
		URL.revokeObjectURL(url);
	};

	const onDelete = async (id: string) => {
		await deleteResume(id);
		setResumes((r) => r.filter((x) => x.id !== id));
	};

	const onDuplicate = async (row: ResumeRow) => {
		if (!user) return;
		const copy = await duplicateResume(user.id, row);
		setResumes((r) => [copy, ...r]);
	};

	const onRename = async (row: ResumeRow) => {
		const name = window.prompt('Rename resume', row.title);
		if (name == null) return;
		const title = name.trim() || row.title;
		await renameResume(row.id, title);
		setResumes((r) => r.map((x) => (x.id === row.id ? { ...x, title } : x)));
	};

	const onClear = async () => {
		const ok = window.confirm(
			'Start fresh? This permanently deletes ALL your saved resumes and the current draft on this device. This cannot be undone.'
		);
		if (!ok) {
			return;
		}
		setClearing(true);
		try {
			await Promise.all(resumes.map((r) => deleteResume(r.id)));
			clearDraft();
			await signOut();
			setUser(null);
			setResumes([]);
		} finally {
			setClearing(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center py-32 text-outline">
				<Loader2 className="w-6 h-6 animate-spin" />
			</div>
		);
	}

	/* No guest session yet */
	if (!user) {
		return (
			<div className="mx-auto max-w-lg px-4 py-16 text-center">
				<div className="w-14 h-14 rounded-full bg-surface-container text-primary flex items-center justify-center mx-auto">
					<UserCircle2 className="w-8 h-8" />
				</div>
				<h1 className="mt-4 text-2xl font-bold">No account needed</h1>
				<p className="mt-2 text-on-surface-variant">
					Build a resume and hit <span className="font-semibold">Save</span> — we&apos;ll keep it
					on this device as a guest. No email, no password.
				</p>
				<Link href="/build" className="btn btn-primary mt-6 mx-auto">
					Start building <ArrowRight className="w-4 h-4" />
				</Link>
			</div>
		);
	}

	/* Guest dashboard */
	return (
		<div className="mx-auto max-w-3xl px-4 py-10">
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div className="flex items-center gap-3">
					<span className="w-11 h-11 rounded-full bg-surface-container text-primary flex items-center justify-center">
						<UserCircle2 className="w-6 h-6" />
					</span>
					<div>
						<h1 className="text-2xl font-bold leading-tight">My resumes</h1>
						<span className="label-caps text-on-surface-variant">Guest · saved on this device</span>
					</div>
				</div>
				<Link href="/build" className="btn btn-primary">
					<Plus className="w-4 h-4" /> New resume
				</Link>
			</div>

			<div className="mt-6 space-y-3">
				{resumes.length === 0 && (
					<p className="text-on-surface-variant">No saved resumes yet. Build one and hit Save.</p>
				)}
				{resumes.map((r) => (
					<div key={r.id} className="card p-4 flex items-center justify-between gap-3">
						<Link href={`/build?id=${r.id}`} className="flex items-center gap-3 min-w-0">
							<span className="w-10 h-10 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0">
								<FileText className="w-5 h-5" />
							</span>
							<span className="min-w-0">
								<span className="font-semibold block truncate">{r.title}</span>
								<span className="text-sm text-on-surface-variant">
									Score {r.ats_score ?? '—'} · updated {new Date(r.updated_at).toLocaleDateString()}
								</span>
							</span>
						</Link>
						<div className="flex items-center gap-1 shrink-0">
							<button className="btn-ghost p-2 rounded" onClick={() => onRename(r)} aria-label="Rename">
								<Pencil className="w-4 h-4" />
							</button>
							<button className="btn-ghost p-2 rounded" onClick={() => onDuplicate(r)} aria-label="Duplicate">
								<Copy className="w-4 h-4" />
							</button>
							<button className="btn-ghost p-2 rounded text-danger" onClick={() => onDelete(r.id)} aria-label="Delete resume">
								<Trash2 className="w-4 h-4" />
							</button>
						</div>
					</div>
				))}
			</div>

			<div className="mt-10 pt-6 border-t border-outline-variant/60 space-y-3">
				<h2 className="font-bold">Your data</h2>
				<p className="text-sm text-on-surface-variant">
					Resumes are tied to this browser. Export a copy first, or start fresh — clearing
					deletes every saved resume and the current draft for good.
				</p>
				<div className="flex gap-3 flex-wrap">
					<button className="btn btn-outline" onClick={exportData} disabled={clearing}>
						<Download className="w-4 h-4" /> Export my data
					</button>
					<button className="btn btn-ghost text-danger" onClick={onClear} disabled={clearing}>
						{clearing ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Trash2 className="w-4 h-4" />
						)}
						Clear all &amp; start fresh
					</button>
				</div>
			</div>
		</div>
	);
}
