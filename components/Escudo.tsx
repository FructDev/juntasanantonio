/**
 * Logo circular — Junta de Vecinos Sector San Antonio
 * Paleta: verde #1a7a1a / #38a838, azul #1565c0, naranja #f5a000, dorado #f9c21a
 */
export default function Escudo({ size = 36 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Junta de Vecinos Sector San Antonio"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        {/* Arc paths for ring text */}
        <path id="eT" d="M 10,60 A 50,50 0 0,0 110,60" />
        <path id="eB" d="M 10,60 A 50,50 0 0,1 110,60" />
        {/* Inner circle subtle gradient */}
        <radialGradient id="eBg" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f4fbf4" />
        </radialGradient>
      </defs>

      {/* ── Outer ring ── */}
      <circle cx="60" cy="60" r="59"   fill="#1a7a1a" />
      <circle cx="60" cy="60" r="52"   fill="#38a838" />
      <circle cx="60" cy="60" r="46.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="45"   fill="url(#eBg)" />

      {/* ── Ring text ── */}
      <text
        fontFamily="Arial Black,Arial,sans-serif"
        fontSize="8.8" fontWeight="900"
        fill="white" textAnchor="middle" letterSpacing="2.2"
      >
        <textPath href="#eT" startOffset="50%">JUNTA DE VECINOS</textPath>
      </text>
      <text
        fontFamily="Arial Black,Arial,sans-serif"
        fontSize="8.2" fontWeight="900"
        fill="white" textAnchor="middle" letterSpacing="1.9"
      >
        <textPath href="#eB" startOffset="50%">UNIÓN Y ESFUERZO</textPath>
      </text>

      {/* ── Green swoosh left — body/arm of blue person sweeping inward ── */}
      <path
        d="M 36,68 Q 20,52 24,32 Q 28,18 42,18 Q 52,18 57,24
           Q 50,27 44,37 Q 37,50 36,68 Z"
        fill="#38a838"
      />

      {/* ── Green swoosh right — mirror ── */}
      <path
        d="M 84,68 Q 100,52 96,32 Q 92,18 78,18 Q 68,18 63,24
           Q 70,27 76,37 Q 83,50 84,68 Z"
        fill="#38a838"
      />

      {/* ── Sun (yellow) behind house ── */}
      <circle cx="60" cy="27" r="9.5" fill="#f9c21a" />
      {/* Rays */}
      <g stroke="#f9c21a" strokeWidth="1.8" strokeLinecap="round">
        <line x1="60" y1="14"  x2="60" y2="11" />
        <line x1="69" y1="17"  x2="71" y2="14.5" />
        <line x1="74" y1="26"  x2="77" y2="26" />
        <line x1="51" y1="17"  x2="49" y2="14.5" />
        <line x1="46" y1="26"  x2="43" y2="26" />
      </g>

      {/* ── House ── */}
      {/* Roof */}
      <polygon points="60,32 43,49 77,49" fill="#1a7a1a" />
      {/* Chimney */}
      <rect x="68" y="34" width="3.5" height="13" fill="#1a7a1a" />
      {/* Walls */}
      <rect x="45" y="48" width="30" height="18" fill="#227022" />
      {/* Door */}
      <rect x="55.5" y="53" width="9" height="13" rx="1.5" fill="white" />
      {/* Windows */}
      <rect x="47.5" y="51.5" width="5" height="5" rx="0.8" fill="rgba(255,255,255,0.8)" />
      <rect x="67.5" y="51.5" width="5" height="5" rx="0.8" fill="rgba(255,255,255,0.8)" />

      {/* ── Blue person (left) ── */}
      <circle cx="22" cy="34" r="7" fill="#1565c0" />
      {/* Body curving right toward house */}
      <path d="M 22,41 Q 23,54 33,58 Q 40,61 44,58" fill="none" stroke="#1565c0" strokeWidth="5.5" strokeLinecap="round" />
      {/* Arm reaching right */}
      <path d="M 29,38 Q 38,35 44,42" fill="none" stroke="#1565c0" strokeWidth="4" strokeLinecap="round" />

      {/* ── Orange person (right) ── */}
      <circle cx="98" cy="34" r="7" fill="#f5a000" />
      {/* Body curving left toward house */}
      <path d="M 98,41 Q 97,54 87,58 Q 80,61 76,58" fill="none" stroke="#f5a000" strokeWidth="5.5" strokeLinecap="round" />
      {/* Arm reaching left + up */}
      <path d="M 91,38 Q 82,35 76,42" fill="none" stroke="#f5a000" strokeWidth="4" strokeLinecap="round" />
      {/* Arm up */}
      <path d="M 98,40 Q 100,32 105,29" fill="none" stroke="#f5a000" strokeWidth="3.5" strokeLinecap="round" />

      {/* ── Small child figure (center, green) ── */}
      <circle cx="60" cy="67" r="4"   fill="#43a047" />
      <path d="M 56.5,71 Q 60,79 63.5,71 Z" fill="#43a047" />

      {/* ── Text ── */}
      <text x="60" y="82"  textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.6" fontWeight="800" fill="#1a7a1a" letterSpacing="0.4">CONSTRUYENDO UN</text>
      <text x="60" y="88.5" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.6" fontWeight="800" fill="#1a7a1a" letterSpacing="0.4">FUTURO MEJOR</text>

      {/* ── Decorative divider ── */}
      <line x1="37" y1="92.5" x2="55" y2="92.5" stroke="#1a7a1a" strokeWidth="0.7" opacity="0.35" />
      <circle cx="60" cy="92.5" r="2.5" fill="#f9c21a" opacity="0.7" />
      <line x1="65" y1="92.5" x2="83" y2="92.5" stroke="#1a7a1a" strokeWidth="0.7" opacity="0.35" />

      {/* ── Gold outer border ── */}
      <circle cx="60" cy="60" r="58.5" fill="none" stroke="#f9c21a" strokeWidth="0.9" opacity="0.45" />
    </svg>
  );
}
