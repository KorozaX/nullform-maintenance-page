import { useRef, useState, type KeyboardEvent } from 'react';
import type { MaintenanceSimulation } from '../hooks/useMaintenance';
import { TIMELINE_STAGES } from '../lib/data';
import { formatTime } from '../lib/time';
import { Reveal } from './Reveal';

interface TimelineProps {
  simulation: MaintenanceSimulation;
}

export function Timeline({ simulation }: TimelineProps) {
  const { startedAt, completesAt, activeStage, progress } = simulation;
  const [selected, setSelected] = useState(activeStage);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const duration = completesAt - startedAt;
  const stageTimes = [
    startedAt,
    startedAt + duration * 0.28,
    startedAt + duration * 0.57,
    completesAt,
  ];

  const selectStage = (index: number) => {
    setSelected(index);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') nextIndex = (index + 1) % TIMELINE_STAGES.length;
    if (event.key === 'ArrowLeft')
      nextIndex = (index - 1 + TIMELINE_STAGES.length) % TIMELINE_STAGES.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = TIMELINE_STAGES.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    setSelected(nextIndex);
    window.requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  };

  const stage = TIMELINE_STAGES[selected];
  const stageState =
    selected < activeStage ? 'complete' : selected === activeStage ? 'current' : 'upcoming';
  const stageStateLabel =
    stageState === 'complete' ? 'COMPLETED' : stageState === 'current' ? 'IN PROGRESS' : 'UPCOMING';
  const stageTime = formatTime(new Date(stageTimes[selected]));

  return (
    <section id="timeline" className="timeline-section">
      <div className="page-shell">
        <Reveal>
          <div className="section-topline">
            <span className="section-number">02</span>
            <span>MAINTENANCE SEQUENCE</span>
            <span className="section-topline-rule" aria-hidden="true" />
            <span className="section-mode">STAGE {String(activeStage + 1).padStart(2, '0')} / 04</span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="timeline-heading-row">
            <h2 className="timeline-heading">
              <span>THE ROAD</span>
              <span className="dark-outline">BACK ONLINE.</span>
            </h2>
            <div className="timeline-intro">
              <p>
                Every change window follows the same four-phase protocol. Follow the sequence to
                see what has been completed and what happens next.
              </p>
              <div className="timeline-intro-meta">
                <span>
                  <span className="live-dot" aria-hidden="true" />
                  WINDOW 04 ACTIVE
                </span>
                <span>{progress.toFixed(1)}% RECOVERED</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="timeline-shell">
            <div className="timeline-shell-top">
              <span>SEQUENCE MAP / NF-8841</span>
              <span>SELECT A STAGE TO INSPECT</span>
            </div>

            <div className="timeline-tabs" role="tablist" aria-label="Maintenance sequence stages">
              {TIMELINE_STAGES.map((item, index) => {
                const state =
                  index < activeStage ? 'complete' : index === activeStage ? 'current' : 'upcoming';
                const time = formatTime(new Date(stageTimes[index]));

                return (
                  <button
                    key={item.id}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    type="button"
                    role="tab"
                    id={`timeline-tab-${item.id}`}
                    aria-selected={selected === index}
                    aria-controls="timeline-detail-panel"
                    tabIndex={selected === index ? 0 : -1}
                    className={`timeline-tab is-${state} ${selected === index ? 'is-selected' : ''}`.trim()}
                    onClick={() => selectStage(index)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                  >
                    <span className="timeline-node" aria-hidden="true">
                      <span />
                    </span>
                    <span className="timeline-tab-top">
                      <span className="timeline-tab-index">{item.index}</span>
                      <span className={`timeline-state is-${state}`}>
                        {state === 'complete'
                          ? 'COMPLETE'
                          : state === 'current'
                            ? 'ACTIVE'
                            : 'QUEUED'}
                      </span>
                    </span>
                    <span className="timeline-tab-title">{item.title}</span>
                    <span className="timeline-tab-description">{item.description}</span>
                    <span className="timeline-tab-time">
                      <span>{index === 3 ? 'EST.' : state === 'complete' ? 'DONE' : 'START'}</span>
                      {time}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              id="timeline-detail-panel"
              role="tabpanel"
              aria-labelledby={`timeline-tab-${stage.id}`}
              className="timeline-panel"
              tabIndex={0}
            >
              <div className="timeline-panel-inner" key={stage.id}>
                <div className={`timeline-panel-state is-${stageState}`}>
                  <span className="timeline-panel-state-dot" aria-hidden="true" />
                  {stageStateLabel}
                </div>
                <div className="timeline-panel-index" aria-hidden="true">
                  {stage.index}
                </div>
                <div className="timeline-panel-copy">
                  <span className="technical-label">
                    STAGE {stage.index} / {stage.meta}
                  </span>
                  <h3>{stage.title}</h3>
                  <p>{stage.detail}</p>
                </div>
                <div className="timeline-panel-meta">
                  <div>
                    <span className="technical-label">
                      {stageState === 'complete' ? 'COMPLETED' : stageState === 'current' ? 'STARTED' : 'TARGET'}
                    </span>
                    <strong>{stageTime}</strong>
                  </div>
                  <div>
                    <span className="technical-label">REFERENCE</span>
                    <strong>NF-MNT-8841</strong>
                  </div>
                  <div className="timeline-panel-log">
                    <span className="technical-label">LOG</span>
                    <code>{stage.log}</code>
                  </div>
                </div>
                <div className="timeline-panel-pulse" aria-hidden="true" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
