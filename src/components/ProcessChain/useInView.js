import { useEffect, useState } from 'react';

/**
 * Fire-once IntersectionObserver hook. Takes an existing ref (rather than
 * creating one) so a single observed element can also be used for other
 * purposes by its owner — e.g. the ProcessChain root, which needs the DOM
 * node for its own layout as well as for view-detection.
 */
export default function useInView(ref, { threshold = 0.25, root = null, rootMargin = '0px' } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, root, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, threshold, root, rootMargin, inView]);

  return inView;
}
