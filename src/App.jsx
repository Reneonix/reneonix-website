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

// Sub-pages are code-split: their JS + CSS loads only when the user navigates
// to that route, keeping the home-page initial bundle small.
const Careers          = lazy(() => import('./components/Careers.jsx'));
const SolutionsPage    = lazy(() => import('./components/SolutionsPage.jsx'));
const HardwareSystems  = lazy(() => import('./components/HardwareSystems.jsx'));
const SoftwarePage     = lazy(() => import('./components/SoftwarePage.jsx'));
const MaterialSciencePage = lazy(() => import('./components/MaterialSciencePage.jsx'));
const PolicyPage       = lazy(() => import('./components/PolicyPage.jsx'));

function getRoute() {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash || '';
  const path = hash.split('?')[0];
  if (path === '#solutions' || path.startsWith('#solutions/')) return 'solutions';
  if (path === '#careers' || path.startsWith('#careers/')) return 'careers';
  if (path === '#hardware') return 'hardware';
  if (path === '#software') return 'software';
  if (path === '#material-science') return 'material-science';
  if (path === '#policy') return 'policy';
  return 'home';
}

export default function App() {
  const [route, setRoute] = useState(getRoute);


  // Header staggered animation should NOT play on the very first paint
  // (the Preloader is on top there). It plays on every navigation after.
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
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
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

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
  } else if (route === 'policy') {
    page = <PolicyPage />;
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
    </>
  );
}
