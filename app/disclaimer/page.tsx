import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — GRC Drift Lab",
  description:
    "Full disclaimer for GRC Drift Lab. Educational purpose, AI-powered features, third-party references, and non-affiliation notice.",
};

export default function DisclaimerPage() {
  return (
    <article className="px-6 md:px-10 py-16 md:py-24 max-w-3xl mx-auto w-full">
      <header className="mb-12">
        <p className="text-xs tracking-[0.3em] text-[#7f77dd] mb-3 uppercase font-medium">
          Legal · Transparency
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3">
          Disclaimer
        </h1>
        <p className="text-sm text-white/40">
          Last updated: 1 May 2026
        </p>
      </header>

      <div className="prose-invert space-y-10 text-white/75 leading-relaxed">
        <section>
          <h2 className="text-xl font-medium text-white mb-4">
            Educational Purpose
          </h2>
          <p className="mb-4">
            All content on <span className="text-[#afa9ec]">GRC Drift Lab</span> — including the Drift Model, learning scenarios, framework mappings, the GRC Dictionary, and any AI-assisted features — is provided strictly for educational and informational purposes.
          </p>
          <p>
            Nothing on this platform constitutes professional legal, audit, compliance, or regulatory advice. Always consult qualified professionals and refer to primary sources for decisions specific to your organisation&apos;s compliance obligations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-white mb-4">
            How This Site Was Built
          </h2>
          <p className="mb-4">
            GRC Drift Lab is an independent project built by{" "}
            <span className="text-[#afa9ec]">Jeshta Rao</span>, an ISO/IEC 27001 Lead Auditor and Master of Cyber Security student at RMIT University, Melbourne.
          </p>
          <p className="mb-4">In the spirit of transparency:</p>
          <ul className="space-y-3 list-disc list-outside ml-6 marker:text-[#7f77dd]">
            <li>
              The <span className="text-white">Drift Model</span>, the project concept, scenario design, and overall framing are original work.
            </li>
            <li>
              The <span className="text-white">GRC content</span> — including framework mappings, scenario narratives, dictionary entries, and explanatory text — is co-authored: drafted with AI assistance and reviewed by the author before publication.
            </li>
            <li>
              The <span className="text-white">website code</span> was written with AI-assisted development tools (Claude), in the same way modern developers use Copilot or Cursor.
            </li>
            <li>
              <span className="text-white">AI-powered features</span> on the site (such as scenario marking and feedback) use Anthropic&apos;s Claude API at runtime to evaluate user submissions against rubrics designed by the author.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium text-white mb-4">
            Limits of AI-Powered Features
          </h2>
          <p className="mb-4">
            Where AI is used to mark answers or provide feedback in real time, please note:
          </p>
          <ul className="space-y-2 list-disc list-outside ml-6 marker:text-[#7f77dd]">
            <li>AI-generated feedback may contain errors, oversimplifications, or occasional inaccuracies.</li>
            <li>Scores and feedback are intended as a learning aid, not a definitive assessment.</li>
            <li>Treat AI feedback as a starting point for further study, not a final authority.</li>
            <li>Always verify framework references and clause numbers against primary sources before relying on them.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium text-white mb-4">No Guarantees</h2>
          <p className="mb-4">
            While care is taken to keep content accurate and current, GRC Drift Lab makes no guarantees regarding:
          </p>
          <ul className="space-y-2 list-disc list-outside ml-6 marker:text-[#7f77dd]">
            <li>Specific career outcomes, job placements, or interview success.</li>
            <li>Passing any professional certification or examination.</li>
            <li>Regulatory acceptance or audit readiness of any approach demonstrated here.</li>
            <li>The completeness or accuracy of content at any given moment.</li>
          </ul>
          <p className="mt-4">
            GRC frameworks and regulations evolve. Always cross-reference with the issuing body&apos;s latest publications.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-white mb-4">
            Third-Party References
          </h2>
          <p>
            GRC Drift Lab references third-party frameworks and standards — including ISO/IEC 27001, the Australian Information Security Manual (ISM), the Essential Eight, the Protective Security Policy Framework (PSPF), IRAP, and NIST CSF — solely for educational context. These references do not imply endorsement, affiliation, or partnership with their respective publishing bodies. All trademarks and framework names remain the property of their respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-white mb-4">External Links</h2>
          <p>
            This site may contain links to third-party websites and resources. GRC Drift Lab is not responsible for the content, accuracy, or practices of external sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-white mb-4">
            Non-Affiliation Notice
          </h2>
          <p>
            GRC Drift Lab is an independent personal project. It is not affiliated with, endorsed by, or sponsored by Anthropic, RMIT University, Bosch, Honda, TryHackMe, Hack The Box, Do GRC, or any standards body referenced on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-white mb-4">Contact</h2>
          <p>
            For questions about this disclaimer, or to flag content that needs correcting, contact{" "}
            <a
              href="mailto:jeshtarao@gmail.com"
              className="text-[#7f77dd] hover:text-[#afa9ec] transition"
            >
              jeshtarao@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
