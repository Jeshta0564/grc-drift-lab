import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — GRC Drift Lab",
  description:
    "Get in touch with Jeshta Rao about GRC Drift Lab — feedback, opportunities, or just to say hello.",
};

export default function ContactPage() {
  return (
    <article className="px-6 md:px-10 py-16 md:py-24 max-w-3xl mx-auto w-full">
      {/* Header */}
      <header className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] text-[#7f77dd] mb-3 uppercase font-medium">
          Get in touch
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          Contact
        </h1>
        <p className="text-base md:text-lg text-white/60">
          Have a question, feedback, or want to say hi? You&apos;re in the right place.
        </p>
      </header>

      {/* Cards */}
      <div className="space-y-5 mb-8">
        {/* Email card */}
        <a
          href="mailto:jeshtarao@gmail.com"
          className="block bg-white/[0.03] border border-white/10 rounded-xl p-8 md:p-10 text-center hover:border-[#7f77dd]/40 hover:bg-white/[0.05] transition group"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#7f77dd]/15 mb-5 group-hover:bg-[#7f77dd]/25 transition">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#afa9ec"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>

          <h2 className="text-xl font-medium text-white mb-2">Mail me</h2>
          <p className="text-sm text-white/50 mb-4 max-w-md mx-auto">
            Questions, feedback, or hello — I read every message.
          </p>
          <p className="font-mono text-sm text-[#afa9ec] group-hover:text-white transition">
            jeshtarao@gmail.com
          </p>
        </a>

        {/* LinkedIn card */}
        <a
          href="https://www.linkedin.com/in/jeshta-rao-3491a6197/"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white/[0.03] border border-white/10 rounded-xl p-8 md:p-10 text-center hover:border-[#7f77dd]/40 hover:bg-white/[0.05] transition group"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#7f77dd]/15 mb-5 group-hover:bg-[#7f77dd]/25 transition">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#afa9ec">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>

          <h2 className="text-xl font-medium text-white mb-2">LinkedIn</h2>
          <p className="text-sm text-white/50 mb-4 max-w-md mx-auto">
            Project updates, build journey, and the occasional thought on GRC.
          </p>
          <p className="text-sm text-[#afa9ec] group-hover:text-white transition">
            Visit profile →
          </p>
        </a>

        {/* More by Jeshta — horizontal strip */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl px-6 md:px-10 py-5 flex flex-col md:flex-row md:items-center md:justify-center gap-3 md:gap-10 text-center md:text-left">
          <span className="text-sm text-white/50 tracking-wide">
            More by Jeshta:
          </span>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
            <a
              href="https://jeshtarao.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#afa9ec] hover:text-white transition font-medium"
            >
              Portfolio →
            </a>
            <a
              href="https://jeshtarao-fxpsi.wordpress.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#afa9ec] hover:text-white transition font-medium"
            >
              GRC Through the Lens →
            </a>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition"
        >
          ← Back to home
        </Link>
      </div>
    </article>
  );
}