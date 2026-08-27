'use client';

// Email OTP auth (6-digit code, no redirect — works on the shared Supabase
// project whose Site URL points at another app).

import type { User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase/client';

export async function getCurrentUser(): Promise<User | null> {
	const supabase = getSupabase();
	const { data } = await supabase.auth.getUser();
	return data.user ?? null;
}

/** Sends a 6-digit code to the email. Creates the user if new. */
export async function sendEmailCode(email: string): Promise<void> {
	const supabase = getSupabase();
	const { error } = await supabase.auth.signInWithOtp({
		email: email.trim(),
		options: { shouldCreateUser: true },
	});
	if (error) {
		throw new Error(error.message);
	}
}

/** Verifies the 6-digit code and signs the user in. */
export async function verifyEmailCode(email: string, token: string): Promise<User> {
	const supabase = getSupabase();
	const { data, error } = await supabase.auth.verifyOtp({
		email: email.trim(),
		token: token.trim(),
		type: 'email',
	});
	if (error || !data.user) {
		throw new Error(error?.message ?? 'Invalid or expired code');
	}
	return data.user;
}

export async function signOut(): Promise<void> {
	const supabase = getSupabase();
	await supabase.auth.signOut();
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
	const supabase = getSupabase();
	const { data } = supabase.auth.onAuthStateChange((_event, session) => {
		callback(session?.user ?? null);
	});
	return () => data.subscription.unsubscribe();
}
