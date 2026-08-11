import { lazy, Suspense, useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Brands from './components/Brands.jsx';
import Solutions from './components/Solutions.jsx';
import About from './components/About.jsx';
import Investors from './components/Investors.jsx';
import Testimonials from './components/Testimonials.jsx';
import Highlights from './components/Highlights.jsx';
import CtaBanner from './components/CtaBanner.jsx';
import Footer from './components/Footer.jsx';
import SiteEffects from './components/SiteEffects.jsx';
import Preloader from './components/Preloader.jsx';
import BackToTop from './components/BackToTop.jsx';
import SplashCursor from './components/SplashCursor.jsx';
import PAGE_META from './data/pageMeta.js';

// Sub-pages are code-split: their JS + CSS loads only when the user navigates
// to that route, keeping the home-page initial bundle small.
const Careers          = lazy(() => import('./components/Careers.jsx'));
const SolutionsPage    = lazy(() => import('./components/SolutionsPage.jsx'));
const HardwareSystems  = lazy(() => import('./components/HardwareSystems.jsx'));
const SoftwarePage     = lazy(() => import('./components/SoftwarePage.jsx'));
const MaterialSciencePage = lazy(() => import('./components/MaterialSciencePage.jsx'));
const IndustriesPage    = lazy(() => import('./components/IndustriesPage.jsx'));
const GlassManufacturersPage = lazy(() => import('./components/GlassManufacturersPage.jsx'));
const MiningMineralsPage = lazy(() => import('./components/MiningMineralsPage.jsx'));
const BeverageFmcgPage = lazy(() => import('./components/BeverageFmcgPage.jsx'));
const RecyclingOperatorsPage = lazy(() => import('./components/RecyclingOperatorsPage.jsx'));
const PolicyPage       = lazy(() => import('./components/PolicyPage.jsx'));
const InvestorsPage    = lazy(() => import('./components/InvestorsPage.jsx'));
const BlogPage         = lazy(() => import('./components/BlogPage.jsx'));
const BlogArticleMRM   = lazy(() => import('./components/BlogArticleMRM.jsx'));
const BlogArticleVisionSorting = lazy(() => import('./components/BlogArticleVisionSorting.jsx'));
const BlogArticleFoamGlass = lazy(() => import('./components/BlogArticleFoamGlass.jsx'));
const BlogArticleTraceOS = lazy(() => import('./components/BlogArticleTraceOS.jsx'));
const BlogArticleResourceRecovery = lazy(() => import('./components/BlogArticleResourceRecovery.jsx'));
const ContactPage      = lazy(() => import('./components/ContactPage.jsx'));

// This site used to route entirely on the URL fragment (#hardware,
// #blog/…) — every "page" was actually the same document to a browser and
// to Google. Now routing uses real paths instead, but the site has been
// live under the old scheme, so old bookmarked/shared links like
// reneonix.com/#hardware need to keep working. This rewrites a legacy hash
// to its equivalent real path (once, via replaceState — no new history
// entry, no visible redirect) before the very first route is computed.
// '#about' / '#investors' / '#contact' / '#highlights' are NOT page
// routes — they're in-page section anchors on the home page itself — so
// they're left alone rather than treated as a page to redirect to.
const HOME_SECTION_HASHES = new Set(['#about', '#investors', '#contact', '#highlights']);
// Hardware/Software/Material Science live nested under /solutions/… (they're
// presented as the Solutions page's own child cards) rather than at the
// hash's own flat name, so they need an explicit mapping instead of the
// generic `/${hash.slice(1)}` most other legacy hashes can use.
const LEGACY_PATH_OVERRIDES = {
  '#home': '/',
  '#hardware': '/solutions/hardware',
  '#software': '/solutions/software',
  '#material-science': '/solutions/material-science',
};
function redirectLegacyHash() {
  const hash = window.location.hash.split('?')[0];
  if (!hash || hash === '#' || HOME_SECTION_HASHES.has(hash)) return;
  // A real path is already present — this isn't a legacy hash-only link.
  if (window.location.pathname !== '/') return;
  const newPath = LEGACY_PATH_OVERRIDES[hash] ?? `/${hash.slice(1)}`;
  window.history.replaceState({}, '', newPath);
}

function getRoute() {
  if (typeof window === 'undefined') return 'home';
  redirectLegacyHash();
  const path = window.location.pathname;
  // Checked before the generic /solutions prefix below, since these three
  // are nested under it but render their own dedicated page, not the
  // Solutions overview.
  if (path === '/solutions/hardware') return 'hardware';
  if (path === '/solutions/software') return 'software';
  if (path === '/solutions/material-science') return 'material-science';
  if (path === '/solutions' || path.startsWith('/solutions/')) return 'solutions';
  if (path === '/industries') return 'industries';
  if (path === '/industries/glass-manufacturers') return 'industry-glass-manufacturers';
  if (path === '/industries/mining-minerals') return 'industry-mining-minerals';
  if (path === '/industries/beverage-fmcg-brands') return 'industry-beverage-fmcg';
  if (path === '/industries/recycling-operators') return 'industry-recycling-operators';
  if (path === '/careers' || path.startsWith('/careers/')) return 'careers';
  if (path === '/policy') return 'policy';
  if (path === '/investors-page') return 'investors-page';
  if (path === '/blog') return 'blog';
  if (path === '/blog/mrm-ai-front-end-recovery') return 'blog-article-mrm';
  if (path === '/blog/ai-vision-sorting-glass-classification') return 'blog-article-vision-sorting';
  if (path === '/blog/foam-glass-insulation') return 'blog-article-foam-glass';
  if (path === '/blog/traceos-retraiz-traceability') return 'blog-article-traceos';
  if (path === '/blog/future-of-resource-recovery') return 'blog-article-resource-recovery';
  if (path === '/contact-us') return 'contact-us';
  return 'home';
}

// Finds a <meta attr="key"> tag (creating it if it doesn't exist yet) and
// sets its content — used to keep description/Open Graph/Twitter tags in
// sync with the current route, since index.html only ships one static set.
function setMetaTag(attr, key, content) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Same idea as setMetaTag, for <link> tags — used to keep the canonical
// URL in sync with the current route now that each route has a real path.
function setLinkTag(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Removes a meta tag entirely — used for article-only tags (og:type
// "article", article:published_time) that shouldn't linger with a stale
// value after navigating from a blog post to a non-article route.
function removeMetaTag(attr, key) {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

export default function App() {
  const [route, setRoute] = useState(getRoute);


  // Header staggered animation should NOT play on the very first paint
  // (the Preloader is on top there). It plays on every navigation after.
  const [hasNavigated, setHasNavigated] = useState(false);

  // pushState (used by navigate() in src/utils/nav.js) doesn't fire any
  // event on its own — navigate() dispatches a synthetic 'popstate' right
  // after, so this one listener covers both that and real back/forward.
  useEffect(() => {
    const onRouteChange = () => {
      const next = getRoute();
      setRoute((prev) => {
        if (prev !== next) {
          setHasNavigated(true);
          // Scroll to top immediately — set scrollTop directly for Safari <15.4
          // which ignores behavior:'instant' and would let GSAP ScrollTrigger fight it
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        return next;
      });
    };
    window.addEventListener('popstate', onRouteChange);
    return () => window.removeEventListener('popstate', onRouteChange);
  }, []);

  // Every route previously showed the exact same <title>/description/Open
  // Graph tags baked into index.html — Google (and anyone sharing a link)
  // saw one identical result for Home, Hardware, Careers, every blog
  // article. This pushes each route's own title/description/image into
  // <head> on every navigation. Canonical now tracks the real per-route
  // path too — with hash-only routing every route pointed at the same
  // canonical URL (the homepage), which told Google to ignore every other
  // page as a duplicate.
  useEffect(() => {
    const meta = PAGE_META[route] || PAGE_META.home;
    document.title = meta.title;
    setMetaTag('name', 'description', meta.description);
    setMetaTag('property', 'og:site_name', 'Reneonix');
    setMetaTag('property', 'og:title', meta.title);
    setMetaTag('property', 'og:description', meta.description);
    setMetaTag('property', 'og:image', meta.image);
    setMetaTag('property', 'og:url', window.location.href);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', meta.title);
    setMetaTag('name', 'twitter:description', meta.description);
    setMetaTag('name', 'twitter:image', meta.image);
    setLinkTag('canonical', window.location.origin + window.location.pathname);

    // Blog posts get og:type "article" + article:published_time, so
    // Google/LinkedIn treat them as dated editorial content rather than a
    // generic page — everything else stays a plain "website".
    if (meta.type === 'article') {
      setMetaTag('property', 'og:type', 'article');
      setMetaTag('property', 'article:published_time', meta.publishedTime);
    } else {
      setMetaTag('property', 'og:type', 'website');
      removeMetaTag('property', 'article:published_time');
    }
  }, [route]);

  // After cross-page navigation, any component can store a section ID in
  // sessionStorage under 'sw_scroll_target'. Once the target route renders,
  // this effect picks it up and scrolls to the section — with retry logic
  // to handle lazy-loaded pages that take a frame or two to mount.
  useEffect(() => {
    const target = sessionStorage.getItem('sw_scroll_target');
    if (!target) return;
    sessionStorage.removeItem('sw_scroll_target');
    let tries = 0;
    const attempt = () => {
      const el = document.getElementById(target);
      if (el) {
        const navH = document.querySelector('header')?.offsetHeight ?? 80;
        const y = el.getBoundingClientRect().top + window.pageYOffset - navH - 16;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      } else if (tries < 20) {
        tries++;
        setTimeout(attempt, 80);
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(attempt));
  }, [route]);

  // First mount = stable key + no animation. Subsequent navs remount
  // header (new key per route) so the CSS entrance animation re-fires.
  const headerKey = hasNavigated ? route : 'initial';
  const headerAnimate = hasNavigated;

  const headerRouteProp = route;

  let page;
  if (route === 'solutions') {
    page = <SolutionsPage />;
  } else if (route === 'careers') {
    page = <Careers />;
  } else if (route === 'hardware') {
    page = <HardwareSystems />;
  } else if (route === 'software') {
    page = <SoftwarePage />;
  } else if (route === 'material-science') {
    page = <MaterialSciencePage />;
  } else if (route === 'industries') {
    page = <IndustriesPage />;
  } else if (route === 'industry-glass-manufacturers') {
    page = <GlassManufacturersPage />;
  } else if (route === 'industry-mining-minerals') {
    page = <MiningMineralsPage />;
  } else if (route === 'industry-beverage-fmcg') {
    page = <BeverageFmcgPage />;
  } else if (route === 'industry-recycling-operators') {
    page = <RecyclingOperatorsPage />;
  } else if (route === 'policy') {
    page = <PolicyPage />;
  } else if (route === 'investors-page') {
    page = <InvestorsPage />;
  } else if (route === 'blog') {
    page = <BlogPage />;
  } else if (route === 'blog-article-mrm') {
    page = <BlogArticleMRM />;
  } else if (route === 'blog-article-vision-sorting') {
    page = <BlogArticleVisionSorting />;
  } else if (route === 'blog-article-foam-glass') {
    page = <BlogArticleFoamGlass />;
  } else if (route === 'blog-article-traceos') {
    page = <BlogArticleTraceOS />;
  } else if (route === 'blog-article-resource-recovery') {
    page = <BlogArticleResourceRecovery />;
  } else if (route === 'contact-us') {
    page = <ContactPage />;
  } else {
    page = (
      <>
        <Hero />
        <Brands />
        <Solutions />
        <About />
        <Investors />
        <Testimonials />
        <Highlights />
        <CtaBanner />
      </>
    );
  }

  return (
    <>
      <Preloader />
      <Header key={headerKey} route={headerRouteProp} animate={headerAnimate} />
      <main>
        <Suspense fallback={null}>{page}</Suspense>
      </main>
      <Footer />
      <SiteEffects route={route} />
      <BackToTop />
      <SplashCursor />
    </>
  );
}
