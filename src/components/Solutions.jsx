import { useEffect, useRef } from 'react';
import {
  Package,
  Eye,
  RadioTower,
  Layers3,
  MapPin,
  BarChart3,
  BrainCircuit,
  FileBarChart,
  Link2,
  Database,
  FlaskConical,
  Layers,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ScrollStack.jsx';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function FeatureRow({ Icon, title, body, listClass = 'zz-iconfeats' }) {
  const itemClass = listClass === 'zz-iconfeats' ? 'zz-iconfeats__icon' : 'sw-flist__icon';
  const textWrapClass = listClass === 'zz-iconfeats' ? 'zz-iconfeats__text' : 'sw-flist__text';
  return (
    <li>
      <span className={itemClass}>
        <Icon size={22} />
      </span>
      <div className={textWrapClass}>
        <strong>{title}</strong>
        <span>{body}</span>
      </div>
    </li>
  );
}

/** Adds .is-in once the row scrolls into view (reuses the original CSS animations). */
function ZzRow({ className = '', children }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return (
    <article className={`zz-row ${className}`.trim()} data-zz ref={ref}>
      {children}
    </article>
  );
}

export default function Solutions() {
  return (
    <section className="section section-paper-grad" id="solutions">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow eyebrow--lg">Our Solution</span>
          <h2>
            Three layers, <em>one circular system</em>.
          </h2>
          <p>
            From the bin on the street to the regenerated material that goes back into a
            product — Reneonix unifies hardware, software, and material science into a
            single circular-economy platform.
          </p>
        </div>

        <ScrollStack
          className="solutions-stack"
          useWindowScroll
          /* Mirrors the React Bits demo behavior:
             - Cards sized to fit on screen (≈ 75vh, constrained in CSS)
             - Default-ish stacking values give the deck-of-cards feel
             - Each card scales from 85% → 100% as it becomes the active one */
          itemDistance={100}
          itemStackDistance={30}
          stackPosition="20%"
          scaleEndPosition="10%"
          baseScale={0.85}
          itemScale={0.03}
        >
        <ScrollStackItem itemClassName="solutions-stack__card">
          {/* 1. HARDWARE LAYER */}
          <ZzRow>
            <div className="zz-row__copy">
              <span className="zz-row__step">
                <b>01</b> Hardware Layer
              </span>
              <h3>
                Industrial hardware for <em>material recovery.</em>
              </h3>
              <p className="lead">
                Reneonix builds modular hardware systems that sort, process, and prepare
                post-consumer waste into industry-ready raw materials.
              </p>
              <ul className="zz-iconfeats">
                <FeatureRow Icon={Package} title="Modular recovery systems" body="Collection, sorting, shredding, sieving, and preprocessing." />
                <FeatureRow Icon={Eye} title="Vision-based sorting" body="Material identification and separation infrastructure." />
                <FeatureRow Icon={RadioTower} title="Live process monitoring" body="Sensors for quality control and operational visibility." />
                <FeatureRow Icon={Layers3} title="Multi-material ready" body="Built for glass, plastics, textiles, paper, and aluminium." />
              </ul>
              <a href="#" className="zz-row__cta-btn">
                Explore hardware <Arrow />
              </a>
            </div>
            <div className="zz-row__media">
              <div className="zz-row__media-inner">
                <span className="zz-row__media-tag">Hardware · Live</span>
                <img src="/hardware-flow.png" alt="Reneonix hardware processing flow" loading="lazy" />
              </div>
            </div>
          </ZzRow>
        </ScrollStackItem>

        <ScrollStackItem itemClassName="solutions-stack__card">
          {/* 2. SOFTWARE LAYER */}
          <ZzRow className="zz-row--reverse zz-row--sw">
            <div className="zz-row__media">
              <div className="zz-row__media-inner">
                <span className="zz-row__media-tag">Software · Trace OS</span>
                <img
                  src="/software.png"
                  alt="Reneonix software dashboard for material traceability"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="zz-row__copy">
              <span className="zz-row__step">
                <b>02</b> Software Layer
              </span>
              <h3>
                Software that makes <em>circularity measurable.</em>
              </h3>
              <p className="lead">
                Reneonix connects material movement, traceability, quality, and impact data
                in one decision-ready system.
              </p>
              <ul className="sw-flist">
                <FeatureRow Icon={MapPin} title="Material traceability" body="Track source to final dispatch." listClass="sw-flist" />
                <FeatureRow Icon={BarChart3} title="Live dashboards" body="Quantity, quality, and contamination data." listClass="sw-flist" />
                <FeatureRow Icon={BrainCircuit} title="AI decision support" body="Sorting, grading, and process insights." listClass="sw-flist" />
                <FeatureRow Icon={FileBarChart} title="Impact reporting" body="EPR, recycled-content, and carbon data." listClass="sw-flist" />
              </ul>

              <div className="ms-stats">
                <div className="ms-stat">
                  <span className="ms-stat__icon"><MapPin size={32} /></span>
                  <strong>Live</strong>
                  <span>Material Visibility</span>
                </div>
                <div className="ms-stat">
                  <span className="ms-stat__icon"><Link2 size={32} /></span>
                  <strong>Traceable</strong>
                  <span>Source to Output</span>
                </div>
                <div className="ms-stat">
                  <span className="ms-stat__icon"><Database size={32} /></span>
                  <strong>Decision-ready</strong>
                  <span>Data Layer</span>
                </div>
              </div>

              <a href="#" className="zz-row__cta">
                Explore software <Arrow />
              </a>
            </div>
          </ZzRow>
        </ScrollStackItem>

        <ScrollStackItem itemClassName="solutions-stack__card">
          {/* 3. MATERIAL SCIENCE */}
          <ZzRow className="zz-row--ms">
            <div className="zz-row__copy">
              <span className="zz-row__step">
                <b>03</b> Material Science
              </span>
              <h3>
                Material science for <em>higher-value products.</em>
              </h3>
              <p className="lead">
                Reneonix tests, validates, and engineers recovered materials into reliable
                industrial applications.
              </p>
              <ul className="zz-iconfeats">
                <FeatureRow Icon={FlaskConical} title="Material testing" body="Composition, contamination, particle size, performance." />
                <FeatureRow Icon={Layers} title="Product development" body="Cullet, glass sand, foam glass, tiles, panels, and more." />
                <FeatureRow Icon={ShieldCheck} title="Industrial validation" body="Strength, thermal behaviour, purity, consistency." />
                <FeatureRow Icon={UsersRound} title="R&D partnerships" body="Labs, industries, pilots, and commercialization." />
              </ul>
              <a href="#" className="zz-row__cta-btn">
                Explore our material lab <Arrow />
              </a>
            </div>
            <div className="zz-row__media">
              <div className="zz-row__media-inner">
                <span className="zz-row__media-tag">Material Lab · Live</span>
                <img
                  src="/material-science.png"
                  alt="Reneonix material science lab — recovered samples engineered into circular products"
                  loading="lazy"
                />
              </div>
            </div>
          </ZzRow>
        </ScrollStackItem>
        </ScrollStack>
      </div>
    </section>
  );
}
