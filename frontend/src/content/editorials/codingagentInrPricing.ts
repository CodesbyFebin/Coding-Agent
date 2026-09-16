import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const codingagentInrpricing: PillarEditorial = {
  "pillarId": "codingagent-inr-pricing",
  "updated": "2026-09-24",
  "definition": "Transparent INR pricing structure with native UPI, NetBanking, and GST-ready automated invoicing for Indian startups — eliminating high forex transaction fees, credit card mandates, and complex international billing friction for Indian startups.",
  "sections": [
    {
      "heading": "INR Pricing Fundamentals",
      "paragraphs": [
        "INR pricing provides a transparent pricing structure for CodingAgent services, with all costs expressed in Indian Rupees (INR). This eliminates the high forex transaction fees, credit card mandates, and complex international billing friction that Indian startups typically face when using cloud-based AI coding assistants priced in USD or EUR. The pricing structure is designed specifically for the Indian market, with local payment methods and tax compliance built in from the ground up.",
        "The pricing model includes: tiered subscription plans (different tiers for individual developers, small teams, and enterprises), pay-as-you-go token consumption (billed at the end of each month based on actual token usage), and volume discounts (reduced per-token rates for high-throughput users). Each plan includes a clear breakdown of what's included (model access, tool usage, verification gates, and audit logging)."
      ]
    },
    {
      "heading": "Native UPI and NetBanking Integration",
      "paragraphs": [
        "The system integrates with India's native payment infrastructure: Unified Payments Interface (UPI) for instant bank-to-bank transfers, and NetBanking for traditional bank account payments. These payment methods are: instant (UPI settlements occur in seconds), widely available (supported by all major Indian banks), and cost-effective (no foreign transaction fees, no credit card interchange fees). The payment flow is: user selects a plan, is redirected to the UPI/NetBanking payment page, completes the payment, and is immediately returned to the CodingAgent platform with the plan activated.",
        "The integration also supports: automated subscription renewal (UPI mandates for recurring payments), payment failure handling (automatic retry and grace period notifications), and invoicing in INR with GST breakdown (Good and Services Tax, as required Indian tax law)."
      ]
    },
    {
      "heading": "GST-Ready Automated Invoicing",
      "paragraphs": [
        "The invoicing system is GST-ready: every invoice includes the Goods and Services Tax (GST) breakdown as required by Indian tax law. The system automatically: calculates the applicable GST rate (CGST + SGST for intra-state, IGST for inter-state), generates the GST invoice number and details, and includes the invoice in the user's tax documentation. The invoicing system integrates with the user's accounting software (Tally, QuickBooks, Zoho Books) via API, and provides a downloadable GST-compliant invoice in PDF format.",
        "The GST compliance features include: input tax credit (ITC) eligibility documentation, reverse charge mechanism (RCM) support for B2B transactions, and annual GST return summary (GSTR-1, GSTR-3B ready data export). This ensures that Indian startups and enterprises can maintain proper tax compliance without manual intervention."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is INR pricing?",
      "answer": "Transparent INR pricing structure with native UPI, NetBanking, and GST-ready automated invoicing for Indian startups, eliminating high forex transaction fees and complex international billing friction."
    },
    {
      "question": "What payment methods are supported?",
      "answer": "Unified Payments Interface (UPI) and NetBanking, with instant settlements, wide availability across all major Indian banks, and no foreign transaction fees."
    },
    {
      "question": "How does GST invoicing work?",
      "answer": "The system automatically calculates the applicable GST rate, generates the GST invoice number and details, and includes the invoice in the user's tax documentation. Integrates with accounting software (Tally, QuickBooks, Zoho Books) and provides downloadable GST-compliant invoices in PDF format."
    },
    {
      "question": "Are there volume discounts?",
      "answer": "Yes. The pricing model includes volume discounts (reduced per-token rates for high-throughput users) and tiered subscription plans for individual developers, small teams, and enterprises."
    },
    {
      "question": "Can I use this if I'm outside India?",
      "answer": "The INR pricing is primarily designed for Indian customers, but international customers can also subscribe. Payments would be processed in INR, and customers outside India should check with their bank about INR transaction capabilities."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};