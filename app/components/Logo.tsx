import Link from "next/link";

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 group transition-opacity hover:opacity-80"
      aria-label="GRC Drift Lab — home"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <marker
            id="arrowTopLogo"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#AFA9EC" />
          </marker>
          <marker
            id="arrowBotLogo"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#7F77DD" opacity="0.55" />
          </marker>
        </defs>

        {/* Intent line — straight, ideal */}
        <path
          d="M 18 60 L 50 60 L 100 60"
          fill="none"
          stroke="#AFA9EC"
          strokeWidth="9"
          strokeLinecap="round"
          markerEnd="url(#arrowTopLogo)"
        />

        {/* Reality line — drifts away */}
        <path
          d="M 18 60 L 50 60 Q 70 60 100 88"
          fill="none"
          stroke="#7F77DD"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.55"
          markerEnd="url(#arrowBotLogo)"
        />
      </svg>

      <span className="text-sm tracking-[0.18em] font-medium text-white/90">
        GRC DRIFT LAB
      </span>
    </Link>
  );
}
