import {
  Cpu,
  Lock,
  Link2,
  FileCheck,
  AlertTriangle,
  ShieldOff,
  EyeOff,
  Settings,
  Lightbulb,
  PenTool,
  Code,
  Rocket,
  Target,
  Users,
  Camera,
  CheckCircle2,
  FileText,
  Eye,
  ShieldCheck,
  ClipboardCheck,
  TrendingUp,
  Cloud,
  Network,
} from 'lucide-react';
import SolutionDetailPage from './SolutionDetailPage.jsx';

const SOFTWARE = {
  title: 'Software',
  hero: {
    title: 'Software — Retriaz',
    description:
      'Intelligence that powers circularity. Retriaz is our AI + blockchain platform that brings transparency, traceability and trust to the entire circular material ecosystem.',
    image: '/software.png',
    primaryLabel: 'Watch Solution Video',
    secondaryLabel: 'Download Brochure',
    pillars: [
      { Icon: Cpu,       title: 'AI-Powered Insights',     sub: 'Vision + ML models' },
      { Icon: Lock,      title: 'Blockchain Secured',      sub: 'Immutable & tamper-proof' },
      { Icon: Link2,     title: 'End-to-End Traceability', sub: 'From bin to brand' },
      { Icon: FileCheck, title: 'EPR Compliance Ready',    sub: 'Audit-ready reports' },
    ],
  },
  whyTech: {
    title: 'Why this technology has been chosen?',
    description:
      'Brands, regulators and recyclers each see a different view of the recovery chain. Retriaz unifies them with verifiable material flow, batch-level traceability and tamper-proof reporting — the layer that turns recovery into provable compliance.',
    stats: [
      { Icon: Eye,            value: 'Multi-view',  label: 'Transparency across the recovery chain' },
      { Icon: ShieldCheck,    value: 'Tamper-proof',label: 'Traceability at batch-level' },
      { Icon: ClipboardCheck, value: 'Audit-ready', label: 'Compliance for EPR, ESG & sustainability' },
    ],
  },
  benefits: {
    title: 'Benefits of choosing this solution',
    items: [
      { Icon: Cpu,       title: 'AI-Powered Insights',     body: 'Vision + ML models track quality, colour and classification.' },
      { Icon: Lock,      title: 'Blockchain Secured',      body: 'Immutable batch records — provable to regulators and brands.' },
      { Icon: Link2,     title: 'End-to-End Traceability', body: 'From bin to brand: every batch, every step, every actor.' },
      { Icon: FileCheck, title: 'EPR Compliance Ready',    body: 'Audit-ready reports for EPR, ESG and sustainability teams.' },
    ],
  },
  challenges: {
    title: 'Challenges we get to solve',
    items: [
      { Icon: AlertTriangle, title: 'Data Fragmentation',    body: 'Recovery data lives in spreadsheets, not systems.' },
      { Icon: ShieldOff,     title: 'Lack of Trust',         body: "Brands can't verify recovery claims from third parties." },
      { Icon: EyeOff,        title: 'No Real-time Visibility', body: 'Reporting lags weeks behind operations.' },
      { Icon: Settings,      title: 'ERP Integration Gaps',  body: "Existing systems don't speak the circular language." },
    ],
  },
  evolution: {
    title: 'Our Software Evolution',
    subtitle: 'From dashboard to data passport — Retriaz is built layer by layer.',
    steps: [
      { Icon: Lightbulb, label: 'Ideate' },
      { Icon: PenTool,   label: 'Design' },
      { Icon: Code,      label: 'Develop' },
      { Icon: Rocket,    label: 'Deploy' },
      { Icon: Target,    label: 'Impact' },
    ],
  },
  beforeBegin: {
    title: 'Before we begin',
    body:
      'Retriaz is co-built with brand owners, MRF partners, regulators and producers. Every module is validated in live recovery operations before commercial release.',
  },
  process: {
    title: 'Overall process for this solution',
    steps: [
      { Icon: Users,         label: 'Onboard Partners' },
      { Icon: Camera,        label: 'Capture at Source' },
      { Icon: Cpu,           label: 'AI Verify' },
      { Icon: Link2,         label: 'Blockchain Anchor' },
      { Icon: FileText,      label: 'Report & Audit' },
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
          'Manual EPR reporting',
          'Excel-based recovery logs',
          'No batch-level proof',
          'Months-long audit cycles',
          'Unverifiable claims',
        ],
      },
      {
        title: 'Our Solution',
        tone: 'solution',
        items: [
          'Digital Product Passports',
          'Batch-level traceability',
          'Smart contracts for EPR',
          'Real-time recovery dashboard',
          'API + ERP integrations',
        ],
      },
      {
        title: 'Future Impacts',
        tone: 'future',
        items: [
          '100% traceable materials',
          '3.2x faster compliance reporting',
          'Enterprise-grade auditability',
          'Cross-brand recovery network',
          'Scalable cloud infrastructure',
        ],
      },
    ],
  },
  statsBanner: {
    title: 'Powering Trust in Every Recovered Batch',
    subtitle: 'Software intelligence for a transparent & circular future.',
    stats: [
      { Icon: CheckCircle2, value: '100%',  label: 'Traceable Materials' },
      { Icon: TrendingUp,   value: '3.2x',  label: 'Faster Compliance Reporting' },
      { Icon: ShieldCheck,  value: 'Enterprise', label: 'Grade Auditability' },
      { Icon: Network,      value: 'Cross-brand', label: 'Recovery Network' },
      { Icon: Cloud,        value: 'Cloud', label: 'Native & Scalable' },
    ],
  },
  bottomCta: {
    title: 'Build Transparency. Drive Circular Impact.',
    subtitle: 'Partner with us to power verified recovery at every step.',
    primaryLabel: 'Schedule a Demo',
    secondaryLabel: 'Download Brochure',
  },
};

export default function SoftwarePage() {
  return <SolutionDetailPage data={SOFTWARE} />;
}
