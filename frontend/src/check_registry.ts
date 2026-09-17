import { REGISTRY } from './content/registry';
import { wordCount } from './content/types';

console.log('Number of entries in registry:', Object.keys(REGISTRY).length);
let problematic = [];
for (const [id, editorial] of Object.entries(REGISTRY)) {
  if (!editorial) {
    console.error(`Editorial for ${id} is undefined or null`);
    problematic.push(id);
    continue;
  }
  try {
    const wc = wordCount(editorial);
    if (isNaN(wc)) {
      console.error(`Word count for ${id} is NaN`);
      problematic.push(id);
    }
  } catch (e) {
    console.error(`Error computing word count for ${id}:`, e);
    problematic.push(id);
  }
}
if (problematic.length === 0) {
  console.log('All editorials are valid.');
}
// Also check for duplicate pillarIds in the registry values (should not happen)
const pillarIds = Object.keys(REGISTRY);
const duplicates = pillarIds.filter((id, index) => pillarIds.indexOf(id) !== index);
if (duplicates.length > 0) {
  console.error('Duplicate pillarIds in registry:', duplicates);
} else {
  console.log('No duplicate pillarIds in registry.');
}