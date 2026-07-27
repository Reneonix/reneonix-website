import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { SEARCH_INDEX, SEARCH_PAGES } from '../data/searchIndex.js';
import { navigate } from '../utils/nav.js';
import './SiteSearch.css';

// Cross-page navigation — identical to the pattern already used by
// Header's Dropdown and Footer's section links: if a section id is given
// and we're already on its page, scroll directly; otherwise stash the
// target in sessionStorage (App.jsx picks it up once the new page mounts)
// and navigate there.
function goToResult(result) {
  const { href, section } = result;
  if (section) {
    const currentPath = window.location.pathname;
    if (currentPath === href) {
      const el = document.getElementById(section);
      if (el) {
        const navH = document.querySelector('header')?.offsetHeight ?? 80;
        const y = el.getBoundingClientRect().top + window.pageYOffset - navH - 16;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
      return;
    }
    sessionStorage.setItem('sw_scroll_target', section);
  }
  navigate(href);
}

/**
 * <SiteSearch /> — a search icon button in the header that opens a
 * full-screen command-palette-style overlay. Every page/section in
 * src/data/searchIndex.js is searchable; before typing, the top-level
 * pages show as quick links. Selecting a result navigates there directly.
 */
export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const q = query.trim().toLowerCase();
  const results = q
    ? SEARCH_INDEX.filter((r) => `${r.title} ${r.keywords}`.toLowerCase().includes(q))
    : SEARCH_PAGES;

  const close = () => { setOpen(false); setQuery(''); setActiveIndex(0); };

  // Autofocus the input the moment the overlay mounts.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Reset keyboard selection whenever the visible result set changes, so
  // the highlighted row is never left pointing past the end of a shorter
  // filtered list.
  useEffect(() => { setActiveIndex(0); }, [q]);

  // Global Ctrl/Cmd+K opens the search from anywhere on the site, and
  // Escape closes it — standard command-palette conventions.
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape' && open) {
        close();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleSelect = (result) => {
    close();
    goToResult(result);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIndex]) handleSelect(results[activeIndex]);
    }
  };

  return (
    <>
      <button
        type="button"
        className="nav__search-btn"
        aria-label="Search the site"
        onClick={() => setOpen(true)}
      >
        <Search size={18} aria-hidden="true" />
      </button>

      {open && createPortal(
        <div className="site-search__backdrop" onMouseDown={close}>
          <div
            className="site-search__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="site-search__field">
              <Search size={19} aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                placeholder="Search Reneonix"
                aria-label="Search the site"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
              />
              <button type="button" className="site-search__close" aria-label="Close search" onClick={close}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {!q && <p className="site-search__subtitle">Search any topic, or jump to a page below</p>}

            {results.length > 0 ? (
              <ul className="site-search__results" role="listbox">
                {results.map((r, i) => (
                  <li key={r.href + (r.section || '')} role="option" aria-selected={i === activeIndex}>
                    <a
                      href={r.href}
                      className={i === activeIndex ? 'is-active' : ''}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={(e) => { e.preventDefault(); handleSelect(r); }}
                    >
                      {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="site-search__empty">No pages found for “{query.trim()}”.</p>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
