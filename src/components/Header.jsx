import { useState, useRef, useEffect } from 'react';
import './Header.css';

const TECH = [
  ['AI Vision & Sorting',   'Computer vision for material identification',    '#'],
  ['Sensor Networks',        'Live process monitoring and quality control',    '#'],
  ['Trace OS Platform',      'End-to-end material traceability software',      '#'],
  ['R&D Labs',               'Materials testing, formulation, and validation', '#'],
];
const INDUSTRIES = [
  ['Glass Manufacturers',         null, '#'],
  ['Municipalities & Government', null, '#'],
  ['Beverage & FMCG Brands',      null, '#'],
  ['Construction & Real Estate',  null, '#'],
  ['Recycling Operators',         null, '#'],
];
const RESOURCES = [
  ['Blog',                   null, '#'],
  ['Case Studies',           null, '#'],
  ['Sustainability Reports', null, '#'],
  ['Whitepapers',            null, '#'],
  ['Press & Media',          null, '#highlights'],
  ['FAQ',                    null, '#'],
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
function Dropdown({ label, items, onItemClick }) {
  const [open, setOpen] = useState(false);
  const wrapRef  = useRef(null);
  const closeTimer = useRef(null);

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  // Close when clicking outside (fallback for touch / keyboard)
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      clearTimeout(closeTimer.current);
    };
  }, []);

  const handleItemClick = () => {
    setOpen(false);
    onItemClick?.();
  };

  return (
    <div
      className={`has-dropdown${open ? ' open' : ''}`}
      ref={wrapRef}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button type="button" onClick={() => setOpen((o) => !o)}>
        {label}
        <Chevron />
      </button>
      <div className="dropdown">
        {items.map(([title, sub, href]) => (
          <a key={title} href={href} onClick={handleItemClick}>
            <strong>{title}</strong>
            {sub && <span>{sub}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Dynamic left/right nav links based on current route:
 *   home     → Solutions | … | Careers
 *   careers  → Home      | … | Solutions
 *   solutions → Home     | … | Careers
 */
function getEdgeLinks(route) {
  if (route === 'careers') {
    return {
      left:  { label: 'Home',      href: '#home' },
      right: { label: 'Solutions', href: '#solutions' },
    };
  }
  if (route === 'solutions') {
    return {
      left:  { label: 'Home',    href: '#home' },
      right: { label: 'Careers', href: '#careers' },
    };
  }
  // home (default)
  return {
    left:  { label: 'Solutions', href: '#solutions' },
    right: { label: 'Careers',   href: '#careers' },
  };
}

export default function Header({ route = 'home', animate = true }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeNav = () => setMobileOpen(false);
  const toggleNav = () => setMobileOpen((o) => !o);

  const { left, right } = getEdgeLinks(route);

  return (
    <header className={`nav ${animate ? '' : 'nav--no-entrance'}`.trim()}>
      <div className="container nav__inner">

        {/* Brand — always goes home */}
        <a href="#home" className="brand" aria-label="Reneonix home" onClick={closeNav}>
          <img src="/reneonix-logo.svg" alt="Reneonix" className="brand__img" />
        </a>

        {/* ── Nav ── */}
        <nav className={`nav__menu${mobileOpen ? ' open' : ''}`} id="navMenu">

          {/* 1st item — changes per page */}
          <a className="nav__link" href={left.href} onClick={closeNav}>
            {left.label}
          </a>

          {/* Center 3 — always the same */}
          <Dropdown label="Technology" items={TECH}       onItemClick={closeNav} />
          <Dropdown label="Industries" items={INDUSTRIES} onItemClick={closeNav} />
          <Dropdown label="Resources"  items={RESOURCES}  onItemClick={closeNav} />

          {/* 5th item — changes per page */}
          <a className="nav__link" href={right.href} onClick={closeNav}>
            {right.label}
          </a>

        </nav>

        {/* Mobile toggle */}
        <div className="nav__cta">
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
  );
}
