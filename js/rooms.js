/* Parth Kothawade — rooms.js
   Cinematic "entering another room" wipe on in-page navigation.
   Only fires on explicit nav (anchor clicks + palette), never on raw scroll.
   Reduced-motion jumps instantly. Self-contained, pointer-events:none (never blocks). */
(function () {
  "use strict";
  try {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var MAP = { top: "Top", work: "The Work", method: "The Method", brain: "How I Think", builder: "The Builder", about: "About", contact: "Start a Project" };
    var room = document.createElement("div"); room.className = "room";
    room.innerHTML = '<span class="label"></span>';
    document.body.appendChild(room);
    var label = room.querySelector(".label"), busy = false;

    function transition(id, done) {
      var name = MAP[id];
      if (reduce || !name) { if (done) done(); return; }
      if (busy) { if (done) done(); return; }
      busy = true; label.textContent = name;
      room.classList.remove("reveal"); room.classList.add("cover");
      setTimeout(function () {
        if (done) { try { done(); } catch (e) {} }
        room.classList.remove("cover"); room.classList.add("reveal");
        setTimeout(function () { room.classList.remove("reveal"); busy = false; }, 640);
      }, 520);
    }
    window.__room = transition;

    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var href = a.getAttribute("href"); if (!href || href === "#" || href.length < 2) return;
      var id = href.slice(1), target = document.getElementById(id); if (!target) return;
      e.preventDefault();
      transition(id, function () { target.scrollIntoView({ behavior: "auto" }); try { history.replaceState(null, "", "#" + id); } catch (e2) {} });
    });
  } catch (e) { /* room transitions are optional */ }
})();
