const fs = require('fs');

const registryPath = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/registry.ts';
const editorialDir = '/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials';

const registryContent = fs.readFileSync(registryPath, 'utf8');

// Find all import lines
const importLines = registryContent.split('\n').filter(l => l.startsWith('import') && l.includes('./editorials'));
console.log('Import lines from registry:');
importLines.forEach((line, i) => {
  console.log((i+1) + '. ' + line);
});

// Extract file paths and variable names
importLines.forEach((line, i) => {
  // Pattern: import { varName } from './editorials/xxx'
  const importMatch = line.match(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"]/);
  if (importMatch) {
    const varPart = importMatch[1];
    const filePath = importMatch[2];
    const vars = varPart.split(',').map(v => v.trim());
    const fileName = filePath.split('/').pop();
    console.log('\nLine ' + (i+1) + ':');
    console.log('  Variable(s): ' + vars.join(', '));
    console.log('  File: ' + fileName);
    
    // Now read the editorial file to get its pillarId
    const editorialPath = path.join(editorialDir, fileName);
    if (fs.existsSync(editorialPath)) {
      const editorialContent = fs.readFileSync(editorialPath, 'utf8');
      const pillarMatch = editorialContent.match(/["']pillarId["']\s*:\s*['"]([^'"]+)['"]/);
      if (pillarMatch) {
        console.log('  pillarId: ' + pillarMatch[1]);
      } else {
        console.log('  pillarId: NOT FOUND');
      }
    }
  }
});