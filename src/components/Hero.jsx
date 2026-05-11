import { useEffect, useRef } from 'react';
import ShinyText from './ShinyText.jsx';

export default function Hero() {
  /* Custom loop: play through, hold the LAST frame for 2 seconds, then
     restart. We don't use the native `loop` attribute because we want the
     freeze. */
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let timeoutId = null;
    const HOLD_MS = 2000; // freeze the last frame for 2 seconds

    const onEnded = () => {
      // Pin to the very end so the freeze frame is the final rendered frame.
      try {
        v.pause();
        v.currentTime = Math.max(0, v.duration - 0.05);
      } catch {}
      timeoutId = window.setTimeout(() => {
        try {
          v.currentTime = 0;
          v.play().catch(() => {});
        } catch {}
      }, HOLD_MS);
    };

    v.addEventListener('ended', onEnded);
    // Some browsers don't fire `ended` reliably for muted autoplay; backup via timeupdate.
    const onTimeUpdate = () => {
      if (!v.duration || v.paused) return;
      if (v.currentTime >= v.duration - 0.05) {
        v.removeEventListener('timeupdate', onTimeUpdate);
        onEnded();
        v.addEventListener('timeupdate', onTimeUpdate);
      }
    };
    v.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('timeupdate', onTimeUpdate);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="hero" id="home">
      {/* Hero background video — plays once, holds the last frame for 2 seconds,
          then restarts. Muted is required for autoplay on iOS/Safari. */}
      <video
        ref={videoRef}
        className="hero__video"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/reneonix-hero.mp4" type="video/mp4" />
      </video>

      {/* Decorative overlays — kept so the headline still has the same depth treatment */}
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__scanlines" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />

      <div className="container">
        <div className="hero__inner">
          <div className="hero__copy">
            <h1>
              Engineering the next generation of{' '}
              <ShinyText
                className="lime-text"
                text="Material Circularity."
                color="#b2de3a"
                shineColor="#ffffff"
                speed={3}
                delay={0.6}
                spread={120}
              />
            </h1>
            <p className="lead">
              Reneonix is a material circularity deeptech company building technology
              infrastructure for post-consumer material recovery. We combine vision-based
              systems, SPM, hardware, software, and material science to transform fragmented
              waste streams into quality-controlled, traceable, industry-ready raw materials.
            </p>
            <div className="hero__cta">
              <a href="#solutions" className="btn btn-primary">
                Explore solutions
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a href="#contact" className="btn btn-outline-light">
                Talk to our team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
