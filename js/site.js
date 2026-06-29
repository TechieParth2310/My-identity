/* Parth Kothawade — site.js (progressive enhancement only; page works without it) */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer:fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };

  /* ---------------- CINEMATIC ENTRANCE / SPLASH ---------------- */
  /* The splash auto-dismisses via pure CSS even if this code fails — so the
     site is never trapped behind it. This block only enhances the entrance. */
  (function () {
    var splash = $("#splash");
    if (!splash) return;
    var spBg = $("#spBg"), spLoad = $("#spLoad"), spStatus = $("#spStatus"),
        spEnter = $("#spEnter"), spEmbers = $("#spEmbers");
    var dismissed = false, raf = null;

    /* the particle ring is the signature splash — always use it */
    var pick = 3;
    if (spBg) { var im = new Image(); im.onload = function(){ spBg.style.backgroundImage = "url('assets/splash-"+pick+".jpg')"; }; im.src = "assets/splash-"+pick+".jpg"; }

    /* ember / spark canvas */
    var ctx = (spEmbers && spEmbers.getContext) ? spEmbers.getContext("2d") : null;
    var parts = [], W2 = 0, H2 = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function sizeC(){ if(!spEmbers) return; W2 = spEmbers.clientWidth; H2 = spEmbers.clientHeight; spEmbers.width = W2*dpr; spEmbers.height = H2*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
    function mk(rand){ return { x:Math.random()*W2, y: rand ? Math.random()*H2 : H2+12, r:Math.random()*1.8+0.6, s:Math.random()*0.55+0.22, d:Math.random()*0.5-0.25, a:Math.random()*0.5+0.3, tw:Math.random()*6.28 }; }
    function seed(){ parts = []; var n = Math.max(28, Math.min(85, Math.round(W2/16))); for(var i=0;i<n;i++) parts.push(mk(true)); }
    function frame(){ if(!ctx){ return; } ctx.clearRect(0,0,W2,H2);
      for(var i=0;i<parts.length;i++){ var p=parts[i]; p.y -= p.s; p.x += p.d; p.tw += 0.05;
        if(p.y < -14){ parts[i] = mk(false); continue; }
        var fl = 0.6 + 0.4*Math.sin(p.tw); ctx.globalAlpha = p.a*fl;
        var R = p.r*4, g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,R);
        g.addColorStop(0,"rgba(255,212,150,1)"); g.addColorStop(.4,"rgba(199,146,79,.65)"); g.addColorStop(1,"rgba(199,146,79,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x,p.y,R,0,6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1; raf = requestAnimationFrame(frame);
    }
    if (ctx && !reduce) { sizeC(); seed(); frame(); window.addEventListener("resize", function(){ sizeC(); seed(); }, { passive:true }); }

    /* studio "boot" meter + status copy */
    function revealEnter(){ if(spEnter) spEnter.classList.add("show"); }
    var msgs = ["warming the lamp…","loading the work…","calibrating the studio…","ready."];
    if (!reduce && spLoad) {
      var prog = 0, lt = setInterval(function(){
        prog += Math.random()*13 + 6;
        if (prog >= 100){ prog = 100; clearInterval(lt); revealEnter(); }
        spLoad.style.width = prog + "%";
        if (spStatus) spStatus.textContent = msgs[Math.min(msgs.length-1, Math.floor(prog/26))];
      }, 240);
    } else { revealEnter(); }

    /* typed intro line + cycling tagline + cursor-follow spotlight */
    var spIntro = $("#spIntro"), spRot = $("#spRot"), spSpot = $("#spSpot");
    if (spIntro) {
      var introTxt = "you've reached the studio of";
      if (reduce) { spIntro.textContent = introTxt; }
      else {
        var ii = 0, it = setInterval(function(){
          ii++; spIntro.innerHTML = introTxt.slice(0, ii) + '<span class="cur"></span>';
          if (ii >= introTxt.length) clearInterval(it);
        }, 55);
      }
    }
    if (spRot && !reduce) {
      var phrases = ["people actually use.","ship in days, not months.","others quote ₹4Cr for.","reach the App Store.","real people rely on."];
      var pi = 0;
      setInterval(function(){
        spRot.classList.add("swap");
        setTimeout(function(){ pi = (pi + 1) % phrases.length; spRot.textContent = phrases[pi]; spRot.classList.remove("swap"); }, 360);
      }, 2300);
    }
    if (spSpot && finePointer && !reduce) {
      splash.addEventListener("mousemove", function(e){
        spSpot.style.setProperty("--mx", e.clientX + "px");
        spSpot.style.setProperty("--my", e.clientY + "px");
      }, { passive:true });
    }

    /* exit ritual — iris collapses, revealing the studio beneath */
    function dismiss(){
      if (dismissed) return; dismissed = true;
      if (raf) cancelAnimationFrame(raf);
      splash.classList.add("gone", "exit");
      try { window.scrollTo(0, 0); } catch(e){}
      if (finePointer && !reduce) document.body.classList.add("cur-on"); /* hand over to custom cursor */
      setTimeout(function(){ splash.classList.add("hide"); }, reduce ? 60 : 1120);
    }
    splash.addEventListener("click", function(){ dismiss(); });
    document.addEventListener("keydown", function(e){
      if (!dismissed && (e.key === "Enter" || e.key === " " || e.key === "Escape")) { e.preventDefault(); dismiss(); }
    });
    setTimeout(dismiss, reduce ? 3200 : 7000);   /* auto-enter after the sequence */
  })();

  /* nav state on scroll */
  var nav = $(".nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 30); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* subtle hero parallax (pre-flipped image → no scaleX) */
  var stage = $("#heroStage");
  if (!reduce && stage) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) stage.style.transform = "translateY(" + (y * 0.10) + "px) scale(1.045)";
    }, { passive: true });
  }

  /* ---- LIVE STUDIO DISPLAY on the device screen ---- */
  /* The hero image is 1344x768, object-fit:cover, object-position 50% 50%.
     The cream screen occupies this fractional rect of the image: */
  var SCR = { fx0:0.527, fy0:0.402, fx1:0.745, fy1:0.738, iw:1344, ih:768 };
  var screenEl = $("#heroScreen"), feedEl = $("#screenFeed");
  function placeScreen(){
    if(!stage || !screenEl) return;
    var W = stage.clientWidth, H = stage.clientHeight;
    if(!W || !H){ return; }                       // not laid out yet
    var sc = Math.max(W/SCR.iw, H/SCR.ih);        // object-fit:cover scale (works at any aspect)
    var rw = SCR.iw*sc, rh = SCR.ih*sc;
    var ox = (W-rw)/2, oy = (H-rh)/2;            // object-position 50% 50% (center)
    screenEl.style.left   = (ox + SCR.fx0*rw) + "px";
    screenEl.style.top    = (oy + SCR.fy0*rh) + "px";
    screenEl.style.width  = ((SCR.fx1-SCR.fx0)*rw) + "px";
    screenEl.style.height = ((SCR.fy1-SCR.fy0)*rh) + "px";
    if(feedEl) feedEl.style.fontSize = Math.max(8, rh*0.0165) + "px";
  }
  placeScreen();
  window.addEventListener("resize", placeScreen, { passive:true });

  /* Typing feed: a boot-style "now shipping" readout that loops */
  if (feedEl && screenEl) {
    var FEED = [
      ["I Am Still Alive",    "prod"],
      ["Events & Conference", "prod"],
      ["FaceGPT",             "store"],
      ["SkinGPT",             "store"],
      ["ApplySync",           "live"],
      ["Management Portal",   "daily"]
    ];
    var DOTS = function (name, val) {
      var total = 27, n = name.length + val.length;
      var d = total - n; if (d < 2) d = 2;
      return new Array(d).join("."); // d-1 dots
    };
    var head = '<div class="scr-h"><span class="d"></span>studio — shipping</div>';
    feedEl.innerHTML = head + '<div id="scrLines"></div>';
    var linesBox = $("#scrLines", feedEl);
    setTimeout(function(){ screenEl.classList.add("lit"); }, 250);

    if (reduce) {
      linesBox.innerHTML = FEED.map(function(r){
        return '<div class="scr-row"><span class="nm">&rsaquo; '+r[0]+'</span> <span class="dots">'+DOTS(r[0],r[1])+'</span> <span class="vl">'+r[1]+'</span></div>';
      }).join('');
    } else {
      var li = 0, rows = [];
      function typeRow(){
        if (li >= FEED.length){ setTimeout(resetFeed, 2600); return; }
        var nm = FEED[li][0], vl = FEED[li][1];
        var row = document.createElement("div");
        row.className = "scr-row";
        linesBox.appendChild(row); rows.push(row);
        var full = '> ' + nm, k = 0;
        var t1 = setInterval(function(){
          k++; row.innerHTML = '<span class="nm">'+full.slice(0,k).replace(/>/,'&rsaquo;')+'</span><span class="scr-cur"></span>';
          if (k >= full.length){
            clearInterval(t1);
            row.innerHTML = '<span class="nm">&rsaquo; '+nm+'</span> <span class="dots">'+DOTS(nm,vl)+'</span> <span class="vl">'+vl+'</span>';
            li++; setTimeout(typeRow, 240);
          }
        }, 34);
      }
      function resetFeed(){ linesBox.innerHTML=""; rows=[]; li=0; setTimeout(typeRow, 200); }
      setTimeout(typeRow, 650);
    }
  }

  /* live clock + studio status (Chalisgaon, Maharashtra / IST) */
  var clock = $("#clock"), fstMsg = $("#fstMsg"), fstClock = $("#fstClock"), fstDot = $("#fstDot");
  var tick = function () {
    var now = new Date(), time;
    try { time = now.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true }); }
    catch (e) { time = now.toLocaleTimeString(); }
    if (clock) clock.textContent = time + " IST";
    if (fstClock) fstClock.textContent = time + " IST";
    if (fstMsg) {
      var h; try { h = parseInt(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false }), 10); } catch (e) { h = now.getHours(); }
      var open = (h >= 9 && h < 24);
      fstMsg.textContent = open ? "Studio open — building" : "Studio resting — back at dawn";
      if (fstDot) fstDot.classList.toggle("off", !open);
    }
  };
  if (clock || fstMsg) { tick(); setInterval(tick, 20000); }

  /* Ask-my-work terminal */
  var qa = [
    { q: "how do you decide what to build?", a: "I start from the problem, not the model. What hurts, who feels it, and is AI actually the right tool? Most ideas die here — and that's the point. I only build what earns a place in production." },
    { q: "show me a hard architecture call", a: "On the conference platform I refused to hard-wire an AI provider — everything sits behind one swappable abstraction. A little upfront design bought one-line model swaps and a codebase that didn't collapse under 35 models." },
    { q: "what did you get wrong?", a: "ApplySync. It works end to end and launched with almost no paying users. It taught me the real game isn't code — it's distribution. I'd rather learn that now than at scale." },
    { q: "how fast do you ship?", a: "Days, not months. I direct AI for the volume and hold the architecture, trade-offs and guardrails myself. Idea to live product before most teams finish planning." }
  ];
  var chips = $("#tChips"), tA = $("#tA"), tQ = $("#tQ"), timer = null;
  if (chips && tA && tQ) {
    qa.forEach(function (item) {
      var c = document.createElement("button");
      c.className = "t-chip"; c.textContent = item.q;
      c.addEventListener("click", function () {
        tQ.innerHTML = "&gt; " + item.q.replace(/</g, "&lt;");
        clearInterval(timer);
        if (reduce) { tA.textContent = item.a; return; }
        tA.textContent = "Thinking…";
        setTimeout(function () {
          var s = item.a, n = 0; tA.textContent = "";
          timer = setInterval(function () { n += 2; tA.textContent = s.slice(0, n); if (n >= s.length) clearInterval(timer); }, 12);
        }, 300);
      });
      chips.appendChild(c);
    });
  }

  /* ---------------- CASE STUDY DRAWER ---------------- */
  function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  var DET = {
    applysync:{ cat:"01 · AI Job Automation · My startup", title:"ApplySync",
      tag:"I automated job-hunting end to end — then learned why products really fail.",
      facts:{Role:"Sole founder & builder",Year:"2026",Status:"Live"},
      overview:"My own product: an AI system that turns job-hunting into one decision. It watches where Indian grads actually live — Telegram job channels — understands each posting, tailors the résumé to that role, and applies on your behalf, around the clock.",
      build:["A 24/7 listener (GramJS) monitoring 50+ Telegram job channels, parsing every new posting.","An AI layer (OpenAI with an NVIDIA NIM fallback) that scores fit and rewrites the résumé per ATS.","Auto-apply + outreach that sends applications and cold emails through the user's own Gmail.","A React 19 dashboard to review, approve and track every application.","A Chrome (Manifest V3) extension that auto-fills application forms across 46+ sites.","Razorpay billing, scheduled jobs via node-cron, deployed on Vercel + Railway."],
      arch:["Telegram listener","AI fit + tailoring","Auto-apply + Gmail","React 19 dashboard","Chrome extension"],
      metrics:[["50+","job channels watched"],["46+","sites auto-filled"],["Solo","built end to end"],["3","sister tools shipped"]],
      stack:["React 19","Vite","Tailwind","Express","TypeScript","Firebase","OpenAI","NVIDIA NIM","GramJS","Razorpay","Gmail API","Chrome MV3"] },
    facegpt:{ cat:"02 · AI Reverse Image Search · Google Play", title:"FaceGPT",
      tag:"Point a photo at the internet and get an answer — not a list of links.",
      facts:{Role:"Mobile engineer",Year:"2026",Status:"Live on Google Play"},
      overview:"An AI reverse-image-search app shipped to Google Play. Beyond search, it ships a full commercial layer — a credit and subscription system that has to stay perfectly in sync between app and backend.",
      build:["A 20+ screen Flutter app with authentication, image-upload workflows and asynchronous search.","A backend-driven credit & subscription engine with daily, weekly and monthly billing cycles and accurate usage gating.","Real-time frontend↔backend sync so credits never drift.","A modular Firebase + REST architecture that reduced data-sync latency by ~25%."],
      arch:["Flutter app (20+ screens)","Auth + image upload","Async search","Credit/subscription engine","Firebase + REST"],
      metrics:[["20+","screens"],["~25%","lower sync latency"],["D/W/M","billing cycles"],["Live","on Google Play"]],
      stack:["Flutter","Firebase","REST APIs","In-App Purchases"],
      link:{url:"https://play.google.com/store/apps/details?id=com.humanityfounder.facegpt&hl=en_IN",label:"Open on Google Play"} },
    skingpt:{ cat:"03 · AI Personal Style · App Store", title:"SkinGPT",
      tag:"Where AI meets personal style — your colours, your wardrobe.",
      facts:{Role:"Mobile engineer",Year:"2026",Status:"Live on App Store"},
      overview:"A cross-platform mobile app shipped to the App Store: upload a selfie and get personalised outfit and colour recommendations from intelligent skin-tone analysis.",
      build:["A Flutter app with selfie capture/upload and a personalised results flow.","Skin-tone analysis that drives outfit and colour recommendations, plus a wardrobe view.","Secure authentication with Firebase — email/password, Google and Apple sign-in.","A Dio-based API layer for analysis requests, error handling and result parsing."],
      arch:["Flutter app","Selfie capture","Skin-tone analysis","Firebase auth","Dio API layer"],
      metrics:[["3","auth providers"],["iOS","on the App Store"],["Flutter","cross-platform"],["Personalised","colour + wardrobe"]],
      stack:["Flutter","Dart","Firebase Auth","Dio"] },
    iasa:{ cat:"04 · Healthcare AI Platform · Production", title:"I Am Still Alive",
      tag:"AI for people in crisis. The stakes rewrote how I build.",
      facts:{Role:"AI & platform engineer",Year:"2026",Status:"Production"},
      overview:"A support platform for cancer patients (“Cancer Warriors”) and the doctors who help them, built on Django. Its heart is a Virtual Tumor Board — and a governed AI layer where a wrong answer could mean harm, so every feature is key-gated, fail-safe and audited.",
      build:["A central AI service over NVIDIA NIM — one place for chat, classify, embed, moderate and de-identify; every call fail-safe and audited.","An “Ask Stork” assistant agent, thread summarization and one-click draft question/answer generators.","Vision models that read patient-attached PDFs, documents and scans.","Crisis / self-harm detection on patient messages, with moderator alerts and resources.","Llama-Guard content moderation and embeddings-based matching to similar past cases.","A two-lane PHI guardrail + de-identification, daily call budgets, per-user rate limits and a global kill switch."],
      arch:["Django + Channels + Celery","Central governed AI layer","Vision · Crisis · Moderation","Embeddings case-matching","PHI guardrail + kill switch"],
      metrics:[["14+","governed AI features"],["0","raw PHI sent to hosted AI"],["Real-time","WebSocket chat"],["Live","iamstillalive.com"]],
      stack:["Django 5","Channels","Celery","PostgreSQL","NVIDIA NIM","Embeddings","AWS S3","FCM"],
      link:{url:"https://iamstillalive.com",label:"Visit iamstillalive.com"} },
    conference:{ cat:"05 · Events Platform · Enterprise", title:"Conference & Events Platform",
      tag:"Vendors quoted ₹60L–4Cr. I built it in-house instead.",
      facts:{Role:"Sole builder",Year:"2026",Status:"Production"},
      overview:"A complete conference & events platform built on Next.js — registration, ticketing, live video, payments and AI — in one owned codebase of ~18,000 lines and 35 data models.",
      build:["A 4-step event wizard that publishes branded public event pages.","Ticketing with paid tickets (Stripe), capacity limits and automatic waitlists.","Live keynote rooms (LiveKit) with camera preview and database-backed Q&A with upvoting.","Organizer dashboards with live KPIs, registrations and revenue.","An AI layer — copilot, attendee matchmaker (embeddings) and semantic library search — behind one swappable abstraction."],
      arch:["Next.js 15 + Prisma (35 models)","LiveKit rooms + Q&A","Stripe + waitlist","AI copilot · matchmaker · search","S3 + Resend + Auth"],
      metrics:[["₹60L–4Cr","vendor cost replaced"],["18,000+","lines, shipped solo"],["35","data models"],["1","swappable AI layer"]],
      stack:["Next.js 15","React 19","Prisma","LiveKit","Stripe","AWS S3","Resend","zod"] },
    portal:{ cat:"06 · Operations Platform · In daily use", title:"Management Portal",
      tag:"The real proof isn't that I built it — the team opens it every day.",
      facts:{Role:"Sole builder",Year:"2026",Status:"Live · daily use"},
      overview:"An all-in-one employee & operations portal for the company — a real internal OS spanning HR, finance, hiring and operations — with Microsoft single sign-on and role-based access. Built on Next.js and used daily by the whole team.",
      build:["Workspace: dashboard, attendance, tasks, leave, expenses, goals & OKRs, projects & timesheets, performance reviews and reports.","People: directory, org chart, team calendar, announcements, documents and policies.","Hiring: a recruitment ATS pipeline with onboarding and offboarding.","Operations & growth: asset management, help desk, learning & development, surveys / eNPS.","Finance: payroll & compensation.","Platform: Microsoft (Azure AD) SSO, role-based access, global search and in-app notifications."],
      arch:["Next.js 14 + Prisma","PostgreSQL (Supabase)","Microsoft Azure AD SSO","Microsoft Graph email","Cloudflare R2"],
      metrics:[["20+","modules"],["Daily","used by the whole team"],["SSO","Microsoft Azure AD"],["Role-based","access control"]],
      stack:["Next.js 14","TypeScript","Prisma","Supabase","NextAuth","Azure AD","Microsoft Graph","Cloudflare R2"] }
  };

  var META = {
    applysync:{ type:"site", img:"assets/ApplySync.png", domain:"applysync.in", live:{url:"https://www.applysync.in/",label:"Visit applysync.in"} },
    facegpt:{ type:"app", img:"assets/FaceGPT.png", live:{url:"https://play.google.com/store/apps/details?id=com.humanityfounder.facegpt&hl=en_IN",label:"Open on Google Play"} },
    skingpt:{ type:"app", img:"assets/SkinGPT.png", live:{url:"https://apps.apple.com/us/app/skingpt-ai/id6760752935",label:"Open on the App Store"} },
    iasa:{ type:"site", img:"assets/I%20Am%20Still%20Alive%20website.png", domain:"iamstillalive.com", live:{url:"https://iamstillalive.com/",label:"Visit iamstillalive.com"} },
    conference:{ type:"site", img:"assets/Conference%20module.png", domain:"iasa-events-module.vercel.app", live:{url:"https://i-asa-events-module-ylys.vercel.app/",label:"Open the live demo"} },
    portal:{ type:"site", img:"assets/Management%20portal.png", domain:"portal.iamstillalive.com", live:{url:"https://portal.iamstillalive.com/",label:"Visit the portal"} }
  };

  /* per-project journey (idea → … → live) for the case-study timeline */
  var JOURNEY = {
    applysync:[["Idea","Job-hunting is spray & pray"],["Research","Jobs live in Telegram channels"],["Prototype","A listener that parses every post"],["Launch day","Expected 100 users. Got 0."],["The lesson","Code wasn't the gap — distribution was"],["Live","applysync.in, in production"]],
    facegpt:[["Brief","Reverse image search, mobile-first"],["Build","20+ Flutter screens"],["Billing","Credit & subscription engine"],["Tune","~25% lower sync latency"],["Ship","Live on Google Play"]],
    skingpt:[["Idea","AI meets personal style"],["Build","Selfie → colour analysis"],["Auth","Firebase: email/Google/Apple"],["Ship","Live on the App Store"]],
    iasa:[["Mission","Support cancer patients"],["Guardrail","PHI-safe AI layer first"],["Build","14+ governed AI features"],["Harden","Crisis detection + kill switch"],["Live","iamstillalive.com"]],
    conference:[["Quote","Vendors: ₹60L–4Cr"],["Decision","Build it in-house"],["Build","18k lines · 35 models"],["AI","Copilot + matchmaker"],["Live","In production"]],
    portal:[["Need","No internal OS existed"],["Build","20+ modules"],["SSO","Microsoft Azure AD"],["Adopt","Whole team, daily"],["Live","portal.iamstillalive.com"]]
  };

  /* "living product" overlay copy — makes each real screenshot feel like a running product */
  var LIVE = {
    applysync:{ t1:"Applied · Software Engineer", t2:"3 new role matches", chip:"applying · 24/7" },
    facegpt:{   t1:"match found · 97%",          t2:"search complete",     chip:"live · Google Play" },
    skingpt:{   t1:"palette ready",              t2:"3 outfits suggested", chip:"live · App Store" },
    iasa:{      t1:"crisis check · clear",       t2:"similar case matched", chip:"governed · live" },
    conference:{t1:"ticket sold · ₹2,400",       t2:"keynote starting",    chip:"live · 312 registered" },
    portal:{    t1:"leave request approved",     t2:"payroll run complete", chip:"team online · 7" }
  };

  /* hover-detail for each architecture node (interactive architecture) */
  var ARCHX = {
    applysync:{ "Telegram listener":"GramJS · watches 50+ channels · parses every post · 24/7",
      "AI fit + tailoring":"OpenAI ⇄ NVIDIA NIM fallback · scores fit · rewrites résumé per ATS",
      "Auto-apply + Gmail":"sends via the user's own Gmail · queued · rate-limited",
      "React 19 dashboard":"review · approve · track · Razorpay billing",
      "Chrome extension":"Manifest V3 · auto-fills 46+ application sites" },
    iasa:{ "Django + Channels + Celery":"WebSocket chat · async tasks · real-time",
      "Central governed AI layer":"one audited service · chat · classify · embed · moderate",
      "Vision · Crisis · Moderation":"reads scans/PDFs · self-harm detection · Llama-Guard",
      "Embeddings case-matching":"finds similar past cases by meaning",
      "PHI guardrail + kill switch":"de-identify before any model · global kill switch · 0 raw PHI" },
    conference:{ "Next.js 15 + Prisma (35 models)":"one owned codebase · ~18,000 lines",
      "LiveKit rooms + Q&A":"camera preview · DB-backed Q&A with upvoting",
      "Stripe + waitlist":"paid tickets · capacity caps · auto waitlists",
      "AI copilot · matchmaker · search":"embeddings matchmaker · semantic library search",
      "S3 + Resend + Auth":"assets · transactional email · sessions" },
    portal:{ "Next.js 14 + Prisma":"20+ modules · one internal OS",
      "PostgreSQL (Supabase)":"managed Postgres · row-level access",
      "Microsoft Azure AD SSO":"one-click company login · no extra password",
      "Microsoft Graph email":"system mail via the org's own tenant",
      "Cloudflare R2":"object storage for docs & assets" },
    facegpt:{ "Flutter app (20+ screens)":"auth · image upload · async search",
      "Credit/subscription engine":"daily/weekly/monthly cycles · usage gating",
      "Firebase + REST":"~25% lower data-sync latency" },
    skingpt:{ "Skin-tone analysis":"drives colour + outfit recommendations",
      "Firebase auth":"email · Google · Apple sign-in",
      "Dio API layer":"analysis requests · error handling · parsing" }
  };

  /* developer commentary — the "why" behind decisions */
  var WHY = {
    applysync:[["Why Telegram, not job boards?","Indian grads live in Telegram job channels — that's where the supply actually is."],["Why a human in the loop?","Auto-applying blindly burns your reputation. A review step protects quality and trust."]],
    iasa:[["Why de-identify before the model?","A wrong answer here can harm. Stripping PHI before any AI call makes the whole system fail-safe."],["Why a global kill switch?","If the AI misbehaves, one switch halts every feature instantly — safety over uptime."]],
    conference:[["Why build it in-house?","Vendor quotes hit ₹60L–4Cr. Owning the codebase was cheaper and infinitely more flexible."],["Why one swappable AI layer?","35 models behind one interface meant one-line provider swaps, not a rewrite."]],
    portal:[["Why Azure AD SSO?","The team already lived in Microsoft — SSO removed a login wall and a security risk."]],
    facegpt:[["Why a credit engine on day one?","A search product needs metering from the start — billing can't be bolted on later."]],
    skingpt:[["Why an async result flow?","Selfie → result should feel instant; the heavy work happens behind a clean flow."]]
  };
  var drawer=$("#drawer"), drScrim=$("#drScrim"), drBody=$("#drBody"), drClose=$("#drClose"), lastFocus=null;
  function openCase(id){
    var d=DET[id], m=META[id]||{}; if(!d||!drawer) return;
    var facts=Object.keys(d.facts).map(function(k){return '<div class="cs-fact"><span>'+esc(k)+'</span><b>'+esc(d.facts[k])+'</b></div>';}).join('');
    var ax=ARCHX[id]||{};
    var arch=d.arch.map(function(n,i){var dl=(i*0.35).toFixed(2);var tip=ax[n]?'<span class="node-tip">'+esc(ax[n])+'</span>':'';return '<span class="node'+(ax[n]?' has-tip':'')+'" style="animation-delay:'+dl+'s">'+esc(n)+tip+'</span>'+(i<d.arch.length-1?'<span class="ar" style="animation-delay:'+(i*0.35+0.17).toFixed(2)+'s">→</span>':'');}).join('');
    var why=(WHY[id]||[]).map(function(w,i){return '<details class="cs-why"'+(i===0?' open':'')+'><summary>'+esc(w[0])+'</summary><p>'+esc(w[1])+'</p></details>';}).join('');
    var whyBlock = why ? '<div class="cs-sec"><div class="l">Decisions — the “why”</div>'+why+'</div>' : '';
    var metrics=d.metrics.map(function(x){return '<div class="cs-metric"><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></div>';}).join('');
    var top='<div class="cs-top"><div class="cs-cat">'+esc(d.cat)+'</div><h2 class="cs-title" id="drTitle">'+esc(d.title)+'</h2>'+
      '<div class="cs-tag">“'+esc(d.tag)+'”</div><div class="cs-facts">'+facts+'</div>'+
      (m.live?'<a class="cs-cta" href="'+m.live.url+'" target="_blank" rel="noopener">'+esc(m.live.label)+' →</a>':'')+
      ((id==='applysync'||id==='iasa')?'<button class="cs-replay" type="button" data-replay="'+id+'">▶ Watch how it was built</button>':'')+'</div>';
    var show='', lv=LIVE[id];
    if(m.img && m.type==='app'){
      show='<div class="cs-show app"><div class="frame phone-lg"><span class="pn"></span><span class="fr-live">● live</span><span class="fr-sheen"></span><img src="'+m.img+'" alt="'+esc(d.title)+'">'+(lv?'<div class="lv lv-app"><div class="lv-chip">'+esc(lv.chip)+'</div></div>':'')+'</div></div>';
    } else if(m.img){
      show='<div class="cs-show"><div class="frame browser"><div class="fr-bar"><i></i><i></i><i></i><span class="fr-url">'+esc(m.domain||'')+'</span></div><div class="fr-shot"><img src="'+m.img+'" alt="'+esc(d.title)+'"><span class="fr-sheen"></span><span class="fr-live">● live</span>'+(lv?'<div class="lv"><div class="lv-toast lv-t1">'+esc(lv.t1)+'</div><div class="lv-toast lv-t2">'+esc(lv.t2)+'</div><div class="lv-chip">'+esc(lv.chip)+'</div></div>':'')+'</div></div></div>';
    }
    var left='<div><div class="cs-sec"><div class="l">Overview</div><p class="cs-lead">'+esc(d.overview)+'</p></div>'+
      '<div class="cs-sec"><div class="l">What I built</div><ul class="cs-list">'+
      d.build.map(function(b,i){return '<li><span class="n">'+(i+1<10?'0':'')+(i+1)+'</span><span>'+esc(b)+'</span></li>';}).join('')+'</ul></div></div>';
    var right='<div><div class="cs-sec"><div class="l">Architecture</div><div class="cs-arch">'+arch+'</div></div>'+
      '<div class="cs-sec"><div class="l">Impact</div><div class="cs-metrics">'+metrics+'</div></div>'+
      '<div class="cs-sec"><div class="l">Stack</div><div class="cs-stack">'+d.stack.map(function(s){return '<span>'+esc(s)+'</span>';}).join('')+'</div></div>'+whyBlock+'</div>';
    var jr=(JOURNEY[id]||[]).map(function(s,i){return '<div class="ct-step" style="animation-delay:'+(i*0.1).toFixed(2)+'s"><span class="ct-dot"></span><b>'+esc(s[0])+'</b><span>'+esc(s[1])+'</span></div>';}).join('');
    var timeBlock = jr ? '<div class="cs-journey"><div class="l">The journey</div><div class="ct-row">'+jr+'</div></div>' : '';
    drBody.innerHTML = top + show + '<div class="cs-grid">'+left+right+'</div>' + timeBlock;
    lastFocus=document.activeElement;
    drawer.classList.add("open"); requestAnimationFrame(function(){drawer.classList.add("show");});
    document.body.style.overflow="hidden"; drBody.scrollTop=0; if(drClose)drClose.focus();
  }
  function closeCase(){ drawer.classList.remove("show"); document.body.style.overflow=""; setTimeout(function(){drawer.classList.remove("open");},reduce?0:520); if(lastFocus)lastFocus.focus(); }
  window.__closeCase = function(){ if(drawer && drawer.classList.contains("open")) closeCase(); };
  Array.prototype.forEach.call(document.querySelectorAll(".tile[data-proj]"),function(c){ c.addEventListener("click",function(){ openCase(c.getAttribute("data-proj")); }); });
  Array.prototype.forEach.call(document.querySelectorAll(".ms-cta[data-open]"),function(b){ b.addEventListener("click",function(){ openCase(b.getAttribute("data-open")); }); });
  if(drScrim) drScrim.addEventListener("click",closeCase);
  if(drClose) drClose.addEventListener("click",closeCase);
  document.addEventListener("keydown",function(e){ if(e.key==="Escape"&&drawer&&drawer.classList.contains("open")) closeCase(); });

  /* ---------------- SCROLL-PROGRESS BAR ---------------- */
  var prog = $("#progress");
  if (prog) {
    var setProg = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) : 0;
      prog.style.width = (p * 100).toFixed(2) + "%";
    };
    setProg(); window.addEventListener("scroll", setProg, { passive: true });
    window.addEventListener("resize", setProg, { passive: true });
  }

  /* ---------------- CUSTOM MAGNETIC CURSOR (fine pointers) ---------------- */
  var dot = $("#curDot"), ring = $("#curRing");
  if (finePointer && !reduce && dot && ring) {
    if (!$("#splash")) document.body.classList.add("cur-on"); /* else splash hands over on entry */
    var mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my, magnet = null, curRun = false, lastMove = 0;
    function kick(){ lastMove = Date.now(); if (!curRun) { curRun = true; loop(); } }
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
      kick();
    }, { passive: true });
    var HOT = "a, button, .tile, .t-chip, .cs-cta, .scrollcue, .kbd-chip, .help-item, h1, h2";
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest(HOT);
      if (t) { ring.classList.add("hot"); magnet = t; kick(); }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(HOT)) { ring.classList.remove("hot"); magnet = null; }
    });
    document.addEventListener("mouseleave", function () { dot.classList.add("hide"); ring.classList.add("hide"); });
    document.addEventListener("mouseenter", function () { dot.classList.remove("hide"); ring.classList.remove("hide"); });
    function loop(){
      var tx = mx, ty = my;
      if (magnet) {                                  // gently magnetize toward the target's centre
        var r = magnet.getBoundingClientRect();
        var cx = r.left + r.width/2, cy = r.top + r.height/2;
        var bias = (r.width > 320) ? 0.16 : 0.42;    // softer pull for big headings
        tx = mx + (cx - mx) * bias; ty = my + (cy - my) * bias;
      }
      rx += (tx - rx) * 0.3; ry += (ty - ry) * 0.3;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      if (Date.now() - lastMove > 700 && !magnet && Math.abs(tx - rx) < 0.5 && Math.abs(ty - ry) < 0.5) { curRun = false; return; }  // idle-pause
      requestAnimationFrame(loop);
    }
    kick();

    /* physical magnetic pull on key buttons (not tiles/headings — they have their own transforms) */
    Array.prototype.forEach.call(document.querySelectorAll(".cta, .kbd-chip, .sp-enter, .t-actbtn"), function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height/2);
        el.style.transform = "translate(" + (dx*0.22) + "px," + (dy*0.30) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }
})();
