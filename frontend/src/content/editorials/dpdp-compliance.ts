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
  ],
  faq: [
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
