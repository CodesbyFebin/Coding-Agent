import { createServer } from 'vite';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Post-build script. Prerenders every public knowledge route into
// dist/<path>/index.html (full content in the initial HTML), writes a real
// dist/404.html, and generates the machine-readable public surfaces
// (sitemap.xml, llms.txt, llms-full.txt) from the single TS route
// inventory. Non-indexable pillar pages (pending editorial completion) are
// still rendered but ship a robots noindex directive.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function buildPage(route, body, template, base, noindex) {
  const canonical = `${base}${route.path}`;
  let out = template;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`);
  out = out.replace(
    /<meta\s+name="description"[^>]*\/>/,
    `<meta name="description" content="${esc(route.description)}" />`
  );
  const head = noindex
    ? `<meta name="robots" content="noindex, follow" /><link rel="canonical" href="${canonical}" />`
    : `<link rel="canonical" href="${canonical}" />`;
  out = out.replace(/<link rel="canonical"[^>]*\/>/, head);
  out = out.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${esc(route.title)}" /><meta property="og:description" content="${esc(route.description)}" /><meta property="og:url" content="${canonical}" />`
  );
  out = out.replace(/<div id="root"><\/div>/, `<div id="root">${body}</div>`);
  return out;
}

function writePage(path, html) {
  const file = join(DIST, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

const vite = await createServer({
  root: ROOT,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const mod = await vite.ssrLoadModule('/src/prerender-entry.tsx');
  const { render, getPublicRoutes, getAllPillarRoutes, getBase, SITE_TITLE, SITE_DESCRIPTION } = mod;
  const base = getBase();

  const pristine = join(DIST, '.pristine-index.html');
  if (!existsSync(pristine)) {copyFileSync(join(DIST, 'index.html'), pristine);}
  const template = readFileSync(pristine, 'utf8');
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('dist/index.html has no empty root div — rerun vite build first.');
  }

  let indexed = 0;
  for (const route of getPublicRoutes()) {
    const html = buildPage(route, render(route.path), template, base, false);
    if (route.path === '/') {
      writeFileSync(join(DIST, 'index.html'), html);
    } else {
      writePage(route.path.replace(/^\//, ''), html);
    }
    indexed += 1;
  }

  // Non-indexable pillars: rendered, but carrying robots noindex until their
  // editorial is completed (single indexability policy).
  let noindexed = 0;
  for (const route of getAllPillarRoutes().filter((r) => !r.indexable)) {
    writePage(
      route.path.replace(/^\//, ''),
      buildPage(route, render(route.path), template, base, true)
    );
    noindexed += 1;
  }

  // Real 404 page (two-segment unknown path hits the NotFoundPage branch).
  writeFileSync(
    join(DIST, '404.html'),
    buildPage(
      { path: '/404.html', title: 'Page not found | CodingAgent.in', description: SITE_DESCRIPTION },
      render('/__not_found__/__page__'),
      template,
      base,
      true
    )
  );

  // Machine-readable surfaces from the same inventory.
  const today = new Date().toISOString().slice(0, 10);
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    getPublicRoutes()
      .map(
        (r) =>
          `  <url><loc>${base}${r.path}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${r.path === '/' ? '1.0' : '0.7'}</priority></url>`
      )
      .join('\n') +
    '\n</urlset>\n';
  writeFileSync(join(DIST, 'sitemap.xml'), xml);

  let llms = `# CodingAgent.in\n\n${SITE_DESCRIPTION}\n\nPublic knowledge surface (canonical URLs):\n`;
  for (const r of getPublicRoutes()) {llms += `- ${base}${r.path}\n`;}
  writeFileSync(join(DIST, 'llms.txt'), llms);

  let full = llms + '\n# Pillar editorials\n\n';
  for (const e of mod.getEditorialDetails()) {
    full += `## ${e.title} (${base}${e.path})\nUpdated: ${e.updated}\n${e.definition}\n\n`;
    for (const s of e.sections) {
      full += `### ${s.heading}\n${s.paragraphs.join('\n\n')}\n`;
      if (s.bullets) {full += s.bullets.map((b) => `- ${b}`).join('\n') + '\n';}
    }
    full += '\n';
  }
  writeFileSync(join(DIST, 'llms-full.txt'), full);

  console.log(
    `prerender: ${indexed} indexable + ${noindexed} noindex pages, 404.html, sitemap.xml (${indexed} URLs), llms surfaces`
  );
} finally {
  await vite.close();
}
