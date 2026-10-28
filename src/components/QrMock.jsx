import { useMemo } from "react";

// PRNG deterministik dari string seed (fnv1a → xorshift-ish rounds).
function seededRandom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

// QR dekoratif buatan sendiri — murni SVG mock, BUKAN kode pembayaran asli.
export default function QrMock({ seed, size = 190 }) {
  const n = 25; // 25x25 sel
  const s = 8; // ukuran sel
  const pad = 6;
  const vb = n * s + pad * 2;

  const cells = useMemo(() => {
    const rnd = seededRandom(seed || "saldoara");
    const inFinder = (r, c) =>
      (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8);
    const inCenter = (r, c) =>
      r >= 9 && r <= 15 && c >= 9 && c <= 15;
    const arr = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (!inFinder(r, c) && !inCenter(r, c) && rnd() > 0.52) arr.push([r, c]);
      }
    }
    return arr;
  }, [seed]);

  const finder = (x, y) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={7 * s} height={7 * s} rx={6} fill="#241245" />
      <rect x={x + s} y={y + s} width={5 * s} height={5 * s} rx={4} fill="#ffffff" />
      <rect x={x + 2 * s} y={y + 2 * s} width={3 * s} height={3 * s} rx={3} fill="#241245" />
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${vb} ${vb}`}
      width={size}
      height={size}
      role="img"
      aria-label="QR dekoratif simulasi pembayaran (bukan kode asli)"
    >
      <rect width={vb} height={vb} fill="#ffffff" />
      {cells.map(([r, c]) => (
        <rect
          key={`${r}-${c}`}
          x={pad + c * s}
          y={pad + r * s}
          width={s - 1}
          height={s - 1}
          rx={1.5}
          fill="#241245"
        />
      ))}
      {finder(pad, pad)}
      {finder(pad + (n - 7) * s, pad)}
      {finder(pad, pad + (n - 7) * s)}
      {/* "Logo" di tengah — dekoratif */}
      <circle cx={vb / 2} cy={vb / 2} r={16} fill="#7c3aed" />
      <text
        x={vb / 2}
        y={vb / 2 + 5}
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="#ffffff"
        fontFamily="inherit"
      >
        S
      </text>
    </svg>
  );
}
