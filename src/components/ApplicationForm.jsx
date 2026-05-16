import { useEffect, useRef, useState } from 'react';
import { Upload, FileText, X, CheckCircle2, ArrowLeft } from 'lucide-react';

/**
 * ApplicationForm
 * ---------------
 * A self-contained Job Application Form page. Reads the selected
 * department + role from the URL hash query (e.g.
 *   #apply?dept=Hardware&role=Mechanical%20Design%20Engineer
 * ) and pre-fills the "Applied position" field.
 *
 * Validation is client-side. On submit we open the user's email
 * client with a mailto: prefilled message — file uploads in HTML
 * forms can't be attached via mailto, so we list them by name in
 * the body and rely on the user to attach the saved files
 * manually (the form makes this clear with helper copy).
 *
 * Replace the submit handler with a real fetch() to your backend
 * (e.g. /api/applications or a workflow endpoint) when ready.
 */

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function parseHashQuery() {
  if (typeof window === 'undefined') return {};
  const hash = window.location.hash || '';
  const q = hash.indexOf('?');
  if (q === -1) return {};
  const params = new URLSearchParams(hash.slice(q + 1));
  return Object.fromEntries(params);
}

function DropZone({ label, required, file, onFile, accept, helper, multiple = false }) {
  const inputRef = useRef(null);
  const [isOver, setIsOver] = useState(false);

  const handleFiles = (filesList) => {
    if (!filesList || !filesList.length) return;
    onFile(multiple ? Array.from(filesList) : filesList[0]);
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span className="form-required">*</span>}
      </label>
      <div
        className={`drop-zone ${isOver ? 'is-over' : ''} ${file ? 'is-filled' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          hidden
        />
        {!file ? (
          <>
            <span className="drop-zone__icon"><Upload size={22} /></span>
            <span className="drop-zone__title">Upload a file</span>
            <span className="drop-zone__sub">Drag and drop a file</span>
          </>
        ) : (
          <div className="drop-zone__files">
            {(Array.isArray(file) ? file : [file]).map((f, idx) => (
              <div className="drop-zone__file" key={`${f.name}-${idx}`}>
                <FileText size={16} />
                <span className="drop-zone__file-name">{f.name}</span>
                <span className="drop-zone__file-size">
                  {(f.size / 1024).toFixed(0)} KB
                </span>
                <button
                  type="button"
                  className="drop-zone__remove"
                  aria-label={`Remove ${f.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (multiple && Array.isArray(file)) {
                      const next = file.filter((_, i) => i !== idx);
                      onFile(next.length ? next : null);
                    } else {
                      onFile(null);
                    }
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <span className="drop-zone__hint">Click or drop to add more</span>
          </div>
        )}
      </div>
      {helper && <span className="form-helper">{helper}</span>}
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ApplicationForm() {
  const [params, setParams] = useState(parseHashQuery);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: params.role || '',
  });
  const [resume, setResume] = useState(null);
  const [docs, setDocs] = useState(null);

  // Re-read URL params if hash changes while the page is mounted
  useEffect(() => {
    const onHashChange = () => {
      const next = parseHashQuery();
      setParams(next);
      setForm((f) => ({ ...f, position: next.role || f.position }));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim())  errs.lastName  = 'Last name is required';
    if (!form.email.trim())     errs.email     = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email address';
    if (!form.phone.trim())  errs.phone = 'Phone number is required';
    else if (!/^[+\d\s()-]{7,}$/.test(form.phone))
      errs.phone = 'Please enter a valid phone number';
    if (!form.position.trim()) errs.position = 'Applied position is required';
    if (!resume) errs.resume = 'Please attach your resume';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      const firstKey = Object.keys(errs)[0];
      const node = document.querySelector(`[data-field="${firstKey}"]`);
      node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const resumeData = resume
        ? { name: resume.name, content: await fileToBase64(resume) }
        : null;

      const docsData = docs
        ? await Promise.all(
            (Array.isArray(docs) ? docs : [docs]).map(async (d) => ({
              name: d.name,
              content: await fileToBase64(d),
            }))
          )
        : [];

      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          department: params.dept || '',
          position: form.position,
          resume: resumeData,
          docs: docsData,
        }),
      });

      if (!res.ok) {
        let errorMsg = 'Something went wrong. Please try again.';
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch {
          // Response wasn't JSON (e.g. 404 HTML from dev server)
        }
        throw new Error(errorMsg);
      }

      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="appform-page" id="apply">
        <div className="container">
          <div className="appform-success">
            <CheckCircle2 size={56} />
            <h1>Application sent</h1>
            <p>
              Thank you, <strong>{form.firstName} {form.lastName}</strong>. We've received your application and will reach out to you at <strong>{form.email}</strong> shortly.
            </p>
            <a href="#careers" className="btn btn-primary">
              <ArrowLeft size={14} aria-hidden="true" />
              Back to Careers
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="appform-page" id="apply">
      <div className="container">
        <a href="#careers" className="appform-back">
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Careers
        </a>

        <header className="appform-head">
          <h1>Job Application Form</h1>
          <p>Please fill out the form below to submit your application.</p>
          {(params.role || params.dept) && (
            <div className="appform-context">
              {params.dept && <span className="appform-chip">{params.dept}</span>}
              {params.role && <span className="appform-chip appform-chip--lime">{params.role}</span>}
            </div>
          )}
        </header>

        <form className="appform" onSubmit={handleSubmit} noValidate>
          {/* Name row */}
          <div className="form-row">
            <div className="form-group" data-field="firstName">
              <label className="form-label">
                Name <span className="form-required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.firstName ? 'has-error' : ''}`}
                value={form.firstName}
                onChange={update('firstName')}
                placeholder=""
                autoComplete="given-name"
              />
              <span className="form-sub">First name</span>
              {errors.firstName && <span className="form-error">{errors.firstName}</span>}
            </div>

            <div className="form-group" data-field="lastName">
              <label className="form-label">&nbsp;</label>
              <input
                type="text"
                className={`form-input ${errors.lastName ? 'has-error' : ''}`}
                value={form.lastName}
                onChange={update('lastName')}
                placeholder=""
                autoComplete="family-name"
              />
              <span className="form-sub">Last name</span>
              {errors.lastName && <span className="form-error">{errors.lastName}</span>}
            </div>
          </div>

          {/* Contact row */}
          <div className="form-row">
            <div className="form-group" data-field="email">
              <label className="form-label">
                E-mail <span className="form-required">*</span>
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                value={form.email}
                onChange={update('email')}
                autoComplete="email"
                placeholder="you@example.com"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group" data-field="phone">
              <label className="form-label">Phone Number <span className="form-required">*</span></label>
              <input
                type="tel"
                className={`form-input ${errors.phone ? 'has-error' : ''}`}
                value={form.phone}
                onChange={update('phone')}
                autoComplete="tel"
                placeholder="+91 98XXX XXXXX"
              />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>
          </div>

          {/* Position */}
          <div className="form-group" data-field="position">
            <label className="form-label">
              Applied position <span className="form-required">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${errors.position ? 'has-error' : ''}`}
              value={form.position}
              onChange={update('position')}
              placeholder="e.g. IoT Engineer"
            />
            {errors.position && <span className="form-error">{errors.position}</span>}
          </div>

          {/* Resume */}
          <div data-field="resume">
            <DropZone
              label="Upload Resume"
              required
              file={resume}
              onFile={setResume}
              accept=".pdf,.doc,.docx"
              helper="PDF, DOC or DOCX, up to ~10 MB."
            />
            {errors.resume && <span className="form-error">{errors.resume}</span>}
          </div>

          {/* Other docs */}
          <DropZone
            label="Any other documents to upload"
            file={docs}
            onFile={setDocs}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            helper="You can share certificates, diplomas etc..."
            multiple
          />

          {apiError && (
            <p style={{ color: '#ff4d4d', fontSize: '14px', marginBottom: '12px' }}>{apiError}</p>
          )}
          <div className="appform-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending…' : 'Apply'}
              {!loading && <Arrow />}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
