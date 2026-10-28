// Donut SVG buatan sendiri — satu lingkaran per segmen via stroke-dasharray.
export default function DonutChart({ data, size = 210, stroke = 26, centerLabel, centerValue }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = (size - stroke) / 2 - 2;
  const C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-auto w-full max-w-[230px]"
      role="img"
      aria-label="Grafik donut pengeluaran per kategori"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={R}
        fill="none"
        stroke="var(--color-cardhi)"
        strokeWidth={stroke}
      />
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {total > 0 &&
          data.map((d) => {
            const frac = d.value / total;
            const dash = Math.max(frac * C - 3, 0.8); // celah kecil antar segmen
            const el = (
              <circle
                key={d.cat}
                cx={size / 2}
                cy={size / 2}
                r={R}
                fill="none"
                stroke={d.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-acc * C}
              />
            );
            acc += frac;
            return el;
          })}
      </g>
      {centerValue != null && (
        <>
          <text
            x={size / 2}
            y={size / 2 - 2}
            textAnchor="middle"
            fontSize="19"
            fontWeight="800"
            fill="var(--color-ink)"
          >
            {centerValue}
          </text>
          <text
            x={size / 2}
            y={size / 2 + 16}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="var(--color-mute)"
          >
            {centerLabel}
          </text>
        </>
      )}
    </svg>
  );
}
