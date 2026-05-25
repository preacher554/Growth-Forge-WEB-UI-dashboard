import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

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

  // Fetch all tenants (WA agents)
  const tenantsRes = await fetch(
    `${supabaseUrl}/rest/v1/tenants?select=id,tenant_key,business_name,package,whatsapp_instance,ai_enabled,created_at&order=created_at.asc`,
    { headers, cache: "no-store" }
  );

  if (!tenantsRes.ok) {
    return NextResponse.json({ error: `tenants query failed: ${tenantsRes.status}` }, { status: 500 });
  }

  const tenants: Array<Record<string, unknown>> = await tenantsRes.json();

  // For each tenant, fetch their conversations
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

      return {
        id: tenant.id,
        tenantKey: tenant.tenant_key,
        businessName: tenant.business_name,
        package: tenant.package,
        whatsappInstance: tenant.whatsapp_instance,
        aiEnabled: tenant.ai_enabled,
        model: process.env.HERMES_MODEL || "gpt-5.2",
        customerCount,
        activeCount,
        waitingHumanCount,
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
