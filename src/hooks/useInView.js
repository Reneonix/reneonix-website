import { useEffect, useRef, useState } from 'react';

/**
 * IntersectionObserver hook — adds .is-in to the element once it scrolls
 * into view. Mirrors the pattern used in the original site so existing
 * `.is-in` CSS rules continue to work when the components are imported
 * with CSS modules.
 *
 * @param {Object} options - IntersectionObserver options
 * @returns {[React.MutableRefObject, boolean]}
 */
export default function useInView({
  threshold = 0.18,
  rootMargin = '0px 0px -40px 0px',
  once = true,
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
