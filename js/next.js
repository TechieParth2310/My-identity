/* Parth Kothawade — next.js
   Next-level layer: hero WebGL particles, living AI assistant, ⌘K command
   palette, sound design, cinematic scroll reveals.
   Every module is wrapped so a failure here NEVER breaks the core site. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer:fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function safe(fn) { try { fn(); } catch (e) { /* isolate failures */ } }

  /* ============================================================
     1 · HERO WEBGL — reactive golden particle field (Three.js)
     ============================================================ */
  safe(function () {
    var cv = $("#heroGL");
    if (!cv || !window.THREE || reduce) return;
    var test = cv.getContext("webgl") || cv.getContext("experimental-webgl");
    if (!test) return; // no WebGL → hero image stays

    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    cam.position.z = 16;
    var renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // soft round sprite
    var sc = document.createElement("canvas"); sc.width = sc.height = 64;
    var sx = sc.getContext("2d");
    var sg = sx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sg.addColorStop(0, "rgba(255,238,205,1)");
    sg.addColorStop(0.35, "rgba(224,181,124,.75)");
    sg.addColorStop(1, "rgba(224,181,124,0)");
    sx.fillStyle = sg; sx.fillRect(0, 0, 64, 64);
    var tex = new THREE.Texture(sc); tex.needsUpdate = true;

    var N = 1500;
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(N * 3), spd = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 46;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
      spd[i] = Math.random() * 0.5 + 0.12;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var mat = new THREE.PointsMaterial({
      size: 0.5, map: tex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, color: 0xE0B57C, opacity: 0.9
    });
    var pts = new THREE.Points(geo, mat); scene.add(pts);

    var tmx = 0, tmy = 0, mx = 0, my = 0;
    window.addEventListener("mousemove", function (e) {
      tmx = e.clientX / window.innerWidth - 0.5;
      tmy = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });

    function resize() {
      var w = cv.clientWidth || window.innerWidth, h = cv.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    }
    resize(); window.addEventListener("resize", resize, { passive: true });

    var arr = geo.attributes.position.array, running = true;
    document.addEventListener("visibilitychange", function () { running = !document.hidden; if (running) loop(); });
    function loop() {
      if (!running) return;
      mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
      for (var i = 0; i < N; i++) {
        arr[i * 3 + 1] += spd[i] * 0.012;
        if (arr[i * 3 + 1] > 14) arr[i * 3 + 1] = -14;
      }
      geo.attributes.position.needsUpdate = true;
      pts.rotation.y = mx * 0.5; pts.rotation.x = my * 0.35;
      cam.position.x += (mx * 5 - cam.position.x) * 0.04;
      cam.position.y += (-my * 3.5 - cam.position.y) * 0.04;
      cam.lookAt(0, 0, 0);
      renderer.render(scene, cam);
      requestAnimationFrame(loop);
    }
    loop();
  });

  /* ============================================================
     2 · LIVING AI ASSISTANT  ("Ask my work")
     ============================================================ */
  safe(function () {
    var tA = $("#tA"), tQ = $("#tQ"), tChips = $("#tChips"),
        form = $("#tForm"), input = $("#tInput");
    if (!tA || !tQ) return;

    var KB = [
      { k: ["decide", "what to build", "idea", "choose", "prioriti", "what should"], a: "I start from the problem, not the model. What hurts, who feels it, and is AI actually the right tool? Most ideas die at that question — and that's the point. I only build what earns a place in production." },
      { k: ["architect", "hard", "design call", "trade", "scale", "decision"], a: "On the conference platform I refused to hard-wire an AI provider — every model sits behind one swappable abstraction. A little upfront design bought one-line model swaps and a codebase that didn't collapse under 35 data models." },
      { k: ["wrong", "mistake", "fail", "failure", "regret"], a: "ApplySync. It works end to end and launched with almost no paying users. It taught me the real game isn't code — it's distribution. I'd rather learn that lesson now than at scale." },
      { k: ["fast", "speed", "ship", "quick", "how long", "days"], a: "Days, not months. I direct AI for the volume and hold the architecture, trade-offs and guardrails myself — idea to live product before most teams finish planning." },
      { k: ["really code", "do you code", "actually write", "ai native", "ai-native", "prompt", "cursor", "honest"], a: "Honestly? I'm AI-native. I design the system, make the architectural calls, and direct tools like Cursor and Claude to write implementation — then I integrate, debug and ship. My edge is judgment and orchestration, and I'm deepening fundamentals every week." },
      { k: ["stack", "tech", "tools", "language", "framework"], a: "Hands-on: Flutter, Dart, Firebase, Python, REST, Git. Architect-and-direct: React, Next.js, TypeScript, Node, Django, Prisma, Supabase. AI: NVIDIA NIM, embeddings/RAG, OpenCV, vision LLMs." },
      { k: ["applysync", "apply sync", "job"], a: "ApplySync — my startup. An AI system that watches 50+ Telegram job channels, scores fit, tailors the résumé per role and auto-applies 24/7, plus a Chrome extension that auto-fills 46+ sites. Built solo, end to end." },
      { k: ["still alive", "iasa", "cancer", "healthcare", "health"], a: "I Am Still Alive — a healthcare platform for cancer patients, on Django. 14+ governed AI features over NVIDIA NIM: assistant agent, document/scan vision, crisis detection, moderation, embeddings case-matching — every call fail-safe, audited, with a global kill switch." },
      { k: ["conference", "event", "vendor", "cost", "60", "crore"], a: "The Conference & Events platform — vendors quoted ₹60L–4Cr; I built it in-house: ~18,000 lines, 35 data models, ticketing, LiveKit video, Stripe, and an AI copilot/matchmaker behind one swappable layer." },
      { k: ["portal", "management", "internal", "ops", "hr", "team"], a: "The Management Portal — an internal OS for the company: HR, attendance, payroll, ATS, help desk — 20+ modules with Microsoft SSO. It's live, and the whole team opens it every day." },
      { k: ["facegpt", "face gpt", "reverse image"], a: "FaceGPT — an AI reverse-image-search app on Google Play. 20+ screens, plus a backend-driven credit & subscription engine kept perfectly in sync. Cut data-sync latency ~25%." },
      { k: ["skingpt", "skin", "style", "fashion"], a: "SkinGPT — a cross-platform app on the App Store: upload a selfie, get personalised colour and outfit recommendations from skin-tone analysis. Firebase auth, Dio API layer." },
      { k: ["hire", "why you", "work with", "recruit", "stand out"], a: "Because I ship. Real products, real users, real impact — fast. I own outcomes end to end and optimise for leverage. If you need someone who turns ambition into a live product, that's the whole job." },
      { k: ["contact", "email", "reach", "talk", "connect", "get in touch"], a: "Easiest: parthkothawade2310@gmail.com — or hit ⌘K → Copy email. I'm in Pune, available for meaningful work." },
      { k: ["strength", "good at", "best", "superpower"], a: "Vision, system design, orchestration and shipping. I see what to build, design the architecture, direct AI to build it, and get it to production." },
      { k: ["weak", "improve", "growing", "learn"], a: "I'm honest about it: deepening CS fundamentals, distribution/marketing, and business English. I treat them as the next things to ship — myself included." },
      { k: ["education", "college", "degree", "study", "graduate"], a: "B.Tech in Electronics & Communication, graduated 2026. But the real curriculum was shipping products people actually use." },
      { k: ["who", "about", "yourself", "introduce"], a: "I'm Parth Kothawade — an AI product engineer from Pune. I don't prompt models; I build the systems around them and ship products that matter." }
    ];
    var DEFAULT = "Good question — I answer best on my work. Try asking about ApplySync, I Am Still Alive, the conference platform, how I decide what to build, or how fast I ship. (Or hit ⌘K.)";

    function findAnswer(q) {
      var s = (q || "").toLowerCase(), best = null, bestScore = 0;
      for (var i = 0; i < KB.length; i++) {
        var score = 0;
        for (var j = 0; j < KB[i].k.length; j++) if (s.indexOf(KB[i].k[j]) !== -1) score++;
        if (score > bestScore) { bestScore = score; best = KB[i]; }
      }
      return bestScore > 0 ? best.a : DEFAULT;
    }
    var typer = null;
    function typeOut(a) {
      if (typer) clearInterval(typer);
      if (reduce) { tA.textContent = a; return; }
      var n = 0; tA.textContent = "";
      typer = setInterval(function () {
        n += 2; tA.textContent = a.slice(0, n);
        if (n >= a.length) clearInterval(typer);
      }, 11);
    }
    /* respond(): try the REAL AI Brain (/api/ask, server-side NVIDIA key);
       fall back to the local knowledge base on file:// or any error. */
    function respond(q) {
      tQ.innerHTML = "&gt; " + String(q).replace(/</g, "&lt;");
      if (typer) clearInterval(typer);
      tA.textContent = "Thinking…";
      var local = findAnswer(q), done = false;
      var fb = setTimeout(function () { if (!done) { done = true; typeOut(local); } }, 7000);
      try {
        fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: q }) })
          .then(function (r) { return r && r.ok ? r.json() : null; })
          .then(function (d) {
            if (done) return; done = true; clearTimeout(fb);
            typeOut(d && d.answer && d.answer.trim() ? d.answer.trim() : local);
          })
          .catch(function () { if (done) return; done = true; clearTimeout(fb); typeOut(local); });
      } catch (e) { if (!done) { done = true; clearTimeout(fb); typeOut(local); } }
    }

    // smarter suggestion chips (replace the basic ones)
    var suggestions = [
      "How do you decide what to build?",
      "Do you actually write the code?",
      "Show me a hard architecture call",
      "What did you get wrong?",
      "Why should I hire you?",
      "How fast do you ship?"
    ];
    if (tChips) {
      tChips.innerHTML = "";
      suggestions.forEach(function (q) {
        var b = document.createElement("button");
        b.className = "t-chip"; b.type = "button"; b.textContent = q;
        b.addEventListener("click", function () { if (input) input.value = q; respond(q); });
        tChips.appendChild(b);
      });
    }
    if (form && input) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = input.value.trim(); if (!q) return;
        respond(q);
      });
    }
  });

  /* ============================================================
     3 · ⌘K COMMAND PALETTE
     ============================================================ */
  var SND; // forward ref to sound module
  safe(function () {
    var pal = $("#cmdk"), box = $("#cmdkIn"), list = $("#cmdkList");
    if (!pal || !box || !list) return;

    function go(id) { var el = $(id); if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
    function openCaseById(p) { var t = $('.tile[data-proj="' + p + '"]'); if (t) t.click(); }
    function copyEmail() {
      var em = "parthkothawade2310@gmail.com";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(em); return; }
      } catch (e) {}
      try { var ta = document.createElement("textarea"); ta.value = em; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); } catch (e) {}
    }

    var CMDS = [
      { t: "Go to The Work", ic: "▤", run: function () { go("#work"); } },
      { t: "Go to The Method", ic: "▤", run: function () { go("#method"); } },
      { t: "Go to About", ic: "▤", run: function () { go("#about"); } },
      { t: "Start a Project — Contact", ic: "✦", run: function () { go("#contact"); } },
      { t: "Open case · ApplySync", ic: "↗", run: function () { openCaseById("applysync"); } },
      { t: "Open case · FaceGPT", ic: "↗", run: function () { openCaseById("facegpt"); } },
      { t: "Open case · SkinGPT", ic: "↗", run: function () { openCaseById("skingpt"); } },
      { t: "Open case · I Am Still Alive", ic: "↗", run: function () { openCaseById("iasa"); } },
      { t: "Open case · Events & Conference", ic: "↗", run: function () { openCaseById("conference"); } },
      { t: "Open case · Management Portal", ic: "↗", run: function () { openCaseById("portal"); } },
      { t: "Copy email address", ic: "✉", run: copyEmail, k: "⌘C" },
      { t: "Email me", ic: "✉", run: function () { window.location.href = "mailto:parthkothawade2310@gmail.com"; } },
      { t: "Open GitHub", ic: "⌥", run: function () { window.open("https://github.com/TechieParth2310", "_blank", "noopener"); } },
      { t: "Toggle sound", ic: "♪", run: function () { if (SND) SND.toggle(); } },
      { t: "Replay the intro", ic: "↻", run: function () { window.location.reload(); } }
    ];

    var sel = 0, filtered = CMDS.slice();
    function fuzzy(q, t) {
      q = q.toLowerCase(); t = t.toLowerCase();
      if (!q) return true;
      if (t.indexOf(q) !== -1) return true;
      var qi = 0; for (var i = 0; i < t.length && qi < q.length; i++) if (t[i] === q[qi]) qi++;
      return qi === q.length;
    }
    function render() {
      list.innerHTML = "";
      if (!filtered.length) { list.innerHTML = '<div class="cmdk-empty">No matches</div>'; return; }
      filtered.forEach(function (c, i) {
        var d = document.createElement("div");
        d.className = "cmdk-item" + (i === sel ? " sel" : "");
        d.innerHTML = '<span class="ic">' + c.ic + '</span><span class="tt"></span>' + (c.k ? '<span class="k">' + c.k + '</span>' : '');
        d.querySelector(".tt").textContent = c.t;
        d.addEventListener("click", function () { run(c); });
        d.addEventListener("mousemove", function () { sel = i; paint(); });
        list.appendChild(d);
      });
    }
    function paint() { $$(".cmdk-item", list).forEach(function (el, i) { el.classList.toggle("sel", i === sel); }); }
    function filter() { var q = box.value.trim(); filtered = CMDS.filter(function (c) { return fuzzy(q, c.t); }); sel = 0; render(); }
    function open() {
      filtered = CMDS.slice(); sel = 0; box.value = ""; render();
      pal.classList.add("open"); document.body.classList.add("cmdk-open");
      setTimeout(function () { box.focus(); }, 30);
      if (SND) SND.tick(660);
    }
    function close() { pal.classList.remove("open"); document.body.classList.remove("cmdk-open"); }
    function run(c) { close(); setTimeout(function () { safe(c.run); }, 60); if (SND) SND.tick(520); }
    function isOpen() { return pal.classList.contains("open"); }

    box.addEventListener("input", filter);
    document.addEventListener("keydown", function (e) {
      var k = (e.key || "").toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "k") { e.preventDefault(); isOpen() ? close() : open(); return; }
      if (!isOpen()) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(filtered.length - 1, sel + 1); paint(); ensureVisible(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); paint(); ensureVisible(); }
      else if (e.key === "Enter") { e.preventDefault(); if (filtered[sel]) run(filtered[sel]); }
    });
    function ensureVisible() { var el = $$(".cmdk-item", list)[sel]; if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" }); }
    pal.addEventListener("click", function (e) { if (e.target === pal) close(); });
  });

  /* ============================================================
     4 · SOUND — click ticks only (no ambient, no hover)
     ============================================================ */
  safe(function () {
    var btn = $("#snd");
    var KEY = "parth-snd";
    var muted = false;
    try { muted = localStorage.getItem(KEY) === "off"; } catch (e) {}
    var ctx = null, master = null;

    function ensure() {
      if (ctx) return;
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    }
    function setBtn() { if (btn) { btn.classList.add("ready"); btn.classList.toggle("on", !muted); btn.classList.toggle("off", muted); } }

    SND = {
      toggle: function () {
        muted = !muted; try { localStorage.setItem(KEY, muted ? "off" : "on"); } catch (e) {}
        ensure(); if (ctx && ctx.resume) ctx.resume(); setBtn(); this.tick(muted ? 300 : 660);
      },
      tick: function (freq) {
        if (muted || !ctx) return;
        try {
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.type = "triangle"; o.frequency.value = freq || 540;
          g.gain.value = 0; o.connect(g); g.connect(master);
          var t = ctx.currentTime;
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05, t + 0.005);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
          o.start(t); o.stop(t + 0.14);
        } catch (e) {}
      }
    };

    // create the audio context on the first user gesture (browsers require it)
    function firstGesture() {
      ensure(); if (ctx && ctx.resume) ctx.resume(); setBtn();
      window.removeEventListener("pointerdown", firstGesture);
      window.removeEventListener("keydown", firstGesture);
    }
    window.addEventListener("pointerdown", firstGesture);
    window.addEventListener("keydown", firstGesture);
    setBtn();
    if (btn) btn.addEventListener("click", function (e) { e.stopPropagation(); SND.toggle(); });

    // click ticks only
    document.addEventListener("click", function (e) {
      if (e.target.closest("a, button, .tile, .t-chip, .cmdk-item, .sp-enter, .scrollcue")) SND && SND.tick(540);
    });
  });

  /* ============================================================
     5 · CINEMATIC SCROLL REVEALS  (visible-by-default fallback)
     ============================================================ */
  safe(function () {
    if (reduce || !("IntersectionObserver" in window)) return;
    var sels = [".band .sec-head", ".work-grid .tile", ".manifesto .man-quote",
               ".method-grid", ".about-grid", ".about-values", ".foot-top"];
    var els = [];
    sels.forEach(function (s) { $$(s).forEach(function (e) { els.push(e); }); });
    if (!els.length) return;
    // hidden state applied by JS only — if JS never runs, content stays visible
    els.forEach(function (e) {
      e.style.opacity = "0";
      e.style.transform = "translateY(28px)";
      e.style.transition = "opacity .8s ease, transform .9s cubic-bezier(.2,.7,.2,1)";
      e.style.willChange = "opacity, transform";
    });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = "1";
          en.target.style.transform = "none";
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
    // failsafe: never leave anything hidden
    setTimeout(function () { els.forEach(function (e) { e.style.opacity = "1"; e.style.transform = "none"; }); }, 9000);
  });

  /* ============================================================
     6 · CINEMATIC SCROLL-CAMERA (depth parallax)
     Background layers move slower than the scroll → depth. Elements
     opt in with data-par="<speed>" and optional data-scale="<n>".
     ============================================================ */
  safe(function () {
    if (reduce) return;
    var nodes = $$("[data-par]");
    if (!nodes.length) return;
    var items = nodes.map(function (el) {
      return { el: el, speed: parseFloat(el.getAttribute("data-par")) || 0.15, scale: parseFloat(el.getAttribute("data-scale")) || 1 };
    });
    var ticking = false;
    function apply() {
      ticking = false;
      var vh = window.innerHeight;
      for (var i = 0; i < items.length; i++) {
        var it = items[i], r = it.el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue; // skip offscreen
        var off = (r.top + r.height / 2 - vh / 2) / vh;     // -1..1 around viewport center
        var y = (off * it.speed * 100).toFixed(1);
        it.el.style.transform = "translate3d(0," + y + "px,0)" + (it.scale !== 1 ? " scale(" + it.scale + ")" : "");
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  });

})();
