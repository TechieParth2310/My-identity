/* Parth Kothawade — hints.js
   Discoverability: makes the hidden interactions findable.
   - wires the visible ⌘K nav chip
   - builds a "?" help button + panel that lists & triggers every interaction
   - shows a one-time intro hint after the entrance
   Self-contained & defensive. */
(function () {
  "use strict";
  try {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ⌘K nav chip → open command palette */
    var chip = document.getElementById("kChip");
    if (chip) chip.addEventListener("click", function () { if (window.__palette) window.__palette.toggle(); });

    /* Help button + panel */
    var fab = document.createElement("button");
    fab.className = "help-fab"; fab.type = "button"; fab.setAttribute("aria-label", "What can I do here?");
    fab.textContent = "?";
    document.body.appendChild(fab);

    var panel = document.createElement("div");
    panel.className = "help-panel";
    panel.innerHTML =
      '<h4>Things you can do here</h4>' +
      '<div class="help-item" data-act="palette"><span class="ic">⌘</span>Command menu — jump anywhere<span class="kbd">⌘K</span></div>' +
      '<div class="help-item" data-act="ask"><span class="ic">✦</span>Ask my work — chat with my portfolio<span class="kbd">type</span></div>' +
      '<div class="help-item" data-act="dev"><span class="ic">⌥</span>Developer mode — my live GitHub<span class="kbd">~</span></div>' +
      '<div class="help-item" data-act="build"><span class="ic">▶</span>Watch me build this site<span class="kbd">play</span></div>' +
      '<div class="help-item" data-act="builder"><span class="ic">▦</span>Builder Mode — the engineering<span class="kbd">dossier</span></div>' +
      '<div class="help-item" data-act="gold"><span class="ic">✦</span>Golden mode<span class="kbd">konami</span></div>' +
      '<div class="help-item" data-act="sound"><span class="ic">♪</span>Toggle sound<span class="kbd">click</span></div>';
    document.body.appendChild(panel);

    function openP() { panel.classList.add("open"); }
    function closeP() { panel.classList.remove("open"); }
    function toggleP() { panel.classList.contains("open") ? closeP() : openP(); }
    fab.addEventListener("click", function (e) { e.stopPropagation(); toggleP(); });
    document.addEventListener("click", function (e) {
      if (panel.classList.contains("open") && !panel.contains(e.target) && e.target !== fab) closeP();
    });

    panel.addEventListener("click", function (e) {
      var item = e.target.closest(".help-item"); if (!item) return;
      var act = item.getAttribute("data-act"); closeP();
      if (act === "palette" && window.__palette) window.__palette.toggle();
      else if (act === "dev" && window.__toggleDev) window.__toggleDev();
      else if (act === "build" && window.__buildMode) window.__buildMode();
      else if (act === "builder" && window.__builder) window.__builder.toggle();
      else if (act === "ask") {
        var m = document.getElementById("method"); if (m) m.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        setTimeout(function () { var i = document.getElementById("keInput"); if (i) i.focus(); }, reduce ? 0 : 700);
      } else if (act === "gold") {
        document.body.classList.toggle("gold-theme");
        if (window.__toast) window.__toast(document.body.classList.contains("gold-theme") ? "✦ <b>Golden mode</b> on" : "back to brass");
      } else if (act === "sound") {
        var s = document.getElementById("snd"); if (s) s.click();
      }
    });

    /* reveal the help button shortly after entry; nudge once */
    setTimeout(function () { fab.classList.add("ready", "nudge"); }, reduce ? 500 : 7600);

    /* one-time intro hint (once per browser session) */
    var KEY = "parth-hinted";
    var seen = false; try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
    if (!seen) {
      setTimeout(function () {
        if (window.__toast) window.__toast('Tip: press <b>⌘K</b> to explore · <b>~</b> for developer mode · or tap <b>?</b>');
        try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      }, reduce ? 800 : 8200);
    }
  } catch (e) { /* hints are optional */ }
})();
