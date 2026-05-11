const ROW1 = [
  { src: '/niti-aayog.jpg', alt: 'NITI Aayog · Atal Innovation Mission' },
  { src: '/dst-nidhi.jpg', alt: 'DST NIDHI' },
  { src: '/seed-fund-scheme.jpg', alt: 'Startup India Seed Fund Scheme' },
  { src: '/hdfc-bank.jpg', alt: 'HDFC Bank Parivartan' },
];

const ROW2 = [
  { src: '/tn-climate.jpg', alt: 'Tamil Nadu Climate Change Mission' },
  { src: '/sustain-tn.jpg', alt: 'SustainTN' },
  { src: '/ceramic-tech.png', alt: 'Department of Ceramic Technology, Anna University' },
  { src: '/pernod-ricard.jpg', alt: 'Pernod Ricard India' },
  { src: '/ipv.jpg', alt: 'Inflection Point Ventures' },
];

function PartnerRow({ tiles, reverse = false, speed }) {
  return (
    <div
      className={`marquee${reverse ? ' marquee--reverse' : ''}`}
      style={{ '--marquee-speed': speed, ...(reverse ? { marginTop: '16px' } : null) }}
    >
      <div className="marquee__track">
        {tiles.map((t) => (
          <div key={t.src} className="partner-tile">
            <img src={t.src} alt={t.alt} loading="lazy" />
          </div>
        ))}
        {tiles.map((t) => (
          <div key={`dup-${t.src}`} className="partner-tile" aria-hidden="true">
            <img src={t.src} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Investors() {
  return (
    <section className="section" id="investors">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Investors & Partners</span>
          <h2>
            Backed by leaders who build <em>for the long term</em>.
          </h2>
          <p>
            We're proud to partner with operators, researchers, and capital allocators who
            share our conviction that the next era of technology will be built on substance.
          </p>
        </div>
        <div className="partner-marquee">
          <PartnerRow tiles={ROW1} speed="42s" />
          <PartnerRow tiles={ROW2} reverse speed="48s" />
        </div>
      </div>
    </section>
  );
}
