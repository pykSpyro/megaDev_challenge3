# S01E03: what it shows

Review of the MEGA.dev support KB export and ticket #4471.

- Source review: `support-kb/src/routes/kb/incidents/4471-review/+page.svx`
- Rendered review: `rendered/kb/incidents/4471-review/index.html`
- Original export: `kb-export-267efc5e.zip`
- [Shared parser: 379 reports](https://github.com/pykSpyro/megaDev_challenge3/issues/1)
- [Booking-v3 hint: 33 reports](https://github.com/pykSpyro/megaDev_challenge3/issues/2)

The original exported pages, logic, and accepted decision remain intact. The new page
explains where their prose conflicts with the computed views, separates two causes,
and flags reports needing more evidence.

The course's later engineering update reports #4471 closed on 5 October: parser fixed;
hint won't fix because booking-v3 was retired. The two issues record those distinct
dispositions as completed and not planned, respectively.

## Build and inspect

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run analyze
npm run build
npm run preview
```

Open http://127.0.0.1:4173/kb/incidents/4471-review/ in a browser. The build compiles
the actual Svelte/MDsveX components and writes their server-rendered HTML with styles.
The files under `rendered/` are snapshots; rebuild after changing data or source.
The preview is for reading static pages; the exported interactive dedupe example is
not hydrated by this small snapshot build.

## Verification

Built all five KB routes and inspected the new review in a browser. The actual Svelte
components render 379 parser reports, 33 hint reports, and desk reference `DR-2HKX-E09X`.
The analysis writes the report IDs for each group to `analysis/report-groups.json`.

The dependency audit reports two low-severity development-dependency notices via
`deepmerge` and the Svelte Vite plugin, with no fix available in the installed dependency
chain at the time of the build. No moderate, high, or critical notices were reported.
