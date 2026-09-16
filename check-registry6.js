const fs = require('fs');
const path = require('path');

const editorialDir = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials';
const registryPath = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/registry.ts';
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Get all import variable names
const importLines = registryContent.split('\n').filter(l => l.startsWith('import') && l.includes('./editorials'));
const varToFile = new Map();
importLines.forEach(line => {
  const match = line.match(/import\s*\{\s*(\w+)\s*\}\s*from\s*['"]([^'"]+)['"]/);
  if (match) {
    const varName = match[1];
    const filePath = match[2];
    const fileName = filePath.split('/').pop();
    varToFile.set(varName, fileName);
  }
});

// The registry has [varName.pillarId] as keys
// Let me check which varNames have their pillarId in the registry keys
const registryKeys = [];
const keyMatches = registryContent.match(/\[(\w+)\.pillarId\]/g);
if (keyMatches) {
  keyMatches.forEach(m => {
    const varName = m.match(/\[(\w+)\.pillarId\]/)[1];
    registryKeys.push(varName);
  });
}

console.log('Registry key variable names:', registryKeys.length);

// For each registry key, check if the corresponding editorial file has 2000+ words
console.log('\n--- Registry entries and word counts ---');
const MIN_WORDS = 2000;

let indexableCount = 0;
let below2000Count = 0;
let missingFileCount = 0;

for (const varName of registryKeys) {
  const fileName = varToFile.get(varName);
  if (!fileName) {
    console.log('NO FILE for var:', varName);
    missingFileCount++;
    continue;
  }
  
  const editorialPath = path.join(editorialDir, fileName);
  if (!fs.existsSync(editorialPath)) {
    console.log('FILE NOT FOUND: ' + fileName + ' for var:', varName);
    missingFileCount++;
    continue;
  }
  
  const content = fs.readFileSync(editorialPath, 'utf8');
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const hasPillarId = content.match(/"pillarId"\s*:\s*"([^"]+)"/);
  const pillarId = hasPillarId ? hasPillarId[1] : 'unknown';
  
  const isIndexable = wordCount >= MIN_WORDS;
  if (isIndexable) {
    indexableCount++;
    console.log('✅ ' + varName + ' (' + fileName + '): ' + wordCount + ' words, pillarId: ' + pillarId);
  } else {
    below2000Count++;
    console.log('❌ ' + varName + ' (' + fileName + '): ' + wordCount + ' words, pillarId: ' + pillarId + ' - BELOW 2000');
  }
}

console.log('\n--- Summary ---');
console.log('Total registry entries:', registryKeys.length);
console.log('Indexable (2000+ words):', indexableCount);
console.log('Below 2000 words:', below2000Count);
console.log('Missing files:', missingFileCount);
console.log('Current indexable pages:', indexableCount);