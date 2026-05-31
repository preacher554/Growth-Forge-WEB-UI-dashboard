import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase not configured." },
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

  if (!conversationId) {
    return NextResponse.json({ error: "conversation_id required" }, { status: 400 });
  }

  const msgRes = await fetch(
    `${supabaseUrl}/rest/v1/messages?select=id,direction,sender_jid,text,created_at&conversation_id=eq.${conversationId}&order=created_at.asc&limit=200`,
    { headers, cache: "no-store" }
  );

  if (!msgRes.ok) {
    return NextResponse.json({ error: `messages query failed: ${msgRes.status}` }, { status: 500 });
  }

  const messages = await msgRes.json();
  return NextResponse.json({ messages });
}
