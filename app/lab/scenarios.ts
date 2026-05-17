// Single source of truth for all Lab scenarios.

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

  // ============ HARD TIER ============
  {
    id: "equifax-cumulative",
    title: "Equifax — Two Years of Compounded Failure",
    domain: "finance",
    difficulty: "hard",
    status: "available",
    isRealWorld: true,
    shortPrompt:
      "The 2017 breach was not one failure but six. A 2018 House Oversight report described it as 'entirely preventable' across every preceding stage.",
    situation: `Equifax was one of the three largest credit reporting agencies in the United States, holding sensitive financial and identity data on hundreds of millions of consumers across the US, UK and Canada.

In 2015, Equifax began an aggressive growth campaign that expanded its data collection considerably. A 2015 internal audit revealed a significant backlog of unresolved vulnerabilities, found that the company was not adhering to its own patching schedules, and noted that IT staff lacked a comprehensive asset inventory. The patching process at the time relied on an honour system without strict enforcement. The audit outlined remediation actions; many remained outstanding two years later.

On 7 March 2017, Apache disclosed CVE-2017-5638, a critical vulnerability in the Struts web framework, and released a patch the same day. The US Computer Emergency Readiness Team notified Equifax on 8 March. Equifax's documented control required patching critical vulnerabilities within 48 hours; the global vulnerability management team emailed system administrators on 9 March. However, the recipient list for the notice was out of date, and the personnel responsible for the affected Automated Consumer Interview System (ACIS) did not receive it. A scan on 15 March returned no findings - it did not detect the still-vulnerable ACIS.

In May 2017, attackers exploited the unpatched Struts vulnerability on ACIS. They moved laterally for 76 days, locating plaintext credentials on internal systems that unlocked access to broader databases. They issued over 9,000 queries and exfiltrated data in small batches. The intrusion went undetected because a network monitoring tool had been inactive for 19 months due to an expired SSL certificate. The expired certificate was renewed on 29 July 2017, at which point the breach was detected. Approximately 147 million consumer records were affected. The 2018 House Oversight Committee report described the breach as "entirely preventable" and cited a lack of accountability, an execution gap between IT policy and operations, and inadequate IT asset inventory.`,
    task: "Identify two stages of the Drift Model where this scenario shows the most significant drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [
        [2, 6], [6, 2],
        [3, 6], [6, 3],
        [5, 6], [6, 5],
        [2, 5], [5, 2],
        [3, 5], [5, 3],
      ],
      reasoning: `This is a Hard scenario because drift is genuinely present at almost every preceding stage. The strongest readings involve Stage 6 (Drift) paired with one specific stage where the drift surfaced most clearly. Multiple defensible pairs.

Reading 1 (strongest): Stage 2 (Control) + Stage 6 (Drift).
- Stage 2 - The patching control was poorly designed for the scale of Equifax's environment. A 48-hour patching window without enforcement, without complete asset inventory, and dependent on a manual email distribution list was unenforceable from inception. The control existed on paper; it could not have worked even if everyone tried to follow it perfectly.
- Stage 6 - The breach was the surfacing of accumulated drift across multiple stages over years (2015 audit findings unremediated by 2017, expired certificate disabling monitoring for 19 months, plaintext credentials on internal systems). Drift compounded faster than remediation.

Reading 2 (also strong): Stage 3 (Implementation) + Stage 6 (Drift).
- Stage 3 - Implementation failures are equally damning: the patch notification recipient list was out of date, scans missed the vulnerable system, monitoring tools had been inactive due to certificate management failures. The control's operational pipeline was broken on multiple fronts.
- Stage 6 as above.

Reading 3 (also acceptable): Stage 5 (Audit) + Stage 6 (Drift).
- Stage 5 - The 2015 internal audit had identified most of the deficiencies that enabled the breach. Audit produced visibility but did not drive closure. The audit cycle ran; the operational cycle didn't respond.
- Stage 6 as above.

Other combinations involving Stages 2, 3, 5 paired together (without Stage 6) are also acceptable because they all name real, defensible stages where drift was visible.

Stage 1 (Intent) is a defensible secondary read - aggressive growth without corresponding security investment is an Intent issue - but it is a weaker primary answer than the operational failures.`,
    },
  },
  {
    id: "anthem-data-warehouse",
    title: "Anthem — When the Front Line Wasn't",
    domain: "healthcare",
    difficulty: "hard",
    status: "available",
    isRealWorld: true,
    shortPrompt:
      "A phishing email reached a system administrator. Eleven months later, 78.8 million records were gone. The technical controls Anthem trusted weren't where the actual gap lived.",
    situation: `Anthem Inc. was the second-largest health insurance company in the United States, holding personal and healthcare information for tens of millions of members across multiple state subsidiaries.

Anthem maintained a documented information security framework with controls aligned to industry expectations: identity and access management, network segmentation, security awareness training, monitoring, incident response. A subsequent investigation by the California Department of Insurance later concluded the company had taken "reasonable measures before the data breach to protect its data." Anthem invested in technical defences and considered itself adequately controlled.

On 18 February 2014, a system administrator at Amerigroup, an Anthem subsidiary, opened a phishing email that contained a malicious link to a typosquatted domain ("we11point.com" - a misspelling of the wellpoint.com brand). The attacker, later attributed to a Chinese state-aligned group known as Deep Panda, used the foothold to install malware, harvest credentials, and move laterally through the network.

Over the following ten months, the attackers escalated privileges through multiple compromised accounts, conducted reconnaissance of internal systems, and eventually reached Anthem's enterprise data warehouse. Beginning around 10 December 2014, they began running database queries against the warehouse using legitimate administrator credentials. The data in the warehouse - including names, dates of birth, Social Security numbers, member identification numbers, employment information and income data - was not encrypted at rest within the database. Anthem's internal systems could not distinguish authorised analyst queries from the attacker's queries because both used valid credentials and originated from inside the network.

Suspicious activity was first detected on 27 January 2015, when a database administrator noticed unfamiliar query patterns. Anthem publicly disclosed the breach on 4 February 2015. Approximately 78.8 million records were exfiltrated. The breach was attributed to multiple control gaps but the proximate cause was that data warehouse access required only valid credentials - the same conditions an authorised analyst would meet - with no behavioural monitoring distinguishing normal use from extraction patterns.`,
    task: "Identify two stages of the Drift Model where this scenario shows the most significant drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [
        [2, 4], [4, 2],
        [2, 3], [3, 2],
        [3, 4], [4, 3],
        [4, 5], [5, 4],
      ],
      reasoning: `This is a Hard scenario because the drift is subtle. Anthem had reasonable controls - the failure was not absence but inadequacy relative to the threat model. Multiple defensible readings.

Reading 1 (strongest): Stage 2 (Control) + Stage 4 (Reality).
- Stage 2 - The control set was poorly calibrated to the actual risk. Specifically, the data warehouse access control relied on credential validity alone, with no behavioural monitoring to distinguish authorised queries from extraction patterns. As a control design for a database containing 78.8 million identity records, this was inadequate from inception. The control existed but was insufficient.
- Stage 4 - Operational reality also drifted: nine thousand-plus queries over weeks, originating from inside the network, did not trigger meaningful detection. Reality diverged from the implicit expectation that "monitoring" would catch anomalous patterns.

Reading 2 (also strong): Stage 2 (Control) + Stage 3 (Implementation).
- Stage 2 as above.
- Stage 3 - Even where controls were sound, implementation gaps mattered: data at rest in the warehouse was not encrypted; lateral movement was possible because privilege boundaries weren't enforced at the implementation level.

Reading 3 (also strong): Stage 3 (Implementation) + Stage 4 (Reality).
- Stage 3 - As above. Unencrypted data, weak privilege boundaries, no behavioural anomaly detection on warehouse queries.
- Stage 4 - As above.

Reading 4 (acceptable): Stage 4 (Reality) + Stage 5 (Audit).
- Stage 4 - The technical controls Anthem invested in did not catch eleven months of lateral movement, multiple credential compromises, and weeks of large-scale extraction. Reality drifted substantially from what the security program promised.
- Stage 5 - The California investigation explicitly noted Anthem had "taken reasonable measures" - audit and assurance found the program adequate, yet the operational truth was different.

Stage 1 (Intent) is NOT a strong primary answer - the intent was sound. Stage 6 (Drift) is weaker than naming the specific stages where the drift was visible.`,
    },
  },
  {
    id: "moveit-clearinghouse",
    title: "MOVEit — The Vendor Behind 900 Universities",
    domain: "education",
    difficulty: "hard",
    status: "available",
    isRealWorld: true,
    shortPrompt:
      "Hundreds of universities held strong internal security postures and were still breached - because the vulnerability lived in a third party they had each, individually, decided to trust.",
    situation: `In June 2023, attackers exploited a zero-day vulnerability in MOVEit Transfer - a managed file transfer product from Progress Software widely used to move bulk data between organisations and their service providers. The vulnerability allowed unauthenticated SQL injection, granting full access to the contents of MOVEit servers.

One of the most affected downstream organisations was the National Student Clearinghouse (NSC), a US non-profit that processes enrolment, transcript and certification data on behalf of nearly all US higher education institutions. NSC used MOVEit to receive and forward data between universities, lenders, employers and government agencies. When NSC's MOVEit server was compromised on or around 30 May 2023, attackers accessed files containing personal data from approximately 900 colleges and universities - including names, dates of birth, Social Security numbers, student identification numbers and school records.

The compromised universities included Cornell, UCLA, the University of Georgia, the University of Rochester and many others. Most of these institutions had documented information security frameworks, conducted regular security reviews, and had not themselves been directly attacked. Their data had reached the attackers because they had each, at different points over a period of years, entered a vendor relationship with NSC for legitimate operational purposes, and NSC in turn relied on MOVEit. The universities' contracts with NSC included standard third-party security clauses but did not directly inspect or test the security of MOVEit itself or the broader downstream vendor chain.

Several universities later disclosed that their internal third-party risk assessments had assessed NSC as low-to-moderate risk based on the type of data exchanged, and had not separately evaluated NSC's own vendors. Investigation of similar MOVEit-related breaches at federal agencies and corporations showed comparable patterns: organisations had assessed their direct vendors and relied on those vendors' security attestations without independent verification of the sub-vendor chain.`,
    task: "Identify two stages of the Drift Model where this scenario shows the most significant drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [
        [1, 5], [5, 1],
        [2, 5], [5, 2],
        [1, 3], [3, 1],
        [2, 3], [3, 2],
      ],
      reasoning: `This is a Hard scenario because the drift exists in the gap between how third-party risk is conceptualised and what fourth/fifth-party exposure actually looks like. The right stages depend on how you frame the problem.

Reading 1 (strongest): Stage 1 (Intent) + Stage 5 (Audit).
- Stage 1 - The universities' documented intent on third-party risk was misaligned with the structure of their actual vendor chains. The intent typically covered "vendors" as a single category, but in reality vendors had vendors, and risk traveled through that chain. The intent never explicitly extended to fourth-party or downstream-vendor exposure. This is an Intent-stage failure analogous to Latitude or HWL Ebsworth - the documented stance is too narrow for the operational reality.
- Stage 5 - Audit and vendor-risk assessment processes confirmed the direct relationship (university to NSC) was acceptable, but did not extend their lens to the sub-vendor chain. Audit confirmed what was visible; what was invisible was where the breach lived.

Reading 2 (also strong): Stage 2 (Control) + Stage 5 (Audit).
- Stage 2 - The third-party risk control was poorly designed for modern supply chains. A control framework that assesses direct vendors but treats sub-vendor relationships as out of scope is structurally inadequate when sub-vendors hold or transit the same data. The control set should have included sub-vendor inspection or independent verification of vendor attestations.
- Stage 5 as above.

Reading 3 (also acceptable): Stage 1 (Intent) + Stage 3 (Implementation).
- Stage 1 as above.
- Stage 3 - Implementation of third-party risk programs at universities relied on vendor self-attestations rather than independent verification. Implementation gap - the program existed but did not produce the visibility it claimed to.

Reading 4 (acceptable): Stage 2 (Control) + Stage 3 (Implementation).
- Stage 2 as above.
- Stage 3 as above.

Stage 4 (Reality) is a defensible read but weaker because the failure was less about operational drift over time and more about a structural blind spot baked into how the program was conceived and run. Stage 6 (Drift) is weaker than naming the specific stages where the gap lives.`,
    },
  },
  {
    id: "colonial-pipeline",
    title: "Colonial Pipeline — The Account No One Switched Off",
    domain: "industrial",
    difficulty: "hard",
    status: "available",
    isRealWorld: true,
    shortPrompt:
      "45% of East Coast US fuel supply went down because a 'legacy' VPN account that no one was actively using still had access and only needed a password.",
    situation: `Colonial Pipeline Company operates a 5,500-mile pipeline network supplying approximately 45% of the fuel consumed on the US East Coast - gasoline, diesel and jet fuel. As critical national infrastructure, the company operated under various regulatory and contractual cybersecurity expectations.

Colonial maintained documented security policies including password complexity requirements, controls around remote access, and standard infrastructure protections. The CEO later testified before the US Senate that the compromised password had complied with the company's password complexity rules - "it was a complicated password, I want to be clear on that. It was not a Colonial123-type password."

In May 2021, attackers gained access to Colonial's IT network through a single set of credentials for a legacy VPN account. The account was not actively used and had been left enabled. It used single-factor authentication: a password only, with no second factor. The password had likely been exposed in an unrelated prior data breach and was reused on the Colonial VPN. There is no public indication the attackers needed to do anything sophisticated to obtain or test the credential - they had it, it worked, and they were inside.

Once on the corporate network, the attackers (the DarkSide ransomware-as-a-service group) escalated and moved through Colonial's IT environment. They exfiltrated approximately 100 GB of data and deployed ransomware on the corporate billing and accounting systems. The pipeline's operational technology (OT) network was reportedly not directly compromised, but Colonial chose to shut down pipeline operations entirely on 7 May 2021 because they could no longer reliably bill for fuel deliveries and were concerned about lateral risk to the OT environment. The shutdown lasted approximately six days. Fuel shortages, panic buying and a US national state of emergency followed. Colonial paid approximately $4.4 million in ransom.

Multiple post-incident analyses noted that MFA had been a baseline industry expectation for remote access to critical infrastructure for years before the breach. The legacy VPN account was reportedly believed by the company to be inactive but had not been disabled, audited, or migrated to the MFA-protected access path used by current employees.`,
    task: "Identify two stages of the Drift Model where this scenario shows the most significant drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [
        [4, 5], [5, 4],
        [3, 4], [4, 3],
        [4, 6], [6, 4],
        [3, 5], [5, 3],
      ],
      reasoning: `This is a Hard scenario because the drift is concentrated in the maintenance, not the design. Strong controls existed; they didn't get applied to a forgotten corner. Multiple defensible readings.

Reading 1 (strongest): Stage 4 (Reality) + Stage 5 (Audit).
- Stage 4 - MFA was a baseline industry expectation for remote access to critical infrastructure. The current access path used MFA. But operational reality included a legacy VPN account that bypassed the current standard entirely - a single-factor account on a path believed to be inactive. Reality drifted from the documented expectations specifically because no one had decommissioned the old access path when the new one was rolled out.
- Stage 5 - Audit and access-review cycles did not detect the legacy account. Whatever access reviews existed, they did not surface the fact that an account believed to be inactive was still enabled, still had network reach, and still required only a password. The audit lens was looking at active accounts; the breach lived in an account that "wasn't being used."

Reading 2 (also strong): Stage 3 (Implementation) + Stage 4 (Reality).
- Stage 3 - The MFA implementation was incomplete. When the company migrated to MFA-protected remote access, the legacy VPN was not retired or migrated. Implementation of the modern control left a parallel non-compliant path in place. Day-one implementation gap that persisted.
- Stage 4 - As above.

Reading 3 (also acceptable): Stage 4 (Reality) + Stage 6 (Drift).
- Stage 4 - As above.
- Stage 6 - The cumulative drift around legacy systems - accounts that exist because they always have, controls that lag the current standard because no one owns retiring the old one - is exactly the compounding pattern Stage 6 describes.

Reading 4 (defensible): Stage 3 (Implementation) + Stage 5 (Audit).
- Stage 3 - As above.
- Stage 5 - As above.

Stage 1 (Intent) is weaker - the intent (require MFA for critical infrastructure remote access) was reasonable. Stage 2 (Control) is weaker - the control was reasonable. The failure was in keeping the implementation comprehensive and the audit lens wide enough to catch lingering exceptions.`,
    },
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