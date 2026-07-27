// PDF content for "The Future of Resource Recovery" — this is the only
// article-specific file involved in the PDF feature. It supplies data to
// the shared <ArticlePDFDocument>; nothing here is template logic.
//
// Animated/interactive elements from the live page (the process-chain
// diagrams, the strike-through comparison, the verification chip
// animation) have no static PDF equivalent, so they're represented here as
// plain lists/tables instead.
const resourceRecoveryPdfData = {
  title: 'The Future of Resource Recovery: Why Integrated Infrastructure and Verified Data Matter',
  // Used as the PDF's metadata title — which is what the browser's built-in
  // viewer suggests as the filename when the user downloads it — kept short
  // and clean, independent of the full headline shown inside the document.
  fileName: 'Resource Recovery Article - Reneonix',
  category: 'Industry Insight',
  author: 'Reneonix Strategy & Sustainability Team',
  publishedDate: 'March 20, 2026',
  readingTime: '8-10 min read',
  description: 'Why integrated AI + hardware platforms and verified data - not fragmented recycling solutions - define the next era of industrial responsibility.',
  // No dedicated hero photo has been uploaded for this article yet — the
  // cover renders cleanly without one; add `heroImage: '/…'` once one lands.
  heroImage: undefined,

  sections: [
    {
      heading: 'Overview',
      blocks: [
        { type: 'paragraph', text: "Every material has a story. The steel in a machine, the plastic in a package, the copper in a cable - each one travels a long road before it reaches us, and an even longer one after we let it go. For decades, that second half of the story went untold. Materials disappeared into landfills, and their value disappeared with them." },
        { type: 'paragraph', text: [
          { text: 'That story is now being rewritten. Around the world, governments, manufacturers, brands, and regulators are raising the bar for how materials are recovered, reused, and returned to the economy. Rules like ' },
          { text: 'EPR, recycled-content requirements, and carbon reporting', bold: true },
          { text: ' are reshaping what organizations must measure - and what they must prove.' },
        ] },
        { type: 'paragraph', text: 'Because today, sustainability is no longer a promise. It is evidence. Organizations must show where their materials come from, how they are processed, and the environmental value they truly create.' },
      ],
    },
    {
      heading: "The Challenge with Today's Recovery Infrastructure",
      blocks: [
        { type: 'paragraph', text: 'Picture the journey of a single recovered material. It is collected by one company, aggregated by another, traded by a third, recycled by a fourth, and finally remade into something new by a fifth. Five hands, five systems - and almost no shared memory between them.' },
        { type: 'list', ordered: true, items: ['Collection', 'Aggregation', 'Trading', 'Recycling', 'Manufacturing'] },
        { type: 'paragraph', text: "This fragmentation is the industry's quiet weakness. It creates limited visibility, inconsistent quality, manual reporting, and compliance headaches. Organizations struggle to answer even the simplest questions about their materials - and about the impact they claim to make." },
        { type: 'quote', text: 'Success was once measured by how much was recycled. Today, it is about proving it.' },
      ],
    },
    {
      heading: 'Verified Data Makes Sustainability Measurable',
      blocks: [
        { type: 'paragraph', text: 'There was a time when success was measured by a single number: how much was recycled. That era is ending. Today, the question is not how much - it is can you prove it? Verified data is what turns sustainability from a claim into something measurable, transparent, and trustworthy.' },
        { type: 'table', headers: ['Traditional Recycling', 'Verified Circularity'], rows: [
          ['Volume-based', 'Quantifiable'],
          ['Limited visibility', 'Traceable'],
          ['Manual processes', 'Impact-driven'],
        ] },
        { type: 'paragraph', text: [
          { text: 'Modern circular-economy initiatives demand more than good intentions - they demand ' },
          { text: 'traceability, verified recycled content, carbon measurement, regulatory compliance, and transparent reporting', bold: true },
          { text: ', every step of the way.' },
        ] },
      ],
    },
    {
      heading: 'One Connected Chain, Not Six Separate Systems',
      blocks: [
        { type: 'paragraph', text: 'Recovery is a relay race with many runners - and when each one runs alone, the baton gets dropped. Data fragments. Decisions slow down. But when the stages are connected into one integrated infrastructure, materials and information move together, seamlessly, across the entire value chain.' },
        { type: 'list', ordered: true, items: ['Collection', 'Sorting', 'Processing', 'Verification', 'Reporting', 'Industrial Use'] },
        { type: 'paragraph', text: [
          { text: 'Integration delivers ' },
          { text: 'end-to-end visibility', bold: true },
          { text: ', reduces complexity, improves efficiency, and enables smarter decisions at every stage of the journey.' },
        ] },
        { type: 'statPunch', text: '6 stages. 1 system. Every record shared.' },
        { type: 'quote', text: 'If integration is the body of the circular economy, verified data is its heartbeat.' },
      ],
    },
    {
      heading: 'The Four Pillars of Intelligent Recovery',
      blocks: [
        { type: 'paragraph', text: "A connected recovery ecosystem doesn't stand on its own. It rests on four powerful pillars:" },
        { type: 'list', items: [
          { text: 'AI-Powered Hardware', sub: 'Intelligent systems that identify, sort, and capture high-quality data right at the source - where every story begins.' },
          { text: 'Digital Traceability', sub: 'Every material carries a secure digital history that follows it across its entire recovery journey.' },
          { text: 'Artificial Intelligence', sub: 'AI turns raw data into insight - better performance, better quality, better decisions.' },
          { text: 'Material Science', sub: 'Ensuring recovered materials meet industrial standards and deliver real, dependable value.' },
        ] },
      ],
    },
    {
      heading: 'What Organizations Can Now Demonstrate',
      blocks: [
        { type: 'paragraph', text: 'If integration is the body of the circular economy, verified data is its heartbeat. It is the foundation of trust and transparency - the proof behind every claim. With it, organizations can confidently demonstrate:' },
        { type: 'list', items: ['Material Origin', 'Recovery Pathway', 'Processing History', 'Recycled Content', 'Carbon Impact', 'Compliance Documentation'] },
        { type: 'paragraph', text: [
          { text: 'Digital traceability transforms every recovered material into a ' },
          { text: 'verifiable, data-rich asset', bold: true },
          { text: ' - building confidence across the entire ecosystem, one material at a time.' },
        ] },
      ],
    },
    {
      heading: 'Verified Data as a Strategic Advantage',
      blocks: [
        { type: 'paragraph', text: 'Regulation may open the door, but the real rewards lie beyond it. Verified recovery data creates long-term business value that outlasts any single rule or deadline:' },
        { type: 'list', items: ['Improve Efficiency', 'Strengthen Reporting', 'Build Buyer Confidence', 'Enable Circular Procurement', 'Supply Chain Resilience', 'Higher-Value Materials', 'Stronger Industry Partnerships'] },
        { type: 'quote', text: "In this new era, verified data isn't paperwork - it's a strategic advantage that drives growth and sustainability together." },
      ],
    },
  ],
};

export default resourceRecoveryPdfData;
