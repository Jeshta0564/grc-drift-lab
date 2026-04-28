export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Top navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="text-sm tracking-[0.3em] font-light text-white/80">
          GRC DRIFT LAB
        </div>
        <div className="hidden md:flex gap-8 text-sm text-white/60">
          <a href="#drift-model" className="hover:text-white transition">Drift Model</a>
          <a href="#lab" className="hover:text-white transition">Lab</a>
          <a href="#dictionary" className="hover:text-white transition">Dictionary</a>
          <a href="#mapping" className="hover:text-white transition">Mapping</a>
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </div>
      </nav>

      {/* Hero section */}
      <section className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p className="text-xs tracking-[0.4em] text-white/40 mb-8 uppercase">
            From compliance to reality
          </p>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-8 leading-[0.95]">
            GRC <span className="font-normal italic text-white/70">Drift</span> Lab
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mx-auto mb-16 leading-relaxed">
            Where compliant systems quietly become vulnerable
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a
              href="#drift-model"
              className="px-8 py-3 bg-white text-black text-sm tracking-wide hover:bg-white/90 transition"
            >
              Explore the Drift Model
            </a>
            <a
              href="#lab"
              className="px-8 py-3 border border-white/30 text-white text-sm tracking-wide hover:bg-white/10 transition"
            >
              Enter the Lab
            </a>
          </div>

          {/* Framework strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs tracking-[0.3em] text-white/30 uppercase">
            <span>ISO 27001</span>
            <span className="text-white/20">·</span>
            <span>ISM</span>
            <span className="text-white/20">·</span>
            <span>Essential Eight</span>
            <span className="text-white/20">·</span>
            <span>PSPF</span>
            <span className="text-white/20">·</span>
            <span>IRAP</span>
          </div>
        </div>
      </section>

      {/* Footer watermark */}
      <footer className="px-8 py-6 border-t border-white/10 text-center text-xs text-white/30 tracking-wider">
        Built by Jeshta Rao · Melbourne
      </footer>
    </main>
  );
}
