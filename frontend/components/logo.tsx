// TransitOps wordmark + mark. Pure presentational, safe in server components.

export function Logo({
  size = "md",
  showText = true,
  onAccent = false,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  /** Recolor for placement on a solid accent/blue background (e.g. sidebar). */
  onAccent?: boolean;
}) {
  const dims = size === "lg" ? 40 : size === "sm" ? 24 : 32;
  const text =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${onAccent ? "text-white" : ""}`}
    >
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          width="40"
          height="40"
          rx="4"
          className={onAccent ? "fill-white" : "fill-accent"}
        />
        <path
          d="M9 25h4a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h1v-7l-3-5H9v12z"
          className={onAccent ? "fill-accent" : "fill-accent-foreground"}
          fillOpacity="0.95"
        />
        <circle cx="16" cy="25" r="2.2" className={onAccent ? "fill-white" : "fill-accent"} />
        <circle cx="28" cy="25" r="2.2" className={onAccent ? "fill-white" : "fill-accent"} />
      </svg>
      {showText && (
        <span className={`font-semibold tracking-tight ${text}`}>
          Transit
          <span className={onAccent ? "text-white/70" : "text-accent"}>Ops</span>
        </span>
      )}
    </span>
  );
}
