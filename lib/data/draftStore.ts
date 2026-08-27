'use client';

// A single local working draft so people can build a resume before signing in.
// On save/login it syncs to Supabase.

import { sampleResume, type ResumeData } from '@/lib/types';
import { getTemplate } from '@/lib/templates/registry';

const KEY = 'cm_draft_v1';

export interface Draft {
	id: string | null; // set once synced to a DB row
	title: string;
	templateSlug: string;
	data: ResumeData;
}

export function loadDraft(): Draft | null {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) {
			return null;
		}
		return JSON.parse(raw) as Draft;
	} catch {
		return null;
	}
}

export function saveDraft(draft: Draft): void {
	try {
		localStorage.setItem(KEY, JSON.stringify(draft));
	} catch {
		// ignore quota / privacy-mode errors
	}
}

export function clearDraft(): void {
	try {
		localStorage.removeItem(KEY);
	} catch {
		// ignore
	}
}

export function newDraft(templateSlug: string, seedSample = false): Draft {
	const data = seedSample ? sampleResume() : sampleResume();
	data.style = { font: getTemplate(templateSlug).font };
	return {
		id: null,
		title: 'Untitled Resume',
		templateSlug,
		data,
	};
}
