import Image from "next/image";
import { PlatformIcon } from "@/components/platform-icon";

const platforms = [
  {
    href: "/systems/instagrow",
    label: "Open Instagram monitor",
    icon: <InstagramIcon />,
  },
  {
    href: "/systems/tiktokgrow",
    label: "Open TikTok monitor",
    icon: <TikTokIcon />,
  },
  {
    href: "/systems/wa-agent",
    label: "Open WA Agent monitor",
    icon: <WhatsAppIcon />,
  },
  {
    href: "/war-room",
    label: "Open GrowthForge War Room",
    icon: <WarRoomIcon />,
  },
];

const leadership = [
  {
    name: "Chief",
    role: "Founder / Human Greenlight",
    scope: "Owner, final approval, direction, taste, and client-facing authority.",
    image: "/avatars/chief.svg",
    tone: "from-forge-red/35 to-orange-500/10",
    status: "Command",
  },
  {
    name: "Yuya",
    role: "Core Operator / Strategy Partner",
    scope: "Primary brain for GrowthForge strategy, system design, and cross-division oversight.",
    image: "/avatar-yuya.jpg",
    tone: "from-forge-red/25 to-white/5",
    status: "Active",
  },
];

const divisions = [
  {
    name: "InstaGrow Division",
    description: "Instagram growth system: research, content, creative, publishing, experiments.",
    lead: {
      name: "Maestro",
      role: "Conductor",
      image: "/agents/maestro.png",
    },
    agents: [
      { name: "Scout", role: "Research", image: "/agents/scout.png" },
      { name: "Quill", role: "Content", image: "/agents/quill.png" },
      { name: "Pixel", role: "Creative", image: "/agents/pixel.png" },
      { name: "Dispatch", role: "Publishing", image: "/agents/dispatch.png" },
    ],
    accent: "violet",
  },
  {
    name: "WA Agent Division",
    description: "WhatsApp sales/receptionist ops: Lia runtime, handoff safety, memory, QA.",
    lead: {
      name: "Nara",
      role: "WA Operator",
      image: "/avatar-nara.jpg",
    },
    agents: [{ name: "Lia", role: "Receptionist AI", image: "/avatar-lia.jpg" }],
    accent: "cyan",
  },
] satisfies DivisionCardProps[];

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-forge-black">
      <div className="absolute inset-0 bg-forge-grid bg-[size:72px_72px] opacity-40" />
      <div className="absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-forge-red/20 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-forge-red/10 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 sm:px-10 lg:py-14">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center pt-6 lg:pt-8">
          <div className="rounded-[2rem] border border-white/10 bg-black/50 p-4 shadow-forge backdrop-blur">
            <Image
              src="/growthforge-lockup.png"
              alt="GrowthForge logo"
              width={1175}
              height={290}
              priority
              className="h-auto w-[min(78vw,720px)]"
            />
          </div>

          <p className="mt-7 text-center text-xs uppercase tracking-[0.5em] text-white/45 sm:text-sm">
            Mission Monitor
          </p>
          <h1 className="mt-4 max-w-3xl text-center text-2xl font-medium tracking-[0.16em] text-white sm:text-4xl">
            GrowthForge Organization Map
          </h1>
          <p className="mt-4 max-w-2xl text-center text-sm leading-6 text-white/50 sm:text-base">
            A read-only view of our operating structure: who leads, which division owns what, and where each agent sits in the system.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            {platforms.map((platform) => (
              <PlatformIcon key={platform.href} {...platform} />
            ))}
          </div>
        </div>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-black/45 p-4 shadow-forge backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-forge-redSoft/80">Visual org chart</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                Chief → Yuya → Division Operators
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/45">
              Built as an observability panel only. No execution controls, no hidden actions — just structure, responsibility, and system clarity.
            </p>
          </div>

          <div className="relative mt-8">
            <div className="pointer-events-none absolute left-1/2 top-24 hidden h-[calc(100%-8rem)] w-px -translate-x-1/2 bg-gradient-to-b from-forge-red/60 via-white/15 to-transparent lg:block" />

            <div className="grid gap-4 lg:grid-cols-2">
              {leadership.map((member) => (
                <LeaderCard key={member.name} {...member} />
              ))}
            </div>

            <div className="mx-auto my-8 hidden h-10 w-px bg-gradient-to-b from-white/25 to-white/5 lg:block" />

            <div className="grid gap-5 lg:grid-cols-2">
              {divisions.map((division) => (
                <DivisionCard key={division.name} {...division} />
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

type LeaderCardProps = {
  name: string;
  role: string;
  scope: string;
  image: string;
  tone: string;
  status: string;
};

function LeaderCard({ name, role, scope, image, tone, status }: LeaderCardProps) {
  return (
    <article className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${tone} p-5 shadow-glow`}>
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-2">
          <Image src={image} alt={`${name} portrait`} width={96} height={96} className="h-20 w-20 rounded-2xl object-cover sm:h-24 sm:w-24" />
        </div>
        <div className="min-w-0">
          <div className="mb-2 inline-flex rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/55">
            {status}
          </div>
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{name}</h3>
          <p className="mt-1 text-sm font-medium text-forge-redSoft">{role}</p>
        </div>
      </div>
      <p className="relative mt-4 text-sm leading-6 text-white/58">{scope}</p>
    </article>
  );
}

type Agent = {
  name: string;
  role: string;
  image: string;
};

type DivisionCardProps = {
  name: string;
  description: string;
  lead: Agent;
  agents: Agent[];
  accent: "violet" | "cyan";
};

function DivisionCard({ name, description, lead, agents, accent }: DivisionCardProps) {
  const accentClass = accent === "cyan" ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100" : "border-violet-300/20 bg-violet-300/10 text-violet-100";

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${accentClass}`}>
            Division
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{name}</h3>
          <p className="mt-2 max-w-lg text-sm leading-6 text-white/50">{description}</p>
        </div>
        <AgentPortrait agent={lead} size="large" label="Lead" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {agents.map((agent) => (
          <AgentPortrait key={agent.name} agent={agent} />
        ))}
      </div>
    </article>
  );
}

function AgentPortrait({ agent, size = "small", label }: { agent: Agent; size?: "small" | "large"; label?: string }) {
  const imageSize = size === "large" ? "h-24 w-24" : "h-16 w-16";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-3 text-center">
      {label ? <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/35">{label}</p> : null}
      <Image src={agent.image} alt={`${agent.name} portrait`} width={96} height={96} className={`mx-auto rounded-2xl object-cover ${imageSize}`} />
      <p className="mt-3 text-sm font-semibold text-white">{agent.name}</p>
      <p className="mt-1 text-xs text-white/42">{agent.role}</p>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-16 w-16 sm:h-20 sm:w-20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-16 w-16 sm:h-20 sm:w-20"
      fill="currentColor"
    >
      <path d="M14.9 3.25c.35 2.02 1.52 3.44 3.48 4.22v3.02a8.67 8.67 0 0 1-3.44-1.03v6.07c0 3.2-2.37 5.47-5.62 5.47-3.03 0-5.39-2.2-5.39-5.2 0-3.16 2.45-5.43 5.95-5.43.32 0 .62.03.91.09v3.1a4.14 4.14 0 0 0-.91-.11c-1.63 0-2.74.94-2.74 2.3 0 1.29 1.01 2.22 2.35 2.22 1.49 0 2.43-.95 2.43-2.83V3.25h2.98Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-16 w-16 sm:h-20 sm:w-20"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function WarRoomIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-16 w-16 sm:h-20 sm:w-20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.65"
    >
      <path d="M4.75 5.5h10.5a2.75 2.75 0 0 1 2.75 2.75v4.5a2.75 2.75 0 0 1-2.75 2.75H10l-4.25 3v-3H4.75A2.75 2.75 0 0 1 2 12.75v-4.5A2.75 2.75 0 0 1 4.75 5.5Z" />
      <path d="M18 9.25h1.25A2.75 2.75 0 0 1 22 12v3.25A2.75 2.75 0 0 1 19.25 18H19v2.5L15.5 18H12" />
      <path d="M6.75 9.5h6.5" />
      <path d="M6.75 12h4.75" />
      <circle cx="17.75" cy="5.75" r="1.45" fill="currentColor" stroke="none" />
    </svg>
  );
}
