# Regular Shorts

A tiny Firefox extension that redirects YouTube Shorts links to the standard
YouTube player.

```
https://www.youtube.com/shorts/itNOqbmqHDI
  →  https://www.youtube.com/watch?v=itNOqbmqHDI
```

It works whether you click a Shorts link *on* youtube.com (YouTube is a
single-page app, so those clicks normally don't trigger a page load) or follow
a Shorts link from elsewhere.

---

## Installation

Firefox requires extensions to be signed by Mozilla before they can be
installed permanently in the standard release or beta builds. Pick one of the
options below.

### Option A — Install from addons.mozilla.org (easiest for most users)

Once the extension is published, install it directly from its listing on
[addons.mozilla.org](https://addons.mozilla.org/). Updates are handled
automatically by Firefox.

> This requires submitting the extension through the AMO Developer Hub and
> passing review. See [Publishing](#publishing) below.

### Option B — Self-distributed signed build (recommended right now)

This installs permanently in normal Firefox without a public listing, using
AMO's "unlisted" (self-distribution) signing. Automated validation is fast, so
this is the quickest way to get a permanently-installable build today.

1. **Build the package**

   ```bash
   ./build.sh
   ```

   This produces `dist/regular-shorts.xpi`.

2. **Get it signed by Mozilla**

   *Via the website:*

   - Go to <https://addons.mozilla.org/developers/> and sign in.
   - Click **Submit a New Add-on**.
   - Choose **"On your own"** (self-distribution / unlisted), *not*
     "On this site".
   - Upload `dist/regular-shorts.xpi`.
   - Wait for the automated validation to finish (usually a few minutes).
   - Download the signed `.xpi` from the version page.

   *Via the CLI (`web-ext`):*

   ```bash
   npm install --global web-ext
   web-ext sign --api-key=JWT_ISSUER --api-secret=JWT_SECRET --channel=unlisted
   ```

   Create API keys at
   <https://addons.mozilla.org/developers/addon/api/key/>. The signed file is
   written to `web-ext-artifacts/`.

3. **Install the signed `.xpi`**

   In Firefox, open `about:addons`, click the gear icon, choose **Install
   Add-on From File…**, and select the signed `.xpi`.

### Option C — Developer Edition / Nightly / ESR (unsigned, for advanced users)

The Developer Edition, Nightly, and ESR builds of Firefox can install unsigned
extensions permanently. Standard release and beta builds **cannot** (the
preference is ignored there).

1. Build the package: `./build.sh`
2. Open `about:config`, search for `xpinstall.signatures.required`, and set it
   to `false`.
3. Open `about:addons` → gear icon → **Install Add-on From File…** and select
   `dist/regular-shorts.xpi`.

---

## Building

Requires `zip`.

```bash
./build.sh
```

Output: `dist/regular-shorts.xpi` (unsigned). An `.xpi` is just a ZIP archive
with the extension's files at its root.

## Publishing

To publish on addons.mozilla.org:

1. Go to <https://addons.mozilla.org/developers/> and sign in.
2. **Submit a New Add-on** → choose **"On this site"** for a public listing.
3. Upload `dist/regular-shorts.xpi` and complete the listing (description,
   screenshots, etc.).
4. Submit for review. Once approved, users can install it from AMO and receive
   updates automatically.

---

## How it works

The extension handles Shorts redirects in two complementary ways:

1. **Full page loads** (`background.js`) — `webRequest.onBeforeRequest` with
   the `blocking` option redirects the request *before it is sent*. This covers
   pasting a URL, external links, and new tabs (where a real network request
   happens).
2. **In-page navigation** (`content.js`) — YouTube is a single-page app, so
   clicking a Shorts link *on youtube.com itself* does not make a network
   request; its router intercepts the click and uses `history.pushState`.
   `webRequest` never sees that. The content script intercepts the click first
   (capture phase, at `document_start`) and forces a full navigation to the
   standard watch page.

It is scoped entirely to YouTube:

- Host permissions are limited to `*.youtube.com` (and the bare `youtube.com`).
- The webRequest listener only matches `/shorts/` URLs and only `main_frame`
  (top-level) navigations.
- The content script only runs on youtube.com.

The extension is inert on every other site — it has no `<all_urls>` permission
and no content scripts elsewhere.

## Permissions

| Permission | Why |
|---|---|
| `webRequest` | Observe network requests to youtube.com |
| `webRequestBlocking` | Redirect a request before it is sent (still supported in Firefox Manifest V3) |
| `*.youtube.com` host permission | Scope all behavior to YouTube only |

## Files

- `manifest.json` — Manifest V3, Firefox-specific settings.
- `background.js` — redirect for real network requests (webRequest).
- `content.js` — redirect for YouTube's in-page (SPA) navigation.
- `build.sh` — packages the extension into an `.xpi`.

## License

[MIT](LICENSE)
