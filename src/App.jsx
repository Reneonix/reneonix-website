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
import SolutionsPage from './components/SolutionsPage.jsx';
import HardwareSystems from './components/HardwareSystems.jsx';
// import SoftwarePage from './components/SoftwarePage.jsx';
// import MaterialSciencePage from './components/MaterialSciencePage.jsx';
import Footer from './components/Footer.jsx';
import SiteEffects from './components/SiteEffects.jsx';
import Preloader from './components/Preloader.jsx';

function getRoute() {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash || '';
  const path = hash.split('?')[0];
  if (path === '#solutions' || path.startsWith('#solutions/')) return 'solutions';
  if (path === '#careers' || path.startsWith('#careers/')) return 'careers';
  if (path === '#hardware') return 'hardware';
  // if (path === '#software') return 'software';
  // if (path === '#material-science') return 'material-science';
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

  const headerRouteProp = route;

  let page;
  if (route === 'solutions') {
    page = <SolutionsPage />;
  } else if (route === 'careers') {
    page = <Careers />;
  } else if (route === 'hardware') {
    page = <HardwareSystems />;
  // } else if (route === 'software') {
  //   page = <SoftwarePage />;
  // } else if (route === 'material-science') {
  //   page = <MaterialSciencePage />;
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
