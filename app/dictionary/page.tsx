import Link from "next/link";

export default function DictionaryPage() {
  return (
    <article className="px-6 md:px-10 py-20 md:py-28 max-w-3xl mx-auto w-full text-center">
      <p className="text-xs tracking-[0.3em] text-[#7f77dd] mb-4 uppercase font-medium">
        In active development
      </p>

      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
        The GRC Dictionary
      </h1>

      <p className="text-base md:text-lg text-white/65 leading-relaxed mb-10 max-w-2xl mx-auto">
        The same word means different things in different frameworks. The Dictionary will define core GRC terms in plain English, then show how each maps across ISO 27001, the ISM, the Essential Eight, NIST CSF, and SOC 2.
      </p>

      <div className="border-t border-white/10 pt-10 mb-12 max-w-xl mx-auto">
        <p className="text-[11px] tracking-[0.2em] text-[#afa9ec] uppercase mb-4">
          What&apos;s coming
        </p>
        <ul className="text-sm text-white/60 space-y-2 text-left">
          <li>· 60+ entries: control, risk, residual risk, attestation, assurance, drift</li>
          <li>· Plain-English definition first, then framework-specific framings</li>
          <li>· Cross-references where terms diverge meaningfully</li>
          <li>· Searchable, with related-term suggestions</li>
        </ul>
      </div>

      <Link
        href="/drift-model"
        className="inline-block px-8 py-3 border border-white/20 text-white text-sm tracking-wide hover:bg-white/5 hover:border-white/40 transition rounded-md"
      >
        ← Explore the Drift Model
      </Link>
    </article>
  );
}