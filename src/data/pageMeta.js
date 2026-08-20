// Per-route <title> / meta description / Open Graph data — every route used
// to share the single static pair baked into index.html, so Google (and
// anyone sharing a link) saw the exact same title+snippet for Home,
// Hardware, Careers, every blog article... This is looked up by route in
// App.jsx and pushed into <head> on every navigation.

const SITE = 'Reneonix';
const SITE_URL = 'https://www.reneonix.com';

// Absolute — Open Graph/Twitter card images must be full URLs, not
// root-relative paths, to render in link previews on other platforms.
const img = (path) => `${SITE_URL}${path}`;

// Every title leads with "Reneonix |" — browser tabs truncate long titles
// from the end, so this guarantees the brand name stays visible in the tab
// even when narrow, while each page still gets its own distinct title text
// for SEO (Google indexes/ranks each page under its own title, same as
// before — only the word order changed, not the uniqueness).
const PAGE_META = {
  home: {
    title: `${SITE} | AI-Powered Material Circularity & Recovery Tech`,
    description: 'Reneonix builds AI-powered hardware, software and material science that recover post-consumer waste into traceable, industry-ready raw materials.',
    image: img('/hardware-hero.png'),
  },
  solutions: {
    title: `${SITE} | Circular Solutions: Hardware, Software & Materials`,
    description: "Explore Reneonix's integrated AI solutions for circularity - vision-based hardware, TraceOS traceability software and material science R&D in one platform.",
    image: img('/solutions-hero.jpeg'),
  },
  hardware: {
    title: `${SITE} | AI Vision Sorting & Material Recovery Machines`,
    description: 'Industrial AI vision systems for glass sorting and material recovery. Real-time scan, classify and sort at the throughput modern facilities demand.',
    image: img('/hardware-hero.png'),
  },
  software: {
    title: `${SITE} | TraceOS - AI Material Traceability & EPR Compliance`,
    description: 'TraceOS turns waste recovery data into auditable, compliance-ready material intelligence - AI verification, EPR reporting and digital material passports.',
    image: img('/software-hero.png'),
  },
  'material-science': {
    title: `${SITE} | Material Science R&D - Waste to New Materials`,
    description: "Reneonix's material science lab engineers high-performance materials from glass, plastic, textile and construction waste - from formulation to validation.",
    image: img('/material-science.png'),
  },
  industries: {
    title: `${SITE} | Industries - One Platform, Four Material Streams`,
    description: "See where Reneonix's AI recovery hardware, traceability software and material science stack is deployed today - glass, recycling, beverage & FMCG packaging, and mining & minerals byproduct.",
    image: img('/hardware-Sorter.jpg'),
  },
  'industry-glass-manufacturers': {
    title: `${SITE} | Glass Manufacturers - AI Sorting & Verified Cullet`,
    description: 'How Reneonix helps glass manufacturers cut contamination, verify recycled-content data and recover more value from cullet - AI vision sorting, traceability and material science.',
    image: img('/amber-bottle.jpg'),
  },
  'industry-mining-minerals': {
    title: `${SITE} | Minerals & Mining - Byproduct to Verified Feedstock`,
    description: 'How Reneonix applies AI identification, batch traceability and material science to mineral and mining byproducts - turning residual fines, dust and tailings into verified industrial feedstock.',
    image: img('/wireframe-retriaz.png'),
  },
  'industry-beverage-fmcg': {
    title: `${SITE} | Beverage & FMCG Brands - Verified Recovery & EPR`,
    description: 'How Reneonix gives beverage and FMCG brands verified packaging recovery, traceable recycled content, and audit-ready EPR reporting - backed by data, not estimates.',
    image: img('/Sample dashboard .jpeg'),
  },
  'industry-recycling-operators': {
    title: `${SITE} | Recycling Operators - AI Sorting & Traceability for MRFs`,
    description: 'How Reneonix helps recycling operators and MRFs turn mixed, contaminated intake into clean, high-purity, buyer-ready material - with AI sorting hardware and Retraiz traceability.',
    image: img('/hardware-Sorter.jpg'),
  },
  'industry-municipalities-government': {
    title: `${SITE} | Municipalities & Government - Material Recovery Partnerships`,
    description: "How Reneonix's AI recovery hardware, traceability software and material science stack supports municipalities and government material recovery programmes.",
    image: img('/hardware-Sorter.jpg'),
  },
  policy: {
    title: `${SITE} | Privacy & Security Policy`,
    description: "Reneonix's privacy, information security, cookie, data retention, compliance and IP policies - how we protect your data and maintain transparency.",
    image: img('/policy-hero.png'),
  },
  'investors-page': {
    title: `${SITE} | Investors - Backing Intelligent Material Recovery`,
    description: 'Reneonix is a category-defining circular economy deeptech, backed by NVIDIA Inception, DPIIT and DST NIDHI. See our investment case and team.',
    image: img('/investor-bg.jpeg'),
  },
  careers: {
    title: `${SITE} | Careers - Join the Circular Economy Deeptech Team`,
    description: 'Open roles in hardware, software, material science and business at Reneonix, Chennai. Build AI-powered technology for post-consumer material recovery.',
    image: img('/careers-hero.png'),
  },
  blog: {
    title: `${SITE} | Blog - AI, Recovery & Circularity Insights`,
    description: 'Insights, research and updates from Reneonix on AI vision, material recovery hardware, traceability software and material science innovation.',
    image: img('/blog%20hero.jpeg'),
  },
  'blog-article-mrm': {
    title: `${SITE} | MRM (AI): Next-Gen Front-End Material Recovery`,
    description: "How Reneonix's AI-powered Material Recovery Machine identifies, grades and separates materials at the source with high precision - before contamination.",
    image: img('/wireframe-mrm.png'),
    type: 'article',
    publishedTime: '2026-05-08',
  },
  'blog-article-vision-sorting': {
    title: `${SITE} | AI Vision Sorting: 98% Glass Classification Accuracy`,
    description: 'Inside the AI vision module that detects colour, brand and impurities in glass with up to 98% accuracy - enabling high-value recovery and reuse.',
    image: img('/wireframe-sorter.png'),
    type: 'article',
    publishedTime: '2026-04-28',
  },
  'blog-article-foam-glass': {
    title: `${SITE} | Foam Glass Insulation From Recycled Glass Fines`,
    description: 'How Reneonix turns low-value glass fines into high-performance foam glass insulation - a material science breakthrough in circular construction.',
    image: img('/wireframe-ms.png'),
    type: 'article',
    publishedTime: '2026-03-30',
  },
  'blog-article-traceos': {
    title: `${SITE} | TraceOS (Retraiz): End-to-End Traceability`,
    description: 'How TraceOS (Retraiz) gives batch-level visibility, EPR compliance and real-time operational intelligence across the material recovery chain.',
    image: img('/wireframe-retriaz.png'),
    type: 'article',
    publishedTime: '2026-04-15',
  },
  'blog-article-resource-recovery': {
    title: `${SITE} | The Future of Resource Recovery & Verified Data`,
    description: 'Why integrated AI and hardware platforms - not fragmented recycling - and verified data define the next era of industrial resource recovery.',
    image: img('/wireframe-resource%20recovery.png'),
    type: 'article',
    publishedTime: '2026-03-20',
  },
  'contact-us': {
    title: `${SITE} | Contact Us - Talk to Our Team`,
    description: 'Get in touch with Reneonix about AI vision hardware, traceability software, material science R&D, partnerships or investment opportunities.',
    image: img('/hardware-hero.png'),
  },
};

export default PAGE_META;
