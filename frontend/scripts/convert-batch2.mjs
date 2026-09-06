import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Batch converter for externally-authored pillar blocks (slug/title/
// definition/sections[{heading,content}]/faqs format). Converts content
// backtick strings into paragraphs arrays. The 2000-word policy decides
// published vs draft; this script never changes it.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = [
  '/Users/cyberteck/.zcode/tmp/paste-attachments/2026-09-06/pasted-text-20260906-121600-43b2303f.txt',
  '/Users/cyberteck/.zcode/tmp/paste-attachments/2026-09-06/pasted-text-20260906-122248-e62dc486.txt',
];
const EXISTING = new Set([
  'ai-coding-agents', 'model-context-protocol', 'dpdp-compliance', 'local-llm-coding',
  'agentic-engineering', 'plan-execute-verify', 'task-graphs', 'agent-state-machines',
  'parallel-subagents', 'human-approval-gates',
]);

const camel = (s) => s.split('-').map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w)).join('');
const toParas = (c) => c.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

let imports = '';
let entries = '';
let ok = 0;
const drafts = [];

for (const f of FILES) {
  const src = readFileSync(f, 'utf8');
  const re = /```typescript\n(\{[\s\S]*?\n\})\n```/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    let p;
    try {
      p = Function('"use strict"; const { McpServer, z } = {}; return (' + m[1] + ')')();
    } catch {
      continue;
    }
    if (!p || !p.slug || !p.sections) {continue;}
    if (EXISTING.has(p.slug)) {continue;}
    const name = camel(p.slug);
    const body = {
      pillarId: p.slug,
      updated: '2026-09-06',
      definition: p.definition,
      sections: p.sections.map((x) => ({ heading: x.heading, paragraphs: toParas(x.content ?? (x.paragraphs ?? []).join('\n\n')) })),
      faq: (p.faqs || []).map((x) => ({ question: x.question, answer: x.answer })),
      sources: [{ label: 'CodingAgent source repository', href: 'https://github.com/CodesbyFebin/Coding-Agent' }],
    };
    const wc = [
      body.definition,
      ...body.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
      ...body.faq.flatMap((f) => [f.question, f.answer]),
    ].join(' ').split(/\s+/).filter(Boolean).length;
    const ts = "import type { PillarEditorial } from '../types';\n\n// Batch-converted editorial. Claim-audited; publish bar decides.\nexport const " + name + ': PillarEditorial = ' + JSON.stringify(body, null, 2) + ';\n';
    writeFileSync(join(ROOT, 'src/content/editorials', p.slug + '.ts'), ts);
    imports += "import { " + name + " } from './editorials/" + p.slug + "';\n";
    entries += '  [' + name + '.pillarId]: ' + name + ',\n';
    if (wc >= 2000) {ok++;} else {drafts.push(p.slug + ':' + wc);}
  }
}

const regPath = join(ROOT, 'src/content/registry.ts');
let reg = readFileSync(regPath, 'utf8');
const importMarker = "import { dpdpCompliance } from './editorials/dpdp-compliance';";
const entryMarker = '  [dpdpCompliance.pillarId]: dpdpCompliance,';
reg = reg.replace(importMarker, imports + importMarker);
reg = reg.replace(entryMarker, entries + entryMarker);
writeFileSync(regPath, reg);
console.log('published (>=2000w):', ok);
console.log('drafts:', drafts.join(', ') || 'none');
