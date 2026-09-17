// Companion to generate_pillar_content.py: dumps the repo's own pillar data
// to JSON so the Python generator is grounded in real fields, not guesses.
import { ALL_PILLARS } from '../src/data/pillarsData.ts';
import { isContentIndexable } from '../src/content/registry.ts';
import fs from 'node:fs';

const mode = process.argv[3] || 'drafts';

let pillars = ALL_PILLARS.filter((p) => !p.external && p.href.startsWith('/'));
if (mode === 'drafts') {
  pillars = pillars.filter((p) => !isContentIndexable(p.id));
}

const out = pillars.map((p) => ({
  id: p.id,
  label: p.label,
  href: p.href,
  category: p.category,
  description: p.description,
  rationale: p.rationale ?? null,
  verificationAspect: p.verificationAspect ?? null,
  tags: p.tags ?? [],
  relatedPillarIds: p.relatedPillarIds ?? [],
}));

fs.writeFileSync(process.argv[2] || 'drafts.json', JSON.stringify(out, null, 2));
console.log(`wrote ${out.length} ${mode} pillar records`);
