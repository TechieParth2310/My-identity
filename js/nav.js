/* Parth Kothawade — nav.js
   Mobile hamburger menu. Premium, accessible, defensive.
   - Toggles a full-screen overlay (CSS does the animation)
   - Locks body scroll while open (no layout shift via scrollbar gutter)
   - Esc closes · click on backdrop closes · any link closes
   - Focus trap while open · returns focus to the burger on close
   - Auto-closes if the viewport grows back to desktop
   Any failure is swallowed so the rest of the site is unaffected. */
(function () {
  "use strict";
  try {
    var burger = document.getElementById("navBurger");
    var menu = document.getElementById("navMenu");
    if (!burger || !menu) return;

    var body = document.body;
    var open = false;
    var links = menu.querySelectorAll("a");

    function focusables() {
      return [burger].concat(Array.prototype.slice.call(links));
    }

    function setOpen(state) {
      open = state;
      body.classList.toggle("nav-open", state);
      menu.setAttribute("aria-hidden", state ? "false" : "true");
      burger.setAttribute("aria-expanded", state ? "true" : "false");
      burger.setAttribute("aria-label", state ? "Close menu" : "Open menu");
      if (state) {
        // focus first link shortly after the overlay paints
        setTimeout(function () { if (links[0]) links[0].focus(); }, 80);
      } else {
        burger.focus();
      }
    }

    burger.addEventListener("click", function () { setOpen(!open); });

    // click on the empty overlay area (not the nav itself) closes
    menu.addEventListener("click", function (e) { if (e.target === menu) setOpen(false); });

    // any link closes; the CTA also opens the contact modal if available
    Array.prototype.forEach.call(links, function (a) {
      a.addEventListener("click", function (e) {
        if (a.classList.contains("nm-cta") && typeof window.__contact === "function") {
          e.preventDefault();
          setOpen(false);
          setTimeout(window.__contact, 220);
          return;
        }
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (!open) return;
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key === "Tab") {
        var f = focusables();
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // if we grow back to desktop while open, close cleanly
    window.addEventListener("resize", function () {
      if (open && window.innerWidth > 760) setOpen(false);
    }, { passive: true });
  } catch (e) { /* mobile menu is optional */ }
})();
