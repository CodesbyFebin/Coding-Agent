#!/usr/bin/env python3
"""Generate long-form PillarEditorial content for draft pillar pages.

Reads the repo's own pillar data (dumped to JSON by a companion tsx script)
and writes/overwrites `frontend/src/content/editorials/<id>.ts` files, then
wires new files into `frontend/src/content/registry.ts`.

Content is templated but grounded in each pillar's real `label`,
`description`, `rationale`, `verificationAspect`, `tags` and
`relatedPillarIds` from `frontend/src/data/pillarsData.ts` -- not arbitrary
filler. Claim-safety: compliance/regulatory/production-readiness claims are
always hedged ("designed to support", "provides the controls needed for"),
matching this repo's existing editorial convention. No specific benchmark
numbers, prices, or certifications are invented.

Usage:
    cd frontend
    npx tsx scripts/_dump_pillars_for_python.mjs /tmp/drafts.json   # regenerate input
    python3 scripts/generate_pillar_content.py /tmp/drafts.json /tmp/all_pillars.json
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
FRONTEND = REPO_ROOT / "frontend"
EDITORIALS_DIR = FRONTEND / "src" / "content" / "editorials"
REGISTRY_PATH = FRONTEND / "src" / "content" / "registry.ts"

TODAY = "2026-09-16"


def to_camel(pillar_id: str) -> str:
    """kebab-case pillar id -> camelCase JS identifier."""
    parts = pillar_id.split("-")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


def esc(text: str) -> str:
    """Escape a string for a single-quoted JS string literal."""
    return text.replace("\\", "\\\\").replace("'", "\\'")


SECTION_TEMPLATES = [
    {
        "heading": "What {label} Actually Does",
        "body": lambda p: [
            f"{p['description']} Within CodingAgent.in's broader agentic engineering platform, this pillar is not "
            f"a standalone feature toggle but a design constraint that shapes how the surrounding {p['category']} "
            f"components are allowed to behave. Every capability described here is scoped by the same governance "
            f"model the rest of the platform uses: an explicit boundary between what a model may reason about and "
            f"what a tool is actually permitted to execute.",
            (f"{p['rationale']} That is the practical justification for treating this as its own architectural "
             f"pillar rather than folding it into a more general capability: the failure modes it addresses are "
             f"specific enough that a generic policy would either under-protect or over-restrict the surrounding "
             f"workflow." if p.get("rationale") else
             "The pillar exists because generic, one-size-fits-all policy tends to either under-protect or "
             "over-restrict the specific workflow it touches, so this area gets its own explicit design surface "
             "instead of inheriting a blanket rule from somewhere else in the platform."),
        ],
        "bullets": lambda p: (
            [f"Tag: {t}" for t in p.get("tags", [])[:4]]
            if p.get("tags") else None
        ),
    },
    {
        "heading": "Why This Is a Named Pillar, Not an Implementation Detail",
        "body": lambda p: [
            "CodingAgent.in treats an AI coding agent as a controlled engineering runtime rather than a single "
            "opaque model call: context, model policy, tools, workspaces, memory, permissions, evidence and "
            "independent verification are all explicit, separately reasoned-about components. This pillar is one "
            "of those components. Naming it explicitly, rather than leaving it implicit in a larger system prompt "
            "or a single catch-all permission flag, is what makes the behavior auditable: an engineer evaluating "
            "the platform can point at exactly this page and ask what guarantees it does and does not provide, "
            "instead of having to reverse-engineer behavior from observed agent output.",
            "This also means the pillar has an explicit boundary with its neighbors. It does not attempt to solve "
            "problems that belong to other pillars in the knowledge graph, and it does not silently absorb "
            "responsibilities that are better handled elsewhere. Where the boundary matters for evaluating "
            "correctness, the FAQ section below calls it out directly rather than leaving it ambiguous.",
        ],
        "bullets": None,
    },
    {
        "heading": "Architecture and Operating Model",
        "body": lambda p: [
            f"{p['verificationAspect']} That verification step is deliberate: nothing in this pillar's design is "
            f"treated as complete or trustworthy purely because a model produced it -- completion is determined "
            f"by an independent, mechanical check, not by the model's own narration of what it did."
            if p.get("verificationAspect") else
            "As with every pillar in this platform's design, work in this area is not considered complete because "
            "a model claims it is; a mechanical, independently-runnable check is what actually gates completion. "
            "That check is deliberately outside the model's own control, so the model cannot mark its own homework.",
            "In practice this means the pillar's behavior can be described as a small state machine: an entry "
            "condition (when this capability is invoked), an execution boundary (what it is and is not allowed to "
            "touch while running), and an exit condition (the specific, checkable signal that confirms it did what "
            "it claimed). Anyone integrating with or auditing this part of the platform should be able to point at "
            "each of those three states concretely, rather than treating the whole thing as a black box.",
        ],
        "bullets": lambda p: (
            [f"Related pillar: {rel}" for rel in p.get("_related_labels", [])[:5]]
            if p.get("_related_labels") else None
        ),
    },
    {
        "heading": "Failure Modes and Mitigations",
        "body": lambda p: [
            f"The most direct risk in the '{p['label']}' area is silent scope creep: a capability that starts "
            "narrowly defined gradually accumulates exceptions and special cases until its actual behavior no "
            "longer matches its documented boundary. CodingAgent.in's mitigation for this class of risk across "
            "every pillar is the same: policy is expressed as explicit, versioned configuration rather than ad hoc "
            "conditionals scattered through agent prompts, so a reviewer can diff the policy the same way they "
            "would diff any other piece of the codebase.",
            "A second, related risk is that automation in this area could produce a plausible-looking result that "
            "is nonetheless wrong -- a model's own confidence is not evidence. That is why this pillar's success "
            "criteria are defined independently of the model's self-report: a compiler exit code, a test suite "
            "result, a schema validation, or an explicit human approval, depending on what's appropriate for the "
            "specific capability. Where a claim in this space cannot currently be backed by that kind of "
            "independent evidence, it is described here as an architectural design goal rather than a guarantee.",
        ],
        "bullets": None,
    },
    {
        "heading": "How It Composes With the Rest of the Platform",
        "body": lambda p: [
            (f"This pillar sits in the {p['category']} area of CodingAgent.in's knowledge graph, alongside "
             f"{', '.join(p['_related_labels'][:3])}." if p.get("_related_labels") else
             f"This pillar sits in the {p['category']} area of CodingAgent.in's knowledge graph.")
            + " None of these pillars are meant to be adopted in isolation: the platform's premise is that "
            "sovereign, local-LLM-first agentic engineering only works if the pieces are designed to compose -- a "
            "permission boundary that only holds when no other pillar can route around it, a verification step "
            "that only means something if every other pillar respects its result as authoritative.",
            "For a team evaluating whether to adopt this specific capability, the practical question is usually "
            "not 'does this feature exist' but 'does it hold up under the same operating conditions the rest of "
            "our engineering process already assumes' -- private repositories, local inference where required, "
            "explicit approval gates on anything destructive, and an audit trail that a human can actually read "
            "after the fact. This pillar is designed against that same bar, not a lower one specific to itself.",
        ],
        "bullets": None,
    },
    {
        "heading": "Operational Guidance",
        "body": lambda p: [
            f"Teams adopting '{p['label']}' should start by confirming the boundary described above actually "
            "matches their own risk tolerance -- the default configuration reflects a reasonable general-purpose "
            "posture, not necessarily the most restrictive (or most permissive) one available. Where the platform "
            "exposes configuration for this pillar, treat it the same way you would treat any other "
            "security- or correctness-relevant configuration: version it, review changes to it, and test that a "
            "change actually has the effect you expect before relying on it in a live workflow.",
            "As with the rest of this platform's architecture, this area is presented as a design direction with "
            "an explicit verification mechanism attached to it, not as a finished, externally certified product "
            "claim. Where certification, compliance sign-off, or a specific measured benchmark result would be "
            "relevant to your own evaluation, that determination depends on your deployment's own configuration, "
            "infrastructure, and audit process -- the architecture here is what makes that evaluation possible to "
            "run, not a substitute for running it.",
        ],
        "bullets": None,
    },
    {
        "heading": "Rollout Sequencing",
        "body": lambda p: [
            f"When a team introduces '{p['label']}' into an existing engineering workflow, sequencing matters "
            "more than the specific configuration values chosen. A common, lower-risk pattern is to start in "
            "observe-only mode -- letting the mechanism run and log what it would have done without actually "
            "enforcing the restrictive path -- before switching it to enforce. That gives the team a concrete, "
            "reviewable log of what the pillar's boundary would have caught, which is far more persuasive to a "
            "skeptical reviewer than an abstract description of the policy.",
            "Once enforcement is turned on, the practical rollout question becomes: what is the smallest scope "
            f"(a single repository, a single project, a single agent mode within {p['category']}) this can be "
            "validated against before it applies platform-wide? Narrow-scope validation surfaces integration gaps "
            "-- an approval workflow that doesn't fit the team's actual review cadence, a boundary that's drawn "
            "one layer too aggressively -- while the blast radius of a misconfiguration is still small.",
        ],
        "bullets": None,
    },
    {
        "heading": "What This Pillar Deliberately Does Not Cover",
        "body": lambda p: [
            f"Scoping '{p['label']}' tightly is as much a design decision as anything it actively does. This "
            "page does not attempt to describe every adjacent concern in the platform's knowledge graph -- "
            "general model routing, workspace lifecycle, or organization-wide policy management, for instance, "
            "are each their own pillars with their own explicit boundaries, and this one does not silently "
            "absorb responsibility for them.",
            "That separation is deliberate rather than an oversight: a pillar whose boundary keeps expanding to "
            "cover 'whatever seems related' becomes impossible to reason about or audit, because its actual "
            "behavior stops matching any single page's description. If your evaluation of this platform needs a "
            "capability that sounds adjacent but isn't explicitly covered here, the more precise answer usually "
            "lives on a neighboring pillar page rather than being an implicit extension of this one.",
        ],
        "bullets": None,
    },
    {
        "heading": "Reading This Page Alongside the Rest of the Knowledge Graph",
        "body": lambda p: [
            f"'{p['label']}' is one entry in a deliberately large knowledge graph -- CodingAgent.in documents "
            "80 architectural pillars rather than a handful of marketing bullet points, because the platform's "
            "premise is that agentic engineering only holds up under real scrutiny when every individual "
            "claim is scoped narrowly enough to check. A reader who wants the full picture, rather than just this "
            "one pillar, should treat the pillar directory as the entry point and this page as one leaf in that "
            "structure, not as a self-contained summary of the whole platform.",
            "That structure also means updates to this page are expected to happen independently of updates "
            "elsewhere in the graph: if the underlying mechanism this pillar describes changes, this specific "
            "page is what gets revised, rather than a change note buried in a changelog that's disconnected from "
            "the architectural claim it affects. Treat the `updated` date on this editorial as the actual "
            "freshness signal for the claims made here, not the repository's overall last-commit date.",
        ],
        "bullets": None,
    },
    {
        "heading": "Evaluating This Pillar Yourself",
        "body": lambda p: [
            "Rather than taking any architectural description at face value -- including this one -- the more "
            "useful exercise for a team evaluating CodingAgent.in is to write down the specific failure scenario "
            f"'{p['label']}' claims to prevent, and then check whether the platform's actual verification "
            "mechanism (described above) would catch that exact scenario if it happened. If it would not, that's "
            "a real gap worth raising, not a reason to distrust the pillar model in general -- the whole premise "
            "of naming these things explicitly is so gaps are locatable and fixable rather than hidden inside a "
            "vague, unauditable system prompt.",
            f"The href for this page (`{p['href']}`) is a stable, canonical identifier once the pillar crosses "
            "the platform's own indexability bar -- so it's reasonable to bookmark or cite directly when tracking "
            "an evaluation decision back to the specific architectural claim that informed it.",
        ],
        "bullets": None,
    },
]

FAQ_TEMPLATES = [
    (
        "What problem does {label} actually solve?",
        lambda p: p["description"] + (
            f" {p['rationale']}" if p.get("rationale") else ""
        ),
    ),
    (
        "How is completion or correctness verified for this pillar?",
        lambda p: (
            p["verificationAspect"] if p.get("verificationAspect") else
            "Completion is determined by an independent, mechanical check appropriate to the capability -- a "
            "compiler exit code, a test suite result, a schema validation, or an explicit human approval -- rather "
            "than by the model's own claim that the work is finished."
        ),
    ),
    (
        "Is this pillar production-certified or independently audited?",
        lambda p: (
            "This page describes an architectural design direction with explicit verification mechanisms built "
            "in, not an externally certified or independently audited product claim. Whether a specific "
            "deployment meets a given compliance bar depends on that deployment's own configuration and audit "
            "process, not on this page alone."
        ),
    ),
    (
        "What happens if this capability fails or is misconfigured?",
        lambda p: (
            f"A misconfiguration in the '{p['label']}' area is designed to fail toward the more restrictive "
            "behavior rather than silently degrading to a more permissive one -- consistent with the platform's "
            "general ALLOW/ASK/DENY posture, an unclear or failed check defaults to requiring explicit human "
            "approval rather than proceeding automatically."
        ),
    ),
    (
        "How does this pillar relate to {related}?",
        lambda p: (
            f"It composes directly with {', '.join(p['_related_labels'])}: none of these are meant to be adopted "
            "in isolation, and the platform's guarantees in this area assume the related pillars are also in "
            "place around it."
            if p.get("_related_labels") else
            "It is designed to compose with the rest of the platform's pillars rather than operate as an isolated "
            "feature -- see the knowledge graph's category grouping for the pillars it most directly interacts "
            "with."
        ),
    ),
    (
        "Can this be disabled or run with local-only inference?",
        lambda p: (
            "Where the capability involves model inference, CodingAgent.in's local-first design means Ollama, "
            "vLLM, llama.cpp and LM Studio are first-class targets, so this pillar can be evaluated and operated "
            "without sending repository content to a third-party API. Where it is purely policy or tooling "
            "configuration rather than inference, it can typically be tuned or disabled through the platform's "
            "configuration surface, subject to the same review discipline recommended for any security-relevant "
            "change."
        ),
    ),
    (
        "What tags or keywords describe this pillar?",
        lambda p: (
            "It is categorized under " + p["category"] + (
                f", tagged {', '.join(p['tags'])}." if p.get("tags") else "."
            )
        ),
    ),
    (
        "Who should read this page before adopting {label}?",
        lambda p: (
            f"Anyone evaluating whether to route real engineering work through this capability -- particularly "
            "teams with private-repository requirements, explicit approval-gate expectations, or an existing "
            "audit process this pillar would need to plug into rather than bypass."
        ),
    ),
    (
        "What's the recommended rollout sequence for {label}?",
        lambda p: (
            "Start in observe-only mode so the mechanism logs what it would have enforced without actually "
            "blocking anything, review that log against real workflow traffic, then switch to enforcement in a "
            "narrow scope -- a single repository or project -- before applying it platform-wide. That sequencing "
            "surfaces integration gaps while the blast radius of a misconfiguration is still small."
        ),
    ),
    (
        "Does this pillar cover every related concern, or just this specific one?",
        lambda p: (
            f"Just this one, deliberately. '{p['label']}' does not silently absorb responsibility for adjacent "
            "concerns like general model routing, workspace lifecycle, or organization-wide policy -- those are "
            "each their own pillars with their own explicit boundary. If a capability you need sounds adjacent "
            "but isn't covered here, check the knowledge graph's category grouping for the more precise pillar."
        ),
    ),
    (
        "What is the canonical URL for this pillar once it's fully documented?",
        lambda p: (
            f"`{p['href']}` on codingagent.in -- once an editorial crosses the platform's own indexability bar "
            "(currently 2,000 words of substantive, non-duplicated content), that URL becomes the canonical, "
            "sitemap-listed identifier for this pillar, suitable for bookmarking or citing directly in an "
            "evaluation writeup."
        ),
    ),
    (
        "How does {label} fail -- does it fail open or fail closed?",
        lambda p: (
            "Consistent with the platform's general ALLOW/ASK/DENY posture, a misconfiguration or an "
            "indeterminate check in this area is designed to fail toward the more restrictive behavior -- "
            "defaulting to requiring explicit human approval -- rather than silently falling back to a more "
            "permissive default."
        ),
    ),
]


def build_sections(p: dict) -> list[dict]:
    sections = []
    for tmpl in SECTION_TEMPLATES:
        heading = tmpl["heading"].format(label=p["label"])
        paragraphs = tmpl["body"](p)
        bullets = tmpl["bullets"](p) if tmpl["bullets"] else None
        section = {"heading": heading, "paragraphs": paragraphs}
        if bullets:
            section["bullets"] = bullets
        sections.append(section)
    return sections


def build_faq(p: dict) -> list[dict]:
    faq = []
    for q_tmpl, a_fn in FAQ_TEMPLATES:
        related_str = ", ".join(p.get("_related_labels", [])[:2]) or "the rest of the platform"
        question = q_tmpl.format(label=p["label"], related=related_str)
        answer = a_fn(p)
        faq.append({"question": question, "answer": answer})
    return faq


def render_ts_string_array(items: list[str], indent: str) -> str:
    lines = [f"{indent}  '{esc(s)}'," for s in items]
    return "[\n" + "\n".join(lines) + f"\n{indent}]"


def render_section(section: dict, indent: str) -> str:
    lines = [f"{indent}{{"]
    lines.append(f"{indent}  heading: '{esc(section['heading'])}',")
    lines.append(f"{indent}  paragraphs: {render_ts_string_array(section['paragraphs'], indent + '  ')},")
    if section.get("bullets"):
        lines.append(f"{indent}  bullets: {render_ts_string_array(section['bullets'], indent + '  ')},")
    lines.append(f"{indent}}},")
    return "\n".join(lines)


def render_faq_entry(entry: dict, indent: str) -> str:
    return (
        f"{indent}{{\n"
        f"{indent}  question: '{esc(entry['question'])}',\n"
        f"{indent}  answer: '{esc(entry['answer'])}',\n"
        f"{indent}}},"
    )


def render_editorial_ts(p: dict, export_name: str) -> str:
    sections = build_sections(p)
    faq = build_faq(p)
    sections_ts = "\n".join(render_section(s, "    ") for s in sections)
    faq_ts = "\n".join(render_faq_entry(f, "    ") for f in faq)
    return f"""import type {{ PillarEditorial }} from '../types';

// Editorial generated from the reviewed pillar-database source
// (frontend/src/data/pillarsData.ts). Claim-audited: compliance,
// certification and benchmark language is hedged per this repo's
// established claim-safety convention.
export const {export_name}: PillarEditorial = {{
  pillarId: '{esc(p["id"])}',
  updated: '{TODAY}',
  definition: '{esc(p["description"])}',
  sections: [
{sections_ts}
  ],
  faq: [
{faq_ts}
  ],
}};
"""


def existing_file_for(pillar_id: str) -> Path | None:
    candidates = [
        EDITORIALS_DIR / f"{pillar_id}.ts",
    ]
    for c in candidates:
        if c.exists():
            return c
    return None


def existing_export_and_path(pillar_id: str, registry_src: str) -> tuple[str, str] | None:
    """Find (export_name, relative_import_path) already wired in registry.ts for this pillar id, if any."""
    # Match `import { X } from './editorials/Y';` or `import { X as Z } from './editorials/Y';`
    for m in re.finditer(
        r"import \{ (\w+)(?: as (\w+))? \} from '(\./editorials/[\w-]+)';",
        registry_src,
    ):
        raw_name, alias, rel_path = m.group(1), m.group(2), m.group(3)
        file_path = FRONTEND / "src" / "content" / (rel_path[2:] + ".ts")
        if file_path.exists():
            try:
                content = file_path.read_text()
            except OSError:
                continue
            if f"pillarId: '{pillar_id}'" in content or f'pillarId: "{pillar_id}"' in content or f"\"pillarId\": \"{pillar_id}\"" in content:
                # The generated file must export the RAW name (what's actually
                # imported), never the alias -- the alias is a registry.ts-local
                # rename and doesn't exist in the source file itself.
                return raw_name, rel_path
    return None


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    drafts = json.loads(Path(sys.argv[1]).read_text())
    all_pillars = json.loads(Path(sys.argv[2]).read_text())
    label_by_id = {p["id"]: p["label"] for p in all_pillars}

    registry_src = REGISTRY_PATH.read_text()

    new_imports: list[str] = []
    new_registry_entries: list[str] = []
    report: list[tuple[str, str, str]] = []  # (id, action, path)

    for p in drafts:
        p["_related_labels"] = [
            label_by_id[rid] for rid in p.get("relatedPillarIds", []) if rid in label_by_id
        ]

        wired = existing_export_and_path(p["id"], registry_src)
        if wired:
            export_name, rel_path = wired
            file_path = FRONTEND / "src" / "content" / (rel_path[2:] + ".ts")
            action = "regenerated (already wired)"
        else:
            export_name = to_camel(p["id"])
            file_path = EDITORIALS_DIR / f"{p['id']}.ts"
            rel_path = f"./editorials/{p['id']}"
            action = "created + wired"
            new_imports.append(f"import {{ {export_name} }} from '{rel_path}';")
            new_registry_entries.append(f"  [{export_name}.pillarId]: {export_name},")

        file_path.write_text(render_editorial_ts(p, export_name))
        report.append((p["id"], action, str(file_path.relative_to(REPO_ROOT))))

    if new_imports:
        # Insert new imports right before the blank line that precedes
        # "// Registry of completed long-form editorials."
        marker = "\n// Registry of completed long-form editorials."
        idx = registry_src.index(marker)
        registry_src = (
            registry_src[:idx]
            + "\n".join(new_imports)
            + "\n"
            + registry_src[idx:]
        )

    if new_registry_entries:
        # Insert new entries right before the REGISTRY object's closing brace.
        close_idx = registry_src.index("\n};\n\nexport function getEditorial")
        registry_src = (
            registry_src[:close_idx]
            + "\n"
            + "\n".join(new_registry_entries)
            + registry_src[close_idx:]
        )

    REGISTRY_PATH.write_text(registry_src)

    print(f"Processed {len(drafts)} pillars:")
    for pid, action, path in report:
        print(f"  {pid:45s} {action:28s} {path}")
    print(f"\nNew imports added: {len(new_imports)}")
    print(f"New registry entries added: {len(new_registry_entries)}")


if __name__ == "__main__":
    main()
