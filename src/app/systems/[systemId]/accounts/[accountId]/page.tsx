import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PerformanceCharts } from "@/components/performance-charts";

const accountDetails = {
  "akun-1": {
    handle: "@akun_1",
    mission: {
      currentStep: "Publishing",
      owner: "Dispatch",
      next: "Collect T+24 analytics",
    },
    target: {
      target: 1000,
      current: 410,
      progress: 41,
      deadline: "30 Jun 2026",
      daysLeft: 43,
      requiredPace: "14/day",
      currentPace: "17/day",
      status: "On Track",
    },
    agentView: [
      { name: "Maestro", context: "monitor target alignment" },
      { name: "Scout", context: "research signal validation" },
      { name: "Dispatch", context: "publishing + T+24 analytics" },
      { name: "Quill", context: "pakai target untuk CTA/caption" },
      { name: "Pixel", context: "creative QA passed" },
    ],
    charts: {
      followerGrowth: [
        { day: "D1", followers: 300, target: 320 },
        { day: "D2", followers: 326, target: 338 },
        { day: "D3", followers: 351, target: 356 },
        { day: "D4", followers: 373, target: 374 },
        { day: "D5", followers: 389, target: 392 },
        { day: "D6", followers: 401, target: 410 },
        { day: "D7", followers: 410, target: 428 },
      ],
      dailyGrowth: [
        { day: "Mon", growth: 12 },
        { day: "Tue", growth: 18 },
        { day: "Wed", growth: 25 },
        { day: "Thu", growth: 22 },
        { day: "Fri", growth: 16 },
        { day: "Sat", growth: 12 },
        { day: "Sun", growth: 9 },
      ],
      postsPublished: [
        { week: "W1", posts: 3 },
        { week: "W2", posts: 4 },
        { week: "W3", posts: 5 },
        { week: "W4", posts: 4 },
      ],
      reachTrend: [
        { day: "D1", reach: 1200 },
        { day: "D2", reach: 1460 },
        { day: "D3", reach: 1710 },
        { day: "D4", reach: 1620 },
        { day: "D5", reach: 1940 },
        { day: "D6", reach: 2240 },
        { day: "D7", reach: 2410 },
      ],
    },
    pulse: {
      totalTasks: 24,
      monthlyChange: "+19.23%",
      tokenSpend: "$23,094.57",
      budgetUsed: 46,
      avgMonthly: "$16,430.12",
      activity: [
        { label: "Mar 1", value: 720 },
        { label: "Mar 10", value: 1180 },
        { label: "Mar 20", value: 2410 },
        { label: "Mar 30", value: 2640 },
      ],
      signals: [
        "Publishing window opens at 18:30",
        "T+24 analytics collection pending",
        "Current pace is above target pace",
        "Creative QA already passed",
      ],
    },
    topContent: [
      { title: "AI Tools That Save You 10+ Hours/Week", format: "Reel", views: "128.4K", lift: "+23.5%" },
      { title: "Will AI Replace You?", format: "Carousel", views: "98.7K", lift: "+18.2%" },
      { title: "Build Passive Income with AI Content", format: "Reel", views: "87.1K", lift: "+15.7%" },
    ],
    recentTasks: [
      { id: "#1247", task: "Generate Reel Script", agent: "Quill", type: "Content", status: "Done", tokens: "12.4k" },
      { id: "#1246", task: "Render Thumbnail", agent: "Pixel", type: "Media", status: "Done", tokens: "8.7k" },
      { id: "#1245", task: "Schedule to Instagram", agent: "Dispatch", type: "Publish", status: "Done", tokens: "2.1k" },
      { id: "#1244", task: "Analyze Performance", agent: "Maestro", type: "Analytics", status: "Done", tokens: "9.8k" },
    ],
    cronJobs: [
      {
        schedule: "Daily · 18:30",
        description: "Check publish window and sync scheduled content status.",
        agent: "Dispatch",
      },
      {
        schedule: "Daily · 19:00",
        description: "Collect T+24 analytics after latest publishing cycle.",
        agent: "Dispatch",
      },
      {
        schedule: "Every Monday · 08:00",
        description: "Review target alignment and weekly growth pace.",
        agent: "Maestro",
      },
    ],
    pipeline: [
      "Intake",
      "Research",
      "Content",
      "Creative",
      "Approval",
      "Schedule",
      "Publish",
      "Analytics",
    ],
    activePipelineStage: "Publish",
    latestActivity: [
      "Dispatch queued publish window for 18:30",
      "Pixel marked creative QA as passed",
      "Quill revised CTA against follower target",
    ],
  },
  "akun-2": {
    handle: "@akun_2",
    mission: {
      currentStep: "Approval",
      owner: "Quill",
      next: "Chief review",
    },
    target: {
      target: 1500,
      current: 620,
      progress: 41,
      deadline: "30 Jun 2026",
      daysLeft: 43,
      requiredPace: "21/day",
      currentPace: "18/day",
      status: "Needs Attention",
    },
    agentView: [
      { name: "Maestro", context: "monitor target gap" },
      { name: "Scout", context: "validate hooks and audience signal" },
      { name: "Dispatch", context: "waiting on approval gate" },
      { name: "Quill", context: "CTA adjusted for conversion lift" },
      { name: "Pixel", context: "creative ready for final review" },
    ],
    charts: {
      followerGrowth: [
        { day: "D1", followers: 520, target: 548 },
        { day: "D2", followers: 541, target: 569 },
        { day: "D3", followers: 560, target: 590 },
        { day: "D4", followers: 577, target: 611 },
        { day: "D5", followers: 596, target: 632 },
        { day: "D6", followers: 608, target: 653 },
        { day: "D7", followers: 620, target: 674 },
      ],
      dailyGrowth: [
        { day: "Mon", growth: 10 },
        { day: "Tue", growth: 21 },
        { day: "Wed", growth: 19 },
        { day: "Thu", growth: 17 },
        { day: "Fri", growth: 19 },
        { day: "Sat", growth: 12 },
        { day: "Sun", growth: 12 },
      ],
      postsPublished: [
        { week: "W1", posts: 4 },
        { week: "W2", posts: 4 },
        { week: "W3", posts: 3 },
        { week: "W4", posts: 4 },
      ],
      reachTrend: [
        { day: "D1", reach: 1480 },
        { day: "D2", reach: 1620 },
        { day: "D3", reach: 1740 },
        { day: "D4", reach: 1690 },
        { day: "D5", reach: 1810 },
        { day: "D6", reach: 1880 },
        { day: "D7", reach: 1910 },
      ],
    },
    pulse: {
      totalTasks: 18,
      monthlyChange: "+8.40%",
      tokenSpend: "$14,632.20",
      budgetUsed: 39,
      avgMonthly: "$12,908.34",
      activity: [
        { label: "Mar 1", value: 510 },
        { label: "Mar 10", value: 760 },
        { label: "Mar 20", value: 980 },
        { label: "Mar 30", value: 1120 },
      ],
      signals: [
        "Approval gate is currently active",
        "Follower pace is below target",
        "Caption set waiting for Chief review",
        "Creative package is already prepared",
      ],
    },
    topContent: [
      { title: "3 Hooks That Lift Saves", format: "Carousel", views: "72.4K", lift: "+14.3%" },
      { title: "Why Your CTA Fails", format: "Reel", views: "64.8K", lift: "+11.8%" },
      { title: "Caption Anatomy", format: "Post", views: "52.1K", lift: "+9.4%" },
    ],
    recentTasks: [
      { id: "#1182", task: "Draft Caption Set", agent: "Quill", type: "Content", status: "Done", tokens: "10.1k" },
      { id: "#1181", task: "Creative QA", agent: "Pixel", type: "Media", status: "Done", tokens: "6.2k" },
      { id: "#1180", task: "Target Gap Review", agent: "Maestro", type: "Analytics", status: "Done", tokens: "7.8k" },
      { id: "#1179", task: "Approval Queue Sync", agent: "Dispatch", type: "Publish", status: "Waiting", tokens: "1.4k" },
    ],
    cronJobs: [
      {
        schedule: "Daily · 09:00",
        description: "Refresh approval queue and pending creative packages.",
        agent: "Dispatch",
      },
      {
        schedule: "Daily · 11:00",
        description: "Validate hook set against latest audience research.",
        agent: "Scout",
      },
      {
        schedule: "Every Friday · 17:00",
        description: "Flag accounts below required pace for review.",
        agent: "Maestro",
      },
    ],
    pipeline: [
      "Intake",
      "Research",
      "Content",
      "Creative",
      "Approval",
      "Schedule",
      "Publish",
      "Analytics",
    ],
    activePipelineStage: "Approval",
    latestActivity: [
      "Quill submitted caption set for approval",
      "Pixel attached final creative package",
      "Maestro flagged pace below target",
    ],
  },
  "akun-3": {
    handle: "@akun_3",
    mission: {
      currentStep: "Analytics",
      owner: "Dispatch",
      next: "Generate next brief",
    },
    target: {
      target: 800,
      current: 520,
      progress: 65,
      deadline: "30 Jun 2026",
      daysLeft: 43,
      requiredPace: "7/day",
      currentPace: "9/day",
      status: "On Track",
    },
    agentView: [
      { name: "Maestro", context: "monitor lead over target pace" },
      { name: "Scout", context: "surface next research angle" },
      { name: "Dispatch", context: "closing analytics loop" },
      { name: "Quill", context: "prepare next content angle" },
      { name: "Pixel", context: "review next creative brief" },
    ],
    charts: {
      followerGrowth: [
        { day: "D1", followers: 468, target: 472 },
        { day: "D2", followers: 478, target: 479 },
        { day: "D3", followers: 489, target: 486 },
        { day: "D4", followers: 497, target: 493 },
        { day: "D5", followers: 506, target: 500 },
        { day: "D6", followers: 514, target: 507 },
        { day: "D7", followers: 520, target: 514 },
      ],
      dailyGrowth: [
        { day: "Mon", growth: 7 },
        { day: "Tue", growth: 10 },
        { day: "Wed", growth: 11 },
        { day: "Thu", growth: 8 },
        { day: "Fri", growth: 9 },
        { day: "Sat", growth: 8 },
        { day: "Sun", growth: 6 },
      ],
      postsPublished: [
        { week: "W1", posts: 2 },
        { week: "W2", posts: 3 },
        { week: "W3", posts: 4 },
        { week: "W4", posts: 3 },
      ],
      reachTrend: [
        { day: "D1", reach: 920 },
        { day: "D2", reach: 1080 },
        { day: "D3", reach: 1180 },
        { day: "D4", reach: 1160 },
        { day: "D5", reach: 1260 },
        { day: "D6", reach: 1390 },
        { day: "D7", reach: 1510 },
      ],
    },
    pulse: {
      totalTasks: 16,
      monthlyChange: "+12.16%",
      tokenSpend: "$11,402.90",
      budgetUsed: 31,
      avgMonthly: "$9,830.44",
      activity: [
        { label: "Mar 1", value: 430 },
        { label: "Mar 10", value: 590 },
        { label: "Mar 20", value: 780 },
        { label: "Mar 30", value: 940 },
      ],
      signals: [
        "Account is ahead of target pace",
        "Analytics loop has been closed",
        "Next brief is ready to draft",
        "Reach trend remains positive",
      ],
    },
    topContent: [
      { title: "Micro-Wins Compound", format: "Reel", views: "61.3K", lift: "+13.2%" },
      { title: "The 7-Day Growth Loop", format: "Carousel", views: "54.8K", lift: "+10.6%" },
      { title: "Small Account, Big Signal", format: "Post", views: "48.2K", lift: "+8.9%" },
    ],
    recentTasks: [
      { id: "#1103", task: "Log T+24 Snapshot", agent: "Dispatch", type: "Analytics", status: "Done", tokens: "2.9k" },
      { id: "#1102", task: "Pace Confirmation", agent: "Maestro", type: "Analytics", status: "Done", tokens: "5.2k" },
      { id: "#1101", task: "Open Next Brief", agent: "Quill", type: "Content", status: "Done", tokens: "6.8k" },
      { id: "#1100", task: "Creative Direction Note", agent: "Pixel", type: "Media", status: "Done", tokens: "4.4k" },
    ],
    cronJobs: [
      {
        schedule: "Daily · 08:30",
        description: "Summarize overnight analytics movement.",
        agent: "Dispatch",
      },
      {
        schedule: "Every Tuesday · 10:00",
        description: "Open next research angle recommendation.",
        agent: "Scout",
      },
      {
        schedule: "Every Monday · 08:00",
        description: "Confirm account remains ahead of target pace.",
        agent: "Maestro",
      },
    ],
    pipeline: [
      "Intake",
      "Research",
      "Content",
      "Creative",
      "Approval",
      "Schedule",
      "Publish",
      "Analytics",
    ],
    activePipelineStage: "Analytics",
    latestActivity: [
      "Dispatch logged T+24 performance snapshot",
      "Maestro confirmed account is ahead of pace",
      "Quill opened next brief recommendation",
    ],
  },
} as const;

type AccountPageProps = {
  params: Promise<{
    systemId: string;
    accountId: string;
  }>;
};

export default async function AccountPage({ params }: AccountPageProps) {
  const { systemId, accountId } = await params;

  if (systemId !== "instagrow") {
    notFound();
  }

  const account = accountDetails[accountId as keyof typeof accountDetails];

  if (!account) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-forge-black px-6 py-8 text-white sm:px-10">
      <div className="absolute inset-0 bg-forge-grid bg-[size:72px_72px] opacity-25" />
      <div className="absolute right-[-10rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-forge-red/15 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/growthforge-mark.png"
              alt="GrowthForge mark"
              width={72}
              height={72}
              className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                InstaGrow / Account
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[0.08em]">
                {account.handle}
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <LiveClock />
            <Link
              href="/systems/instagrow"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to InstaGrow
            </Link>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.15fr_0.7fr]">
          <Panel eyebrow="Mission Status">
            <div className="space-y-5">
              <DataPoint label="Current Step" value={account.mission.currentStep} />
              <DataPoint label="Owner" value={account.mission.owner} />
              <DataPoint label="Next" value={account.mission.next} />
            </div>
          </Panel>

          <Panel eyebrow="Growth Target">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-center">
              <ProgressRing progress={account.target.progress} />
              <div className="grid gap-4 sm:grid-cols-2">
                <DataPoint label="Target" value={`${account.target.target} followers`} />
                <DataPoint label="Current" value={String(account.target.current)} />
                <DataPoint label="Deadline" value={account.target.deadline} />
                <DataPoint label="Days Left" value={String(account.target.daysLeft)} />
                <DataPoint label="Required Pace" value={account.target.requiredPace} />
                <DataPoint label="Current Pace" value={account.target.currentPace} />
                <div className="sm:col-span-2">
                  <StatusPill label="Status" value={account.target.status} />
                </div>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="Agent View">
            <div className="space-y-4">
              {account.agentView.map((agent) => (
                <div
                  key={agent.name}
                  className="border-b border-white/8 pb-4 last:border-b-0 last:pb-0"
                >
                  <p className="font-medium text-white">{agent.name}</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">{agent.context}</p>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-forge-red">
              Account Intelligence
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[0.06em]">
              Operational Overview
            </h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.85fr]">
            <Panel eyebrow="Swarm Activity">
              <MiniTrendChart points={account.pulse.activity} />
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-white/45">Total tasks executed</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {account.pulse.totalTasks}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/45">This month</p>
                  <p className="mt-2 text-sm font-medium text-emerald-300">
                    {account.pulse.monthlyChange}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel eyebrow="Token Consumption">
              <p className="text-3xl font-semibold tracking-[0.04em] text-white">
                {account.pulse.tokenSpend}
              </p>
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm text-white/45">
                  <span>Consumed of monthly budget</span>
                  <span>{account.pulse.budgetUsed}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-forge-red"
                    style={{ width: `${account.pulse.budgetUsed}%` }}
                  />
                </div>
              </div>
              <p className="mt-4 text-sm text-white/45">
                Monthly avg. {account.pulse.avgMonthly}
              </p>
            </Panel>

            <Panel eyebrow="Quick Signals">
              <div className="space-y-3">
                {account.pulse.signals.map((signal) => (
                  <div
                    key={signal}
                    className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-3"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-forge-red" />
                    <p className="text-sm leading-6 text-white/65">{signal}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
            <Panel eyebrow="Top Performing Content">
              <div className="space-y-4">
                {account.topContent.map((content) => (
                  <div
                    key={content.title}
                    className="flex items-center justify-between gap-4 border-b border-white/8 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{content.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/35">
                        {content.format}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/80">{content.views}</p>
                      <p className="mt-1 text-xs text-emerald-300">{content.lift}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel eyebrow="Recent Tasks">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.24em] text-white/35">
                      <th className="pb-3 font-medium">#</th>
                      <th className="pb-3 font-medium">Task</th>
                      <th className="pb-3 font-medium">Agent</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {account.recentTasks.map((task) => (
                      <tr key={task.id} className="border-b border-white/8 last:border-b-0">
                        <td className="py-3 text-white/35">{task.id}</td>
                        <td className="py-3 text-white/80">{task.task}</td>
                        <td className="py-3 text-white/65">{task.agent}</td>
                        <td className="py-3 text-white/55">{task.type}</td>
                        <td className="py-3">
                          <TaskStatus value={task.status} />
                        </td>
                        <td className="py-3 text-white/55">{task.tokens}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          <Panel eyebrow="Cron Jobs">
            <div className="grid gap-4 lg:grid-cols-3">
              {account.cronJobs.map((job) => (
                <div
                  key={`${job.schedule}-${job.agent}`}
                  className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                    Schedule
                  </p>
                  <p className="mt-2 text-base font-medium text-white">{job.schedule}</p>
                  <p className="mt-4 text-sm leading-6 text-white/60">{job.description}</p>
                  <div className="mt-5 border-t border-white/8 pt-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                      Created by
                    </p>
                    <p className="mt-2 text-sm text-white/75">{job.agent}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-forge-red">
              Charts
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[0.06em]">
              Performance Signals
            </h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <PerformanceCharts charts={account.charts} />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Panel eyebrow="Pipeline">
            <div className="flex flex-wrap items-center gap-2">
              {account.pipeline.map((stage) => {
                const currentIndex = account.pipeline.indexOf(account.activePipelineStage);
                const stageIndex = account.pipeline.indexOf(stage);
                const isActive = stage === account.activePipelineStage;
                const isComplete = stageIndex < currentIndex;

                return (
                  <div key={stage} className="flex items-center gap-2">
                    <span
                      className={[
                        "rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.25em]",
                        isActive
                          ? "border-forge-red/60 bg-forge-red/15 text-forge-red"
                          : isComplete
                            ? "border-white/15 bg-white/[0.04] text-white/70"
                            : "border-white/10 bg-transparent text-white/30",
                      ].join(" ")}
                    >
                      {stage}
                    </span>
                    {stage !== account.pipeline[account.pipeline.length - 1] && (
                      <span className="text-white/15">→</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel eyebrow="Latest Activity">
            <div className="space-y-4">
              {account.latestActivity.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-white/65">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forge-red" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function MiniTrendChart({
  points,
}: {
  points: ReadonlyArray<{ label: string; value: number }>;
}) {
  const max = Math.max(...points.map((point) => point.value));
  const min = Math.min(...points.map((point) => point.value));
  const span = max - min || 1;
  const polyline = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point.value - min) / span) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <svg viewBox="0 0 100 100" className="h-36 w-full overflow-visible">
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,59,0,0.34)" />
            <stop offset="100%" stopColor="rgba(255,59,0,0)" />
          </linearGradient>
        </defs>
        <polyline
          points={`${polyline} 100,100 0,100`}
          fill="url(#trend-fill)"
          stroke="none"
        />
        <polyline
          points={polyline}
          fill="none"
          stroke="#ff3b00"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.22em] text-white/30">
        {points.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}

function TaskStatus({ value }: { value: string }) {
  const tone =
    value === "Done"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      : "border-amber-400/30 bg-amber-400/10 text-amber-300";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.22em]",
        tone,
      ].join(" ")}
    >
      {value}
    </span>
  );
}

function Panel({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-forge-red">{eyebrow}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function DataPoint({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-white/35">{label}</p>
      <p className="mt-2 text-base text-white/80">{value}</p>
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  const tone =
    value === "Needs Attention"
      ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
      : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-white/35">{label}</p>
      <span
        className={[
          "mt-2 inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em]",
          tone,
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
      <svg className="h-48 w-48 -rotate-90" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="#ff3b00"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-5xl font-semibold tracking-tight text-white">{progress}%</p>
        <p className="mt-2 text-xs uppercase tracking-[0.35em] text-white/40">
          Progress
        </p>
      </div>
    </div>
  );
}
