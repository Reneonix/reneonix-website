import { useEffect, useState } from 'react';
import './Preloader.css';

// Resets on every page refresh (new JS runtime), persists during SPA navigation
let _shown = false;

export default function Preloader({ minDisplayMs = 1600 }) {
  const [skip] = useState(() => {
    if (_shown) return true;
    _shown = true;
    return false;
  });
  const [hide, setHide] = useState(skip);
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (skip) return;

    document.body.classList.add('preloader-active');

    const startedAt = performance.now();

    const dismiss = () => {
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, minDisplayMs - elapsed);
      window.setTimeout(() => setHide(true), wait);
    };

    if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss, { once: true });
      const fallback = window.setTimeout(dismiss, 6000);
      return () => {
        window.removeEventListener('load', dismiss);
        window.clearTimeout(fallback);
        document.body.classList.remove('preloader-active');
      };
    }

    return () => {
      document.body.classList.remove('preloader-active');
    };
  }, [skip, minDisplayMs]);

  // After CSS fade-out completes, unmount the node entirely
  useEffect(() => {
    if (!hide) return;
    const t = window.setTimeout(() => {
      setDone(true);
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
