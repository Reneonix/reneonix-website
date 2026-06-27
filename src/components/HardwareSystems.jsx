import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Cpu, Zap, Shield, ChevronRight, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HardwareSystems.css';

gsap.registerPlugin(ScrollTrigger);

const STEP_DATA = [
  {
    num: '01', name: 'Scan',
    desc: 'High-speed cameras capture every bottle entering the system.',
    specs: ['2,400 bottles / hr', '360° coverage', 'Sub-ms capture'],
    highlights: ['High-speed camera array', '360° bottle coverage', 'Real-time entry detection', 'Sub-millisecond capture'],
  },
  {
    num: '02', name: 'Detect',
    desc: 'AI detects colour, shape & material in real time.',
    specs: ['99.2% detection rate', 'Multi-spectral sensing', 'Real-time AI'],
    highlights: ['99.2% detection accuracy', 'Multi-spectral sensor array', 'AI-powered composition ID', 'Real-time analysis'],
  },
  {
    num: '03', name: 'Classify',
    desc: 'Real-time classification using advanced neural AI models.',
    specs: ['12+ glass types', 'Brand recognition', 'Neural classification'],
    highlights: ['12+ glass type recognition', 'Color and brand identification', 'Neural model classification', 'Multi-axis simultaneous sort'],
  },
  {
    num: '04', name: 'Sort',
    desc: 'Smart pneumatic actuators separate materials with precision.',
    specs: ['±2 mm accuracy', '6 output lanes', 'Zero cross-contamination'],
    highlights: ['±2 mm sorting precision', '6 dedicated output lanes', 'Zero cross-contamination', 'Pneumatic actuation system'],
  },
  {
    num: '05', name: 'Recover',
    desc: 'High-purity outputs ready for closed-loop recycling.',
    specs: ['98% purity output', '< 0.5% material loss', 'Industrial grade'],
    highlights: ['98% output purity achieved', 'Less than 0.5% material loss', 'Industrial-grade standards', 'Closed-loop recycling ready'],
  },
];

const STEP_IMAGES = [
  { src: '/scan.png',      alt: 'Scan — cameras capture every bottle entering' },
  { src: '/detect.png',    alt: 'Detect — multi-spectral AI sensors at work' },
  { src: '/classify.png',  alt: 'Classify — neural models identify material type' },
  { src: '/sort.png',      alt: 'Sort — pneumatic actuators route each unit' },
  { src: '/recover.png',   alt: 'Recover — sorted glass exits at 98% purity' },
];

export default function HardwareSystems() {

  /* ── Desktop: GSAP ScrollTrigger pin + cinematic scroll camera ── */
  const [activeImg, setActiveImg] = useState(1);
  const sorterRef = useRef(null);
  const zoomRef   = useRef(null);

  /* ── Mobile: CSS scroll-snap track ── */
  const [activeStep, setActiveStep] = useState(0);
  const trackRef = useRef(null);

  /* ── Pre-init (useLayoutEffect — fires BEFORE the browser's first paint) ──
     Kills any ScrollTriggers that survived SPA nav or HMR and resets scroll
     to 0 so every pin calculation is measured from the top.              ── */
  useLayoutEffect(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());
    window.scrollTo(0, 0);
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  /* ── Desktop: GSAP ScrollTrigger pin + camera interpolation ── */
  useEffect(() => {
    const section = sorterRef.current;
    const zoomEl  = zoomRef.current;
    if (!section || !zoomEl || window.matchMedia('(max-width: 900px)').matches) return;

    const STEPS = 5;

    const CAM = [
      { scale: 1.03, ox: 38, oy: 0 }, // t=0  SCAN
      { scale: 1.07, ox: 44, oy: 0 }, // t=1  DETECT
      { scale: 1.05, ox: 50, oy: 0 }, // t=2  CLASSIFY
      { scale: 1.03, ox: 56, oy: 0 }, // t=3  SORT
      { scale: 1.02, ox: 60, oy: 0 }, // t=4  RECOVER
      { scale: 1.02, ox: 60, oy: 0 }, // t=5  hold
    ];

    const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const applyCam = (progress) => {
      const sf  = progress * STEPS;
      const i   = Math.min(Math.floor(sf), CAM.length - 2);
      const t   = ease(sf - i);
      const a   = CAM[i];
      const b   = CAM[i + 1];
      gsap.set(zoomEl, {
        scale:           a.scale + (b.scale - a.scale) * t,
        transformOrigin: `${a.ox + (b.ox - a.ox) * t}% ${a.oy + (b.oy - a.oy) * t}%`,
      });
    };

    applyCam(0);

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 76px',
      end: () => '+=' + STEPS * window.innerHeight,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter:     () => { setActiveImg(1); applyCam(0); },
      onLeaveBack: () => { setActiveImg(1); applyCam(0); },
      onUpdate(self) {
        const step = Math.min(Math.ceil(self.progress * STEPS) || 1, STEPS);
        setActiveImg(step);
        applyCam(self.progress);
      },
    });

    return () => {
      st.kill();
      gsap.set(zoomEl, { scale: 1, transformOrigin: '50% 50%' });
    };
  }, []);

  /* ── Intersection observer — scroll reveal ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('hw2-in'); io.unobserve(e.target); }
      }),
      { threshold: 0.05 }
    );
    const root = document.querySelector('.hw2-page');
    (root || document).querySelectorAll('.hw2-reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── Post-init refresh so GSAP re-reads heights after images load ── */
  useEffect(() => {
    let t1, t2;
    const doRefresh = () =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => ScrollTrigger.refresh())
      );
    const imgs = Array.from(document.querySelectorAll('.hw2-page img'));
    const pending = imgs.filter(img => !img.complete);
    if (pending.length === 0) {
      doRefresh();
    } else {
      let resolved = 0;
      pending.forEach(img => {
        const cb = () => { if (++resolved === pending.length) doRefresh(); };
        img.addEventListener('load',  cb, { once: true });
        img.addEventListener('error', cb, { once: true });
      });
    }
    t1 = setTimeout(doRefresh, 300);
    t2 = setTimeout(doRefresh, 650);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* ── Mobile slider helpers (CSS scroll snap — no GSAP) ── */
  const handleTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const idx = Math.round(track.scrollLeft / track.offsetWidth);
    setActiveStep(Math.min(Math.max(idx, 0), STEP_DATA.length - 1));
  };

  const scrollToStep = (idx) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: idx * track.offsetWidth, behavior: 'smooth' });
  };

  return (
    <div className="hw2-page">

      {/* ── HERO ── */}
      <section className="hw2-hero">
        <picture>
          <source media="(max-width: 768px)" srcSet="/hardware-hero-mobile.jpeg" />
          <img
            className="hw2-hero__bg"
            src="/hardware-hero.png"
            alt="Reneonix industrial material recovery system"
            draggable="false"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
        <div className="hw2-hero__overlay" aria-hidden="true" />
        <div className="container hw2-hero__container">
          <nav className="hw2-crumb" aria-label="Breadcrumb">
            <a href="#home">Home</a>
            <ChevronRight size={14} aria-hidden="true" />
            <a href="#solutions">Solutions</a>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="hw2-crumb__current">Hardware</span>
          </nav>
          <div className="hw2-hero__copy">
            <h1 className="hw2-hero__title">
              <em>Industrial Vision systems<br />for </em>material recovery
            </h1>
            <p className="hw2-hero__lead">
              Smart infrastructure engineered for modern material processing facilities.
            </p>
          </div>
        </div>
      </section>

      {/* ── AI SORTING MODULE ── */}
      <section className="hw-sorter-section" id="hw-sorter" ref={sorterRef}>

        {/* ── DESKTOP: cinematic two-column scroll storytelling (>900px) ── */}
        <div className="hw-sorter__inner">

          <aside className="hw-sorter__left">
            <div className="hw-sorter__left-hdr">
              <h2 className="hw-sorter__left-title">
                First Commercial Grade,<br /><em>Glass</em> Sorting System
              </h2>
              <p className="hw-sorter__left-sub">
                Vision-based, non-destructive sorting with real-time classification
                and brand recognition - built for industrial environments.
              </p>
              <p className="hw-sorter__left-eyebrow">How It Works</p>
            </div>

            <div
              className="hw-sorter__steps-nav"
              style={{ '--sorter-fill': `${(activeImg - 1) / (STEP_DATA.length - 1) * 100}%` }}
            >
              <div className="hw-sorter__steps-line" aria-hidden="true" />
              {STEP_DATA.map((s, i) => (
                <div
                  key={i}
                  className={`hw-sorter__step-row${activeImg === i + 1 ? ' hw-sorter__step-row--on' : ''}`}
                >
                  <span className="hw-sorter__step-pip" aria-hidden="true" />
                  <div className="hw-sorter__step-text">
                    <div className="hw-sorter__step-hdr">
                      <span className="hw-sorter__step-lbl">{s.name}</span>
                    </div>
                    <div className="hw-sorter__step-body">
                      <div className="hw-sorter__step-body-inner">
                        <p className="hw-sorter__step-d">{s.desc}</p>
                        <div className="hw-sorter__pills">
                          {s.specs.map(spec => (
                            <span key={spec} className="hw-sorter__pill">{spec}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="hw-sorter__right">
            <div className="hw-sorter__img-frame">
              <span className="hw-sorter__counter" aria-live="polite">
                {String(activeImg).padStart(2, '0')} / 0{STEP_DATA.length}
              </span>
              <div ref={zoomRef} className="hw-sorter__zoom-wrap">
                {STEP_IMAGES.map(({ src, alt }, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={alt}
                    className={`hw-sorter__img${activeImg === i + 1 ? ' hw-sorter__img--on' : ''}`}
                    loading="eager"
                    decoding="async"
                    fetchPriority={i === 0 ? 'high' : 'low'}
                    draggable="false"
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── MOBILE: horizontal CSS scroll-snap card slider (≤900px) ── */}
        <div className="hw-sorter__mobile">

          <div className="hw-sorter__mobile-hdr">
            <p className="hw-sorter__mobile-eyebrow">How It Works</p>
            <h2 className="hw-sorter__mobile-title">
              First Commercial Grade,<br /><em>Glass</em> Sorting System
            </h2>
            <p className="hw-sorter__mobile-sub">
              Vision-based, non-destructive sorting with real-time classification
              and brand recognition — built for industrial environments.
            </p>
          </div>

          {/* Horizontal scroll track — native swipe, no JS touch handling */}
          <div
            className="hw-sorter__mobile-track"
            ref={trackRef}
            onScroll={handleTrackScroll}
          >
            {STEP_DATA.map((s, i) => (
              <div className="hw-sorter__mobile-slide" key={i}>
                <div className="hw-sorter__mobile-slide-content">
                  <p className="hw-sorter__mobile-step-eyebrow">Step {s.num}</p>
                  <h3 className="hw-sorter__mobile-step-name">{s.name}</h3>
                  <p className="hw-sorter__mobile-step-desc">{s.desc}</p>
                  <ul className="hw-sorter__mobile-highlights">
                    {s.highlights.map((h, hi) => (
                      <li key={hi} className="hw-sorter__mobile-highlight">
                        <CheckCircle2 size={14} className="hw-sorter__mobile-highlight-icon" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hw-sorter__mobile-img-wrap">
                  <img
                    src={STEP_IMAGES[i].src}
                    alt={STEP_IMAGES[i].alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable="false"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pill-style progress dots — always visible, tappable */}
          <div className="hw-sorter__mobile-dots" aria-label="Step indicators">
            {STEP_DATA.map((_, i) => (
              <button
                key={i}
                className={`hw-sorter__mobile-dot${activeStep === i ? ' hw-sorter__mobile-dot--on' : ''}`}
                onClick={() => scrollToStep(i)}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

        </div>

      </section>

      {/* ── VISIONBOX — AI Inspection ── */}
      <section className="hw-vb-section">
        <picture>
          <source media="(max-width: 768px)" srcSet="/hardware-inspection-mobile.png" />
          <img
            className="hw-vb__bg"
            src="/hardware-inspection-box.png"
            alt="VisionBox AI Inspection System"
            draggable="false"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="hw-vb__overlay" aria-hidden="true" />
        <div className="container hw-vb__container">
          <div className="hw-vb__copy">
            <h2 className="hw-vb__title">
              AI-Powered Quality Inspection<br />
              <em>For Any Material,<br />Any Industry</em>
            </h2>
            <p className="hw-vb__body">
              VisionBox is an advanced AI inspection system designed for real-time defect
              detection and classification - built for glass, ready for{' '}
              <span className="hw-vb__body-lime">any material</span>
            </p>
            <div className="hw-vb__cols">
              {[
                { icon: <Cpu size={22} />,    title: 'Intelligent', body: 'Deep learning models for accurate defect detection' },
                { icon: <Zap size={22} />,    title: 'Real-Time',   body: 'High-speed inspection with instant results' },
                { icon: <Shield size={22} />, title: 'Versatile',   body: 'Optimized for glass, adaptable to any material or surface' },
              ].map(({ icon, title, body }) => (
                <div className="hw-vb__col" key={title}>
                  <div className="hw-vb__col-icon">{icon}</div>
                  <p className="hw-vb__col-title">{title}</p>
                  <p className="hw-vb__col-body">{body}</p>
                </div>
              ))}
            </div>
            <p className="hw-vb__built">
              <span className="hw-vb__built-lime">Built for Glass,</span>{' '}
              Designed for Every Material
            </p>
          </div>
        </div>
      </section>

      {/* ── MRM ── */}
      <section className="hw-mrm-section" id="hw-mrm">
        <div className="container hw-mrm__top">
          <div className="hw-mrm__left-col">
            <h2 className="hw-mrm__title">MRM (AI) <em>Material</em><br />Recovery Machine</h2>
            <p className="hw-mrm__subtitle">Modular Front-End Recovery System</p>
            <p className="hw-mrm__body">
              MRM (AI) is a modular front-end recovery system that accepts post-consumer materials
              at the source. It uses advanced computer vision and sensors to identify, grade, and
              separate materials in real time – maximising reuse and ensuring high-purity recycling.
            </p>
            <p className="hw-mrm__caps-label">What the Machine Does</p>
            <div className="hw-mrm__caps-grid">
              {[
                { title: 'Identify',  desc: 'Real-time material recognition using AI vision.' },
                { title: 'Classify',  desc: 'Determines material quality and recovery path.' },
                { title: 'Separate',  desc: 'Routes materials into optimized output streams.' },
                { title: 'Track',     desc: 'Logs every deposit and material movement digitally.' },
              ].map(({ title, desc }) => (
                <div className="hw-mrm__cap-tile" key={title}>
                  <p className="hw-mrm__cap-tile-title">{title}</p>
                  <p className="hw-mrm__cap-tile-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hw-mrm__img-placeholder">
            <img
              src="/hardware-MRM.png"
              alt="MRM AI Material Recovery Machine"
              className="hw-mrm__machine-img"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
