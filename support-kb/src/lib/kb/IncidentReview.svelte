<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, readAs, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const unique = uniqueById(reports as Report[]);
  const merged = unique.filter(r => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const batch = merged.filter(r => r.mergedAt?.startsWith('2026-07-02'));
  const receivedBeforeBatch = merged.filter(r => r.receivedAt.slice(0, 10) < '2026-07-02');
  const later = merged.filter(r => r.receivedAt.slice(0, 10) > '2026-07-02');
</script>

<p>The export has <b>{reports.length}</b> rows, <b>{unique.length}</b> unique report IDs,
  and <b>{merged.length}</b> unique reports merged into #4471.
  The <b>{reports.length - unique.length}</b> repeated export rows are counted once.</p>

<table>
  <thead><tr><th>Cause</th><th>Reports</th><th>Tenants</th><th>Received</th><th>Intake tags</th><th>Desk readings</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr><td><code>{g.cause}</code></td><td>{g.reports.length}</td><td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{Object.entries(g.taggedAs).map(([tag, n]) => `${tag}: ${n}`).join(' · ')}</td>
        <td>{readAs(g, notes.oneDayMove)} read as a one-day move</td></tr>
    {/each}
  </tbody>
</table>

<p>The desk merged <b>{batch.length}</b> reports on 2 July.
  <b>{receivedBeforeBatch.length}</b> reports had already arrived before that day;
  <b>{later.length}</b> arrived after it. The receipt dates and merge dates show
  a backlog being processed, followed by continuing reports, rather than a new July incident.</p>

<p>Review these unusual reports separately: {notes.oneDayMove.join(', ')}.
  The supplied classifier assigns them to <code>parser</code> by tenant and channel.
  Their bodies alone do not establish a parser failure or a separate timezone bug.
  Ask for the original input, saved timestamp, timezone, and resulting invite before changing that assignment.</p>
