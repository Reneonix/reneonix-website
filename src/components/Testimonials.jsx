const QUOTES = [
  {
    body:
      "Reneonix didn't just deliver a product — they embedded with our team and helped us rethink how we approach the entire problem. The results speak for themselves.",
    initials: 'SK',
    name: 'Sarah Kim',
    role: 'VP Engineering, Northwind Industries',
  },
  {
    body:
      'We evaluated five vendors. Reneonix was the only team that understood the full stack — hardware, software, and the materials underneath. That made the difference.',
    initials: 'DR',
    name: 'Dr. Daniel Reyes',
    role: 'Chief Scientist, Contoso Labs',
  },
  {
    body:
      'Their platform has been running for three years without an incident. The integration was clean, the documentation excellent, and their support is best-in-class.',
    initials: 'MA',
    name: 'Maya Adeyemi',
    role: 'Director of Operations, Fabrikam',
  },
];

export default function Testimonials() {
  return (
    <section className="section section-dark" id="testimonials">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow on-dark">Client Feedback</span>
          <h2>
            What our customers <em>say</em>.
          </h2>
          <p style={{ color: 'var(--on-dark-mut)' }}>
            From global manufacturers to research institutions, here's how our partners
            describe working with us.
          </p>
        </div>

        <div className="testimonials__grid">
          {QUOTES.map((q) => (
            <div className="quote" key={q.name}>
              <span className="quote__mark">&ldquo;</span>
              <p>{q.body}</p>
              <div className="quote__author">
                <div className="avatar">{q.initials}</div>
                <div>
                  <strong>{q.name}</strong>
                  <span>{q.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
