const fs = require('fs');
const path = require('path');

const registryPath = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/registry.ts';
const editorialDir = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials';
const registryContent = fs.readFileSync(registryPath, 'utf8');
const editorialFiles = fs.readdirSync(editorialDir).filter(f => f.endsWith('.ts') && !f.startsWith('types'));

// Get all import var names
const importMatches = registryContent.match(/import\s*\{([^}]+)\}\s*from/g);
const importVars = new Set();
if (importMatches) {
  importMatches.forEach(m => {
    const vars = m.match(/import\s*\{([^}]+)\}/[1].split(',').map(v => v.trim()));
    vars.forEach(v => importVars.add(v.trim()));
  });
}

// Get all REGISTRY key var names
const registryKeys = new Set();
const keyMatches = registryContent.match(/\[(\w+)\.pillarId\]/g);
if (keyMatches) {
  keyMatches.forEach(m => registryKeys.add(m.match(/\[(\w+)\.pillarId\]/)[1]));
}

// Find import vars NOT in registry
console.log('Import vars not in REGISTRY:');
importVars.forEach(v => {
  if (!registryKeys.has(v)) {
    console.log('  Missing: ' + v);
  }
});
console.log('\nTotal import vars:', importVars.size);
console.log('Total registry keys:', registryKeys.size);
console.log('Missing count:', importVars.size - registryKeys.size);

// Now find which editorial files exist but don't have a registry entry
console.log('\nEditorial files and their registry status:');
for (const file of editorialFiles) {
  const content = fs.readFileSync(path.join(editorialDir, file), 'utf8');
  const pillarMatch = content.match(/"pillarId"\s*:\s*"([^"]+)"/);
  const pillarId = pillarMatch ? pillarMatch[1] : file.replace('.ts', '');
  
  // Find the import var for this file
  const matchingImportVar = [...importVars].find(v => {
    const filePathMatch = registryContent.match(/import\s*\{[^}]+\}\s*from\s*['"]([^'"]+)['"]/);
    if (filePathMatch) {
      const filePath = filePathMatch[1];
      const fileName = filePath.split('/').pop();
      return fileName === file.replace('.ts', '');
    }
    return false;
  });
  
  const inRegistry = registryKeys.has(matchingImportVar || '');
  console.log('  ' + file + ': pillarId=' + pillarId + ' importVar=' + (matchingImportVar || 'none') + ' inRegistry=' + inRegistry);
}