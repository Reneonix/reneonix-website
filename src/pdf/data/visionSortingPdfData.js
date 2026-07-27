// PDF content for "AI Vision Sorting: Delivering 98% Accuracy in Glass
// Classification" — this is the only article-specific file involved in the
// PDF feature. It supplies data to the shared <ArticlePDFDocument>; nothing
// here is template logic.
//
// Animated/interactive elements from the live page (the live performance
// dashboard, the AI anatomy scanner, the learning conveyor, the
// before/after split-compare slider) have no static PDF equivalent, so
// they're represented here as plain lists/tables/quotes instead.
const visionSortingPdfData = {
  title: 'AI Vision Sorting: Delivering 98% Accuracy in Glass Classification',
  // Used as the PDF's metadata title — which is what the browser's built-in
  // viewer suggests as the filename when the user downloads it — kept short
  // and clean, independent of the full headline shown inside the document.
  fileName: 'AI Vision Sorting Article - Reneonix',
  category: 'Technology',
  author: 'Reneonix AI Research Team',
  publishedDate: 'April 28, 2026',
  readingTime: '5 min read',
  description: 'How advanced computer vision, deep learning and edge AI let Reneonix sort glass at industrial grade — with up to 98% accuracy, in real time.',
  // No dedicated hero photo has been uploaded for this article yet — the
  // cover renders cleanly without one; add `heroImage: '/…'` once one lands.
  heroImage: undefined,

  sections: [
    {
      heading: 'The Challenge: Why Glass Sorting Needs a Smarter Approach',
      blocks: [
        { type: 'paragraph', text: 'Glass is one of the most valuable recyclable materials on Earth - it can be remelted endlessly without losing quality. Yet it remains one of the hardest to recover at industrial grade. On a real recovery line, nothing arrives clean or labelled.' },
        { type: 'paragraph', text: "Colour variations blur together under factory lighting. Labels are torn, faded or missing. Bottles arrive chipped, dirty and mixed with materials that don't belong. Traditional sorting - human eyes and basic colour sensors - simply can't keep up with the speed and complexity of a modern material stream." },
        { type: 'paragraph', text: [
          { text: 'And the stakes are high: ' },
          { text: 'even small classification errors reduce material purity', bold: true },
          { text: ', locking recovered glass out of high-value manufacturing and back into low-grade uses.' },
        ] },
        { type: 'list', items: [
          { text: 'Colour confusion', sub: 'Flint, amber, green and mixed glass look deceptively similar under variable line conditions.' },
          { text: 'Contamination', sub: 'Dirt, residues and foreign materials disguise the true quality of each item.' },
          { text: 'Damaged labels', sub: 'Torn or missing labels remove the clues conventional systems depend on.' },
          { text: 'Inconsistent streams', sub: "No two batches are alike - packaging changes by region, brand and season." },
        ] },
      ],
    },
    {
      heading: 'The Breakthrough: Built for Real-World Recovery',
      blocks: [
        { type: 'paragraph', text: [
          { text: 'Conventional optical sorters ask one question: what colour is this? The Reneonix AI Vision Sorting Module asks many more. By combining ' },
          { text: 'advanced computer vision, deep learning and edge AI', bold: true },
          { text: ', it analyses every bottle in real time - the way an expert inspector would, but at line speed and without fatigue.' },
        ] },
        { type: 'table', headers: ['Capability', 'Traditional Sorting', 'Reneonix AI Vision Sorting'], rows: [
          ['Detection Basis', 'Colour only', 'Colour + Material + Shape + Brand + Condition'],
          ['Inspection Method', 'Human eye / Basic sensors', 'AI Vision + Deep Learning'],
          ['Defect Detection', 'Limited / Often missed', 'Detects cracks, chips, labels, dirt & more'],
          ['Accuracy', '~60-70%', 'Up to 98%'],
          ['Consistency', 'Varies by operator & shift', '100% consistent, 24/7'],
          ['Speed', 'Slower, manual dependent', 'Real-time, at line speed'],
          ['Output Quality', 'Mixed purity, more rework', 'High purity, minimal rework'],
        ] },
      ],
    },
    {
      heading: 'Proven Performance: Numbers from the Line, Not the Lab',
      blocks: [
        { type: 'paragraph', text: 'During validation and pilot deployments across material recovery facilities, the AI Vision Sorting Module delivered industrial-grade results - consistently, shift after shift.' },
        { type: 'list', items: [
          { text: '98% — Colour detection accuracy', sub: 'Across flint, amber, green and mixed glass streams.' },
          { text: '95% — Brand detection accuracy', sub: 'Using label recognition, bottle geometry and embossing.' },
          { text: 'Real-time — Classification at line speed', sub: 'Every item analysed without interrupting recovery operations.' },
          { text: 'Less manual intervention', sub: 'Cleaner material streams with significantly fewer manual picks.' },
        ] },
        { type: 'quote', text: 'These capabilities allow recovery facilities to produce cleaner material streams while significantly reducing manual intervention. — Reneonix AI Research Team' },
      ],
    },
    {
      heading: 'Beyond Colour: Every Bottle, Every Detail',
      blocks: [
        { type: 'paragraph', text: 'Modern recovery requires much more than identifying colours. For each item entering the facility, the model reads a full profile of visual cues - then decides the most appropriate recovery pathway, all in milliseconds.' },
        { type: 'list', items: [
          { text: 'Glass colour', sub: 'Flint, amber, green and mixed - resolved even under harsh line lighting.' },
          { text: 'Bottle shape', sub: 'Geometry recognition separates formats, sizes and container types.' },
          { text: 'Brand identification', sub: 'Labels, geometry and embossing combine to identify origin - even when labels are damaged.' },
          { text: 'Surface condition', sub: 'Scratches, chips and contamination graded before routing.' },
          { text: 'Material integrity', sub: 'Structural quality assessed to determine reuse potential.' },
          { text: 'Confidence score', sub: 'Every decision carries a confidence value, keeping humans in control of edge cases.' },
        ] },
      ],
    },
    {
      heading: 'Always Learning: Smarter Today, Smarter Tomorrow',
      blocks: [
        { type: 'paragraph', text: 'The biggest advantage of AI is that it never stops improving. Every deployment generates new operational data that refines our machine learning models. As more material passes through the system, it becomes better at recognising regional packaging variations, new bottle designs and changing industrial requirements.' },
        { type: 'list', ordered: true, items: [
          { text: 'Data capture', sub: 'High-speed cameras record every item on the line.' },
          { text: 'AI analysis', sub: 'Deep learning models classify each item in milliseconds.' },
          { text: 'Feedback loop', sub: 'Human-in-the-loop validation on uncertain calls.' },
          { text: 'Model training', sub: 'Models retrain on fresh, real-world operational data.' },
          { text: 'Better performance', sub: 'Accuracy climbs with every bottle processed.' },
        ] },
        { type: 'paragraph', text: [
          { text: 'The result is a ' },
          { text: 'continuously improving recovery platform', bold: true },
          { text: ' - not a static sorting machine.' },
        ] },
      ],
    },
    {
      heading: 'The Circular Future: Building the Foundation for Circular Materials',
      blocks: [
        { type: 'paragraph', text: [
          { text: 'High-quality secondary raw materials begin with accurate classification. By combining AI vision, industrial automation and intelligent material recognition, Reneonix enables recovery facilities to deliver ' },
          { text: 'cleaner, more consistent, buyer-ready material streams', bold: true },
          { text: '.' },
        ] },
        { type: 'statPunch', text: "Our AI Vision Sorting Module isn't simply automating inspection - it is helping redefine how industrial materials are recovered, verified and prepared for the circular economy." },
      ],
    },
  ],
};

export default visionSortingPdfData;
