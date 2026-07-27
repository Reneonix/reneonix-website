import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { MapPin, Mail, Linkedin, Instagram, Lock, ChevronRight, Check } from 'lucide-react';
import './ContactPage.css';

const EMAILJS_SERVICE_ID = 'service_ium1icn';
const EMAILJS_TEMPLATE_ID = 'template_axml958';
const EMAILJS_PUBLIC_KEY = 'cTCOlUEvOb2TSKCCL';
const RECAPTCHA_SITE_KEY = '6LcVt2ctAAAAAI8iK01V9ayYMCQZgxXyg5Z6PCTe';

const EMPTY_FORM = { name: '', email: '', company: '', interest: '', otherInterest: '', message: '' };

const INTEREST_OPTIONS = [
  'Intelligent Inspection Systems',
  'Software & Data Solutions',
  'Material Science & Recovery',
  'Partnerships & Collaboration',
  'Investment & Investor Enquiries',
  'Media & General Enquiries',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  // Honeypot — invisible to real visitors, but form-filling bots tend to fill
  // every input they find. Never sent to EmailJS; only checked on submit.
  const [website, setWebsite] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const recaptchaBoxRef = useRef(null);
  const widgetIdRef = useRef(null);

  // Load the reCAPTCHA script once and render the "I'm not a robot" widget
  // into recaptchaBoxRef — matches what EmailJS's template-level reCAPTCHA
  // check now requires (a g-recaptcha-response token on every send).
  useEffect(() => {
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !recaptchaBoxRef.current || widgetIdRef.current !== null) return;
      // reCAPTCHA's default "normal" size is a fixed 304px wide — wider than
      // the form card's inner width on narrow phones, so it overflowed past
      // the card edge and was clipped invisible by .contact-page's
      // overflow:hidden. "compact" (164px) always fits.
      const isNarrow = window.matchMedia('(max-width: 480px)').matches;
      widgetIdRef.current = window.grecaptcha.render(recaptchaBoxRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        size: isNarrow ? 'compact' : 'normal',
      });
    };

    if (window.grecaptcha && window.grecaptcha.render) {
      renderWidget();
      return () => { cancelled = true; };
    }

    // The <script> tag's own DOM `load` event fires once api.js itself has
    // downloaded and run — but api.js then asynchronously loads a second
    // resource (recaptcha__en.js) before grecaptcha.render is actually
    // callable, so reacting to `load` is a race: render() can still throw
    // "grecaptcha.render is not a function" for a brief window after `load`
    // fires. Google's own documented fix is the `onload` query-param
    // callback, which only fires once the full API is genuinely ready.
    const CALLBACK_NAME = '__reneonixRecaptchaOnload';
    window[CALLBACK_NAME] = renderWidget;

    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=' + CALLBACK_NAME + '&render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => { cancelled = true; delete window[CALLBACK_NAME]; };
  }, []);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (website) {
      // Honeypot tripped — silently pretend success without actually sending.
      setStatus('success');
      setForm(EMPTY_FORM);
      setWebsite('');
      return;
    }

    const token = window.grecaptcha && widgetIdRef.current !== null
      ? window.grecaptcha.getResponse(widgetIdRef.current)
      : '';
    if (!token) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);

    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          company: form.company,
          interest: form.interest === 'Other' && form.otherInterest ? form.otherInterest : form.interest,
          message: form.message,
          'g-recaptcha-response': token,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error('EmailJS send failed:', err);
      setStatus('error');
    } finally {
      // Every attempt — success or fail — needs a fresh checkbox tick next time.
      if (window.grecaptcha && widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    }
  };

  return (
    <section className="contact-page section section-dark" id="contact-us">
      <div className="contact-page__bg" aria-hidden="true">
        <picture>
          <source media="(max-width: 980px)" srcSet="/contact%20bg%20mobile.png" />
          <img src="/contact bg.png" alt="" loading="eager" decoding="async" />
        </picture>
        <div className="contact-page__bg-veil" />
      </div>
      <div className="container">
        <div className="contact-grid">

          {/* ── Left — content ── */}
          <div className="contact-content">
            <div className="contact-eyebrow">
              <span className="contact-eyebrow__text">Contact Reneonix</span>
            </div>
            <h1 className="contact-content__title">
              Let&apos;s start<br />
              a <em>conversation.</em>
            </h1>
            <p className="contact-content__lead">
              Whether you&apos;re exploring intelligent inspection, data-driven
              recovery, or new opportunities in circularity, we&apos;d love to
              hear from you.
            </p>
            <p className="contact-content__challenge">
              <MapPin size={16} />
              Have a challenge? Let&apos;s solve it together.
            </p>

            <div className="contact-content__info">
              <div className="contact-info-item">
                <MapPin size={18} />
                <div>
                  <strong>Chennai, India</strong>
                  <span>Building a circular tomorrow, today.</span>
                </div>
              </div>
              <div className="contact-info-item">
                <Mail size={18} />
                <div>
                  <strong>info@reneonix.com</strong>
                  <span>Let&apos;s build something meaningful.</span>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-item__socials">
                  <a href="https://www.linkedin.com/company/reneonix/" target="_blank" rel="noopener noreferrer" aria-label="Reneonix on LinkedIn"><Linkedin size={18} /></a>
                  <a href="https://www.instagram.com/iwan_richard_official/" target="_blank" rel="noopener noreferrer" aria-label="Reneonix on Instagram"><Instagram size={18} /></a>
                </span>
                <div>
                  <strong>LinkedIn &middot; Instagram</strong>
                  <span>Stay connected with our journey.</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right — form ── */}
          <div className="contact-form-wrap">
            {status === 'success' ? (
              <div className="contact-form-success">
                <div className="contact-form-success__icon">
                  <span className="contact-form-success__ring contact-form-success__ring--outer" aria-hidden="true" />
                  <span className="contact-form-success__ring contact-form-success__ring--inner" aria-hidden="true" />
                  <Check size={26} strokeWidth={2.5} />
                </div>
                <div className="contact-form-success__text">
                  <h3>Thank you for reaching out!</h3>
                  <p>Your message is now with the Reneonix team. We&apos;ll be in touch soon.</p>
                  <span>Building a smarter, cleaner, more circular future - together.</span>
                </div>
              </div>
            ) : (
              <>
                <h2 className="contact-form-title">Tell us about yourself</h2>
                <p className="contact-form-subtitle">A few details will help us connect you with the right team.</p>
                <form className="contact-form" onSubmit={onSubmit}>
                  {/* Honeypot field — hidden from real users via CSS, not just
                      visually; also unreachable by keyboard and skipped by
                      screen readers, so it never trips up genuine visitors. */}
                  <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                    <label htmlFor="c-website">Website</label>
                    <input
                      id="c-website"
                      type="text"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="c-name">Full Name</label>
                    <input id="c-name" type="text" name="name" placeholder="Enter your full name" value={form.name} onChange={onChange} maxLength={100} required />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="c-email">Work Email</label>
                    <input id="c-email" type="email" name="email" placeholder="you@company.com" value={form.email} onChange={onChange} maxLength={254} required />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="c-company">Company / Organization</label>
                    <input id="c-company" type="text" name="company" placeholder="Your company name" value={form.company} onChange={onChange} maxLength={100} />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="c-interest">What can we help you with?</label>
                    <select id="c-interest" name="interest" value={form.interest} onChange={onChange} required>
                      <option value="" disabled>Select an area of interest</option>
                      {INTEREST_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  {form.interest === 'Other' && (
                    <div className="contact-form__field">
                      <label htmlFor="c-other-interest">Please specify</label>
                      <input
                        id="c-other-interest"
                        type="text"
                        name="otherInterest"
                        placeholder="Tell us what you're looking for"
                        value={form.otherInterest}
                        onChange={onChange}
                        maxLength={100}
                        required
                      />
                    </div>
                  )}
                  <div className="contact-form__field">
                    <label htmlFor="c-message">Tell us more</label>
                    <textarea id="c-message" name="message" rows={4} placeholder="Tell us a little about your challenge, requirement, or idea…" value={form.message} onChange={onChange} maxLength={1000} required />
                  </div>
                  <div className="contact-form__field">
                    <div ref={recaptchaBoxRef} />
                    {captchaError && (
                      <p className="contact-form__error">Please verify you&apos;re not a robot.</p>
                    )}
                  </div>
                  <button type="submit" className="contact-form__submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : <>Start a Conversation <ChevronRight size={16} /></>}
                  </button>
                  {status === 'error' && (
                    <p className="contact-form__error">Something went wrong. Please try again.</p>
                  )}
                  <p className="contact-form__privacy">
                    <Lock size={12} />
                    Your information is secure and will never be shared.
                  </p>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
