/* Parth Kothawade — atmos.js
   Site-wide living atmosphere: slow golden dust drifting behind all content,
   with subtle mouse-depth parallax. Self-contained & defensive — any failure
   here is swallowed and the site is unaffected. */
(function () {
  "use strict";
  try {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cv = document.getElementById("atmosCanvas");
    if (!cv || !cv.getContext || reduce) return;
    var ctx = cv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, parts = [], mx = 0, my = 0, tmx = 0, tmy = 0, running = true;
    var lowPow = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    /* pre-rendered dust sprite (drawn once) — avoids per-frame gradient allocation */
    var sprite = document.createElement("canvas"); sprite.width = sprite.height = 48;
    (function () {
      var sx = sprite.getContext("2d"), g = sx.createRadialGradient(24, 24, 0, 24, 24, 24);
      g.addColorStop(0, "rgba(255,216,158,1)");
      g.addColorStop(0.4, "rgba(199,146,79,.6)");
      g.addColorStop(1, "rgba(199,146,79,0)");
      sx.fillStyle = g; sx.fillRect(0, 0, 48, 48);
    })();

    function size() {
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function mk() {
      return {
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2.2 + 0.5,
        s: Math.random() * 0.22 + 0.05,           // rise speed
        d: Math.random() * 0.2 - 0.1,             // drift
        a: Math.random() * 0.18 + 0.05,           // base alpha (faint, ~0.1)
        z: Math.random() * 0.8 + 0.2,             // depth (parallax factor)
        tw: Math.random() * 6.28
      };
    }
    function seed() {
      parts = [];
      var cap = lowPow ? 14 : 24;
      var n = Math.max(12, Math.min(cap, Math.round(W / 60)));   // ~15–25 faint motes; density scales with width / power
      for (var i = 0; i < n; i++) parts.push(mk());
    }
    function frame() {
      if (!running) return;
      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y -= p.s; p.x += p.d; p.tw += 0.02;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        var px = p.x + mx * 26 * p.z, py = p.y + my * 18 * p.z;   // mouse parallax by depth
        var fl = 0.65 + 0.35 * Math.sin(p.tw);
        var R = p.r * 5;
        ctx.globalAlpha = p.a * fl;
        ctx.drawImage(sprite, px - R, py - R, R * 2, R * 2);       // cached sprite — no per-frame gradient
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    window.addEventListener("mousemove", function (e) {
      tmx = e.clientX / window.innerWidth - 0.5;
      tmy = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
    window.addEventListener("resize", function () { size(); seed(); }, { passive: true });
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden; if (running) requestAnimationFrame(frame);
    });
    size(); seed(); requestAnimationFrame(frame);
  } catch (e) { /* atmosphere is optional — never break the site */ }
})();
