// PDF content for "From Glass Fines to Foam Glass Insulation: Creating New
// Value" — this is the only article-specific file involved in the PDF
// feature. It supplies data to the shared <ArticlePDFDocument>; nothing
// here is template logic.
//
// Animated/interactive elements from the live page (the alternating
// process-timeline row layout, the icon-card grid, the circular research
// "chain" with connector lines) have no static PDF equivalent, so they're
// represented here as plain lists instead.
const foamGlassPdfData = {
  title: 'From Glass Fines to Foam Glass Insulation: Creating New Value',
  // Used as the PDF's metadata title — which is what the browser's built-in
  // viewer suggests as the filename when the user downloads it — kept short
  // and clean, independent of the full headline shown inside the document.
  fileName: 'Foam Glass Article - Reneonix',
  category: 'Material Science',
  author: 'Reneonix Material Science Team',
  publishedDate: 'March 30, 2026',
  readingTime: '5 min read',
  description: 'Turning low-value residuals into high-performance building materials through material science innovation.',
  // The finished material itself, photographed for the "Research-Driven
  // Innovation" chain on the live page — doubles as a clean cover image.
  heroImage: '/Foam Glass.jpg',

  sections: [
    {
      heading: 'When Recycling Reaches Its Limit, Innovation Begins',
      blocks: [
        { type: 'paragraph', text: [
          { text: 'Not every recovered material can be directly reused or recycled. Across the recycling ecosystem, fine glass particles - commonly known as ' },
          { text: 'glass fines', bold: true },
          { text: ' - are often treated as low-value residual waste due to their small size and contamination levels. They are the leftovers of the leftovers: too fine to sort, too mixed to melt cleanly, usually destined for landfill.' },
        ] },
        { type: 'image', src: '/crushed glass -foam article.jpeg', caption: 'Pile of crushed glass fines at a material recovery facility' },
        { type: 'paragraph', text: [
          { text: 'At Reneonix, we see these materials differently. Rather than viewing glass fines as the end of the recovery journey, we see them as the ' },
          { text: 'beginning of a new industrial opportunity', bold: true },
          { text: ' through material science.' },
        ] },
        { type: 'quote', text: "Where others see the end of a material's life, material science sees raw ingredients" },
      ],
    },
    {
      heading: 'Creating the Next Recovery Pathway',
      blocks: [
        { type: 'paragraph', text: [
          { text: 'Our approach goes beyond traditional recycling. When materials can no longer move through the reuse or recycling pathway, we apply ' },
          { text: 'material science', bold: true },
          { text: ' to create entirely new industrial applications.' },
        ] },
        { type: 'paragraph', text: 'One of our key research initiatives focuses on transforming residual glass fines into foam glass insulation - a lightweight, durable, and thermally efficient construction material. This approach allows us to extend the lifecycle of recovered materials while unlocking new value from previously overlooked waste streams.' },
        { type: 'image', src: '/hand holding - foam article.jpeg', caption: 'Gloved hand holding recovered glass material in a material science lab' },
        { type: 'quote', text: "The dust that failed recycling doesn't get discarded. It gets a new job description." },
        { type: 'quote', text: 'So how does grey dust become a building material? Six steps — and one moment of fire.' },
      ],
    },
    {
      heading: 'How the Process Works',
      blocks: [
        { type: 'paragraph', text: 'The transformation follows a structured innovation pathway:' },
        { type: 'heading', level: 3, text: 'From Waste to Formulation' },
        { type: 'paragraph', text: 'Every batch begins as an unknown - glass fines are characterised, tested, and blended into a precise foaming formulation.' },
        { type: 'list', ordered: true, items: [
          { text: 'Residual Glass Fines', sub: 'The journey starts with the material everyone else has given up on - fine, mixed glass particles collected from recovery operations.' },
          { text: 'Material Characterisation & Quality Assessment', sub: "Each batch is analysed for composition, particle size and contamination - because you cannot engineer a material you don't understand." },
          { text: 'Formulation & Material Testing', sub: 'The fines are blended with foaming agents into precise formulations, tested and refined until the recipe is right.' },
        ] },
        { type: 'heading', level: 3, text: 'From Furnace to Building' },
        { type: 'paragraph', text: 'Under controlled heat, the formulation transforms into a lightweight cellular material - ready to insulate real buildings and facilities.' },
        { type: 'list', ordered: true, items: [
          { text: 'Controlled Thermal Processing', sub: 'The dramatic moment: under controlled heat, the formulation softens and expands into a cellular structure - thousands of sealed glass pores that give foam glass its remarkable properties.' },
          { text: 'Foam Glass Insulation', sub: 'Out of the furnace comes a new material: lightweight, rigid, thermally efficient - unrecognisable from the dust it once was.' },
          { text: 'Industrial Applications', sub: 'The finished material moves into buildings and industrial facilities, where it will quietly save energy for decades.' },
        ] },
        { type: 'quote', text: 'Why go to all this trouble for dust? Because the result outperforms conventional materials.' },
      ],
    },
    {
      heading: 'Why Foam Glass?',
      blocks: [
        { type: 'paragraph', text: 'Foam glass offers several advantages over conventional insulation materials:' },
        { type: 'list', items: [
          { text: 'Lightweight Structure', sub: 'Its cellular composition significantly reduces weight while maintaining structural integrity.' },
          { text: 'Excellent Thermal Insulation', sub: 'Improves energy efficiency by reducing heat transfer in buildings and industrial facilities.' },
          { text: 'Durable Performance', sub: 'Resistant to moisture, chemicals, and biological degradation — suitable for demanding environments.' },
          { text: 'Circular Material Solution', sub: 'Converting residual waste into valuable products supports a more sustainable and circular industrial ecosystem.' },
        ] },
      ],
    },
    {
      heading: 'Research-Driven Innovation',
      blocks: [
        { type: 'paragraph', text: [
          { text: "The development of foam glass insulation is part of Reneonix's ongoing collaboration with " },
          { text: 'research institutions and industry experts', bold: true },
          { text: ' to create practical, scalable solutions for circular materials.' },
        ] },
        { type: 'paragraph', text: [
          { text: 'Our goal is not only to recover materials but to ' },
          { text: 'engineer new products', bold: true },
          { text: ' that meet industrial performance standards while reducing environmental impact.' },
        ] },
        { type: 'list', items: ['Material Science', 'Circular Innovation', 'Performance Focus', 'Sustainable Future'] },
        { type: 'list', items: [
          { text: 'Ceramic Engineer', sub: 'Designing advanced ceramic formulations for optimal performance.' },
          { text: 'Ceramic Engineer', sub: 'Optimising processes to ensure quality and scalability.' },
          { text: 'Materials Engineer', sub: 'Testing, analysing and validating for stronger, safer, sustainable solutions.' },
          { text: 'Foam Glass', sub: 'Innovative insulation. Sustainable tomorrow. Stronger for a better world.' },
        ] },
      ],
    },
    {
      heading: 'Connecting the Present to the Future',
      blocks: [
        { type: 'paragraph', text: 'As industries move toward sustainable manufacturing and circular resource management, advanced material innovation will play an increasingly important role. By transforming low-value residual materials into high-performance industrial products, Reneonix is helping redefine what is possible in the future of material recovery.' },
        { type: 'statPunch', text: 'Every recovered material deserves another opportunity to create value — and material science makes that possible.' },
        { type: 'paragraph', text: [
          { text: 'Foam glass insulation', bold: true },
          { text: ' turns residual waste into industrial-grade value — engineered in our Material Science lab.' },
        ] },
      ],
    },
  ],
};

export default foamGlassPdfData;
