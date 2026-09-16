const fs = require('fs');
const path = require('path');

const editorialDir = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials';
const registryPath = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/registry.ts';
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Get all import variable names from registry
const importLines = registryContent.split('\n').filter(l => l.startsWith('import') && l.includes('./editorials'));
const importedVars = new Set();
importLines.forEach(line => {
  const match = line.match(/import\s*\{\s*(\w+)\s*\}/);
  if (match) {
    importedVars.add(match[1]);
  }
});

console.log('Imported variable names count:', importedVars.size);
importedVars.forEach(v => console.log('  ' + v));

// Now read each editorial file and extract pillarId
console.log('\n--- Editorial files and their pillarIds ---');
const editorialFiles = fs.readdirSync(editorialDir).filter(f => f.endsWith('.ts') && !f.startsWith('types'));

for (const file of editorialFiles) {
  const content = fs.readFileSync(path.join(editorialDir, file), 'utf8');
  const pillarMatch = content.match(/"pillarId"\s*:\s*"([^"]+)"/);
  if (pillarMatch) {
    const pillarId = pillarMatch[1];
    // Check if any imported var matches this file
    const matchingVars = [...importedVars].filter(v => file.toLowerCase().includes(v.toLowerCase().replace('-', '').replace('_', '')));
    console.log(file + ' -> pillarId: ' + pillarId + ' matchingVars: ' + (matchingVars.length > 0 ? matchingVars.join(', ') : 'none'));
  } else {
    console.log(file + ' -> NO pillarId found');
  }
}