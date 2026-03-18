import { useId } from 'react';

export function PuertoRicoFlagArt({ className = '' }) {
  const clipPathId = useId();
  const outlinePath = 'M10 18C36 8 64 8 92 14C114 19 133 20 150 15V95C129 101 105 101 79 95C55 89 33 88 10 98Z';

  return (
    <svg className={className} viewBox="0 0 160 110" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipPathId}>
          <path d={outlinePath} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <rect x="10" y="15" width="140" height="16" fill="#ed0000" />
        <rect x="10" y="31" width="140" height="16" fill="#ffffff" />
        <rect x="10" y="47" width="140" height="16" fill="#ed0000" />
        <rect x="10" y="63" width="140" height="16" fill="#ffffff" />
        <rect x="10" y="79" width="140" height="16" fill="#ed0000" />
        <path d="M10 15L80 55L10 95Z" fill="#0050f0" />
        <path d="M33.333 41.5L37.253 49.444L46.019 50.717L39.676 56.897L41.174 65.628L33.333 61.506L25.492 65.628L26.99 56.897L20.647 50.717L29.413 49.444Z" fill="#ffffff" />
      </g>
      <path d={outlinePath} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CoquiArt({ className = '' }) {
  const gradientId = useId();

  return (
    <svg className={className} viewBox="0 0 140 140" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fefefe" />
          <stop offset="100%" stopColor="#d7e4ff" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="78" rx="36" ry="31" fill={`url(#${gradientId})`} stroke="#0038a8" strokeWidth="5" />
      <ellipse cx="70" cy="56" rx="44" ry="28" fill={`url(#${gradientId})`} stroke="#0038a8" strokeWidth="5" />
      <circle cx="47" cy="41" r="13" fill="#ffffff" stroke="#0038a8" strokeWidth="5" />
      <circle cx="93" cy="41" r="13" fill="#ffffff" stroke="#0038a8" strokeWidth="5" />
      <circle cx="50" cy="44" r="5" fill="#0038a8" />
      <circle cx="90" cy="44" r="5" fill="#0038a8" />
      <circle cx="39" cy="22" r="9" fill="#ed0000" stroke="#0038a8" strokeWidth="4" />
      <circle cx="101" cy="22" r="9" fill="#ed0000" stroke="#0038a8" strokeWidth="4" />
      <circle cx="53" cy="82" r="7" fill="#ed0000" opacity="0.18" />
      <circle cx="87" cy="82" r="7" fill="#ed0000" opacity="0.18" />
      <path d="M61 63C65 67 75 67 79 63" fill="none" stroke="#ed0000" strokeWidth="5" strokeLinecap="round" />
      <path d="M37 88C22 95 17 105 19 116" fill="none" stroke="#0038a8" strokeWidth="6" strokeLinecap="round" />
      <path d="M103 88C118 95 123 105 121 116" fill="none" stroke="#0038a8" strokeWidth="6" strokeLinecap="round" />
      <path d="M52 102C48 116 39 123 28 126" fill="none" stroke="#0038a8" strokeWidth="6" strokeLinecap="round" />
      <path d="M88 102C92 116 101 123 112 126" fill="none" stroke="#0038a8" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function HeritageArtCluster({ className = '', compact = false }) {
  return (
    <div className={`${compact ? 'heritage-art heritage-art--compact' : 'heritage-art'} ${className}`.trim()} aria-hidden="true">
      <div className="heritage-art__flag-wrap">
        <PuertoRicoFlagArt className="heritage-art__flag" />
      </div>
      <div className="heritage-art__coqui-wrap">
        <CoquiArt className="heritage-art__coqui" />
      </div>
    </div>
  );
}