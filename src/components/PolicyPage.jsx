import { useState, useEffect, useRef } from 'react';
import {
  Lock, ShieldCheck, User, Monitor, Globe, Cookie,
  Briefcase, Key, AlertCircle, RefreshCw,
  Calendar, ChevronDown,
} from 'lucide-react';
import './PolicyPage.css';

/* ── Data ─────────────────────────────────────────────── */
const TABS = [
  { id: 'privacy',    label: 'Privacy Policy' },
  { id: 'security',   label: 'Information Security' },
  { id: 'cookies',    label: 'Cookie Policy' },
  { id: 'retention',  label: 'Data Retention' },
  { id: 'ethics',     label: 'Compliance & Ethics' },
  { id: 'ip',         label: 'IP Policy' },
  { id: 'disclaimer', label: 'Disclaimer' },
];

const TAB_SECTIONS = {
  privacy: [
    { id: 'collect',          label: 'Information We Collect' },
    { id: 'usage-protection', label: 'Information Usage & Protection' },
    { id: 'security',         label: 'Information Security' },
    { id: 'contact',          label: 'Contact Us' },
  ],
  security: [
    { id: 'website-sec',     label: 'Website Security' },
    { id: 'confidentiality', label: 'Confidentiality' },
  ],
  cookies: [
    { id: 'cookie-usage', label: 'Cookie Usage' },
  ],
  retention: [
    { id: 'periods',   label: 'Retention Periods' },
    { id: 'transfers', label: 'International Transfers' },
    { id: 'third',     label: 'Third-Party Services' },
  ],
  ethics: [
    { id: 'conduct', label: 'Code of Business Conduct' },
    { id: 'equal',   label: 'Equal Opportunity Policy' },
  ],
  ip: [
    { id: 'ip-rights', label: 'Intellectual Property Rights' },
  ],
  disclaimer: [
    { id: 'dis-main',    label: 'Disclaimer' },
    { id: 'dis-updates', label: 'Policy Updates' },
    { id: 'dis-contact', label: 'Contact' },
  ],
};


/* ── Accordion section ────────────────────────────────── */
function Section({ id, num, title, expanded, onToggle, children }) {
  const headingId = `pol-hd-${id}`;
  const panelId   = `pol-pn-${id}`;
  return (
    <div className="pol-section">
      <button
        id={headingId}
        type="button"
        className="pol-section__hd"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => onToggle(id)}
      >
        <span className="pol-section__num" aria-hidden="true">{num}</span>
        <span className="pol-section__title">{title}</span>
        <span className={`pol-section__chevron${expanded ? ' pol-section__chevron--open' : ''}`} aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className={`pol-section__body${!expanded ? ' pol-section__body--closed' : ''}`}
      >
        <div className="pol-section__body-inner">{children}</div>
      </div>
    </div>
  );
}

/* ── Privacy Policy ───────────────────────────────────── */
function PrivacyContent({ exp, tog }) {
  return (
    <>
      <h2 className="pol-content__title">Privacy Policy</h2>
      <p className="pol-content__intro">
        At Reneonix, we value your trust and are committed to protecting your personal and
        business information. This Privacy Policy explains how we collect, use, and safeguard your data.
      </p>

      <Section id="collect" num="01" title="Information We Collect" expanded={exp['collect']} onToggle={tog}>
        <div className="pol-info-cards">
          <div className="pol-info-card">
            <div className="pol-info-card__head"><User size={14} /> Personal Information</div>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Company name</li>
              <li>Job title</li>
              <li>Any information voluntarily submitted through forms or inquiries</li>
            </ul>
          </div>
          <div className="pol-info-card">
            <div className="pol-info-card__head"><Monitor size={14} /> Technical Information</div>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Operating system</li>
              <li>Website usage and navigation data</li>
              <li>Cookies and analytics data</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="usage-protection" num="02" title="Information Usage & Protection" expanded={exp['usage-protection']} onToggle={tog}>
        <p className="pol-sub-hd">How We Use Information</p>
        <p className="pol-section__text">We may use the information provided to:</p>
        <ul className="pol-bullets">
          <li>Respond to inquiries and service requests</li>
          <li>Deliver products and services</li>
          <li>Improve website performance and functionality</li>
          <li>Communicate relevant business information</li>
          <li>Maintain security and prevent unauthorized access</li>
          <li>Comply with legal and regulatory obligations</li>
        </ul>
        <p className="pol-sub-hd">How We Protect Information</p>
        <p className="pol-section__text">
          We implement appropriate administrative, technical, and organizational safeguards to protect
          information entrusted to us, including:
        </p>
        <ul className="pol-bullets">
          <li>Project documentation</li>
          <li>Financial information</li>
          <li>Business strategies</li>
          <li>Stakeholder information</li>
          <li>Proprietary intellectual property</li>
        </ul>
        <div className="pol-info-box">
          <ShieldCheck size={15} />
          Access to information is restricted to authorized personnel on a need-to-know basis and protected through industry-standard security practices.
        </div>
      </Section>

      <Section id="security" num="03" title="Information Security" expanded={exp['security']} onToggle={tog}>
        <ul className="pol-bullets">
          <li>Access management and authentication controls</li>
          <li>Secure storage and handling of information</li>
          <li>Data backup and recovery procedures</li>
          <li>Endpoint and network security measures</li>
          <li>Employee awareness and confidentiality obligations</li>
        </ul>
        <div className="pol-info-box">
          <ShieldCheck size={15} />
          While no digital environment can guarantee absolute security, we continuously strive to implement industry-recognized security practices.
        </div>
      </Section>

      <Section id="contact" num="04" title="Contact Us" expanded={exp['contact']} onToggle={tog}>
        <div className="pol-contact-block">
          <strong>Reneonix Pvt Ltd</strong><br />
          Email: <a href="mailto:info@reneonix.com">info@reneonix.com</a><br /><br />
          <strong>Effective Date:</strong> June 02, 2025<br />
          <strong>Last Updated:</strong> June 02, 2025
        </div>
      </Section>
    </>
  );
}

/* ── Information Security ─────────────────────────────── */
function SecurityContent({ exp, tog }) {
  return (
    <>
      <h2 className="pol-content__title">Information Security Policy</h2>
      <p className="pol-content__intro">
        Our information security framework is designed to protect the confidentiality, integrity,
        and availability of all information assets entrusted to us.
      </p>

      <Section id="website-sec" num="01" title="Website Security & Visitor Protection" expanded={exp['website-sec']} onToggle={tog}>
        <ul className="pol-bullets">
          <li>Secure HTTPS encryption</li>
          <li>Protection against unauthorized access attempts</li>
          <li>Monitoring for malicious activities</li>
          <li>Secure handling of form submissions</li>
          <li>Controlled access to stored website information</li>
        </ul>
      </Section>

      <Section id="confidentiality" num="02" title="Confidentiality & Non-Disclosure" expanded={exp['confidentiality']} onToggle={tog}>
        <p className="pol-section__text">
          Unless required by law, court order, or regulatory authority, we will not disclose
          confidential client or personally identifiable visitor information without authorization.
        </p>
        <div className="pol-info-box">
          <Lock size={15} />
          All personnel with access to confidential information are bound by confidentiality obligations as part of their engagement with Reneonix.
        </div>
      </Section>
    </>
  );
}

/* ── Cookie Policy ────────────────────────────────────── */
function CookiesContent({ exp, tog }) {
  return (
    <>
      <h2 className="pol-content__title">Cookie Policy</h2>
      <p className="pol-content__intro">
        Our website uses cookies and similar technologies to enhance your browsing experience
        and help us understand how visitors interact with our content.
      </p>

      <Section id="cookie-usage" num="01" title="Cookie Usage" expanded={exp['cookie-usage']} onToggle={tog}>
        <ul className="pol-bullets">
          <li>Enhance user experience and website navigation</li>
          <li>Analyze website performance and traffic</li>
          <li>Improve website functionality</li>
          <li>Remember user preferences</li>
        </ul>
        <p className="pol-sub-hd">Types of Cookies</p>
        <ul className="pol-bullets">
          <li><strong>Essential cookies:</strong> Required for the website to function correctly</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
          <li><strong>Preference cookies:</strong> Remember your settings and choices</li>
        </ul>
        <div className="pol-info-box">
          <Cookie size={15} />
          Users may modify browser settings to manage or disable cookies; however, certain website features may not function properly as a result.
        </div>
      </Section>
    </>
  );
}

/* ── Data Retention ───────────────────────────────────── */
function RetentionContent({ exp, tog }) {
  return (
    <>
      <h2 className="pol-content__title">Data Retention</h2>
      <p className="pol-content__intro">
        We retain information only for as long as necessary to fulfill our business and legal
        obligations, and dispose of it securely thereafter.
      </p>

      <Section id="periods" num="01" title="Retention Periods" expanded={exp['periods']} onToggle={tog}>
        <ul className="pol-bullets">
          <li>Fulfill business and contractual obligations</li>
          <li>Comply with legal and regulatory requirements</li>
          <li>Resolve disputes and enforce agreements</li>
          <li>Maintain legitimate business records</li>
        </ul>
        <p className="pol-section__text">
          When information is no longer required, it is securely deleted, anonymized, or otherwise
          disposed of in accordance with applicable policies and procedures.
        </p>
      </Section>

      <Section id="transfers" num="02" title="International Data Transfers" expanded={exp['transfers']} onToggle={tog}>
        <div className="pol-info-box">
          <Globe size={15} />
          We take reasonable steps to ensure that any international transfers of personal data are carried out in compliance with applicable data protection laws.
        </div>
      </Section>

      <Section id="third" num="03" title="Third-Party Services" expanded={exp['third']} onToggle={tog}>
        <ul className="pol-bullets">
          <li>Website hosting and infrastructure providers</li>
          <li>Analytics and performance monitoring services</li>
          <li>Communication and email services</li>
          <li>Business operations and productivity tools</li>
        </ul>
        <p className="pol-section__text">
          Users are encouraged to review the privacy policies of any third-party services they access.
        </p>
      </Section>
    </>
  );
}

/* ── Compliance & Ethics ──────────────────────────────── */
function EthicsContent({ exp, tog }) {
  return (
    <>
      <h2 className="pol-content__title">Compliance & Ethics</h2>
      <p className="pol-content__intro">
        Reneonix is committed to conducting business with integrity, fairness, and in full
        compliance with applicable laws and regulations.
      </p>

      <Section id="conduct" num="01" title="Code of Business Conduct and Ethics" expanded={exp['conduct']} onToggle={tog}>
        <ul className="pol-bullets">
          <li>Professionalism and integrity in all business dealings</li>
          <li>Fair competition and ethical business practices</li>
          <li>Respectful workplace practices and culture</li>
          <li>Protection of confidential information and intellectual property</li>
          <li>Compliance with all applicable legal and regulatory requirements</li>
        </ul>
        <div className="pol-info-box">
          <Briefcase size={15} />
          Violations of our code of conduct may result in appropriate disciplinary action, up to and including termination of engagement.
        </div>
      </Section>

      <Section id="equal" num="02" title="Equal Opportunity and Non-Discrimination Policy" expanded={exp['equal']} onToggle={tog}>
        <p className="pol-section__text">
          Employment-related decisions are based on merit, qualifications, and business requirements.
          We do not discriminate on the basis of race, gender, age, disability, religion, or any other
          characteristic protected by applicable law.
        </p>
      </Section>
    </>
  );
}

/* ── IP Policy ────────────────────────────────────────── */
function IPContent({ exp, tog }) {
  return (
    <>
      <h2 className="pol-content__title">Intellectual Property Policy</h2>
      <p className="pol-content__intro">
        Reneonix Pvt Ltd takes intellectual property rights seriously and is committed to protecting
        its own IP as well as respecting the rights of others.
      </p>

      <Section id="ip-rights" num="01" title="Intellectual Property Rights" expanded={exp['ip-rights']} onToggle={tog}>
        <ul className="pol-bullets">
          <li>Website design, layout, and visual elements</li>
          <li>Text, articles, and written content</li>
          <li>Logos, trademarks, and brand identity elements</li>
          <li>Software, source code, and technical implementations</li>
          <li>Images, graphics, videos, and multimedia content</li>
          <li>Proprietary processes, methodologies, and know-how</li>
        </ul>
        <div className="pol-info-box">
          <Key size={15} />
          Unauthorized use, reproduction, or distribution of any content is strictly prohibited without prior written permission from Reneonix Pvt Ltd.
        </div>
        <p className="pol-sub-hd">Reporting Infringement</p>
        <p className="pol-section__text">
          Contact us at <a href="mailto:info@reneonix.com" style={{ color: 'var(--lime-deep)' }}>info@reneonix.com</a>.
        </p>
      </Section>
    </>
  );
}

/* ── Disclaimer ───────────────────────────────────────── */
function DisclaimerContent({ exp, tog }) {
  return (
    <>
      <h2 className="pol-content__title">Disclaimer</h2>
      <p className="pol-content__intro">
        Please read the following disclaimer carefully before using this website or relying
        on any information provided herein.
      </p>

      <Section id="dis-main" num="01" title="Disclaimer" expanded={exp['dis-main']} onToggle={tog}>
        <ul className="pol-bullets">
          <li>Information may be subject to change without notice</li>
          <li>We are not liable for any loss or damage arising from reliance on website content</li>
          <li>Links to third-party websites are provided for convenience only</li>
          <li>We do not endorse or take responsibility for third-party content</li>
        </ul>
        <div className="pol-info-box">
          <AlertCircle size={15} />
          By using this website, you acknowledge and agree to the terms of this disclaimer.
        </div>
      </Section>

      <Section id="dis-updates" num="02" title="Policy Updates" expanded={exp['dis-updates']} onToggle={tog}>
        <ul className="pol-bullets">
          <li>Legal and regulatory requirements</li>
          <li>Security practices and technologies</li>
          <li>Business operations and service offerings</li>
          <li>Industry best practices and standards</li>
        </ul>
        <div className="pol-info-box">
          <RefreshCw size={15} />
          Continued use of this website after any policy update constitutes your acceptance of the revised policies.
        </div>
      </Section>

      <Section id="dis-contact" num="03" title="Contact for Privacy & Security" expanded={exp['dis-contact']} onToggle={tog}>
        <div className="pol-contact-block">
          <strong>Reneonix Pvt Ltd</strong><br />
          Email: <a href="mailto:info@reneonix.com">info@reneonix.com</a><br /><br />
          <em style={{ fontSize: '.82rem' }}>
            Protecting client confidentiality and safeguarding visitor information remain central
            to our commitment to responsible and trustworthy business operations.
          </em>
        </div>
      </Section>
    </>
  );
}

function TabContent({ tab, exp, tog }) {
  switch (tab) {
    case 'privacy':    return <PrivacyContent    exp={exp} tog={tog} />;
    case 'security':   return <SecurityContent   exp={exp} tog={tog} />;
    case 'cookies':    return <CookiesContent    exp={exp} tog={tog} />;
    case 'retention':  return <RetentionContent  exp={exp} tog={tog} />;
    case 'ethics':     return <EthicsContent     exp={exp} tog={tog} />;
    case 'ip':         return <IPContent         exp={exp} tog={tog} />;
    case 'disclaimer': return <DisclaimerContent exp={exp} tog={tog} />;
    default:           return null;
  }
}

/* ── Main component ───────────────────────────────────── */
export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState('privacy');
  const [expanded, setExpanded]   = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const tabsBarRef                = useRef(null);
  const tabRefs                   = useRef({});

  useEffect(() => {
    const secs = TAB_SECTIONS[activeTab] || [];
    const init = {};
    secs.forEach((s) => { init[s.id] = false; });
    setExpanded(init);
  }, [activeTab]);

  const selectTab = (id) => {
    setActiveTab(id);
    requestAnimationFrame(() => {
      if (!tabsBarRef.current) return;
      const top = tabsBarRef.current.offsetTop - 76;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  };

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 320);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggle = (id) => setExpanded((prev) => {
    const isOpen = prev[id];
    const allClosed = Object.fromEntries(Object.keys(prev).map(k => [k, false]));
    return isOpen ? allClosed : { ...allClosed, [id]: true };
  });

  const handleTabKeyDown = (e, id) => {
    const ids = TABS.map(t => t.id);
    const idx = ids.indexOf(id);
    let next;
    if (e.key === 'ArrowRight')     next = ids[(idx + 1) % ids.length];
    else if (e.key === 'ArrowLeft') next = ids[(idx - 1 + ids.length) % ids.length];
    else if (e.key === 'Home')      next = ids[0];
    else if (e.key === 'End')       next = ids[ids.length - 1];
    if (next) {
      e.preventDefault();
      selectTab(next);
      requestAnimationFrame(() => tabRefs.current[next]?.focus());
    }
  };

  return (
    <div className="pol-page">

      {/* ── Hero ── */}
      <section className="pol-hero" aria-label="Policies and Compliance hero">
        <div className="container pol-hero__container">
          <div className="pol-hero__content">
            <nav className="pol-breadcrumb" aria-label="Breadcrumb">
              <a href="#home" className="pol-breadcrumb__link">Home</a>
              <span className="pol-breadcrumb__sep" aria-hidden="true">›</span>
              <span className="pol-breadcrumb__current" aria-current="page">Policy</span>
            </nav>
            <h1 className="pol-hero__title">
              Transparent,<br />
              <em>Secure,</em><br />
              Responsible
            </h1>
            <p className="pol-hero__sub">
              We are committed to protecting your privacy and securing your
              information with the highest standards of integrity.
            </p>
            <span className="pol-hero__date">
              <Calendar size={13} />
              Last Updated: June 02, 2025
            </span>
          </div>
          <div className="pol-hero__img-col" aria-hidden="true">
            <img
              src="/policy-hero.png"
              alt=""
              className="pol-hero__img"
              draggable="false"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="500"
              height="500"
            />
          </div>
        </div>
      </section>

      {/* ── Tab bar ── */}
      <nav className="pol-tabs-bar" ref={tabsBarRef} aria-label="Policy sections">
        <div className="pol-tabs-inner" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              ref={(el) => { tabRefs.current[t.id] = el; }}
              id={`pol-tab-${t.id}`}
              role="tab"
              aria-selected={activeTab === t.id}
              aria-controls={`pol-panel-${t.id}`}
              tabIndex={activeTab === t.id ? 0 : -1}
              className={`pol-tab${activeTab === t.id ? ' pol-tab--active' : ''}`}
              onClick={() => selectTab(t.id)}
              onKeyDown={(e) => handleTabKeyDown(e, t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Main content ── */}
      <div
        className="pol-main container"
        role="tabpanel"
        id={`pol-panel-${activeTab}`}
        aria-labelledby={`pol-tab-${activeTab}`}
      >
        <div className="pol-content">
          <TabContent tab={activeTab} exp={expanded} tog={toggle} />
        </div>
      </div>

      {/* ── Scroll-to-top ── */}
      {showScrollTop && (
        <button
          className="pol-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      )}

    </div>
  );
}
