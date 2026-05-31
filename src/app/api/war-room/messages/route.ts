import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";
import { promisify } from "node:util";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type WarRoomSender = "Chief" | "Yuya" | "Nara" | "System";

type WarRoomMessage = {
  id: string;
  roomId: "main";
  sender: WarRoomSender;
  role: "human" | "agent" | "system";
  text: string;
  createdAt: string;
  status?: "sent" | "delivered" | "error";
};

const dataDir = process.env.WAR_ROOM_DATA_DIR || "/root/hermes-workspace/growthforge/war-room";
const dataFile = path.join(dataDir, "main-war-room.json");
const execFileAsync = promisify(execFile);

const agents = [
  {
    name: "Yuya" as const,
    url: process.env.YUYA_API_BASE || "http://127.0.0.1:8642/v1/chat/completions",
    sessionId: "growthforge-main-war-room-yuya",
    system: "Kamu adalah Yuya, core operator GrowthForge. Jawab singkat, hangat, strategis, dan aman. Konteks: Main WAR Room adalah ruang koordinasi Chief, Yuya, dan Nara. Jika pesan adalah approval, catat approval dan jelaskan dampaknya secara ringkas. Jangan menjalankan aksi eksternal dari dashboard ini; hanya diskusi/koordinasi.",
    cliArgs: ["chat", "-Q", "-q"],
  },
  {
    name: "Nara" as const,
    url: process.env.NARA_API_BASE || "http://127.0.0.1:8643/v1/chat/completions",
    sessionId: "growthforge-main-war-room-nara",
    system: "Kamu adalah Nara, operator WA Agent GrowthForge. Jawab profesional, singkat, dan fokus teknis. Konteks: Main WAR Room adalah ruang koordinasi Chief, Yuya, dan Nara. Eskalasikan keputusan strategi ke Yuya/Chief. Jangan mengirim pesan WhatsApp/customer-facing atau melakukan aksi produksi dari dashboard ini; hanya diskusi/koordinasi.",
    cliArgs: ["--profile", "growthforge-wa-operator", "chat", "-Q", "-q"],
  },
];

async function readMessages(): Promise<WarRoomMessage[]> {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw error;
  }
}

async function saveMessages(messages: WarRoomMessage[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(messages.slice(-200), null, 2)}\n`, "utf8");
}

function makeMessage(sender: WarRoomSender, role: WarRoomMessage["role"], text: string, status: WarRoomMessage["status"] = "sent"): WarRoomMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    roomId: "main",
    sender,
    role,
    text,
    createdAt: new Date().toISOString(),
    status,
  };
}

function buildAgentPrompt(agent: (typeof agents)[number], text: string, recentMessages: WarRoomMessage[]) {
  const transcript = recentMessages
    .slice(-12)
    .map((message) => `${message.sender}: ${message.text}`)
    .join("\n");

  return `Main WAR Room update. Recent transcript:\n${transcript || "(empty)"}\n\nChief just wrote:\n${text}\n\nReply as ${agent.name} to the room. Keep it concise and operational.`;
}

async function askAgentViaApi(agent: (typeof agents)[number], prompt: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Hermes-Session-Id": agent.sessionId,
    "X-Hermes-Session-Key": `main-war-room-${agent.name.toLowerCase()}`,
  };

  const apiKey = agent.name === "Yuya" ? process.env.YUYA_API_KEY : process.env.NARA_API_KEY;
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const response = await fetch(agent.url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "hermes-agent",
      stream: false,
      messages: [
        { role: "system", content: agent.system },
        { role: "user", content: prompt },
      ],
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!response.ok) {
    throw new Error(`${agent.name} API returned ${response.status}`);
  }

  const payload = await response.json();
  if (payload?.hermes?.failed) {
    throw new Error(payload?.hermes?.error || `${agent.name} Hermes run failed`);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error(`${agent.name} returned empty response`);
  }
  return content.trim();
}

async function askAgentViaCli(agent: (typeof agents)[number], prompt: string) {
  const fullPrompt = `${agent.system}\n\n${prompt}`;
  const { stdout, stderr } = await execFileAsync("hermes", [...agent.cliArgs, fullPrompt], {
    timeout: 120_000,
    maxBuffer: 1024 * 1024,
    env: { ...process.env, NO_COLOR: "1" },
  });

  const output = `${stdout || ""}\n${stderr || ""}`
    .split("\n")
    .filter((line) => !line.startsWith("session_id:"))
    .join("\n")
    .trim();

  if (!output) throw new Error(`${agent.name} CLI returned empty response`);
  if (output.includes("API call failed") || output.includes("HTTP 429") || output.includes("Invalid API key")) {
    throw new Error(output.slice(0, 300));
  }

  return output;
}

async function askAgent(agent: (typeof agents)[number], text: string, recentMessages: WarRoomMessage[]) {
  const prompt = buildAgentPrompt(agent, text, recentMessages);
  try {
    return await askAgentViaApi(agent, prompt);
  } catch (apiError) {
    try {
      return await askAgentViaCli(agent, prompt);
    } catch (cliError) {
      const apiMessage = apiError instanceof Error ? apiError.message : "API failed";
      const cliMessage = cliError instanceof Error ? cliError.message : "CLI failed";
      throw new Error(`API: ${apiMessage}; CLI: ${cliMessage}`);
    }
  }
}

export async function GET() {
  const messages = await readMessages();
  return NextResponse.json({ messages });
}

export async function DELETE() {
  await saveMessages([]);
  return NextResponse.json({ messages: [] });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "Message text is required." }, { status: 400 });
  }

  if (text.length > 4_000) {
    return NextResponse.json({ error: "Message is too long. Max 4000 characters." }, { status: 400 });
  }

  const before = await readMessages();
  const chiefMessage = makeMessage("Chief", "human", text, "delivered");
  const withChief = [...before, chiefMessage];
  await saveMessages(withChief);

  const results = await Promise.allSettled(agents.map((agent) => askAgent(agent, text, withChief)));
  const agentMessages: WarRoomMessage[] = results.map((result, index) => {
    const agent = agents[index];
    if (result.status === "fulfilled") {
      return makeMessage(agent.name, "agent", result.value, "delivered");
    }
    return makeMessage("System", "system", `${agent.name} belum bisa membalas: ${result.reason instanceof Error ? result.reason.message : "unknown error"}`, "error");
  });

  const latest = await readMessages();
  const messages = [...latest, ...agentMessages];
  await saveMessages(messages);

  return NextResponse.json({ messages });
}
