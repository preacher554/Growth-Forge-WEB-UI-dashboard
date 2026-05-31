import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory heartbeat store (in production, use Redis or DB)
const heartbeatStore: Record<string, { lastHeartbeat: string; status: "online" | "offline" }> = {};

/**
 * GET /api/wa-agents
 * Returns all WA agents with their conversations, runtime heartbeat, and Evolution status.
 * Supports ?conversation_id=xxx for fetching messages of a specific conversation.
 */
export async function GET(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
  const evoKey = process.env.EVOLUTION_API_KEY || "";
  const evoUrl = process.env.EVOLUTION_BASE_URL || "http://127.0.0.1:8080";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const headers: HeadersInit = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
  };

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversation_id");

  // If conversation_id provided, return messages for that conversation
  if (conversationId) {
    const msgRes = await fetch(
      `${supabaseUrl}/rest/v1/messages?select=id,direction,sender_jid,text,created_at&conversation_id=eq.${conversationId}&order=created_at.asc`,
      { headers, cache: "no-store" }
    );

    if (!msgRes.ok) {
      return NextResponse.json({ error: `messages query failed: ${msgRes.status}` }, { status: 500 });
    }

    const messages = await msgRes.json();
    return NextResponse.json({ messages });
  }

  // Otherwise return all agents with their conversations
  const tenantsRes = await fetch(
    `${supabaseUrl}/rest/v1/tenants?select=id,tenant_key,business_name,package,whatsapp_instance,ai_enabled,created_at&order=created_at.asc`,
    { headers, cache: "no-store" }
  );

  if (!tenantsRes.ok) {
    return NextResponse.json({ error: `tenants query failed: ${tenantsRes.status}` }, { status: 500 });
  }

  const tenants: Array<Record<string, unknown>> = await tenantsRes.json();

  const agents = await Promise.all(
    tenants.map(async (tenant) => {
      const convRes = await fetch(
        `${supabaseUrl}/rest/v1/conversations?select=id,remote_jid,customer_name,state,last_message_at,created_at&tenant_id=eq.${tenant.id}&order=last_message_at.desc.nullsfirst`,
        { headers, cache: "no-store" }
      );

      const conversations: Array<Record<string, string>> = convRes.ok ? await convRes.json() : [];
      const customerCount = conversations.length;
      const activeCount = conversations.filter((c) => c.state === "ai_active").length;
      const waitingHumanCount = conversations.filter((c) => c.state === "waiting_human").length;
      const humanActiveCount = conversations.filter((c) => c.state === "human_active").length;

      // Get runtime heartbeat status
      const instanceName = String(tenant.whatsapp_instance);
      const heartbeat = heartbeatStore[instanceName];
      const now = Date.now();
      const isOnline = heartbeat && (now - new Date(heartbeat.lastHeartbeat).getTime()) < 60000; // < 60s = online

      // Get Evolution instance status
      let evolutionStatus: "open" | "closed" | "connecting" | "unknown" = "unknown";
      if (evoKey && evoUrl) {
        try {
          const evoRes = await fetch(`${evoUrl}/instance/connectionState/${instanceName}`, {
            headers: { apikey: evoKey },
            cache: "no-store",
          });
          if (evoRes.ok) {
            const evoData = await evoRes.json();
            const state = evoData?.instance?.state;
            if (state === "open") evolutionStatus = "open";
            else if (state === "close" || state === "disconnected") evolutionStatus = "closed";
            else if (state === "connecting") evolutionStatus = "connecting";
          }
        } catch {
          // Evolution API unreachable
        }
      }

      return {
        id: tenant.id,
        tenantKey: tenant.tenant_key,
        businessName: tenant.business_name,
        package: tenant.package,
        whatsappInstance: tenant.whatsapp_instance,
        aiEnabled: tenant.ai_enabled,
        model: process.env.HERMES_MODEL || "gpt-5.3-codex",
        customerCount,
        activeCount,
        waitingHumanCount,
        humanActiveCount,
        runtimeStatus: isOnline ? "online" : "offline",
        lastHeartbeat: heartbeat?.lastHeartbeat ?? null,
        evolutionStatus,
        customers: conversations.map((c) => ({
          id: c.id,
          remoteJid: c.remote_jid,
          phone: (c.remote_jid || "").replace("@s.whatsapp.net", ""),
          name: c.customer_name || "Unknown",
          state: c.state,
          lastMessageAt: c.last_message_at,
          createdAt: c.created_at,
        })),
        createdAt: tenant.created_at,
      };
    })
  );

  return NextResponse.json({ agents });
}

/**
 * POST /api/wa-agents?action=heartbeat
 * Runtime agent calls this every 30s to report it's alive.
 * Body: { "instance": "aulia-nusaai" }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const instance = body.instance;

    if (!instance || typeof instance !== "string") {
      return NextResponse.json({ error: "instance name required" }, { status: 400 });
    }

    heartbeatStore[instance] = {
      lastHeartbeat: new Date().toISOString(),
      status: "online",
    };

    return NextResponse.json({ ok: true, instance, timestamp: heartbeatStore[instance].lastHeartbeat });
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
}

/**
 * Cleans up stale heartbeats (agents that haven't reported in > 5 min).
 * Called on every GET — simple passive cleanup.
 * In production, use a cron job instead.
 */
// (handled inline in GET above via timestamp check)
