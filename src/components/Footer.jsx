import { navigate, navClick } from '../utils/nav.js';

// Real paths that are full page routes (not home-page sections)
const PAGE_ROUTES = new Set([
  '/solutions', '/careers', '/solutions/hardware', '/solutions/software', '/solutions/material-science', '/investors-page', '/blog', '/contact-us',
  '/industries', '/industries/glass-manufacturers', '/industries/mining-minerals', '/industries/beverage-fmcg-brands',
  '/industries/recycling-operators', '/industries/municipalities-government',
]);


// Hashes that are anchored sections on the home page — these stay as URL
// fragments (not page routes), since they only ever mean "scroll to this
// element on the home page", never a page of their own.
const HOME_SECTIONS = new Set([
  '#about', '#investors', '#contact', '#highlights',
]);

/**
 * Smooth-scroll to a section ID, offset by the sticky navbar height.
 * Works reliably even when the section is far down the page.
 */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const navH = document.querySelector('header')?.offsetHeight ?? 80;
  const y = el.getBoundingClientRect().top + window.pageYOffset - navH - 16;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

/**
 * Click handler for footer links that target home-page sections.
 * – Same page  → smooth scroll with navbar offset.
 * – Other page → store target in sessionStorage and navigate home;
 *   App.jsx picks it up after the route change and scrolls.
 */
function handleSectionNav(e, href) {
  e.preventDefault();
  const sectionId = href.slice(1); // '#about' → 'about'
  // Every other route now has its own real path, so "home page" is
  // exhaustively just the root path — no per-route enumeration needed the
  // way the old hash-based check required.
  const onHomePage = window.location.pathname === '/';

  if (onHomePage) {
    scrollToSection(sectionId);
  } else {
    sessionStorage.setItem('sw_scroll_target', sectionId);
    navigate('/');
  }
}

/**
 * Click handler for Technology links that navigate to a sub-page
 * and optionally scroll to a specific section within that page.
 */
function handlePageNav(e, page, section) {
  e.preventDefault();
  const currentPath = window.location.pathname;
  if (section) {
    if (currentPath === page) {
      scrollToSection(section);
    } else {
      sessionStorage.setItem('sw_scroll_target', section);
      navigate(page);
    }
  } else {
    navigate(page);
  }
}

const COLUMNS = [
  {
    title: 'Solutions',
    items: [
      ['Hardware', '/solutions/hardware'],
      ['Software', '/solutions/software'],
      ['Material Science', '/solutions/material-science'],
    ],
  },
  {
    title: 'Technology',
    // 3-tuple: [label, pagePath, sectionId|null]
    items: [
      ['AI Vision & Sorting', '/solutions/hardware',         'hw-sorter'],
      ['Sensor Networks',     '/solutions/hardware',         'hw-mrm'],
      ['TraceOS Platform',    '/solutions/software',         null],
      ['R&D Labs',            '/solutions/material-science', null],
    ],
  },
  {
    title: 'Industries',
    items: [
      ['Glass Manufacturers', '/industries/glass-manufacturers'],
      ['Mining & Minerals', '/industries/mining-minerals'],
      ['Beverage & FMCG Brands', '/industries/beverage-fmcg-brands'],
      ['Recycling Operators', '/industries/recycling-operators'],
      ['Municipalities & Government', '/industries/municipalities-government'],
    ],
  },
  {
    title: 'Resources',
    items: [
      ['Blog', '/blog'],
      ['Case Studies', null],
      ['Sustainability Reports', null],
      ['Whitepapers', null],
      ['Press & Media', null],
      ['Investors Relations', '/investors-page'],
      ['FAQ', null],
    ],
  },
  {
    title: 'Company',
    items: [
      ['About', '#about'],
      ['Investors & Partners', '#investors'],
      ['Careers', '/careers'],
      ['Contact', '/contact-us'],
    ],
  },
];

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer__grid">
          <div className="footer__about">
            <a href="/" className="footer__brand" aria-label="Reneonix home" onClick={navClick('/')}>
              <img src="/reneonix-logo.svg" alt="Reneonix" className="footer__brand-img" />
            </a>
            <p style={{ marginTop: 20 }}>
              Reneonix is a vision-based material circularity deeptech company. We transform
              fragmented waste streams into quality-controlled, traceable, industry-ready raw
              materials.
            </p>
            <div className="socials">
              <a
                href="https://www.linkedin.com/company/reneonix/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reneonix on LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5zM3 9h4v12H3zM10 9h3.8v1.6h.1A4.2 4.2 0 0 1 17.6 8.7c4 0 4.8 2.6 4.8 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/iwan_richard_official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reneonix on Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div className="footer__col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.items.map(([label, href, section]) => (
                  <li key={label}>
                    {href === null || href === undefined ? (
                      <span className="footer__link--inactive">{label}</span>
                    ) : HOME_SECTIONS.has(href) ? (
                      <a href={href} onClick={(e) => handleSectionNav(e, href)}>{label}</a>
                    ) : PAGE_ROUTES.has(href) ? (
                      <a href={href} onClick={(e) => handlePageNav(e, href, section ?? null)}>{label}</a>
                    ) : (
                      <a href={href}>{label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span>© 2026 Reneonix. All rights reserved.</span>
          <span>
            <a href="/policy" onClick={navClick('/policy')}>Privacy</a> · <a href="/policy" onClick={navClick('/policy')}>Terms</a> ·{' '}
            <a href="/policy" onClick={navClick('/policy')}>Security</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
