export default function Sparkline({ points }) {
  if (!points || points.length < 2) return null;
  const w = 100, h = 24, pad = 2;
  const max = 100, min = 0;
  const step = (w - pad * 2) / (points.length - 1);
  const pts = points
    .map((v, i) => {
      const x = pad + i * step;
      const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const last = points[points.length - 1];
  const color = last >= 90 ? "var(--fresh)" : last >= 50 ? "var(--honey)" : "var(--terracotta)";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
