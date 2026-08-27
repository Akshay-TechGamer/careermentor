'use client';

// PDF export. Primary path captures the actual rendered resume element so the
// download looks EXACTLY like the on-screen preview (WYSIWYG). If capture fails,
// it silently falls back to a vector jsPDF render (still a real .pdf, never the
// print dialog).

import type { ResumeData } from '@/lib/types';
import { getTemplate } from '@/lib/templates/registry';

type Doc = import('jspdf').jsPDF;

const PAGE_W = 210;
const PAGE_H = 297;
const M = 14;

function hexRgb(hex: string): [number, number, number] {
	const h = hex.replace('#', '');
	return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function contactLine(data: ResumeData): string {
	const p = data.personal;
	return [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean).join('   |   ');
}

function fileNameFor(data: ResumeData, fallback: string): string {
	const name = (data.personal.fullName || '').trim();
	const base = name ? `${name} - Resume` : fallback || 'CareerMentor Resume';
	return base.replace(/[^\w \-]+/g, '').replace(/\s+/g, ' ').trim() || 'CareerMentor Resume';
}

/**
 * WYSIWYG export — rasterizes the rendered A4 resume element into a PDF that
 * matches the preview pixel-for-pixel. `element` should be the full-size (794px)
 * sheet, not a scaled preview.
 */
export async function downloadResumePdf(
	element: HTMLElement,
	data: ResumeData,
	templateSlug: string,
	filename: string,
): Promise<void> {
	try {
		const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
			import('html2canvas-pro'),
			import('jspdf'),
		]);
		if (document.fonts && document.fonts.ready) {
			await document.fonts.ready;
		}
		const canvas = await html2canvas(element, {
			scale: 2,
			backgroundColor: '#ffffff',
			useCORS: true,
			logging: false,
		});
		const imgData = canvas.toDataURL('image/jpeg', 0.95);
		const imgH = (canvas.height * PAGE_W) / canvas.width;

		// Always standard A4 portrait pages.
		const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

		// Rounding tolerance: a few mm of overflow scales down to one page
		// instead of spilling a sliver onto a nearly-empty second page.
		const TOLERANCE = 6;
		if (imgH <= PAGE_H + TOLERANCE) {
			const h = Math.min(imgH, PAGE_H);
			const w = (canvas.width * h) / canvas.height;
			pdf.addImage(imgData, 'JPEG', (PAGE_W - w) / 2, 0, w, h);
			pdf.save(`${fileNameFor(data, filename)}.pdf`);
			return;
		}

		// Longer than a page: paginate on A4, dropping a trailing sliver.
		let heightLeft = imgH;
		let position = 0;
		pdf.addImage(imgData, 'JPEG', 0, position, PAGE_W, imgH);
		heightLeft -= PAGE_H;
		while (heightLeft > TOLERANCE) {
			position -= PAGE_H;
			pdf.addPage();
			pdf.addImage(imgData, 'JPEG', 0, position, PAGE_W, imgH);
			heightLeft -= PAGE_H;
		}
		pdf.save(`${fileNameFor(data, filename)}.pdf`);
	} catch {
		await downloadVectorPdf(data, templateSlug, filename);
	}
}

/** Fallback: build the PDF from data with jsPDF vector text. */
export async function downloadVectorPdf(
	data: ResumeData,
	templateSlug: string,
	filename: string,
): Promise<void> {
	const { jsPDF } = await import('jspdf');
	const template = getTemplate(templateSlug);
	const accent = data.style?.accent ?? template.accent;
	const layout = data.style?.layout ?? template.layout;
	const font = data.style?.font === 'serif' ? 'times' : 'helvetica';
	const doc = new jsPDF({ unit: 'mm', format: 'a4' });

	if (layout === 'twoColumn') {
		renderTwoColumn(doc, data, accent, font);
	} else {
		renderSingle(doc, data, accent, font, layout === 'academic');
	}
	doc.save(`${fileNameFor(data, filename)}.pdf`);
}

/** Simple text document PDF — used for cover letters. */
export async function downloadTextPdf(body: string, filename: string): Promise<void> {
	const { jsPDF } = await import('jspdf');
	const doc = new jsPDF({ unit: 'mm', format: 'a4' });
	const margin = 20;
	const width = PAGE_W - 2 * margin;
	let y = margin;
	doc.setFont('times', 'normal');
	doc.setFontSize(11);
	doc.setTextColor(20, 20, 20);
	for (const para of body.split('\n')) {
		if (para === '') {
			y += 4;
			continue;
		}
		const lines = doc.splitTextToSize(para, width) as string[];
		for (const ln of lines) {
			if (y > PAGE_H - margin) {
				doc.addPage();
				y = margin;
			}
			doc.text(ln, margin, y);
			y += 6;
		}
	}
	const safe = filename.replace(/[^\w \-]+/g, '').replace(/\s+/g, ' ').trim() || 'Cover Letter';
	doc.save(`${safe}.pdf`);
}

/* ---------------- single column / academic ---------------- */
function renderSingle(doc: Doc, data: ResumeData, accent: string, font: string, academic: boolean) {
	const [ar, ag, ab] = hexRgb(accent);
	const W = PAGE_W - 2 * M;
	const p = data.personal;
	const cx = PAGE_W / 2;
	const state = { y: M + 4 };
	const ensure = (h: number) => {
		if (state.y + h > PAGE_H - M) {
			doc.addPage();
			state.y = M + 4;
		}
	};

	// Header
	doc.setFont(font, 'bold');
	doc.setFontSize(22);
	doc.setTextColor(ar, ag, ab);
	doc.text(p.fullName || 'Your Name', academic ? cx : M, state.y, { align: academic ? 'center' : 'left' });
	state.y += 7.5;
	if (p.title) {
		doc.setFont(font, 'normal');
		doc.setFontSize(11.5);
		doc.setTextColor(45, 45, 45);
		doc.text(p.title, academic ? cx : M, state.y, { align: academic ? 'center' : 'left' });
		state.y += 5.5;
	}
	const contact = contactLine(data);
	if (contact) {
		doc.setFontSize(9);
		doc.setTextColor(95, 95, 95);
		const lines = doc.splitTextToSize(contact, W) as string[];
		doc.text(lines, academic ? cx : M, state.y, { align: academic ? 'center' : 'left' });
		state.y += lines.length * 4 + 1;
	}
	doc.setDrawColor(ar, ag, ab);
	doc.setLineWidth(0.5);
	doc.line(M, state.y, PAGE_W - M, state.y);
	state.y += 5;

	const section = (title: string) => {
		ensure(10);
		doc.setFont(font, 'bold');
		doc.setFontSize(11);
		doc.setTextColor(ar, ag, ab);
		doc.text(title.toUpperCase(), M, state.y);
		state.y += 1.6;
		doc.setDrawColor(ar, ag, ab);
		doc.setLineWidth(0.2);
		doc.line(M, state.y, PAGE_W - M, state.y);
		state.y += 4.2;
	};
	const paragraph = (text: string, size = 9.5, color: [number, number, number] = [40, 40, 40]) => {
		doc.setFont(font, 'normal');
		doc.setFontSize(size);
		doc.setTextColor(...color);
		const lines = doc.splitTextToSize(text, W) as string[];
		for (const ln of lines) {
			ensure(size * 0.42 + 1);
			doc.text(ln, M, state.y);
			state.y += size * 0.42 + 1.3;
		}
	};

	if (p.summary) {
		section('Summary');
		paragraph(p.summary);
		state.y += 2;
	}

	if (data.experience.length) {
		section('Experience');
		for (const e of data.experience) {
			ensure(12);
			doc.setFont(font, 'bold');
			doc.setFontSize(10.5);
			doc.setTextColor(25, 25, 25);
			doc.text(e.role || 'Role', M, state.y);
			const dates = [e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ');
			doc.setFont(font, 'normal');
			doc.setFontSize(9);
			doc.setTextColor(110, 110, 110);
			doc.text(dates, PAGE_W - M, state.y, { align: 'right' });
			state.y += 4.6;
			if (e.company) {
				doc.setFont(font, 'italic');
				doc.setFontSize(9.5);
				doc.setTextColor(70, 70, 70);
				doc.text(e.company, M, state.y);
				state.y += 4.2;
			}
			for (const b of e.bullets.filter(Boolean)) {
				doc.setFont(font, 'normal');
				doc.setFontSize(9.5);
				doc.setTextColor(40, 40, 40);
				const lines = doc.splitTextToSize(b, W - 4) as string[];
				lines.forEach((ln, i) => {
					ensure(4.4);
					doc.text(i === 0 ? '•' : '', M, state.y);
					doc.text(ln, M + 3, state.y);
					state.y += 4.2;
				});
			}
			state.y += 2.5;
		}
	}

	if (data.education.length) {
		section('Education');
		for (const e of data.education) {
			ensure(9);
			doc.setFont(font, 'bold');
			doc.setFontSize(10);
			doc.setTextColor(25, 25, 25);
			doc.text(e.degree || 'Degree', M, state.y);
			const dates = [e.start, e.end].filter(Boolean).join(' – ');
			doc.setFont(font, 'normal');
			doc.setFontSize(9);
			doc.setTextColor(110, 110, 110);
			doc.text(dates, PAGE_W - M, state.y, { align: 'right' });
			state.y += 4.4;
			doc.setFontSize(9.5);
			doc.setTextColor(70, 70, 70);
			doc.text([e.school, e.details].filter(Boolean).join(' · '), M, state.y);
			state.y += 5;
		}
	}

	if (data.skills.length) {
		section('Skills');
		paragraph(data.skills.join('  ·  '), 9.5, [50, 50, 50]);
	}

	if (data.projects.length) {
		section('Projects');
		for (const pr of data.projects) {
			ensure(6);
			doc.setFont(font, 'bold');
			doc.setFontSize(9.5);
			doc.setTextColor(25, 25, 25);
			doc.text(pr.name || 'Project', M, state.y);
			state.y += 4;
			paragraph(pr.description, 9.5, [60, 60, 60]);
			state.y += 1;
		}
	}

	for (const sec of data.sections ?? []) {
		const items = sec.items.filter((it) => it.primary || it.secondary);
		if (!items.length) continue;
		section(sec.heading);
		for (const it of items) {
			ensure(5);
			doc.setFont(font, 'bold');
			doc.setFontSize(9.5);
			doc.setTextColor(30, 30, 30);
			doc.text(it.primary || '', M, state.y);
			if (it.secondary) {
				doc.setFont(font, 'normal');
				doc.setFontSize(9);
				doc.setTextColor(sec.type === 'links' ? ar : 95, sec.type === 'links' ? ag : 95, sec.type === 'links' ? ab : 95);
				doc.text(it.secondary, PAGE_W - M, state.y, { align: 'right' });
			}
			state.y += 4.6;
		}
		state.y += 1.5;
	}
}

/* ---------------- two column (with optional photo) ---------------- */
function renderTwoColumn(doc: Doc, data: ResumeData, accent: string, font: string) {
	const [ar, ag, ab] = hexRgb(accent);
	const SB = 66; // sidebar width
	const mx = SB + 8; // main x
	const mW = PAGE_W - mx - 12;
	const p = data.personal;

	const drawSidebar = () => {
		doc.setFillColor(ar, ag, ab);
		doc.rect(0, 0, SB, PAGE_H, 'F');
	};
	drawSidebar();

	// Sidebar content
	let sy = 16;
	if (p.photo) {
		try {
			doc.addImage(p.photo, 'JPEG', (SB - 30) / 2, sy, 30, 30);
			sy += 35;
		} catch {
			/* ignore bad image */
		}
	}
	doc.setTextColor(255, 255, 255);
	doc.setFont(font, 'bold');
	doc.setFontSize(15);
	doc.splitTextToSize(p.fullName || 'Your Name', SB - 12).forEach((ln: string) => {
		doc.text(ln, 8, sy);
		sy += 6;
	});
	if (p.title) {
		doc.setFont(font, 'normal');
		doc.setFontSize(9.5);
		doc.splitTextToSize(p.title, SB - 12).forEach((ln: string) => {
			doc.text(ln, 8, sy);
			sy += 4.4;
		});
	}
	sy += 3;
	const sideHeading = (t: string) => {
		doc.setFont(font, 'bold');
		doc.setFontSize(9);
		doc.setTextColor(255, 255, 255);
		doc.text(t.toUpperCase(), 8, sy);
		sy += 4.5;
	};
	const sideText = (t: string, size = 8.5) => {
		doc.setFont(font, 'normal');
		doc.setFontSize(size);
		doc.setTextColor(235, 240, 255);
		doc.splitTextToSize(t, SB - 12).forEach((ln: string) => {
			doc.text(ln, 8, sy);
			sy += size * 0.44 + 1;
		});
	};

	const contactItems = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean);
	if (contactItems.length) {
		sideHeading('Contact');
		contactItems.forEach((c) => sideText(c));
		sy += 3;
	}
	if (data.skills.length) {
		sideHeading('Skills');
		sideText(data.skills.join(', '));
		sy += 3;
	}
	if (data.education.length) {
		sideHeading('Education');
		data.education.forEach((e) => {
			doc.setFont(font, 'bold');
			doc.setFontSize(8.5);
			doc.setTextColor(255, 255, 255);
			doc.splitTextToSize(e.degree || 'Degree', SB - 12).forEach((ln: string) => {
				doc.text(ln, 8, sy);
				sy += 3.6;
			});
			sideText([e.school, [e.start, e.end].filter(Boolean).join(' – ')].filter(Boolean).join(' · '));
			sy += 2;
		});
	}

	// Main column
	const state = { y: 16 };
	const ensure = (h: number) => {
		if (state.y + h > PAGE_H - M) {
			doc.addPage();
			drawSidebar();
			state.y = 16;
		}
	};
	const section = (title: string) => {
		ensure(9);
		doc.setFont(font, 'bold');
		doc.setFontSize(11);
		doc.setTextColor(ar, ag, ab);
		doc.text(title.toUpperCase(), mx, state.y);
		state.y += 1.4;
		doc.setDrawColor(ar, ag, ab);
		doc.setLineWidth(0.2);
		doc.line(mx, state.y, PAGE_W - 12, state.y);
		state.y += 4;
	};

	if (p.summary) {
		section('Profile');
		doc.setFont(font, 'normal');
		doc.setFontSize(9.5);
		doc.setTextColor(45, 45, 45);
		(doc.splitTextToSize(p.summary, mW) as string[]).forEach((ln) => {
			ensure(4.3);
			doc.text(ln, mx, state.y);
			state.y += 4.3;
		});
		state.y += 2;
	}

	if (data.experience.length) {
		section('Experience');
		for (const e of data.experience) {
			ensure(12);
			doc.setFont(font, 'bold');
			doc.setFontSize(10.5);
			doc.setTextColor(25, 25, 25);
			doc.text(e.role || 'Role', mx, state.y);
			state.y += 4.4;
			doc.setFont(font, 'normal');
			doc.setFontSize(9);
			doc.setTextColor(110, 110, 110);
			doc.text([e.company, [e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ')].filter(Boolean).join('  ·  '), mx, state.y);
			state.y += 4.4;
			for (const b of e.bullets.filter(Boolean)) {
				doc.setFont(font, 'normal');
				doc.setFontSize(9.5);
				doc.setTextColor(40, 40, 40);
				const lines = doc.splitTextToSize(b, mW - 4) as string[];
				lines.forEach((ln, i) => {
					ensure(4.4);
					doc.text(i === 0 ? '•' : '', mx, state.y);
					doc.text(ln, mx + 3, state.y);
					state.y += 4.2;
				});
			}
			state.y += 2.5;
		}
	}

	for (const sec of data.sections ?? []) {
		const items = sec.items.filter((it) => it.primary || it.secondary);
		if (!items.length) continue;
		section(sec.heading);
		for (const it of items) {
			ensure(5);
			doc.setFont(font, 'bold');
			doc.setFontSize(9.5);
			doc.setTextColor(30, 30, 30);
			const label = it.secondary ? `${it.primary}${it.primary ? ': ' : ''}${it.secondary}` : it.primary;
			(doc.splitTextToSize(label, mW) as string[]).forEach((ln) => {
				ensure(4.4);
				doc.text(ln, mx, state.y);
				state.y += 4.2;
			});
		}
		state.y += 1.5;
	}
}
