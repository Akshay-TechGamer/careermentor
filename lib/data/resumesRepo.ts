'use client';

import { getSupabase } from '@/lib/supabase/client';
import { emptyResume, type ResumeData, type ResumeRow } from '@/lib/types';

const TABLE = 'resume_builder_resumes';

export async function listResumes(userId: string): Promise<ResumeRow[]> {
	const supabase = getSupabase();
	const { data, error } = await supabase
		.from(TABLE)
		.select()
		.eq('user_id', userId)
		.order('updated_at', { ascending: false });
	if (error) {
		throw new Error(error.message);
	}
	return (data ?? []) as ResumeRow[];
}

export async function getResume(id: string): Promise<ResumeRow | null> {
	const supabase = getSupabase();
	const { data, error } = await supabase.from(TABLE).select().eq('id', id).maybeSingle();
	if (error) {
		throw new Error(error.message);
	}
	return (data as ResumeRow) ?? null;
}

export interface CreateResumeInput {
	userId: string;
	title?: string;
	templateSlug?: string;
	data?: ResumeData;
	atsScore?: number | null;
}

export async function createResume(input: CreateResumeInput): Promise<ResumeRow> {
	const supabase = getSupabase();
	const { data, error } = await supabase
		.from(TABLE)
		.insert({
			user_id: input.userId,
			title: input.title ?? 'Untitled Resume',
			template_slug: input.templateSlug ?? 'the-professional',
			data: input.data ?? emptyResume(),
			ats_score: input.atsScore ?? null,
		})
		.select()
		.single();
	if (error || !data) {
		throw new Error(error?.message ?? 'Could not create resume');
	}
	return data as ResumeRow;
}

export interface ResumePatch {
	title?: string;
	template_slug?: string;
	data?: ResumeData;
	ats_score?: number | null;
	is_public?: boolean;
}

export async function updateResume(id: string, patch: ResumePatch): Promise<void> {
	const supabase = getSupabase();
	const { error } = await supabase
		.from(TABLE)
		.update({ ...patch, updated_at: new Date().toISOString() })
		.eq('id', id);
	if (error) {
		throw new Error(error.message);
	}
}

export async function duplicateResume(userId: string, row: ResumeRow): Promise<ResumeRow> {
	return createResume({
		userId,
		title: `${row.title} (copy)`,
		templateSlug: row.template_slug,
		data: row.data,
		atsScore: row.ats_score,
	});
}

export async function renameResume(id: string, title: string): Promise<void> {
	return updateResume(id, { title });
}

export async function deleteResume(id: string): Promise<void> {
	const supabase = getSupabase();
	const { error } = await supabase.from(TABLE).delete().eq('id', id);
	if (error) {
		throw new Error(error.message);
	}
}
