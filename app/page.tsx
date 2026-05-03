import Link from "next/link";

const frameworks = [
  "ISO 27001",
  "ISM",
  "Essential Eight",
  "PSPF",
  "IRAP",
];

// 48 particles scattered across the hero, each drifting outward from the centre.
// Each has a unique angle, distance, size, delay, and duration so the field looks organic.
type Particle = {
  angle: number;     // degrees, 0 = right, 90 = down
  distance: number;  // % of viewport - how far it drifts before fading out
  size: number;      // px
  delay: number;     // s, animation-delay to stagger spawns
  duration: number;  // s, how long the drift takes
  startOpacity: number; // 0-1, peak opacity during drift
};

// Pre-computed particle field. Deterministic so SSR and client match.
// Spread of angles ensures all directions covered evenly.
const particles: Particle[] = Array.from({ length: 80 }, (_, i) => {
  const angle = (i * 360) / 80 + (i % 7) * 4;
  const distance = 40 + ((i * 13) % 30);
  const size = 2 + ((i * 7) % 40) / 10;
  const delay = (i * 0.4) % 12;
  const duration = 10 + ((i * 11) % 6);
  const startOpacity = 0.45 + ((i * 17) % 35) / 100;
  return { angle, distance, size, delay, duration, startOpacity };
});

function ParticleField() {
  return (
    <div
      aria-hidden="true"
      className="hero-particles absolute inset-0 pointer-events-none overflow-hidden"
    >
      {particles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const dx = Math.cos(rad) * p.distance;
        const dy = Math.sin(rad) * p.distance;
        return (
          <span
            key={i}
            className="hero-particle"
            style={
              {
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                ["--dx" as string]: `${dx}vmax`,
                ["--dy" as string]: `${dy}vmax`,
                ["--peak" as string]: p.startOpacity,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

export default function Home() {
  // Duplicate the list once so the marquee loops seamlessly
  const marqueeItems = [...frameworks, ...frameworks];

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-6 md:px-10 py-20 text-center overflow-hidden">

      {/* ============================================================
          KINETIC: PARTICLE DRIFT
          Particles slowly drift outward from the centre - same outward
          metaphor as the Drift Model. Hidden on mobile / reduced motion.
         ============================================================ */}
      <ParticleField />

      {/* Soft radial vignette to ensure title area stays prominent */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,10,20,0.55) 0%, rgba(10,10,20,0) 60%)",
        }}
      />

      {/* ============================================================
          HERO CONTENT
         ============================================================ */}
      <div className="relative z-10 max-w-4xl">
        {/* Eyebrow */}
        <p className="text-xs tracking-[0.4em] text-[#7f77dd] mb-8 uppercase font-medium">
          Not a checklist. Not a framework.
        </p>

        {/* Title */}
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
      <div className="marquee w-full max-w-5xl relative z-10">
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

      {/* ============================================================
          PARTICLE STYLES + ANIMATION
         ============================================================ */}
      <style>{`
        .hero-particle {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(207, 202, 243, 1) 0%, rgba(175, 169, 236, 0.8) 50%, transparent 100%);
          box-shadow: 0 0 8px rgba(175, 169, 236, 0.6);
          opacity: 0;
          transform: translate(-50%, -50%);
          will-change: transform, opacity;
          animation-name: drift;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        @keyframes drift {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%);
          }
          15% {
            opacity: var(--peak, 0.25);
          }
          85% {
            opacity: var(--peak, 0.25);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy)));
          }
        }

        /* Hide on mobile - particle effect needs viewport room to breathe */
        @media (max-width: 768px) {
          .hero-particles { display: none; }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-particles { display: none; }
        }
      `}</style>
    </section>
  );
}