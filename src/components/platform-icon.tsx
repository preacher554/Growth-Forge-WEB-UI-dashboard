import Link from "next/link";

type PlatformIconProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export function PlatformIcon({ href, label, icon }: PlatformIconProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] text-white/85 transition duration-300 hover:-translate-y-1 hover:border-forge-red/60 hover:bg-white/[0.055] hover:text-white hover:shadow-forge sm:h-40 sm:w-40"
    >
      <span className="transition duration-300 group-hover:scale-110 group-hover:text-forge-red">
        {icon}
      </span>
    </Link>
  );
}
