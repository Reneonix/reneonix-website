import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import './BackToTop.css';

// Appears once the user has scrolled past one viewport height, on every
// page — mounted once in App.jsx rather than per-page, so no route needs
// its own copy of this logic.
const SHOW_AFTER_PX = 600;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' is-visible' : ''}`}
      onClick={handleClick}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <span className="back-to-top__icon"><ChevronUp size={18} strokeWidth={2.5} /></span>
      <span className="back-to-top__label">Back to top</span>
    </button>
  );
}
