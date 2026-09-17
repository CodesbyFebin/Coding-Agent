import { REGISTRY } from './content/registry.ts';
import { wordCount } from './content/types.ts';

const below: { id: string; wc: number }[] = [];
for (const [id, editorial] of Object.entries(REGISTRY)) {
  const wc = wordCount(editorial);
  if (wc < 2000) {
    below.push({ id, wc });
  }
}
console.log(`Total editorials: ${Object.keys(REGISTRY).length}`);
console.log(`Indexable (>=2000 words): ${Object.keys(REGISTRY).length - below.length}`);
console.log(`Below 2000 words: ${below.length}`);
below.sort((a, b) => a.wc - b.wc).forEach(({id, wc}) => {
  console.log(`${id}: ${wc}`);
});