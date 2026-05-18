import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  Clock3,
  Flame,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { AssistantPortraitCard } from "@/components/assistant-portrait-card";
import { WorkerAgentCard } from "@/components/worker-agent-card";

const systems = {
  instagrow: {
    title: "InstaGrow Monitor",
    subtitle: "Instagram operating lane",
    accounts: [
      {
        id: "akun-1",
        handle: "@akun_1",
        status: "Running",
        currentStep: "Creative",
        owner: "Pixel",
        nextGate: "Creative QA",
        lastUpdate: "2m ago",
        activeStage: "Creative",
      },
      {
        id: "akun-2",
        handle: "@akun_2",
        status: "Waiting Approval",
        currentStep: "Approval",
        owner: "Quill",
        nextGate: "Chief review",
        lastUpdate: "18m ago",
        activeStage: "Approval",
      },
      {
        id: "akun-3",
        handle: "@akun_3",
        status: "Idle",
        currentStep: "Analytics",
        owner: "Dispatch",
        nextGate: "Next brief",
        lastUpdate: "1h ago",
        activeStage: "Analytics",
      },
    ],
    roster: [
      {
        id: "instagrow-conductor",
        name: "Maestro",
        model: "anthropic/claude-sonnet-4",
        provider: "openrouter",
        status: "stopped",
        defaultPortrait: "/agents/maestro.png",
      },
      {
        id: "instagrow-research",
        name: "Scout",
        model: "google/gemini-2.5-flash",
        provider: "openrouter",
        status: "stopped",
        defaultPortrait: "/agents/scout.png",
      },
      {
        id: "instagrow-content",
        name: "Quill",
        model: "anthropic/claude-sonnet-4",
        provider: "openrouter",
        status: "stopped",
        defaultPortrait: "/agents/quill.png",
      },
      {
        id: "instagrow-creative",
        name: "Pixel",
        model: "openai/gpt-5.5",
        provider: "openrouter",
        status: "stopped",
        defaultPortrait: "/agents/pixel.png",
      },
      {
        id: "instagrow-publishing",
        name: "Dispatch",
        model: "meta-llama/llama-3.3-70b-instruct",
        provider: "openrouter",
        status: "stopped",
        defaultPortrait: "/agents/dispatch.png",
      },
    ],
    activity: [
      "Pixel completed visual QA for @akun_1",
      "Quill moved @akun_2 into approval gate",
      "Dispatch logged T+24 analytics for @akun_3",
    ],
  },
  tiktokgrow: {
    title: "TikTokGrow Monitor",
    subtitle: "TikTok operating lane",
    accounts: [],
    roster: [],
    activity: [],
  },
};

type SystemPageProps = {
  params: Promise<{
    systemId: string;
  }>;
};

export default async function SystemPage({ params }: SystemPageProps) {
  const { systemId } = await params;
  const system = systems[systemId as keyof typeof systems];

  if (!system) {
    notFound();
  }

  const summary = {
    total: system.accounts.length,
    running: system.accounts.filter((account) => account.status === "Running").length,
    waiting: system.accounts.filter(
      (account) => account.status === "Waiting Approval",
    ).length,
    idle: system.accounts.filter((account) => account.status === "Idle").length,
    blocked: system.accounts.filter((account) => account.status === "Blocked").length,
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-forge-black px-6 py-8 text-white sm:px-10">
      <div className="absolute inset-0 bg-forge-grid bg-[size:72px_72px] opacity-30" />
      <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-forge-red/15 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
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
                GrowthForge
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[0.08em]">
                {system.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <LiveClock />
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to platform select
            </Link>
          </div>
        </header>

        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-forge-red">
              Agent Layer
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[0.06em]">
              Operational Agents
            </h2>
          </div>

          <AssistantPortraitCard />

          <div className="flex gap-4 overflow-x-auto pb-2 xl:grid xl:grid-cols-5 xl:overflow-visible">
            {system.roster.map((agent) => (
              <WorkerAgentCard key={agent.id} {...agent} />
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            icon={<UsersRound className="h-4 w-4" />}
            label="Total Projects"
            value={String(summary.total)}
          />
          <MetricCard
            icon={<Flame className="h-4 w-4" />}
            label="Running"
            value={String(summary.running)}
          />
          <MetricCard
            icon={<Clock3 className="h-4 w-4" />}
            label="Waiting Approval"
            value={String(summary.waiting)}
          />
          <MetricCard
            icon={<CircleDot className="h-4 w-4" />}
            label="Idle"
            value={String(summary.idle)}
          />
          <MetricCard
            icon={<ShieldAlert className="h-4 w-4" />}
            label="Blocked"
            value={String(summary.blocked)}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-forge-red">
                  Account Queue
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[0.06em]">
                  Active Accounts
                </h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/45">
                Read-only
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {system.accounts.map((account) => (
                <AccountRow key={account.handle} account={account} />
              ))}
            </div>
          </div>

          <div>
            <aside className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6">
              <div className="flex items-center gap-2 text-forge-red">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.35em]">Latest Activity</p>
              </div>
              <div className="mt-5 space-y-4">
                {system.activity.map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-6 text-white/65">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forge-red" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

const pipelineStages = [
  "Intake",
  "Research",
  "Content",
  "Creative",
  "Approval",
  "Schedule",
  "Publish",
  "Analytics",
];

function AccountRow({
  account,
}: {
  account: {
    id: string;
    handle: string;
    status: string;
    currentStep: string;
    owner: string;
    nextGate: string;
    lastUpdate: string;
    activeStage: string;
  };
}) {
  return (
    <Link
      href={`/systems/instagrow/accounts/${account.id}`}
      className="group block rounded-2xl border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-forge-red/40 hover:bg-white/[0.035]"
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1fr_1fr_1fr_0.7fr]">
        <div>
          <p className="text-lg font-medium text-white transition group-hover:text-forge-red">
            {account.handle}
          </p>
          <StatusBadge status={account.status} />
        </div>
        <DataPoint label="Current Step" value={account.currentStep} />
        <DataPoint label="Owner Agent" value={account.owner} />
        <DataPoint label="Next Gate" value={account.nextGate} />
        <DataPoint label="Last Update" value={account.lastUpdate} />
      </div>

      <div className="mt-5">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/35">
          Pipeline
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {pipelineStages.map((stage) => {
            const isActive = stage === account.activeStage;
            const isComplete =
              pipelineStages.indexOf(stage) <
              pipelineStages.indexOf(account.activeStage);

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
                {stage !== pipelineStages[pipelineStages.length - 1] && (
                  <span className="text-white/15">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Link>
  );
}

function DataPoint({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-white/35">{label}</p>
      <p className="mt-2 text-sm text-white/75">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tones: Record<string, string> = {
    Running: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    "Waiting Approval": "border-amber-400/30 bg-amber-400/10 text-amber-300",
    Idle: "border-white/15 bg-white/[0.04] text-white/55",
    Blocked: "border-red-400/30 bg-red-400/10 text-red-300",
  };

  return (
    <span
      className={[
        "mt-3 inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em]",
        tones[status] ?? tones.Idle,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-forge-red">
        {icon}
        <p className="text-xs uppercase tracking-[0.35em]">{label}</p>
      </div>
      <p className="mt-3 text-xl font-medium text-white">{value}</p>
    </div>
  );
}
