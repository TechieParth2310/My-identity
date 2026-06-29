# Parth Kothawade — Portfolio ("The Studio") · Complete Build Report

> A full, no-detail-spared technical and creative report of the personal portfolio website built in the `MY Identity` folder. Written to be handed to another AI (e.g. ChatGPT) as complete context. Current as of the latest build.

---

## 0. TL;DR (one paragraph)

A single-page, **dark-cinematic, image-first** personal portfolio for **Parth Kothawade — AI Product Engineer** (Pune, India). Built in **pure vanilla HTML/CSS/JS** (no framework, no build step), it opens straight from `index.html` (works on `file://` and as a static deploy). It opens with a **cinematic full-screen "entrance ritual"** (AI-generated backdrop + golden embers + animated name + boot meter + iris reveal), then reveals a hero featuring a **photoreal "device on a desk"** image whose blank screen shows a **live, self-typing "now shipping" feed**. Below: a **6-project framed gallery** that opens **full-screen case studies**, a manifesto band, an **interactive "Ask my work" AI-style assistant**, an About section, and a footer. A separate, sandboxed JS layer adds **WebGL golden particles (Three.js)**, a **⌘K command palette**, **click sound design**, **scroll reveals**, **a magnetic custom cursor**, and **a scroll-progress bar**. The whole thing is engineered to be **bulletproof**: content is visible by default and nothing (splash, JS, CDN, WebGL) can ever trap or break the page.

---

## 1. Who it's for / brand

- **Person:** Parth Kothawade
- **Title:** AI Product Engineer (also: AI-native builder, mobile & full-stack engineer)
- **Location:** Pune, India
- **Personal email:** parthkothawade2310@gmail.com
- **Work email:** dev.tools@iamstillalive.com
- **GitHub:** https://github.com/TechieParth2310
- **Positioning one-liner:** *"I build AI products that people actually use."*
- **Honest framing baked into the copy:** AI-native — designs the architecture, makes the calls, **directs** AI tools (Cursor/Claude/etc.) to implement, then integrates, debugs and ships. Value = vision, system design, orchestration, shipping.
- **Brand mood:** dark, cinematic, "expensive", editorial, warm brass/gold on near-black. Think award-winning agency reel, not a generic SaaS template.

There is also a separate file **`Parth-Master-Profile.md`** in the same folder — a single-source-of-truth profile (identity, skills, experience, all projects, quantified achievements, goals, voice). The website's copy is derived from it.

---

## 2. Tech stack & hard constraints

| Area | Choice |
|---|---|
| Markup/styles/logic | **Vanilla HTML5, CSS3, ES5-style JS** (no framework, no bundler, no npm) |
| Runs from | `file://` directly (double-click `index.html`) **and** any static host |
| External deps | **Google Fonts** (Fraunces, Inter, JetBrains Mono, Dancing Script) + **Three.js r128** from cdnjs |
| 3D | Three.js `PointsMaterial` GPU particles (loaded via `<script>` CDN, global `THREE`) |
| Audio | Web Audio API (no audio files) |
| Storage | `localStorage` (only for the sound on/off preference, key `parth-snd`) |
| Build/deploy | None required. Just host the folder. |

**Design principles enforced throughout:**
1. **Visible by default.** No content is hidden behind JS-gated reveals that could fail. Any "hidden then revealed" state is applied *by JS itself* (so if JS never runs, content shows) and/or has a CSS/timeout failsafe.
2. **Graceful degradation.** No WebGL → hero image stays. No Three.js/CDN (offline) → no particles, everything else works. No JS at all → splash still auto-dismisses via pure CSS; site fully readable.
3. **Isolation.** All "next-level" features live in `js/next.js`, each wrapped in a `safe()` try/catch, so a failure there can never break the core site or splash.
4. **No secrets in shipped code.** The image-gen API key was used only in a sandbox to pre-generate assets; it is **not** present anywhere in the website.

---

## 3. File & folder structure

```
MY Identity/
├── index.html                     # 212 lines — single page, all sections + script tags
├── css/
│   └── site.css                   # 395 lines — entire design system + all components
├── js/
│   ├── site.js                    # 356 lines — core: splash, hero feed, clock, terminal, case studies, cursor, progress
│   └── next.js                    # 336 lines — next-level layer: WebGL, AI assistant, ⌘K, sound, scroll reveals
├── assets/                        # images (AI-generated backdrops + real product screenshots)
│   ├── hero-stage.jpg             # 1344×768 — the hero "device on desk" image (device on RIGHT, blank cream screen)
│   ├── hero-wide-b.jpg            # manifesto band background (cinematic)
│   ├── hero-a.jpg, hero-b.jpg, hero-object.jpg, hero-wide-a.jpg  # earlier hero candidates (kept, mostly unused now)
│   ├── splash-1.jpg … splash-5.jpg# 1344×768 — the 5 AI splash backdrops (randomly chosen each load)
│   ├── ApplySync.png              # real screenshot — ApplySync web app
│   ├── Conference module.png      # real screenshot — Conference & Events platform
│   ├── I Am Still Alive website.png # real screenshot — IASA site
│   ├── Management portal.png      # real screenshot — internal portal
│   ├── FaceGPT.png                # real screenshot — FaceGPT app (portrait)
│   └── SkinGPT.png                # real screenshot — SkinGPT app (portrait)
├── My portrait.png                # Parth's real headshot (used in About)
├── Parth-Master-Profile.md        # single-source-of-truth profile (separate doc)
└── PROJECT-REPORT.md              # this file
```

**Load order in `index.html` (end of `<body>`):** `js/site.js` → Three.js (cdnjs) → `js/next.js`. (So `next.js` can rely on `THREE` being defined if the CDN loaded, and on the DOM/`site.js` already being parsed.)

---

## 4. Design system (CSS `:root` tokens)

Defined at the top of `css/site.css`:

**Colors**
| Token | Value | Use |
|---|---|---|
| `--bg` | `#08090B` | page background (near-black) |
| `--bg2` | `#0D0F12` | secondary dark |
| `--panel` | `#14161A` | cards/tiles |
| `--panel2` | `#191C21` | raised panels |
| `--ink` | `#EAE5D9` | primary text (warm off-white) |
| `--ink-soft` | `#CBC6BA` | secondary text |
| `--mut` | `#8A8E96` | muted/labels |
| `--line` | `rgba(234,229,217,.10)` | hairline borders |
| `--line2` | `rgba(234,229,217,.18)` | stronger borders |
| `--brass` | `#C7924F` | **signature accent** (gold/brass) |
| `--brass-l` | `#E0B57C` | light brass (highlights) |
| `--brass-d` | `#A8773A` | dark brass |
| `--green` | `#82CF90` | "live/available" status dots |

**Fonts**
| Token | Stack | Role |
|---|---|---|
| `--serif` | `'Fraunces', Georgia, serif` | display headings, big editorial type |
| `--sans` | `'Inter', system-ui, sans-serif` | body / UI text |
| `--mono` | `'JetBrains Mono', monospace` | labels, eyebrows, terminal, code-feel |
| `--script` | `'Dancing Script', cursive` | the "Parth" signature in About |

**Layout / motion**
- `--maxw: 1320px` (content max width), `--gut: clamp(22px,5vw,80px)` (responsive gutter)
- Easing: `--ease: cubic-bezier(.16,1,.3,1)`, `--ease2: cubic-bezier(.22,.61,.36,1)`
- Global: `box-sizing:border-box`, `scroll-behavior:smooth`, body 16px/1.6, `overflow-x:hidden`, `::selection` brass tint.
- Base entrance animation `@keyframes rise` (fade + translateY) with helper classes `.a1`–`.a6` (staggered delays 0.15s→1.3s), used by the hero copy. These are **pure CSS, not JS-gated**.

---

## 5. Page structure (DOM order in `index.html`)

1. `.splash#splash` — cinematic entrance overlay (covers everything on load)
2. `.progress#progress` — scroll-progress bar (top)
3. `.cur-ring#curRing` + `.cur-dot#curDot` — custom cursor elements
4. `header.nav` — fixed top nav: brand "PARTH / THE STUDIO", links (The Work, The Method, About), CTA "Start a Project"
5. `section.hero#top` — hero with device image + live screen feed + WebGL canvas + headline + stats
6. `section.band#work` — "01 — The Work": 6-project framed gallery
7. `section.manifesto` — cinematic quote band over `hero-wide-b.jpg`
8. `section.band#method` — "02 — The Method": copy + "Ask my work" terminal
9. `section.band.about#about` — "03 — About": portrait + bio + values
10. `footer.foot#contact` — CTA, status (location/time/availability/links), copyright
11. `.case#drawer` — full-screen case-study overlay (populated by JS)
12. `.cmdk#cmdk` — ⌘K command palette overlay
13. `button.snd#snd` — sound toggle (fixed, bottom-left)
14. Scripts: `site.js`, Three.js (CDN), `next.js`

---

## 6. The cinematic entrance / splash

**Goal:** an "extraordinary entrance ritual" before the studio reveals itself.

**Markup (`#splash`):** background image layer `.sp-bg#spBg`, film-grain overlay `.sp-grain`, cursor-follow spotlight `.sp-spot#spSpot`, vignette `.sp-vignette`, ember canvas `.sp-embers#spEmbers`, and the core `.sp-core` containing:
- `.sp-intro#spIntro` — typed line "you've reached the studio of"
- `h1.sp-name` → `.sp-fname` "PARTH" (gradient gold with moving sheen) + `.sp-lname` "KOTHAWADE" (tracked mono)
- `.sp-tag` "I build AI products that **<rotating phrase>**" (`#spRot`)
- `.sp-loadwrap > .sp-load#spLoad` — the studio "boot" meter
- `.sp-status#spStatus` — status text
- `button.sp-enter#spEnter` "Enter the Studio →"
- `.sp-hint` "press Enter · or click anywhere"

**CSS behavior (`css/site.css`):**
- `.splash` is `position:fixed; z-index:900; clip-path:circle(150%)`.
- **Reliability core:** `animation: spSafety 8.5s forwards` — a pure-CSS keyframe that, at 100%, sets `opacity:0; visibility:hidden; pointer-events:none`. **So even if JavaScript never runs, the splash removes itself after 8.5s and the site is usable.**
- `.splash.gone` cancels that safety animation (JS is taking over).
- `.splash.exit` = the cinematic exit: `clip-path:circle(0%)` + opacity 0 over ~1.05s (an iris collapse that reveals the hero).
- `.splash.hide` = `display:none` (final).
- `.sp-bg` does a 15s Ken-Burns push (`@keyframes spKen`).
- `.sp-fname` uses `background-clip:text` gradient + `@keyframes spSheen` (a moving light sheen) + `@keyframes spNameIn` (rise + de-blur entrance).
- Reduced-motion media query collapses the whole thing to a 4s static version.

**JS behavior (`site.js`, first IIFE):**
- Picks a **random** backdrop from `assets/splash-1..5.jpg` each load (`POOL = 5`) → preloads via `new Image()` then sets it as `#spBg` background → *feels freshly generated each visit*.
- Runs an **ember/spark canvas** (`#spEmbers`): 28–85 gold particles (count scales with width) rising with twinkle, drawn as radial-gradient sprites.
- Runs the **boot meter**: fills `#spLoad` 0→100% in random steps, cycling status messages `["warming the lamp…","loading the work…","calibrating the studio…","ready."]`, then reveals the Enter button.
- Types the intro line char-by-char; rotates the tagline through `["people actually use.","ship in days, not months.","others quote ₹4Cr for.","reach the App Store.","real people rely on."]`.
- Moves the cursor-follow spotlight (`--mx/--my`) on mousemove (fine pointers).
- **Dismiss** (`dismiss()`): on click anywhere, on Enter/Space/Escape, or auto after **7000ms** → adds `.gone .exit` (iris collapse), scrolls to top, hands cursor control to the custom cursor (`body.cur-on`), then `.hide` after 1120ms.

**Splash backdrops:** 5 bespoke AI images generated with **NVIDIA FLUX.1-schnell** (`black-forest-labs/flux.1-schnell`, `cfg_scale:0`, 1344×768, 4 steps). Themes: (1) volumetric brass light beam, (2) liquid molten gold swirl, (3) golden particle vortex with black center, (4) refined molten-gold rivers, (5) gold-veined dark smoke. All dark-centered so centered text stays legible.

---

## 7. Hero section

**Visual:** full-bleed `assets/hero-stage.jpg` — a photoreal vintage brass "device on a desk" with the device on the **right** and a **blank cream screen**. `object-fit:cover; object-position:50% 50%`.

**Layers (within `.hero`):**
- `.hero-bg > .hero-stage#heroStage` (gets subtle scroll parallax: `translateY(y*0.10) scale(1.045)`).
  - `img.fig-img` (the device photo)
  - `canvas.hero-gl#heroGL` (WebGL particles, z-index 1)
  - `.hero-screen#heroScreen` (z-index 2) — the **live device screen overlay**, with `.scr-feed#screenFeed` + `.scr-glass` (CRT scanlines)
- `.hero-scrim` — left-heavy dark gradient so headline text stays readable
- `.hero-inner` — the copy

**Live "studio display" on the device screen (the signature touch):**
- `site.js` computes the screen's exact on-screen rectangle using **cover-geometry math**: the cream screen occupies fractional rect `fx0:0.527, fy0:0.402, fx1:0.745, fy1:0.738` of the 1344×768 image. `placeScreen()` recomputes the rendered cover rect on load + resize and positions `#heroScreen` precisely over the screen at any viewport (so it tracks the device). Hidden below 600px wide (CSS + JS both gate at 600).
- It then **types out a looping "now shipping" feed** with a blinking cursor and a pulsing green "live" dot:
  ```
  ● STUDIO — SHIPPING
  › I Am Still Alive ...... prod
  › Events & Conference ... prod
  › FaceGPT ............... store
  › SkinGPT ............... store
  › ApplySync ............. live
  › Management Portal .... daily
  ```
  (Dotted leader auto-computed to align the status values; reduced-motion renders it statically.)

**Copy:**
- Eyebrow: "AI PRODUCT ENGINEER"
- Headline (Fraunces, `.h-title`): "I build AI products / that people / *actually use.*"
- Sub: "I don't prompt models. I design the systems around them, make the architectural calls, and ship products that create real impact — in days, not months."
- Stats row (`.h-stats`): `00 / Days not months`, `00+ / Products shipped`, `₹00L+ / Cost replaced for clients` *(these are stylized placeholders — see §16 Known items)*.
- "Now showing — **ApplySync** · live in production" pill with pulsing green dot.
- Scroll cue at the bottom.

**Hero WebGL particle field (`next.js`, module 1):**
- Three.js scene, `PerspectiveCamera`, `WebGLRenderer({alpha:true})`, **1500** points using a canvas-drawn radial sprite, `AdditiveBlending`, brass color `0xE0B57C`.
- Particles drift upward and wrap; the field rotates with the mouse and the camera eases toward the cursor → a living, reactive 3D dust field over the device.
- Pauses on tab hidden (`visibilitychange`). Guards: no canvas / no `THREE` / no WebGL / reduced-motion → does nothing (hero image stays). Sits at z-index 1, **below** the screen overlay (z-index 2) so the feed stays crisp.

---

## 8. The Work — framed project gallery (`#work`)

- Section header "01 — The Work": title "Real products. Real users. Real impact.", lead "Shipped to app stores and production — not demos."
- `.work-grid` = 12-column CSS grid; 6 `.tile` buttons with magazine-style spans (7/5, 5/7, 7/5). Collapses to 1 column < 900px.
- Two tile types:
  - **`.tile-shot.site`** (websites): screenshot with `object-fit:cover`, and on hover the `object-position` slowly scrolls top→bottom (a "scroll the page" effect). Used for ApplySync, I Am Still Alive, Conference, Management Portal.
  - **`.tile-shot.app`** (mobile apps): the portrait screenshot sits inside a CSS **phone frame** (`.phone` with `.phone-notch`) on a brass-radial backdrop, with a `.tile-badge` ("Android · Live" / "iOS · Live"). Used for FaceGPT, SkinGPT.
- Each tile footer: category (mono), title (Fraunces), "View case study →".
- Clicking a tile opens its full-screen case study.

---

## 9. Case-study system (full-screen overlay)

When a tile is clicked, `site.js` `openCase(id)` builds and shows `.case#drawer`:
- **Clean hero (`.cs-top`):** category, big title, italic tagline, fact row (Role/Year/Status), and a live-link CTA.
- **Framed showcase (`.cs-show`):** websites render in a **browser frame** (`.frame.browser` with traffic-light dots + a URL pill showing the domain); apps render in a **large phone frame** (`.frame.phone-lg` with notch).
- **Two-column body (`.cs-grid`):** left = Overview (lead) + "What I built" (numbered list); right = Architecture (flow of nodes with `→`), Impact (2×2 metric cards), Stack (chips).
- Opens with scale/opacity transition; closes via ✕ button (rotates 90° on hover), scrim click, or Escape; locks body scroll while open; restores focus.

Content lives in two JS objects in `site.js`: **`DET`** (per-project case content) and **`META`** (image, type site/app, domain, live link). Full data in §11.

---

## 10. The Method — "Ask my work" assistant (`#method`)

- Left: copy "Ask my work." / "Don't take my word for it — interrogate the record."
- Right: a **terminal** (`.terminal`) with a question line `#tQ`, an answer area `#tA`, suggestion chips `#tChips`, and a **text input form** `#tForm > #tInput` ("ask me anything about my work…"), footer tagged "powered by RAG".

**Two layers of logic:**
- `site.js` seeds a basic canned Q&A (4 chips) as a fallback.
- `next.js` **module 2 upgrades it into a living assistant**: it replaces the chips with 6 smart suggestions and wires the free-text input. It runs a **client-side knowledge base (`KB`)** of **17 entries** (keyword arrays → answer strings) plus a default. On submit it lowercases the query, scores each KB entry by keyword-substring matches, returns the best (or default), and **types** the answer out. No API, no key — fully offline, safe, instant. (It *feels* like a real AI chat; it's deterministic keyword retrieval.)

**KB topics covered:** how I decide what to build · hard architecture call · biggest mistake (ApplySync) · how fast I ship · "do you really write the code?" (AI-native honesty) · tech stack · each of the 6 projects · why hire me · contact · strengths · weaknesses · education · who I am.

---

## 11. The six projects (authoritative data from `DET` + `META`)

> This is the real project content rendered in the case studies. Use this as ground truth.

### 1) ApplySync — *AI Job Automation · my startup* — **Live**
- **Live:** https://www.applysync.in/ (domain `applysync.in`) · type: website
- **Role:** Sole founder & builder · **Year:** 2026
- **Tagline:** "I automated job-hunting end to end — then learned why products really fail."
- **Overview:** An AI system that turns job-hunting into one decision — watches Telegram job channels, understands each posting, tailors the résumé to the role, and applies on the user's behalf 24/7.
- **What was built:** 24/7 listener (GramJS) over 50+ Telegram job channels; AI layer (OpenAI + NVIDIA NIM fallback) scoring fit and rewriting résumés per ATS; auto-apply + cold outreach via the user's own Gmail; React 19 review/approve/track dashboard; Chrome MV3 extension auto-filling 46+ sites; Razorpay billing, node-cron jobs, deployed Vercel + Railway.
- **Architecture:** Telegram listener → AI fit + tailoring → Auto-apply + Gmail → React 19 dashboard → Chrome extension
- **Metrics:** 50+ channels watched · 46+ sites auto-filled · Solo build · 3 sister tools shipped
- **Stack:** React 19, Vite, Tailwind, Express, TypeScript, Firebase, OpenAI, NVIDIA NIM, GramJS, Razorpay, Gmail API, Chrome MV3
- **Honest note (from profile):** launched with ~0 paying users — the lesson was distribution.

### 2) FaceGPT — *AI Reverse Image Search · Google Play* — **Live**
- **Live:** https://play.google.com/store/apps/details?id=com.humanityfounder.facegpt&hl=en_IN · type: app (portrait)
- **Role:** Mobile engineer · **Year:** 2026
- **Tagline:** "Point a photo at the internet and get an answer — not a list of links."
- **Overview:** AI reverse-image-search app on Google Play with a full commercial layer (credit + subscription system kept in sync between app and backend).
- **What was built:** 20+ screen Flutter app (auth, image upload, async search); backend-driven credit/subscription engine with daily/weekly/monthly billing + usage gating; real-time front↔back sync; modular Firebase + REST architecture (~25% lower sync latency).
- **Architecture:** Flutter app (20+ screens) → Auth + image upload → Async search → Credit/subscription engine → Firebase + REST
- **Metrics:** 20+ screens · ~25% lower sync latency · D/W/M billing cycles · Live on Google Play
- **Stack:** Flutter, Firebase, REST APIs, In-App Purchases

### 3) SkinGPT — *AI Personal Style · App Store* — **Live**
- **Live:** https://apps.apple.com/us/app/skingpt-ai/id6760752935 · type: app (portrait)
- **Role:** Mobile engineer · **Year:** 2026
- **Tagline:** "Where AI meets personal style — your colours, your wardrobe."
- **Overview:** Cross-platform app on the App Store: upload a selfie → personalised outfit + colour recommendations from skin-tone analysis.
- **What was built:** Flutter app with selfie capture/upload + personalised results; skin-tone analysis driving outfit/colour recs + wardrobe view; Firebase auth (email, Google, Apple); Dio-based API layer.
- **Architecture:** Flutter app → Selfie capture → Skin-tone analysis → Firebase auth → Dio API layer
- **Metrics:** 3 auth providers · iOS App Store · Flutter cross-platform · personalised colour + wardrobe
- **Stack:** Flutter, Dart, Firebase Auth, Dio

### 4) I Am Still Alive (IASA) — *Healthcare AI Platform · Production*
- **Live:** https://iamstillalive.com/ (domain `iamstillalive.com`) · type: website
- **Role:** AI & platform engineer · **Year:** 2026
- **Tagline:** "AI for people in crisis. The stakes rewrote how I build."
- **Overview:** Django support platform for cancer patients ("Cancer Warriors") and their doctors; centerpiece is a Virtual Tumor Board and a **governed** AI layer (every feature key-gated, fail-safe, audited).
- **What was built:** central AI service over NVIDIA NIM (chat/classify/embed/moderate/de-identify); "Ask Stork" assistant agent + thread summarization + draft Q/A generators; vision models reading patient PDFs/scans; crisis/self-harm detection with moderator alerts; Llama-Guard moderation + embeddings case-matching; two-lane PHI guardrail + de-identification, daily call budgets, per-user rate limits, global kill switch.
- **Architecture:** Django + Channels + Celery → Central governed AI layer → Vision · Crisis · Moderation → Embeddings case-matching → PHI guardrail + kill switch
- **Metrics:** 14+ governed AI features · 0 raw PHI sent to hosted AI · real-time WebSocket chat · live at iamstillalive.com
- **Stack:** Django 5, Channels, Celery, PostgreSQL, NVIDIA NIM, Embeddings, AWS S3, FCM
- **Company context:** built at **Humanity Founders Hub Pvt. Ltd** (the company behind IASA), where Parth is a Mobile Engineer.

### 5) Events & Conference Platform — *Events Platform · Enterprise · Production*
- **Live (demo):** https://i-asa-events-module-ylys.vercel.app/ (domain `iasa-events-module.vercel.app`) · type: website
- **Role:** Sole builder · **Year:** 2026
- **Tagline:** "Vendors quoted ₹60L–4Cr. I built it in-house instead."
- **Overview:** Complete conference & events platform on Next.js — registration, ticketing, live video, payments, AI — one owned codebase of ~18,000 lines, 35 data models.
- **What was built:** 4-step event wizard publishing branded public pages; ticketing (Stripe) with capacity + automatic waitlists; live keynote rooms (LiveKit) with DB-backed Q&A + upvoting; organizer dashboards (live KPIs/registrations/revenue); AI layer (copilot, attendee matchmaker via embeddings, semantic library search) behind one swappable abstraction.
- **Architecture:** Next.js 15 + Prisma (35 models) → LiveKit rooms + Q&A → Stripe + waitlist → AI copilot · matchmaker · search → S3 + Resend + Auth
- **Metrics:** ₹60L–4Cr vendor cost replaced · 18,000+ lines shipped solo · 35 data models · 1 swappable AI layer
- **Stack:** Next.js 15, React 19, Prisma, LiveKit, Stripe, AWS S3, Resend, zod
- **Note:** title shown in UI/feed as "Events & Conference"; case-study title string is "Conference & Events Platform".

### 6) Management Portal — *Operations Platform · in daily use*
- **Live:** https://portal.iamstillalive.com/ (domain `portal.iamstillalive.com`) · type: website
- **Role:** Sole builder · **Year:** 2026 · **Status:** Live · daily use
- **Tagline:** "The real proof isn't that I built it — the team opens it every day."
- **Overview:** All-in-one employee & operations portal — an internal OS spanning HR, finance, hiring, operations — with Microsoft SSO and role-based access; used daily by the whole (~7-person) team.
- **What was built:** Workspace (dashboard, attendance, tasks, leave, expenses, goals/OKRs, projects/timesheets, reviews, reports); People (directory, org chart, calendar, announcements, docs/policies); Hiring (ATS + onboarding/offboarding); Operations & growth (assets, help desk, L&D, surveys/eNPS); Finance (payroll & comp); Platform (Azure AD SSO, RBAC, global search, in-app notifications).
- **Architecture:** Next.js 14 + Prisma → PostgreSQL (Supabase) → Microsoft Azure AD SSO → Microsoft Graph email → Cloudflare R2
- **Metrics:** 20+ modules · used daily by the whole team · Microsoft Azure AD SSO · role-based access
- **Stack:** Next.js 14, TypeScript, Prisma, Supabase, NextAuth, Azure AD, Microsoft Graph, Cloudflare R2

---

## 12. About + Footer

**About (`#about`):** real portrait (`My portrait.png`, slight grayscale/contrast), heading "I don't build demos. I build products.", a short bio paragraph, a "Parth" signature in the script font, and a values column (Shipped / Solved / Created). Responsive 3-col → 2-col → 1-col.

**Footer (`#contact`):** big CTA "Let's build something that actually matters." + "Start a Project →" (mailto). Status block: Location = Pune, India; **Time = live IST clock** (`#clock`, updates every 20s via `toLocaleTimeString` in `Asia/Kolkata`); Status = "Available for meaningful work" (pulsing green dot); Connect = GitHub + Email links. Bottom bar: "© 2026 Parth Kothawade" / "Built with obsession. Shipped with impact."

---

## 13. The "next-level" interactive layer (`js/next.js`)

Five sandboxed modules, each in a `safe()` wrapper:

1. **Hero WebGL particles** (Three.js) — see §7.
2. **Living AI assistant** — see §10.
3. **⌘K Command Palette** (`#cmdk`): open with ⌘K / Ctrl+K (toggle), Esc to close, ↑/↓ to navigate, Enter to run; fuzzy subsequence search. **Commands:** Go to The Work / The Method / About / Contact; Open case for each of the 6 projects (programmatically clicks the tile); Copy email address (clipboard API + textarea fallback); Email me (mailto); Open GitHub; Toggle sound; Replay the intro (reloads). Click-outside closes.
4. **Sound — click ticks only** (Web Audio): a short triangle-wave "tick" on clicks of interactive elements (`a, button, .tile, .t-chip, .cmdk-item, .sp-enter, .scrollcue`). **No ambient drone, no hover sounds** (removed per preference). A fixed bottom-left toggle `#snd` (animated bars) mutes/unmutes; preference persisted in `localStorage["parth-snd"]`. AudioContext is created on the first user gesture (browser requirement).
5. **Cinematic scroll reveals** (IntersectionObserver): section headers, tiles, manifesto quote, method grid, about, values, footer fade/translate in as they enter view. **Hidden state is applied by JS only** (so no-JS = visible), with a **9s failsafe** that force-reveals everything. Skipped under reduced-motion.

**Also in `site.js` (core):**
- **Scroll-progress bar** `#progress` (brass, fills with scroll).
- **Custom magnetic cursor** (fine pointers only): a brass dot + an easing ring that swells (`.hot`) over interactive elements; `.cta` buttons get a magnetic pull toward the cursor. Native cursor is hidden (`body.cur-on`) only after the splash hands over. Disabled on touch and reduced-motion. (z-index 999 so it floats above overlays.)
- **Nav scrolled state**, **hero parallax**, **live clock** — as described above.

---

## 14. Accessibility & reduced motion

- Respects `prefers-reduced-motion`: disables animations, shows the splash as a 4s static panel, renders the device feed statically, skips particles/cursor/scroll-reveals, sets `scroll-behavior:auto`.
- Tiles are real `<button>`s with focus-visible outlines; case overlay is `role="dialog" aria-modal`, traps focus to the close button, Escape closes, restores focus on close.
- Decorative layers are `aria-hidden`; the WebGL canvas and screen feed are decorative.

---

## 15. Reliability / safety architecture (why it can't break)

- **Splash** auto-dismisses via pure CSS (`spSafety` 8.5s) independent of JS.
- **All `next.js` modules** are individually `try/catch`-wrapped; one failing never affects others or `site.js`.
- **WebGL** degrades to the static hero image on any failure (no WebGL, no Three.js/CDN, offline).
- **Scroll reveals** apply their hidden state from JS and have a 9s force-reveal failsafe → content can never be stuck invisible.
- **Clipboard** has a textarea/`execCommand` fallback for `file://`.
- **No secrets shipped:** the NVIDIA FLUX key was used only in a sandbox to pre-generate the 5 splash JPEGs; it is **not** embedded in any HTML/CSS/JS. (Live in-browser image generation was intentionally rejected because it would expose the key in page source and fail CORS.)

---

## 16. Known placeholders / things to confirm before publishing

- **Hero stat numbers** are stylized placeholders: `00 / Days not months`, `00+ / Products shipped`, `₹00L+ / Cost replaced`. Consider real figures (e.g. 6 products shipped; ₹60L–4Cr replaced; 14+ AI features) — and reconcile units (the ₹ figure uses "L"/lakh while the conference figure is in crore).
- **Links/handles still to add:** LinkedIn, X/Twitter, a canonical hosted portfolio URL.
- **Education detail:** B.Tech ECE, graduated 2026 — college name/CGPA not shown.
- **App metrics:** real downloads/active users/ratings for FaceGPT & SkinGPT not yet included.
- **Cleanup:** `assets/hero-a.jpg, hero-b.jpg, hero-object.jpg, hero-wide-a.jpg` are earlier hero candidates, largely unused now (kept for reference); could be removed.
- **Security TODO:** rotate the NVIDIA API key that was shared in plain text during development.

---

## 17. How to run / deploy

- **Run locally:** open `index.html` in a browser (double-click). Internet is needed only for Google Fonts + Three.js (CDN); offline still works minus those flourishes.
- **Deploy:** drop the whole `MY Identity` folder on any static host (Netlify, Vercel static, GitHub Pages, Cloudflare Pages, S3). No build step.
- **Edit projects:** all case-study content is in `site.js` → `DET` and `META`. The hero device-screen feed is the `FEED` array in `site.js`. The assistant's answers are the `KB` array in `next.js`. Splash taglines/status are arrays in `site.js`.
- **Refresh splash art:** regenerate `assets/splash-1..5.jpg` (1344×768) — any dark, brass/gold, dark-centered cinematic images work.

---

## 18. Quick capability checklist (what's implemented)

- [x] Cinematic full-screen entrance (random AI backdrop, embers, animated name w/ sheen, boot meter, iris reveal, bulletproof auto-dismiss)
- [x] Photoreal hero device with a live, self-typing on-screen "now shipping" feed (cover-geometry tracked)
- [x] Reactive WebGL golden particle field (Three.js), mouse-driven, with graceful fallback
- [x] 6-project framed gallery (browser frames for sites, phone frames for apps)
- [x] Full-screen image-led case studies (overview, build list, architecture flow, metrics, stack, live links)
- [x] Interactive "Ask my work" assistant (free text + keyword KB + typing)
- [x] ⌘K command palette (nav, open cases, copy email, GitHub, sound, replay)
- [x] Click-only sound design with persistent mute toggle
- [x] Cinematic scroll reveals, scroll-progress bar, magnetic custom cursor, live IST clock
- [x] Fully responsive, reduced-motion aware, no-secrets, no-build, file://-safe

---

---

## Appendix A — Precise UI / design specification (exact values)

### A.1 Z-index map (stacking order, low → high)
| Layer | z-index |
|---|---|
| `.hero-bg` | 0 |
| `.hero-gl` (WebGL canvas), `.hero-scrim` | 1 |
| `.hero-screen`, `.scr-feed`, `.hero-inner`, `.scrollcue`, `.band`, `.manifesto`, `.foot` | 2 |
| `.scr-glass` (CRT scanlines, inside screen) | 3 |
| `.nav` | 50 |
| `.progress`, `.snd` | 200 |
| `.case#drawer` | 300 (`.case-close` 20 inside) |
| `.cmdk` (command palette) | 800 |
| `.splash` | 900 |
| `.cur-dot`, `.cur-ring` (custom cursor) | 999 |

### A.2 Responsive breakpoints (all `max-width`)
- **980px** → `.about-grid` 3-col → 2-col (values become a row)
- **900px** → `.work-grid` → single column (tiles `grid-column:auto`)
- **840px** → `.method-grid` → 1 col; `.cs-grid` → 1 col; `.frame.phone-lg` width 300→250px
- **760px** → nav non-CTA links hidden; `.foot-top` → 1 col; `.foot-bottom` stacks; `.snd` moves to `right:16px;bottom:16px`, 40×40
- **600px** → `.hero-screen` `display:none` (device feed hidden); `.about-grid` → 1 col
- Media features: `(pointer:fine)` enables custom cursor; `(pointer:coarse)` hides it; `(prefers-reduced-motion:reduce)` strips animations.

### A.3 Type scale (font-size, all use `clamp(min, vw, max)` unless noted)
| Element | Font | Size |
|---|---|---|
| `.h-title` (hero headline) | Fraunces | clamp(40px, 5.2vw, 76px), line 1.04, max-width 600px |
| `.h-sub` | Inter | clamp(15.5px, 1.2vw, 18px) |
| `.st b` (stat numbers) | Fraunces | clamp(24px, 2.4vw, 32px) |
| `.sec-title` | Fraunces | clamp(28px, 3.4vw, 46px); `.sm` clamp(26,2.4vw,34) |
| `.sec-lead` | Inter | 16px |
| `.tile-t` | Fraunces | clamp(20px, 1.9vw, 26px) |
| `.tile-c` / `.tile-go` / `.tile-badge` | Mono | 9.5 / 10 / 9px |
| `.man-quote` | Fraunces italic | clamp(24px, 3.6vw, 46px) |
| `.about-h` | Fraunces | clamp(28px, 3.4vw, 46px); `.about-p` 16px; `.sig` 34px (Dancing Script) |
| `.foot-lead` | Fraunces | clamp(26px, 3vw, 40px) |
| `.cs-title` | Fraunces | clamp(40px, 6vw, 88px) |
| `.cs-tag` | Fraunces italic | clamp(18px, 1.9vw, 24px) |
| `.cs-lead` | Fraunces | clamp(19px, 1.7vw, 23px); `.cs-metric b` 26px |
| `.sp-fname` (splash name) | Fraunces | clamp(56px, 14.5vw, 168px) |
| `.sp-intro` / `.sp-lname` / `.sp-tag` | Mono/Mono/Fraunces | clamp(10,1.3vw,12.5) / clamp(11,1.7vw,15) / clamp(15,2vw,22) |
| eyebrows / labels / terminal | Mono | 9–12.5px, letter-spacing .1–.5em, uppercase |

### A.4 Radii, borders, key shadows
- **Radii:** tiles/cards 16px · terminal 12px · browser frame 13px · phone 22px (4px border `#23262d`) · phone-lg 40px (10px border `#1b1e25`) · hero-screen 5px · cmdk-box 16px · `.snd` 50% (44px) · pills/buttons 999px · nav `.cta` 2px.
- **Notable shadows:** tile:hover `0 46px 90px -38px rgba(0,0,0,1)` · `.frame` `0 70px 140px -55px rgba(0,0,0,1)` · terminal `0 40px 80px -40px rgba(0,0,0,.9)` · `.phone` `0 28px 46px -20px rgba(0,0,0,.95)` · about-portrait `0 44px 90px -44px rgba(0,0,0,.95)` · cmdk-box `0 30px 90px rgba(0,0,0,.65)` · progress glow `0 0 12px rgba(199,146,79,.55)`.

### A.5 Every `@keyframes` (name — effect — timing)
- `rise` — fade + translateY(22px) — 1s `--ease`; base entrance via `.a1–.a6` (delays .15/.45/.62/.9/1.1/1.3s)
- `pulse` — opacity 1↔.5 — 2.4s — status/"available" dots
- `cue` — scroll-cue line scaleY/opacity — 2s
- `blink` — terminal caret — 1.1s steps
- `scrFlick` — hero screen brightness flicker — 6s
- `scrPulse` — green "live" feed dot — 1.6s
- `scrBlink` — feed + splash cursor blink — 1s steps
- `spSafety` — **splash pure-CSS auto-hide** — 8.5s (4s under reduced-motion)
- `spKen` — splash backdrop Ken-Burns — 15s
- `spNameIn` — name rise + de-blur — 1s @ .35s delay
- `spSheen` — name light sweep (background-position) — 5s linear infinite @ 1.5s
- `spFade` — splash elements fade-in — staggered (.2/1.05/1.35/1.5/1.6/2.2s)
- `spPulse` — Enter button glow — 2.2s
- `cmdkIn` — palette fade-in — .22s
- `sndBar` — sound-toggle bars — 1s (child delays .16/.32/.48s)

### A.6 Key gradients (exact)
- **hero-scrim:** `linear-gradient(90deg, rgba(7,8,10,.95) 0%, .78 34%, .32 58%, 0 82%)` + `linear-gradient(0deg, rgba(7,8,10,.7) 0%, transparent 38%)`
- **manifesto scrim:** `linear-gradient(90deg, rgba(7,8,10,.92), .55 55%, .2)`
- **hero-screen (cream display):** `radial-gradient(120% 120% at 50% 0%, #efe6d2, #e4d8bf 60%, #d8c8a8)`
- **splash vignette:** `radial-gradient(135% 100% at 50% 46%, rgba(6,7,8,.32), .6 52%, .95)` + `linear-gradient(0deg, rgba(6,7,8,.88), transparent 50%)`
- **splash cursor spotlight:** `radial-gradient(circle 340px at var(--mx) var(--my), rgba(255,200,130,.13), transparent 62%)`
- **splash name fill:** `linear-gradient(100deg, #9a6a32, #E0B57C 30%, #fff 47%, #E0B57C 64%, #9a6a32)` at `background-size:230%`
- **progress / sound / button accents:** `linear-gradient(90deg, --brass-d, --brass, --brass-l)` family.

### A.7 Component anatomy quick-reference
- **Nav:** fixed; default padding 22px gutter; `.scrolled` (after 30px scroll) → 14px padding + blur + hairline border. Brand = `.bn` "PARTH" (600, .32em tracking) over `.bs` "THE STUDIO" (mono, muted). CTA = bordered pill w/ brass dot that scales on hover + magnetic pull.
- **Tiles:** `border-radius:16px`, `.tile-shot` height 240px; site shots `object-position` animates top→bottom on hover (3s); app shots = `.phone` 120×216px in brass-radial; hover lifts tile −8px.
- **Terminal:** dark `#0A0B0D`, traffic-light bar, `min-height:200px` body, mono 12.5/1.75, chips column, input row, green "powered by RAG".
- **Case browser frame:** `.fr-bar` dots colored `#e0655a / #dbab4e / #63b365`, `.fr-url` pill, `.fr-shot` max-height 620px. Phone frame `.frame.phone-lg` 300px, 10px bezel, notch `.pn` 120×24px.
- **Command palette:** centered box `min(580px,92vw)`, input + scrollable list (max-height 46vh) + hint bar; selected item brass tint.
- **Sound toggle:** 44px circle, 4 animated bars; `.on` animates, `.off` flat/muted.
- **Custom cursor:** 6px brass dot (instant) + 30px ring (eased, swells to 54px `.hot` over interactives).

## Appendix B — Full source code

The complete, verbatim source of all four files (`index.html`, `css/site.css`, `js/site.js`, `js/next.js`) is in the companion file **`PROJECT-SOURCE.md`** in this same folder. Hand that file to ChatGPT alongside this report and it has the literal, exhaustive implementation — nothing omitted.

---

*End of report.*
