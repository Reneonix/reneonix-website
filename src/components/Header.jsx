import { useState } from 'react';

const SOLUTIONS = [
  ['Hardware Layer', 'Modular systems for collection, sorting, and processing', '#solutions'],
  ['Software Layer', 'Material data systems for traceability and compliance', '#solutions'],
  ['Material Science', 'Testing, formulation, and product development', '#solutions'],
  ['Integrated Stack', 'End-to-end material circularity infrastructure', '#solutions'],
];
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
const COMPANY = [
  ['About Reneonix', 'Our mission, story, and material circularity vision', '#about'],
  ['Investors & Partners', 'The leaders backing our long-term build', '#investors'],
  ['Careers', 'Join the team building circularity infrastructure', '#'],
  ['Contact', 'Talk to sales, partnerships, or press', '#contact'],
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

export default function Header() {
  const [, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="#home" className="brand" aria-label="Reneonix home">
          <img src="/reneonix-logo.svg" alt="Reneonix" className="brand__img" />
        </a>

        <nav className="nav__menu" id="navMenu">
          <Dropdown label="SolutionS" items={SOLUTIONS} />
          <Dropdown label="Technology" items={TECH} />
          <Dropdown label="Industries" items={INDUSTRIES} />
          <Dropdown label="Resources" items={RESOURCES} />
          <Dropdown label="Company" items={COMPANY} />
        </nav>

        <div className="nav__cta">
          <button
            className="nav__toggle"
            id="navToggle"
            aria-label="Open menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
