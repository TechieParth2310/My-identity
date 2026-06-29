# Deploying the portfolio + real AI Brain (Vercel)

Your site stays a normal static site. We only add **one serverless function** (`/api/ask.js`)
that holds your NVIDIA key **server-side** and powers the live "Ask my work" AI Brain.
The key never appears in the website source.

> Until it's deployed, the site still works perfectly — the AI Brain automatically falls
> back to its built-in answers when there's no backend (e.g. opening `index.html` directly).

---

## What's in the project
```
MY Identity/
├── index.html, css/, js/, assets/   ← the static site (unchanged)
├── api/ask.js                       ← the serverless AI Brain (new)
├── .env.example                     ← which env vars to set (no real values)
└── .gitignore                       ← keeps secrets/node_modules out of git
```

## One-time deploy (≈5 minutes)

1. **Put the project on GitHub**
   - Create a new repo (e.g. `parth-portfolio`).
   - Upload the whole `MY Identity` folder's contents (or `git init && git add . && git commit && git push`).
   - The `.gitignore` already prevents any `.env`/secret from being committed.

2. **Import to Vercel**
   - Go to https://vercel.com → **Add New… → Project** → import your GitHub repo.
   - Framework preset: **Other** (it's a static site). No build command needed.
   - Click **Deploy**. Your site is live at `https://<name>.vercel.app`.

3. **Add your key as an environment variable** (this is the secret step)
   - Vercel → your project → **Settings → Environment Variables** → add:

     | Name | Value |
     |---|---|
     | `NVIDIA_API_KEY` | `nvapi-...` (your key) |
     | `NVIDIA_BASE_URL` | `https://integrate.api.nvidia.com/v1` |
     | `AI_MODEL_FAST` | `meta/llama-3.1-8b-instruct` |

   - Apply to **Production** (and Preview if you want).
   - **Redeploy** (Deployments → ⋯ → Redeploy) so the function picks up the key.

4. **Test it**
   - Open your live site → "The Method" → ask the terminal: *"How does ApplySync work?"*
   - You should get a fresh, first-person answer (that's the live model). If you ever see the
     short built-in answers, the key/redeploy step hasn't taken effect yet.

---

## Notes
- **Cost/abuse:** the function caps input (400 chars) and output (260 tokens). For a public site
  you may later add Vercel's rate-limiting / a simple per-IP throttle if traffic grows.
- **Rotate the key** that was shared in chat once you're set up; paste the new one only into the
  Vercel env-var box.
- **Custom domain:** Vercel → Settings → Domains → add `parthkothawade.com` (or similar) when ready.
- **Local function testing (optional):** `npm i -g vercel` then `vercel dev` runs the site + `/api` locally with a `.env` file.
