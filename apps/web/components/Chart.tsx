import type { Punto } from "@/lib/mercado";

// Gráfico de área simple en SVG, sin librerías. Toma una serie { fecha, valor }
// y dibuja el área + la línea en color de acento (bordó). Escala al ancho del
// contenedor (ver .chartwrap svg en globals.css).
export default function Chart({
  data,
  max = 90,
}: {
  data: Punto[];
  max?: number;
}) {
  const pts = data.slice(-max);
  if (pts.length < 2) {
    return (
      <p className="muted" style={{ fontSize: 13 }}>
        Sin datos suficientes para el gráfico.
      </p>
    );
  }

  const W = 600;
  const H = 150;
  const pad = 8;
  const ys = pts.map((p) => p.valor);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const range = maxY - minY || 1;
  const X = (i: number) => pad + (i / (pts.length - 1)) * (W - pad * 2);
  const Y = (v: number) => H - pad - ((v - minY) / range) * (H - pad * 2);

  const line = pts
    .map((p, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(p.valor).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${X(pts.length - 1).toFixed(1)},${H - pad} L${X(0).toFixed(1)},${H - pad} Z`;
  const lastI = pts.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-hidden="true">
      <path d={area} fill="var(--accent)" fillOpacity={0.1} />
      <path
        d={line}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={X(lastI)} cy={Y(pts[lastI].valor)} r={3.5} fill="var(--accent)" />
    </svg>
  );
}
