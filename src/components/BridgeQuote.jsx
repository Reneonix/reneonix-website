import { useEffect, useRef, useState } from 'react';
import './BridgeQuote.css';

// Hand-painted brush-stroke pull-quote divider, shared across the blog
// article pages (MRM, TraceOS, Foam Glass, Resource Recovery). The blob
// path is intentionally generic (not shaped to any one quote's text) and
// stretches via preserveAspectRatio="none" to fill whatever height each
// card ends up at.
const BRUSH_PATH = 'M 55,470 C 90,410 150,380 210,395 C 270,340 350,300 430,300 C 500,255 600,235 690,245 C 780,215 890,215 985,240 C 1080,225 1180,235 1265,270 C 1330,255 1395,270 1435,315 C 1470,350 1478,395 1455,430 C 1480,460 1478,500 1450,525 C 1478,555 1470,600 1435,625 C 1400,665 1345,690 1280,685 C 1220,720 1130,735 1040,725 C 950,745 850,748 760,732 C 660,748 560,742 470,720 C 390,735 310,720 255,685 C 190,700 125,675 95,625 C 55,600 45,550 65,510 C 45,500 45,485 55,470 Z';

// Rendered once per page — defines the filter every BridgeQuote instance
// on that page references by id, so the (identical) filter isn't
// duplicated in the DOM for each quote.
export function BrushFilterDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="brush-quote-filter" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.022" numOctaves="4" seed="11" result="edgeNoise" />
          <feDisplacementMap in="SourceGraphic" in2="edgeNoise" scale="46" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feTurbulence type="turbulence" baseFrequency="0.004 0.09" numOctaves="2" seed="5" result="texNoise" />
          <feColorMatrix in="texNoise" type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.16 0" result="texWhite" />
          <feComposite in="texWhite" in2="displaced" operator="in" result="texMasked" />
          <feTurbulence type="turbulence" baseFrequency="0.006 0.11" numOctaves="2" seed="19" result="shadeNoise" />
          <feColorMatrix in="shadeNoise" type="matrix"
            values="0 0 0 0 0.35
                    0 0 0 0 0.55
                    0 0 0 0 0.05
                    0 0 0 0.12 0" result="shadeGreen" />
          <feComposite in="shadeGreen" in2="displaced" operator="in" result="shadeMasked" />
          <feMerge result="painted">
            <feMergeNode in="displaced" />
            <feMergeNode in="shadeMasked" />
            <feMergeNode in="texMasked" />
          </feMerge>
          <feDropShadow in="painted" dx="0" dy="10" stdDeviation="16" floodColor="#2b2a1f" floodOpacity="0.22" />
        </filter>
      </defs>
    </svg>
  );
}

export default function BridgeQuote({ children }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const vh = window.innerHeight;
    const { top, bottom } = el.getBoundingClientRect();
    if (top < vh && bottom > 0) { setInView(true); return undefined; }

    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`bq-wrap${inView ? ' bq-in' : ''}`}>
      <div className="bq-card">
        <svg className="bq-brush" viewBox="0 0 1536 1024" preserveAspectRatio="none" aria-hidden="true">
          <path d={BRUSH_PATH} transform="translate(0 512) scale(1 1.783) translate(0 -481.5)" filter="url(#brush-quote-filter)" />
        </svg>
        <span className="bq-mark bq-mark--open" aria-hidden="true">&#8220;</span>
        <p className="bq-text">{children}</p>
        <span className="bq-mark bq-mark--close" aria-hidden="true">&#8221;</span>
      </div>
    </div>
  );
}
