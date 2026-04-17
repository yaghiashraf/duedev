import Link from "next/link";

type LogoMarkProps = {
  className?: string;
  animated?: boolean;
};

type LogoLockupProps = {
  href?: string;
  className?: string;
  markClassName?: string;
  textClassName?: string;
  animated?: boolean;
};

export function LogoMark({ className = "h-9 w-9", animated = false }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`${className} ${animated ? "logo-mark-pulse" : ""}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="10" fill="#07100D" />
      <rect x="1" y="1" width="46" height="46" rx="9" stroke="#6EE7B7" strokeOpacity="0.25" strokeWidth="2" />
      <path
        d="M14.5 17.5 9.75 24l4.75 6.5"
        stroke="#6EE7B7"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m33.5 17.5 4.75 6.5-4.75 6.5"
        stroke="#6EE7B7"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 32 27 16" stroke="#67E8F9" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="15.5" stroke="#E5E7EB" strokeOpacity="0.28" strokeWidth="2" />
      <path
        d="M35 35 41 41"
        stroke="#E5E7EB"
        strokeOpacity="0.7"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M18.5 10.75c3.2-1.35 7.63-1.52 11.63.42"
        stroke="#A7F3D0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

export function LogoLockup({
  href = "/",
  className = "flex items-center gap-2",
  markClassName = "h-9 w-9",
  textClassName = "text-lg font-semibold tracking-tight text-white",
  animated = false,
}: LogoLockupProps) {
  return (
    <Link href={href} className={className} aria-label="DueDev home">
      <LogoMark className={markClassName} animated={animated} />
      <span className={textClassName}>DueDev</span>
    </Link>
  );
}
