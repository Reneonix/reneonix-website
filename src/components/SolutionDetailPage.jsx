import { useEffect, useRef } from 'react';
import {
  Play,
  Download,
  Calendar,
  ArrowRight,
  Shield,
  ChevronRight,
} from 'lucide-react';
import './SolutionDetailPage.css';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* Renders a <strong> with count-up data attrs if value is numeric (e.g. "100%", "3.2x") */
function CountValue({ value }) {
  const m = value.match(/^([\d.]+)(.*)$/);
  if (m) {
    const num = parseFloat(m[1]);
    const suffix = m[2] || '';
    const isFloat = m[1].includes('.');
    return (
      <strong data-count-to={String(num)} data-suffix={suffix} data-float={isFloat ? '1' : '0'}>
        {value}
      </strong>
    );
  }
  return <strong>{value}</strong>;
}

export default function SolutionDetailPage({ data }) {
  const {
    title,
    hero,
    whyTech,
    benefits,
    challenges,
    evolution,
    beforeBegin,
    process,
    capabilities,
    statsBanner,
    bottomCta,
  } = data;

  const pageRef = useRef(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Hero entrance — fires on the next paint so CSS transitions pick it up */
    requestAnimationFrame(() => root.querySelector('.sd-hero')?.classList.add('sd-hero--in'));

    if (prefersReduced) {
      root.querySelectorAll('[data-anim]').forEach((el) => el.classList.add('sd-in'));
      root.querySelectorAll('.sd-evo__step').forEach((el) => el.classList.add('sd-evo--active'));
      return;
    }

    /* Generic scroll-reveal for all [data-anim] elements */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('sd-in');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    root.querySelectorAll('[data-anim]').forEach((el) => io.observe(el));

    /* Evolution flow — sequential step lighting */
    const evoFlow = root.querySelector('.sd-evo__flow');
    if (evoFlow) {
      const evoIo = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          evoFlow.querySelectorAll('.sd-evo__step').forEach((step, i) => {
            setTimeout(() => step.classList.add('sd-evo--active'), i * 260);
          });
          evoIo.unobserve(evoFlow);
        },
        { threshold: 0.4 }
      );
      evoIo.observe(evoFlow);
    }

    /* Stats banner — count-up for numeric values */
    const countEls = root.querySelectorAll('[data-count-to]');
    if (countEls.length) {
      const countIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const to = parseFloat(el.dataset.countTo);
            const suffix = el.dataset.suffix || '';
            const isFloat = el.dataset.float === '1';
            let startTime = null;
            const duration = 1400;
            const tick = (ts) => {
              if (!startTime) startTime = ts;
              const p = Math.min((ts - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              const val = to * eased;
              el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            countIo.unobserve(el);
          });
        },
        { threshold: 0.6 }
      );
      countEls.forEach((el) => countIo.observe(el));
    }

    return () => io.disconnect();
  }, []);

  return (
    <section className="sd-page" ref={pageRef}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="sd-crumb" aria-label="Breadcrumb">
          <a href="#home">Home</a>
          <ChevronRight size={14} aria-hidden="true" />
          <a href="#solutions">Solutions</a>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="sd-crumb__current">{title}</span>
        </nav>
      </div>

      {/* ---------- HERO ---------- */}
      <div className="sd-hero">
        <div className="container">
          <div className="sd-hero__grid">
            <div className="sd-hero__copy">
              <h1>{hero.title}</h1>
              <p className="sd-hero__lead">{hero.description}</p>
              <div className="sd-hero__cta">
                <a href={hero.primaryHref || '#'} className="btn btn-primary sd-btn--video">
                  <Play size={14} aria-hidden="true" />
                  {hero.primaryLabel || 'Watch Solution Video'}
                </a>
                <a href={hero.secondaryHref || '#'} className="btn btn-outline-dark sd-btn--brochure">
                  <Download size={14} aria-hidden="true" />
                  {hero.secondaryLabel || 'Download Brochure'}
                </a>
              </div>
            </div>

            <div className="sd-hero__media">
              <div className="sd-hero__image-wrap">
                <img src={hero.image} alt={title} loading="eager" />
              </div>
              <aside className="sd-hero__pillars" aria-label="Key benefits">
                {hero.pillars.map(({ Icon, title: t, sub }) => (
                  <div className="sd-pillar" key={t}>
                    <span className="sd-pillar__icon"><Icon size={20} /></span>
                    <div className="sd-pillar__text">
                      <strong>{t}</strong>
                      <span>{sub}</span>
                    </div>
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- WHY THIS TECHNOLOGY ---------- */}
      <div className="sd-section sd-why">
        <div className="container">
          <header className="sd-section-head" data-anim="fade-up">
            <h2>{whyTech.title}</h2>
            <p>{whyTech.description}</p>
          </header>

          <div className="sd-why__stats">
            {whyTech.stats.map(({ Icon, value, label }, i) => (
              <div
                className="sd-stat-card"
                key={label}
                data-anim="flip"
                style={{ '--sd-delay': `${i * 0.12}s` }}
              >
                <span className="sd-stat-card__icon"><Icon size={22} /></span>
                <div className="sd-stat-card__text">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- BENEFITS & CHALLENGES ---------- */}
      <div className="sd-section sd-bc">
        <div className="container">
          <div className="sd-bc__grid">
            <article className="sd-bc__col">
              <h3 className="sd-bc__title">{benefits.title}</h3>
              <ul className="sd-bc__list">
                {benefits.items.map(({ Icon, title: t, body }, i) => (
                  <li key={t} data-anim="fade-left" style={{ '--sd-delay': `${i * 0.1}s` }}>
                    <span className="sd-bc__icon"><Icon size={18} /></span>
                    <div>
                      <strong>{t}</strong>
                      <span>{body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            <article className="sd-bc__col">
              <h3 className="sd-bc__title">{challenges.title}</h3>
              <ul className="sd-bc__list">
                {challenges.items.map(({ Icon, title: t, body }, i) => (
                  <li key={t} data-anim="fade-right" style={{ '--sd-delay': `${i * 0.1}s` }}>
                    <span className="sd-bc__icon sd-bc__icon--warn"><Icon size={18} /></span>
                    <div>
                      <strong>{t}</strong>
                      <span>{body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>

      {/* ---------- EVOLUTION FLOW ---------- */}
      <div className="sd-section sd-evo">
        <div className="container">
          <header className="sd-section-head" data-anim="fade-up">
            <h2>{evolution.title}</h2>
            <p>{evolution.subtitle}</p>
          </header>

          <div className="sd-evo__flow">
            {evolution.steps.map(({ Icon, label }, i) => (
              <div className="sd-evo__step" key={label}>
                <div className="sd-evo__icon"><Icon size={22} /></div>
                <span className="sd-evo__label">{label}</span>
                {i < evolution.steps.length - 1 && (
                  <ArrowRight className="sd-evo__arrow" size={18} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- BEFORE WE BEGIN ---------- */}
      <div className="sd-section sd-before">
        <div className="container">
          <div className="sd-before__card" data-anim="fade-up">
            <span className="sd-before__icon"><Shield size={22} /></span>
            <div>
              <strong>{beforeBegin.title}</strong>
              <p>{beforeBegin.body}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- OVERALL PROCESS ---------- */}
      <div className="sd-section sd-process">
        <div className="container">
          <header className="sd-section-head" data-anim="fade-up">
            <h2>{process.title}</h2>
          </header>

          <ol className="sd-process__steps">
            {process.steps.map(({ Icon, label }, i) => (
              <li
                className="sd-process__step"
                key={label}
                data-anim="fade-up"
                style={{ '--sd-delay': `${i * 0.1}s` }}
              >
                <span className="sd-process__num">{i + 1}</span>
                <span className="sd-process__icon"><Icon size={26} /></span>
                <span className="sd-process__label">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ---------- CAPABILITIES (3 columns) ---------- */}
      <div className="sd-section sd-cap">
        <div className="container">
          <header className="sd-section-head" data-anim="fade-up">
            <h2>{capabilities.title}</h2>
          </header>

          <div className="sd-cap__grid">
            {capabilities.columns.map((col, i) => (
              <article
                className={`sd-cap__col sd-cap__col--${col.tone || 'neutral'}`}
                key={col.title}
                data-anim="fade-up"
                style={{ '--sd-delay': `${i * 0.15}s` }}
              >
                <header>
                  <strong>{col.title}</strong>
                  {col.subtitle && <span>{col.subtitle}</span>}
                </header>
                <ul>
                  {col.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- STATS BANNER ---------- */}
      <div className="sd-banner">
        <div className="container">
          <div className="sd-banner__inner">
            <div className="sd-banner__copy" data-anim="fade-left">
              <strong>{statsBanner.title}</strong>
              <span>{statsBanner.subtitle}</span>
            </div>
            <div className="sd-banner__stats">
              {statsBanner.stats.map(({ Icon, value, label }, i) => (
                <div
                  className="sd-banner__stat"
                  key={label}
                  data-anim="fade-up"
                  style={{ '--sd-delay': `${i * 0.1}s` }}
                >
                  <span className="sd-banner__icon"><Icon size={22} /></span>
                  <CountValue value={value} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- BOTTOM CTA ---------- */}
      <div className="sd-section sd-bottom">
        <div className="container">
          <div className="sd-bottom__card" data-anim="scale-up">
            <div className="sd-bottom__icon"><Shield size={26} /></div>
            <div className="sd-bottom__copy">
              <strong>{bottomCta.title}</strong>
              <span>{bottomCta.subtitle}</span>
            </div>
            <div className="sd-bottom__actions">
              <a href="#contact" className="btn btn-primary">
                <Calendar size={14} aria-hidden="true" />
                {bottomCta.primaryLabel || 'Schedule a Demo'}
              </a>
              <a href="#" className="btn btn-outline-dark">
                <Download size={14} aria-hidden="true" />
                {bottomCta.secondaryLabel || 'Download Brochure'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
