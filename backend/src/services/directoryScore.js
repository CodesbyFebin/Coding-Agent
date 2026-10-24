'use strict';
const DIMENSIONS = Object.freeze(['sandbox','audit','approvals','secrets','identity','privacy']);
function governanceSummary(evidence) {
  const dimensions = Object.fromEntries(DIMENSIONS.map(d => [d, 'unassessed']));
  for (const row of evidence) {
    if (!Object.hasOwn(dimensions, row.dimension)) continue;
    if (row.status === 'contradicted') dimensions[row.dimension] = 'contradicted';
    else if (row.status === 'supported' && dimensions[row.dimension] !== 'contradicted') dimensions[row.dimension] = 'supported';
  }
  const supported = Object.values(dimensions).filter(x => x === 'supported').length;
  const assessed = Object.values(dimensions).filter(x => x !== 'unassessed').length;
  return { dimensions, supported, assessed, total: DIMENSIONS.length, coveragePercent: Math.round(100 * assessed / DIMENSIONS.length), label: 'Evidence coverage — not a security certification' };
}
module.exports = { DIMENSIONS, governanceSummary };
