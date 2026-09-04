// Redirect YouTube Shorts to the standard watch player.
//
// This runs in onBeforeRequest with the "blocking" option, which means the
// redirect happens *before* the network request is sent. The Shorts page
// never loads — the user is taken straight to the normal video player.

// Matches "/shorts/<11-char-id>" (optional trailing slash).
const SHORTS_PATH_RE = /^\/shorts\/([A-Za-z0-9_-]{11})\/?$/;

function redirectToWatch(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    return null;
  }

  // Double-check the host even though the listener filter already
  // restricts us to youtube.com. This guards against unexpected input.
  const isYouTube =
    parsed.hostname === "youtube.com" ||
    parsed.hostname.endsWith(".youtube.com");
  if (!isYouTube) {
    return null;
  }

  const match = SHORTS_PATH_RE.exec(parsed.pathname);
  if (!match) {
    return null;
  }

  // Build a clean watch URL. Query params (e.g. ?si=...&feature=share) are
  // intentionally dropped for a predictable result.
  return `https://www.youtube.com/watch?v=${match[1]}`;
}

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const redirectUrl = redirectToWatch(details.url);
    if (redirectUrl) {
      return { redirectUrl };
    }
  },
  {
    urls: [
      "*://*.youtube.com/shorts/*",
      "*://youtube.com/shorts/*"
    ],
    // Only top-level navigations, not iframes/subresources.
    types: ["main_frame"]
  },
  ["blocking"]
);
