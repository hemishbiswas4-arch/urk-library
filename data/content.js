// AENC 2026 Prep Dossier — structured content extracted from the team's prep document,
// enriched with verified source URLs researched 2026-07-08.
// Depth key: READ = full careful read, SKIM = intro/summary/headings, REF = know it exists, WATCH = video/talk.

export const META = {
  title: "AENC 2026 Prep Dossier",
  subtitle: "Team of 3 · Representing the Government of URK (Preliminary Rounds) · Competition: 17–19 July 2026, NUS",
  enrichedNote: "Enrichment pass completed 7 July 2026. Every dated development was checked against current sources; entries give the source by name so the binder stays self-contained.",
};

export const HOW_TO_USE = [
  "Read for leverage, not coverage. Every source earns its place only if it produces (a) a fact you can cite, (b) an interest you can map, or (c) an option you can propose. If a reading isn't generating entries in your Fact Bank or Options Bank, drop it.",
  "Two-pass method. First pass: skim the executive summary/introduction/conclusion in 15–20 minutes and write three bullet takeaways. Only deep-read if those takeaways are load-bearing for a proposal (a)–(d).",
  "Teach-backs. Divide reading lanes (see Plan). Every night, each person gives a 15-minute Feynman-style teach-back of their lane. Anything you can't explain in plain English, you don't know well enough to deploy against a judge.",
];

// ---------------------------------------------------------------------------
// READING MODULES
// ---------------------------------------------------------------------------

export const MODULES = [
  {
    id: "orientation",
    title: "1. Know the Competition Itself",
    why: "AENC is a young competition with sparse public precedent. Your edge comes from the rulebook and rubric, not competition folklore — and from knowing your judges' world (likely Allen & Gledhill lawyers and APCEL academics).",
    readings: [
      {
        id: "orient-1",
        title: "Allen & Gledhill “Knowledge Highlights” — Energy, Infrastructure & Projects practice page",
        depth: "SKIM",
        tag: "core",
        url: "https://www.allenandgledhill.com/practices/energy-infrastructure-projects/",
        blurb: "Read 6–8 short client notes (GasCo gas procurement, Future Energy Fund, Energy Conservation Act amendments, MAS TRACTION, Vietnam's PDP8) to learn exactly how practitioner-judges phrase these issues.",
      },
      {
        id: "orient-2",
        title: "APCEL Publications Hub (NUS Asia-Pacific Centre for Environmental Law)",
        depth: "SKIM",
        tag: "core",
        url: "https://law.nus.edu.sg/apcel/publications/",
        blurb: "A co-organiser's own recent output — skim for framing vocabulary, not substance.",
      },
      {
        id: "orient-3",
        title: "APCEL Working Paper — “Localizing Just Transition: Perspectives from Southeast Asia”",
        depth: "SKIM",
        tag: "further",
        url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6632278",
        blurb: "NUS Law WP 2026/008 / APCEL WP 26/03. The exact framing URK should use for jobs and community conditions. (SSRN blocks bots — open directly in a browser.)",
      },
    ],
  },
  {
    id: "negotiation",
    title: "Layer 1 — Negotiation Craft",
    why: "You have 11 days; negotiation skill compounds faster than domain knowledge. Front-load it. This is what actually wins the round.",
    readings: [
      {
        id: "neg-1",
        title: "Getting to Yes — Fisher, Ury & Patton",
        depth: "READ",
        tag: "core",
        url: "https://www.penguinrandomhouse.com/books/324551/getting-to-yes-by-roger-fisher-and-william-ury/",
        blurb: "~150 pages, non-negotiable foundation. Translate every concept onto Azania: interests vs. positions, BATNA, ZOPA.",
      },
      {
        id: "neg-2",
        title: "Negotiation Genius — Malhotra & Bazerman (selected chapters)",
        depth: "READ",
        tag: "core",
        url: "https://www.penguinrandomhouse.com/books/106602/negotiation-genius-by-deepak-malhotra-and-max-bazerman/",
        blurb: "Prioritise investigative negotiation, MESOs (multiple equivalent simultaneous offers), and creating value / logrolling.",
      },
      {
        id: "neg-3",
        title: "3-D Negotiation — Lax & Sebenius (“deal design” chapters, or the HBR article if short on time)",
        depth: "SKIM",
        tag: "core",
        url: "https://hbr.org/2003/11/3-d-negotiation-playing-the-whole-game",
        blurb: "Azania is fundamentally a deal-design problem (structures, sequencing, conditionality). Full book: see Further Reading.",
      },
      {
        id: "neg-4",
        title: "Harvard PON Free Reports hub",
        depth: "SKIM",
        tag: "core",
        url: "https://www.pon.harvard.edu/free-reports/",
        blurb: "Free PDFs on multiparty negotiation and dealing with difficult tactics — short and directly applicable.",
      },
      {
        id: "neg-5",
        title: "Managing Multiparty Negotiations — PON free report",
        depth: "READ",
        tag: "further",
        url: "https://www.pon.harvard.edu/freemium/managing-multiparty-negotiations/",
        blurb: "The only free text squarely on your exact format: coalitions, process leadership, shifting BATNAs, consensus-building.",
      },
      {
        id: "neg-6",
        title: "3-D Negotiation — Lax & Sebenius (full book)",
        depth: "REF",
        tag: "further",
        url: "https://store.hbr.org/product/3-d-negotiation-powerful-tools-to-change-the-game-in-your-most-important-deals/7995",
        blurb: "Read the HBR article (above) instead if time is short.",
      },
      {
        id: "neg-7",
        title: "Good for You, Great for Me — Lawrence Susskind",
        depth: "SKIM",
        tag: "further",
        url: "https://www.amazon.com/Good-You-Great-Me-Negotiation/dp/1610394259",
        blurb: "The mutual-gains “trading zone” method from MIT's leading environmental negotiation scholar.",
      },
      {
        id: "neg-8",
        title: "Environmental Diplomacy — Susskind, Ali & Hamid",
        depth: "REF",
        tag: "further",
        url: "https://academic.oup.com/book/52403?login=false",
        blurb: "Older but on-brand for this competition's subject matter.",
      },
      {
        id: "neg-9",
        title: "Beyond Winning — Mnookin, Peppet & Tulumello (chapters on the three tensions and creating value)",
        depth: "SKIM",
        tag: "further",
        url: "https://www.hup.harvard.edu/catalog.php?isbn=9780674012318",
        blurb: "Negotiation written specifically for lawyers — the register your judges practise in.",
      },
      {
        id: "neg-10",
        title: "PON “Great Negotiator” case — Christiana Figueres and the road to the Paris Agreement",
        depth: "REF",
        tag: "further",
        url: "https://www.pon.harvard.edu/the-great-negotiator-award/2022-christiana-figueres/",
        blurb: "The single most on-brand case study in existence for a multiparty environmental negotiation competition.",
      },
      {
        id: "neg-11",
        title: "William Ury — “The walk from 'no' to 'yes'” (TED talk, ~19 min)",
        depth: "WATCH",
        tag: "further",
        url: "https://www.ted.com/talks/william_ury_the_walk_from_no_to_yes",
        blurb: "The “third side” and going-to-the-balcony habits — directly usable when the other two teams deadlock.",
      },
    ],
    notes: [
      "3-party dynamics: the scarce resource is process control. A team that proposes a sensible agenda in its opening is perceived as leading — that's Strategy points.",
      "Coalitions shift issue-by-issue. Map, for each proposal, who your natural ally is and design asks that split the other two.",
      "WCKD and Sirius1 need each other and both need URK's approvals/land/grid on a tight clock — your time pressure is political and 18 months out, theirs is commercial and dated.",
    ],
  },
  {
    id: "moduleA",
    title: "Module A — Data Centres 101 (energy, water, the Asian boom)",
    why: "The entire deal is a data centre. Singapore literally paused new data centres over energy concerns — fluency here is your credibility floor.",
    readings: [
      {
        id: "modA-1",
        title: "IEA — Energy and AI (2025), Executive Summary",
        depth: "READ",
        tag: "core",
        url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
        blurb: "The canonical numbers on data centre electricity demand — judge-proof macro framing for why URK's grid anxiety is legitimate.",
      },
      {
        id: "modA-2",
        title: "Singapore's data centre moratorium (2019–2022) and its lifting — DCD explainer",
        depth: "SKIM",
        tag: "core",
        url: "https://www.datacenterdynamics.com/en/news/singapore-lifts-data-center-moratorium-but-sets-conditions/",
        blurb: "The single best real-world analogue for URK's dilemma, and it's your judges' home jurisdiction.",
      },
      {
        id: "modA-3",
        title: "The Johor/Malaysia hyperscale boom and backlash",
        depth: "SKIM",
        tag: "core",
        url: "https://fortune.com/asia/2025/04/17/malaysia-ai-data-centers-johor/",
        blurb: "Live regional comparable: host states successfully impose green/local conditions on hyperscalers, because hyperscalers keep coming anyway.",
      },
      {
        id: "modA-4",
        title: "PUE and WUE explained (cooling types and trade-offs)",
        depth: "SKIM",
        tag: "core",
        url: "https://airsysnorthamerica.com/puw-vs-wue-balancing-efficiency-sustainability-in-data-centers/",
        blurb: "What “100 MW IT load” implies for annual consumption — do the arithmetic yourselves (~870+ GWh/yr if run flat) and sanity-check it.",
      },
      {
        id: "modA-5",
        title: "IEA — Key Questions on Energy and AI (April 2026)",
        depth: "READ",
        tag: "further",
        url: "https://www.iea.org/reports/key-questions-on-energy-and-ai",
        blurb: "Supersedes the 2025 report's numbers — cite this for current actuals, not the 2025 edition.",
      },
      {
        id: "modA-6",
        title: "IEA — Electricity 2026",
        depth: "REF",
        tag: "further",
        url: "https://www.iea.org/reports/electricity-2026/executive-summary",
        blurb: "New 2026–2030 forecast with chapters on grid strain and system flexibility — exactly URK's problem.",
      },
      {
        id: "modA-7",
        title: "IMDA — Green Data Centre Roadmap (May 2024)",
        depth: "SKIM",
        tag: "further",
        url: "https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2024/sg-announces-green-data-centre-roadmap",
        blurb: "The canonical host-state playbook — PUE ≤1.3 and WUE ≤2.0 m³/MWh ten-year targets worth memorising.",
      },
      {
        id: "modA-8",
        title: "IMDA — DC-CFA2 factsheet (Dec 2025)",
        depth: "SKIM",
        tag: "further",
        url: "https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2025/launch-of-second-data-centre",
        blurb: "≥200 MW tendered on conditions of ≥50% approved green power and PUE ≤1.25.",
      },
      {
        id: "modA-9",
        title: "Uptime Institute — Annual Global Data Center Survey",
        depth: "REF",
        tag: "further",
        url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
        blurb: "Industry standard source on PUE trends and outage causes — useful if reliability comes up.",
      },
    ],
    recentDevelopments: [
      {
        title: "Singapore's draft Digital Infrastructure Bill (public consultation closes 22 Jul — during the competition)",
        url: "https://www.mddi.gov.sg/newsroom/public-consultation-on-digital-infrastructure-bill/",
        note: "First move to a statutory licensing regime with binding energy/resource-efficiency standards. Judges may have this open on their desks.",
      },
      {
        title: "Singapore's DC-CFA2 tender — Morgan Lewis client note",
        url: "https://www.morganlewis.com/pubs/2026/03/singapore-announces-data-center-capacity-allocation-call",
        note: "Proof a host state can auction access against green conditions — URK's strongest structural analogy.",
      },
      {
        title: "Johor tightens data centre approvals — New Straits Times (Nov 2025)",
        url: "https://www.nst.com.my/news/nation/2025/11/1324188/johor-tightens-approvals-data-centres",
        note: "Water-cooled expansions deferred, approvals halted for Tier 1/2 facilities.",
      },
    ],
  },
  {
    id: "moduleB",
    title: "Module B — International Climate Law",
    why: "It's an environmental law competition. The Paris architecture is the shared language of the room, and URK's confidential posture is a direct play on Paris's legal design.",
    readings: [
      {
        id: "modB-1",
        title: "The Paris Agreement — full text (Arts. 2, 4, 6, 9, 10, 11, 13, 14)",
        depth: "READ",
        tag: "core",
        url: "https://unfccc.int/sites/default/files/resource/parisagreement_publication.pdf",
        blurb: "~27 pages, takes two hours. The doctrinal ground under URK's confidential instruction.",
      },
      {
        id: "modB-2",
        title: "Carbon Brief — COP30: Key outcomes agreed at the UN climate talks in Belém (Nov 2025)",
        depth: "READ",
        tag: "core",
        url: "https://www.carbonbrief.org/cop30-key-outcomes-agreed-at-the-un-climate-talks-in-belem/",
        blurb: "The single best current-state briefing on where climate diplomacy stands.",
      },
      {
        id: "modB-3",
        title: "Daniel Bodansky — “The Legal Character of the Paris Agreement” (RECIEL, 2016)",
        depth: "READ",
        tag: "further",
        url: "https://jak.ppke.hu/uploads/articles/1211121/file/Bodansky-2016-RECIEL%20Paris%20Legal%20Character.pdf",
        blurb: "The canonical short treatment of exactly which Paris obligations bind and which don't. Open-access PDF.",
      },
      {
        id: "modB-4",
        title: "Rajamani, Bodansky & Brunnée — International Climate Change Law (OUP)",
        depth: "REF",
        tag: "further",
        url: "https://global.oup.com/academic/product/international-climate-change-law-9780199664306",
        blurb: "Standard textbook — dip in only for CBDR-RC and Art. 6 if a teach-back exposes a gap.",
      },
      {
        id: "modB-5",
        title: "Carbon Brief — COP29 (Baku) key outcomes",
        depth: "SKIM",
        tag: "further",
        url: "https://www.carbonbrief.org/cop29-key-outcomes-agreed-at-the-un-climate-talks-in-baku/",
        blurb: "The NCQG ($300bn/yr by 2035, “Baku to Belém” $1.3tn aspiration) and developing-country dissatisfaction with it.",
      },
      {
        id: "modB-6",
        title: "UNFCCC Technology Mechanism — CTCN",
        depth: "REF",
        tag: "further",
        url: "https://www.ctc-n.org/",
        blurb: "The institutional face of Article 10 (technology transfer).",
      },
      {
        id: "modB-7",
        title: "UNFCCC Technology Executive Committee (TEC)",
        depth: "REF",
        tag: "further",
        url: "https://unfccc.int/ttclear/tec",
        blurb: "The policy arm of the Technology Mechanism.",
      },
    ],
    recentDevelopments: [
      {
        title: "COP30 “global mutirão” package and forest/finance outcomes",
        url: "https://www.carbonbrief.org/cop30-key-outcomes-for-food-forests-land-and-nature-at-the-un-climate-talks-in-belem/",
        note: "Triple adaptation finance by 2035, Belém mission to 1.5°C, first COP text on unilateral trade measures.",
      },
      {
        title: "The Belém Action Mechanism (Just Transition Mechanism)",
        url: "https://www.climatechangenews.com/2025/12/10/how-belem-built-a-new-just-transition-mechanism/",
        note: "Rights-based framing — labour rights, social dialogue, FPIC. Borrow this vocabulary for proposals (b) and (c).",
      },
      {
        title: "Singapore's Article 6 Implementation Agreements — official partner list",
        url: "https://www.carbonmarkets-cooperation.gov.sg/our-article-6-cooperation/singapores-art-6-cooperations/implementation-agreements",
        note: "10 partner countries as of Oct 2025, plus the Philippines (May 2026). Ready-made creative option for Azania.",
      },
      {
        title: "UNFCCC 2025 NDC Synthesis Report (NDC 3.0)",
        url: "https://unfccc.int/process-and-meetings/the-paris-agreement/nationally-determined-contributions-ndcs/2025-ndc-synthesis-report",
        note: "Aggregate ~12% cuts by 2035 vs 2019 — context for why an ambitious NDC like URK's is diplomatically valuable.",
      },
      {
        title: "Tropical Forest Forever Facility (TFFF)",
        url: "https://tfff.earth/",
        note: "Launched at Belém with $6bn+ seeded — evidence blended sovereign-plus-private climate finance is the current direction of travel.",
      },
    ],
  },
  {
    id: "moduleC",
    title: "Module C — Project Finance, Renewable Economics & Green-Finance Standards",
    why: "Proposal (a) is a US$150m infrastructure finance question, and both counterparties are defined by their financing constraints (NZAOA; SGX/ISSB). This is where “commercial awareness” points live.",
    readings: [
      {
        id: "modC-1",
        title: "WBCSD — Corporate Renewable PPAs explainer",
        depth: "SKIM",
        tag: "core",
        url: "https://www.wbcsd.org/corporate-renewable-power-purchase-agreements-ppas/how-can-companies-adopt-ppas-to-decarbonize-power-consumption/",
        blurb: "Physical vs. sleeved vs. virtual PPAs. Key insight: URK's “$150m investment” ask could be restructured as a PPA rather than a grant — this single insight can carry a round.",
      },
      {
        id: "modC-2",
        title: "IRENA — Renewable Power Generation Costs (2024 edition)",
        depth: "REF",
        tag: "core",
        url: "https://www.irena.org/Publications/2025/Jun/Renewable-Power-Generation-Costs-in-2024",
        blurb: "Utility-scale solar capex/MW and capacity factors (~15–22%) in developing Asia — do the arithmetic on quantum.",
      },
      {
        id: "modC-3",
        title: "Lazard — Levelized Cost of Energy+ (LCOE+), 2025 edition",
        depth: "REF",
        tag: "core",
        url: "https://www.lazard.com/research-insights/levelized-cost-of-energyplus-lcoeplus/",
        blurb: "Source of truth for solar capex and capacity-factor sanity checks.",
      },
      {
        id: "modC-4",
        title: "NZAOA Target-Setting Protocol, 4th edition (UNEP FI)",
        depth: "SKIM",
        tag: "core",
        url: "https://www.unepfi.org/industries/target-setting-protocol-fourth-edition/",
        blurb: "WCKD cannot afford Azania to be a carbon story it has to explain away two months before publishing its first targets. Its green demands are structural, not decorative.",
      },
      {
        id: "modC-5",
        title: "SGX Practice Note 7.6 — Sustainability Reporting Guide",
        depth: "REF",
        tag: "core",
        url: "https://rulebook.sgx.com/rulebook/practice-note-76-sustainability-reporting-guide",
        blurb: "Get Sirius1's disclosure obligations from the primary source, not summaries.",
      },
      {
        id: "modC-6",
        title: "IEEFA — “The JETP can succeed without the United States” (Mar 2025)",
        depth: "SKIM",
        tag: "further",
        url: "https://ieefa.org/resources/just-energy-transition-partnership-jetp-can-succeed-without-united-states",
        blurb: "JETP model status check — these partnerships have been politically turbulent.",
      },
      {
        id: "modC-7",
        title: "ISEAS/Fulcrum — JETPs in Indonesia and Vietnam: Implications for Southeast Asia",
        depth: "SKIM",
        tag: "further",
        url: "https://fulcrum.sg/just-energy-transition-partnerships-jetps-in-indonesia-and-vietnam-implications-for-southeast-asia/",
        blurb: "From a Singapore think tank your judges likely read. (Original syllabus cited a Feb 2026 piece; this 2024 piece is the closest verified match — worth a quick re-search closer to the date.)",
      },
      {
        id: "modC-8",
        title: "ACRA — Sustainability reporting requirements and timeline",
        depth: "REF",
        tag: "further",
        url: "https://www.acra.gov.sg/regulations/sustainability-reporting/requirements-timeline/",
        blurb: "Authoritative primary source for Singapore's reporting phase-in.",
      },
      {
        id: "modC-9",
        title: "E.R. Yescombe — Principles of Project Finance",
        depth: "REF",
        tag: "further",
        url: "https://shop.elsevier.com/books/principles-of-project-finance/yescombe/978-0-12-391058-5",
        blurb: "Do not read — pull a definition if a teach-back stalls.",
      },
      {
        id: "modC-10",
        title: "Equator Principles — official site",
        depth: "REF",
        tag: "further",
        url: "https://equator-principles.com/",
        blurb: "Project-finance E&S risk standard. EP4 is current.",
      },
      {
        id: "modC-11",
        title: "IFC Performance Standards on Environmental and Social Sustainability",
        depth: "REF",
        tag: "further",
        url: "https://www.ifc.org/en/insights-reports/2012/ifc-performance-standards",
        blurb: "PS2 labour, PS3 resource efficiency/pollution, PS6 biodiversity — bankability conditions for exactly this kind of project.",
      },
      {
        id: "modC-12",
        title: "ICMA Green Bond Principles",
        depth: "REF",
        tag: "further",
        url: "https://www.icmagroup.org/sustainable-finance/the-principles-guidelines-and-handbooks/green-bond-principles-gbp/",
        blurb: "How a “green-financeable” Azania actually gets certified.",
      },
      {
        id: "modC-13",
        title: "Singapore-Asia Taxonomy for Sustainable Finance (MAS)",
        depth: "REF",
        tag: "further",
        url: "https://www.mas.gov.sg/development/sustainable-finance/taxonomy",
        blurb: "One line to know it exists.",
      },
      {
        id: "modC-14",
        title: "GFANZ — Glasgow Financial Alliance for Net Zero",
        depth: "REF",
        tag: "further",
        url: "https://www.gfanzero.com/",
        blurb: "One line to know it exists.",
      },
    ],
    recentDevelopments: [
      {
        title: "ACRA/SGX RegCo recalibrated Singapore's climate-reporting roadmap (Aug 2025)",
        url: "https://www.acra.gov.sg/regulations/sustainability-reporting/requirements-timeline/",
        note: "Sirius1 is an STI constituent: Azania's emissions sit inside its mandatory Scope 3 from FY2026 — a precise persuasion weapon in front of Singapore lawyers.",
      },
      {
        title: "NZAOA mechanics — MAS TRACTION coalition",
        url: "https://www.mas.gov.sg/development/sustainable-finance/transition-credits",
        note: "WCKD's Azania equity is greenfield infrastructure whose decades of emissions enter its target maths at signing.",
      },
      {
        title: "US withdrew from all JETPs (Mar 2025) — Germany/Japan stepped in",
        url: "https://ieefa.org/resources/just-energy-transition-partnership-jetp-can-succeed-without-united-states",
        note: "Grants are only ~2.6–4% of JETP commitments, rest loans. URK talking point: investment and offtake, not loans that mortgage fiscal space.",
      },
    ],
  },
  {
    id: "moduleD",
    title: "Module D — Local Content, Labour & Investment-Law Periphery",
    why: "Proposal (c). Lighter module — the clause is confined to unskilled/semi-skilled construction, deliberately easy to concede. The real negotiation is what URK trades it for.",
    readings: [
      {
        id: "modD-1",
        title: "UNCTAD — Local Content Requirements and the Green Economy",
        depth: "SKIM",
        tag: "core",
        url: "https://unctad.org/publication/local-content-requirements-and-green-economy",
        blurb: "A negotiated contractual commitment (what's on the table here) largely sidesteps trade/investment disciplines — so the fight is practical, not legal.",
      },
      {
        id: "modD-2",
        title: "CCSI (Columbia Center on Sustainable Investment) — Local Content Laws & Contractual Provisions",
        depth: "REF",
        tag: "further",
        url: "https://ccsi.columbia.edu/local-content-laws-contractual-provisions/",
        blurb: "Standard academic hub — legal profiles for 22 countries. Skim one overview if the 70% clause becomes contested.",
      },
      {
        id: "modD-3",
        title: "IFC Performance Standard 2 — Guidance Note (Labor and Working Conditions)",
        depth: "REF",
        tag: "further",
        url: "https://www.ifc.org/content/dam/ifc/doc/2010/2012-ifc-ps-guidance-note-2-en.pdf",
        blurb: "The hook for repackaging local employment + training as a bankability asset WCKD can report.",
      },
      {
        id: "modD-4",
        title: "ILO — Fundamental Principles and Rights at Work",
        depth: "REF",
        tag: "further",
        url: "https://www.ilo.org/topics-and-sectors/fundamental-principles-and-rights-work",
        blurb: "The core labour standards hook.",
      },
    ],
    recentDevelopments: [
      {
        title: "COP30's Just Transition Mechanism embedded labour rights, social dialogue, FPIC",
        url: "https://www.carbonbrief.org/cop30-key-outcomes-for-food-forests-land-and-nature-at-the-un-climate-talks-in-belem/",
        note: "Frame proposal (c)-plus-training as URK operationalising the just transition — language WCKD's investors can reuse.",
      },
    ],
  },
  {
    id: "moduleE",
    title: "Module E — The Cloud/Capacity Dimension",
    why: "Proposal (d) — the one Sirius1 will resist hardest (it's their revenue) and the one URK's brief marks as the political jewel.",
    readings: [
      {
        id: "modE-1",
        title: "Singapore's Digital Economy Agreements (DEAs) — MTI official page",
        depth: "SKIM",
        tag: "core",
        url: "https://www.mti.gov.sg/trade-international-economic-relations/agreements/digital-economy-agreements-dea/",
        blurb: "The model for a “URK as trusted digital hub” positioning.",
      },
      {
        id: "modE-2",
        title: "UNCTAD Digital Economy Report (2024)",
        depth: "REF",
        tag: "further",
        url: "https://unctad.org/publication/digital-economy-report-2024",
        blurb: "The source for “data divide” framing if URK wants development-equity language around proposal (d).",
      },
    ],
    recentDevelopments: [
      {
        title: "Singapore's draft Digital Infrastructure Bill also licenses “major foundational digital infrastructure” services",
        url: "https://www.mddi.gov.sg/newsroom/public-consultation-on-digital-infrastructure-bill/",
        note: "Statutory resilience/continuity obligations reaching cloud providers, not just landlords. URK can propose a lighter contractual version — a classic “deal now or statute later” frame.",
      },
    ],
  },
  {
    id: "moduleF",
    title: "Module F — Environmental & Social Regulatory Periphery",
    why: "URK is the regulator in the room. Approvals are your quietest, strongest card.",
    readings: [
      {
        id: "modF-1",
        title: "ADB — Environmental Assessment Guidelines",
        depth: "SKIM",
        tag: "core",
        url: "https://www.adb.org/documents/adb-environmental-assessment-guidelines",
        blurb: "EIA as condition precedent; ESIA logic; water abstraction permitting; community consultation/social licence.",
      },
      {
        id: "modF-2",
        title: "IFC Performance Standards overview (PS1 ESIA, PS3 resource efficiency, PS6 biodiversity)",
        depth: "REF",
        tag: "further",
        url: "https://www.ifc.org/en/insights-reports/2012/ifc-performance-standards",
        blurb: "One-page summaries suffice — bankability conditions WCKD's lenders will apply anyway.",
      },
      {
        id: "modF-3",
        title: "ADB's Environmental and Social Framework (approved 2024, effective Jan 2026)",
        depth: "REF",
        tag: "further",
        url: "https://www.adb.org/who-we-are/environmental-social-requirements/environmental-social-framework",
        blurb: "Freshest DFI safeguard standard in Asia — name-drop only if blended finance enters the room.",
      },
    ],
    recentDevelopments: [
      {
        title: "The Diplomat — Whose Water Powers the Cloud? Data Centers and the Right to Water in Johor (Apr 2026)",
        url: "https://thediplomat.com/2026/04/whose-water-powers-the-cloud-data-centers-and-the-right-to-water-in-johor/",
        note: "The Feb 2026 Gelang Patah protests, framed as “environmental externalisation” — arms URK to require water-impact assessment as a permit condition with live regional precedent.",
      },
      {
        title: "New Straits Times — Johor enforces “Singapore-level” water efficiency for data centres (Jan 2026)",
        url: "https://www.nst.com.my/news/regional/2026/01/1350723/johor-enforces-singapore-level-water-efficiency-data-centres",
        note: "Concrete Options Bank entry: fold a water-reclamation facility into the Azania package.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// RULES & RUBRIC QUICK REFERENCE
// ---------------------------------------------------------------------------

export const RUBRIC = {
  total: 100,
  individual: {
    total: 80,
    items: [
      { label: "Articulate your stakeholder's interests", points: 10 },
      { label: "Advocate for them", points: 10 },
      { label: "Demonstrated understanding of key issues for each stakeholder", points: 20 },
      { label: "Persuade", points: 10 },
      { label: "Generate options", points: 10 },
      { label: "Communicate clearly", points: 20 },
    ],
  },
  team: {
    total: 20,
    items: [
      { label: "Overall strategy", points: 10 },
      { label: "Teamwork/rapport", points: 10 },
    ],
  },
  readWithAllocatorsEyes: [
    "The single biggest individual block (20) rewards understanding all three parties, not your own. Half your prep must be spent inside WCKD's and Sirius1's heads.",
    "Communication (20) is as heavy as multi-party understanding. Content prep without delivery drilling leaves 20 points on the table.",
    "Options generation (10) + strategy (10) reward integrative, creative packaging, not positional grinding. The Options Bank is a scoring instrument.",
    "Scoring is individual and summed. Every member must speak substantively.",
  ],
};

export const RULES = [
  {
    title: "Time economics",
    body: "Prelims are 75 min; openings/closings are 3 min per team (~18 min total), leaving ~55–60 min of negotiation. Your team may not exceed one-third of negotiation time (~20 min) and no one may speak more than 3 minutes continuously. You get perhaps 8–12 substantive interventions per person across the whole round.",
  },
  {
    title: "Paper only",
    body: "No electronic devices in the round. All prep must terminate in a paper binder and memorised numbers.",
  },
  {
    title: "Confidential information (Rule 4.2)",
    body: "Disclosure is discretionary. When and whether to reveal parts of URK's confidential brief is a strategic decision to be gamed out on Day 7 — treat information as a currency with a price.",
  },
  {
    title: "Silence and dominance (Rule 5.13.3)",
    body: "Judges may call on silent teams and cut off dominators. Silence is penalised; so is hogging.",
  },
  {
    title: "New information each round",
    body: "“Additional information will be provided as the details of the development are worked out.” Build frameworks and decision rules, not scripts.",
  },
  {
    title: "Clarifications (Rule 4.4)",
    body: "Must be sent before a stipulated deadline. Check the organisers' emails for that deadline and draft clarification questions on Day 2.",
  },
  {
    title: "Conduct",
    body: "Never reveal your school to judges; don't discuss the problem with other participants outside rounds; business casual for prelims, court attire for knockouts.",
  },
  {
    title: "Rule 7.3 — compliance flag",
    body: "Teams are “strictly forbidden to receive any external advice or assistance after the release of role allocations and Confidential Information.” Whether AI research assistance counts is genuinely ambiguous. Send a one-line email to elsa@nuslawclub.com asking before relying on any AI-generated material in-round. Sparring partners and coaches are off-limits — all mocks must be internal to the three of you.",
    email: "elsa@nuslawclub.com",
  },
];

// ---------------------------------------------------------------------------
// 11-DAY PLAN
// ---------------------------------------------------------------------------
// Original labels per the dossier, plus the 7-July calendar correction
// ("today is Day 1... merge Day 1-2 across today and tomorrow") which
// shifts every subsequent label by +1 actual day.

export const PLAN_NOTE = "Calendar correction (7 Jul): the rulebook/problem dissection cannot slip, but everything below shifted forward one day from its original label — Day 1 and Day 2's workload merges across 7–8 July.";

export const PLAN = [
  { day: 1, label: "Day 1", labelDate: "6 Jul", actualDate: "2026-07-07", tasks: [
    "All three: forensic read of rulebook + General Info + Confidential Info",
    "Independently list every fact and the interest it implies; merge into a master issue map",
    "Start Getting to Yes",
  ]},
  { day: 2, label: "Day 2", labelDate: "7 Jul", actualDate: "2026-07-08", tasks: [
    "Finish Getting to Yes; read the Negotiation Genius chapters",
    "Draft and send clarification questions (check the deadline first)",
    "Confirm the Rule 7.3 / AI query with organisers if sending one",
    "Assign reading lanes",
  ]},
  { day: 3, label: "Day 3", labelDate: "8 Jul", actualDate: "2026-07-09", tasks: [
    "Lane sprint",
    "Run the §6 recency-checklist hour",
    "Nightly 45-min teach-backs (15 min each)",
    "Grow Fact Bank and vocabulary self-test",
  ]},
  { day: 4, label: "Day 4", labelDate: "9 Jul", actualDate: "2026-07-10", tasks: [
    "Lane sprint",
    "Nightly 45-min teach-backs (15 min each)",
    "Grow Fact Bank and vocabulary self-test",
  ]},
  { day: 5, label: "Day 5", labelDate: "10 Jul", actualDate: "2026-07-11", tasks: [
    "Lane sprint — finish assigned modules",
    "Nightly 45-min teach-backs (15 min each)",
    "Grow Fact Bank and vocabulary self-test",
  ]},
  { day: 6, label: "Day 6", labelDate: "11 Jul", actualDate: "2026-07-12", tasks: [
    "Party-mastery day — answer every §5 question in writing",
    "Produce three one-page interest maps (URK, WCKD, Sirius1)",
    "Options brainstorm: 5+ options per proposal, 3 full packages for the Options Bank",
  ]},
  { day: 7, label: "Day 7", labelDate: "12 Jul", actualDate: "2026-07-13", tasks: [
    "Strategy day: agenda/sequencing plan",
    "Anchoring plan for proposal (a); concession ladder",
    "Confidential-info disclosure plan; coalition map per issue",
    "Opening statement v1 (3 min, timed)",
    "Closing statement skeleton (fill-in-the-blanks template)",
  ]},
  { day: 8, label: "Day 8", labelDate: "13 Jul", actualDate: "2026-07-14", tasks: [
    "Mock 1 (internal): two negotiate as URK, one plays WCKD+Sirius1 in alternation, then judges against the rubric",
    "Debrief hard: where did you exceed 3-min continuous? Where did you miss an investigative question?",
  ]},
  { day: 9, label: "Day 9", labelDate: "14 Jul", actualDate: "2026-07-15", tasks: [
    "Mock 2 with rotated roles",
    "Drill: 3-minute openings under a stopwatch until boring-reliable",
    "Drill: “economical intervention” — one point in ≤60 seconds",
    "Drill: closing-capture from messy notes",
  ]},
  { day: 10, label: "Day 10", labelDate: "15 Jul", actualDate: "2026-07-16", tasks: [
    "Freeze the paper binder (Fact Bank / Options Bank / vocab)",
    "Memorise the number card",
    "Contingency session: brainstorm knockout supplements and pre-agree decision rules",
  ]},
  { day: 11, label: "Day 11", labelDate: "16 Jul", actualDate: "2026-07-17", tasks: [
    "Travel / light day",
    "One 60-min walkthrough",
    "Logistics, attire, print two spare binders. Sleep.",
  ]},
];

// ---------------------------------------------------------------------------
// RECENCY CHECKLIST (§6)
// ---------------------------------------------------------------------------

export const RECENCY_CHECKLIST = [
  "COP30 Belém outcomes summary (Carbon Brief)",
  "NCQG climate finance latest 2026",
  "SGX ISSB climate reporting implementation 2026",
  "Malaysia Johor data centre water power 2026",
  "Singapore green data centre roadmap update",
  "JETP Indonesia Vietnam status 2026",
  "Singapore Article 6 implementation agreements list",
  "IEA data centre electricity demand latest",
  "hyperscaler renewable PPA Southeast Asia 2026",
  "Singapore Digital Infrastructure Bill",
];

// ---------------------------------------------------------------------------
// PARTY MASTERY QUESTIONS (§5)
// ---------------------------------------------------------------------------

export const PARTY_QUESTIONS = [
  {
    party: "URK (you)",
    questions: [
      "What are the top three interests behind each proposal (a)–(d), and which are shareable vs confidential?",
      "What is URK's BATNA and how bad is it really, given competing host countries?",
      "Which asks are elastic (quantum in (a)) vs symbolic (headline of (d))?",
      "What is your disclosure plan — which confidential facts, if any, do you reveal, to whom, when, and in exchange for what?",
      "What does the Prime Minister's “observe how they negotiate the quantum” instruction mean operationally for how you sequence proposal (a)?",
      "What must the closing statement claim as URK's political wins?",
    ],
  },
  {
    party: "WCKD",
    questions: [
      "What does an NZAOA signatory two months from first target publication need this deal to look like on paper?",
      "What do SWFs and hedge funds in a consortium disagree about (returns horizon vs reputation)?",
      "Why does a first-time hyperscale entrant need to close, and what does that do to their walk-away?",
      "What can WCKD give cheaply that URK values dearly (structuring, standards, training), and vice versa?",
    ],
  },
  {
    party: "Sirius1 / SS",
    questions: [
      "What does 24–36 months to operational really require from URK (approvals, grid, land)?",
      "What does SGX/ISSB reporting do to their appetite for a fossil-heavy power mix?",
      "Why is reserved discounted capacity painful (revenue, MFN contagion with other customers) and what substitutes might they offer?",
      "Where do the US-based founders' incentives diverge from the Singapore listco's?",
    ],
  },
  {
    party: "Cross-cutting",
    questions: [
      "For each proposal, who is your natural coalition partner and what wedge splits the other two?",
      "What package deals bundle a concession on (c) with gains on (a) or (d)?",
      "What is your opening anchor on (a)'s quantum and its justification trail?",
    ],
  },
];

// ---------------------------------------------------------------------------
// FACT BANK seed (§8)
// ---------------------------------------------------------------------------

export const FACT_BANK_SEED = [
  "US$3bn — total project value",
  "100 MW — hyperscale campus IT load",
  "≥US$150m — external investment ask, proposal (a)",
  "5% — reserved capacity at preferential rates, proposal (d)",
  "70% — local employment (unskilled/semi-skilled construction), proposal (c)",
  "−20% by 2035 — URK's NDC",
  "~US$4,000 — URK GDP/capita",
  "≤18 months — until URK's election",
  "24–36 months — delivery window",
  "Nov 2026 — WCKD's NZAOA target-publication deadline",
  "75 min — prelim round length (90 min elsewhere per rubric note)",
];

// ---------------------------------------------------------------------------
// VOCABULARY SELF-TEST (§8)
// ---------------------------------------------------------------------------

export const VOCAB = [
  "NDC", "CBDR-RC", "ITMO / corresponding adjustment", "global stocktake", "conditional NDC",
  "climate finance / NCQG", "JETP", "PPA (physical/sleeved/virtual)", "offtake", "take-or-pay",
  "bankability", "capacity factor", "firming/storage", "LCOE", "additionality", "24/7 CFE",
  "PUE / WUE", "uptime/SLA", "BOT/BOO", "viability-gap funding", "blended/concessional finance",
  "DFI", "sovereign guarantee", "condition precedent", "term sheet / heads of agreement",
  "MFN clause", "ratchet/escalator", "Scope 1/2/3", "financed emissions", "ISSB / IFRS S1–S2",
  "TCFD", "NZAOA / GFANZ", "Equator Principles", "IFC Performance Standards",
  "green/sustainability-linked loan", "taxonomy", "EIA/ESIA", "social licence", "just transition",
  "data localisation", "BATNA", "ZOPA", "MESO", "logrolling",
];

// ---------------------------------------------------------------------------
// OPTIONS BANK scaffold (§8) — proposals to seed the bank with
// ---------------------------------------------------------------------------

export const OPTIONS_PROPOSALS = [
  { id: "a", label: "(a) ≥US$150m renewable investment" },
  { id: "b", label: "(b) Technology transfer" },
  { id: "c", label: "(c) ≥70% local employment" },
  { id: "d", label: "(d) 5% reserved capacity" },
  { id: "meso", label: "MESO / package deals" },
];

// ---------------------------------------------------------------------------
// TIER READING LIST (§9)
// ---------------------------------------------------------------------------

export const TIERS = [
  {
    tier: "Tier 1 — read fully (~16–18 hrs total)",
    items: ["Rulebook + both problem documents (forensically, thrice)", "Getting to Yes", "Negotiation Genius (selected chapters)", "Paris Agreement Arts. 2, 4, 6, 9, 10, 11, 13–14", "One NDC-bindingness explainer", "IEA Energy and AI exec summary"],
  },
  {
    tier: "Tier 2 — skim (~8–10 hrs total)",
    items: ["Singapore DC moratorium + Green DC Roadmap explainer", "2–3 Johor/Malaysia DC-backlash features", "One corporate-PPA guide", "IRENA/Lazard cost headline pages", "One blended-finance/JETP explainer", "NZAOA Target-Setting Protocol exec summary", "SGX/ISSB reporting primer", "Carbon Brief COP29 + COP30 summaries", "One Art. 6/Singapore-IA explainer", "UNCTAD/local-content note", "One gov-cloud/data-localisation explainer", "6–8 A&G Knowledge Highlights + APCEL just-transition paper abstract", "One EIA/IFC-PS overview", "PON multiparty-negotiation PDF"],
  },
  {
    tier: "Tier 3 — reference only",
    items: ["3-D Negotiation (or its HBR distillation)", "IFC PS full texts", "Equator Principles", "ICMA GBP", "Singapore-Asia Taxonomy", "CTCN/TEC pages", "RE100/24-7 CFE material"],
  },
];
