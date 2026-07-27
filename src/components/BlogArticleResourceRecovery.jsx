import { Fragment, useEffect, useRef, useState } from 'react';
import {
  Calendar, Clock, User, ChevronRight, ChevronDown, ArrowRight,
  Truck, Handshake, Building2, Recycle, Factory, Filter, ShieldCheck,
  ClipboardList, Eye, Brain, FlaskConical, Check,
  Image as ImageIcon,
} from 'lucide-react';
import ProcessChain from './ProcessChain/ProcessChain.jsx';
import useInView from './ProcessChain/useInView.js';
import ArticlePDF from '../pdf/ArticlePDF.jsx';
import resourceRecoveryPdfData from '../pdf/data/resourceRecoveryPdfData.js';
import BridgeQuote, { BrushFilterDefs } from './BridgeQuote.jsx';
import { navigate, navClick } from '../utils/nav.js';
import './BlogArticleResourceRecovery.css';

// Stands in for a real photo until one is uploaded to /public — swap the
// <ImagePlaceholder> for an <img src="/…" alt="…" /> once the asset lands.
function ImagePlaceholder({ label }) {
  return (
    <div className="rr-img-placeholder" role="img" aria-label={label}>
      <ImageIcon size={22} aria-hidden="true" />
    </div>
  );
}

// Timing for the pair-wise strike → check choreography, once the compare
// block scrolls into view. The cards + arrow land first (pure CSS, driven
// by .is-in), then each old item is struck out a beat before its paired
// new item is born on the right.
const PAIR_BASE = 950; // ms after reveal before pair 0 starts
const PAIR_STEP = 520; // ms between pairs
const BIRTH_LAG = 260; // ms between an old item striking and its pair being born

// "Traditional Recycling" → "Verified Circularity" comparison. Cards slide
// in from opposite sides, the arrow draws itself between them, and each
// paired item transforms in sequence — strike-through grows on the old
// item just before its checkmark draws in on the new one.
function CircularityCompare({ pairs }) {
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { threshold: 0.3 });
  const [doneCount, setDoneCount] = useState(0);
  const [bornCount, setBornCount] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const timers = pairs.flatMap((_, i) => {
      const t = PAIR_BASE + i * PAIR_STEP;
      return [
        setTimeout(() => setDoneCount((c) => Math.max(c, i + 1)), t),
        setTimeout(() => setBornCount((c) => Math.max(c, i + 1)), t + BIRTH_LAG),
      ];
    });
    return () => timers.forEach(clearTimeout);
  }, [inView, pairs]);

  return (
    <div className={`rr-compare${inView ? ' is-in' : ''}`} ref={rootRef}>
      <div className="rr-compare__card rr-compare__card--old">
        <span className="rr-compare__label">Traditional Recycling</span>
        <ul>
          {pairs.map((pair, i) => (
            <li key={pair.old} className={i < doneCount ? 'is-done' : ''}>
              <span className="rr-compare__strike">{pair.old}</span>
            </li>
          ))}
        </ul>
      </div>

      <span className="rr-compare__arrow" aria-hidden="true">
        <svg viewBox="0 0 64 32">
          <defs>
            <linearGradient id="rrArrow3dFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: 'var(--lime)' }} />
              <stop offset="100%" style={{ stopColor: 'var(--lime-deep)' }} />
            </linearGradient>
          </defs>
          {/* Solid beveled shape (gradient fill + drop-shadow via CSS) reads
             as a raised 3D arrow instead of a flat drawn line. */}
          <path
            className="rr-compare__arrow-body"
            d="M3 12 H33 V3 L61 16 L33 29 V20 H3 Z"
            fill="url(#rrArrow3dFace)"
          />
          {/* Thin highlight along the top edge — the "glossy" cue that
             sells the beveled look. */}
          <path
            className="rr-compare__arrow-shine"
            d="M4 12.6 H33.6 L34.3 4 L58 16"
          />
        </svg>
      </span>

      <div className="rr-compare__card rr-compare__card--new">
        <span className="rr-compare__label">Verified Circularity</span>
        <ul>
          {pairs.map((pair, i) => (
            <li key={pair.new} className={i < bornCount ? 'is-born' : ''}>
              <svg className="rr-compare__check" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
              {pair.new}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Timing for the "One Connected Chain" line-draw choreography, once it
// scrolls into view: the track draws itself through every node (DRAW_MS),
// each node lights up the instant the line reaches its real position along
// the track, then — after a short pause — a data pulse loops through the
// finished chain.
const DRAW_MS = 1600;
const FLOW_MS = 3200;
const FLOW_DELAY = 400;

// "One Connected Chain" — a single line draws itself through every stage,
// lighting each node the moment it arrives (delay computed from the node's
// real rendered position, so uneven label widths never break the sync),
// then a data pulse loops through the completed chain.
function IntegrationChain({ steps }) {
  const chainRef = useRef(null);
  const circleRefs = useRef([]);
  const inView = useInView(chainRef, { threshold: 0.3 });
  const [lit, setLit] = useState(() => new Set());
  const [flowing, setFlowing] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Flow-dot travel distance = real distance between the first and last
  // circle centers — a flex row of variable-width labels won't line up
  // with any fixed px guess, so this is measured, not assumed.
  useEffect(() => {
    const el = chainRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const measure = () => {
      const first = circleRefs.current[0]?.getBoundingClientRect();
      const last = circleRefs.current[steps.length - 1]?.getBoundingClientRect();
      if (!first || !last) return;
      const vertical = window.matchMedia('(max-width: 1000px)').matches;
      setTrackWidth(vertical ? Math.abs(last.top - first.top) : Math.abs(last.left - first.left));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [steps.length]);

  useEffect(() => {
    if (!inView) return undefined;
    const vertical = window.matchMedia('(max-width: 1000px)').matches;
    const chainRect = chainRef.current.getBoundingClientRect();
    const centers = circleRefs.current.map((el) => {
      const r = el.getBoundingClientRect();
      return vertical ? r.top + r.height / 2 - chainRect.top : r.left + r.width / 2 - chainRect.left;
    });
    const min = Math.min(...centers);
    const max = Math.max(...centers);
    const timers = centers.map((c, i) => {
      const fraction = max === min ? 0 : (c - min) / (max - min);
      const delay = fraction * DRAW_MS;
      const t1 = setTimeout(() => setLit((prev) => new Set(prev).add(i)), delay);
      // Spotlight each node's benefit tooltip in turn as the line reaches
      // it, so the auto-play sequence reads like a guided walkthrough
      // instead of requiring the user to hover every node themselves.
      const t2 = setTimeout(() => setActiveIndex(i), delay);
      return [t1, t2];
    }).flat();
    // Hold the last tooltip a moment so it's readable, then clear it —
    // hover/focus still work independently of this auto sequence.
    const clearTimer = setTimeout(() => setActiveIndex(-1), DRAW_MS + 900);
    let flowTimer;
    if (!vertical) {
      flowTimer = setTimeout(() => setFlowing(true), DRAW_MS + FLOW_DELAY);
    }
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(clearTimer);
      if (flowTimer) clearTimeout(flowTimer);
    };
  }, [inView, steps]);

  return (
    <div
      className={`rr-linechain${inView ? ' is-in' : ''}${flowing ? ' is-flowing' : ''}`}
      ref={chainRef}
      style={{
        '--rr-draw-ms': `${DRAW_MS}ms`,
        '--rr-flow-ms': `${FLOW_MS}ms`,
        '--rr-track-w': `${trackWidth}px`,
      }}
    >
      <div className="rr-linechain__track" aria-hidden="true" />
      <div className="rr-linechain__dot" aria-hidden="true" />
      {steps.map((step, i) => (
        <Fragment key={step.id}>
          <div className={`rr-linechain__node${lit.has(i) ? ' is-lit' : ''}${activeIndex === i ? ' is-active' : ''}`} tabIndex={0}>
            <span className="rr-linechain__circle" ref={(el) => { circleRefs.current[i] = el; }}>
              <step.icon size={22} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="rr-linechain__label">{step.label}</span>
            {step.tooltip && (
              <span className="rr-linechain__tip" role="tooltip">{step.tooltip}</span>
            )}
          </div>
          {i < steps.length - 1 && (
            <span className={`rr-linechain__arrow${lit.has(i + 1) ? ' is-lit' : ''}`} aria-hidden="true">
              <ChevronRight size={18} strokeWidth={3} />
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

// Timing for the chip-by-chip verification choreography, once it scrolls
// into view: chips fade in together in their pending state, then — one by
// one — each is verified (ring fills, check draws, chip stamps) while the
// status line counts up, finally flipping to its "complete" state.
const VERIFY_START_DELAY = 700; // ms after reveal before verification begins
const VERIFY_STEP = 420; // ms between each chip's verification
const VERIFY_SETTLE = 450; // ms between the last chip verifying and "complete"

// "What Organizations Can Now Demonstrate" — six pending chips get
// verified one at a time, like a live audit completing, with a status line
// that counts up and then flips to its finished state.
function VerifiedDataChips({ points }) {
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { threshold: 0.35 });
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | running | complete

  useEffect(() => {
    if (!inView) return undefined;
    setStatus('running');
    const timers = points.map((_, i) => setTimeout(
      () => setVerifiedCount((c) => Math.max(c, i + 1)),
      VERIFY_START_DELAY + i * VERIFY_STEP
    ));
    const completeTimer = setTimeout(
      () => setStatus('complete'),
      VERIFY_START_DELAY + (points.length - 1) * VERIFY_STEP + VERIFY_SETTLE
    );
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [inView, points]);

  const statusText = status === 'complete'
    ? `✓ ${points.length} of ${points.length} demonstrated`
    : `Verifying… ${verifiedCount} / ${points.length}`;

  return (
    <div className="rr-verify" ref={rootRef}>
      <p
        className={`rr-verify__status${status === 'running' ? ' is-running' : ''}${status === 'complete' ? ' is-complete' : ''}`}
        aria-live="polite"
      >
        <span className="rr-verify__dot" aria-hidden="true" />
        {statusText}
      </p>

      <div className={`rr-chips${inView ? ' is-in' : ''}`}>
        {points.map((point, i) => (
          <span className={`rr-chip${i < verifiedCount ? ' is-verified' : ''}`} tabIndex={0} key={point.id}>
            <svg className="rr-chip__badge" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="rr-chip__ring" cx="12" cy="12" r="10" />
              <path className="rr-chip__mark" d="m7 12.5 3.5 3.5L17 8.5" />
            </svg>
            {point.label}
            {point.tooltip && <span className="rr-chip__tip" role="tooltip">{point.tooltip}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

// Pain-point tooltips — shown on hover/focus of each broken-chain node in
// the Challenge section, one per handoff in the fragmented recovery chain.
const CHALLENGE_STEPS = [
  { id: 'collection', label: 'Collection', icon: Truck, tooltip: 'Picked up on a paper log - no digital record of origin.' },
  { id: 'aggregation', label: 'Aggregation', icon: Building2, tooltip: 'Re-weighed and re-labelled by hand at every dock.' },
  { id: 'trading', label: 'Trading', icon: Handshake, tooltip: 'Ownership changes hands with no shared record.' },
  { id: 'recycling', label: 'Recycling', icon: Recycle, tooltip: 'Processors have no visibility into upstream quality.' },
  { id: 'manufacturing', label: 'Manufacturing', icon: Factory, tooltip: "Buyers can't verify where the material actually came from." },
];

// Old → new pairs for the Traditional Recycling / Verified Circularity
// comparison — each old item is struck out a beat before its counterpart
// is born on the right, so the pairing order here drives that choreography.
const CIRCULARITY_PAIRS = [
  { old: 'Volume-based', new: 'Quantifiable' },
  { old: 'Limited visibility', new: 'Traceable' },
  { old: 'Manual processes', new: 'Impact-driven' },
];

// Benefit tooltips — shown on hover/focus of each lit node in the
// connected chain, one per stage of the integrated recovery flow.
const INTEGRATION_STEPS = [
  { id: 'collection', label: 'Collection', icon: Truck, tooltip: 'Recorded digitally at the source' },
  { id: 'sorting', label: 'Sorting', icon: Filter, tooltip: 'Quality graded, not guessed' },
  { id: 'processing', label: 'Processing', icon: Recycle, tooltip: 'Every batch tracked in real time' },
  { id: 'verification', label: 'Verification', icon: ShieldCheck, tooltip: 'Independently proven, not claimed' },
  { id: 'reporting', label: 'Reporting', icon: ClipboardList, tooltip: 'Compliance-ready, automatically' },
  { id: 'industrial-use', label: 'Industrial Use', icon: Factory, tooltip: 'Materials arrive with their full history' },
];

const FOUR_PILLARS = [
  { Icon: Eye, title: 'AI-Powered Hardware', desc: 'Intelligent systems that identify, sort, and capture high-quality data right at the source - where every story begins.', img: '/hardware-resource article.jpeg' },
  { Icon: ShieldCheck, title: 'Digital Traceability', desc: 'Every material carries a secure digital history that follows it across its entire recovery journey.', img: '/transparency article.png' },
  { Icon: Brain, title: 'Artificial Intelligence', desc: 'AI turns raw data into insight - better performance, better quality, better decisions.', img: '/ai-resource article.jpeg' },
  { Icon: FlaskConical, title: 'Material Science', desc: 'Ensuring recovered materials meet industrial standards and deliver real, dependable value.', img: '/ms-resource article.jpeg' },
];

// Tooltips — shown on hover/focus of each chip once verified, one per
// proof point an organization can now demonstrate.
const VERIFIED_DATA_POINTS = [
  { id: 'origin', label: 'Material Origin', tooltip: 'Where every material began its journey' },
  { id: 'pathway', label: 'Recovery Pathway', tooltip: 'The route it traveled, stage by stage' },
  { id: 'history', label: 'Processing History', tooltip: 'Every process, timestamped' },
  { id: 'content', label: 'Recycled Content', tooltip: 'Certified percentages, not estimates' },
  { id: 'carbon', label: 'Carbon Impact', tooltip: 'Emissions measured, not modeled' },
  { id: 'compliance', label: 'Compliance Documentation', tooltip: 'Audit-ready evidence, on demand' },
];

const BEYOND_COMPLIANCE = [
  {
    id: 'operational', label: 'Operational Advantage',
    items: [
      { title: 'Improve Efficiency', desc: 'Optimize operations and reduce costs with accurate, real-time data.' },
      { title: 'Strengthen Reporting', desc: 'Deliver audit-ready reports that meet global standards with ease.' },
    ],
  },
  {
    id: 'market', label: 'Market Advantage',
    items: [
      { title: 'Higher-Value Materials', desc: 'Recover better quality materials and unlock greater market value.' },
      { title: 'Enable Circular Procurement', desc: 'Make informed sourcing decisions that drive measurable impact.' },
    ],
  },
  {
    id: 'longterm', label: 'Long-Term Advantage',
    items: [
      { title: 'Supply Chain Resilience', desc: 'Enhance visibility and mitigate risks across your entire supply chain.' },
      { title: 'Stronger Industry Partnerships', desc: 'Collaborate with verified data that aligns partners and drives shared success.' },
    ],
  },
];

function goHome(e) {
  e.preventDefault();
  navigate('/');
}

// Cross-page nav to the Blog page's Latest Articles section — same
// sessionStorage handoff pattern used for in-page section links.
function goToBlogLatest(e) {
  e.preventDefault();
  sessionStorage.setItem('sw_scroll_target', 'latest-articles');
  navigate('/blog');
}

// In-page anchors stay plain scroll-into-view rather than going through
// navigate() — mirrors the same-page scroll helper already used in
// Footer.jsx, and keeps a chapter jump from ever creating a history entry.
function jumpTo(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const navH = document.querySelector('header')?.offsetHeight ?? 80;
  const y = el.getBoundingClientRect().top + window.pageYOffset - navH - 16;
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}

export default function BlogArticleResourceRecovery() {
  return (
    <article className="rr-article">
      <BrushFilterDefs />

      {/* =============== HERO =============== */}
      <section className="rr-hero">
        <div className="rr-hero__bg-veil" />
        <nav className="rr-breadcrumb" aria-label="Breadcrumb">
          <a href="/" onClick={goHome}>Home</a>
          <ChevronRight size={13} aria-hidden="true" />
          <a href="/blog" onClick={navClick('/blog')}>Blog</a>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="is-current">The Future of Resource Recovery</span>
        </nav>
        <div className="rr-hero__inner">
          <span className="rr-hero__chip">Industry Insight</span>
          <h1>The Future of Resource Recovery: Why Integrated Infrastructure and Verified Data Matter</h1>
          <p className="rr-hero__lead">
            Why integrated AI + hardware platforms and verified data - not fragmented recycling
            solutions - define the next era of industrial responsibility.
          </p>
          <div className="rr-hero__meta">
            <span><User size={14} /> By <b className="rr-hero__meta-author">Reneonix Strategy &amp; Sustainability Team</b></span>
            <span className="rr-hero__dot" aria-hidden="true">•</span>
            <span><Calendar size={14} /> March 20, 2026</span>
            <span className="rr-hero__dot" aria-hidden="true">•</span>
            <span><Clock size={14} /> 8-10 min read</span>
          </div>
        </div>
        <a href="#chapter-1" className="rr-hero__scroll-cue" onClick={(e) => jumpTo(e, 'chapter-1')}>
          Scroll to read <ChevronDown size={15} />
        </a>
      </section>

      {/* =============== CHAPTER 01 — INTRODUCTION =============== */}
      <section className="rr-intro" id="chapter-1">
        <div className="container rr-intro__text">
          <span className="rr-eyebrow rr-eyebrow--lg">Overview</span>
          <h2>Sustainability Is No Longer About <em>Intentions</em></h2>
          <p>
            Every material has a story. The steel in a machine, the plastic in a package, the
            copper in a cable - each one travels a long road before it reaches us, and an even
            longer one after we let it go. For decades, that second half of the story went
            untold. Materials disappeared into landfills, and their value disappeared with them.
          </p>
          <p>
            That story is now being rewritten. Around the world, governments, manufacturers,
            brands, and regulators are raising the bar for how materials are recovered, reused,
            and returned to the economy. Rules like{' '}
            <strong>EPR, recycled-content requirements, and carbon reporting</strong> are
            reshaping what organizations must measure - and what they must prove.
          </p>
          <p>
            Because today, sustainability is no longer a promise. It is evidence. Organizations
            must show where their materials come from, how they are processed, and the
            environmental value they truly create.
          </p>
        </div>
      </section>

      {/* =============== CHAPTER 02 — THE CHALLENGE =============== */}
      <section className="rr-chapter" id="challenge">
        <div className="container">
          <span className="rr-eyebrow">The Challenge</span>
          <h2>The Challenge with Today's Recovery Infrastructure</h2>
          <p>
            Picture the journey of a single recovered material. It is collected by one company,
            aggregated by another, traded by a third, recycled by a fourth, and finally remade
            into something new by a fifth. Five hands, five systems - and almost no shared memory
            between them.
          </p>

          <div className="rr-process-slot">
            <ProcessChain variant="broken" steps={CHALLENGE_STEPS} />
          </div>

          <p>
            This fragmentation is the industry's quiet weakness. It creates limited visibility,
            inconsistent quality, manual reporting, and compliance headaches. Organizations
            struggle to answer even the simplest questions about their materials - and about the
            impact they claim to make.
          </p>
        </div>
      </section>

      <BridgeQuote>Success was once measured by how much was recycled. Today, it is about <b>proving it</b></BridgeQuote>

      {/* =============== CHAPTER 03 — VERIFIED CIRCULARITY =============== */}
      <section className="rr-chapter" id="circularity">
        <div className="container">
          <span className="rr-eyebrow">From Recycling to Verified Circularity</span>
          <h2>Verified Data Makes Sustainability <em>Measurable</em></h2>
          <p>
            There was a time when success was measured by a single number: how much was
            recycled. That era is ending. Today, the question is not <em>how much</em> - it is{' '}
            <em>can you prove it?</em> Verified data is what turns sustainability from a claim
            into something measurable, transparent, and trustworthy.
          </p>

          <CircularityCompare pairs={CIRCULARITY_PAIRS} />

          <p>
            Modern circular-economy initiatives demand more than good intentions - they demand{' '}
            <strong>traceability, verified recycled content, carbon measurement, regulatory
            compliance, and transparent reporting</strong>, every step of the way.
          </p>
        </div>
      </section>

      {/* =============== CHAPTER 04 — WHY INTEGRATION MATTERS =============== */}
      <section className="rr-chapter" id="integration">
        <div className="container">
          <span className="rr-eyebrow">Why Integration Matters</span>
          <h2>One Connected Chain, <em>Not Six Separate Systems</em></h2>
          <p className="rr-integration-lede">
            Recovery is a relay race with many runners - and when each one runs alone, the baton
            gets dropped. Data fragments. Decisions slow down. But when the stages are connected
            into one integrated infrastructure, materials and information move together,
            seamlessly, across the entire value chain.
          </p>

          <div className="rr-process-slot">
            <IntegrationChain steps={INTEGRATION_STEPS} />
          </div>

          <p>
            Integration delivers <strong>end-to-end visibility</strong>, reduces complexity,
            improves efficiency, and enables smarter decisions at every stage of the journey.
          </p>

          <p className="rr-pull">6 stages, <strong>1 system,</strong> Every record shared </p>
        </div>
      </section>

      {/* =============== CHAPTER 05 — FOUR PILLARS =============== */}
      <section className="rr-chapter" id="pillars">
        <div className="container">
          <span className="rr-eyebrow">The Four Pillars</span>
          <h2>The Four Pillars of Intelligent Recovery</h2>
          <p>A connected recovery ecosystem doesn't stand on its own. It rests on four powerful pillars:</p>

          <div className="rr-pillars-grid">
            {FOUR_PILLARS.map(({ Icon, title, desc, img }) => (
              <div className="rr-pillar-card" key={title}>
                <div className="rr-pillar-card__media">
                  {img ? <img src={img} alt={title} /> : <ImagePlaceholder label={title} />}
                </div>
                <div className="rr-pillar-card__body">
                  <Icon size={20} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BridgeQuote>If integration is the body of the circular economy, verified data is its <b>heartbeat</b></BridgeQuote>

      {/* =============== CHAPTER 06 — VERIFIED DATA =============== */}
      <section className="rr-chapter" id="verified-data">
        <div className="container">
          <span className="rr-eyebrow">The Growing Importance of Verified Data</span>
          <h2>What Organizations Can Now <em>Demonstrate</em></h2>
          <p>
            If integration is the body of the circular economy, verified data is its heartbeat.
            It is the foundation of trust and transparency - the proof behind every claim. With
            it, organizations can confidently demonstrate:
          </p>

          <VerifiedDataChips points={VERIFIED_DATA_POINTS} />

          <p>
            Digital traceability transforms every recovered material into a{' '}
            <strong>verifiable, data-rich asset</strong> - building confidence across the entire
            ecosystem, one material at a time.
          </p>
        </div>
      </section>

      {/* =============== CHAPTER 07 — BEYOND COMPLIANCE =============== */}
      <section className="rr-chapter" id="beyond-compliance">
        <div className="container">
          <span className="rr-eyebrow">Beyond Compliance</span>
          <h2>Verified Data as a <em>Strategic Advantage</em></h2>
          <p>
            Regulation may open the door, but the real rewards lie beyond it. Verified recovery
            data creates long-term business value that outlasts any single rule or deadline:
          </p>

          <div className="rr-hub">
            <div className="rr-hub__center">
              <div className="rr-hub__halo" aria-hidden="true" />
              <div className="rr-hub__ring">
                <div className="rr-hub__core">
                  <ShieldCheck size={26} aria-hidden="true" />
                  <strong>Verified<br />Data</strong>
                  <p>The foundation for smarter decisions and stronger tomorrow</p>
                </div>
              </div>
            </div>

            {BEYOND_COMPLIANCE.map(({ id, label, items }) => (
              <div className={`rr-hub__panel-wrap rr-hub__panel-wrap--${id}`} key={id}>
                <div className="rr-hub__panel-shadow" aria-hidden="true" />
                <div className="rr-hub__panel">
                  <div className="rr-hub__panel-head">
                    <h3>{label}</h3>
                  </div>
                  <div className="rr-hub__cards">
                    {items.map(({ title, desc }) => (
                      <div className="rr-hub__card" key={title}>
                        <span className="rr-hub__check" aria-hidden="true"><Check size={12} /></span>
                        <div className="rr-hub__card-body">
                          <h4>{title}</h4>
                          <p>{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <blockquote className="rr-pull-card">
            <p>
              In this new era, verified data isn't paperwork - it's a strategic advantage that
              drives growth and sustainability together.
            </p>
          </blockquote>
        </div>
      </section>

      {/* =============== GO TO BLOG =============== */}
      <div className="rr-goto-blog">
        <ArticlePDF article={resourceRecoveryPdfData} />
        <a className="btn btn-primary" href="/blog" onClick={goToBlogLatest}>
          Back to Blog <ArrowRight size={16} />
        </a>
      </div>

    </article>
  );
}
