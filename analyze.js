const fs = require('fs');
const path = require('path');

const editorialDir = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials';
const registryPath = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/registry.ts';
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Get ALL editorial files with pillarId and word count
const editorialFiles = fs.readdirSync(editorialDir).filter(f => f.endsWith('.ts') && !f.startsWith('types'));

const fileData = new Map();
for (const file of editorialFiles) {
  const content = fs.readFileSync(path.join(editorialDir, file), 'utf8');
  const pillarMatch = content.match(/"pillarId"\s*:\s*"([^"]+)"/);
  const pillarId = pillarMatch ? pillarMatch[1] : file.replace('.ts', '');
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  fileData.set(file, {pillarId, wordCount});
}

// Get import var to file mapping
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
});

// Get registered vars
const registeredVars = new Set();
let m;
const keyRegex = /\[(\w+)\\.pillarId\]/g;
while ((m = keyRegex.exec(registryContent)) !== null) {
  registeredVars.add(m[1]);
}

// Find editorial files NOT in registry
console.log('Editorial files NOT in registry:');
for (const file of editorialFiles) {
  const matchingVar = [...importVarToFile.keys()].find(v => importVarToFile.get(v) === file.replace('.ts', ''));
  const inRegistry = registeredVars.has(matchingVar || '');
  if (!inRegistry) {
    const pillarId = fileData.get(file).pillarId;
    console.log('  ' + file + ' -> pillarId: ' + pillarId + ' (NOT in registry)');
  }
}

// Find registry vars without matching files
console.log('\nRegistry vars without matching editorial files:');
for (const varName of registeredVars) {
  const kebabName = varName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const fileName = kebabName + '.ts';
  const filePath = path.join(editorialDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.log('  ' + varName + ': expected file ' + fileName + ' NOT FOUND');
  }
}