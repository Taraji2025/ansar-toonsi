/**
 * Radar (spider) chart en SVG pur — aucune dépendance
 * props : axes=[{key, label, max}], data={key:val}, color
 */
export default function StatRadar({ axes, data, color }) {
  const cx = 110, cy = 110, R = 85;
  const n = axes.length;

  // angle en radians pour l'axe i, départ en haut (- pi/2)
  const angle = i => (2 * Math.PI * i) / n - Math.PI / 2;

  // coordonnée d'un point sur le cercle de rayon r
  const pt = (i, r) => {
    const a = angle(i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  // polygone vers string path
  const poly = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + 'Z';

  // grilles (20 / 40 / 60 / 80 / 100%)
  const grilles = [0.2, 0.4, 0.6, 0.8, 1.0];

  // points des données
  const dataPts = axes.map((ax, i) => {
    const v = data[ax.key] ?? 0;
    const ratio = Math.min(v / ax.max, 1);
    return pt(i, ratio * R);
  });

  return (
    <svg viewBox="0 0 220 220" style={{ width: '100%', maxWidth: 220, display: 'block', margin: '0 auto' }}>
      {/* ── Grilles ── */}
      {grilles.map(g => (
        <polygon
          key={g}
          points={axes.map((_, i) => pt(i, g * R).join(',')).join(' ')}
          fill="none"
          stroke="var(--border)"
          strokeWidth={g === 1 ? 1.5 : 0.8}
          opacity={g === 1 ? 0.8 : 0.4}
        />
      ))}

      {/* ── Axes ── */}
      {axes.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth={0.8} opacity={0.5} />;
      })}

      {/* ── Données ── */}
      <polygon
        points={dataPts.map(p => p.join(',')).join(' ')}
        fill={color + '30'}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* ── Points ── */}
      {dataPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={color} stroke="var(--bg2)" strokeWidth={1.5} />
      ))}

      {/* ── Labels ── */}
      {axes.map((ax, i) => {
        const [x, y] = pt(i, R + 18);
        const val = data[ax.key] ?? 0;
        return (
          <g key={i}>
            <text
              x={x} y={y}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={8} fontWeight={700}
              fill="var(--text-muted)"
            >
              {ax.label}
            </text>
            <text
              x={x} y={y + 10}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={9} fontWeight={900}
              fill={val > 0 ? color : 'var(--text-muted)'}
            >
              {val}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
