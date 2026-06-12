import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Database, Shield, FileText,
  Eye, ShieldAlert,
  Cpu, ShieldCheck,
  BarChart3, Network, Leaf, ArrowRight, ChevronRight,
  CheckCircle2, FileCheck,
  Smartphone, Tag, MapPin, User, Scale,
  ScanLine, AlertTriangle, ImageIcon, ClipboardCheck,
  Box, Clock, Link2, GitBranch,
  TrendingUp, LineChart, Target, Lightbulb,
  Share2, BookOpen, Settings,
  Archive, Zap, Battery,
} from 'lucide-react';

import './SoftwarePage.css';
import './SoftwarePage_how.css';
import './SoftwarePage_viz.css';

const STEP_VISUALS = [VizCapture, VizVerify, VizTrace, VizAnalyze, VizReport];

const MATERIAL_TYPES = [
  { name: 'Plastic Bottle', Icon: Box,     color: '#22c55e' },
  { name: 'Aluminium Can',  Icon: Archive, color: '#94a3b8' },
  { name: 'Copper Wire',    Icon: Zap,     color: '#f59e0b' },
  { name: 'E-waste PCB',    Icon: Cpu,     color: '#60a5fa' },
  { name: 'Battery Cell',   Icon: Battery, color: '#a78bfa' },
];

const STORY_STEPS = [
  {
    num: '01', key: 'capture', label: 'Capture', icon: Smartphone,
    body: 'Collect recovery data at the source using mobile and IoT-enabled tools.',
    features: ['Source details', 'Material type', 'Location', 'Collector info'],
    outLabel: 'Data Captured',
    outBody: 'Real-time data captured and synced to the platform. Audit trail begins.',
  },
  {
    num: '02', key: 'verify', label: 'Verify', icon: ShieldCheck,
    body: 'AI-powered verification ensures the material is authentic, accurate, and audit-ready.',
    features: ['AI validation', 'Anomaly detection', 'Image recognition', 'Quality checks'],
    outLabel: 'Verified & Trusted',
    outBody: 'Only verified data moves forward. Built for trust and compliance.',
  },
  {
    num: '03', key: 'trace', label: 'Trace', icon: Link2,
    body: 'Every movement recorded on blockchain, creating an immutable and transparent trail.',
    features: ['Immutable ledger', 'End-to-end traceability', 'Time & location stamps', 'Chain of custody'],
    outLabel: 'Fully Traceable',
    outBody: 'Each movement recorded on blockchain. Tamper-proof and transparent.',
  },
  {
    num: '04', key: 'analyze', label: 'Analyze', icon: BarChart3,
    body: 'Real-time analytics turn recovery data into actionable insights and performance metrics.',
    features: ['Recovery metrics', 'Quality insights', 'Environmental impact', 'Performance trends'],
    outLabel: 'Actionable Insights',
    outBody: 'Insights generated. Performance and impact measured.',
  },
  {
    num: '05', key: 'report', label: 'Report', icon: FileText,
    body: 'Generate audit-ready reports and digital passports for complete compliance.',
    features: ['Compliance reports', 'Digital passports', 'Stakeholder sharing', 'Regulatory ready'],
    outLabel: 'Audit Ready',
    outBody: 'Audit-ready report generated. Compliance achieved.',
  },
];

const TOP_CAPS = [
  {
    num: '01', title: 'AI-Powered Verification',
    body: 'Our AI validates recovery data, detects anomalies, and ensures only verifiable, audit-ready information enters your compliance workflow.',
    checks: ['Automated Validation', 'Anomaly Detection', 'Risk Scoring'],
    Illus: IllusAI,
  },
  {
    num: '02', title: 'Blockchain Traceability',
    body: 'Every transaction is recorded on an immutable ledger, ensuring transparency and trust across the entire value chain.',
    checks: ['Tamper-proof Records', 'Transparent', 'Traceable'],
    Illus: IllusBlockchain,
  },
  {
    num: '03', title: 'Digital Product Passport',
    body: 'Create a digital passport with full lifecycle history, specs, and compliance data for every recovered material.',
    checks: ['Identifiable', 'Shareable', 'Verifiable'],
    Illus: IllusPassport,
  },
  {
    num: '04', title: 'Compliance Automation',
    body: 'Streamline regulatory reporting, generate audit-ready documents, and stay compliant with evolving regulations — always.',
    checks: ['Regulation-ready', 'Automated', 'Reliable'],
    Illus: IllusCompliance,
  },
];

const BOT_CAPS = [
  { num: '05', title: 'EPR Compliance & Reporting', Icon: FileCheck,
    body: 'Simplify EPR obligations with automated data capture, reporting, and documentation.' },
  { num: '06', title: 'Real-time Analytics', Icon: BarChart3,
    body: 'Live dashboards and alerts help you act fast and stay ahead of issues.' },
  { num: '07', title: 'Material Intelligence', Icon: Network,
    body: 'Turn recovery data into actionable insights to optimize operations and maximize value.' },
  { num: '08', title: 'Carbon Impact Tracking', Icon: Leaf,
    body: 'Measure, monitor, and report environmental impact with confidence.' },
];

export default function SoftwarePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeMatType, setActiveMatType] = useState(null);
  const [pinState, setPinState] = useState('before'); // 'before' | 'pinned' | 'after'
  const pinRef = useRef('before');
  const wrapRef = useRef(null);
  const mobileCardRefs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('sw-in'); io.unobserve(e.target); }
      }),
      { threshold: 0.05 }
    );
    document.querySelectorAll('.sw-reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* JS pin + step detection — position:fixed bypasses overflow-x:hidden sticky issues */
  useEffect(() => {
    const handleScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const total = wrapRef.current.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      let next;
      if (rect.top > 0) {
        next = 'before';
      } else if (rect.bottom <= window.innerHeight) {
        next = 'after';
        setActiveStep(STORY_STEPS.length - 1);
      } else {
        next = 'pinned';
        const progress = Math.max(0, Math.min(1, -rect.top / total));
        const step = Math.min(STORY_STEPS.length - 1, Math.floor(progress * (STORY_STEPS.length - 0.8)));
        setActiveStep(step);
      }
      if (pinRef.current !== next) {
        pinRef.current = next;
        setPinState(next);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const goToStep = useCallback(i => {
    const step = Math.max(0, Math.min(STORY_STEPS.length - 1, i));
    if (!wrapRef.current) return;
    const total = wrapRef.current.offsetHeight - window.innerHeight;
    const y =
      wrapRef.current.getBoundingClientRect().top +
      window.scrollY +
      (step / (STORY_STEPS.length - 0.8)) * total + 4;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  return (
    <div className="sw-page">

      {/* ══ HERO ══ */}
      <section className="sw-hero">
        {/* cross flare — dark left */}
        <div className="sw-hero__cross" aria-hidden="true" />
        {/* green glow — upper-right */}
        <div className="sw-hero__glow" aria-hidden="true" />

        <div className="container sw-hero__inner">

          <div className="sw-hero__copy sw-reveal">
            <nav className="sw-crumb" aria-label="Breadcrumb">
              <a href="#home">Home</a>
              <ChevronRight size={13} aria-hidden="true" />
              <a href="#solutions">Solutions</a>
              <ChevronRight size={13} aria-hidden="true" />
              <span className="sw-crumb__current">Software</span>
            </nav>
            <h1 className="sw-hero__title">
              Material<br />
              Traceability,<br />
              Verified Recovery,<br />
              <span className="sw-hero__accent">Proven Compliance</span>
            </h1>
            <p className="sw-hero__body">
              Our AI + blockchain platform turns waste recovery data into auditable,
              compliance-ready material intelligence in real time.
            </p>
          </div>

        </div>
      </section>

      {/* ══ CORE CAPABILITIES ══ */}
      <section className="sw-caps">
        <div className="sw-caps__glow sw-caps__glow--tl" aria-hidden="true" />
        <div className="sw-caps__glow sw-caps__glow--br" aria-hidden="true" />
        <div className="container">

          {/* header */}
          <div className="sw-caps__header sw-reveal">
            <span className="sw-caps__eyebrow">Core Capabilities</span>
            <h2 className="sw-caps__title">
              Powerful Capabilities, <span className="sw-caps__green">Proven Impact</span>
            </h2>
            <p className="sw-caps__body">
              Retriaz combines AI, blockchain, and automation to deliver verified recovery
              intelligence and simplify compliance across the value chain.
            </p>
          </div>

          {/* top row: 4 large cards */}
          <div className="sw-caps-top sw-reveal">
            {TOP_CAPS.map(({ num, title, body, checks, Illus }) => (
              <div key={num} className="sw-cap-card">
                <span className="sw-cap__num">{num}</span>
                <div className="sw-cap-card__illus"><Illus /></div>
                <h3 className="sw-cap-card__title">
                  {title}
                  <span className="sw-cap-card__rule" />
                </h3>
                <p className="sw-cap-card__body">{body}</p>
                <ul className="sw-cap-card__checks">
                  {checks.map(c => (
                    <li key={c}><CheckCircle2 size={14} />{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* bottom row: 4 smaller cards */}
          <div className="sw-caps-bot sw-reveal">
            {BOT_CAPS.map(({ num, title, body, Icon }) => (
              <div key={num} className="sw-cap-sm">
                <div className="sw-cap-sm__head">
                  <div className="sw-cap-sm__icon"><Icon size={20} /></div>
                  <div>
                    <span className="sw-cap__num">{num}</span>
                    <h4 className="sw-cap-sm__title">{title}</h4>
                  </div>
                </div>
                <p className="sw-cap-sm__body">{body}</p>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* ══ HOW RETRIAZ WORKS ══ */}
      <section className="sw-story">

        {/* Header */}
        <div className="sw-story__head">
          <div className="container">
            <span className="sw-story__eyebrow">How Retriaz Works</span>
            <h2 className="sw-story__title">
              One Material,&nbsp;<span className="sw-story__accent">Fully Verified</span>
            </h2>
            <p className="sw-story__sub">
              Retriaz brings transparency, intelligence, and trust to every step of your recovery journey.
            </p>
          </div>
        </div>

        {/* Desktop scroll body */}
        <div className="sw-story__scroll-wrap" ref={wrapRef}>
          <div className={`sw-story__sticky-outer${pinState === 'pinned' ? ' is-pinned' : pinState === 'after' ? ' is-after' : ''}`}>
            <div className="sw-story__sticky-inner container">

              {/* Left: step nav */}
              <nav className="sw-story__sidenav" aria-label="Workflow steps">
                {STORY_STEPS.map((step, i) => (
                  <button
                    key={step.key}
                    className={`sw-snav__item${i === activeStep ? ' is-active' : ''}${i < activeStep ? ' is-done' : ''}`}
                    onClick={() => {
                      if (!wrapRef.current) return;
                      const total = wrapRef.current.offsetHeight - window.innerHeight;
                      const y = wrapRef.current.getBoundingClientRect().top + window.scrollY
                                + (i / (STORY_STEPS.length - 0.8)) * total + 4;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }}
                  >
                    <div className="sw-snav__track-col">
                      <div className="sw-snav__dot-wrap">
                        <div className="sw-snav__dot" />
                      </div>
                      {i < STORY_STEPS.length - 1 && <div className="sw-snav__line" />}
                    </div>
                    <div className="sw-snav__text">
                      <span className="sw-snav__num">{step.num}</span>
                      <span className="sw-snav__label">{step.label}</span>
                      <p className="sw-snav__body">{step.body}</p>
                      <span className="sw-snav__dash" />
                    </div>
                  </button>
                ))}
              </nav>

              {/* Center: step label → viz → dots */}
              <div className="sw-story__center-col">

                {/* Step label — sits above the visual */}
                <div className="sw-story__step-label">
                  {STORY_STEPS.map((step, i) => (
                    <div
                      key={step.key}
                      className={`sw-slabel${i === activeStep ? ' sw-slabel--active' : ''}`}
                    >
                      <span className="sw-slabel__tag">STEP {step.num}</span>
                      <h3 className="sw-slabel__title">{step.label}</h3>
                      <p className="sw-slabel__body">{step.body}</p>
                      <ul className="sw-slabel__checklist">
                        {step.features.map(f => (
                          <li key={f} className="sw-slabel__check-item">
                            <CheckCircle2 size={14} className="sw-slabel__check-ico" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Main visualization — 5 stacked layers, active one fades in */}
                <div className="sw-story__viz-frame">
                  {STORY_STEPS.map((step, i) => {
                    const Viz = STEP_VISUALS[i];
                    return (
                      <div key={step.key} className={`sw-viz${i === activeStep ? ' sw-viz--active' : ''}`}>
                        <Viz active={i === activeStep} />
                      </div>
                    );
                  })}
                </div>

                {/* Progress dots + prev/next arrows */}
                <div className="sw-story__dots">
                  <button
                    className="sw-dots__arrow"
                    onClick={() => goToStep(activeStep - 1)}
                    disabled={activeStep === 0}
                    aria-label="Previous step"
                  >←</button>
                  {STORY_STEPS.map((step, i) => (
                    <button
                      key={step.key}
                      className={`sw-dots__dot${i === activeStep ? ' is-active' : ''}`}
                      onClick={() => goToStep(i)}
                      aria-label={`Go to step ${step.num}`}
                    />
                  ))}
                  <button
                    className="sw-dots__arrow"
                    onClick={() => goToStep(activeStep + 1)}
                    disabled={activeStep === STORY_STEPS.length - 1}
                    aria-label="Next step"
                  >→</button>
                </div>

              </div>

              {/* Right: single outcome card per active step */}
              <div className="sw-story__outcomes-col">
                {STORY_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  return i === activeStep ? (
                    <div key={i} className="sw-sout__card">
                      <p className="sw-sout__heading">OUTCOME AT THIS STEP</p>
                      <div className="sw-sout__icon-wrap">
                        <Icon size={24} />
                        <div className="sw-sout__check"><CheckCircle2 size={10} /></div>
                      </div>
                      <p className="sw-sout__label">{step.outLabel}</p>
                      <p className="sw-sout__body">{step.outBody}</p>
                      <span className="sw-sout__badge">● Completed</span>
                    </div>
                  ) : null;
                })}
              </div>

            </div>
            {/* Side-edge white fade overlays */}
            <div className="sw-story__fade-overlay" aria-hidden="true" />
          </div>
        </div>

        {/* Mobile layout */}
        <div className="sw-story__mobile">


          {/* One section per step */}
          {STORY_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.key}
                ref={el => { mobileCardRefs.current[i] = el; }}
                className="sw-smob__section"
                data-step={i}
              >
                {/* Step label */}
                <div className="sw-smob__step-label">
                  <span className="sw-smob__step-tag">STEP {step.num}</span>
                  <h3 className="sw-smob__step-title">{step.label}</h3>
                  <p className="sw-smob__step-body">{step.body}</p>
                </div>

                {/* Outcome card */}
                <div className="sw-smob__outcome">
                  <div className="sw-smob__out-icon">
                    <Icon size={20} />
                    <div className="sw-smob__out-check"><CheckCircle2 size={9} /></div>
                  </div>
                  <div className="sw-smob__out-text">
                    <p className="sw-smob__out-label">{step.outLabel}</p>
                    <p className="sw-smob__out-body">{step.outBody}</p>
                    <span className="sw-smob__out-badge">● Completed</span>
                  </div>
                </div>

                {/* Visualization */}
                <div className="sw-smob__viz">
                  <MobileViz step={i} />
                </div>

                {/* Features checklist */}
                <div className="sw-smob__feats">
                  {step.features.map(f => (
                    <div key={f} className="sw-smob__feat-item">
                      <CheckCircle2 size={16} className="sw-smob__feat-ico" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Materials strip ── */}
        <div className="sw-story__mats">
          <div className="container sw-story__mats-inner">
            <p className="sw-mats__heading">Works for all types of materials</p>
            <div className="sw-mats__row">
              {MATERIAL_TYPES.map((mat, i) => (
                <button
                  key={mat.name}
                  className={`sw-mat-item${activeMatType === i ? ' is-active' : ''}`}
                  onClick={() => setActiveMatType(i)}
                >
                  <div className="sw-mat-item__icon" style={{ color: mat.color }}>
                    <mat.Icon size={22} />
                  </div>
                  <span className="sw-mat-item__name">{mat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ══ PLATFORM PREVIEW ══ */}
      <section className="sw-plat">
        <div className="container">

          {/* Divider + label */}
          <div className="sw-plat__divrow sw-reveal">
            <span className="sw-plat__divline" />
            <span className="sw-plat__divcap">Platform Preview</span>
            <span className="sw-plat__divline" />
          </div>

          {/* Heading */}
          <div className="sw-plat__head sw-reveal">
            <h2 className="sw-plat__title">
              Built for <span className="sw-plat__accent">Visibility,</span><br />
              Designed for <span className="sw-plat__accent">Impact</span>
            </h2>
            <p className="sw-plat__sub">
              Retriaz ensures every step of your recovery journey is<br className="sw-plat__br" />
              verified, traceable, and audit-ready.
            </p>
          </div>

          {/* Preview cards */}
          <div className="sw-plat__cards sw-reveal">
            <div className="sw-plat__card">
              <img
                src="/product-passport-sample.jpeg"
                alt="Digital Product Passport Sample"
                className="sw-plat__card-img"
              />
            </div>
            <div className="sw-plat__card">
              <img
                src="/live-dashboard-sample.jpeg"
                alt="Live Dashboard Sample"
                className="sw-plat__card-img"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

/* ─── 5 STEP VISUALS ─── */

function MobileViz({ step }) {
  switch (step) {
    case 0: return <MobCapture />;
    case 1: return <MobVerify />;
    case 2: return <MobTrace />;
    case 3: return <MobAnalyze />;
    case 4: return <MobReport />;
    default: return null;
  }
}

function MobCapture() {
  return (
    <div className="sv-mob">
      <img src="/capture.png" alt="Capture scan" className="sv-mob__img" />
      <div className="sv-mob__card">
        <p className="sv-mob__card-ttl">Source Collection Point #125</p>
        <div className="sv-mob__grid">
          <div className="sv-mob__field">
            <span className="sv-mob__key">Material</span>
            <span className="sv-mob__val sv-mob__val--lime">GLASS<br />(BEER BOTTLE)</span>
          </div>
          <div className="sv-mob__field">
            <span className="sv-mob__key">Weight</span>
            <span className="sv-mob__val">345 g</span>
          </div>
          <div className="sv-mob__field">
            <span className="sv-mob__key">Collected by</span>
            <span className="sv-mob__val">John Doe</span>
          </div>
          <div className="sv-mob__field">
            <span className="sv-mob__key">Time</span>
            <span className="sv-mob__val">May 12, 2024<br />10:30 AM</span>
          </div>
        </div>
        <div className="sv-mob__sync">
          <span className="sv-pulse sv-pulse--sm" />
          Live Sync
        </div>
      </div>
    </div>
  );
}

function MobVerify() {
  return (
    <div className="sv-mob">
      <img src="/verify.png" alt="AI Verification" className="sv-mob__img" />
      <div className="sv-mob__card">
        <div className="sv-mob__card-head">
          <p className="sv-mob__card-ttl">AI Verification</p>
          <CheckCircle2 size={16} color="var(--lime)" />
        </div>
        <div className="sv-mob__score-row">
          <div>
            <span className="sv-mob__key">Trust Score</span>
            <p className="sv-mob__score">98.6%</p>
          </div>
          <span className="sv-mob__stars">★★★★★</span>
        </div>
        {['Material Authentic','Weight Verified','Quality Verified','No Anomalies'].map(item => (
          <div key={item} className="sv-mob__check">
            <CheckCircle2 size={14} color="var(--lime)" />
            <span>{item}</span>
          </div>
        ))}
        <div className="sv-mob__check sv-mob__check--border">
          <CheckCircle2 size={14} color="var(--lime)" />
          <div>
            <span>Verified at</span>
            <span className="sv-mob__ts">May 12, 2024 &nbsp;10:45 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobTrace() {
  return (
    <div className="sv-mob">
      <img src="/trace.png" alt="Blockchain Trace" className="sv-mob__img" />
      <div className="sv-mob__card">
        <div className="sv-mob__card-head">
          <p className="sv-mob__card-ttl">Blockchain Record</p>
          <CheckCircle2 size={16} color="var(--lime)" />
        </div>
        <div className="sv-mob__fields">
          <div className="sv-mob__field sv-mob__field--full">
            <span className="sv-mob__key">Material ID</span>
            <span className="sv-mob__val sv-mob__val--mono">BPL-GLS-2024-000567</span>
          </div>
          <div className="sv-mob__field sv-mob__field--full">
            <span className="sv-mob__key">Current Owner</span>
            <span className="sv-mob__val">GreenLoop Recycling</span>
          </div>
          <div className="sv-mob__field sv-mob__field--full">
            <span className="sv-mob__key">Last Movement</span>
            <span className="sv-mob__val">Collection Point #125</span>
          </div>
          <div className="sv-mob__field sv-mob__field--full">
            <span className="sv-mob__key">Timestamp</span>
            <span className="sv-mob__val">May 12, 2024 &nbsp;11:02 AM</span>
          </div>
        </div>
        <div className="sv-mob__sync">
          <span className="sv-pulse sv-pulse--sm" />
          On-chain verified
        </div>
      </div>
    </div>
  );
}

function MobAnalyze() {
  return (
    <div className="sv-mob">
      <img src="/analyze.png" alt="Analysis" className="sv-mob__img sv-mob__img--analyze" />
      <div className="sv-mob__kpi-grid">
        <div className="sv-mob__kpi">
          <span className="sv-mob__key">Recovery Rate</span>
          <span className="sv-mob__kpi-val">98.6%</span>
          <span className="sv-mob__trend">↑ 12.4%</span>
        </div>
        <div className="sv-mob__kpi">
          <span className="sv-mob__key">CO₂ Impact</span>
          <span className="sv-mob__kpi-val">2.45 MT</span>
          <span className="sv-mob__trend">↑ 15.3%</span>
        </div>
        <div className="sv-mob__kpi">
          <span className="sv-mob__key">Material Purity</span>
          <span className="sv-mob__kpi-val">94%</span>
          <span className="sv-mob__trend">↑ 8.1%</span>
        </div>
        <div className="sv-mob__kpi">
          <span className="sv-mob__key">Volume Recovered</span>
          <span className="sv-mob__kpi-val">1,248.6 kg</span>
        </div>
      </div>
    </div>
  );
}

function MobReport() {
  return (
    <div className="sv-mob sv-mob--report">
      <div className="sv-mob__card">
        <p className="sv-mob__card-ttl">Compliance Report</p>
        <div className="sv-mob__verified">
          <CheckCircle2 size={13} color="var(--lime)" />
          <span>Verified</span>
        </div>
        <div className="sv-mob__grid">
          <div className="sv-mob__field">
            <span className="sv-mob__key">Recovered</span>
            <span className="sv-mob__val">1,248.6 kg</span>
          </div>
          <div className="sv-mob__field">
            <span className="sv-mob__key">CO₂ Impact</span>
            <span className="sv-mob__val">2.45 MT</span>
          </div>
        </div>
        <div className="sv-mob__field sv-mob__field--full">
          <span className="sv-mob__key">Date</span>
          <span className="sv-mob__val">May 12, 2024</span>
        </div>
      </div>
      <div className="sv-mob__card">
        <div className="sv-mob__card-head">
          <p className="sv-mob__card-ttl">Digital Product Passport</p>
          <span className="sv-mob__key sv-mob__ready">Ready to Share</span>
        </div>
        <div className="sv-mob__fields">
          <div className="sv-mob__field sv-mob__field--full">
            <span className="sv-mob__key">Material</span>
            <span className="sv-mob__val">Glass (Beer Bottle)</span>
          </div>
          <div className="sv-mob__field sv-mob__field--full">
            <span className="sv-mob__key">Batch ID</span>
            <span className="sv-mob__val sv-mob__val--mono">BPL-GLS-2024-000567</span>
          </div>
        </div>
        <button className="sv-mob__btn">
          <span className="sv-pulse sv-pulse--sm" />
          View Passport
        </button>
      </div>
    </div>
  );
}

/* ── Step 01: Capture ── */
function VizCapture({ active }) {
  return (
    <div className="sv-inner sv-cap">
      <div className="sv-cap__scene">

        {/* Capture image */}
        <div className="sv-cap__img-wrap">
          <img src="/capture.png" alt="Capture scan" className="sv-cap__phone-img" />
        </div>

        {/* Live data card */}
        <div className="sv-cap__data">
          <div className="sv-cap__data-title">
            Source Collection Point #125
          </div>
          <div className="sv-cap__data-body">
            <div className="sv-cap__data-grid">
              <div className="sv-cap__field">
                <span className="sv-key">Material</span>
                <span className="sv-val sv-val--lime sv-cap__mat-val">GLASS<br />(BEER BOTTLE)</span>
              </div>
              <div className="sv-cap__field">
                <span className="sv-key">Weight</span>
                <span className="sv-val">345 g</span>
              </div>
            </div>
            <div className="sv-cap__field">
              <span className="sv-key">Collected by</span>
              <span className="sv-val">John Doe</span>
            </div>
            <div className="sv-cap__field">
              <span className="sv-key">Time</span>
              <span className="sv-val">May 12, 2024&nbsp;&nbsp;10:30 AM</span>
            </div>
          </div>
          <div className="sv-cap__sync">
            <span className="sv-pulse sv-pulse--sm" />
            Live Sync
          </div>
        </div>
      </div>

    </div>
  );
}

/* ── Step 02: Verify ── */
function VizVerify({ active }) {
  return (
    <div className="sv-inner sv-ver">
      <div className="sv-ver__layout">

        {/* Verify image */}
        <div className="sv-ver__img-wrap">
          <img src="/verify.png" alt="AI Verification" className="sv-ver__img" />
        </div>

        {/* Score + checklist card */}
        <div className="sv-ver__card">
          <div className="sv-ver__card-title">
            <span>AI Verification</span>
            <CheckCircle2 size={16} className="sv-ver__card-check" />
          </div>

          <div className="sv-ver__score-row">
            <p className="sv-ver__score-lbl">Trust Score</p>
            <div className="sv-ver__score-inline">
              <p className="sv-ver__score-val">98.6%</p>
              <div className="sv-ver__stars">★★★★★</div>
            </div>
          </div>

          <div className="sv-ver__checks">
            {['Material Authentic','Weight Verified','Quality Verified','No Anomalies'].map(item => (
              <div key={item} className="sv-ver__check-row">
                <CheckCircle2 size={14} className="sv-ver__tick" />
                <span>{item}</span>
              </div>
            ))}
            <div className="sv-ver__check-row">
              <CheckCircle2 size={14} className="sv-ver__tick" />
              <div className="sv-ver__check-ts">
                <span>Verified at</span>
                <span className="sv-ver__timestamp">May 12, 2024&nbsp;&nbsp;10:45 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ── Step 03: Trace ── */
function VizTrace() {
  return (
    <div className="sv-inner sv-trc">
      <div className="sv-trc__scene">

        {/* Trace image */}
        <img src="/trace.png" alt="Blockchain Trace" className="sv-trc__img" />

        {/* Blockchain record card */}
        <div className="sv-trc__card">
          <div className="sv-trc__card-title">
            <span>Blockchain Record</span>
            <CheckCircle2 size={16} className="sv-trc__card-check" />
          </div>

          <div className="sv-trc__fields">
            <div className="sv-trc__field">
              <span className="sv-key">Material ID</span>
              <span className="sv-val sv-val--mono sv-val--lime">BPL-GLS-2024-000567</span>
            </div>
            <div className="sv-trc__field">
              <span className="sv-key">Current Owner</span>
              <span className="sv-val">GreenLoop Recycling</span>
            </div>
            <div className="sv-trc__field">
              <span className="sv-key">Last Movement</span>
              <span className="sv-val">Collection Point #125</span>
            </div>
            <div className="sv-trc__field">
              <span className="sv-key">Timestamp</span>
              <span className="sv-val">May 12, 2024&nbsp;&nbsp;11:02 AM</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Step 04: Analyze ── */
function VizAnalyze() {
  return (
    <div className="sv-inner sv-ana">
      <div className="sv-ana__layout">

        {/* Left column: Recovery Rate + Material Purity */}
        <div className="sv-ana__side-col">

          <div className="sv-ana__kpi">
            <p className="sv-ana__kpi-lbl">Recovery Rate</p>
            <p className="sv-ana__kpi-val">98.6%</p>
            <span className="sv-ana__trend">↑ 12.4%</span>
            <svg className="sv-ana__spark" viewBox="0 0 80 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sg0" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B2DE3A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#B2DE3A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,24 C12,20 22,22 34,14 C46,7 56,10 70,5 L80,3 L80,28 L0,28 Z" fill="url(#sg0)" />
              <path d="M0,24 C12,20 22,22 34,14 C46,7 56,10 70,5 L80,3" stroke="#B2DE3A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <div className="sv-ana__kpi">
            <p className="sv-ana__kpi-lbl">Material Purity</p>
            <p className="sv-ana__kpi-val">94%</p>
            <span className="sv-ana__trend">↑ 8.1%</span>
            <svg className="sv-ana__spark" viewBox="0 0 80 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B2DE3A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#B2DE3A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,22 C14,18 24,20 36,14 C50,8 60,11 72,6 L80,4 L80,28 L0,28 Z" fill="url(#sg1)" />
              <path d="M0,22 C14,18 24,20 36,14 C50,8 60,11 72,6 L80,4" stroke="#B2DE3A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
          </div>

        </div>

        {/* Center: bottle on orbital scanning ring */}
        <div className="sv-ana__center-col">
          <div className="sv-ana__orbit">
            <div className="sv-ana__img-wrap">
              <img src="/analyze.png" alt="Material under analysis" className="sv-ana__center-img" />
            </div>
            <div className="sv-ana__platform">
              <div className="sv-ana__platform-inner" />
              <div className="sv-ana__ring-badge">
                <CheckCircle2 size={9} />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: CO₂ Impact + Volume Recovered */}
        <div className="sv-ana__side-col">

          <div className="sv-ana__kpi">
            <p className="sv-ana__kpi-lbl">CO₂ Impact</p>
            <p className="sv-ana__kpi-val">2.45 MT</p>
            <span className="sv-ana__trend">↑ 15.3%</span>
            <svg className="sv-ana__spark" viewBox="0 0 80 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B2DE3A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#B2DE3A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,26 C10,24 22,25 34,19 C48,13 60,15 72,9 L80,7 L80,28 L0,28 Z" fill="url(#sg2)" />
              <path d="M0,26 C10,24 22,25 34,19 C48,13 60,15 72,9 L80,7" stroke="#B2DE3A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <div className="sv-ana__kpi">
            <p className="sv-ana__kpi-lbl">Volume Recovered</p>
            <p className="sv-ana__kpi-val">1,248.6 kg</p>
            <div className="sv-ana__bars">
              {[28,38,32,50,44,66,58,80].map((h, i) => (
                <div key={i} className="sv-ana__mini-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

/* ── Step 05: Report ── */
function VizReport() {
  return (
    <div className="sv-inner sv-rep">

      {/* Far-left: full-height bottle */}
      <img src="/glassbottle.png" alt="Glass bottle" className="sv-rep__bottle" />

      {/* Card 1: Compliance Report */}
      <div className="sv-rep__card">
        <p className="sv-rep__card-ttl">Compliance Report</p>
        <div className="sv-rep__verified">
          <CheckCircle2 size={13} className="sv-rep__chk" />
          <span>Verified</span>
        </div>
        <div className="sv-rep__stats">
          <div className="sv-rep__stat">
            <span className="sv-key">Recovered</span>
            <span className="sv-val">1,248.6 kg</span>
          </div>
          <div className="sv-rep__stat">
            <span className="sv-key">CO₂ Impact</span>
            <span className="sv-val">2.45 MT</span>
          </div>
        </div>
        <div className="sv-rep__date">
          <span className="sv-key">Date</span>
          <span className="sv-val">May 12, 2024</span>
        </div>
      </div>

      {/* Card 2: Digital Product Passport */}
      <div className="sv-rep__card sv-rep__passport">
        <div className="sv-rep__pass-top">
          <p className="sv-rep__card-ttl">Digital Product Passport</p>
          <div className="sv-rep__pdf">
            <img src="/pdf-icon.png" alt="PDF" className="sv-rep__pdf-ico" />
            <span className="sv-key">Ready to Share</span>
          </div>
        </div>
        <div className="sv-rep__pass-body">
          <img src="/glassbottle.png" alt="Material" className="sv-rep__pass-img" />
          <div className="sv-rep__pass-fields">
            <div className="sv-rep__pass-field">
              <span className="sv-key">Material</span>
              <span className="sv-val">Glass (Beer Bottle)</span>
            </div>
            <div className="sv-rep__pass-field">
              <span className="sv-key">Batch ID</span>
              <span className="sv-val sv-val--mono sv-val--lime">BPL-GLS-2024-000567</span>
            </div>
            <button className="sv-rep__pass-btn">
              <span className="sv-pulse sv-pulse--sm" />
              View Passport
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─── BOTTLE CANVAS (kept for CSS compatibility, no longer rendered) ─── */

function BottleCanvas({ step }) {
  return (
    <div className="bc" data-step={step}>

      {/* Ambient glow */}
      <div className="bc__ambient" />

      {/* Persistent bottle — always visible */}
      <div className="bc__bottle-wrap">
        <svg viewBox="0 0 90 200" className="bc__svg" aria-hidden="true">
          {/* Cap */}
          <rect x="33" y="5" width="24" height="13" rx="4" className="bc__cap" />
          {/* Neck */}
          <rect x="32" y="18" width="26" height="20" rx="3" className="bc__neck" />
          {/* Body outline */}
          <path d="M32,36 Q20,48 18,68 L18,158 Q18,178 45,178 Q72,178 72,158 L72,68 Q70,48 58,36 Z"
            className="bc__body" />
          {/* Body tinted fill */}
          <path d="M32,36 Q20,48 18,68 L18,158 Q18,178 45,178 Q72,178 72,158 L72,68 Q70,48 58,36 Z"
            className="bc__body-fill" />
          {/* Label panel */}
          <rect x="22" y="76" width="46" height="62" rx="4" className="bc__lbl" />
          <rect x="28" y="84" width="34" height="2.5" rx="1.25" className="bc__lline" />
          <rect x="28" y="91" width="26" height="2.5" rx="1.25" className="bc__lline" opacity="0.6" />
          <rect x="28" y="98" width="30" height="2.5" rx="1.25" className="bc__lline" opacity="0.4" />
          {/* Recycle badge */}
          <circle cx="45" cy="121" r="9" className="bc__recycle" />
          <text x="45" y="125.5" textAnchor="middle" fontSize="10" className="bc__recycle-icon">♻</text>
          {/* Highlight shine */}
          <path d="M38,26 Q35,52 35,82"
            stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* ══ CAPTURE ══ */}
      <div className={`bc__ov bc__ov--capture${step === 0 ? ' is-on' : ''}`}>
        <span className="bc__sc bc__sc--tl" />
        <span className="bc__sc bc__sc--tr" />
        <span className="bc__sc bc__sc--bl" />
        <span className="bc__sc bc__sc--br" />
        <div className="bc__scanline" />
        <div className="bc__float bc__float--right">
          <div className="bc__float-head">
            <span className="bc__pulse-dot" />
            <span className="bc__live-txt">LIVE CAPTURE</span>
          </div>
          {[['Material','PET Plastic'],['Weight','12.5 kg'],['Location','Coll. Point #125'],['Time','May 12, 2024']].map(([k,v]) => (
            <div key={k} className="bc__fr">
              <span className="bc__fk">{k}</span>
              <span className={`bc__fv${k==='Material'?' bc__fv--lime':''}`}>{v}</span>
            </div>
          ))}
        </div>
        <div className="bc__badge bc__badge--capture">
          <Smartphone size={10} /> DATA CAPTURED
        </div>
      </div>

      {/* ══ VERIFY ══ */}
      <div className={`bc__ov bc__ov--verify${step === 1 ? ' is-on' : ''}`}>
        <div className="bc__ring bc__ring--1" />
        <div className="bc__ring bc__ring--2" />
        <div className="bc__ring bc__ring--3" />
        <div className="bc__shield-icon">
          <ShieldCheck size={28} />
        </div>
        <div className="bc__float bc__float--right">
          <div className="bc__float-head">
            <ShieldCheck size={12} />
            <span>AI Verification</span>
            <CheckCircle2 size={11} className="bc__check-ico" />
          </div>
          <div className="bc__score-row">
            <span className="bc__score-lbl">Trust Score</span>
            <span className="bc__score-num">98.6%</span>
          </div>
          <div className="bc__stars">★★★★★</div>
          {['Material Authentic','Weight Verified','No Anomalies'].map(l => (
            <div key={l} className="bc__chk">
              <CheckCircle2 size={10} className="bc__chk-ico" />
              <span>{l}</span>
            </div>
          ))}
        </div>
        <div className="bc__badge bc__badge--verify">
          <ShieldCheck size={10} /> AI VERIFIED
        </div>
      </div>

      {/* ══ TRACE ══ */}
      <div className={`bc__ov bc__ov--trace${step === 2 ? ' is-on' : ''}`}>
        <div className="bc__node bc__node--tl"><div className="bc__ndot" /><span>Collector</span><div className="bc__nline bc__nline--tl" /></div>
        <div className="bc__node bc__node--tr"><div className="bc__ndot" /><span>Buyer</span><div className="bc__nline bc__nline--tr" /></div>
        <div className="bc__node bc__node--bl"><div className="bc__ndot" /><span>Recycler</span><div className="bc__nline bc__nline--bl" /></div>
        <div className="bc__node bc__node--br"><div className="bc__ndot" /><span>Processor</span><div className="bc__nline bc__nline--br" /></div>
        <div className="bc__float bc__float--bottom">
          <div className="bc__float-head">
            <Link2 size={11} />
            <span>Blockchain Record</span>
            <CheckCircle2 size={11} className="bc__check-ico" />
          </div>
          <div className="bc__fr"><span className="bc__fk">Material ID</span><span className="bc__fv bc__fv--mono">R2-PLAS-2024-000567</span></div>
          <div className="bc__fr"><span className="bc__fk">Block Hash</span><span className="bc__fv bc__fv--mono">0x4a2f…8c1e</span></div>
          <div className="bc__onchain"><span className="bc__pulse-dot" />On-Chain · Immutable</div>
        </div>
        <div className="bc__badge bc__badge--trace">
          <Link2 size={10} /> FULLY TRACED
        </div>
      </div>

      {/* ══ ANALYZE ══ */}
      <div className={`bc__ov bc__ov--analyze${step === 3 ? ' is-on' : ''}`}>
        <div className="bc__kpi bc__kpi--tl">
          <p className="bc__kpi-lbl">Recovery Rate</p>
          <p className="bc__kpi-val">98.6%</p>
          <span className="bc__kpi-up">↑ 12.4%</span>
        </div>
        <div className="bc__kpi bc__kpi--tr">
          <p className="bc__kpi-lbl">CO₂ Saved</p>
          <p className="bc__kpi-val">2.45 MT</p>
          <span className="bc__kpi-up">↑ 15.3%</span>
        </div>
        <div className="bc__kpi bc__kpi--bl">
          <p className="bc__kpi-lbl">Purity</p>
          <p className="bc__kpi-val">94%</p>
          <span className="bc__kpi-up">↑ 8.1%</span>
        </div>
        <div className="bc__kpi bc__kpi--br">
          <p className="bc__kpi-lbl">Volume</p>
          <p className="bc__kpi-val">1,248 kg</p>
          <div className="bc__bars">
            {[30,50,42,68,55,80,70].map((h,i) => (
              <div key={i} className="bc__bar" style={{height:`${h}%`}} />
            ))}
          </div>
        </div>
        <div className="bc__badge bc__badge--analyze">
          <BarChart3 size={10} /> INSIGHTS READY
        </div>
      </div>

      {/* ══ REPORT ══ */}
      <div className={`bc__ov bc__ov--report${step === 4 ? ' is-on' : ''}`}>
        <div className="bc__float bc__float--right bc__float--report">
          <div className="bc__float-head">
            <FileText size={12} />
            <span>Compliance Report</span>
            <span className="bc__pill">✓ Verified</span>
          </div>
          {[['Recovered','1,248.6 kg'],['CO₂ Impact','2.45 MT'],['Date','May 12, 2024']].map(([k,v]) => (
            <div key={k} className="bc__fr">
              <span className="bc__fk">{k}</span>
              <span className="bc__fv">{v}</span>
            </div>
          ))}
        </div>
        <div className="bc__stamp">
          <div className="bc__qr" />
          <div>
            <p className="bc__audit-lbl">AUDIT READY</p>
            <p className="bc__epr-lbl">EPR Compliant</p>
          </div>
        </div>
        <div className="bc__badge bc__badge--report">
          <FileCheck size={10} /> AUDIT READY
        </div>
      </div>

    </div>
  );
}

/* ── Verification ring ── */
/* ── Illustration: AI-Powered Verification ── */
function IllusAI() {
  return (
    <img src="/step1-core.png" alt="AI-Powered Verification" className="sw-illus sw-illus--img" draggable="false" />
  );
}

/* ── Illustration: Blockchain Traceability ── */
function IllusBlockchain() {
  return (
    <img src="/step2-core.png" alt="Blockchain Traceability" className="sw-illus sw-illus--img" draggable="false" />
  );
}

/* ── Illustration: Digital Product Passport ── */
function IllusPassport() {
  return (
    <img src="/step3-core.png" alt="Digital Product Passport" className="sw-illus sw-illus--img" draggable="false" />
  );
}

/* ── Illustration: Compliance Automation ── */
function IllusCompliance() {
  return (
    <img src="/step4-core.png" alt="Compliance Automation" className="sw-illus sw-illus--img" draggable="false" />
  );
}
