import { useEffect, useRef, useState } from 'react';

export function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

export function useSmoothNumber(target: number, duration = 980) {
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  const currentValue = useRef(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      currentValue.current = target;
      setValue(target);
      return;
    }

    const from = currentValue.current;
    const startedAt = performance.now();

    const tick = (time: number) => {
      const elapsed = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const next = from + (target - from) * eased;
      currentValue.current = next;
      setValue(next);

      if (elapsed < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [duration, reducedMotion, target]);

  return value;
}
