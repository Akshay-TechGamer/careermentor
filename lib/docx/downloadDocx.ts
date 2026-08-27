'use client';

// Generates an ATS-friendly Word (.docx) file from resume data.

import type { ResumeData } from '@/lib/types';
import { SECTION_META } from '@/lib/types';

export async function downloadDocx(data: ResumeData, filename: string): Promise<void> {
	const { Document, Packer, Paragraph, TextRun, BorderStyle, TabStopType } = await import('docx');

	const p = data.personal;
	const children: InstanceType<typeof Paragraph>[] = [];

	// Header
	children.push(
		new Paragraph({
			children: [new TextRun({ text: p.fullName || 'Your Name', bold: true, size: 36 })],
		}),
	);
	if (p.title) {
		children.push(new Paragraph({ children: [new TextRun({ text: p.title, size: 24, color: '333333' })] }));
	}
	const contact = [p.email, p.phone, p.location, ...p.links.map((l) => l.url)].filter(Boolean).join('  |  ');
	if (contact) {
		children.push(new Paragraph({ children: [new TextRun({ text: contact, size: 18, color: '555555' })] }));
	}

	const heading = (text: string) =>
		new Paragraph({
			spacing: { before: 240, after: 80 },
			border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '999999' } },
			children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: '1f3b73' })],
		});

	if (p.summary) {
		children.push(heading('Summary'));
		children.push(new Paragraph({ children: [new TextRun({ text: p.summary, size: 20 })] }));
	}

	if (data.experience.length) {
		children.push(heading('Experience'));
		for (const e of data.experience) {
			const dates = [e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ');
			children.push(
				new Paragraph({
					children: [
						new TextRun({ text: e.role || 'Role', bold: true, size: 22 }),
						new TextRun({ text: `\t${dates}`, size: 18, color: '666666' }),
					],
					tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
				}),
			);
			if (e.company) {
				children.push(new Paragraph({ children: [new TextRun({ text: e.company, italics: true, size: 20, color: '444444' })] }));
			}
			for (const b of e.bullets.filter(Boolean)) {
				children.push(new Paragraph({ text: b, bullet: { level: 0 }, spacing: { after: 20 } }));
			}
		}
	}

	if (data.education.length) {
		children.push(heading('Education'));
		for (const ed of data.education) {
			const dates = [ed.start, ed.end].filter(Boolean).join(' – ');
			children.push(
				new Paragraph({
					children: [
						new TextRun({ text: ed.degree || 'Degree', bold: true, size: 21 }),
						new TextRun({ text: `\t${dates}`, size: 18, color: '666666' }),
					],
					tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
				}),
			);
			children.push(new Paragraph({ children: [new TextRun({ text: [ed.school, ed.details].filter(Boolean).join(' · '), size: 20, color: '444444' })] }));
		}
	}

	if (data.skills.length) {
		children.push(heading('Skills'));
		children.push(new Paragraph({ children: [new TextRun({ text: data.skills.join('  ·  '), size: 20 })] }));
	}

	for (const sec of data.sections ?? []) {
		const items = sec.items.filter((it) => it.primary || it.secondary);
		if (!items.length) continue;
		children.push(heading(sec.heading || SECTION_META[sec.type].heading));
		for (const it of items) {
			children.push(
				new Paragraph({
					children: [
						new TextRun({ text: it.primary, bold: true, size: 20 }),
						...(it.secondary ? [new TextRun({ text: `  ${it.secondary}`, size: 19, color: '555555' })] : []),
					],
				}),
			);
		}
	}

	const doc = new Document({
		styles: { default: { document: { run: { font: 'Calibri' } } } },
		sections: [{ properties: {}, children }],
	});
	const blob = await Packer.toBlob(doc);
	const name = (p.fullName || '').trim();
	const base = name ? `${name} - Resume` : filename || 'CareerMentor Resume';
	const safe = base.replace(/[^\w \-]+/g, '').replace(/\s+/g, ' ').trim() || 'CareerMentor Resume';
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${safe}.docx`;
	a.click();
	URL.revokeObjectURL(url);
}
