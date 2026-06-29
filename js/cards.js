/* Parth Kothawade — cards.js
   Cursor-follow lighting for cards. As the pointer moves over a card we feed
   its local x/y into CSS custom props (--mx/--my); the card's ::after spotlight
   (defined in site.css) follows the cursor. Pure progressive enhancement:
   if anything is off, cards still look great — they just won't track the cursor.
   Skipped on touch devices. Self-contained & defensive. */
(function () {
  "use strict";
  try {
    if (window.matchMedia && window.matchMedia("(pointer:coarse)").matches) return;
    var SEL = ".tile,.mission,.skill-col,.rec-block,.note";
    document.addEventListener("mousemove", function (e) {
      var c = e.target && e.target.closest ? e.target.closest(SEL) : null;
      if (!c) return;
      var r = c.getBoundingClientRect();
      if (!r.width || !r.height) return;
      c.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
      c.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
    }, { passive: true });
  } catch (e) { /* card lighting is optional */ }
})();
