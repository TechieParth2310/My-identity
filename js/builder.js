/* Parth Kothawade — builder.js
   Builder Mode: a Studio ⇄ Builder toggle that flips the site into an
   engineering dossier — repo tree, architecture, schema, API, ADRs,
   benchmarks, live activity. Self-contained & defensive.
   Exposes window.__builder. Architecture buttons reuse window.__replay. */
(function () {
  "use strict";
  try {
    var toggle = document.getElementById("modeToggle");
    var USER = "TechieParth2310";

    var ov = document.createElement("div"); ov.className = "bld"; ov.id = "buildermode";
    var TABS = [["overview","Overview"],["repo","Repository"],["arch","Architecture"],["schema","Schema"],["api","API"],["adr","ADRs"],["bench","Benchmarks"],["activity","Activity"]];
    ov.innerHTML =
      '<div class="bld-top"><span class="bld-title">BUILDER MODE — <b>the engineering behind the studio</b></span>' +
        '<button class="bld-close" type="button" aria-label="Exit Builder Mode">✕ Studio</button></div>' +
      '<div class="bld-tabs">' + TABS.map(function(t,i){return '<button class="bld-tab'+(i===0?' on':'')+'" data-tab="'+t[0]+'">'+t[1]+'</button>';}).join('') + '</div>' +
      '<div class="bld-content" id="bldContent"></div>';
    document.body.appendChild(ov);
    var content = ov.querySelector("#bldContent");

    var C = {
      overview:
        '<p class="bld-lead">Everything here is the real shape of the work — not claims, evidence. Switch back to Studio any time.</p>' +
        '<div class="bld-stats">' +
          stat("6","products shipped") + stat("~18k","lines · 1 platform") + stat("35","data models") +
          stat("14+","governed AI features") + stat("₹60L–4Cr","vendor cost replaced") + stat("~25%","lower sync latency") +
        '</div>',
      repo:
        '<div class="bld-h">this portfolio · live source</div>' +
        '<pre class="bld-tree">MY Identity/\n├── index.html\n├── api/\n│   └── ask.js            <span class="c">// serverless AI brain — NVIDIA key stays server-side</span>\n├── css/\n│   └── site.css\n├── js/\n│   ├── site.js           <span class="c">// splash · hero feed · case studies · cursor</span>\n│   ├── next.js           <span class="c">// WebGL · ⌘K · sound · reveals</span>\n│   ├── method.js         <span class="c">// the knowledge engine</span>\n│   ├── replay.js         <span class="c">// build-replay engine</span>\n│   ├── atmos · rooms · devmode · eggs · hints · builder.js\n│   └── metrics.js · buildmode.js\n├── assets/               <span class="c">// AI-generated plates + real screenshots</span>\n└── DEPLOY.md</pre>' +
        '<div class="bld-note">Vanilla HTML/CSS/JS — no framework, no build step. ~11 isolated modules, each fail-safe.</div>',
      arch:
        '<div class="bld-h">systems — watch them assemble</div>' +
        '<div class="bld-archrow">' +
          '<button class="bld-arch" data-replay="applysync"><b>ApplySync</b><span>Telegram → AI fit → auto-apply → dashboard</span><i>▸ replay build</i></button>' +
          '<button class="bld-arch" data-replay="iasa"><b>I Am Still Alive</b><span>governed AI · vision · crisis · kill-switch</span><i>▸ replay build</i></button>' +
        '</div>' +
        '<div class="bld-note">Every model sits behind one swappable interface — provider swaps are one line, not a rewrite.</div>',
      schema:
        '<div class="bld-h">data models · representative</div>' +
        '<pre class="bld-tree"><span class="k">model</span> Event       { id, slug, title, startsAt, capacity, … }\n<span class="k">model</span> Ticket      { id, event→Event, tier, price, status }\n<span class="k">model</span> Session     { id, event→Event, room→Room, qa[] }\n<span class="k">model</span> Registration{ id, user→User, event, ticket }\n<span class="c">// … 35 models total · Conference platform (Prisma)</span>\n\n<span class="k">model</span> Patient     { id, code, threads[] }          <span class="c">// IASA</span>\n<span class="k">model</span> AILog       { id, kind, deidentified, audited }  <span class="c">// every call logged</span></pre>',
      api:
        '<div class="bld-h">endpoints</div>' +
        '<pre class="bld-tree"><span class="m">POST</span> /api/ask           <span class="c">// this site · NVIDIA Llama, key server-side</span>\n\n<span class="c">— ApplySync —</span>\n<span class="m">GET</span>  /matches           <span class="c">// scored job matches</span>\n<span class="m">POST</span> /apply             <span class="c">// auto-apply via the user\'s Gmail</span>\n\n<span class="c">— Conference —</span>\n<span class="m">POST</span> /events  ·  <span class="m">GET</span> /events/:slug\n<span class="m">POST</span> /tickets/:id/buy   <span class="c">// Stripe</span>\n<span class="m">WS</span>   /rooms/:id         <span class="c">// LiveKit + Q&amp;A</span>\n\n<span class="c">— I Am Still Alive —</span>\n<span class="m">POST</span> /ai/chat · /ai/moderate · /ai/vision  <span class="c">// governed, audited</span></pre>',
      adr:
        '<div class="bld-h">architecture decision records</div>' +
        adr("ADR-001","Problem-first","Build only what earns a place in production. Most ideas die at 'is AI even the right tool?'") +
        adr("ADR-004","One swappable AI provider","Every model behind a single interface → one-line provider swaps under 35 data models.") +
        adr("ADR-007","De-identify before the model","Strip PHI before any AI call so the whole IASA system is fail-safe; global kill switch.") +
        adr("ADR-009","Firebase over Postgres","For ApplySync, Firebase cut deploy from ~3 days to ~6 hours. Postgres would've doubled complexity."),
      bench:
        '<div class="bld-h">benchmarks &amp; numbers</div>' +
        '<table class="bld-table"><tbody>' +
          row("data-sync latency","↓ ~25%") + row("conference codebase","~18,000 lines · 35 models") +
          row("governed AI features (IASA)","14+ · 0 raw PHI to hosted AI") + row("vendor cost replaced","₹60L–4Cr") +
          row("deploy time (ApplySync)","3 days → 6 hours") + row("products in production","6") +
        '</tbody></table>',
      activity:
        '<div class="bld-h">live activity · github.com/' + USER + '</div><div id="bldGit" class="bld-tree">connecting to GitHub…</div>'
    };
    function stat(v,l){ return '<div class="bld-stat"><b>'+v+'</b><span>'+l+'</span></div>'; }
    function adr(id,t,d){ return '<div class="bld-adr"><span class="bld-adrid">'+id+'</span><b>'+t+'</b><p>'+d+'</p></div>'; }
    function row(a,b){ return '<tr><td>'+a+'</td><td>'+b+'</td></tr>'; }

    function render(tab){
      ov.querySelectorAll(".bld-tab").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-tab")===tab); });
      content.innerHTML = C[tab] || "";
      content.scrollTop = 0;
      if (tab === "activity") loadGit();
    }
    function loadGit(){
      var box = document.getElementById("bldGit"); if(!box) return;
      var ctrl = ("AbortController" in window) ? new AbortController() : null;
      var to = ctrl ? setTimeout(function(){ctrl.abort();}, 6000) : null;
      fetch("https://api.github.com/users/"+USER+"/repos?sort=pushed&per_page=10", ctrl?{signal:ctrl.signal}:undefined)
        .then(function(r){ return r.ok?r.json():null; })
        .then(function(repos){ if(to)clearTimeout(to);
          if(!repos||!repos.length){ box.textContent="GitHub unavailable — github.com/"+USER; return; }
          box.innerHTML = repos.map(function(rp){ return '$ git log '+rp.name+'  <span class="c">// '+(rp.language||"·")+' · '+ago(rp.pushed_at)+'</span>'; }).join("\n");
        })
        .catch(function(){ if(to)clearTimeout(to); box.textContent="GitHub unavailable — github.com/"+USER; });
    }
    function ago(iso){ if(!iso)return""; var s=(Date.now()-new Date(iso).getTime())/1000; if(s<3600)return Math.max(1,Math.round(s/60))+"m ago"; if(s<86400)return Math.round(s/3600)+"h ago"; return Math.round(s/86400)+"d ago"; }

    function open(){ ov.classList.add("open"); document.body.classList.add("builder"); if(toggle){toggle.classList.add("on");toggle.setAttribute("aria-checked","true");} render("overview"); }
    function close(){ ov.classList.remove("open"); document.body.classList.remove("builder"); if(toggle){toggle.classList.remove("on");toggle.setAttribute("aria-checked","false");} }
    function isOpen(){ return ov.classList.contains("open"); }
    window.__builder = { open:open, close:close, toggle:function(){ isOpen()?close():open(); } };

    if(toggle) toggle.addEventListener("click", function(){ isOpen()?close():open(); });
    ov.querySelector(".bld-close").addEventListener("click", close);
    ov.querySelector(".bld-tabs").addEventListener("click", function(e){ var t=e.target.closest(".bld-tab"); if(t) render(t.getAttribute("data-tab")); });
    document.addEventListener("keydown", function(e){ if(e.key==="Escape"&&isOpen()) close(); });
  } catch (e) { /* builder mode is optional */ }
})();
