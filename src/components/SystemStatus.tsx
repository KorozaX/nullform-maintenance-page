import { useState } from 'react';
import { SERVICES, type Service, type ServiceState } from '../lib/data';
import { formatClock } from '../lib/time';
import { Glyph } from './Glyph';
import { Reveal } from './Reveal';

interface SystemStatusProps {
  now: number;
  progress: number;
}

function stateClass(state: ServiceState) {
  return `state-${state}`;
}

function TinySignal({ data, state }: { data: number[]; state: ServiceState }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 118 + 1;
      const y = 30 - ((value - min) / range) * 24;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      className={`tiny-signal ${stateClass(state)}`}
      viewBox="0 0 120 34"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M1 29.5H119" className="tiny-signal-base" />
      <polyline points={points} className="tiny-signal-line" />
      <circle
        cx="119"
        cy={points.split(' ').at(-1)?.split(',')[1] ?? '17'}
        r="2.2"
        className="tiny-signal-head"
      />
    </svg>
  );
}

function ServiceCard({
  service,
  open,
  onToggle,
}: {
  service: Service;
  open: boolean;
  onToggle: () => void;
}) {
  const detailId = `service-detail-${service.id}`;
  const headingId = `service-heading-${service.id}`;

  return (
    <article className={`service-card ${open ? 'is-open' : ''} ${stateClass(service.state)}`}>
      <h3 id={headingId} className="sr-only">
        {service.name}
      </h3>
      <button
        type="button"
        className="service-trigger"
        aria-expanded={open}
        aria-controls={detailId}
        onClick={onToggle}
      >
        <span className="service-topline">
          <span className="service-index">{service.index}</span>
          <span className={`service-state ${stateClass(service.state)}`}>
            <span className="service-state-dot" aria-hidden="true" />
            {service.stateLabel.toUpperCase()}
          </span>
          <span className="service-expand" aria-hidden="true">
            <span />
            <span />
          </span>
        </span>

        <span className="service-main">
          <span className="service-glyph-wrap">
            <Glyph kind={service.glyph} />
          </span>
          <span className="service-title-wrap">
            <span className="service-name">{service.name}</span>
            <span className="service-description">{service.description}</span>
          </span>
        </span>

        <span className="service-data">
          <span className="service-region">{service.region}</span>
          <span className="service-signal-wrap">
            <TinySignal data={service.signal} state={service.state} />
          </span>
        </span>

        <span className="service-metrics">
          {service.metrics.map((metric) => (
            <span className="service-metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </span>
          ))}
        </span>
      </button>

      <div
        id={detailId}
        className="service-detail"
        aria-hidden={!open}
        data-open={open ? 'true' : 'false'}
      >
        <div className="service-detail-clip">
          <div className="service-detail-inner">
            <div className="service-observation">
              <span className="technical-label">OBSERVATION / {service.shortName}</span>
              <p>{service.note}</p>
            </div>
            <div className="service-detail-meta">
              <div>
                <span className="technical-label">EVENT TRACE</span>
                <code>NF-8841 / {service.shortName.toLowerCase()}</code>
              </div>
              <div>
                <span className="technical-label">REVIEW</span>
                <span>AUTOMATED / CONTINUOUS</span>
              </div>
              <div>
                <span className="technical-label">DATA ORIGIN</span>
                <span>DEMO TELEMETRY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function SystemStatus({ now, progress }: SystemStatusProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const operational = SERVICES.filter((service) => service.state === 'operational').length;
  const degraded = SERVICES.filter((service) => service.state === 'degraded').length;
  const maintenance = SERVICES.filter((service) => service.state === 'maintenance').length;

  return (
    <section id="systems" className="systems-section">
      <div className="page-shell">
        <Reveal>
          <div className="section-topline">
            <span className="section-number">01</span>
            <span>SYSTEM STATUS</span>
            <span className="section-topline-rule" aria-hidden="true" />
            <span className="section-mode">READ-ONLY TELEMETRY</span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="systems-heading-row">
            <h2 className="systems-heading">
              <span>SYSTEM</span>
              <span className="dark-outline">STATUS.</span>
            </h2>
            <div className="systems-intro">
              <p>
                A live view of the systems inside maintenance window 04. Select any component to
                inspect its current telemetry and operational note.
              </p>
              <div className="telemetry-stamp">
                <span className="live-dot" aria-hidden="true" />
                <span>DEMO TELEMETRY / UPDATED {formatClock(new Date(now))}</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={110}>
          <div className="dashboard-summary">
            <div className="summary-cell">
              <span className="technical-label">SERVICES RESPONDING</span>
              <strong>
                {String(operational + degraded).padStart(2, '0')}
                <span> / 06</span>
              </strong>
              <span className="summary-note">READ PATHS AVAILABLE</span>
            </div>
            <div className="summary-cell">
              <span className="technical-label">OPERATIONAL</span>
              <strong>{String(operational).padStart(2, '0')}</strong>
              <span className="summary-note">NOMINAL RESPONSE</span>
            </div>
            <div className="summary-cell">
              <span className="technical-label">DEGRADED</span>
              <strong>{String(degraded).padStart(2, '0')}</strong>
              <span className="summary-note">CONTROLLED LOAD</span>
            </div>
            <div className="summary-cell">
              <span className="technical-label">UNDER MAINTENANCE</span>
              <strong className="summary-accent">{String(maintenance).padStart(2, '0')}</strong>
              <span className="summary-note">ACTIVE CHANGES</span>
            </div>
            <div className="summary-cell summary-cell--progress">
              <span className="technical-label">RECOVERY</span>
              <strong>{progress.toFixed(1)}<span>%</span></strong>
              <span className="summary-mini-track" aria-hidden="true">
                <span style={{ width: `${progress}%` }} />
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="component-grid">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                open={expanded === service.id}
                onToggle={() => setExpanded(expanded === service.id ? null : service.id)}
              />
            ))}
          </div>
        </Reveal>

        <div className="systems-footnote">
          <span>STATUS CODES / NOMINAL · DEGRADED · MAINTENANCE</span>
          <span>ALL COMPONENT DATA IS FICTIONAL DEMONSTRATION DATA</span>
        </div>
      </div>
    </section>
  );
}
