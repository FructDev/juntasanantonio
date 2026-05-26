/**
 * Escudo Junta de Vecinos · Barrio San Antonio · San Cristóbal
 * Cuarteles azul/rojo (bandera dominicana) · Cruz blanca · Casa central
 */
export default function Escudo({ size = 36 }: { size?: number }) {
  const h = Math.round(size * 152 / 120);
  return (
    <svg
      viewBox="0 0 120 152"
      width={size}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Escudo Junta de Vecinos Barrio San Antonio"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <clipPath id="esc-clip">
          <path d="M60,9 Q34,9 19,22 L19,87 Q19,129 60,143 Q101,129 101,87 L101,22 Q86,9 60,9 Z"/>
        </clipPath>
        <linearGradient id="esc-gld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4d96a"/>
          <stop offset="50%" stopColor="#d4a020"/>
          <stop offset="100%" stopColor="#a87010"/>
        </linearGradient>
      </defs>

      {/* Gold outer shape */}
      <path d="M60,4 Q30,4 13,18 L13,87 Q13,133 60,149 Q107,133 107,87 L107,18 Q90,4 60,4 Z"
            fill="url(#esc-gld)"/>

      {/* Clipped content */}
      <g clipPath="url(#esc-clip)">
        {/* Quadrants */}
        <rect x="19" y="9"  width="41" height="66" fill="#003580"/>
        <rect x="60" y="9"  width="41" height="66" fill="#bf0d27"/>
        <rect x="19" y="75" width="41" height="68" fill="#bf0d27"/>
        <rect x="60" y="75" width="41" height="68" fill="#003580"/>

        {/* White cross */}
        <rect x="19" y="69" width="82" height="12" fill="white"/>
        <rect x="54" y="9"  width="12" height="134" fill="white"/>

        {/* Stars */}
        {[
          { cx: 36, cy: 38, op: 0.7 },
          { cx: 84, cy: 38, op: 0.55 },
          { cx: 36, cy: 105, op: 0.55 },
          { cx: 84, cy: 105, op: 0.7 },
        ].map(({ cx, cy, op }) => (
          <polygon
            key={`${cx}-${cy}`}
            transform={`translate(${cx},${cy})`}
            opacity={op}
            fill="white"
            points="0,-4.5 1.06,-1.46 4.28,-1.39 1.71,0.56 2.65,3.64 0,1.7 -2.65,3.64 -1.71,0.56 -4.28,-1.39 -1.06,-1.46"
          />
        ))}

        {/* Center circle */}
        <circle cx="60" cy="75" r="17" fill="white"/>
        <circle cx="60" cy="75" r="17" fill="none" stroke="#d4a020" strokeWidth="0.8"/>

        {/* House */}
        <polygon points="60,62 49,73 71,73" fill="#003580"/>
        <rect x="51" y="73" width="18" height="12" fill="#003580"/>
        <rect x="57" y="77" width="6" height="8" rx="1" fill="white"/>
        <rect x="65" y="63" width="3" height="7" fill="#003580"/>
        <rect x="53" y="74" width="4" height="4" rx="0.5" fill="white"/>
        <rect x="63" y="74" width="4" height="4" rx="0.5" fill="white"/>
      </g>

      {/* Gold border */}
      <path d="M60,4 Q30,4 13,18 L13,87 Q13,133 60,149 Q107,133 107,87 L107,18 Q90,4 60,4 Z"
            fill="none" stroke="#8a6808" strokeWidth="1.5"/>

      {/* Inner fine white line */}
      <path d="M60,11 Q35,11 21,24 L21,87 Q21,127 60,140 Q99,127 99,87 L99,24 Q85,11 60,11 Z"
            fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="1"/>
    </svg>
  );
}
