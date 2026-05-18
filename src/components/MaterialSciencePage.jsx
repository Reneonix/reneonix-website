import {
  Recycle,
  Thermometer,
  Shield,
  Atom,
  FlaskConical,
  AlertTriangle,
  Trash2,
  Building2,
  Lightbulb,
  PenTool,
  Wrench,
  Rocket,
  Target,
  Truck,
  Settings,
  Flame,
  Factory,
  Search,
  CheckCircle2,
  TrendingUp,
  Zap,
  Layers,
} from 'lucide-react';
import SolutionDetailPage from './SolutionDetailPage.jsx';

const MATERIAL_SCIENCE = {
  title: 'Material Science',
  hero: {
    title: 'Material Science',
    description:
      'Re-engineering waste into advanced materials. Our flagship Foam Glass turns unrecoverable cullet into high-performance industrial inputs — light, strong, circular and future-ready.',
    image: '/solutions-material.png',
    primaryLabel: 'Watch Solution Video',
    secondaryLabel: 'Download Brochure',
    pillars: [
      { Icon: Recycle,     title: 'From Waste To Value',         sub: 'Circular by design' },
      { Icon: Thermometer, title: 'Thermally Superior Foam Glass', sub: '-200°C to +500°C' },
      { Icon: Atom,        title: 'Light, Strong & Sustainable', sub: 'Built for industrial scale' },
      { Icon: Lightbulb,   title: 'Indigenous Material Innovation', sub: 'For India & the world' },
    ],
  },
  whyTech: {
    title: 'Why this technology has been chosen?',
    description:
      'Roughly 100% of foam glass used in India is currently imported. With unrecoverable glass piling up in landfills, Reneonix material science converts those streams into high-performance foam glass for insulation, lightweight aggregates and green buildings.',
    stats: [
      { Icon: Recycle,     value: '100%',    label: 'Imported foam glass in India' },
      { Icon: Trash2,      value: 'Zero',    label: 'Domestic production today' },
      { Icon: TrendingUp,  value: 'High',    label: 'Cullet going to landfill' },
      { Icon: Layers,      value: 'Growing', label: 'Demand for insulation & sustainable materials' },
    ],
  },
  benefits: {
    title: 'Benefits of choosing this solution',
    items: [
      { Icon: Recycle,    title: '100% Recycled Input',    body: 'Made entirely from non-recyclable glass streams.' },
      { Icon: Thermometer,title: 'Thermally Superior',    body: 'Stable from -200°C to +500°C — extreme insulation.' },
      { Icon: Shield,     title: 'Fire & Chemical Resistant', body: 'Non-combustible, inert and long-life material.' },
      { Icon: Atom,       title: 'Light & Strong',         body: 'Compressive strength with closed-cell structure.' },
    ],
  },
  challenges: {
    title: 'Challenges we get to solve',
    items: [
      { Icon: AlertTriangle, title: '100% Imported Foam Glass',  body: 'India has no domestic foam glass production.' },
      { Icon: Trash2,        title: 'Cullet Going to Landfill', body: 'Unrecyclable glass with no end market.' },
      { Icon: Building2,     title: 'Insulation Demand Growing',body: 'Green-building codes outpacing supply.' },
      { Icon: FlaskConical,  title: 'No Local R&D Pipeline',    body: 'Limited academic-industry material development.' },
    ],
  },
  evolution: {
    title: 'Our Material Evolution',
    subtitle: 'From cullet to foam glass to next-gen composites — our R&D pipeline.',
    steps: [
      { Icon: Lightbulb, label: 'Ideate' },
      { Icon: PenTool,   label: 'Design' },
      { Icon: Wrench,    label: 'Develop' },
      { Icon: Rocket,    label: 'Deploy' },
      { Icon: Target,    label: 'Impact' },
    ],
  },
  beforeBegin: {
    title: 'Before we begin',
    body:
      'We co-develop with IIT-M, IIM-B Foundation, ITEL Foundation and Anna University. Every formulation is validated against industrial-grade performance benchmarks.',
  },
  process: {
    title: 'Overall process for this solution',
    steps: [
      { Icon: Truck,    label: 'Waste Collection' },
      { Icon: Settings, label: 'Processing' },
      { Icon: FlaskConical, label: 'Formulation' },
      { Icon: Flame,    label: 'Kiln Firing' },
      { Icon: Factory,  label: 'Industrial Use' },
    ],
  },
  capabilities: {
    title: 'For whom this solution plan suits for, our capabilities',
    columns: [
      {
        title: 'What before',
        subtitle: '(The Discovery)',
        tone: 'before',
        items: [
          '100% imported foam glass',
          'Cullet sent to landfill',
          'No traceable raw input',
          'Limited insulation supply',
          'Carbon-heavy alternatives',
        ],
      },
      {
        title: 'Our Solution',
        tone: 'solution',
        items: [
          'Foam glass from recycled cullet',
          'Closed-cell, lightweight structure',
          'Validated at industrial scale',
          'R&D partnerships across India',
          'Multi-stream R&D pipeline',
        ],
      },
      {
        title: 'Future Impacts',
        tone: 'future',
        items: [
          'Zero landfill recovery',
          '10x better thermal insulation',
          '50+ industrial applications',
          'Indigenous foam glass supply',
          'Next-gen composites pipeline',
        ],
      },
    ],
  },
  statsBanner: {
    title: 'Turning Waste Into High-Performance Materials',
    subtitle: 'Built for a circular, resilient and sustainable future.',
    stats: [
      { Icon: Recycle,     value: '100%',           label: 'Waste Derived Raw Material' },
      { Icon: Thermometer, value: '-200°C to 500°C',label: 'Thermal Stability' },
      { Icon: Atom,        value: 'Light & Strong', label: 'Closed-cell Structure' },
      { Icon: Factory,     value: '50+',            label: 'Industrial Applications' },
      { Icon: CheckCircle2,value: 'Zero',           label: 'Landfill, Maximum Resource Recovery' },
    ],
  },
  bottomCta: {
    title: "Let's build the future of materials. Together.",
    subtitle: 'Partner with us to co-create innovative materials that solve critical industrial challenges.',
    primaryLabel: 'Schedule a Demo',
    secondaryLabel: 'Download Brochure',
  },
};

export default function MaterialSciencePage() {
  return <SolutionDetailPage data={MATERIAL_SCIENCE} />;
}
