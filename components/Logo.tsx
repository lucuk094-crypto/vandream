import Link from "next/link";

interface LogoProps {
  size?: "md" | "lg";
  withTagline?: boolean;
}

/**
 * Premium wordmark: "Van" ivory + "Dream" gold italic serif.
 */
export function Logo({ size = "md", withTagline = false }: LogoProps) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label="Van Dream — beranda"
    >
      <span
        className={`grid place-items-center rounded-xl border border-gold/40 bg-gold/10 shadow-gold transition-transform duration-300 group-hover:rotate-6 ${
          size === "lg" ? "h-11 w-11" : "h-9 w-9"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={size === "lg" ? "h-6 w-6" : "h-5 w-5"}
          aria-hidden="true"
        >
          <path
            d="M7 4.5v15l12-7.5L7 4.5Z"
            fill="#d8a758"
            stroke="#f0cd8c"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display tracking-wide ${
            size === "lg" ? "text-2xl" : "text-xl"
          }`}
        >
          <span className="text-ivory">Van</span>
          <span className="text-gold italic">Dream</span>
        </span>
        {withTagline && (
          <span className="mt-1 text-[10px] font-medium tracking-[0.28em] text-faint uppercase">
            Your Drama · Your Dream
          </span>
        )}
      </span>
    </Link>
  );
}
