import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Brands from './components/Brands.jsx';
import Solutions from './components/Solutions.jsx';
import About from './components/About.jsx';
import Investors from './components/Investors.jsx';
import Testimonials from './components/Testimonials.jsx';
import Highlights from './components/Highlights.jsx';
import CtaBanner from './components/CtaBanner.jsx';
import Careers from './components/Careers.jsx';
import ApplicationForm from './components/ApplicationForm.jsx';
import SolutionsPage from './components/SolutionsPage.jsx';
import MaterialSciencePage from './components/MaterialSciencePage.jsx';
import HardwareSystems from './components/HardwareSystems.jsx';
import SoftwarePage from './components/SoftwarePage.jsx';
import Footer from './components/Footer.jsx';
import SiteEffects from './components/SiteEffects.jsx';
import Preloader from './components/Preloader.jsx';

function getRoute() {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash || '';
  const path = hash.split('?')[0];
  if (path === '#apply' || path.startsWith('#apply/')) return 'apply';
  if (path === '#solutions/material-science') return 'solutions-material';
  if (path === '#solutions/software') return 'solutions-software';
  if (path === '#solutions/hardware') return 'solutions-hardware';
  if (path === '#solutions' || path.startsWith('#solutions/')) return 'solutions';
  if (path === '#careers' || path.startsWith('#careers/')) return 'careers';
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
          requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
        }
        return next;
      });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // First mount = stable key + no animation. Subsequent navs remount
  // header (new key per route) so the CSS entrance animation re-fires.
  const headerKey = hasNavigated ? route : 'initial';
  const headerAnimate = hasNavigated;

  const headerRouteProp = (route === 'solutions-material' || route === 'solutions-software' || route === 'solutions-hardware')
    ? 'solutions'
    : (route === 'apply' ? 'careers' : route);

  let page;
  if (route === 'apply') {
    page = <ApplicationForm />;
  } else if (route === 'solutions-material') {
    page = <MaterialSciencePage />;
  } else if (route === 'solutions-software') {
    page = <SoftwarePage />;
  } else if (route === 'solutions-hardware') {
    page = <HardwareSystems />;
  } else if (route === 'solutions') {
    page = <SolutionsPage />;
  } else if (route === 'careers') {
    page = <Careers />;
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
      <main>{page}</main>
      <Footer />
      <SiteEffects />
    </>
  );
}
