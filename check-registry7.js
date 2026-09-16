const fs = require('fs');
const path = require('path');

const editorialDir = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials';
const registryPath = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/registry.ts';
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Get ALL editorial files with their pillarIds
const editorialFiles = fs.readdirSync(editorialDir).filter(f => f.endsWith('.ts') && !f.startsWith('types'));

// Build: fileName -> pillarId
const fileToPillarId = new Map();
const fileToContent = new Map();

for (const file of editorialFiles) {
  const content = fs.readFileSync(path.join(editorialDir, file), 'utf8');
  fileToContent.set(file, content);
  const pillarMatch = content.match(/"pillarId"\s*:\s*"([^"]+)"/);
  if (pillarMatch) {
    fileToPillarId.set(file, pillarMatch[1]);
  } else {
    fileToPillarId.set(file, 'NO_PILLAR_ID');
  }
}

// Get import variable names from registry and map to file names
const importLines = registryContent.split('\n').filter(l => l.startsWith('import') && l.includes('./editorials'));
const importVarToFile = new Map();
importLines.forEach(line => {
  const match = line.match(/import\s*\{\s*(\w+)\s*\}\s*from\s*['"]([^'"]+)['"]/);
  if (match) {
    const varName = match[1];
    const filePath = match[2];
    const fileName = filePath.split('/').pop();
    importVarToFile.set(varName, fileName);
  }
}

// Now check which registry entries exist and their word counts
console.log('--- Checking registry entries against editorial files ---');
console.log('Total editorial files:', editorialFiles.length);
console.log('');

// Find all registry key variable names
const registeredVars = new Set();
let keyMatch;
const keyRegex = /\[(\w+)\.pillarId\]/g;
while ((keyMatch = keyRegex.exec(registryContent)) !== null) {
  registeredVars.add(keyMatch[1]);
}
console.log('Registered variable names in REGISTRY:', registeredVars.size);

// For each registered variable, find the corresponding file and check word count
let indexableCount = 0;
let below2000Count = 0;
let unregisteredCount = 0;
let noFileCount = 0;

const sortedVars = [...registeredVars].sort();
for (const varName of sortedVars) {
  const fileName = importVarToFile.get(varName);
  if (!fileName) {
    console.log('NO IMPORT MAP for var:', varName);
    noFileCount++;
    continue;
  }
  
  // Find the actual file - it might be fileName + '.ts'
  const actualFile = fileName.endsWith('.ts') ? fileName : fileName + '.ts';
  if (!fs.existsSync(path.join(editorialDir, actualFile))) {
    console.log('FILE NOT FOUND: ' + actualFile + ' for var:', varName);
    noFileCount++;
    continue;
  }
  
  const content = fileToContent.get(actualFile);
  if (!content) {
    console.log('NO CONTENT for:', actualFile);
    noFileCount++;
    continue;
  }
  
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const pillarId = fileToPillarId.get(actualFile);
  
  const isIndexable = wordCount >= 2000;
  if (isIndexable) {
    indexableCount++;
    console.log('✅ ' + varName + ' -> ' + actualFile + ': ' + wordCount + ' words, pillarId: ' + pillarId);
  } else {
    below2000Count++;
    console.log('❌ ' + varName + ' -> ' + actualFile + ': ' + wordCount + ' words, pillarId: ' + pillarId + ' - BELOW 2000');
  }
}

console.log('\n--- Summary ---');
console.log('Total registry entries:', registeredVars.size);
console.log('Indexable (2000+ words):', indexableCount);
console.log('Below 2000 words:', below2000Count);
console.log('No file found:', noFileCount);
console.log('Current indexable pages:', indexableCount);