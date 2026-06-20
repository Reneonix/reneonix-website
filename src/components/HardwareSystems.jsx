import { useEffect } from 'react';
import { Cpu, Zap, Shield, ChevronRight, Eye, Recycle, ClipboardList, CheckCircle2, Milk, ShoppingBag, Target, Gauge, Layers, ScanLine, Wind, TrendingUp, Leaf, Settings } from 'lucide-react';
import './HardwareSystems.css';

export default function HardwareSystems() {

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

      {/* ── MRM ── */}
      <section className="hw-mrm-section" id="hw-mrm">
        <div className="container hw-mrm__container">

          {/* ── Top: two-column (annotations + image | content) ── */}
          <div className="hw-mrm__main">

            {/* LEFT — machine image */}
            <div className="hw-mrm__visual">
              <img src="/hardware-MRM.jpeg" alt="MRM AI Material Recovery Machine" className="hw-mrm__img" loading="lazy" decoding="async" />
            </div>

            {/* RIGHT — eyebrow, title, subtitle, body, capability tiles */}
            <div className="hw-mrm__content">
              <h2 className="hw-mrm__title">MRM (AI) <em>Material</em><br />Recovery Machine</h2>
              <p className="hw-mrm__subtitle">Modular Front-End Recovery System</p>
              <p className="hw-mrm__body">
                MRM (AI) is a modular front-end recovery system that accepts post-consumer
                materials at the source. It uses advanced computer vision and sensors to identify,
                grade, and separate materials in real time – maximising reuse and ensuring
                high-purity recycling.
              </p>
              <p className="hw-mrm__caps-label">What the Machine Does</p>
              <div className="hw-mrm__caps-grid">
                {[
                  { Icon: Eye,           title: 'Identify',  desc: 'Real-time material recognition using AI vision.' },
                  { Icon: Recycle,       title: 'Classify',  desc: 'Determines material quality and recovery path.' },
                  { Icon: ShoppingBag,   title: 'Separate',  desc: 'Routes materials into optimized output streams.' },
                  { Icon: ClipboardList, title: 'Track',     desc: 'Logs every deposit and material movement digitally.' },
                ].map(({ Icon, title, desc }) => (
                  <div className="hw-mrm__cap-tile" key={title}>
                    <div className="hw-mrm__cap-tile-icon"><Icon size={20} /></div>
                    <p className="hw-mrm__cap-tile-title">{title}</p>
                    <p className="hw-mrm__cap-tile-desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── System Performance ── */}
          <div className="hw-mrm__perf-section">
            <div className="hw-mrm__perf-badge">System Performance</div>
            <div className="hw-mrm__perf-box">
              {[
                { Icon: Milk,   value: '450–500+',        label: 'Bottle Capacity',     sub: 'Per Hour' },
                { Icon: Gauge,  value: '250 KG',          label: 'Processing Capacity', sub: 'Per Cycle' },
                { Icon: Cpu,    value: 'HD + Edge AI',    label: 'Vision System',       sub: 'High-Precision Detection' },
                { Icon: Layers, value: 'Glass · PET · Cans', label: 'Supported Materials', sub: 'Multiple Material Types' },
              ].map(({ Icon, value, label, sub }) => (
                <div className="hw-mrm__perf-stat" key={label}>
                  <div className="hw-mrm__perf-stat-icon"><Icon size={22} /></div>
                  <div>
                    <p className="hw-mrm__perf-stat-value">{value}</p>
                    <p className="hw-mrm__perf-stat-label">{label}</p>
                    <p className="hw-mrm__perf-stat-sub">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── VISIONBOX — AI Inspection ── */}
      <section className="hw-vb-section">
        {/* Full-width background image */}
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
        {/* Overlay — dark gradient left for text readability */}
        <div className="hw-vb__overlay" aria-hidden="true" />
        {/* Content — left-aligned over the image */}
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

      {/* ── AI SORTING MODULE ── */}
      <section className="hw-sorter-section" id="hw-sorter">
        <div className="container hw-sorter__container">

          {/* ── Top: two-column (image + stats | content) ── */}
          <div className="hw-sorter__main">

            {/* LEFT — clean machine image */}
            <div className="hw-sorter__visual">
              <img src="/hardware-Sorter.png" alt="AI Sorting Module" className="hw-sorter__img" loading="lazy" decoding="async" />
            </div>

            {/* RIGHT — eyebrow, heading, body, metrics */}
            <div className="hw-sorter__content">
              <h2 className="hw-sorter__title">
                First Commercial-Grade<br /><em>Glass</em> Sorting System
              </h2>
              <p className="hw-sorter__body">
                Vision-based, non-destructive sorting with real-time classification
                and brand recognition – built for industrial environments.
              </p>
              <div className="hw-sorter__metrics">
                {[
                  { Icon: Target, value: '98%',   label: 'Colour Detection',  desc: 'Separates flint, amber, green, and mixed glass with near-perfect precision.' },
                  { Icon: Milk, value: '95%', label: 'Brand Recognition', desc: 'Identifies brand by label, bottle shape & embossing.' },
                  { Icon: Gauge,  value: '1200+', label: 'Bottles / Hour',    desc: 'Industrial throughput with <300ms response time.' },
                ].map(({ Icon, value, label, desc }) => (
                  <div className="hw-sorter__metric-card" key={label}>
                    <div className="hw-sorter__metric-icon"><Icon size={18} /></div>
                    <p className="hw-sorter__metric-value">{value}</p>
                    <p className="hw-sorter__metric-label">{label}</p>
                    <p className="hw-sorter__metric-desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Capabilities ── */}
          <div className="hw-sorter__caps-section">
            <div className="hw-sorter__caps-divider">
              <span className="hw-sorter__caps-divider-line" />
              <span className="hw-sorter__caps-divider-text">
                • Powered by <em>Advanced Vision AI</em> •
              </span>
              <span className="hw-sorter__caps-divider-line" />
            </div>
            <div className="hw-sorter__caps">
              {[
                { Icon: Eye,      label: 'Vision-Based AI'          },
                { Icon: Layers,   label: 'Colour Recognition'       },
                { Icon: ScanLine, label: 'Brand Identification'     },
                { Icon: Zap,      label: 'Real-Time Classification' },
                { Icon: Wind,     label: 'High-Speed Sorting'       },
                { Icon: Shield,   label: 'Industrial Grade'         },
              ].map(({ Icon, label }) => (
                <div className="hw-sorter__cap" key={label}>
                  <div className="hw-sorter__cap-icon"><Icon size={18} /></div>
                  <p className="hw-sorter__cap-label">{label}</p>
                  <span className="hw-sorter__cap-accent" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
