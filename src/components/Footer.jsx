// Hashes that are full page routes (not home-page sections)
const PAGE_ROUTES = new Set([
  '#solutions', '#careers', '#hardware', '#software', '#material-science',
]);


// Hashes that are anchored sections on the home page
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
  const currentHash = window.location.hash.split('?')[0];
  const onHomePage = !PAGE_ROUTES.has(currentHash);

  if (onHomePage) {
    scrollToSection(sectionId);
  } else {
    sessionStorage.setItem('sw_scroll_target', sectionId);
    window.location.hash = '#home';
  }
}

/**
 * Click handler for Technology links that navigate to a sub-page
 * and optionally scroll to a specific section within that page.
 */
function handlePageNav(e, page, section) {
  e.preventDefault();
  const currentHash = window.location.hash.split('?')[0];
  if (section) {
    if (currentHash === page) {
      scrollToSection(section);
    } else {
      sessionStorage.setItem('sw_scroll_target', section);
      window.location.hash = page;
    }
  } else {
    window.location.hash = page;
  }
}

const COLUMNS = [
  {
    title: 'Solutions',
    items: [
      ['Hardware', '#hardware'],
      ['Software', '#software'],
      ['Material Science', '#material-science'],
    ],
  },
  {
    title: 'Technology',
    // 3-tuple: [label, pageHash, sectionId|null]
    items: [
      ['AI Vision & Sorting', '#hardware',         'hw-sorter'],
      ['Sensor Networks',     '#hardware',         'hw-mrm'],
      ['TraceOS Platform',    '#software',         null],
      ['R&D Labs',            '#material-science', null],
    ],
  },
  {
    title: 'Industries',
    items: [
      ['Glass Manufacturers', '#'],
      ['Municipalities & Government', '#'],
      ['Beverage & FMCG Brands', '#'],
      ['Construction & Real Estate', '#'],
      ['Recycling Operators', '#'],
    ],
  },
  {
    title: 'Resources',
    items: [
      ['Blog', '#'],
      ['Case Studies', '#'],
      ['Sustainability Reports', '#'],
      ['Whitepapers', '#'],
      ['Press & Media', '#highlights'],
      ['FAQ', '#'],
    ],
  },
  {
    title: 'Company',
    items: [
      ['About', '#about'],
      ['Investors & Partners', '#investors'],
      ['Careers', '#careers'],
      ['Contact', '#contact'],
    ],
  },
];

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer__grid">
          <div className="footer__about">
            <a href="#home" className="footer__brand" aria-label="Reneonix home">
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
            <a href="#policy">Privacy</a> · <a href="#policy">Terms</a> ·{' '}
            <a href="#policy">Security</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
