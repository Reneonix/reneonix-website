import { useMemo, useState, useEffect, useRef } from 'react';
import {
  Factory,
  Cpu,
  Sparkles,
  TrendingUp,
  Mail,
  MapPin,
  ChevronDown,
  Briefcase,
} from 'lucide-react';
import './Careers.css';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/**
 * Department → list of roles.
 * An empty array means the department exists but has no current openings.
 * The UI shows "Currently no roles found." in the role dropdown for those.
 */
const DEPARTMENT_ROLES = {
  Hardware: [
    'Mechanical Design Engineer',
    'Embedded System Engineer',
    'Embedded Firmware Engineer',
    'Manufacturing Engineer',
    'Quality Engineer',
    'Manufacturing Technician',
  ],
  Software: [
    'AI System Architect',
  ],
  'Material Science': [],
  'Business & Development': [
    'Founder Office Associate',
    'Graphic Designer Fresher',
  ],
};

const DEPARTMENTS = Object.keys(DEPARTMENT_ROLES);

const CAREERS_EMAIL = 'careers@reneonix.com';

function buildBody(role) {
  return (
    `Name:\r\n\r\n` +
    `Email Address:\r\n\r\n` +
    `Phone Number:\r\n\r\n` +
    `Applying for Role: ${role || ''}\r\n\r\n` +
    `Years of Experience:\r\n\r\n` +
    `Current Location:\r\n\r\n` +
    `Current Company:\r\n\r\n` +
    `Current Role:\r\n\r\n` +
    `Notice Period:\r\n\r\n` +
    `Immediate Joining: Yes / No\r\n\r\n` +
    `Expected Salary:\r\n\r\n` +
    `LinkedIn / Portfolio / GitHub:\r\n\r\n` +
    `Resume/CV: (Mandatory Attachment)\r\n\r\n` +
    `Additional Documents: (Optional)\r\n` +
    `- Portfolio\r\n` +
    `- Certifications\r\n` +
    `- Project Documents\r\n\r\n` +
    `Why are you interested in this role?\r\n\r\n` +
    `Any other notes:\r\n`
  );
}

function buildMailHref(role) {
  const subject = `Application | ${role} | [Candidate Name]`;
  return (
    `mailto:${CAREERS_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(buildBody(role))}`
  );
}

function buildGmailHref(role) {
  const subject = `Application | ${role} | [Candidate Name]`;
  return (
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${CAREERS_EMAIL}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(buildBody(role).replace(/\r\n/g, '\n'))}`
  );
}

function buildResumeMailHref() {
  const subject = `Application | [Role] | [Candidate Name]`;
  return (
    `mailto:${CAREERS_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(buildBody(''))}`
  );
}

function buildResumeGmailHref() {
  const subject = `Application | [Role] | [Candidate Name]`;
  return (
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${CAREERS_EMAIL}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(buildBody('').replace(/\r\n/g, '\n'))}`
  );
}

function handleMailOpen(e, mailtoUrl, gmailUrl) {
  e.preventDefault();
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = mailtoUrl;
  } else {
    window.location.href = gmailUrl;
  }
}

/**
 * Active job openings.
 * To take a role offline, remove its entry here.
 * If this array is empty the Current Openings box shows the empty state.
 */
const CURRENT_OPENINGS = [
  {
    id: 'graphic-designer-fresher',
    role: 'Graphic Designer Fresher',
    dept: 'Business & Development',
    type: 'Full-time',
    location: 'Chennai, India',
    experience: '0–1 year',
    description:
      'Create compelling visual assets for Reneonix\'s brand identity, marketing campaigns, and product communication.',
    responsibilities: [
      'Design digital and print materials: social media posts, presentations, and reports',
      'Maintain and evolve Reneonix\'s visual brand identity across all channels',
      'Collaborate with business and product teams to translate ideas into visuals',
      'Create motion graphics and short explainer videos as needed',
    ],
    requirements: [
      'Degree or diploma in Graphic Design, Visual Communication, or related field',
      'Proficiency in Adobe Photoshop, Illustrator, and Figma',
      'Strong portfolio demonstrating typography, color, and layout skills',
      'Basic knowledge of motion design (After Effects) is a plus',
    ],
  },
];

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
  const hasRoles    = roleOptions.length > 0;
  const roleDisabled = !dept || !hasRoles;

  const canSend = Boolean(dept && role);

  const mailHref = useMemo(
    () => (canSend ? buildMailHref(role) : undefined),
    [canSend, role, dept]
  );

  const hintText = useMemo(() => {
    if (canSend) return `Click below to send your application for the ${role} role in ${dept}.`;
    if (dept && !hasRoles) return `There are currently no open roles in the ${dept} department.`;
    return 'Pick a department and a role to send your application.';
  }, [canSend, dept, hasRoles, role]);

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
          <div className={`roles-picker__select ${roleDisabled ? 'is-disabled' : ''}`}>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={roleDisabled}
            >
              <option value="" disabled>
                {!dept
                  ? 'Select department first'
                  : !hasRoles
                    ? 'Currently no roles found.'
                    : 'Select role'}
              </option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <ChevronDown className="roles-picker__chev" size={18} aria-hidden="true" />
          </div>
        </div>
      </div>

      <p className="roles-picker__hint">{hintText}</p>

      <a
        href={mailHref}
        className={`btn btn-primary roles-picker__cta ${!canSend ? 'is-disabled' : ''}`}
        aria-disabled={!canSend}
        onClick={(e) => {
          if (!canSend) { e.preventDefault(); return; }
          handleMailOpen(e, buildMailHref(role), buildGmailHref(role));
        }}
      >
        Send Your Application
        <Arrow />
      </a>
    </div>
  );
}

function CurrentOpenings({ openings }) {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="openings-box c-reveal">
      <div className="openings-box__head">
        <h3 className="openings-box__title">Current Openings</h3>
        {openings.length > 0 && (
          <span className="openings-count">
            {openings.length} open {openings.length === 1 ? 'role' : 'roles'}
          </span>
        )}
      </div>

      {openings.length === 0 ? (
        <div className="openings-empty">
          <div className="openings-empty__icon">
            <Briefcase size={28} />
          </div>
          <p className="openings-empty__title">Currently No Openings found.</p>
          <p className="openings-empty__sub">
            We'll update this section as new roles become available. Check back soon!
          </p>
        </div>
      ) : (
        <div className="openings-list">
          {openings.map((job) => {
            const isOpen = openId === job.id;
            return (
              <div
                key={job.id}
                className={`opening-item${isOpen ? ' is-open' : ''}`}
              >
                <button
                  className="opening-item__header"
                  onClick={() => toggle(job.id)}
                  aria-expanded={isOpen}
                  aria-controls={`opening-body-${job.id}`}
                >
                  <div className="opening-item__meta">
                    <span className="opening-item__role">{job.role}</span>
                    <div className="opening-item__tags">
                      <span className="opening-tag opening-tag--dept">{job.dept}</span>
                      <span className="opening-tag">{job.type}</span>
                      <span className="opening-tag">{job.location}</span>
                    </div>
                  </div>
                  <ChevronDown className="opening-item__chev" size={20} aria-hidden="true" />
                </button>

                <div
                  className="opening-item__body"
                  id={`opening-body-${job.id}`}
                  role="region"
                >
                  <div className="opening-item__inner">
                    <p className="opening-item__desc">{job.description}</p>

                    <div className="opening-item__cols">
                      <div className="opening-item__col">
                        <h4>Responsibilities</h4>
                        <ul>
                          {job.responsibilities.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="opening-item__col">
                        <h4>Requirements</h4>
                        <ul>
                          {job.requirements.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="opening-item__foot">
                      <span className="opening-item__exp">
                        Experience: {job.experience}
                      </span>
                      <a
                        href={buildMailHref(job.role)}
                        onClick={(e) => handleMailOpen(e, buildMailHref(job.role), buildGmailHref(job.role))}
                        className="btn btn-primary opening-item__apply"
                      >
                        Apply Now <Arrow />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
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
      { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
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
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- OPEN ROLES ---------- */}
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

          <CurrentOpenings openings={CURRENT_OPENINGS} />
        </div>
      </div>

      {/* ---------- LIFE AT RENEONIX ---------- */}
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
                  <img src={src} alt={caption} loading="lazy" decoding="async" draggable="false" />
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
                href={buildResumeMailHref()}
                onClick={(e) => handleMailOpen(e, buildResumeMailHref(), buildResumeGmailHref())}
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
