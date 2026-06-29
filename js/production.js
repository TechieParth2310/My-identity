/* Parth Kothawade — production.js
   "The Builder" → a movie: a CI/deploy terminal that types itself out once,
   when the section scrolls into view. Self-contained & defensive. */
(function () {
  "use strict";
  try {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var term = document.getElementById("builderTerm"), log = document.getElementById("btLog");
    if (!term || !log) return;
    var LINES = [
      ['$ git commit -m "fix: reconcile sync layer"', "cmd"],
      ["[main 9f3c2a1] 1 file changed, 38 insertions(-)", "dim"],
      ["$ npm test", "cmd"],
      ["running 142 tests…", "dim"],
      ["✓ 142 passed · 0 failed", "ok"],
      ["$ npm run build", "cmd"],
      ["✓ build passed in 11.4s", "ok"],
      ["$ vercel deploy --prod", "cmd"],
      ["uploading…  ✓", "dim"],
      ["✓ deployed → production", "ok"],
      ["● live · logs quiet · 9:02 AM", "ok"]
    ];
    var done = false, timers = [];
    function run() {
      if (done) return; done = true;
      if (reduce) { log.innerHTML = LINES.map(function (l) { return '<div class="' + l[1] + '">' + l[0] + '</div>'; }).join(""); return; }
      var i = 0;
      (function step() {
        if (i >= LINES.length) return;
        var d = document.createElement("div"); d.className = LINES[i][1]; log.appendChild(d);
        var full = LINES[i][0], k = 0;
        var t = setInterval(function () {
          k += 2; d.textContent = full.slice(0, k);
          if (k >= full.length) { clearInterval(t); i++; timers.push(setTimeout(step, 240)); }
        }, 16);
        timers.push(t);
      })();
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.25 });
      io.observe(term);
    } else { run(); }
  } catch (e) { /* optional */ }
})();
