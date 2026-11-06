import { useCallback, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuOverlay } from './components/MenuOverlay';
import { SignalTicker } from './components/SignalTicker';
import { Subscribe } from './components/Subscribe';
import { SystemStatus } from './components/SystemStatus';
import { Timeline } from './components/Timeline';
import { useMaintenance } from './hooks/useMaintenance';
import { usePrefersReducedMotion } from './hooks/useMotion';
import { TIMELINE_STAGES } from './lib/data';

export default function App() {
  const simulation = useMaintenance();
  const reducedMotion = usePrefersReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const phase = TIMELINE_STAGES[simulation.activeStage].title;

  return (
    <>
      <div className="site-shell" inert={menuOpen}>
        <a className="skip-link" href="#main-content">
          SKIP TO MAIN CONTENT
        </a>

        <Header
          now={simulation.now}
          progress={simulation.progress}
          menuOpen={menuOpen}
          onOpenMenu={() => setMenuOpen(true)}
        />

        <main id="main-content">
          <Hero simulation={simulation} phase={phase} reducedMotion={reducedMotion} />
          <SignalTicker />
          <SystemStatus now={simulation.now} progress={simulation.progress} />
          <Timeline simulation={simulation} />
          <Subscribe />
        </main>

        <Footer now={simulation.now} progress={simulation.progress} />
      </div>

      {menuOpen && (
        <MenuOverlay
          now={simulation.now}
          progress={simulation.progress}
          onClose={closeMenu}
        />
      )}
    </>
  );
}
