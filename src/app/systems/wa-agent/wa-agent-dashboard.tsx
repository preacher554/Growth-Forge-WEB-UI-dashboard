"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

interface Customer {
  id: string;
  remoteJid: string;
  phone: string;
  name: string;
  state: string;
  lastMessageAt: string | null;
  createdAt: string;
}

interface WaAgent {
  id: string;
  tenantKey: string;
  businessName: string;
  package: string;
  whatsappInstance: string;
  aiEnabled: boolean;
  model: string;
  customerCount: number;
  activeCount: number;
  waitingHumanCount: number;
  customers: Customer[];
  createdAt: string;
}

interface ApiResponse {
  agents?: WaAgent[];
  error?: string;
}

const STATE_LABELS: Record<string, { label: string; color: string }> = {
  ai_active: { label: "AI Active", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  waiting_human: { label: "Waiting Human", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  human_active: { label: "Human Active", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  resolved: { label: "Resolved", color: "bg-white/10 text-white/50 border-white/20" },
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatPhone(phone: string) {
  if (!phone) return "—";
  // Format +62xxx or 0xxx to readable
  if (phone.startsWith("62")) return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 9)} ${phone.slice(9)}`;
  if (phone.startsWith("0")) return `${phone.slice(0, 4)} ${phone.slice(4, 8)} ${phone.slice(8)}`;
  return phone;
}

export function WaAgentDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await fetch("/api/wa-agents");
        const json = await res.json();
        if (mounted) {
          setData(json);
          if (json.error) setError(json.error);
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 15000); // refresh every 15s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <main className="relative isolate min-h-screen overflow-hidden bg-forge-black">
        <div className="absolute inset-0 bg-forge-grid bg-[size:72px_72px] opacity-40" />
        <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-10 sm:px-10">
          <div className="flex items-center justify-center gap-3 text-white/60">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
            <span className="text-sm tracking-wide">Loading WA agents…</span>
          </div>
        </section>
      </main>
    );
  }

  const agents = data?.agents ?? [];
  const totalCustomers = agents.reduce((sum, a) => sum + a.customerCount, 0);
  const totalActive = agents.reduce((sum, a) => sum + a.activeCount, 0);
  const totalWaiting = agents.reduce((sum, a) => sum + a.waitingHumanCount, 0);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-forge-black">
      <div className="absolute inset-0 bg-forge-grid bg-[size:72px_72px] opacity-40" />
      <div className="absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-forge-red/20 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-forge-red/10 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2">
          <Link href="/" className="text-xs uppercase tracking-[0.3em] text-white/30 transition hover:text-white/60">
            ← Back to Mission Monitor
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-wide text-white sm:text-3xl">
            WhatsApp Agent Monitor
          </h1>
          <p className="text-sm text-white/40">
            Real-time overview of all WA agents, their customers, models, and conversation states.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Agents" value={agents.length} accent="text-white" />
          <StatCard label="Total Customers" value={totalCustomers} accent="text-green-400" />
          <StatCard label="AI Active" value={totalActive} accent="text-emerald-400" />
          <StatCard label="Waiting Human" value={totalWaiting} accent="text-amber-400" />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            Error: {error}
          </div>
        )}

        {/* Agent Cards */}
        {agents.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-black/50 p-12 text-center">
            <p className="text-lg text-white/50">No WhatsApp agents registered yet.</p>
            <p className="mt-2 text-sm text-white/30">
              Tenants will appear here once they start receiving messages.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                expanded={expandedAgent === agent.id}
                onToggle={() =>
                  setExpandedAgent(expandedAgent === agent.id ? null : agent.id)
                }
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function AgentCard({
  agent,
  expanded,
  onToggle,
}: {
  agent: WaAgent;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur transition">
      {/* Agent Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-white/[0.02]"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-400" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">{agent.businessName}</h2>
              <p className="text-xs text-white/40">{agent.tenantKey}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
            <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1">
              Instance: <span className="text-white/70">{agent.whatsappInstance}</span>
            </span>
            <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1">
              Package: <span className="text-white/70">{agent.package}</span>
            </span>
            <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1">
              Model: <span className="text-forge-red/80">{agent.model}</span>
            </span>
            <span
              className={`rounded-lg border px-2.5 py-1 ${
                agent.aiEnabled
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-white/10 bg-white/[0.04] text-white/40"
              }`}
            >
              {agent.aiEnabled ? "AI ON" : "AI OFF"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{agent.customerCount}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/30">customers</p>
          </div>
          <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 text-white/30 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Expanded: Customer List */}
      {expanded && (
        <div className="border-t border-white/10 px-6 py-5">
          {agent.customers.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/30">
              No customers yet. When someone messages this agent, they&apos;ll appear here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40">
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Phone</th>
                    <th className="pb-3 pr-4">State</th>
                    <th className="pb-3 pr-4">Last Message</th>
                    <th className="pb-3">First Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {agent.customers.map((customer) => {
                    const stateInfo = STATE_LABELS[customer.state] ?? {
                      label: customer.state,
                      color: "bg-white/10 text-white/50 border-white/20",
                    };
                    return (
                      <tr
                        key={customer.id}
                        className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                      >
                        <td className="py-3 pr-4">
                          <span className="font-medium text-white/90">{customer.name}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="font-mono text-xs text-white/50">
                            {formatPhone(customer.phone)}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${stateInfo.color}`}
                          >
                            {stateInfo.label}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-xs text-white/40">
                          {formatDate(customer.lastMessageAt)}
                        </td>
                        <td className="py-3 text-xs text-white/40">
                          {formatDate(customer.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
