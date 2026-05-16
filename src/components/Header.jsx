import { useState } from 'react';
import './Header.css';

const TECH = [
  ['AI Vision & Sorting', 'Computer vision for material identification', '#'],
  ['Sensor Networks', 'Live process monitoring and quality control', '#'],
  ['Trace OS Platform', 'End-to-end material traceability software', '#'],
  ['R&D Labs', 'Materials testing, formulation, and validation', '#'],
];
const INDUSTRIES = [
  ['Glass Manufacturers', null, '#'],
  ['Municipalities & Government', null, '#'],
  ['Beverage & FMCG Brands', null, '#'],
  ['Construction & Real Estate', null, '#'],
  ['Recycling Operators', null, '#'],
];
const RESOURCES = [
  ['Blog', null, '#'],
  ['Case Studies', null, '#'],
  ['Sustainability Reports', null, '#'],
  ['Whitepapers', null, '#'],
  ['Press & Media', null, '#highlights'],
  ['FAQ', null, '#'],
];

function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function Dropdown({ label, items }) {
  return (
    <div className="has-dropdown">
      <button type="button">
        {label}
        <Chevron />
      </button>
      <div className="dropdown">
        {items.map(([title, sub, href]) => (
          <a key={title} href={href}>
            <strong>{title}</strong>
            {sub && <span>{sub}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Smooth-scroll to an in-page section without changing the URL hash.
 */
function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Header({ route = 'home', animate = true }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isCareers = route === 'careers';
  const isSolutions = route === 'solutions';

  const close = () => setMobileOpen(false);
  const toggle = () => setMobileOpen((o) => !o);

  return (
    <header className={`nav ${animate ? '' : 'nav--no-entrance'}`.trim()}>
      <div className="container nav__inner">
        <a href="#home" className="brand" aria-label="Reneonix home" onClick={close}>
          <img src="/reneonix-logo.svg" alt="Reneonix" className="brand__img" />
        </a>

        <nav className={`nav__menu${mobileOpen ? ' open' : ''}`} id="navMenu">
          {isCareers ? (
            <>
              <a className="nav__link" href="#home" onClick={close}>Home</a>
              <a className="nav__link nav__link--active" href="#careers" aria-current="page" onClick={close}>
                Careers
              </a>
              <a
                className="nav__link"
                href="#growth"
                onClick={(e) => { e.preventDefault(); scrollToId('growth'); close(); }}
              >
                Why Reneonix
              </a>
              <a className="nav__link" href="#solutions" onClick={close}>Solutions</a>
            </>
          ) : isSolutions ? (
            <>
              <a className="nav__link" href="#home" onClick={close}>Home</a>
              <a className="nav__link nav__link--active" href="#solutions" aria-current="page" onClick={close}>
                Solutions
              </a>
              <a className="nav__link" href="#careers" onClick={close}>Careers</a>
              <a
                className="nav__link"
                href="#careers"
                onClick={(e) => {
                  e.preventDefault();
                  sessionStorage.setItem('reneonix-scroll-to', 'life-at-reneonix');
                  window.location.hash = '#careers';
                  close();
                }}
              >Life at Reneonix</a>
            </>
          ) : (
            <>
              <a className="nav__link" href="#solutions" onClick={close}>Solutions</a>
              <Dropdown label="Technology" items={TECH} />
              <Dropdown label="Industries" items={INDUSTRIES} />
              <Dropdown label="Resources" items={RESOURCES} />
              <a className="nav__link" href="#careers" onClick={close}>Careers</a>
            </>
          )}
        </nav>

        <div className="nav__cta">
          <button
            className={`nav__toggle${mobileOpen ? ' is-open' : ''}`}
            id="navToggle"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={toggle}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
