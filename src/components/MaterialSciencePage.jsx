import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, ChevronRight, ChevronDown,
  Recycle, Microscope, FlaskConical, Package, ShieldCheck, Factory,
  BarChart2, Layers, Zap, Truck,
  Shirt, Building2, Sun, Leaf, Globe, Sparkles,
  Landmark, HardHat, Lightbulb,
  Users, TrendingUp, CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { navClick } from '../utils/nav.js';
import './MaterialSciencePage.css';

const GlassBottleIcon = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="2" width="6" height="3" rx="1" />
    <path d="M9 5C9 7 4 8 4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8c0-3-5-4-5-6" />
  </svg>
);

const RESEARCH_STEPS = [
  {
    num: '01',
    title: 'Sample Collection',
    body: 'We source and collect representative samples from post-consumer and industrial waste streams, ensuring a diverse and comprehensive dataset for material research and analysis.',
    img: '/step1.png',
    outputs: [
      { label: 'Waste Stream Sourcing' },
      { label: 'Sample Classification' },
      { label: 'Quality Assessment' },
    ],
  },
  {
    num: '02',
    title: 'Material Characterization',
    body: 'Physical, chemical, and thermal analysis of collected waste materials to evaluate their composition and performance potential.',
    img: '/step2.jpg',
    outputs: [
      { label: 'Composition Analysis' },
      { label: 'Particle Size Distribution' },
      { label: 'Purity Assessment' },
    ],
  },
  {
    num: '03',
    title: 'Material Formulation & Engineering',
    body: 'Designing and developing precise material compositions for targeted mechanical, thermal, and functional performance.',
    img: '/step3.jpg',
    outputs: [
      { label: 'Formula Development' },
      { label: 'Property Optimisation' },
      { label: 'Performance Targets' },
    ],
  },
  {
    num: '04',
    title: 'Prototype Development',
    body: 'Transforming engineered formulations into lab-scale prototypes and physical specimens for evaluation.',
    img: '/step4.jpg',
    outputs: [
      { label: 'Lab Samples' },
      { label: 'Test Specimens' },
      { label: 'Scale Prototypes' },
    ],
  },
  {
    num: '05',
    title: 'Performance Validation',
    body: 'Rigorous testing for strength, durability, thermal stability, and environmental compliance against industry benchmarks.',
    img: '/step5.jpg',
    outputs: [
      { label: 'Strength Testing' },
      { label: 'Durability Report' },
      { label: 'Certification Data' },
    ],
  },
  {
    num: '06',
    title: 'Industrial Application',
    body: 'Scaling validated materials into full production and deploying them across real-world industrial applications.',
    img: '/step6.jpg',
    outputs: [
      { label: 'Scale-up Plan' },
      { label: 'Distribution Setup' },
      { label: 'Market Deployment' },
    ],
  },
];

const WASTE_TYPES = [
  {
    id: 'glass', tab: 'Glass Waste', TabIcon: GlassBottleIcon,
    title: 'Glass Waste',
    body: 'We recover and process post-consumer and industrial glass waste to convert it into high-performance materials for real-world applications.',
    img: '/glass waste - ms.jpg',
    tagline: 'Sustainable Innovation',
    taglineBody: 'Turning discarded glass into advanced materials that build a cleaner, stronger, and more sustainable future.',
    sources: [
      { Icon: GlassBottleIcon, label: 'Bottles & Containers' },
      { Icon: Layers,     label: 'Window Glass' },
      { Icon: Factory,    label: 'Industrial Glass Scrap' },
      { Icon: Zap,        label: 'Glass Fines & Powder' },
    ],
    stats: [
      { Icon: Recycle, value: '1,200+', label: 'Tons Recycled' },
      { Icon: Leaf,    value: '75%',    label: 'Waste Diverted' },
      { Icon: Package, value: '80+',    label: 'Products Created' },
      { Icon: Globe,   value: '500K+',  label: 'Lives Impacted' },
    ],
    mission: {
      title: 'Turning Glass Waste Into High-Value Materials',
      sub: 'Advanced recycling. Innovative material science. A cleaner built environment.',
    },
    products: [
      { name: 'Sand Blasting Abrasive',     img: '/Sand blasting abrasive.jpeg',    Icon: Sparkles  },
      { name: 'Glass Foam',                 img: '/Foam Glass.jpg',                  Icon: Layers    },
      { name: 'Light Weight Aggregate',     img: '/Light weight aggregrate.png',     Icon: Package   },
      { name: 'Tiles',                      img: '/Tiles.avif',                      Icon: Factory   },
    ],
  },
  {
    id: 'plastic', tab: 'Plastic Waste', TabIcon: Recycle,
    title: 'Plastic Waste',
    body: 'We process diverse plastic waste streams, converting them into durable, high-performance materials for industrial and construction use.',
    img: '/plastic waste - ms.jpg',
    tagline: 'Circular Economy',
    taglineBody: 'Converting plastic waste streams into durable products that reduce pollution and resource consumption.',
    sources: [
      { Icon: Package, label: 'PET Bottles' },
      { Icon: Layers,  label: 'HDPE Containers' },
      { Icon: Recycle, label: 'Mixed Plastics' },
      { Icon: Factory, label: 'Industrial Off-cuts' },
    ],
    stats: [
      { Icon: Recycle, value: '2,500+', label: 'Tons Recycled' },
      { Icon: Leaf,    value: '85%',    label: 'Pollution Reduced' },
      { Icon: Package, value: '120+',   label: 'Products Created' },
      { Icon: Globe,   value: '1M+',    label: 'Lives Impacted' },
    ],
    mission: {
      title: 'Turning Plastic Waste Into Valuable Resources',
      sub: 'Advanced processing. Circular thinking. A cleaner, greener tomorrow.',
    },
    products: [
      { name: 'Eco-Bricks',                  img: '/Eco-bricks.png',                  Icon: Building2 },
      { name: 'Plastic Sand Paving Block',   img: '/Plastic sand paving block.png',   Icon: Layers    },
      { name: 'Recycled Plastic Lumber',     img: '/Recycled Plastic Lumber.png',     Icon: Truck     },
      { name: 'rPET 3D Printing Filament',   img: '/rPET 3D Printing Filament.png',   Icon: Zap       },
    ],
  },
  {
    id: 'textile', tab: 'Textile Waste', TabIcon: Shirt,
    title: 'Textile Waste',
    body: 'We convert post-consumer and industrial textile waste into engineered fibres and composite materials for construction and industrial sectors.',
    img: '/textile waste - ms.jpg',
    tagline: 'Fibre Revival',
    taglineBody: 'Breathing new life into discarded textiles to create engineering-grade materials for modern industry.',
    sources: [
      { Icon: Shirt,   label: 'Garment Off-cuts' },
      { Icon: Layers,  label: 'Industrial Fibres' },
      { Icon: Recycle, label: 'Post-Consumer Fabrics' },
      { Icon: Package, label: 'Non-woven Textiles' },
    ],
    stats: [
      { Icon: Recycle, value: '800+',  label: 'Tons Recovered' },
      { Icon: Leaf,    value: '70%',   label: 'Landfill Reduced' },
      { Icon: Package, value: '60+',   label: 'Products Created' },
      { Icon: Globe,   value: '300K+', label: 'Lives Impacted' },
    ],
    mission: {
      title: 'Breathing New Life Into Discarded Textiles',
      sub: 'Smart fibre recovery. High-performance composites. A sustainable textile future.',
    },
    products: [
      { name: 'Recycled Denim Insulation Batt',   img: '/Recycled Denim Insulation Batt.png',   Icon: ShieldCheck },
      { name: 'Recycled PET Geotextile Fabric',   img: '/Recycled PET Geotextile Fabric.png',   Icon: Layers      },
      { name: 'Recycled Textile Acoustic Panels', img: '/Recycled Textile Acoustic panels.png', Icon: Microscope  },
      { name: 'Textile Fabric Composite Board',   img: '/Textile Fabric Composite board.png',   Icon: Package     },
    ],
  },
  {
    id: 'construction', tab: 'Construction Waste', TabIcon: Building2,
    title: 'Construction Waste',
    body: 'We process demolition and construction debris into aggregates, boards, and materials that re-enter the building supply chain.',
    img: '/construction waste - ms.jpg',
    tagline: 'Built to Rebuild',
    taglineBody: 'Transforming demolition debris into high-quality construction materials for the next generation of buildings.',
    sources: [
      { Icon: Building2, label: 'Demolition Rubble' },
      { Icon: Layers,    label: 'Concrete & Mortar' },
      { Icon: Factory,   label: 'Brick & Masonry' },
      { Icon: Package,   label: 'Ceramic & Tile Scrap' },
    ],
    stats: [
      { Icon: Recycle, value: '5,000+', label: 'Tons Processed' },
      { Icon: Leaf,    value: '90%',    label: 'Waste Diverted' },
      { Icon: Package, value: '100+',   label: 'Products Created' },
      { Icon: Globe,   value: '2M+',    label: 'Lives Impacted' },
    ],
    mission: {
      title: 'Rebuilding With What Was Left Behind',
      sub: 'Precision processing. Circular construction. Building better, greener cities.',
    },
    products: [
      { name: 'Cement Block',       img: '/Cement block.webp',       Icon: Building2 },
      { name: 'Composite Tiles',    img: '/Composite tiles.webp',     Icon: Layers    },
      { name: 'Paver Block',        img: '/Paver block.webp',         Icon: Factory   },
      { name: 'Recycled Aggregate', img: '/Recycled aggregrate.jpg',  Icon: Recycle   },
    ],
  },
  {
    id: 'solar', tab: 'Solar Waste', TabIcon: Sun,
    title: 'Solar Waste',
    body: 'We recover silicon, glass, and metals from end-of-life solar panels, transforming them into high-value secondary materials.',
    img: '/solar waste - ms.jpg',
    tagline: 'Energy After Energy',
    taglineBody: 'Recovering precious materials from solar panels to power the next generation of clean technology.',
    sources: [
      { Icon: Sun,     label: 'End-of-Life Panels' },
      { Icon: Zap,     label: 'Silicon Wafers' },
      { Icon: Layers,  label: 'Encapsulant Films' },
      { Icon: Factory, label: 'Aluminium Frames' },
    ],
    stats: [
      { Icon: Recycle, value: '300+',  label: 'Tons Recovered' },
      { Icon: Leaf,    value: '95%',   label: 'Material Recovery' },
      { Icon: Package, value: '40+',   label: 'Products Created' },
      { Icon: Globe,   value: '100K+', label: 'Lives Impacted' },
    ],
    mission: {
      title: 'Recovering Full Value From End-of-Life Solar',
      sub: 'Material recovery. Clean energy circularity. A sustainable solar legacy.',
    },
    products: [
      { name: 'Concrete Roof Tiles',  img: '/Concrete roof tiles.jpg', Icon: Factory  },
      { name: 'Countertops',          img: '/Countertops.jpg',          Icon: Layers   },
      { name: 'Insulation Block',     img: '/Insulation block.webp',    Icon: Package  },
      { name: 'Recovered Aluminium',  img: '/Recovered aluminium.jpg',  Icon: Zap      },
    ],
  },
];

const IMPACT_STATS = [
  { Icon: Recycle,    value: '100%', title: 'Waste Utilization',       body: 'Converting complex waste streams into valuable materials.' },
  { Icon: BarChart2,  value: '50+',  title: 'Industrial Applications', body: 'Materials designed for diverse industrial use cases.' },
  { Icon: Users,      value: '5+',   title: 'Waste Streams',           body: 'Working with multiple waste categories and sources.' },
  { Icon: TrendingUp, value: '10x',  title: 'Better Performance',      body: 'Superior thermal, acoustic and structural performance.' },
];

// 5 nodes evenly spaced at 72° apart (pentagon), r=213 in 560×560 viewBox
// dotX = 280 + 213·sin(θ),  dotY = 280 − 213·cos(θ)
const ORBIT_NODES = [
  { id: '01', Icon: Landmark,      title: 'Infrastructure',        body: 'Durable materials for roads, bridges and public infrastructure.',              dotX: 280, dotY: 67  }, // θ=0°
  { id: '02', Icon: Factory,      title: 'Manufacturing',         body: 'Engineered materials for industrial equipment, panels and systems.',           dotX: 483, dotY: 214 }, // θ=72°
  { id: '03', Icon: FlaskConical, title: 'Research & Innovation', body: 'Enabling new material solutions through continuous research and development.', dotX: 405, dotY: 452 }, // θ=144°
  { id: '04', Icon: Lightbulb,    title: 'Thermal Management',    body: 'Advanced materials for energy efficiency and temperature regulation.',         dotX: 155, dotY: 452 }, // θ=216°
  { id: '05', Icon: HardHat,      title: 'Construction',          body: 'High-performance materials for sustainable and resilient construction.',       dotX: 77,  dotY: 214 }, // θ=288°
];

const BANNER_ITEMS = [
  'Lower carbon footprint through circular solutions',
  'Reduced landfill dependency and environmental impact',
  'Building a cleaner, smarter and more sustainable future',
];

const QZ_STEPS = [
  { num: '01', img: '/powder.png',    tag: 'Powder',    title: 'Fine Quartz Powder',          body: 'Ultra-fine quartz powder with particle size <150 µm.' },
  { num: '02', img: '/binder.png',    tag: 'Binder',    title: 'Binder Preparation',          body: 'Binder system prepared by controlled mixing with water under heating and agitation.' },
  { num: '03', img: '/mix.png',       tag: 'Mix',       title: 'Controlled Mixing',           body: 'Binder is uniformly mixed with quartz powder for even distribution and a wet mixture.' },
  { num: '04', img: '/granulate.png', tag: 'Granulate', title: 'Pelletization / Granulation', body: 'Wet mixture is subjected to mechanical pressure to form compact granules.' },
  { num: '05', img: '/dry.png',       tag: 'Dry',       title: 'Controlled Drying',           body: 'Wet granules dried at 120°C for 1 hour to remove moisture and strengthen granules.' },
  { num: '06', img: '/screen.png',    tag: 'Screen',    title: 'Screening & Classification',  body: 'Dried granules screened to 600–1000 µm (ASTM No. 18–30).' },
];

const QZ_SPEC_ROWS = [
  { key: 'Particle size range',       val: '600–1000 µm' },
  { key: 'ASTM classification',       val: 'No. 18–30' },
  { key: 'Nominal midpoint (D50)',    val: '~800 µm' },
  { key: 'Granule form',              val: 'Pelletized / Granulated' },
  { key: 'Starting material',         val: '<150 µm Quartz Powder' },
  { key: 'Dust generation',           val: 'Low / Dust-free' },
];

const QZ_CHECKLIST = [
  'Direct furnace observation at 500°C showed no visible carbon residue.',
  'TGA–DSC analysis shows the processing additive decomposes and burns off in a defined temperature region.',
  'Quartz remained thermally stable, with no significant change in colour or integrity.',
];

const QZ_OBSERVATIONS = [
  { key: 'Carbon burn-off',                     val: 'Passed' },
  { key: 'Visible carbon at 500°C',             val: 'Nil' },
  { key: 'Quartz colour after 500°C',           val: 'No significant change' },
  { key: 'Quartz phase / chemical integrity',   val: 'Maintained' },
  { key: 'Thermal stability of quartz base',    val: 'Stable' },
  { key: 'Granule size',                        val: '600–1000 µm' },
];

export default function MaterialSciencePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = RESEARCH_STEPS[activeIdx];
  const [activeWaste, setActiveWaste] = useState(0);
  const wt = WASTE_TYPES[activeWaste];
  const videoRef = useRef(null);
  const [qzView, setQzView] = useState('process');
  const qzVideoRef = useRef(null);
  const qzFrameRef = useRef(null);
  const qzViewMounted = useRef(false);

  // Part A / Part B swap inside .ms-qz__frame changes the frame's height,
  // which shifts the sections below it under a fixed scrollY - re-anchor
  // to the frame's top on every toggle so the page doesn't appear to jump
  // to Research Approach. Skipped on first mount (nothing to re-anchor to).
  useEffect(() => {
    if (!qzViewMounted.current) { qzViewMounted.current = true; return; }
    qzFrameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [qzView]);

  useEffect(() => {
    const hero = document.querySelector('.ms-hero');
    if (hero) requestAnimationFrame(() => hero.classList.add('ms-hero--in'));

    const conn = navigator.connection;
    const isSlow = conn?.saveData || ['slow-2g', '2g', '3g'].includes(conn?.effectiveType);

    if (!isSlow && videoRef.current) {
      videoRef.current.src = '/material-hero-video.mp4';
      videoRef.current.load();
    } else if (videoRef.current) {
      videoRef.current.poster = '/material-science-bg.png';
    }
  }, []);

  // Granulation process video - plays while scrolled into view, pauses
  // otherwise (matches the walkthrough video on MunicipalitiesGovernmentPage).
  useEffect(() => {
    const video = qzVideoRef.current;
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
  }, [qzView]);

  return (
    <div className="ms-page">

      {/* ── HERO ── */}
      <section className="ms-hero">
        <video
          ref={videoRef}
          className="ms-hero__bg"
          autoPlay muted loop playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="ms-hero__overlay" aria-hidden="true" />

        <div className="container ms-hero__container">
          <nav className="ms-crumb" aria-label="Breadcrumb">
            <a href="/" onClick={navClick('/')}>Home</a>
            <ChevronRight size={14} aria-hidden="true" />
            <a href="/solutions" onClick={navClick('/solutions')}>Solutions</a>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="ms-crumb__current">Material Science</span>
          </nav>

          <div className="ms-hero__copy">
            <h1 className="ms-hero__title">
              Turning Industrial<br />
              Waste Into<br />
              <em>Next-Generation Materials</em>
            </h1>
            <p className="ms-hero__lead">
              Advanced material science research that transforms complex waste streams
              into high-performance, sustainable solutions for a circular future.
            </p>
            <div className="ms-hero__cta">
            </div>
          </div>
        </div>
      </section>

      {/* ── MATERIALS WE TRANSFORM ── */}
      <section className="ms-wt">
        <div className="container">

          {/* Header */}
          <div className="ms-wt__header">
            <span className="ms-wt__eyebrow">Materials We Transform</span>
            <h2 className="ms-wt__heading">
              From Waste To <em>High-Performance Materials</em>
            </h2>
            <p className="ms-wt__sub">
              We transform waste materials into innovative, high-performance products
              through advanced material science and engineering.
            </p>
          </div>

          {/* Tabs — full-width equal grid, no arrows */}
          <div className="ms-wt__tabs-wrap">
            {WASTE_TYPES.map((w, i) => (
              <button
                key={w.id}
                className={`ms-wt__tab${i === activeWaste ? ' ms-wt__tab--active' : ''}`}
                onClick={() => setActiveWaste(i)}
                onMouseEnter={() => setActiveWaste(i)}
              >
                <w.TabIcon size={17} aria-hidden="true" />
                {w.tab}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="ms-wt__panel">

            {/* Col 1 — info + stats */}
            <div className="ms-wt__info">
              <h3 className="ms-wt__info-title">{wt.title}</h3>
              <div className="ms-wt__info-rule" aria-hidden="true" />
              <p className="ms-wt__info-body">{wt.body}</p>
              <div className="ms-wt__info-tagline">
                <p className="ms-wt__info-tagline-head">{wt.tagline}</p>
                <p className="ms-wt__info-tagline-body">{wt.taglineBody}</p>
              </div>
              <div className="ms-wt__info-sources">
                <span className="ms-wt__info-sources-label">Sources</span>
                <ul className="ms-wt__info-sources-list">
                  {wt.sources.map(({ label }) => (
                    <li key={label} className="ms-wt__info-source-item">
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Col 2 — photo with mission overlay */}
            <div className="ms-wt__photo">
              <img
                key={wt.img}
                src={wt.img}
                alt={wt.title}
                className="ms-wt__photo-img"
                draggable="false"
                loading="lazy"
                decoding="async"
              />
              <div className="ms-wt__photo-overlay">
                <span className="ms-wt__photo-mission-label">Our Mission</span>
                <h3 className="ms-wt__photo-mission-title">{wt.mission.title}</h3>
                <p className="ms-wt__photo-mission-sub">{wt.mission.sub}</p>
              </div>
            </div>

            {/* Col 3 — products 2×2 */}
            <div className="ms-wt__right">
              <h4 className="ms-wt__products-heading">Products</h4>
              <div className="ms-wt__products-rule" aria-hidden="true" />
              <div className="ms-wt__products-grid">
                {wt.products.map(({ name, img }) => (
                  <div key={name} className="ms-wt__product-card">
                    <img src={img} alt={name} className="ms-wt__product-img" draggable="false" loading="lazy" decoding="async" />
                    <div className="ms-wt__product-info">
                      <p className="ms-wt__product-name">{name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── QUARTZ GRANULATION ── */}
      <section className="ms-qz">
        <div className="container">

          {/* Header */}
          <div className="ms-qz__header">
            <div>
              <span className="ms-qz__eyebrow">Material Innovation</span>
              <h2 className="ms-qz__heading">
                From Fine Quartz Dust<br />to <em>Engineered Granules</em>
              </h2>
            </div>
            <p className="ms-qz__lead">
              A controlled granulation process that converts ultra-fine quartz powder (&lt;150 µm) into
              stable, low-dust granules with a defined particle-size range for easier handling and
              potential industrial applications.
            </p>
          </div>

          {/* Before / after specimen */}
          <div className="ms-qz__transform">
            <div className="ms-qz__specimen">
              <img
                src="/starting material.png"
                alt="Ultra-fine quartz powder"
                className="ms-qz__specimen-art"
                draggable="false"
                loading="lazy"
                decoding="async"
              />
              <div className="ms-qz__specimen-tag">
                <span className="ms-qz__specimen-tag-label">Starting Material</span>
                <span className="ms-qz__specimen-tag-name">Ultra-fine Quartz Powder</span>
                <span className="ms-qz__specimen-tag-spec">&lt;150 µm</span>
              </div>
            </div>
            <span className="ms-qz__arrow" aria-hidden="true">
              <svg viewBox="0 0 64 32">
                <defs>
                  <linearGradient id="msArrow3dFace" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" style={{ stopColor: 'var(--lime)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--lime-deep)' }} />
                  </linearGradient>
                </defs>
                <path
                  className="ms-qz__arrow-body"
                  d="M3 12 H33 V3 L61 16 L33 29 V20 H3 Z"
                  fill="url(#msArrow3dFace)"
                />
                <path
                  className="ms-qz__arrow-shine"
                  d="M4 12.6 H33.6 L34.3 4 L58 16"
                />
              </svg>
            </span>
            <div className="ms-qz__specimen">
              <img
                src="/final product.png"
                alt="Engineered quartz granules"
                className="ms-qz__specimen-art"
                draggable="false"
                loading="lazy"
                decoding="async"
              />
              <div className="ms-qz__specimen-tag">
                <span className="ms-qz__specimen-tag-label">Final Product</span>
                <span className="ms-qz__specimen-tag-name">Engineered Quartz Granules</span>
                <span className="ms-qz__specimen-tag-spec">600–1000 µm</span>
              </div>
            </div>
          </div>

          {/* Part A / Part B — single frame, toggled */}
          <div className="ms-qz__frame" ref={qzFrameRef} id="granulation-process">
            {qzView === 'process' ? (
              <div key="process" className="ms-qz__view">
                <div className="ms-qz__part-head">
                  <h3 className="ms-qz__part-title">The Granulation Process</h3>
                </div>
                <p className="ms-qz__part-sub">From fine powder to engineered granules through controlled science and processing.</p>

                <div className="ms-qz__video">
                  <video
                    ref={qzVideoRef}
                    className="ms-qz__video-player"
                    src="/granulation video.mp4"
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                  />
                </div>

                <div className="ms-qz__nums" aria-hidden="true">
                  {QZ_STEPS.map(({ num }, i) => (
                    <div className="ms-qz__nums-cell" key={num}>
                      <span className="ms-qz__nums-num">{num}</span>
                      {i < QZ_STEPS.length - 1 && <ChevronRight size={16} className="ms-qz__nums-chevron" />}
                    </div>
                  ))}
                </div>

                <div className="ms-qz__flow">
                  {QZ_STEPS.map(({ num, img, tag, title, body }) => (
                    <div className="ms-qz__flow-step" key={num} style={{ backgroundImage: `url(${img})` }}>
                      <div className="ms-qz__flow-step-scrim" aria-hidden="true" />
                      <div className="ms-qz__flow-step-content">
                        <span className="ms-qz__flow-step-tag">{tag}</span>
                        <h4 className="ms-qz__flow-step-title">{title}</h4>
                        <p className="ms-qz__flow-step-body">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" className="ms-qz__cta-banner" onClick={() => setQzView('details')}>
                  Explore Process Details &amp; Results
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div key="details" className="ms-qz__view">
                <div className="ms-qz__part-head ms-qz__part-head--details">
                  <div>
                    <h3 className="ms-qz__part-title">Process Details &amp; Results</h3>
                  </div>
                  <button type="button" className="ms-qz__back-btn" onClick={() => setQzView('process')}>
                    <ArrowLeft size={15} aria-hidden="true" />
                    Back to Process
                  </button>
                </div>

                <div className="ms-qz__cards">

                  {/* Card 1 — Granule size & classification */}
                  <div className="ms-qz__card">
                    <span className="ms-qz__card-title">Granule Size &amp; Classification</span>
                    <img
                      src="/final product.png"
                      alt="Engineered quartz granules"
                      className="ms-qz__spec-photo"
                      draggable="false"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="ms-qz__spec-table">
                      {QZ_SPEC_ROWS.map(({ key, val }) => (
                        <div key={key} className="ms-qz__spec-row">
                          <span className="ms-qz__spec-key">{key}</span>
                          <span className="ms-qz__spec-val">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2 — Thermal behaviour */}
                  <div className="ms-qz__card">
                    <span className="ms-qz__card-title">Thermal Behaviour &amp; Additive Burn-Off</span>
                    <div className="ms-qz__checklist">
                      {QZ_CHECKLIST.map(item => (
                        <div key={item} className="ms-qz__check-item">
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="ms-qz__callout">
                      <div>
                        <div className="ms-qz__callout-title">Tested at 500°C</div>
                        <div className="ms-qz__callout-sub">No visible carbon residue</div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 — Process conditions */}
                  <div className="ms-qz__card">
                    <span className="ms-qz__card-title">Process Conditions</span>
                    <div className="ms-qz__tiles">
                      <div className="ms-qz__tile">
                        <div className="ms-qz__tile-value">120°C</div>
                        <div className="ms-qz__tile-label">Drying Temperature</div>
                      </div>
                      <div className="ms-qz__tile">
                        <div className="ms-qz__tile-value">1 Hour</div>
                        <div className="ms-qz__tile-label">Drying Duration</div>
                      </div>
                    </div>
                    <p className="ms-qz__insight"><b>TGA–DSC Insight —</b> additive decomposition occurs before any significant thermal change in the silica/quartz base material.</p>
                    <div className="ms-qz__chart">
                      <div className="ms-qz__chart-legend">
                        <span><i className="ms-qz__chart-dot--tga" />TGA</span>
                        <span><i className="ms-qz__chart-dot--dsc" />DSC</span>
                      </div>
                      <svg viewBox="0 0 260 90" width="100%" height="90" preserveAspectRatio="none" aria-label="TGA-DSC curve, additive mass loss between 250 and 400 degrees Celsius">
                        <line x1="0" y1="88" x2="260" y2="88" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                        <path d="M0,14 L100,15 C130,20 150,55 170,66 C200,76 230,79 260,80" fill="none" stroke="#9CC130" strokeWidth="2" />
                        <path d="M0,50 C90,50 110,50 135,20 C155,0 175,40 200,52 C225,60 245,58 260,58" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.6" strokeDasharray="3 3" />
                      </svg>
                      <div className="ms-qz__chart-axis">
                        <span>100°C</span><span>300°C</span><span>500°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4 — Post-treatment observations */}
                  <div className="ms-qz__card">
                    <span className="ms-qz__card-title">Post-Treatment Observations</span>
                    <div className="ms-qz__obs">
                      {QZ_OBSERVATIONS.map(({ key, val }) => (
                        <div key={key} className="ms-qz__obs-row">
                          <span className="ms-qz__obs-key">{key}</span>
                          <span className="ms-qz__obs-val">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ── RESEARCH APPROACH ── */}
      <section className="ms-ra">
        <div className="container">

          <div className="ms-ra__header">
            <h2 className="ms-ra__heading">
              Our <em>Research Approach</em>
            </h2>
            <p className="ms-ra__sub">
              We follow a structured, science-driven approach to transform complex waste into
              advanced, sustainable materials for real-world impact.
            </p>
          </div>

          <div className="ms-ra__grid">

            {/* ── LEFT — image ── */}
            <div className="ms-ra__visual">
              <img
                key={active.img}
                src={active.img}
                alt={active.title}
                className="ms-ra__visual-img"
                draggable="false"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
              <div className="ms-ra__visual-overlay" aria-hidden="true" />

              <div className="ms-ra__info-overlay">
                <h3 className="ms-ra__info-title">{active.title}</h3>
              </div>

            </div>

            {/* ── RIGHT — progress + accordion ── */}
            <div className="ms-ra__right">

              {/* Accordion */}
              <div className="ms-ra__accordion">
                {RESEARCH_STEPS.map(({ num, title, body, outputs }, i) => (
                  <div
                    key={num}
                    className={`ms-ra__acc-item${i === activeIdx ? ' ms-ra__acc-item--active' : ''}`}
                  >
                    {/* Circle + connecting line */}
                    <div className="ms-ra__acc-circle-col">
                      <div className="ms-ra__acc-circle">{num}</div>
                    </div>

                    {/* Content */}
                    <div className="ms-ra__acc-content">
                      <button
                        className="ms-ra__acc-header"
                        onClick={() => setActiveIdx(i)}
                        onMouseEnter={() => setActiveIdx(i)}
                      >
                        <span className="ms-ra__acc-title">{title}</span>
                        <ChevronDown
                          size={14}
                          className={`ms-ra__acc-chevron${i === activeIdx ? ' ms-ra__acc-chevron--open' : ''}`}
                          aria-hidden="true"
                        />
                      </button>

                      {i === activeIdx && (
                        <div className="ms-ra__acc-body">
                          <p className="ms-ra__acc-desc">{body}</p>
                          <div className="ms-ra__acc-outputs">
                            <span className="ms-ra__acc-out-label">Key Outputs</span>
                            <div className="ms-ra__acc-out-grid">
                              {outputs.map(({ label }) => (
                                <div className="ms-ra__acc-out-item" key={label}>
                                  <span>{label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── THE IMPACT WE CREATE ── */}
      <section className="ms-impact">

        {/* Two-column body */}
        <div className="ms-impact__body container">

          {/* ── LEFT ── */}
          <div className="ms-impact__left">
            <span className="ms-impact__eyebrow">The Impact</span>
            <h2 className="ms-impact__title">
              Powering Multiple<br />Industries,<br />
              <span>Creating Real Impact</span>
            </h2>
            <p className="ms-impact__subtitle">
              Our science-backed materials are designed to solve real-world challenges
              and deliver measurable impact across industries.
            </p>
            <ul className="ms-impact__stats">
              {IMPACT_STATS.map(({ Icon, value, title, body }) => (
                <li key={title} className="ms-impact__stat">
                  <div className="ms-impact__stat-icon"><Icon size={20} aria-hidden="true" /></div>
                  <div className="ms-impact__stat-content">
                    <div className="ms-impact__stat-head">
                      <span className="ms-impact__stat-value">{value}</span>
                      <strong className="ms-impact__stat-title">{title}</strong>
                    </div>
                    <p className="ms-impact__stat-body">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ── RIGHT — Orbit ── */}
          <div className="ms-impact__orbit-wrap">
            <div className="ms-impact__orbit" role="img" aria-label="Industry impact orbit diagram">

              {/* Dashed ring + dots */}
              <svg className="ms-impact__orbit-svg" viewBox="0 0 560 560" aria-hidden="true">
                <circle cx="280" cy="280" r="213"
                  fill="none"
                  stroke="rgba(156,193,48,0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="6 9"
                />
                {ORBIT_NODES.map(({ id, dotX, dotY }) => (
                  <circle key={id} cx={dotX} cy={dotY} r="5.5" fill="rgba(156,193,48,0.78)" />
                ))}
              </svg>

              {/* Center image */}
              <div className="ms-impact__orbit-center">
                <img src="/impact-ms.jpeg" alt="" draggable="false" loading="lazy" decoding="async" />
              </div>

              {/* Orbit cards */}
              {ORBIT_NODES.map(({ id, Icon, title, body }) => (
                <div key={id} className={`ms-impact__orbit-card ms-impact__orbit-card--${id}`}>
                  <div className="ms-impact__orbit-card-text">
                    <strong className="ms-impact__orbit-card-title">{title}</strong>
                    <p className="ms-impact__orbit-card-body">{body}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

        {/* ── BOTTOM BANNER ── */}
        <div className="ms-impact__banner">
          <div className="ms-impact__banner-brand">
            <div className="ms-impact__banner-brand-icon">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <div className="ms-impact__banner-brand-text">
              <strong>Sustainable by Design.</strong>
              <strong>Impact in Every Step.</strong>
            </div>
          </div>
          <div className="ms-impact__banner-checks">
            {BANNER_ITEMS.map(item => (
              <div key={item} className="ms-impact__banner-check">
                <CheckCircle size={15} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
