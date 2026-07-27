import { navClick } from '../utils/nav.js';

export default function CtaBanner() {
  return (
    <section className="section" id="contact" style={{ padding: '80px 0' }}>
      <div className="container">
        <div className="cta-banner">
          <h2>Ready to build circular material infrastructure?</h2>
          <p>Tell us what you want to solve.</p>
          <div className="btn-cta-row">
            <a
              href="/investors-page"
              onClick={navClick('/investors-page')}
              className="btn btn-outline-dark"
              style={{
                background: 'var(--ink)',
                color: 'var(--white)',
                borderColor: 'var(--ink)',
              }}
            >
              Partner with us
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
