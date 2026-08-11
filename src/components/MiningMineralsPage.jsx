import { useEffect, useLayoutEffect, useRef } from 'react';
import { ChevronRight, ShieldCheck, Wallet, FileCheck2, Users, Image as ImageIcon } from 'lucide-react';
import { navClick } from '../utils/nav.js';
import './MiningMineralsPage.css';

const PROBLEM_ITEMS = [
  {
    title: 'Treated as Waste, Not Input',
    body: 'Byproduct streams are landfilled or stockpiled rather than engineered into usable material.',
  },
  {
    title: 'No Grading or Characterisation',
    body: 'Particle size, composition, and contamination vary batch to batch with no standard record.',
  },
  {
    title: 'No Proof for Downstream Buyers',
    body: 'Manufacturers who could use the byproduct have no verified data to underwrite it.',
  },
  {
    title: 'Rising Cost of Virgin Material',
    body: 'Industries pay a premium for virgin-mined input, even when a usable substitute exists nearby.',
  },
];

const SOLUTION_BLOCKS = [
  {
    num: '01',
    tag: 'Characterisation',
    title: 'Characterise the Byproduct',
    body: 'Every batch of residual material - fines, dust, tailings - is assessed for composition, particle size, and contamination before any conversion pathway is decided.',
    imgLabel: 'Material science technician analysing a byproduct sample for composition and particle size',
    img: '/characterisation.jpg',
  },
  {
    num: '02',
    tag: 'Conversion',
    title: 'Engineer a Conversion Pathway',
    body: 'Our clearest proof point today: converting silica dust - a mining/processing byproduct - into granulated, glass-feed-grade material, targeting a processing cost around ₹3,000/ton against virgin silica sand at ₹6,000/ton.',
    chips: [
      { b: '₹6,000/ton', label: 'virgin silica sand' },
      { b: '₹3,000/ton', label: 'target processing cost' },
    ],
    imgLabel: 'Granulated silica dust byproduct, converted to glass-feed-grade material — in development with an industrial partner',
    img: '/conversion.png',
  },
  {
    num: '03',
    tag: 'Traceability',
    title: 'Trace It Like an Industrial Input, Not Waste',
    body: 'Every batch that moves through this pathway gets the same digital identity as our packaging materials - via Retraiz (TraceOS): source, processing history, quality metrics, and compliance documentation, immutable and auditable.',
    imgLabel: 'Retraiz dashboard, adapted to show a mineral byproduct batch',
    img: '/traceability.png',
    // Dashboard screenshot - cover was slicing the sidebar/table edges off,
    // same fix as GlassManufacturersPage's Retraiz shot.
    imgFit: 'contain',
  },
  {
    num: '04',
    tag: 'AI Vision',
    title: 'Apply AI Vision Where Sorting Is the Bottleneck',
    body: "For mineral streams that require sorting or grading before reuse, the same AI vision approach we've proven on glass - colour, condition, material classification at line speed  can be adapted to mineral and ore byproduct sorting use cases.",
    imgLabel: 'AI vision classification adapted for mineral and ore byproduct sorting',
    img: '/ai vision.png',
  },
];

const FLOW_STEPS = [
  {
    tag: 'Characterise', title: 'Sample & Analyse',
    body: 'Analyse mineral byproducts for composition, impurities and recovery potential.',
    imgLabel: 'Byproduct sample collected for characterisation at a mining site',
    img: '/mining1.jpeg',
  },
  {
    tag: 'Formulate', title: 'Develop Recovery Pathway',
    body: 'Develop the optimal material science conversion pathway.',
    imgLabel: 'Material science team developing a conversion pathway',
    img: '/mining2.jpeg',
  },
  {
    tag: 'Validate', title: 'Test & Refine',
    body: 'Verify technical performance and commercial specifications.',
    imgLabel: 'Formulated material under test against target specification',
    img: '/mining3.jpeg',
  },
  {
    tag: 'Trace', title: 'Digital Material Passport',
    body: 'Record batch history, quality reports and compliance data.',
    imgLabel: 'Reneonix Material Passport for a verified mineral byproduct batch',
    img: '/mining4.png',
  },
  {
    tag: 'Supply', title: 'Verified Material Delivery',
    body: 'Deliver verified industrial-grade secondary raw materials.',
    imgLabel: 'Verified secondary material ready for delivery to a downstream buyer',
    img: '/mining5.jpeg',
  },
];

const WHY_ITEMS = [
  { Icon: Wallet,      title: 'Unlock Byproduct Value', body: 'Stockpiled or landfilled material becomes a monetisable secondary input.' },
  { Icon: ShieldCheck, title: 'Cut Buyer Input Costs', body: 'Downstream manufacturers gain a lower-cost alternative to virgin-mined material.' },
  { Icon: FileCheck2,  title: 'Build a Compliance-Ready Record', body: 'Every batch is traceable, supporting ESG and resource-efficiency reporting.' },
  { Icon: Users,       title: 'One Partner Across the Value Chain', body: 'Identification, conversion, and traceability under a single stack.' },
];

export default function MiningMineralsPage() {
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
      const nums = wrap.querySelectorAll('.mm-step-num');
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
  // never see these nodes (same fix as GlassManufacturersPage).
  useLayoutEffect(() => {
    const vh = window.innerHeight;
    document.querySelectorAll('.mm-reveal').forEach((el) => {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < vh && bottom > 0) el.classList.add('mm-in');
    });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mm-in');
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.mm-reveal:not(.mm-in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mm-page">

      {/* ── HERO ── */}
      <section className="mm-hero">
        <div className="mm-hero__bg-veil" aria-hidden="true" />

        <nav className="mm-breadcrumb" aria-label="Breadcrumb">
          <a href="/" onClick={navClick('/')}>Home</a>
          <ChevronRight size={13} aria-hidden="true" />
          <a href="/industries" onClick={navClick('/industries')}>Industries</a>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="is-current">Mining & Minerals</span>
        </nav>

        <div className="mm-hero__inner">
          <span className="mm-hero__chip">Industry · Minerals &amp; Mining</span>
          <h1>
            Byproduct Streams Are Raw Material, <em>If You Can Prove It</em>
          </h1>
          <p className="mm-hero__tagline">
            Reneonix applies its material recovery, AI identification, and traceability stack to
            mineral and mining byproducts.
          </p>
          <p className="mm-hero__lead">
            Turning residual fines, dust, and tailings into verified industrial feedstock - the
            same platform discipline that's already proven in packaging, pointed at a new source
            stream.
          </p>
          <div className="mm-hero__cta">
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
          <div className="section-head mm-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">The Problem</span>
            <h2>Mineral Processing Generates More Byproduct Than the <em>Industry Currently Reuses</em></h2>
            <p>
              Mining and mineral processing operations produce large volumes of fines, dust, and
              residual byproduct alongside the primary product. Today, most of this material
              follows a familiar pattern.
            </p>
          </div>

          <div className="mm-problem-grid">
            <div className="mm-problem-cards mm-reveal">
              {PROBLEM_ITEMS.map(({ title, body }) => (
                <div className="mm-problem-card" key={title}>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>

            <div className="mm-problem-media mm-reveal">
              <img
                src="/mining-problem.png"
                alt="Stockpiled byproduct fines at a mineral processing site, currently treated as waste rather than input"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE RENEONIX APPROACH ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head mm-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">The Reneonix Approach</span>
            <h2>The Same Stack, <em>Pointed at a Different Feedstock</em></h2>
            <p>
              Reneonix's core platform - AI-powered identification, batch-level traceability, and
              material science - was engineered to turn overlooked residual streams into
              buyer-ready raw material.
            </p>
          </div>

          <div className="mm-rail-wrap" ref={railWrapRef}>
            <div className="mm-rail" ref={railRef}><div className="mm-rail-fill" ref={railFillRef} /></div>

            {SOLUTION_BLOCKS.map((block) => (
              <div className="mm-step mm-reveal" key={block.num}>
                <div className="mm-step-num">{block.num}</div>

                <div className="mm-step-content">
                  <span className="mm-step__tag">{block.tag}</span>
                  <h3>{block.title}</h3>
                  <p>{block.body}</p>
                  {block.chips && (
                    <div className="mm-chip-row">
                      {block.chips.map(({ b, label }) => (
                        <span className="mm-chip" key={label}><b>{b}</b> {label}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mm-step-visual">
                  <div className={`mm-step-visual-card${block.imgFit === 'contain' ? ' mm-step-visual-card--contain' : ''}`}>
                    {block.img && <img src={block.img} alt={block.imgLabel} loading="lazy" decoding="async" />}
                    <span className="mm-step-visual-card__caption">{block.imgLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT THIS COULD LOOK LIKE ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head mm-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">What This Could Look Like</span>
            <h2>For a Mining or Minerals <em>Partner</em></h2>
          </div>

          <div className="mm-flow-rail mm-reveal" aria-hidden="true">
            <span className="mm-flow-rail__endcap mm-flow-rail__endcap--start" />
            {FLOW_STEPS.map((step, i) => (
              <span className="mm-flow-rail__dot" key={step.tag}>{String(i + 1).padStart(2, '0')}</span>
            ))}
            <span className="mm-flow-rail__endcap mm-flow-rail__endcap--end" />
          </div>

          <div className="mm-flow-cards">
            {FLOW_STEPS.map(({ tag, title, body, imgLabel, img }, i) => (
              <div className="mm-flow-card mm-reveal" key={tag} style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="mm-flow-card__tag">{tag}</span>
                <div className="mm-flow-card__media">
                  {img ? (
                    <img src={img} alt={imgLabel} loading="lazy" decoding="async" />
                  ) : (
                    <div className="mm-flow-card__placeholder" role="img" aria-label={imgLabel}>
                      <ImageIcon size={18} aria-hidden="true" />
                      <span>{imgLabel}</span>
                    </div>
                  )}
                </div>
                <h5>{title}</h5>
                <p>{body}</p>
                <span className="mm-flow-card__accent" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY THIS MATTERS ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="section-head mm-reveal" style={{ margin: '0 0 48px', textAlign: 'left', maxWidth: 720 }}>
            <span className="eyebrow">Why This Matters</span>
            <h2>For Your <em>Operation</em></h2>
          </div>

          <div className="mm-why-grid">
            {WHY_ITEMS.map(({ Icon, title, body }, i) => (
              <div className="card mm-reveal" key={title} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="card__icon"><Icon size={26} aria-hidden="true" /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHERE WE ARE TODAY ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="mm-status mm-reveal">
            <span className="eyebrow">Where We Are Today</span>
            <p>
              Reneonix's platform is proven in commercial deployment for post-consumer glass
              recovery. Our work applying the same material science discipline to mineral
              byproduct - starting with the silica dust-to-glass-feed pathway - is in active
              development with an industrial partner. We're building toward mining and minerals
              as our platform's next material stream, not claiming deployed history there yet.
            </p>
            <div className="mm-status__quote">
              Interested in exploring a byproduct characterisation pilot? Let's talk about what
              your residual streams could become.
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="cta-banner">
            <h2>Have a Byproduct Stream You're Stockpiling <em>Instead of Selling?</em></h2>
            <p>Let's find out what it could become.</p>
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
