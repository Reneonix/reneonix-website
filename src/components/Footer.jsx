const COLUMNS = [
  {
    title: 'Solutions',
    items: [
      ['Hardware', '#solutions'],
      ['Software', '#solutions'],
      ['Material Science', '#solutions'],
      ['Integrated Stack', '#solutions'],
    ],
  },
  {
    title: 'Technology',
    items: [
      ['AI Vision & Sorting', '#'],
      ['Sensor Networks', '#'],
      ['Trace OS Platform', '#'],
      ['R&D Labs', '#'],
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
      ['Careers', '#'],
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
            <a href="#" className="footer__brand" aria-label="Reneonix home">
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
                rel="noopener"
                aria-label="Reneonix on LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5zM3 9h4v12H3zM10 9h3.8v1.6h.1A4.2 4.2 0 0 1 17.6 8.7c4 0 4.8 2.6 4.8 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/iwan_richard_official/"
                target="_blank"
                rel="noopener"
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
                {col.items.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span>© 2026 Reneonix. All rights reserved.</span>
          <span>
            <a href="#">Privacy</a> · <a href="#">Terms</a> ·{' '}
            <a href="#">Security</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
