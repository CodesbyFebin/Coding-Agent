const fs = require('fs');
const path = require('path');

const registryPath = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/registry.ts';
const editorialDir = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials';

const registryContent = fs.readFileSync(registryPath, 'utf8');

// Extract import lines
const importLines = registryContent.split('\n').filter(l => l.startsWith('import') && l.includes('./editorials'));

// Build: import varName -> file path -> pillarId
const registryEntries = new Set();

importLines.forEach(line => {
  const importMatch = line.match(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/);
  if (importMatch) {
    const varName = importMatch[1].trim();
    const filePath = importMatch[2];
    const fileName = filePath.split('/').pop();
    
    const editorialPath = path.join(editorialDir, fileName);
    if (fs.existsSync(editorialPath)) {
      const editorialContent = fs.readFileSync(editorialPath, 'utf8');
      const pillarMatch = editorialContent.match(/"pillarId"\s*:\s*"([^"]+)"/);
      if (pillarMatch) {
        const pillarId = pillarMatch[1];
        registryEntries.add(pillarId);
        console.log('REGISTRY HAS: ' + pillarId + ' (from ' + varName + ' -> ' + fileName + ')');
      }
    }
  }
});

// Now list ALL editorial pillarIds and check which are missing from registry
console.log('\n--- ALL Editorial pillarIds and registry status ---');
const editorialFiles = fs.readdirSync(editorialDir).filter(f => f.endsWith('.ts') && !f.startsWith('types'));

const allPillarIds = new Map();

for (const file of editorialFiles) {
  const content = fs.readFileSync(path.join(editorialDir, file), 'utf8');
  const pillarMatch = content.match(/"pillarId"\s*:\s*"([^"]+)"/);
  if (pillarMatch) {
    const pillarId = pillarMatch[1];
    allPillarIds.set(file, pillarId);
    const inRegistry = registryEntries.has(pillarId);
    console.log((inRegistry ? '●' : '○') + ' ' + file + ' -> ' + pillarId + ' ' + (inRegistry ? 'IN REGISTRY' : 'MISSING'));
  }
}

console.log('\n--- Summary ---');
console.log('Total editorial files with pillarId:', allPillarIds.size);
console.log('Total unique registry pillarId entries:', registryEntries.size);
console.log('Missing from registry:', allPillarIds.size - registryEntries.size);

const missing = [];
allPillarIds.forEach((pid, file) => {
  if (!registryEntries.has(pid)) {
    missing.push(file);
  }
});
console.log('\nFiles missing from registry:');
missing.forEach(f => console.log('  ' + f));