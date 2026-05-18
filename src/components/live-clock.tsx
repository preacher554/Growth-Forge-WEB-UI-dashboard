"use client";

import { useEffect, useState } from "react";

function formatClock(date: Date) {
  return {
    time: new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(date),
    day: new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      timeZone: "Asia/Jakarta",
    }).format(date),
    date: new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(date),
  };
}

export function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const formatted = formatClock(now);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
      <p className="text-lg font-medium tracking-[0.18em] text-white">{formatted.time}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/45">
        {formatted.day}, {formatted.date}
      </p>
    </div>
  );
}
