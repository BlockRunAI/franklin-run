type GuillocheVariant = "rosette" | "wave" | "panel";

interface GuillocheProps {
  variant?: GuillocheVariant;
  className?: string;
  opacity?: number;
}

const TAU = Math.PI * 2;

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Build a closed epicycloid / hypotrochoid-style path (spirograph petal ring).
 * Deterministic: every value derives from the fixed numeric params.
 */
function rosettePetalPath(
  cx: number,
  cy: number,
  baseR: number,
  petals: number,
  amp: number,
  phase: number,
  steps: number,
): string {
  let d = "";
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * TAU;
    const r = baseR + amp * Math.cos(petals * t + phase);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    d += `${i === 0 ? "M" : "L"}${round(x)} ${round(y)}`;
  }
  return `${d}Z`;
}

/**
 * Lissajous wave band — a single interwoven horizontal line.
 * Deterministic: shape comes only from the passed frequency/phase params.
 */
function wavePath(
  width: number,
  midY: number,
  amp: number,
  freq: number,
  phase: number,
  steps: number,
): string {
  let d = "";
  for (let i = 0; i <= steps; i += 1) {
    const px = (i / steps) * width;
    const t = (i / steps) * TAU * freq;
    const y =
      midY + amp * Math.sin(t + phase) + amp * 0.4 * Math.sin(t * 2 + phase * 1.7);
    d += `${i === 0 ? "M" : "L"}${round(px)} ${round(y)}`;
  }
  return d;
}

function rosetteRings() {
  const cx = 300;
  const cy = 300;
  const rings = [
    { baseR: 260, petals: 28, amp: 14, phase: 0 },
    { baseR: 220, petals: 24, amp: 16, phase: 0.4 },
    { baseR: 182, petals: 20, amp: 14, phase: 0.8 },
    { baseR: 146, petals: 16, amp: 12, phase: 1.2 },
    { baseR: 112, petals: 13, amp: 11, phase: 1.6 },
    { baseR: 80, petals: 10, amp: 9, phase: 2.0 },
    { baseR: 52, petals: 8, amp: 7, phase: 2.4 },
    { baseR: 28, petals: 6, amp: 5, phase: 2.8 },
  ];
  return (
    <g fill="none" stroke="var(--gold-line)" strokeWidth={0.6}>
      {rings.map((ring, i) => (
        <path
          key={i}
          d={rosettePetalPath(cx, cy, ring.baseR, ring.petals, ring.amp, ring.phase, 600)}
        />
      ))}
      {[244, 168, 96, 40].map((r, i) => (
        <circle key={`c${i}`} cx={cx} cy={cy} r={r} />
      ))}
    </g>
  );
}

function waveBands() {
  const width = 1200;
  const midY = 60;
  const bands = [
    { amp: 22, freq: 9, phase: 0 },
    { amp: 22, freq: 9, phase: 0.7 },
    { amp: 22, freq: 9, phase: 1.4 },
    { amp: 16, freq: 13, phase: 0.3 },
    { amp: 16, freq: 13, phase: 1.0 },
    { amp: 12, freq: 18, phase: 0.5 },
  ];
  return (
    <g fill="none" stroke="var(--gold-line)" strokeWidth={0.7}>
      {bands.map((band, i) => (
        <path key={i} d={wavePath(width, midY, band.amp, band.freq, band.phase, 600)} />
      ))}
    </g>
  );
}

function panelFlourish() {
  const corners = [
    { x: 70, y: 70, mirror: false },
    { x: 530, y: 70, mirror: true },
  ];
  return (
    <g fill="none" stroke="var(--gold-line)" strokeWidth={0.6}>
      <rect x={14} y={14} width={572} height={372} rx={6} />
      <rect x={22} y={22} width={556} height={356} rx={5} />
      {corners.map((corner, i) => (
        <g key={i} transform={corner.mirror ? `translate(${corner.x * 2} 0) scale(-1 1)` : undefined}>
          {[26, 40, 54].map((r, j) => (
            <path key={j} d={rosettePetalPath(corner.x, corner.y, r, 8, 5, 0.4 * j, 360)} />
          ))}
        </g>
      ))}
    </g>
  );
}

const VIEWBOX: Record<GuillocheVariant, string> = {
  rosette: "0 0 600 600",
  wave: "0 0 1200 120",
  panel: "0 0 600 400",
};

export function Guilloche({ variant = "rosette", className, opacity = 1 }: GuillocheProps) {
  return (
    <svg
      className={className}
      viewBox={VIEWBOX[variant]}
      preserveAspectRatio={variant === "wave" ? "none" : "xMidYMid meet"}
      aria-hidden="true"
      focusable="false"
      style={{ opacity, pointerEvents: "none" }}
    >
      {variant === "wave" ? waveBands() : variant === "panel" ? panelFlourish() : rosetteRings()}
    </svg>
  );
}
