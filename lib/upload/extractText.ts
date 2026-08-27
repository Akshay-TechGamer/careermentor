'use client';

// Extracts plain text from an uploaded resume (PDF / DOCX / TXT). Parsers are
// dynamically imported so they stay out of the initial bundle.

export const ACCEPTED = '.pdf,.docx,.txt';

export async function extractText(file: File): Promise<string> {
	const name = file.name.toLowerCase();

	if (name.endsWith('.txt')) {
		return file.text();
	}

	if (name.endsWith('.docx')) {
		const mammoth = await import('mammoth');
		const arrayBuffer = await file.arrayBuffer();
		const res = await mammoth.extractRawText({ arrayBuffer });
		return res.value;
	}

	if (name.endsWith('.pdf')) {
		const pdfjs = await import('pdfjs-dist');
		pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
		const data = await file.arrayBuffer();
		const doc = await pdfjs.getDocument({ data }).promise;
		let text = '';
		for (let i = 1; i <= doc.numPages; i++) {
			const page = await doc.getPage(i);
			const content = await page.getTextContent();
			const strings = content.items.map((it) => ('str' in it ? it.str : '')).join(' ');
			text += strings + '\n';
		}
		return text;
	}

	throw new Error('Unsupported file — please upload a PDF, DOCX or TXT.');
}
