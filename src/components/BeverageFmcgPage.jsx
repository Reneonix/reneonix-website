import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ChevronRight, ChevronDown, ShieldCheck, FileCheck2, Recycle, Users,
  Search, Lock, ScanLine, Boxes, Target,
  Repeat, Split, PackageCheck, Fingerprint, Waypoints, BarChart3, Leaf,
} from 'lucide-react';
import { navClick } from '../utils/nav.js';
import './BeverageFmcgPage.css';

// "The Journey of Every Returned Container" — a vertical accordion: a
// numbered rail down the left, one row expanded at a time into a
// highlighted panel (full copy + a 3-up feature row), the rest collapsed to
// a one-line preview with a chevron. A benefits row sits below the list.
function HowItWorksJourney({ steps }) {
  const [openIndex, setOpenIndex] = useState(0);
  const listRef = useRef(null);
  const railRef = useRef(null);
  const railFillRef = useRef(null);

  // Row heights change as the open panel swaps in/out, so the rail's
  // left/top/height/fill are all re-measured from the actual circle
  // positions on every openIndex change, not computed from fixed offsets.
  useLayoutEffect(() => {
    const list = listRef.current;
    const rail = railRef.current;
    const fill = railFillRef.current;
    if (!list || !rail || !fill) return;

    function position() {
      const nums = list.querySelectorAll('.bf-journey2__num');
      if (nums.length < 2) return;
      const listRect = list.getBoundingClientRect();
      const firstRect = nums[0].getBoundingClientRect();
      const lastRect = nums[nums.length - 1].getBoundingClientRect();
      const activeRect = nums[openIndex].getBoundingClientRect();

      const left = (firstRect.left + firstRect.width / 2) - listRect.left;
      const top = (firstRect.top + firstRect.height / 2) - listRect.top;
      const bottom = (lastRect.top + lastRect.height / 2) - listRect.top;
      const activeCenter = (activeRect.top + activeRect.height / 2) - listRect.top;

      rail.style.left = `${left}px`;
      rail.style.top = `${top}px`;
      rail.style.height = `${bottom - top}px`;
      fill.style.height = `${Math.max(activeCenter - top, 0)}px`;
    }

    position();
    window.addEventListener('resize', position);
    return () => window.removeEventListener('resize', position);
  }, [openIndex]);

  return (
    <div className="bf-journey2">
      <div className="bf-journey2__list" ref={listRef}>
        <div className="bf-journey2__rail" ref={railRef} aria-hidden="true">
          <div className="bf-journey2__rail-fill" ref={railFillRef} />
        </div>

        {steps.map((s, i) => {
          const isOpen = i === openIndex;
          return (
            <div className={`bf-journey2__row${isOpen ? ' is-open' : ''}`} key={s.tag}>
              <span className="bf-journey2__num">{String(i + 1).padStart(2, '0')}</span>

              <button
                type="button"
                className="bf-journey2__head"
                onClick={() => setOpenIndex(i)}
                aria-expanded={isOpen}
              >
                <span className="bf-journey2__label">
                  <span className="bf-journey2__tag">{s.tag}</span>
                  <span className="bf-journey2__step-title">{s.stepLabel}</span>
                </span>

                {isOpen ? (
                  <span className="bf-journey2__panel">
                    <span className="bf-journey2__copy">
                      <span className="bf-journey2__heading">{s.stepLabel}</span>
                      <span className="bf-journey2__body">{s.body}</span>
                    </span>
                    <span className="bf-journey2__divider" aria-hidden="true" />
                    <span className="bf-journey2__features">
                      {s.features.map(({ Icon, title, body }) => (
                        <span className="bf-journey2__feature" key={title}>
                          <span className="bf-journey2__feature-icon"><Icon size={18} aria-hidden="true" /></span>
                          <span className="bf-journey2__feature-title">{title}</span>
                          <span className="bf-journey2__feature-body">{body}</span>
                        </span>
                      ))}
                    </span>
                  </span>
                ) : (
                  <span className="bf-journey2__collapsed">
                    <span className="bf-journey2__preview">{s.body}</span>
                    <ChevronDown size={18} className="bf-journey2__chev" aria-hidden="true" />
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const HERO_STATS = [
  { value: '95%',      label: 'Brand Detection Accuracy' },
  { value: '92%',      label: 'Recovery Rate (7-Day Avg)' },
  { value: 'Apr 2026', label: 'EPR Scope Expands to Glass, Paper, Metal' },
];

const PROBLEM_ITEMS = [
  {
    num: '01',
    title: 'Fragmented Recovery Chains',
    body: 'Packaging moves through collectors, aggregators, and traders with no shared record.',
  },
  {
    num: '02',
    title: 'No Proof of Recycled Content',
    body: 'Claims about recycled-content percentages are difficult to substantiate with auditable data.',
  },
  {
    num: '03',
    title: 'Manual, Reactive EPR Reporting',
    body: 'Compliance documentation reconstructed from spreadsheets, after the fact.',
  },
  {
    num: '04',
    title: 'Rising Regulatory Exposure',
    body: "India's EPR Rules 2024 expanded scope to glass, paper, and metal, effective April 2026.",
  },
];

const SOLUTION_BLOCKS = [
  {
    num: '01',
    tag: 'Hardware',
    title: 'Brand-Level Identification at the Point of Recovery',
    body: 'Our MRM (AI) hardware identifies brand at the moment a bottle is deposited, using label recognition, bottle geometry, and embossing.',
    imgLabel: 'MRM (AI) hardware scanning bottles and cans on the recovery line, with detection dashboards monitored in real time',
    img: '/fmcg hardware.webp',
    href: '/solutions/hardware',
    chips: [
      { b: '95%', label: 'brand detection accuracy' },
      { b: '98%', label: 'material / colour accuracy' },
    ],
  },
  {
    num: '02',
    tag: 'Software',
    title: 'Retraiz (TraceOS) - Your Recycled-Content Proof, on Demand',
    quote: "The batch doesn't just move through the facility. Its story is written, verified and sealed - automatically, at every step.",
    imgLabel: 'Retraiz recycled-content traceability dashboard — batch overview, recovery score, packaging composition, and EPR-compliant grade classification',
    img: '/fmcg software.webp',
    // Dashboard screenshot with content flush to every edge (sidebar, top
    // bar, batch history table) — cover would crop it, so show it whole,
    // same fix used for the equivalent dashboard shot on the Glass page.
    imgFit: 'contain',
    href: '/solutions/software',
    chips: [
      { b: 'Verification', label: 'recycled-content' },
      { b: 'Carbon attribution', label: '+ EPR credit' },
      { b: 'Live', label: 'recovery dashboards' },
    ],
  },
  {
    num: '03',
    tag: 'Full-Stack',
    title: 'Full-Stack Recovery, Not a Single Point Solution',
    body: 'Most vendors serving brands operate in one slice - hardware, or software, or MRF operations. Reneonix runs the full stack, integrated, so one partner is accountable for the whole chain from collection to verified output.',
    imgLabel: 'Full-stack recovery infrastructure — AI scanning hardware, technician dashboards, and baled recycled material in one facility',
    img: '/fmcg fullstack.webp',
    href: '/solutions',
  },
];

const HOW_STEPS = [
  {
    tag: 'Recovery',
    stepLabel: 'Smart Collection',
    body: "Returned containers are securely received through Reneonix's Material Recovery Machine (MRM), where AI-powered intake begins the recovery journey.",
    features: [
      { Icon: ShieldCheck, title: 'Secure Intake', body: 'Safe container deposit with a tamper-proof intake system.' },
      { Icon: ScanLine, title: 'Edge AI Scan', body: 'High-speed scanning captures every detail instantly.' },
      { Icon: FileCheck2, title: 'Digital Registration', body: 'Each container is assigned a unique digital ID for seamless tracking.' },
    ],
  },
  {
    tag: 'Identify',
    stepLabel: 'AI Brand Recognition',
    body: 'Computer vision instantly identifies brand, material, bottle type, colour and condition with exceptional accuracy.',
    features: [
      { Icon: Search, title: 'Multi-Point Scan', body: 'Reads label, shape, and embossing in a single pass.' },
      { Icon: Target, title: '95% Accuracy', body: 'Brand and material confirmed at the point of recovery.' },
      { Icon: Boxes, title: 'Condition Grading', body: 'Flags damage that affects the recovery pathway.' },
    ],
  },
  {
    tag: 'Route',
    stepLabel: 'Intelligent Routing',
    body: 'AI decides the highest-value recovery pathway for every container - refill, recycle, secondary recovery or reject.',
    features: [
      { Icon: Repeat, title: 'Refill Priority', body: 'Intact containers are protected for reuse first.' },
      { Icon: Split, title: 'Material Sorting', body: 'PET, aluminium, and cartons separated automatically.' },
      { Icon: PackageCheck, title: 'No Manual Sorting', body: 'Pathway decisions happen without human handling.' },
    ],
  },
  {
    tag: 'Trace',
    stepLabel: 'Digital Chain of Custody',
    body: 'Every movement is recorded in Retraiz, creating an immutable and transparent digital trail from intake to final processing.',
    features: [
      { Icon: Fingerprint, title: 'Unique Batch ID', body: 'Every batch is uniquely identified and sealed.' },
      { Icon: Lock, title: 'Immutable Record', body: "Data can't be altered once verified and logged." },
      { Icon: Waypoints, title: 'Source to Dispatch', body: 'Full chain-of-custody, visible end to end.' },
    ],
  },
  {
    tag: 'Report',
    stepLabel: 'Sustainability Insights',
    body: 'Real-time dashboards and reports provide actionable insights for EPR compliance, ESG goals, recycled content and carbon impact.',
    features: [
      { Icon: BarChart3, title: 'Live Dashboards', body: 'Recovery data updates in real time.' },
      { Icon: Leaf, title: 'Carbon Attribution', body: 'Recovery impact quantified per batch.' },
      { Icon: FileCheck2, title: 'EPR-Ready', body: 'Compliance documentation generated automatically.' },
    ],
  },
];

const PROOF_LOGOS = [
  {
    name: 'Coca-Cola India',
    body: 'Pilot discussion for PET traceability software via Retraiz.',
    stage: 'Pilot Discussion',
  },
  {
    name: 'Pernod Ricard India',
    body: 'Pilot discussion combining TraceOS with our AI Glass Sorter.',
    stage: 'Pilot Discussion',
  },
];

const WHY_ITEMS = [
  { Icon: ShieldCheck, title: 'Publish Claims You Can Defend', body: 'Recycled-content and carbon data backed by batch-level, AI-verified records.' },
  { Icon: FileCheck2,  title: 'Get Ahead of EPR Expansion', body: 'Compliance documentation ready before a regulator or auditor asks.' },
  { Icon: Recycle,     title: 'Protect Your Highest-Value Pathway', body: 'Brand-level ID routes intact containers to reuse/refill, not just recycling.' },
  { Icon: Users,       title: 'One Accountable Partner', body: 'Hardware, software, and material science under a single stack.' },
];

export default function BeverageFmcgPage() {
  const [activeStep, setActiveStep] = useState(0);

  // Page-local reveal — this page is lazy-loaded, so it mounts after
  // SiteEffects' route-keyed IntersectionObserver has already run and can
  // never see these nodes (same fix as the other industry pages).
  useLayoutEffect(() => {
    const vh = window.innerHeight;
    document.querySelectorAll('.bf-reveal').forEach((el) => {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < vh && bottom > 0) el.classList.add('bf-in');
    });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bf-in');
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.bf-reveal:not(.bf-in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="bf-page">

      {/* ── HERO ── */}
      <section className="bf-hero">
        <div className="bf-hero__bg-veil" aria-hidden="true" />

        <nav className="bf-breadcrumb" aria-label="Breadcrumb">
          <a href="/" onClick={navClick('/')}>Home</a>
          <ChevronRight size={13} aria-hidden="true" />
          <a href="/industries" onClick={navClick('/industries')}>Industries</a>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="is-current">Beverage & FMCG Brands</span>
        </nav>

        <div className="bf-hero__inner">
          <h1>
            Your Packaging Doesn't Stop Being Your Responsibility <em>at the Point of Sale</em>
          </h1>
          <p className="bf-hero__tagline">
            Verified recovery, traceable recycled content, and audit-ready EPR reporting.
          </p>
          <p className="bf-hero__lead">
            Reneonix gives beverage and FMCG brands sustainability claims backed by data, not
            estimates - from the moment your packaging re-enters the recovery chain to the report
            you hand a regulator.
          </p>
          <div className="bf-hero__cta">
            <a href="/contact-us" onClick={navClick('/contact-us')} className="btn btn-primary">
              Talk to our team
            </a>
            <a href="/solutions" onClick={navClick('/solutions')} className="btn btn-outline-light">
              See the Technology
            </a>
          </div>

          <div className="bf-hero__stats bf-hero__stats--hidden">
            {HERO_STATS.map(({ value, label }) => (
              <div className="bf-hero__stat" key={label}>
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
          <div className="section-head bf-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">The Problem</span>
            <h2>Success Was Once Measured by How Much Was Recycled, <em>Today, It Is About Proving It</em></h2>
            <p>
              Regulators, retailers, and consumers are all asking brands the same question: can
              you prove where your packaging goes after the point of sale? For most beverage and
              FMCG companies, the honest answer is no - not with confidence.
            </p>
          </div>

          <div className="bf-problem-grid">
            <div className="bf-problem-cards bf-reveal">
              {PROBLEM_ITEMS.map(({ num, title, body }) => (
                <div className="bf-problem-card" key={num}>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>

            <div className="bf-problem-media bf-reveal">
              <img
                src="/fmcg problem.webp"
                alt="Mixed post-consumer packaging stream at collection — brand labels no longer distinguishable"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE RENEONIX SOLUTION ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="bf-approach bf-reveal">

            <div className="bf-approach__left">
              <span className="eyebrow">The Reneonix Solution</span>
              <h2>Recovery Infrastructure That Reports Back to You, <em>Not Just to a Recycler</em></h2>
              <p className="bf-approach__lead">
                Reneonix isn't a recycling vendor you hand packaging to and lose sight of. We
                identify, sort, and trace your packaging from the moment it re-enters the recovery
                chain - and hand the data back to you.
              </p>

              <div className="bf-approach__steps">
                {SOLUTION_BLOCKS.map((block, i) => (
                  <div
                    key={block.num}
                    className={`bf-approach__step${i === activeStep ? ' is-active' : ''}`}
                  >
                    <div className="bf-approach__step-circle-col">
                      <span className="bf-approach__step-circle">{block.num}</span>
                    </div>

                    <div className="bf-approach__step-content">
                      <button
                        type="button"
                        className="bf-approach__step-header"
                        onClick={() => setActiveStep(i)}
                        onMouseEnter={() => setActiveStep(i)}
                      >
                        <span className="bf-approach__step-title">{block.title}</span>
                        <ChevronDown
                          size={16}
                          className={`bf-approach__step-chevron${i === activeStep ? ' is-open' : ''}`}
                          aria-hidden="true"
                        />
                      </button>

                      {i === activeStep && (
                        <div className="bf-approach__step-desc">
                          {block.quote && <div className="bf-approach__step-quote">"{block.quote}"</div>}
                          {block.body && <p>{block.body}</p>}

                          {block.chips && (
                            <div className="bf-approach__step-chips">
                              {block.chips.map(({ b, label }) => (
                                <span className="bf-approach__step-chip" key={label}><b>{b}</b> {label}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bf-approach__right">
              <div className="bf-approach__media">
                {SOLUTION_BLOCKS.map((block, i) => (
                  <img
                    key={block.num}
                    src={block.img}
                    alt={block.imgLabel}
                    className={`bf-approach__media-img${i === activeStep ? ' is-active' : ''}${block.imgFit === 'contain' ? ' bf-approach__media-img--contain' : ''}`}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                <div className="bf-approach__media-dots" aria-hidden="true">
                  {SOLUTION_BLOCKS.map((block, i) => (
                    <span
                      key={block.num}
                      className={`bf-approach__media-dot${i === activeStep ? ' is-active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head bf-reveal">
            <span className="eyebrow">How It Works</span>
            <h2>The Journey of Every <em>Returned Container</em></h2>
            <p>
              From consumer return to verified circularity, Reneonix tracks every container
              through an intelligent recovery workflow - giving your brand complete visibility
              and audit-ready sustainability data.
            </p>
          </div>

          <div className="bf-reveal">
            <HowItWorksJourney steps={HOW_STEPS} />
          </div>
        </div>
      </section>

      {/* ── PROOF IN THE FIELD ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head bf-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">Proof in the Field</span>
            <h2>Active Engagement With Major Beverage and Spirits <em>Brands</em></h2>
          </div>

          <div className="bf-proof-logos bf-reveal">
            {PROOF_LOGOS.map(({ name, body, stage }) => (
              <div className="bf-logo-card" key={name}>
                <div className="bf-logo-ph">Brand Logo Placeholder</div>
                <h4>{name}</h4>
                <p>{body}</p>
                <span className="bf-logo-card__stage">{stage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY THIS MATTERS ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head bf-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">Why This Matters</span>
            <h2>For Your <em>Business</em></h2>
          </div>

          <div className="bf-why-grid">
            {WHY_ITEMS.map(({ Icon, title, body }, i) => (
              <div className="card bf-reveal" key={title} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="card__icon"><Icon size={26} aria-hidden="true" /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to Know Exactly Where Your Packaging Goes - <em>and Prove It?</em></h2>
            <p>Let's talk about a pilot for your brand's recovery footprint.</p>
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
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
