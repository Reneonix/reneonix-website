import { useEffect, useRef, useState } from 'react';
import './HorizontalScroll.css';

/**
 * HorizontalScroll
 * ----------------
 * Vertical scroll inside the section is converted into a horizontal
 * translate of the card row. A counter (01 / 04) tracks progress.
 *
 * How it works
 *  - Outer wrapper has a tall height so the section provides scroll
 *    runway (heightVH * items.length).
 *  - Inner `__pin` uses position: sticky to stick to the viewport
 *    while we're scrolling through the wrapper.
 *  - As the wrapper crosses the viewport, we compute a 0..1 progress
 *    and translate the track horizontally by `-(progress * maxTrans)`.
 *
 * On touch / small screens the effect is disabled (CSS fallback
 * gives a native horizontal swipe).
 */
export default function HorizontalScroll({ items, heightPerItemVH = 100 }) {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const [index, setIndex] = useState(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!wrapper || !track || !pin) return;

    // Skip the pinned-translate effect on small / touch screens (CSS handles fallback).
    const isSmall = () => window.innerWidth <= 900;
    let ticking = false;
    let lastIndex = 1;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (isSmall()) {
          track.style.transform = '';
          return;
        }
        const rect = wrapper.getBoundingClientRect();
        const wrapperHeight = wrapper.offsetHeight;
        const viewportHeight = window.innerHeight;

        // How far we've scrolled INTO the wrapper, clamped to [0, range].
        const range = wrapperHeight - viewportHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), range);
        const progress = range > 0 ? scrolled / range : 0;

        const trackWidth = track.scrollWidth;
        const maxTrans = Math.max(0, trackWidth - pin.clientWidth);
        const tx = -progress * maxTrans;
        track.style.transform = `translate3d(${tx}px, 0, 0)`;

        const nextIdx = Math.min(items.length, Math.floor(progress * items.length) + 1);
        if (nextIdx !== lastIndex) {
          lastIndex = nextIdx;
          setIndex(nextIdx);
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items.length]);

  const total = String(items.length).padStart(2, '0');
  const current = String(index).padStart(2, '0');

  return (
    <div
      ref={wrapperRef}
      className="hscroll"
      style={{ height: `${heightPerItemVH * items.length}vh` }}
    >
      <div ref={pinRef} className="hscroll__pin">
        <div className="hscroll__viewport">
          <div ref={trackRef} className="hscroll__track">
            {items.map(({ src, caption, imgStyle }, i) => (
              <article className="hscroll__card" key={src || i}>
                <img
                  src={src}
                  alt={caption || `Slide ${i + 1}`}
                  loading="lazy"
                  draggable="false"
                  style={imgStyle}
                />
                {caption && <p className="hscroll__caption">{caption}</p>}
              </article>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
