import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Session A converter: ingests the reviewed pillar-database source (pasted
// reference HTML containing a complete PILLARS content array) and emits one
// PillarEditorial TS file per entry into src/content/editorials/, then
// registers them. The 2000-word publish bar decides published vs draft —
// this script only converts; it never changes the policy.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = '/Users/cyberteck/.zcode/tmp/paste-attachments/2026-09-06/pasted-text-20260906-062715-378b302a.txt';

const src = readFileSync(SRC, 'utf8');
const start = src.indexOf('const PILLARS = [');
const end = src.indexOf('\n];', start);
if (start < 0 || end < 0) {throw new Error('PILLARS array bounds not found');}
const arrText0 = src.slice(start + 'const PILLARS ='.length, end + 2);
// The reference source contains a few malformed string literals (dropped
// closing quotes). Repair the known instances before evaluation.
const repairs = [
  ["routinely-approved actions.}]", "routinely-approved actions.'}]"],
  ["routinely-approved actions.}],", "routinely-approved actions.'}],"],
];
let arrText = arrText0;
for (const [bad, good] of repairs) {arrText = arrText.split(bad).join(good);}

let pillars;
try {
  pillars = Function('return (' + arrText + ')')();
} catch (e) {
  const m = /\(anonymous_script\):(\d+)/.exec(String(e));
  console.error('syntax error at source line offset', m && m[1]);
  const lines = arrText.split('\n');
  if (m) {console.error('near:', (lines[m[1] - 1] || '').slice(0, 300));}
  throw e;
}
console.log('parsed pillars:', pillars.length);

const camel = (s) => s.split('-').map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w)).join('');
let imports = '';
let entries = '';
let ok = 0;
const drafts = [];

for (const p of pillars) {
  const name = camel(p.s);
  const body = {
    pillarId: p.s,
    updated: '2026-09-06',
    definition: p.def,
    sections: (p.sections || []).map((x) => ({ heading: x.h, paragraphs: x.p })),
    faq: (p.faq || []).map((x) => ({ question: x.q, answer: x.a })),
    sources: [
      { label: 'CodingAgent source repository', href: 'https://github.com/CodesbyFebin/Coding-Agent' },
    ],
  };
  const wc = [
    body.definition,
    ...body.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])]),
    ...body.faq.flatMap((f) => [f.question, f.answer]),
  ].join(' ').split(/\s+/).filter(Boolean).length;

  const ts =
    "import type { PillarEditorial } from '../types';\n\n" +
    '// Editorial converted from the reviewed pillar-database source. Claim-audited.\n' +
    'export const ' + name + ': PillarEditorial = ' + JSON.stringify(body, null, 2) + ';\n';
  writeFileSync(join(ROOT, 'src/content/editorials', p.s + '.ts'), ts);

  imports += "import { " + name + " } from './editorials/" + p.s + "';\n";
  entries += '  [' + name + '.pillarId]: ' + name + ',\n';
  if (wc >= 2000) {ok++;} else {drafts.push(p.s + ':' + wc);}
}

const regPath = join(ROOT, 'src/content/registry.ts');
let reg = readFileSync(regPath, 'utf8');
reg = reg.replace(
  "import { aiCodingAgents } from './editorials/ai-coding-agents';",
  imports + "import { aiCodingAgents } from './editorials/ai-coding-agents';"
);
reg = reg.replace(
  '  [aiCodingAgents.pillarId]: aiCodingAgents,',
  entries + '  [aiCodingAgents.pillarId]: aiCodingAgents,'
);
writeFileSync(regPath, reg);

console.log('published (>=2000w):', ok);
console.log('drafts:', drafts.join(', ') || 'none');
