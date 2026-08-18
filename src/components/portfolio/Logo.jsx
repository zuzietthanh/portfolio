import { useId } from "react";

/**
 * The TV monogram: the T's crossbar and stem sit over a chevron V, cut as
 * facets so the mark catches light like bevelled metal rather than reading as
 * flat colour. The same shape ships as public/favicon.svg and on the CV — if
 * you change the geometry here, change it there too.
 *
 * Gradient ids are generated per instance. Two copies of this component on one
 * page with hardcoded ids would both resolve to whichever appeared first, so
 * the second would silently inherit the first one's fills.
 */
export default function Logo({ size = 30, className = "" }) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}-tile`} x1="0" y1="0" x2="0.65" y2="1">
          <stop offset="0" stopColor="#1B2742" />
          <stop offset="0.55" stopColor="#101827" />
          <stop offset="1" stopColor="#080B12" />
        </linearGradient>
        <linearGradient id={`${uid}-lit`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#CFE0FF" />
          <stop offset="1" stopColor="#6FA3FB" />
        </linearGradient>
        <linearGradient id={`${uid}-deep`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#5B93F9" />
          <stop offset="1" stopColor="#2154C4" />
        </linearGradient>
        {/* The rim of light along the top edge. This is what makes the tile
            read as an object catching light instead of a flat square. */}
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.04" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="15" fill={`url(#${uid}-tile)`} />
      <rect
        x="0.6"
        y="0.6"
        width="62.8"
        height="62.8"
        rx="14.4"
        fill="none"
        stroke={`url(#${uid}-rim)`}
        strokeWidth="1.2"
      />

      {/* Drawn around its own centre (32, 37), then re-centred in the tile. */}
      <g transform="translate(32 32) scale(0.9) translate(-32 -37)">
        <path d="M13 16 H51 V23 H13 Z" fill={`url(#${uid}-lit)`} />
        <path d="M16 25 L32 49 L48 25 L48 34 L32 58 L16 34 Z" fill={`url(#${uid}-deep)`} />
        <path d="M28.5 23 H35.5 V40 L32 45 L28.5 40 Z" fill={`url(#${uid}-lit)`} />
      </g>
    </svg>
  );
}
