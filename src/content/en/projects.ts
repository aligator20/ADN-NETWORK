/**
 * VERSION ANGLAISE DES PROJETS
 *
 * Table de traduction indexée par `slug`, étalée sur le projet français. Rien
 * de structurel n'est redéclaré : ni le slug, ni l'année, ni la discipline, ni
 * le statut, ni la couverture, ni l'URL. Un projet ajouté au français apparaît
 * ici comme erreur de compilation — `Record<ProjectSlug, …>` exige une entrée
 * pour chaque slug — ce qui interdit d'oublier une traduction en silence.
 *
 * Les titres ne sont PAS traduits : ce sont des noms propres et des marques
 * (AquaControl AI, FullMesh Shop, Ferme FDR-Adone). Les `stack` non plus quand
 * il s'agit de vocabulaire technique consacré.
 *
 * Les montants restent en FCFA. Convertir en euros ou en dollars donnerait un
 * chiffre faux dès la semaine suivante, et un investisseur qui lit un plan
 * ouest-africain attend des francs CFA.
 */
import { projects as projectsFr, type Project, type ProjectStatus } from "@/content/projects";

/** Les huit slugs existants. Une entrée manquante ne compile pas. */
type ProjectSlug =
  | "aquacontrol-ai"
  | "adone-green-service"
  | "full-mesh"
  | "resine-master"
  | "tshirt-gemini"
  | "ferme-fdr-adone"
  | "complexe-porcin"
  | "adn-taste";

type Traduction = {
  summary: string;
  stack?: readonly string[];
  figures?: readonly { value: string; label: string }[];
  opportunity?: readonly { title: string; body: string }[];
  detail?: readonly { title: string; body: string }[];
};

export const statusLabelEn: Record<ProjectStatus, string> = {
  livre: "Delivered",
  exploitation: "In operation",
  construction: "In build",
  financement: "Seeking funding",
};

const EN: Record<ProjectSlug, Traduction> = {
  /* ────────────────────────────────────────────────── AQUACONTROL AI ── */
  "aquacontrol-ai": {
    summary:
      "Irrigation driven by sensors and weather: the water goes where the yield is actually decided.",
    stack: ["IoT", "Edge control", "Forecasting", "Dashboard"],
    figures: [
      { value: "4.45 M", label: "FCFA — launch budget" },
      { value: "0 %", label: "equity given up" },
      { value: "05", label: "pilot farms" },
      { value: "200 ms", label: "local decision, no cloud" },
    ],
    opportunity: [
      {
        title: "The need",
        body: "4,450,000 FCFA for Phase 1: building the prototype and running five pilot demonstrations. 100 % non-dilutive — no share of the company is given up.",
      },
      {
        title: "The intended split",
        body: "Founder's own funds 33 %, agritech grants 34 %, innovation competitions and prizes 16 %, family and pilot pre-sales 17 %. No single line depends on one source.",
      },
      {
        title: "Three ways in",
        body: "Fund one line of the budget in exchange for visibility and a costed impact report. Give a few hours of expertise — engineer, agronomist, lawyer, grants specialist. Or host one of the five official demonstrations on your own plot.",
      },
      {
        title: "What can already be checked",
        body: "The support site shows no fictional amount raised and states a real deadline: prototype in build, January 2027. V1 drives 2,000 m² with a rules engine; full onboard AI is funded by the first sales, not promised ahead of them.",
      },
    ],
    detail: [
      {
        title: "The problem",
        body: "Irrigation is decided by the calendar, not by need. You water on Tuesday because it is Tuesday — and the water goes where the plant was not asking for it.",
      },
      {
        title: "The unit",
        body: "100 W solar panel and LiFePO4 battery: full energy autonomy, no dependence on the electricity grid. Four motorised valves controlled zone by zone, connected to a borehole, a river or a reservoir.",
      },
      {
        title: "The decision",
        body: "Soil moisture, local weather and water level read continuously. A rules engine decides on the spot, in under 200 ms, without waiting for the cloud — full onboard AI arrives in V2, funded by the first sales.",
      },
      {
        title: "The field",
        body: "Mobile tripod, pole mount or ground placement: installed in under fifteen minutes, with no specialist tooling. Wi-Fi or LoRa, to hold up in rural areas with limited connectivity.",
      },
      {
        title: "Where it stands",
        body: "Prototype in build, five pilot farms planned. Launch budget of 4,450,000 FCFA, 100 % non-dilutive. The support site shows real progress and announces no fictional amount raised.",
      },
    ],
  },

  /* ───────────────────────────────────────── ADONE GREEN SERVICES ── */
  "adone-green-service": {
    summary:
      "Landscaping and grounds maintenance, with eight AI agents holding the quotes, the schedule and the quality.",
    stack: ["AI agents", "Quotes & scheduling", "Site tracking", "Management"],
    figures: [
      { value: "150→400", label: "M FCFA — projected revenue" },
      { value: "5–10 M", label: "FCFA — Phase 1 raise" },
      { value: "10 years", label: "of family craft" },
      { value: "90 %", label: "target client score" },
    ],
    opportunity: [
      {
        title: "The market",
        body: "Benin's 2021-2026 Government Action Programme mobilises over 6,000 billion FCFA. Cotonou and Abomey-Calavi are urbanising at 3.5 % a year. Thirty-five modern markets, the Sofitel opening in 2024, the presence of Maersk, Bolloré, Total and MTN: demand for professional grounds care is structural, not cyclical.",
      },
      {
        title: "The gap",
        body: "That demand remains largely unmet by formal, responsive operators. No local competitor today combines inherited horticultural skill, standardised procedures and AI automation. We are not selling gardening hours.",
      },
      {
        title: "The model",
        body: "Recurring maintenance contracts rather than one-off jobs. The company aims to fund its own growth from year two; the raise only covers the start.",
      },
      {
        title: "What is being sought",
        body: "5 to 10 million FCFA over the first twelve months: professional equipment, incorporation of the company, six months of working capital, marketing and digital infrastructure.",
      },
    ],
    detail: [
      {
        title: "The company",
        body: "A family firm for landscaping, grounds maintenance and vegetation clearing. The family name becomes a brand: the stated goal is a transferable family business, not a tradesman's round.",
      },
      {
        title: "The ADONE 4.0 architecture",
        body: "Eight AI agents divide up the running of the business: sales, quotes, scheduling, accounts, HR, marketing, quality and management. Each one holds a post the company cannot yet afford to hire for.",
      },
      {
        title: "What it changes on site",
        body: "The quote goes out the day of the visit. The schedule reshuffles itself when a job slips. The quality sheet is filled in on the spot. The owner decides instead of re-typing.",
      },
      {
        title: "The document base",
        body: "Quote, invoice, maintenance contract, business contract, site sheet, client sheet, quality report, team schedule, internal procedure: nine ready-to-use templates from day one.",
      },
    ],
  },

  /* ───────────────────────────────────────────────── FULLMESH SHOP ── */
  "full-mesh": {
    summary:
      "A digital-products shop built on one rule: be seen before you are believed. Black and electric yellow, four colours, not one more.",
    stack: ["Brand guidelines", "Online shop", "Reseller network"],
    figures: [
      { value: "35 %", label: "reseller commission" },
      { value: "12", label: "guides in the catalogue" },
      { value: "5,000 F", label: "the bundle — 12,000 F separately" },
      { value: "Weekly", label: "payout, mobile money" },
    ],
    opportunity: [
      {
        title: "The product",
        body: "Twelve practical guides in French, written for francophone Africa, with amounts in CFA francs. Bought separately: 12,000 F. As a full bundle: 5,000 F. The gap is not an invented discount, it is the real catalogue price.",
      },
      {
        title: "The model",
        body: "No stock, no advance, no delivery to handle: the customer pays and receives the files by email within the minute. The marginal cost of one more sale is zero — that is what makes the model scale.",
      },
      {
        title: "Distribution",
        body: "A network of resellers paid 35 % on every sale, settled every Saturday by mobile money, with no minimum. The reseller creates nothing, stocks nothing, fronts nothing: the barrier to entry is zero, and that is the point.",
      },
      {
        title: "What decides growth",
        body: "The catalogue is produced and its cost is behind us. The only variable left is the number of active resellers and how visible their links are. The reseller kit — guide, twenty ready-to-post texts, fifty visuals — exists to remove the delay between signing up and the first sale.",
      },
    ],
    detail: [
      {
        title: "The positioning",
        body: "Be seen before you are believed. On a phone, the decision is made in under a second: a visual nobody notices convinces nobody, however credible it is. The art direction owns the order — win attention first, trust second.",
      },
      {
        title: "Four colours, not one more",
        body: "Black #0A0A0B, a real black and not a dark grey, as the ground. Electric yellow #F5C518 for accents, prices and buttons. Red #E23D28 reserved for urgency and deadlines. Black on yellow is the strongest contrast there is: in a scrolling feed, that is what stops the thumb.",
      },
      {
        title: "The gap that builds credibility",
        body: "The register is the poster's, not the brochure's: heavy type, hard diagonals, enormous prices. That register also belongs to street vendors, and it can read as aggressive — so the substance compensates. Never an inflated promise, always a checkable figure. The form shouts, the substance stays serious.",
      },
      {
        title: "What was delivered",
        body: "Horizontal, stacked and monogram logos, on black, white and yellow grounds, in PNG and SVG. Full favicon set. Construction, sizing, background and misuse boards. Covers, thumbnails, banners and a reseller kit for the shop.",
      },
    ],
  },

  /* ──────────────────────────────────────────────── RÉSINE MASTER ── */
  "resine-master": {
    summary:
      "A resin manufacture structured end to end: business plan, management and inventory tools, professional training manual.",
    stack: ["Business plan", "Management & inventory", "Training manual"],
    figures: [
      { value: "6.55 M", label: "FCFA — initial investment" },
      { value: "18→250", label: "M FCFA — revenue over 10 years" },
      { value: "03", label: "resin systems" },
      { value: "120 s", label: "UV curing" },
    ],
    opportunity: [
      {
        title: "The market",
        body: "Benin's construction boom — hotels, corporate buildings, high-end housing — runs into the absence of local manufacturers. Architects, interior designers and developers import, in foreign currency and on lead times they simply have to accept.",
      },
      {
        title: "The investment",
        body: "6,550,000 FCFA of start-up capital: casting equipment, industrial-grade 395 nm UV/LED curing, operator protection to standard, and a first batch of 200 kg of epoxy resin.",
      },
      {
        title: "The projections",
        body: "18 million FCFA of revenue in year one, then 35 and 75, and 250 million over the ten-year horizon — on assumptions the business plan itself calls conservative.",
      },
      {
        title: "The barrier to entry",
        body: "The integrated training centre produces the certified applicators the market lacks. Training the workforce means creating the market and the supply at once — and it makes the technical lead hard to close.",
      },
    ],
    detail: [
      {
        title: "The plant",
        body: "A polymer manufacture in Abomey-Calavi: formulation, casting and industrial curing of three systems — two-part epoxies, structural polyurethanes, UV-curable acrylics. Incorporated from day one, against the grain of the sector's informal workshops.",
      },
      {
        title: "The market",
        body: "Benin's construction boom — hotel complexes, corporate buildings, high-end housing — runs into the absence of local manufacturers. Architects and developers import, in foreign currency and on lead times they have to accept.",
      },
      {
        title: "The range",
        body: "Fine Wood & Epoxy Architecture: monolithic prestige furniture — river tables, reception counters, worktops. Plus certified application of technical industrial flooring.",
      },
      {
        title: "The training centre",
        body: "A professional training manual documents ratios, mixing times and curing rules. Training the applicators creates the market and the supply at once — and that is where the technical lead is won.",
      },
      {
        title: "The instruments",
        body: "Bank-grade business plan and ten-year strategy, management and inventory workbooks. The company starts with its measuring instruments, not once the problems have arrived.",
      },
    ],
  },

  /* ───────────────────────────────────────────────── T-SHIRT GEMINI ── */
  "tshirt-gemini": {
    summary:
      "Type that carries the message before the garment: a red, vertical composition, legible at three metres.",
    stack: ["Graphic design", "Typography", "Textile"],
    detail: [
      {
        title: "The idea",
        body: "Fit a zodiac sign, a Beninese pattern and a gym imperative onto one chest — without any of the three crushing the other two.",
      },
      {
        title: "The composition",
        body: "Three type blocks stacked on the vertical axis — PUSH / YOUR / LIMIT — in groovy black serif on light panels. The axis is held by a barbell running the full height of the visual.",
      },
      {
        title: "The ground",
        body: "A dense red pattern, geometrically close to local printed cloth, strictly symmetrical about the axis. Saturated where the text does not fall, muted where it does: legibility comes from the ground, not from an added outline.",
      },
      {
        title: "The signs",
        body: "The Gemini glyph marks both shoulders and closes the composition. “Woli Medji” anchors it in Beninese Fa divination — the same sign, said in two languages.",
      },
    ],
  },

  /* ───────────────────────────────────────────── FERME FDR-ADONE ── */
  "ferme-fdr-adone": {
    summary:
      "A farm that buys back its own land out of its own revenue: from 1.5 hectares to a hundred, with no follow-on raise.",
    stack: ["Plot plan", "Staged mechanisation", "Integrated livestock", "On-farm processing"],
    figures: [
      { value: "1.5→100", label: "hectares, 10-year horizon" },
      { value: "3→300", label: "M FCFA — projected annual revenue" },
      { value: "02→50", label: "direct jobs" },
      { value: "05", label: "self-funded stages" },
    ],
    opportunity: [
      {
        title: "The principle",
        body: "Each stage funds the next. You do not mechanise before the acreage justifies it, and you do not buy land before production pays for it. So there is never a second raise to negotiate from a position of weakness.",
      },
      {
        title: "The five stages",
        body: "Petrol pump retired, then a two-wheel tractor, a mid-power tractor, a heavy tractor with implements, and finally a full fleet. Each step is triggered by a revenue threshold being reached, never by a date on the calendar.",
      },
      {
        title: "What transfers",
        body: "The self-funding rule, the allocation of plots by revenue horizon, and the order of investment — water first, mechanisation next, processing last. That triptych holds at any latitude.",
      },
      {
        title: "What adapts",
        body: "The crops, the prices, the equipment suppliers, the public support schemes. A plan built for the Mono is rewritten for Côte d'Ivoire, the Sahel or a temperate plain by changing those four variables — not the method.",
      },
    ],
    detail: [
      {
        title: "The origin",
        body: "“My father spent his life fighting for 1,000 m². I am building what it takes to produce on 100 hectares.” The problem observed was neither a lack of land nor a lack of work: it was the absence of mechanisation, of organisation, and of a horizon.",
      },
      {
        title: "The test season",
        body: "A first season was started in May on the plot. This is not a simulation: the maize is in the ground, the rows are set, and this season's yields will be the baseline for the stages that follow.",
      },
      {
        title: "The plot plan",
        body: "Half the acreage in perennial crops with late revenue, a quarter in fast crops that keep the farm alive, 15 % in diversification, 10 % in infrastructure. The land is divided by revenue horizon, not by convenience.",
      },
      {
        title: "Water first",
        body: "Borehole, solar pump and drip irrigation before any other spending. A farm that depends on fuel to water watches its margin leave as petrol and its harvest suffer at every breakdown.",
      },
      {
        title: "Integrated livestock",
        body: "Poultry and rabbits on the same land: short-cycle cash, and composted manure that replaces bought fertiliser. Livestock is not a side activity, it is what closes the loop.",
      },
      {
        title: "Processing at the end of the chain",
        body: "Once production is stable, process on site rather than sell raw. That is the step that turns farm income into industrial income — and it is taken last.",
      },
    ],
  },

  /* ─────────────────────────────────────────── COMPLEXE PORCIN ── */
  "complexe-porcin": {
    summary:
      "Farrow-to-finish, vertically integrated: the feed, the herd, the processing and the sale under one roof.",
    stack: ["Farrow-to-finish", "Feed formulation", "Biosecurity", "B2B processing"],
    figures: [
      { value: "10→50", label: "breeding sows" },
      { value: "14 M", label: "FCFA — Phase 1 capital" },
      { value: "24", label: "months — payback" },
      { value: "×1.6", label: "value added by processing" },
    ],
    opportunity: [
      {
        title: "Three costed stages",
        body: "10 sows: 184 pigs a year, 29.4 M FCFA of revenue, 9.5 M net profit. 30 sows: 552 pigs, 88.3 M, 33.9 M. 50 sows: 920 pigs, 147.2 M, 56.4 M. Each stage is triggered by the profitability of the one before.",
      },
      {
        title: "The cost advantage",
        body: "A feed formulation built on local by-products cuts 30 to 40 % off the heaviest cost in pig farming. It is the main competitive advantage, and it lasts because it rests on know-how, not on a negotiated price.",
      },
      {
        title: "Financial discipline",
        body: "The processing workshop is only switched on once cash flow is positive and steady — around month eight. Launching both at once is the mistake that kills this kind of project.",
      },
      {
        title: "What transfers",
        body: "The biosecurity protocol — closed farm, foot baths, thirty-day quarantine — answers African swine fever, which is not a Beninese problem but a global one. The farrow-to-finish model and formulation on local resources hold anywhere there are agricultural by-products to use.",
      },
    ],
    detail: [
      {
        title: "The model",
        body: "Farrow-to-finish: the farm breeds its own piglets. The most volatile purchase line disappears, and genetic autonomy is built year on year.",
      },
      {
        title: "Feed, the real subject",
        body: "Feed is most of the cost of production. Formulating it yourself from locally available materials, rather than buying compound feed, changes the margin structure of the entire project.",
      },
      {
        title: "Biosecurity",
        body: "Closed farm, foot baths at every entrance, thirty-day quarantine for any animal brought in. This is not caution: a single outbreak of swine fever wipes out a herd and the investment with it.",
      },
      {
        title: "The closed loop",
        body: "Slurry becomes compost — fifteen to twenty tonnes a year from phase one, sold on or returned to the crops. Zero discharge, and extra income that costs nothing but organisation.",
      },
      {
        title: "B2B processing",
        body: "Smoked meat, grilled products, charcuterie, offal put to use, sold to restaurants and street kitchens. The same carcass returns about 1.6 times more than sold raw.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────── ADN TASTE ── */
  "adn-taste": {
    summary:
      "Four chillies, one process, a 7-gram sachet: the taste of home, in trial format.",
    stack: ["Product brand", "7 g packaging", "Spices & condiments", "Distribution"],
    figures: [
      { value: "04", label: "recipes in the range" },
      { value: "10 M", label: "FCFA — initial funding" },
      { value: "7 g", label: "the sachet, single-serve" },
      { value: "2033", label: "horizon, 15+ countries targeted" },
    ],
    opportunity: [
      {
        title: "The growth rule",
        body: "Never launch a product before the previous one is profitable, under control and distributed. It is a deliberate constraint: it forbids the scattering that drains the cash of young food brands.",
      },
      {
        title: "The founding range",
        body: "Four chilli recipes — red powder, ginger-smoked, Double Hot with clove, and black roasted — all derived from one raw material and one process. Four tastes, a single production chain to master.",
      },
      {
        title: "Where the 10 million goes",
        body: "35 % production equipment, 20 % raw materials for six months, 15 % jars and packaging, 15 % working capital, 10 % marketing, 5 % contingency. No line exceeds a third.",
      },
      {
        title: "What transfers",
        body: "One raw material, one process, several recipes, a trial format. The packaging claims “made in Africa” rather than a single country: the brand is designed from the outset for a raw material that changes terroir without the method changing.",
      },
    ],
    detail: [
      {
        title: "The positioning",
        body: "Premium grocery rather than commodity. One hundred per cent natural, no preservatives, small-batch made — and those claims commit the brand, they do not decorate the label.",
      },
      {
        title: "The packaging",
        body: "A single-serve 7-gram sachet, black and gold, carrying usage advice, storage, allergens, nutritional values and a barcode. The single-serve format settles hygiene, entry price and trial in one move.",
      },
      {
        title: "The trial format",
        body: "Seven grams is one dish. The sachet gets the product tasted without commitment, and that is the strongest argument for a condiment nobody knows yet. Larger sizes come once the recipe has been adopted.",
      },
      {
        title: "The horizon",
        body: "A presence in more than fifteen countries by 2033, and a target valuation of one billion FCFA. These are stated objectives, not audited projections — and they are presented as such.",
      },
    ],
  },
};

export const projectsEn: readonly Project[] = projectsFr.map((p) => ({
  ...p,
  ...EN[p.slug as ProjectSlug],
}));
