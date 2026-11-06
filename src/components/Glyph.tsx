import type { GlyphKind } from '../lib/data';

interface GlyphProps {
  kind: GlyphKind;
  className?: string;
}

export function Glyph({ kind, className = '' }: GlyphProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.1,
    vectorEffect: 'non-scaling-stroke' as const,
  };

  return (
    <svg
      aria-hidden="true"
      className={`glyph ${className}`.trim()}
      viewBox="0 0 48 48"
      fill="none"
    >
      {kind === 'gateway' && (
        <>
          <path d="M8 8v32M40 8v32" {...common} />
          <path d="M8 16h8l8 8 8-8h8M8 32h8l8-8 8 8h8" {...common} />
          <circle cx="24" cy="24" r="3.4" fill="currentColor" />
          <circle cx="8" cy="16" r="1.6" fill="currentColor" />
          <circle cx="40" cy="16" r="1.6" fill="currentColor" />
          <circle cx="8" cy="32" r="1.6" fill="currentColor" />
          <circle cx="40" cy="32" r="1.6" fill="currentColor" />
        </>
      )}

      {kind === 'identity' && (
        <>
          <circle cx="24" cy="24" r="13" {...common} strokeDasharray="1 3" />
          <path d="M17 15v-5h-5M31 15v-5h5M17 33v5h-5M31 33v5h5" {...common} />
          <circle cx="24" cy="21" r="4" {...common} />
          <path d="M16 33c1.8-5 4.5-7 8-7s6.2 2 8 7" {...common} />
        </>
      )}

      {kind === 'database' && (
        <>
          <ellipse cx="24" cy="13" rx="14" ry="5" {...common} />
          <path d="M10 13v10c0 2.8 6.3 5 14 5s14-2.2 14-5V13" {...common} />
          <path d="M10 23v10c0 2.8 6.3 5 14 5s14-2.2 14-5V23" {...common} />
          <circle cx="17" cy="28" r="1.4" fill="currentColor" />
          <circle cx="17" cy="18" r="1.4" fill="currentColor" />
        </>
      )}

      {kind === 'display' && (
        <>
          <rect x="7" y="10" width="34" height="25" {...common} />
          <path d="M7 17h34M13 10v25M7 28h34" {...common} opacity=".5" />
          <path d="M18 40h12" {...common} />
          <path d="M26 12v4M29 12v4M22 12v4" {...common} opacity=".7" />
          <circle cx="12" cy="33.5" r="1.2" fill="currentColor" />
        </>
      )}

      {kind === 'edge' && (
        <>
          <path d="M24 5 40 14v20L24 43 8 34V14L24 5Z" {...common} />
          <path d="M24 13 33 18v12l-9 5-9-5V18l9-5Z" {...common} />
          <path d="M24 20v12M18 23l12 6M30 23l-12 6" {...common} />
        </>
      )}

      {kind === 'queue' && (
        <>
          <path d="M8 12h5M17 12h5M26 12h5M35 12h5" {...common} />
          <path d="M8 20h5M17 20h5M26 20h5M35 20h5" {...common} opacity=".75" />
          <path d="M8 28h5M17 28h5M26 28h5M35 28h5" {...common} opacity=".5" />
          <path d="M8 36h5M17 36h5M26 36h5M35 36h5" {...common} opacity=".25" />
          <circle cx="43" cy="12" r="1.4" fill="var(--accent)" />
        </>
      )}
    </svg>
  );
}
