# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # vite dev server at http://localhost:5173
npm run build    # production bundle to ./dist
npm run preview  # serve the built bundle
```

There is no test runner, linter, or type checker configured. Don't claim a change "passes tests" — there are none. For UI changes, verify visually in `npm run dev`.

## Architecture

Single-page marketing site: React 18 + Vite 6, no router, no state library, no backend. `src/main.jsx` mounts `<App />`, which composes a flat list of section components in `src/components/` (`Header`, `Hero`, `Brands`, `Solutions`, `About`, `Investors`, `Testimonials`, `Highlights`, `CtaBanner`, `Footer`, plus the side-effect mounter `SiteEffects`).

### Styling model

All shared styling lives in **one large file**: `src/styles/global.css` (~2.2k lines). Components reference plain string class names like `.zz-row__copy`, `.hero__cta`, etc. — there are no CSS Modules in use yet despite `vite.config.js` enabling `localsConvention: 'dashes'` (that config exists for a planned per-component module migration described in `README.md`). When editing a section's look, expect to jump between the JSX and `global.css`; class names follow loose BEM-ish conventions tied to the section (`.zz-*` = zigzag rows in Solutions, `.sw-*` = software layer, `.ms-*` = material science, `.hero__*`, `.about__*`, etc.). `global.css.bak` is a stale backup — ignore it unless reverting.

### The `SiteEffects` pattern

`src/components/SiteEffects.jsx` is a render-null component mounted once from `App.jsx`. It attaches **global DOM listeners and observers** for behavior that's section-agnostic: header dropdown click/outside-close, mobile nav toggle, `[data-parallax]` scroll, a generic `.reveal` → `.in`/`.is-in` IntersectionObserver pass, and the lime cursor glow (`.cursor-glow` + `.cursor-ready`/`.cursor-hover`/`.cursor-down` body classes; auto-disabled on touch and `prefers-reduced-motion`). Every listener has matching cleanup so React StrictMode's double-mount doesn't leak handlers.

The reveal observer adds **both** `.in` and `.is-in` to each `.reveal` element so the original CSS (which mixes `.reveal.in` and section-level `.is-in` selectors like `.brands.is-in`, `.zz-row.is-in`) continues to work. Some components (e.g. `Solutions.jsx`'s `ZzRow`) also wire their own IntersectionObserver to add `.is-in` for stricter per-row timing — both mechanisms coexist.

`src/hooks/useInView.js` is the same pattern packaged as a hook for components that want a React-friendly `[ref, inView]` API.

### Hero video freeze loop

`Hero.jsx` does **not** use the `<video loop>` attribute. It implements a custom loop that plays through, pins `currentTime` to `duration - 0.05` to hold the last frame for 2 s, then restarts. There's a `timeupdate` backup because Safari/iOS muted-autoplay videos don't always fire `ended`. If you change the hero video, keep both the `ended` and `timeupdate` paths.

### Animation/3D components

Three custom visual components, each self-contained with its own CSS file:

- `ScrollStack.jsx` — scroll-driven card stack used inside `Solutions`. Adapted from React Bits with two production tweaks called out in the file header: (1) Lenis smooth-scroll removed (it caused per-frame flicker on rich card content; native scroll + rAF throttle is smoother), (2) card page-offsets are cached on mount and recomputed only on resize instead of via `getBoundingClientRect` per scroll event. Public props (`itemDistance`, `itemStackDistance`, `stackPosition`, `scaleEndPosition`, `baseScale`, `itemScale`, etc.) match the original API.
- `MagicRings.jsx` — Three.js + custom GLSL fragment shader rendering animated rings; mouse-influenced via uniforms.
- `LiquidEther.jsx` — Three.js fluid background (~1.1k LOC).
- `ShinyText.jsx` — text shimmer effect used for the hero headline accent.

These pull in `three` and `motion` from npm. Be aware of bundle size if adding more.

### Assets

Everything under `public/` is served from the site root (`/reneonix-hero.mp4`, `/hardware-flow.png`, `/software.png`, `/material-science.png`, partner/investor logos, etc.). The hero references `/reneonix-hero.mp4` — note the difference from `hero-bg.mp4` (an older asset still in `public/`).

## Conventions to preserve

- **Don't introduce a router or page split** — this is intentionally a single-page anchor-scroll site (`#home`, `#solutions`, `#about`, `#investors`, `#highlights`, `#contact`).
- When adding a new scroll-reveal element, either add it to the `revealSelectors` list in `SiteEffects.jsx` or attach `.reveal` to its className — the global observer will pick it up.
- New global DOM behavior belongs in `SiteEffects.jsx` with matching cleanup. New per-component behavior should use `useInView` or its own scoped `useEffect`.
- The README describes an in-progress migration toward CSS Modules. Until that migration starts, keep adding styles to `global.css` rather than creating one-off `.module.css` files mid-section.
