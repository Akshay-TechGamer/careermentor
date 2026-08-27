import { Suspense } from 'react';
import { BuildEditor } from '@/components/editor/BuildEditor';

export default function BuildPage() {
	return (
		<Suspense fallback={<div className="py-32 text-center text-outline">Loading editor…</div>}>
			<BuildEditor />
		</Suspense>
	);
}
