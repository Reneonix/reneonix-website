import { useEffect, useLayoutEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { navClick } from '../utils/nav.js';
import MagicBento, { MagicBentoCard } from './MagicBento.jsx';
import './IndustriesPage.css';

const INDUSTRIES = [
  {
    badge: 'Live deployment',
    variant: 'live',
    img: '/glass hero.webp',
    title: 'Glass Manufacturers',
    tagline: 'From ungraded cullet to furnace-ready raw material, verified batch by batch.',
    href: '/industries/glass-manufacturers',
  },
  {
    badge: 'Live deployment',
    variant: 'live',
    img: '/recycling - main.webp',
    title: 'Recycling Operators',
    tagline: 'Turn mixed, contaminated intake into buyer-ready output, without adding headcount.',
    href: '/industries/recycling-operators',
  },
  {
    badge: 'Pilot discussion',
    variant: 'pilot',
    img: '/fmcg main.webp',
    title: 'Beverage & FMCG Brands',
    tagline: 'Know exactly where your packaging goes after the point of sale, and prove it to a regulator.',
    href: '/industries/beverage-fmcg-brands',
  },
  {
    badge: 'Positioning',
    variant: 'position',
    img: '/mining-hero.webp',
    title: 'Minerals & Mining',
    tagline: "Byproduct isn't waste until you decide not to characterise it.",
    href: '/industries/mining-minerals',
  },
  {
    badge: 'Concept',
    variant: 'position',
    img: '/government hero.webp',
    title: 'Government & Municipalities',
    tagline: 'Household-level waste visibility for the communities that need it most.',
    href: '/industries/municipalities-government',
  },
];

export default function IndustriesPage() {
  // Page-local reveal — this page is lazy-loaded, so it mounts after
  // SiteEffects' route-keyed IntersectionObserver has already run and can
  // never see these nodes (same fix as the other industry pages).
  useLayoutEffect(() => {
    const vh = window.innerHeight;
    document.querySelectorAll('.ind-reveal').forEach((el) => {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < vh && bottom > 0) el.classList.add('ind-in');
    });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ind-in');
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.ind-reveal:not(.ind-in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ind-page">

      {/* ── HERO ── */}
      <section className="ind-hero">
        <video
          className="ind-hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/industry bg video optimized.mp4" type="video/mp4" />
        </video>
        <div className="ind-hero__veil" aria-hidden="true" />

        <div className="container">
          <nav className="ind-breadcrumb" aria-label="Breadcrumb">
            <a href="/" onClick={navClick('/')}>Home</a>
            <ChevronRight size={13} aria-hidden="true" />
            <span className="is-current">Industries</span>
          </nav>

          <div className="ind-hero__copy">
            <h1>
              One Platform, Deployed Across the <em>Materials That Make Up Daily Life</em>
            </h1>
            <p className="ind-hero__lead">
              Reneonix's AI recovery hardware, traceability software, and material science
              stack isn't built for one material or one customer type. Here's where it's live
              today - and where it's headed next.
            </p>
          </div>
        </div>
      </section>

      {/* ── THE INDUSTRIES ── */}
      <section className="section section-dark ind-industries-section">
        <div className="container">
          <div className="section-head ind-reveal">
            <h2>Where We <em>Operate</em></h2>
            <p>From live deployments to early-stage partnerships, this is where Reneonix's platform is headed.</p>
          </div>

          <MagicBento
            className="ind-grid"
            glowColor="156, 193, 48"
            spotlightRadius={300}
            particleCount={10}
            enableTilt={false}
            enableMagnetism
            enableStars
            enableSpotlight
            enableBorderGlow
            clickEffect
          >
            {INDUSTRIES.map((ind, i) => (
              <MagicBentoCard
                as="a"
                className="ind-card ind-reveal"
                href={ind.href}
                onClick={navClick(ind.href)}
                key={ind.title}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="ind-card__media">
                  <img src={ind.img} alt={ind.title} loading="lazy" decoding="async" />
                  <span className={`ind-badge ind-badge--${ind.variant}`}>{ind.badge}</span>
                </div>

                <div className="ind-card__body">
                  <h3>{ind.title}</h3>
                  <p className="ind-card__tagline">{ind.tagline}</p>

                  <span className={`ind-card__more ind-card__more--${ind.variant}`}>
                    Explore {ind.title}
                    <ChevronRight size={15} aria-hidden="true" />
                  </span>
                </div>
              </MagicBentoCard>
            ))}
          </MagicBento>
        </div>
      </section>

      {/* ── DON'T SEE YOUR INDUSTRY? ── */}
      <section className="section section-dark ind-cta-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="ind-cta ind-reveal">
            <div className="ind-cta__copy">
              <h2>Don't See Your Industry?</h2>
              <p>
                Reneonix's platform is material-agnostic by design. If you're working with a
                recovered or byproduct material stream we haven't listed here, we'd still like to
                hear from you.
              </p>
            </div>
            <div className="ind-cta__actions">
              <a href="/contact-us" onClick={navClick('/contact-us')} className="btn btn-primary">
                Get in Touch
                <ChevronRight size={16} aria-hidden="true" />
              </a>
              <a href="/solutions" onClick={navClick('/solutions')} className="btn btn-outline-light">
                Explore the Technology
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
