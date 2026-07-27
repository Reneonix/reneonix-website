import { useEffect, useRef, useState } from 'react';
import {
  Calendar, Clock, User, ChevronRight, ChevronDown, ArrowRight, ArrowLeft, X, Check,
  Trash2, Blend, Biohazard, Filter, ScanEye, Bot, Recycle, ShieldCheck,
  Eye, Cpu, FlaskConical, Activity,
  Layers, Ruler, Tag, BarChart3, Leaf, Box, CheckCircle2, Timer,
} from 'lucide-react';
import { navigate, navClick } from '../utils/nav.js';
import './BlogArticleMRM.css';
import ArticlePDF from '../pdf/ArticlePDF.jsx';
import mrmPdfData from '../pdf/data/mrmPdfData.js';
import BridgeQuote, { BrushFilterDefs } from './BridgeQuote.jsx';

const TRADITIONAL_STEPS = [
  { Icon: Trash2, label: 'Collect' },
  { Icon: Blend, label: 'Mix' },
  { Icon: Biohazard, label: 'Contaminate' },
  { Icon: Filter, label: 'Sort Late' },
];
const MRM_STEPS = [
  { Icon: ScanEye, label: 'Identify' },
  { Icon: Bot, label: 'AI Scan' },
  { Icon: Recycle, label: 'Recover' },
  { Icon: ShieldCheck, label: 'Verify at Source' },
];
const TRADITIONAL_POINTS = [
  'Leads to contamination and low material quality',
  'High manual effort and operational cost',
  'Poor traceability and inconsistent outcomes',
];
const MRM_POINTS = [
  'Clean streams and higher material purity',
  'Reduced manual intervention, higher efficiency',
  'Full traceability and source-level verification',
  'Ready for industrial reuse and circular economy',
];
const PROBLEMS = [
  'Mixed and contaminated material streams',
  'Low-quality recovered materials',
  'High manual sorting effort',
  'Little or no traceability',
  'Reduced potential for industrial reuse',
];
const REUSE_ITEMS = [
  { title: 'Brand identification', desc: 'Match with approved brand list' },
  { title: 'Bottle condition analysis', desc: 'Ensure bottle is intact and reusable' },
  { title: 'Size segregation', desc: 'Group by size for refill compatibility' },
  { title: 'Refill-ecosystem readiness', desc: 'Approved for refill and redistribution' },
];
const RECYCLE_ITEMS = [
  { title: 'Colour sorting', desc: 'Separate by colour for purity' },
  { title: 'Contamination detection', desc: 'Remove contaminants and labels' },
  { title: 'Material classification', desc: 'Identify polymer type (PET, HDPE, etc.)' },
  { title: 'Processor-ready preparation', desc: 'Shred, clean and format for processors' },
];
const MATERIAL_CHECKS = [
  { Icon: Layers, label: 'Material', value: 'Glass' },
  { Icon: ShieldCheck, label: 'Condition', value: 'Excellent' },
  { Icon: Ruler, label: 'Size', value: '330 ml' },
  { Icon: FlaskConical, label: 'Contamination', value: 'None' },
  { Icon: Tag, label: 'Brand', value: 'Verified' },
  { Icon: BarChart3, label: 'Confidence', value: '98.7%' },
];
const LIVE_ANALYSIS_STATS = [
  { Icon: Box, label: 'Scanned', value: '100%' },
  { Icon: CheckCircle2, label: 'Verified', value: '98.7%' },
  { Icon: Layers, label: 'Materials', value: '1' },
  { Icon: Timer, label: 'Processing Time', value: '0.8 sec' },
];
const JOURNEY_LEGS = [
  {
    num: '01',
    short: 'Intake',
    role: 'Smart Material Intake',
    title: 'The Bottle Is Deposited',
    body: "A user places the bottle into MRM's intake. Before it has even settled, integrated sensors and AI vision begin real-time analysis. The bottle is no longer anonymous - the machine is already watching.",
  },
  {
    num: '02',
    short: 'AI Vision',
    role: 'AI Vision Inspection',
    title: 'The Bottle Is Seen - Completely',
    body: 'Within milliseconds, the system automatically detects material type, colour, condition and contamination level. What a human sorter judges in seconds, per item, MRM resolves instantly and consistently - every single time.',
  },
  {
    num: '03',
    short: 'Decision',
    role: 'Recovery Decision',
    title: "The Bottle's Future Is Decided",
    body: 'Based on the AI analysis, MRM determines the optimal recovery pathway and directs the bottle to reuse or recycling - ensuring maximum value is recovered from every single item. Our bottle is intact and clean, so it earns the highest-value outcome: reuse.',
  },
  {
    num: '04',
    short: 'Traceability',
    role: 'Digital Traceability',
    title: 'The Bottle Leaves With an Identity',
    body: "Every deposited item is securely recorded in Retraiz (TraceOS), Reneonix's traceability platform - enabling complete source-to-output traceability. The bottle that arrived as waste leaves as a verified, documented industrial material.",
  },
];
const CLASSIFICATION = [
  { label: 'Material', value: 'PET' },
  { label: 'Colour', value: 'Clear' },
  { label: 'Condition', value: 'Intact', good: true },
  { label: 'Contamination', value: 'Low', good: true },
];
const AI_STATUS = [
  { label: 'Object Detection' },
  { label: 'Vision + Sensors' },
  { label: 'AI Analysis' },
  { label: 'TraceOS Logging' },
];
const STATS = [
  { value: '3', label: 'Material types supported today', note: 'glass · PET · aluminium' },
  { value: '450–500', label: 'Reusable bottles per cycle', note: 'condition-verified' },
  { value: '250 kg', label: 'Recycling capacity per cycle', note: 'processor-ready output' },
];
const CAPABILITIES = [
  'AI-powered multi-spectral vision',
  'Real-time on-edge processing',
  'Modular architecture for future material expansion',
];
const ECOSYSTEM = [
  { Icon: Eye, label: 'AI Vision', caption: 'Real-time perception & classification' },
  { Icon: Cpu, label: 'MRM (AI)', caption: 'Front-end recovery', core: true },
  { Icon: ShieldCheck, label: 'TraceOS', caption: 'End-to-end digital traceability' },
  { Icon: FlaskConical, label: 'Material Science', caption: 'R&D for new materials & value creation' },
];

// The AI Decision Engine's read-out — shared between the desktop center
// column and the mobile common panel, so both stay in sync automatically.
function MaterialVerifyCard() {
  return (
    <div className="ba-pathways__verify-card">
      <div className="ba-pathways__verify-head">
        <span className="ba-pathways__verify-check"><Check size={18} aria-hidden="true" /></span>
        <div>
          <strong>Material Verified</strong>
          <span>Analysis Complete</span>
        </div>
      </div>

      <div className="ba-pathways__verify-rows">
        {MATERIAL_CHECKS.map(({ Icon, label, value }) => (
          <div className="ba-pathways__verify-row" key={label}>
            <span className="ba-pathways__verify-label"><Icon size={14} aria-hidden="true" /> {label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="ba-pathways__verify-decision">
        <span className="ba-pathways__verify-decision-label">AI Decision</span>
        <div className="ba-pathways__verify-decision-box">
          <Leaf size={20} aria-hidden="true" />
          <div>
            <strong>Reuse Stream</strong>
            <span>Highest Value Pathway Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function goHome(e) {
  e.preventDefault();
  navigate('/');
}

// Cross-page nav to the Blog page's Latest Articles section — a
// sessionStorage handoff read by the Blog page on mount to scroll there.
function goToBlogLatest(e) {
  e.preventDefault();
  sessionStorage.setItem('sw_scroll_target', 'latest-articles');
  navigate('/blog');
}

// In-page anchors stay plain scroll-into-view rather than going through
// navigate() — this mirrors the same-page scroll helper already used in
// Footer.jsx, and keeps a chapter jump from ever creating a history entry.
function jumpTo(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const navH = document.querySelector('header')?.offsetHeight ?? 80;
  const y = el.getBoundingClientRect().top + window.pageYOffset - navH - 16;
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}

export default function BlogArticleMRM() {
  const [activeIcons, setActiveIcons] = useState(() => new Set());
  const toggleIcon = (key) => {
    setActiveIcons((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Mobile pathways layout shows one pathway at a time behind a tab switch
  // instead of stacking both full cards — desktop keeps the 3-column grid.
  const [activePathway, setActivePathway] = useState('reuse');

  // Tracks which journey leg is centered in the viewport, so the sticky
  // visual's progress bar and the active leg's highlight stay in sync
  // with scroll position.
  const [activeLeg, setActiveLeg] = useState(0);
  const legRefs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = legRefs.current.indexOf(entry.target);
          if (idx !== -1) setActiveLeg(idx);
        }
      }),
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    legRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <article className="ba-article">
      <BrushFilterDefs />

      {/* =============== HERO =============== */}
      <section className="ba-hero">
        <div className="ba-hero__bg-veil" />
        <nav className="ba-breadcrumb" aria-label="Breadcrumb">
          <a href="/" onClick={goHome}>Home</a>
          <ChevronRight size={13} aria-hidden="true" />
          <a href="/blog" onClick={navClick('/blog')}>Blog</a>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="is-current">MRM (AI): The Next-Gen Front-End Recovery</span>
        </nav>
        <div className="ba-hero__inner">
          <span className="ba-hero__chip">Technology</span>
          <h1>MRM (AI): The Next-Gen Front-End Recovery for Circular Materials</h1>
          <p className="ba-hero__lead">
            How our AI-powered Material Recovery Machine identifies, grades and separates
            materials at the source with high precision.
          </p>
          <div className="ba-hero__meta">
            <span><Calendar size={14} /> May 8, 2026</span>
            <span className="ba-hero__dot" aria-hidden="true">•</span>
            <span><Clock size={14} /> 6 min read</span>
            <span className="ba-hero__dot" aria-hidden="true">•</span>
            <span><User size={14} /> By <b className="ba-hero__meta-author">Reneonix Engineering Team</b></span>
          </div>
        </div>
        <a href="#chapter-1" className="ba-hero__scroll-cue" onClick={(e) => jumpTo(e, 'chapter-1')}>
          Scroll to read <ChevronDown size={15} />
        </a>
      </section>

      {/* =============== CHAPTER 01 — WHERE THE BOTTLE STARTS =============== */}
      <section className="ba-challenge" id="chapter-1">
        <div className="ba-challenge__media">
          <img src="/challenge-photo.jpg" alt="Volunteers manually sorting mixed, contaminated recyclable waste" />
        </div>
        <div className="ba-challenge__text">
          <h2>A Bottle's Worth Is Lost in the <em>First Ten Minutes</em></h2>
          <p>
            Picture our bottle a second before recovery begins. It is clean, intact, food-grade
            glass - at its <strong>highest possible value</strong>. Then it lands in a mixed
            collection stream, and everything conventional recovery does next works against it.
          </p>
          <p>
            Most recovery systems depend on downstream sorting, where mixed materials arrive at
            Material Recovery Facilities (MRFs). By that stage, contamination has already
            eroded both the quality and the value of recyclable materials.
          </p>
          <div className="ba-challenge__media ba-challenge__media--inline">
            <img src="/challenge-photo.jpg" alt="Volunteers manually sorting mixed, contaminated recyclable waste" />
          </div>
          <strong className="ba-challenge__lead-in">The most common problems include:</strong>
          <div className="ba-challenge__problems">
            <div className="ba-challenge__problems-col">
              {PROBLEMS.slice(0, 3).map((problem) => (
                <div className="ba-challenge__problem" key={problem}>
                  <span className="ba-challenge__problem-dot" aria-hidden="true" />
                  <span>{problem}</span>
                </div>
              ))}
            </div>
            <div className="ba-challenge__problems-col">
              {PROBLEMS.slice(3).map((problem) => (
                <div className="ba-challenge__problem" key={problem}>
                  <span className="ba-challenge__problem-dot" aria-hidden="true" />
                  <span>{problem}</span>
                </div>
              ))}
            </div>
          </div>
          <p>
            Together, these limitations make it nearly impossible to produce consistent,
            industrial-grade secondary raw materials - the exact input modern manufacturers
            are asking for.
          </p>
        </div>
      </section>

      <BridgeQuote>The problem is not just how we sort but it is also <b>when</b> we start</BridgeQuote>

      {/* =============== CHAPTER 02 — RETHINKING RECOVERY AT THE SOURCE =============== */}
      <section className="ba-recovery" id="recovery">
        <div className="ba-recovery__text">
          <h2><em>Identify First,</em> Collect Second</h2>
          <p>
            Traditional material recovery was designed around a simple idea:{' '}
            <strong>collect first, sort later</strong>. It has served the industry for decades,
            but it comes at a cost  contamination, inefficient sorting, and material quality too
            inconsistent for high-value industrial reuse.
          </p>
          <p>
            At Reneonix, we believe valuable materials should be identified, classified, and
            recovered at the very beginning of the recovery chain- not after they have become
            mixed waste. That is why we built{' '}
            <span className="ba-recovery__accent">MRM (AI)</span>, the Material Recovery
            Machine: an intelligent front-end recovery platform combining AI vision, edge
            computing, sensor technology, and digital traceability.
          </p>
          <div className="ba-recovery__media ba-recovery__media--inline">
            <img src="/recovery-photo.png" alt="MRM (AI) live classification scanning a PET bottle on the recovery line" />
          </div>
          <p className="ba-pull">
            Turn discarded materials into verified, buyer-ready industrial raw materials - at
            the moment they enter the chain.
          </p>
        </div>
        <div className="ba-recovery__media">
          <img src="/recovery-photo.png" alt="MRM (AI) live classification scanning a PET bottle on the recovery line" />
        </div>
      </section>

      {/* =============== TRADITIONAL VS MRM COMPARISON =============== */}
      <section className="ba-compare" id="comparison">
        <div className="container">
          <div className="ba-compare__head">
            <span className="ba-compare__eyebrow">Two Approaches to Material Recovery</span>
            <h2>Traditional vs Front-End Recovery with <span className="ba-compare__accent">MRM (AI)</span></h2>
            <p className="ba-compare__sub">
              MRM (AI) transforms material recovery at the source - using intelligent identification,
              real-time analysis, and automation to deliver cleaner, higher-value outputs.
            </p>
          </div>

          <div className="ba-compare__grid">
            <div className="ba-compare__card ba-compare__card--old">
              <span className="ba-compare__label ba-compare__label--old">Traditional Recovery</span>

              <div className="ba-compare__flow">
                {TRADITIONAL_STEPS.map(({ Icon, label }, i) => (
                  <div className="ba-compare__step" key={label}>
                    <button
                      type="button"
                      className={`ba-compare__icon${activeIcons.has(`old-${label}`) ? ' is-active' : ''}`}
                      onClick={() => toggleIcon(`old-${label}`)}
                      aria-pressed={activeIcons.has(`old-${label}`)}
                      aria-label={label}
                    >
                      <Icon size={32} strokeWidth={1.75} />
                    </button>
                    <strong>{label}</strong>
                    {i < TRADITIONAL_STEPS.length - 1 && (
                      <ArrowRight className="ba-compare__arrow" size={16} aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>

              <div className="ba-compare__list ba-compare__list--bad">
                {TRADITIONAL_POINTS.map((point) => (
                  <div className="ba-compare__point" key={point}>
                    <span className="ba-compare__point-icon"><X size={12} /></span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ba-compare__vs" aria-hidden="true">VS</div>

            <div className="ba-compare__card ba-compare__card--new">
              <span className="ba-compare__label ba-compare__label--new">Front-End Recovery with MRM (AI)</span>

              <div className="ba-compare__flow ba-compare__flow--new">
                {MRM_STEPS.map(({ Icon, label }, i) => (
                  <div className="ba-compare__step" key={label}>
                    <button
                      type="button"
                      className={`ba-compare__icon ba-compare__icon--new${activeIcons.has(`new-${label}`) ? ' is-active' : ''}`}
                      onClick={() => toggleIcon(`new-${label}`)}
                      aria-pressed={activeIcons.has(`new-${label}`)}
                      aria-label={label}
                    >
                      <Icon size={32} strokeWidth={1.75} />
                    </button>
                    <strong>{label}</strong>
                    {i < MRM_STEPS.length - 1 && (
                      <ArrowRight className="ba-compare__arrow ba-compare__arrow--new" size={16} aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>

              <div className="ba-compare__list ba-compare__list--good">
                {MRM_POINTS.map((point) => (
                  <div className="ba-compare__point" key={point}>
                    <span className="ba-compare__point-icon"><Check size={12} /></span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <BridgeQuote>How does our MRM secure a bottle, Four steps are completed in <b>under a second</b></BridgeQuote>

      {/* =============== CHAPTER 03 — ONE BOTTLE'S JOURNEY THROUGH MRM (AI) =============== */}
      <section className="ba-journey" id="journey">
        <div className="container ba-journey__grid">
          <div className="ba-journey__col">
            <h2 className="ba-journey__head">From Anonymous Waste to a <em>Verified Material Record</em></h2>

            <div className="ba-journey__list">
              {JOURNEY_LEGS.map((leg, i) => (
                <div
                  className={`ba-journey__leg${activeLeg === i ? ' is-active' : ''}`}
                  key={leg.num}
                  ref={(el) => { legRefs.current[i] = el; }}
                >
                  <div className="ba-journey__rail"><span className="ba-journey__node">{leg.num}</span></div>
                  <div className="ba-journey__body">
                    <p className="ba-journey__role">{leg.role}</p>
                    <h3>{leg.title}</h3>
                    <p>{leg.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ba-journey__visual">
            <div className="ba-journey__sticky">
              <img src="/mrm-article.png" alt="Reneonix MRM (AI) recovery machine" />

              <div className="ba-journey__cards">
                <div className="ba-journey__card">
                  <div className="ba-journey__card-head">
                    <span>Live Classification</span>
                    <span className="ba-journey__live"><i /> Live</span>
                  </div>
                  {CLASSIFICATION.map(({ label, value, good }) => (
                    <div className="ba-journey__row" key={label}>
                      <span>{label}</span>
                      <strong className={good ? 'is-good' : ''}>{value}</strong>
                    </div>
                  ))}
                  <div className="ba-journey__confidence">
                    <span>Confidence</span>
                    <strong>98.7%</strong>
                    <div className="ba-journey__bar"><i style={{ width: '98.7%' }} /></div>
                  </div>
                </div>

                <div className="ba-journey__card">
                  <div className="ba-journey__card-head">
                    <span>AI System Status</span>
                    <span className="ba-journey__ok">All Systems Active</span>
                  </div>
                  {AI_STATUS.map(({ label }) => (
                    <div className="ba-journey__row" key={label}>
                      <span>{label}</span>
                      <Check size={13} aria-hidden="true" />
                    </div>
                  ))}
                  <div className="ba-journey__throughput">
                    <span>Throughput</span>
                    <strong>462 <small>items / min</small></strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BridgeQuote>Once our MRM knows exactly what a bottle is, it can choose between <b>two futures</b> for it.</BridgeQuote>

      {/* =============== CHAPTER 04 — ONE MACHINE, TWO INTELLIGENT PATHWAYS =============== */}
      <section className="ba-pathways" id="pathways">
        <div className="container">
          <div className="ba-pathways__head">
            <p className="ba-pathways__eyebrow">Intelligent Front-End Recovery</p>
            <div className="ba-pathways__title-row">
              <span className="ba-pathways__title-line" aria-hidden="true" />
              <h2>One Machine, Two Intelligent Pathways</h2>
              <span className="ba-pathways__title-line" aria-hidden="true" />
            </div>
            <p className="ba-pathways__sub">
              MRM (AI) identifies, classifies, and verifies materials the moment they enter the
              recovery chain - <strong>before contamination begins.</strong>
            </p>
          </div>

          <div className="ba-pathways__grid">
            <div className="ba-pathways__card ba-pathways__card--reuse">
              <div className="ba-pathways__card-head">
                <div>
                  <span className="ba-pathways__role ba-pathways__role--reuse">Pathway A</span>
                  <h3>Reuse Stream</h3>
                </div>
                <span className="ba-pathways__tag">Our bottle is here</span>
              </div>
              <p>Materials suitable for reuse are identified and prepared through:</p>
              <div className="ba-pathways__list">
                {REUSE_ITEMS.map(({ title, desc }, i) => (
                  <div className="ba-pathways__item" key={title}>
                    <span className="ba-pathways__item-num ba-pathways__item-num--reuse">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{title}</strong>
                      <span>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ba-pathways__outcome ba-pathways__outcome--reuse">
                <div>
                  <span className="ba-pathways__outcome-label">Outcome</span>
                  <span>Refill Ready • Highest Value • Extended Life</span>
                </div>
              </div>
            </div>

            <div className="ba-pathways__center">
              <span className="ba-pathways__engine"><i aria-hidden="true" /> AI Decision Engine</span>

              <div className="ba-pathways__scanner">
                <MaterialVerifyCard />

                <button className="ba-pathways__pill ba-pathways__pill--reuse" type="button">
                  <ArrowLeft size={12} aria-hidden="true" /> Reuse
                </button>
                <button className="ba-pathways__pill ba-pathways__pill--recycle" type="button">
                  Recycle <ArrowRight size={12} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="ba-pathways__card ba-pathways__card--recycle">
              <div className="ba-pathways__card-head">
                <div>
                  <span className="ba-pathways__role ba-pathways__role--recycle">Pathway B</span>
                  <h3>Recycling Stream</h3>
                </div>
              </div>
              <p>Materials destined for recycling undergo:</p>
              <div className="ba-pathways__list">
                {RECYCLE_ITEMS.map(({ title, desc }, i) => (
                  <div className="ba-pathways__item" key={title}>
                    <span className="ba-pathways__item-num ba-pathways__item-num--recycle">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{title}</strong>
                      <span>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ba-pathways__outcome ba-pathways__outcome--recycle">
                <div>
                  <span className="ba-pathways__outcome-label">Outcome</span>
                  <span>Processor Ready • Clean • Industrial Grade</span>
                </div>
              </div>
            </div>

            <div className="ba-pathways__analysis">
              <span className="ba-pathways__analysis-title">Live Analysis</span>
              <div className="ba-pathways__live-grid">
                {LIVE_ANALYSIS_STATS.map(({ Icon, label, value }) => (
                  <div className="ba-pathways__live-cell" key={label}>
                    <Icon size={16} aria-hidden="true" />
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile-only: the AI Decision Engine scan (image + brand/material
              readout) is common to both pathways — the same bottle is
              identified either way, it's only what happens to it next that
              branches. So it stays fixed while the tabs below switch which
              pathway's steps/outcome/photo are shown. The 3-column grid
              above is hidden at this breakpoint. */}
          <div className="ba-pathways__mobile">
            <div className="ba-pathways__tabs" role="tablist">
              <button
                type="button" role="tab" aria-selected={activePathway === 'reuse'}
                className={`ba-pathways__tab${activePathway === 'reuse' ? ' is-active' : ''}`}
                onClick={() => setActivePathway('reuse')}
              >
                Reuse
              </button>
              <button
                type="button" role="tab" aria-selected={activePathway === 'recycle'}
                className={`ba-pathways__tab${activePathway === 'recycle' ? ' is-active' : ''}`}
                onClick={() => setActivePathway('recycle')}
              >
                Recycling
              </button>
            </div>

            <div className="ba-pathways__mobile-common">
              <span className="ba-pathways__engine"><i aria-hidden="true" /> AI Decision Engine</span>
              <MaterialVerifyCard />

              <div className="ba-pathways__mobile-strip">
                {MATERIAL_CHECKS.filter(({ label }) => label === 'Material' || label === 'Condition').map(({ label, value }) => (
                  <div className="ba-pathways__mobile-strip-cell" key={label}>
                    <span>{label}</span>
                    <strong>{value} <Check size={12} aria-hidden="true" /></strong>
                  </div>
                ))}
                <div className="ba-pathways__mobile-strip-cell">
                  <span>Confidence</span>
                  <strong className="is-lime">98.7%</strong>
                </div>
              </div>

              <div className="ba-pathways__mobile-livescan">
                <span>Live Scan</span>
                <div className="ba-pathways__mobile-livescan-track"><i /><b /></div>
                <Activity size={14} aria-hidden="true" />
              </div>
            </div>

            <div className={`ba-pathways__mobile-panel ba-pathways__mobile-panel--${activePathway}`}>
              <div className="ba-pathways__mobile-panel-head">
                <div>
                  <strong>{activePathway === 'reuse' ? 'Reuse Pathway' : 'Recycling Pathway'}</strong>
                  <span>{activePathway === 'reuse'
                    ? 'Materials suitable for reuse are identified and prepared through:'
                    : 'Materials destined for recycling undergo:'}</span>
                </div>
              </div>

              <div className="ba-pathways__mobile-steps">
                {(activePathway === 'reuse' ? REUSE_ITEMS : RECYCLE_ITEMS).map(({ title, desc }, i) => (
                  <div className={`ba-pathways__mobile-step${activePathway === 'recycle' ? ' ba-pathways__mobile-step--recycle' : ''}`} key={title}>
                    <span className="ba-pathways__mobile-step-num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{title}</strong>
                      <span>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`ba-pathways__outcome ba-pathways__outcome--${activePathway}`}>
                <div>
                  <span className="ba-pathways__outcome-label">Outcome</span>
                  <span>{activePathway === 'reuse' ? 'Refill Ready • Highest Value • Extended Life' : 'Processor Ready • Clean • Industrial Grade'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BridgeQuote>A good story needs proof, Here is what our MRM (AI) delivers on <b>the factory floor</b> today</BridgeQuote>

      {/* =============== CHAPTER 05 — BUILT FOR INDUSTRIAL RECOVERY =============== */}
      <section className="ba-industrial" id="industrial">
        <div className="container">
          <h2 className="ba-industrial__head">Engineered for the <em>Real World</em>, Not the Laboratory</h2>
          <p className="ba-industrial__lead">
            MRM is engineered for real-world industrial deployment. Every deployment
            continuously generates operational and material data, allowing our AI models to
            improve over time and strengthening the entire recovery ecosystem.
          </p>

          <div className="ba-stats">
            {STATS.map(({ value, label, note }) => (
              <div className="ba-stat" key={label}>
                <div className="ba-stat__num">{value}</div>
                <div className="ba-stat__label">{label}</div>
                <div className="ba-stat__note">{note}</div>
              </div>
            ))}
          </div>

          <div className="ba-caps">
            {CAPABILITIES.map((cap) => <span className="ba-cap" key={cap}>{cap}</span>)}
          </div>
        </div>
      </section>

      <BridgeQuote>What about the bottle ? Its record now exists in <b>an ecosystem</b> much bigger than one machine</BridgeQuote>

      {/* =============== CHAPTER 06 — BUILDING THE FUTURE OF CIRCULAR MATERIALS =============== */}
      <section className="ba-future" id="future">
        <div className="container">
          <h2 className="ba-future__head">More Than a <em>Recovery Machine</em></h2>
          <p className="ba-future__body">
            MRM is not simply another sorting machine. It is the intelligent entry point into
            Reneonix's complete circular material infrastructure - connecting AI vision
            hardware, traceability software (Retraiz), material intelligence and industrial
            recovery workflows.
          </p>
          <p className="ba-future__body">
            As industries transition toward verified circular supply chains, intelligent
            recovery infrastructure will become essential - not optional. By combining
            artificial intelligence, advanced hardware and digital traceability, Reneonix is
            transforming fragmented material recovery into a reliable source of high-quality
            secondary raw materials.
          </p>

          <div className="ba-future__grid">
            {ECOSYSTEM.map(({ Icon, label, caption, core }) => (
              <div className={`ba-future__cell${core ? ' is-core' : ''}`} key={label}>
                <Icon size={22} aria-hidden="true" />
                <strong>{label}</strong>
                <span>{caption}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== GO TO BLOG =============== */}
      <div className="ba-goto-blog">
        <ArticlePDF article={mrmPdfData} />
        <a className="btn btn-primary" href="/blog" onClick={goToBlogLatest}>
          Back to Blog <ArrowRight size={16} />
        </a>
      </div>

    </article>
  );
}
