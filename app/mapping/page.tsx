import Link from "next/link";

export default function MappingPage() {
  return (
    <article className="px-6 md:px-10 py-20 md:py-28 max-w-3xl mx-auto w-full text-center">
      <p className="text-xs tracking-[0.3em] text-[#7f77dd] mb-4 uppercase font-medium">
        In active development
      </p>

      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
        The Mapping Engine
      </h1>

      <p className="text-base md:text-lg text-white/65 leading-relaxed mb-10 max-w-2xl mx-auto">
        Describe a control in plain English. The Mapping Engine will translate it into the equivalent clauses across ISO 27001, the ISM, the Essential Eight, NIST CSF, and SOC 2 - so you can see where the same control lives across frameworks, and where the gaps are.
      </p>

      <div className="border-t border-white/10 pt-10 mb-12 max-w-xl mx-auto">
        <p className="text-[11px] tracking-[0.2em] text-[#afa9ec] uppercase mb-4">
          What&apos;s coming
        </p>
        <ul className="text-sm text-white/60 space-y-2 text-left">
          <li>· Plain-English input, framework clauses out</li>
          <li>· Side-by-side comparison across major frameworks</li>
          <li>· Confidence scores on each mapping</li>
          <li>· Coverage view - which frameworks address a control, which don&apos;t</li>
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