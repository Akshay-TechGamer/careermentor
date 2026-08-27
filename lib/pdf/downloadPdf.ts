'use client';

// Directly generates and downloads a real .pdf file from a rendered resume
// element (no browser print dialog). Libraries are dynamically imported so they
// stay out of the initial bundle.

export async function downloadResumePdf(el: HTMLElement, filename: string): Promise<void> {
	const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
		import('html2canvas-pro'),
		import('jspdf'),
	]);

	const canvas = await html2canvas(el, {
		scale: 2,
		backgroundColor: '#ffffff',
		useCORS: true,
		logging: false,
	});

	const imgData = canvas.toDataURL('image/jpeg', 0.95);
	const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
	const pageW = 210;
	const pageH = 297;
	const imgW = pageW;
	const imgH = (canvas.height * imgW) / canvas.width;

	let heightLeft = imgH;
	let position = 0;
	pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
	heightLeft -= pageH;
	while (heightLeft > 0) {
		position -= pageH;
		pdf.addPage();
		pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
		heightLeft -= pageH;
	}

	const safe = filename.replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '') || 'resume';
	pdf.save(`${safe}.pdf`);
}
