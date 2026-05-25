import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Brain, FlaskConical, ClipboardList, Settings, RefreshCw,
  Recycle, Wine, Layers, Monitor, Package, Shuffle,
  Truck, GitBranch, ClipboardCheck,
  LayoutGrid, Gauge, Building2, Shield, TrendingUp,
  Eye, Crosshair, SlidersHorizontal, BarChart2, Leaf,
  ArrowRight, ChevronRight, ChevronLeft,
} from 'lucide-react';
import './HardwareSystems.css';

gsap.registerPlugin(ScrollTrigger);

const ENABLES = [
  { Icon: Brain,        title: 'AI-powered material intelligence.',  body: 'Detect, identify, and classify materials with high accuracy.' },
  { Icon: FlaskConical, title: 'Multi-material recovery systems.',    body: 'Hardware built to handle a wide range of material streams.' },
  { Icon: ClipboardList,title: 'Traceability infrastructure.',        body: 'Track material flow, quality, and recovery with end-to-end visibility.' },
  { Icon: Settings,     title: 'Scalable industrial hardware.',       body: 'Engineered for real-world throughput and continuous operation.' },
  { Icon: RefreshCw,    title: 'Circular recovery workflows.',        body: 'Enable closed-loop, efficient, and sustainable operations.' },
];

const MATERIALS = [
  { label: 'Solar Panels',      body: 'End-of-life PV modules, cells, and solar components.',  img: '/hardware-solar-panel.jpg' },
  { label: 'Glass',             body: 'Bottles, jars, flat glass, and mixed glass streams.',   img: '/hardware-glass.jpg' },
  { label: 'Ceramics',          body: 'Ceramic waste, tiles, refractories, and composites.',   img: '/hardware-ceramics.jpg' },
  { label: 'E-waste',           body: 'Electronics, devices, components, and assemblies.',     img: '/hardware-e-waste.jpg' },
  { label: 'Paper & Packaging', body: 'Paper, cardboard, cartons, and packaging waste.',       img: '/hardware-paper.jpg' },
  { label: 'Textiles',          body: 'Garments, fabrics, fibres, and textile waste streams.', img: '/hardware-clothes.jpg' },
];

const WORKFLOW = [
  {
    n: 1, Icon: Truck,
    label: 'Material Intake',
    headline: 'Industrial waste streams enter the system.',
    body: 'Industrial vehicles deliver mixed material streams directly to the processing line. The primary conveyor simultaneously accepts plastic, metal, glass, batteries, and e-waste in a single unified intake flow.',
    tags: ['Plastic', 'Metal', 'Glass', 'Batteries', 'E-waste'],
    visual: 'intake',
  },
  {
    n: 2, Icon: Brain,
    label: 'AI Detection & Identification',
    headline: 'Machine vision classifies every material in real time.',
    body: 'Proprietary AI scanning systems deploy laser sensors and computer vision above the conveyor belt. Each material is identified, tagged with composition data, and queued instantly for precision routing.',
    tags: ['Plastic Detected', 'Metal Detected', 'Glass Detected', 'Battery Detected'],
    visual: 'scan',
  },
  {
    n: 3, Icon: GitBranch,
    label: 'Sorting & Routing',
    headline: 'Robotic systems route materials into dedicated recovery lanes.',
    body: 'Intelligent actuators direct each classified material to its designated channel in real time. Conveyor lanes split dynamically based on AI output — zero cross-contamination, maximum throughput.',
    tags: ['Automated', 'Multi-Stream', 'High Throughput', 'Zero Contamination'],
    visual: 'sort',
  },
  {
    n: 4, Icon: Recycle,
    label: 'Recovery & Processing',
    headline: 'Waste is compressed into traceable reusable material blocks.',
    body: 'Each sorted stream enters a dedicated processing chamber. Heavy industrial machinery compresses and refines materials into high-purity output blocks certified for circular reuse.',
    tags: ['Compression', 'Purification', 'Industrial Scale', 'High Purity Output'],
    visual: 'recover',
  },
  {
    n: 5, Icon: ClipboardCheck,
    label: 'Traceable Output',
    headline: 'Every batch is logged, certified, and dashboard-visible.',
    body: 'Full lifecycle traceability is generated automatically for every output batch. Sustainability metrics, recovery rates, and circular economy analytics are available in real time across all material streams.',
    tags: ['Full Traceability', 'Live Analytics', 'Certified Output', 'Circular Economy'],
    visual: 'trace',
  },
];

const INFRA = [
  { Icon: LayoutGrid,       title: 'Modular hardware architecture',          body: 'Flexible design that adapts to your facility and material requirements.' },
  { Icon: Gauge,            title: 'Designed for real-world throughput',      body: 'High-performance systems built for industrial environments.' },
  { Icon: Building2,        title: 'Supports pilot, plant & multi-site deployment', body: 'From pilot setups to large scale operations across multiple locations.' },
  { Icon: Shield,           title: 'Engineered for operational consistency',  body: 'Reliable hardware and process stability you can depend on.' },
  { Icon: TrendingUp,       title: 'Built to evolve with new materials',      body: 'Continuously improving to support emerging material categories.' },
];

const IMPACT_METRICS = [
  { Icon: Eye,              title: 'Complete visibility across materials', body: 'End-to-end traceability for every material stream.' },
  { Icon: Crosshair,        title: 'Higher sorting accuracy',              body: 'AI-powered detection improves purity and recovery quality.' },
  { Icon: SlidersHorizontal,title: 'Operational flexibility',              body: 'Handle more materials and changing waste compositions.' },
  { Icon: BarChart2,        title: 'Scalable circular workflows',          body: 'Built to grow with your volumes and recovery goals.' },
  { Icon: Leaf,             title: 'Future-ready infrastructure',          body: 'Designed to adapt to new materials and regulatory needs.' },
];


const lerp = (a, b, t) => a + (b - a) * t;

function circOffsetFloat(i, pos, len) {
  let off = ((i - pos) % len + len) % len;
  if (off > len / 2) off -= len;
  return off;
}

// Interpolates card style smoothly for fractional offsets (continuous marquee)
function cardStyleFloat(offset) {
  const absOff = Math.abs(offset);
  const sign = offset < 0 ? -1 : 1;
  const cfgs = [
    { tx: 0,   ry: 0,  scale: 1.00, opacity: 1.00 },
    { tx: 280, ry: 20, scale: 0.84, opacity: 0.72 },
    { tx: 500, ry: 36, scale: 0.68, opacity: 0.38 },
    { tx: 680, ry: 50, scale: 0.52, opacity: 0.00 },
  ];
  const fl = Math.min(Math.floor(absOff), 2);
  const fr = absOff - Math.floor(absOff);
  const c1 = cfgs[fl];
  const c2 = cfgs[fl + 1];
  const tx    = lerp(c1.tx,    c2.tx,    fr);
  const ry    = lerp(c1.ry,    c2.ry,    fr);
  const scale = lerp(c1.scale, c2.scale, fr);
  const opacity = lerp(c1.opacity, c2.opacity, fr);
  return {
    transform: `translate(-50%, -50%) translateX(${sign * tx}px) rotateY(${-sign * ry}deg) scale(${scale})`,
    opacity,
    zIndex: Math.max(1, Math.round(5 - absOff * 1.5)),
  };
}

const CAROUSEL_SPEED = 1 / 250;

// ── Scroll-story visual panels v2 ────────────────────────────

/* Shared video panel — plays only when its step is active */
function VisVideo({ src, hud, isActive }) {
  const vidRef = useRef(null);
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    if (isActive) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive]);
  return (
    <div className="hw2-vis-plain">
      <video
        ref={vidRef}
        className="hw2-vis-plain__video"
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  );
}


// ─────────────────────────────────────────────────────────────

export default function HardwareSystems() {
  const heroImgRef = useRef(null);

  // Scroll-story workflow
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const storyRef = useRef(null);

  // Materials scroll-stack (Fade & Scale overlap effect)
  const matStackRef         = useRef(null);
  const matStackWrapperRefs = useRef([]);
  const matStackCardRefs    = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const wrappers = matStackWrapperRefs.current.filter(Boolean);
      const total    = wrappers.length;

      wrappers.forEach((wrapper, i) => {
        const card = matStackCardRefs.current[i];
        if (!card) return;

        // Last card: stays visible, no fade-out pin
        if (i === total - 1) {
          gsap.set(card, { opacity: 1, scale: 1 });
          return;
        }

        gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            pin: true,
            pinSpacing: false,
          },
        })
          .set(card, { opacity: 1, scale: 1 })
          .to(card, { opacity: 0, scale: 0.75, ease: 'none' }, 0.01);
      });
    }, matStackRef);

    return () => ctx.revert();
  }, []);


  // Carousel — RAF-driven continuous position
  const posRef      = useRef(0);
  const cardRefs    = useRef([]);
  const rafRef      = useRef(null);
  const isPaused    = useRef(false);
  const prevDotRef  = useRef(0);
  const [dotIdx, setDotIdx] = useState(0);

  function applyCarousel() {
    const pos = posRef.current;
    const len = ENABLES.length;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const off = circOffsetFloat(i, pos, len);
      const s   = cardStyleFloat(off);
      el.style.transform = s.transform;
      el.style.opacity   = String(s.opacity);
      el.style.zIndex    = String(s.zIndex);
      el.classList.toggle('hw2-carousel__card--active', Math.abs(off) < 0.6);
    });
    const d = ((Math.round(pos) % len) + len) % len;
    if (d !== prevDotRef.current) { prevDotRef.current = d; setDotIdx(d); }
  }

  // Start the RAF marquee loop
  useEffect(() => {
    applyCarousel();
    const tick = () => {
      if (!isPaused.current) {
        posRef.current = (posRef.current + CAROUSEL_SPEED) % ENABLES.length;
        applyCarousel();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Hero image entrance + scroll-reveal
  useEffect(() => {
    requestAnimationFrame(() => {
      heroImgRef.current?.classList.add('hw2-img-in');
    });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('hw2-in'); io.unobserve(e.target); }
      }),
      { threshold: 0.05 }
    );
    document.querySelectorAll('.hw2-reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Scroll-story step tracker
  useEffect(() => {
    const onScroll = () => {
      const el = storyRef.current;
      if (!el) return;
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const scrolled = Math.max(0, Math.min(scrollable, -el.getBoundingClientRect().top));
      setActiveWorkflow(Math.min(WORKFLOW.length - 1, Math.floor((scrolled / scrollable) * WORKFLOW.length)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goNext = () => {
    posRef.current = ((Math.round(posRef.current) + 1) + ENABLES.length) % ENABLES.length;
    applyCarousel();
  };
  const goPrev = () => {
    posRef.current = ((Math.round(posRef.current) - 1) + ENABLES.length) % ENABLES.length;
    applyCarousel();
  };

  return (
    <div className="hw2-page">

      {/* ── HERO ── */}
      <section className="hw2-hero">
        <div className="container">
          <nav className="hw2-crumb" aria-label="Breadcrumb">
            <a href="#home">Home</a>
            <ChevronRight size={14} aria-hidden="true" />
            <a href="#solutions">Solutions</a>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="hw2-crumb__current">Hardware</span>
          </nav>

          <div className="hw2-hero__inner">
            <div className="hw2-hero__copy">
              <h1 className="hw2-hero__title">
                Built for <em>multi-material</em> circular recovery
              </h1>
              <p className="hw2-hero__lead">
                Reneonix develops industrial hardware, traceability systems, and
                AI-powered sorting infrastructure designed to recover materials at scale.
              </p>
              <div className="hw2-hero__actions">
                <a href="#integrated-solutions" className="btn btn-primary hw2-btn-full"
                  onClick={(e) => { e.preventDefault(); document.getElementById('hw2-enables')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Explore Hardware Systems <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="hw2-hero__media" ref={heroImgRef}>
              <video
                className="hw2-hero__img"
                src="/hardware-hero-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── MRM ── */}
      <section className="hw-product-section hw-product-section--dark">
        <div className="container">
          <span className="hw-chapter-tag">HARDWARE 01</span>
          <div className="hw-product__inner">
            <div className="hw-product__copy">
              <h2 className="hw-product__title">
                MRM (AI) Material Recovery Machine.{' '}
                <span className="hw-product__title-lime">Modular front-end recovery system.</span>
              </h2>
              <p className="hw-product__subtitle">Multi-material smart intake at the source.</p>
              <p className="hw-product__body">
                Accepts post-consumer materials at the point of disposal. Identifies and grades
                in real time using on-edge computer vision and sensors. Separates reuse from
                recycling streams. Digitally logs every deposit to Trace OS.
              </p>
              <div className="hw-dual-layer">
                <p className="hw-dual-layer__label">DUAL INTELLIGENCE LAYER</p>
                <div className="hw-dual-layer__grid">
                  <div className="hw-dual-layer__col">
                    <p className="hw-dual-layer__col-title">Reuse Stream</p>
                    <p className="hw-dual-layer__col-sub">VALUE MAXIMIZATION</p>
                    <ul>
                      <li>Brand-level identification</li>
                      <li>Size and condition segregation</li>
                      <li>Refill ecosystem ready</li>
                    </ul>
                  </div>
                  <div className="hw-dual-layer__col">
                    <p className="hw-dual-layer__col-title">Recycling Stream</p>
                    <p className="hw-dual-layer__col-sub">MATERIAL PURITY</p>
                    <ul>
                      <li>Color sorting</li>
                      <li>Contamination removal</li>
                      <li>Processor-ready output</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="hw-status-bar">
                <span className="hw-status-bar__label">STATUS</span>
                Late-stage R&amp;D · validated at MRF sites · production deployment in next 2 months.
              </div>
            </div>

            <div className="hw-product__visual">
              <div className="hw-product__img-placeholder">
                <span>MRM v1</span>
                <p>Product image coming soon</p>
              </div>
              <div className="hw-product__spec-card">
                <p className="hw-spec-card__eyebrow">CAPABILITIES</p>
                <h3 className="hw-spec-card__name">MRM v1</h3>
                <div className="hw-spec-card__rows">
                  <div className="hw-spec-row">
                    <span className="hw-spec-row__key">MATERIAL TYPES</span>
                    <span className="hw-spec-row__val">Glass · plastic · paper · metal</span>
                  </div>
                  <div className="hw-spec-row">
                    <span className="hw-spec-row__key">REUSABLE BOTTLE BIN</span>
                    <span className="hw-spec-row__val">450–500 bottles</span>
                  </div>
                  <div className="hw-spec-row">
                    <span className="hw-spec-row__key">RECYCLING CAPACITY</span>
                    <span className="hw-spec-row__val">Up to 250 kg / cycle</span>
                  </div>
                  <div className="hw-spec-row">
                    <span className="hw-spec-row__key">VISION SYSTEM</span>
                    <span className="hw-spec-row__val">Multi-spectral camera + on-edge AI</span>
                  </div>
                  <div className="hw-spec-row">
                    <span className="hw-spec-row__key">STATUS</span>
                    <span className="hw-spec-row__val">Late-stage R&amp;D → production</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI SORTING MODULE ── */}
      <section className="hw-product-section hw-product-section--light">
        <div className="container">
          <span className="hw-chapter-tag hw-chapter-tag--dark">HARDWARE 02</span>
          <h2 className="hw-product__title hw-product__title--dark">
            AI Sorting Module —{' '}
            <span className="hw-product__title-lime">first commercial-grade deployment, glass.</span>
          </h2>
          <p className="hw-product__body hw-product__body--dark">
            Vision-based, non-destructive sortation. The first physical instantiation of our
            portable AI vision module.
          </p>
          <div className="hw-sorter__inner">
            <div className="hw-sorter__img-placeholder">
              <span>AI Sorting Module</span>
              <p>Product image coming soon</p>
            </div>
            <div className="hw-sorter__metrics">
              <div className="hw-metric-card">
                <p className="hw-metric-card__label">Colour Detection Accuracy</p>
                <div className="hw-metric-card__bar"><div className="hw-metric-card__fill" style={{ width: '98%' }} /></div>
                <p className="hw-metric-card__num">98%</p>
                <p className="hw-metric-card__desc">Separates flint, amber, green, and mixed glass with near-perfect precision</p>
              </div>
              <div className="hw-metric-card">
                <p className="hw-metric-card__label">Brand Detection Accuracy</p>
                <div className="hw-metric-card__bar"><div className="hw-metric-card__fill" style={{ width: '95%' }} /></div>
                <p className="hw-metric-card__num">95%</p>
                <p className="hw-metric-card__desc">Identifies brand by label, bottle shape &amp; embossing — currently fine tuning model</p>
              </div>
              <div className="hw-metric-card">
                <p className="hw-metric-card__label">Bottles Sorted Per Hour</p>
                <div className="hw-metric-card__bar"><div className="hw-metric-card__fill" style={{ width: '80%' }} /></div>
                <p className="hw-metric-card__num">1200</p>
                <p className="hw-metric-card__desc">Industrial throughput with &lt;300ms response time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI INSPECTION BOX ── */}
      <section className="hw-product-section hw-product-section--dark">
        <div className="container">
          <span className="hw-chapter-tag">HARDWARE 03</span>
          <div className="hw-product__inner">
            <div className="hw-product__copy">
              <h2 className="hw-product__title">
                AI Inspection Box.{' '}
                <span className="hw-product__title-lime">Portable vision intelligence, anywhere.</span>
              </h2>
              <p className="hw-product__subtitle">Drop-in inspection for any conveyor line.</p>
              <p className="hw-product__body">
                A compact, self-contained AI vision unit that mounts above any existing conveyor.
                Real-time material classification with no line stoppage, no retooling.
              </p>
              <div className="hw-inspection__features">
                <div className="hw-inspection__feat">
                  <span className="hw-inspection__feat-dot" />
                  <div>
                    <p className="hw-inspection__feat-title">Plug-and-inspect</p>
                    <p className="hw-inspection__feat-body">Installs in under 30 minutes on any line</p>
                  </div>
                </div>
                <div className="hw-inspection__feat">
                  <span className="hw-inspection__feat-dot" />
                  <div>
                    <p className="hw-inspection__feat-title">Edge inference</p>
                    <p className="hw-inspection__feat-body">On-device AI — no cloud latency, works offline</p>
                  </div>
                </div>
                <div className="hw-inspection__feat">
                  <span className="hw-inspection__feat-dot" />
                  <div>
                    <p className="hw-inspection__feat-title">Multi-material ready</p>
                    <p className="hw-inspection__feat-body">Glass, plastic, metal, paper — one model</p>
                  </div>
                </div>
                <div className="hw-inspection__feat">
                  <span className="hw-inspection__feat-dot" />
                  <div>
                    <p className="hw-inspection__feat-title">Trace OS connected</p>
                    <p className="hw-inspection__feat-body">Live dashboard, alerts, and audit trail</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hw-product__visual">
              <div className="hw-product__img-placeholder">
                <span>AI Inspection Box</span>
                <p>Product image coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MATERIALS MARQUEE ── */}
      <div className="hw-marquee-strip">
        <div className="hw-marquee-track">
          {['Glass', 'Plastic', 'Metal', 'Paper', 'Ceramics', 'E-waste', 'Textiles', 'Solar Panels', 'Composites', 'Batteries',
            'Glass', 'Plastic', 'Metal', 'Paper', 'Ceramics', 'E-waste', 'Textiles', 'Solar Panels', 'Composites', 'Batteries'].map((m, i) => (
            <span key={i} className="hw-marquee-item">
              {m} <span className="hw-marquee-dot" aria-hidden="true">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── WHAT RENEONIX ENABLES ── */}
      <section className="hw2-section" id="hw2-enables">
        <div className="container">
          <div className="section-head hw2-reveal">
            <h2>What Reneonix <em>enables</em></h2>
            <p>
              Our integrated hardware and intelligence platform helps facilities sort smarter,
              recover more, and operate with complete traceability.
            </p>
          </div>

          <div
            className="hw2-carousel hw2-carousel--dark hw2-reveal"
            onMouseEnter={() => { isPaused.current = true; }}
            onMouseLeave={() => { isPaused.current = false; }}
          >
            <div className="hw2-carousel__stage">
              {ENABLES.map(({ Icon, title, body }, i) => (
                <div
                  key={title}
                  ref={el => { cardRefs.current[i] = el; }}
                  className="hw2-carousel__card"
                  onClick={() => {
                    const off = circOffsetFloat(i, posRef.current, ENABLES.length);
                    if (Math.abs(off) >= 0.5) {
                      posRef.current = i;
                      applyCarousel();
                    }
                  }}
                >
                  <span className="hw2-feat-card__icon"><Icon size={28} /></span>
                  <h3 className="hw2-feat-card__title">{title}</h3>
                  <p className="hw2-feat-card__body">{body}</p>
                </div>
              ))}
            </div>

            <button
              className="hw2-carousel__btn hw2-carousel__btn--prev"
              onClick={goPrev}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="hw2-carousel__btn hw2-carousel__btn--next"
              onClick={goNext}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>

            <div className="hw2-carousel__dots" role="tablist">
              {ENABLES.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === dotIdx}
                  className={`hw2-carousel__dot${i === dotIdx ? ' hw2-carousel__dot--active' : ''}`}
                  onClick={() => { posRef.current = i; applyCarousel(); }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}
