/* ============================================================
   /api/ask  —  Parth Kothawade's portfolio "AI Brain"
   Vercel serverless function (Node runtime).

   The visitor's browser POSTs { q } here. This function holds the
   NVIDIA key SERVER-SIDE (env var NVIDIA_API_KEY) and calls NVIDIA NIM.
   The key NEVER reaches the browser / page source.

   Set in Vercel → Project → Settings → Environment Variables:
     NVIDIA_API_KEY   = nvapi-...        (required)
     NVIDIA_BASE_URL  = https://integrate.api.nvidia.com/v1   (optional)
     AI_MODEL_FAST    = meta/llama-3.1-8b-instruct            (optional)

   Cost/abuse guards: input capped at 400 chars, output at 260 tokens.
   On ANY problem it returns { fallback:true } with HTTP 200 so the
   frontend silently falls back to its local answers (never errors).
   ============================================================ */

var BASE  = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
var MODEL = process.env.AI_MODEL_FAST   || "meta/llama-3.1-8b-instruct";

var FACTS = [
  'Parth Kothawade — AI Product Engineer, Chalisgaon, Maharashtra. Tagline: "I build AI products that people actually use."',
  'He is an AI-native builder: he designs the architecture, makes the calls, and directs AI tools (Cursor/Claude/ChatGPT) to write implementation, then integrates, debugs and ships. His value is vision, system design, orchestration and shipping. He ships in days, not months. He is honest that he is deepening CS fundamentals, distribution/marketing and business English.',
  'Contact: parthkothawade2310@gmail.com. GitHub: github.com/TechieParth2310. Education: B.Tech in Electronics & Communication, graduated 2026. He works at Humanity Founders Hub (the company behind "I Am Still Alive").',
  'PROJECT 1 — ApplySync (his own startup, live at applysync.in): AI job-application automation. A 24/7 listener (GramJS) watches 50+ Telegram job channels, an AI layer (OpenAI with NVIDIA NIM fallback) scores fit and tailors the résumé per ATS, then auto-applies and sends outreach via the user\'s own Gmail. A Chrome MV3 extension auto-fills 46+ application sites. React 19 dashboard, Razorpay billing, Vercel + Railway. Real production traction: 109 registered users, ~185 visitors in the last 30 days, 19 new signups (~10% visitor→signup conversion). Honest lesson: people sign up, but paying users are still few — distribution and monetization are the real game.',
  'PROJECT 2 — FaceGPT (live on Google Play): AI reverse-image-search app. 20+ Flutter screens, a backend-driven credit & subscription billing engine kept in sync, Firebase + REST, ~25% lower data-sync latency.',
  'PROJECT 3 — SkinGPT (live on the App Store): upload a selfie, get personalised colour and outfit recommendations from skin-tone analysis. Flutter, Firebase auth (email/Google/Apple), Dio API layer.',
  'PROJECT 4 — I Am Still Alive / IASA (production, iamstillalive.com): a Django healthcare platform for cancer patients ("Cancer Warriors"). 14+ governed AI features over NVIDIA NIM: assistant agent, document/scan vision, crisis/self-harm detection, Llama-Guard moderation, embeddings case-matching. Two-lane PHI guardrail, de-identification, daily budgets, global kill switch; 0 raw PHI sent to hosted AI.',
  'PROJECT 5 — Events & Conference platform (production): Next.js 15, ~18,000 lines, 35 Prisma models. Event wizard, ticketing (Stripe) with waitlists, live keynote rooms (LiveKit) with Q&A, organizer dashboards, and an AI layer (copilot, attendee matchmaker via embeddings, semantic search) behind one swappable abstraction. It replaced ₹60L–4Cr of vendor quotes.',
  'PROJECT 6 — Management Portal (live, used daily by the ~7-person team): an internal operations OS — HR, attendance, payroll, ATS, help desk — 20+ modules. Next.js 14, Prisma, Supabase, Microsoft Azure AD SSO, Cloudflare R2.'
].join("\n");

var SYSTEM =
  'You ARE Parth Kothawade, speaking to visitors on your portfolio in the first person ("I"). ' +
  'Be confident, warm and concise (90 words max), specific with real numbers. ' +
  'Ground EVERY answer ONLY in the facts below — never invent metrics, employers, dates or tech. ' +
  'If asked something off-topic, answer briefly then steer back to your work. ' +
  'Write clean plain sentences (no markdown headings, no bullet symbols).\n\nFACTS:\n' + FACTS;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }

  var key = process.env.NVIDIA_API_KEY;
  if (!key) { res.status(200).json({ fallback: true, error: "no key configured" }); return; }

  var body = req.body;
  try { if (typeof body === "string") body = JSON.parse(body || "{}"); } catch (e) { body = {}; }
  var q = (body && body.q ? String(body.q) : "").trim().slice(0, 400);
  if (!q) { res.status(400).json({ error: "empty question" }); return; }

  try {
    var upstream = await fetch(BASE + "/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM }, { role: "user", content: q }],
        temperature: 0.4,
        max_tokens: 260,
        stream: false
      })
    });
    if (!upstream.ok) {
      var t = await upstream.text();
      res.status(200).json({ fallback: true, error: "upstream " + upstream.status + " " + t.slice(0, 120) });
      return;
    }
    var data = await upstream.json();
    var answer = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || "").trim();
    if (!answer) { res.status(200).json({ fallback: true, error: "empty answer" }); return; }
    res.status(200).json({ answer: answer, model: MODEL });
  } catch (e) {
    res.status(200).json({ fallback: true, error: String(e).slice(0, 120) });
  }
};
