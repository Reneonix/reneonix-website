import { useEffect, useRef } from 'react';
import {
  Brain, FlaskConical, ClipboardList, Settings, RefreshCw,
  Recycle, Wine, Layers, Monitor, Package, Shuffle,
  Truck, GitBranch, ClipboardCheck,
  LayoutGrid, Gauge, Building2, Shield, TrendingUp,
  Eye, Crosshair, SlidersHorizontal, BarChart2, Leaf,
  ArrowRight, ChevronRight,
} from 'lucide-react';
import './HardwareSystems.css';

const ENABLES = [
  { Icon: Brain,        title: 'AI-powered material intelligence.',  body: 'Detect, identify, and classify materials with high accuracy.' },
  { Icon: FlaskConical, title: 'Multi-material recovery systems.',    body: 'Hardware built to handle a wide range of material streams.' },
  { Icon: ClipboardList,title: 'Traceability infrastructure.',        body: 'Track material flow, quality, and recovery with end-to-end visibility.' },
  { Icon: Settings,     title: 'Scalable industrial hardware.',       body: 'Engineered for real-world throughput and continuous operation.' },
  { Icon: RefreshCw,    title: 'Circular recovery workflows.',        body: 'Enable closed-loop, efficient, and sustainable operations.' },
];

const MATERIALS = [
  { Icon: Recycle,  label: 'Plastics',               body: 'Rigid, films, bottles, containers and more.' },
  { Icon: Wine,     label: 'Glass',                  body: 'Bottles, jars, sheets, and mixed glass streams.' },
  { Icon: Layers,   label: 'Metals',                 body: 'Ferrous, non-ferrous, aluminium and alloys.' },
  { Icon: Monitor,  label: 'E-waste',                body: 'Electronics, devices, components and assemblies.' },
  { Icon: Package,  label: 'Paper & Packaging',      body: 'Paper, cardboard, cartons and packaging waste.' },
  { Icon: Shuffle,  label: 'Mixed Recovery Streams', body: 'Complex mixed waste and multi-material inflows.' },
];

const WORKFLOW = [
  { n: 1, Icon: Truck,          label: 'Material intake',             body: 'Materials enter the system from diverse sources.' },
  { n: 2, Icon: Brain,          label: 'AI detection & identification',body: 'Advanced models identify and classify materials in real time.' },
  { n: 3, Icon: GitBranch,      label: 'Sorting & routing',           body: 'Intelligent sorting directs materials to the right output.' },
  { n: 4, Icon: Recycle,        label: 'Recovery & processing',       body: 'Materials are recovered, processed, and prepared for reuse.' },
  { n: 5, Icon: ClipboardCheck, label: 'Traceable output',            body: 'Every output is tracked with full traceability and reporting.' },
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

export default function HardwareSystems() {
  const heroImgRef = useRef(null);

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
                Built for multi-material circular recovery.
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
              <img
                src="/hardware-hero.png"
                alt="Reneonix hardware systems"
                className="hw2-hero__img"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT RENEONIX ENABLES ── */}
      <section className="hw2-section" id="hw2-enables">
        <div className="container">
          <div className="section-head hw2-reveal">
            <h2>What Reneonix enables</h2>
            <p>
              Our integrated hardware and intelligence platform helps facilities sort smarter,
              recover more, and operate with complete traceability.
            </p>
          </div>
          <div className="hw2-enables-grid hw2-reveal">
            {ENABLES.map(({ Icon, title, body }) => (
              <div className="hw2-feat-card" key={title}>
                <span className="hw2-feat-card__icon"><Icon size={28} /></span>
                <h3 className="hw2-feat-card__title">{title}</h3>
                <p className="hw2-feat-card__body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MATERIAL STREAMS ── */}
      <section className="hw2-section hw2-section--alt">
        <div className="container">
          <div className="section-head hw2-reveal">
            <h2>Designed for diverse material streams</h2>
            <p>
              Reneonix hardware is built to process different material categories through a
              unified recovery framework, allowing facilities to sort, route, and recover
              materials with flexibility and traceability.
            </p>
          </div>
          <div className="hw2-materials-grid hw2-reveal">
            {MATERIALS.map(({ Icon, label, body }) => (
              <div className="hw2-material-card" key={label}>
                <span className="hw2-material-card__icon"><Icon size={32} /></span>
                <h3 className="hw2-material-card__label">{label}</h3>
                <p className="hw2-material-card__body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ── */}
      <section className="hw2-section" id="hw2-workflow">
        <div className="container">
          <div className="section-head hw2-reveal">
            <h2>From intake to recovery</h2>
            <p>A unified workflow that brings intelligence, hardware, and traceability together.</p>
          </div>
          <div className="hw2-workflow hw2-reveal">
            {WORKFLOW.map(({ n, Icon, label, body }, i) => (
              <div className="hw2-workflow__item" key={label}>
                <div className="hw2-workflow__top">
                  <span className="hw2-workflow__num">{n}</span>
                  {i < WORKFLOW.length - 1 && (
                    <span className="hw2-workflow__dash" aria-hidden="true" />
                  )}
                </div>
                <span className="hw2-workflow__icon"><Icon size={28} /></span>
                <strong className="hw2-workflow__label">{label}</strong>
                <p className="hw2-workflow__body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIAL INFRASTRUCTURE ── */}
      <section className="hw2-section hw2-section--alt">
        <div className="container">
          <div className="section-head hw2-reveal">
            <h2>Built as industrial infrastructure</h2>
            <p>
              Reneonix systems are engineered for reliability, scale, and long-term
              operational performance.
            </p>
          </div>
          <div className="hw2-infra-grid hw2-reveal">
            {INFRA.map(({ Icon, title, body }) => (
              <div className="hw2-infra-card" key={title}>
                <span className="hw2-infra-card__icon"><Icon size={28} /></span>
                <h3 className="hw2-infra-card__title">{title}</h3>
                <p className="hw2-infra-card__body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT BANNER ── */}
      <section className="hw2-impact">
        <div className="container">
          <div className="hw2-impact__inner hw2-reveal">
            <div className="hw2-impact__copy">
              <h2 className="hw2-impact__title">
                Driving impact across all material streams
              </h2>
              <p className="hw2-impact__lead">
                Our infrastructure helps facilities recover more, operate smarter,
                and build a more circular future.
              </p>
            </div>
            <div className="hw2-impact__metrics">
              {IMPACT_METRICS.map(({ Icon, title, body }) => (
                <div className="hw2-impact__metric" key={title}>
                  <span className="hw2-impact__metric-icon"><Icon size={24} /></span>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
