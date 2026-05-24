import { execFileSync } from "child_process";
import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

type AgentConfig = {
  id: string;
  name: string;
  role: string;
  model: string;
  provider: string;
  status: string;
  workdir: string;
  defaultPortrait: string;
};

type ProjectRuntime = {
  id: string;
  handle: string;
  status: string;
  currentStep: string;
  owner: string;
  nextGate: string;
  lastUpdate: string;
  activeStage: string;
  path: string;
  repo?: string;
  branch?: string;
  commit?: string;
};

type LedgerAccountRecord = {
  systemId: string;
  id: string;
  handle: string;
  status: string;
  currentStep: string;
  owner: string;
  nextGate: string;
  lastUpdate: string;
  activeStage: string;
  mode?: string;
  workspace?: string;
};

type AccountDashboardRecord = {
  systemId: string;
  accountId: string;
  handle: string;
  mission: { currentStep: string; owner: string; next: string };
  target: {
    target: number;
    current: number;
    progress: number;
    deadline: string;
    daysLeft: number;
    requiredPace: string;
    currentPace: string;
    status: string;
  };
  agentView: { name: string; context: string }[];
  charts: {
    followerGrowth: { day: string; followers: number; target: number }[];
    dailyGrowth: { day: string; growth: number }[];
    postsPublished: { week: string; posts: number }[];
    reachTrend: { day: string; reach: number }[];
  };
  pulse: {
    totalTasks: number;
    monthlyChange: string;
    tokenSpend: string;
    budgetUsed: number;
    avgMonthly: string;
    activity: { label: string; value: number }[];
    signals: string[];
  };
  topContent: { title: string; format: string; views: string; lift: string }[];
  recentTasks: { id: string; task: string; agent: string; type: string; status: string; tokens: string }[];
  cronJobs: { schedule: string; description: string; agent: string }[];
  pipeline: string[];
  activePipelineStage: string;
  latestActivity: string[];
};

const HERMES_HOME = "/root/.hermes";
const PROFILES_DIR = join(HERMES_HOME, "profiles");
const WORKSPACE_DIR = "/root/hermes-workspace";
const LEDGER_DIR = join(process.cwd(), "data", "ledgers");

const workerMeta: Record<string, { name: string; role: string; portrait: string; ownerStage: string }> = {
  "instagrow-conductor": {
    name: "Maestro",
    role: "mission control, target alignment",
    portrait: "/agents/maestro.png",
    ownerStage: "Intake",
  },
  "instagrow-research": {
    name: "Scout",
    role: "cross-platform research and signal validation",
    portrait: "/agents/scout.png",
    ownerStage: "Research",
  },
  "instagrow-content": {
    name: "Quill",
    role: "content strategy, captions, hooks, scripts",
    portrait: "/agents/quill.png",
    ownerStage: "Content",
  },
  "instagrow-creative": {
    name: "Pixel",
    role: "creative packaging and visual QA",
    portrait: "/agents/pixel.png",
    ownerStage: "Creative",
  },
  "instagrow-publishing": {
    name: "Dispatch",
    role: "publishing queue, schedule context, analytics loop",
    portrait: "/agents/dispatch.png",
    ownerStage: "Publish",
  },
};

const infrastructureSources = [
  {
    id: "growthforge-core",
    handle: "GrowthForge Core",
    path: "/root/repos/growthforge",
    currentStep: "Foundation",
    owner: "Yuya",
    nextGate: "Keep SOP/source-of-truth aligned",
    activeStage: "Intake",
  },
  {
    id: "instagrow-system",
    handle: "InstaGrow System",
    path: "/root/work/growthforge-instagram",
    currentStep: "Operations",
    owner: "Maestro",
    nextGate: "Route missions through worker gates",
    activeStage: "Research",
  },
  {
    id: "mission-monitor",
    handle: "Mission Monitor UI",
    path: "/root/repos/Growth-Forge-WEB-UI-dashboard",
    currentStep: "Live Dashboard",
    owner: "Yuya",
    nextGate: "Connect selector layer to real ledgers",
    activeStage: "Analytics",
  },
  {
    id: "hermes-workspace",
    handle: "Hermes Workspace",
    path: "/root/hermes-workspace",
    currentStep: "Control Office",
    owner: "Yuya",
    nextGate: "Observe agent roster and swarm health",
    activeStage: "Schedule",
  },
];

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

function safeRead(path: string) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function readJsonl<T>(fileName: string): T[] {
  const text = safeRead(join(LEDGER_DIR, fileName));
  if (!text.trim()) return [];

  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}

function yamlValue(text: string, key: string) {
  const match = text.match(new RegExp(`^\\s*${key}:\\s*["']?([^"'\\n#]+)`, "m"));
  return match?.[1]?.trim() ?? "";
}

function nestedYamlValue(text: string, section: string, key: string) {
  const lines = text.split(/\r?\n/);
  let inSection = false;
  for (const line of lines) {
    if (new RegExp(`^${section}:\\s*$`).test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^\S/.test(line)) {
      break;
    }
    if (inSection) {
      const match = line.match(new RegExp(`^\\s+${key}:\\s*["']?([^"'\\n#]+)`));
      if (match) return match[1].trim();
    }
  }
  return "";
}

function runGit(path: string, args: string[]) {
  try {
    return execFileSync("git", args, { cwd: path, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function pm2List() {
  try {
    return JSON.parse(execFileSync("pm2", ["jlist"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })) as Array<{
      name?: string;
      pm2_env?: { status?: string; restart_time?: number; pm_uptime?: number; pm_cwd?: string; args?: string[] };
      monit?: { memory?: number; cpu?: number };
    }>;
  } catch {
    return [];
  }
}

function profileStatusMap() {
  try {
    const out = execFileSync("hermes", ["profile", "list"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const map: Record<string, string> = {};
    for (const line of out.split(/\r?\n/)) {
      for (const profile of ["default", ...Object.keys(workerMeta)]) {
        if (line.includes(profile)) {
          map[profile] = line.includes("running") ? "running" : line.includes("stopped") ? "stopped" : "unknown";
        }
      }
    }
    return map;
  } catch {
    return {};
  }
}

export function getMainOperator() {
  const cfg = safeRead(join(HERMES_HOME, "config.yaml"));
  const statuses = profileStatusMap();
  return {
    id: "yuya",
    name: "Yuya",
    model: nestedYamlValue(cfg, "model", "default") || yamlValue(cfg, "default") || "unknown",
    provider: nestedYamlValue(cfg, "model", "provider") || "unknown",
    status: statuses.default ?? "running",
    defaultPortrait: "/avatar-yuya.jpg",
  };
}

export function getWorkerRoster(): AgentConfig[] {
  const statuses = profileStatusMap();
  return Object.entries(workerMeta).map(([id, meta]) => {
    const cfg = safeRead(join(PROFILES_DIR, id, "config.yaml"));
    return {
      id,
      name: meta.name,
      role: meta.role,
      model: nestedYamlValue(cfg, "model", "default") || "unknown",
      provider: nestedYamlValue(cfg, "model", "provider") || "unknown",
      status: statuses[id] ?? "stopped",
      workdir: nestedYamlValue(cfg, "agent", "workdir") || join(WORKSPACE_DIR, "instagrow", id.replace("instagrow-", "")),
      defaultPortrait: meta.portrait,
    };
  });
}

export function getProjects(): ProjectRuntime[] {
  const pm2 = pm2List();
  return infrastructureSources.map((project) => {
    const exists = existsSync(project.path);
    const branch = exists ? runGit(project.path, ["rev-parse", "--abbrev-ref", "HEAD"]) : "";
    const commit = exists ? runGit(project.path, ["log", "-1", "--pretty=%h · %ad · %s", "--date=short"]) : "";
    const repo = exists ? runGit(project.path, ["config", "--get", "remote.origin.url"]) : "";
    const pm2Process = pm2.find((item) => item.name === "growthforge-mission-monitor" && project.id === "mission-monitor")
      ?? pm2.find((item) => item.pm2_env?.pm_cwd === project.path);
    const status = pm2Process?.pm2_env?.status === "online" ? "Running" : exists ? "Standby" : "Blocked";
    return {
      ...project,
      status,
      branch,
      repo,
      commit,
      lastUpdate: commit ? commit.split(" · ").slice(0, 2).join(" · ") : exists ? "local only" : "missing",
    };
  });
}

export function getActiveInstagramAccounts(): ProjectRuntime[] {
  // Account Queue is intentionally reserved for real Instagram/client account
  // missions. Source repos, Mission Monitor, Hermes workspace, and other
  // platform infrastructure belong to the system layer, not this queue.
  // Sandbox ledgers are allowed here because they simulate a real client account
  // workflow while GrowthForge waits for live accounts.
  return readJsonl<LedgerAccountRecord>("accounts.jsonl")
    .filter((account) => account.systemId === "instagrow")
    .map((account): ProjectRuntime => ({
      id: account.id,
      handle: account.handle,
      status: account.status,
      currentStep: account.currentStep,
      owner: account.owner,
      nextGate: account.nextGate,
      lastUpdate: account.lastUpdate,
      activeStage: account.activeStage,
      path: account.workspace ? join(process.cwd(), account.workspace) : process.cwd(),
      repo: "sandbox-ledger",
      branch: account.mode ?? "sandbox",
      commit: "local JSONL ledger",
    }));
}

export function getSystemOverview(systemId: string) {
  if (systemId === "tiktokgrow") {
    return {
      title: "TikTokGrow Monitor",
      subtitle: "TikTok operating lane — placeholder until TikTok worker group exists",
      accounts: [] as ProjectRuntime[],
      roster: [] as AgentConfig[],
      activity: ["TikTokGrow has no real worker profiles configured yet."],
      mainOperator: getMainOperator(),
    };
  }

  if (systemId !== "instagrow") return null;

  const projects = getProjects();
  const accounts = getActiveInstagramAccounts();
  const roster = getWorkerRoster();
  const mainOperator = getMainOperator();
  const activeWorkers = roster.filter((agent) => agent.status === "running").length;
  return {
    title: "InstaGrow Monitor",
    subtitle: "Instagram operating lane — connected to Hermes profiles, PM2, and local source-of-truth repos",
    accounts,
    roster,
    mainOperator,
    activity: [
      `Yuya profile is ${mainOperator.status} on ${mainOperator.provider}/${mainOperator.model}`,
      `${roster.length} InstaGrow worker profiles configured · ${activeWorkers} currently running`,
      `${accounts.length} active Instagram account projects connected`,
      `Mission Monitor PM2 service is ${projects.find((p) => p.id === "mission-monitor")?.status ?? "unknown"}`,
    ],
  };
}

function countFiles(path: string) {
  try {
    return readdirSync(path, { recursive: true }).filter((entry) => !String(entry).includes("node_modules") && !String(entry).includes(".git")).length;
  } catch {
    return 0;
  }
}

export function getAccountDashboard(accountId: string) {
  const ledgerDashboard = readJsonl<AccountDashboardRecord>("account-dashboards.jsonl").find(
    (account) => account.systemId === "instagrow" && account.accountId === accountId,
  );

  if (ledgerDashboard) return ledgerDashboard;

  const project = getActiveInstagramAccounts().find((item) => item.id === accountId);
  if (!project) return null;

  const roster = getWorkerRoster();
  const pm2 = pm2List();
  const service = pm2.find((item) => item.name === "growthforge-mission-monitor");
  const fileCount = countFiles(project.path);
  const workerCount = roster.length;
  const runningWorkers = roster.filter((agent) => agent.status === "running").length;
  const progress = project.status === "Running" ? 100 : project.status === "Standby" ? 70 : 20;

  return {
    handle: project.handle,
    mission: {
      currentStep: project.currentStep,
      owner: project.owner,
      next: project.nextGate,
    },
    target: {
      target: 100,
      current: progress,
      progress,
      deadline: "Operational — no fixed campaign deadline",
      daysLeft: 0,
      requiredPace: "read-only monitor",
      currentPace: project.status,
      status: project.status === "Blocked" ? "Needs Attention" : "Connected",
    },
    agentView: [
      { name: "Yuya", context: `${getMainOperator().provider}/${getMainOperator().model} · operator layer` },
      ...roster.map((agent) => ({ name: agent.name, context: `${agent.status} · ${agent.provider}/${agent.model}` })),
    ],
    charts: {
      followerGrowth: [
        { day: "Repos", followers: getProjects().filter((p) => p.status !== "Blocked").length, target: infrastructureSources.length },
        { day: "Workers", followers: workerCount, target: workerCount },
        { day: "Running", followers: runningWorkers + (project.status === "Running" ? 1 : 0), target: workerCount + 1 },
      ],
      dailyGrowth: [
        { day: "Files", growth: Math.max(fileCount, 1) },
        { day: "Agents", growth: workerCount },
        { day: "PM2", growth: pm2.filter((p) => p.pm2_env?.status === "online").length },
      ],
      postsPublished: [
        { week: "Repos", posts: getProjects().length },
        { week: "Profiles", posts: workerCount + 1 },
        { week: "Services", posts: pm2.length },
      ],
      reachTrend: [
        { day: "CPU", reach: Math.round((service?.monit?.cpu ?? 0) * 100) },
        { day: "Mem", reach: Math.round((service?.monit?.memory ?? 0) / 1024 / 1024) },
        { day: "Files", reach: fileCount },
      ],
    },
    pulse: {
      totalTasks: fileCount,
      monthlyChange: project.branch ? project.branch : "local",
      tokenSpend: `${workerCount + 1} profiles`,
      budgetUsed: Math.min(100, Math.max(5, progress)),
      avgMonthly: project.repo ? "Git remote connected" : "No remote detected",
      activity: [
        { label: "Repos", value: getProjects().length },
        { label: "Workers", value: workerCount },
        { label: "PM2", value: pm2.length },
        { label: "Files", value: Math.min(fileCount, 1000) },
      ],
      signals: [
        `Path: ${project.path}`,
        `Branch: ${project.branch || "unknown"}`,
        `Latest: ${project.commit || "no commit detected"}`,
        `Runtime status: ${project.status}`,
      ],
    },
    topContent: [
      { title: project.repo || "Local workspace", format: "Source", views: project.branch || "unknown", lift: project.status },
      { title: project.commit || "No git commit detected", format: "Latest Commit", views: "git", lift: "tracked" },
      { title: project.path, format: "Path", views: `${fileCount} files`, lift: "local" },
    ],
    recentTasks: roster.map((agent, index) => ({
      id: `#${index + 1}`,
      task: agent.role,
      agent: agent.name,
      type: "Worker",
      status: agent.status,
      tokens: agent.model,
    })),
    cronJobs: [
      {
        schedule: "Runtime",
        description: service ? `Mission Monitor PM2 status: ${service.pm2_env?.status}` : "Mission Monitor PM2 service not found",
        agent: "Yuya",
      },
      {
        schedule: "Config",
        description: `${workerCount} InstaGrow worker profiles under ~/.hermes/profiles`,
        agent: "Maestro",
      },
      {
        schedule: "Source",
        description: project.repo || "Local project path only",
        agent: project.owner,
      },
    ],
    pipeline: pipelineStages,
    activePipelineStage: project.activeStage,
    latestActivity: [
      `${project.handle} status: ${project.status}`,
      project.commit || "No latest commit detected",
      `${runningWorkers}/${workerCount} workers running; standby workers wake on dispatch`,
    ],
  };
}
