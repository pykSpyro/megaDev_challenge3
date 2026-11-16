import { build } from 'vite';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

await build();
const { renderPages } = await import(pathToFileURL(resolve('.build/render.mjs')));
const assets = await readdir('.build/assets');
const css = (await Promise.all(assets.filter(f => f.endsWith('.css')).map(f => readFile(join('.build/assets', f), 'utf8')))).join('\n');
if (!css) throw new Error('The rendered KB has no styles.');
for (const page of renderPages()) {
  const dir = join('rendered', page.route);
  await mkdir(dir, { recursive: true });
  const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${page.head}<style>${css}</style></head><body>${page.body}</body></html>\n`;
  await writeFile(join(dir, 'index.html'), html);
  console.log(`Rendered ${page.route}: ${page.title}`);
}
