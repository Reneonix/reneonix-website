import { ArrowRight } from 'lucide-react';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function Highlights() {
  return (
    <section className="section section-paper" id="highlights">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Highlights</span>
          <h2>
            Latest news, research, <em>and milestones</em>.
          </h2>
          <p>A look at what our teams have shipped, written, and announced recently.</p>
        </div>

        <div className="highlights__grid">
          {/* 1) Funding announcement */}
          <a
            className="highlight"
            href="https://indianstartupnews.com/funding/chennai-based-deeptech-startup-reneonix-raises-rs-17-crore-from-inflection-point-ventures-11157075"
            target="_blank"
            rel="noopener"
          >
            <div className="highlight__img highlight__img--photo">
              <img
                src="/richard-reneonix.png"
                alt="Richard, Founder of Reneonix"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="highlight__body">
              <img src="/isn.png" alt="Indian Startup News" className="highlight__source-badge" loading="lazy" />
              <span className="highlight__tag">Funding · In the Press</span>
              <h3>Reneonix raises ₹1.7 crore from Inflection Point Ventures</h3>
              <p>
                Indian Startup News covers our latest funding round backing Reneonix's
                deeptech mission to transform the material reuse and recycling ecosystem.
              </p>
              <span className="highlight__meta">
                Read on Indian Startup News
                <ArrowRight size={14} />
              </span>
            </div>
          </a>

          {/* 2) YouTube #1 */}
          <a className="highlight" href="https://www.youtube.com/watch?v=F31IlaSo1_8" target="_blank" rel="noopener">
            <div className="highlight__img highlight__img--video">
              <img src="https://img.youtube.com/vi/F31IlaSo1_8/hqdefault.jpg" alt="Reneonix on YouTube" loading="lazy" />
              <div className="highlight__play">
                <span>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="highlight__body">
              <span className="highlight__tag">Video · YouTube</span>
              <h3>Reneonix featured: building a circular materials economy</h3>
              <p>
                Watch the team walk through how Reneonix is using hardware, software, and
                material science to power a smarter, traceable recovery ecosystem.
              </p>
              <span className="highlight__meta">
                Watch on YouTube <Arrow />
              </span>
            </div>
          </a>

          {/* 3) YouTube #2 */}
          <a className="highlight" href="https://www.youtube.com/watch?v=hXbU8nLBLGY" target="_blank" rel="noopener">
            <div className="highlight__img highlight__img--video">
              <img src="https://img.youtube.com/vi/hXbU8nLBLGY/hqdefault.jpg" alt="Reneonix on YouTube" loading="lazy" />
              <div className="highlight__play">
                <span>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="highlight__body">
              <span className="highlight__tag">Video · YouTube</span>
              <h3>Inside Reneonix: tech for material reuse &amp; sustainability</h3>
              <p>
                A closer look at how Reneonix's platform connects recyclers, manufacturers,
                municipalities, and brands across the recovery lifecycle.
              </p>
              <span className="highlight__meta">
                Watch on YouTube <Arrow />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
