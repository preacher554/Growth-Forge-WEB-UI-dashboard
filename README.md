# GrowthForge Mission Monitor

Read-only web UI dashboard for GrowthForge systems.

This repository is intended to be easy for Hermes or another deployment agent to
pull, build, connect to real ledgers, and run on a private VPS.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts

## What this app does

GrowthForge Mission Monitor is an internal observability interface for AI growth
systems. It does not run agents, approve content, publish posts, or trigger
automation from the UI.

Current implemented flow:

1. `/`
   - GrowthForge entry screen
   - Platform choices: Instagram and TikTok
2. `/systems/instagrow`
   - InstaGrow system dashboard
   - Real-time Jakarta clock
   - Main operator card: Yuya
   - Worker agent roster cards
   - Project/account summary counts
   - Active account queue
   - Latest activity feed
3. `/systems/instagrow/accounts/[accountId]`
   - Account-level mission dashboard
   - Mission status
   - Growth target progress ring
   - Agent context
   - Operational overview
   - Token consumption
   - Quick signals
   - Top performing content
   - Recent tasks
   - Cron jobs
   - Performance charts
   - Pipeline + latest activity
4. `/systems/tiktokgrow`
   - Placeholder monitor shell for future TikTok system.

Supported mock account IDs:

- `akun-1`
- `akun-2`
- `akun-3`

## Current data state

The app currently uses inline mock data in:

- `src/app/systems/[systemId]/page.tsx`
- `src/app/systems/[systemId]/accounts/[accountId]/page.tsx`

Hermes should replace this with a selector/data layer when real GrowthForge
ledgers exist.

Recommended future structure:

```text
data/
  ledgers/
    accounts.jsonl
    projects.jsonl
    growth-targets.jsonl
    agent-activity.jsonl
    analytics-snapshots.jsonl
    publishing-log.jsonl
    cron-jobs.jsonl
  summaries/
    instagrow.md
    tiktokgrow.md

src/lib/data/
  schemas.ts
  ledger-reader.ts
  selectors.ts
```

Recommended selector functions:

```ts
getSystems()
getSystemOverview(systemId)
getAccountQueue(systemId)
getAccountDashboard(accountId)
getAgentRoster(systemId)
getAgentActivity(systemId)
getGrowthTargets(accountId)
getCronJobs(accountId)
```

UI components should call selector functions. Do not let UI components read raw
ledger files directly.

## Agent model map

Main operator:

- Yuya
  - Role: executive/operator presence
  - Current status: `standby`
  - Current model shown in UI: `anthropic/claude-sonnet-4`

InstaGrow worker agents:

- `instagrow-conductor` / Maestro
  - Role: mission control, target alignment
  - Model: `anthropic/claude-sonnet-4`
  - Provider: `openrouter`
  - Status: `stopped`
- `instagrow-research` / Scout
  - Role: research and signal validation
  - Model: `google/gemini-2.5-flash`
  - Provider: `openrouter`
  - Status: `stopped`
- `instagrow-content` / Quill
  - Role: content strategy, captions, hooks, scripts
  - Model: `anthropic/claude-sonnet-4`
  - Provider: `openrouter`
  - Status: `stopped`
- `instagrow-creative` / Pixel
  - Role: creative packaging and visual QA
  - Model: `openai/gpt-5.5`
  - Provider: `openrouter`
  - Status: `stopped`
- `instagrow-publishing` / Dispatch
  - Role: publishing queue, schedule context, T+24 analytics
  - Model: `meta-llama/llama-3.3-70b-instruct`
  - Provider: `openrouter`
  - Status: `stopped`

Hermes should treat these values as configuration, not permanent UI constants.
When real model routing exists, connect the agent cards to the current runtime
config.

## Editable portrait behavior

The Yuya card and each worker agent card support local manual portrait editing:

- upload image
- zoom
- horizontal crop
- vertical crop

Current storage mechanism:

- browser `localStorage`

Important:

- This is local to the browser where the dashboard is opened.
- It is not persisted on the server.
- Hermes can later replace this with server-backed profile/avatar config if
  shared VPS-wide portraits are required.

Default image assets live in:

```text
public/avatar-yuya.jpg
public/agents/
```

## Cron job panel

Account detail pages include a read-only `Cron Jobs` panel.

Each cron job currently has:

- schedule
- description
- creating agent

Recommended future fields:

```ts
type CronJob = {
  id: string
  accountId: string
  schedule: string
  description: string
  createdByAgent: string
  status: "active" | "paused" | "failed"
  lastRunAt?: string
  nextRunAt?: string
}
```

The UI should remain read-only. Do not add `run`, `pause`, `delete`, or `edit`
cron controls unless the product stance changes.

## Integration checklist for Hermes

When installing this on the VPS, Hermes should:

1. Pull the repository.
2. Run `npm ci`.
3. Run `npm run build`.
4. Start/restart with PM2.
5. Keep access private, preferably behind SSH tunnel or private network.
6. Connect real GrowthForge ledgers through a selector layer.
7. Preserve read-only UI behavior.
8. Do not add execution controls to the dashboard.

Suggested environment assumptions:

- Node.js 22 LTS or newer
- PM2 installed globally on the VPS
- Private/internal access only

## Local development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production build

```bash
npm ci
npm run build
npm start
```

## VPS / PM2

```bash
git pull
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

For later deploys:

```bash
git pull
npm ci
npm run build
pm2 restart growthforge-mission-monitor
```

## Product stance

- Read-only monitoring UI
- No execution buttons
- Charts live on account detail pages
- Designed for private/internal access
- Local-first data model until real ledgers or database are connected
