import { useEffect, useRef } from 'react';
import { useCopy } from '../hooks/useCopy';
import {
  formatClock,
  formatDateUpper,
  localUtcOffset,
  MAINTENANCE_REFERENCE,
  SUPPORT_EMAIL,
} from '../lib/time';
import { LogoMark } from './LogoMark';

interface MenuOverlayProps {
  now: number;
  progress: number;
  onClose: () => void;
}

const MENU_LINKS = [
  { index: '00', label: 'OVERVIEW', href: '#top' },
  { index: '01', label: 'SYSTEM STATUS', href: '#systems' },
  { index: '02', label: 'MAINTENANCE SEQUENCE', href: '#timeline' },
  { index: '03', label: 'RESTORATION UPDATES', href: '#updates' },
];

export function MenuOverlay({ now, progress, onClose }: MenuOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { copied, copy } = useCopy();
  const date = new Date(now);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      id="system-menu"
      className="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-heading"
    >
      <div className="menu-grid-bg" aria-hidden="true" />

      <div className="menu-top">
        <div className="menu-brand">
          <LogoMark size={28} />
          <span>NULLFORM</span>
        </div>
        <button ref={closeRef} type="button" className="menu-close" onClick={onClose}>
          <span>CLOSE</span>
          <span className="menu-close-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <div className="menu-content">
        <div className="menu-primary">
          <div className="menu-kicker">
            <span>SYSTEM INDEX</span>
            <span>04 SECTIONS</span>
          </div>
          <h2 id="menu-heading" className="sr-only">
            System navigation
          </h2>
          <nav aria-label="System sections">
            {MENU_LINKS.map((item) => (
              <a key={item.href} href={item.href} className="menu-link" onClick={onClose}>
                <span className="menu-link-index">{item.index}</span>
                <span className="menu-link-label">{item.label}</span>
                <span className="menu-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </nav>
        </div>

        <aside className="menu-dossier" aria-label="System dossier">
          <div className="menu-dossier-head">
            <span>SYSTEM DOSSIER</span>
            <span className="live-label">
              <span className="live-dot" aria-hidden="true" />
              LIVE
            </span>
          </div>

          <dl className="menu-facts">
            <div>
              <dt>REFERENCE</dt>
              <dd>{MAINTENANCE_REFERENCE}</dd>
            </div>
            <div>
              <dt>LOCAL TIME</dt>
              <dd>
                {formatClock(date)} <span className="muted">{localUtcOffset(date)}</span>
              </dd>
            </div>
            <div>
              <dt>WINDOW DATE</dt>
              <dd>{formatDateUpper(date)}</dd>
            </div>
            <div>
              <dt>RECOVERY</dt>
              <dd>{progress.toFixed(1)}%</dd>
            </div>
            <div>
              <dt>SUPPORT</dt>
              <dd>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-link">
                  {SUPPORT_EMAIL}
                </a>
              </dd>
            </div>
          </dl>

          <div className="menu-dossier-foot">
            <button
              type="button"
              className="copy-button copy-button--light"
              onClick={() => copy(MAINTENANCE_REFERENCE)}
            >
              <span>{copied ? 'REFERENCE COPIED' : 'COPY REFERENCE'}</span>
              <span aria-hidden="true">{copied ? '✓' : '↗'}</span>
            </button>
            <p>Demonstration interface. All system telemetry is fictional.</p>
          </div>
        </aside>
      </div>

      <div className="menu-foot">
        <span>NULLFORM / SYSTEMS</span>
        <span>RELEASE 4.2.0</span>
        <span>WINDOW 04 / 2026</span>
      </div>
    </div>
  );
}
