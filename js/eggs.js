/* Parth Kothawade — eggs.js
   Hidden delights: Konami code → golden theme, type secret words → replies,
   double-click the logo → a note. Self-contained & defensive. */
(function () {
  "use strict";
  try {
    var t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
    var tt = null;
    function toast(html) {
      t.innerHTML = html; t.classList.add("show");
      clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("show"); }, 4400);
    }
    window.__toast = toast;

    var seq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], pos = 0; // ↑↑↓↓←→←→ B A
    var buf = "";
    var WORDS = {
      claude: '<b>Claude</b> helped build this. I architect &amp; direct — it implements. ✦',
      openai: '<b>OpenAI</b> &amp; NVIDIA power parts of my products. Tools change; judgment compounds.',
      parth:  "That's me — <b>Parth Kothawade</b>. I build AI products that people actually use.",
      hire:   '<b>Let’s talk.</b> parthkothawade2310@gmail.com — or press ⌘K → Email me.',
      vercel: 'This site’s AI brain runs on a tiny serverless function — the key never ships to the browser.'
    };

    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || (e.target && e.target.isContentEditable)) return;

      if (e.keyCode === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          pos = 0;
          document.body.classList.toggle("gold-theme");
          toast(document.body.classList.contains("gold-theme") ? "✦ <b>Golden mode</b> unlocked" : "back to brass");
        }
      } else { pos = (e.keyCode === seq[0]) ? 1 : 0; }

      var k = (e.key || "").toLowerCase();
      if (k.length === 1 && k >= "a" && k <= "z") {
        buf = (buf + k).slice(-14);
        var hit = false;
        for (var a in ACTIONS) { if (buf.indexOf(a) !== -1) { ACTIONS[a](); buf = ""; hit = true; break; } }
        if (hit) return;
        for (var w in WORDS) { if (buf.indexOf(w) !== -1) { toast(WORDS[w]); buf = ""; break; } }
      }
    });

    var ACTIONS = {
      build: function () { toast("▸ entering build mode…"); setTimeout(function () { if (window.__buildMode) window.__buildMode(); }, 600); },
      coffee: function () { document.body.classList.add("lamp-on"); toast("the lamp clicks on. back to building."); setTimeout(function () { document.body.classList.remove("lamp-on"); }, 4500); },
      sudoship: function () { toast("$ sudo ship — deploying…"); setTimeout(function () { toast("✓ shipped to production."); }, 1500); }
    };

    var brand = document.querySelector(".brand");
    if (brand) brand.addEventListener("dblclick", function (e) {
      e.preventDefault();
      toast("✦ built from scratch in vanilla JS — no framework. try the Konami code, type <b>claude</b>, or press <b>~</b> for dev mode.");
    });
  } catch (e) { /* delights are optional */ }
})();
