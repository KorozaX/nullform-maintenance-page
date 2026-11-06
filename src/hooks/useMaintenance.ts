import { useEffect, useMemo, useRef, useState } from 'react';
import { clamp } from '../lib/time';

const INITIAL_ELAPSED = 4 * 60 * 60 * 1000 + 58 * 60 * 1000 + 12 * 1000;
const TOTAL_WINDOW = 7 * 60 * 60 * 1000 + 12 * 60 * 1000;

export interface MaintenanceSimulation {
  now: number;
  startedAt: number;
  completesAt: number;
  elapsedMs: number;
  remainingMs: number;
  progress: number;
  activeStage: number;
}

function createWindow() {
  const now = Date.now();
  const startedAt = now - INITIAL_ELAPSED;
  return { startedAt, completesAt: startedAt + TOTAL_WINDOW };
}

export function useMaintenance(): MaintenanceSimulation {
  const simulationWindow = useRef<{ startedAt: number; completesAt: number } | null>(null);
  if (simulationWindow.current === null) {
    simulationWindow.current = createWindow();
  }

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const update = () => setNow(Date.now());
    const interval = window.setInterval(update, 1000);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') update();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return useMemo(() => {
    const { startedAt, completesAt } = simulationWindow.current!;
    const elapsedMs = clamp(now - startedAt, 0, TOTAL_WINDOW);
    const remainingMs = Math.max(0, completesAt - now);
    const progress = clamp((elapsedMs / TOTAL_WINDOW) * 100, 0, 100);
    const activeStage = progress < 25 ? 0 : progress < 55 ? 1 : progress < 90 ? 2 : 3;

    return {
      now,
      startedAt,
      completesAt,
      elapsedMs,
      remainingMs,
      progress,
      activeStage,
    };
  }, [now]);
}
