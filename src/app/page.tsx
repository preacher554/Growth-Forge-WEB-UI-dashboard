import Image from "next/image";
import { PlatformIcon } from "@/components/platform-icon";

const platforms = [
  {
    href: "/systems/instagrow",
    label: "Open Instagram monitor",
    icon: <InstagramIcon />,
  },
  {
    href: "/systems/tiktokgrow",
    label: "Open TikTok monitor",
    icon: <TikTokIcon />,
  },
];

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-forge-black">
      <div className="absolute inset-0 bg-forge-grid bg-[size:72px_72px] opacity-40" />
      <div className="absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-forge-red/20 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-forge-red/10 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-10 sm:px-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <div className="rounded-[2rem] border border-white/10 bg-black/50 p-4 shadow-forge backdrop-blur">
            <Image
              src="/growthforge-lockup.png"
              alt="GrowthForge logo"
              width={1175}
              height={290}
              priority
              className="h-auto w-[min(78vw,780px)]"
            />
          </div>

          <p className="mt-7 text-center text-xs uppercase tracking-[0.5em] text-white/45 sm:text-sm">
            Mission Monitor
          </p>
          <h1 className="mt-4 max-w-3xl text-center text-2xl font-medium tracking-[0.18em] text-white sm:text-4xl">
            Choose the system to observe
          </h1>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            {platforms.map((platform) => (
              <PlatformIcon key={platform.href} {...platform} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-16 w-16 sm:h-20 sm:w-20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-16 w-16 sm:h-20 sm:w-20"
      fill="currentColor"
    >
      <path d="M14.9 3.25c.35 2.02 1.52 3.44 3.48 4.22v3.02a8.67 8.67 0 0 1-3.44-1.03v6.07c0 3.2-2.37 5.47-5.62 5.47-3.03 0-5.39-2.2-5.39-5.2 0-3.16 2.45-5.43 5.95-5.43.32 0 .62.03.91.09v3.1a4.14 4.14 0 0 0-.91-.11c-1.63 0-2.74.94-2.74 2.3 0 1.29 1.01 2.22 2.35 2.22 1.49 0 2.43-.95 2.43-2.83V3.25h2.98Z" />
    </svg>
  );
}
