// Single source of truth for all Lab scenarios.
// Add scenarios incrementally - the UI auto-renders based on this data.

export type Difficulty = "easy" | "moderate" | "hard";
export type Domain = "finance" | "healthcare" | "education" | "industrial";
export type StageId = 1 | 2 | 3 | 4 | 5 | 6;

export type ScenarioStatus = "available" | "coming-soon";

export type Scenario = {
  id: string;
  title: string;
  domain: Domain;
  difficulty: Difficulty;
  status: ScenarioStatus;
  isRealWorld: boolean;
  shortPrompt: string;
  situation?: string;
  task?: string;
  modelAnswer?: {
    acceptablePairs: StageId[][];
    reasoning: string;
  };
};

export const STAGE_NAMES: Record<StageId, string> = {
  1: "Intent",
  2: "Control",
  3: "Implementation",
  4: "Reality",
  5: "Audit",
  6: "Drift",
};

export const DOMAIN_LABELS: Record<Domain, string> = {
  finance: "Finance",
  healthcare: "Healthcare",
  education: "Education",
  industrial: "Industrial",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
};

export const SCENARIOS: Scenario[] = [
  // ============ EASY TIER ============
  {
    id: "northbridge-access-review",
    title: "The Quarterly Access Review",
    domain: "finance",
    difficulty: "easy",
    status: "available",
    isRealWorld: false,
    shortPrompt:
      "An Australian fintech's quarterly privileged-access review looks complete on paper. The reality is different.",
    situation: `Northbridge Capital is a 180-person Australian fintech offering buy-now-pay-later services. Their information security policy states that "all privileged user accounts must be reviewed quarterly by the system owner, with the review documented in the access register." The control was written in 2021 and approved by the Risk Committee.

When the policy was implemented, the IT team set up calendar reminders, created a shared SharePoint review template, and trained the original three system owners. The first three quarterly reviews ran cleanly. However, in 2023, two of the original system owners left and were replaced. The new owners were never trained on the access-review process. Calendar reminders kept firing, but the new owners marked them as "done" without performing the review. The SharePoint register shows a complete and signed-off audit trail for every quarter.

An external auditor sampled three quarters of access reviews in 2024 and confirmed all were "completed and documented." Six months later, an internal incident revealed that a former contractor had retained privileged database access for fourteen months after their contract ended.`,
    task: "Identify two stages of the Drift Model where this scenario shows clear drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [[4, 5]],
      reasoning: `The strongest reading is Stage 4 (Reality) and Stage 5 (Audit).

Stage 4 (Reality) - The control was implemented correctly in 2021 with templates, training, and calendar reminders. Reality drifted as personnel changed: new system owners marked reviews as "done" without performing them. Operational reality silently diverged from documented implementation. This is textbook Stage 4 drift driven by personnel change.

Stage 5 (Audit) - The external auditor sampled the access reviews and confirmed they were "completed and documented" based on the SharePoint register. The auditor confirmed the paper trail rather than the operational truth - exactly what Stage 5 drift looks like.

Stage 1 (Intent) is NOT a strong answer here - the intent was reasonable. Stage 2 (Control) is NOT a strong answer - the control was well-designed. Stage 3 (Implementation) is NOT a strong answer - the implementation worked correctly at first.`,
    },
  },
  {
    id: "medibank-mfa",
    title: "Medibank — The MFA That Wasn't",
    domain: "healthcare",
    difficulty: "easy",
    status: "available",
    isRealWorld: true,
    shortPrompt:
      "Australia's largest health insurer had MFA on paper. Two prior audits flagged the gap. Then the breach happened.",
    situation: `Medibank is Australia's largest private health insurer, holding sensitive medical records on millions of Australians. As a regulated entity, multi-factor authentication (MFA) on privileged access was both a documented internal requirement and a baseline industry expectation.

Two prior security reviews had flagged this exact gap. In mid-2020, a Datacom report identified MFA absence as a "critical defect." In August 2021, KPMG repeated the warning in its assessment. In both cases, leadership documented the finding and implementation plans were drafted.

In August 2022, an attacker obtained credentials belonging to an IT service desk contractor whose personal laptop was compromised. They used those credentials to log in to Medibank's Global Protect VPN — which did not enforce MFA. Endpoint detection alerts on 24 and 25 August 2022 flagged anomalous activity but were not triaged or escalated. Over the next six weeks, the attacker exfiltrated approximately 520 GB of customer data including health records.`,
    task: "Identify two stages of the Drift Model where this scenario shows clear drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [[4, 5], [3, 4], [4, 3]],
      reasoning: `Two readings are acceptable for this scenario.

Reading 1 (most common): Stage 4 (Reality) + Stage 5 (Audit).
- Stage 4 - MFA was a documented requirement but not enforced on the VPN. Reality drifted from documented implementation. EDR alerts on 24-25 August were not triaged - reality diverging from operational expectations.
- Stage 5 - Two independent audit reviews flagged the gap (Datacom 2020, KPMG 2021), but findings did not translate to corrective action. The audit cycle confirmed the issue; the operational cycle didn't close it.

Reading 2 (also strong): Stage 3 (Implementation) + Stage 4 (Reality).
- Stage 3 - The implementation of MFA fell short of the control design from inception. The Global Protect VPN was excluded from MFA enforcement; this is a Day-One implementation gap, not later drift.
- Stage 4 - Plus operational reality drift in alert triage.

Either reading is acceptable. Stages 1, 2, and 6 are NOT strong answers - the intent was clear, the control was well-defined, and Drift (Stage 6) is the cumulative phenomenon, not a specific gap point in this scenario.`,
    },
  },
  {
    id: "deakin-smishing",
    title: "Deakin University — The SMS Vendor",
    domain: "education",
    difficulty: "easy",
    status: "available",
    isRealWorld: true,
    shortPrompt:
      "A staff member's credentials gave an attacker access to a third-party SMS provider holding details on 47,000 students.",
    situation: `Deakin University is a Victorian university with around 47,000 enrolled students. To send mass SMS communications - exam reminders, enrolment notices, emergency alerts - the university used a third-party SMS forwarding service. Staff prepared message content, then the third-party platform handled delivery to student mobile numbers.

Deakin's information security policy required strong authentication for any system holding student personal information. The same policy applied to "any third-party service used by the university for communication or record-keeping." Internal documentation listed the SMS vendor as one such service.

In July 2022, a staff member's username and password for the SMS vendor were obtained by an attacker. The vendor's platform did not enforce multi-factor authentication for university accounts. Using the credentials, the attacker logged in directly, accessed the contact details of 46,980 current and past students - including names, mobile numbers, university email addresses and recent exam result comments - and used the platform to send a phishing SMS to 9,997 students. The fake message claimed to be a parcel delivery notification and asked recipients to enter credit card details on a spoofed web form.`,
    task: "Identify two stages of the Drift Model where this scenario shows clear drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [[3, 4], [4, 3]],
      reasoning: `The strongest reading is Stage 3 (Implementation) and Stage 4 (Reality).

Stage 3 (Implementation) - The control existed and was clear: "strong authentication for any system holding student personal information." But the implementation did not extend to the third-party SMS vendor in practice. The vendor account was set up with single-factor login from inception. The control's coverage was incomplete on day one of the vendor relationship - a Stage 3 implementation gap.

Stage 4 (Reality) - Even if implementation had been correct at start, operational reality drifted: the credentials were not rotated, MFA was not enforced retroactively, and there is no indication the vendor account was being monitored. The vendor relationship continued unchanged while the documented standard advanced.

Stage 1 (Intent) is NOT a strong answer - intent was clear (protect student data). Stage 2 (Control) is NOT a strong answer - the control was reasonable. Stage 5 (Audit) is a weaker reading because the scenario does not mention an audit cycle that explicitly missed the gap.`,
    },
  },
  {
    id: "dpworld-ransomware",
    title: "DP World Australia — Ports Offline",
    domain: "industrial",
    difficulty: "easy",
    status: "available",
    isRealWorld: true,
    shortPrompt:
      "Four major Australian ports went offline for three days. The vulnerability had been publicly known and patchable for over a year.",
    situation: `DP World Australia is the country's largest port operator, handling around 40% of Australia's container freight across terminals in Sydney, Melbourne, Brisbane and Fremantle. As a designated critical infrastructure asset under the SOCI Act, DP World has obligations to maintain documented cyber security risk management practices and report incidents within 12 hours of discovery.

In November 2023, attackers exploited a known vulnerability in Citrix software (CVE-2023-4966, often called "Citrix Bleed") to gain initial access to DP World's corporate environment. The vulnerability had been publicly disclosed in October 2023, and a patch had been available for several weeks. DP World's documented patching policy required "high-severity vulnerabilities to be patched within 14 days of public disclosure" - the patch had not been applied at the time of compromise.

Once inside, the attackers exfiltrated employee data and triggered a precautionary network shutdown. To prevent further spread, DP World took its terminal operating systems offline for nearly three days, halting container movement at all four ports. Around 30,000 containers were stranded. The incident also exposed personal information of employees, including identity documents and tax file numbers.`,
    task: "Identify two stages of the Drift Model where this scenario shows clear drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [[3, 4], [4, 3]],
      reasoning: `The strongest reading is Stage 3 (Implementation) and Stage 4 (Reality).

Stage 3 (Implementation) - The patching control was well-defined: "high-severity vulnerabilities to be patched within 14 days." The implementation was supposed to operationalise this through automated scanning, ticketing and escalation. But the Citrix patch sat unapplied for several weeks past the policy window - the implementation pipeline did not actually deliver patches in line with the documented standard.

Stage 4 (Reality) - Operational reality drifted from documented expectations. Whatever the implementation looked like in 2022, by November 2023 the gap between "what we say we do" (patch in 14 days) and "what we are doing" (this critical patch sat unapplied) had widened. Reality drifted away from the control over time.

Stage 1 (Intent) is NOT a strong answer - intent was clear (patch promptly). Stage 2 (Control) is NOT a strong answer - the 14-day window is a reasonable, testable control. Stage 5 (Audit) is possible but the scenario does not detail an audit cycle that missed the gap.`,
    },
  },

  // ============ MODERATE TIER ============
  {
    id: "hwl-ebsworth",
    title: "HWL Ebsworth — The Law Firm Holding Everything",
    domain: "finance",
    difficulty: "moderate",
    status: "available",
    isRealWorld: true,
    shortPrompt:
      "A law firm holding data for the Big Four banks, RBA and most of the ASX 50 was breached. The exposure had been quietly accumulating for years.",
    situation: `HWL Ebsworth is one of Australia's largest commercial law firms. As of early 2023, its client list included the Reserve Bank of Australia, all four major Australian banks, large insurance companies, ASX-listed corporations and dozens of Commonwealth and state government departments. To service these clients, the firm received and held substantial volumes of sensitive financial data: loan documentation, board papers, credit card information, identity documents, internal financial reports, customer files.

The firm operated under standard professional and regulatory obligations to keep client data confidential and secure. Internal policy committed the firm to industry-aligned information security practices, including access control, network segmentation and regular security reviews. There is no public indication the firm operated under a formally certified ISMS.

On 28 April 2023, the ALPHV/BlackCat ransomware group claimed to have exfiltrated data from HWL Ebsworth's network. Court documents later revealed that the firm had received emails from the attackers as early as 26 April that were initially treated as spam. By May, around four terabytes of data was claimed stolen; in June, approximately 1.4 TB was published to the dark web after the firm refused to pay the ransom.

The breach surfaced two structural realities. First, the firm had accumulated client data well beyond active engagements - including documents from matters closed years earlier - because there was no enforced retention or destruction policy aligned with how much sensitive data the business actually generated. Second, network segmentation between matter files for different clients was limited, allowing the attackers to access data from many clients through a single compromised area. Both realities had developed gradually as the firm grew, without corresponding adjustments to controls or audit scope.`,
    task: "Identify two stages of the Drift Model where this scenario shows clear drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [[1, 6], [6, 1], [1, 5], [5, 1]],
      reasoning: `Two readings are acceptable for this scenario, both involving Stage 1.

Reading 1 (strongest): Stage 1 (Intent) + Stage 6 (Drift).
- Stage 1 - The firm's stated intent on data retention and segmentation never updated to reflect the scale of the data it accumulated. Intent stayed at a generic "industry-aligned" level while the operational footprint grew dramatically. Like Latitude, this is an Intent-stage failure where the documented stance is misaligned with what the business is actually doing.
- Stage 6 - The breach is the surfacing of cumulative drift that built up across years. Multiple stages contributed (intent, implementation, reality), and the failure compounded. The scenario explicitly describes this as having "developed gradually as the firm grew, without corresponding adjustments."

Reading 2 (also acceptable): Stage 1 (Intent) + Stage 5 (Audit).
- Stage 1 as above.
- Stage 5 - Audit scope did not expand to match the firm's growing data footprint. Whatever security reviews ran, they continued to assess against an outdated picture of what the firm held and how it was segmented.

Stage 4 (Reality) is a defensible secondary read but Stage 1 is the standout - this scenario is fundamentally about misaligned intent at the policy and governance level, not just operational drift.`,
    },
  },
  {
    id: "australian-clinical-labs",
    title: "Australian Clinical Labs — Acquired Without Inspection",
    domain: "healthcare",
    difficulty: "moderate",
    status: "available",
    isRealWorld: true,
    shortPrompt:
      "ACL inherited a pathology business with weak security controls and treated the existing arrangements as adequate. Eight months later, the OAIC took action.",
    situation: `Australian Clinical Labs (ACL) is one of Australia's largest pathology providers. In December 2021, ACL acquired Medlab Pathology, an existing pathology business with around 200 collection centres. With the acquisition came Medlab's existing IT environment, customer record systems and security controls.

ACL's parent organisation maintained a documented information security framework with controls covering access management, vulnerability management, incident response and third-party risk. Acquired entities were nominally subject to the framework. However, in practice, integration of Medlab's IT environment into ACL's controls was deferred. ACL relied on Medlab's pre-existing security arrangements as adequate without performing a documented gap assessment against the parent framework.

In February 2022, an attacker exfiltrated 86 GB of data from a Medlab system, including 223,000 individuals' health information, identity documents and credit card details. ACL was made aware of the incident in February 2022 by both the ACSC and a third party, but did not identify the data exfiltration during its own internal review and concluded no notifiable data breach had occurred. The OAIC was not notified until July 2022, more than four months after ACL had reasonable grounds to suspect a breach. In October 2025, ACL was fined AU$5.8 million.

Investigation showed the compromised Medlab environment had multiple long-standing weaknesses: end-of-life operating systems, missing endpoint monitoring, and incomplete logging - all pre-dating the acquisition. None of these had been raised through ACL's incident response or audit processes during the eight months between acquisition and breach.`,
    task: "Identify two stages of the Drift Model where this scenario shows clear drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [[3, 5], [5, 3], [3, 4], [4, 3]],
      reasoning: `Two readings are strong here. Both pivot on Stage 3.

Reading 1 (strongest): Stage 3 (Implementation) + Stage 5 (Audit).
- Stage 3 - The parent's security framework was not actually implemented in the acquired Medlab environment. There was no documented gap assessment, no migration of controls, no integration of monitoring. From the acquisition date forward, the documented control set was a fiction in this part of the organisation.
- Stage 5 - Audit and review processes did not detect the gap during the eight-month window between acquisition and breach. Even after the ACSC and a third party flagged the incident, ACL's internal review concluded no breach had occurred - the audit lens was not seeing the operational truth.

Reading 2 (also acceptable): Stage 3 (Implementation) + Stage 4 (Reality).
- Stage 3 as above.
- Stage 4 - Even setting aside implementation, operational reality (end-of-life OS, missing logging, weak monitoring) was clearly diverged from the parent's documented standards.

Stage 1 (Intent) is NOT a strong answer - the intent to apply the framework existed. Stage 2 (Control) is NOT a strong answer - the controls were reasonable. Stage 6 (Drift) is the cumulative phenomenon and weaker than naming the specific stages where it accumulated.`,
    },
  },
  {
    id: "wsu-three-breaches",
    title: "Western Sydney University — Three Breaches in a Year",
    domain: "education",
    difficulty: "moderate",
    status: "available",
    isRealWorld: true,
    shortPrompt:
      "WSU disclosed three separate breaches across 2023-2024. Each one revealed weaknesses that had been live during the previous one.",
    situation: `Western Sydney University (WSU) is a public Australian university with around 50,000 students. Across 2023 and 2024, the university disclosed three separate cyber incidents.

In May 2024, WSU disclosed that attackers had accessed its Microsoft 365 environment between May 2023 and January 2024 - approximately eight months of undetected access - and that email accounts and SharePoint files belonging to around 7,500 staff and students had been exposed. Investigation suggested that infrastructure in the Solar Car Laboratory had been used as a foothold during the incident.

In July 2024, WSU disclosed a second incident: between July 2023 and March 2024, attackers had accessed 83 of 400 directories on the university's Isilon storage platform, totalling approximately 580 TB of data including staff and student personal information.

In April 2025, the university disclosed a third incident affecting around 10,000 students, again involving unauthorised access to a research-adjacent system.

Public information confirms WSU operates under the standard tertiary information security framework, including documented requirements for monitoring, access control and segmentation between research and corporate environments. However, the university's detection and response cycles operated primarily on the corporate network. Research labs and connected experimental infrastructure - including the Solar Car Laboratory - sat in less-monitored zones and were not consistently included in detection coverage. Each subsequent incident showed that the gaps revealed by the previous one had not been fully closed when the next access began.`,
    task: "Identify two stages of the Drift Model where this scenario shows clear drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [[4, 6], [6, 4], [4, 5], [5, 4]],
      reasoning: `Two readings are strong, with Stage 4 being central to either.

Reading 1 (strongest): Stage 4 (Reality) + Stage 6 (Drift).
- Stage 4 - Operational reality diverged from documented monitoring expectations. Detection and response cycles ran on corporate networks but did not consistently extend to research-adjacent systems like the Solar Car Lab. The eight-month dwell time before the first disclosure is the clearest signal of operational reality drift.
- Stage 6 - Three separate disclosures across 12 months, each revealing weaknesses that had been live during the previous one, is textbook cumulative drift. The earlier incidents did not result in closing the gaps that the later ones exploited. Drift was compounding faster than remediation.

Reading 2 (also defensible): Stage 4 (Reality) + Stage 5 (Audit).
- Stage 4 as above.
- Stage 5 - Whatever audit and review cycles existed, they were not surfacing the segmentation gap or the monitoring blind spots in research-adjacent systems before incidents made them visible.

Stage 1 (Intent) is NOT a strong answer - the framework intent was reasonable. Stage 2 (Control) is NOT a strong answer - controls existed. Stage 3 (Implementation) could be argued for the original deployment of monitoring, but the scenario emphasises ongoing reality and compounding more than original setup.`,
    },
  },
  {
    id: "synthetic-water-utility",
    title: "Riverstone Water — The Engineer's Convenience VPN",
    domain: "industrial",
    difficulty: "moderate",
    status: "available",
    isRealWorld: false,
    shortPrompt:
      "A regional water utility's after-hours remote access setup quietly grew into a parallel network nobody documented or audited.",
    situation: `Riverstone Water is a fictional regional water utility serving 90,000 customers across three local government areas in regional Australia. As a designated critical infrastructure asset, the utility maintains a Cyber Security Risk Management Plan (CIRMP) under the SOCI Act and operates separate IT and OT environments with formal segmentation between them.

Documented standards required all remote access to OT systems to occur through an enterprise jump-host with multi-factor authentication, logging and review. The OT engineering team operated under these standards during normal hours.

Around 2019, the on-call engineering roster shifted to allow after-hours response from home for non-critical alerts. To enable this, two senior engineers each set up a personal commercial VPN (a consumer-grade product) to allow direct access from their home machines to a shared engineering workstation on the OT network. This bypassed the enterprise jump-host. The arrangement was never formally approved, but it was widely known on the team and treated as a practical necessity. Over the next three years, four more engineers joined the arrangement. The personal VPN service became the de facto after-hours access path.

Annual security reviews continued to validate the documented enterprise jump-host architecture. The reviews drew their access inventory from corporate identity records, which did not include the personal VPN accounts. In 2024, a phishing attack against one of the engineers' personal email accounts gave attackers access to the personal VPN credentials, and from there to the OT engineering workstation. The attackers spent eleven days reconnoitring the OT environment before being detected during a routine network audit.`,
    task: "Identify two stages of the Drift Model where this scenario shows clear drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [[4, 5], [5, 4]],
      reasoning: `The strongest reading is Stage 4 (Reality) and Stage 5 (Audit).

Stage 4 (Reality) - The control and implementation were both reasonable: enterprise jump-host with MFA, formally segmented. But operational reality grew an undocumented parallel access path - the personal VPN setup - that became the de facto after-hours path. Reality drifted significantly from the documented architecture, and the drift was systemic across multiple engineers.

Stage 5 (Audit) - The annual reviews continued to validate the documented architecture using corporate identity records as input. The audit lens did not expand to include the actual access paths in use; it confirmed the paper architecture rather than the operational reality. Personal VPN accounts were invisible to the audit cycle because they sat outside the inventory the audit pulled from.

Stage 1 (Intent) is NOT a strong answer - intent was clear. Stage 2 (Control) is NOT a strong answer - the documented control set was reasonable. Stage 3 (Implementation) is NOT a strong answer - the official jump-host architecture was implemented as designed; the parallel path emerged later. Stage 6 (Drift) is the cumulative phenomenon and weaker than naming the specific stages where the drift surfaced.`,
    },
  },

  // ============ HARD TIER STUBS ============
  {
    id: "hard-finance-stub",
    title: "Coming soon",
    domain: "finance",
    difficulty: "hard",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "A finance-sector hard scenario is being prepared.",
  },
  {
    id: "hard-healthcare-stub",
    title: "Coming soon",
    domain: "healthcare",
    difficulty: "hard",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "A healthcare-sector hard scenario is being prepared.",
  },
  {
    id: "hard-education-stub",
    title: "Coming soon",
    domain: "education",
    difficulty: "hard",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "An education-sector hard scenario is being prepared.",
  },
  {
    id: "hard-industrial-stub",
    title: "Coming soon",
    domain: "industrial",
    difficulty: "hard",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "An industrial-sector hard scenario is being prepared.",
  },
];

// Helper: get scenarios filtered by difficulty
export function getScenariosByDifficulty(difficulty: Difficulty): Scenario[] {
  return SCENARIOS.filter((s) => s.difficulty === difficulty);
}

// Helper: get a single scenario by id
export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}