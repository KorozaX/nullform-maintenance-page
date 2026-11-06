import { useCopy } from '../hooks/useCopy';
import {
  formatClock,
  localUtcOffset,
  MAINTENANCE_REFERENCE,
  SUPPORT_EMAIL,
} from '../lib/time';
import { LogoMark } from './LogoMark';

interface FooterProps {
  now: number;
  progress: number;
}

export function Footer({ now, progress }: FooterProps) {
  const { copied, copy } = useCopy();
  const date = new Date(now);

  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="footer-top">
          <div className="footer-brand-lockup">
            <div className="footer-brand">
              <LogoMark size={34} />
              <span>NULLFORM</span>
            </div>
            <p>Independent systems.<br />Intentional interfaces.</p>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#top">OVERVIEW</a>
            <a href="#systems">SYSTEMS</a>
            <a href="#timeline">SEQUENCE</a>
            <a href="#updates">UPDATES</a>
            <a href={`mailto:${SUPPORT_EMAIL}`}>SUPPORT</a>
          </nav>

          <a href="#top" className="back-to-top">
            <span>BACK TO TOP</span>
            <span className="back-to-top-icon" aria-hidden="true">
              ↑
            </span>
            <span className="sr-only">of the page</span>
          </a>
        </div>

        <div className="footer-data">
          <div className="footer-data-row">
            <span className="technical-label">MAINTENANCE REFERENCE</span>
            <strong>{MAINTENANCE_REFERENCE}</strong>
            <button
              type="button"
              className="copy-button copy-button--light"
              onClick={() => copy(MAINTENANCE_REFERENCE)}
              aria-live="polite"
            >
              {copied ? 'COPIED' : 'COPY'}
              <span aria-hidden="true">{copied ? '✓' : '↗'}</span>
            </button>
          </div>
          <div className="footer-data-row">
            <span className="technical-label">LAST SYSTEM UPDATE</span>
            <strong>
              {formatClock(date)} <span>{localUtcOffset(date)}</span>
            </strong>
            <span className="footer-data-state">
              <span className="live-dot" aria-hidden="true" />
              LIVE
            </span>
          </div>
          <div className="footer-data-row">
            <span className="technical-label">CURRENT STATUS</span>
            <strong className="footer-status">MAINTENANCE / ACTIVE</strong>
            <span className="footer-data-state">WINDOW 04</span>
          </div>
          <div className="footer-data-row">
            <span className="technical-label">RECOVERY</span>
            <strong>{progress.toFixed(1)}%</strong>
            <span className="footer-data-state">VERIFICATION</span>
          </div>
        </div>

        <div className="footer-mark" aria-hidden="true">
          <span>NULLFORM</span>
          <span className="footer-mark-period">.</span>
        </div>

        <div className="footer-bottom">
          <span>© {date.getFullYear()} NULLFORM SYSTEMS</span>
          <span className="footer-demo">
            DEMONSTRATION INTERFACE / ALL SYSTEM DATA IS FICTIONAL
          </span>
          <span>DESIGNED FOR THE IN-BETWEEN / 04</span>
        </div>
      </div>
    </footer>
  );
}
