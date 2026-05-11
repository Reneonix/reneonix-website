import ShinyText from './ShinyText.jsx';
import LiquidEther from './LiquidEther.jsx';

export default function Hero() {
  return (
    <section className="hero" id="home">
      {/* Interactive fluid simulation background (replaces the previous video).
          Inline style.position is required — LiquidEther's internal JS reads
          container.style.position and falls back to "relative" when it's empty,
          which would break our absolute layering. */}
      <LiquidEther
        className="hero__fluid"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: -3,
          backgroundColor: '#04060a',
          pointerEvents: 'auto',
        }}
        colors={['#B2DE3A', '#C4E84A', '#9CC130']}
        mouseForce={22}
        cursorSize={120}
        resolution={0.5}
        autoDemo
        autoSpeed={0.6}
        autoIntensity={2.4}
        takeoverDuration={0.3}
        autoResumeDelay={2000}
        autoRampDuration={0.8}
      />

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
