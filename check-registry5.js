const fs = require('fs');
const path = require('path');

const editorialDir = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials';
const registryPath = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/registry.ts';
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Get all import variable names and their corresponding file names
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

// Now determine which editorial files are registered
// A file is "registered" if its imported variable name appears in the REGISTRY REGISTRY keys
console.log('Imported vars count:', varToFile.size);

console.log('\n--- Which editorial files are registered? ---');
const editorialFiles = fs.readdirSync(editorialDir).filter(f => f.endsWith('.ts') && !f.startsWith('types'));

let registeredCount = 0;
let unregisteredFiles = [];

for (const file of editorialFiles) {
  // Find which import variable corresponds to this file
  const matchingVars = [...varToFile.keys()].filter(v => varToFile.get(v) === file);
  
  // Check if any of these vars are in the REGISTRY
  let isRegistered = false;
  matchingVars.forEach(varName => {
    // In the REGISTRY, the key is [varName.pillarId]
    // Look for pattern: [varName.pillarId]
    if (registryContent.includes('[' + varName + '.pillarId]')) {
      isRegistered = true;
    }
  });
  
  if (isRegistered) {
    registeredCount++;
    console.log('● ' + file + ' - REGISTERED');
  } else {
    unregisteredFiles.push(file);
    console.log('○ ' + file + ' - NOT REGISTERED');
  }
}

console.log('\n--- Summary ---');
console.log('Registered editorial files:', registeredCount);
console.log('Unregistered editorial files:', unregisteredFiles.length);
console.log('Total editorial files:', editorialFiles.length);