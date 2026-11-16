## Resolution: won't fix

The live course engineering update reports #4471 closed on 5 October 2026, with
`hint` marked WON'T FIX because the booking-v3 form was retired. Close this ticket as
not planned. The hint was not repaired; its affected form was retired.
Source: https://hq.mega.dev/challenges/what-it-shows#engineering-update.

## Problem

Booking-v3 displays `MM/DD/YYYY` to day-first tenants, but the form reads input using
the tenant's date order. People following the hint can create a booking for the wrong
date. This cause was merged into #4471 alongside the independent shared-parser defect.

## Report coverage

**33 unique reports**, across **3 tenants**, received **2026-04-17 through 2026-09-22**.
These are form-channel reports for day-first tenants using booking-v3:
Alder Physio (de-DE), Copper Studio (es-ES), and Pale Harbour (pt-PT).

Count report IDs once, filter `mergedInto === 4471`, join the tenant directory, then use
the exported `causeOf` / `groupByCause` logic. Do not classify by browser locale or intake tag.
Intake tagged 18 of these reports `hint` and incorrectly tagged 15 `parser`.
The full disjoint membership is in `analysis/report-groups.json`. The companion parser
issue covers 379 reports; together they cover all 412 unique reports in #4471.

## Evidence and reproduction

- R-41230: Copper Studio, es-ES, booking-v3, form. Client arrived on 1 June instead of 6 January;
  intake labelled it `parser`.
- R-41241: Alder Physio, de-DE, booking-v3, form, browser en-US. Clients arrived on
  8 June instead of 6 August. The browser's locale does not define this tenant's convention.
- Configure a day-first booking-v3 tenant. Observe the `MM/DD/YYYY` hint. Follow it
  for a date with different day/month values, then inspect the saved booking and invite.

Expected: displayed format and input parsing agree with the tenant's convention.
Observed: the displayed month-first hint conflicts with day-first interpretation.

## Acceptance criteria

- Derive booking-v3's date hint and parsing from the same tenant date convention.
- Test the three affected tenant locales and a browser locale that differs from each tenant.
- Following the hint preserves the intended date in saved data and the generated invite.
- Verify booking-v2 and non-form paths independently; keep the shared-parser issue separate.
- Check the live desk for new reports or deployed fixes before closing this issue.

Sources: `support-kb/src/lib/kb/causes.ts` (`DATE_HINT`, `causeOf`), `locales.ts`,
the tenant JSON directory, `reports-4471.json`, and the signed review at
`support-kb/src/routes/kb/incidents/4471-review/+page.svx`.
