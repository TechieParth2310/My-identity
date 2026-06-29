/* Parth Kothawade — contact.js
   "Start a Project" opens a contact form. On submit it composes an email
   addressed straight to Parth (mailto) — no backend, nothing sent silently,
   the visitor just hits send in their own mail app. Self-contained & defensive. */
(function () {
  "use strict";
  try {
    var modal = document.getElementById("contactModal");
    if (!modal) return;
    var form = document.getElementById("cmfForm"),
        scrim = document.getElementById("cmfScrim"),
        closeB = document.getElementById("cmfClose");

    function open() {
      modal.classList.add("open"); document.body.classList.add("cmf-on");
      setTimeout(function () { var n = document.getElementById("cmfName"); if (n) n.focus(); }, 60);
    }
    function close() { modal.classList.remove("open"); document.body.classList.remove("cmf-on"); }
    window.__contact = open;

    /* every "Start a Project" CTA opens the form (stop bubbling so room-nav doesn't also fire) */
    Array.prototype.forEach.call(document.querySelectorAll(".cta"), function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); open(); });
    });
    if (scrim) scrim.addEventListener("click", close);
    if (closeB) closeB.addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) close(); });

    function val(id) { var e = document.getElementById(id); return e ? e.value.trim() : ""; }

    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = val("cmfName"), email = val("cmfEmail"), type = val("cmfType"), msg = val("cmfMsg");
      if (!name || !email || !msg) return;
      var subject = "[Portfolio] " + type + " — " + name;
      var body = "Name: " + name + "\nEmail: " + email + "\nAbout: " + type + "\n\n" + msg + "\n\n— sent from your portfolio";
      var href = "mailto:parthkothawade2310@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var box = modal.querySelector(".cmf-box");
      if (box) box.innerHTML =
        '<button class="cmf-close" id="cmfClose2" type="button" aria-label="Close">✕</button>' +
        '<div class="cmf-sent"><div class="cmf-tick">✓</div><h3>Opening your email…</h3>' +
        '<p>Your message to me is ready in your mail app — just hit send. If nothing opened, write to ' +
        '<a href="mailto:parthkothawade2310@gmail.com">parthkothawade2310@gmail.com</a>.</p>' +
        '<button class="cmf-send" id="cmfDone" type="button">Done</button></div>';
      try { window.location.href = href; } catch (err) {}
      var d = document.getElementById("cmfDone"); if (d) d.addEventListener("click", close);
      var c2 = document.getElementById("cmfClose2"); if (c2) c2.addEventListener("click", close);
    });
  } catch (e) { /* contact form is optional */ }
})();
