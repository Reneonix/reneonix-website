import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ChevronRight, ChevronDown, ShieldCheck, Wallet, FileCheck2, Users, Image as ImageIcon,
  FlaskConical,
} from 'lucide-react';
import { navClick, navigate } from '../utils/nav.js';
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
    imgLabel: 'Granulated silica dust byproduct, converted to glass-feed-grade material — in development with an industrial partner',
    img: '/conversion.webp',
  },
  {
    num: '03',
    tag: 'Traceability',
    title: 'Trace It Like an Industrial Input, Not Waste',
    body: 'Every batch that moves through this pathway gets the same digital identity as our packaging materials - via Retraiz (TraceOS): source, processing history, quality metrics, and compliance documentation, immutable and auditable.',
    imgLabel: 'Retraiz dashboard, adapted to show a mineral byproduct batch',
    img: '/traceability.webp',
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
    img: '/ai vision.webp',
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
    img: '/mining4.webp',
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

const MATERIAL_STEPS = [
  {
    num: '01',
    title: 'Fine Mineral Stream',
    sub: 'Ultra-fine quartz material',
    body: 'Mineral operations generate ultra-fine quartz content typically below 150 µm. This fine material is prone to dusting, handling losses and is difficult to utilise directly.',
  },
  {
    num: '02',
    title: 'Controlled Conversion',
    sub: 'Engineered into a defined form',
    body: 'Through a controlled material conversion pathway, the fine quartz stream is transformed into compact granules with improved handling characteristics.',
  },
  {
    num: '03',
    title: 'Defined Material Output',
    sub: '600–1000 µm granules',
    body: 'Laboratory trials have produced granules within the 600–1000 µm range, equivalent to ASTM No. 18–30 classification, enabling easier handling and integration for further industrial evaluation.',
  },
];

const MATERIAL_STATS = [
  { value: '<150 µm',     label: 'Starting particle size' },
  { value: '600–1000 µm', label: 'Granule size range' },
  { value: 'Low dust',    label: 'Observed during laboratory evaluation' },
  { value: '500°C',       label: 'Thermal evaluation conducted' },
];

// Cross-page nav to the Material Science page's Granulation Process
// section — same sessionStorage handoff pattern used elsewhere on the site
// (see BlogArticleResourceRecovery.jsx's goToBlogLatest).
function goToGranulationProcess(e) {
  e.preventDefault();
  sessionStorage.setItem('sw_scroll_target', 'granulation-process');
  navigate('/solutions/material-science');
}

export default function MiningMineralsPage() {
  const [activeStep, setActiveStep] = useState(0);

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
                src="/mining-problem.webp"
                alt="Stockpiled byproduct fines at a mineral processing site, currently treated as waste rather than input"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FROM BYPRODUCT TO ENGINEERED FEEDSTOCK ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="mm-material-frame mm-reveal">

            <div className="mm-material-top">
              <div className="mm-material-top__copy">
                <span className="eyebrow">From Byproduct to Engineered Feedstock</span>
                <h2>Turning Fine Mineral Streams Into <em>Controlled Material Forms</em></h2>
                <p>
                  Mineral processing generates fine quartz-rich streams that are difficult to
                  handle and challenging to integrate directly into downstream processes. Reneonix
                  develops material conversion pathways that transform these fine streams into
                  controlled granular forms, creating a more manageable and evaluable feedstock.
                </p>
              </div>

              <div className="mm-material-transform">
                <div className="mm-material-specimen">
                  <img
                    src="/starting material.webp"
                    alt="Fine quartz stream, the byproduct starting material"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="mm-material-specimen__tag">
                    <span className="mm-material-specimen__tag-label">Fine Quartz Stream</span>
                    <span className="mm-material-specimen__tag-spec">&lt;150 µm</span>
                  </div>
                </div>

                <span className="mm-material-dash" aria-hidden="true" />

                <div className="mm-material-center" aria-hidden="true">
                  <span className="mm-material-center__icon"><FlaskConical size={20} aria-hidden="true" /></span>
                  <span className="mm-material-center__label">Material<br />Engineering</span>
                </div>

                <span className="mm-material-dash mm-material-dash--arrow" aria-hidden="true" />

                <div className="mm-material-specimen">
                  <img
                    src="/final product.webp"
                    alt="Controlled quartz granules, the engineered material output"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="mm-material-specimen__tag">
                    <span className="mm-material-specimen__tag-label">Controlled Granules</span>
                    <span className="mm-material-specimen__tag-spec">600–1000 µm</span>
                    <span className="mm-material-specimen__tag-spec mm-material-specimen__tag-spec--accent">ASTM No. 18–30</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mm-material-cards">
              {MATERIAL_STEPS.map(({ num, title, sub, body }) => (
                <div className="mm-material-card" key={num}>
                  <h4>{title}</h4>
                  <span className="mm-material-card__sub">{sub}</span>
                  <span className="mm-material-card__rule" aria-hidden="true" />
                  <p>{body}</p>
                </div>
              ))}
            </div>

            <div className="mm-material-stats">
              <div className="mm-material-stats__lead">
                From a difficult-to-handle <em>fine stream</em> to a <em>controlled material feedstock.</em>
              </div>
              <div className="mm-material-stats__grid">
                {MATERIAL_STATS.map(({ value, label }) => (
                  <div className="mm-material-stat" key={label}>
                    <span className="mm-material-stat__value">{value}</span>
                    <span className="mm-material-stat__label">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="/solutions/material-science"
              onClick={goToGranulationProcess}
              className="mm-material-callout mm-material-callout--link"
            >
              <p>
                This material innovation demonstrates how mining and mineral byproducts can be
                re-engineered into controlled forms, unlocking new possibilities for internal
                reuse and advanced industrial applications.
              </p>
              <span className="mm-material-callout__btn">
                Watch the Granulation Process
                <ChevronRight size={16} aria-hidden="true" />
              </span>
            </a>

          </div>
        </div>
      </section>

      {/* ── THE RENEONIX APPROACH ── */}
      <section className="section section-paper">
        <div className="container">
          <div className="mm-approach mm-reveal">

            <div className="mm-approach__left">
              <span className="eyebrow">The Reneonix Approach</span>
              <h2>From Byproduct to <em>Industrial Input</em></h2>
              <p className="mm-approach__lead">
                We combine material science, process engineering, traceability and AI to convert
                complex byproduct streams into valuable, consistent and traceable industrial
                materials.
              </p>

              <div className="mm-approach__steps">
                {SOLUTION_BLOCKS.map((block, i) => (
                  <div
                    key={block.num}
                    className={`mm-approach__step${i === activeStep ? ' is-active' : ''}`}
                  >
                    <div className="mm-approach__step-circle-col">
                      <span className="mm-approach__step-circle">{block.num}</span>
                    </div>

                    <div className="mm-approach__step-content">
                      <button
                        type="button"
                        className="mm-approach__step-header"
                        onClick={() => setActiveStep(i)}
                        onMouseEnter={() => setActiveStep(i)}
                      >
                        <span className="mm-approach__step-title">{block.title}</span>
                        <ChevronDown
                          size={16}
                          className={`mm-approach__step-chevron${i === activeStep ? ' is-open' : ''}`}
                          aria-hidden="true"
                        />
                      </button>

                      {i === activeStep && (
                        <div className="mm-approach__step-desc">
                          <p>{block.body}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mm-approach__right">
              <div className="mm-approach__media">
                {SOLUTION_BLOCKS.map((block, i) => (
                  <img
                    key={block.num}
                    src={block.img}
                    alt={block.imgLabel}
                    className={`mm-approach__media-img${i === activeStep ? ' is-active' : ''}${block.imgFit === 'contain' ? ' mm-approach__media-img--contain' : ''}`}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                <div className="mm-approach__media-dots" aria-hidden="true">
                  {SOLUTION_BLOCKS.map((block, i) => (
                    <span
                      key={block.num}
                      className={`mm-approach__media-dot${i === activeStep ? ' is-active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>

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
            {FLOW_STEPS.map((step, i) => (
              <div className="mm-flow-rail__cell" key={step.tag}>
                <span className="mm-flow-rail__num">{String(i + 1).padStart(2, '0')}</span>
                {i < FLOW_STEPS.length - 1 && <ChevronRight size={16} className="mm-flow-rail__chevron" />}
              </div>
            ))}
          </div>

          <div className="mm-flow-cards">
            {FLOW_STEPS.map(({ tag, title, body, imgLabel, img }, i) => (
              <div className="mm-flow-card mm-reveal" key={tag} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="mm-flow-card__media">
                  {img ? (
                    <img src={img} alt={imgLabel} loading="lazy" decoding="async" />
                  ) : (
                    <div className="mm-flow-card__placeholder" role="img" aria-label={imgLabel}>
                      <ImageIcon size={18} aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="mm-flow-card__body">
                  <span className="mm-flow-card__tag">{tag}</span>
                  <h5>{title}</h5>
                  <p>{body}</p>
                </div>
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
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
