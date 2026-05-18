import { useEffect, useRef } from 'react';

/**
 * Mounts the global JS behaviors that the original static site relied on:
 *  - Header dropdown click-to-open + outside-click-to-close
 *  - Mobile nav toggle
 *  - Parallax scroll on [data-parallax]
 *  - IntersectionObserver-driven .is-in for sections that need scroll reveal
 *
 * Each effect cleans up its listeners on unmount so React's StrictMode
 * double-invocation in dev does not leak handlers.
 */
export default function SiteEffects() {
  const glowRef = useRef(null);

  /* ---------- Cursor glow ---------- */
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    // Skip on touch / coarse-pointer devices
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    const RADIUS = 28; // half of 56px glow size
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
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        document.body.classList.add('cursor-hover');
      }
    };
    const onMouseOut = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        document.body.classList.remove('cursor-hover');
      }
    };
    const onMouseDown = () => document.body.classList.add('cursor-down');
    const onMouseUp   = () => document.body.classList.remove('cursor-down');

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout',  onMouseOut,  { passive: true });
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup',   onMouseUp);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout',  onMouseOut);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup',   onMouseUp);
      document.body.classList.remove('cursor-ready', 'cursor-hover', 'cursor-down');
    };
  }, []);

  useEffect(() => {
    /* Note: nav toggle + dropdowns are managed by React state in Header.jsx */

    /* ---------- Parallax ---------- */
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parallaxNodes = Array.from(document.querySelectorAll('[data-parallax]'));
    let ticking = false;
    function applyParallax() {
      const y = window.scrollY;
      parallaxNodes.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.bottom > -200 && rect.top < window.innerHeight + 200;
        if (!inView) return;
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${(-y * speed).toFixed(1)}px, 0)`;
      });
      ticking = false;
    }
    function onScroll() {
      if (!ticking && !reduceMotion) {
        window.requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }
    if (!reduceMotion) {
      window.addEventListener('scroll', onScroll, { passive: true });
      applyParallax();
    }

    /* ---------- Generic reveal-on-scroll for marketing decorations ---------- */
    const revealSelectors = [
      '.hero__copy > *',
      '.section-head > *',
      '.solutions__grid .card',
      '.testimonials__grid .quote',
      '.highlights__grid .highlight',
      '.about__values .value',
      '.cta-banner',
    ];
    revealSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        if (i < 3) el.classList.add('delay-' + (i + 1));
      });
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // `.reveal.in` and `.reveal-img.in` fade in via CSS.
            // `.stagger.in` triggers staggered child delays.
            // `.is-in` covers legacy section-level selectors.
            entry.target.classList.add('in', 'is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-img, .stagger').forEach((el) => io.observe(el));

    /* ---------- Cleanup ---------- */
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  return <div className="cursor-glow" ref={glowRef} aria-hidden="true" />;
}
