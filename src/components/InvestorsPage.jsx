import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useWeb3Forms from '@web3forms/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// Real mobile browsers fire resize events as the address bar hides/shows
// while scrolling. ScrollTrigger's default reaction is to refresh mid-scroll,
// which can freeze gsap.from() reveals at their hidden opacity:0 state —
// invisible on chrome desktop's mobile *emulation* (no real toolbar resize),
// but broken on an actual phone.
ScrollTrigger.config({ ignoreMobileResize: true });
import {
  User, Linkedin, ChevronDown,
} from 'lucide-react';

import './InvestorsPage.css';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function SectionBadge({ text }) {
  return (
    <div className="ip-badge">
      <span className="ip-badge__text">{text}</span>
    </div>
  );
}

/* ── Static data ───────────────────────────────────────── */

const HIGHLIGHTS = [
  { label: 'FOUNDED',          value: '2023',                            desc: 'Rapid product development since inception.',                         accent: true  },
  { label: 'HEADQUARTERS',     value: 'Chennai, India',                  desc: 'Innovation and engineering hub driving global impact.',               accent: false },
  { label: 'INDUSTRY',         value: 'DeepTech',                        desc: 'AI-powered industrial automation at the core.',                       accent: true  },
  { label: 'CORE TECHNOLOGIES',value: 'AI + Hardware, Material Science', desc: 'Proprietary technologies solving real-world industrial challenges.',  accent: false },
  { label: 'BUSINESS MODEL',   value: 'B2B',                             desc: 'Enterprise-first approach with scalable solutions.',                  accent: true  },
  { label: 'FOCUS',            value: 'Circular Economy',                desc: 'Building a smarter, cleaner, and more sustainable future.',           accent: false },
];

const BACKERS_GROUPS = [
  {
    title: 'Government & Ecosystem Recognition',
    desc: 'National and state-level startup and climate innovation support.',
    logos: [
      { src: '/dpiit-color-transparent.png',      alt: 'DPIIT — Startup India'              },
      { src: '/dst-color-transparent.png',        alt: 'Department of Science & Technology' },
      { src: '/startup-tn-color-transparent.png', alt: 'StartupTN'                          },
      { src: '/tn-climate.jpg',                   alt: 'Tamil Nadu Climate Change Mission'   },
    ],
  },
  {
    title: 'Incubation & Acceleration',
    desc: 'Business, technology, and deeptech commercialization support.',
    logos: [
      { src: '/nsrcel-color-transparent.png', alt: 'IIMB · NSRCEL'                                    },
      { src: '/itel-color-transparent.png',   alt: 'ITEL — Immersive Technology Entrepreneurship Labs' },
      { src: '/anna-color-transparent.png',   alt: 'Anna Incubator'                                   },
      { src: '/ciic-color-transparent.png',   alt: 'Crescent Innovation Incubation Council'           },
      { src: '/nvidia-color-transparent.png', alt: 'NVIDIA Inception Program'                          },
    ],
  },
  {
    title: 'Funding & Technology Network',
    desc: 'Capital support, grant pathways, and ecosystem access.',
    logos: [
      { src: '/ipv.jpg',              alt: 'Inflection Point Ventures'      },
      { src: '/dst-nidhi.jpg',        alt: 'DST NIDHI'                      },
      { src: '/sustain-tn.jpg',       alt: 'SustainTN'                      },
      { src: '/seed-fund-scheme.jpg', alt: 'Startup India Seed Fund Scheme' },
      { src: '/pernod-ricard.jpg',    alt: 'Pernod Ricard India'            },
    ],
  },
];

const TEAM = [
  {
    name: 'Iwan Richard',
    role: 'Founder & CEO',
    bio: 'Building AI-driven materials circularity infrastructure across glass, advanced materials, and circular manufacturing.',
    photo: '/richard pic-reneonix.png',
    linkedin: 'https://www.linkedin.com/in/iwanrichard/',
  },
  {
    name: 'Karthik Sankar',
    role: 'Co-Founder & COO',
    bio: 'Driving next-gen waste solutions through IoT and material science R&D, pioneering glass recycling and cullet solutions for a sustainable tomorrow.',
    photo: '/karthik-reneonix.png',
    linkedin: 'https://www.linkedin.com/in/karthik-sankar-bab5202a1/',
  },
  {
    name: 'Varun Pandithurai',
    role: 'Co-Founder & CTO',
    bio: 'Embedded Systems Architect building production-grade edge AI systems and medical devices. Research Scholar at IIT Madras.',
    photo: '/varun-reneonix.png',
    linkedin: 'https://www.linkedin.com/in/varunpandithurai/',
  },
];


const CONTACT_FEATURES = [
  { title: 'DeepTech Infrastructure', desc: 'Purpose-built for circular raw material recovery.' },
  { title: 'Proven Technology',       desc: 'AI + Hardware + Software + Material Science.' },
  { title: 'Industrial Impact',       desc: 'Verified, traceable, and buyer-ready materials.' },
];

const GUIDE_CARDS = [
  { id: 'investment',    emoji: '💰', title: 'Investment Opportunity',   desc: 'Explore funding rounds & equity' },
  { id: 'partnership',   emoji: '🤝', title: 'Strategic Partnership',    desc: 'Join our ecosystem of innovators' },
  { id: 'collaboration', emoji: '🧠', title: 'Innovation Collaboration', desc: 'Co-develop and pilot new solutions' },
  { id: 'learn-more',    emoji: '📄', title: 'Learn More',               desc: 'Discover Reneonix in depth' },
];

const CONVERSATIONS = {
  investment: {
    title: 'Investment Opportunity',
    intro: { greeting: 'Welcome!', body: "I'll guide you through five quick questions to understand your investment interests and ensure our Investor Relations team can assist you more effectively." },
    questions: [
      { text: 'What attracted you to Reneonix?', options: ['AI & DeepTech Infrastructure', 'Circular Economy & Sustainability', 'Industrial Market Opportunity', 'Long-term Growth Potential'] },
      { text: 'Which aspect of Reneonix interests you the most?', options: ['AI Vision Hardware', 'Traceability Platform (Retraiz)', 'Material Science Innovation', 'Integrated Technology Stack'] },
      { text: 'How familiar are you with Reneonix?', options: ['This is my first visit', "I've reviewed the website", "I've read the pitch deck", "I've already spoken with the team"] },
      { text: 'What information would help your evaluation?', options: ['Business Model', 'Market Opportunity', 'Technology & Products', 'Financial & Growth Roadmap'] },
      { text: 'When are you planning to explore investment opportunities?', options: ['Immediately', 'Within 3 months', 'Within 6 months', 'Just exploring for now'] },
    ],
    completion: "Thank you! I now have a clear understanding of your investment interests.\n\nJust one final step before we connect you with the appropriate Reneonix team.",
  },
  partnership: {
    title: 'Strategic Partnership',
    intro: { greeting: 'Excellent!', body: "Let's explore how your organization and Reneonix can create value together. I'll ask five quick questions before connecting you with the right team." },
    questions: [
      { text: 'What type of organization do you represent?', options: ['Enterprise / Brand', 'Manufacturing Company', 'Recycling / Resource Recovery', 'Government / Public Sector', 'Startup'] },
      { text: 'What type of partnership interests you?', options: ['Commercial Partnership', 'Technology Partnership', 'Joint Pilot Project', 'Long-term Strategic Alliance'] },
      { text: 'Which Reneonix capability interests you most?', options: ['AI Vision Systems', 'Traceability & Compliance', 'Material Recovery Infrastructure', 'Material Science'] },
      { text: 'What outcome are you looking to achieve?', options: ['Improve operational efficiency', 'Enhance sustainability initiatives', 'Meet regulatory compliance', 'Explore innovation opportunities'] },
      { text: 'When would you like to begin discussions?', options: ['As soon as possible', 'Within the next month', 'Within the next quarter', 'Still exploring'] },
    ],
    completion: "Excellent! I now have a clear picture of your partnership goals.\n\nJust one final step before we connect you with the appropriate Reneonix team.",
  },
  collaboration: {
    title: 'Innovation Collaboration',
    intro: { greeting: "That's exciting!", body: "Innovation is at the heart of Reneonix. I'll ask five quick questions to better understand your collaboration goals and connect you with the appropriate team." },
    questions: [
      { text: 'Which best describes your organization?', options: ['University', 'Research Institution', 'Technology Company', 'Startup', 'Independent Researcher'] },
      { text: 'Which area would you like to collaborate in?', options: ['Artificial Intelligence', 'Robotics & Automation', 'Material Science', 'Circular Economy Research'] },
      { text: 'What type of collaboration are you looking for?', options: ['Research Project', 'Product Development', 'Technology Validation', 'Innovation Partnership'] },
      { text: 'What stage is your collaboration idea in?', options: ['Early Concept', 'Active Research', 'Prototype', 'Ready for Pilot'] },
      { text: 'What is your primary objective?', options: ['Joint Research', 'Publications', 'Commercial Innovation', 'Long-term Technology Partnership'] },
    ],
    completion: "That's wonderful! I now have a clear picture of your collaboration goals.\n\nJust one final step before we connect you with the right Reneonix team.",
  },
  'learn-more': {
    title: 'Learn More',
    intro: { greeting: 'Happy to help!', body: "Before we connect, let's spend a minute exploring what interests you most about Reneonix. I'll ask five quick questions to personalize your experience." },
    questions: [
      { text: 'What would you like to learn about first?', options: ['Company Vision', 'Technology', 'Market Opportunity', 'Products'] },
      { text: 'Which technology interests you most?', options: ['AI Vision Systems', 'Traceability Platform', 'Material Science', 'Circular Material Recovery'] },
      { text: 'Which topic would you like to explore further?', options: ['Business Model', 'Customer Success', 'Strategic Partnerships', 'Sustainability Impact'] },
      { text: 'How would you prefer to continue learning?', options: ['Explore the Website', 'Read the Pitch Deck', 'Request Company Information', 'Schedule a Conversation'] },
      { text: 'Would you like someone from our team to reach out?', options: ["Yes, I'd like to connect", 'Maybe later', 'I need more information first', 'Not at this time'] },
    ],
    completion: "Thank you! I now have a clear understanding of what you're looking for.\n\nJust one final step before we connect you with the appropriate Reneonix team.",
  },
};

/* ── Page component ────────────────────────────────────── */

export default function InvestorsPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', country: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState(null);
  // Honeypot — Web3Forms auto-rejects the submission server-side whenever
  // this checkbox comes back checked. Hidden from real visitors, but bots
  // that blindly fill/tick every field they find will trip it.
  const [botcheck, setBotcheck] = useState(false);

  /* Guide AI chat state */
  const [selectedOption, setSelectedOption] = useState(null);
  const [guidePhase, setGuidePhase] = useState('options'); // 'options' | 'chat' | 'done'
  const [guideMessages, setGuideMessages] = useState([]);
  const [guideIsTyping, setGuideIsTyping] = useState(false);
  const [guideCurrentQ, setGuideCurrentQ] = useState(0);
  const [guideAnswers, setGuideAnswers] = useState({});
  const guideScrollRef = useRef(null);
  const guideTimers = useRef([]);

  const { submit } = useWeb3Forms({
    access_key: '6e002590-95da-4100-8a9b-0ed98be0809a',
    settings: { from_name: 'Reneonix Investors Page', subject: 'New Investor Inquiry' },
    onSuccess: () => {
      setSubmitStatus('success');
      setForm({ name: '', company: '', email: '', phone: '', country: '', message: '' });
    },
    onError: () => setSubmitStatus('error'),
  });

  /* Kill any leftover ScrollTriggers from previous pages before mounting */
  useLayoutEffect(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  useEffect(() => {
    const page = document.querySelector('.inv-page');
    if (!page) return;

    const ctx = gsap.context(() => {

      /* ── Hero content — stagger on mount ── */
      gsap.from('.inv-hero__content > *', {
        y: 28, opacity: 0,
        stagger: 0.14,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.2,
      });

/* ── Background — subtle parallax on scroll ── */
      gsap.to('.inv-hero__bg-img', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: '.inv-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      /* ── Section heads — fade + rise on enter ── */
      gsap.utils.toArray('.ip-section-head').forEach(el => {
        gsap.from(el, {
          y: 36, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });

      /* ── Highlight cards — staggered entrance ── */
      gsap.from('.ip-highlight-card', {
        y: 44, opacity: 0,
        stagger: { amount: 0.45 },
        duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.ip-highlights-grid', start: 'top 82%' },
      });

      /* ── Backer rows — staggered rise ── */
      gsap.from('.ip-backers-row', {
        y: 30, opacity: 0,
        stagger: 0.15, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.ip-backers-timeline', start: 'top 85%' },
      });

      /* ── Team cards — staggered rise ── */
      gsap.from('.ip-team-card', {
        y: 50, opacity: 0,
        stagger: 0.14, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.ip-team-grid', start: 'top 82%' },
      });


/* ── Contact section — fade up ── */
      gsap.from('.ip-guide, .ip-ir-card, .ip-contact-intro', {
        y: 30, opacity: 0,
        stagger: 0.12, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.ip-contact-grid', start: 'top 82%' },
      });

    }, page);

    return () => ctx.revert();
  }, []);

  /* ── Post-init refresh so GSAP re-reads heights after images load ──
     On a slow mobile connection, images (team photos, backer logos, hero
     bg) finish loading after ScrollTrigger has already measured trigger
     offsets, so every section below the fold has a stale start position
     and its reveal animation never fires — sections stay stuck at
     opacity:0. Re-measuring once images settle fixes it. */
  useEffect(() => {
    const timers = [];
    const doRefresh = () =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => ScrollTrigger.refresh())
      );
    const imgs = Array.from(document.querySelectorAll('.inv-page img'));
    const pending = imgs.filter(img => !img.complete);
    if (pending.length === 0) {
      doRefresh();
    } else {
      let resolved = 0;
      pending.forEach(img => {
        const cb = () => { if (++resolved === pending.length) doRefresh(); };
        img.addEventListener('load',  cb, { once: true });
        img.addEventListener('error', cb, { once: true });
      });
    }
    // Fixed-delay fallbacks for fast connections (catch webfont swap, etc.)
    timers.push(setTimeout(doRefresh, 300));
    timers.push(setTimeout(doRefresh, 650));
    // Safety net for slow/real mobile connections: keep re-measuring for a
    // few seconds so a section that finishes loading late still gets a
    // correct trigger position instead of staying stuck at opacity:0.
    [1200, 2500, 4000].forEach(ms => timers.push(setTimeout(doRefresh, ms)));
    // Full page load (covers CSS background-images not caught by the
    // '.inv-page img' query, e.g. #inv-contact's url() background).
    window.addEventListener('load', doRefresh);
    if (document.fonts?.ready) document.fonts.ready.then(doRefresh);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('load', doRefresh);
    };
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* Auto-scroll guide chat to bottom when messages update */
  useEffect(() => {
    if (guideScrollRef.current) {
      guideScrollRef.current.scrollTop = guideScrollRef.current.scrollHeight;
    }
  }, [guideMessages, guideIsTyping]);

  /* Cleanup guide timers on unmount */
  useEffect(() => {
    return () => guideTimers.current.forEach(clearTimeout);
  }, []);

  const clearGuideTimers = () => {
    guideTimers.current.forEach(clearTimeout);
    guideTimers.current = [];
  };

  const after = (ms, fn) => {
    const id = setTimeout(fn, ms);
    guideTimers.current.push(id);
  };

  const handleGuideSelect = (optionId) => {
    clearGuideTimers();
    setSelectedOption(optionId);
    setGuidePhase('chat');
    setGuideMessages([]);
    setGuideCurrentQ(0);
    setGuideAnswers({});
    setGuideIsTyping(true);
    const conv = CONVERSATIONS[optionId];
    after(1400, () => {
      setGuideIsTyping(false);
      setGuideMessages([{ id: 'intro', type: 'ai', greeting: conv.intro.greeting, body: conv.intro.body }]);
      after(700, () => {
        setGuideIsTyping(true);
        after(1100, () => {
          setGuideIsTyping(false);
          setGuideCurrentQ(0);
          setGuideMessages(prev => [...prev, {
            id: 'q0', type: 'question', index: 0,
            text: conv.questions[0].text, options: conv.questions[0].options,
          }]);
        });
      });
    });
  };

  const handleGuideAnswer = (answer, qIndex) => {
    if (guideIsTyping) return;
    const conv = CONVERSATIONS[selectedOption];
    setGuideAnswers(prev => ({ ...prev, [qIndex]: answer }));
    setGuideMessages(prev => [
      ...prev.map(m => m.id === `q${qIndex}` ? { ...m, answered: true } : m),
      { id: `u${qIndex}`, type: 'user', text: answer },
    ]);
    setGuideIsTyping(true);
    after(1100, () => {
      setGuideIsTyping(false);
      const next = qIndex + 1;
      if (next < 5) {
        setGuideCurrentQ(next);
        setGuideMessages(prev => [...prev, {
          id: `q${next}`, type: 'question', index: next,
          text: conv.questions[next].text, options: conv.questions[next].options,
        }]);
      } else {
        setGuideMessages(prev => [...prev, { id: 'done', type: 'completion', text: conv.completion }]);
        setGuidePhase('done');
      }
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');
    const conv = CONVERSATIONS[selectedOption] || {};
    const responses = (conv.questions || [])
      .map((q, i) => `Q${i + 1}: ${q.text}\nA: ${guideAnswers[i] || '—'}`)
      .join('\n\n');
    await submit({
      ...form,
      botcheck,
      selected_path: conv.title || selectedOption,
      conversation_responses: responses,
      to_email: 'iwanrichard@reneonix.com',
      subject: `Investor Inquiry (${conv.title || selectedOption}) | ${form.name} | ${form.company}`,
    });
  };

  return (
    <section className="inv-page" id="investors-page">

      {/* ── 01 HERO ──────────────────────────────────────── */}
      <div className="inv-hero">

        {/* Full-bleed background */}
        <div className="inv-hero__bg">
          <img
            className="inv-hero__bg-img"
            src="/investor-bg.jpeg"
            alt=""
            loading="eager"
            decoding="async"
          />
          <div className="inv-hero__bg-veil" />
        </div>

        {/* Main content */}
        <div className="inv-hero__content">
          <h1 className="inv-hero__title">
            Investing in<br />
            <em>Intelligent</em><br />
            Industry
          </h1>
          <p className="inv-hero__lead">
            Reneonix builds AI-powered technology infrastructure that transforms
            post-consumer waste into industry-ready raw materials.
          </p>
        </div>

        {/* Scroll cue */}
        <div className="inv-hero__scroll-cue" aria-hidden="true">
          <div className="inv-hero__scroll-mouse">
            <span className="inv-hero__scroll-dot" />
          </div>
          <span className="inv-hero__scroll-label">Scroll</span>
          <ChevronDown size={13} />
        </div>

      </div>

      {/* ── 02 INVESTMENT HIGHLIGHTS ─────────────────────── */}
      <div className="section section-paper-grad" id="inv-highlights">
        <div className="container">
          <div className="ip-section-head ip-section-head--center">
            <span className="eyebrow">Investment Highlights</span>
            <h2>Why Reneonix is a <em>category-defining opportunity</em></h2>
            <p className="ip-section-head__sub">We combine deep technology, domain expertise, and a mission-driven approach to deliver scalable and sustainable impact.</p>
          </div>
          <div className="ip-highlights-grid">
            {HIGHLIGHTS.map(({ label, value, desc, accent }, i) => (
              <div
                className={`ip-highlight-card${accent ? ' ip-highlight-card--accent' : ''}`}
                key={label}
              >
                <span className="ip-highlight-card__label">{label}</span>
                <strong className="ip-highlight-card__value">{value}</strong>
                <span className="ip-highlight-card__divider" aria-hidden="true" />
                <p className="ip-highlight-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 03 BACKED BY INSTITUTIONS ─────────────────────── */}
      <div className="section section-paper" id="inv-model">
        <div className="container">
          <div className="ip-section-head">
            <SectionBadge text="BACKED BY INSTITUTIONS" />
            <h2>Built for <em>industrial scale</em></h2>
            <p className="ip-section-head__desc">Funding, incubation, R&D mentorship, and ecosystem support across deeptech, climate, material science, and AI.</p>
          </div>

          <div className="ip-backers-timeline">
            {BACKERS_GROUPS.map(({ title, desc, logos }, i) => {
              const textBlock = (
                <div className="ip-backers-row__text" key="text">
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              );
              const boxBlock = (
                <div className="ip-backers-row__box" key="box">
                  {logos.map(({ src, alt }) => (
                    <div className="ip-backers-logo" key={src + alt}>
                      <img src={src} alt={alt} loading="lazy" />
                    </div>
                  ))}
                </div>
              );
              return (
                <div className="ip-backers-row" key={title}>
                  {i % 2 === 1 ? [boxBlock, textBlock] : [textBlock, boxBlock]}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 04 OUR TEAM ──────────────────────────────────── */}
      <div className="section section-paper-grad" id="inv-team">
        <div className="container">
          <div className="ip-section-head ip-section-head--center">
            <SectionBadge text="MEET THE FOUNDERS" />
            <h2>The Team Shaping the Future of <em>Circular Innovation</em></h2>
            <p className="ip-section-desc">A multidisciplinary team of innovators, engineers, and operators united by a shared vision: accelerating the transition toward smarter resource recovery and sustainable industrial ecosystems.</p>
          </div>
          <div className="ip-team-grid">
            {TEAM.map(({ name, role, bio, photo, linkedin }, i) => (
              <a
                href={linkedin}
                className="ip-team-card"
                key={i}
                target="_blank"
                rel="noopener noreferrer"
                style={{ transitionDelay: `${i * 0.1}s`, textDecoration: 'none' }}
              >
                {/* Meta row */}
                <div className="ip-team-card__meta">
                  <span className="ip-team-card__role">{role}</span>
                </div>

                {/* Photo area */}
                <div className="ip-team-card__photo">
                  {photo
                    ? <img src={photo} alt={name} />
                    : <User size={40} />
                  }
                </div>

                {/* Body */}
                <div className="ip-team-card__body">
                  <h3 className="ip-team-card__name">{name}</h3>
                </div>

                {/* LinkedIn link */}
                <div className="ip-team-card__link">
                  <Linkedin size={13} /> View Profile <Arrow />
                </div>
              </a>
            ))}
          </div>

        </div>
      </div>


{/* ── 07 CONTACT INVESTOR RELATIONS ────────────────── */}
      <div className="section" id="inv-contact">
        <div className="container">
          <div className="ip-contact-grid">

            {/* LEFT — hero card with background image */}
            <div className="ip-contact-intro">
              <div className="ip-contact-intro__content">
                <SectionBadge text="INVESTOR RELATIONS" />
                <h2>Let's build the future <em>together.</em></h2>
                <p className="ip-contact-desc">
                  We welcome conversations with investors, strategic partners, venture funds, and industry stakeholders interested in the future of intelligent resource management.
                </p>
                <div className="ip-contact-features">
                  {CONTACT_FEATURES.map(({ title, desc }) => (
                    <div className="ip-contact-feature" key={title}>
                      <span className="ip-contact-feature__icon">
                        {title === 'DeepTech Infrastructure' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                          </svg>
                        )}
                        {title === 'Proven Technology' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                            <rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
                          </svg>
                        )}
                        {title === 'Industrial Impact' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                            <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z"/>
                          </svg>
                        )}
                      </span>
                      <div>
                        <strong>{title}</strong>
                        <span>{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MIDDLE — AI Guide chat */}
            <div className="ip-guide">
              {/* Header — always visible */}
              <div className="ip-guide__head">
                <div className="ip-guide__robot-icon">
                  <img src="/Reneonix guide icon.webp" alt="Reneonix Guide" className="ip-guide__robot-img" />
                </div>
                <div>
                  <h3>Reneonix Guide</h3>
                  <p>Intelligent investor companion</p>
                </div>
                <span className="ip-guide__online-dot" />
              </div>

              {/* Scrollable chat body */}
              <div className="ip-guide__chat" ref={guideScrollRef}>

                {guidePhase === 'options' ? (
                  <>
                    <div className="ip-guide__bubble">Hello! 👋 What brings you here today?</div>
                    <div className="ip-guide__options">
                      {GUIDE_CARDS.map(({ id, title, desc }) => (
                        <button
                          key={id}
                          type="button"
                          className="ip-guide__option"
                          onClick={() => handleGuideSelect(id)}
                        >
                          <span className="ip-guide__option-icon">
                            {id === 'investment' && (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                              </svg>
                            )}
                            {id === 'partnership' && (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                              </svg>
                            )}
                            {id === 'collaboration' && (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                                <circle cx="12" cy="9" r="3"/><path d="M6.168 18.849A4 4 0 0 1 10 15h4a4 4 0 0 1 3.834 2.855"/>
                                <path d="M2.5 14.5A3 3 0 0 1 5 12h.5m16 2.5A3 3 0 0 0 19 12h-.5"/>
                              </svg>
                            )}
                            {id === 'learn-more' && (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
                              </svg>
                            )}
                          </span>
                          <div className="ip-guide__option-text">
                            <strong>{title}</strong>
                            <span>{desc}</span>
                          </div>
                          <Arrow />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {guideMessages.map((msg) => {
                      if (msg.type === 'ai') return (
                        <div key={msg.id} className="ip-guide__msg ip-guide__msg--ai">
                          <p className="ip-guide__msg-greeting">{msg.greeting}</p>
                          <p className="ip-guide__msg-body">{msg.body}</p>
                        </div>
                      );
                      if (msg.type === 'question') return (
                        <div key={msg.id} className="ip-guide__msg ip-guide__msg--question">
                          <p className="ip-guide__msg-qtext">{msg.text}</p>
                          {!msg.answered && (
                            <div className="ip-guide__qoptions">
                              {msg.options.map(opt => (
                                <button key={opt} type="button" className="ip-guide__qopt" onClick={() => handleGuideAnswer(opt, msg.index)}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                      if (msg.type === 'user') return (
                        <div key={msg.id} className="ip-guide__msg ip-guide__msg--user">{msg.text}</div>
                      );
                      if (msg.type === 'completion') return (
                        <div key={msg.id} className="ip-guide__msg ip-guide__msg--ai">
                          {msg.text.split('\n\n').map((para, i) => (
                            <p key={i} className={i === 0 ? 'ip-guide__msg-greeting' : 'ip-guide__msg-body'}>{para}</p>
                          ))}
                        </div>
                      );
                      return null;
                    })}

                    {guideIsTyping && (
                      <div className="ip-guide__typing" aria-label="AI is typing">
                        <span /><span /><span />
                      </div>
                    )}

                    {/* Contact form — appears after all 5 questions */}
                    {guidePhase === 'done' && !guideIsTyping && (
                      <div className="ip-guide__form-wrap">
                        {submitStatus === 'success' ? (
                          <div className="ip-guide__success">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="28" height="28"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            <p>Request Sent!</p>
                            <span>Our team will be in touch with you shortly.</span>
                          </div>
                        ) : (
                          <form className="ip-guide__form" onSubmit={onSubmit}>
                            {/* Honeypot — hidden from real visitors via CSS,
                                unreachable by keyboard/screen readers. Web3Forms
                                rejects the submission server-side if checked. */}
                            <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                              <label htmlFor="g-botcheck">Leave this empty</label>
                              <input
                                id="g-botcheck"
                                type="checkbox"
                                name="botcheck"
                                checked={botcheck}
                                onChange={(e) => setBotcheck(e.target.checked)}
                                tabIndex={-1}
                                autoComplete="off"
                              />
                            </div>
                            <div className="ip-form-field">
                              <label htmlFor="g-name">Full Name <span className="ip-required">*</span></label>
                              <input id="g-name" type="text" name="name" placeholder="Jane Doe" value={form.name} onChange={onChange} maxLength={100} required />
                            </div>
                            <div className="ip-form-field">
                              <label htmlFor="g-company">Company / Fund <span className="ip-required">*</span></label>
                              <input id="g-company" type="text" name="company" placeholder="Acme Capital" value={form.company} onChange={onChange} maxLength={100} required />
                            </div>
                            <div className="ip-form-field">
                              <label htmlFor="g-email">Email Address <span className="ip-required">*</span></label>
                              <input id="g-email" type="email" name="email" placeholder="jane@fund.com" value={form.email} onChange={onChange} maxLength={254} required />
                            </div>
                            <div className="ip-guide__form-row">
                              <div className="ip-form-field">
                                <label htmlFor="g-phone">Phone Number</label>
                                <input id="g-phone" type="tel" name="phone" placeholder="+1 555 000 0000" value={form.phone} onChange={onChange} maxLength={30} />
                              </div>
                              <div className="ip-form-field">
                                <label htmlFor="g-country">Country <span className="ip-required">*</span></label>
                                <input id="g-country" type="text" name="country" placeholder="United States" value={form.country} onChange={onChange} maxLength={100} required />
                              </div>
                            </div>
                            <div className="ip-form-field">
                              <label htmlFor="g-message">Additional Message</label>
                              <textarea id="g-message" name="message" rows={3} placeholder="Anything else you'd like us to know?" value={form.message} onChange={onChange} maxLength={1000} />
                            </div>
                            <button type="submit" className="ip-form-submit" disabled={submitStatus === 'sending'}>
                              {submitStatus === 'sending' ? 'Sending…' : <>Send Request <Arrow /></>}
                            </button>
                            {submitStatus === 'error' && (
                              <p className="ip-form-error">Something went wrong. Please try again.</p>
                            )}
                          </form>
                        )}
                      </div>
                    )}
                  </>
                )}

              </div>{/* end .ip-guide__chat */}

              {/* Footer */}
              <div className="ip-guide__footer">
                {guidePhase === 'chat' && (
                  <span className="ip-guide__qprogress">Question {guideCurrentQ + 1} of 5</span>
                )}
                {guidePhase === 'done' && !guideIsTyping && (
                  <span className="ip-guide__qprogress ip-guide__qprogress--done">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11"><path d="m5 12 5 5L20 7"/></svg>
                    5 of 5 complete
                  </span>
                )}
                <p className="ip-guide__privacy">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Your information is secure and private
                </p>
              </div>
            </div>

            {/* RIGHT — Journey status tracker */}
            <div className="ip-ir-card">
              <div className="ip-ir-card__head">
                <span className="ip-ir-card__avatar"><User size={20} /></span>
                <div>
                  <h3>Your Journey Starts Here</h3>
                  <p>Complete the guide to get personalized insights</p>
                </div>
              </div>

              <div className="ip-ir-steps">
                <div className={`ip-ir-step${guidePhase !== 'options' ? ' is-done' : ''}`}>
                  <div className="ip-ir-step__num">
                    {guidePhase !== 'options'
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="m5 12 5 5L20 7"/></svg>
                      : '1'}
                  </div>
                  <div className="ip-ir-step__line" />
                  <div className="ip-ir-step__text">
                    <strong>Choose Your Path</strong>
                    <span>Select your primary interest in the guide</span>
                  </div>
                </div>
                <div className={`ip-ir-step${guidePhase === 'done' || submitStatus === 'success' ? ' is-done' : ''}`}>
                  <div className="ip-ir-step__num">
                    {guidePhase === 'done' || submitStatus === 'success'
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="m5 12 5 5L20 7"/></svg>
                      : '2'}
                  </div>
                  <div className="ip-ir-step__line" />
                  <div className="ip-ir-step__text">
                    <strong>Learn About Reneonix</strong>
                    <span>Discover what makes us unique in circular economy</span>
                  </div>
                </div>
                <div className={`ip-ir-step${submitStatus === 'success' ? ' is-done' : ''}`}>
                  <div className="ip-ir-step__num">
                    {submitStatus === 'success'
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="m5 12 5 5L20 7"/></svg>
                      : '3'}
                  </div>
                  <div className="ip-ir-step__text">
                    <strong>Connect with Our Team</strong>
                    <span>Get direct access to our investor relations team</span>
                  </div>
                </div>
              </div>

              <div className="ip-ir-badges">
                <span className="ip-ir-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  256-bit SSL Encrypted
                </span>
                <span className="ip-ir-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Confidential
                </span>
              </div>

              {submitStatus === 'success' ? (
                <div className="ip-ir-card__success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="26" height="26"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  <p>Request Sent!</p>
                  <span>Our team will reach out to you shortly.</span>
                </div>
              ) : guidePhase === 'done' ? (
                <div className="ip-ir-card__hint">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <p>Complete the form in the guide to connect with our team.</p>
                </div>
              ) : guidePhase === 'chat' ? (
                <div className="ip-ir-card__hint">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  <p>Answer all questions in the guide to proceed.</p>
                </div>
              ) : (
                <div className="ip-ir-card__locked">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <p>Complete the Guide to Unlock</p>
                  <span>Select an option in the guide to get started</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
