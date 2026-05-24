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
  {
    href: "/systems/wa-agent",
    label: "Open WA Agent monitor",
    icon: <WhatsAppIcon />,
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

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-16 w-16 sm:h-20 sm:w-20"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
