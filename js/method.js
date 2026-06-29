/* Parth Kothawade — method.js
   "Ask my work" upgraded into a knowledge engine: Studio Records with a
   retrieval log, structured answers (text · code · metrics · screenshot),
   citations, related questions, and a Verify evidence drawer.
   Free-text questions hit the real /api/ask (NVIDIA) and fall back to a
   local KB. Self-contained & defensive — never breaks the page. */
(function () {
  "use strict";
  try {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var body = document.getElementById("keBody"),
        form = document.getElementById("keForm"),
        input = document.getElementById("keInput");
    if (!body) return;
    function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

    /* ---------------- Studio Records ---------------- */
    var RECORDS = [
      { n:"01", cat:"Judgment", q:"How do you decide what to build?",
        log:["loading studio records…","matching: product judgment","reading PRINCIPLES.md","ranking relevance…","answer ready."],
        a:"I start from the problem, not the model. What hurts, who feels it, and is AI actually the right tool? Most ideas die at that question — and that's the point. I only build what earns a place in production.",
        metrics:[["6","shipped"],["many","killed early"]],
        sources:["PRINCIPLES.md","ApplySync ADR-001","Production metrics"],
        related:["Show me a hard architecture call","What did you get wrong?","Do you actually write the code?"],
        evidence:[["doc","PRINCIPLES.md — what earns production"],["adr","ApplySync ADR-001"],["metric","Shipped vs killed ratio"]] },

      { n:"04", cat:"Architecture · Conference", q:"Show me a hard architecture call",
        log:["loading Conference platform…","finding decision…","reading ADR-004…","reading Architecture.md…","generating answer…"],
        a:"On the conference platform I refused to hard-wire an AI provider — every model sits behind one swappable abstraction. A little upfront design bought one-line model swaps and a codebase that didn't collapse under 35 data models.",
        code:{lang:"ts", lines:["// one swappable AI layer — not a hard dependency","interface AIProvider {","  chat(p: Prompt): Promise<Reply>;","  embed(t: string): Promise<number[]>;","}","// swap the whole brain in one line:","const ai: AIProvider = useNIM ? nim : openai;"]},
        shot:"assets/Conference%20module.png", caseId:"conference",
        metrics:[["35","data models"],["1","swappable AI layer"],["₹60L–4Cr","replaced"]],
        sources:["ADR-004 · provider abstraction","Architecture.md","iASA-Events-Module repo"],
        related:["Why one AI layer?","What did you get wrong?","How fast do you ship?"],
        evidence:[["adr","ADR-004 — provider abstraction"],["code","AIProvider interface"],["shot","Conference dashboard"],["repo","iASA-Events-Module"]] },

      { n:"07", cat:"Honesty · ApplySync", q:"What did you get wrong?",
        log:["loading ApplySync…","matching: lessons","reading POSTMORTEM.md…","answer ready."],
        a:"ApplySync. It works end to end and launched with almost no paying users. It taught me the real game isn't code — it's distribution. I'd rather learn that lesson now than at scale.",
        shot:"assets/ApplySync.png", replay:"applysync",
        metrics:[["50+","channels watched"],["~0","paying users"],["1","hard lesson"]],
        sources:["POSTMORTEM.md","ApplySync analytics"],
        related:["How do you decide what to build?","How fast do you ship?"],
        evidence:[["doc","POSTMORTEM.md"],["metric","ApplySync analytics"],["shot","ApplySync dashboard"]] },

      { n:"09", cat:"AI-native · honest", q:"Do you actually write the code?",
        log:["matching: how I work","reading WORKFLOW.md…","answer ready."],
        a:"Honestly? I'm AI-native. I design the system, make the architectural calls, and direct tools like Cursor and Claude to write the implementation — then I integrate, debug and ship. My edge is judgment and orchestration, and I deepen the fundamentals every week.",
        code:{lang:"py", lines:["# I design the contract; the model drafts the body; I review.","class JobMatcher:","    def score(self, job, profile) -> float:","        \"\"\"fit 0–1 — I choose the signals,","        AI fills the impl, I own the result.\"\"\"","        ..."]},
        sources:["WORKFLOW.md","GitHub commit history"],
        related:["Show me a hard architecture call","How fast do you ship?"],
        evidence:[["code","JobMatcher.score()"],["repo","GitHub commits"],["doc","WORKFLOW.md"]] },

      { n:"11", cat:"Speed", q:"How fast do you ship?",
        log:["matching: velocity","reading SHIPPING-LOG.md…","answer ready."],
        a:"Days, not months. I direct AI for the volume and hold the architecture, trade-offs and guardrails myself — idea to live product before most teams finish planning.",
        metrics:[["Days","not months"],["6","products live"]],
        sources:["Shipping log","App Store · Google Play"],
        related:["Do you actually write the code?","What did you get wrong?"],
        evidence:[["metric","Shipping log"],["shot","Store listings"]] },

      { n:"14", cat:"Healthcare AI", q:"Show me I Am Still Alive",
        log:["loading I Am Still Alive…","reading governance layer…","reading kill-switch policy…","answer ready."],
        a:"A Django platform for cancer patients with 14+ governed AI features over NVIDIA NIM — crisis detection, document/scan vision, moderation, case-matching — every call fail-safe, audited, with a global kill switch. The stakes rewrote how I build.",
        shot:"assets/I%20Am%20Still%20Alive%20website.png", replay:"iasa",
        metrics:[["14+","AI features"],["0","raw PHI to AI"],["Live","in production"]],
        sources:["Governance.md","Kill-switch policy","iamstillalive.com"],
        related:["Show me a hard architecture call","How do you decide what to build?"],
        evidence:[["doc","Governance.md"],["adr","Kill-switch policy"],["shot","IASA platform"]] },
    ];

    /* free-text fallback KB (when /api/ask isn't deployed) */
    var KB = [
      {k:["decide","what to build","idea","choose"],a:RECORDS[0].a},
      {k:["architect","hard","design","trade","decision","swappable"],a:RECORDS[1].a},
      {k:["wrong","mistake","fail","regret"],a:RECORDS[2].a},
      {k:["code","write","ai native","ai-native","cursor","prompt","honest"],a:RECORDS[3].a},
      {k:["fast","speed","ship","quick","days"],a:RECORDS[4].a},
      {k:["still alive","iasa","cancer","health"],a:RECORDS[5].a},
      {k:["applysync","apply","job"],a:RECORDS[2].a},
      {k:["hire","why you","stand out"],a:"Because I ship. Real products, real users, real impact — fast. I own outcomes end to end and optimise for leverage."},
      {k:["contact","email","reach","hire me"],a:"Easiest: parthkothawade2310@gmail.com — or press ⌘K → Email me. I'm in Chalisgaon, Maharashtra, available for meaningful work."}
    ];
    var DEFAULT = "I answer best on my work. Try a Studio Record, or ask about ApplySync, I Am Still Alive, the conference platform, how I decide what to build, or how fast I ship.";
    function kbAnswer(q){ var s=(q||"").toLowerCase(),best=null,sc=0; for(var i=0;i<KB.length;i++){var c=0;for(var j=0;j<KB[i].k.length;j++)if(s.indexOf(KB[i].k[j])!==-1)c++; if(c>sc){sc=c;best=KB[i];}} return sc>0?best.a:DEFAULT; }

    var EVI = { doc:"▤", adr:"◆", code:"›_", shot:"▣", repo:"⌥", metric:"▰" };
    var timers = [];
    function clearT(){ for(var i=0;i<timers.length;i++) clearTimeout(timers[i]); timers=[]; }

    /* ---------------- views ---------------- */
    function renderList(){
      clearT();
      var html = '<div class="ke-intro">Studio Records — interrogate the work</div><div class="ke-list">';
      RECORDS.forEach(function(r){
        html += '<button class="ke-rec" data-rec="'+r.n+'"><span class="ke-num">#'+r.n+'</span><span class="ke-rq">'+esc(r.q)+'</span><span class="ke-rcat">'+esc(r.cat)+'</span></button>';
      });
      html += '</div>';
      body.innerHTML = html;
    }

    function findByQ(q){ q=q.toLowerCase(); for(var i=0;i<RECORDS.length;i++) if(RECORDS[i].q.toLowerCase()===q) return RECORDS[i]; return null; }

    function openRecord(r){
      clearT();
      body.innerHTML =
        '<button class="ke-back" type="button">← records</button>'+
        '<div class="ke-rethead">Studio Record #'+r.n+' · <span>'+esc(r.cat)+'</span></div>'+
        '<div class="ke-q">&gt; '+esc(r.q)+'</div>'+
        '<div class="ke-log" id="keLog"></div>'+
        '<div class="ke-ans" id="keAns" style="display:none"></div>';
      body.scrollTop = 0;
      var logEl = document.getElementById("keLog");
      var lines = r.log || ["searching records…","ranking relevance…","answer ready."];
      typeLog(logEl, lines, function(){ renderAnswer(r); });
    }

    function typeLog(el, lines, done){
      if(reduce){ el.innerHTML = lines.map(function(l){return '<div class="kl">'+esc(l)+'</div>';}).join(''); done&&done(); return; }
      var i=0;
      (function step(){
        if(i>=lines.length){ timers.push(setTimeout(done,250)); return; }
        var d=document.createElement("div"); d.className="kl"; el.appendChild(d);
        var full=lines[i], k=0;
        var t=setInterval(function(){ k++; d.textContent=full.slice(0,k); if(k>=full.length){ clearInterval(t); d.classList.add("done"); i++; timers.push(setTimeout(step,160)); } }, 16);
        timers.push(t);
      })();
    }

    function renderAnswer(r){
      var ans = document.getElementById("keAns"); if(!ans) return;
      var h = '<div class="ke-a" id="keA"></div>';
      if(r.code){ h += '<pre class="ke-code"><span class="ke-codetag">'+esc(r.code.lang)+'</span>'+r.code.lines.map(function(l){return esc(l);}).join("\n")+'</pre>'; }
      if(r.metrics){ h += '<div class="ke-metrics">'+r.metrics.map(function(m){return '<div class="ke-metric"><b>'+esc(m[0])+'</b><span>'+esc(m[1])+'</span></div>';}).join('')+'</div>'; }
      var actions='';
      if(r.shot) actions += '<button class="ke-action" data-shot="'+r.shot+'"'+(r.caseId?' data-case="'+r.caseId+'"':'')+'>▣ screenshot</button>';
      if(r.replay) actions += '<button class="ke-action" data-replay="'+r.replay+'">▸ view build</button>';
      else if(r.caseId) actions += '<button class="ke-action" data-open="'+r.caseId+'">▸ open case</button>';
      actions += '<button class="ke-action ke-verify">✓ basis</button>';
      h += '<div class="ke-actions">'+actions+'</div>';
      if(r.sources){ h += '<div class="ke-sources"><b>Sources</b>'+r.sources.map(function(s){return '<span>✓ '+esc(s)+'</span>';}).join('')+'</div>'; }
      if(r.evidence){ h += '<div class="ke-drawer" id="keDrawer"><div class="ke-drawhd">What this answer is based on</div>'+r.evidence.map(function(e){return '<div class="ke-evi"><span class="ke-eviic">'+(EVI[e[0]]||"•")+'</span>'+esc(e[1])+'</div>';}).join('')+'</div>'; }
      if(r.related){ h += '<div class="ke-related"><b>Related</b><div class="ke-relchips">'+r.related.map(function(q){return '<button class="ke-rel" data-q="'+esc(q)+'">'+esc(q)+'</button>';}).join('')+'</div></div>'; }
      ans.innerHTML = h; ans.style.display="block";
      typeText(document.getElementById("keA"), r.a);
    }

    function typeText(el, text){
      if(!el) return;
      if(reduce){ el.textContent=text; return; }
      var n=0; el.textContent="";
      var t=setInterval(function(){ n+=2; el.textContent=text.slice(0,n); if(n>=text.length) clearInterval(t); }, 11);
      timers.push(t);
    }

    /* free-text → real AI brain (with retrieval log + KB fallback) */
    function ask(q){
      clearT();
      body.innerHTML =
        '<button class="ke-back" type="button">← records</button>'+
        '<div class="ke-rethead">Live query · <span>knowledge engine</span></div>'+
        '<div class="ke-q">&gt; '+esc(q)+'</div>'+
        '<div class="ke-log" id="keLog"></div>'+
        '<div class="ke-ans" id="keAns" style="display:none"></div>';
      body.scrollTop=0;
      var logEl=document.getElementById("keLog");
      typeLog(logEl, ["parsing query…","searching 6 project records…","ranking relevance…","querying live model…","answer ready."], function(){
        var ans=document.getElementById("keAns"); if(!ans) return;
        ans.innerHTML='<div class="ke-a" id="keA">Thinking…</div><div class="ke-sources" id="keSrc"></div><div class="ke-related"><b>Related</b><div class="ke-relchips">'+
          RECORDS.slice(0,3).map(function(r){return '<button class="ke-rel" data-q="'+esc(r.q)+'">'+esc(r.q)+'</button>';}).join('')+'</div></div>';
        ans.style.display="block";
        var local=kbAnswer(q), done=false;
        var fb=setTimeout(function(){ if(!done){done=true; finish(local,false);} }, 7000);
        function finish(text, live){ var a=document.getElementById("keA"); if(a) typeText(a, text); var sc=document.getElementById("keSrc"); if(sc) sc.innerHTML='<b>Sources</b><span>✓ '+(live?"live model · NVIDIA":"local index")+'</span><span>✓ 6 project records</span>'; }
        try{
          fetch("/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({q:q})})
            .then(function(r){return r&&r.ok?r.json():null;})
            .then(function(d){ if(done)return; done=true; clearTimeout(fb); finish(d&&d.answer&&d.answer.trim()?d.answer.trim():local, !!(d&&d.answer)); })
            .catch(function(){ if(done)return; done=true; clearTimeout(fb); finish(local,false); });
        }catch(e){ if(!done){done=true; clearTimeout(fb); finish(local,false);} }
      });
    }

    /* ---------------- events (delegated) ---------------- */
    body.addEventListener("click", function(e){
      var t=e.target;
      var rec=t.closest("[data-rec]"); if(rec){ var r=null,n=rec.getAttribute("data-rec"); for(var i=0;i<RECORDS.length;i++)if(RECORDS[i].n===n)r=RECORDS[i]; if(r) openRecord(r); return; }
      if(t.closest(".ke-back")){ renderList(); return; }
      var rel=t.closest(".ke-rel"); if(rel){ var q=rel.getAttribute("data-q"); var f=findByQ(q); if(f) openRecord(f); else { if(input) input.value=q; ask(q); } return; }
      if(t.closest(".ke-verify")){ var dr=document.getElementById("keDrawer"); if(dr) dr.classList.toggle("open"); return; }
      var rp=t.closest("[data-replay]"); if(rp){ e.stopPropagation(); if(window.__replay) window.__replay(rp.getAttribute("data-replay")); return; }
      var op=t.closest("[data-open]"); if(op){ var tile=document.querySelector('.tile[data-proj="'+op.getAttribute("data-open")+'"]'); if(tile) tile.click(); return; }
      var sh=t.closest("[data-shot]"); if(sh){ var cid=sh.getAttribute("data-case"); var tl=cid?document.querySelector('.tile[data-proj="'+cid+'"]'):null; if(tl) tl.click(); return; }
    });
    if(form && input){ form.addEventListener("submit", function(e){ e.preventDefault(); var q=input.value.trim(); if(q) ask(q); }); }

    renderList();
  } catch (e) { /* knowledge engine is optional */ }
})();
