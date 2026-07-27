import { useRef } from 'react';
import useInView from './useInView';
import './ProcessSection.css';

/**
 * Generic section shell for a ProcessChain: eyebrow → heading → intro →
 * (chain, passed as children) → stat-punch line → closing paragraph.
 * `tone` only switches the accent palette — the Challenge/Solution copy,
 * and which ProcessChain `variant` sits inside, are entirely up to the
 * caller, which is why ChallengeSection/SolutionSection below are just
 * `tone` presets rather than separate implementations.
 */
export default function ProcessSection({
  tone = 'challenge',
  eyebrow,
  heading,
  intro,
  statPunch,
  closing,
  children,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.25 });

  return (
    <section
      ref={ref}
      className={`ps-section ps-section--${tone}${inView ? ' is-in' : ''}`}
    >
      <div className="container ps-section__inner">
        {eyebrow && (
          <span className="ps-eyebrow ps-reveal" style={{ transitionDelay: '0s' }}>
            {eyebrow}
          </span>
        )}
        {heading && (
          <h2 className="ps-heading ps-reveal" style={{ transitionDelay: '.08s' }}>
            {heading}
          </h2>
        )}
        {intro && (
          <p className="ps-intro ps-reveal" style={{ transitionDelay: '.16s' }}>
            {intro}
          </p>
        )}

        {children && <div className="ps-chain-slot">{children}</div>}

        {statPunch && (
          <p className="ps-stat-punch ps-reveal" style={{ transitionDelay: '1.5s' }}>
            {statPunch}
          </p>
        )}
        {closing && (
          <p className="ps-closing ps-reveal" style={{ transitionDelay: '1.7s' }}>
            {closing}
          </p>
        )}
      </div>
    </section>
  );
}

export function ChallengeSection(props) {
  return <ProcessSection tone="challenge" {...props} />;
}

export function SolutionSection(props) {
  return <ProcessSection tone="solution" {...props} />;
}
