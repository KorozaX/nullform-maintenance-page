import { TICKER_ITEMS } from '../lib/data';

function TickerGroup() {
  return (
    <span className="ticker-group">
      {TICKER_ITEMS.map((item) => (
        <span className="ticker-item" key={item}>
          <span className="ticker-dot" aria-hidden="true" />
          {item}
        </span>
      ))}
    </span>
  );
}

export function SignalTicker() {
  return (
    <div className="signal-ticker" aria-hidden="true">
      <div className="ticker-label">
        <span className="live-dot" />
        SIGNAL
      </div>
      <div className="ticker-window">
        <div className="ticker-track">
          <TickerGroup />
          <TickerGroup />
        </div>
      </div>
      <div className="ticker-end">24H / 07</div>
    </div>
  );
}
