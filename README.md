# AI Marketing Tools Dashboard

A live, automated directory and tracker for AI-powered marketing tools — seeded with 40 tools across 8 categories, ranked by usage score, and auto-updated daily via a search + LLM ingestion pipeline.

## Features

- **40+ tools** across SEO, Content, Social, Analytics, Email, Ads, Video, and Design
- **Daily auto-sync** — searches the web for new AI marketing tool launches via [Exa](https://exa.ai) and parses them with Claude
- **"Sync Now" button** — manually trigger a fresh fetch at any time
- **Score badges** — color-coded usage scores (green / yellow / red)
- **Sentiment indicators** — positive / neutral / negative per tool
- **"NEW" badge** on freshly discovered tools
- **Vercel cron** for automatic daily updates in production

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4**
- **Prisma 5** + SQLite (`dev.db` locally)
- **Anthropic SDK** — `claude-haiku-4-5` for LLM parsing
- **Exa API** — neural web search for new tool discovery

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Orenlibane/ai-marketing-searcher.git
cd ai-marketing-searcher
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API keys

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in your keys:

```env
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY="sk-ant-..."
EXA_API_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Where to get the keys:**

| Key | How to get it |
|-----|---------------|
| `ANTHROPIC_API_KEY` | Go to [console.anthropic.com](https://console.anthropic.com) → sign up → **API Keys** → Create Key |
| `EXA_API_KEY` | Go to [dashboard.exa.ai](https://dashboard.exa.ai) → sign up → **API Keys** → Create Key |

> **Note:** The dashboard works without API keys — it loads the 40 seeded tools fine. You only need the keys to use the **Sync Now** button or the daily cron job.

### 4. Set up the database

```bash
npx prisma migrate dev --name init
```

This creates `prisma/dev.db` and automatically seeds it with 40 AI marketing tools.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma         # MarketingTool model
│   ├── seed.ts               # 40 seeded tools
│   └── dev.db                # SQLite database (gitignored)
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main dashboard (server component)
│   │   └── api/
│   │       ├── tools/        # GET /api/tools?category=&sort=
│   │       ├── seed/         # POST /api/seed (dev only)
│   │       └── fetch-tools/  # POST /api/fetch-tools (ingestion pipeline)
│   ├── components/
│   │   ├── StatsBar.tsx
│   │   ├── CategorySection.tsx
│   │   ├── ToolCard.tsx
│   │   └── SyncButton.tsx
│   └── lib/
│       ├── prisma.ts         # Prisma client singleton
│       └── anthropic.ts      # Anthropic client singleton
├── .env.local.example        # Copy this to .env.local and fill in keys
└── vercel.json               # Cron: daily at 01:00 UTC
```

---

## Deploying to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add these environment variables in the Vercel dashboard:
   - `DATABASE_URL` — for production use a hosted DB like [Turso](https://turso.tech) (LibSQL/SQLite-compatible)
   - `ANTHROPIC_API_KEY`
   - `EXA_API_KEY`
4. The `vercel.json` cron will automatically call `/api/fetch-tools` every day at 01:00 UTC

---

## Re-seeding the database

```bash
# via npm script
npm run seed

# or via API (dev only, blocked in production)
curl -X POST http://localhost:3000/api/seed
```
