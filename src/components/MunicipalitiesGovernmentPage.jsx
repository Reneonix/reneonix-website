import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  ChevronRight, CheckCircle2, Eye, Mountain, BarChart3, Image as ImageIcon,
  Home, Trash2, Truck, QrCode, LayoutDashboard,
} from 'lucide-react';
import { navClick } from '../utils/nav.js';
import './MunicipalitiesGovernmentPage.css';

const PROBLEM_ITEMS = [
  {
    title: 'No Source-Level Segregation',
    body: 'Dry and wet waste is typically collected mixed, limiting downstream recycling or composting.',
  },
  {
    title: 'No Household-Level Visibility',
    body: "Neither residents nor the administration can see who's generating how much.",
  },
  {
    title: 'Difficult Terrain, Harder Logistics',
    body: 'Hill geography makes centralized MRF-style processing less practical.',
  },
  {
    title: 'No Public Accountability Layer',
    body: "Without visible data, there's little incentive for households to segregate properly.",
  },
];

const SOLUTION_BLOCKS = [
  {
    num: '01',
    tag: 'Collection',
    title: 'Household Collection & Source Segregation',
    body: 'Waste is collected directly from homes and establishments and segregated into dry and wet streams at the point of collection - the single highest-leverage step for effective recovery.',
    imgLabel: 'Collection worker segregating dry and wet waste into separate bins at a household doorstep',
    img: '/collection government.png',
  },
  {
    num: '02',
    tag: 'Routing',
    title: 'Recycle or Reuse Routing',
    body: "Dry waste is routed through Reneonix's existing AI-vision sorting and material recovery pathway. Wet waste is routed toward composting or another organic-recovery pathway, keeping biodegradable waste out of landfill entirely.",
    chips: [
      { b: 'Dry waste →', label: 'AI-vision recovery' },
      { b: 'Wet waste →', label: 'Composting pathway' },
    ],
    imgLabel: 'Two-path routing: dry waste under AI-vision sorting on the left, wet waste going to compost on the right',
    img: '/government routing.png',
  },
  {
    num: '03',
    tag: 'Traceability',
    title: 'Household QR Transparency',
    body: 'Every household is issued a QR code. Scanning it opens a personal dashboard showing exactly how much waste that home has handed over - by date, by type, over time.',
    imgLabel: 'Household QR code sticker and phone screen showing a personal waste-contribution dashboard',
    img: '/government traceability.png',
  },
  {
    num: '04',
    tag: 'Governance',
    title: 'Municipal Dashboard & Reporting',
    body: 'Household-level data rolls up into an aggregate view for the local administration - total volumes, segregation compliance, recycling versus composting split, and trends over time.',
    imgLabel: 'Municipal officer reviewing the City Waste Overview dashboard - total volumes, recycling vs. composting split, and ward-level segregation compliance',
    img: '/government governance.png',
  },
];

const FLOW_STEPS = [
  { num: '01', Icon: Home,            tag: 'Collect',   title: 'Household Pickup',   body: 'Waste collected directly from homes and establishments.' },
  { num: '02', Icon: Trash2,          tag: 'Segregate', title: 'Dry / Wet Split',    body: 'Separated at the point of collection for efficient handling.' },
  { num: '03', Icon: Truck,           tag: 'Route',     title: 'Recycle or Compost', body: 'Dry waste sent for AI-vision recovery, wet waste for composting.' },
  { num: '04', Icon: QrCode,          tag: 'Log',       title: 'QR-Linked Record',   body: "Every contribution logged against the household's QR code." },
  { num: '05', Icon: LayoutDashboard, tag: 'Dashboard', title: 'Two Views',          body: 'Households see their own data; the municipality sees the aggregate.' },
];

const WHY_ITEMS = [
  { Icon: CheckCircle2, title: 'Source Segregation That Works', body: 'Dry and wet waste collected separately from the start, not un-mixed later.' },
  { Icon: Eye, title: 'Transparency Drives Participation', body: 'Visible household data gives residents a reason to keep segregating.' },
  { Icon: Mountain, title: 'Built for Hill-Station Geography', body: 'A distributed, household-first model suited to harder terrain.' },
  { Icon: BarChart3, title: 'Evidence-Based Governance', body: 'Real usage data instead of estimates, for civic reporting and decisions.' },
];

function ImagePlaceholder({ label, flag }) {
  return (
    <div className="mg-ph" role="img" aria-label={label}>
      <ImageIcon size={22} aria-hidden="true" />
      <span>{label}</span>
      {flag && <em>{flag}</em>}
    </div>
  );
}

export default function MunicipalitiesGovernmentPage() {
  const railWrapRef = useRef(null);
  const railRef = useRef(null);
  const railFillRef = useRef(null);
  const flowVideoRef = useRef(null);

  // How It Works walkthrough video - plays while scrolled into view,
  // pauses otherwise (matches the proof video on SolutionsPage /
  // GlassManufacturersPage).
  useEffect(() => {
    const video = flowVideoRef.current;
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
  // to the last one's — not the wrap's full box — because the step rows
  // don't share a height (the image column can be taller than the text),
  // so a fixed CSS top/bottom offset overshoots past the last circle.
  useEffect(() => {
    const wrap = railWrapRef.current;
    const rail = railRef.current;
    const fill = railFillRef.current;
    if (!wrap || !rail || !fill) return;

    function positionRail() {
      const nums = wrap.querySelectorAll('.mg-step-num');
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

  // Page-local reveal — this page is lazy-loaded, so it mounts after
  // SiteEffects' route-keyed IntersectionObserver has already run and can
  // never see these nodes (same fix as GlassManufacturersPage/MiningMineralsPage).
  useLayoutEffect(() => {
    const vh = window.innerHeight;
    document.querySelectorAll('.mg-reveal').forEach((el) => {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < vh && bottom > 0) el.classList.add('mg-in');
    });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mg-in');
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.mg-reveal:not(.mg-in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mg-page">

      {/* ── HERO ── */}
      <section className="mg-hero">
        <div className="mg-hero__bg-veil" aria-hidden="true" />

        <nav className="mg-breadcrumb" aria-label="Breadcrumb">
          <a href="/" onClick={navClick('/')}>Home</a>
          <ChevronRight size={13} aria-hidden="true" />
          <a href="/industries" onClick={navClick('/industries')}>Industries</a>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="is-current">Municipalities &amp; Government</span>
        </nav>

        <div className="mg-hero__inner">
          <span className="mg-hero__chip">Industry · Government &amp; Municipalities</span>
          <h1>A Household-First Model for <em>Hill-Station Waste</em></h1>
          <p className="mg-hero__tagline">
            Household-level waste visibility for the communities that need it most.
          </p>
          <p className="mg-hero__lead">
            Reneonix proposes a household-to-dashboard waste circularity program for hill-station
            municipalities - collecting, segregating, and tracking waste at the source, and giving
            every household a transparent record of their own contribution.
          </p>
          <div className="mg-hero__cta">
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
          <div className="section-head mg-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">The Problem</span>
            <h2>Hill Stations Generate Waste Faster Than <em>They Can Track It</em></h2>
            <p>
              Tourist-heavy hill-station towns see waste volumes rise sharply with seasonal
              footfall, while collection and reporting infrastructure stays built for a much
              smaller, static population.
            </p>
          </div>

          <div className="mg-problem-grid">
            <div className="mg-problem-cards mg-reveal">
              {PROBLEM_ITEMS.map(({ title, body }) => (
                <div className="mg-problem-card" key={title}>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>

            <div className="mg-problem-media mg-reveal">
              <img
                src="/government problem.png"
                alt="Mixed, unsegregated household waste at a hill-station collection point overlooking a hillside town"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE RENEONIX PROPOSAL ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head mg-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">The Reneonix Proposal</span>
            <h2>Collect at the Household, Segregate at the Source <em>Make It Visible to Everyone</em></h2>
            <p>
              This model adapts Reneonix's existing recovery and traceability stack - proven on
              packaging materials - into a household-level civic waste program.
            </p>
          </div>

          <div className="mg-rail-wrap" ref={railWrapRef}>
            <div className="mg-rail" ref={railRef}><div className="mg-rail-fill" ref={railFillRef} /></div>

            {SOLUTION_BLOCKS.map((block) => (
              <div className="mg-step mg-reveal" key={block.num}>
                <div className="mg-step-num">{block.num}</div>

                <div className="mg-step-content">
                  <span className="mg-step__tag">{block.tag}</span>
                  <h3>{block.title}</h3>
                  <p>{block.body}</p>
                  {block.chips && (
                    <div className="mg-chip-row">
                      {block.chips.map(({ b, label }) => (
                        <span className="mg-chip" key={label}><b>{b}</b> {label}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mg-step-visual">
                  <div className="mg-step-visual-card">
                    {block.img ? (
                      <img src={block.img} alt={block.imgLabel} loading="lazy" decoding="async" />
                    ) : (
                      <ImagePlaceholder label={block.imgLabel} flag={block.imgFlag} />
                    )}
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
          <div className="section-head mg-reveal">
            <span className="eyebrow">How It Works</span>
            <h2>From Household to <em>Dashboard</em></h2>
            <p>
              Every piece of waste follows a transparent journey - from doorstep collection to
              city-wide intelligence.
            </p>
          </div>

          <div className="mg-flow-video mg-reveal">
            <video
              ref={flowVideoRef}
              className="mg-flow-video__player"
              src="/government video.mp4"
              muted
              loop
              playsInline
              controls
              preload="metadata"
            />
          </div>

          <div className="mg-flow-nums mg-reveal" aria-hidden="true">
            {FLOW_STEPS.map(({ num }, i) => (
              <div className="mg-flow-nums__cell" key={num}>
                <span className="mg-flow-nums__num">{num}</span>
                {i < FLOW_STEPS.length - 1 && <ChevronRight size={16} className="mg-flow-nums__chevron" />}
              </div>
            ))}
          </div>

          <div className="mg-flow mg-reveal">
            {FLOW_STEPS.map(({ tag, title, body, Icon }) => (
              <div className="mg-flow-step" key={tag}>
                <div className="mg-flow-step__icon"><Icon size={22} aria-hidden="true" /></div>
                <span className="mg-flow-step__tag">{tag}</span>
                <h5>{title}</h5>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY THIS MATTERS ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head mg-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">Why This Matters</span>
            <h2>For Your <em>Community</em></h2>
          </div>

          <div className="mg-why-grid">
            {WHY_ITEMS.map(({ Icon, title, body }, i) => (
              <div className="card mg-reveal" key={title} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="card__icon"><Icon size={26} aria-hidden="true" /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHERE THIS STANDS TODAY ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="mg-status mg-reveal">
            <span className="mg-status__pill">Proposed model – not yet deployed</span>
            <span className="eyebrow">Where This Stands Today</span>
            <p>
              This is a proposed program model for hill-station and similar municipal contexts. It
              has not yet been deployed. The underlying recovery and classification technology is
              proven in Reneonix's existing commercial work; the household collection, QR-tracking,
              and municipal dashboard layer are being built specifically for this program type.
            </p>
            <div className="mg-status__quote">
              Interested in a similar program for your district or town? Let's talk about what a
              household-level pilot could look like.
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="cta-banner">
            <h2>Want to Bring Transparent, Source-Segregated Waste Tracking to <em>Your Community?</em></h2>
            <p>Let's talk about what a pilot program could look like for your district.</p>
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
                Download program overview
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
