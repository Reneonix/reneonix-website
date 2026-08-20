import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SiteSearch from './SiteSearch.jsx';
import { navigate, navClick } from '../utils/nav.js';
import './Header.css';

const TECH = [
  ['AI Vision & Sorting',   'Computer vision for material identification',    '/solutions/hardware',         'hw-sorter'],
  ['Sensor Networks',        'Live process monitoring and quality control',    '/solutions/hardware',         'hw-mrm'],
  ['TraceOS Platform',       'End-to-end material traceability software',      '/solutions/software',         null],
  ['R&D Labs',               'Materials testing, formulation, and validation', '/solutions/material-science', null],
];
const RESOURCES = [
  {
    group: 'Insights',
    items: [
      ['Blog',           null, '/blog'],
      ['Case Studies',   null, '#'],
      ['Whitepapers',    null, '#'],
    ],
  },
  {
    group: 'Impact',
    items: [
      ['Sustainability Reports', null, '#'],
      ['Press & Media',          null, '#'],
    ],
  },
  {
    group: 'Company',
    items: [
      ['Investor Relations', null, '/investors-page'],
      ['FAQ',                null, '#'],
    ],
  },
];

function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/**
 * Self-contained dropdown — owns its own open/close state in React.
 * No longer depends on SiteEffects DOM manipulation, so it works
 * correctly even when the Header remounts on route changes.
 */
function Dropdown({ label, items, groups, current, onItemClick }) {
  const [open, setOpen] = useState(false);
  const wrapRef  = useRef(null);
  const closeTimer = useRef(null);

  // On touch devices iOS/Android fire synthetic mouseenter BEFORE the click
  // event. Without the guard: mouseenter opens the dropdown, then the click
  // handler toggles it closed — first tap does nothing, second tap works.
  // Guarding both show/hide to no-ops on coarse-pointer (touch) devices means
  // only the onClick toggle and the touchstart outside-click control state.
  const isFinePointer = () => window.matchMedia('(pointer: fine)').matches;

  const show = () => {
    if (!isFinePointer()) return;
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const hide = () => {
    if (!isFinePointer()) return;
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  // Close when clicking/tapping outside on desktop and mobile
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
      clearTimeout(closeTimer.current);
    };
  }, []);

  const handleItemClick = () => {
    setOpen(false);
    onItemClick?.();
  };

  const renderLink = (title, sub, href, section) => (
    href && href !== '#' ? (
      <a key={title} href={href} onClick={(e) => handleNavItem(e, href, section)}>
        <strong>{title}</strong>
        {sub && <span>{sub}</span>}
      </a>
    ) : (
      <a key={title} href="#" onClick={(e) => { e.preventDefault(); handleItemClick(); }}>
        <strong>{title}</strong>
        {sub && <span>{sub}</span>}
      </a>
    )
  );

  const handleNavItem = (e, href, section) => {
    e.preventDefault();
    setOpen(false);
    onItemClick?.();
    if (!href || href === '#') return;
    if (section) {
      const currentPath = window.location.pathname;
      if (currentPath === href) {
        // Already on the target page — just scroll to section
        const el = document.getElementById(section);
        if (el) {
          const navH = document.querySelector('header')?.offsetHeight ?? 80;
          const y = el.getBoundingClientRect().top + window.pageYOffset - navH - 16;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      } else {
        sessionStorage.setItem('sw_scroll_target', section);
        navigate(href);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <div
      className={`has-dropdown${open ? ' open' : ''}${current ? ' current' : ''}`}
      ref={wrapRef}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button type="button" onClick={() => setOpen((o) => !o)}>
        {label}
        <Chevron />
      </button>
      <div className={`dropdown${groups ? ' dropdown--grouped' : ''}`}>
        {groups
          ? groups.map(({ group, items: groupItems }) => (
              <div className="dropdown__col" key={group}>
                <span className="dropdown__col-label">{group}</span>
                {groupItems.map(([title, sub, href, section]) => renderLink(title, sub, href, section))}
              </div>
            ))
          : items.map(([title, sub, href, section]) => renderLink(title, sub, href, section))}
      </div>
    </div>
  );
}

/**
 * The navbar is now identical on every page (Home | Technology | Solutions |
 * Industries We Serve | Resources | Careers) — only which item lights up
 * lime as "current" changes, based on the route.
 */
function getActiveSection(route) {
  if (route === 'home') return 'home';
  if (route === 'hardware' || route === 'software' || route === 'material-science') return 'technology';
  if (route === 'solutions') return 'solutions';
  if (route === 'industries' || route.startsWith('industry-')) return 'industries';
  if (route === 'careers') return 'careers';
  if (route === 'blog' || route.startsWith('blog-article-') || route === 'investors-page') return 'resources';
  return null;
}

export default function Header({ route = 'home', animate = true }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeNav = () => setMobileOpen(false);
  const toggleNav = () => setMobileOpen((o) => !o);

  // Navigates client-side (no full-page reload) and closes the mobile
  // menu in the same click — every plain nav link below needs both.
  const withNav = (path) => (e) => { navClick(path)(e); closeNav(); };

  const active = getActiveSection(route);
  const linkClass = (section) => `nav__link${active === section ? ' nav__link--active' : ''}`;

  return (
    <>
    <header className={`nav ${animate ? '' : 'nav--no-entrance'}`.trim()}>
      <div className="container nav__inner">

        {/* Brand — always goes home */}
        <a href="/" className="brand" aria-label="Reneonix home" onClick={withNav('/')}>
          <img src="/reneonix-logo.svg" alt="Reneonix" className="brand__img" />
        </a>

        {/* ── Nav — identical on every page; only the active item lights up ── */}
        <nav className={`nav__menu${mobileOpen ? ' open' : ''}`} id="navMenu">

          <a className={linkClass('home')} href="/" onClick={withNav('/')}>
            Home
          </a>

          <Dropdown label="Technology" items={TECH} current={active === 'technology'} onItemClick={closeNav} />

          <a className={linkClass('solutions')} href="/solutions" onClick={withNav('/solutions')}>
            Solutions
          </a>

          <a className={linkClass('industries')} href="/industries" onClick={withNav('/industries')}>
            Industries We Serve
          </a>

          <Dropdown label="Resources" groups={RESOURCES} current={active === 'resources'} onItemClick={closeNav} />

          <a className={linkClass('careers')} href="/careers" onClick={withNav('/careers')}>
            Careers
          </a>

          {/* Mobile only — sits below all dropdown links, like a footer CTA */}
          <a className="nav__menu-contact" href="/contact-us" onClick={withNav('/contact-us')}>
            Contact Us
          </a>

        </nav>

        {/* Search + Contact Us + mobile toggle */}
        <div className="nav__cta">
          <SiteSearch />
          <a href="/contact-us" className="btn btn-primary nav__contact-btn" onClick={withNav('/contact-us')}>
            Contact Us
          </a>
          <button
            className={`nav__toggle${mobileOpen ? ' is-open' : ''}`}
            id="navToggle"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={toggleNav}
          >
            <span /><span /><span />
          </button>
        </div>

      </div>
    </header>
    {/* Backdrop via Portal — outside the header's z-100 stacking context.
        At document z-index 99, the header (z-100) sits above it, so the
        mobile nav menu (inside the header) receives taps correctly. */}
    {mobileOpen && createPortal(
      <div className="nav__backdrop" onClick={closeNav} aria-hidden="true" />,
      document.body
    )}
    </>
  );
}
