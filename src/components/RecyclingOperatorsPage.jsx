import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ChevronRight, ChevronDown, TrendingUp, Users2, ShieldCheck, Gauge,
  ScanLine, FileCheck2, Search, Target, Split, Repeat, PackageCheck,
  Fingerprint, Lock, Waypoints, BarChart3,
} from 'lucide-react';
import { navClick } from '../utils/nav.js';
import './RecyclingOperatorsPage.css';

// "In Your Facility" — a vertical accordion: a numbered rail down the left,
// one row expanded at a time into a highlighted panel (full copy + a 3-up
// feature row), the rest collapsed to a one-line preview with a chevron.
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
      const nums = list.querySelectorAll('.ro-journey2__num');
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
    <div className="ro-journey2">
      <div className="ro-journey2__list" ref={listRef}>
        <div className="ro-journey2__rail" ref={railRef} aria-hidden="true">
          <div className="ro-journey2__rail-fill" ref={railFillRef} />
        </div>

        {steps.map((s, i) => {
          const isOpen = i === openIndex;
          return (
            <div className={`ro-journey2__row${isOpen ? ' is-open' : ''}`} key={s.tag}>
              <span className="ro-journey2__num">{String(i + 1).padStart(2, '0')}</span>

              <button
                type="button"
                className="ro-journey2__head"
                onClick={() => setOpenIndex(i)}
                aria-expanded={isOpen}
              >
                <span className="ro-journey2__label">
                  <span className="ro-journey2__tag">{s.tag}</span>
                  <span className="ro-journey2__step-title">{s.stepLabel}</span>
                </span>

                {isOpen ? (
                  <span className="ro-journey2__panel">
                    <span className="ro-journey2__copy">
                      <span className="ro-journey2__heading">{s.stepLabel}</span>
                      <span className="ro-journey2__body">{s.body}</span>
                    </span>
                    <span className="ro-journey2__divider" aria-hidden="true" />
                    <span className="ro-journey2__features">
                      {s.features.map(({ Icon, title, body }) => (
                        <span className="ro-journey2__feature" key={title}>
                          <span className="ro-journey2__feature-icon"><Icon size={18} aria-hidden="true" /></span>
                          <span className="ro-journey2__feature-title">{title}</span>
                          <span className="ro-journey2__feature-body">{body}</span>
                        </span>
                      ))}
                    </span>
                  </span>
                ) : (
                  <span className="ro-journey2__collapsed">
                    <span className="ro-journey2__preview">{s.body}</span>
                    <ChevronDown size={18} className="ro-journey2__chev" aria-hidden="true" />
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

const PROBLEM_ITEMS = [
  {
    num: '01',
    title: 'Mixed, Contaminated Intake',
    body: 'By the time material reaches your line, quality has already eroded.',
  },
  {
    num: '02',
    title: 'High Manual Sorting Effort',
    body: 'Human eyes and basic sensors run at roughly 60–70% accuracy.',
  },
  {
    num: '03',
    title: 'Inconsistent Output Quality',
    body: "Mixed purity means more rework and buyers who can't fully trust your output.",
  },
  {
    num: '04',
    title: 'Little or No Traceability',
    body: 'Manual documentation, disconnected spreadsheets, no real-time visibility.',
  },
  {
    num: '05',
    title: 'Reduced Revenue Potential',
    body: 'Low-purity output gets priced like waste, not industrial raw material.',
  },
];

const SOLUTION_BLOCKS = [
  {
    num: '01',
    tag: 'Hardware',
    title: 'MRM (AI) - Smarter Intake, Before Contamination Begins',
    body: 'Identifies, classifies, and verifies materials the moment they enter your facility — colour, material type, condition, and contamination.',
    imgLabel: "MRM (AI) unit installed at a facility's intake point, integrated with the existing conveyor line",
    img: '/recycling hardware.png',
    href: '/solutions/hardware',
    type: 'chips',
    chips: [
      { b: '98.7%',  label: 'avg confidence' },
      { b: '462',    label: 'items / min' },
      { b: '250 kg', label: '/ cycle recycling' },
    ],
  },
  {
    num: '02',
    tag: 'Hardware',
    title: 'AI Vision Sorting - Line-Speed Accuracy, Shift After Shift',
    body: "Validated across live MRF deployments. Replaces human-eye and basic-sensor sorting with a system that doesn't fatigue or vary shift to shift.",
    imgLabel: 'AI Vision Sorting live overlay — colour, material, and confidence score on items moving down the line',
    img: '/recycling hardware 2.png',
    // Live HUD overlay with a stats bar flush to the top edge and item
    // labels reaching close to the bottom — cover would crop them, so show
    // the whole frame, same fix used for the dashboard shots on this page.
    imgFit: 'contain',
    href: '/solutions/hardware',
    type: 'table',
    table: {
      head: ['Metric', 'Traditional', 'Reneonix'],
      rows: [
        ['Accuracy', '~60–70%', 'Up to 98%'],
        ['Output quality', 'Mixed, rework-heavy', 'High purity, minimal rework'],
      ],
    },
  },
  {
    num: '03',
    tag: 'Software',
    title: 'Retraiz (TraceOS) - Turn Your Operation Into a Documented, Auditable Asset',
    body: 'Live operational dashboards, AI decision support, and buyer-ready documentation — generated automatically, no manual work.',
    imgLabel: 'Retraiz operator dashboard — live recovery rate, quality grade, and uptime for the facility',
    img: '/recycling - software.png',
    // Dashboard screenshot with content flush to every edge (sidebar, top
    // bar, batch table) — cover would crop it, so show it whole, same fix
    // used for the equivalent dashboard shots on the FMCG and Glass pages.
    imgFit: 'contain',
    href: '/solutions/software',
    type: 'chips',
    chips: [
      { b: '92%', label: 'recovery rate (+8%)' },
      { b: 'A grade', label: 'material quality (+12%)' },
      { b: '98.5%', label: 'uptime (+3%)' },
    ],
  },
];

const HOW_STEPS = [
  {
    tag: 'Intake',
    stepLabel: 'Scan on Entry',
    body: 'MRM classifies material — colour, type, and contamination — the moment it enters your facility, before it mixes with the rest of the intake stream.',
    features: [
      { Icon: ScanLine, title: 'Edge AI Scan', body: 'High-speed scan captures colour, material type and condition at intake.' },
      { Icon: FileCheck2, title: 'Digital Registration', body: 'Every load logged with a timestamped digital record.' },
      { Icon: ShieldCheck, title: 'Contamination Flagged Early', body: 'Mixed or contaminated material identified before it reaches the line.' },
    ],
  },
  {
    tag: 'Sort',
    stepLabel: 'Line-Speed Accuracy',
    body: 'AI Vision Sorting reads colour, material, brand, and condition in real time, at full line speed, shift after shift.',
    features: [
      { Icon: Search, title: 'Multi-Point Read', body: 'Colour, material type, shape and condition read in a single pass.' },
      { Icon: Target, title: 'Up to 98% Accuracy', body: "Consistent detection that doesn't fatigue or vary shift to shift." },
      { Icon: Split, title: 'Material Separation', body: 'Glass, PET, and cans separated automatically on the line.' },
    ],
  },
  {
    tag: 'Route',
    stepLabel: 'Highest-Value Path',
    body: 'Every item is routed automatically to the pathway that recovers the most value — reuse, recycling, or flagged for manual review.',
    features: [
      { Icon: Repeat, title: 'Reuse Priority', body: 'Intact, high-value items protected for reuse first.' },
      { Icon: PackageCheck, title: 'Automated Pathway', body: 'Recycling route assigned without manual handling.' },
      { Icon: TrendingUp, title: 'Highest-Value Routing', body: 'Every pathway decision optimises for recovered value, not convenience.' },
    ],
  },
  {
    tag: 'Trace',
    stepLabel: 'Logged to Retraiz',
    body: 'Every batch gets a unique, immutable digital record in Retraiz — source to dispatch, fully auditable.',
    features: [
      { Icon: Fingerprint, title: 'Unique Batch ID', body: 'Every batch is uniquely identified and sealed.' },
      { Icon: Lock, title: 'Immutable Record', body: "Data can't be altered once verified and logged." },
      { Icon: Waypoints, title: 'Source to Dispatch', body: 'Full chain-of-custody, visible end to end.' },
    ],
  },
  {
    tag: 'Report',
    stepLabel: 'Docs Generated',
    body: 'Live operational dashboards and buyer-ready documentation, generated automatically — no manual work.',
    features: [
      { Icon: BarChart3, title: 'Live Dashboards', body: 'Recovery rate, purity, and uptime updated in real time.' },
      { Icon: FileCheck2, title: 'Buyer-Ready Docs', body: 'Documentation generated automatically, no manual work.' },
      { Icon: Gauge, title: 'Revenue Visibility', body: 'See exactly how purity gains translate to price.' },
    ],
  },
];

const WHY_ITEMS = [
  { Icon: TrendingUp,  title: 'Higher-Value Output', body: 'Cleaner, verified material commands industrial pricing over scrap pricing.' },
  { Icon: Gauge,       title: 'Less Manual Labour, More Throughput', body: 'Automated sorting reduces dependence on manual picking.' },
  { Icon: ShieldCheck, title: 'Win Buyers Who Need Proof', body: 'Retraiz gives you documentation to close deals with manufacturers.' },
  { Icon: Users2,      title: "Operational Visibility You Don't Have Today", body: 'Real-time dashboards replace spreadsheets and after-the-fact reporting.' },
];

const PROOF_CARDS = [
  { name: 'Cercle X',   body: 'Glass Sorter pilot deployment.',                          stage: 'MOU Signed — Live', variant: 'live' },
  { name: 'Mini Mines', body: 'AI Vision-based battery sorting + TraceOS deployment.',    stage: 'Intro Stage',        variant: 'intro' },
];

export default function RecyclingOperatorsPage() {
  const railWrapRef = useRef(null);
  const railRef = useRef(null);
  const railFillRef = useRef(null);

  // The rail's track must span exactly from the first step-circle's center
  // to the last one's — not the wrap's full box — because the step rows
  // don't share a height (the image column can be taller than the text),
  // so a fixed CSS top/bottom offset overshoots past the last circle.
  useEffect(() => {
    const wrap = railWrapRef.current;
    const rail = railRef.current;
    const fill = railFillRef.current;
    if (!wrap || !rail || !fill) return;

    function positionRail() {
      const nums = wrap.querySelectorAll('.ro-step-num');
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
      // Re-measure every tick, not just once — the step circles start
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

  // Page-local reveal — this page is lazy-loaded, so it mounts after
  // SiteEffects' route-keyed IntersectionObserver has already run and can
  // never see these nodes (same fix as the other industry pages).
  useLayoutEffect(() => {
    const vh = window.innerHeight;
    document.querySelectorAll('.ro-reveal').forEach((el) => {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < vh && bottom > 0) el.classList.add('ro-in');
    });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ro-in');
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.ro-reveal:not(.ro-in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ro-page">

      {/* ── HERO ── */}
      <section className="ro-hero">
        <div className="ro-hero__bg-veil" aria-hidden="true" />

        <nav className="ro-breadcrumb" aria-label="Breadcrumb">
          <a href="/" onClick={navClick('/')}>Home</a>
          <ChevronRight size={13} aria-hidden="true" />
          <a href="/industries" onClick={navClick('/industries')}>Industries</a>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="is-current">Recycling Operators</span>
        </nav>

        <div className="ro-hero__inner">
          <span className="ro-hero__chip">Industry · Recycling Operators</span>
          <h1>
            Your Facility's Output Is Only as Good as <em>the First Ten Minutes</em>
          </h1>
          <p className="ro-hero__tagline">
            AI-powered sorting hardware and traceability software for MRFs and recycling operators.
          </p>
          <p className="ro-hero__lead">
            Reneonix turns mixed, contaminated intake into clean, high-purity, buyer-ready
            material — with the data to prove it, deployed inside real material recovery
            facilities.
          </p>
          <div className="ro-hero__cta">
            <a href="/contact-us" onClick={navClick('/contact-us')} className="btn btn-primary">
              Talk to our team
            </a>
            <a href="/solutions" onClick={navClick('/solutions')} className="btn btn-outline-light">
              See the Technology
            </a>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head ro-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">The Problem</span>
            <h2>The Problem Is Not How We Sort, <em>It Is When We Sort</em></h2>
            <p>
              Most recovery infrastructure was designed around collect first, sort later. It's
              served the industry for decades, but the cost lands squarely on the operator
              running the facility.
            </p>
          </div>

          <div className="ro-problem-grid">
            <div className="ro-problem-cards ro-reveal">
              {PROBLEM_ITEMS.map(({ num, title, body }) => (
                <div className="ro-problem-card" key={num}>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>

            <div className="ro-problem-media ro-reveal">
              <img
                src="/recycling problem.png"
                alt="Manual sorting line — workers picking mixed, contaminated material by hand before automation"
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
          <div className="section-head ro-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">The Reneonix Solution</span>
            <h2>The Same Hardware and Software Stack That's Already <em>Validated at MRF Sites</em></h2>
            <p>
              Built and proven inside real material recovery facilities, not designed in a lab
              and handed to operators afterward.
            </p>
          </div>

          <div className="ro-rail-wrap" ref={railWrapRef}>
            <div className="ro-rail" ref={railRef}><div className="ro-rail-fill" ref={railFillRef} /></div>

            {SOLUTION_BLOCKS.map((block) => (
              <div className="ro-step ro-reveal" key={block.num}>
                <div className="ro-step-num">{block.num}</div>

                <div className="ro-step-content">
                  <span className="ro-row__tag">{block.tag}</span>
                  <h3>{block.title}</h3>
                  <p>{block.body}</p>

                  {block.type === 'chips' && (
                    <div className="ro-chip-row">
                      {block.chips.map(({ b, label }) => (
                        <span className="ro-chip" key={label}><b>{b}</b> {label}</span>
                      ))}
                    </div>
                  )}

                  {block.type === 'table' && (
                    <div className="ro-table-wrap">
                      <table className="ro-table">
                        <thead>
                          <tr>{block.table.head.map((h) => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {block.table.rows.map((row) => (
                            <tr key={row[0]}>
                              <td>{row[0]}</td>
                              <td>{row[1]}</td>
                              <td className="ro-table__hl">{row[2]}</td>
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

                <div className="ro-step-visual">
                  <div className={`ro-step-visual-card${block.imgFit === 'contain' ? ' ro-step-visual-card--contain' : ''}`}>
                    {block.img && <img src={block.img} alt={block.imgLabel} loading="lazy" decoding="async" />}
                    <span className="ro-step-visual-card__caption">{block.imgLabel}</span>
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
          <div className="section-head ro-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">How It Works</span>
            <h2>In Your <em>Facility</em></h2>
          </div>

          <div className="ro-reveal">
            <HowItWorksJourney steps={HOW_STEPS} />
          </div>
        </div>
      </section>

      {/* ── WHY THIS MATTERS ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head ro-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">Why This Matters</span>
            <h2>For Your <em>Facility</em></h2>
          </div>

          <div className="ro-why-grid">
            {WHY_ITEMS.map(({ Icon, title, body }, i) => (
              <div className="card ro-reveal" key={title} style={{ transitionDelay: `${i * 0.08}s` }}>
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
          <div className="section-head ro-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">Proof in the Field</span>
            <h2>Validated at MRF Sites, <em>in Active Commercial Deployment</em></h2>
          </div>

          <div className="ro-proof-cards ro-reveal">
            {PROOF_CARDS.map(({ name, body, stage, variant }) => (
              <div className="ro-proof-card" key={name}>
                <h4>{name}</h4>
                <p>{body}</p>
                <span className={`ro-stage ro-stage--${variant}`}>{stage}</span>
              </div>
            ))}
          </div>

          <div className="ro-proof-box ro-reveal">
            <p>
              Late-stage R&amp;D, validated at MRF sites, with production deployment underway.
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to Turn Your Facility's Output Into <em>Raw Material Buyers Can Underwrite?</em></h2>
            <p>Let's talk about a pilot deployment for your site.</p>
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
