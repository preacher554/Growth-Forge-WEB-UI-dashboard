export type SystemId = "instagrow" | "tiktokgrow";

export type AccountStatus = "Running" | "Waiting Approval" | "Idle" | "Blocked";
export type AgentRuntimeStatus = "running" | "queued" | "standby" | "stopped";

export type SystemLedgerRecord = {
  id: SystemId;
  title: string;
  subtitle: string;
  status: string;
  mode: "read_only";
};

export type AccountLedgerRecord = {
  systemId: SystemId;
  id: string;
  handle: string;
  status: AccountStatus;
  currentStep: string;
  owner: string;
  nextGate: string;
  lastUpdate: string;
  activeStage: string;
  mode: "sandbox" | "client";
  workspace?: string;
};

export type AgentRosterRecord = {
  systemId: SystemId;
  id: string;
  name: string;
  model: string;
  provider: string;
  status: AgentRuntimeStatus;
  defaultPortrait: string;
};

export type AgentActivityRecord = {
  timestamp: string;
  systemId: SystemId;
  accountId?: string;
  agent: string;
  event: string;
  status: string;
};

export type SystemOverview = {
  title: string;
  subtitle: string;
  accounts: AccountLedgerRecord[];
  roster: AgentRosterRecord[];
  activity: string[];
};

export type AccountDashboard = {
  systemId: SystemId;
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
