import Link from "next/link";

export default function LabPage() {
  return (
    <article className="px-6 md:px-10 py-20 md:py-28 max-w-3xl mx-auto w-full text-center">
      <p className="text-xs tracking-[0.3em] text-[#7f77dd] mb-4 uppercase font-medium">
        In active development
      </p>

      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
        The Lab
      </h1>

      <p className="text-base md:text-lg text-white/65 leading-relaxed mb-10 max-w-2xl mx-auto">
        Theory only sticks when you apply it. The Lab will host short interactive scenarios where you read a real-world situation, identify the stage of drift in play, and receive structured feedback on your reasoning.
      </p>

      <div className="border-t border-white/10 pt-10 mb-12 max-w-xl mx-auto">
        <p className="text-[11px] tracking-[0.2em] text-[#afa9ec] uppercase mb-4">
          What&apos;s coming
        </p>
        <ul className="text-sm text-white/60 space-y-2 text-left">
          <li>· Five live drift scenarios across ISO 27001, ISM, and Essential Eight</li>
          <li>· Stage-by-stage analysis with model answers</li>
          <li>· AI-assisted feedback on your free-text reasoning</li>
          <li>· A drift-literacy score that grows as you complete scenarios</li>
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