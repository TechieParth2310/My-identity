/* Parth Kothawade — buildmode.js
   "Watch me build": a cinematic where the site assembles itself —
   a typed build log on the left, wireframe blocks snapping into place
   on the right, then deploy → welcome. Self-contained, defensive.
   Exposed as window.__buildMode(). */
(function () {
  "use strict";
  try {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var bm = document.createElement("div"); bm.className = "bm"; bm.id = "buildmode";
    bm.innerHTML =
      '<div class="rp-top"><span>Build Mode — <b>watch it build itself</b></span>' +
        '<button class="rp-close bm-x" type="button" aria-label="Close">✕</button></div>' +
      '<div class="bm-wrap">' +
        '<div class="bm-term"><div class="bm-log"></div></div>' +
        '<div class="bm-canvas" aria-hidden="true">' +
          '<div class="bm-blk b-nav"><span class="bn">PARTH</span><span class="bnav">The Work · The Method · About</span><span class="bcta">Start a Project</span></div>' +
          '<div class="bm-hero"><div class="bm-hcopy"><div class="bm-eye">AI PRODUCT ENGINEER</div>' +
            '<div class="bm-h1">I build AI products that people <em>actually use.</em></div></div>' +
            '<div class="bm-device"><span class="bd-l"></span><span class="bd-l"></span><span class="bd-l"></span></div></div>' +
          '<div class="bm-grid"><span data-l="ApplySync"></span><span data-l="FaceGPT"></span><span data-l="SkinGPT"></span>' +
            '<span data-l="I Am Still Alive"></span><span data-l="Events &amp; Conference"></span><span data-l="Management Portal"></span></div>' +
        '</div>' +
      '</div>' +
      '<div class="rp-foot"><button class="rp-btn bm-skip" type="button">Skip</button></div>' +
      '<div class="bm-end"><div class="rp-endtag">✓ deployed</div><h2>Welcome.</h2>' +
        '<p class="rp-endnote">You just watched this portfolio build itself — vanilla JS, no framework.</p>' +
        '<div class="rp-foot"><button class="rp-btn primary bm-enter" type="button">Enter the studio →</button></div></div>';
    document.body.appendChild(bm);
    var log = bm.querySelector(".bm-log"), endEl = bm.querySelector(".bm-end"), timers = [];

    var STEPS = [
      { l: "$ initializing studio…", c: "cmd" },
      { l: "✓ scaffolding layout", c: "ok", on: ".b-nav" },
      { l: "$ composing the hero…", c: "cmd" },
      { l: "✓ headline + device + live feed", c: "ok", on: ".bm-hero" },
      { l: "$ wiring components…", c: "cmd" },
      { l: "✓ work · method · about", c: "ok", on: ".bm-grid" },
      { l: "$ adding motion…", c: "cmd" },
      { l: "✓ atmosphere · parallax · cursor", c: "ok" },
      { l: "$ connecting the AI brain…", c: "cmd" },
      { l: "✓ /api/ask online", c: "ok" },
      { l: "$ deploying → vercel…", c: "cmd" },
      { l: "✓ build passed", c: "ok" },
      { l: "✓ live", c: "ok" }
    ];

    function clearT() { for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]); timers = []; }
    function reset() { log.innerHTML = ""; endEl.classList.remove("show");
      Array.prototype.forEach.call(bm.querySelectorAll(".bm-blk,.bm-grid,.bm-hero"), function (b) { b.classList.remove("on"); }); }

    function open() {
      bm.classList.add("open"); clearT(); reset();
      if (reduce) { STEPS.forEach(function (s) { addLine(s); if (s.on) revealOn(s.on); }); showEnd(); return; }
      var i = 0;
      (function step() {
        if (i >= STEPS.length) { timers.push(setTimeout(showEnd, 700)); return; }
        var s = STEPS[i]; addLine(s); if (s.on) revealOn(s.on);
        i++; timers.push(setTimeout(step, 620));
      })();
    }
    function addLine(s) { var d = document.createElement("div"); d.className = "l " + (s.c || ""); d.textContent = s.l; log.appendChild(d); }
    function revealOn(sel) { Array.prototype.forEach.call(bm.querySelectorAll(sel), function (b) { b.classList.add("on"); }); }
    function showEnd() { endEl.classList.add("show"); }
    function close() { clearT(); bm.classList.remove("open"); }

    window.__buildMode = open;
    bm.querySelector(".bm-x").addEventListener("click", close);
    bm.querySelector(".bm-skip").addEventListener("click", function () { clearT(); reset(); STEPS.forEach(function (s) { addLine(s); if (s.on) revealOn(s.on); }); showEnd(); });
    bm.querySelector(".bm-enter").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && bm.classList.contains("open")) close(); });
  } catch (e) { /* build mode is optional */ }
})();
