import { useEffect, useLayoutEffect } from 'react';
import {
  Calendar, Clock, User, ChevronRight, ChevronDown, ArrowRight,
  Feather, Thermometer, ShieldCheck, Recycle, Flame,
  Image as ImageIcon,
} from 'lucide-react';
import { navigate, navClick } from '../utils/nav.js';
import './BlogArticleFoamGlass.css';
import ArticlePDF from '../pdf/ArticlePDF.jsx';
import foamGlassPdfData from '../pdf/data/foamGlassPdfData.js';
import BridgeQuote, { BrushFilterDefs } from './BridgeQuote.jsx';

// Stands in for a real photo until one is uploaded to /public — swap the
// <ImagePlaceholder> for an <img src="/…" alt="…" /> once the asset lands.
function ImagePlaceholder({ label }) {
  return (
    <div className="fg-img-placeholder" role="img" aria-label={label}>
      <ImageIcon size={22} aria-hidden="true" />
    </div>
  );
}

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Residual Glass Fines',
    body: "The journey starts with the material everyone else has given up on - fine, mixed glass particles collected from recovery operations.",
  },
  {
    num: '02',
    title: 'Material Characterisation & Quality Assessment',
    body: "Each batch is analysed for composition, particle size and contamination - because you cannot engineer a material you don't understand.",
  },
  {
    num: '03',
    title: 'Formulation & Material Testing',
    body: 'The fines are blended with foaming agents into precise formulations, tested and refined until the recipe is right.',
  },
  {
    num: '04',
    title: 'Controlled Thermal Processing',
    body: 'The dramatic moment: under controlled heat, the formulation softens and expands into a cellular structure - thousands of sealed glass pores that give foam glass its remarkable properties.',
    chip: 'Controlled expansion · Cellular structure forming',
  },
  {
    num: '05',
    title: 'Foam Glass Insulation',
    body: 'Out of the furnace comes a new material: lightweight, rigid, thermally efficient - unrecognisable from the dust it once was.',
  },
  {
    num: '06',
    title: 'Industrial Applications',
    body: 'The finished material moves into buildings and industrial facilities, where it will quietly save energy for decades.',
  },
];

// Same alternating text-block / white-card row layout used on the Investors
// page's "Backed by Institutions" section (.ip-backers-*) — grouped into two
// phases of 3 steps each instead of logo sets.
const PROCESS_GROUPS = [
  {
    title: 'From Waste to Formulation',
    desc: 'Every batch begins as an unknown - glass fines are characterised, tested, and blended into a precise foaming formulation.',
    steps: PROCESS_STEPS.slice(0, 3),
  },
  {
    title: 'From Furnace to Building',
    desc: 'Under controlled heat, the formulation transforms into a lightweight cellular material - ready to insulate real buildings and facilities.',
    steps: PROCESS_STEPS.slice(3),
  },
];

const RESEARCH_TAGS = [
  { label: 'Material Science' },
  { label: 'Circular Innovation' },
  { label: 'Performance Focus' },
  { label: 'Sustainable Future' },
];

// The chain of roles behind the material, ending in the material itself.
const RESEARCH_CHAIN = [
  { role: 'Ceramic Engineer', desc: 'Designing advanced ceramic formulations for optimal performance.', img: '/yokesh reneonix.png', imgScale: 1.3, imgOffsetY: '8%' },
  { role: 'Ceramic Engineer', desc: 'Optimising processes to ensure quality and scalability.', img: '/ananthi-reneonix.jpeg' },
  { role: 'Materials Engineer', desc: 'Testing, analysing and validating for stronger, safer, sustainable solutions.', img: '/sahir reneonix.png', imgScale: 1.3, imgOffsetY: '8%' },
  { role: 'Foam Glass', desc: 'Innovative insulation. Sustainable tomorrow. Stronger for a better world.', img: '/ms foam glass - article.jpg' },
];

const WHY_ITEMS = [
  { Icon: Feather, title: 'Lightweight Structure', desc: 'Its cellular composition significantly reduces weight while maintaining structural integrity.' },
  { Icon: Thermometer, title: 'Excellent Thermal Insulation', desc: 'Improves energy efficiency by reducing heat transfer in buildings and industrial facilities.' },
  { Icon: ShieldCheck, title: 'Durable Performance', desc: 'Resistant to moisture, chemicals, and biological degradation — suitable for demanding environments.' },
  { Icon: Recycle, title: 'Circular Material Solution', desc: 'Converting residual waste into valuable products supports a more sustainable and circular industrial ecosystem.' },
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

export default function BlogArticleFoamGlass() {
  // Only the bridge quote dividers animate on scroll — everything else
  // renders fully visible. Anything already in the viewport at mount is
  // revealed immediately (no fade), so a fast scroll never catches content
  // stuck invisible. Mirrors BlogArticleMRM's reveal treatment.
  useLayoutEffect(() => {
    const vh = window.innerHeight;
    document.querySelectorAll('.fg-reveal').forEach((el) => {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < vh && bottom > 0) el.classList.add('fg-in');
    });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fg-in');
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.fg-reveal:not(.fg-in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <article className="fg-article">
      <BrushFilterDefs />

      {/* =============== HERO =============== */}
      <section className="fg-hero">
        <div className="fg-hero__bg-veil" />
        <nav className="fg-breadcrumb" aria-label="Breadcrumb">
          <a href="/" onClick={goHome}>Home</a>
          <ChevronRight size={13} aria-hidden="true" />
          <a href="/blog" onClick={navClick('/blog')}>Blog</a>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="is-current">From Glass Fines to Foam Glass Insulation</span>
        </nav>
        <div className="fg-hero__inner">
          <span className="fg-hero__chip">Material Science</span>
          <h1>From Glass Fines to Foam Glass Insulation: Creating New Value</h1>
          <p className="fg-hero__lead">
            Turning low-value residuals into high-performance building materials through
            material science innovation.
          </p>
          <div className="fg-hero__meta">
            <span><Calendar size={14} /> March 30, 2026</span>
            <span className="fg-hero__dot" aria-hidden="true">•</span>
            <span><Clock size={14} /> 5 min read</span>
            <span className="fg-hero__dot" aria-hidden="true">•</span>
            <span><User size={14} /> By <b className="fg-hero__meta-author">Reneonix Material Science Team</b></span>
          </div>
        </div>
        <a href="#chapter-1" className="fg-hero__scroll-cue" onClick={(e) => jumpTo(e, 'chapter-1')}>
          Scroll to read <ChevronDown size={15} />
        </a>
      </section>

      {/* =============== CHAPTER 01 — THE END OF THE LINE =============== */}
      <section className="fg-challenge" id="chapter-1">
        <div className="fg-challenge__inner">
          <div className="fg-challenge__media">
            <img src="/crushed glass -foam article.jpeg" alt="Pile of crushed glass fines at a material recovery facility" />
          </div>
          <div className="fg-challenge__text">
            <span className="fg-eyebrow">The End of the Line</span>
            <h2>When Recycling Reaches Its Limit, <em>Innovation Begins</em></h2>
            <p>
              Not every recovered material can be directly reused or recycled. Across the recycling
              ecosystem, fine glass particles - commonly known as <strong>glass fines</strong> - are
              often treated as low-value residual waste due to their small size and contamination
              levels. They are the leftovers of the leftovers: too fine to sort, too mixed to melt
              cleanly, usually destined for landfill.
            </p>
            <div className="fg-challenge__media fg-challenge__media--inline">
              <img src="/crushed glass -foam article.jpeg" alt="Pile of crushed glass fines at a material recovery facility" />
            </div>
            <p>
              At Reneonix, we see these materials differently. Rather than viewing glass fines as
              the end of the recovery journey, we see them as the{' '}
              <strong>beginning of a new industrial opportunity</strong> through material science.
            </p>
          </div>
        </div>
      </section>

      <BridgeQuote>Where others see the end of a material's life, material science sees <b>second life raw materials</b></BridgeQuote>

      {/* =============== CHAPTER 02 — A SECOND CHANCE =============== */}
      <section className="fg-recovery">
        <div className="fg-recovery__inner">
          <div className="fg-recovery__text">
            <span className="fg-eyebrow">A Second Chance</span>
            <h2>Creating the Next <em>Recovery Pathway</em></h2>
            <p>
              Our approach goes beyond traditional recycling. When materials can no longer move
              through the reuse or recycling pathway, we apply <strong>material science</strong> to
              create entirely new industrial applications.
            </p>
            <p>
              One of our key research initiatives focuses on transforming residual glass fines into{' '}
              <span className="fg-recovery__accent">foam glass insulation</span> - a lightweight,
              durable, and thermally efficient construction material. This approach allows us to
              extend the lifecycle of recovered materials while unlocking new value from previously
              overlooked waste streams.
            </p>
            <div className="fg-recovery__media fg-recovery__media--inline">
              <img src="/hand holding - foam article.jpeg" alt="Gloved hand holding recovered glass material in a material science lab" />
            </div>
            <p className="fg-pull">
              The dust that failed recycling doesn't get discarded. It gets a new job description.
            </p>
          </div>
          <div className="fg-recovery__media">
            <img src="/hand holding - foam article.jpeg" alt="Gloved hand holding recovered glass material in a material science lab" />
          </div>
        </div>
      </section>

      <BridgeQuote>So how does grey dust become a building material? <b>Six steps</b> - and one moment of fire.</BridgeQuote>

      {/* =============== CHAPTER 03 — THE TRANSFORMATION =============== */}
      <section className="fg-chapter" id="process">
        <div className="container">
          <span className="fg-eyebrow">The Transformation</span>
          <h2>How the Process Works</h2>
          <p>The transformation follows a structured innovation pathway:</p>

          <div className="fg-process-timeline">
            {PROCESS_GROUPS.map(({ title, desc, steps }, i) => {
              const textBlock = (
                <div className="fg-process-row__text" key="text">
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              );
              const boxBlock = (
                <div className="fg-process-row__box" key="box">
                  {steps.map((step) => (
                    <div className="fg-process-item" key={step.num}>
                      <span className="fg-process-item__num">{step.num}</span>
                      <div className="fg-process-item__body">
                        <h4>{step.title}</h4>
                        <p>{step.body}</p>
                        {step.chip && (
                          <span className="fg-process-item__chip"><Flame size={14} aria-hidden="true" /> {step.chip}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
              return (
                <div className="fg-process-row fg-reveal" key={title}>
                  {i % 2 === 1 ? [boxBlock, textBlock] : [textBlock, boxBlock]}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <BridgeQuote>Why go to all this trouble for dust? Because the result <b>outperforms conventional materials</b></BridgeQuote>

      {/* =============== CHAPTER 04 — THE PAYOFF =============== */}
      <section className="fg-chapter" id="why">
        <div className="container">
          <span className="fg-eyebrow">The Payoff</span>
          <h2>Why Foam Glass?</h2>
          <p>Foam glass offers several advantages over conventional insulation materials:</p>

          <div className="fg-why-grid">
            {WHY_ITEMS.map(({ Icon, title, desc }) => (
              <div className="fg-why-card" key={title}>
                <Icon size={26} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== CHAPTER 05 — RESEARCH-DRIVEN INNOVATION =============== */}
      <section className="fg-chapter" id="research">
        <div className="container fg-research">
          <div className="fg-research__text">
            <span className="fg-eyebrow">The People Behind the Material</span>
            <h2>Research-Driven Innovation</h2>
            <p>
              The development of foam glass insulation is part of Reneonix's ongoing collaboration
              with <strong>research institutions and industry experts</strong> to create practical,
              scalable solutions for circular materials.
            </p>
            <p>
              Our goal is not only to recover materials but to <strong>engineer new products</strong>{' '}
              that meet industrial performance standards while reducing environmental impact.
            </p>
            <div className="fg-research__tags">
              {RESEARCH_TAGS.map(({ label }) => (
                <span className="fg-research__tag" key={label}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="fg-research__chain">
            {RESEARCH_CHAIN.map(({ role, desc, img, imgScale, imgOffsetY }, i) => (
              <div className="fg-research__node" key={role + i}>
                <div className="fg-research__circle">
                  {img ? (
                    <img
                      src={img}
                      alt={role}
                      style={imgScale ? { transform: `scale(${imgScale}) translateY(${imgOffsetY || '0'})` } : undefined}
                    />
                  ) : (
                    <ImagePlaceholder label={role} />
                  )}
                </div>
                <div className="fg-research__info">
                  <span className="fg-research__role">{role}</span>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== CHAPTER 06 — CONNECTING PRESENT TO FUTURE =============== */}
      <section className="fg-chapter fg-future" id="future">
        <div className="container">
          <span className="fg-eyebrow">From Dust to a Building's Walls</span>
          <h2>Connecting the Present to the Future</h2>
          <p>
            As industries move toward sustainable manufacturing and circular resource management,
            advanced material innovation will play an increasingly important role. By transforming
            low-value residual materials into high-performance industrial products, Reneonix is
            helping redefine what is possible in the future of material recovery.
          </p>
          <p className="fg-pull">
            Every recovered material deserves another opportunity to create value - and material
            science makes that possible.
          </p>

        </div>
      </section>

      {/* =============== GO TO BLOG =============== */}
      <div className="fg-goto-blog">
        <ArticlePDF article={foamGlassPdfData} />
        <a className="btn btn-primary" href="/blog" onClick={goToBlogLatest}>
          Back to Blog <ArrowRight size={16} />
        </a>
      </div>

    </article>
  );
}
