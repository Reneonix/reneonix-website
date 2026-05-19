import { useRef, useEffect } from 'react';
import {
  Cpu,
  FlaskConical,
  Wrench,
  Truck,
  Factory,
  Package,
  Leaf,
  HardHat,
  ClipboardCheck,
  Sparkles,
  Recycle,
  Zap,
} from 'lucide-react';
import './SolutionsPage.css';

const HERO_PILLS = [
  { Icon: Recycle,  title: 'Integrated Ecosystem', sub: 'End-to-end synergy' },
  { Icon: Sparkles, title: 'AI-Powered',           sub: 'Intelligence at every layer' },
  { Icon: Leaf,     title: 'Sustainable Impact',   sub: 'Recover. Reuse. Reimagine.' },
];

const SOLUTIONS_CARDS = [
  {
    title: 'Hardware System',
    body: 'AI-powered hardware systems for smarter machines and industrial infrastructure.',
    img: '/solutions-hardware.png',
    Icon: Wrench,
  },
  {
    title: 'Software',
    body: 'AI & technology platform for traceability, transparency and compliance.',
    img: '/software.png',
    Icon: Cpu,
  },
  {
    title: 'Material Science',
    body: 'AI-driven material science to re-engineer waste into advanced sustainable materials.',
    img: '/solutions-material.png',
    Icon: FlaskConical,
  },
];

const COMPARISON_TRAD = [
  { label: 'Data Collection & Processing', value: 'Hours to Days' },
  { label: 'Analysis & Decision Making',   value: 'Days to Weeks' },
  { label: 'Manual Reporting',             value: 'Days' },
  { label: 'Issue Detection',              value: 'Late / After Impact' },
  { label: 'Overall Turnaround Time',      value: 'Weeks' },
];

const COMPARISON_REN = [
  { label: 'Data Collection & Processing', value: 'Real-time' },
  { label: 'Analysis & Decision Making',   value: 'Minutes' },
  { label: 'Smart Reporting',              value: 'Instant' },
  { label: 'Issue Detection',              value: 'Proactive & Predictive' },
  { label: 'Overall Turnaround Time',      value: 'Minutes to Hours' },
];

const INDUSTRIES = [
  { Icon: Truck,          label: 'Waste Management',     img: '/industry-waste-management.png' },
  { Icon: Factory,        label: 'Manufacturing',        img: '/industry-manufacturing.png' },
  { Icon: Package,        label: 'FMCG & Packaging',     img: '/industry-fmcg-packaging.png' },
  { Icon: Leaf,           label: 'Ethanol & Biofuels',   img: '/industry-ethanol-biofuels.png' },
  { Icon: HardHat,        label: 'Cement & Construction',img: '/industry-cement-construction.png' },
  { Icon: ClipboardCheck, label: 'EPR & Compliance',     img: '/industry-epr-compliance.png' },
];

const PROOF_BEFORE = [
  { label: 'Loss Recovery',     value: '< 20%' },
  { label: 'High Contamination',value: '> 35%' },
  { label: 'No Traceability',   value: '×' },
  { label: 'Compliance Risk',   value: 'High' },
];

const PROOF_AFTER = [
  { label: 'Loss Recovery',           value: '> 90%' },
  { label: 'Low Contamination',       value: '< 5%' },
  { label: 'End-to-End Traceability', value: '✓' },
  { label: 'Compliance Ready',        value: '100%' },
];

function MiniChart({ direction = 'up' }) {
  const w = 420, h = 150, padX = 24, padY = 18;
  const data = direction === 'down'
    ? [82, 90, 70, 76, 60, 58, 18]
    : [22, 30, 38, 36, 60, 72, 95];
  const stepX = (w - padX * 2) / (data.length - 1);
  const yFor = (v) => h - padY - (v / 100) * (h - padY * 2);
  const xs = data.map((_, i) => padX + i * stepX);
  const ys = data.map((v) => yFor(v));
  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
  const areaPath = `${linePath} L ${xs[xs.length - 1]} ${h - padY} L ${xs[0]} ${h - padY} Z`;
  const stroke = direction === 'down' ? '#d9534f' : '#1F6E4A';
  const fill   = direction === 'down' ? 'rgba(217,83,79,.10)' : 'rgba(31,110,74,.10)';
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="proof-chart" preserveAspectRatio="none">
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={padX} x2={w - padX} y1={yFor(g)} y2={yFor(g)} stroke="rgba(0,0,0,.08)" />
          <text x={padX - 6} y={yFor(g) + 3} fontSize="9" fill="rgba(0,0,0,.45)" textAnchor="end">{g}</text>
        </g>
      ))}
      <path d={areaPath} fill={fill} />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth="2" />
      {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r="3" fill={stroke} />)}
    </svg>
  );
}

export default function SolutionsPage() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="sol-page" id="solutions-page">
      {/* ---------- HERO ---------- */}
      <div className="sol-hero">
        <div className="container">
          <div className="sol-hero__inner">
            <div className="sol-hero__copy">
              <span className="eyebrow on-dark">Solutions</span>
              <h1 className="sol-hero__title">
                Engineering Circularity through <em>Hardware, Software, Material Science</em>
              </h1>
              <p className="sol-hero__lead">
                AI-powered solutions that design, build and optimize circular systems for
                a sustainable future.
              </p>
            </div>

            <div className="sol-hero__media">
              <div className="sol-hero__frame">
                <img
                  className="sol-hero__image"
                  src="/solutions-hero.jpeg"
                  alt="Reneonix circular economy — recycling ecosystem"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>

              <div className="sol-hero__pills">
                {HERO_PILLS.map(({ Icon, title, sub }) => (
                  <div className="sol-pill" key={title}>
                    <span className="sol-pill__icon"><Icon size={22} /></span>
                    <div className="sol-pill__text">
                      <strong>{title}</strong>
                      <span>{sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- INTEGRATED SOLUTIONS ---------- */}
      <div className="section section-paper-grad" id="integrated-solutions">
        <div className="container">
          <div className="section-head">
            <h2>
              Our <em>Integrated</em> Solutions
            </h2>
          </div>

          <div className="sol-grid">
            {SOLUTIONS_CARDS.map(({ title, body, img, Icon }) => (
              <article className="sol-card" key={title}>
                <div className="sol-card__media">
                  <img src={img} alt={title} loading="lazy" decoding="async" />
                  <span className="sol-card__badge"><Icon size={22} /></span>
                </div>
                <h3 className="sol-card__title">{title}</h3>
                <p className="sol-card__body">{body}</p>
                <span className="sol-card__more">
                  Explore More <span style={{ fontSize: '1.3em', lineHeight: 1 }}>→</span>
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- HOW MUCH TIME AI SAVES ---------- */}
      <div className="section section-dark sol-compare-section">
        <div className="container">
          <div className="section-head">
            <h2>
              How Much Time <em>AI Saves</em>
            </h2>
          </div>

          <div className="sol-compare">
            <div className="sol-compare__col sol-compare__col--trad">
              <h3 className="sol-compare__title">Traditional <span>(Without AI)</span></h3>
              {COMPARISON_TRAD.map(({ label, value }) => (
                <div className="sol-compare__row" key={label}>
                  <span className="sol-compare__label">{label}</span>
                  <span className="sol-compare__value sol-compare__value--trad">{value}</span>
                </div>
              ))}
            </div>

            <div className="sol-compare__center" aria-hidden="true">
              <div className="sol-compare__chip"><Zap size={20} /> AI</div>
            </div>

            <div className="sol-compare__col sol-compare__col--ren">
              <h3 className="sol-compare__title">Reneonix AI-Powered</h3>
              {COMPARISON_REN.map(({ label, value }) => (
                <div className="sol-compare__row" key={label}>
                  <span className="sol-compare__label">{label}</span>
                  <span className="sol-compare__value sol-compare__value--ren">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sol-compare__banner">
            <Zap size={16} aria-hidden="true" />
            From Weeks of Manual Effort to Minutes of AI Intelligence.
          </div>
        </div>
      </div>

      {/* ---------- PROOF / VIDEO ---------- */}
      <div className="section section-paper-grad">
        <div className="container">
          <div className="section-head">
            <h2>
              Evidence of <em>Excellence</em>
            </h2>
          </div>

          <div className="sol-proof-video">
            <video
              ref={videoRef}
              className="sol-proof-video__player"
              src="/proof-solutions.webm"
              controls
              playsInline
              muted
              preload="metadata"
            />
          </div>
        </div>
      </div>

      {/* ---------- INDUSTRIES MARQUEE ---------- */}
      <div className="section section-dark">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow on-dark">Industries</span>
            <h2>
              Industries we <em>serve</em>
            </h2>
          </div>

          <div
            className="sol-industries-marquee"
            role="region"
            aria-label="Industries we serve"
          >
            <div className="sol-industries-marquee__track" aria-hidden="false">
              {[...INDUSTRIES, ...INDUSTRIES].map(({ label, img }, i) => (
                <article className="sol-industry-card" key={`${label}-${i}`}>
                  <div className="sol-industry-card__media">
                    <img src={img} alt={label} loading="lazy" decoding="async" draggable="false" />
                  </div>
                  <span className="sol-industry-card__label">{label}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
