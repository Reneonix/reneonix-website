// Site-wide search index — every entry the header's search overlay can
// jump to. `href` is always a top-level page path; `section` (optional) is
// an in-page element id to scroll to once that page has mounted, using the
// exact same sessionStorage handoff pattern as Header's nav dropdowns and
// Footer's section links (see sw_scroll_target in App.jsx).
//
// `pages` are shown as quick links before the user types anything.
// `all` (pages + in-page sections + blog articles) is searched once a
// query is typed — kept separate so the empty state doesn't dump all ~25
// entries on the user at once.

// Keyword lists below are pulled from each page's actual on-page copy
// (headings, feature names, section titles) — not invented — so a wide
// range of natural search words a visitor might type will still resolve
// to the right page.
export const SEARCH_PAGES = [
  {
    title: 'Home',
    keywords: 'home reneonix material circularity deeptech company post-consumer material recovery vision-based systems our solutions hardware layer software layer material science modular recovery systems vision-based sorting live process monitoring material traceability ai decision support impact reporting about us industry partnerships investors partners client feedback testimonials highlights funding announcement circular material infrastructure',
    href: '/',
  },
  {
    title: 'Solutions',
    keywords: 'solutions hardware system software material science engineering circularity integrated solutions ai-powered solutions circular systems data collection analysis decision making reporting issue detection action smart reporting time saved faster decisions continuous monitoring evidence of excellence industries we serve waste management manufacturing fmcg packaging cement construction epr compliance loss recovery traceability compliance risk',
    href: '/solutions',
  },
  {
    title: 'Hardware',
    keywords: 'hardware reneonix hardware systems industrial vision systems material recovery ai-powered sorting inspection glass sorting system scan detect classify sort recover non-destructive sorting brand recognition visionbox ai inspection quality inspection defect detection mrm material recovery machine modular front-end recovery system computer vision sensors purity bottle sorting',
    href: '/solutions/hardware',
  },
  {
    title: 'Software',
    keywords: 'software material traceability verified recovery proven compliance ai blockchain platform retriaz traceos core capabilities ai-powered verification blockchain traceability digital product passport compliance automation epr compliance reporting real-time analytics material intelligence carbon impact tracking material passport chain of custody audit-ready composition verification',
    href: '/solutions/software',
  },
  {
    title: 'Material Science',
    keywords: 'material science sample collection material characterization formulation engineering prototype development performance validation industrial application glass waste plastic waste textile waste construction waste solar waste circular economy sand blasting abrasive glass foam eco-bricks rpet 3d printing filament waste utilization research innovation thermal management next-generation materials waste streams sustainable materials carbon footprint',
    href: '/solutions/material-science',
  },
  {
    title: 'Careers',
    keywords: 'careers jobs build the circular future open roles hardware software material science business development senior mechanical engineer graphic designer fresher ai research trainee embedded system engineer manufacturing engineer quality engineer life at reneonix growth learning industry-focused projects multi-technology exposure creative freedom career advancement deep-tech sustainable innovation current openings application resume hiring join us team',
    href: '/careers',
  },
  {
    title: 'Investor Relations',
    keywords: 'investors investing in intelligent industry investment highlights founded 2023 headquarters chennai deeptech core technologies business model b2b circular economy backed by institutions government ecosystem recognition incubation acceleration nvidia inception program startup india our team founders investor relations strategic partnership innovation collaboration traceability platform material recovery infrastructure market opportunity circular manufacturing funding backers',
    href: '/investors-page',
  },
  {
    title: 'Blog',
    keywords: 'blog blogs insights articles mrm ai front-end recovery ai vision sorting glass classification traceos retraiz end-to-end traceability foam glass insulation future of resource recovery verified data featured articles our journey updates exhibition participation prototype testing research collaboration new lab setup team expansion technology milestone machine vision material science research epr compliance news',
    href: '/blog',
  },
  {
    title: 'Policy',
    keywords: 'privacy policy terms legal information security cookie policy data retention compliance ethics ip policy disclaimer information we collect information usage protection website security confidentiality cookie usage retention periods international data transfers third-party services code of business conduct ethics equal opportunity non-discrimination policy intellectual property rights personal information data protection encryption',
    href: '/policy',
  },
  {
    title: 'Industries',
    keywords: 'industries overview glass manufacturers recycling operators beverage fmcg brands mining minerals platform deployment pilot positioning material streams',
    href: '/industries',
  },
  {
    title: 'Glass Manufacturers',
    keywords: 'industries glass manufacturers cullet furnace ai vision sorting colour separation flint amber green csp contamination ceramics stone porcelain traceos traceability epr compliance recycled content material science foam glass insulation sand blasting abrasive lightweight aggregate',
    href: '/industries/glass-manufacturers',
  },
  {
    title: 'Mining & Minerals',
    keywords: 'industries mining minerals byproduct tailings fines dust silica dust glass-feed granulated material characterisation conversion pathway retraiz traceability ai vision sorting virgin silica sand processing cost compliance esg resource efficiency',
    href: '/industries/mining-minerals',
  },
  {
    title: 'Beverage & FMCG Brands',
    keywords: 'industries beverage fmcg brands packaging recovery recycled content epr reporting retraiz traceos brand detection mrm ai coca-cola pernod ricard pilot refill reuse carbon attribution compliance audit-ready',
    href: '/industries/beverage-fmcg-brands',
  },
  {
    title: 'Recycling Operators',
    keywords: 'industries recycling operators mrf material recovery facility ai sorting hardware retraiz traceos mrm ai vision sorting cercle x mini mines glass sorter battery sorting pilot deployment purity throughput buyer-ready material',
    href: '/industries/recycling-operators',
  },
  {
    title: 'Municipalities & Government',
    keywords: 'industries municipalities government public sector waste management material recovery partnership traceos retraiz compliance esg',
    href: '/industries/municipalities-government',
  },
  {
    title: 'Contact',
    keywords: 'contact contact us get in touch talk to us enquiry inquiry email phone message reach out support',
    href: '/contact-us',
  },
];

const SEARCH_SECTIONS = [
  { title: 'About Us', keywords: 'about circular material infrastructure company mission', href: '/', section: 'about' },
  { title: 'Our Investors', keywords: 'investors backed leaders long term', href: '/', section: 'investors' },
  { title: 'Testimonials', keywords: 'testimonials customers partners reviews', href: '/', section: 'testimonials' },
  { title: 'News & Highlights', keywords: 'news research milestones press media', href: '/', section: 'highlights' },

  { title: 'AI Vision & Sorting', keywords: 'computer vision material identification sorter', href: '/solutions/hardware', section: 'hw-sorter' },
  { title: 'MRM (AI) — Material Recovery Machine', keywords: 'mrm material recovery machine sensor', href: '/solutions/hardware', section: 'hw-mrm' },

  { title: 'Our Integrated Solutions', keywords: 'integrated solutions cards overview', href: '/solutions', section: 'integrated-solutions' },

  { title: 'Open Roles', keywords: 'open roles jobs openings apply positions vacancies', href: '/careers', section: 'open-roles' },
  { title: 'Life at Reneonix', keywords: 'life culture team photos gallery builders', href: '/careers', section: 'life-at-reneonix' },
  { title: 'Why Join Reneonix', keywords: 'why join growth benefits', href: '/careers', section: 'growth' },

  { title: 'Investment Highlights', keywords: 'category defining opportunity highlights', href: '/investors-page', section: 'inv-highlights' },
  { title: 'Business Model', keywords: 'built for industrial scale model', href: '/investors-page', section: 'inv-model' },
  { title: 'Our Team', keywords: 'team shaping future circular innovation leadership', href: '/investors-page', section: 'inv-team' },
  { title: 'Investor Contact', keywords: "let's build future together contact investors", href: '/investors-page', section: 'inv-contact' },
];

const SEARCH_ARTICLES = [
  {
    title: 'MRM (AI): The Next-Gen Front-End Recovery for Circular Materials',
    keywords: 'mrm ai front-end recovery material recovery machine article technology collect first sort later identify ai scan recover verify at source reuse stream recycling stream ai decision engine digital traceability retraiz industrial deployment glass pet aluminium refill ready processor ready',
    href: '/blog/mrm-ai-front-end-recovery',
  },
  {
    title: 'AI Vision Sorting: Delivering 98% Accuracy in Glass Classification',
    keywords: 'ai vision sorting glass classification article technology colour confusion contamination damaged labels inconsistent streams traditional sorting glass colour bottle shape brand identification surface condition material integrity confidence score live performance dashboard always learning conveyor data capture feedback loop model training',
    href: '/blog/ai-vision-sorting-glass-classification',
  },
  {
    title: 'TraceOS (Retraiz): Building Trust Through End-to-End Traceability',
    keywords: 'traceos retraiz traceability article material registration ai-powered verification live operational intelligence compliance reporting digital passport epr audits manufacturers industrial buyers brands regulators seamless integration scalable platform secure reliable continuous innovation',
    href: '/blog/traceos-retraiz-traceability',
  },
  {
    title: 'From Glass Fines to Foam Glass Insulation: Creating New Value',
    keywords: 'foam glass insulation glass fines article material science residual waste from waste to formulation from furnace to building research-driven innovation ceramic engineer materials engineer lightweight structure thermal insulation durable performance circular material solution',
    href: '/blog/foam-glass-insulation',
  },
  {
    title: 'The Future of Resource Recovery: Why Integrated Infrastructure and Verified Data Matter',
    keywords: 'future resource recovery integrated infrastructure verified data article industry insight epr recycled content carbon reporting traditional recycling verified circularity one connected chain beyond compliance improve efficiency strengthen reporting build buyer confidence enable circular procurement supply chain resilience higher-value materials stronger industry partnerships',
    href: '/blog/future-of-resource-recovery',
  },
];

export const SEARCH_INDEX = [...SEARCH_PAGES, ...SEARCH_SECTIONS, ...SEARCH_ARTICLES];
