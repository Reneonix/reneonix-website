import { useEffect, useLayoutEffect } from 'react';

/* Hero sections sized to ~viewport height (min-height/height ~= 100vh minus
   the fixed header) — these are the ones where a normal wheel notch or
   trackpad flick doesn't carry far enough to reach the next section in one
   gesture. Shorter, content-hugging heroes (Home, Careers, Solutions,
   Policy, Contact) aren't included since they don't exhibit that problem
   and shouldn't have their scroll behaviour touched. */
const TALL_HERO_SELECTORS = [
  '.hw2-hero', '.sw-hero', '.ms-hero', '.inv-hero',
  '.gm-hero', '.ro-hero', '.bf-hero', '.mm-hero', '.mg-hero', '.ind-hero',
  '.tos-hero', '.rr-hero', '.fg-hero', '.avs-hero', '.ba-hero', '.bp-hero',
].join(',');

/**
 * Global JS behaviours:
 *  - Parallax on [data-parallax]
 *  - Scroll-reveal (.reveal / .reveal-img / .stagger)
 *  - Hero scroll assist (see bindHeroScrollAssist below)
 *
 * Accepts `route` so the reveal + parallax effects re-run after
 * every hash navigation, picking up fresh DOM nodes.
 *
 * The cursor-follow spotlight glow that used to live here was removed —
 * superseded by the SplashCursor WebGL fluid effect mounted in App.jsx.
 */
export default function SiteEffects({ route }) {
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

  /* ─────────────────────────────────────────────────────────────
     Hero scroll assist — one full-height Hero section per page was
     requiring 3-4 scroll gestures to get past (the section is simply
     taller than a single wheel notch/trackpad flick). Rather than
     shrinking the Hero (changes its design) this completes the
     Hero -> next-section transition on the first deliberate downward
     gesture, exactly like the manual "Scroll" cue already printed on
     some of these heroes, just without requiring the user to find and
     click it. Entirely position-based (no "already used" flag): it
     only ever acts while window.scrollY is still inside the Hero, so
     it's automatically inert everywhere else on the page and re-arms
     on its own if the user scrolls back up into the Hero.
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    // Most pages are React.lazy-loaded, so their DOM (including the Hero)
    // may not exist yet on the tick this effect first runs after a route
    // change — same race the page-local reveal effects elsewhere work
    // around. Some of these page bundles (e.g. HardwareSystems, with its
    // large inline SVG scene) are slow to fetch/parse on first visit, so
    // this polls generously (10s) rather than giving up after a beat.
    let cleanup;
    let attempts = 0;
    const findHero = setInterval(() => {
      attempts++;
      const heroEl = document.querySelector(TALL_HERO_SELECTORS);
      const nextEl = heroEl?.nextElementSibling;
      if (heroEl && nextEl) {
        clearInterval(findHero);
        cleanup = bindHeroScrollAssist(heroEl, nextEl);
      } else if (attempts > 100) {
        clearInterval(findHero);
      }
    }, 100);

    return () => {
      clearInterval(findHero);
      cleanup?.();
    };
  }, [route]);

  return null;
}

function bindHeroScrollAssist(heroEl, nextEl) {
  let triggered = false;
  let cooldown;

  const insideHero = () => window.scrollY < heroEl.offsetHeight - 40;

  const goToNext = () => {
    triggered = true;
    const headerH = document.querySelector('header')?.offsetHeight || 0;
    const targetY = Math.max(0, nextEl.getBoundingClientRect().top + window.scrollY - headerH);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    clearTimeout(cooldown);
    cooldown = setTimeout(() => { triggered = false; }, 1000);
  };

  const onWheel = (e) => {
    if (!triggered && e.deltaY > 4 && insideHero()) {
      e.preventDefault();
      goToNext();
    }
  };

  let touchStartY = 0;
  let capturing = false;
  const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; capturing = false; };
  const onTouchMove = (e) => {
    // Once engaged, keep intercepting for the rest of this touch so the
    // animated scroll isn't fought by the finger still moving on screen.
    if (capturing) { e.preventDefault(); return; }
    if (!triggered && touchStartY - e.touches[0].clientY > 10 && insideHero()) {
      capturing = true;
      e.preventDefault();
      goToNext();
    }
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });

  return () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    clearTimeout(cooldown);
  };
}
