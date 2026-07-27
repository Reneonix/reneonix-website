// PDF content for "MRM (AI): The Next-Gen Front-End Recovery for Circular
// Materials" — this is the only article-specific file involved in the PDF
// feature. It supplies data to the shared <ArticlePDFDocument>; nothing
// here is template logic.
//
// Animated/interactive elements from the live page (the toggleable
// traditional-vs-MRM icon flows, the scroll-synced bottle journey visual,
// the mobile pathway tab switcher, the live AI decision-engine readout)
// have no static PDF equivalent, so they're represented here as plain
// lists/tables instead.
const mrmPdfData = {
  title: 'MRM (AI): The Next-Gen Front-End Recovery for Circular Materials',
  // Used as the PDF's metadata title — which is what the browser's built-in
  // viewer suggests as the filename when the user downloads it — kept short
  // and clean, independent of the full headline shown inside the document.
  fileName: 'MRM AI Article - Reneonix',
  category: 'Technology',
  author: 'Reneonix Engineering Team',
  publishedDate: 'May 8, 2026',
  readingTime: '6 min read',
  description: 'How our AI-powered Material Recovery Machine identifies, grades and separates materials at the source with high precision.',
  // The article's own photo of the physical MRM (AI) machine — a better
  // cover image than the blog listing's wireframe thumbnail.
  heroImage: '/hardware-MRM.png',

  sections: [
    {
      heading: "A Bottle's Worth Is Lost in the First Ten Minutes",
      blocks: [
        { type: 'image', src: '/challenge-photo.jpg', caption: 'Volunteers manually sorting mixed, contaminated recyclable waste' },
        { type: 'paragraph', text: [
          { text: 'Picture our bottle a second before recovery begins. It is clean, intact, food-grade glass - at its ' },
          { text: 'highest possible value', bold: true },
          { text: '. Then it lands in a mixed collection stream, and everything conventional recovery does next works against it.' },
        ] },
        { type: 'paragraph', text: 'Most recovery systems depend on downstream sorting, where mixed materials arrive at Material Recovery Facilities (MRFs). By that stage, contamination has already eroded both the quality and the value of recyclable materials.' },
        { type: 'paragraph', text: [{ text: 'The most common problems include:', bold: true }] },
        { type: 'list', items: [
          'Mixed and contaminated material streams',
          'Low-quality recovered materials',
          'High manual sorting effort',
          'Little or no traceability',
          'Reduced potential for industrial reuse',
        ] },
        { type: 'paragraph', text: 'Together, these limitations make it nearly impossible to produce consistent, industrial-grade secondary raw materials - the exact input modern manufacturers are asking for.' },
        { type: 'quote', text: 'The problem is not how we sort. It is when we sort.' },
      ],
    },
    {
      heading: 'Identify First, Collect Second',
      blocks: [
        { type: 'paragraph', text: [
          { text: 'Traditional material recovery was designed around a simple idea: ' },
          { text: 'collect first, sort later', bold: true },
          { text: '. It has served the industry for decades, but it comes at a cost - contamination, inefficient sorting, and material quality too inconsistent for high-value industrial reuse.' },
        ] },
        { type: 'paragraph', text: "At Reneonix, we believe valuable materials should be identified, classified, and recovered at the very beginning of the recovery chain - not after they have become mixed waste. That is why we built MRM (AI), the Material Recovery Machine: an intelligent front-end recovery platform combining AI vision, edge computing, sensor technology, and digital traceability." },
        { type: 'image', src: '/recovery-photo.png', caption: 'MRM (AI) live classification scanning a PET bottle on the recovery line' },
        { type: 'quote', text: 'Turn discarded materials into verified, buyer-ready industrial raw materials - at the moment they enter the chain.' },
        { type: 'quote', text: 'So what actually happens when our bottle meets the machine? Four things - in under a second.' },
      ],
    },
    {
      heading: 'Traditional vs Front-End Recovery with MRM (AI)',
      blocks: [
        { type: 'paragraph', text: 'MRM (AI) transforms material recovery at the source - using intelligent identification, real-time analysis, and automation to deliver cleaner, higher-value outputs.' },
        { type: 'heading', level: 3, text: 'Traditional Recovery' },
        { type: 'list', ordered: true, items: ['Collect', 'Mix', 'Contaminate', 'Sort Late'] },
        { type: 'list', items: [
          'Leads to contamination and low material quality',
          'High manual effort and operational cost',
          'Poor traceability and inconsistent outcomes',
        ] },
        { type: 'heading', level: 3, text: 'Front-End Recovery with MRM (AI)' },
        { type: 'list', ordered: true, items: ['Identify', 'AI Scan', 'Recover', 'Verify at Source'] },
        { type: 'list', items: [
          'Clean streams and higher material purity',
          'Reduced manual intervention, higher efficiency',
          'Full traceability and source-level verification',
          'Ready for industrial reuse and circular economy',
        ] },
      ],
    },
    {
      heading: 'From Anonymous Waste to a Verified Material Record',
      blocks: [
        { type: 'list', ordered: true, items: [
          { text: 'Smart Material Intake - The Bottle Is Deposited', sub: "A user places the bottle into MRM's intake. Before it has even settled, integrated sensors and AI vision begin real-time analysis. The bottle is no longer anonymous - the machine is already watching." },
          { text: 'AI Vision Inspection - The Bottle Is Seen, Completely', sub: 'Within milliseconds, the system automatically detects material type, colour, condition and contamination level. What a human sorter judges in seconds, per item, MRM resolves instantly and consistently - every single time.' },
          { text: "Recovery Decision - The Bottle's Future Is Decided", sub: 'Based on the AI analysis, MRM determines the optimal recovery pathway and directs the bottle to reuse or recycling - ensuring maximum value is recovered from every single item. Our bottle is intact and clean, so it earns the highest-value outcome: reuse.' },
          { text: 'Digital Traceability - The Bottle Leaves With an Identity', sub: "Every deposited item is securely recorded in Retraiz (TraceOS), Reneonix's traceability platform - enabling complete source-to-output traceability. The bottle that arrived as waste leaves as a verified, documented industrial material." },
        ] },
        { type: 'statPunch', text: 'Confidence: 98.7% · Throughput: 462 items/min' },
        { type: 'paragraph', text: 'Every bottle. Every millisecond. AI-powered. Traceable. Accountable.' },
        { type: 'quote', text: 'Once MRM knows exactly what a bottle is, it can choose between two futures for it.' },
      ],
    },
    {
      heading: 'One Machine, Two Intelligent Pathways',
      blocks: [
        { type: 'paragraph', text: [
          { text: 'MRM (AI) identifies, classifies, and verifies materials the moment they enter the recovery chain - ' },
          { text: 'before contamination begins.', bold: true },
        ] },
        { type: 'heading', level: 3, text: 'Pathway A: Reuse Stream' },
        { type: 'paragraph', text: 'Materials suitable for reuse are identified and prepared through:' },
        { type: 'list', ordered: true, items: [
          { text: 'Brand identification', sub: 'Match with approved brand list' },
          { text: 'Bottle condition analysis', sub: 'Ensure bottle is intact and reusable' },
          { text: 'Size segregation', sub: 'Group by size for refill compatibility' },
          { text: 'Refill-ecosystem readiness', sub: 'Approved for refill and redistribution' },
        ] },
        { type: 'statPunch', text: 'Outcome: Refill Ready · Highest Value · Extended Life' },
        { type: 'image', src: '/reuse-crat.jpeg', caption: 'Crate of reusable green glass bottles ready for refill' },
        { type: 'heading', level: 3, text: 'Pathway B: Recycling Stream' },
        { type: 'paragraph', text: 'Materials destined for recycling undergo:' },
        { type: 'list', ordered: true, items: [
          { text: 'Colour sorting', sub: 'Separate by colour for purity' },
          { text: 'Contamination detection', sub: 'Remove contaminants and labels' },
          { text: 'Material classification', sub: 'Identify polymer type (PET, HDPE, etc.)' },
          { text: 'Processor-ready preparation', sub: 'Shred, clean and format for processors' },
        ] },
        { type: 'statPunch', text: 'Outcome: Processor Ready · Clean · Industrial Grade' },
        { type: 'image', src: '/recycle-pile.jpeg', caption: 'Sorted pile of recyclable plastic and aluminium materials' },
        { type: 'heading', level: 3, text: 'AI Decision Engine: Example Bottle' },
        { type: 'table', headers: ['Attribute', 'Result'], rows: [
          ['Brand', 'Unbranded'],
          ['Material', 'Amber Glass'],
          ['Condition', 'Excellent'],
          ['Size', '330 ml'],
          ['AI Confidence', '98.7%'],
          ['Decision', 'Reuse'],
          ['Processing time', '86 ms'],
        ] },
        { type: 'quote', text: 'A good story needs proof. Here is what MRM (AI) delivers on the factory floor today.' },
      ],
    },
    {
      heading: 'Engineered for the Real World, Not the Laboratory',
      blocks: [
        { type: 'paragraph', text: 'MRM is engineered for real-world industrial deployment. Every deployment continuously generates operational and material data, allowing our AI models to improve over time and strengthening the entire recovery ecosystem.' },
        { type: 'table', headers: ['Metric', 'Detail'], rows: [
          ['3', 'Material types supported today (glass, PET, aluminium)'],
          ['450-500', 'Reusable bottles per cycle (condition-verified)'],
          ['250 kg', 'Recycling capacity per cycle (processor-ready output)'],
        ] },
        { type: 'list', items: [
          'AI-powered multi-spectral vision',
          'Real-time on-edge processing',
          'Modular architecture for future material expansion',
        ] },
        { type: 'quote', text: 'And the bottle? Its record now lives in an ecosystem much bigger than one machine.' },
      ],
    },
    {
      heading: 'More Than a Recovery Machine',
      blocks: [
        { type: 'paragraph', text: "MRM is not simply another sorting machine. It is the intelligent entry point into Reneonix's complete circular material infrastructure - connecting AI vision hardware, traceability software (Retraiz), material intelligence and industrial recovery workflows." },
        { type: 'paragraph', text: 'As industries transition toward verified circular supply chains, intelligent recovery infrastructure will become essential - not optional. By combining artificial intelligence, advanced hardware and digital traceability, Reneonix is transforming fragmented material recovery into a reliable source of high-quality secondary raw materials.' },
        { type: 'list', items: [
          { text: 'AI Vision', sub: 'Real-time perception & classification' },
          { text: 'MRM (AI)', sub: 'Front-end recovery' },
          { text: 'TraceOS', sub: 'End-to-end digital traceability' },
          { text: 'Material Science', sub: 'R&D for new materials & value creation' },
        ] },
      ],
    },
  ],
};

export default mrmPdfData;
