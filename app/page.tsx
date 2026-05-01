import Link from "next/link";

const frameworks = [
  "ISO 27001",
  "ISM",
  "Essential Eight",
  "PSPF",
  "IRAP",
];

export default function Home() {
  // Duplicate the list once so the marquee loops seamlessly
  const marqueeItems = [...frameworks, ...frameworks];

  return (
    <section className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 py-20 text-center">
      <div className="max-w-4xl">
        {/* Eyebrow */}
        <p className="text-xs tracking-[0.4em] text-[#7f77dd] mb-8 uppercase font-medium">
          Not a checklist. Not a framework.
        </p>

        {/* Title with violet glow + hover-to-color on Drift */}
        <h1 className="title-glow text-5xl md:text-8xl font-semibold tracking-tight mb-8 leading-[0.95]">
          GRC <span className="drift-word italic font-light text-white/70">Drift</span> Lab
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-2xl text-white/60 font-light max-w-2xl mx-auto mb-16 leading-relaxed">
          Modeling how GRC systems drift from intent to reality.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href="/drift-model"
            className="px-8 py-3 bg-[#7f77dd] text-white text-sm tracking-wide hover:bg-[#afa9ec] transition rounded-md font-medium"
          >
            Explore the Drift Model →
          </Link>
          <Link
            href="/lab"
            className="px-8 py-3 border border-white/20 text-white text-sm tracking-wide hover:bg-white/5 hover:border-white/40 transition rounded-md"
          >
            Enter the Lab
          </Link>
        </div>

        {/* Eyebrow above marquee */}
        <p className="text-xs tracking-[0.3em] text-white/30 mb-4 uppercase">
          From compliance to reality.
        </p>
      </div>

      {/* Marquee — full-width strip */}
      <div className="marquee w-full max-w-5xl">
        <div className="marquee-track">
          {marqueeItems.map((fw, i) => (
            <div
              key={i}
              className="flex items-center shrink-0 px-6 py-2 text-xs tracking-[0.3em] text-white/40 uppercase"
            >
              <span>{fw}</span>
              <span className="text-white/15 ml-6">·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}