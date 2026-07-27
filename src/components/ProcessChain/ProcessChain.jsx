import { Fragment, createElement, isValidElement, useEffect, useId, useRef, useState } from 'react';
import useInView from './useInView';
import './ProcessChain.css';

// Fixed 5-slot styling cycle for the "broken" variant — each node reads as
// if a different, uncoordinated company owns it. Cycles via index % length
// so the component still degrades sensibly if more/fewer steps are passed.
const BROKEN_NODE_STYLE = [
  { tint: 'a', border: 'solid', tilt: 0 },
  { tint: 'b', border: 'dashed', tilt: -2 },
  { tint: 'c', border: 'solid', tilt: 0 },
  { tint: 'd', border: 'dotted', tilt: 2 },
  { tint: 'e', border: 'solid', tilt: 0 },
];

const NODE_STEP_DELAY = 0.14; // seconds between each node's reveal, by index
const ARROW_OFFSET = 0.17; // seconds after its preceding node that a connector starts drawing
const REVEAL_DURATION = 0.55; // seconds — matches the CSS transition duration below

function renderIcon(icon) {
  if (icon == null) return null;
  // Accept either an already-built element (<svg>…</svg>) or a component
  // reference — function component, or a forwardRef/memo object (e.g. any
  // lucide-react icon) — keeps the steps array free to hand over either shape.
  if (isValidElement(icon)) return icon;
  return createElement(icon, { 'aria-hidden': true, focusable: 'false' });
}

function Connector({ index, variant, inView }) {
  const uid = useId();
  const maskId = `pc-reveal-${uid}`;
  const trackRef = useRef(null);
  const [travel, setTravel] = useState(60);

  // Measures the connector's actual rendered width so the flow/leak dots'
  // translateX keyframes travel the real distance — connectors sit in a
  // flex:1 track whose width depends on viewport and step count, so a
  // hardcoded px distance would drift out of sync with the drawn line.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setTravel(Math.max(width - 14, 18));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const drawDelay = index * NODE_STEP_DELAY + ARROW_OFFSET;
  const dotDelay = drawDelay + REVEAL_DURATION;

  return (
    <div
      className="pc-connector"
      ref={trackRef}
      style={{ '--pc-travel': `${travel}px` }}
      aria-hidden="true"
    >
      <svg className="pc-connector__svg" viewBox="0 0 100 24" preserveAspectRatio="none">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="24">
            <rect x="0" y="0" width="100" height="24" fill="#000" />
            <path
              className="pc-connector__reveal"
              d="M0 12 H100"
              stroke="#fff"
              strokeWidth="24"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={inView ? 0 : 100}
              style={{ transitionDelay: `${drawDelay}s` }}
            />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          <path className="pc-connector__line" d="M2 12 H82" pathLength="100" />
          <path className="pc-connector__head" d="M78 4 L96 12 L78 20 Z" />
        </g>
      </svg>

      {variant === 'healed' && (
        <span className="pc-connector__flow" style={{ animationDelay: `${dotDelay}s` }} />
      )}
      {variant === 'broken' && (
        <span className="pc-connector__leak" style={{ animationDelay: `${dotDelay}s` }} />
      )}
    </div>
  );
}

// Once the whole chain has drawn in, each node's tooltip auto-plays a
// single "ghost hover" preview in sequence — this is the cue that tells a
// user who never touches their mouse that these nodes ARE hoverable, before
// they've hovered anything. Real hover/focus behaves exactly as before.
const PREVIEW_STAGGER = 0.5; // seconds between each node's ghost-hover preview

function Node({ step, index, total, variant, pulse }) {
  const uid = useId();
  const tooltipId = `pc-tooltip-${uid}`;
  const nodeDelay = index * NODE_STEP_DELAY;
  const pulseDelay = nodeDelay + REVEAL_DURATION + 0.15;
  const chainSettleTime = (total - 1) * NODE_STEP_DELAY + ARROW_OFFSET + REVEAL_DURATION;
  const previewDelay = chainSettleTime + 0.3 + index * PREVIEW_STAGGER;
  const style = variant === 'broken' ? BROKEN_NODE_STYLE[index % BROKEN_NODE_STYLE.length] : null;

  const circleClass = [
    'pc-node__circle',
    style && `pc-node__circle--${style.tint}`,
    style && `pc-node__circle--${style.border}`,
    pulse && 'pc-node__circle--pulse',
    step.tooltip && 'pc-node__circle--has-tip',
  ].filter(Boolean).join(' ');

  return (
    <div
      className="pc-node"
      role="listitem"
      style={{
        transitionDelay: `${nodeDelay}s`,
        '--pc-tilt': style ? `${style.tilt}deg` : '0deg',
        '--pc-pulse-delay': `${pulseDelay}s`,
        '--pc-preview-delay': `${previewDelay}s`,
      }}
    >
      <div
        className={circleClass}
        tabIndex={0}
        aria-label={step.label}
        aria-describedby={step.tooltip ? tooltipId : undefined}
      >
        <span className="pc-node__icon">{renderIcon(step.icon)}</span>
        {step.tooltip && (
          <span className="pc-node__tooltip" role="tooltip" id={tooltipId}>
            {step.tooltip}
          </span>
        )}
      </div>
      <span className="pc-node__label">{step.label}</span>
    </div>
  );
}

/**
 * Animated 5-step (or N-step) process chain. Purely data-driven: every
 * label/icon/tooltip comes from `steps`, so the same component renders the
 * fragmented "broken" chain in a Challenge section and the connected
 * "healed" chain in a Solution section just by swapping `variant` + data.
 */
export default function ProcessChain({ variant = 'healed', steps = [] }) {
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { threshold: 0.25 });

  return (
    <div
      ref={rootRef}
      className={`pc-chain pc-chain--${variant}${inView ? ' is-in' : ''}`}
      role="list"
      aria-label={variant === 'broken' ? 'Fragmented recovery chain' : 'Connected recovery chain'}
    >
      {steps.map((step, i) => (
        <Fragment key={step.id}>
          <Node step={step} index={i} total={steps.length} variant={variant} pulse={i === 0} />
          {i < steps.length - 1 && <Connector index={i} variant={variant} inView={inView} />}
        </Fragment>
      ))}
    </div>
  );
}
