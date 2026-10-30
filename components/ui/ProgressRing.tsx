type ProgressRingProps = {
  /** Progreso en porcentaje (0–100). Se recorta al rango válido. */
  value: number;
  /** Diámetro del anillo en px. Por defecto 64. */
  size?: number;
  /** Etiqueta accesible ya traducida; si falta, se usa "{value}%". */
  label?: string;
};

/**
 * Anillo de progreso circular en SVG. El trazo de progreso usa
 * `currentColor` para adaptarse al tema. Expone `role="img"` y
 * `aria-label` con el porcentaje. Componente "tonto": solo props.
 */
export function ProgressRing({ value, size = 64, label }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const rounded = Math.round(clamped);
  const strokeWidth = Math.max(4, Math.round(size * 0.1));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);
  const center = size / 2;
  const ariaLabel = label ?? `${rounded}%`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        className="num"
        fill="var(--fg)"
        fontSize={size * 0.26}
      >
        {rounded}%
      </text>
    </svg>
  );
}
