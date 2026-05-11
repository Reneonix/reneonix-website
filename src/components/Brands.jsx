import useInView from '../hooks/useInView.js';

const BRANDS = [
  { src: '/startup-tn-color.png', alt: 'StartupTN · Government of Tamil Nadu' },
  { src: '/nvidia-color.png', alt: 'NVIDIA Inception Program' },
  { src: '/dpiit-color.png', alt: 'DPIIT · Startup India' },
  { src: '/itel-color.png', alt: 'ITEL' },
  { src: '/dst-color.png', alt: 'Department of Science & Technology · NIDHI' },
  { src: '/itnt-color.png', alt: 'iTNT Hub' },
  { src: '/anna-color.png', alt: 'Anna Incubator' },
  { src: '/nsrcel-color.png', alt: 'NSRCEL · IIMB' },
  { src: '/ciic-color.png', alt: 'Crescent Innovation Incubation Council' },
];

export default function Brands() {
  const [ref, inView] = useInView();

  return (
    <section className={`brands${inView ? ' is-in' : ''}`} ref={ref}>
      <div className="container">
        <div className="brands__title">Trusted and backed up by</div>
      </div>
      <div className="marquee" style={{ '--marquee-speed': '46s' }}>
        <div className="marquee__track">
          {BRANDS.map((b) => (
            <span key={b.src} className="marquee__pill">
              <img src={b.src} alt={b.alt} loading="lazy" />
            </span>
          ))}
          {/* duplicate set for seamless loop */}
          {BRANDS.map((b) => (
            <span key={`dup-${b.src}`} className="marquee__pill" aria-hidden="true">
              <img src={b.src} alt="" loading="lazy" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
