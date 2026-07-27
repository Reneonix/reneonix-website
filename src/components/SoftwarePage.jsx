import { useEffect, useLayoutEffect, useRef, useState, Fragment } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import {
  Database, Shield, FileText,
  Eye, ShieldAlert,
  Cpu, ShieldCheck,
  BarChart3, ArrowRight, ChevronRight,
  CheckCircle2, FileCheck,
  Smartphone, Tag, MapPin, User, Scale,
  AlertTriangle, ImageIcon,
  Box, Clock, Link2, GitBranch,
  TrendingUp, LineChart, Target, Lightbulb,
  Share2, BookOpen, Settings,
  Layers, Scissors, Sun,
  Calendar, ChevronDown,
  Truck, Factory, Recycle, Download,
  Upload,
} from 'lucide-react';

import './SoftwarePage.css';
import './SoftwarePage_how.css';
import PlatformPreviewMockup from './SoftwarePagePreview';
import { navClick } from '../utils/nav.js';

const RETRIAZ_STEPS = [
  {
    num: '01', key: 'capture', eyebrow: 'Capture',
    title: 'Capture Material Data',
    desc: 'Upload any material documents or files. Our AI extracts key information instantly.',
    features: ['PDF reports & certificates', 'CSV data files', 'COA documents', 'Images & scans'],
    Icon: Upload,
  },
  {
    num: '02', key: 'verify', eyebrow: 'Verify',
    title: 'AI Verification',
    desc: 'We verify composition, supplier, compliance and lab results with industry standards.',
    features: ['Composition verified', 'Supplier verified', 'Compliance checked', 'Lab results matched'],
    Icon: ShieldCheck,
  },
  {
    num: '03', key: 'trace', eyebrow: 'Trace',
    title: 'End-to-End Traceability',
    desc: 'We map every step of the material journey - from raw to recovery.',
    features: ['Raw material to recovery', 'Immutable chain of custody', 'Time & location stamps', 'Blockchain-backed records'],
    Icon: GitBranch,
  },
  {
    num: '04', key: 'analyze', eyebrow: 'Analyze',
    title: 'Insights & Analytics',
    desc: 'Get actionable insights, trend analysis and quality metrics to drive better decisions.',
    features: ['Purity & quality scores', 'Compliance tracking', 'Recovered weight metrics', 'Quality trend charts'],
    Icon: TrendingUp,
  },
  {
    num: '05', key: 'report', eyebrow: 'Report',
    title: 'Material Passport',
    desc: 'Export, share and stay audit-ready at all times.',
    features: ['Material passport generation', 'Audit-ready reports', 'Secure sharing', 'Download in one click'],
    Icon: FileCheck,
  },
];

const MARQUEE_ITEMS = [
  { label: 'Glass',         Icon: Eye,        color: '#67e8f9' },
  { label: 'Plastics',      Icon: Box,        color: '#4ade80' },
  { label: 'Ceramics',      Icon: Layers,     color: '#fb923c' },
  { label: 'Solar Panels',  Icon: Sun,        color: '#fbbf24' },
  { label: 'Textiles',      Icon: Scissors,   color: '#f472b6' },
  { label: 'E-Waste',       Icon: Cpu,        color: '#60a5fa' },
];

/* Core capabilities — 8 equal cards, sequential fade-in + slide-up on reveal */
const CAPS = [
  { num: '01', title: 'AI-Powered Verification',
    body: 'Validate recovery data with AI and ensure audit-ready compliance.' },
  { num: '02', title: 'Blockchain Traceability',
    body: 'Immutable records for complete transparency and trust.' },
  { num: '03', title: 'Digital Product Passport',
    body: 'Track every material with a digital passport across its lifecycle.' },
  { num: '04', title: 'Compliance Automation',
    body: 'Automate reporting and documentation to stay compliant, always.' },
  { num: '05', title: 'EPR Compliance & Reporting',
    body: 'Simplify EPR obligations with automated data capture and reports.' },
  { num: '06', title: 'Real-time Analytics',
    body: 'Live dashboards and alerts to act fast and stay ahead of issues.' },
  { num: '07', title: 'Material Intelligence',
    body: 'Convert recovery data into actionable insights to optimize operations.' },
  { num: '08', title: 'Carbon Impact Tracking',
    body: 'Measure, monitor, and report environmental impact with confidence.' },
];

export default function SoftwarePage() {
  const pinRef = useRef(null);
  const mobileTrackRef = useRef(null);
  const [mobileStep, setMobileStep] = useState(0);

  // Mobile step slider — native scroll-snap, no vertical scroll-jacking.
  // Syncs the active dot as the user swipes the track.
  const handleMobileTrackScroll = () => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const idx = Math.round(track.scrollLeft / track.offsetWidth);
    setMobileStep(Math.min(Math.max(idx, 0), RETRIAZ_STEPS.length - 1));
  };

  const scrollToMobileStep = (idx) => {
    const track = mobileTrackRef.current;
    if (!track) return;
    track.scrollTo({ left: idx * track.offsetWidth, behavior: 'smooth' });
  };

  // Reveal elements already in view on first paint
  useLayoutEffect(() => {
    const vh = window.innerHeight;
    document.querySelectorAll('.sw-reveal').forEach(el => {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < vh && bottom > 0) el.classList.add('sw-in');
    });
  }, []);

  // Scroll-reveal for below-fold elements
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('sw-in'); io.unobserve(e.target); }
      }),
      { threshold: 0.05 }
    );
    document.querySelectorAll('.sw-reveal:not(.sw-in)').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // GSAP pinned scroll storytelling — desktop only. On mobile the section
  // uses a swipeable card track instead (see .rzp-mobile-track below), so
  // users are never scroll-jacked and can leave the section at any time.
  useEffect(() => {
    const pin = pinRef.current;
    if (!pin || window.matchMedia('(max-width: 767px)').matches) return;

    const N          = RETRIAZ_STEPS.length;
    const xImg       = 100;
    const imgWraps   = gsap.utils.toArray(pin.querySelectorAll('.rzp-img-wrap'));
    const indItems   = gsap.utils.toArray(pin.querySelectorAll('.rzp-ind__item'));

    const ctx = gsap.context(() => {
      // Position all panels: first visible, rest waiting right
      gsap.set(imgWraps,    { x: xImg,  opacity: 0, scale: 0.95 });
      gsap.set(imgWraps[0], { x: 0, opacity: 1, scale: 1 });
      indItems[0]?.classList.add('is-active');

      // Build scrub timeline: each transition at t = i-1
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut', duration: 1 } });
      for (let i = 1; i < N; i++) {
        const t = i - 1;
        tl.to(imgWraps[i - 1], { x: -xImg,  opacity: 0, scale: 0.95 }, t)
          .to(imgWraps[i],     { x: 0,      opacity: 1, scale: 1 }, t);
      }

      // Pin + scrub through all transitions
      ScrollTrigger.create({
        trigger: pin,
        pin: true,
        scrub: 1.5,
        start: 'top top',
        end: () => `+=${(N - 1) * window.innerHeight * 1.3}`,
        animation: tl,
        onUpdate(self) {
          const active = Math.min(N - 1, Math.round(self.progress * (N - 1)));
          indItems.forEach((el, j) => el.classList.toggle('is-active', j === active));
        },
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  return (
    <div className="sw-page">

      {/* ══ HERO ══ */}
      <section className="sw-hero">
        {/* Background — responsive desktop / mobile image */}
        <picture>
          <source media="(max-width: 768px)" srcSet="/software-hero-mobile.png" />
          <img
            className="sw-hero__bg"
            src="/software-hero.png"
            alt=""
            aria-hidden="true"
            draggable="false"
            fetchpriority="high"
          />
        </picture>
        {/* cross flare — dark left */}
        <div className="sw-hero__cross" aria-hidden="true" />
        {/* green glow — upper-right */}
        <div className="sw-hero__glow" aria-hidden="true" />

        <div className="container sw-hero__inner">

          <div className="sw-hero__copy sw-reveal">
            <nav className="sw-crumb" aria-label="Breadcrumb">
              <a href="/" onClick={navClick('/')}>Home</a>
              <ChevronRight size={13} aria-hidden="true" />
              <a href="/solutions" onClick={navClick('/solutions')}>Solutions</a>
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

          {/* 8 equal cards — sequential fade-in + slide-up, staggered 100ms apart */}
          <div className="sw-caps-grid">
            {CAPS.map(({ num, title, body }, i) => (
              <div
                key={num}
                className="sw-cap-sm sw-reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="sw-cap-sm__head">
                  <span className="sw-cap__num">{num}</span>
                  <h4 className="sw-cap-sm__title">{title}</h4>
                </div>
                <p className="sw-cap-sm__body">{body}</p>
              </div>
            ))}
          </div>


        </div>

      </section>

      {/* ══ HOW RETRIAZ WORKS — header + rail + panel, all pinned together ══ */}
      <div className="rzp-wrap" ref={pinRef}>
        <div className="rzp-stage">

          {/* Header — stays fixed at the top of the pinned viewport */}
          <div className="rzs-header">
            <span className="rzs-header__eyebrow">How Retriaz Works</span>
            <h2 className="rzs-header__title">
              One Material,<br className="rzs-title-br" /> <span className="rzs-header__accent">Complete Confidence</span>
            </h2>
            <p className="rzs-header__desc">
              Retriaz brings transparency, intelligence, and trust to every step of your recovery journey.
            </p>
            <p className="rzs-header__sub">
              Works for all types of Materials
            </p>
            <div className="rzs-marquee" aria-hidden="true">
              <div className="rzs-marquee__track">
                {MARQUEE_ITEMS.map(({ label, Icon, color }, i) => (
                  <div key={i} className="rzs-badge">
                    <Icon size={14} color={color} strokeWidth={1.8} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rail + panel grid — fills the remaining pinned height */}
          <div className="rzp-grid">

            {/* Rail: compact, always-visible list — only the active item highlights */}
            <div className="rzp-rail">
              {RETRIAZ_STEPS.map((step, i) => (
                <div key={step.key} className="rzp-ind__item">
                  <span className="rzp-ind__dot">{step.num}</span>
                  <span className="rzp-ind__label">
                    <small>{step.eyebrow}</small>
                    <strong>{step.title}</strong>
                  </span>
                </div>
              ))}
            </div>

            {/* Panel: rich content, GSAP crossfades between steps */}
            <div className="rzp-visual">
              {RETRIAZ_STEPS.map((step) => (
                <div key={step.key} className="rzp-img-wrap">
                  <div className="rzp-panel">
                    <span className="rzp-panel__icon"><step.Icon size={22} strokeWidth={1.8} /></span>
                    <h3 className="rzp-panel__title">{step.title}</h3>
                    <p className="rzp-panel__desc">{step.desc}</p>
                    <ul className="rzp-panel__ticks">
                      {step.features.map(f => (
                        <li key={f}>
                          <span className="rzp-panel__tick"><CheckCircle2 size={11} strokeWidth={2.5} /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <span className="rzp-panel__tagline">Step {step.num} — {step.eyebrow}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Mobile: swipeable card track, no scroll-jacking — the user can
              swipe through all 5 steps or just scroll past at any time */}
          <div
            className="rzp-mobile-track"
            ref={mobileTrackRef}
            onScroll={handleMobileTrackScroll}
          >
            {RETRIAZ_STEPS.map((step) => (
              <div key={step.key} className="rzp-mobile-slide">
                <div className="rzp-panel">
                  <span className="rzp-panel__icon"><step.Icon size={22} strokeWidth={1.8} /></span>
                  <h3 className="rzp-panel__title">{step.title}</h3>
                  <p className="rzp-panel__desc">{step.desc}</p>
                  <ul className="rzp-panel__ticks">
                    {step.features.map(f => (
                      <li key={f}>
                        <span className="rzp-panel__tick"><CheckCircle2 size={11} strokeWidth={2.5} /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="rzp-panel__tagline">Step {step.num} — {step.eyebrow}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="rzp-mobile-dots">
            {RETRIAZ_STEPS.map((step, i) => (
              <button
                key={step.key}
                type="button"
                className={`rzp-mobile-dot${mobileStep === i ? ' rzp-mobile-dot--on' : ''}`}
                aria-label={`Go to step ${i + 1}`}
                onClick={() => scrollToMobileStep(i)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ══ PLATFORM PREVIEW ══ */}
      <section className="sw-plat">
        <div className="container">

          {/* Label */}
          <div className="sw-plat__divrow sw-reveal">
            <span className="sw-plat__divcap">Platform Preview</span>
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

          {/* Interactive platform preview mockup */}
          <div className="sw-plat__preview">
            <PlatformPreviewMockup />
          </div>

        </div>
      </section>

    </div>
  );
}

/* ─── 5 STEP VISUALS ─── */

/* ── Step 01: Capture ── */
function VizCapture({ active }) {
  const FILES = ['composition.pdf', 'test_report.csv', 'image_01.jpg', 'coa.pdf'];
  return (
    <div className="sv-inner sv-cap2">
      <div className="sv-cap2__cols">

        {/* Left: file upload */}
        <div className="sv-cap2__left">
          <div className="sv-cap2__drop">
            <div className="sv-cap2__drop-icon"><FileText size={30} strokeWidth={1.5} /></div>
            <p className="sv-cap2__drop-main">Drag & drop files here</p>
            <p className="sv-cap2__drop-or">or <span>browse</span></p>
            <p className="sv-cap2__drop-hint">Supports: PDF, CSV, Images, XLSX, JSON</p>
          </div>
          <div className="sv-cap2__files">
            <span className="sv-cap2__files-lbl">Uploaded Files (4)</span>
            <div className="sv-cap2__chips">
              {FILES.map(f => (
                <span key={f} className="sv-cap2__chip">
                  <FileText size={11} />
                  <span>{f}</span>
                  <span className="sv-cap2__chip-close">×</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: material details form */}
        <div className="sv-cap2__form">
          <p className="sv-cap2__form-ttl">Material Details</p>
          <div className="sv-cap2__form-rows">
            <div className="sv-cap2__frow">
              <span className="sv-cap2__flbl">Material Name</span>
              <span className="sv-cap2__fval">Aluminum Scrap 6061</span>
            </div>
            <div className="sv-cap2__frow">
              <span className="sv-cap2__flbl">Material Type</span>
              <div className="sv-cap2__fsel">
                <span>Metals</span>
                <ChevronDown size={13} />
              </div>
            </div>
            <div className="sv-cap2__frow">
              <span className="sv-cap2__flbl">Supplier</span>
              <span className="sv-cap2__fval">Reclaim Industries Pvt. Ltd.</span>
            </div>
            <div className="sv-cap2__frow">
              <span className="sv-cap2__flbl">Batch / Lot Number</span>
              <span className="sv-cap2__fval">RI-6061-0524</span>
            </div>
            <div className="sv-cap2__frow sv-cap2__frow--last">
              <span className="sv-cap2__flbl">Collection Date</span>
              <div className="sv-cap2__fdate">
                <span>May 12, 2024</span>
                <Calendar size={13} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Step 02: Verify ── */
function VizVerify({ active }) {
  const CHECKS = [
    'Composition Verified',
    'Supplier Verified',
    'Compliance Checked',
    'Lab Results Matched',
    'Quality Score Generated',
  ];
  return (
    <div className="sv-inner sv-ver2">
      <div className="sv-ver2__cols">

        {/* Left: verification progress */}
        <div className="sv-ver2__progress">
          <p className="sv-ver2__panel-ttl">Verification Progress</p>
          <div className="sv-ver2__checks">
            {CHECKS.map(c => (
              <div key={c} className="sv-ver2__check">
                <div className="sv-ver2__check-ico"><CheckCircle2 size={16} /></div>
                <span className="sv-ver2__check-lbl">{c}</span>
                <span className="sv-ver2__check-status">Completed</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: verification summary */}
        <div className="sv-ver2__summary">
          <p className="sv-ver2__panel-ttl">Verification Summary</p>
          <div className="sv-ver2__score-block">
            <p className="sv-ver2__score-lbl">Overall Score</p>
            <p className="sv-ver2__score-val">98.6%</p>
            <span className="sv-ver2__score-badge">Excellent</span>
          </div>
          <div className="sv-ver2__meta">
            <div className="sv-ver2__mrow">
              <span className="sv-ver2__mlbl">Tested By</span>
              <span className="sv-ver2__mval">Reneonix Labs</span>
            </div>
            <div className="sv-ver2__mrow">
              <span className="sv-ver2__mlbl">Verification Date</span>
              <span className="sv-ver2__mval">May 12, 2024, 11:30 AM</span>
            </div>
            <div className="sv-ver2__mrow">
              <span className="sv-ver2__mlbl">Standards</span>
              <span className="sv-ver2__mval">ISO 17025, ISO 9001</span>
            </div>
            <div className="sv-ver2__mrow sv-ver2__mrow--last">
              <span className="sv-ver2__mlbl">Result</span>
              <div className="sv-ver2__result">
                <CheckCircle2 size={13} />
                <span>Verified</span>
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
  const JOURNEY = [
    { label: 'Raw Material',   sub: 'India',              date: 'May 01, 2024', Icon: Truck   },
    { label: 'Processing',     sub: 'Maharashtra, India', date: 'May 03, 2024', Icon: Factory },
    { label: 'Manufacturing',  sub: 'Gujarat, India',     date: 'May 06, 2024', Icon: Factory },
    { label: 'Distribution',   sub: 'Karnataka, India',   date: 'May 08, 2024', Icon: Truck   },
    { label: 'Recovery',       sub: 'Reneonix Partner',   date: 'May 10, 2024', Icon: Recycle },
  ];
  return (
    <div className="sv-inner sv-trc2">
      <div className="sv-trc2__card">
        <p className="sv-trc2__ttl">Material Journey</p>

        <div className="sv-trc2__flow">
          {JOURNEY.map((node, i) => (
            <Fragment key={node.label}>
              <div className="sv-trc2__node">
                <div className="sv-trc2__node-ico"><node.Icon size={24} /></div>
                <span className="sv-trc2__node-name">{node.label}</span>
                <span className="sv-trc2__node-loc">{node.sub}</span>
                <span className="sv-trc2__node-date">{node.date}</span>
              </div>
              {i < JOURNEY.length - 1 && (
                <div className="sv-trc2__conn" aria-hidden="true">
                  <div className="sv-trc2__conn-line" />
                  <div className="sv-trc2__conn-dot" />
                  <div className="sv-trc2__conn-line" />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <div className="sv-trc2__footer">
          <span className="sv-trc2__tid">Traceability ID: TRC-6061-0524-91D2</span>
          <button className="sv-trc2__btn">View Full Journey</button>
        </div>
      </div>
    </div>
  );
}

/* ── Step 04: Analyze ── */
function VizAnalyze() {
  const KPIS = [
    { label: 'Purity',            value: '98.6%',      delta: '+1.2% vs last batch'  },
    { label: 'Quality Score',     value: '97.8%',      delta: '+2.1% vs last batch'  },
    { label: 'Compliance',        value: '100%',       delta: 'No non-conformities'   },
    { label: 'Recovered Weight',  value: '1,248.6 kg', delta: '+8.4% vs last batch'  },
  ];
  const COMPOSITION = [
    { element: 'Aluminum (Al)',  pct: '97.30%' },
    { element: 'Magnesium (Mg)', pct: '1.20%'  },
    { element: 'Silicon (Si)',   pct: '0.60%'  },
    { element: 'Iron (Fe)',      pct: '0.40%'  },
    { element: 'Others',         pct: '0.50%'  },
  ];
  return (
    <div className="sv-inner sv-ana2">

      {/* KPI row */}
      <div className="sv-ana2__kpis">
        {KPIS.map(k => (
          <div key={k.label} className="sv-ana2__kpi">
            <span className="sv-ana2__kpi-lbl">{k.label}</span>
            <span className="sv-ana2__kpi-val">{k.value}</span>
            <span className="sv-ana2__kpi-delta">{k.delta}</span>
          </div>
        ))}
      </div>

      {/* Bottom: trend chart + composition */}
      <div className="sv-ana2__bottom">

        {/* Quality Trend chart */}
        <div className="sv-ana2__chart-card">
          <div className="sv-ana2__chart-head">
            <span className="sv-ana2__chart-ttl">Quality Trend</span>
            <span className="sv-ana2__chart-range">Last 6 Months</span>
          </div>
          <div className="sv-ana2__chart">
            <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="sv-ana2__svg">
              <defs>
                <linearGradient id="ana2g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B2DE3A" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#B2DE3A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,62 C40,60 70,56 100,46 C130,36 160,32 190,22 C220,14 255,10 300,5 L300,80 L0,80 Z" fill="url(#ana2g)" />
              <path d="M0,62 C40,60 70,56 100,46 C130,36 160,32 190,22 C220,14 255,10 300,5" stroke="#B2DE3A" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <div className="sv-ana2__xaxis">
              {['Dec','Jan','Feb','Mar','Apr','May'].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>

        {/* Composition Overview */}
        <div className="sv-ana2__comp-card">
          <div className="sv-ana2__comp-head">
            <span className="sv-ana2__comp-ttl">Composition Overview</span>
            <span className="sv-ana2__comp-sub">% by Weight</span>
          </div>
          <div className="sv-ana2__comp-rows">
            {COMPOSITION.map(c => (
              <div key={c.element} className="sv-ana2__comp-row">
                <span className="sv-ana2__comp-el">{c.element}</span>
                <span className="sv-ana2__comp-pct">{c.pct}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Step 05: Report ── */
function VizReport() {
  const REPORTS = [
    { name: 'Material Passport',      meta: 'PDF · May 12, 2024 · 1.2 MB' },
    { name: 'Verification Report',    meta: 'PDF · May 12, 2024 · 1.8 MB' },
    { name: 'Compliance Certificate', meta: 'PDF · May 12, 2024 · 0.9 MB' },
    { name: 'Test Results (Full)',     meta: 'PDF · May 12, 2024 · 2.6 MB' },
  ];
  const SUMMARY = [
    ['Overall Score', '98.6%'],
    ['Quality Score', '100%'],
    ['Compliance',    '100%'],
    ['Purity',        '97.6%'],
  ];
  return (
    <div className="sv-inner sv-rep2">
      <div className="sv-rep2__cols">

        {/* Left: available reports */}
        <div className="sv-rep2__reports">
          <p className="sv-rep2__panel-ttl">Available Reports</p>
          <div className="sv-rep2__list">
            {REPORTS.map(r => (
              <div key={r.name} className="sv-rep2__item">
                <div className="sv-rep2__item-ico"><FileText size={15} /></div>
                <div className="sv-rep2__item-info">
                  <span className="sv-rep2__item-name">{r.name}</span>
                  <span className="sv-rep2__item-meta">{r.meta}</span>
                </div>
                <button className="sv-rep2__dl-btn"><Download size={12} /> Download</button>
              </div>
            ))}
          </div>
          <button className="sv-rep2__dl-all"><Download size={14} /> Download All</button>
        </div>

        {/* Right: material passport preview */}
        <div className="sv-rep2__passport">
          <div className="sv-rep2__pass-hd">
            <span className="sv-rep2__pass-brand">Reneonix</span>
            <p className="sv-rep2__pass-ttl">Material Passport</p>
          </div>
          <div className="sv-rep2__pass-body">
            <div className="sv-rep2__pass-fields">
              {[
                ['Material ID',       'MAT-4001-0524-001'],
                ['Batch No.',         'RI-6061-0524'],
                ['Verification Date', 'May 12, 2024'],
                ['Verified by',       'Reneonix AI'],
              ].map(([lbl, val]) => (
                <div key={lbl} className="sv-rep2__pass-row">
                  <span className="sv-rep2__pass-lbl">{lbl}</span>
                  <span className="sv-rep2__pass-val">{val}</span>
                </div>
              ))}
            </div>
            <div className="sv-rep2__score-ring">
              <span className="sv-rep2__score-num">98.6%</span>
              <span className="sv-rep2__score-tag">Passed</span>
            </div>
          </div>
          <div className="sv-rep2__summary">
            <span className="sv-rep2__sum-ttl">Summary</span>
            <div className="sv-rep2__sum-grid">
              {SUMMARY.map(([k, v]) => (
                <div key={k} className="sv-rep2__sum-item">
                  <span className="sv-rep2__sum-lbl">{k}</span>
                  <span className="sv-rep2__sum-val">{v}</span>
                </div>
              ))}
            </div>
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

