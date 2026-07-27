import { useEffect, useRef, useState } from 'react';
import {
  Calendar, Clock, User, ChevronRight, ChevronDown, Check, XCircle,
  Tag, Shapes, Palette, ScanEye, ShieldCheck, Percent, ArrowRight,
} from 'lucide-react';
import ArticlePDF from '../pdf/ArticlePDF.jsx';
import visionSortingPdfData from '../pdf/data/visionSortingPdfData.js';
import { navigate, navClick } from '../utils/nav.js';
import './BlogArticleVisionSorting.css';

const PAIN_POINTS = [
  { title: 'Colour confusion', desc: 'Flint, amber, green and mixed glass look deceptively similar under variable line conditions.' },
  { title: 'Contamination', desc: 'Dirt, residues and foreign materials disguise the true quality of each item.' },
  { title: 'Damaged labels', desc: 'Torn or missing labels remove the clues conventional systems depend on.' },
  { title: 'Inconsistent streams', desc: "No two batches are alike—packaging changes by region, brand and season." },
];

const TRADITIONAL_CHECKS = [
  'Manual inspection',
  'Colour-based decisions',
  'Missed defects',
  'Inconsistent quality',
];
const AI_CHECKS = [
  'AI detection & classification',
  'Detects defects & contaminants',
  'Material, brand & shape recognition',
  'Consistent, high-purity output',
];

const DIFFERENCE_TABLE = [
  { label: 'Detection Basis', traditional: 'Colour only', ai: 'Colour + Material + Shape + Brand + Condition' },
  { label: 'Inspection Method', traditional: 'Human eye / Basic sensors', ai: 'AI Vision + Deep Learning' },
  { label: 'Defect Detection', traditional: 'Limited / Often missed', ai: 'Detects cracks, chips, labels, dirt & more' },
  { label: 'Accuracy', traditional: '~60-70%', ai: 'Up to 98%' },
  { label: 'Consistency', traditional: 'Varies by operator & shift', ai: '100% consistent, 24/7' },
  { label: 'Speed', traditional: 'Slower, manual dependent', ai: 'Real-time, at line speed' },
  { label: 'Output Quality', traditional: 'Mixed purity, more rework', ai: 'High purity, minimal rework' },
];

const PERFORMANCE_STATS = [
  { value: '98%', label: 'Colour detection accuracy', desc: 'Across flint, amber, green and mixed glass streams.', meter: 98 },
  { value: '95%', label: 'Brand detection accuracy', desc: 'Using label recognition, bottle geometry and embossing.', meter: 95 },
  { value: 'Real-time', label: 'Classification at line speed', desc: 'Every item analysed without interrupting recovery operations.', meter: 100 },
  { value: 'Less', label: 'Manual intervention', desc: 'Cleaner material streams with significantly fewer manual picks.', meter: 80 },
];

const ANATOMY_CUES = [
  { Icon: Palette, title: 'Glass colour', desc: 'Flint, amber, green and mixed—resolved even under harsh line lighting.' },
  { Icon: Shapes, title: 'Bottle shape', desc: 'Geometry recognition separates formats, sizes and container types.' },
  { Icon: Tag, title: 'Brand identification', desc: 'Labels, geometry and embossing combine to identify origin—even when labels are damaged.' },
  { Icon: ScanEye, title: 'Surface condition', desc: 'Scratches, chips and contamination graded before routing.' },
  { Icon: ShieldCheck, title: 'Material integrity', desc: 'Structural quality assessed to determine reuse potential.' },
  { Icon: Percent, title: 'Confidence score', desc: 'Every decision carries a confidence value, keeping humans in control of edge cases.' },
];

// One entry per ANATOMY_CUES item, in the same order — drives the scanner's
// chip text, status label and which detection box lights up.
const SCANNER_STEPS = [
  { label: 'Colour', detail: 'Amber · 97.8%', box: 'mid' },
  { label: 'Shape', detail: 'Longneck bottle · 98.8%', box: 'low' },
  { label: 'Brand', detail: 'Label match · 95.4%', box: 'mid' },
  { label: 'Surface', detail: 'Minor scratch · graded', box: 'low' },
  { label: 'Integrity', detail: 'High quality · reusable', box: 'top' },
  { label: 'Confidence', detail: 'Overall · 99.2%', box: 'mid' },
];

const LEARNING_STEPS = [
  { title: 'Data capture', desc: 'High-speed cameras record every item on the line.' },
  { title: 'AI analysis', desc: 'Deep learning models classify each item in milliseconds.' },
  { title: 'Feedback loop', desc: 'Human-in-the-loop validation on uncertain calls.' },
  { title: 'Model training', desc: 'Models retrain on fresh, real-world operational data.' },
  { title: 'Better performance', desc: 'Accuracy climbs with every bottle processed.' },
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

/* ============================================================
   Live Performance Dashboard — simulated demo data, wire to a
   real metrics API later. Respects prefers-reduced-motion by
   skipping all intervals and rendering a static snapshot.
   ============================================================ */
const REDUCE_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CLASSIFICATION_BREAKDOWN = [
  { name: 'Clear', pct: 38.7, color: '#3d9bd4' },
  { name: 'Green', pct: 33.2, color: '#2fa85c' },
  { name: 'Amber', pct: 24.1, color: '#d97706' },
  { name: 'Others', pct: 4.0, color: '#9a7fd1' },
];

const ACCURACY_24H = [
  97.6, 97.4, 97.2, 97.5, 97.8, 97.7, 98.0, 98.2, 98.1, 98.4, 98.3, 98.6,
  98.5, 98.3, 98.7, 98.6, 98.8, 98.7, 98.9, 98.6, 98.4, 98.5, 98.3, 98.3,
];

const FEED_CAMS = [3, 7, 12, 18, 24, 31, 47, 52, 68, 71, 84, 96, 103, 117, 128];

function pad2(n) { return n < 10 ? `0${n}` : `${n}`; }
function fmtInt(n) { return Math.round(n).toLocaleString('en-US'); }

function pickCategory() {
  const r = Math.random();
  if (r < 0.39) return CLASSIFICATION_BREAKDOWN[0];
  if (r < 0.55) return CLASSIFICATION_BREAKDOWN[1];
  if (r < 0.86) return CLASSIFICATION_BREAKDOWN[2];
  return CLASSIFICATION_BREAKDOWN[3];
}

function makeFeedRow() {
  const cat = pickCategory();
  const conf = (96.5 + Math.random() * 3.3).toFixed(1);
  const cam = FEED_CAMS[Math.floor(Math.random() * FEED_CAMS.length)];
  return { id: `${Date.now()}-${Math.random()}`, cat, conf, cam };
}

function AvsDonut() {
  const cx = 65, cy = 65, r = 48, w = 18;
  let start = -Math.PI / 2;
  const segments = CLASSIFICATION_BREAKDOWN.map(({ name, pct, color }) => {
    const angle = (pct / 100) * Math.PI * 2;
    const end = start + angle;
    const large = angle > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const seg = { name, color, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`, gapAngle: start };
    start = end;
    return seg;
  });

  return (
    <div className="avs-donut-wrap">
      <svg
        className="avs-donut-svg" width="130" height="130" viewBox="0 0 130 130" role="img"
        aria-label={`Classification breakdown: ${CLASSIFICATION_BREAKDOWN.map((c) => `${c.name} ${c.pct}%`).join(', ')}`}
      >
        {segments.map((s) => (
          <path key={s.name} d={s.d} fill="none" stroke={s.color} strokeWidth={w} />
        ))}
        {segments.map((s) => {
          const gx1 = cx + (r - w / 2 - 1) * Math.cos(s.gapAngle);
          const gy1 = cy + (r - w / 2 - 1) * Math.sin(s.gapAngle);
          const gx2 = cx + (r + w / 2 + 1) * Math.cos(s.gapAngle);
          const gy2 = cy + (r + w / 2 + 1) * Math.sin(s.gapAngle);
          return <line key={`${s.name}-gap`} x1={gx1} y1={gy1} x2={gx2} y2={gy2} className="avs-donut-gap" />;
        })}
        <text x={cx} y={cy - 2} textAnchor="middle" className="avs-donut-num">4</text>
        <text x={cx} y={cy + 13} textAnchor="middle" className="avs-donut-cap">STREAMS</text>
      </svg>
      <ul className="avs-donut-legend">
        {CLASSIFICATION_BREAKDOWN.map(({ name, pct, color }) => (
          <li key={name}><i style={{ background: color }} />{name}<b>{pct.toFixed(1)}%</b></li>
        ))}
      </ul>
    </div>
  );
}

function AvsAccuracyChart() {
  const [hover, setHover] = useState(null);
  const W = 460, H = 190, padL = 34, padR = 10, padT = 12, padB = 26;
  const yMin = 96.5, yMax = 99.5;
  const x = (i) => padL + (i / 23) * (W - padL - padR);
  const y = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB);
  const points = ACCURACY_24H.map((v, i) => [x(i), y(v)]);
  const linePath = points.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${x(23)} ${y(yMin)} L ${x(0)} ${y(yMin)} Z`;
  const last = ACCURACY_24H[23];

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const mx = (clientX - rect.left) * (W / rect.width);
    const i = Math.max(0, Math.min(23, Math.round(((mx - padL) / (W - padL - padR)) * 23)));
    setHover(i);
  };

  return (
    <div className="avs-chart-wrap">
      <svg
        className="avs-chart-svg" viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="Line chart of classification accuracy over the last 24 hours, ranging between 97.2 and 98.9 percent"
        onMouseMove={handleMove} onTouchMove={handleMove}
        onMouseLeave={() => setHover(null)} onTouchEnd={() => setHover(null)}
      >
        {[97, 98, 99].map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} className="avs-chart-grid" />
            <text x={padL - 6} y={y(v) + 3} textAnchor="end">{v}%</text>
          </g>
        ))}
        {[0, 6, 12, 18, 23].map((h) => (
          <text key={h} x={x(h)} y={H - 8} textAnchor="middle">{pad2(h)}:00</text>
        ))}
        <path d={areaPath} className="avs-chart-area" />
        <path d={linePath} className="avs-chart-line" />
        <circle cx={x(23)} cy={y(last)} r="4" className="avs-chart-dot" />
        <text x={x(23) - 4} y={y(last) - 9} textAnchor="end" className="avs-chart-endlabel">{last.toFixed(1)}%</text>
        {hover !== null && (
          <>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} className="avs-chart-crosshair" />
            <circle cx={x(hover)} cy={y(ACCURACY_24H[hover])} r="4.5" className="avs-chart-dot" />
          </>
        )}
      </svg>
      {hover !== null && (
        <div className="avs-chart-tooltip" style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(ACCURACY_24H[hover]) / H) * 100}%` }}>
          {pad2(hover)}:00 · <b>{ACCURACY_24H[hover].toFixed(1)}%</b>
        </div>
      )}
    </div>
  );
}

function AvsLiveFeed() {
  const [rows, setRows] = useState(() => Array.from({ length: 6 }, makeFeedRow));
  const [dpm, setDpm] = useState(3140);

  useEffect(() => {
    if (REDUCE_MOTION) return;
    const feedTimer = setInterval(() => {
      setRows((prev) => [makeFeedRow(), ...prev].slice(0, 6));
    }, 1600);
    const dpmTimer = setInterval(() => {
      setDpm(3050 + Math.floor(Math.random() * 220));
    }, 4000);
    return () => { clearInterval(feedTimer); clearInterval(dpmTimer); };
  }, []);

  return (
    <>
      <ul className="avs-feed-list">
        {rows.map(({ id, cat, conf, cam }) => (
          <li key={id}>
            <span className="avs-feed-dot" style={{ background: cat.color }} />
            <b>{cat.name.toUpperCase()}</b> · {conf}%
            <span className="avs-feed-cam">CAM {pad2(cam)}</span>
          </li>
        ))}
      </ul>
      <div className="avs-feed-meta">
        <span>Cameras active <b>128</b></span>
        <span>Detections <b>{fmtInt(dpm)}</b>/min</span>
      </div>
    </>
  );
}

function AvsLiveClock() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  });
  useEffect(() => {
    if (REDUCE_MOTION) return;
    const t = setInterval(() => {
      const d = new Date();
      setTime(`${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return <>{time}</>;
}

function AvsDashboard() {
  const [total, setTotal] = useState(2842391);
  const [accuracy, setAccuracy] = useState(98.3);
  const [inView, setInView] = useState(REDUCE_MOTION);
  const rootRef = useRef(null);

  useEffect(() => {
    if (REDUCE_MOTION) return;
    const totalTimer = setInterval(() => {
      setTotal((t) => t + 12 + Math.floor(Math.random() * 18));
    }, 900);
    const accTimer = setInterval(() => {
      setAccuracy(98.1 + Math.random() * 0.5);
    }, 4000);
    return () => { clearInterval(totalTimer); clearInterval(accTimer); };
  }, []);

  // Toggles on every crossing (not a one-shot): scrolling the card out of
  // view resets it, so scrolling back down replays the fade/slide-in again.
  useEffect(() => {
    if (REDUCE_MOTION || !rootRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`avs-dashboard${inView ? ' avs-dashboard--in' : ''}`}
      role="group" aria-label="Live performance dashboard (simulated demo data)"
    >
      <div className="avs-dashboard__head">
        <span className="avs-dashboard__title">Live Performance Dashboard</span>
        <span className="avs-dashboard__live"><i aria-hidden="true" /> Live · <AvsLiveClock /></span>
      </div>

      <div className="avs-dashboard__kpis">
        <div className="avs-kpi">
          <span className="avs-kpi__label">Total bottles</span>
          <span className="avs-kpi__value">{fmtInt(total)}</span>
          <span className="avs-kpi__delta">▲ +12.4% vs yesterday</span>
        </div>
        <div className="avs-kpi">
          <span className="avs-kpi__label">Accuracy</span>
          <span className="avs-kpi__value">{accuracy.toFixed(1)}%</span>
          <span className="avs-kpi__delta">▲ +1.6% vs yesterday</span>
        </div>
        <div className="avs-kpi">
          <span className="avs-kpi__label">Throughput</span>
          <span className="avs-kpi__value">52,430 /hr</span>
          <span className="avs-kpi__delta">▲ +6.7% vs yesterday</span>
        </div>
        <div className="avs-kpi">
          <span className="avs-kpi__label">Uptime</span>
          <span className="avs-kpi__value">99.5%</span>
          <span className="avs-kpi__delta avs-kpi__delta--flat">▲ +0.3% vs yesterday</span>
        </div>
      </div>

      <div className="avs-dashboard__panels">
        <div className="avs-panel">
          <h3>Classification breakdown</h3>
          <AvsDonut />
        </div>
        <div className="avs-panel">
          <h3>Accuracy over time — last 24h</h3>
          <AvsAccuracyChart />
        </div>
        <div className="avs-panel avs-panel--feed">
          <h3>Real-time feed</h3>
          <AvsLiveFeed />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Beyond Colour — animated AI scanner. A scan beam sweeps a bottle
   photo while detection boxes light up and a chip cycles through
   each visual cue, staying in sync with the highlighted cue card.
   ============================================================ */
function AvsAnatomyScanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chipIndex, setChipIndex] = useState(0);
  const [chipFading, setChipFading] = useState(false);

  // Cycles which cue is "active" — paused while the tab is hidden, like
  // the reference implementation, so it never runs invisibly in a background tab.
  // Keeps cycling even under prefers-reduced-motion: the cue/box/chip swap is a
  // content change, not motion — only the CSS sweep beam and pulse dot (gated
  // separately in the stylesheet) are actual motion that gets suppressed.
  useEffect(() => {
    let timer;
    const tick = () => setActiveIndex((i) => (i + 1) % SCANNER_STEPS.length);
    const start = () => { timer = setInterval(tick, 2200); };
    const stop = () => clearInterval(timer);
    start();
    const onVisibility = () => { stop(); if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => { stop(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);

  // The chip's text swaps a beat after the cue/box highlight changes, with a
  // brief fade — mirrors the reference's 280ms crossfade timing.
  useEffect(() => {
    if (REDUCE_MOTION) { setChipIndex(activeIndex); return; }
    setChipFading(true);
    const t = setTimeout(() => {
      setChipIndex(activeIndex);
      setChipFading(false);
    }, 280);
    return () => clearTimeout(t);
  }, [activeIndex]);

  const chip = SCANNER_STEPS[chipIndex];
  const activeBox = SCANNER_STEPS[activeIndex].box;

  return (
    <div className="avs-anatomy">
      <div
        className="avs-scanner" role="img"
        aria-label="Animated illustration: an AI scan beam sweeps over a glass bottle while each visual cue — colour, shape, brand, surface, integrity, confidence — is analysed in turn"
      >
        <div className="avs-scan-stage">
          <img src="/amber-bottle.jpg" alt="" width="736" height="736" decoding="async" />
          <svg viewBox="0 0 230 340" aria-hidden="true">
            <rect className={`avs-scan-box${activeBox === 'top' ? ' is-lit' : ''}`} x="96" y="36" width="38" height="42" rx="5" />
            <rect className={`avs-scan-box${activeBox === 'mid' ? ' is-lit' : ''}`} x="76" y="150" width="78" height="56" rx="5" />
            <rect className={`avs-scan-box${activeBox === 'low' ? ' is-lit' : ''}`} x="76" y="228" width="78" height="52" rx="5" />
          </svg>
          <div className="avs-scan-beam" aria-hidden="true" />
          <div className={`avs-scan-chip${chipFading ? ' is-swapping' : ''}`} aria-hidden="true">
            <b>{chip.label}</b>
            <span>{chip.detail}</span>
          </div>
        </div>
        <div className="avs-scan-status" aria-hidden="true">Analysing&nbsp;<b>{chip.label.toLowerCase()}</b></div>
      </div>

      <ul className="avs-cue-list">
        {ANATOMY_CUES.map(({ Icon, title, desc }, idx) => (
          <li className={`avs-cue${idx === activeIndex ? ' is-active' : ''}`} key={title}>
            <span className="avs-cue__icon"><Icon size={20} /></span>
            <span><b>{title}</b><small>{desc}</small></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Chip/pulse x-centres as a % of the conveyor image width — measured
// from the render, shared between the animation loop and the overlay markup.
const CONVEYOR_STOPS = [22.6, 37.5, 51.1, 64.7, 78.1];

/* ============================================================
   Always Learning — animated conveyor. A pulse travels across a
   photo of the recovery line, lighting each station's screen glow
   and label in turn as it reaches that stop.
   ============================================================ */
function AvsLearningConveyor() {
  const dotRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const dot = dotRef.current;

    if (REDUCE_MOTION) {
      // Skip the continuous sliding pulse — that's real motion — but still
      // step the highlighted station forward on a fixed interval so the
      // section isn't frozen: a discrete state change, not motion.
      if (dot) dot.style.opacity = '0';
      let i = 0;
      setActiveIndex(0);
      const timer = setInterval(() => {
        i = (i + 1) % LEARNING_STEPS.length;
        setActiveIndex(i);
      }, 2200);
      return () => clearInterval(timer);
    }

    const CYCLE_MS = 6000;   // one full pass 01 → 05
    const HOLD_MS = 900;     // the last station stays lit before the loop restarts
    const FADE_MS = 600;     // fade-out before restarting
    const TOTAL = CYCLE_MS + HOLD_MS + FADE_MS;
    let progress = 0;
    let lastNow = performance.now();
    let timer;

    function tick() {
      const now = performance.now();
      const delta = Math.min(now - lastNow, 250);
      lastNow = now;
      progress += delta / TOTAL;
      if (progress >= 1) progress -= 1;

      const travel = progress * TOTAL;
      if (travel <= CYCLE_MS) {
        // moving 01 → 05
        const t = travel / CYCLE_MS;
        const x = CONVEYOR_STOPS[0] + t * (CONVEYOR_STOPS[4] - CONVEYOR_STOPS[0]);
        dot.style.left = `${x}%`;
        dot.style.opacity = '1';
        let idx = 0;
        for (let i = 0; i < CONVEYOR_STOPS.length; i++) if (x >= CONVEYOR_STOPS[i] - 1) idx = i;
        setActiveIndex(idx);
      } else if (travel <= CYCLE_MS + HOLD_MS) {
        // arrived — hold "Better performance" lit
        dot.style.left = `${CONVEYOR_STOPS[4]}%`;
        dot.style.opacity = '1';
        setActiveIndex(4);
      } else {
        // brief fade-out, then the loop restarts at 01
        dot.style.opacity = '0';
        setActiveIndex(-1);
      }
    }

    timer = setInterval(tick, 32);
    const onVisibility = () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        lastNow = performance.now();
        timer = setInterval(tick, 32);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <>
      <div
        className="avs-conveyor" role="img"
        aria-label="Animated pipeline on a conveyor: a pulse travels from data capture through AI analysis, feedback loop and model training to better performance, lighting each station's screen in turn"
      >
        <img src="/learning-conveyor.png" alt="" width="1956" height="804" decoding="async" />

        <div className="avs-conveyor__wire" aria-hidden="true" />

        {LEARNING_STEPS.map(({ title }, i) => (
          <div
            className={`avs-conveyor__chip${i === activeIndex ? ' is-lit' : ''}`}
            style={{ left: `${CONVEYOR_STOPS[i]}%` }}
            key={title}
          >
            {String(i + 1).padStart(2, '0')}
          </div>
        ))}

        {LEARNING_STEPS.map(({ title, desc }, i) => (
          <div
            className={`avs-conveyor__lbl${i === activeIndex ? ' is-lit' : ''}`}
            style={{ left: `${CONVEYOR_STOPS[i]}%` }}
            key={title}
          >
            <b>{title}</b>
            <span>{desc}</span>
          </div>
        ))}

        <div className="avs-conveyor__beam" aria-hidden="true" />

        {LEARNING_STEPS.map((_, i) => (
          <div
            className={`avs-conveyor__glow avs-conveyor__glow--s${i + 1}${i === activeIndex ? ' is-lit' : ''}`}
            key={i}
            aria-hidden="true"
          />
        ))}

        <div className="avs-conveyor__dot" ref={dotRef} aria-hidden="true" />
      </div>

      {/* shown only on small screens, replacing the photo overlay text —
          each item lights up in step with the glowing station above it. */}
      <ul className="avs-conveyor__mobile-labels">
        {LEARNING_STEPS.map(({ title, desc }, i) => (
          <li key={title} className={i === activeIndex ? 'is-lit' : ''}>
            <span className="avs-conveyor__mobile-n">{String(i + 1).padStart(2, '0')}</span>
            <span><b>{title}</b> — {desc}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function BlogArticleVisionSorting() {
  return (
    <article className="avs-article">

      {/* =============== HERO =============== */}
      <section className="avs-hero">
        <div className="avs-hero__bg-veil" />
        <nav className="avs-breadcrumb" aria-label="Breadcrumb">
          <a href="/" onClick={goHome}>Home</a>
          <ChevronRight size={13} aria-hidden="true" />
          <a href="/blog" onClick={navClick('/blog')}>Blog</a>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="is-current">AI Vision Sorting: Delivering 98% Accuracy in Glass Classification</span>
        </nav>
        <div className="avs-hero__inner">
          <span className="avs-hero__chip">Technology</span>
          <h1>AI Vision Sorting: Delivering 98% Accuracy in Glass Classification</h1>
          <p className="avs-hero__lead">
            How advanced computer vision, deep learning and edge AI let Reneonix sort glass at
            industrial grade - with up to 98% accuracy, in real time.
          </p>
          <div className="avs-hero__meta">
            <span><Calendar size={14} /> April 28, 2026</span>
            <span className="avs-hero__dot" aria-hidden="true">•</span>
            <span><Clock size={14} /> 5 min read</span>
            <span className="avs-hero__dot" aria-hidden="true">•</span>
            <span><User size={14} /> By <b className="avs-hero__meta-author">Reneonix AI Research Team</b></span>
          </div>
        </div>
        <a href="#content-start" className="avs-hero__scroll-cue" onClick={(e) => jumpTo(e, 'content-start')}>
          Scroll to read <ChevronDown size={15} />
        </a>
      </section>

      <div id="content-start" />

      {/* =============== 01 — THE CHALLENGE =============== */}
      <section className="avs-chapter" id="challenge">
        <div className="container avs-challenge">
          <div className="avs-challenge__copy">
            <span className="avs-eyebrow">The Challenge</span>
            <h2>Why glass sorting needs a smarter approach</h2>
            <p>
              Glass is one of the most valuable recyclable materials on Earth-it can be remelted
              endlessly without losing quality. Yet it remains one of the hardest to recover at
              industrial grade. On a real recovery line, nothing arrives clean or labelled.
            </p>
            <p>
              Colour variations blur together under factory lighting. Labels are torn, faded or
              missing. Bottles arrive chipped, dirty and mixed with materials that don't belong.
              Traditional sorting-human eyes and basic colour sensors-simply can't keep up with
              the speed and complexity of a modern material stream.
            </p>
            <p>
              And the stakes are high: <strong>even small classification errors reduce material
              purity</strong>, locking recovered glass out of high-value manufacturing and back
              into low-grade uses.
            </p>
          </div>

          <div className="avs-photo-frame avs-challenge__photo">
            <img src="/gloved hand sorting.png" alt="Gloved hands sorting a pile of mixed, dirty glass bottles by eye" loading="lazy" />
          </div>
        </div>

        <div className="container">
          <div className="avs-pain-grid">
            {PAIN_POINTS.map(({ title, desc }) => (
              <div className="avs-pain" key={title}>
                <div className="avs-pain__title">{title}</div>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== 02 — THE BREAKTHROUGH =============== */}
      <section className="avs-chapter" id="breakthrough">
        <div className="container avs-narrow avs-narrow--left">
          <span className="avs-eyebrow">The Breakthrough</span>
          <h2>Built for <em>real-world</em> recovery</h2>
          <p>
            Conventional optical sorters ask one question: <em>what colour is this?</em> The
            Reneonix AI Vision Sorting Module asks many more. By combining{' '}
            <strong>advanced computer vision, deep learning and edge AI</strong>, it analyses
            every bottle in real time-the way an expert inspector would, but at line speed and
            without fatigue.
          </p>
        </div>

        <div className="container">
          <div className="avs-split-compare">
            <div className="avs-split-compare__panels">
              <div className="avs-split-compare__panel avs-split-compare__panel--old">
                <div className="avs-photo-frame avs-split-compare__photo">
                  <img src="/traditional sorting.jpg" alt="Traditional sorting — bottles on the conveyor as seen by a human inspector" loading="lazy" />
                </div>
                <div className="avs-split-compare__list avs-split-compare__list--bad">
                  {TRADITIONAL_CHECKS.map((point) => (
                    <span key={point}><XCircle size={13} />{point}</span>
                  ))}
                </div>
              </div>
              <span className="avs-split-compare__handle" aria-hidden="true">
                <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /><ChevronRight size={14} />
              </span>
              <div className="avs-split-compare__panel avs-split-compare__panel--new">
                <div className="avs-photo-frame avs-split-compare__photo">
                  <img src="/Ai vision sorting.jpg" alt="AI Vision Sorting — the same scene with AI detection overlays" loading="lazy" />
                </div>
                <div className="avs-split-compare__list avs-split-compare__list--good">
                  {AI_CHECKS.map((point) => (
                    <span key={point}><Check size={13} />{point}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="avs-diff-table">
            <span className="avs-eyebrow avs-diff-table__eyebrow">The Difference That Matters</span>
            <div className="avs-diff-table__frame">
              <table>
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th>Traditional Sorting</th>
                    <th>Reneonix AI Vision Sorting</th>
                  </tr>
                </thead>
                <tbody>
                  {DIFFERENCE_TABLE.map(({ label, traditional, ai }) => (
                    <tr key={label}>
                      <td className="avs-diff-table__cap">{label}</td>
                      <td className="avs-diff-table__old">{traditional}</td>
                      <td className="avs-diff-table__new">{ai}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile-only stacked equivalent — a 3-column table never fits a
               phone width without either shrinking illegibly or scrolling
               (values like "Colour + Material + Shape + Brand + Condition"
               guarantee that). Same data as the desktop table above it. */}
            <div className="avs-diff-cards">
              {DIFFERENCE_TABLE.map(({ label, traditional, ai }) => (
                <div className="avs-diff-card" key={label}>
                  <div className="avs-diff-card__cap">{label}</div>
                  <div className="avs-diff-card__row avs-diff-card__row--old">
                    <span><b className="avs-diff-card__rowlabel">Traditional Sorting</b>{traditional}</span>
                  </div>
                  <div className="avs-diff-card__row avs-diff-card__row--new">
                    <span><b className="avs-diff-card__rowlabel">Reneonix AI Vision Sorting</b>{ai}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =============== 03 — PROVEN PERFORMANCE =============== */}
      <section className="avs-chapter" id="performance">
        <div className="container avs-narrow avs-narrow--left">
          <span className="avs-eyebrow">Proven Performance</span>
          <h2>Numbers from the line, not the lab</h2>
          <p>
            During validation and pilot deployments across material recovery facilities, the AI
            Vision Sorting Module delivered industrial-grade results-consistently, shift after
            shift.
          </p>
        </div>

        <div className="container">
          <div className="avs-stat-grid">
            {PERFORMANCE_STATS.map(({ value, label, desc, meter }) => (
              <div className="avs-stat" key={label}>
                <div className="avs-stat__value">{value}</div>
                <div className="avs-stat__label">{label}</div>
                <p className="avs-stat__desc">{desc}</p>
                <div className="avs-stat__meter"><i style={{ width: `${meter}%` }} /></div>
              </div>
            ))}
          </div>

          <AvsDashboard />
        </div>
      </section>

      {/* =============== 04 — BEYOND COLOUR =============== */}
      <section className="avs-chapter" id="beyond-colour">
        <div className="container">
          <div className="avs-narrow avs-narrow--left">
            <span className="avs-eyebrow">Beyond Colour</span>
            <h2>Every bottle, Every detail</h2>
            <p>
              Modern recovery requires much more than identifying colours. For each item entering
              the facility, the model reads a full profile of visual cues-then decides the most
              appropriate recovery pathway, all in milliseconds.
            </p>
          </div>

          <AvsAnatomyScanner />
        </div>
      </section>

      {/* =============== 05 — ALWAYS LEARNING =============== */}
      <section className="avs-chapter" id="learning">
        <div className="container avs-narrow avs-narrow--left">
          <span className="avs-eyebrow">Always Learning</span>
          <h2>Smarter today, <em>Self reliant model</em></h2>
          <p>
            The biggest advantage of AI is that it never stops improving. Every deployment
            generates new operational data that refines our machine learning models. As more
            material passes through the system, it becomes better at recognising regional
            packaging variations, new bottle designs and changing industrial requirements.
          </p>
          <p>
            The result is a <strong>continuously improving recovery platform</strong>-not a
            static sorting machine.
          </p>
        </div>

        <div className="container">
          <AvsLearningConveyor />
        </div>
      </section>

      {/* =============== 06 — THE CIRCULAR FUTURE + CTA =============== */}
      <section className="avs-chapter" id="circular-future">
        <div className="container avs-narrow">
          <span className="avs-eyebrow">The Circular Future</span>
          <h2>Building the foundation for circular materials</h2>
          <p>
            High-quality secondary raw materials begin with accurate classification. By combining
            AI vision, industrial automation and intelligent material recognition, Reneonix
            enables recovery facilities to deliver <strong>cleaner, more consistent, buyer-ready
            material streams</strong>.
          </p>
          <p>
            Our AI Vision Sorting Module isn't simply automating inspection-it is helping
            redefine how industrial materials are recovered, verified and prepared for the
            circular economy.
          </p>
        </div>
      </section>

      {/* =============== GO TO BLOG =============== */}
      <div className="avs-goto-blog">
        <ArticlePDF article={visionSortingPdfData} />
        <a className="btn btn-primary" href="/blog" onClick={goToBlogLatest}>
          Back to Blog <ArrowRight size={16} />
        </a>
      </div>

    </article>
  );
}
