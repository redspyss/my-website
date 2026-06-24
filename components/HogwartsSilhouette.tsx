"use client";

// Hogwarts silüeti — saf SVG, asset gerektirmez.
export default function HogwartsSilhouette({
  className = "",
  glow = true,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMax meet"
      className={className}
    >
      <defs>
        <linearGradient id="castleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0f1f" />
          <stop offset="100%" stopColor="#01030a" />
        </linearGradient>
        <radialGradient id="winGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd86b" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g fill="url(#castleGrad)">
        {/* base ridge */}
        <path d="M0 420 L0 300 L60 300 L80 250 L120 250 L120 320 L180 320 L200 200 L220 160 L240 200 L240 320 L300 320 L310 260 L350 260 L360 180 L380 140 L400 180 L410 260 L470 260 L480 300 L520 300 L540 220 L560 160 L580 130 L600 100 L620 130 L640 160 L660 220 L680 300 L730 300 L740 250 L800 250 L810 200 L830 150 L850 200 L860 280 L900 280 L920 230 L960 230 L980 180 L1000 220 L1010 300 L1060 300 L1080 260 L1120 260 L1140 300 L1200 300 L1200 420 Z" />
        {/* central tower spire */}
        <path d="M590 110 L600 60 L610 110 Z" />
        <path d="M370 150 L380 110 L390 150 Z" />
        <path d="M970 190 L980 150 L990 190 Z" />
      </g>

      {/* windows */}
      <g>
        {[
          [205, 235],
          [225, 260],
          [375, 200],
          [385, 230],
          [560, 200],
          [600, 170],
          [600, 210],
          [640, 200],
          [820, 220],
          [840, 245],
          [975, 215],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={glow ? 6 : 2}
            fill={glow ? "url(#winGlow)" : "#ffd86b"}
          >
            {glow && (
              <animate
                attributeName="opacity"
                values="0.4;1;0.5;0.9;0.4"
                dur={`${3 + (i % 4)}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}
      </g>
    </svg>
  );
}
