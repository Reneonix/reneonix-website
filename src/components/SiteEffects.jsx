import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Global JS behaviours:
 *  - Cursor glow (pointer devices only)
 *  - Parallax on [data-parallax]
 *  - Scroll-reveal (.reveal / .reveal-img / .stagger)
 *
 * Accepts `route` so the reveal + parallax effects re-run after
 * every hash navigation, picking up fresh DOM nodes.
 */
export default function SiteEffects({ route }) {
  const glowRef = useRef(null);

  /* ─────────────────────────────────────────────────────────────
     Cursor glow — pointer / hover devices only.
     Mounted once; never needs to re-run on route change.
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    const RADIUS = 28;
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx;
    let ty = cy;
    let rafId;
    let ready = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function loop() {
      cx = lerp(cx, tx, 0.14);
      cy = lerp(cy, ty, 0.14);
      glow.style.transform = `translate(${(cx - RADIUS).toFixed(1)}px, ${(cy - RADIUS).toFixed(1)}px)`;
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    const onMouseMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!ready) {
        ready = true;
        document.body.classList.add('cursor-ready');
      }
    };
    const onMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label'))
        document.body.classList.add('cursor-hover');
    };
    const onMouseOut = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label'))
        document.body.classList.remove('cursor-hover');
    };
    const onMouseDown = () => document.body.classList.add('cursor-down');
    const onMouseUp   = () => document.body.classList.remove('cursor-down');

    document.addEventListener('mousemove',  onMouseMove,  { passive: true });
    document.addEventListener('mouseover',  onMouseOver,  { passive: true });
    document.addEventListener('mouseout',   onMouseOut,   { passive: true });
    document.addEventListener('mousedown',  onMouseDown);
    document.addEventListener('mouseup',    onMouseUp);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove',  onMouseMove);
      document.removeEventListener('mouseover',  onMouseOver);
      document.removeEventListener('mouseout',   onMouseOut);
      document.removeEventListener('mousedown',  onMouseDown);
      document.removeEventListener('mouseup',    onMouseUp);
      document.body.classList.remove('cursor-ready', 'cursor-hover', 'cursor-down');
    };
  }, []);

  /* ─────────────────────────────────────────────────────────────
     Phase 1 — SYNCHRONOUS (before first paint).
     Add .reveal to home-specific elements, then immediately
     mark anything already in the viewport as .in so it is
     never invisible on first render.
     Re-runs on every route change to pick up fresh DOM nodes.
  ───────────────────────────────────────────────────────────── */
  useLayoutEffect(() => {
    const revealSelectors = [
      '.hero__copy > *',
      '.section-head > *',
      '.solutions__grid .card',
      '.testimonials__grid .quote',
      '.highlights__grid .highlight',
      '.about__values .value',
      '.cta-banner',
    ];

    // Stamp .reveal (+ stagger delays) onto home marketing elements
    revealSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        if (i < 3) el.classList.add('delay-' + (i + 1));
      });
    });

    // Immediately reveal every .reveal / .reveal-img / .stagger element
    // that is already inside the viewport — they must never flash invisible.
    const vh = window.innerHeight;
    document.querySelectorAll('.reveal, .reveal-img, .stagger').forEach((el) => {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < vh && bottom > 0) el.classList.add('in', 'is-in');
    });
  }, [route]);

  /* ─────────────────────────────────────────────────────────────
     Phase 2 — AFTER paint.
     Observe elements that are still below the fold and reveal
     them as they scroll into view.
     Re-runs on every route change to observe the new page's nodes.
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in', 'is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );

    // Only observe elements not yet revealed
    document
      .querySelectorAll('.reveal:not(.in), .reveal-img:not(.in), .stagger:not(.in)')
      .forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [route]);

  /* ─────────────────────────────────────────────────────────────
     Parallax — re-queries [data-parallax] nodes on every route
     change so stale references from the previous page don't linger.
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const parallaxNodes = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!parallaxNodes.length) return;

    let ticking = false;

    function applyParallax() {
      const y = window.scrollY;
      parallaxNodes.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${(-y * speed).toFixed(1)}px, 0)`;
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    applyParallax();

    return () => window.removeEventListener('scroll', onScroll);
  }, [route]);

  return <div className="cursor-glow" ref={glowRef} aria-hidden="true" />;
}
