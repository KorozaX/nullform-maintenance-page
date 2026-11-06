import type { MaintenanceSimulation } from '../hooks/useMaintenance';
import { useSmoothNumber } from '../hooks/useMotion';
import {
  formatClock,
  formatDateUpper,
  formatDuration,
  formatTime,
  MAINTENANCE_REFERENCE,
} from '../lib/time';
import { DotField } from './DotField';
import { MaintenanceDial } from './MaintenanceDial';

interface HeroProps {
  simulation: MaintenanceSimulation;
  phase: string;
  reducedMotion: boolean;
}

export function Hero({ simulation, phase, reducedMotion }: HeroProps) {
  const { now, startedAt, completesAt, elapsedMs, remainingMs, progress } = simulation;
  const displayProgress = useSmoothNumber(progress);
  const currentDate = new Date(now);
  const startDate = new Date(startedAt);
  const completionDate = new Date(completesAt);
  const progressLabel = displayProgress.toFixed(1);

  return (
    <section id="top" className="hero">
      <DotField reducedMotion={reducedMotion} />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-frame page-shell">
        <div className="hero-topline">
          <div className="notice-chip">
            <span className="notice-square" aria-hidden="true" />
            <span>SCHEDULED MAINTENANCE</span>
          </div>
          <div className="hero-topline-meta">
            <span>WINDOW 04</span>
            <span className="topline-divider" aria-hidden="true">
              /
            </span>
            <span>{formatDateUpper(currentDate)}</span>
            <span className="topline-divider" aria-hidden="true">
              /
            </span>
            <span className="topline-live">
              <span className="live-dot" aria-hidden="true" />
              LIVE STATUS
            </span>
          </div>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="eyebrow-index">MSG / 004</span>
              <span className="eyebrow-rule" aria-hidden="true" />
              <span>PLANNED PLATFORM UPDATE</span>
            </div>

            <h1 className="hero-title" aria-label="We're making things better.">
              <span className="hero-title-line">
                <span>WE'RE MAKING</span>
              </span>
              <span className="hero-title-line">
                <span>THINGS</span>
              </span>
              <span className="hero-title-line">
                <span className="hero-title-outline">
                  BETTER<span className="hero-title-period">.</span>
                </span>
              </span>
            </h1>

            <div className="hero-support">
              <div className="support-rule" aria-hidden="true">
                <span />
              </div>
              <p>
                We're currently performing scheduled maintenance to improve system performance,
                reliability, and your overall experience. We'll be back shortly.
              </p>
              <span className="support-note">
                READ-ONLY STATUS ACCESS REMAINS AVAILABLE DURING THIS WINDOW
              </span>
            </div>

            <div className="hero-actions">
              <a className="button button--primary" href="#systems">
                <span>INSPECT SYSTEM STATUS</span>
                <span className="button-arrow" aria-hidden="true">
                  ↘
                </span>
              </a>
              <a className="button button--ghost" href="#updates">
                <span>GET RESTORATION UPDATES</span>
                <span className="button-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-meta">
              <span className="technical-label">TELEMETRY / CORE</span>
              <span className="hero-visual-id">AUTO-REFRESH 1S</span>
            </div>
            <MaintenanceDial
              progress={progress}
              remainingMs={remainingMs}
              completesAt={completesAt}
              phase={phase}
            />
          </div>
        </div>

        <div className="hero-readout">
          <div className="readout-heading">
            <span className="technical-label">RECOVERY PROGRESS</span>
            <span className="readout-percentage">{progressLabel}%</span>
          </div>

          <div
            className="readout-track"
            role="progressbar"
            aria-label="Maintenance recovery progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <span className="readout-fill" style={{ width: `${displayProgress}%` }}>
              <span className="readout-head" aria-hidden="true" />
            </span>
          </div>

          <div className="readout-grid">
            <div className="readout-cell">
              <span className="technical-label">WINDOW OPENED</span>
              <strong>{formatTime(startDate)}</strong>
              <span>{formatDateUpper(startDate)}</span>
            </div>
            <div className="readout-cell">
              <span className="technical-label">ELAPSED</span>
              <strong>{formatDuration(elapsedMs)}</strong>
              <span>MONITORED SESSION</span>
            </div>
            <div className="readout-cell">
              <span className="technical-label">LOCAL TIME</span>
              <strong>{formatClock(currentDate)}</strong>
              <span>LIVE CLOCK / 24H</span>
            </div>
            <div className="readout-cell">
              <span className="technical-label">EST. RESTORATION</span>
              <strong>{formatTime(completionDate)}</strong>
              <span>{formatDuration(remainingMs)} REMAINING</span>
            </div>
            <div className="readout-cell readout-cell--ref">
              <span className="technical-label">REFERENCE</span>
              <strong>{MAINTENANCE_REFERENCE}</strong>
              <span>DEMO WINDOW / SECTOR 07</span>
            </div>
          </div>
        </div>

        <a className="scroll-cue" href="#systems">
          <span className="scroll-cue-line" aria-hidden="true" />
          <span>SCROLL TO INSPECT</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
