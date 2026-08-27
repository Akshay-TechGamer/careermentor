import { ResumeRenderer } from '@/components/resume/ResumeRenderer';
import { sampleResume, type ResumeData } from '@/lib/types';
import type { Template } from '@/lib/templates/registry';

// Renders a real, scaled-down resume (sample data) as the template preview —
// the same approach resume.io uses, so what you pick is what you get.

/** Neutral placeholder headshot for photo templates (inline SVG, no asset). */
const THUMB_PHOTO =
	"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'><rect width='96' height='96' fill='%23e2e8f0'/><circle cx='48' cy='38' r='16' fill='%2394a3b8'/><path d='M16 88c4-18 18-26 32-26s28 8 32 26z' fill='%2394a3b8'/></svg>";

/** Sample data padded out so tall layouts don't look empty in the preview. */
function thumbData(template: Template): ResumeData {
	const data = sampleResume();
	data.style = { font: template.font };
	if (template.hasPhoto) {
		data.personal.photo = THUMB_PHOTO;
	}
	data.experience.push({
		id: 'e2',
		role: 'UX Designer',
		company: 'Innova Labs',
		start: '2018',
		end: '2021',
		current: false,
		bullets: [
			'Shipped a mobile onboarding flow that raised activation by 18%.',
			'Ran 40+ usability sessions and turned findings into roadmap wins.',
		],
	});
	data.projects.push({
		id: 'p1',
		name: 'Design Tokens Pipeline',
		description: 'Automated theme delivery across web and mobile apps.',
		link: '',
	});
	return data;
}

// A4 sheet is 794×1123 CSS px; scale it to a 220px-wide card thumb.
const SHEET_W = 794;
const SHEET_H = 1123;
const THUMB_W = 220;
const SCALE = THUMB_W / SHEET_W;

export function TemplateThumb({ template }: { template: Template }) {
	return (
		<div className="aspect-[4/3] p-5 pb-0 flex items-start justify-center overflow-hidden">
			<div
				className="bg-white rounded shadow-sm overflow-hidden relative shrink-0"
				style={{ width: THUMB_W, height: Math.round(SHEET_H * SCALE) }}
			>
				<div
					className="absolute top-0 left-0 origin-top-left pointer-events-none select-none"
					style={{ width: SHEET_W, height: SHEET_H, transform: `scale(${SCALE})` }}
					aria-hidden
				>
					<ResumeRenderer data={thumbData(template)} templateSlug={template.slug} />
				</div>
			</div>
		</div>
	);
}
