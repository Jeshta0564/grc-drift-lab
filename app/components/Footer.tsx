import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-auto">
      <div className="px-6 md:px-10 py-10">
        {/* Top row: brand + LinkedIn + nav */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm tracking-[0.18em] font-medium text-[#7f77dd]">
              GRC DRIFT LAB
            </span>
            <a
              href="https://www.linkedin.com/in/jeshta-rao-3491a6197"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn — Jeshta Rao"
              className="text-white/40 hover:text-white transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/50">
            <Link href="/disclaimer" className="hover:text-white transition">
              Disclaimer
            </Link>
            <a
              href="mailto:jeshtarao@gmail.com"
              className="hover:text-white transition"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Disclaimer summary */}
        <p className="text-xs text-white/40 leading-relaxed max-w-4xl mb-3">
          GRC Drift Lab is an independent educational project. Content is co-authored with AI assistance and reviewed before publication. AI-powered features may produce inaccuracies — verify with primary sources. See full{" "}
          <Link
            href="/disclaimer"
            className="text-[#7f77dd] hover:text-[#afa9ec] transition"
          >
            Disclaimer
          </Link>
          .
        </p>

        {/* Copyright */}
        <p className="text-xs text-white/30 tracking-wider">
          © 2026 GRC Drift Lab · Built by Jeshta Rao · Melbourne
        </p>
      </div>
    </footer>
  );
}
