import { readJsonl } from "./ledger-reader";
import type {
  AccountDashboard,
  AccountLedgerRecord,
  AgentActivityRecord,
  AgentRosterRecord,
  SystemId,
  SystemLedgerRecord,
  SystemOverview,
} from "./schemas";

export function getSystems(): SystemLedgerRecord[] {
  return readJsonl<SystemLedgerRecord>("systems.jsonl");
}

export function getSystemOverview(systemId: string): SystemOverview | null {
  const system = getSystems().find((item) => item.id === systemId);

  if (!system) {
    return null;
  }

  const typedSystemId = systemId as SystemId;
  const accounts = readJsonl<AccountLedgerRecord>("accounts.jsonl").filter(
    (account) => account.systemId === typedSystemId,
  );
  const roster = readJsonl<AgentRosterRecord>("agent-roster.jsonl").filter(
    (agent) => agent.systemId === typedSystemId,
  );
  const activity = readJsonl<AgentActivityRecord>("agent-activity.jsonl")
    .filter((item) => item.systemId === typedSystemId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 6)
    .map((item) => item.event);

  return {
    title: system.title,
    subtitle: system.subtitle,
    accounts,
    roster,
    activity,
  };
}

export function getAccountDashboard(
  systemId: string,
  accountId: string,
): AccountDashboard | null {
  return (
    readJsonl<AccountDashboard>("account-dashboards.jsonl").find(
      (account) => account.systemId === systemId && account.accountId === accountId,
    ) ?? null
  );
}
