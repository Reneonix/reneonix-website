// Reference usage — not imported anywhere in the app. Shows the exact API
// described in the component brief: two data-driven step arrays feeding the
// same <ProcessChain>, each wrapped in a section preset.
import {
  Truck, Building2, Handshake, Recycle, Factory,
} from 'lucide-react';
import { ProcessChain, ChallengeSection, SolutionSection } from './index.js';

const challengeSteps = [
  { id: 'collect', label: 'Collection', icon: Truck, tooltip: 'Paper logs, no digital record of what was picked up.' },
  { id: 'aggregate', label: 'Aggregation', icon: Building2, tooltip: 'Materials re-weighed and re-labelled by hand.' },
  { id: 'trade', label: 'Trading', icon: Handshake, tooltip: 'Ownership changes with no shared record of origin.' },
  { id: 'recycle', label: 'Recycling', icon: Recycle, tooltip: 'Processor has no visibility into upstream quality.' },
  { id: 'manufacture', label: 'Manufacturing', icon: Factory, tooltip: 'Buyers can\'t verify recycled content claims.' },
];

const solutionSteps = [
  { id: 'collect', label: 'Collection', icon: Truck, tooltip: 'Digitally recorded at the source.' },
  { id: 'aggregate', label: 'Aggregation', icon: Building2, tooltip: 'Volumes verified automatically against intake data.' },
  { id: 'trade', label: 'Trading', icon: Handshake, tooltip: 'Ownership transfers carry a full chain of custody.' },
  { id: 'recycle', label: 'Recycling', icon: Recycle, tooltip: 'Processors see verified quality before material arrives.' },
  { id: 'manufacture', label: 'Manufacturing', icon: Factory, tooltip: 'Recycled-content claims are backed by traceable data.' },
];

export default function ProcessChainDemo() {
  return (
    <>
      <ChallengeSection
        eyebrow="The Challenge"
        heading={<>Five Hands, <em>Zero Shared Records</em></>}
        intro="Traditional recovery systems are fragmented. Different players and systems handle collection, sorting, processing, and reporting — often in isolation."
        statPunch="5 systems. 0 shared records."
        closing="This fragmentation creates limited visibility, inconsistent quality, and compliance headaches at every handoff."
      >
        <ProcessChain variant="broken" steps={challengeSteps} />
      </ChallengeSection>

      <SolutionSection
        eyebrow="The Solution"
        heading={<>One Chain, <em>Fully Verified</em></>}
        intro="An integrated infrastructure connects every stage, so materials and information move together — seamlessly — across the entire value chain."
        statPunch="1 connected chain. 100% traceable."
        closing="Every handoff is logged, every claim is provable, and every material carries its history all the way to reuse."
      >
        <ProcessChain variant="healed" steps={solutionSteps} />
      </SolutionSection>
    </>
  );
}
