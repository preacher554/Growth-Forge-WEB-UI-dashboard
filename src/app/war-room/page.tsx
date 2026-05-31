import Link from "next/link";
import { MainWarRoomChat } from "./main-war-room-chat";

export default function WarRoomPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-forge-black text-white">
      <div className="absolute inset-0 bg-forge-grid bg-[size:72px_72px] opacity-35" />
      <div className="absolute left-[-10rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-forge-red/18 blur-3xl" />
      <div className="absolute bottom-[-14rem] right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-violet-400/10 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 sm:px-10 lg:py-14">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/50 transition hover:border-forge-red/60 hover:text-white">
            Back
          </Link>
          <p className="text-xs uppercase tracking-[0.35em] text-white/35">GrowthForge War Rooms</p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-forge-redSoft/80">War Room Lobby</p>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Main WAR Room
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/52 sm:text-base">
            Ruang utama GrowthForge untuk Chief, Yuya, dan Nara ngobrol seperti grup WhatsApp: approval, koordinasi teknis, dan sinkronisasi operator — tanpa tombol eksekusi langsung.
          </p>
        </div>

        <MainWarRoomChat />
      </section>
    </main>
  );
}
