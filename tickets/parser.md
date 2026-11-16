## Problem

The shared parser reads dates month first for tenants whose locale uses day first.
People receive calendar invites for a different month/day. This is the larger cause
inside the desk's merged incident #4471, and needs its own engineering fix.

## Report coverage

**379 unique reports**, across **11 tenants**, received **2026-04-01 through 2026-10-04**.
This is the `parser` group from the exported executable classifier, using tenant locale,
form version and report channel. It is not a count of intake tags or export rows.

The whole export has 427 rows but only 412 unique report IDs. Count overlapping rows
once with `uniqueById`, filter `mergedInto === 4471`, resolve the tenant directory,
then call `groupByCause`. The companion hint issue covers the other 33 reports.
The disjoint ID lists and counts are in `analysis/report-groups.json`.

Of this group, intake tagged 356 as `parser` and 23 as `hint`.
R-41205 is an example of an incorrect `hint` tag: Morrow Tax uses fr-FR and booking-v2,
and the report arrived through the app.

## Evidence and reproduction

- R-41200: Harbour Dental, en-GB, booking-v2, app. Intended 7 April; reminder went out on 4 July.
- R-41203: Lantern Row, cs-CZ, booking-v2, app. Intended 2 December; invite said 12 February.
- Configure a day-first tenant. Enter an ambiguous date such as 07/04/2026 through
  the shared-parser path. Confirm the saved date and generated invite preserve 7 April.

Expected: parse using the documented tenant date convention, or an unambiguous input contract.
Observed: the shared parser reads the month first, swapping valid day/month values.

## Acceptance criteria

- Ambiguous dates through app and email paths preserve the tenant's intended date.
- Test day-first and month-first tenant conventions, and browsers with a different locale.
- Reject invalid dates instead of silently changing them; verify both saved data and final invite.
- Keep the booking-v3 hint issue separate: fixing this parser does not correct its UI hint.

## Uncertainty and follow-up

The supplied classifier includes five reports the desk read as a one-day move:
R-41202, R-41209, R-41236, R-41344 and R-41620. Keep them in this count under the
export's classification, but investigate the original input, saved timestamp, timezone,
and invite before attributing each symptom to this parser. These bodies do not prove a
third root cause or a timezone fix.

The large July merge batch is processing history, not the incident's start. Reports began
in April and continued into October. “Known” and “queued” are not proof of a shipped fix.
Check the live desk before closing this issue.

Sources: `support-kb/src/lib/kb/causes.ts`, `locales.ts`, the tenant JSON directory,
`reports-4471.json`, `desk-notes.json`, and the signed review at
`support-kb/src/routes/kb/incidents/4471-review/+page.svx`.
