import ShinyText from './ShinyText.jsx';

export default function Hero() {
  return (
    <section className="hero" id="home">
      {/* Animated photographic background */}
      <video
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        data-parallax="0.18"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Decorative overlays */}
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
