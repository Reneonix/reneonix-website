import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function BounceCards({
  className = '',
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  cardSize = 200,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)',
  ],
  enableHover = false,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // repeat: -1 = infinite, repeatDelay: 3 = 3s hold after each play,
      // delay = initial delay before very first play only
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 3,
        delay: animationDelay,
      });
      tl.fromTo(
        '.bc-card',
        { scale: 0 },
        { scale: 1, stagger: animationStagger, ease: easeType }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  const getNoRotationTransform = (t) => {
    if (/rotate\([\s\S]*?\)/.test(t))
      return t.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    return t === 'none' ? 'rotate(0deg)' : `${t} rotate(0deg)`;
  };

  const getPushedTransform = (base, offsetX) => {
    const m = base.match(/translate\(([-0-9.]+)px\)/);
    if (m) {
      const newX = parseFloat(m[1]) + offsetX;
      return base.replace(/translate\(([-0-9.]+)px\)/, `translate(${newX}px)`);
    }
    return base === 'none' ? `translate(${offsetX}px)` : `${base} translate(${offsetX}px)`;
  };

  const pushSiblings = (hoveredIdx) => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);
    images.forEach((_, i) => {
      const sel = q(`.bc-card-${i}`);
      gsap.killTweensOf(sel);
      const base = transformStyles[i] || 'none';
      if (i === hoveredIdx) {
        gsap.to(sel, { transform: getNoRotationTransform(base), duration: 0.4, ease: 'back.out(1.4)', overwrite: 'auto' });
      } else {
        const offsetX = i < hoveredIdx ? -160 : 160;
        gsap.to(sel, {
          transform: getPushedTransform(base, offsetX),
          duration: 0.4,
          ease: 'back.out(1.4)',
          delay: Math.abs(hoveredIdx - i) * 0.05,
          overwrite: 'auto',
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);
    images.forEach((_, i) => {
      const sel = q(`.bc-card-${i}`);
      gsap.killTweensOf(sel);
      gsap.to(sel, { transform: transformStyles[i] || 'none', duration: 0.4, ease: 'back.out(1.4)', overwrite: 'auto' });
    });
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: containerWidth, height: containerHeight }}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`bc-card bc-card-${idx}`}
          style={{
            position: 'absolute',
            width: cardSize,
            aspectRatio: '1',
            border: '8px solid white',
            borderRadius: 30,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
            transform: transformStyles[idx] || 'none',
          }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
        >
          <img
            src={src}
            alt={`card-${idx}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none', userSelect: 'none' }}
          />
        </div>
      ))}
    </div>
  );
}
