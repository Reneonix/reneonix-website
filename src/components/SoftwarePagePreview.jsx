import { useEffect, useLayoutEffect, useRef, useState, Fragment } from 'react';
import {
  LayoutDashboard, GitBranch, Box, Factory, Package, FileText, Settings,
  Search, ChevronDown, CheckCircle2, Truck, Layers,
} from 'lucide-react';

import './SoftwarePage_preview.css';

const AUTOPLAY_MS = 6000;
const DASHBOARD_DESIGN_WIDTH = 640;

/* Scales a fixed-design-width block down to fit whatever width its
   container actually has — used so the dashboard/traceability/passport
   content (laid out at their real, unreflowed proportions) shrinks to fit
   entirely on narrow mobile screens instead of overflowing/scrolling.
   Never scales UP past 1, so desktop/tablet (where the container is
   already wider than the design width) is completely unaffected. */
function useFitScale(containerRef, contentRef, designWidth = DASHBOARD_DESIGN_WIDTH, onHeightChange) {
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const measure = () => {
      const availWidth = container.clientWidth;
      if (!availWidth) return;
      const s = Math.min(availWidth / designWidth, 1);
      const h = content.scrollHeight * s;
      setScale(s);
      setScaledHeight(h);
      onHeightChange?.(h);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    ro.observe(content);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, contentRef, designWidth]);

  return { scale, scaledHeight };
}

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'traceability', label: 'Traceability' },
  { key: 'passport', label: 'Material Passport' },
];

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, tab: 'dashboard' },
  { key: 'traceability', label: 'Traceability', Icon: GitBranch, tab: 'traceability' },
  { key: 'materials', label: 'Materials', Icon: Box, tab: 'passport' },
  { key: 'facilities', label: 'Facilities', Icon: Factory },
  { key: 'batches', label: 'Batches', Icon: Package },
  { key: 'reports', label: 'Reports', Icon: FileText },
  { key: 'settings', label: 'Settings', Icon: Settings },
];

const KPI_DATA = [
  { key: 'co2e', label: 'CO2e Saved', value: 842, decimals: 0, suffix: ' t', delta: '+12.4%', trend: 'up', spark: [40, 44, 42, 50, 55, 60, 68] },
  { key: 'quality', label: 'Quality Score', value: 97.8, decimals: 1, suffix: '%', delta: '+2.1%', trend: 'up', spark: [88, 90, 89, 93, 95, 96, 98] },
  { key: 'batches', label: 'Batches Traced', value: 1284, decimals: 0, suffix: '', delta: '+8.4%', trend: 'up', spark: [60, 65, 63, 70, 75, 80, 90] },
  { key: 'contam', label: 'Contamination', value: 3.2, decimals: 1, suffix: '%', delta: '-1.4%', trend: 'down', spark: [12, 10, 9, 7, 6, 5, 3] },
];

const FLOW_DATA = [30, 38, 35, 50, 58, 66, 80];
const FLOW_COMPARE_DATA = [18, 22, 26, 32, 38, 44, 50];
const FLOW_LABELS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const MIX_DATA = [
  { key: 'glass', label: 'Glass', pct: 42, color: '#2A72C9' },
  { key: 'pet', label: 'PET', pct: 35, color: '#C24A82' },
  { key: 'aluminium', label: 'Aluminium', pct: 23, color: '#5B8A1F' },
];

const BATCH_DATA = [
  { id: 'BT-24051', material: 'Aluminium 6061', source: 'Karnataka, India', status: 'good', statusLabel: 'QC PASSED' },
  { id: 'BT-24052', material: 'PET (Clear)', source: 'Maharashtra, India', status: 'pending', statusLabel: 'IN PROCESS' },
  { id: 'BT-24053', material: 'Glass (Mixed)', source: 'Tamil Nadu, India', status: 'good', statusLabel: 'QC PASSED' },
];

const JOURNEY_DATA = [
  { key: 'source', label: 'Source', sub: 'Karnataka, India', Icon: Truck },
  { key: 'sorting', label: 'Sorting', sub: 'May 03, 2024', Icon: Layers },
  { key: 'processing', label: 'Processing', sub: 'Maharashtra, India', Icon: Factory },
  { key: 'qc', label: 'QC Passed', sub: 'May 09, 2024', Icon: CheckCircle2 },
  { key: 'dispatch', label: 'Dispatch', sub: 'Reneonix Partner', Icon: Truck },
];

const PASSPORT_DATA = {
  materialType: 'Recycled Aluminium 6061',
  batchId: 'RI-6061-0524',
  recoveredOn: 'May 12, 2024',
  purity: '98.6% Grade A',
  hash: '0x8f3a71…c92e4d',
};

/* ── count-up hook: replays from 0 every time `start` flips false→true ── */
function useCountUp(target, { duration = 1400, start = false } = {}) {
  const [value, setValue] = useState(0);
  const ranRef = useRef(false);

  useEffect(() => {
    if (!start) {
      ranRef.current = false;
      setValue(0);
      return;
    }
    if (ranRef.current) return; // already animated for this activation
    ranRef.current = true;
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return value;
}

function MiniSparkline({ data, color }) {
  const w = 64, h = 24, pad = 2;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const stepX = (w - pad * 2) / (data.length - 1);
  const points = data.map((v, i) => [pad + i * stepX, h - pad - ((v - min) / range) * (h - pad * 2)]);
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  return (
    <svg className="sw-preview__spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FlowChart({ data, compareData }) {
  const w = 560, h = 150, padX = 20, padY = 16;
  const stepX = (w - padX * 2) / (data.length - 1);
  const yFor = (v) => h - padY - (v / 100) * (h - padY * 2);
  const toPath = (series) => {
    const xs = series.map((_, i) => padX + i * stepX);
    const ys = series.map(yFor);
    return xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
  };
  const linePath = toPath(data);
  const comparePath = compareData ? toPath(compareData) : null;
  const xs = data.map((_, i) => padX + i * stepX);
  const areaPath = `${linePath} L ${xs[xs.length - 1]} ${h - padY} L ${xs[0]} ${h - padY} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sw-preview__flow-svg" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="swPreviewFlowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9CC130" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#9CC130" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((g) => (
        <line key={g} x1={padX} x2={w - padX} y1={yFor(g)} y2={yFor(g)} stroke="rgba(255,255,255,.08)" />
      ))}
      <path d={areaPath} fill="url(#swPreviewFlowGrad)" />
      {comparePath && (
        <path className="sw-preview__flow-line--compare" d={comparePath} fill="none" strokeWidth="1.6" strokeDasharray="3 5" />
      )}
      <path className="sw-preview__flow-line" d={linePath} fill="none" stroke="#9CC130" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DonutChart({ segments, size = 104, strokeWidth = 13 }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  let cumulative = 0;
  return (
    <svg className="sw-preview__donut-svg" viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {segments.map((seg) => {
          const dash = (seg.pct / 100) * c;
          const offset = -((cumulative / 100) * c);
          cumulative += seg.pct;
          return (
            <circle
              key={seg.key}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </g>
    </svg>
  );
}

function KpiCard({ kpi, start }) {
  const value = useCountUp(kpi.value, { start });
  const displayed = kpi.decimals > 0 ? value.toFixed(kpi.decimals) : Math.round(value).toLocaleString();
  return (
    <div className="sw-preview__kpi">
      <span className="sw-preview__kpi-label">{kpi.label}</span>
      <div className="sw-preview__kpi-value">
        {displayed}<em>{kpi.suffix}</em>
      </div>
      <span className="sw-preview__kpi-delta sw-preview__kpi-delta--good">
        {kpi.trend === 'down' ? '▼' : '▲'} {kpi.delta}
      </span>
      <MiniSparkline data={kpi.spark} color="#9CC130" />
    </div>
  );
}

function SidebarNav({ activeTab, onSelect }) {
  return (
    <div className="sw-preview__sidebar">
      <nav className="sw-preview__navlist">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            disabled={!item.tab}
            className={`sw-preview__navitem${activeTab === item.tab ? ' sw-preview__navitem--active' : ''}`}
            onClick={item.tab ? () => onSelect(item.tab) : undefined}
          >
            <item.Icon size={15} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sw-preview__usercard">
        <span className="sw-preview__avatar sw-preview__avatar--sm">IR</span>
        <span className="sw-preview__userinfo">
          Iwan Richard
          <small>Head of Operations</small>
        </span>
      </div>
    </div>
  );
}

function Appbar() {
  const [syncedAgo, setSyncedAgo] = useState(2);

  useEffect(() => {
    const id = setInterval(() => {
      setSyncedAgo((s) => (s >= 9 ? 1 : s + 1));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="sw-preview__appbar">
      <div className="sw-preview__search">
        <Search size={13} />
        <span>Search batches, materials, facilities…</span>
      </div>
      <span className="sw-preview__datechip">H1 2026 <ChevronDown size={12} /></span>
      <span className="sw-preview__synced"><i className="sw-preview__pulse" />Synced {syncedAgo}s ago</span>
      <span className="sw-preview__avatar">IR</span>
    </div>
  );
}

function TabBar({ tabs, activeTab, progress, onSelect }) {
  return (
    <div className="sw-preview__tabbar">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`sw-preview__tab${activeTab === t.key ? ' sw-preview__tab--active' : ''}`}
          onClick={() => onSelect(t.key)}
        >
          <span className="sw-preview__tab-label">{t.label}</span>
          {activeTab === t.key && (
            <span className="sw-preview__tab-fill" style={{ width: `${progress}%` }} />
          )}
        </button>
      ))}
    </div>
  );
}

function BatchTable({ columns }) {
  return (
    <div className="sw-preview__table-card">
      <div className="sw-preview__table-head">
        <span>{columns[0]}</span><span>MATERIAL</span><span>SOURCE</span><span>STATUS</span>
      </div>
      {BATCH_DATA.map((b) => (
        <div key={b.id} className="sw-preview__table-row">
          <span>{b.id}</span>
          <span>{b.material}</span>
          <span>{b.source}</span>
          <span className={`sw-preview__pill sw-preview__pill--${b.status}`}>{b.statusLabel}</span>
        </div>
      ))}
    </div>
  );
}

/* Shrinks a fixed-design-width tab (the dashboard's real, unreflowed
   layout) to fit its container — see useFitScale. On desktop/tablet the
   container is already wide enough so this is a no-op (scale stays 1). */
function ScaleStage({ className, children, onHeightChange }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const { scale, scaledHeight } = useFitScale(containerRef, contentRef, DASHBOARD_DESIGN_WIDTH, onHeightChange);

  return (
    <div
      className="sw-preview__scale-stage"
      ref={containerRef}
      style={scaledHeight != null ? { height: scaledHeight } : undefined}
    >
      <div
        className={className}
        ref={contentRef}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  );
}

function DashboardTab({ start, onHeightChange }) {
  return (
    <ScaleStage className="sw-preview__dashboard" onHeightChange={onHeightChange}>
      <div className="sw-preview__kpis">
        {KPI_DATA.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} start={start} />)}
      </div>
      <div className="sw-preview__row2">
        <div className="sw-preview__chart-card">
          <div className="sw-preview__card-head">
            <span className="sw-preview__card-title">Material Flow Overview</span>
            <span className="sw-preview__card-range">This Year</span>
          </div>
          <FlowChart data={FLOW_DATA} compareData={FLOW_COMPARE_DATA} />
          <div className="sw-preview__flow-xaxis">
            {FLOW_LABELS.map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
        <div className="sw-preview__donut-card">
          <div className="sw-preview__card-head">
            <span className="sw-preview__card-title">Material Mix</span>
          </div>
          <div className="sw-preview__donut-wrap">
            <DonutChart segments={MIX_DATA} />
            <div className="sw-preview__legend">
              {MIX_DATA.map((seg) => (
                <span key={seg.key} className="sw-preview__legend-item">
                  <i style={{ background: seg.color }} />
                  {seg.label} <b>{seg.pct}%</b>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BatchTable columns={['RECENT BATCHES']} />
    </ScaleStage>
  );
}

function TraceabilityTab({ onHeightChange }) {
  return (
    <ScaleStage className="sw-preview__traceability" onHeightChange={onHeightChange}>
      <div className="sw-preview__timeline">
        {JOURNEY_DATA.map((node, i) => (
          <Fragment key={node.key}>
            <div className="sw-preview__tl-node">
              <span className="sw-preview__tl-ico"><node.Icon size={17} /></span>
              <span className="sw-preview__tl-label">{node.label}</span>
              <span className="sw-preview__tl-sub">{node.sub}</span>
            </div>
            {i < JOURNEY_DATA.length - 1 && <span className="sw-preview__tl-line" aria-hidden="true" />}
          </Fragment>
        ))}
      </div>
      <BatchTable columns={['BATCH']} />
    </ScaleStage>
  );
}

function PassportTab({ onHeightChange }) {
  return (
    <ScaleStage className="sw-preview__passport" onHeightChange={onHeightChange}>
      <div className="sw-preview__qr">
        <img src="/material-qr.jpeg" alt="Material passport QR code" />
      </div>
      <div className="sw-preview__pass-fields">
        <div className="sw-preview__pass-field">
          <small>MATERIAL TYPE</small><b>{PASSPORT_DATA.materialType}</b>
        </div>
        <div className="sw-preview__pass-field">
          <small>BATCH ID</small><b>{PASSPORT_DATA.batchId}</b>
        </div>
        <div className="sw-preview__pass-field">
          <small>RECOVERED ON</small><b>{PASSPORT_DATA.recoveredOn}</b>
        </div>
        <div className="sw-preview__pass-field">
          <small>PURITY</small><b className="sw-preview__pass-accent">{PASSPORT_DATA.purity}</b>
        </div>
        <div className="sw-preview__pass-hash">
          <CheckCircle2 size={13} /> {PASSPORT_DATA.hash} anchored on-chain, immutable, audit-ready
        </div>
      </div>
    </ScaleStage>
  );
}

export default function PlatformPreviewMockup() {
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startRef = useRef(0);
  const pausedAtRef = useRef(null);
  const reducedMotionRef = useRef(false);
  const [tabHeights, setTabHeights] = useState({});

  // Reserve the tallest of the 3 tabs' *current* (possibly scaled-down) heights,
  // so switching tabs never jumps, but on mobile the reserved space shrinks
  // right along with the scaled-down content instead of leaving a big gap.
  const reportTabHeight = (key, height) => {
    setTabHeights((prev) => (prev[key] === height ? prev : { ...prev, [key]: height }));
  };
  const maxTabHeight = Math.max(0, ...Object.values(tabHeights));

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    startRef.current = performance.now();
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // shift the clock forward by however long we were paused, so progress doesn't jump on resume
  useEffect(() => {
    if (paused) {
      pausedAtRef.current = performance.now();
    } else if (pausedAtRef.current != null) {
      startRef.current += performance.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
  }, [paused]);

  useEffect(() => {
    if (reducedMotionRef.current) return;
    let rafId;
    const loop = (now) => {
      if (paused || !visible) { rafId = requestAnimationFrame(loop); return; }
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / AUTOPLAY_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setTab((prev) => {
          const idx = TABS.findIndex((t) => t.key === prev);
          return TABS[(idx + 1) % TABS.length].key;
        });
        startRef.current = now;
        setProgress(0);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [paused, visible]);

  const handleSelect = (key) => {
    setTab(key);
    setProgress(0);
    startRef.current = performance.now();
  };

  return (
    <div
      className={`sw-preview${visible ? ' sw-preview--visible' : ''}`}
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="sw-preview__chrome sw-preview__chrome--dark">
        <div className="sw-preview__chrome-bar">
          <span className="sw-preview__dot sw-preview__dot--red" />
          <span className="sw-preview__dot sw-preview__dot--yellow" />
          <span className="sw-preview__dot sw-preview__dot--green" />
          <span className="sw-preview__urlbar">app.retriaz.com/{tab}</span>
        </div>
        <div className="sw-preview__body">
          <SidebarNav activeTab={tab} onSelect={handleSelect} />
          <div className="sw-preview__main">
            <Appbar />
            <TabBar tabs={TABS} activeTab={tab} progress={progress} onSelect={handleSelect} />
            <div
              className="sw-preview__content"
              style={maxTabHeight ? { minHeight: maxTabHeight + 44 } : undefined}
            >
              <div className={`sw-preview__pane${tab === 'dashboard' ? ' sw-preview__pane--active' : ''}`}>
                <DashboardTab
                  start={visible && tab === 'dashboard'}
                  onHeightChange={(h) => reportTabHeight('dashboard', h)}
                />
              </div>
              <div className={`sw-preview__pane${tab === 'traceability' ? ' sw-preview__pane--active' : ''}`}>
                <TraceabilityTab onHeightChange={(h) => reportTabHeight('traceability', h)} />
              </div>
              <div className={`sw-preview__pane${tab === 'passport' ? ' sw-preview__pane--active' : ''}`}>
                <PassportTab onHeightChange={(h) => reportTabHeight('passport', h)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
