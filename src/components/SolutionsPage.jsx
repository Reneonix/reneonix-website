import { useRef, useEffect } from 'react';
import {
  Cpu,
  FlaskConical,
  Wrench,
  Zap,
  Database,
  BarChart2,
  FileText,
  AlertTriangle,
  Clock,
  Gauge,
  Rocket,
  Shield,
} from 'lucide-react';
import { navClick } from '../utils/nav.js';
import './SolutionsPage.css';

const SOLUTIONS_CARDS = [
  {
    title: 'Hardware System',
    body: 'AI-powered hardware systems for smarter machines and industrial infrastructure.',
    img: '/hardware-main.jpeg',
    Icon: Wrench,
    href: '/solutions/hardware',
    active: true,
  },
  {
    title: 'Software',
    body: 'AI & technology platform for traceability, transparency and compliance.',
    img: '/software-main.jpeg',
    Icon: Cpu,
    href: '/solutions/software',
    active: true,
  },
  {
    title: 'Material Science',
    body: 'AI-driven material science to re-engineer waste into advanced sustainable materials.',
    img: '/ms-main.webp',
    Icon: FlaskConical,
    href: '/solutions/material-science',
    active: true,
  },
];

const TRAD_STEPS = [
  { Icon: Database,      label: 'Data Collection',            time: 'Hours to Days' },
  { Icon: BarChart2,     label: 'Analysis & Decision Making', time: 'Days to Weeks' },
  { Icon: FileText,      label: 'Reporting',                  time: 'Days' },
  { Icon: AlertTriangle, label: 'Issue Detection & Action',   time: 'Late / After Impact' },
];

const REN_STEPS = [
  { Icon: Database, label: 'Live Data Collection',           time: 'Real-time',              status: 'Real-Time' },
  { Icon: Cpu,      label: 'AI Analysis & Decision Making',  time: 'Instant',                 status: 'Minutes' },
  { Icon: Zap,      label: 'Smart Reporting',                time: 'Instant',                 status: 'Instant' },
  { Icon: Shield,   label: 'Issue Detection & Action',       time: 'Proactive & Predictive',  status: 'Predictive' },
];

const COMPARE_STATS = [
  { Icon: Gauge,    value: '92%',      label: 'Time Saved',            desc: 'Reduce manual effort and process time.' },
  { Icon: Rocket,   value: '15x',      label: 'Faster Decisions',      desc: 'AI-powered insights for quick, confident actions.' },
  { Icon: FileText, value: 'Real-Time', label: 'Smart Reporting',      desc: 'Automated reports, generated in real-time.' },
  { Icon: Shield,   value: '24/7',     label: 'Continuous Monitoring', desc: 'Always-on intelligence with predictive issue detection.' },
];

const INDUSTRIES = [
  { label: 'Glass Manufacturers',          img: '/glass hero.png' },
  { label: 'Recycling Operators',          img: '/recycling - main.png' },
  { label: 'Beverage & FMCG Brands',       img: '/fmcg main.png' },
  { label: 'Minerals & Mining',            img: '/mining-hero.png' },
  { label: 'Government & Municipalities',  img: '/government hero.png' },
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
              <span className="eyebrow">Solutions</span>
              <h1 className="sol-hero__title">
                Engineering Circularity through <em>Hardware, Software, Material Science</em>
              </h1>
              <p className="sol-hero__lead">
                AI-powered solutions that design, build and optimize circular systems for
                a sustainable future.
              </p>
            </div>

            <div className="sol-hero__orbit-wrap">
              <img
                className="sol-hero__orbit-img"
                src="/solutions hero.png"
                alt="Reneonix AI-powered circular ecosystem: collection, AI vision sorting, processing, material recovery, new life"
                loading="eager"
                decoding="async"
                fetchpriority="high"
              />
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
            {SOLUTIONS_CARDS.map(({ title, body, img, Icon, href, active }) => (
              active ? (
                <a className="sol-card" href={href} onClick={navClick(href)} key={title}>
                  <div className="sol-card__media">
                    <img src={img} alt={title} loading="lazy" decoding="async" />
                  </div>
                  <h3 className="sol-card__title">{title}</h3>
                  <p className="sol-card__body">{body}</p>
                  <span className="sol-card__more">
                    Explore More <span style={{ fontSize: '1.3em', lineHeight: 1 }}>→</span>
                  </span>
                </a>
              ) : (
                <article className="sol-card sol-card--inactive" key={title}>
                  <div className="sol-card__media">
                    <img src={img} alt={title} loading="lazy" decoding="async" />
                  </div>
                  <h3 className="sol-card__title">{title}</h3>
                  <p className="sol-card__body">{body}</p>
                  <span className="sol-card__more sol-card__more--inactive">
                    Explore More <span style={{ fontSize: '1.3em', lineHeight: 1 }}>→</span>
                  </span>
                </article>
              )
            ))}
          </div>
        </div>
      </div>

      {/* ---------- HOW MUCH TIME AI SAVES ---------- */}
      <div className="section section-dark sol-compare-section">
        <div className="container">
          <div className="section-head">
            <span className="sol-cmp-pill">Time Saved, Impact Delivered</span>
            <h2>From Weeks of Work to <em>Minutes of Intelligence</em></h2>
            <p>AI transforms slow processes into real-time, actionable intelligence.</p>
          </div>

          <div className="sol-compare">
            {/* Traditional card */}
            <div className="sol-compare__col sol-compare__col--trad">
              <div className="sol-cmp-tag sol-cmp-tag--trad">Traditional Process</div>
              <p className="sol-cmp-tagline">Manual steps. Delayed insights. Lost time.</p>
              <div className="sol-cmp-steps">
                {TRAD_STEPS.map(({ Icon, label, time }, i) => (
                  <div className="sol-cmp-step-wrap" key={label}>
                    <div className="sol-cmp-step">
                      <div className="sol-cmp-step__icon sol-cmp-step__icon--trad"><Icon size={22} /></div>
                      <div className="sol-cmp-step__text">
                        <p className="sol-cmp-step__label">{label}</p>
                        <p className="sol-cmp-step__time">{time}</p>
                      </div>
                    </div>
                    {i < TRAD_STEPS.length - 1 && <div className="sol-cmp-step__connector" aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <div className="sol-cmp-summary sol-cmp-summary--trad">
                <div className="sol-cmp-summary__icon"><Clock size={18} /></div>
                <div>
                  <p className="sol-cmp-summary__label">Overall Turnaround Time</p>
                  <p className="sol-cmp-summary__val">Weeks</p>
                </div>
              </div>
            </div>

            {/* AI hub */}
            <div className="sol-compare__center" aria-hidden="true">
              <svg className="sol-compare__lines" viewBox="0 0 200 400" preserveAspectRatio="none">
                <path d="M0,50 Q60,50 100,200" className="sol-compare__line sol-compare__line--trad" />
                <path d="M0,150 Q60,150 100,200" className="sol-compare__line sol-compare__line--trad" />
                <path d="M0,250 Q60,250 100,200" className="sol-compare__line sol-compare__line--trad" />
                <path d="M0,350 Q60,350 100,200" className="sol-compare__line sol-compare__line--trad" />
                <path d="M100,200 Q140,50 200,50" className="sol-compare__line sol-compare__line--ren" />
                <path d="M100,200 Q140,150 200,150" className="sol-compare__line sol-compare__line--ren" />
                <path d="M100,200 Q140,250 200,250" className="sol-compare__line sol-compare__line--ren" />
                <path d="M100,200 Q140,350 200,350" className="sol-compare__line sol-compare__line--ren" />
                <circle cx="200" cy="50"  r="3" className="sol-compare__dot" />
                <circle cx="200" cy="150" r="3" className="sol-compare__dot" />
                <circle cx="200" cy="250" r="3" className="sol-compare__dot" />
                <circle cx="200" cy="350" r="3" className="sol-compare__dot" />
              </svg>
              <div className="sol-compare__hub">
                <Zap size={28} />
                <span>AI Engine</span>
              </div>
            </div>

            {/* Reneonix card */}
            <div className="sol-compare__col sol-compare__col--ren">
              <div className="sol-cmp-tag sol-cmp-tag--ren">Reneonix AI-Powered</div>
              <p className="sol-cmp-tagline sol-cmp-tagline--ren">Automated steps. Instant insights. Real impact.</p>
              <div className="sol-cmp-steps">
                {REN_STEPS.map(({ Icon, label, time, status }, i) => (
                  <div className="sol-cmp-step-wrap" key={label}>
                    <div className="sol-cmp-step">
                      <div className="sol-cmp-step__icon sol-cmp-step__icon--ren"><Icon size={22} /></div>
                      <div className="sol-cmp-step__text">
                        <p className="sol-cmp-step__label">{label}</p>
                        <p className="sol-cmp-step__time">{time}</p>
                      </div>
                      <span className="sol-cmp-step__status">{status}</span>
                    </div>
                    {i < REN_STEPS.length - 1 && <div className="sol-cmp-step__connector sol-cmp-step__connector--ren" aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <div className="sol-cmp-summary sol-cmp-summary--ren">
                <div className="sol-cmp-summary__icon sol-cmp-summary__icon--ren"><Clock size={18} /></div>
                <div>
                  <p className="sol-cmp-summary__label sol-cmp-summary__label--ren">Overall Turnaround Time</p>
                  <p className="sol-cmp-summary__val sol-cmp-summary__val--ren">Minutes – Hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="sol-cmp-stats">
            {COMPARE_STATS.map(({ Icon, value, label, desc }) => (
              <div className="sol-cmp-stat" key={label}>
                <div className="sol-cmp-stat__icon"><Icon size={22} /></div>
                <p className="sol-cmp-stat__value">{value}</p>
                <p className="sol-cmp-stat__label">{label}</p>
                <p className="sol-cmp-stat__desc">{desc}</p>
              </div>
            ))}
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
            <span className="eyebrow">Industries</span>
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
