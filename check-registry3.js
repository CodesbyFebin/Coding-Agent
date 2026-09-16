const fs = require('fs');

const registryPath = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/registry.ts';
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Just print the first 20 lines to see the format
const lines = registryContent.split('\n');
console.log('First 20 lines of registry.ts:');
for (let i = 0; i < 20; i++) {
  console.log((i+1) + ': ' + lines[i]);
}

// Check import lines
console.log('\n\\nAll import lines:');
const importLines = lines.filter(l => l.startsWith('import') && l.includes('./editorials'));
importLines.forEach((line, i) => {
  console.log((i+1) + ': ' + line);
  // Try to extract var name
  const match = line.match(/import\s*\{\s*(\w+)\s*\}/);
  if (match) {
    console.log('  Matched var: ' + match[1]);
  }
});