# V6 · complete English edition

The requested delivery is full Spanish/English content and functional parity. Translation only: retain Spanish names, stable IDs, source URLs, chronology, relationships, evidence states, geometry and existing Spanish routes. New imagery or historical additions are outside this delivery.

Baseline: `935693e73e9734453a6c4ca31dfb90a83b14a32f` (PR #118 remains unmerged when this programme starts). Shared branch: `codex/v6-english-completion`. Do not merge #118 or mark V6 released before acceptance.

## Seven sessions

| Session | People | Houses | Territories | Complete stories | Planned story cards |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 350 | 83 | 174 | 3 | 2 |
| 2 | 350 | 82 | 174 | 3 | 2 |
| 3 | 350 | 82 | 173 | 3 | 2 |
| 4 | 350 | 82 | 173 | 3 | 1 |
| 5 | 350 | 82 | 173 | 3 | 1 |
| 6 | 346 | 82 | 173 | 3 | 1 |
| 7 | Integration, all shared interfaces, functional parity, route coverage and final checks | | | | |

`manifest.json` assigns every pending record once. House aliases are excluded from the count and must still resolve to their canonical English pages. Source snapshots for the content sessions are held in the coordinating workspace's `work/v6/sources/`; the canonical source remains the repository's data, content and generated metadata.

## Ownership and coordination

Sessions 1–6 write only `src/features/english/v6/batch-N/` (their own N) and may use their own external scratch directory. They must not change shared registries, generators, UI, Spanish content, routes, package version, other batches, Git state, branches, or generated public files. Session 7 owns shared implementation and integration. No session may commit, push, merge, reset, clean, switch branches, launch generators that rewrite shared outputs, or change another session's files. The coordinator publishes the final coherent changes. Preserve the pre-existing untracked `dist 2/` directory.

Read `DATA-CONTRACT.md`. A session is ready only when its exact manifest is fully translated and its local coverage check passes. Do not silently shrink a batch or leave longer biographies/notes for later. Return a precise missing-items report if external limitations interrupt progress. The V6 release gate requires all six content statuses ready and complete functional parity.

## V6 acceptance

- All 2,763 people, 519 canonical dynasties, 1,041 territories and 22 available stories (including every chapter, artwork caption and story context) have complete English counterparts. The nine planned stories retain the same availability and translated cards.
- Previously translated content remains complete. Complete catalogues, shared navigation, bibliography/methodology, privacy, licences, acknowledgements and all other Spanish public pages have English equivalents.
- Atlas, maps, genealogy, all filters, search, story reading and controls, challenge modes, tutorial, favourites, sharing and export work in both languages with the same state and data. Language switching keeps the current page/record and active state where applicable.
- No English navigation falls back to Spanish because a feature or record lacks an English edition. Proper names and original bibliographic titles may retain their original language.
- Spanish behaviour and published URLs are preserved. No changed dates, government intervals, parentage, evidence certainty or geography. All 601 annual maps and personal maps remain equivalent to baseline.
- Coverage tests, meaningful end-to-end checks in both languages, unit suite, full audits, production build, SSG and public/historical regression pass. Update `6.0.0` only once the complete delivery meets these conditions.
