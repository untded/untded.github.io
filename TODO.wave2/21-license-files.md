# 21 — LICENSE files: make the MIT claim legally real

Tenth pass (2026-09-07). All 20 tracks shipped. The one finding with
legal significance: **none of the three repos has a LICENSE file.** The
website README says "Site code MIT" and the dataset README says
"Code: MIT" — but without the file, the claim has no legal effect,
GitHub shows no license badge, and downstream reusers cannot rely on
it. The competitor added a license (674 lines) to their repo; our
repos claim one they don't carry.

Also verified-clean this pass: build time (25s incl. pagefind — fine),
og-tags on element pages (title/description/type/url/image all present),
robots.txt + sitemap, the 404 page's route suggestions, the tree page
(21KB, loads fine), and retired element pages (20.7KB, same anatomy as
active).

## Tasks

- [x] Website repo: add the MIT LICENSE file (copyright holder: the
      untded organization / project maintainers, year 2026). The
      README's existing "Site code MIT" line now points at a real file.
- [x] Dataset repo (untded-2005): same MIT LICENSE. The code is Ruby +
      build tooling; the DATA license is separate and already stated
      (content © UN/UNECE, attribution).
- [x] References repo: the mirror data is © UNECE / © ISO (attribution,
      redistribution for standards maintenance); the README itself is
      documentation. Add a README-level license note if no code exists
      to MIT-license, or a LICENSE for the repo's own files.
- [x] Verify GitHub shows the license badge on all three repos.

## Verification

License files present at repo roots; `gh api repos/.../license` returns
the SPDX ID for each; the READMEs' claims now reference real files.

## Beats

Their repo has a license; ours claimed one it didn't have. A registry
that says "open" but doesn't carry the legal instrument is making a
promise it hasn't signed.
