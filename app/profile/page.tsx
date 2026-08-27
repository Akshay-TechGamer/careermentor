'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { Mail, LogOut, FileText, Trash2, Download, Loader2, Plus } from 'lucide-react';
import { getCurrentUser, sendEmailCode, verifyEmailCode, signOut } from '@/lib/data/authRepo';
import { listResumes, deleteResume } from '@/lib/data/resumesRepo';
import type { ResumeRow } from '@/lib/types';

function ProfileInner() {
	const router = useRouter();
	const params = useSearchParams();
	const next = params.get('next');

	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [step, setStep] = useState<'email' | 'code'>('email');
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [resumes, setResumes] = useState<ResumeRow[]>([]);

	useEffect(() => {
		getCurrentUser().then((u) => {
			setUser(u);
			setLoading(false);
			if (u) loadResumes(u.id);
		});
	}, []);

	const loadResumes = async (userId: string) => {
		try {
			setResumes(await listResumes(userId));
		} catch {
			/* ignore */
		}
	};

	const onSendCode = async () => {
		setError(null);
		if (!email.trim()) {
			setError('Enter your email');
			return;
		}
		setBusy(true);
		try {
			await sendEmailCode(email);
			setStep('code');
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Could not send code');
		} finally {
			setBusy(false);
		}
	};

	const onVerify = async () => {
		setError(null);
		setBusy(true);
		try {
			const u = await verifyEmailCode(email, code);
			setUser(u);
			loadResumes(u.id);
			if (next) router.push(next);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Invalid code');
		} finally {
			setBusy(false);
		}
	};

	const onSignOut = async () => {
		await signOut();
		setUser(null);
		setResumes([]);
		setStep('email');
		setCode('');
	};

	const exportData = () => {
		const blob = new Blob([JSON.stringify({ user: user?.email, resumes }, null, 2)], {
			type: 'application/json',
		});
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

	if (loading) {
		return (
			<div className="flex justify-center py-32 text-outline">
				<Loader2 className="w-6 h-6 animate-spin" />
			</div>
		);
	}

	/* ---- Signed out: auth ---- */
	if (!user) {
		return (
			<div className="mx-auto max-w-md px-4 py-12">
				<div className="card p-6 md:p-8">
					<h1 className="text-2xl font-bold">Sign in</h1>
					<p className="mt-1 text-on-surface-variant">
						We&apos;ll email you a 6-digit code. No password needed.
					</p>

					{step === 'email' ? (
						<div className="mt-6">
							<label className="field-label">Email</label>
							<input
								className="input"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && onSendCode()}
							/>
							<button className="btn btn-primary w-full mt-4" onClick={onSendCode} disabled={busy}>
								{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
								Send code
							</button>
						</div>
					) : (
						<div className="mt-6">
							<label className="field-label">Enter the 6-digit code sent to {email}</label>
							<input
								className="input font-[family-name:var(--font-mono)] tracking-[0.4em] text-center text-lg"
								inputMode="numeric"
								maxLength={6}
								placeholder="______"
								value={code}
								onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
								onKeyDown={(e) => e.key === 'Enter' && onVerify()}
							/>
							<button className="btn btn-primary w-full mt-4" onClick={onVerify} disabled={busy}>
								{busy && <Loader2 className="w-4 h-4 animate-spin" />} Verify &amp; sign in
							</button>
							<button className="btn btn-ghost w-full mt-2" onClick={() => setStep('email')}>
								Use a different email
							</button>
						</div>
					)}

					{error && <p className="mt-4 text-danger text-sm font-semibold">{error}</p>}
				</div>
			</div>
		);
	}

	/* ---- Signed in: dashboard ---- */
	return (
		<div className="mx-auto max-w-3xl px-4 py-10">
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-2xl font-bold">My resumes</h1>
					<p className="text-on-surface-variant">{user.email}</p>
				</div>
				<button className="btn btn-ghost" onClick={onSignOut}>
					<LogOut className="w-4 h-4" /> Sign out
				</button>
			</div>

			<Link href="/build" className="btn btn-primary mt-6">
				<Plus className="w-4 h-4" /> New resume
			</Link>

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
						<button className="btn-ghost p-2 rounded text-danger" onClick={() => onDelete(r.id)} aria-label="Delete resume">
							<Trash2 className="w-5 h-5" />
						</button>
					</div>
				))}
			</div>

			<div className="mt-10 pt-6 border-t border-outline-variant/60">
				<h2 className="font-bold">Your data</h2>
				<p className="text-sm text-on-surface-variant mt-1">
					Download everything we store for your account.
				</p>
				<button className="btn btn-outline mt-3" onClick={exportData}>
					<Download className="w-4 h-4" /> Export my data
				</button>
			</div>
		</div>
	);
}

export default function ProfilePage() {
	return (
		<Suspense fallback={<div className="py-32 text-center text-outline">Loading…</div>}>
			<ProfileInner />
		</Suspense>
	);
}
