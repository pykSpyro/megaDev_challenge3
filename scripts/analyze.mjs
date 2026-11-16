import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { uniqueById, groupByCause } from '../support-kb/src/lib/kb/causes.ts';

const root = new URL('../support-kb/src/lib/data/', import.meta.url);
const readJson = async url => JSON.parse(await readFile(url, 'utf8'));
const raw = await readJson(new URL('reports-4471.json', root));
const tenants = new Map(await Promise.all((await readdir(new URL('tenants/', root))).map(async file => {
  const tenant = await readJson(new URL(`tenants/${file}`, root));
  return [tenant.handle, tenant];
})));
const merged = uniqueById(raw).filter(r => r.mergedInto === 4471);
const groups = groupByCause(merged, r => tenants.get(r.tenant));
if (groups.some(g => g.cause === 'unplaced')) throw new Error('Review unplaced reports before publishing.');
const result = {
  source: 'support-kb/src/lib/data/reports-4471.json',
  rawRows: raw.length,
  uniqueMergedReports: merged.length,
  groups: groups.map(({ reports, ...group }) => ({ ...group, count: reports.length, reportIds: reports.map(r => r.id) })),
};
await mkdir(new URL('../analysis/', import.meta.url), { recursive: true });
await writeFile(new URL('../analysis/report-groups.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(`${raw.length} rows; ${merged.length} unique reports; ${groups.map(g => `${g.cause}: ${g.reports.length}`).join('; ')}`);
