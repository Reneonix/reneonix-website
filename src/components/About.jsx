import { Settings2, BrainCircuit, UsersRound, Recycle } from 'lucide-react';

const VALUES = [
  { Icon: Settings2, title: 'Engineering-first execution', body: 'We build practical systems for real-world waste streams.' },
  { Icon: BrainCircuit, title: 'Material intelligence', body: 'Every material movement becomes measurable and traceable.' },
  { Icon: UsersRound, title: 'Industry partnerships', body: 'We work with manufacturers, labs, and recovery networks.' },
  { Icon: Recycle, title: 'Beyond recycling', body: 'We convert waste streams into engineered circular materials.' },
];

export default function About() {
  return (
    <section className="section section-dark" id="about">
      <div className="container">
        <div className="about__wrap">
          <span className="eyebrow on-dark">About Us</span>
          <h2 className="about__head">
            We are building the infrastructure for <em>material circularity.</em>
          </h2>
          <div className="about__body">
            <p>
              Reneonix is a material circularity deeptech company founded in Chennai in 2023.
              We combine hardware, software, and material science to transform fragmented
              post-consumer waste into quality-controlled, traceable, industry-ready raw
              materials.
            </p>
            <p>
              We work with industries, recyclers, institutions, and material recovery
              partners to build systems that can collect, sort, process, trace, and validate
              recovered materials at scale.
            </p>
          </div>
          <div className="about__values">
            {VALUES.map(({ Icon, title, body }) => (
              <div className="value" key={title}>
                <span className="value__icon">
                  <Icon size={22} />
                </span>
                <div className="value__text">
                  <strong>{title}</strong>
                  <span>{body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
