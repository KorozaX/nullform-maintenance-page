interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 26, className = '' }: LogoMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
    >
      <g fill="currentColor">
        <circle cx="16" cy="4.5" r="2.1" />
        <circle cx="22.5" cy="7.6" r="2.1" />
        <circle cx="27.5" cy="16" r="2.1" />
        <circle cx="22.5" cy="24.4" r="2.1" />
        <circle cx="16" cy="27.5" r="2.1" />
        <circle cx="9.5" cy="24.4" r="2.1" />
        <circle cx="4.5" cy="16" r="2.1" />
        <circle cx="9.5" cy="7.6" r="2.1" />
      </g>
      <circle cx="16" cy="16" r="2.4" fill="var(--accent)" />
    </svg>
  );
}
