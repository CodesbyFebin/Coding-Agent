(async () => {
  const registryModule = await import('./frontend/src/content/registry.ts');
  const typesModule = await import('./frontend/src/content/types.ts');
  const REGISTRY = registryModule.REGISTRY;
  const wordCount = typesModule.wordCount;

  console.log('Completed editorial count:', Object.values(REGISTRY).filter(e => wordCount(e) >= 2000).length);
  const below: { id: string; wc: number; editorial: any }[] = [];
  for (const [id, editorial] of Object.entries(REGISTRY)) {
    const wc = wordCount(editorial);
    if (wc < 2000) {
      below.push({ id, wc, editorial });
    }
  }
  console.log('Below 2000 words:', below.length);
  below.sort((a, b) => a.wc - b.wc).forEach(({id, wc}) => {
    console.log(`${id}: ${wc}`);
  });
  // Output the bottom 30 that need to be increased
  console.log('\nBottom 30 to increase:');
  below.slice(0, 30).forEach(({id, wc}) => {
    console.log(`${id}: ${wc} (need ${2000 - wc} more words)`);
  });
})();