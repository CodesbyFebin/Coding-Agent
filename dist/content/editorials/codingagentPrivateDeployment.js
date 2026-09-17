"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codingagentPrivateDeployment = void 0;
// Editorial converted from the reviewed pillar-database source. Claim-audited.
exports.codingagentPrivateDeployment = {
    "pillarId": "private-deployment",
    "updated": "2026-09-24",
    "definition": "Helm charts, Terraform modules, and Kubernetes manifests for deploying the entire CodingAgent control plane in private VPCs — giving regulated industries complete control over their agent infrastructure without external SaaS dependencies.",
    "sections": [
        {
            "heading": "Private Deployment Fundamentals",
            "paragraphs": [
                "Private deployment provides Helm charts, Terraform modules, and Kubernetes manifests for deploying the entire CodingAgent control plane in private VPCs (Virtual Private Clouds). This gives regulated industries—such as finance, healthcare, and government—complete control over their agent infrastructure without relying on external SaaS dependencies. The private deployment model ensures that all agent data, model executions, and audit logs remain within the organization's own infrastructure, meeting the strictest data sovereignty and regulatory compliance requirements.",
                "The private deployment includes: the agent runtime component (the execution engine that runs agent missions), the model registry (managed model storage and selection), the MCP server components (tool discovery and invocation servers), the audit log system (tamper-evident logging and provenance), and the management API (configuration, monitoring, and control interfaces). All components are packaged as Helm charts and Terraform modules for infrastructure-as-code deployment.",
                "The deployment is designed for: complete data sovereignty (all data remains on-premises or in a private cloud), regulatory compliance (SOC 2, ISO 27001, HIPAA, GDPR, DPDP), air-gapped operation (zero external network required), and high availability (deployed across multiple availability zones within the private VPC)."
            ]
        },
        {
            "heading": "Helm Chart Deployment",
            "paragraphs": [
                "The Helm charts package the CodingAgent control plane components for Kubernetes deployment: the agent runtime deployment (with configured sandbox isolation, resource limits, and permission policies), the model registry deployment (with configured model storage and access controls), the MCP server deployments (with configured tool registries and permission policies), and the audit log deployment (with configured retention policies and cryptographic signing). Each Helm chart includes: values.yaml for configuration customization, CRD (Custom Resource Definitions) for mission and agent management, and Service monitors for Prometheus metric collection.",
                "The Helm charts support: versioned deployments (each deployment is versioned, enabling rollback), environment-specific values (development, staging, production with different configurations), and upgrade paths (incremental updates without downtime). The Helm charts are available in the organization's private Helm registry, ensuring that only authorizeddeployments are performed.",
                "Deployment process: the organization's Kubernetes team applies the Helm charts to their private VPC, configures the values.yaml with their specific settings (domain names, authentication, storage paths), and performs a canary deployment to validate the configuration before full rollout. All deployment events are recorded in the audit trail."
            ]
        },
        {
            "heading": "Terraform Module Deployment",
            "paragraphs": [
                "The Terraform modules manage the underlying infrastructure for the CodingAgent control plane: Virtual Private Cloud (VPC) configuration (network topology, subnet segmentation, route tables), identity and access management (IAM roles and policies for agent runtime access, model registry access, MCP server access), storage configuration (persistent volume claims for audit logs, model cache, and mission state), and load balancer configuration (internal load balancer for agent runtime communication, TLS certificate management for external access). The Terraform modules enable: infrastructure as code (all infrastructure defined and version-controlled), infrastructure change tracking (all changes recorded in Terraform state and audit trail), and infrastructure reproducibility (infrastructure can be recreated from the Terraform configuration).",
                "The Terraform modules support: environment-specific configurations (development, staging, production with different network topologies and resource levels), sensitive data management (secrets stored in HashiCorp Vault or AWS Secrets Manager, with Terraform pulling secrets at deployment time), and compliance validation (Terraform plan output validated against compliance policy as code, such as OPA/Rego rules). All Terraform changes are recorded in the audit trail with the mission identifier and the operator identity."
            ]
        }
    ],
    "faq": [
        {
            "question": "What is private deployment?",
            "answer": "Helm charts, Terraform modules, and Kubernetes manifests for deploying the CodingAgent control plane in private VPCs, giving regulated industries complete control over their agent infrastructure without external SaaS dependencies."
        },
        {
            "question": "What components are included in the private deployment?",
            "answer": "The agent runtime, model registry, MCP server components, and audit log system, all packaged as Helm charts and Terraform modules."
        },
        {
            "question": "Can this be deployed air-gapped?",
            "answer": "Yes. The private deployment supports air-gapped operation with zero external network required. Model updates and configuration changes are delivered through offline channels."
        },
        {
            "question": "Does this support compliance requirements?",
            "answer": "Yes. Supports SOC 2, ISO 27001, HIPAA, GDPR, and DPDP compliance through data sovereignty, audit-ready logging, and configured security controls."
        },
        {
            "question": "How are Helm charts versioned?",
            "answer": "Each deployment is versioned, enabling rollback. Helm charts are available in the organization's private Helm registry."
        }
    ],
    "sources": [
        {
            "label": "CodingAgent source repository",
            "href": "https://github.com/CodesbyFebin/Coding-Agent"
        }
    ]
};
