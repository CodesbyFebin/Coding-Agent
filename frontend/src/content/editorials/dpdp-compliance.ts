import type { PillarEditorial } from '../types';

export const dpdpCompliance: PillarEditorial = {
  pillarId: 'codingagent-dpdp-compliance',
  updated: '2026-09-06',
  definition:
    'DPDP-oriented controls are the set of architectural mechanisms CodingAgent.in provides so that engineering teams running agents can operate in line with India\u2019s Digital Personal Data Protection Act: India-resident data routing, zero-cross-border-telemetry design goals, data-principal rights support, and cryptographically auditable trails. Compliance under the DPDP Act is ultimately a legal determination that depends on your deployment, data flows and organisational obligations — this architecture is designed to make that determination achievable, not to assert it automatically.',
  sections: [
    {
      heading: 'What the DPDP Act asks of engineering teams',
      paragraphs: [
        'The Digital Personal Data Protection Act, 2023 establishes obligations around processing personal data in India: lawful purpose and consent for processing, data minimisation, reasonable security safeguards to prevent breaches, breach notification, and provisions enabling data principals to access, correct and erase their data. For a development platform the engineering-relevant surface is concrete: what personal data the platform touches (developer identities, repository content that may embed personal data, telemetry), where it is stored and processed, who can access it, how long it is retained, and how a principal\u2019s rights request is executed.',
        'The Act also introduces obligations for Significant Data Fiduciaries such as data-protection impact assessments and independent audits, and restricts cross-border transfers to permitted countries. Engineering platforms that default to global telemetry pipelines — analytics beacons, cloud logging, foreign-region model inference — create compliance work for their customers. Architecture that keeps data resident and telemetry minimal removes that work.',
      ],
    },
    {
      heading: 'The control set CodingAgent provides',
      paragraphs: [
        'DPDP-orientation in CodingAgent is a deployment-verification matter, and the controls are explicit so each one can be checked rather than assumed.',
      ],
      bullets: [
        'Data-residency routing — repositories classified as India-resident are routed to inference and storage in Indian regions or on-premise hardware; cloud egress outside permitted jurisdictions is policy-blocked, not discouraged.',
        'Zero-cross-border telemetry design goal — the platform does not ship product telemetry by default; operational logs stay in the operator\u2019s own infrastructure.',
        'Secrets and PII hygiene — the secrets broker keeps credentials out of model context; prompt and telemetry buffers are scrubbed so personal data does not persist into logs or memory stores.',
        'Data-principal rights support — developer and contributor records are identified, exportable and erasable; mission and audit records are retained per policy with documented retention windows.',
        'Audit provenance — every model invocation, tool call, approval and artifact hash is recorded with tamper-evident hashing, giving auditors a complete processing record.',
        'Air-gapped mode — for the highest-assurance environments, the full runtime runs with zero external network access, verified by egress tests.',
      ],
    },
    {
      heading: 'Making residency verifiable, not aspirational',
      paragraphs: [
        'Each control maps to a verification step in the deployment checklist: region configuration is asserted in policy, egress is tested with packet-level checks, and the audit log format is schema-validated. If your organisation must demonstrate DPDP alignment, these are the artifacts you would collect — the platform\u2019s job is to produce them automatically.',
      ],
    },
    {
      heading: 'Implementation guidance: making residency verifiable',
      paragraphs: [
        'Residency claims fail in the gap between intention and configuration. The practical pattern is to make data classification a first-class property of every project and repository, and to let the routing fabric enforce it mechanically: a repository marked Confidential-India routes only to Indian-region or on-premise models; a request to route it elsewhere fails closed at the policy gate with a reason recorded in the audit ledger.',
        'Telemetry discipline follows the same pattern. The platform\u2019s default posture emits nothing beyond the operator\u2019s boundary; teams that add monitoring own its region and retention explicitly. Model providers — cloud or local — are registered endpoints with declared jurisdictions, and the router treats the declaration as policy input. This turns "where did this data go" from an archaeology exercise into a query against configuration.',
        'Finally, rights execution: because every mission, approval and artifact is addressed in the audit store, fulfilling an access or erasure request becomes a scoped query plus a documented deletion, rather than a manual sweep across vendors.',
      ],
    },
    {
      heading: 'Limits, and what only your organisation can decide',
      paragraphs: [
        'Architecture cannot decide legal questions. Whether your deployment is compliant depends on your role under the Act, your consent and notice design, your vendor contracts, and interpretations that continue to evolve as rules and standards are notified. CodingAgent\u2019s position is deliberately narrow and honest: the platform provides the controls, records the evidence, and stays out of the way of your counsel. Where a claim would outrun the evidence — "certified", "fully compliant" — this documentation refuses to make it.',
        'For public-sector and regulated deployments, pair the DPDP-oriented controls with the air-gapped agents pillar and the audit-provenance pillar; together they form the sovereign deployment pattern for Indian enterprises that cannot accept foreign processing under any configuration error.',
      ],
    },
    {
      heading: 'Consent, notice and the data-principal experience',
      paragraphs: [
        'The DPDP framework puts the data principal at the center: processing rests on lawful notice and, for most purposes, informed consent that can be withdrawn as easily as it was given. For an engineering platform the practical surface is the developer experience. Every identity that signs in should have been shown a notice describing what is collected and why, in plain language, with the processing purposes enumerated rather than bundled. Consent artifacts, including the version of the notice shown, belong in the audit store so the organization can answer "what did this person agree to and when" without guesswork.',
        'Withdrawal is where most platforms leak compliance. When a developer revokes consent or leaves the organization, the platform must be able to deactivate their identity, reassign or archive their missions, and honor erasure for personal data that is no longer necessary for the stated purpose, all while preserving the tamper-evident audit record itself, which is typically kept under a lawful-obligation basis rather than consent. Engineering this distinction, separating operational logs from personal-data stores with different retention rules, is the difference between a rights request being a query and being a quarter-long project.',
        'Because agent missions can process third-party personal data embedded in repositories (customer records in test fixtures, names in issue trackers), the platform\u2019s scrubbing and minimization controls extend there: personal data should be redacted from prompts and evidence where the task does not require it, and mission memory should not become an unmanaged shadow database of such data.',
      ],
    },
    {
      heading: 'Breach readiness and retention engineering',
      paragraphs: [
        'Reasonable security safeguards under the Act are proven by preparation, and the agent runtime gives teams unusually good instrumentation for it. The controls that matter: least-privilege access on every surface, cryptographic audit records that make tampering evident, sandboxing that contains any compromised workload, and secrets handling that keeps credentials out of contexts an attacker could read. On top of those, breach readiness is an engineering artifact: define what constitutes a personal-data breach in your deployment, wire the detection signals (anomalous egress, approval-gate overrides, audit gaps), and rehearse the notification path the way you rehearse incident response, because the Act imposes time-bounded reporting obligations to the Board and affected principals.',
        'Retention is the quiet half of the discipline. Prompt histories, evidence artifacts, memory stores and audit logs each carry different sensitivity and different justified lifetimes; a retention matrix that says exactly how long each class survives, enforced by automated expiry rather than good intentions, both reduces breach exposure and makes any future erasure request tractable. The platform\u2019s artifact-hashing and provenance model is designed so that expiry can be verifiable: when something is deleted, the deletion itself is recorded without retaining the payload.',
      ],
    },
    {
      heading: 'A deployment checklist for DPDP-oriented operation',
      paragraphs: [
        'The controls only count when they are configured and verified, so the deployment checklist treats each one as a testable assertion rather than a statement of intent. Run it at onboarding and after every material change.',
      ],
      bullets: [
        'Classify repositories: every project carries a data-classification label (public, internal, confidential, India-resident) that the routing fabric can enforce mechanically.',
        'Register endpoints with jurisdictions: every model provider, cloud or local, is declared with its processing region; India-resident work fails closed to compliant endpoints only.',
        'Verify egress: run the egress test suite with packet-level assertions for the air-gapped and resident profiles, and archive the results as audit evidence.',
        'Configure telemetry ownership: confirm no third-party beacons, pin log destinations to operator-controlled infrastructure, and document retention per log class.',
        'Bind approvals to identity: SSO-backed approval gates with signed decisions, so consequential processing always has an accountable authorizer.',
        'Publish the data map: what personal data classes exist, where they live, who can access them, and how long each survives, ready for a DPIA or auditor on day one.',
        'Rehearse rights and breach flows: execute an access request and an erasure request end-to-end, and run a breach-notification tabletop using the audit ledger as the factual record.',
      ],
    },
    {
      heading: 'Evidence over assertion',
      paragraphs: [
        'None of these steps requires the platform to make legal claims on your behalf; each produces evidence your counsel and auditors can evaluate. That is the honest division of labor: the architecture generates the artifacts of compliance, the organization owns the determination. Teams that maintain this checklist as living configuration, run in CI where possible, find that DPDP-oriented operation becomes a property of the system rather than a periodic scramble before reviews.',
      ],
    },
    {
      heading: 'Vendor and model-provider obligations under the policy fabric',
      paragraphs: [
        'A DPDP-oriented deployment is only as resident as its weakest vendor, so the routing fabric treats model providers and integrations as governed vendors rather than opaque utilities. Every endpoint registration carries a declared jurisdiction, a data-retention statement and a capability class; the policy layer evaluates those declarations exactly as it evaluates tool permissions, and the audit ledger records which vendor processed which mission. When a vendor changes regions or retention terms, the registration is updated and the change is visible in review, not discovered in a migration bill.',
        'The same discipline extends to sub-processors: a cloud model provider that logs prompts in another region, a monitoring SaaS with global beacons, or a vector database replicated abroad each breaks residency silently. The platform\u2019s contribution is making the data map enumerable: endpoints, destinations, retention and egress are configuration that can be exported for review, so vendor risk assessments start from facts instead of questionnaires. Teams should refresh vendor attestations on a schedule and treat an unattested endpoint exactly like an unreviewed MCP server, which is to say, DENY until proven otherwise.',
      ],
    },
  ],
  faq: [
    {
      question: 'Is CodingAgent DPDP certified?',
      answer:
        'No certification is claimed. The platform provides DPDP-oriented controls — residency routing, minimal telemetry, PII hygiene, rights support, audit provenance — designed so your organisation can achieve and demonstrate compliance. Compliance is a legal determination specific to your deployment.'
    },
    {
      question: 'Who decides compliance for a deployment using this platform?',
      answer:
        'Your organisation does, with its counsel and auditors. The platform produces the evidence, classifications, routing records, audit provenance, retention configuration, on which that determination rests, and deliberately avoids asserting a legal conclusion it cannot verify.'
    },
    {
      question: 'How does the platform handle consent records?',
      answer:
        'Notice versions and consent artifacts are recorded with identity and timestamp in the audit store, so the organisation can answer what a principal agreed to and when, and prove withdrawal was honored.'
    },
    {
      question: 'What happens to audit records when a principal requests erasure?',
      answer:
        'Operational personal data is erased per policy while the tamper-evident record of processing events is retained under the organisation\u2019s lawful basis, with deletions themselves recorded so the trail remains verifiable.'
    },
    {
      question: 'Do agent missions create shadow copies of personal data?',
      answer:
        'The controls exist to prevent that: prompt and memory scrubbing, redaction where tasks do not require personal data, and retention matrices applied to mission memory so it never becomes an unmanaged store.'
    },
    {
      question: 'Is cross-border inference ever permitted for resident repositories?',
      answer:
        'Only when policy explicitly allows it for the classification in force, and every grant or denial is recorded with its reason; the default posture for India-resident work is local or Indian-region endpoints only.'
    },
    {
      question: 'Is CodingAgent DPDP certified?',
      answer:
        'No certification is claimed. The platform provides DPDP-oriented controls — residency routing, minimal telemetry, PII hygiene, rights support, audit provenance — designed so your organisation can achieve and demonstrate compliance. Compliance is a legal determination specific to your deployment.',
    },
    {
      question: 'Does my code leave India when I use CodingAgent?',
      answer:
        'Under the default policy posture for India-resident repositories, inference routes to Indian-region or on-premise endpoints and cross-border egress is policy-blocked. The routing decision and its reason are recorded in the audit ledger so residency is verifiable per mission.',
    },
    {
      question: 'What personal data does the platform process?',
      answer:
        'Developer identities for authentication and approvals, and any personal data embedded in repository content your missions touch. Telemetry is minimal by default and stays in your infrastructure; the data map is documented so your DPIA can be concrete.',
    },
    {
      question: 'How are data-principal requests handled?',
      answer:
        'Identity records are exportable and erasable via the admin surface, and the audit store\u2019s addressing makes it possible to locate every processed artifact associated with a principal, subject to your retention policy.',
    },
  ],
  sources: [
    {
      label: 'Digital Personal Data Protection Act, 2023 (MeitY)',
      href: 'https://www.meity.gov.in/',
    },
    { label: 'CodingAgent audit logs & provenance pillar', href: '/audit-logs-provenance' },
    { label: 'Air-gapped agents pillar', href: '/air-gapped-agents' },
  ],
};
