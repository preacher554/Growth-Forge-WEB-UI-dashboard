"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type WarRoomMessage = {
  id: string;
  roomId: "main";
  sender: "Chief" | "Yuya" | "Nara" | "System";
  role: "human" | "agent" | "system";
  text: string;
  createdAt: string;
  status?: "sent" | "delivered" | "error";
};

const participants = [
  { name: "Chief", role: "Founder / Approval", image: "/avatars/chief.svg", status: "Owner" },
  { name: "Yuya", role: "Core Operator", image: "/avatar-yuya.jpg", status: "Connected" },
  { name: "Nara", role: "WA Technical Operator", image: "/avatar-nara.jpg", status: "Connected" },
];

function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(new Date(value));
  } catch {
    return "WIB";
  }
}

export function MainWarRoomChat() {
  const [messages, setMessages] = useState<WarRoomMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;
  const statusText = useMemo(() => {
    if (sending) return "Yuya dan Nara lagi membaca pesan Chief...";
    if (loading) return "Loading room...";
    return "Chief, Yuya, Nara · live via local Hermes API";
  }, [loading, sending]);

  async function loadMessages() {
    const response = await fetch("/api/war-room/messages", { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load room: ${response.status}`);
    const payload = await response.json();
    setMessages(Array.isArray(payload.messages) ? payload.messages : []);
  }

  useEffect(() => {
    let alive = true;

    async function tick() {
      try {
        const response = await fetch("/api/war-room/messages", { cache: "no-store" });
        if (!response.ok) throw new Error(`Failed to load room: ${response.status}`);
        const payload = await response.json();
        if (alive) {
          setMessages(Array.isArray(payload.messages) ? payload.messages : []);
          setError(null);
        }
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Failed to load room");
      } finally {
        if (alive) setLoading(false);
      }
    }

    tick();
    const timer = window.setInterval(tick, 5_000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = text.trim();
    if (!clean || sending) return;

    setSending(true);
    setError(null);
    setText("");

    try {
      const response = await fetch("/api/war-room/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || `Failed to send: ${response.status}`);
      setMessages(Array.isArray(payload?.messages) ? payload.messages : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      setText(clean);
    } finally {
      setSending(false);
      await loadMessages().catch(() => undefined);
    }
  }

  async function clearRoom() {
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const response = await fetch("/api/war-room/messages", { method: "DELETE" });
      if (!response.ok) throw new Error(`Failed to clear: ${response.status}`);
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear room");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.45fr]">
      <aside className="rounded-[2rem] border border-white/10 bg-black/45 p-5 shadow-forge backdrop-blur-xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/35">Active now</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Main WAR Room</h2>
            <p className="mt-2 text-sm leading-6 text-white/48">Ruang utama untuk approval, koordinasi teknis, dan sinkronisasi Chief ↔ Yuya ↔ Nara.</p>
          </div>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-emerald-100">
            Live
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {participants.map((participant) => (
            <div key={participant.name} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-3">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-1.5">
                <Image src={participant.image} alt={`${participant.name} portrait`} width={72} height={72} className="h-14 w-14 rounded-xl object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate text-lg font-semibold tracking-[-0.04em]">{participant.name}</h3>
                  <span className="shrink-0 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-white/45">
                    {participant.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-white/45">{participant.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-forge-red/15 bg-forge-red/10 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-forge-redSoft/80">Safety</p>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Composer ini untuk ngobrol dan approval context. Dashboard belum punya tombol eksekusi langsung, jadi publish/delete/customer-message tetap aman dari klik tidak sengaja.
          </p>
          <button
            type="button"
            onClick={clearRoom}
            disabled={sending || !hasMessages}
            className="mt-4 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/45 transition hover:border-forge-red/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            Empty bubbles
          </button>
        </div>
      </aside>

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#080808]/80 shadow-forge backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.035] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {participants.map((participant) => (
                <Image key={participant.name} src={participant.image} alt={`${participant.name} avatar`} width={44} height={44} className="h-11 w-11 rounded-full border-2 border-[#080808] object-cover" />
              ))}
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.04em]">Main WAR Room</h2>
              <p className="text-xs text-white/40">{statusText}</p>
            </div>
          </div>
          <span className="hidden rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:inline-flex">
            Group chat
          </span>
        </div>

        <div className="flex h-[34rem] flex-col bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.12),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.035)_0,rgba(255,255,255,0)_45%)]">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {!hasMessages && !loading ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="max-w-sm rounded-[2rem] border border-dashed border-white/12 bg-black/35 p-8">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/30">Empty room</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">Bubble chat kosong</h3>
                  <p className="mt-3 text-sm leading-6 text-white/45">Ketik approval atau instruksi pertama di bawah. Yuya dan Nara akan masuk ke room lewat API lokal.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isChief = message.sender === "Chief";
                  const isSystem = message.sender === "System";
                  return (
                    <div key={message.id} className={`flex ${isChief ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[88%] rounded-[1.35rem] border px-4 py-3 shadow-lg sm:max-w-[72%] ${isChief ? "border-forge-red/25 bg-forge-red/20" : isSystem ? "border-amber-300/20 bg-amber-300/10" : "border-white/10 bg-black/55"}`}>
                        <div className="mb-1 flex items-center justify-between gap-4">
                          <p className={`text-xs font-semibold ${isSystem ? "text-amber-100" : "text-forge-redSoft"}`}>{message.sender}</p>
                          <p className="text-[10px] text-white/32">{formatTime(message.createdAt)}</p>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-white/72">{message.text}</p>
                      </div>
                    </div>
                  );
                })}
                {sending ? (
                  <div className="flex justify-start">
                    <div className="rounded-[1.35rem] border border-white/10 bg-black/55 px-4 py-3 text-sm text-white/45 shadow-lg">
                      Yuya dan Nara sedang mengetik...
                    </div>
                  </div>
                ) : null}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <form onSubmit={submitMessage} className="border-t border-white/10 bg-white/[0.03] p-4 sm:p-5">
            {error ? <p className="mb-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">{error}</p> : null}
            <div className="flex gap-3">
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Tulis approval / instruksi buat Yuya dan Nara..."
                rows={2}
                disabled={sending}
                className="min-h-12 flex-1 resize-none rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-forge-red/50 disabled:cursor-not-allowed disabled:opacity-55"
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                className="rounded-2xl border border-forge-red/30 bg-forge-red/20 px-5 text-xs font-semibold uppercase tracking-[0.22em] text-forge-redSoft transition hover:border-forge-red/70 hover:bg-forge-red/30 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </section>
    </section>
  );
}
