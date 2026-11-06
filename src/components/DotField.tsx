import { useEffect, useRef } from 'react';

interface DotFieldProps {
  reducedMotion: boolean;
}

export function DotField({ reducedMotion }: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    const pointer = { x: -1000, y: -1000, active: false };
    const host = canvas.parentElement;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);

      const spacing = width < 680 ? 27 : 31;
      const columns = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const seconds = time * 0.001;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * spacing + 8;
          const y = row * spacing + 8;
          const wave = Math.sin(column * 0.42 + row * 0.28 + seconds * 0.42);
          const distance = pointer.active ? Math.hypot(pointer.x - x, pointer.y - y) : 1000;
          const proximity = Math.max(0, 1 - distance / 210);
          const isPulse = (column * 7 + row * 13) % 131 === 0;
          const radius = 0.65 + Math.max(0, wave) * 0.18 + proximity * 1.15 + (isPulse ? 0.5 : 0);

          if (isPulse) {
            const pulse = 0.4 + Math.sin(seconds * 1.8 + column) * 0.22;
            context.fillStyle = `rgba(255, 59, 47, ${pulse})`;
          } else {
            const alpha = 0.075 + proximity * 0.42 + Math.max(0, wave) * 0.025;
            context.fillStyle = `rgba(241, 241, 237, ${alpha})`;
          }

          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (!reducedMotion) {
        frame = requestAnimationFrame(render);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -1000;
      pointer.y = -1000;
    };

    resize();
    frame = requestAnimationFrame(render);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) render(0);
    });
    resizeObserver.observe(canvas);

    if (!reducedMotion) {
      host?.addEventListener('pointermove', onPointerMove, { passive: true });
      host?.addEventListener('pointerleave', onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      host?.removeEventListener('pointermove', onPointerMove);
      host?.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}
