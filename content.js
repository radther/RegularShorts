// Handles the single-page-app (SPA) case: clicking a Shorts link *inside*
// youtube.com doesn't trigger a network request — YouTube's router intercepts
// the click and uses history.pushState. webRequest never sees it.
//
// So here we intercept the click (in the capture phase, before YouTube's own
// handlers) and force a full navigation to the standard watch page.

(function () {
  if (window.top !== window) return;

  const SHORTS_PATH_RE = /^\/shorts\/([A-Za-z0-9_-]{11})\/?$/;
  const WATCH_URL = "https://www.youtube.com/watch?v=";

  function shortsId(url) {
    try {
      const u = new URL(url, location.href);
      if (u.hostname !== "youtube.com" && !u.hostname.endsWith(".youtube.com")) {
        return null;
      }
      const m = SHORTS_PATH_RE.exec(u.pathname);
      return m ? m[1] : null;
    } catch (e) {
      return null;
    }
  }

  function handleClick(event) {
    // Only plain left-clicks without modifier keys. Modified clicks (ctrl/cmd,
    // middle-click, etc.) open a new tab/window, where the webRequest handler
    // does the redirect instead.
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    // Walk the composed path so we find the anchor even when it lives inside
    // a shadow root (YouTube uses shadow DOM heavily).
    const path = event.composedPath
      ? event.composedPath()
      : event.target
        ? [event.target]
        : [];

    for (const node of path) {
      if (!node || node.nodeType !== 1 || typeof node.matches !== "function") {
        continue;
      }
      if (!node.matches("a[href]")) {
        continue;
      }

      const id = shortsId(node.href);
      if (!id) {
        continue;
      }

      // Stop YouTube's SPA router from handling this click and navigate
      // straight to the standard watch page with a full page load.
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      window.location.assign(WATCH_URL + id);
      return;
    }
  }

  // Capture phase on window: runs before YouTube registers its own handlers,
  // because this script runs at document_start.
  window.addEventListener("click", handleClick, true);
})();
