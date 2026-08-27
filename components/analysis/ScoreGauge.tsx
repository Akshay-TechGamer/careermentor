export function ScoreGauge({ score, size = 180 }: { score: number; size?: number }) {
	const stroke = 12;
	const r = (size - stroke) / 2;
	const c = 2 * Math.PI * r;
	const offset = c - (score / 100) * c;
	const color = score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)';
	return (
		<div className="relative" style={{ width: size, height: size }}>
			<svg width={size} height={size} className="-rotate-90">
				<circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-high)" strokeWidth={stroke} />
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke={color}
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={c}
					strokeDashoffset={offset}
					style={{ transition: 'stroke-dashoffset 0.6s ease' }}
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-5xl font-extrabold font-[family-name:var(--font-mono)]" style={{ color }}>
					{score}
				</span>
				<span className="text-xs opacity-60 font-[family-name:var(--font-mono)]">/ 100</span>
			</div>
		</div>
	);
}
