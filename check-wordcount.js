// Create a temporary types file with proper exports
const fs = require('fs');
const path = require('path');

// Read the original types file
let typesContent = fs.readFileSync('./frontend/src/content/types.ts', 'utf8');
// We want to keep the header (comments and blank line) until the first interface,
// then take from the constant and function, removing the export keyword.
const headerEndIndex = typesContent.indexOf('export interface EditorialSection');
const header = typesContent.slice(0, headerEndIndex);
const body = typesContent.substring(typesContent.indexOf('export const MIN_EDITORIAL_WORDS'));
const modifiedBody = body.replace(/^export /gm, '');
typesContent = header + modifiedBody + '\nmodule.exports = { wordCount, MIN_EDITORIAL_WORDS };';

// Write temporary file
fs.writeFileSync('./frontend/src/content/types.temp.js', typesContent);

// Now load it
const types = require('./frontend/src/content/types.temp.js');
const registry = require('./frontend/src/content/registry.js');

let indexable = 0;
let drafts = [];

for (const [pillarId, editorial] of Object.entries(registry.REGISTRY)) {
  const wc = types.wordCount(editorial);
  if (wc >= types.MIN_EDITORIAL_WORDS) {
    indexable++;
  } else {
    drafts.push({id: pillarId, words: wc, needs: types.MIN_EDITORIAL_WORDS - wc});
  }
}

console.log('Total:', Object.keys(registry.REGISTRY).length);
console.log('Indexable (>=2000):', indexable);
console.log('Drafts:', drafts.length);
console.log('');

drafts.sort((a, b) => a.words - b.words);
console.log('Lowest word count drafts:');
for (let i = 0; i < Math.min(20, drafts.length); i++) {
  const d = drafts[i];
  console.log(`  ${d.id.padEnd(40)} ${d.words} words (needs ${d.needs} more)`);
}

console.log('');

console.log('To reach 62 indexable, need to upgrade:', 62 - indexable, 'more pillars');

// Cleanup
fs.unlinkSync('./frontend/src/content/types.temp.js');