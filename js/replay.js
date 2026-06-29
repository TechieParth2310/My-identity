/* Parth Kothawade — replay.js
   "Build Replay": a ~50s choreographed cinematic of HOW a project was built.
   A growing architecture graph + a typed build log + phase captions, with
   bug→fix→deploy→launch beats. Self-contained, vanilla, defensive.
   Exposed as window.__replay(id). Triggered by [data-replay] buttons + palette. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- storyboards ---------- */
  var STORY = {
    applysync: {
      name: "ApplySync", domain: "applysync.in", url: "https://www.applysync.in/",
      end: "Built solo, end to end. The lesson: distribution is the real game.",
      nodes: {
        ch:    { label: "50+ Telegram channels", x: 160, y: 90 },
        listen:{ label: "Listener · GramJS",      x: 160, y: 285 },
        ai:    { label: "AI · score + tailor",    x: 445, y: 285 },
        apply: { label: "Auto-apply · Gmail",     x: 730, y: 165 },
        ext:   { label: "Chrome ext · 46+ sites", x: 730, y: 405 },
        dash:  { label: "React 19 dashboard",     x: 905, y: 285 }
      },
      edges: [["ch","listen"],["listen","ai"],["ai","apply"],["ai","ext"],["apply","dash"],["ext","dash"]],
      phases: [
        { t: "The problem", a: "brass", log: ["grads fire off 100s of applications","most are never even seen"] },
        { t: "The insight", a: "brass", reveal: ["ch"], log: ["the jobs live in Telegram channels","so — watch them, and apply intelligently"] },
        { t: "Build · the listener", a: "brass", reveal: ["listen"], edges: [0], log: ["GramJS listener online","watching 50+ channels, 24/7","parsing every new post"] },
        { t: "Build · the brain", a: "brass", reveal: ["ai"], edges: [1], log: ["scoring fit for each role","tailoring the résumé to the ATS","OpenAI ⇄ NVIDIA NIM fallback"] },
        { t: "Build · the reach", a: "brass", reveal: ["apply","ext"], edges: [2,3], log: ["applying via the user's own Gmail","cold outreach queued","Chrome MV3 auto-fills 46+ sites"] },
        { t: "Build · the cockpit", a: "brass", reveal: ["dash"], edges: [4,5], log: ["React 19 dashboard","review · approve · track","Razorpay billing wired"] },
        { t: "It broke", a: "red", log: ["✗ credits drifting under load","✗ rate limits hammering the API"] },
        { t: "Fixed", a: "green", log: ["✓ real-time sync reconciled","✓ backoff + queues added"] },
        { t: "Ship it", a: "green", log: ["deploying → Vercel + Railway","✓ build passed","✓ live"] },
        { t: "Live", a: "brass", log: ["applysync.in is in production","honest: ~0 paying users at launch","→ distribution is the real game"] }
      ]
    },
    iasa: {
      name: "I Am Still Alive", domain: "iamstillalive.com", url: "https://iamstillalive.com/",
      end: "AI for people in crisis — governed, fail-safe, audited.",
      nodes: {
        msg:   { label: "Patient message",        x: 160, y: 100 },
        gate:  { label: "PHI guardrail · de-ID",  x: 160, y: 290 },
        ai:    { label: "Central AI · NVIDIA NIM", x: 445, y: 290 },
        vis:   { label: "Vision · scans + PDFs",  x: 740, y: 120 },
        crisis:{ label: "Crisis detection",       x: 740, y: 290 },
        mod:   { label: "Llama-Guard moderation", x: 740, y: 460 },
        kill:  { label: "Global kill switch",     x: 915, y: 290 }
      },
      edges: [["msg","gate"],["gate","ai"],["ai","vis"],["ai","crisis"],["ai","mod"],["ai","kill"]],
      phases: [
        { t: "The stakes", a: "brass", log: ["a platform for cancer patients","a wrong answer can cause harm"] },
        { t: "Build · the guardrail", a: "brass", reveal: ["msg","gate"], edges: [0], log: ["strip PHI before any model call","two-lane de-identification"] },
        { t: "Build · governed AI", a: "brass", reveal: ["ai"], edges: [1], log: ["one audited AI service","chat · classify · embed · moderate"] },
        { t: "Build · vision", a: "brass", reveal: ["vis"], edges: [2], log: ["read attached scans & PDFs"] },
        { t: "Build · crisis detection", a: "red", reveal: ["crisis"], edges: [3], log: ["watch every message for self-harm","→ alert a human, fast"] },
        { t: "Build · the safety net", a: "brass", reveal: ["mod"], edges: [4], log: ["Llama-Guard moderation","embeddings case-matching"] },
        { t: "The kill switch", a: "green", reveal: ["kill"], edges: [5], log: ["one switch halts all AI","0 raw PHI sent to hosted models"] },
        { t: "Ship it", a: "green", log: ["Django · Channels · Celery","✓ live in production"] },
        { t: "Live", a: "brass", log: ["iamstillalive.com","14+ governed AI features"] }
      ]
    }
  };

  /* ---------- DOM ---------- */
  var rp, svg, titleEl, logEl, barI, endEl, endH, endNote, endCta, nodeEls, edgeEls, timers = [], playing = false;

  function S(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function clearTimers() { for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]); timers = []; }

  function build() {
    if (rp) return;
    rp = document.createElement("div"); rp.className = "rp accent-brass"; rp.id = "replay";
    rp.innerHTML =
      '<div class="rp-top"><span>Build Replay — <b class="rp-name"></b></span>' +
        '<button class="rp-close" type="button" aria-label="Close">✕</button></div>' +
      '<div class="rp-stage"><div class="rp-svgwrap"></div>' +
        '<div class="rp-side"><div class="rp-title"></div><div class="rp-log"></div></div></div>' +
      '<div class="rp-bar"><i></i></div>' +
      '<div class="rp-foot"><button class="rp-btn rp-skip" type="button">Skip</button></div>' +
      '<div class="rp-end"><div class="rp-endtag">✓ shipped</div><h2></h2><p class="rp-endnote"></p><div class="rp-foot">' +
        '<a class="rp-btn primary rp-cta" target="_blank" rel="noopener">Visit site →</a>' +
        '<button class="rp-btn rp-again" type="button">Replay</button>' +
        '<button class="rp-btn rp-done" type="button">Close</button></div></div>';
    document.body.appendChild(rp);
    svg = S("svg", { viewBox: "0 0 1040 560", preserveAspectRatio: "xMidYMid meet" });
    rp.querySelector(".rp-svgwrap").appendChild(svg);
    titleEl = rp.querySelector(".rp-title"); logEl = rp.querySelector(".rp-log");
    barI = rp.querySelector(".rp-bar i"); endEl = rp.querySelector(".rp-end");
    endH = endEl.querySelector("h2"); endNote = endEl.querySelector(".rp-endnote"); endCta = endEl.querySelector(".rp-cta");
    rp.querySelector(".rp-close").addEventListener("click", close);
    rp.querySelector(".rp-skip").addEventListener("click", function () { clearTimers(); showEnd(curId); });
    rp.querySelector(".rp-again").addEventListener("click", function () { if (curId) play(curId); });
    rp.querySelector(".rp-done").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && rp.classList.contains("open")) close(); });
  }

  var curId = null;
  function renderGraph(s) {
    svg.innerHTML = ""; nodeEls = {}; edgeEls = [];
    var i, e;
    for (i = 0; i < s.edges.length; i++) {
      var a = s.nodes[s.edges[i][0]], b = s.nodes[s.edges[i][1]];
      e = S("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: "edge" });
      svg.appendChild(e); edgeEls.push(e);
    }
    for (var id in s.nodes) {
      var n = s.nodes[id];
      var w = Math.max(150, n.label.length * 8.2 + 26), h = 40;
      var g = S("g", { class: "node" });
      g.appendChild(S("rect", { x: n.x - w / 2, y: n.y - h / 2, width: w, height: h, rx: 9 }));
      var tx = S("text", { x: n.x, y: n.y + 4, "text-anchor": "middle" }); tx.textContent = n.label;
      g.appendChild(tx); svg.appendChild(g); nodeEls[id] = g;
    }
  }
  function accent(a) { rp.className = "rp open accent-" + (a || "brass"); }
  function reveal(ids) { (ids || []).forEach(function (id) { if (nodeEls[id]) nodeEls[id].classList.add("on"); }); }
  function drawEdges(idx) { (idx || []).forEach(function (i) { if (edgeEls[i]) edgeEls[i].classList.add("on"); packet(i); }); }
  function packet(i) {
    var e = edgeEls[i]; if (!e || reduce) return;
    var x1 = +e.getAttribute("x1"), y1 = +e.getAttribute("y1"), x2 = +e.getAttribute("x2"), y2 = +e.getAttribute("y2");
    var c = S("circle", { r: 4.5, cx: x1, cy: y1, class: "pkt" }); svg.appendChild(c);
    try {
      var an = c.animate([{ transform: "translate(0,0)" }, { transform: "translate(" + (x2 - x1) + "px," + (y2 - y1) + "px)" }],
        { duration: 1100, iterations: 2, easing: "linear" });
      an.onfinish = function () { if (c.parentNode) c.parentNode.removeChild(c); };
    } catch (err) { if (c.parentNode) c.parentNode.removeChild(c); }
  }
  function typeLog(lines) {
    logEl.innerHTML = "";
    (lines || []).forEach(function (t, i) {
      var d = document.createElement("div");
      d.className = "l" + (t.indexOf("✗") === 0 ? " bad" : "") + (t.indexOf("✓") === 0 ? " good" : "");
      d.style.animationDelay = (i * 0.5) + "s"; d.textContent = t; logEl.appendChild(d);
    });
  }

  function play(id) {
    var s = STORY[id]; if (!s) return;
    build(); curId = id; playing = true; clearTimers();
    rp.querySelector(".rp-name").textContent = s.name;
    endEl.classList.remove("show");
    accent("brass"); renderGraph(s); titleEl.textContent = ""; logEl.innerHTML = ""; barI.style.width = "0%";
    rp.classList.add("open");
    var idx = 0;
    function step() {
      if (idx >= s.phases.length) { showEnd(id); return; }
      var p = s.phases[idx];
      accent(p.a); titleEl.textContent = p.t;
      reveal(p.reveal); drawEdges(p.edges); typeLog(p.log);
      barI.style.width = Math.round(((idx + 1) / s.phases.length) * 100) + "%";
      var ms = reduce ? 1300 : (1500 + (p.log ? p.log.length * 950 : 0));
      timers.push(setTimeout(function () { idx++; step(); }, ms));
    }
    timers.push(setTimeout(step, reduce ? 100 : 500));
  }
  function showEnd(id) {
    var s = STORY[id]; if (!s) return;
    clearTimers();
    // reveal the full graph
    for (var k in nodeEls) nodeEls[k].classList.add("on");
    for (var i = 0; i < edgeEls.length; i++) edgeEls[i].classList.add("on");
    barI.style.width = "100%"; accent("brass");
    endH.textContent = s.name; endNote.textContent = s.end;
    endCta.href = s.url; endCta.textContent = "Visit " + s.domain + " →";
    endEl.classList.add("show");
  }
  function close() { if (!rp) return; clearTimers(); rp.classList.remove("open"); endEl.classList.remove("show"); playing = false; }

  window.__replay = play;

  /* trigger from any [data-replay] button (case studies) */
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-replay]");
    if (b) { e.preventDefault(); play(b.getAttribute("data-replay")); }
  });
})();
