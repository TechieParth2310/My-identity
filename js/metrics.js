/* Parth Kothawade — metrics.js
   Visible LIVE metric in the footer: real public GitHub stats (CORS-enabled).
   Falls back to a static label on any failure. Self-contained. */
(function () {
  "use strict";
  try {
    var el = document.getElementById("ghLive"); if (!el) return;
    var USER = "TechieParth2310";
    var ctrl = ("AbortController" in window) ? new AbortController() : null;
    var to = ctrl ? setTimeout(function () { ctrl.abort(); }, 6000) : null;
    fetch("https://api.github.com/users/" + USER, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (u) {
        if (to) clearTimeout(to);
        if (!u) { el.textContent = "github.com/" + USER; return; }
        el.innerHTML = (u.public_repos || 0) + " public repos <span class=\"gh-dot\">●</span> building daily";
      })
      .catch(function () { if (to) clearTimeout(to); el.textContent = "github.com/" + USER; });
  } catch (e) { /* metrics are optional */ }
})();
