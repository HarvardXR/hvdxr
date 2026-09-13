# Content model

The site reads content directly from JSON. Developers can add or edit files in
this folder without a CMS.

## Paths

- `editions/<year>.json` — program, speaker, and organization IDs for one year.
- `people/<slug>.json` — canonical person profiles. Duplicate legacy slugs contain
  an `aliasOf` pointer to the canonical record.
- `events/<slug>.json` — session copy, time, edition years, and speaker IDs.
- `organizations/index.json` — sponsor and collaborator records by year.
- `pages/index.json` — source-page metadata retained for the migration audit.

## Media

Every `portraitAsset` and `logoAsset` points to the archived original under
`archive/original-media/`. The deployable hard-linked copy is available from
`public/media/archive/`; convert the archive prefix to `/media/archive/` when
rendering it, as demonstrated in `app/page.tsx`.

## Editing conventions

- IDs and filenames use lowercase kebab-case.
- Keep historical title and organization changes in a person's `profiles` array.
- Use IDs, not copied person or organization objects, when relating records.
- Do not add `#` or empty URLs for expired actions. Render them as disabled buttons.
- YouTube recordings are link-only records; video binaries are not required.
- Add new media to the manifest so its source and checksum remain traceable.
