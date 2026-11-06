import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Reveal } from './Reveal';

type FormStatus = 'idle' | 'loading' | 'success';

interface Preferences {
  restore: boolean;
  report: boolean;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function Subscribe() {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<Preferences>({ restore: true, report: true });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [successId, setSuccessId] = useState('');
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const togglePreference = (key: keyof Preferences) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
    if (error) setError('');
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'loading') return;

    const normalizedEmail = email.trim();
    if (!isValidEmail(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    if (!preferences.restore && !preferences.report) {
      setError('Select at least one update preference.');
      return;
    }

    setError('');
    setStatus('loading');
    timer.current = window.setTimeout(() => {
      setSubmittedEmail(normalizedEmail);
      setSuccessId(`UPD-${Date.now().toString(36).slice(-6).toUpperCase()}`);
      setStatus('success');
    }, 1250);
  };

  const resetForm = () => {
    setStatus('idle');
    setError('');
  };

  return (
    <section id="updates" className="updates-section">
      <div className="updates-matrix" aria-hidden="true" />
      <div className="page-shell">
        <Reveal>
          <div className="updates-topline">
            <div className="section-topline section-topline--dark">
              <span className="section-number">03</span>
              <span>RESTORATION UPDATES</span>
              <span className="section-topline-rule" aria-hidden="true" />
              <span className="section-mode">SIGNAL / OPEN</span>
            </div>
          </div>
        </Reveal>

        <div className="updates-grid">
          <Reveal className="updates-copy">
            <div className="updates-eyebrow">
              <span className="notice-square" aria-hidden="true" />
              ONE MESSAGE / WHEN IT MATTERS
            </div>
            <h2 className="updates-heading">
              <span>DON'T MISS</span>
              <span className="light-outline">THE SIGNAL.</span>
            </h2>
            <p className="updates-lede">
              Leave an address and we'll send a single note the moment the platform is restored.
              No noise, no marketing, no account required.
            </p>

            <div className="updates-points">
              <div className="update-point">
                <span className="update-point-index">01</span>
                <div>
                  <strong>Restoration confirmation</strong>
                  <span>Sent when all six services return to nominal.</span>
                </div>
              </div>
              <div className="update-point">
                <span className="update-point-index">02</span>
                <div>
                  <strong>Post-incident summary</strong>
                  <span>A short technical note once the window is closed.</span>
                </div>
              </div>
              <div className="update-point">
                <span className="update-point-index">03</span>
                <div>
                  <strong>Nothing else</strong>
                  <span>Your address is used for this demonstration only.</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="updates-panel-wrap">
            <div className={`updates-panel ${status === 'success' ? 'is-success' : ''}`.trim()}>
              <div className="updates-panel-top">
                <span>RESTORATION SIGNAL</span>
                <span className="panel-demo-badge">SIMULATION / DEMO</span>
              </div>

              {status === 'success' ? (
                <div className="subscription-success" role="status" aria-live="polite">
                  <div className="success-topline">
                    <span>TRANSMISSION RECEIVED</span>
                    <span>{successId}</span>
                  </div>
                  <div className="success-glyph" aria-hidden="true">
                    <span className="success-glyph-dot success-glyph-dot--a" />
                    <span className="success-glyph-dot success-glyph-dot--b" />
                    <span className="success-glyph-dot success-glyph-dot--c" />
                    <svg viewBox="0 0 32 32" fill="none">
                      <path d="M8.5 16.5 13.5 21.5 24 10.5" />
                    </svg>
                  </div>
                  <span className="success-kicker">SIGNAL LOCKED</span>
                  <h3>You're on the list.</h3>
                  <p>
                    A confirmation will be sent to <strong>{submittedEmail}</strong> when the
                    maintenance window closes.
                  </p>
                  <div className="success-preferences">
                    <span>
                      <span className="success-check" aria-hidden="true">
                        ✓
                      </span>
                      RESTORATION CONFIRMATION
                    </span>
                    {preferences.report && (
                      <span>
                        <span className="success-check" aria-hidden="true">
                          ✓
                        </span>
                        POST-INCIDENT SUMMARY
                      </span>
                    )}
                  </div>
                  <div className="success-footer">
                    <span>DEMO ONLY / NO MESSAGE WILL ACTUALLY BE SENT</span>
                    <button type="button" className="text-button" onClick={resetForm}>
                      EDIT SUBSCRIPTION
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form className="subscribe-form" onSubmit={onSubmit} noValidate>
                  <div className="form-heading">
                    <span className="form-step">INPUT / 01</span>
                    <h3>Get the restoration signal.</h3>
                    <p>One email. Sent the moment the platform is back online.</p>
                  </div>

                  <div className="email-field">
                    <label htmlFor="subscriber-email" className="technical-label">
                      EMAIL ADDRESS
                    </label>
                    <div className={`email-input-row ${error ? 'has-error' : ''}`.trim()}>
                      <input
                        id="subscriber-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (error) setError('');
                        }}
                        aria-invalid={Boolean(error)}
                        aria-describedby="email-field-note"
                        disabled={status === 'loading'}
                      />
                      <button
                        type="submit"
                        className="submit-button"
                        disabled={status === 'loading'}
                        aria-busy={status === 'loading'}
                      >
                        <span>{status === 'loading' ? 'TRANSMITTING' : 'NOTIFY ME'}</span>
                        <span className="submit-icon" aria-hidden="true">
                          {status === 'loading' ? <span className="loading-dots">···</span> : '↗'}
                        </span>
                      </button>
                    </div>
                    <p
                      id="email-field-note"
                      className={`field-note ${error ? 'is-error' : ''}`.trim()}
                      role={error ? 'alert' : undefined}
                    >
                      {error || 'DEMO INTERFACE — NO MESSAGE WILL ACTUALLY BE SENT.'}
                    </p>
                  </div>

                  <fieldset className="preference-fieldset">
                    <legend className="technical-label">ALERT PREFERENCES</legend>
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={preferences.restore}
                        onChange={() => togglePreference('restore')}
                        disabled={status === 'loading'}
                      />
                      <span className="checkbox-control" aria-hidden="true">
                        <span />
                      </span>
                      <span className="checkbox-copy">
                        <strong>Restoration confirmation</strong>
                        <span>Alert me when all services are back online.</span>
                      </span>
                    </label>
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={preferences.report}
                        onChange={() => togglePreference('report')}
                        disabled={status === 'loading'}
                      />
                      <span className="checkbox-control" aria-hidden="true">
                        <span />
                      </span>
                      <span className="checkbox-copy">
                        <strong>Post-incident summary</strong>
                        <span>Send the short technical report afterward.</span>
                      </span>
                    </label>
                  </fieldset>

                  <div className="form-footer">
                    <span>
                      <span className="live-dot" aria-hidden="true" />
                      ACCEPTING SUBSCRIPTIONS
                    </span>
                    <span>REF / NF-8841</span>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
