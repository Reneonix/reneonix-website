import { useState } from 'react';
import {
  Calendar, Clock, User, ChevronRight, ChevronDown, ArrowRight,
  ShieldCheck,
  Link2, BarChart3, Sparkles,
  Eye, Image as ImageIcon,
  FileText, Search, Users, Check,
  Layers, Cpu,
} from 'lucide-react';
import ArticlePDF from '../pdf/ArticlePDF.jsx';
import traceosPdfData from '../pdf/data/traceosPdfData.js';
import BridgeQuote, { BrushFilterDefs } from './BridgeQuote.jsx';
import { navigate, navClick } from '../utils/nav.js';
import './BlogArticleTraceOS.css';

// Stands in for a real photo until one is uploaded to /public — swap the
// <ImagePlaceholder> for an <img src="/…" alt="…" /> once the asset lands.
function ImagePlaceholder({ label }) {
  return (
    <div className="tos-img-placeholder" role="img" aria-label={label}>
      <ImageIcon size={30} aria-hidden="true" />
      <span>Image placeholder</span>
    </div>
  );
}

// Dark, monospace "system readout" card standing in for a live product
// screenshot on each journey leg — mirrors the platform's own status panels.
function TosMock({ mock }) {
  return (
    <div className="tos-mock">
      <div className="tos-mock__title">
        <span>{mock.title}</span>
        <span className="tos-mock__tag">{mock.tag}</span>
      </div>
      {mock.rows.map(({ k, v, good }) => (
        <div className="tos-mock__row" key={k}>
          <span className="tos-mock__k">{k}</span>
          <span className={`tos-mock__v${good ? ' is-good' : ''}`}>{v}</span>
        </div>
      ))}
      {mock.stamp && (
        <span className="tos-mock__stamp"><Check size={12} strokeWidth={3} /> {mock.stamp}</span>
      )}
    </div>
  );
}

const CHAPTER1_FEATURES = [
  { Icon: ShieldCheck, title: 'Verified Material Origin', desc: 'Know where it came from with confidence' },
  { Icon: Layers, title: 'Complete Processing History', desc: 'Every step is recorded and fully verifiable' },
  { Icon: Users, title: 'Trusted Digital Identity', desc: 'Every material carries a verified digital passport' },
];

const TRUST_PROBLEMS = [
  { Icon: Eye, title: 'No Real-Time Visibility', desc: 'Recovery performance cannot be monitored in real time.' },
  { Icon: FileText, title: 'Manual Documentation', desc: 'Time-consuming paperwork leads to delays and human errors.' },
  { Icon: Search, title: 'No Proof of Material Origin', desc: 'Difficult to verify recycled content and material origins.' },
  { Icon: BarChart3, title: 'Fragmented Reporting', desc: 'Compliance reporting relies on disconnected spreadsheets and manual processes.' },
  { Icon: Users, title: 'Limited Supply Chain Transparency', desc: 'Stakeholders operate with incomplete and disconnected data.' },
];

const JOURNEY_LEGS = [
  {
    num: '01', role: 'Material Registration', title: 'The Batch Gets a Name',
    body: "Every batch enters the ecosystem through a unique digital identity. Source information and material details are securely recorded - from this moment, the batch is never anonymous again.",
    mock: {
      title: 'Registration', tag: 'new',
      rows: [
        { k: 'Batch ID', v: 'RTZ-2026-04128' },
        { k: 'Material', v: 'glass · mixed' },
        { k: 'Source', v: 'verified', good: true },
      ],
    },
  },
  {
    num: '02', role: 'AI-Powered Verification', title: 'The Machines Vouch for It',
    body: 'AI systems capture classification results, contamination levels, quality metrics and recovery outcomes for an auditable history. No human transcription - the hardware that processed the batch is the witness that signs its record.',
    mock: {
      title: 'Verification', tag: 'auto',
      rows: [
        { k: 'Quality', v: '96.8% pass', good: true },
        { k: 'Contamination', v: 'low', good: true },
        { k: 'Signed by', v: 'MRM · AI Vision' },
      ],
    },
  },
  {
    num: '03', role: 'Live Operational Intelligence', title: 'The Story Becomes Visible',
    body: 'Real-time dashboards surface volumes, quality trends, efficiency and site performance - so operators see problems while they are still small, not after a shipment has already gone out.',
    mock: {
      title: 'Dashboard', tag: 'live',
      rows: [
        { k: 'Throughput', v: '285,430 kg' },
        { k: 'Trend', v: '▲ rising', good: true },
        { k: 'Alerts', v: '0 open' },
      ],
    },
  },
  {
    num: '04', role: 'Compliance & Reporting', title: 'The Proof Is Ready Before Anyone Asks',
    body: 'Automated reports for EPR, carbon impact, recycled-content verification and batch-level documentation. When the buyer asks "can you prove it?", the answer is one click away.',
    mock: {
      title: 'Report', tag: 'ready',
      rows: [
        { k: 'EPR', v: 'compliant', good: true },
        { k: 'Recycled content', v: 'verified', good: true },
        { k: 'Provenance', v: 'complete', good: true },
      ],
      stamp: 'AUDIT-READY',
    },
  },
];

const AI_FEATURES = [
  { title: 'Detect Quality Deviations Early', desc: 'Identify contamination and quality issues before they impact recovery.' },
  { title: 'Monitor Machine Health in Real Time', desc: 'Track equipment performance and detect anomalies instantly.' },
  { title: 'Identify Operational Bottlenecks', desc: 'Spot inefficiencies and improve workflow across operations.' },
  { title: 'Improve Recovery Quality Continuously', desc: 'Use AI insights to drive better material recovery outcomes over time.' },
  { title: 'Predict Failures Before Downtime', desc: 'Proactively address risks and minimise unexpected disruptions.' },
];

const INSIGHT_SOURCES = [
  { label: 'Live Feed', status: 'Active' },
  { label: 'Machine Data', status: 'Normal' },
  { label: 'Material Quality', status: 'Good' },
];

const DASHBOARD_STATS = [
  { label: 'Recovery Rate', value: '92%', delta: '8% vs last 7 days' },
  { label: 'Material Quality', value: 'A Grade', delta: '12% vs last 7 days' },
  { label: 'Equipment Uptime', value: '98.5%', delta: '3% vs last 7 days' },
];

const DASHBOARD_ALERTS = [
  'High contamination detected in Sorting Line 2',
  'Recovery rate below target in Line 3',
  'Maintenance recommended for Shredder Unit',
];

const DASHBOARD_RECS = [
  'Optimise sorting operations in Line 3',
  'Schedule maintenance for Shredder Unit',
];

const STAKEHOLDERS = [
  { label: 'Manufacturers', caption: 'Trust in recycled content', desc: 'Verified proof that every recycled batch meets quality and compliance standards before it enters production.' },
  { label: 'Industrial Buyers', caption: 'Verified quality and provenance', desc: 'Source recovered materials with confidence, backed by verified quality scores and complete origin history.' },
  { label: 'Brands', caption: 'Transparent sustainability reporting', desc: 'Publish accurate, audit-ready sustainability claims backed by real recovery data - not estimates.' },
  { label: 'Regulators', caption: 'Accurate compliance documentation', desc: 'Access verifiable, tamper-proof records for EPR audits and regulatory reporting, on demand.' },
];

const FUTURE_CAPS = [
  { Icon: Link2,       label: 'Seamless Integration', caption: 'Works hand-in-hand with MRM and AI Vision hardware' },
  { Icon: BarChart3,   label: 'Scalable Platform', caption: 'Built to grow with operations and evolving industry needs' },
  { Icon: ShieldCheck, label: 'Secure & Reliable', caption: 'Enterprise-grade security ensures data integrity and privacy' },
  { Icon: Sparkles,    label: 'Continuous Innovation', caption: 'AI models and insights improve with every material processed' },
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

export default function BlogArticleTraceOS() {
  const [activeLeg, setActiveLeg] = useState(0);

  return (
    <article className="tos-article">
      <BrushFilterDefs />

      {/* =============== HERO =============== */}
      <section className="tos-hero">
        <div className="tos-hero__bg-veil" />
        <nav className="tos-breadcrumb" aria-label="Breadcrumb">
          <a href="/" onClick={goHome}>Home</a>
          <ChevronRight size={13} aria-hidden="true" />
          <a href="/blog" onClick={navClick('/blog')}>Blog</a>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="is-current">TraceOS (Retraiz): Building Trust Through End-to-End Traceability</span>
        </nav>
        <div className="tos-hero__inner">
          <span className="tos-hero__chip">Traceability</span>
          <h1>TraceOS (Retraiz): Building Trust Through End-to-End Traceability</h1>
          <p className="tos-hero__lead">
            How our traceability platform ensures batch-level visibility, EPR compliance and
            real-time operational intelligence.
          </p>
          <div className="tos-hero__meta">
            <span><Calendar size={14} /> April 15, 2026</span>
            <span className="tos-hero__dot" aria-hidden="true">•</span>
            <span><Clock size={14} /> 6 min read</span>
            <span className="tos-hero__dot" aria-hidden="true">•</span>
            <span><User size={14} /> By <b className="tos-hero__meta-author">Reneonix Product Team</b></span>
          </div>
        </div>
        <a href="#chapter-1" className="tos-hero__scroll-cue" onClick={(e) => jumpTo(e, 'chapter-1')}>
          Scroll to read <ChevronDown size={15} />
        </a>
      </section>

      {/* =============== CHAPTER 01 — WHY TRACEABILITY MATTERS =============== */}
      <section className="tos-chapter1" id="chapter-1">
        <div className="container tos-chapter1__grid">
          <div className="tos-chapter1__text">
            <span className="tos-eyebrow">The Question Every Buyer Asks</span>
            <h2 className="tos-chapter1__title">
              Why Traceability Is<br />
              the <em>Missing Link</em><br />
              in the Circular Economy
            </h2>
            <p>
              Recovering valuable materials is only the first step toward a circular economy.
              Today's manufacturers, recyclers and regulators expect more than recovered
              resources - they expect <strong>verified proof</strong> of where those materials
              came from, how they were processed, and whether they meet industrial quality
              standards.
            </p>
            <p>
              Without reliable traceability, even high-quality recovered materials can lose
              value, because buyers cannot confidently verify their origin or processing
              history.
            </p>
          </div>

          <div className="tos-chapter1__features">
            {CHAPTER1_FEATURES.map(({ Icon, title, desc }) => (
              <div className="tos-chapter1__feature" key={title}>
                <span className="tos-chapter1__feature-icon"><Icon size={22} /></span>
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </div>

          <div className="tos-chapter1__media">
            <img src="/passport article.png" alt="Recovered glass bottle with a scannable QR code label beside its digital material passport card showing batch ID, origin, quality grade and verification status" />
          </div>
        </div>
      </section>

      <BridgeQuote>If proof is what decides value - why is proof so <b>hard to obtain</b> today?</BridgeQuote>

      {/* =============== CHAPTER 02 — WHY TRADITIONAL SYSTEMS FALL SHORT =============== */}
      <section className="tos-chapter" id="chapter-2">
        <div className="container">
          <div className="tos-problems__head">
            <span className="tos-eyebrow">Why Paper Trails Break</span>
            <h2 className="tos-problems__title">
              Traditional Recovery Systems<br /><span>Fall Short</span>
            </h2>
            <p>
              Many recovery facilities still depend on manual records, disconnected
              spreadsheets and isolated software systems. The result:
            </p>
          </div>

          <div className="tos-problems">
            {TRUST_PROBLEMS.map(({ Icon, title, desc }) => (
              <div className="tos-problem-card" key={title}>
                <span className="tos-problem-card__icon"><Icon size={30} strokeWidth={1.75} /></span>
                <h3>{title}</h3>
                <span className="tos-problem-card__underline" aria-hidden="true" />
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BridgeQuote>The fix is not in the paperwork, It lies in the system where <b>the record creates itself</b></BridgeQuote>

      {/* =============== CHAPTER 03 — INTRODUCING TRACEOS (RETRAIZ) =============== */}
      <section className="tos-intro" id="chapter-3">
        {/* Full-bleed background stays on the <section>; this inner grid is
            capped at --content-maxw so the two columns don't stretch into
            dead space on ultrawide/4K monitors, matching how .container
            caps every other chapter in this article. */}
        <div className="tos-intro__inner">
          <div className="tos-intro__text">
            <span className="tos-eyebrow">A Digital Backbone for Material Recovery</span>
            <h2>Introducing <span className="tos-intro__accent">TraceOS (Retraiz)</span></h2>
            <p>
              TraceOS is the digital intelligence layer of the Reneonix ecosystem. Integrated
              directly with our AI-powered hardware - including the Material Recovery Machine
              (MRM) and AI Vision Sorting modules - the platform continuously captures
              operational data without interrupting recovery workflows.
            </p>
            <div className="tos-intro__media tos-intro__media--inline">
              <img src="/Sample dashboard .jpeg" alt="AI bottle detection dashboard showing real-time brand, colour and size analytics with 92% average confidence" />
            </div>
            <p>
              Every batch of material receives a unique digital identity that follows it through
              every stage of processing, creating a secure and auditable record of its journey.
              Instead of fragmented data, organisations gain a{' '}
              <strong>single source of truth</strong> for their recovery operations.
            </p>
            <p className="tos-pull">
              The batch doesn't just move through the facility. Its story is written, verified
              and sealed - automatically, at every step.
            </p>
          </div>
          <div className="tos-intro__media">
            <img src="/Sample dashboard .jpeg" alt="AI bottle detection dashboard showing real-time brand, colour and size analytics with 92% average confidence" />
          </div>
        </div>
      </section>

      <BridgeQuote>Meet batch <b>RTZ-2026-04128</b>. Here is its life, in four stages</BridgeQuote>

      {/* =============== CHAPTER 04 — HOW TRACEOS WORKS =============== */}
      <section className="tos-journey" id="chapter-4">
        <div className="container">
          <h2 className="tos-journey__head">How <em>TraceOS</em> Works</h2>
          <p className="tos-journey__sub">A connected process from source to circular reuse - four stages, one continuous record.</p>

          <div className="tos-journey__list">
            {JOURNEY_LEGS.map((leg, i) => (
              <div
                className={`tos-leg${activeLeg === i ? ' is-active' : ''}`}
                key={leg.num}
                onMouseEnter={() => setActiveLeg(i)}
                onClick={() => setActiveLeg(i)}
              >
                <div className="tos-leg__rail"><span className="tos-leg__node">{leg.num}</span></div>
                <div className="tos-leg__body">
                  <p className="tos-leg__role">{leg.role}</p>
                  <h3>{leg.title}</h3>
                  <p>{leg.body}</p>
                </div>
                <div className="tos-leg__shot">
                  <TosMock mock={leg.mock} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BridgeQuote>A record that creates itself is useful but record that <b>learns</b> is transformated.</BridgeQuote>

      {/* =============== CHAPTER 05 — AI DECISION SUPPORT =============== */}
      <section className="tos-insight" id="chapter-5">
        <div className="container">
          <div className="tos-insight__grid">
            <div className="tos-insight__text">
              <span className="tos-eyebrow">From Record to Insight</span>
              <h2>Turn Recovery Data Into <em>Smarter Decisions</em></h2>
              <p>
                Every recovery event creates valuable data. TraceOS transforms that data into
                actionable AI insights, helping operators detect issues early, improve recovery
                performance, and make faster, more confident decisions.
              </p>

              <div className="tos-insight__feats">
                {AI_FEATURES.map(({ title, desc }) => (
                  <div className="tos-insight__feat" key={title}>
                    <strong>{title}</strong>
                    <span>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tos-insight__viz">
              <div className="tos-insight__sources">
                {INSIGHT_SOURCES.map(({ label, status }) => (
                  <div className="tos-source" key={label}>
                    <strong>{label}</strong>
                    <span className="tos-source__status"><i aria-hidden="true" />{status}</span>
                  </div>
                ))}
              </div>

              <span className="tos-insight__connector" aria-hidden="true" />

              <div className="tos-hub">
                <span className="tos-hub__pulse" aria-hidden="true" />
                <span className="tos-hub__core"><Cpu size={22} /><b>AI</b></span>
              </div>

              <span className="tos-insight__connector" aria-hidden="true" />

              <div className="tos-dashboard">
                <div className="tos-dashboard__head">
                  <h3>Recovery Performance</h3>
                  <span className="tos-dashboard__range">Last 7 Days</span>
                </div>

                <div className="tos-dashboard__stats">
                  {DASHBOARD_STATS.map(({ label, value, delta }) => (
                    <div className="tos-dashboard__stat" key={label}>
                      <span className="tos-dashboard__stat-k">{label}</span>
                      <span className="tos-dashboard__stat-v">{value}</span>
                      <span className="tos-dashboard__stat-d">▲ {delta}</span>
                    </div>
                  ))}
                </div>

                <p className="tos-dashboard__sec">AI Insights</p>
                <div className="tos-dashboard__list">
                  {DASHBOARD_ALERTS.map((text) => (
                    <div className="tos-dashboard__row" key={text}>
                      <span>{text}</span>
                      <a href="#chapter-4" className="tos-dashboard__view" onClick={(e) => jumpTo(e, 'chapter-4')}>View</a>
                    </div>
                  ))}
                </div>

                <p className="tos-dashboard__sec">Recommendations</p>
                <div className="tos-dashboard__recs">
                  {DASHBOARD_RECS.map((text) => (
                    <div className="tos-dashboard__rec" key={text}>
                      <Check size={14} strokeWidth={2.5} /> {text}
                    </div>
                  ))}
                </div>

                <div className="tos-dashboard__foot">
                  <ShieldCheck size={13} /> All insights are verified and secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BridgeQuote>The story of every batch doesn't just stay inside the facility - <b>which is the whole point</b></BridgeQuote>

      {/* =============== CHAPTER 06 — BUILDING TRUST THROUGH TRANSPARENCY =============== */}
      <section className="tos-trust" id="chapter-6">
        <div className="container">
          <div className="tos-trust__head">
            <span className="tos-eyebrow">Trust, Distributed</span>
            <h2>Building Trust Through <em>Transparency</em></h2>
            <p>
              TraceOS enables every stakeholder to access reliable, verifiable recovery data -
              strengthening confidence across the entire material recovery ecosystem.
            </p>
          </div>

          <div className="tos-trust__grid">
            <div className="tos-trust__media">
              <img src="/transparency article.png" alt="Verification shield connected to compliance documents, global location tracking, quality trends and audit checklist — representing trusted, verifiable recovery data" />
            </div>
            <div className="tos-stakeholders">
              {STAKEHOLDERS.map(({ label, caption, desc }) => (
                <div className="tos-stakeholder" key={label}>
                  <strong>{label}</strong>
                  <span className="tos-stakeholder__caption">{caption}</span>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =============== CHAPTER 07 — DESIGNED FOR THE FUTURE =============== */}
      <section className="tos-future" id="chapter-7">
        <div className="container">
          <h2 className="tos-future__head">Designed for What's <em>Next</em></h2>
          <p className="tos-future__body">
            TraceOS has been designed to support a future where AI, automation and
            traceability work together to create intelligent, connected recovery systems.
          </p>

          <div className="tos-future__grid">
            {FUTURE_CAPS.map(({ Icon, label, caption }) => (
              <div className="tos-future__cell" key={label}>
                <Icon size={22} aria-hidden="true" />
                <strong>{label}</strong>
                <span>{caption}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== GO TO BLOG =============== */}
      <div className="tos-goto-blog">
        <ArticlePDF article={traceosPdfData} />
        <a className="btn btn-primary" href="/blog" onClick={goToBlogLatest}>
          Back to Blog <ArrowRight size={16} />
        </a>
      </div>

    </article>
  );
}
