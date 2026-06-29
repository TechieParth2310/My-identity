/* Parth Kothawade — devmode.js
   Developer Mode: press ` (or ~) for a terminal overlay that pulls
   Parth's LIVE GitHub activity (public api.github.com, CORS-enabled).
   Self-contained & defensive; exposes window.__toggleDev for the palette. */
(function () {
  "use strict";
  try {
    var USER = "TechieParth2310";
    var dev = document.createElement("div");
    dev.className = "dev"; dev.id = "devmode";
    dev.innerHTML =
      '<div class="dev-wrap">' +
        '<div class="dev-bar"><span>PARTH//OS — <b>developer mode</b></span><span class="dim">press ~ or esc to exit</span></div>' +
        '<div id="devBody"></div>' +
      '</div>';
    document.body.appendChild(dev);
    var body = dev.querySelector("#devBody"), loaded = false;

    function line(html, cls) { var p = document.createElement("div"); p.className = "ln " + (cls || ""); p.innerHTML = html; body.appendChild(p); return p; }
    function open() { dev.classList.add("open"); if (!loaded) { loaded = true; boot(); } }
    function close() { dev.classList.remove("open"); }
    function isOpen() { return dev.classList.contains("open"); }
    window.__toggleDev = function () { isOpen() ? close() : open(); };

    function timeAgo(iso) {
      if (!iso) return "";
      var s = (Date.now() - new Date(iso).getTime()) / 1000;
      if (s < 3600) return Math.max(1, Math.round(s / 60)) + "m ago";
      if (s < 86400) return Math.round(s / 3600) + "h ago";
      return Math.round(s / 86400) + "d ago";
    }

    function boot() {
      body.innerHTML = "";
      line('<span class="ok">$</span> whoami');
      line('Parth Kothawade — AI Product Engineer · Chalisgaon, Maharashtra', "br");
      var ua = navigator.userAgent.match(/(Chrome|Firefox|Safari|Edg)\/[\d.]+/);
      line('<span class="dim">runtime:</span> ' + (ua ? ua[0] : navigator.platform) +
           '  ·  <span class="dim">viewport:</span> ' + innerWidth + '×' + innerHeight +
           '  ·  <span class="dim">cores:</span> ' + (navigator.hardwareConcurrency || "?") +
           '  ·  <span class="dim">lang:</span> ' + navigator.language, "dim");
      line("");
      line('<span class="ok">$</span> git fetch --all  <span class="dim"># live · github.com/' + USER + '</span>');
      var status = line('<span class="dim">connecting to GitHub…</span>');

      fetch("https://api.github.com/users/" + USER)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (u) {
          if (!u) { status.innerHTML = '<span class="dim">GitHub unavailable (rate limit / offline) — github.com/' + USER + '</span>'; return null; }
          status.innerHTML = '<span class="ok">✓ connected</span>  ·  <b class="br">' + (u.public_repos || 0) +
            '</b> public repos  ·  shipping since ' + String(u.created_at || "").slice(0, 4);
          return fetch("https://api.github.com/users/" + USER + "/repos?sort=pushed&per_page=8");
        })
        .then(function (r) { return r && r.ok ? r.json() : null; })
        .then(function (repos) {
          if (!repos || !repos.length) return;
          var h = document.createElement("h3"); h.textContent = "recent activity (live)"; body.appendChild(h);
          repos.forEach(function (rp) {
            var row = document.createElement("div"); row.className = "dev-repo";
            row.innerHTML =
              '<a href="' + rp.html_url + '" target="_blank" rel="noopener">' + rp.name + '</a>' +
              '<span class="lang">' + (rp.language || "·") + '</span>' +
              '<span class="when">' + timeAgo(rp.pushed_at) + '</span>';
            body.appendChild(row);
          });
          var note = document.createElement("div"); note.className = "dev-hint";
          note.innerHTML = 'deployments in production: ' +
            '<a href="https://www.applysync.in/" target="_blank" rel="noopener" style="color:var(--brass-l)">applysync.in</a> · ' +
            '<a href="https://iamstillalive.com/" target="_blank" rel="noopener" style="color:var(--brass-l)">iamstillalive.com</a>';
          body.appendChild(note);
        })
        .catch(function () { status.innerHTML = '<span class="dim">GitHub unavailable — github.com/' + USER + '</span>'; });
    }

    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || (e.target && e.target.isContentEditable)) return;
      if (e.key === "`" || e.key === "~") { e.preventDefault(); window.__toggleDev(); }
      else if (e.key === "Escape" && isOpen()) { close(); }
    });
  } catch (e) { /* dev mode is optional */ }
})();
