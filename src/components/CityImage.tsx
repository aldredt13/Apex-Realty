// Self-contained SVG "skyline" used on area cards so they always render
// (no external image dependency). Palette shifts slightly per index.
type CityImageProps = {
  index: number;
  coastal?: boolean;
};

const skies = [
  ["#1a4a8a", "#0d2a5c"],
  ["#20558f", "#10306a"],
  ["#2a5c9c", "#123a78"],
  ["#1c4e86", "#0e2c60"],
  ["#245794", "#113472"],
  ["#1e5290", "#0f2e64"],
];

export default function CityImage({ index, coastal = false }: CityImageProps) {
  const [top, bottom] = skies[index % skies.length];
  const id = `sky-${index}`;

  return (
    <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden focusable={false}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="400" height="150" fill={`url(#${id})`} />

      {/* sun / moon glow */}
      <circle cx="320" cy="40" r="26" fill="#e9c96b" opacity="0.25" />
      <circle cx="320" cy="40" r="14" fill="#f6e4ad" opacity="0.35" />

      {/* distant buildings */}
      <g fill="#0b2350" opacity="0.55">
        <rect x="10" y="78" width="26" height="72" />
        <rect x="44" y="64" width="20" height="86" />
        <rect x="72" y="86" width="30" height="64" />
        <rect x="300" y="70" width="24" height="80" />
        <rect x="332" y="82" width="30" height="68" />
        <rect x="368" y="60" width="22" height="90" />
      </g>

      {/* foreground buildings */}
      <g fill="#081a3a">
        <rect x="0" y="96" width="40" height="54" />
        <rect x="46" y="80" width="34" height="70" />
        <rect x="86" y="104" width="30" height="46" />
        <rect x="120" y="70" width="40" height="80" />
        <rect x="166" y="92" width="30" height="58" />
        <rect x="200" y="60" width="38" height="90" />
        <rect x="244" y="88" width="34" height="62" />
        <rect x="284" y="100" width="36" height="50" />
        <rect x="326" y="78" width="30" height="72" />
        <rect x="360" y="98" width="40" height="52" />
      </g>

      {/* lit windows */}
      <g fill="#e9c96b" opacity="0.75">
        <rect x="128" y="80" width="4" height="6" />
        <rect x="138" y="80" width="4" height="6" />
        <rect x="148" y="80" width="4" height="6" />
        <rect x="128" y="94" width="4" height="6" />
        <rect x="148" y="94" width="4" height="6" />
        <rect x="208" y="72" width="4" height="6" />
        <rect x="218" y="72" width="4" height="6" />
        <rect x="228" y="72" width="4" height="6" />
        <rect x="208" y="86" width="4" height="6" />
        <rect x="228" y="86" width="4" height="6" />
        <rect x="54" y="92" width="4" height="6" />
        <rect x="64" y="92" width="4" height="6" />
      </g>

      {coastal && (
        <g>
          <rect x="0" y="140" width="400" height="10" fill="#0a3a6a" opacity="0.6" />
          <path
            d="M0 142 q20 -3 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"
            stroke="#4a90e2"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />
        </g>
      )}
    </svg>
  );
}
