// TransitOps wordmark + mark. Pure presentational, safe in server components.

export function Logo({
  size = "md",
  showText = true,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}) {
  const dims = size === "lg" ? 40 : size === "sm" ? 24 : 32;
  const text =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="40" height="40" rx="10" className="fill-accent" />
        <path
          d="M9 25h4a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h1v-7l-3-5H9v12z"
          className="fill-accent-foreground"
          fillOpacity="0.95"
        />
        <circle cx="16" cy="25" r="2.2" className="fill-accent" />
        <circle cx="28" cy="25" r="2.2" className="fill-accent" />
      </svg>
      {showText && (
        <span className={`font-semibold tracking-tight ${text}`}>
          Transit<span className="text-accent">Ops</span>
        </span>
      )}
    </span>
  );
}
