// PDF content for "TraceOS (Retraiz): Building Trust Through End-to-End
// Traceability" — this is the only article-specific file involved in the
// PDF feature. It supplies data to the shared <ArticlePDFDocument>; nothing
// here is template logic.
//
// Animated/interactive elements from the live page (the four-stage
// hover-driven journey, the live AI insight dashboard, the chapter bridge
// quotes) have no static PDF equivalent, so they're represented here as
// plain lists/tables/quotes instead.
const traceosPdfData = {
  title: 'TraceOS (Retraiz): Building Trust Through End-to-End Traceability',
  // Used as the PDF's metadata title — which is what the browser's built-in
  // viewer suggests as the filename when the user downloads it — kept short
  // and clean, independent of the full headline shown inside the document.
  fileName: 'TraceOS Article - Reneonix',
  category: 'Traceability',
  author: 'Reneonix Product Team',
  publishedDate: 'April 15, 2026',
  readingTime: '6 min read',
  description: 'How a digital intelligence layer gives every recovered material a verifiable identity — turning recovery data into audit-ready trust.',
  // No dedicated hero photo has been uploaded for this article yet — the
  // cover renders cleanly without one; add `heroImage: '/…'` once one lands.
  heroImage: undefined,

  sections: [
    {
      heading: 'Why Traceability Is the Missing Link in the Circular Economy',
      blocks: [
        { type: 'paragraph', text: [
          { text: "Recovering valuable materials is only the first step toward a circular economy. Today's manufacturers, recyclers and regulators expect more than recovered resources - they expect " },
          { text: 'verified proof', bold: true },
          { text: ' of where those materials came from, how they were processed, and whether they meet industrial quality standards.' },
        ] },
        { type: 'paragraph', text: 'Without reliable traceability, even high-quality recovered materials can lose value, because buyers cannot confidently verify their origin or processing history.' },
        { type: 'list', items: [
          { text: 'Verified Material Origin', sub: 'Know where it came from with confidence' },
          { text: 'Complete Processing History', sub: 'Every step is recorded and fully verifiable' },
          { text: 'Trusted Digital Identity', sub: 'Every material carries a verified digital passport' },
        ] },
        { type: 'quote', text: 'If proof is what decides value - why is proof so hard to produce today?' },
      ],
    },
    {
      heading: 'Why Traditional Recovery Systems Fall Short',
      blocks: [
        { type: 'paragraph', text: 'Many recovery facilities still depend on manual records, disconnected spreadsheets and isolated software systems. The result:' },
        { type: 'list', items: [
          { text: 'No Real-Time Visibility', sub: 'Recovery performance cannot be monitored in real time.' },
          { text: 'Manual Documentation', sub: 'Time-consuming paperwork leads to delays and human errors.' },
          { text: 'No Proof of Material Origin', sub: 'Difficult to verify recycled content and material origins.' },
          { text: 'Fragmented Reporting', sub: 'Compliance reporting relies on disconnected spreadsheets and manual processes.' },
          { text: 'Limited Supply Chain Transparency', sub: 'Stakeholders operate with incomplete and disconnected data.' },
        ] },
        { type: 'quote', text: 'The fix is not more paperwork. It is a system where the record writes itself.' },
      ],
    },
    {
      heading: 'Introducing TraceOS (Retraiz)',
      blocks: [
        { type: 'paragraph', text: 'TraceOS is the digital intelligence layer of the Reneonix ecosystem. Integrated directly with our AI-powered hardware - including the Material Recovery Machine (MRM) and AI Vision Sorting modules - the platform continuously captures operational data without interrupting recovery workflows.' },
        { type: 'paragraph', text: [
          { text: 'Every batch of material receives a unique digital identity that follows it through every stage of processing, creating a secure and auditable record of its journey. Instead of fragmented data, organisations gain a ' },
          { text: 'single source of truth', bold: true },
          { text: ' for their recovery operations.' },
        ] },
        { type: 'quote', text: "The batch doesn't just move through the facility. Its story is written, verified and sealed - automatically, at every step." },
      ],
    },
    {
      heading: 'How TraceOS Works',
      blocks: [
        { type: 'paragraph', text: 'A connected process from source to circular reuse - four stages, one continuous record. Meet batch RTZ-2026-04128 - here is its life, in four stages.' },
        { type: 'list', ordered: true, items: [
          { text: 'Material Registration — The Batch Gets a Name', sub: "Every batch enters the ecosystem through a unique digital identity. Source information and material details are securely recorded - from this moment, the batch is never anonymous again." },
          { text: 'AI-Powered Verification — The Machines Vouch for It', sub: 'AI systems capture classification results, contamination levels, quality metrics and recovery outcomes for an auditable history. No human transcription - the hardware that processed the batch is the witness that signs its record.' },
          { text: 'Live Operational Intelligence — The Story Becomes Visible', sub: 'Real-time dashboards surface volumes, quality trends, efficiency and site performance - so operators see problems while they are still small, not after a shipment has already gone out.' },
          { text: 'Compliance & Reporting — The Proof Is Ready Before Anyone Asks', sub: 'Automated reports for EPR, carbon impact, recycled-content verification and batch-level documentation. When the buyer asks "can you prove it?", the answer is one click away.' },
        ] },
        { type: 'quote', text: 'A record that writes itself is useful. A record that thinks is more useful.' },
      ],
    },
    {
      heading: 'Turn Recovery Data Into Smarter Decisions',
      blocks: [
        { type: 'paragraph', text: 'Every recovery event creates valuable data. TraceOS transforms that data into actionable AI insights, helping operators detect issues early, improve recovery performance, and make faster, more confident decisions.' },
        { type: 'list', items: [
          { text: 'Detect Quality Deviations Early', sub: 'Identify contamination and quality issues before they impact recovery.' },
          { text: 'Monitor Machine Health in Real Time', sub: 'Track equipment performance and detect anomalies instantly.' },
          { text: 'Identify Operational Bottlenecks', sub: 'Spot inefficiencies and improve workflow across operations.' },
          { text: 'Improve Recovery Quality Continuously', sub: 'Use AI insights to drive better material recovery outcomes over time.' },
          { text: 'Predict Failures Before Downtime', sub: 'Proactively address risks and minimise unexpected disruptions.' },
        ] },
        { type: 'table', headers: ['Metric', 'Last 7 Days'], rows: [
          ['Recovery Rate', '92% (+8%)'],
          ['Material Quality', 'A Grade (+12%)'],
          ['Equipment Uptime', '98.5% (+3%)'],
        ] },
        { type: 'quote', text: "And the batch's story doesn't stay inside the facility - that's the whole point." },
      ],
    },
    {
      heading: 'Building Trust Through Transparency',
      blocks: [
        { type: 'paragraph', text: 'TraceOS enables every stakeholder to access reliable, verifiable recovery data - strengthening confidence across the entire material recovery ecosystem.' },
        { type: 'list', items: [
          { text: 'Manufacturers — Trust in recycled content', sub: 'Verified proof that every recycled batch meets quality and compliance standards before it enters production.' },
          { text: 'Industrial Buyers — Verified quality and provenance', sub: 'Source recovered materials with confidence, backed by verified quality scores and complete origin history.' },
          { text: 'Brands — Transparent sustainability reporting', sub: 'Publish accurate, audit-ready sustainability claims backed by real recovery data - not estimates.' },
          { text: 'Regulators — Accurate compliance documentation', sub: 'Access verifiable, tamper-proof records for EPR audits and regulatory reporting, on demand.' },
        ] },
      ],
    },
    {
      heading: "Designed for What's Next",
      blocks: [
        { type: 'paragraph', text: 'TraceOS has been designed to support a future where AI, automation and traceability work together to create intelligent, connected recovery systems.' },
        { type: 'list', items: [
          { text: 'Seamless Integration', sub: 'Works hand-in-hand with MRM and AI Vision hardware' },
          { text: 'Scalable Platform', sub: 'Built to grow with operations and evolving industry needs' },
          { text: 'Secure & Reliable', sub: 'Enterprise-grade security ensures data integrity and privacy' },
          { text: 'Continuous Innovation', sub: 'AI models and insights improve with every material processed' },
        ] },
        { type: 'statPunch', text: 'TraceOS (Retraiz) gives every recovered material a digital identity - turning recovery data into verified, audit-ready trust.' },
      ],
    },
  ],
};

export default traceosPdfData;
