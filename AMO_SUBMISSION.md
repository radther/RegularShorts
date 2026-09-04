# AMO Submission

Copy-paste-ready content for submitting Regular Shorts to [addons.mozilla.org](https://addons.mozilla.org/) (AMO).

## Submission flow

1. Sign in at <https://addons.mozilla.org/developers/>.
2. **Submit a New Add-on** → choose **"On this site"** (listed on AMO).
3. Upload `dist/regular-shorts.xpi` (built with `./build.sh`).
4. Pass automated validation, then fill in the fields below.
5. **Submit Version**.

> [!NOTE]
> Rebuild with `./build.sh` before uploading — the manifest must include the `data_collection_permissions` key (it does, as of `9905ca6`).

---

## Basic identity

| Field | Value |
|---|---|
| Name | `Regular Shorts` |
| Add-on URL (slug) | `regular-shorts` (auto-suggested; change only if AMO says it's taken) |
| Version | `1.0.0` (auto-read from manifest) |

---

## Summary

> Watch YouTube Shorts in the regular YouTube player.

---

## Description

```
Regular Shorts automatically redirects YouTube Shorts to the standard YouTube player, so every short opens with the full video interface.

It works everywhere:
• Clicking a Shorts link on the YouTube site itself
• Following a Shorts link from another site
• Pasting or typing a Shorts URL in the address bar

Example:
youtube.com/shorts/itNOqbmqHDI  →  youtube.com/watch?v=itNOqbmqHDI

How it works
The extension redirects the request before the Shorts page ever loads, so there's no flicker and no "land on Shorts first" behavior. It only ever runs on youtube.com and does nothing on any other website.

Privacy
Regular Shorts collects no data. Nothing is tracked, stored, or transmitted.

Open source
The source code is available on GitHub:
https://github.com/radther/RegularShorts
```

> AMO descriptions use simple markup. If plain newlines don't render as line breaks, use `<br>` tags or `<ul><li>` lists instead.

---

## Categories

- Primary: `Photos, Music & Videos`
- Secondary: (leave blank, or `Other`)

---

## Support & links

| Field | Value |
|---|---|
| Support email | `tomquil13@gmail.com` |
| Support website | `https://github.com/radther/RegularShorts` |
| Homepage (if separate field) | `https://github.com/radther/RegularShorts` |

---

## License

Select **MIT** from the license picker (matches the repo `LICENSE`).

---

## Privacy policy

Leave the "This add-on has a privacy policy" box **unchecked** — it's only required if data is transmitted, and this extension collects nothing.

---

## Notes for Reviewers

```
This extension redirects YouTube Shorts URLs to the standard watch player.
It uses two mechanisms:

1. webRequest.onBeforeRequest (blocking) redirects full page loads before the request is sent. This covers pasted URLs, external links, and new tabs.
2. A content script intercepts in-page clicks on youtube.com, because YouTube is a single-page app whose router uses history.pushState (no network request, so webRequest never fires). The script listens in the capture phase at document_start and forces a full navigation to the watch page.

Permissions requested:
- webRequest / webRequestBlocking: needed to redirect requests before they are sent. Firefox still supports blocking webRequest in Manifest V3.
- *.youtube.com host permission: scopes all behavior to YouTube only.

The extension collects, stores, and transmits no data (data_collection_permissions: required ["none"]). There is no remote code, no eval, and no network activity beyond the redirect itself.

To test: click a Shorts thumbnail on the YouTube homepage, or paste a youtube.com/shorts/<id> URL into the address bar. Both should land directly on the standard watch page.
```

---

## Platform compatibility

- Select **Firefox** (desktop).
- Android: the code would work, but only tick it if actually tested on Firefox for Android.

---

## Checklist before submitting

- [ ] Rebuild with `./build.sh` and upload the fresh `dist/regular-shorts.xpi`
- [ ] Add icons to `manifest.json` (currently missing — listing will show a generic placeholder without them)
- [ ] Expect a warning about `webRequestBlocking` / host access during validation — inherent to this extension, not a blocker
