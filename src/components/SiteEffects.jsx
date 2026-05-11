import { useEffect } from 'react';

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
  useEffect(() => {
    /* ---------- Dropdowns ---------- */
    const buttons = Array.from(document.querySelectorAll('.has-dropdown > button'));
    const onBtnClick = (btn) => (e) => {
      e.stopPropagation();
      const parent = btn.parentElement;
      document.querySelectorAll('.has-dropdown.open').forEach((el) => {
        if (el !== parent) el.classList.remove('open');
      });
      parent.classList.toggle('open');
    };
    const handlers = buttons.map((btn) => {
      const h = onBtnClick(btn);
      btn.addEventListener('click', h);
      return [btn, h];
    });
    const closeAll = () => {
      document.querySelectorAll('.has-dropdown.open').forEach((el) => el.classList.remove('open'));
    };
    document.addEventListener('click', closeAll);

    /* ---------- Mobile nav ---------- */
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const onToggle = () => menu?.classList.toggle('open');
    const navLinks = Array.from(document.querySelectorAll('.nav__menu a'));
    const onNavLinkClick = () => menu?.classList.remove('open');
    toggle?.addEventListener('click', onToggle);
    navLinks.forEach((a) => a.addEventListener('click', onNavLinkClick));

    /* ---------- Parallax (kept for any element that still uses [data-parallax]) ---------- */
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
      if (!ticking && !reduceMotion && parallaxNodes.length > 0) {
        window.requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }
    if (!reduceMotion && parallaxNodes.length > 0) {
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
            // The original CSS uses `.reveal.in` to fade in, while section-level
            // selectors (.brands.is-in, .zz-row.is-in, .about__values .value.is-in)
            // use `.is-in`. Add BOTH so every existing CSS rule fires regardless.
            entry.target.classList.add('in', 'is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    /* ---------- Lime cursor glow ---------- */
    // Skip on touch devices and reduced-motion users.
    const isFinePointer =
      typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches;
    let glow = null;
    let glowRaf = null;
    let onCursorMove = null;
    let onCursorLeave = null;
    let onCursorEnter = null;
    let onCursorDown = null;
    let onCursorUp = null;
    const hoverEnterFns = [];
    const hoverLeaveFns = [];
    if (isFinePointer && !reduceMotion) {
      glow = document.createElement('div');
      glow.className = 'cursor-glow';
      document.body.appendChild(glow);

      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      let gx = mx;
      let gy = my;

      onCursorMove = (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!document.body.classList.contains('cursor-ready')) {
          document.body.classList.add('cursor-ready');
        }
      };
      onCursorLeave = () => document.body.classList.remove('cursor-ready');
      onCursorEnter = () => document.body.classList.add('cursor-ready');
      onCursorDown = () => document.body.classList.add('cursor-down');
      onCursorUp = () => document.body.classList.remove('cursor-down');

      window.addEventListener('mousemove', onCursorMove, { passive: true });
      document.addEventListener('mouseleave', onCursorLeave);
      document.addEventListener('mouseenter', onCursorEnter);
      window.addEventListener('mousedown', onCursorDown);
      window.addEventListener('mouseup', onCursorUp);

      const interactiveSel =
        'a, button, [role="button"], .has-dropdown > button, .nav__toggle, .marquee__item, .marquee__logo, .marquee__pill, .partner-tile, .highlight, .feature-card, .quote, .solution-slide';
      document.querySelectorAll(interactiveSel).forEach((el) => {
        const enter = () => document.body.classList.add('cursor-hover');
        const leave = () => document.body.classList.remove('cursor-hover');
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
        hoverEnterFns.push([el, enter]);
        hoverLeaveFns.push([el, leave]);
      });

      const tick = () => {
        // Smooth trailing glow — 0.18 ease per frame
        gx += (mx - gx) * 0.18;
        gy += (my - gy) * 0.18;
        glow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;
        glowRaf = requestAnimationFrame(tick);
      };
      glowRaf = requestAnimationFrame(tick);
    }

    /* ---------- Cleanup ---------- */
    return () => {
      handlers.forEach(([btn, h]) => btn.removeEventListener('click', h));
      document.removeEventListener('click', closeAll);
      toggle?.removeEventListener('click', onToggle);
      navLinks.forEach((a) => a.removeEventListener('click', onNavLinkClick));
      window.removeEventListener('scroll', onScroll);
      io.disconnect();

      if (glow) {
        if (glowRaf) cancelAnimationFrame(glowRaf);
        if (onCursorMove) window.removeEventListener('mousemove', onCursorMove);
        if (onCursorLeave) document.removeEventListener('mouseleave', onCursorLeave);
        if (onCursorEnter) document.removeEventListener('mouseenter', onCursorEnter);
        if (onCursorDown) window.removeEventListener('mousedown', onCursorDown);
        if (onCursorUp) window.removeEventListener('mouseup', onCursorUp);
        hoverEnterFns.forEach(([el, fn]) => el.removeEventListener('mouseenter', fn));
        hoverLeaveFns.forEach(([el, fn]) => el.removeEventListener('mouseleave', fn));
        if (glow.parentNode) glow.parentNode.removeChild(glow);
        document.body.classList.remove('cursor-ready', 'cursor-hover', 'cursor-down');
      }
    };
  }, []);

  return null;
}
