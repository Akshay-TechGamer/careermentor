'use client';

// Page-break planning for the PDF export.
//
// The export rasterises the whole resume into one tall image and slices it into
// A4 pages. A blind slice cuts wherever the page boundary happens to land — mid
// sentence, or between a section heading and the rows underneath it.
//
// paginateForPrint() walks the rendered sheet first and nudges anything that
// would straddle a boundary onto the next page, so every slice falls in a gap.
// It returns a restore function; always call it once the capture is done.

/** One A4 page in CSS px at the 794px sheet width (794px = 210mm). */
export const PAGE_PX = 1123;

/** Breathing room above a block that was pushed to the top of a page. */
const TOP_PAD = 26;

/** A block taller than this can't be relocated usefully, so it is left alone. */
const MAX_MOVABLE = PAGE_PX - 80;

/**
 * Sub-pixel rounding can leave the sheet a hair over a whole page. Ignore that
 * much overshoot, otherwise a 2px tail earns a whole blank page of its own.
 */
const PAGE_TOL = 14;

interface Pushed {
	el: HTMLElement;
	marginTop: string;
}

/** Section headings — tagged by the shared title component, or any h1-h3. */
function isHead(el: HTMLElement): boolean {
	return el.hasAttribute('data-rz-head') || /^H[1-3]$/.test(el.tagName);
}

/**
 * Blocks that must not be split across pages. The renderer tags entries with
 * data-rz-atom and section headings with data-rz-head; layouts with bespoke
 * markup fall back to their text-bearing leaf elements.
 */
function collectAtoms(sheet: HTMLElement): HTMLElement[] {
	const tagged = [...sheet.querySelectorAll<HTMLElement>('[data-rz-atom],[data-rz-head]')];
	const leaves = [...sheet.querySelectorAll<HTMLElement>('p,li,h1,h2,h3')].filter(
		(el) => !tagged.some((t) => t.contains(el)),
	);
	return [...tagged, ...leaves]
		.filter((el) => el.getBoundingClientRect().height > 0)
		.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
}

export interface Pagination {
	/** How many A4 pages the resume actually needs. */
	pages: number;
	/** Undoes every change made to the sheet. Always call it. */
	restore: () => void;
}

/**
 * Nudges page-straddling blocks down so page cuts land in the gaps between
 * them, and reports the resulting page count.
 */
export function paginateForPrint(sheet: HTMLElement): Pagination {
	const pushed: Pushed[] = [];
	const root = sheet.firstElementChild as HTMLElement | null;
	const rootRows = root ? root.style.gridTemplateRows : '';
	const sheetHeight = sheet.style.minHeight;

	const push = (el: HTMLElement, gap: number) => {
		pushed.push({ el, marginTop: el.style.marginTop });
		const current = parseFloat(getComputedStyle(el).marginTop) || 0;
		el.style.marginTop = `${current + gap}px`;
	};

	const atoms = collectAtoms(sheet);
	for (let i = 0; i < atoms.length; i++) {
		const el = atoms[i];
		// Re-measure every time: earlier pushes have moved what follows them.
		const sheetTop = sheet.getBoundingClientRect().top;
		const rect = el.getBoundingClientRect();
		const top = rect.top - sheetTop;
		const height = rect.height;
		if (height > MAX_MOVABLE) {
			continue;
		}

		const pageEnd = (Math.floor(top / PAGE_PX) + 1) * PAGE_PX;
		let straddles = top + height > pageEnd;

		// A heading that fits but whose first rows don't would be left stranded
		// at the foot of the page, so it travels down with them.
		if (!straddles && isHead(el)) {
			const next = atoms[i + 1];
			if (next) {
				const nextRect = next.getBoundingClientRect();
				const nextBottom = nextRect.top - sheetTop + nextRect.height;
				straddles = nextBottom > pageEnd && height + nextRect.height <= MAX_MOVABLE;
			}
		}

		if (straddles) {
			push(el, pageEnd - top + TOP_PAD);
		}
	}

	// Grow the sheet to whole pages so the last page is full-bleed — coloured
	// sidebars and bands then reach the bottom edge as they should.
	const height = sheet.getBoundingClientRect().height;
	const pages = Math.max(1, Math.ceil((height - PAGE_TOL) / PAGE_PX));
	const total = pages * PAGE_PX;
	if (root && rootRows) {
		root.style.gridTemplateRows = `minmax(${total}px, auto)`;
	} else {
		sheet.style.minHeight = `${total}px`;
	}

	return {
		pages,
		restore: () => {
			for (const p of pushed) {
				p.el.style.marginTop = p.marginTop;
			}
			if (root && rootRows) {
				root.style.gridTemplateRows = rootRows;
			} else {
				sheet.style.minHeight = sheetHeight;
			}
		},
	};
}
