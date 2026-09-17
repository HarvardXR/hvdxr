# HarvardXR

The harvardxr.com site, lifted out of Webflow so it can be hosted anywhere.

Captured 2026-08-18 from the live site (last published 2026-06-19): 232 pages, all
server-rendered HTML. No build step, no framework, no backend — jQuery plus Webflow's
runtime is the entire client side. Editing a page means editing its HTML.

## What Is in Git, and What Is Not

`site/` is the web root. 234 HTML files, two stylesheets, the JS, and the fonts. That is
what you edit.

Images and video are not in git — 1,083 files, about 650 MB. They live in Cloudflare R2.
`provenance/mirror-manifest.json` records all 1,134 captured assets with the URL each came
from, where it belongs under `site/`, and its sha256, so any file can be fetched again and
checked against what was originally served.

R2 bucket: not created yet — fill this in.

## Running It Locally

Every route is `<path>/index.html` and every asset reference is root-relative, so any
static server works, as long as you point it at `site/` and not at the repo root:

```bash
npx serve site
```

```bash
python -m http.server -d site 8123
```

Until the media is synced down, pages render with their layout, type and colour intact but
without images. To get them, sync the R2 bucket into `site/`; the manifest gives each
asset's path.

## Two Directories Worth Knowing

`site/_ext/` holds the mirrored third-party assets — Webflow's CDN, Vimeo, Google Fonts,
one CloudFront host — under a folder per origin host. Every reference in the HTML was
rewritten to point here, which is why the site never reaches the network.

`site/_local/` holds the few things that had to be rebuilt rather than copied. Both Vimeo
background videos are here as plain `<video>` elements instead of player iframes: Vimeo
only serves those over HLS/DASH, so the showcase video was remuxed to a local MP4. The
other one (on `/2023/about`) is dead upstream — it returns 404 on the live site too.

## Byte Fidelity

Files under `site/` are byte-for-byte what the server sent. `.gitattributes` turns off
line-ending conversion for that tree, because the default on Windows would silently
rewrite all 234 HTML files to CRLF and invalidate every sha256 in the manifest without
anything appearing to break.

If you change a file under `site/`, that is intended — you are editing the site now. The
manifest records the captured state, not a constraint on future edits.
