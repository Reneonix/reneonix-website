import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronRight, ShieldCheck, FileCheck2, Wallet, Users, RotateCcw } from 'lucide-react';
import { navClick } from '../utils/nav.js';
import './GlassManufacturersPage.css';

// Detail-box swap: how long the "is-swapping" fade-out holds before the
// caption text underneath is changed, matching the CSS fade transition.
const CAPTION_SWAP_MS = 220;
// Autoplay: once revealed, step 1 (already active) holds, then the track
// advances one step every AUTOPLAY_STEP_MS, stopping on the last step
// rather than looping — a single guided pass, not a distracting loop.
const AUTOPLAY_STEP_MS = 2200;

// "Source to Furnace, End to End" — a step tracker that plays itself once
// scrolled into view: steps stagger-reveal in (fade + rise, each delayed
// via --i), step 1 starts active with a pulsing dot, then the track
// auto-advances through the rest one at a time. Clicking any dot jumps
// straight to it (and cancels the autoplay); Replay resets to step 1,
// re-plays the stagger reveal, and restarts the auto-advance.
function HowItWorksFlow({ steps }) {
  const trackRef = useRef(null);
  const swapTimerRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState(0);
  const [swapping, setSwapping] = useState(false);

  function stopAutoplay() {
    clearInterval(autoplayTimerRef.current);
    autoplayTimerRef.current = null;
  }

  function goToStep(i, { instant = false } = {}) {
    setActive(i);
    if (instant) return;
    setSwapping(true);
    clearTimeout(swapTimerRef.current);
    swapTimerRef.current = setTimeout(() => setSwapping(false), CAPTION_SWAP_MS);
  }

  function startAutoplay() {
    stopAutoplay();
    let i = 0;
    autoplayTimerRef.current = setInterval(() => {
      i += 1;
      goToStep(i);
      if (i >= steps.length - 1) stopAutoplay();
    }, AUTOPLAY_STEP_MS);
  }

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      if (!reduceMotion) startAutoplay();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          startAutoplay();
          observer.unobserve(node);
        }
      }),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => { clearTimeout(swapTimerRef.current); stopAutoplay(); }, []);

  function selectStep(i) {
    stopAutoplay();
    if (i === active) return;
    goToStep(i);
  }

  function handleReplay() {
    stopAutoplay();
    setActive(0);
    setSwapping(false);
    // Re-trigger the CSS stagger-reveal transition from its start state —
    // toggling this via React state alone can coalesce visible→hidden→
    // visible into one render with no repaint in between, so the class is
    // removed and re-added directly on the node with a forced reflow
    // between (mirrors the vanilla-JS reference this is based on).
    const node = trackRef.current;
    if (node) {
      node.classList.remove('gm-flow-anim__track--visible');
      void node.offsetWidth;
      node.classList.add('gm-flow-anim__track--visible');
    }
    setRevealed(true);
    startAutoplay();
  }

  const progress = steps.length === 1 ? 1 : active / (steps.length - 1);

  return (
    <div className="gm-flow-anim">
      <div className="gm-flow-anim__top">
        <button type="button" className="gm-flow-anim__replay" onClick={handleReplay}>
          <RotateCcw size={13} aria-hidden="true" /> Replay
        </button>
      </div>

      <div
        className={`gm-flow-anim__track${revealed ? ' gm-flow-anim__track--visible' : ''}`}
        ref={trackRef}
      >
        <div className="gm-flow-anim__rail" aria-hidden="true">
          <div className="gm-flow-anim__rail-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <ol className="gm-flow-anim__steps">
          {steps.map((step, i) => (
            <li
              className={`gm-flow-anim__step${i === active ? ' is-active' : ''}`}
              key={step.tag}
              style={{ '--i': i }}
            >
              <button
                type="button"
                className="gm-flow-anim__node"
                onClick={() => selectStep(i)}
                aria-pressed={i === active}
                aria-label={`Step ${i + 1}: ${step.title}`}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
              <span className="gm-flow-anim__tag">{step.tag}</span>
              <h5>{step.title}</h5>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <p className={`gm-flow-anim__caption${swapping ? ' is-swapping' : ''}`} aria-live="polite">
        Step {active + 1} - {steps[active].body}
      </p>
    </div>
  );
}

const HERO_STATS = [
  { value: '98%',    label: 'Colour Detection Accuracy' },
  { value: '95%',    label: 'Brand Detection Accuracy' },
  { value: '1,200',  label: 'Bottles Sorted / Hour' },
  { value: '92%',    label: 'Recovery Rate (7-Day Avg)' },
];

const PROBLEM_ITEMS = [
  {
    title: 'Colour Confusion',
    body: 'Flint, amber, green, and mixed glass look deceptively similar under variable line lighting.',
  },
  {
    title: 'Contamination',
    body: 'Dirt, residues, and foreign materials disguise true quality.',
  },
  {
    title: 'Damaged or Missing Labels',
    body: 'Removes the clues traditional sorting depends on.',
  },
  {
    title: 'No Proof of Origin',
    body: "Manufacturers can't verify recycled content, so they can't underwrite it as raw material.",
  },
];

const PROBLEM_STATS = [
  {
    value: '60–70%',
    body: 'Typical accuracy of traditional glass sorting - human eyes and basic colour sensors. Even small classification errors lock recovered glass into low-grade uses.',
  },
  {
    value: '3×',
    body: 'Value gap between food-grade cullet and downcycled mixed glass.',
    sm: true,
  },
];

const SOLUTION_BLOCKS = [
  {
    num: '01',
    tag: 'Hardware',
    title: 'MRM (AI) - Front-End Material Recovery',
    body: 'A bottle is deposited, and within milliseconds integrated sensors and on-edge AI vision detect material type, colour, condition, and contamination - no waiting for a downstream MRF to sort it.',
    imgLabel: 'MRM (AI) unit installed at a glass manufacturer\'s intake point',
    img: '/step1 solution.png',
    // Portrait-ish product shot (1.25:1) in this landscape (~1.7:1) card —
    // object-fit:cover was cropping the top branding bar and base feet off.
    // "contain" instead so the whole uploaded photo stays visible.
    imgFit: 'contain',
    href: '/solutions/hardware',
    type: 'chips',
    chips: [
      { b: '98.7%', label: 'avg confidence' },
      { b: '462', label: 'items / min' },
      { b: '450–500+', label: 'bottles / cycle, reuse' },
      { b: '250 kg', label: '/ cycle, recycling' },
    ],
  },
  {
    num: '02',
    tag: 'Hardware',
    title: 'AI Vision Sorting - Industrial-Grade Classification',
    body: 'Reads a full profile per bottle - colour, shape, brand, surface condition, structural integrity - and assigns a confidence score, all in real time.',
    imgLabel: 'AI vision overlay identifying a glass bottle by colour, shape and confidence score',
    img: '/step2 solution.png',
    href: '/solutions/hardware',
    type: 'table',
    table: {
      head: ['Capability', 'Traditional', 'Reneonix AI'],
      rows: [
        ['Detection basis', 'Colour only', 'Colour + material + shape + brand'],
        ['Accuracy', '~60–70%', 'Up to 98%'],
        ['Speed', 'Manual-dependent', 'Real-time, line speed'],
      ],
    },
  },
  {
    num: '03',
    tag: 'Software',
    title: 'Retraiz (TraceOS) - Batch-Level Traceability',
    body: "Every batch gets a unique digital identity that follows it from source to dispatch - AI-verified, blockchain-proofed, immutable. Recycled-content claims, EPR reports, and carbon attribution are one click away.",
    imgLabel: 'Retraiz dashboard showing a glass batch - source, characterisation, and recovery status',
    img: '/retriaz-sample-dashboard.jpg',
    // Dashboard screenshot — cover was slicing the title bar off the top
    // and detection-history rows off the bottom. Real UI text at the
    // edges makes cropping worse here than on a plain photo, so show it
    // uncropped like the step-01 MRM shot.
    imgFit: 'contain',
    href: '/solutions/software',
    type: 'chips',
    chips: [
      { b: '92%', label: 'recovery rate (+8%)' },
      { b: 'A grade', label: 'material quality (+12%)' },
      { b: '98.5%', label: 'uptime (+3%)' },
    ],
  },
  {
    num: '04',
    tag: 'Material Science',
    title: "Material Science - A Pathway for What's Left Over",
    body: 'Residual glass fines (sub-4mm) are formulated and tested into foam glass insulation. We\'re also exploring converting byproduct silica dust into glass-feed granules, targeting a >50% raw-material cost reduction versus virgin silica sand.',
    imgLabel: 'Foam glass insulation blocks made from residual glass fines',
    img: '/step4 solution.png',
    href: '/solutions/material-science',
    type: 'none',
  },
];

const FLOW_STEPS = [
  { tag: 'Source',   title: 'Smart Intake',        body: "MRM scans the bottle the moment it's deposited." },
  { tag: 'Identify', title: 'AI Vision Read',       body: 'Colour, brand, shape, condition - in milliseconds.' },
  { tag: 'Sort',      title: 'Route by Confidence',  body: 'Reuse or recycling pathway assigned automatically.' },
  { tag: 'Trace',     title: 'Log to Retraiz',       body: 'Immutable, source-to-dispatch record.' },
  { tag: 'Validate',  title: 'COA-Ready Output',     body: 'EPR-compliant, underwritable raw material.' },
  { tag: 'Extend',    title: 'Material Science',     body: 'Residual fines routed to foam glass R&D.' },
];

const VP_BREAKDOWN = [
  { label: 'Glass',   value: '42.6%', color: 'var(--lime)' },
  { label: 'Plastic', value: '31.8%', color: '#5B9DF5' },
  { label: 'Metal',   value: '14.2%', color: 'rgba(255,255,255,.55)' },
  { label: 'Other',   value: '11.4%', color: 'rgba(255,255,255,.3)' },
];

const VP_FEATURES = [
  { title: 'Object detection',   body: 'Identifies material instances' },
  { title: 'Stream analysis',    body: 'Aggregates detections' },
  { title: 'Confidence scoring', body: 'Model confidence per item' },
  { title: 'Real-time insight',  body: 'Continuous monitoring' },
];

const WHY_ITEMS = [
  { Icon: ShieldCheck, title: 'De-Risk Recycled Content', body: 'Commit to recycled-input targets on evidence, not estimates.' },
  { Icon: FileCheck2,  title: 'Meet EPR Obligations in Real Time', body: 'Retraiz keeps compliance documentation audit-ready on demand.' },
  { Icon: Wallet,      title: 'Reduce Raw Material Cost', body: 'Silica dust → glass-feed pathway targets >50% cost reduction.' },
  { Icon: Users,       title: 'One Partner, Full Stack', body: 'Hardware, AI sortation, traceability, and material science, integrated.' },
];

export default function GlassManufacturersPage() {
  const railWrapRef = useRef(null);
  const railRef = useRef(null);
  const railFillRef = useRef(null);
  const vpVideoRef = useRef(null);

  // AI Vision Prototype demo video - plays while scrolled into view,
  // pauses otherwise (matches the proof video on SolutionsPage).
  useEffect(() => {
    const video = vpVideoRef.current;
    if (!video) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.3 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // The rail's track must span exactly from the first step-circle's center
  // to the last one's - not the wrap's full box - because the step rows
  // don't share a height (the image column can be taller than the text),
  // so a fixed CSS top/bottom offset overshoots past the last circle.
  useEffect(() => {
    const wrap = railWrapRef.current;
    const rail = railRef.current;
    const fill = railFillRef.current;
    if (!wrap || !rail || !fill) return;

    function positionRail() {
      const nums = wrap.querySelectorAll('.gm-step-num');
      if (nums.length < 2) return;
      const wrapRect = wrap.getBoundingClientRect();
      const firstRect = nums[0].getBoundingClientRect();
      const lastRect = nums[nums.length - 1].getBoundingClientRect();
      const top = (firstRect.top + firstRect.height / 2) - wrapRect.top;
      const bottom = (lastRect.top + lastRect.height / 2) - wrapRect.top;
      rail.style.top = `${top}px`;
      rail.style.height = `${bottom - top}px`;
    }

    function updateRail() {
      // Re-measure every tick, not just once - the step circles start
      // offset by the scroll-reveal's translateY(24px) (they're below the
      // fold at mount) and settle into their true position later, which
      // would otherwise leave the rail's cached end point stale.
      positionRail();
      const rect = rail.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const scrolled = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
      fill.style.height = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    }

    updateRail();
    window.addEventListener('scroll', updateRail, { passive: true });
    window.addEventListener('resize', updateRail);
    return () => {
      window.removeEventListener('scroll', updateRail);
      window.removeEventListener('resize', updateRail);
    };
  }, []);

  // Page-local reveal - see the note in the effects below: this page is
  // lazy-loaded, so it mounts after SiteEffects' route-keyed
  // IntersectionObserver has already run and can never see these nodes.
  useLayoutEffect(() => {
    const vh = window.innerHeight;
    document.querySelectorAll('.gm-reveal').forEach((el) => {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < vh && bottom > 0) el.classList.add('gm-in');
    });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('gm-in');
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.gm-reveal:not(.gm-in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="gm-page">

      {/* ── HERO ── */}
      <section className="gm-hero">
        <div className="gm-hero__bg-veil" aria-hidden="true" />

        <nav className="gm-breadcrumb" aria-label="Breadcrumb">
          <a href="/" onClick={navClick('/')}>Home</a>
          <ChevronRight size={13} aria-hidden="true" />
          <a href="/industries" onClick={navClick('/industries')}>Industries</a>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="is-current">Glass Manufacturers</span>
        </nav>

        <div className="gm-hero__inner">
          <span className="gm-hero__chip">Industry · Glass Manufacturers</span>
          <h1>
            Glass Is Our <em>First Commercial Deployment</em>
          </h1>
          <p className="gm-hero__tagline">
            From ungraded cullet to spec-grade raw material - identified at source, verified at
            every step, ready for your furnace.
          </p>
          <p className="gm-hero__lead">
            Reneonix gives glass manufacturers a secondary raw material supply they can actually
            underwrite - sorted with 98% colour accuracy, traced batch-by-batch, and backed by a
            growing material science pipeline that turns even residual glass into value.
          </p>
          <div className="gm-hero__cta">
            <a href="/contact-us" onClick={navClick('/contact-us')} className="btn btn-primary">
              Talk to our team
            </a>
            <a href="/solutions" onClick={navClick('/solutions')} className="btn btn-outline-light">
              See the Technology
            </a>
          </div>

          <div className="gm-hero__stats gm-hero__stats--hidden">
            {HERO_STATS.map(({ value, label }) => (
              <div className="gm-hero__stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="gm-problem-grid">
            <div className="gm-problem-col">
              <div className="section-head gm-reveal" style={{ margin: '0 0 32px', textAlign: 'left', maxWidth: 'none' }}>
                <span className="eyebrow">The Problem</span>
                <h2>A Bottle's Worth Is Lost in the <em>First Ten Minutes</em></h2>
                <p style={{ textAlign: 'justify' }}>
                  A recovered bottle starts out clean, intact, food-grade glass - at its highest
                  possible value. Then it lands in a mixed collection stream, and everything
                  conventional recovery does next works against it.
                </p>
              </div>

              <div className="gm-problem-cards gm-reveal">
                {PROBLEM_ITEMS.map(({ title, body }) => (
                  <div className="gm-problem-card" key={title}>
                    <h4>{title}</h4>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="gm-problem-side gm-reveal">
              <div className="gm-problem-media">
                <img src="/Glass Industry 1.jpg" alt="Pile of mixed, contaminated cullet before AI sorting" loading="lazy" decoding="async" />
                <span className="gm-problem-media__caption">Mixed, contaminated cullet - before AI sorting</span>
              </div>
              <div className="gm-problem-stats">
                {PROBLEM_STATS.map(({ value, body, sm }) => (
                  <div className={sm ? 'gm-stat-card gm-stat-card--sm' : 'gm-stat-card'} key={value}>
                    <div className="gm-stat-card__big">{value}</div>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE RENEONIX SOLUTION ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head gm-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">The Reneonix Solution</span>
            <h2>Identify First, Collect Second - <em>Not the Other Way Around</em></h2>
            <p>
              Most recovery infrastructure was built around "collect first, sort later." We
              rebuilt it around the opposite idea: valuable materials should be identified,
              classified, and verified the moment they enter the recovery chain.
            </p>
          </div>

          <div className="gm-rail-wrap" ref={railWrapRef}>
            <div className="gm-rail" ref={railRef}><div className="gm-rail-fill" ref={railFillRef} /></div>

            {SOLUTION_BLOCKS.map((block) => (
              <div className="gm-step gm-reveal" key={block.num}>
                <div className="gm-step-num">{block.num}</div>

                <div className="gm-step-content">
                  <span className="gm-row__tag">{block.tag}</span>
                  <h3>{block.title}</h3>
                  <p>{block.body}</p>

                  {block.type === 'chips' && (
                    <div className="gm-chip-row">
                      {block.chips.map(({ b, label }) => (
                        <span className="gm-chip" key={label}><b>{b}</b> {label}</span>
                      ))}
                    </div>
                  )}

                  {block.type === 'table' && (
                    <div className="gm-table-wrap">
                      <table className="gm-table">
                        <thead>
                          <tr>{block.table.head.map((h) => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {block.table.rows.map((row) => (
                            <tr key={row[0]}>
                              <td>{row[0]}</td>
                              <td>{row[1]}</td>
                              <td className="gm-table__hl">{row[2]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <a href={block.href} onClick={navClick(block.href)} className="btn-text-link">
                    Explore {block.tag}
                    <ChevronRight size={16} aria-hidden="true" />
                  </a>
                </div>

                <div className="gm-step-visual">
                  <div className={`gm-step-visual-card${block.imgFit === 'contain' ? ' gm-step-visual-card--contain' : ''}`}>
                    {block.img && <img src={block.img} alt={block.imgLabel} loading="lazy" decoding="async" />}
                    <span className="gm-step-visual-card__caption">{block.imgLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head gm-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">How It Works</span>
            <h2>Source to Furnace, <em>End to End</em></h2>
          </div>

          <HowItWorksFlow steps={FLOW_STEPS} />
        </div>
      </section>

      {/* ── WHY THIS MATTERS ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head gm-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">Why This Matters</span>
            <h2>What This Means <em>For Your Business</em></h2>
          </div>

          <div className="gm-why-grid">
            {WHY_ITEMS.map(({ Icon, title, body }, i) => (
              <div className="card gm-reveal" key={title} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="card__icon"><Icon size={26} aria-hidden="true" /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF IN THE FIELD ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head gm-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">Proof in the Field</span>
            <h2>Validated at MRF Sites, <em>Moving to Production</em></h2>
          </div>

          <div className="gm-proof gm-reveal">
            <p>
              Reneonix's glass sorting technology is live and in active commercial discussion,
              including a signed MOU for glass sorter deployment and pilot conversations with
              major industrial glass manufacturers evaluating AI-vision QC and Retraiz integration.
            </p>
            <div className="gm-proof__quote">
              Late-stage R&amp;D, validated at MRF sites, with production deployment underway.
            </div>
          </div>

          {/* ── AI Vision Prototype demo ── */}
          <div className="gm-vp gm-reveal">
            <div className="gm-vp__head">
              <span className="gm-vp-chip">AI Vision Prototype</span>
              <h3>Turn incoming waste into <em>material intelligence.</em></h3>
              <p>
                A prototype demonstration of Reneonix AI vision analysing an incoming material
                stream and estimating its composition in real time.
              </p>
            </div>

            <div className="gm-vp__grid">
              <div className="gm-vp__cam">
                <span className="gm-vp-cam-badge">Live AI Analysis <i>· Prototype</i></span>
                <video
                  ref={vpVideoRef}
                  className="gm-vp__cam-video"
                  src="/prototype video.mp4"
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                />
              </div>

              <div className="gm-vp__panel">
                <div className="gm-vp__panel-head">
                  <span>Incoming Material Stream</span>
                  <span className="gm-vp-pill">POC / Demo</span>
                </div>
                <h4>AI composition analysis</h4>

                <div className="gm-vp-stat">
                  <div className="gm-vp-stat__row">
                    <span>Estimated glass content</span>
                    <span className="gm-vp-stat__tag">AI detected</span>
                  </div>
                  <div className="gm-vp-stat__value">42.6%<small>Glass</small></div>
                  <div className="gm-vp-stat__bar"><div style={{ width: '42.6%' }} /></div>
                </div>

                <ul className="gm-vp-breakdown">
                  {VP_BREAKDOWN.map(({ label, value, color }) => (
                    <li key={label}>
                      <span className="gm-vp-breakdown__dot" style={{ background: color }} />
                      {label}
                      <b>{value}</b>
                    </li>
                  ))}
                </ul>

                <div className="gm-vp-features">
                  {VP_FEATURES.map(({ title, body }) => (
                    <div className="gm-vp-features__item" key={title}>
                      <h6>{title}</h6>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="gm-vp__foot">
              <div>
                <h5>How the prototype works</h5>
                <p>Camera observes stream → AI detects material types → detections are aggregated → composition estimate.</p>
              </div>
              <div>
                <h5>AGI pilot use case</h5>
                <p>Demonstrates how Reneonix can help a recovery facility understand incoming material before downstream processing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to Turn Recovered Glass Into <em>Raw Material You Can Rely On?</em></h2>
            <p>Let's talk about a pilot deployment for your facility.</p>
            <div className="btn-cta-row">
              <a
                href="/contact-us"
                onClick={navClick('/contact-us')}
                className="btn btn-outline-dark"
                style={{ background: 'var(--ink)', color: 'var(--white)', borderColor: 'var(--ink)' }}
              >
                Get in touch
                <ChevronRight size={16} aria-hidden="true" />
              </a>
              <a href="/contact-us" onClick={navClick('/contact-us')} className="btn btn-outline-dark">
                Download capability overview
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
