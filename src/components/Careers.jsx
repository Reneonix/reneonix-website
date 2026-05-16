import { useMemo, useState, useEffect, useRef } from 'react';
import {
  Factory,
  Cpu,
  Sparkles,
  TrendingUp,
  Mail,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import './Careers.css';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Department → list of roles. Add/remove freely; UI is data-driven. */
const DEPARTMENT_ROLES = {
  Hardware: [
    'Mechanical Design Engineer',
    'Industrial Hardware Engineer',
    'Manufacturing Engineer',
    'CAD Designer',
  ],
  Software: [
    'Full Stack Developer',
    'Frontend Engineer',
    'Backend Engineer',
    'Blockchain Developer',
    'DevOps Engineer',
  ],
  'Material Science': [
    'Materials Research Scientist',
    'Polymer / Glass Chemist',
    'Lab Technician',
    'Material Validation Engineer',
  ],
};

const DEPARTMENTS = Object.keys(DEPARTMENT_ROLES);

const LIFE_GALLERY = [
  { src: '/life-photo-1.jpeg', caption: 'Life at Reneonix' },
  { src: '/life-photo-2.jpeg', caption: 'Life at Reneonix' },
  { src: '/life-photo-6.jpeg', caption: 'Life at Reneonix' },
  { src: '/life-photo-4.jpeg', caption: 'Life at Reneonix' },
  { src: '/life-photo-7.jpeg', caption: 'Life at Reneonix' },
  { src: '/life-photo-3.jpeg', caption: 'Life at Reneonix' },
  { src: '/life-photo-5.jpeg', caption: 'Life at Reneonix' },
];

const GROWTH = [
  {
    Icon: Factory,
    title: 'Industry-Focused Projects',
    body: 'Contribute to projects designed for real industrial and business applications.',
  },
  {
    Icon: Cpu,
    title: 'Multi-Technology Exposure',
    body: 'Explore AI, Embedded Systems, IoT, Material Science and Full-Stack Development.',
  },
  {
    Icon: Sparkles,
    title: 'Creative Freedom',
    body: 'Share ideas, experiment with solutions and participate in innovation-driven workflows.',
  },
  {
    Icon: TrendingUp,
    title: 'Career Advancement',
    body: 'Develop leadership, technical and problem-solving skills through impactful responsibilities.',
  },
];

function RolesPicker() {
  const [dept, setDept] = useState('');
  const [role, setRole] = useState('');

  const roleOptions = useMemo(() => (dept ? DEPARTMENT_ROLES[dept] || [] : []), [dept]);

  const applyHref = useMemo(() => {
    const params = new URLSearchParams();
    if (dept) params.set('dept', dept);
    if (role) params.set('role', role);
    const qs = params.toString();
    return qs ? `#apply?${qs}` : '#apply';
  }, [dept, role]);

  const canApply = Boolean(dept && role);

  return (
    <div className="roles-picker">
      <div className="roles-picker__grid">
        <div className="roles-picker__field">
          <label className="roles-picker__label" htmlFor="dept">Department</label>
          <div className="roles-picker__select">
            <select
              id="dept"
              value={dept}
              onChange={(e) => { setDept(e.target.value); setRole(''); }}
            >
              <option value="" disabled>Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="roles-picker__chev" size={18} aria-hidden="true" />
          </div>
        </div>

        <div className="roles-picker__field">
          <label className="roles-picker__label" htmlFor="role">Role</label>
          <div className={`roles-picker__select ${!dept ? 'is-disabled' : ''}`}>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={!dept}
            >
              <option value="" disabled>
                {dept ? 'Select role' : 'Select department first'}
              </option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <ChevronDown className="roles-picker__chev" size={18} aria-hidden="true" />
          </div>
        </div>
      </div>

      <p className="roles-picker__hint">
        {canApply
          ? `Here is your application form for the ${role} role in ${dept}.`
          : 'Pick a department and a role to continue to the application form.'}
      </p>

      <a
        href={canApply ? applyHref : undefined}
        className={`btn btn-primary roles-picker__cta ${!canApply ? 'is-disabled' : ''}`}
        aria-disabled={!canApply}
        onClick={(e) => { if (!canApply) e.preventDefault(); }}
      >
        Application Form
        <Arrow />
      </a>
    </div>
  );
}

export default function Careers() {
  const copyRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    // If navigated here via "Life at Reneonix" link, scroll to that section
    const scrollTarget = sessionStorage.getItem('reneonix-scroll-to');
    if (scrollTarget) {
      sessionStorage.removeItem('reneonix-scroll-to');
      setTimeout(() => {
        document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }

    // Hero entrance — trigger on next paint so CSS transitions fire
    const raf = requestAnimationFrame(() => {
      copyRef.current?.classList.add('c-hero-in');
      frameRef.current?.classList.add('c-frame-in');
    });

    // Scroll-reveal for every .c-reveal element
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('c-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.c-reveal').forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <section className="careers" id="careers">
      {/* ---------- HERO ---------- */}
      <div className="careers-hero">
        <div className="container">
          <div className="careers-hero__inner">
            <div className="careers-hero__copy" ref={copyRef}>
              <span className="eyebrow on-dark">Careers</span>
              <h1 className="careers-hero__title">
                Build the <em>Circular Future.</em>
              </h1>
              <p className="careers-hero__lead">
                Join Reneonix in building technologies that transform waste into
                traceable, industry-ready raw materials through deep-tech and
                sustainable innovation.
              </p>
              <div className="careers-hero__cta">
                <a
                  href="#open-roles"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  View Open Roles
                  <Arrow />
                </a>
                <a
                  href="#growth"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('growth')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  Why Reneonix?
                  <Arrow />
                </a>
              </div>
            </div>

            <div className="careers-hero__media">
              <div className="careers-hero__frame" ref={frameRef}>
                <img
                  className="careers-hero__image"
                  src="/careers-hero.png"
                  alt="Reneonix team on the factory floor — material recovery operations"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- OPEN ROLES (department + role pickers) ---------- */}
      <div className="section section-paper-grad" id="open-roles">
        <div className="container">
          <div className="roles-head c-reveal">
            <h2>
              Open <em>Roles</em>
            </h2>
            <p className="roles-head__sub">
              Choose a department and a role to start your application.
            </p>
          </div>

          <div className="c-reveal">
            <RolesPicker />
          </div>
        </div>
      </div>

      {/* ---------- LIFE AT RENEONIX (images only) ---------- */}
      <div className="section section-dark" id="life-at-reneonix">
        <div className="container">
          <div className="section-head c-reveal">
            <span className="eyebrow on-dark">Life at Reneonix</span>
            <h2>
              Where <em>builders</em> belong.
            </h2>
          </div>

          <div className="life-marquee" role="region" aria-label="Life at Reneonix photos">
            <div className="life-marquee__track">
              {[...LIFE_GALLERY, ...LIFE_GALLERY].map(({ src, caption }, i) => (
                <div className="life-marquee__card" key={`${src}-${i}`}>
                  <img src={src} alt={caption} loading="lazy" draggable="false" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- GROWTH & LEARNING ---------- */}
      <div className="section section-paper-grad" id="growth">
        <div className="container">
          <div className="section-head c-reveal">
            <h2>
              Why Join <em>Reneonix?</em>
            </h2>
          </div>

          <div className="growth-grid">
            {GROWTH.map(({ Icon, title, body }, i) => (
              <article
                className="growth-card c-reveal"
                key={title}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="growth-card__icon">
                  <Icon size={28} />
                </span>
                <h3 className="growth-card__title">{title}</h3>
                <p className="growth-card__body">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>


      {/* ---------- DON'T SEE THE PERFECT ROLE CTA ---------- */}
      <div className="section careers-cta-section">
        <div className="container">
          <div className="careers-cta">
            <div className="careers-cta__icon" aria-hidden="true">
              <Mail size={28} />
            </div>

            <div className="careers-cta__copy">
              <h3>Don't See the Perfect Role?</h3>
              <p>
                We're always looking for curious builders, researchers,
                engineers and innovators passionate about sustainability and
                deep technology.
              </p>
            </div>

            <div className="careers-cta__actions">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=careers@reneonix.com&su=Job+Application+%7C+Reneonix"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Send Your Resume
                <Arrow />
              </a>
              <a
                href="mailto:careers@reneonix.com"
                className="careers-cta__email"
              >
                <MapPin size={14} aria-hidden="true" />
                careers@reneonix.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
