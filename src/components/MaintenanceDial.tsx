import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion, useSmoothNumber } from '../hooks/useMotion';
import { formatClock, formatTime, localUtcOffset } from '../lib/time';

interface MaintenanceDialProps {
  progress: number;
  remainingMs: number;
  completesAt: number;
  phase: string;
}

type DiagnosticState = 'idle' | 'scanning' | 'complete';

const RADIUS = 184;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function MaintenanceDial({
  progress,
  remainingMs,
  completesAt,
  phase,
}: MaintenanceDialProps) {
  const displayProgress = useSmoothNumber(progress);
  const reducedMotion = usePrefersReducedMotion();
  const [diagnostic, setDiagnostic] = useState<DiagnosticState>('idle');
  const [lastDiagnostic, setLastDiagnostic] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const runDiagnostic = () => {
    if (diagnostic === 'scanning') return;
    setDiagnostic('scanning');

    timer.current = window.setTimeout(
      () => {
        setDiagnostic('complete');
        setLastDiagnostic(formatClock(new Date()));
      },
      reducedMotion ? 250 : 2300,
    );
  };

  const completionDate = new Date(completesAt);
  const completionTime = formatTime(completionDate);
  const dashOffset = CIRCUMFERENCE * (1 - Math.min(displayProgress, 100) / 100);
  const activeStageLabel = phase.toUpperCase();

  return (
    <div className={`dial-module ${diagnostic === 'scanning' ? 'is-scanning' : ''}`.trim()}>
      <div className="dial-module-top">
        <span className="technical-label">RECOVERY CORE / NF-04</span>
        <span className="dial-live">
          <span className="live-dot" aria-hidden="true" />
          LIVE FEED
        </span>
      </div>

      <div
        className="dial-stage"
        role="img"
        aria-label={`Maintenance recovery is ${displayProgress.toFixed(1)} percent complete. Current phase: ${phase}.`}
      >
        <div className="dial-stage-label dial-stage-label--left" aria-hidden="true">
          CORE
        </div>
        <div className="dial-stage-label dial-stage-label--right" aria-hidden="true">
          EDGE
        </div>
        <div className="dial-stage-label dial-stage-label--top" aria-hidden="true">
          07 / NODES
        </div>
        <div className="dial-stage-label dial-stage-label--bottom" aria-hidden="true">
          SYNCED
        </div>

        <svg className="dial-svg" viewBox="0 0 480 480" fill="none" aria-hidden="true">
          <g className="dial-ticks">
            {Array.from({ length: 72 }, (_, index) => (
              <line
                key={index}
                x1="240"
                y1="18"
                x2="240"
                y2={index % 6 === 0 ? 31 : 25}
                transform={`rotate(${index * 5} 240 240)`}
              />
            ))}
          </g>

          <circle className="dial-guide" cx="240" cy="240" r="218" strokeDasharray="1 9" />
          <circle className="dial-orbit dial-orbit--a" cx="240" cy="240" r="205" strokeDasharray="82 1206" />
          <circle className="dial-track" cx="240" cy="240" r={RADIUS} />
          <circle
            className="dial-progress"
            cx="240"
            cy="240"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 240 240)"
          />
          <circle className="dial-inner-guide" cx="240" cy="240" r="154" strokeDasharray="2 6" />
          <path className="dial-crosshair" d="M240 82v24M240 374v24M82 240h24M374 240h24" />

          <g
            className="dial-progress-head"
            transform={`rotate(${Math.max(1.2, displayProgress * 3.6) - 90} 240 240)`}
          >
            <circle cx="240" cy={240 - RADIUS} r="4.5" />
          </g>

          <g className="dial-scanning-arc">
            <circle
              cx="240"
              cy="240"
              r="205"
              strokeDasharray="110 1178"
              strokeLinecap="round"
              transform="rotate(-90 240 240)"
            />
          </g>
        </svg>

        <div className="dial-center">
          <span className="dial-status">
            <span className={`dial-status-dot ${diagnostic === 'complete' ? 'is-verified' : ''}`.trim()} />
            {diagnostic === 'scanning'
              ? 'SCANNING'
              : diagnostic === 'complete'
                ? 'VERIFIED'
                : 'IN PROGRESS'}
          </span>
          <div className="dial-value">
            {displayProgress.toFixed(1)}
            <span>%</span>
          </div>
          <span className="dial-caption">RECOVERY</span>
        </div>
      </div>

      <div className="dial-readout">
        <div className="dial-eta">
          <span className="technical-label">EST. RESTORATION</span>
          <div>
            <strong>{completionTime}</strong>
            <span>{localUtcOffset(completionDate)}</span>
          </div>
        </div>
        <div className="dial-phase">
          <span className="technical-label">CURRENT PHASE</span>
          <strong>{activeStageLabel}</strong>
        </div>
      </div>

      <button
        type="button"
        className={`diagnostic-button ${diagnostic === 'scanning' ? 'is-busy' : ''}`.trim()}
        onClick={runDiagnostic}
        disabled={diagnostic === 'scanning'}
        aria-busy={diagnostic === 'scanning'}
      >
        <span className="diagnostic-icon" aria-hidden="true">
          <span />
        </span>
        <span className="diagnostic-copy">
          <span>
            {diagnostic === 'scanning'
              ? 'SCANNING SYSTEM NODES'
              : diagnostic === 'complete'
                ? 'DIAGNOSTIC PASSED'
                : 'RUN SYSTEM DIAGNOSTIC'}
          </span>
          <span className="diagnostic-sub">
            {diagnostic === 'complete' && lastDiagnostic
              ? `LAST CHECK ${lastDiagnostic} / 07 NODES RESPONSIVE`
              : `NEXT WINDOW IN ${formatDurationShort(remainingMs)}`}
          </span>
        </span>
        <span className="diagnostic-arrow" aria-hidden="true">
          {diagnostic === 'scanning' ? '···' : '↗'}
        </span>
      </button>

      <p className="sr-only" role="status" aria-live="polite">
        {diagnostic === 'scanning'
          ? 'Running diagnostic across system nodes.'
          : diagnostic === 'complete'
            ? 'Diagnostic complete. All seven nodes responsive.'
            : ''}
      </p>
    </div>
  );
}

function formatDurationShort(milliseconds: number) {
  const totalMinutes = Math.max(0, Math.ceil(milliseconds / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
}
