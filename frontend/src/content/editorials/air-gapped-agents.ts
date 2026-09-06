import type { PillarEditorial } from '../types';

// Batch-converted editorial. Claim-audited; publish bar decides.
export const airGappedAgents: PillarEditorial = {
  "pillarId": "air-gapped-agents",
  "updated": "2026-09-06",
  "definition": "Hardened agent distribution packaged for defense, banking, and critical infrastructure environments with zero internet access, complete model bundling, and verified offline operation.",
  "sections": [
    {
      "heading": "Understanding Air-Gapped Agent Requirements",
      "paragraphs": [
        "Air-gapped agents are CodingAgent distributions designed for environments with absolutely no internet connectivity. These environments exist in defense systems, banking infrastructure, healthcare records, critical infrastructure control systems, and other scenarios where network access is prohibited by policy, regulation, or security requirements.",
        "The challenge of air-gapped deployment goes far beyond simply \"running without internet.\" It requires:\n- Complete self-containment: all dependencies, models, and tools must be included in the distribution\n- Verified installation: cryptographic verification that the distribution hasn't been tampered with\n- Offline operation: all agent capabilities must work without any network connectivity\n- Secure updates: a mechanism for updating the agent without introducing security risks\n- Compliance: meeting specific regulatory and security requirements for the deployment environment",
        "Air-gapped deployments represent the most demanding use case for CodingAgent. They require the highest levels of security, the most rigorous verification, and the most comprehensive offline capabilities. Successfully deploying agents in air-gapped environments demonstrates the maturity and robustness of the entire system.",
        "For organizations operating air-gapped environments, coding agents provide significant value:\n- Accelerating development of secure, certified software\n- Assisting with code review and security analysis\n- Generating documentation and compliance artifacts\n- Supporting maintenance and updates of legacy systems\n- Enabling knowledge transfer and training",
        "However, these benefits must be balanced against the stringent security requirements. The agent must operate within strict boundaries, provide complete audit trails, and never compromise the security posture of the environment."
      ]
    },
    {
      "heading": "Distribution Packaging and Verification",
      "paragraphs": [
        "The air-gapped distribution is a complete, self-contained package that includes everything needed to run CodingAgent without any external dependencies or network access.",
        "**Complete Component Inventory** - The distribution includes:",
        "- **Agent Runtime**: The core CodingAgent execution engine with all dependencies bundled\n- **Local Models**: Pre-downloaded and quantized language models optimized for coding tasks (DeepSeek-Coder, Qwen-Coder, CodeLlama in multiple sizes)\n- **Embedding Models**: Local embedding models for semantic code search\n- **Verification Tools**: Compilers, type checkers, test runners, and security scanners for all supported languages\n- **Documentation**: Complete offline documentation, guides, and examples\n- **Configuration Templates**: Pre-configured settings for common air-gapped deployment scenarios\n- **Verification Scripts**: Scripts to verify installation integrity and system readiness",
        "**Cryptographic Verification** - Every component in the distribution is cryptographically signed and verified:",
        "- **Distribution Signature**: The entire distribution package is signed with a private key held by the CodingAgent team. The signature is verified during installation using a public key that's distributed through secure channels.\n- **Component Hashes**: Each component has a SHA-256 hash that's recorded in a manifest file. During installation, each component's hash is verified against the manifest to ensure no tampering or corruption.\n- **Chain of Trust**: The verification process establishes a complete chain of trust from the distribution signature through each component, ensuring that every piece of software has been verified.",
        "**Transfer Media** - The distribution is designed to be transferred via approved media:",
        "- **Optical Media**: CD/DVD/Blu-ray for maximum security (write-once, no hidden storage)\n- **Approved USB**: Secure, verified USB drives with hardware write-protection\n- **Secure Network Transfer**: For environments with secure internal networks (but no internet), the distribution can be transferred via authenticated, encrypted channels\n- **Physical Courier**: For the most secure environments, distribution media can be physically couriered with chain-of-custody documentation",
        "**Size and Optimization** - The distribution is optimized for size while maintaining completeness:",
        "- **Model Selection**: Includes a curated set of models rather than all available models, focusing on the most useful for coding tasks\n- **Quantization**: Uses aggressive quantization (Q4_K_M) to reduce model sizes while maintaining quality\n- **Deduplication**: Shared dependencies are deduplicated to avoid redundancy\n- **Compression**: All components are compressed to minimize transfer size",
        "A typical air-gapped distribution is 50-100GB, fitting on a single Blu-ray disc or a few USB drives. This size includes multiple model sizes, comprehensive verification tools, and complete documentation."
      ]
    },
    {
      "heading": "Installation and Verification Process",
      "paragraphs": [
        "Installing CodingAgent in an air-gapped environment is a rigorous, multi-step process that ensures security and correctness at every stage.",
        "**Pre-Installation Preparation** - Before installation begins:",
        "- **System Requirements Verification**: Verify that the target system meets minimum requirements (CPU, RAM, disk space, GPU if available)\n- **Security Clearance**: Ensure all personnel involved have appropriate security clearances\n- **Media Verification**: Verify the integrity of the distribution media using cryptographic signatures\n- **Environment Preparation**: Prepare the installation environment (directory structure, user accounts, permissions)",
        "**Installation Steps** - The installation process is fully scripted and verified:",
        "1. **Media Mounting**: Mount the distribution media on the target system\n2. **Signature Verification**: Verify the distribution signature using the pre-distributed public key\n3. **Component Extraction**: Extract all components from the distribution package\n4. **Hash Verification**: Verify the hash of each component against the manifest\n5. **Dependency Installation**: Install all bundled dependencies (no network access required)\n6. **Model Loading**: Load and verify all language models\n7. **Tool Configuration**: Configure verification tools (compilers, test runners, etc.)\n8. **System Testing**: Run comprehensive system tests to verify all components work correctly\n9. **Audit Initialization**: Initialize the audit system and verify it's recording correctly",
        "**Post-Installation Verification** - After installation, comprehensive verification ensures everything works:",
        "- **Component Tests**: Test each component individually (agent runtime, each model, each verification tool)\n- **Integration Tests**: Test components working together (agent using models, agent using verification tools)\n- **Performance Tests**: Verify performance meets requirements (inference speed, search speed, etc.)\n- **Security Tests**: Verify security controls are working (audit logging, permission enforcement, etc.)\n- **Compliance Tests**: Verify compliance with environment-specific requirements",
        "**Documentation and Sign-Off** - The installation process generates comprehensive documentation:",
        "- **Installation Log**: Detailed log of every installation step with timestamps and results\n- **Verification Report**: Report of all verification tests with pass/fail status\n- **Configuration Record**: Record of all configuration settings applied\n- **Sign-Off Documentation**: Documentation for formal sign-off by authorized personnel",
        "This rigorous installation process ensures that the agent is installed correctly, securely, and in compliance with all requirements. Every step is documented and verifiable, providing complete accountability."
      ]
    },
    {
      "heading": "Operational Considerations",
      "paragraphs": [
        "Operating agents in air-gapped environments requires special considerations that differ significantly from networked deployments.",
        "**Model Updates** - Without internet access, updating models requires the same transfer process as the initial installation:",
        "- **Update Packages**: Model updates are packaged as signed, verified update packages\n- **Transfer and Verification**: Update packages are transferred via approved media and cryptographically verified\n- **Incremental Updates**: Updates include only changed components to minimize transfer size\n- **Rollback Capability**: The system maintains previous model versions to enable rollback if needed",
        "Model updates are less frequent than in networked environments (quarterly rather than continuously), so the update process is designed for infrequent but critical updates.",
        "**Configuration Changes** - Configuration changes follow a similar process:",
        "- **Change Requests**: Configuration changes are formally requested and approved\n- **Change Packages**: Changes are packaged as signed configuration updates\n- **Verification and Testing**: Changes are verified and tested before deployment\n- **Audit Trail**: All configuration changes are recorded in the audit trail",
        "This formal change management process ensures that configuration changes are controlled, verified, and auditable.",
        "**Monitoring and Observability** - Monitoring in air-gapped environments uses local-only solutions:",
        "- **Local Dashboards**: Web-based dashboards that run locally (no external monitoring services)\n- **Log Aggregation**: Local log aggregation and analysis (no cloud-based log services)\n- **Alerting**: Local alerting via email (internal mail servers) or other approved channels\n- **Metrics Export**: Metrics can be exported to approved internal systems for analysis",
        "All monitoring data stays within the air-gapped environment, maintaining security while providing operational visibility.",
        "**User Management** - User management is handled entirely locally:",
        "- **Local Authentication**: Users authenticate against local user stores (no external identity providers)\n- **Permission Management**: Permissions are managed locally by authorized administrators\n- **Audit Logging**: All user actions are logged locally for audit and compliance",
        "**Incident Response** - Incident response procedures are adapted for air-gapped environments:",
        "- **Local Investigation**: All investigation happens locally (no cloud-based forensics tools)\n- **Internal Escalation**: Incidents are escalated through internal channels only\n- **Documentation**: All incident response activities are documented locally\n- **Lessons Learned**: Lessons learned are captured and applied locally",
        "These operational considerations ensure that agents can be effectively operated, maintained, and secured in air-gapped environments while maintaining the highest levels of security and compliance."
      ]
    },
    {
      "heading": "Compliance and Certification",
      "paragraphs": [
        "Air-gapped deployments often must meet specific compliance requirements and obtain certifications before deployment is authorized.",
        "**Regulatory Compliance** - Different industries have different regulatory requirements:",
        "- **Defense (DoD, NATO)**: Must comply with security frameworks like NIST 800-171, FedRAMP, or equivalent national standards. Requires specific security controls, audit capabilities, and certification processes.\n- **Banking (PCI-DSS, SOX)**: Must comply with financial industry regulations. Requires specific controls for data protection, audit trails, and change management.\n- **Healthcare (HIPAA)**: Must comply with healthcare privacy regulations. Requires specific controls for protected health information (PHI).\n- **Critical Infrastructure**: Must comply with industry-specific regulations (NERC CIP for energy, etc.). Requires specific controls for operational technology.",
        "CodingAgent's air-gapped distribution is designed to meet these requirements through:",
        "- **Comprehensive Audit Trails**: Complete logging of all agent activities for compliance reporting\n- **Access Controls**: Fine-grained permission controls to enforce least privilege\n- **Data Protection**: Encryption and access controls for sensitive data\n- **Change Management**: Formal processes for configuration and model updates\n- **Security Controls**: Defense-in-depth security architecture",
        "**Certification Process** - Before deployment, the agent distribution must be certified:",
        "- **Security Assessment**: Independent security assessment of the distribution and deployment\n- **Vulnerability Scanning**: Comprehensive vulnerability scanning of all components\n- **Penetration Testing**: Penetration testing to identify potential security issues\n- **Compliance Review**: Review by compliance officers to verify regulatory compliance\n- **Formal Certification**: Formal certification by authorized bodies",
        "The certification process can be extensive (months for defense deployments) but is essential for ensuring security and compliance.",
        "**Ongoing Compliance** - Compliance is not a one-time event but an ongoing process:",
        "- **Continuous Monitoring**: Continuous monitoring for compliance with security controls\n- **Regular Audits**: Regular audits (quarterly or annually) to verify ongoing compliance\n- **Update Management**: Careful management of updates to maintain compliance\n- **Incident Reporting**: Reporting of security incidents as required by regulations",
        "**Documentation Requirements** - Compliance requires comprehensive documentation:",
        "- **Security Plans**: Detailed security plans documenting all controls\n- **Audit Reports**: Regular audit reports documenting compliance status\n- **Incident Reports**: Reports of security incidents and response activities\n- **Change Records**: Records of all changes to the system",
        "This documentation provides evidence of compliance and supports ongoing security and compliance management.",
        "**Training and Awareness** - Personnel operating the system must be trained:",
        "- **Security Training**: Training on security requirements and procedures\n- **Compliance Training**: Training on compliance requirements and responsibilities\n- **Operational Training**: Training on operating the agent system\n- **Incident Response Training**: Training on incident response procedures",
        "Well-trained personnel are essential for maintaining security and compliance in air-gapped environments."
      ]
    }
  ],
  "faq": [
    {
      "question": "What are air-gapped agents?",
      "answer": "Air-gapped agents are CodingAgent distributions designed for environments with zero internet connectivity. They include all dependencies, models, and tools in a self-contained, cryptographically verified package."
    },
    {
      "question": "How are updates handled without internet?",
      "answer": "Updates are packaged as signed, verified packages and transferred via approved media (optical discs, secure USB). The same cryptographic verification process ensures update integrity."
    },
    {
      "question": "What environments require air-gapped deployment?",
      "answer": "Defense systems, banking infrastructure, healthcare records, critical infrastructure control systems, and other environments where network access is prohibited by policy, regulation, or security requirements."
    },
    {
      "question": "How is installation verified?",
      "answer": "Every component is cryptographically signed and verified. Installation includes signature verification, hash verification, comprehensive testing, and detailed documentation for formal sign-off."
    },
    {
      "question": "Can these agents meet compliance requirements?",
      "answer": "Yes. The distribution is designed to meet defense (NIST 800-171), banking (PCI-DSS, SOX), healthcare (HIPAA), and critical infrastructure compliance requirements through comprehensive audit trails, access controls, and security controls."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
