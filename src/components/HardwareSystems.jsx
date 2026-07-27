import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Cpu, Zap, Shield, ChevronRight, Camera, Activity, Wine, SlidersHorizontal, Upload } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { navClick } from '../utils/nav.js';
import './HardwareSystems.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Follow-the-Bottle × Vision HUD — journey data ── */
const JOURNEY_STEPS = [
  { num: '01', name: 'SCAN' },
  { num: '02', name: 'DETECT' },
  { num: '03', name: 'CLASSIFY' },
  { num: '04', name: 'SORT' },
  { num: '05', name: 'RECOVER' },
];
const JOURNEY_BOUNDS = [0, .20, .42, .62, .82, 1];
const JOURNEY_LOGS = [
  ['> cam02 online · 24fps', '> obj 04182 acquired — tracking', '> conveyor 0.42 m/s ▮'],
  ['> analysing spectra + surface', '> material: GLASS', '> colour: AMBER (98.7%) ✓'],
  ['> routing table queried', '> decision: LANE 2 · conf 98.7%', '> alternates released'],
  ['> ACT-2 armed → fired · 12 ms', '> trajectory locked', '> lane 2 entry confirmed ✓'],
  ['> impact registered · bin 2', '> purity 98% held ✓', '> obj 04182 → RECOVERED'],
];
const JOURNEY_SCALE = [1.14, 1.16, 1.10, 1.12, 1.05];
const JOURNEY_GRAY = '#D6DAD2';
const JOURNEY_AMBER = '#F2D49A';
const JOURNEY_TRACK_STATE = (zi, zt) => {
  if (zi === 0) return ['TRACKING · OBJ 04182', 'gray'];
  if (zi === 1) return zt < .55 ? ['ANALYSING · GLASS…', 'gray'] : ['AMBER GLASS · 98.7%', 'amber'];
  if (zi === 2) return ['→ ROUTE: LANE 2', 'amber'];
  if (zi === 3) return ['DIVERTING · ACT-2 ▮', 'amber'];
  return zt < .5 ? ['LANE 2 · ENTERING BIN', 'amber'] : ['SORTED ✓ · AMBER STREAM', 'amber'];
};
const JOURNEY_DESCS = [
  'High-speed cameras capture every bottle entering the system.',
  'AI detects object, captures features and brand elements.',
  'Real-time classification by color, material and brand.',
  'Precision actuators separate bottles into respective chutes.',
  'Sorted glass ready for recycling with maximum purity.',
];
const JOURNEY_TL_ICONS = [
  <Camera size={20} />,
  <Activity size={20} />,
  <Wine size={20} />,
  <SlidersHorizontal size={20} />,
  <Upload size={20} />,
];
export default function HardwareSystems() {

  /* ── Sorter: Follow-the-Bottle × Vision HUD ── */
  const sorterRunwayRef = useRef(null);
  const mobileSectionRef = useRef(null);

  /* ── Pre-init (useLayoutEffect — fires BEFORE the browser's first paint) ──
     Kills any ScrollTriggers that survived SPA nav or HMR and resets scroll
     to 0 so every pin calculation is measured from the top.              ── */
  useLayoutEffect(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());
    window.scrollTo(0, 0);
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  /* ── Intersection observer — scroll reveal ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('hw2-in'); io.unobserve(e.target); }
      }),
      { threshold: 0.05 }
    );
    const root = document.querySelector('.hw2-page');
    (root || document).querySelectorAll('.hw2-reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── Sorter engine — pure function of smoothed scroll progress (fully
     reversible), driven imperatively via refs for per-frame performance.
     .jh__stage is pinned by ScrollTrigger (position:fixed), not CSS
     `position: sticky` — an ancestor (.hw2-page) has overflow-x set without
     overflow-y, which per the CSS overflow spec forces overflow-y's computed
     value to `auto`, making it the nearest scrolling ancestor and breaking
     sticky's viewport-relative pinning.                                ── */
  useEffect(() => {
    const runwayEl = sorterRunwayRef.current;
    const cam = runwayEl?.querySelector('#hws-cam');
    const bottle = runwayEl?.querySelector('#hws-bottle');
    if (!runwayEl || !cam || !bottle || matchMedia('(max-width: 820px)').matches) return;

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const IMG_W = 1152, IMG_H = 922, ZONES = 5;
    const BOUNDS = JOURNEY_BOUNDS;

    const frame = cam.parentElement;
    const stage = runwayEl.querySelector('.jh__stage');
    const lens = runwayEl.querySelector('#hws-lens');
    const track = runwayEl.querySelector('#hws-track');
    const trackLbl = runwayEl.querySelector('#hws-trackLbl');
    const trackBr = runwayEl.querySelector('#hws-trackBrackets');
    const trackRect = runwayEl.querySelector('#hws-trackRect');
    const trackBg = runwayEl.querySelector('#hws-trackTagBg');
    const pctEl = runwayEl.querySelector('#hws-pct');
    const words = Array.from(runwayEl.querySelectorAll('.jh__word'));
    const descs = Array.from(runwayEl.querySelectorAll('.jh__desc'));
    const zonesG = [1, 2, 3, 4, 5].map(i => runwayEl.querySelector('#hws-z' + i));
    const segs = [1, 2, 3, 4, 5].map(i => runwayEl.querySelector('#hws-seg' + i));
    const ghosts = [1, 2, 3].map(i => runwayEl.querySelector('#hws-g' + i));
    const chips = [1, 2, 3, 4].map(i => runwayEl.querySelector('#hws-c' + i));
    const rippleG = runwayEl.querySelector('#hws-rippleG');
    const term = runwayEl.querySelector('#hws-term');
    const modeEl = runwayEl.querySelector('#hws-modeName');
    const stThr = runwayEl.querySelector('#hws-stThr');
    const stPur = runwayEl.querySelector('#hws-stPur');
    const stDet = runwayEl.querySelector('#hws-stDet');
    const clockEl = runwayEl.querySelector('#hws-clock');

    const segLen = segs.map(s => s.getTotalLength());
    segs.forEach((s, i) => { s.style.strokeDasharray = segLen[i]; s.style.strokeDashoffset = segLen[i]; });
    const ghostLen = ghosts.map(g => g.getTotalLength());
    ghosts.forEach((g, i) => { g.style.strokeDasharray = ghostLen[i] + ' ' + ghostLen[i]; g.style.strokeDashoffset = ghostLen[i]; });

    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const ramp = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeIO = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const easeIn = t => t * t * t;
    const backOut = t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
    const ZEASE = [t => t, easeIO, easeOut, easeIn, easeOut];

    const zoneAt = p => { for (let i = ZONES - 1; i >= 0; i--) if (p >= BOUNDS[i]) return Math.min(i, ZONES - 1); return 0; };
    const zoneAlpha = (i, p) => {
      const a = BOUNDS[i], b = BOUNDS[i + 1], f = .035;
      if (p <= a - f || p >= b + f) return 0;
      return Math.min(ramp(p, a - f, a + f), 1 - ramp(p, b - f, b + f));
    };

    let camW = 0, camH = 0;
    const measure = () => { const r = frame.getBoundingClientRect(); camW = r.width; camH = r.height; };
    measure();
    window.addEventListener('resize', measure);

    let typeTimer = null;
    const typeLogs = i => {
      clearInterval(typeTimer);
      term.innerHTML = '';
      const lines = JOURNEY_LOGS[i].slice();
      let li = 0, ci = 0, cur = null;
      typeTimer = setInterval(() => {
        if (li >= lines.length) { clearInterval(typeTimer); return; }
        if (!cur) {
          cur = document.createElement('div');
          cur.className = 'ln';
          term.appendChild(cur);
          while (term.children.length > 3) term.removeChild(term.firstChild);
        }
        ci += reduceMotion ? 999 : 2;
        cur.innerHTML = lines[li].slice(0, ci).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '<span class="caret"></span>';
        if (ci >= lines[li].length) { cur.textContent = lines[li]; li++; ci = 0; cur = null; }
      }, 24);
    };

    let lastLbl = '';
    let curZone = -1;

    const render = p => {
      p = clamp(p, 0, 1);
      const zi = zoneAt(p);
      const zt = ramp(p, BOUNDS[zi], BOUNDS[zi + 1]);
      const et = ZEASE[zi](zt);

      const pt = segs[zi].getPointAtLength(et * segLen[zi]);
      const squash = (zi === 4 && zt > .9) ? 1 - (zt - .9) * 2 : 1;
      bottle.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ') scale(1 ' + squash + ')');
      lens.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');

      track.style.opacity = ramp(p, .015, .05);
      track.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');
      const [lbl, colKey] = JOURNEY_TRACK_STATE(zi, zt);
      if (lbl !== lastLbl) {
        lastLbl = lbl;
        const textFill = colKey === 'gray' ? JOURNEY_GRAY : JOURNEY_AMBER;
        const strokeCol = colKey === 'gray' ? '#9aa096' : '#E0A83C';
        trackLbl.textContent = lbl;
        trackLbl.setAttribute('fill', textFill);
        trackBr.setAttribute('stroke', strokeCol);
        trackRect.setAttribute('stroke', strokeCol);
        trackBg.setAttribute('stroke', strokeCol);
      }

      segs.forEach((s, i) => { s.style.strokeDashoffset = i < zi ? 0 : i > zi ? segLen[i] : segLen[i] * (1 - et); });

      zonesG.forEach((g, i) => { g.style.opacity = zoneAlpha(i, p); });
      words.forEach((w, i) => {
        const a = zoneAlpha(i, p);
        w.style.opacity = a;
        w.style.transform = 'translateY(' + (1 - a) * 12 + 'px)';
      });
      descs.forEach((d, i) => { d.style.opacity = zoneAlpha(i, p); });

      const t3 = ramp(p, BOUNDS[2], BOUNDS[3]);
      const gDraw = easeOut(ramp(t3, .45, .8));
      const gFade = 1 - ramp(p, BOUNDS[3], BOUNDS[3] + .05);
      ghosts.forEach((g, i) => { g.style.strokeDashoffset = ghostLen[i] * (1 - gDraw); g.style.opacity = gFade; });

      const t5 = ramp(p, BOUNDS[4], 1);
      chips.forEach((c, i) => {
        const ct = ramp(t5, .30 + i * .07, .52 + i * .07);
        c.style.opacity = ct;
        c.style.transformBox = 'fill-box';
        c.style.transformOrigin = 'center';
        c.style.transform = 'scale(' + (.7 + .3 * backOut(ct)) + ')';
      });
      rippleG.style.opacity = ramp(t5, .82, .95);

      let fx = pt.x / IMG_W, fy = pt.y / IMG_H;
      const nz = Math.min(zi + 1, ZONES - 1);
      let sc = lerp(JOURNEY_SCALE[zi], JOURNEY_SCALE[nz], zt * zt * (3 - 2 * zt));
      if (zi === 4) { const w = ramp(t5, .25, .8); fx = lerp(fx, 770 / IMG_W, w); fy = lerp(fy, 480 / IMG_H, w); }
      if (reduceMotion) sc = 1;
      const mx = (sc - 1) * camW / 2, my = (sc - 1) * camH / 2;
      cam.style.transform = 'translate(' + clamp((.5 - fx) * camW * sc, -mx, mx) + 'px,' + clamp((.5 - fy) * camH * sc, -my, my) + 'px) scale(' + sc + ')';

      pctEl.textContent = Math.round(p * 100);
      stThr.textContent = Math.round(2400 * Math.min(p * 1.45, 1)).toLocaleString();
      stPur.textContent = p > .42 ? '98.0%' : '—';

      if (zi !== curZone) {
        curZone = zi;
        modeEl.textContent = JOURNEY_STEPS[zi].name;
        typeLogs(zi);
      }
    };

    let targetP = 0, P = -1;
    const tick = () => {
      const k = reduceMotion ? 1 : .16;
      if (Math.abs(targetP - P) > .00004) { P = P < 0 ? targetP : P + (targetP - P) * k; render(P); }
    };

    const st = ScrollTrigger.create({
      trigger: runwayEl,
      start: 'top top',
      end: 'bottom bottom',
      pin: stage,
      pinSpacing: false,
      onUpdate: self => { targetP = self.progress; },
    });
    gsap.ticker.add(tick);

    let t0 = 14 * 3600 + 2 * 60 + 11;
    const clockTimer = setInterval(() => {
      t0++;
      const h = String(Math.floor(t0 / 3600) % 24).padStart(2, '0');
      const m = String(Math.floor(t0 / 60) % 60).padStart(2, '0');
      const s = String(t0 % 60).padStart(2, '0');
      if (clockEl) clockEl.textContent = h + ':' + m + ':' + s;
    }, 1000);
    const detTimer = reduceMotion ? null : setInterval(() => {
      if (stDet) stDet.textContent = (99.2 + (Math.random() - .5) * .2).toFixed(1) + '%';
    }, 700);

    render(0);

    return () => {
      window.removeEventListener('resize', measure);
      clearInterval(typeTimer);
      clearInterval(clockTimer);
      if (detTimer) clearInterval(detTimer);
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  /* ── Mobile: sticky machine + sliding step card (≤820px) ──
     Same "own-container pin" trick as the desktop engine above (GSAP fixed
     pin, not CSS sticky — see note on .jh__stage). .hwm__machine (shot +
     card slot) is pinned for the whole runway; the invisible .hwm__step
     anchors below it are the only things that actually scroll, each one
     flipping which .hwm__card is showing (slides in from the right) and
     which zone of the tracking overlay is lit up, exactly mirroring the
     desktop per-zone HUD.                                                ── */
  useEffect(() => {
    const runwayEl = mobileSectionRef.current;
    if (!runwayEl || !matchMedia('(max-width: 820px)').matches) return;

    const machineEl = runwayEl.querySelector('.hwm__machine');
    const modeEl = runwayEl.querySelector('#hwm-modeName');
    const stepBadgeEl = runwayEl.querySelector('#hwm-stepbadge');
    const ghostEl = runwayEl.querySelector('#hwm-ghostword');
    const term = runwayEl.querySelector('#hwm-term');
    const stPur = runwayEl.querySelector('#hwm-stPur');
    const cards = Array.from(runwayEl.querySelectorAll('.hwm__card'));
    const steps = Array.from(runwayEl.querySelectorAll('.hwm__step'));
    if (!machineEl || !cards.length) return;

    /* .hwm__runway has no explicit height — it normally just sizes to its
       children's natural flow height (machine + steps). But once GSAP pins
       machineEl (switches it to position:fixed), machine stops contributing
       to that flow height, so the runway would shrink out from under
       ScrollTrigger's cached measurements, leaving a stretch of blank scroll
       near the end. Locking the height here (measured now, before any
       pinning happens) keeps it stable — the same reason desktop's
       .jh__runway uses a hardcoded height instead of auto-sizing. */
    runwayEl.style.height =
      (machineEl.getBoundingClientRect().height +
        steps.reduce((sum, el) => sum + el.getBoundingClientRect().height, 0)) + 'px';

    const zoneGroups = [1, 2, 3, 4, 5].map(i => runwayEl.querySelector('#hwm-z' + i));
    const segs = [1, 2, 3, 4, 5].map(i => runwayEl.querySelector('#hwm-seg' + i));
    const lens = runwayEl.querySelector('#hwm-lens');
    const track = runwayEl.querySelector('#hwm-track');
    const trackBrackets = runwayEl.querySelector('#hwm-trackBrackets');
    const trackTagBg = runwayEl.querySelector('#hwm-trackTagBg');
    const trackLbl = runwayEl.querySelector('#hwm-trackLbl');
    const hasOverlay = zoneGroups.every(Boolean) && segs.every(Boolean) && track;
    const segLen = hasOverlay ? segs.map(s => s.getTotalLength()) : [];
    if (hasOverlay) segs.forEach((s, i) => { s.style.strokeDasharray = segLen[i]; });

    const activate = active => {
      cards.forEach((c, i) => {
        c.classList.toggle('hwm__card--active', i === active);
        c.classList.toggle('hwm__card--prev', i < active);
      });
      if (modeEl) modeEl.textContent = JOURNEY_STEPS[active].name;
      if (stepBadgeEl) stepBadgeEl.textContent = 'STEP ' + JOURNEY_STEPS[active].num;
      if (ghostEl) ghostEl.textContent = JOURNEY_STEPS[active].name;
      if (term) term.innerHTML = JOURNEY_LOGS[active].map(l => '<div class="ln">' + l + '</div>').join('');
      if (stPur) stPur.textContent = active >= 2 ? '98.0%' : '—';
      if (!hasOverlay) return;

      zoneGroups.forEach((g, i) => { g.style.opacity = i === active ? 1 : 0; });
      segs.forEach((s, i) => { s.style.strokeDashoffset = i <= active ? 0 : segLen[i]; });

      const pt = segs[active].getPointAtLength(segLen[active] * 0.5);
      track.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');
      track.style.opacity = 1;
      if (lens) lens.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');
      const [lbl, colKey] = JOURNEY_TRACK_STATE(active, 1);
      const textFill = colKey === 'gray' ? JOURNEY_GRAY : JOURNEY_AMBER;
      const strokeCol = colKey === 'gray' ? '#9aa096' : '#E0A83C';
      trackLbl.textContent = lbl;
      trackLbl.setAttribute('fill', textFill);
      trackBrackets.setAttribute('stroke', strokeCol);
      trackTagBg.setAttribute('stroke', strokeCol);
    };
    activate(0);

    /* GSAP's pin captures the element's authored margin as its pinned
       offset, then zeroes the margin and drives position via transform —
       so putting the header-clearance in margin-top also shows as dead
       static space before the pin engages. Baking the same offset into
       the trigger's start point instead keeps the unpinned layout tight
       (machine sits right at the top of the section, no extra gap) while
       still landing the pin at the right spot below the fixed header. */
    const headerH = parseFloat(getComputedStyle(runwayEl).getPropertyValue('--hw-header-h')) || 0;
    const pin = ScrollTrigger.create({
      trigger: runwayEl,
      start: 'top top+=' + headerH,
      end: 'bottom bottom',
      pin: machineEl,
      pinSpacing: false,
      /* .hwm__machine is content-sized (not full-viewport) so the static,
         unpinned layout stays tight against .hwm__head — but that leaves
         a lot of unused space below the shot+card while it's actually
         pinned. Expanding it to fill the viewport and centering its
         content only while pin is active gets both: no dead gap before
         scrolling in, no dead gap while scrolling through.
         GSAP's own pin setup inlines a `height`/`max-height` on machineEl
         every scroll tick to keep it stable while fixed, which silently
         wins over the CSS class's height — a plain (non-!important) CSS
         rule loses to any inline style, GSAP's included. Re-asserting our
         own inline override every tick via onUpdate used to be how this
         was fought, but writing `.style.height` on every single scroll
         frame forces a synchronous layout reflow each time — on mobile
         that's exactly the kind of per-frame layout thrash that makes
         scrolling feel stuck/janky. `!important` on the CSS rule instead
         (see .hwm__machine--pinned in the stylesheet) beats a non-important
         inline style without needing any JS on the scroll path at all. */
      onToggle: self => {
        machineEl.classList.toggle('hwm__machine--pinned', self.isActive);
        if (!self.isActive) {
          machineEl.style.height = '';
          machineEl.style.maxHeight = '';
          machineEl.style.opacity = '';
          machineEl.style.transform = '';
        }
      },
      /* Fade + slightly shrink the machine out over just the final 10% of
         the pin's range, so it visually disappears *before* it ever reaches
         the fixed header on unpin — without this, the last stat box (whose
         box background is what makes it read as a "box" rather than bare
         text) scrolls out from underneath the header mid-frame, looking
         clipped/broken instead of like an intentional transition. Only
         opacity/transform here (never height, see the onToggle comment
         above) — those are compositor-only, so this doesn't reintroduce
         the per-frame layout cost that was fixed there. */
      onUpdate: self => {
        if (!self.isActive) return;
        const FADE_START = 0.9;
        const t = self.progress > FADE_START ? (self.progress - FADE_START) / (1 - FADE_START) : 0;
        machineEl.style.opacity = String(1 - t);
        machineEl.style.transform = t > 0 ? 'scale(' + (1 - t * 0.05) + ')' : '';
      },
    });

    const stepTriggers = steps.map((el, i) => ScrollTrigger.create({
      trigger: el,
      start: 'top 65%',
      end: 'bottom 65%',
      onToggle: self => { if (self.isActive) activate(i); },
    }));

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stThr = runwayEl.querySelector('#hwm-stThr');
    const stDet = runwayEl.querySelector('#hwm-stDet');
    let bottles = 0;
    const liveTimer = reduceMotion ? null : setInterval(() => {
      bottles += Math.round(Math.random() * 4);
      if (stThr) stThr.textContent = bottles.toLocaleString();
      if (stDet) stDet.textContent = (99.2 + (Math.random() - .5) * .2).toFixed(1) + '%';
    }, 700);

    return () => {
      pin.kill();
      stepTriggers.forEach(t => t.kill());
      if (liveTimer) clearInterval(liveTimer);
    };
  }, []);

  /* ── Post-init refresh so GSAP re-reads heights after images load ── */
  useEffect(() => {
    let t1, t2;
    const doRefresh = () =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => ScrollTrigger.refresh())
      );
    const imgs = Array.from(document.querySelectorAll('.hw2-page img'));
    const pending = imgs.filter(img => !img.complete);
    if (pending.length === 0) {
      doRefresh();
    } else {
      let resolved = 0;
      pending.forEach(img => {
        const cb = () => { if (++resolved === pending.length) doRefresh(); };
        img.addEventListener('load',  cb, { once: true });
        img.addEventListener('error', cb, { once: true });
      });
    }
    t1 = setTimeout(doRefresh, 300);
    t2 = setTimeout(doRefresh, 650);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="hw2-page">

      {/* ── HERO ── */}
      <section className="hw2-hero">
        <video
          className="hw2-hero__bg hw2-hero__bg--video"
          src="/hardware-hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="hw2-hero__overlay" aria-hidden="true" />
        <div className="container hw2-hero__container">
          <nav className="hw2-crumb" aria-label="Breadcrumb">
            <a href="/" onClick={navClick('/')}>Home</a>
            <ChevronRight size={14} aria-hidden="true" />
            <a href="/solutions" onClick={navClick('/solutions')}>Solutions</a>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="hw2-crumb__current">Hardware</span>
          </nav>
          <div className="hw2-hero__copy">
            <div className="hw2-hero__eyebrow">
              <span className="hw2-hero__eyebrow-text">Reneonix Hardware Systems</span>
            </div>
            <h1 className="hw2-hero__title">
              <em>Industrial vision<br />systems<br />for </em>material recovery
            </h1>
            <p className="hw2-hero__lead">
              AI-powered sorting, inspection and recovery machines - engineered for the throughput, precision and uptime that modern material processing facilities demand.
            </p>
          </div>
        </div>
      </section>

      {/* ── AI SORTING MODULE — Follow-the-Bottle × Vision HUD ── */}
      <section className="hw-sorter-section" id="hw-sorter" aria-label="Follow one bottle through the sorter, seen by the machine's tracking camera">
        <div className="jh__runway" ref={sorterRunwayRef}>
          <div className="jh__stage">

            <div className="jh__topbar" aria-hidden="true">
              <p className="jh__pct mono"><b id="hws-pct">0</b> % OF JOURNEY</p>
            </div>

            <div className="jh__hero">
              <div className="jh__hero-left">
                <div className="jh__hero-top">
                  <h2 className="jh__title">
                    First Commercial Grade,<br />
                    <em>Glass</em> Sorting System
                  </h2>
                  <p className="jh__subtitle">
                    Vision-based, non-destructive sorting with real-time classification and brand recognition – built for industrial environments.
                  </p>
                </div>

                <div className="jh__hero-copy">
                  <div className="jh__stepcard">
                    {JOURNEY_STEPS.map((s, i) => (
                      <div className="jh__desc" key={s.num}>
                        <span className="jh__stepcard-num">{s.num}</span>
                        <h3 className="jh__stepcard-title">{s.name}</h3>
                        <p className="jh__stepcard-body">{JOURNEY_DESCS[i]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            <div className="jh__frame">
              <div className="jh__cam" id="hws-cam">
                <img
                  src="/hardware-Sorter.jpg"
                  alt="Reneonix AI bottle sorting machine — live tracking view"
                  draggable="false"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
                <svg viewBox="0 0 1152 922" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <filter id="hws-glow" x="-60%" y="-60%" width="220%" height="220%">
                      <feGaussianBlur stdDeviation="2.8" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="hws-glowBig" x="-80%" y="-80%" width="260%" height="260%">
                      <feGaussianBlur stdDeviation="6" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <linearGradient id="hws-beamGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#B2DE3A" stopOpacity="0" />
                      <stop offset=".5" stopColor="#D9F58A" stopOpacity=".85" />
                      <stop offset="1" stopColor="#B2DE3A" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id="hws-ambient" cx="50%" cy="50%" r="50%">
                      <stop offset="0" stopColor="#B2DE3A" stopOpacity=".35" />
                      <stop offset="1" stopColor="#B2DE3A" stopOpacity="0" />
                    </radialGradient>
                    <clipPath id="hws-armClip"><polygon points="0,205 240,205 240,312 0,312" /></clipPath>
                  </defs>

                  {/* journey path — ghost + lit trail */}
                  <g stroke="rgba(125,178,0,.16)" strokeWidth="1.6" fill="none" strokeDasharray="2 7">
                    <path d="M18 248 L140 256 C165 260 182 262 195 264" />
                    <path d="M195 264 C250 262 310 248 388 232 C430 222 472 190 500 152" />
                    <path d="M500 152 L645 122" />
                    <path d="M645 122 C650 190 658 265 665 325" />
                    <path d="M665 325 C672 360 700 400 728 432" />
                  </g>
                  <g fill="none" stroke="var(--lime-deep)" strokeWidth="2.4" strokeLinecap="round" className="glow">
                    <path className="seg" id="hws-seg1" d="M18 248 L140 256 C165 260 182 262 195 264" />
                    <path className="seg" id="hws-seg2" d="M195 264 C250 262 310 248 388 232 C430 222 472 190 500 152" opacity=".5" />
                    <path className="seg" id="hws-seg3" d="M500 152 L645 122" />
                    <path className="seg" id="hws-seg4" d="M645 122 C650 190 658 265 665 325" />
                    <path className="seg" id="hws-seg5" d="M665 325 C672 360 700 400 728 432" />
                  </g>

                  {/* Z1 · SCAN */}
                  <g className="z" id="hws-z1">
                    <path d="M254 102 H476 Q490 102 490 116 V338 Q490 352 476 352 H254 Q240 352 240 338 V116 Q240 102 254 102 Z"
                      fill="none" stroke="rgba(178,222,58,.55)" strokeWidth="2" className="glow" />
                    <g clipPath="url(#hws-armClip)">
                      <g className="beamArm t"><rect x="0" y="202" width="28" height="112" fill="url(#hws-beamGrad)" /></g>
                    </g>
                    <line x1="240" y1="190" x2="240" y2="340" stroke="var(--lime)" strokeWidth="2.4" className="glow" />
                    <g transform="translate(240,264)">
                      <circle className="pulse t" r="14" fill="none" stroke="var(--lime)" strokeWidth="2" />
                      <circle className="pulse t d2" r="14" fill="none" stroke="var(--lime)" strokeWidth="1.6" />
                      <circle r="4.5" fill="var(--lime)" filter="url(#hws-glow)" />
                    </g>
                    <g stroke="var(--lime-deep)" strokeWidth="2" opacity=".8">
                      <line x1="55" y1="238" x2="55" y2="262" />
                      <line x1="105" y1="240" x2="105" y2="264" />
                      <line x1="155" y1="244" x2="155" y2="268" />
                    </g>
                  </g>

                  {/* Z2 · DETECT */}
                  <g className="z" id="hws-z2">
                    <path d="M254 102 H476 Q490 102 490 116 V338 Q490 352 476 352 H254 Q240 352 240 338 V116 Q240 102 254 102 Z"
                      fill="rgba(178,222,58,.06)" stroke="var(--lime)" strokeWidth="2.2" className="glow" />
                    <g fill="var(--lime)">
                      <circle className="gdot" cx="300" cy="200" r="2.8" style={{ animationDelay: '0s' }} />
                      <circle className="gdot" cx="300" cy="226" r="2.8" style={{ animationDelay: '.5s' }} />
                      <circle className="gdot" cx="322" cy="200" r="2.8" style={{ animationDelay: '.8s' }} />
                      <circle className="gdot" cx="322" cy="226" r="2.8" style={{ animationDelay: '.25s' }} />
                      <circle className="gdot" cx="344" cy="200" r="2.8" style={{ animationDelay: '.6s' }} />
                      <circle className="gdot" cx="344" cy="226" r="2.8" style={{ animationDelay: '1s' }} />
                    </g>
                    <g id="hws-lens">
                      <circle r="40" fill="rgba(178,222,58,.07)" stroke="var(--lime)" strokeWidth="1.8" className="glow" />
                      <circle className="spinRing t" r="48" fill="none" stroke="var(--lime)" strokeWidth="1.2" strokeDasharray="5 8" opacity=".8" />
                      <line x1="-54" y1="0" x2="-40" y2="0" stroke="var(--lime)" strokeWidth="1.6" />
                      <line x1="40" y1="0" x2="54" y2="0" stroke="var(--lime)" strokeWidth="1.6" />
                      <line x1="0" y1="-54" x2="0" y2="-40" stroke="var(--lime)" strokeWidth="1.6" />
                      <line x1="0" y1="40" x2="0" y2="54" stroke="var(--lime)" strokeWidth="1.6" />
                    </g>
                  </g>

                  {/* Z3 · CLASSIFY */}
                  <g className="z" id="hws-z3">
                    <rect className="breathing" x="500" y="126" width="520" height="14" rx="7" fill="rgba(178,222,58,.09)" stroke="rgba(178,222,58,.5)" strokeWidth="1" transform="rotate(-7 760 133)" />
                    <circle className="nblink t" cx="525" cy="138" r="5" fill="var(--lime)" filter="url(#hws-glow)" />
                    <circle className="nblink t n2" cx="645" cy="122" r="5" fill="var(--lime)" filter="url(#hws-glow)" />
                    <circle className="nblink t n3" cx="785" cy="105" r="5" fill="var(--lime)" filter="url(#hws-glow)" />
                    <circle className="nblink t n4" cx="945" cy="90" r="5" fill="var(--lime)" filter="url(#hws-glow)" />
                    <g fill="none" stroke="rgba(125,178,0,.5)" strokeWidth="1.8" strokeDasharray="7 6">
                      <path className="ghost" id="hws-g1" d="M645 122 L525 138 C530 210 535 290 540 350" />
                      <path className="ghost" id="hws-g2" d="M645 122 L785 105 C790 175 795 245 800 310" />
                      <path className="ghost" id="hws-g3" d="M645 122 L945 90 C950 160 952 230 955 295" />
                    </g>
                    <g transform="translate(645,122)">
                      <circle className="pulse t" r="13" fill="none" stroke="var(--lime)" strokeWidth="2" />
                      <circle r="5.5" fill="var(--lime)" filter="url(#hws-glowBig)" />
                    </g>
                  </g>

                  {/* Z4 · SORT */}
                  <g className="z" id="hws-z4">
                    <circle className="actFlash t" cx="655" cy="200" r="24" fill="rgba(178,222,58,.35)" filter="url(#hws-glowBig)" />
                    <path d="M592 152 L702 144 L708 256 L598 264 Z" fill="none" stroke="rgba(178,222,58,.6)" strokeWidth="1.8" className="glow" />
                    <ellipse cx="665" cy="327" rx="42" ry="12" fill="rgba(178,222,58,.16)" stroke="var(--lime-deep)" strokeWidth="1.8" className="glow breathing" transform="rotate(-10 665 327)" />
                  </g>

                  {/* Z5 · RECOVER */}
                  <g className="z" id="hws-z5">
                    <ellipse className="breathing" cx="770" cy="760" rx="420" ry="60" fill="url(#hws-ambient)" />
                    <path d="M408 418 L614 366 L674 700 L492 752 Z" fill="none" stroke="var(--lime-deep)" strokeWidth="2.2" className="glow" />
                    <path d="M614 366 L798 324 L836 652 L676 716 Z" fill="rgba(224,168,60,.07)" stroke="var(--amber)" strokeWidth="2.6" className="glow" />
                    <path d="M798 324 L958 294 L978 606 L842 662 Z" fill="none" stroke="var(--lime-deep)" strokeWidth="2.2" className="glow" />
                    <path d="M958 294 L1128 268 L1122 565 L980 608 Z" fill="none" stroke="var(--lime-deep)" strokeWidth="2.2" className="glow" />
                    <g id="hws-rippleG" transform="translate(728,432)">
                      <ellipse className="ripple t" rx="30" ry="11" fill="none" stroke="var(--lime)" strokeWidth="2.4" />
                      <ellipse className="ripple t d2" rx="30" ry="11" fill="none" stroke="var(--lime)" strokeWidth="1.8" />
                    </g>
                    <g className="chip mono" id="hws-c1"><rect x="458" y="306" width="144" height="28" rx="14" fill="rgba(8,10,8,.82)" stroke="rgba(178,222,58,.55)" /><text x="530" y="325" textAnchor="middle" fontSize="12" letterSpacing="2" fill="var(--lime-soft)">✓ 99% PURITY</text></g>
                    <g className="chip mono" id="hws-c2"><rect x="634" y="267" width="144" height="28" rx="14" fill="rgba(8,10,8,.82)" stroke="rgba(224,168,60,.7)" /><text x="706" y="286" textAnchor="middle" fontSize="12" letterSpacing="2" fill="#F2D49A">✓ 98% PURITY</text></g>
                    <g className="chip mono" id="hws-c3"><rect x="806" y="237" width="144" height="28" rx="14" fill="rgba(8,10,8,.82)" stroke="rgba(178,222,58,.55)" /><text x="878" y="256" textAnchor="middle" fontSize="12" letterSpacing="2" fill="var(--lime-soft)">✓ 98% PURITY</text></g>
                    <g className="chip mono" id="hws-c4"><rect x="971" y="211" width="144" height="28" rx="14" fill="rgba(8,10,8,.82)" stroke="rgba(178,222,58,.55)" /><text x="1043" y="230" textAnchor="middle" fontSize="12" letterSpacing="2" fill="var(--lime-soft)">✓ 97% PURITY</text></g>
                    <g fill="#9CC130">
                      <circle className="spark t" cx="500" cy="430" r="2.6" />
                      <circle className="spark t s2" cx="620" cy="390" r="2.4" />
                      <circle className="spark t s3" cx="760" cy="350" r="2.6" />
                      <circle className="spark t s4" cx="900" cy="320" r="2.4" />
                      <circle className="spark t s5" cx="1040" cy="300" r="2.6" />
                    </g>
                  </g>

                  {/* the bottle + machine tracking box */}
                  <g id="hws-bottle">
                    <circle r="14" fill="rgba(178,222,58,.25)" filter="url(#hws-glowBig)" />
                    <circle r="9" fill="none" stroke="var(--lime)" strokeWidth="1.5" opacity=".9" />
                    <circle r="5" fill="#EDFFC2" />
                    <circle r="2" fill="#ffffff" />
                  </g>
                  <g id="hws-track" opacity="0">
                    <rect x="-27" y="-27" width="54" height="54" fill="none" strokeWidth="1" opacity=".3" id="hws-trackRect" />
                    <path id="hws-trackBrackets" d="M-27 -13 V-27 H-13 M13 -27 H27 V-13 M27 13 V27 H13 M-13 27 H-27 V13"
                      fill="none" strokeWidth="2.2" className="glow" />
                    <rect id="hws-trackTagBg" x="-86" y="-56" width="172" height="21" rx="4" fill="rgba(6,8,6,.85)" strokeOpacity=".6" />
                    <text id="hws-trackLbl" y="-41" textAnchor="middle" fontSize="11.5" letterSpacing="1"></text>
                  </g>
                </svg>
              </div>

              {/* giant step typography */}
              <div className="jh__words" aria-hidden="true">
                {JOURNEY_STEPS.map((s, i) => (
                  <div className={`jh__word jh__word--${i + 1}`} key={s.num}>
                    <span className="tag">STEP {s.num}</span>
                    <div className="big">{s.name}</div>
                  </div>
                ))}
              </div>

              {/* HUD chrome */}
              <div className="jh__scanlines" aria-hidden="true" />
              <div className="jh__band" aria-hidden="true" />
              <span className="jh__corner jh__corner--tl" aria-hidden="true" />
              <span className="jh__corner jh__corner--tr" aria-hidden="true" />
              <span className="jh__corner jh__corner--bl" aria-hidden="true" />
              <span className="jh__corner jh__corner--br" aria-hidden="true" />
              <div className="jh__status mono">
                <span className="jh__rec"><i /> REC · CAM-02 · SORTLINE A</span>
                <span className="jh__mode">MODE: <b id="hws-modeName">SCAN</b></span>
                <span><span id="hws-clock">14:02:11</span> · 24 FPS</span>
              </div>
              <div className="jh__term mono" id="hws-term" aria-live="polite" />
              <div className="jh__tele mono" aria-hidden="true">
                <div className="jh__stat"><b id="hws-stThr">0</b><span>BOTTLES / HR</span></div>
                <div className="jh__stat"><b id="hws-stDet">99.2%</b><span>DETECTION</span></div>
                <div className="jh__stat"><b id="hws-stPur">—</b><span>AVG PURITY</span></div>
              </div>
            </div>
            </div>

          </div>
        </div>

        {/* ── MOBILE: sticky machine (heading + shot + sliding card) (≤820px) ── */}
        <div className="hwm">
          <div className="hwm__runway" ref={mobileSectionRef}>
          <div className="hwm__machine">
          <div className="hwm__head">
            <span className="hwm__badge">Commercial Grade Innovation</span>
            <h2 className="hwm__title">
              First Commercial Grade,<br />
              <em>Glass</em> Sorting System
            </h2>
            <p className="hwm__subtitle">
              Vision-based, non-destructive sorting with real-time classification and brand recognition – built for industrial environments.
            </p>
          </div>
          <div className="hwm__shot">
            <img
              src="/hardware-Sorter.jpg"
              alt="Reneonix AI bottle sorting machine — live tracking view"
              draggable="false"
              loading="lazy"
              decoding="async"
            />

            {/* tracking overlay — same graphics as desktop's per-zone HUD,
                reused verbatim (same viewBox/coords, same image), just
                driven by the active step index (from the scroll-anchor
                triggers below) instead of a continuous scroll fraction. */}
            <svg viewBox="0 0 1152 922" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <filter id="hwm-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="2.8" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="hwm-glowBig" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="hwm-beamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#B2DE3A" stopOpacity="0" />
                  <stop offset=".5" stopColor="#D9F58A" stopOpacity=".85" />
                  <stop offset="1" stopColor="#B2DE3A" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="hwm-ambient" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#B2DE3A" stopOpacity=".35" />
                  <stop offset="1" stopColor="#B2DE3A" stopOpacity="0" />
                </radialGradient>
                <clipPath id="hwm-armClip"><polygon points="0,205 240,205 240,312 0,312" /></clipPath>
              </defs>

              <g stroke="rgba(125,178,0,.16)" strokeWidth="1.6" fill="none" strokeDasharray="2 7">
                <path d="M18 248 L140 256 C165 260 182 262 195 264" />
                <path d="M195 264 C250 262 310 248 388 232 C430 222 472 190 500 152" />
                <path d="M500 152 L645 122" />
                <path d="M645 122 C650 190 658 265 665 325" />
                <path d="M665 325 C672 360 700 400 728 432" />
              </g>
              <g fill="none" stroke="var(--lime-deep)" strokeWidth="2.4" strokeLinecap="round" className="glow">
                <path className="seg" id="hwm-seg1" d="M18 248 L140 256 C165 260 182 262 195 264" />
                <path className="seg" id="hwm-seg2" d="M195 264 C250 262 310 248 388 232 C430 222 472 190 500 152" />
                <path className="seg" id="hwm-seg3" d="M500 152 L645 122" />
                <path className="seg" id="hwm-seg4" d="M645 122 C650 190 658 265 665 325" />
                <path className="seg" id="hwm-seg5" d="M665 325 C672 360 700 400 728 432" />
              </g>

              {/* Z1 · SCAN */}
              <g className="z" id="hwm-z1">
                <path d="M254 102 H476 Q490 102 490 116 V338 Q490 352 476 352 H254 Q240 352 240 338 V116 Q240 102 254 102 Z"
                  fill="none" stroke="rgba(178,222,58,.55)" strokeWidth="2" className="glow" />
                <g clipPath="url(#hwm-armClip)">
                  <g className="beamArm t"><rect x="0" y="202" width="28" height="112" fill="url(#hwm-beamGrad)" /></g>
                </g>
                <line x1="240" y1="190" x2="240" y2="340" stroke="var(--lime)" strokeWidth="2.4" className="glow" />
                <g transform="translate(240,264)">
                  <circle className="pulse t" r="14" fill="none" stroke="var(--lime)" strokeWidth="2" />
                  <circle className="pulse t d2" r="14" fill="none" stroke="var(--lime)" strokeWidth="1.6" />
                  <circle r="4.5" fill="var(--lime)" filter="url(#hwm-glow)" />
                </g>
              </g>

              {/* Z2 · DETECT */}
              <g className="z" id="hwm-z2">
                <path d="M254 102 H476 Q490 102 490 116 V338 Q490 352 476 352 H254 Q240 352 240 338 V116 Q240 102 254 102 Z"
                  fill="rgba(178,222,58,.06)" stroke="var(--lime)" strokeWidth="2.2" className="glow" />
                <g id="hwm-lens">
                  <circle r="40" fill="rgba(178,222,58,.07)" stroke="var(--lime)" strokeWidth="1.8" className="glow" />
                  <circle className="spinRing t" r="48" fill="none" stroke="var(--lime)" strokeWidth="1.2" strokeDasharray="5 8" opacity=".8" />
                  <line x1="-54" y1="0" x2="-40" y2="0" stroke="var(--lime)" strokeWidth="1.6" />
                  <line x1="40" y1="0" x2="54" y2="0" stroke="var(--lime)" strokeWidth="1.6" />
                  <line x1="0" y1="-54" x2="0" y2="-40" stroke="var(--lime)" strokeWidth="1.6" />
                  <line x1="0" y1="40" x2="0" y2="54" stroke="var(--lime)" strokeWidth="1.6" />
                </g>
              </g>

              {/* Z3 · CLASSIFY */}
              <g className="z" id="hwm-z3">
                <rect className="breathing" x="500" y="126" width="520" height="14" rx="7" fill="rgba(178,222,58,.09)" stroke="rgba(178,222,58,.5)" strokeWidth="1" transform="rotate(-7 760 133)" />
                <circle className="nblink t" cx="525" cy="138" r="5" fill="var(--lime)" filter="url(#hwm-glow)" />
                <circle className="nblink t n2" cx="645" cy="122" r="5" fill="var(--lime)" filter="url(#hwm-glow)" />
                <g transform="translate(645,122)">
                  <circle className="pulse t" r="13" fill="none" stroke="var(--lime)" strokeWidth="2" />
                  <circle r="5.5" fill="var(--lime)" filter="url(#hwm-glowBig)" />
                </g>
              </g>

              {/* Z4 · SORT */}
              <g className="z" id="hwm-z4">
                <circle className="actFlash t" cx="655" cy="200" r="24" fill="rgba(178,222,58,.35)" filter="url(#hwm-glowBig)" />
                <path d="M592 152 L702 144 L708 256 L598 264 Z" fill="none" stroke="rgba(178,222,58,.6)" strokeWidth="1.8" className="glow" />
                <ellipse cx="665" cy="327" rx="42" ry="12" fill="rgba(178,222,58,.16)" stroke="var(--lime-deep)" strokeWidth="1.8" className="glow breathing" transform="rotate(-10 665 327)" />
              </g>

              {/* Z5 · RECOVER */}
              <g className="z" id="hwm-z5">
                <ellipse className="breathing" cx="770" cy="760" rx="420" ry="60" fill="url(#hwm-ambient)" />
                <path d="M408 418 L614 366 L674 700 L492 752 Z" fill="none" stroke="var(--lime-deep)" strokeWidth="2.2" className="glow" />
                <path d="M614 366 L798 324 L836 652 L676 716 Z" fill="rgba(224,168,60,.07)" stroke="var(--amber)" strokeWidth="2.6" className="glow" />
                <g id="hwm-rippleG" transform="translate(728,432)">
                  <ellipse className="ripple t" rx="30" ry="11" fill="none" stroke="var(--lime)" strokeWidth="2.4" />
                  <ellipse className="ripple t d2" rx="30" ry="11" fill="none" stroke="var(--lime)" strokeWidth="1.8" />
                </g>
                <g className="chip mono" id="hwm-c1"><rect x="458" y="306" width="144" height="28" rx="14" fill="rgba(8,10,8,.82)" stroke="rgba(178,222,58,.55)" /><text x="530" y="325" textAnchor="middle" fontSize="12" letterSpacing="2" fill="var(--lime-soft)">✓ 99% PURITY</text></g>
              </g>

              {/* tracking box that jumps to the active zone's position */}
              <g id="hwm-track" opacity="0">
                <path id="hwm-trackBrackets" d="M-27 -13 V-27 H-13 M13 -27 H27 V-13 M27 13 V27 H13 M-13 27 H-27 V13"
                  fill="none" strokeWidth="2.2" className="glow" />
                <rect id="hwm-trackTagBg" x="-72" y="-50" width="144" height="20" rx="4" fill="rgba(6,8,6,.85)" strokeOpacity=".6" />
                <text id="hwm-trackLbl" y="-36" textAnchor="middle" fontSize="10.5" letterSpacing="1"></text>
              </g>
            </svg>

            <div className="jh__scanlines" aria-hidden="true" />
            <div className="jh__band" aria-hidden="true" />
            <div className="hwm__ghostword" id="hwm-ghostword" aria-hidden="true">SCAN</div>
            <div className="hwm__status mono">
              <span className="hwm__rec"><i /> REC · CAM-02 · SORTLINE A</span>
              <span className="hwm__mode">MODE: <b id="hwm-modeName">SCAN</b></span>
            </div>
            <span className="hwm__stepbadge" id="hwm-stepbadge">STEP 01</span>
            <div className="hwm__term mono" id="hwm-term" aria-live="polite" />
            <div className="hwm__tele mono" aria-hidden="true">
              <div className="hwm__stat"><b id="hwm-stThr">0</b><span>BOTTLES / HR</span></div>
              <div className="hwm__stat"><b id="hwm-stDet">99.2%</b><span>DETECTION</span></div>
              <div className="hwm__stat"><b id="hwm-stPur">—</b><span>AVG PURITY</span></div>
            </div>
          </div>

          <div className="hwm__cardslot">
            {JOURNEY_STEPS.map((s, i) => (
              <div className="hwm__card" key={s.num}>
                <span className="hwm__tl-icon">{JOURNEY_TL_ICONS[i]}</span>
                <div className="hwm__tl-body">
                  <span className="hwm__tl-num">{s.num}</span>
                  <h3 className="hwm__tl-name">{s.name}</h3>
                  <p className="hwm__tl-desc">{JOURNEY_DESCS[i]}</p>
                </div>
                <span className="hwm__tl-arrow" aria-hidden="true"><ChevronRight size={16} /></span>
              </div>
            ))}
          </div>
          </div>

          {/* invisible scroll anchors — one per step, drive which card + zone overlay is active */}
          <div className="hwm__steps" aria-hidden="true">
            {JOURNEY_STEPS.map((s) => (
              <div className="hwm__step" key={s.num} />
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ── VISIONBOX — AI Inspection ── */}
      <section className="hw-vb-section">
        <picture>
          <source media="(max-width: 768px)" srcSet="/hardware-inspection-mobile.png" />
          <img
            className="hw-vb__bg"
            src="/hardware-inspection-box.png"
            alt="VisionBox AI Inspection System"
            draggable="false"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="hw-vb__overlay" aria-hidden="true" />
        <div className="container hw-vb__container">
          <div className="hw-vb__copy">
            <h2 className="hw-vb__title">
              AI-Powered Quality Inspection<br />
              <em>For Any Material,<br />Any Industry</em>
            </h2>
            <p className="hw-vb__body">
              VisionBox is an advanced AI inspection system designed for real-time defect
              detection and classification - built for glass, ready for{' '}
              <span className="hw-vb__body-lime">any material</span>
            </p>
            <div className="hw-vb__cols">
              {[
                { icon: <Cpu size={22} />,    title: 'Intelligent', body: 'Deep learning models for accurate defect detection' },
                { icon: <Zap size={22} />,    title: 'Real-Time',   body: 'High-speed inspection with instant results' },
                { icon: <Shield size={22} />, title: 'Versatile',   body: 'Optimized for glass, adaptable to any material or surface' },
              ].map(({ icon, title, body }) => (
                <div className="hw-vb__col" key={title}>
                  <div className="hw-vb__col-icon">{icon}</div>
                  <p className="hw-vb__col-title">{title}</p>
                  <p className="hw-vb__col-body">{body}</p>
                </div>
              ))}
            </div>
            <p className="hw-vb__built">
              <span className="hw-vb__built-lime">Built for Glass,</span>{' '}
              Designed for Every Material
            </p>
          </div>
        </div>
      </section>

      {/* ── MRM ── */}
      <section className="hw-mrm-section" id="hw-mrm">
        <div className="container hw-mrm__top">
          <div className="hw-mrm__left-col">
            <h2 className="hw-mrm__title">MRM (AI) <em>Material</em><br />Recovery Machine</h2>
            <p className="hw-mrm__subtitle">Modular Front-End Recovery System</p>
            <p className="hw-mrm__body">
              MRM (AI) is a modular front-end recovery system that accepts post-consumer materials
              at the source. It uses advanced computer vision and sensors to identify, grade, and
              separate materials in real time – maximising reuse and ensuring high-purity recycling.
            </p>
            <p className="hw-mrm__caps-label">What the Machine Does</p>
            <div className="hw-mrm__caps-grid">
              {[
                { title: 'Identify',  desc: 'Real-time material recognition using AI vision.' },
                { title: 'Classify',  desc: 'Determines material quality and recovery path.' },
                { title: 'Separate',  desc: 'Routes materials into optimized output streams.' },
                { title: 'Track',     desc: 'Logs every deposit and material movement digitally.' },
              ].map(({ title, desc }) => (
                <div className="hw-mrm__cap-tile" key={title}>
                  <p className="hw-mrm__cap-tile-title">{title}</p>
                  <p className="hw-mrm__cap-tile-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hw-mrm__img-placeholder">
            <img
              src="/hardware-MRM.png"
              alt="MRM AI Material Recovery Machine"
              className="hw-mrm__machine-img"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
