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
  const backGradientId = useId();
  const bellyGradientId = useId();
  const leafGradientId = useId();

  return (
    <svg className={className} viewBox="0 0 140 140" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={backGradientId} x1="0.18" y1="0.12" x2="0.84" y2="0.92">
          <stop offset="0%" stopColor="#8e6c52" />
          <stop offset="58%" stopColor="#72533f" />
          <stop offset="100%" stopColor="#563b2f" />
        </linearGradient>
        <linearGradient id={bellyGradientId} x1="0.2" y1="0.1" x2="0.8" y2="0.9">
          <stop offset="0%" stopColor="#f0e5d6" />
          <stop offset="100%" stopColor="#d5c0aa" />
        </linearGradient>
        <linearGradient id={leafGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ece83" />
          <stop offset="100%" stopColor="#2f8f4c" />
        </linearGradient>
      </defs>
      <path d="M24 112C43 95 59 89 78 89C98 89 112 95 126 111C106 121 91 125 70 125C50 125 37 122 24 112Z" fill={`url(#${leafGradientId})`} opacity="0.95" />
      <path d="M27 113C48 103 91 102 121 113" fill="none" stroke="#1f6f3a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M49 91C39 96 31 103 27 114" fill="none" stroke="#5fd06d" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      <path d="M92 92C104 97 114 103 120 112" fill="none" stroke="#5fd06d" strokeWidth="3" strokeLinecap="round" opacity="0.85" />

      <path d="M38 83C28 92 24 100 23 110" fill="none" stroke="#6c4d3d" strokeWidth="7" strokeLinecap="round" />
      <path d="M102 83C111 91 117 100 117 110" fill="none" stroke="#6c4d3d" strokeWidth="7" strokeLinecap="round" />
      <path d="M42 84C34 97 29 109 27 122" fill="none" stroke="#6c4d3d" strokeWidth="7" strokeLinecap="round" />
      <path d="M98 84C106 97 111 109 113 122" fill="none" stroke="#6c4d3d" strokeWidth="7" strokeLinecap="round" />

      <path d="M31 119C25 120 21 123 20 127" fill="none" stroke="#6c4d3d" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M35 121C30 124 27 127 27 130" fill="none" stroke="#6c4d3d" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M40 122C37 126 36 128 37 131" fill="none" stroke="#6c4d3d" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="19" cy="127" r="4.8" fill="#f0c79b" />
      <circle cx="27" cy="130" r="4.8" fill="#f0c79b" />
      <circle cx="37" cy="131" r="4.6" fill="#f0c79b" />

      <path d="M109 119C115 120 119 123 120 127" fill="none" stroke="#6c4d3d" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M105 121C110 124 113 127 113 130" fill="none" stroke="#6c4d3d" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M100 122C103 126 104 128 103 131" fill="none" stroke="#6c4d3d" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="120" cy="127" r="4.8" fill="#f0c79b" />
      <circle cx="113" cy="130" r="4.8" fill="#f0c79b" />
      <circle cx="103" cy="131" r="4.6" fill="#f0c79b" />

      <path d="M46 92C38 98 33 107 31 117" fill="none" stroke="#6c4d3d" strokeWidth="6" strokeLinecap="round" />
      <path d="M94 92C102 98 107 107 109 117" fill="none" stroke="#6c4d3d" strokeWidth="6" strokeLinecap="round" />
      <path d="M31 116C22 117 16 120 13 125" fill="none" stroke="#6c4d3d" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M34 118C26 121 22 125 21 129" fill="none" stroke="#6c4d3d" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M109 116C118 117 124 120 127 125" fill="none" stroke="#6c4d3d" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M106 118C114 121 118 125 119 129" fill="none" stroke="#6c4d3d" strokeWidth="4.2" strokeLinecap="round" />
      <circle cx="12" cy="125" r="4.6" fill="#f0c79b" />
      <circle cx="21" cy="129" r="4.6" fill="#f0c79b" />
      <circle cx="128" cy="125" r="4.6" fill="#f0c79b" />
      <circle cx="119" cy="129" r="4.6" fill="#f0c79b" />

      <ellipse cx="70" cy="82" rx="33" ry="25" fill={`url(#${backGradientId})`} stroke="#4f3528" strokeWidth="4.5" />
      <path d="M45 79C49 96 60 103 70 103C81 103 92 96 95 79" fill={`url(#${bellyGradientId})`} stroke="#8d7058" strokeWidth="2.5" />
      <ellipse cx="70" cy="56" rx="38" ry="24" fill={`url(#${backGradientId})`} stroke="#4f3528" strokeWidth="4.5" />
      <path d="M57 41C47 43 41 48 39 55" fill="none" stroke="#a98a6b" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M83 40C94 42 101 48 103 56" fill="none" stroke="#a98a6b" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M67 36C69 45 69 53 67 62" fill="none" stroke="#9a7a5f" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M74 36C76 45 76 53 74 62" fill="none" stroke="#9a7a5f" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="49" cy="46" rx="10.5" ry="12" fill="#d9b16e" stroke="#4f3528" strokeWidth="3.5" />
      <ellipse cx="91" cy="46" rx="10.5" ry="12" fill="#d9b16e" stroke="#4f3528" strokeWidth="3.5" />
      <ellipse cx="49" cy="46" rx="5" ry="6.4" fill="#171412" />
      <ellipse cx="91" cy="46" rx="5" ry="6.4" fill="#171412" />
      <circle cx="51" cy="43" r="1.4" fill="#ffffff" />
      <circle cx="93" cy="43" r="1.4" fill="#ffffff" />
      <path d="M63 64C67 67 73 67 77 64" fill="none" stroke="#4f3528" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="62" cy="72" r="3.8" fill="#8f6d58" opacity="0.65" />
      <circle cx="78" cy="72" r="3.8" fill="#8f6d58" opacity="0.65" />
      <circle cx="54" cy="87" r="4.2" fill="#8b5f4b" opacity="0.38" />
      <circle cx="85" cy="88" r="4.2" fill="#8b5f4b" opacity="0.38" />
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