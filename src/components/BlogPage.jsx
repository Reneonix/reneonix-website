import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Search, Calendar, ArrowRight, FlaskConical,
  Layers, Cpu, Users, Sparkles, Award,
} from 'lucide-react';
import { navClick } from '../utils/nav.js';
import './BlogPage.css';

const ARTICLES = [
  {
    id: 'mrm',
    slug: 'mrm-ai-front-end-recovery',
    chip: 'Technology',
    img: '/wireframe-mrm.png',
    title: 'MRM (AI): The Next-Gen Front-End Recovery for Circular Materials',
    // Shown in the search-bar dropdown instead of the full title — that
    // list needs to stay scannable at a glance, not read like the headline.
    shortTitle: 'MRM (AI): The Next-Gen...',
    excerpt: 'How our AI-powered Material Recovery Machine identifies, grades and separates materials at the source with high precision.',
    date: 'May 8, 2026',
  },
  {
    id: 'vision-sorting',
    slug: 'ai-vision-sorting-glass-classification',
    chip: 'Technology',
    img: '/wireframe-sorter.png',
    title: 'AI Vision Sorting: Delivering 98% Accuracy in Glass Classification',
    shortTitle: 'AI Vision Sorting...',
    excerpt: 'Inside our AI sorting module that detects colour, brand and impurities - enabling high-value recovery and reuse.',
    date: 'April 28, 2026',
  },
  {
    id: 'traceos',
    slug: 'traceos-retraiz-traceability',
    chip: 'Traceability',
    img: '/wireframe-retriaz.png',
    title: 'TraceOS (Retraiz): Building Trust Through End-to-End Traceability',
    shortTitle: 'TraceOS (Retraiz)...',
    excerpt: 'How our traceability platform ensures batch-level visibility, EPR compliance and real-time operational intelligence.',
    date: 'April 15, 2026',
  },
  {
    id: 'foam-glass',
    slug: 'foam-glass-insulation',
    chip: 'Material Science',
    img: '/wireframe-ms.png',
    title: 'From Glass Fines to Foam Glass Insulation: Creating New Value',
    shortTitle: 'Foam Glass Insulation...',
    excerpt: 'Turning low-value residuals into high-performance building materials through material science innovation.',
    date: 'March 30, 2026',
  },
  {
    id: 'integrated-infra',
    slug: 'future-of-resource-recovery',
    chip: 'Industry Insight',
    img: '/wireframe-resource recovery.png',
    title: 'The Future of Resource Recovery: Why Integrated Infrastructure and Verified Data Matter',
    shortTitle: 'Future of Resource Recovery...',
    excerpt: 'Why integrated AI + hardware platforms and verified data - not fragmented recycling solutions - define the next era of industrial responsibility.',
    date: 'March 20, 2026',
  },
];

const JOURNEY_UPDATES = [
  { icon: Award,        title: 'Exhibition Participation', desc: 'Reneonix participated in IFAT India 2026 showcasing our AI-powered solutions.', date: 'May 20, 2026' },
  { icon: Cpu,          title: 'Prototype Testing',        desc: 'Advanced prototypes tested for high-precision material recognition.',           date: 'April 12, 2026' },
  { icon: FlaskConical, title: 'Research Collaboration',   desc: 'New collaboration with leading institutions on material innovation.',            date: 'March 28, 2026' },
  { icon: Layers,       title: 'New Lab Setup',            desc: 'AI & Material Science lab established for advanced R&D.',                        date: 'March 05, 2026' },
  { icon: Users,        title: 'Team Expansion',           desc: 'Welcoming new experts in AI, robotics and material science.',                    date: 'Feb 18, 2026' },
  { icon: Sparkles,     title: 'Technology Milestone',     desc: 'Achieved 98%+ accuracy in multi-material classification.',                       date: 'Jan 30, 2026' },
];

export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestRect, setSuggestRect] = useState(null);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const q = query.trim().toLowerCase();
  const visibleArticles = q
    ? ARTICLES.filter((a) => `${a.title} ${a.excerpt} ${a.chip}`.toLowerCase().includes(q))
    : ARTICLES;

  // Title-only match for the search-bar dropdown — shows every article on
  // focus (empty query), narrows as the user types. Separate from
  // visibleArticles above, which matches title+excerpt+chip for the grid.
  const suggestions = q ? ARTICLES.filter((a) => a.title.toLowerCase().includes(q)) : ARTICLES;

  // The dropdown is rendered through a portal straight into <body> — the
  // hero section has overflow:hidden (needed to crop its background photo),
  // which was silently clipping the bottom of the in-place dropdown so only
  // ~3 of the 5 suggestions were ever visible. Portaling escapes that, but
  // then position has to be computed manually against the search bar's own
  // rect instead of relying on CSS position:absolute within the form.
  function measureAndOpen() {
    const r = searchRef.current?.getBoundingClientRect();
    if (r) setSuggestRect({ top: r.bottom + 8, left: r.left, width: r.width });
    setSuggestOpen(true);
  }

  useEffect(() => {
    if (!suggestOpen) return undefined;
    function reposition() {
      const r = searchRef.current?.getBoundingClientRect();
      if (r) setSuggestRect({ top: r.bottom + 8, left: r.left, width: r.width });
    }
    // A click on a suggestion lands in the portal (a sibling of <body>'s
    // other content, not a DOM descendant of the search form), so both
    // refs have to be checked before treating it as an "outside" click.
    function onDocMouseDown(e) {
      const inSearch = searchRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inSearch && !inDropdown) setSuggestOpen(false);
    }
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    document.addEventListener('mousedown', onDocMouseDown);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
      document.removeEventListener('mousedown', onDocMouseDown);
    };
  }, [suggestOpen]);

  return (
    <>
      {/* =============== HERO =============== */}
      <section className="bp-hero" aria-labelledby="blogTitle">
        <div className="bp-hero__bg">
          <img src="/blog hero.jpeg" alt="" loading="eager" decoding="async" />
          <div className="bp-hero__bg-veil" />
        </div>
        <div className="container bp-hero__inner">
          <div className="bp-hero__copy">
            <h1 id="blogTitle">Blogs &amp; Insights</h1>
            <p className="bp-hero__lead">
              Explore the latest insights, research, and industry updates from our journey in
              AI, automation, machine vision and material science.
            </p>

            <form className="bp-search" role="search" ref={searchRef} onSubmit={(e) => e.preventDefault()}>
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search articles..."
                aria-label="Search articles"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={measureAndOpen}
                onKeyDown={(e) => { if (e.key === 'Escape') setSuggestOpen(false); }}
                role="combobox"
                aria-expanded={suggestOpen}
                aria-controls="bpSearchSuggest"
                aria-autocomplete="list"
              />
            </form>

            {suggestOpen && suggestRect && createPortal(
              <ul
                className="bp-search-suggest" id="bpSearchSuggest" role="listbox" ref={dropdownRef}
                style={{ top: suggestRect.top, left: suggestRect.left, width: suggestRect.width }}
              >
                {suggestions.length > 0 ? (
                  suggestions.map((a) => (
                    <li key={a.id} role="option" aria-selected="false">
                      <a
                        href={`/blog/${a.slug}`}
                        onClick={(e) => { navClick(`/blog/${a.slug}`)(e); setSuggestOpen(false); }}
                      >
                        <span className="bp-search-suggest__tag">{a.chip}</span>
                        <span className="bp-search-suggest__title">{a.shortTitle || a.title}</span>
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="bp-search-suggest__empty">No articles found</li>
                )}
              </ul>,
              document.body
            )}
          </div>
        </div>
      </section>

      {/* =============== LATEST ARTICLES =============== */}
      <section className="section bp-articles" id="latest-articles" aria-labelledby="latestArticlesTitle">
        <div className="container">
          <div className="section-head">
            <h2 id="latestArticlesTitle">Featured Articles</h2>
            <p>Updates, learnings and insights from our research and development journey.</p>
          </div>

          {visibleArticles.length > 0 ? (
            <div className="bp-articles__grid stagger in">
              {visibleArticles.map((a) => {
                const Icon = a.icon;
                return (
                  <a
                    className="bp-card"
                    key={a.id}
                    href={a.slug ? `/blog/${a.slug}` : '#'}
                    onClick={a.slug ? navClick(`/blog/${a.slug}`) : (e) => e.preventDefault()}
                    aria-label={`Read more: ${a.title}`}
                  >
                    {a.img ? (
                      <div className="bp-card__bg" role="img" aria-label={a.title} style={{ backgroundImage: `url('${a.img}')` }} />
                    ) : (
                      <div className={`bp-card__bg bp-card__bg--placeholder bp-card__bg--${a.tone}`} aria-hidden="true">
                        {Icon && <Icon className="bp-card__watermark" size={90} strokeWidth={1.25} />}
                      </div>
                    )}
                    <div className="bp-card__content">
                      <span className="bp-card__tag">{a.chip}</span>
                      <h3>{a.title}</h3>
                      <span className="bp-read-more">
                        Read More <ArrowRight size={15} />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="bp-articles__empty" role="status">
              No articles found for “<strong>{query.trim()}</strong>”. Try a different keyword —
              e.g. <em>AI</em>, <em>glass</em>, <em>traceability</em>.
            </div>
          )}
        </div>
      </section>

      {/* =============== OUR JOURNEY / UPDATES =============== */}
      <section className="section section-dark bp-journey" aria-labelledby="journeyTitle">
        <div className="container">
          <div className="section-head">
            <h2 id="journeyTitle">Our Journey / Updates</h2>
            <p>A glimpse of what we are working on and where we are heading.</p>
          </div>

          <div className="bp-journey__grid stagger in">
            {JOURNEY_UPDATES.map(({ icon: Icon, title, desc, date }) => (
              <div className="bp-update-card" key={title}>
                <div className="bp-update-card__icon"><Icon size={22} /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="bp-update-card__date"><Calendar size={12} />{date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== CTA =============== */}
      <section className="section bp-cta-section" aria-labelledby="blogCtaTitle">
        <div className="container">
          <div className="bp-cta-banner">
            <div className="bp-cta-banner__copy">
              <h2 id="blogCtaTitle">Have an idea or a project in mind?</h2>
              <p>Let's discuss how we can collaborate and build smarter solutions together.</p>
            </div>
            <a className="btn btn-primary" href="/contact-us" onClick={navClick('/contact-us')}>
              Contact Us <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
