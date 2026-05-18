import { useEffect, useState } from 'react';
import './Preloader.css';

export default function Preloader({ minDisplayMs = 1600 }) {
  const [hide, setHide] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Only show on the home route — skip on Solutions, Careers, or any other page refresh
    const hash = window.location.hash.split('?')[0];
    const isHome = !hash || hash === '#' || hash === '#home';

    if (!isHome || window.__preloaderShown) {
      setDone(true);
      return;
    }

    // Mark shown. Reset in cleanup so StrictMode's 2nd effect-run starts fresh.
    window.__preloaderShown = true;
    document.body.classList.add('preloader-active');

    const startedAt = performance.now();
    let hideTimer = null;
    let fallbackTimer = null;

    const dismiss = () => {
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, minDisplayMs - elapsed);
      hideTimer = window.setTimeout(() => setHide(true), wait);
    };

    if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss, { once: true });
      fallbackTimer = window.setTimeout(dismiss, 6000);
    }

    return () => {
      window.__preloaderShown = false; // allow StrictMode 2nd run
      window.clearTimeout(hideTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('load', dismiss);
      document.body.classList.remove('preloader-active');
    };
  }, [minDisplayMs]);

  useEffect(() => {
    if (!hide) return;
    const t = window.setTimeout(() => {
      setDone(true);
      window.__preloaderShown = true; // permanently mark done after fade-out
      document.body.classList.remove('preloader-active');
    }, 750);
    return () => window.clearTimeout(t);
  }, [hide]);

  if (done) return null;

  return (
    <div
      className={`preloader${hide ? ' preloader--hide' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Reneonix"
    >
      {/* Ambient background layers */}
      <div className="preloader__grid" aria-hidden="true" />
      <div className="preloader__glow" aria-hidden="true" />
      <div className="preloader__scan" aria-hidden="true" />
      <div className="preloader__vignette" aria-hidden="true" />

      {/* HUD corner brackets */}
      <span className="preloader__bracket preloader__bracket--tl" aria-hidden="true" />
      <span className="preloader__bracket preloader__bracket--tr" aria-hidden="true" />
      <span className="preloader__bracket preloader__bracket--bl" aria-hidden="true" />
      <span className="preloader__bracket preloader__bracket--br" aria-hidden="true" />

      {/* Centerpiece */}
      <div className="preloader__content">
        <img
          src="/reneonix-logo-mark.svg"
          alt="Reneonix"
          className="preloader__logo"
        />
        <div className="preloader__bar" aria-hidden="true" />
        <div className="preloader__status">
          Loading
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </div>
      </div>
    </div>
  );
}
