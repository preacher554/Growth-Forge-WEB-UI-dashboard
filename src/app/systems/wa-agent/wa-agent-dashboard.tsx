"use client";

import Link from "next/link";

import { useCallback, useEffect, useRef, useState } from "react";

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
  humanActiveCount: number;
  customers: Customer[];
  createdAt: string;
  runtimeStatus?: "online" | "offline" | "unknown";
  lastHeartbeat?: string | null;
  evolutionStatus?: "open" | "closed" | "connecting" | "unknown";
}

interface ChatMessage {
  id: string;
  direction: "inbound" | "outbound" | "system";
  sender_jid: string | null;
  text: string;
  created_at: string;
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

const RUNTIME_STATUS_LABELS: Record<string, { label: string; color: string; dot: string }> = {
  online: { label: "Runtime Online", color: "text-green-400", dot: "bg-green-400" },
  offline: { label: "Runtime Offline", color: "text-red-400", dot: "bg-red-400" },
  unknown: { label: "Runtime Unknown", color: "text-white/40", dot: "bg-white/40" },
};

const EVOLUTION_STATUS_LABELS: Record<string, { label: string; color: string; dot: string }> = {
  open: { label: "WA Connected", color: "text-green-400", dot: "bg-green-400" },
  closed: { label: "WA Disconnected", color: "text-red-400", dot: "bg-red-400" },
  connecting: { label: "WA Connecting", color: "text-amber-400", dot: "bg-amber-400" },
  unknown: { label: "WA Unknown", color: "text-white/40", dot: "bg-white/40" },
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
  if (phone.startsWith("62")) return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 9)} ${phone.slice(9)}`;
  if (phone.startsWith("0")) return `${phone.slice(0, 4)} ${phone.slice(4, 8)} ${phone.slice(8)}`;
  return phone;
}

function timeAgo(iso: string | null) {
  if (!iso) return "never";
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function WaAgentDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch("/api/wa-agents", { signal: controller.signal });
      const json = await res.json();
      if (!controller.signal.aborted) {
        setData(json);
        if (json.error) setError(json.error);
        else setError(null);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Poll every 3 seconds for near-real-time updates
    const interval = setInterval(fetchData, 3000);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchData]);

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
  const totalHumanActive = agents.reduce((sum, a) => sum + (a.humanActiveCount ?? 0), 0);
  const onlineRuntimes = agents.filter((a) => a.runtimeStatus === "online").length;
  const connectedWA = agents.filter((a) => a.evolutionStatus === "open").length;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-forge-black">
      <div className="absolute inset-0 bg-forge-grid bg-[size:72px_72px] opacity-40" />
      <div className="absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-forge-red/20 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-forge-red/10 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10">
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

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-6">
          <StatCard label="Total Agents" value={agents.length} accent="text-white" />
          <StatCard label="Runtime Online" value={`${onlineRuntimes}/${agents.length}`} accent="text-green-400" />
          <StatCard label="WA Connected" value={`${connectedWA}/${agents.length}`} accent="text-emerald-400" />
          <StatCard label="Total Customers" value={totalCustomers} accent="text-green-400" />
          <StatCard label="AI Active" value={totalActive} accent="text-emerald-400" />
          <StatCard label="Waiting Human" value={totalWaiting + totalHumanActive} accent="text-amber-400" />
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            Error: {error}
          </div>
        )}

        {agents.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-black/50 p-12 text-center">
            <p className="text-lg text-white/50">No WhatsApp agents registered yet.</p>
            <p className="mt-2 text-sm text-white/30">
              Tenants will appear here once they are registered.
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
                selectedCustomer={selectedCustomer}
                onSelectCustomer={setSelectedCustomer}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function StatusDot({ status }: { status: "online" | "offline" | "unknown" }) {
  const s = RUNTIME_STATUS_LABELS[status] ?? RUNTIME_STATUS_LABELS.unknown;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${s.color}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${s.dot} ${status === "online" ? "animate-pulse" : ""}`} />
      {s.label}
    </span>
  );
}

function EvolutionDot({ status }: { status: "open" | "closed" | "connecting" | "unknown" }) {
  const s = EVOLUTION_STATUS_LABELS[status] ?? EVOLUTION_STATUS_LABELS.unknown;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${s.color}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${s.dot} ${status === "connecting" ? "animate-pulse" : ""}`} />
      {s.label}
    </span>
  );
}

function AgentCard({
  agent,
  expanded,
  onToggle,
  selectedCustomer,
  onSelectCustomer,
}: {
  agent: WaAgent;
  expanded: boolean;
  onToggle: () => void;
  selectedCustomer: string | null;
  onSelectCustomer: (id: string) => void;
}) {
  const selectedCustomerData = agent.customers.find((c) => c.id === selectedCustomer);
  const runtimeInfo = RUNTIME_STATUS_LABELS[agent.runtimeStatus ?? "unknown"] ?? RUNTIME_STATUS_LABELS.unknown;
  const evoInfo = EVOLUTION_STATUS_LABELS[agent.evolutionStatus ?? "unknown"] ?? EVOLUTION_STATUS_LABELS.unknown;

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
            <span className={`rounded-lg border px-2.5 py-1 ${agent.aiEnabled ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-white/10 bg-white/[0.04] text-white/40"}`}>
              {agent.aiEnabled ? "AI ON" : "AI OFF"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            <StatusDot status={agent.runtimeStatus ?? "unknown"} />
          </div>
          <div className="flex items-center gap-4">
            <EvolutionDot status={agent.evolutionStatus ?? "unknown"} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{agent.customerCount}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/30">customers</p>
          </div>
          {agent.lastHeartbeat && (
            <p className="text-[10px] text-white/25">
              Heartbeat: {timeAgo(agent.lastHeartbeat)}
            </p>
          )}
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

      {/* Status Bar */}
      <div className="border-t border-white/[0.06] px-6 py-2">
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/30">
          <span>Runtime: <span className={runtimeInfo.color}>{runtimeInfo.label}</span></span>
          <span>WA: <span className={evoInfo.color}>{evoInfo.label}</span></span>
          {agent.lastHeartbeat && (
            <span>Last heartbeat: <span className="text-white/50">{timeAgo(agent.lastHeartbeat)}</span></span>
          )}
          <span>Customers: <span className="text-white/50">{agent.customerCount}</span></span>
          <span>AI Active: <span className="text-green-400">{agent.activeCount}</span></span>
          <span>Waiting: <span className="text-amber-400">{agent.waitingHumanCount ?? 0}</span></span>
          <span>Human: <span className="text-blue-400">{agent.humanActiveCount ?? 0}</span></span>
        </div>
      </div>

      {/* Expanded: Customer List */}
      {expanded && (
        <div className="border-t border-white/10 px-6 py-5">
          {agent.customers.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/30">
              No customers yet. When someone messages this agent, they&apos;ll appear here.
            </p>
          ) : (
            <>
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
                      const isSelected = selectedCustomer === customer.id;
                      return (
                        <tr
                          key={customer.id}
                          onClick={() => onSelectCustomer(customer.id)}
                          className={`border-b border-white/[0.04] transition cursor-pointer ${isSelected ? "bg-forge-red/10 hover:bg-forge-red/15" : "hover:bg-white/[0.02]"}`}
                        >
                          <td className="py-3 pr-4">
                            <span className={`font-medium ${isSelected ? "text-white" : "text-white/90"}`}>
                              {isSelected && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-forge-red" />}
                              {customer.name}
                            </span>
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

              {/* Chat Panel */}
              {selectedCustomer && selectedCustomerData && (
                <ChatPanel customer={selectedCustomerData} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ChatPanel({ customer }: { customer: Customer }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch(`/api/conversation?conversation_id=${customer.id}`, {
        signal: controller.signal,
      });
      const json = await res.json();
      if (!controller.signal.aborted && json.messages) {
        setMessages(json.messages);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    } finally {
      setLoading(false);
    }
  }, [customer.id]);

  useEffect(() => {
    fetchMessages();
    // Poll messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mt-5 border-t border-white/10 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">
            Conversation with {customer.name}
          </h3>
          <p className="text-xs text-white/40">{formatPhone(customer.phone)}</p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${STATE_LABELS[customer.state]?.color ?? "bg-white/10 text-white/50 border-white/20"}`}
        >
          {STATE_LABELS[customer.state]?.label ?? customer.state}
        </span>
      </div>

      <div className="max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/30">No messages yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => {
              const isInbound = msg.direction === "inbound";
              const isSystem = msg.direction === "system";
              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] text-white/30">
                      {msg.text}
                    </span>
                  </div>
                );
              }
              return (
                <div
                  key={msg.id}
                  className={`flex ${isInbound ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isInbound ? "rounded-bl-md bg-white/[0.07] text-white/80" : "rounded-br-md bg-forge-red/20 text-white/90"}`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    <p className={`mt-1 text-[9px] ${isInbound ? "text-white/25" : "text-white/35"}`}>
                      {formatDate(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
