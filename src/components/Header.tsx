import { useEffect, useState } from 'react';
import { formatClock } from '../lib/time';
import { LogoMark } from './LogoMark';

interface HeaderProps {
  now: number;
  progress: number;
  menuOpen: boolean;
  onOpenMenu: () => void;
}

const NAV_ITEMS = [
  { label: 'SYSTEMS', href: '#systems' },
  { label: 'SEQUENCE', href: '#timeline' },
  { label: 'UPDATES', href: '#updates' },
];

export function Header({ now, progress, menuOpen, onOpenMenu }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const clock = formatClock(new Date(now));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`.trim()}>
      <div className="header-inner">
        <a className="brand" href="#top">
          <LogoMark size={28} />
          <span className="brand-name">NULLFORM</span>
          <span className="brand-rule" aria-hidden="true" />
          <span className="brand-code">SYS/04</span>
          <span className="sr-only">— back to overview</span>
        </a>

        <nav className="primary-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              <span className="nav-link-mark" aria-hidden="true" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-tools">
          <a
            className="status-pill"
            href="#systems"
            aria-label="MAINTENANCE ACTIVE — view system status"
          >
            <span className="status-pill-dot" aria-hidden="true" />
            <span>MAINTENANCE ACTIVE</span>
          </a>

          <div className="header-clock" aria-label={`Local time ${clock}`}>
            <span className="header-clock-label">LOCAL</span>
            <time dateTime={new Date(now).toISOString()}>{clock}</time>
          </div>

          <button
            type="button"
            className="menu-trigger"
            aria-label="MENU — open system menu"
            aria-expanded={menuOpen}
            aria-controls="system-menu"
            onClick={onOpenMenu}
          >
            <span className="menu-trigger-grid" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span className="menu-trigger-label">MENU</span>
          </button>
        </div>
      </div>

      <div className="header-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
    </header>
  );
}
