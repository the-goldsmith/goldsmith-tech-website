const chatLauncher = document.querySelector("#chat-launcher");
const chatPanel = document.querySelector("#chat-panel");
const chatMenuToggle = document.querySelector("#chat-menu-toggle");
const chatMainMenu = document.querySelector("#chat-main-menu");
const chatClose = document.querySelector("#chat-close");
const chatClear = document.querySelector("#chat-clear");
const helpChatLink = document.querySelector("#help-chat-link");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const chatMessages = document.querySelector("#chat-messages");
const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
const contactConfirmation = document.querySelector("#contact-confirmation");
const contactEmailFallback = document.querySelector("#contact-email-fallback");
const privacyDialog = document.querySelector("#privacy-dialog");
const privacyDialogStatus = document.querySelector("#privacy-dialog-status");
const analyticsAccept = document.querySelector("#analytics-accept");
const analyticsDecline = document.querySelector("#analytics-decline");
const analyticsMeasurementId = "";
const analyticsConsentKey = "goldsmith-analytics-consent";
let analyticsLoaded = false;
let sessionAnalyticsConsent = "unset";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const catalogDialogs = new Map();
function showDialogWithoutPageScroll(dialog, initialFocus) {
  const { scrollX, scrollY } = window;
  const rootStyle = document.documentElement.style;
  const previousScrollBehavior = rootStyle.getPropertyValue("scroll-behavior");
  const previousScrollPriority = rootStyle.getPropertyPriority("scroll-behavior");
  rootStyle.setProperty("scroll-behavior", "auto", "important");
  dialog.showModal();
  initialFocus?.focus({ preventScroll: true });
  window.scrollTo(scrollX, scrollY);
  window.requestAnimationFrame(() => {
    if (previousScrollBehavior) {
      rootStyle.setProperty("scroll-behavior", previousScrollBehavior, previousScrollPriority);
    } else {
      rootStyle.removeProperty("scroll-behavior");
    }
  });
}
function setCatalogDialogBackground(dialog, images) {
  const image = dialog.querySelector(".dialog-ambient-image");
  const backgrounds = [...new Set(images.filter(Boolean))];
  if (!image || !backgrounds.length) return;
  const state = catalogDialogs.get(dialog) ?? { image, images: backgrounds, index: 0 };
  state.image = image;
  state.images = backgrounds;
  state.index = 0;
  catalogDialogs.set(dialog, state);
  image.src = backgrounds[0];
}
window.setInterval(() => {
  if (prefersReducedMotion.matches || document.visibilityState !== "visible") return;
  catalogDialogs.forEach(({ image, images }, dialog) => {
    if (!dialog.open || images.length < 2) return;
    const state = catalogDialogs.get(dialog);
    state.index = (state.index + 1) % images.length;
    image.src = images[state.index];
  });
}, 2200);
const serviceDialog = document.querySelector("#service-dialog");
const serviceGrid = document.querySelector("#service-grid");
const serviceDialogImage = document.querySelector("#service-dialog-img");
const serviceDialogCounter = document.querySelector("#service-dialog-counter");
const serviceDialogImageCaption = document.querySelector("#service-dialog-image-caption");
const serviceDialogCategory = document.querySelector("#service-dialog-category");
const serviceDialogTitle = document.querySelector("#service-dialog-title");
const serviceDialogSummary = document.querySelector("#service-dialog-summary");
const serviceDialogDetail = document.querySelector("#service-dialog-detail");
const serviceDialogCta = document.querySelector("#service-dialog-cta");
const optionBackgroundObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    target.dataset.backgroundVisible = String(isIntersecting);
  });
}, { threshold: 0.05 });
function registerOptionBackground(card, photo, images, initialIndex = 0) {
  const backgrounds = [...new Set(images.filter(Boolean))];
  if (backgrounds.length < 2) return;
  card.dataset.backgroundImages = JSON.stringify(backgrounds);
  card.dataset.backgroundIndex = String(initialIndex % backgrounds.length);
  optionBackgroundObserver.observe(card);
}
let optionBackgroundCursor = 0;
window.setInterval(() => {
  if (prefersReducedMotion.matches || document.visibilityState !== "visible") return;
  const visibleCards = [...document.querySelectorAll('[data-background-visible="true"][data-background-images]')];
  if (!visibleCards.length) return;
  optionBackgroundCursor %= visibleCards.length;
  const card = visibleCards[optionBackgroundCursor++];
  if (card.dataset.backgroundLoading === "true") return;
  const images = JSON.parse(card.dataset.backgroundImages);
  const currentIndex = Number(card.dataset.backgroundIndex) || 0;
  const nextIndex = (currentIndex + 1) % images.length;
  const photo = card.querySelector("img");
  if (!photo || !images[nextIndex]) return;
  card.dataset.backgroundLoading = "true";
  const preload = new Image();
  preload.onload = () => {
    if (!card.isConnected || Number(card.dataset.backgroundIndex) !== currentIndex) {
      delete card.dataset.backgroundLoading;
      return;
    }
    photo.addEventListener("load", () => {
      photo.classList.remove("is-changing");
    }, { once: true });
    photo.classList.add("is-changing");
    photo.src = images[nextIndex];
    card.dataset.backgroundIndex = String(nextIndex);
    delete card.dataset.backgroundLoading;
  };
  preload.onerror = () => {
    card.dataset.backgroundIndex = String(nextIndex);
    delete card.dataset.backgroundLoading;
  };
  preload.src = images[nextIndex];
}, 1600);
const serviceFilters = document.querySelector("#service-filters");
const serviceSearch = document.querySelector("#service-search");
const catalogResultCount = document.querySelector("#catalog-result-count");
const servicePhotoPools = [
  [
    "photo-1535378620166-273708d44e4c", "photo-1485827404703-89b55fcc595e", "photo-1473968512647-3e447244af8f",
    "photo-1558494949-ef010cbdcc31", "photo-1518770660439-4636190af475", "photo-1581091226825-a6a2a5aee158",
    "photo-1506947411487-a56738267384", "photo-1451187580459-43490279c0fa", "photo-1555949963-ff9fe0c870eb",
    "photo-1516321318423-f06f85e504b3", "photo-1531482615713-2afd69097998", "photo-1519389950473-47ba0277781c",
    "photo-1470071459604-3b5ec3a7fe05", "photo-1498050108023-c5249f4df085", "photo-1521737711867-e3b97375f902",
    "photo-1516321318423-f06f85e504b3", "photo-1550751827-4bd374c3f58b", "photo-1518770660439-4636190af475",
    "photo-1581091226825-a6a2a5aee158", "photo-1535378620166-273708d44e4c", "photo-1485827404703-89b55fcc595e",
    "photo-1558494949-ef010cbdcc31", "photo-1519389950473-47ba0277781c", "photo-1451187580459-43490279c0fa",
    "photo-1531482615713-2afd69097998", "photo-1555949963-ff9fe0c870eb"
  ],
  [
    "photo-1498050108023-c5249f4df085", "photo-1555949963-ff9fe0c870eb", "photo-1581091226825-a6a2a5aee158",
    "photo-1516321318423-f06f85e504b3", "photo-1506947411487-a56738267384", "photo-1470071459604-3b5ec3a7fe05",
    "photo-1521737711867-e3b97375f902", "photo-1518770660439-4636190af475", "photo-1531482615713-2afd69097998",
    "photo-1550751827-4bd374c3f58b", "photo-1485827404703-89b55fcc595e", "photo-1451187580459-43490279c0fa",
    "photo-1535378620166-273708d44e4c", "photo-1519389950473-47ba0277781c", "photo-1558494949-ef010cbdcc31",
    "photo-1506947411487-a56738267384", "photo-1498050108023-c5249f4df085", "photo-1555949963-ff9fe0c870eb",
    "photo-1516321318423-f06f85e504b3", "photo-1531482615713-2afd69097998", "photo-1518770660439-4636190af475",
    "photo-1581091226825-a6a2a5aee158", "photo-1473968512647-3e447244af8f", "photo-1470071459604-3b5ec3a7fe05",
    "photo-1485827404703-89b55fcc595e", "photo-1521737711867-e3b97375f902"
  ]
];
const serviceImages = [
  "photo-1518770660439-4636190af475", "photo-1519389950473-47ba0277781c", "photo-1516321318423-f06f85e504b3",
  "photo-1473968512647-3e447244af8f", "photo-1485827404703-89b55fcc595e", "photo-1550751827-4bd374c3f58b",
  "photo-1535378620166-273708d44e4c", "photo-1558494949-ef010cbdcc31", "photo-1451187580459-43490279c0fa",
  "photo-1555949963-ff9fe0c870eb", "photo-1518770660439-4636190af475", "photo-1516321318423-f06f85e504b3",
  "photo-1581091226825-a6a2a5aee158", "photo-1485827404703-89b55fcc595e", "photo-1506947411487-a56738267384",
  "photo-1470071459604-3b5ec3a7fe05", "photo-1516321318423-f06f85e504b3", "photo-1531482615713-2afd69097998",
  "photo-1498050108023-c5249f4df085", "photo-1558494949-ef010cbdcc31", "photo-1519389950473-47ba0277781c",
  "photo-1516321318423-f06f85e504b3", "photo-1555949963-ff9fe0c870eb", "photo-1521737711867-e3b97375f902",
  "photo-1518770660439-4636190af475", "photo-1531482615713-2afd69097998"
];
servicePhotoPools.unshift(serviceImages);
const serviceCatalog = [
  ["Custom software", "SOFTWARE", "⌘", "Web platforms, business tools, and dependable digital products designed around real workflows.", "Start with what your team needs to accomplish. We shape the right product scope, user experience, and technical foundation around those goals.", "Purpose-built software"],
  ["Applied AI", "INTELLIGENCE", "✳", "Practical machine learning and AI features designed to make complex work simpler.", "We help explore appropriate AI use cases, data readiness, evaluation, and human review. The right solution depends on the problem—not the trend.", "Useful, human-guided AI"],
  ["Security systems", "AWARENESS", "◎", "Responsible monitoring concepts that support human decisions.", "Explore privacy-aware system design, clear access controls, and human review. Requirements and safeguards should be considered before deployment.", "Security with oversight"],
  ["R&D collaboration", "PROTOTYPING", "↗", "Early prototypes, technical validation, and practical roadmaps for ambitious ideas.", "Turn an early idea into a testable concept through focused discovery, proof-of-concept work, and an honest assessment of feasibility.", "From idea to prototype"],
  ["AI-assisted drones", "AERIAL SYSTEMS", "⌁", "Exploratory drone concepts for supervised inspection, mapping, and environmental observation.", "Concept-stage work focused on civilian inspection and observation use cases. Human operators remain responsible; these concepts do not include weaponization or autonomous targeting.", "Human-supervised aerial concepts"],
  ["Intelligent workflows", "AUTOMATION", "⟳", "AI-assisted tools that organize information and reduce repetitive tasks.", "Identify routine work that could be streamlined, then design workflows with review steps, clear ownership, and appropriate handling of data.", "People stay in control"],
  ["Computer vision", "PERCEPTION", "◉", "Image and video analysis concepts for clearly defined, responsible applications.", "Explore feasibility, dataset quality, evaluation criteria, error handling, privacy, and human review before building a vision-based feature.", "Visual data, thoughtfully used"],
  ["Data insights", "ANALYTICS", "▤", "Dashboards and analytics experiences that make useful information easier to understand.", "Connect relevant data to clear questions and decision-ready views. We consider data quality, access, and what users need to do with the results.", "Clarity from your data"],
  ["Cloud platforms", "INFRASTRUCTURE", "☁", "Scalable digital foundations for modern products and teams.", "Plan cloud architecture around reliability, operational needs, access management, and future growth—without overbuilding the first release.", "A dependable foundation"],
  ["Cybersecurity reviews", "RESILIENCE", "⌑", "Practical security-minded reviews to help teams identify areas needing attention.", "Discuss threat assumptions, secure design practices, and risk prioritization. A review is scoped to your authorization and does not imply a certification.", "Prioritize the right safeguards"],
  ["Digital twins", "SIMULATION", "◇", "Exploratory digital representations to help visualize systems and operations.", "Model relevant assets or processes to support understanding and planning. Start with a defined use case and validate assumptions against real-world data.", "A clearer view of complex systems"],
  ["Process automation", "PRODUCTIVITY", "⟳", "Reduce repetitive steps with carefully designed software workflows.", "Map the existing process first, then find safe opportunities to automate while preserving checkpoints, exception handling, and human accountability.", "Less repetition, better flow"],
  ["Predictive maintenance", "RELIABILITY", "⌁", "Data-informed concepts for anticipating equipment needs and planning maintenance.", "Explore available sensor or service data and determine whether it can support useful, testable maintenance insights. Human expertise remains part of the decision.", "Plan maintenance with insight"],
  ["Smart facilities", "CONNECTED SPACES", "⌂", "Connected systems concepts for more informed facility operations.", "Bring operational information together to support monitoring and efficiency, while respecting privacy and limiting access to what is needed.", "Facilities designed to work smarter"],
  ["Geospatial mapping", "MAPPING", "⌖", "Mapping and location-data experiences for inspection and environmental planning.", "Explore map-based workflows using appropriate imagery and data sources. Any collection or use of location data needs a lawful, clearly defined purpose.", "Place-aware project insights"],
  ["Environmental sensing", "ENVIRONMENT", "◌", "Sensor and data concepts for observing environmental conditions.", "Consider what should be measured, sensor suitability, data quality, and how observations will be reviewed and acted upon.", "Better visibility of conditions"],
  ["Accessibility tools", "INCLUSIVE DESIGN", "◎", "Digital experiences that aim to be easier for more people to use.", "Consider accessibility from the start: clear structure, keyboard access, readable content, and inclusive testing with real user needs in mind.", "Technology for more people"],
  ["Research prototyping", "EXPLORATION", "✳", "Fast, focused prototypes that help test an idea before a larger investment.", "Create a small experiment with a clear question, success criteria, and a plan for what to learn next. Prototypes are exploratory, not production promises.", "Learn before scaling"],
  ["Product design", "EXPERIENCE", "✧", "Product discovery and interface concepts shaped around user needs.", "Clarify the audience, tasks, and constraints, then turn them into understandable flows and testable interface concepts.", "Good experiences start with users"],
  ["System integration", "CONNECTIVITY", "⤳", "Connect digital systems and data flows where the project requirements allow.", "Review existing tools, supported interfaces, data formats, and access controls before planning an integration. Specific compatibility is confirmed per project.", "Systems that work together"],
  ["Mobile experiences", "ON THE MOVE", "▯", "Mobile-first concepts for services that people use while away from a desk.", "Plan the right mobile experience around the users, devices, connectivity, accessibility needs, and how the product fits into their day.", "Useful wherever work happens"],
  ["Quality engineering", "RELIABILITY", "✓", "Testing and quality practices to help products behave as expected.", "Define important behaviors and edge cases, then use proportionate checks to improve reliability and make releases easier to trust.", "Confidence through careful testing"],
  ["Document intelligence", "KNOWLEDGE", "▤", "Information tools that help organize and search business documents.", "Explore document workflows with appropriate data controls, access permissions, accuracy checks, and human review of important outputs.", "Make information easier to navigate"],
  ["Decision support", "HUMAN-CENTERED AI", "⊙", "Information experiences that help people review options and make informed decisions.", "Design systems to explain relevant information and uncertainty while leaving consequential decisions with accountable people.", "Assist decisions, don't replace people"],
  ["Edge AI concepts", "ON-DEVICE COMPUTING", "◈", "Exploratory concepts for processing information closer to where it is collected.", "Assess device capabilities, privacy goals, reliability, and update needs before choosing local or connected processing.", "Responsive, considered computing"],
  ["Technology consulting", "STRATEGY", "↗", "Practical technical guidance to help teams choose their next step.", "Discuss goals, constraints, options, and tradeoffs to develop a useful plan. Recommendations depend on your context and are not a substitute for specialist advice.", "A clearer path forward"],
  ["CRM systems", "CUSTOMER SYSTEMS", "◎", "Customer and lead management concepts shaped around your sales and support workflow.", "A CRM can bring contacts, companies, lead stages, follow-up tasks, interaction history, search, and reporting into one tailored workspace. Scope depends on your team's process, user roles, existing records, and integrations; this is a project idea, not a ready-made product.", "A clearer view of every customer relationship"],
  ["Inventory & order management", "BUSINESS SYSTEMS", "▤", "Purpose-built tools for tracking stock, orders, and day-to-day fulfillment.", "Explore product catalogs, stock movements, order status, low-stock alerts, and operational reports around your existing process. Data imports, integrations, and business rules should be confirmed during discovery.", "Keep stock and orders in view"],
  ["Accounting workflow tools", "FINANCE OPERATIONS", "＋", "Workflow software concepts for organizing routine finance operations.", "Plan approval flows, expense records, invoice status, and handoffs to existing accounting tools. These systems can support administrative work but do not replace qualified accounting or tax advice.", "Smoother finance workflows"],
  ["Customer support portals", "CUSTOMER EXPERIENCE", "☏", "Self-service and support tools that help customers find answers and request assistance.", "Consider support requests, status tracking, knowledge articles, team queues, and clear escalation paths. Integrations and service commitments depend on your current support process.", "Make getting help easier"],
  ["Appointment & booking systems", "SCHEDULING", "◷", "Booking experiences for managing availability, appointments, and customer reminders.", "Explore service calendars, time slots, booking confirmations, rescheduling, and staff availability. Scheduling rules, time zones, and any payment or calendar connections need project-specific review.", "A simpler way to schedule"],
  ["Document management", "DOCUMENT WORKFLOWS", "▧", "Organized digital workflows for storing, finding, and managing business documents.", "Consider document categories, search, version history, access permissions, retention needs, and review or approval steps. The design should match your records obligations and existing tools.", "Find the right document faster"],
  ["Knowledge-base search", "KNOWLEDGE", "⌕", "Search experiences that help teams find answers across approved internal knowledge.", "Explore indexing policies, source permissions, useful search results, and ways to show where answers came from. Access restrictions should carry through to search results.", "Useful knowledge, easier to find"],
  ["Identity & access management", "IDENTITY", "⌑", "Account and permission design to help control access across digital products.", "Plan sign-in, user roles, least-privilege access, account recovery, and administrative review around the project. Integrations and security requirements should be verified before implementation.", "The right access for the right people"],
  ["Backup & recovery planning", "CONTINUITY", "↻", "Practical planning for protecting important data and restoring services after disruption.", "Review backup scope, recovery priorities, access protection, retention, and restore testing with the team. Recovery objectives and operational coverage must be agreed to for each environment.", "Prepare for recovery, not just backup"],
  ["Cloud migration", "CLOUD TRANSITION", "☁", "Planning and implementation concepts for moving suitable systems to cloud platforms.", "Assess current applications, data, dependencies, security needs, cost factors, and downtime constraints before planning migration steps. Cloud provider selection and final architecture are project-specific.", "A considered path to cloud"],
  ["API & legacy integration", "SYSTEM CONNECTIVITY", "⤳", "Connect existing software and legacy workflows where supported interfaces allow.", "Map systems, data ownership, available APIs or file exchanges, error handling, and access controls before connecting services. Compatibility and migration effort depend on the systems involved.", "Bring existing systems together"],
  ["Data migration & cleanup", "DATA OPERATIONS", "⇢", "Structured support for preparing, cleaning, and moving project data.", "Define source and destination, map fields, identify duplicates and quality issues, and validate sample imports before a full migration. Sensitive data should be handled with suitable permissions and safeguards.", "Move data with a clear plan"],
  ["Business process mapping", "PROCESS DESIGN", "⌁", "Make current workflows visible before changing or automating them.", "Document roles, steps, handoffs, exceptions, and pain points to identify what should be simplified, retained, or improved. Process changes should be validated with the people who do the work.", "Understand the work before redesigning it"],
  ["Reporting dashboards", "REPORTING", "▥", "Decision-focused dashboards that turn agreed data into clear operational views.", "Identify users, measures, source systems, definitions, and update needs before designing reports. Dashboard figures depend on data quality and should be validated with stakeholders.", "See the measures that matter"],
  ["Mobile workforce applications", "FIELD SOFTWARE", "▯", "Mobile workflow concepts for staff working across sites or away from a desk.", "Explore task lists, forms, status updates, photo or location needs, and intermittent-connectivity behavior for the field context. Access, device, and privacy needs should shape the design.", "Useful tools for work in the field"],
  ["Accessibility audits", "ACCESSIBILITY", "◎", "Structured accessibility reviews to identify usability barriers in digital products.", "Review page structure, keyboard operation, names and labels, contrast, motion, and common interaction patterns. Findings can guide remediation; this is not a certification or guarantee of conformance.", "Make digital experiences more inclusive"],
  ["Software quality & test automation", "TEST ENGINEERING", "✓", "Testing strategies and automation concepts for dependable software releases.", "Identify critical user journeys, risks, and regression areas, then choose maintainable checks across suitable test layers. Coverage and release criteria depend on the application.", "Catch regressions with confidence"],
  ["Responsible AI evaluation", "AI ASSURANCE", "✳", "Evaluation planning to understand AI behavior, limitations, and human review needs.", "Define intended use, representative test cases, failure modes, data considerations, and review procedures before relying on model outputs. Evaluation does not guarantee error-free or unbiased performance.", "Understand AI limits before relying on outputs"],
  ["Privacy-aware computer vision", "PRIVACY ENGINEERING", "◉", "Computer-vision concepts designed with data minimization and privacy in mind.", "Explore whether visual analysis is necessary, what can be processed locally, what data should be retained, and how people review outputs. Any collection or deployment requires appropriate legal and privacy review.", "Visual insights with privacy in mind"],
  ["Digital product discovery", "PRODUCT STRATEGY", "✧", "Early product discovery to clarify users, needs, constraints, and what to build first.", "Use focused research and workflow mapping to frame the problem, test assumptions, prioritize a first release, and identify open technical questions before committing to a build.", "Find the right first step"]
].map(([title, category, icon, summary, detail, imageAlt], index) => ({
  title, category, icon, summary, detail, imageAlt,
  group: getServiceGroup(category),
  images: servicePhotoPools.map((pool) => `https://images.unsplash.com/${pool[index % pool.length]}?auto=format&fit=crop&w=1200&q=85`)
}));
let activeServiceIndex = 0;
let activeServiceImageIndex = 0;
let serviceDialogReturnFocus = null;
let lastAnantaServiceIndex = null;
let lastAnantaContext = null;
let lastAnantaCatalogAction = null;
let anantaDiscovery = null;
let lastAnantaCatalog = null;

function getServiceGroup(category) {
  const groups = {
    Software: ["SOFTWARE", "EXPERIENCE", "CONNECTIVITY", "ON THE MOVE", "KNOWLEDGE", "INCLUSIVE DESIGN", "CUSTOMER SYSTEMS", "BUSINESS SYSTEMS", "FINANCE OPERATIONS", "CUSTOMER EXPERIENCE", "SCHEDULING", "DOCUMENT WORKFLOWS", "SYSTEM CONNECTIVITY", "DATA OPERATIONS", "PROCESS DESIGN", "FIELD SOFTWARE", "PRODUCT STRATEGY"],
    "AI & Data": ["INTELLIGENCE", "PERCEPTION", "ANALYTICS", "AUTOMATION", "PRODUCTIVITY", "HUMAN-CENTERED AI", "ON-DEVICE COMPUTING", "AI ASSURANCE", "PRIVACY ENGINEERING", "REPORTING"],
    "Robotics & Field": ["AERIAL SYSTEMS", "SIMULATION", "CONNECTED SPACES", "MAPPING", "ENVIRONMENT"],
    "Security & Reliability": ["AWARENESS", "RESILIENCE", "RELIABILITY", "IDENTITY", "CONTINUITY", "ACCESSIBILITY", "TEST ENGINEERING"],
    "Product & R&D": ["PROTOTYPING", "EXPLORATION", "INFRASTRUCTURE", "STRATEGY", "CLOUD TRANSITION"]
  };
  return Object.entries(groups).find(([, categories]) => categories.includes(category))?.[0] ?? "Software";
}

document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#service-total-count").textContent = String(serviceCatalog.length);
document.querySelector("#chat-service-count").textContent = String(serviceCatalog.length);

function renderServiceCatalog() {
  const groups = ["All", ...new Set(serviceCatalog.map((service) => service.group))];
  const filterFragment = document.createDocumentFragment();
  groups.forEach((group) => {
    const filter = document.createElement("button");
    filter.type = "button";
    filter.className = `service-filter${group === "All" ? " is-active" : ""}`;
    filter.dataset.filter = group;
    filter.dataset.serviceGroup = group;
    filter.setAttribute("aria-pressed", String(group === "All"));
    filter.textContent = group === "All" ? "All services" : group;
    const count = document.createElement("span");
    count.textContent = String(group === "All" ? serviceCatalog.length : serviceCatalog.filter((service) => service.group === group).length);
    filter.append(count);
    filterFragment.append(filter);
  });
  serviceFilters.replaceChildren(filterFragment);
  updateServiceCards();
}

function updateServiceCards() {
  const activeFilter = serviceFilters.querySelector(".is-active")?.dataset.filter ?? "All";
  const query = serviceSearch.value.trim().toLowerCase();
  const visibleServices = serviceCatalog
    .map((service, index) => ({ service, index }))
    .filter(({ service }) => (activeFilter === "All" || service.group === activeFilter)
      && `${service.title} ${service.category} ${service.summary} ${service.detail}`.toLowerCase().includes(query));
  const fragment = document.createDocumentFragment();
  visibleServices.forEach(({ service, index }) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "service-card";
    card.dataset.serviceIndex = String(index);
    card.dataset.serviceGroup = service.group;
    const groupHue = {
      Software: 145,
      "AI & Data": 185,
      "Robotics & Field": 78,
      "Security & Reliability": 218,
      "Product & R&D": 285
    }[service.group] ?? 145;
    const hueVariation = (index * 137.508) % 360;
    card.style.setProperty("--service-hue", String((groupHue + hueVariation) % 360));
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", `Learn about ${service.title}`);

    const photo = document.createElement("img");
    photo.className = "service-card-photo";
    const initialImageIndex = index % service.images.length;
    photo.src = service.images[initialImageIndex];
    photo.alt = "";
    photo.loading = "lazy";
    photo.addEventListener("error", () => { photo.src = fallbackImage; });
    registerOptionBackground(card, photo, service.images, initialImageIndex);
    const label = document.createElement("span");
    label.className = "service-index mono";
    label.textContent = `${String(index + 1).padStart(2, "0")} / ${service.category}`;
    const icon = document.createElement("span");
    icon.className = "service-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = service.icon;
    const title = document.createElement("span");
    title.className = "service-card-title";
    title.textContent = service.title;
    const summary = document.createElement("span");
    summary.className = "service-card-summary";
    summary.textContent = service.summary;
    const more = document.createElement("span");
    more.className = "service-card-more mono";
    more.textContent = "EXPLORE SERVICE ↗";
    card.append(photo, label, icon, title, summary, more);
    fragment.append(card);
  });
  if (!visibleServices.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "service-empty-state";
    emptyState.textContent = "No services match that search. Try another term or choose a different category.";
    fragment.append(emptyState);
  }
  serviceGrid.replaceChildren(fragment);
  catalogResultCount.textContent = `${visibleServices.length} OF ${serviceCatalog.length} SERVICES`;
}

function showService(index) {
  activeServiceIndex = (index + serviceCatalog.length) % serviceCatalog.length;
  activeServiceImageIndex = 0;
  const service = serviceCatalog[activeServiceIndex];
  serviceDialogCategory.textContent = `${service.category} — GOLDSMITH SERVICES`;
  serviceDialogTitle.textContent = service.title;
  serviceDialogSummary.textContent = service.summary;
  serviceDialogDetail.textContent = service.detail;
  serviceDialogCta.dataset.service = service.title;
  setCatalogDialogBackground(serviceDialog, service.images);
  showServiceImage();
}

function showServiceImage() {
  const service = serviceCatalog[activeServiceIndex];
  serviceDialogImage.src = service.images[activeServiceImageIndex];
  serviceDialogImage.alt = `${service.title}: illustrative concept photo ${activeServiceImageIndex + 1} of ${service.images.length}. ${service.summary}`;
  serviceDialogCounter.textContent = `${String(activeServiceIndex + 1).padStart(2, "0")} / ${String(serviceCatalog.length).padStart(2, "0")}`;
  serviceDialogImageCaption.textContent = `${service.category} / VIEW ${String(activeServiceImageIndex + 1).padStart(2, "0")} OF ${String(service.images.length).padStart(2, "0")}`;
}

function moveServiceImage(direction) {
  const imageCount = serviceCatalog[activeServiceIndex].images.length;
  activeServiceImageIndex = (activeServiceImageIndex + direction + imageCount) % imageCount;
  showServiceImage();
}

function openService(index, trigger) {
  serviceDialogReturnFocus = trigger;
  showService(index);
  showDialogWithoutPageScroll(serviceDialog, document.querySelector("#service-dialog-close"));
}

function moveService(direction) {
  showService(activeServiceIndex + direction);
}

renderServiceCatalog();
const serviceFinderRecommendations = {
  software: ["Custom software", "System integration"],
  ai: ["Applied AI", "Data insights"],
  vision: ["Computer vision", "Privacy-aware computer vision"],
  security: ["Security systems", "Cybersecurity reviews"],
  iot: ["System integration", "Environmental sensing"],
  research: ["Research prototyping", "Technology consulting"]
};
document.querySelector("#service-finder-submit").addEventListener("click", (event) => {
  const trigger = event.currentTarget;
  const goal = document.querySelector("#service-finder-goal").value;
  const result = document.querySelector("#service-finder-result");
  result.replaceChildren();
  if (!goal) {
    result.textContent = "Choose a goal first to see a starting suggestion.";
    return;
  }
  const matches = (serviceFinderRecommendations[goal] ?? [])
    .map((title) => serviceCatalog.findIndex((service) => service.title === title))
    .filter((index) => index >= 0);
  if (!matches.length) {
    result.textContent = "No matching suggestion is available. You can describe your project in the contact form.";
    return;
  }
  const intro = document.createElement("p");
  intro.textContent = "A possible starting point (not a confirmed scope):";
  result.append(intro);
  matches.forEach((serviceIndex) => {
    const service = serviceCatalog[serviceIndex];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "service-finder-result-link";
    button.textContent = `${service.title} — ${service.summary}`;
    button.addEventListener("click", () => openService(serviceIndex, trigger));
    result.append(button);
  });
});
document.querySelector("#capability-download").addEventListener("click", () => {
  const serviceNames = serviceCatalog.map((service) => `- ${service.title}`).join("\n");
  const summary = [
    "GOLDSMITH — CAPABILITIES OVERVIEW",
    "",
    "Goldsmith explores custom software, applied AI, security-minded systems, and responsible technology concepts.",
    "",
    "Technology areas include Java, PHP, Python, web platforms, applied AI, connected systems, and prototyping. Final technology choices depend on requirements and feasibility.",
    "",
    "SERVICE AREAS",
    serviceNames,
    "",
    "HOW A PROJECT STARTS",
    "1. Discuss the problem, users, constraints, and desired outcome.",
    "2. Review feasibility, assumptions, and risks.",
    "3. Agree deliverables, responsibilities, milestones, and a project-specific estimate.",
    "4. Build and review work through agreed checkpoints.",
    "",
    "Service descriptions are illustrative. This overview is not a quote, delivery commitment, or confirmation of availability.",
    "Contact: services@goldsmith.gold.in"
  ].join("\n");
  downloadTextFile("goldsmith-capabilities-overview.txt", summary);
});
const techStackExplanations = {
  Java: "A possible fit for backend services, business applications, and systems where the project calls for a strongly structured ecosystem.",
  PHP: "A possible fit for server-rendered websites, content-focused platforms, and web application backends.",
  Python: "A possible fit for automation, data work, AI prototypes, and backend services when the technical requirements support it.",
  "Web platforms": "A broad area covering user-facing websites and web applications; the exact frontend and backend stack is selected per project.",
  "Applied AI": "An exploratory capability area: define the use case, data readiness, evaluation, privacy safeguards, and human review before choosing models.",
  "IoT concepts": "Connected-device concepts require project-specific checks for power, communications, sensors, security, and environmental conditions."
};
document.querySelector("#capability-tags").addEventListener("click", (event) => {
  const button = event.target.closest("[data-tech]");
  if (!button) return;
  document.querySelectorAll("#capability-tags [data-tech]").forEach((tag) => {
    const active = tag === button;
    tag.classList.toggle("is-active", active);
    tag.setAttribute("aria-pressed", String(active));
  });
  document.querySelector("#tech-stack-detail").textContent = techStackExplanations[button.dataset.tech];
});
const systemMapDetails = {
  core: "The application coordinates the user experience, business rules, integrations, and data flows.",
  users: "People define the needs, permissions, and review points. Workflows should fit their real tasks.",
  data: "Data sources, storage, quality, access, retention, and backups need project-specific design.",
  ai: "AI may support a bounded task. Outputs require evaluation, visible limits, and appropriate human review.",
  devices: "Sensors and devices introduce hardware, connectivity, calibration, power, and environmental constraints.",
  cloud: "Hosting and operations cover deployment, monitoring, recovery, updates, and resource planning.",
  security: "Privacy and access safeguards should be considered across the whole system, not bolted on at the end."
};
document.querySelector(".system-map").addEventListener("click", (event) => {
  const node = event.target.closest("[data-system-node]");
  if (!node) return;
  document.querySelectorAll("[data-system-node]").forEach((item) => {
    const active = item === node;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  document.querySelector("#system-map-detail").textContent = systemMapDetails[node.dataset.systemNode];
});
document.querySelector(".service-orbit").addEventListener("click", (event) => {
  const node = event.target.closest("[data-orbit-service]");
  if (!node) return;
  const index = serviceCatalog.findIndex((service) => service.title === node.dataset.orbitService);
  if (index >= 0) openService(index, node);
});
const workflowExamples = {
  support: {
    before: ["Request arrives in different channels", "Someone copies details into a tracker", "Ownership and next action are easy to miss"],
    after: ["Capture a request in one agreed intake", "Suggest a category and route for human review", "Track owner, status, and next action"]
  },
  documents: {
    before: ["Documents arrive across shared folders", "A reviewer searches for the latest version", "Approvals and follow-up are tracked separately"],
    after: ["Collect documents into an agreed workspace", "Assist search and flag versions for reviewer confirmation", "Record approval and preserve an audit trail"]
  },
  inventory: {
    before: ["Updates arrive through manual handoffs", "Stock counts are reconciled periodically", "Exceptions may be noticed late"],
    after: ["Capture changes through a defined workflow", "Show stock changes against agreed thresholds", "Flag exceptions for a person to verify"]
  }
};
function renderWorkflowDemo() {
  const example = workflowExamples[document.querySelector("#workflow-demo-select").value];
  for (const [id, steps] of [["workflow-before", example.before], ["workflow-after", example.after]]) {
    const list = document.querySelector(`#${id}`);
    list.replaceChildren(...steps.map((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      return item;
    }));
  }
}
document.querySelector("#workflow-demo-select").addEventListener("change", renderWorkflowDemo);
renderWorkflowDemo();
const dashboardSamples = {
  support: { records: "1,240", recordsBar: 72, reviewed: "86%", reviewedBar: 86, open: "18", openBar: 28 },
  iot: { records: "640", recordsBar: 45, reviewed: "92%", reviewedBar: 92, open: "7", openBar: 16 },
  quality: { records: "318", recordsBar: 34, reviewed: "78%", reviewedBar: 78, open: "24", openBar: 43 }
};
function renderDashboardSample() {
  const sample = dashboardSamples[document.querySelector("#dashboard-sample").value];
  document.querySelector("#metric-records").textContent = sample.records;
  document.querySelector("#metric-reviewed").textContent = sample.reviewed;
  document.querySelector("#metric-open").textContent = sample.open;
  document.querySelector("#metric-records-bar").style.width = `${sample.recordsBar}%`;
  document.querySelector("#metric-reviewed-bar").style.width = `${sample.reviewedBar}%`;
  document.querySelector("#metric-open-bar").style.width = `${sample.openBar}%`;
}
document.querySelector("#dashboard-sample").addEventListener("change", renderDashboardSample);
renderDashboardSample();
const serviceCompareA = document.querySelector("#service-compare-a");
const serviceCompareB = document.querySelector("#service-compare-b");
serviceCatalog.forEach((service, index) => {
  for (const select of [serviceCompareA, serviceCompareB]) {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = service.title;
    select.append(option);
  }
});
serviceCompareB.value = String(Math.min(1, serviceCatalog.length - 1));
function renderServiceComparison() {
  const compared = [serviceCompareA, serviceCompareB].map((select) => serviceCatalog[Number(select.value)]);
  const output = document.querySelector("#service-compare-output");
  output.replaceChildren();
  const table = document.createElement("div");
  table.className = "service-compare-table";
  const rows = [
    ["Area", (service) => service.group],
    ["Focus", (service) => service.summary],
    ["Planning considerations", (service) => service.detail]
  ];
  const headings = document.createElement("div");
  headings.className = "service-compare-row service-compare-headings";
  const emptyHead = document.createElement("span");
  emptyHead.textContent = "COMPARE";
  headings.append(emptyHead);
  compared.forEach((service) => {
    const heading = document.createElement("strong");
    heading.textContent = service.title;
    headings.append(heading);
  });
  table.append(headings);
  rows.forEach(([label, getValue]) => {
    const row = document.createElement("div");
    row.className = "service-compare-row";
    const name = document.createElement("strong");
    name.textContent = label;
    row.append(name);
    compared.forEach((service) => {
      const value = document.createElement("p");
      value.textContent = getValue(service);
      row.append(value);
    });
    table.append(row);
  });
  output.append(table);
}
serviceCompareA.addEventListener("change", renderServiceComparison);
serviceCompareB.addEventListener("change", renderServiceComparison);
renderServiceComparison();
serviceFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  serviceFilters.querySelectorAll("[data-filter]").forEach((filter) => {
    const isActive = filter === button;
    filter.classList.toggle("is-active", isActive);
    filter.setAttribute("aria-pressed", String(isActive));
  });
  updateServiceCards();
});
serviceSearch.addEventListener("input", updateServiceCards);
serviceGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-service-index]");
  if (card) openService(Number(card.dataset.serviceIndex), card);
});
document.querySelector(".tech-list").addEventListener("click", (event) => {
  const tool = event.target.closest("[data-workshop-service]");
  if (!tool) return;
  const serviceIndex = serviceCatalog.findIndex((service) => service.title === tool.dataset.workshopService);
  if (serviceIndex >= 0) openService(serviceIndex, tool);
});
document.querySelector("#service-dialog-close").addEventListener("click", () => serviceDialog.close());
document.querySelector("#service-prev").addEventListener("click", () => moveService(-1));
document.querySelector("#service-next").addEventListener("click", () => moveService(1));
document.querySelector("#service-image-prev").addEventListener("click", () => moveServiceImage(-1));
document.querySelector("#service-image-next").addEventListener("click", () => moveServiceImage(1));
serviceDialog.addEventListener("click", (event) => {
  if (event.target === serviceDialog) serviceDialog.close();
});
serviceDialog.addEventListener("close", () => {
  serviceDialogReturnFocus?.focus();
});
serviceDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveService(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    moveService(1);
  }
});
let serviceTouchStartX = null;
document.querySelector(".service-dialog-image").addEventListener("touchstart", (event) => {
  serviceTouchStartX = event.changedTouches[0].clientX;
}, { passive: true });
document.querySelector(".service-dialog-image").addEventListener("touchend", (event) => {
  if (serviceTouchStartX === null) return;
  const delta = event.changedTouches[0].clientX - serviceTouchStartX;
  if (Math.abs(delta) > 55) moveServiceImage(delta < 0 ? 1 : -1);
  serviceTouchStartX = null;
}, { passive: true });

function startProjectInquiry(itemTitle, serviceTitle, itemType) {
  const serviceSelect = document.querySelector("#contact-service");
  const service = serviceCatalog.find((item) => item.title === serviceTitle);
  const category = service?.group ?? "";
  const normalizedTitle = serviceTitle.toLowerCase();
  const preferredOption = normalizedTitle.includes("drone") || normalizedTitle.includes("robot")
    ? "AI-assisted drones"
    : normalizedTitle.includes("ai") || normalizedTitle.includes("vision")
      ? "Applied AI / computer vision"
      : normalizedTitle.includes("security") || normalizedTitle.includes("cyber")
        ? "Security systems"
        : normalizedTitle.includes("r&d") || normalizedTitle.includes("research") || normalizedTitle.includes("prototype")
          ? "R&D collaboration"
          : normalizedTitle.includes("workflow")
            ? "Intelligent workflows"
            : category === "AI & Data"
              ? "Applied AI / computer vision"
              : category === "Security & Reliability"
                ? "Security systems"
                : category === "Robotics & Field"
                  ? "AI-assisted drones"
                  : category === "Product & R&D"
                    ? "R&D collaboration"
                    : category === "Software"
                      ? "Custom software"
                      : "Something else";
  serviceSelect.value = preferredOption;

  const contactMessage = document.querySelector("#contact-message");
  const inquiry = `I'm interested in the ${itemType}: ${itemTitle}.\nRelated area: ${serviceTitle}.\nPlease advise on scope, feasibility, pricing, availability, and next steps.`;
  if (!contactMessage.value.trim()) contactMessage.value = inquiry;
  else if (!contactMessage.value.includes(itemTitle)) contactMessage.value = `${contactMessage.value.trim()}\n\n${inquiry}`;

  document.querySelector("#contact").scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
  window.setTimeout(() => document.querySelector("#contact-name").focus(), 350);
}

serviceDialogCta.addEventListener("click", (event) => {
  event.preventDefault();
  const serviceTitle = serviceDialogCta.dataset.service;
  serviceDialog.close();
  startProjectInquiry(serviceTitle, serviceTitle, "service");
});

const galleryDialog = document.querySelector("#gallery-dialog");
const galleryImage = document.querySelector("#gallery-image");
const galleryCaption = document.querySelector("#gallery-caption");
const galleryCount = document.querySelector("#gallery-count");
const galleryThumbnails = document.querySelector("#gallery-thumbnails");
const galleryCategory = document.querySelector("#gallery-category");
const gallerySearch = document.querySelector("#gallery-search");
const galleryResults = document.querySelector("#gallery-results");
const galleryFigure = document.querySelector("#gallery-figure");
const galleryEmpty = document.querySelector("#gallery-empty");
const galleryPrevious = document.querySelector("#gallery-prev");
const galleryNext = document.querySelector("#gallery-next");
const serviceGallery = serviceCatalog.flatMap((service, serviceIndex) => service.images.map((image, imageIndex) => ({
  image,
  title: service.title,
  category: service.category,
  group: service.group,
  serviceIndex,
  imageIndex
}))).slice(0, 101);
let visibleGallery = serviceGallery;
let activeGalleryIndex = 0;
let galleryReturnFocus = null;

serviceCatalog.map((service) => service.group).filter((group, index, groups) => groups.indexOf(group) === index).forEach((group) => {
  const option = document.createElement("option");
  option.value = group;
  option.textContent = group;
  galleryCategory.append(option);
});
document.querySelector("#gallery-total").textContent = String(serviceGallery.length);
document.querySelector("#gallery-nav-count").textContent = String(serviceGallery.length);

function showGalleryImage(index) {
  if (!visibleGallery.length) {
    galleryFigure.hidden = true;
    galleryPrevious.disabled = true;
    galleryNext.disabled = true;
    galleryEmpty.hidden = false;
    galleryResults.textContent = "0 visuals";
    galleryThumbnails.replaceChildren();
    return;
  }
  activeGalleryIndex = (index + visibleGallery.length) % visibleGallery.length;
  const image = visibleGallery[activeGalleryIndex];
  galleryFigure.hidden = false;
  galleryPrevious.disabled = false;
  galleryNext.disabled = false;
  galleryEmpty.hidden = true;
  galleryImage.src = image.image;
  const service = serviceCatalog[image.serviceIndex];
  galleryImage.alt = `${image.title}: illustrative ${image.group} photo ${image.imageIndex + 1} of ${service.images.length}. ${service.summary}`;
  galleryCaption.textContent = `${image.title} · ${image.group} · Photo ${image.imageIndex + 1} of ${service.images.length}`;
  galleryCount.textContent = `${String(activeGalleryIndex + 1).padStart(2, "0")} / ${String(visibleGallery.length).padStart(2, "0")}`;
  galleryResults.textContent = `${visibleGallery.length} ${visibleGallery.length === 1 ? "visual" : "visuals"}`;
  galleryThumbnails.querySelectorAll("[data-gallery-index]").forEach((thumbnail) => {
    const active = Number(thumbnail.dataset.galleryIndex) === activeGalleryIndex;
    thumbnail.classList.toggle("is-active", active);
    thumbnail.setAttribute("aria-current", String(active));
    if (active && galleryDialog.open) thumbnail.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
}

function renderGalleryThumbnails() {
  const category = galleryCategory.value;
  const query = gallerySearch.value.trim().toLowerCase();
  visibleGallery = serviceGallery.filter((image) =>
    (category === "All" || image.group === category)
    && `${image.title} ${image.category} ${image.group} ${serviceCatalog[image.serviceIndex].summary} ${serviceCatalog[image.serviceIndex].detail}`.toLowerCase().includes(query));
  activeGalleryIndex = 0;
  const fragment = document.createDocumentFragment();
  visibleGallery.forEach((image, index) => {
    const thumbnail = document.createElement("button");
    thumbnail.type = "button";
    thumbnail.className = "gallery-thumbnail";
    thumbnail.dataset.galleryIndex = String(index);
    thumbnail.setAttribute("aria-label", `View ${image.group} visual ${index + 1} of ${visibleGallery.length}: ${image.title}`);
    const photo = document.createElement("img");
    photo.src = image.image.replace("w=1200", "w=280");
    photo.alt = "";
    photo.loading = "lazy";
    photo.addEventListener("error", () => { photo.src = fallbackImage; }, { once: true });
    const label = document.createElement("span");
    label.textContent = `${String(index + 1).padStart(3, "0")} · ${image.title}`;
    thumbnail.append(photo, label);
    fragment.append(thumbnail);
  });
  galleryThumbnails.replaceChildren(fragment);
  showGalleryImage(0);
}

galleryCategory.addEventListener("change", renderGalleryThumbnails);
gallerySearch.addEventListener("input", renderGalleryThumbnails);
renderGalleryThumbnails();
galleryImage.addEventListener("error", () => { galleryImage.src = fallbackImage; });
document.querySelector("#gallery-open").addEventListener("click", (event) => {
  galleryReturnFocus = event.currentTarget;
  showGalleryImage(activeGalleryIndex);
  showDialogWithoutPageScroll(galleryDialog, document.querySelector("#gallery-next"));
});
galleryPrevious.addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
galleryNext.addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));
galleryThumbnails.addEventListener("click", (event) => {
  const thumbnail = event.target.closest("[data-gallery-index]");
  if (thumbnail) showGalleryImage(Number(thumbnail.dataset.galleryIndex));
});
galleryDialog.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLElement && event.target.matches("input, select, textarea")) return;
  if (event.key === "ArrowLeft") { event.preventDefault(); showGalleryImage(activeGalleryIndex - 1); }
  if (event.key === "ArrowRight") { event.preventDefault(); showGalleryImage(activeGalleryIndex + 1); }
});
galleryDialog.addEventListener("close", () => galleryReturnFocus?.focus());

const droneConcepts = [
  {
    id: "survey",
    name: "GS-A02 · Survey",
    use: "Supervised site mapping",
    description: "A non-weaponized quadcopter concept for operator-led site surveys and mapping.",
    image: "assets/inspection-drone.svg",
    imageAlt: "Illustrated civilian survey drone concept with a camera and no payload",
    serviceTitle: "AI-assisted drones",
    group: "Robotics & Field"
  },
  {
    id: "inspect",
    name: "GS-A03 · Inspect",
    use: "Infrastructure inspection",
    description: "A human-operated aerial inspection concept for documenting hard-to-reach structures.",
    image: "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=960&q=85",
    imageAlt: "Illustrative quadcopter drone in flight for supervised infrastructure inspection",
    serviceTitle: "AI-assisted drones",
    group: "Robotics & Field"
  },
  {
    id: "eco",
    name: "GS-A04 · Eco",
    use: "Environmental observation",
    description: "A research concept for operator-reviewed environmental observations and field surveys.",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=960&q=85",
    imageAlt: "Illustrative drone above a landscape for supervised environmental observation",
    serviceTitle: "AI-assisted drones",
    group: "Robotics & Field"
  }
];
const hardwareSuggestions = [
  { id: "iot-esp32", name: "ESP32 development board", group: "IoT hardware", use: "Controller · Wi-Fi / Bluetooth", description: "A compact microcontroller option for connected sensors and small control projects. Check pin count, voltage levels, and radio requirements.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=960&q=85", serviceTitle: "Research prototyping" },
  { id: "iot-arduino", name: "Arduino-compatible board", group: "IoT hardware", use: "Controller · entry-level prototyping", description: "A straightforward controller for learning, sensor tests, and simple deterministic prototypes. Select a model to match your I/O and power needs.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=960&q=85", serviceTitle: "Research prototyping" },
  { id: "iot-pi-gateway", name: "Raspberry Pi-class gateway", group: "IoT hardware", use: "Edge computer · local gateway", description: "A small computer concept for collecting device data, running a local dashboard, or bridging supported networks.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=960&q=85", serviceTitle: "Edge AI concepts" },
  { id: "iot-temp-humidity", name: "Temperature & humidity sensor", group: "IoT hardware", use: "Sensor · indoor environment", description: "Measures ambient temperature and relative humidity for room monitoring or environmental logging.", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=960&q=85", serviceTitle: "Environmental sensing" },
  { id: "iot-air-quality", name: "Air-quality sensor module", group: "IoT hardware", use: "Sensor · environmental readings", description: "A sensor-module category for a defined air-quality project. Verify what it measures, calibration needs, and limitations before relying on readings.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=960&q=85", serviceTitle: "Environmental sensing" },
  { id: "iot-motion-light", name: "Motion & ambient-light sensors", group: "IoT hardware", use: "Sensors · presence / light", description: "Common inputs for occupancy-aware lighting and basic room-state prototypes; choose privacy-respecting use and suitable sensor ranges.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=960&q=85", serviceTitle: "Smart facilities" },
  { id: "iot-vibration", name: "Vibration sensor", group: "IoT hardware", use: "Sensor · equipment condition", description: "A simple vibration input for prototype condition monitoring. It is not a substitute for calibrated industrial diagnostics.", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=960&q=85", serviceTitle: "Predictive maintenance" },
  { id: "iot-water-soil", name: "Water-leak & soil-moisture sensors", group: "IoT hardware", use: "Sensors · moisture detection", description: "Probe or contact-sensor options for leak alerts, irrigation experiments, and basic moisture observation.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=960&q=85", serviceTitle: "Environmental sensing" },
  { id: "iot-gps", name: "GNSS / GPS receiver module", group: "IoT hardware", use: "Positioning · outdoor devices", description: "Adds approximate outdoor position and time data to a field device; accuracy varies with receiver, antenna, sky view, and environment.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=960&q=85", serviceTitle: "Geospatial mapping" },
  { id: "iot-radio", name: "Connectivity modules", group: "IoT hardware", use: "Connectivity · Wi-Fi / BLE / LoRa / cellular", description: "Choose a radio module based on range, throughput, power, coverage, spectrum rules, and the project's data needs.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=960&q=85", serviceTitle: "System integration" },
  { id: "iot-actuator", name: "Relay, servo & buzzer modules", group: "IoT hardware", use: "Outputs · basic actuation / alerts", description: "Low-voltage prototype outputs for indicators, simple movement, or switching suitable loads with correctly rated drivers.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=960&q=85", serviceTitle: "Intelligent workflows" },
  { id: "iot-power", name: "Regulated power supply & converters", group: "IoT hardware", use: "Power · regulation / conversion", description: "A stable supply and appropriately rated voltage regulators help protect boards and sensors. Confirm current, voltage, and thermal requirements.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=960&q=85", serviceTitle: "Research prototyping" },
  { id: "iot-proto-board", name: "Breadboard & custom PCB", group: "IoT hardware", use: "Assembly · prototype to board", description: "Use a breadboard for early tests and consider a custom PCB once the circuit and connectors are validated.", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=960&q=85", serviceTitle: "Research prototyping" },
  { id: "iot-wiring", name: "Jumper wires & connectors", group: "IoT hardware", use: "Assembly · interconnects", description: "Match connector type, wire gauge, current, and environmental rating to the project; secure wiring for field use.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=960&q=85", serviceTitle: "System integration" },
  { id: "iot-level-shift", name: "Resistors & logic-level shifters", group: "IoT hardware", use: "Circuit support · signal compatibility", description: "Basic passive parts and level-shifting circuits help interface signals safely when voltage logic differs.", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=960&q=85", serviceTitle: "Research prototyping" },
  { id: "iot-enclosure", name: "Project enclosure", group: "IoT hardware", use: "Protection · housing", description: "An enclosure protects electronics from handling and environment; select material, ventilation, and ingress protection for the actual conditions.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=960&q=85", serviceTitle: "Smart facilities" },
  { id: "iot-fuse", name: "Fuse & circuit protection", group: "IoT hardware", use: "Safety · overcurrent protection", description: "Appropriately selected fuses and protection components help limit damage from faults; sizing should be reviewed for the specific circuit.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=960&q=85", serviceTitle: "Quality engineering" },
  { id: "iot-rs485", name: "RS-485 / Modbus interface", group: "IoT hardware", use: "Interface · wired industrial sensors", description: "A transceiver/interface concept for compatible wired sensor networks; check bus termination, isolation, wiring, and protocol settings.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=960&q=85", serviceTitle: "System integration" },
  { id: "iot-meter", name: "Current & voltage monitor", group: "IoT hardware", use: "Measurement · device power", description: "A monitoring module can help prototype power-use dashboards. Use correctly rated, isolated measurement hardware appropriate to the circuit.", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=960&q=85", serviceTitle: "Data insights" },
  { id: "iot-logger", name: "SD-card data logger", group: "IoT hardware", use: "Storage · local data capture", description: "Removable storage can record sensor readings when network access is limited; plan file integrity, retention, and data protection.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=960&q=85", serviceTitle: "Data insights" },
  { id: "iot-watchdog-rtc", name: "Watchdog & real-time clock", group: "IoT hardware", use: "Reliability · restart / timestamps", description: "A watchdog can help recover from a stuck prototype, while a real-time clock can maintain timestamps when network time is unavailable.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=960&q=85", serviceTitle: "Quality engineering" },
  { id: "iot-isolated-io", name: "Isolated I/O modules", group: "IoT hardware", use: "Interface · electrical isolation", description: "Isolation modules can help separate compatible control signals; choose appropriate ratings and design review for the application.", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=960&q=85", serviceTitle: "Security systems" },
  { id: "iot-weatherproof", name: "Weatherproof connectors & IP-rated case", group: "IoT hardware", use: "Field protection · ingress resistance", description: "Sealed connectors and enclosures are selected to match exposure, cable entry, and maintenance needs; an IP rating depends on the complete assembly.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=960&q=85", serviceTitle: "Smart facilities" },
  { id: "drone-frame", name: "Civilian multirotor frame", group: "Drone hardware", use: "Airframe · non-weaponized mapping", description: "A frame sized for a lawful, operator-controlled mapping or inspection prototype and its verified component load.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" },
  { id: "drone-motors-esc", name: "Brushless motors & ESCs", group: "Drone hardware", use: "Propulsion · matched components", description: "Motor and electronic speed controller selection must match the frame, propellers, battery, and manufacturer limits.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" },
  { id: "drone-props", name: "Propellers & spares", group: "Drone hardware", use: "Propulsion · matched replacement set", description: "Use the correct manufacturer-compatible propeller size and direction; keep suitable spares and inspect for damage before operation.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" },
  { id: "drone-controller", name: "Flight controller", group: "Drone hardware", use: "Control · operator-supervised flight", description: "A flight-controller category for stable, manual/operator-supervised flight with tested failsafe behavior.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" },
  { id: "drone-gnss", name: "GNSS receiver & compass", group: "Drone hardware", use: "Navigation · mapping position", description: "Positioning and heading components for mapping workflows; installation, interference, calibration, and local rules affect performance.", image: "assets/inspection-drone.svg", serviceTitle: "Geospatial mapping" },
  { id: "drone-radio", name: "Standard operator radio & receiver", group: "Drone hardware", use: "Control link · human-operated", description: "A compliant control link for a qualified human pilot, selected and configured under applicable radio and aviation requirements.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" },
  { id: "drone-telemetry", name: "Telemetry link", group: "Drone hardware", use: "Data link · status monitoring", description: "A status/telemetry link for permitted operational data. Range, frequency use, and configuration must comply with local rules.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" },
  { id: "drone-camera", name: "Inspection camera / mapping sensor", group: "Drone hardware", use: "Payload · civilian observation", description: "An operator-directed camera or mapping sensor selected for the intended survey and compatible with the airframe's verified payload limits.", image: "assets/inspection-drone.svg", serviceTitle: "Geospatial mapping" },
  { id: "drone-env-sensor", name: "Non-hazardous environmental sensor", group: "Drone hardware", use: "Payload · environmental observation", description: "A suitable sensor for benign environmental readings, with attention to weight, calibration, sampling, and safe handling.", image: "assets/inspection-drone.svg", serviceTitle: "Environmental sensing" },
  { id: "drone-power", name: "Flight battery & compatible charger", group: "Drone hardware", use: "Power · rated battery system", description: "Select a battery and charger approved for the aircraft and follow manufacturer instructions for charging, inspection, and storage.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" },
  { id: "drone-protection", name: "Propeller guards & status indicators", group: "Drone hardware", use: "Protection · visibility", description: "Guards may suit some training or indoor contexts; indicators help communicate system status. Neither replaces safe operating procedures.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" },
  { id: "drone-flow-distance", name: "Optical-flow & distance sensors", group: "Drone hardware", use: "Sensing · positioning assistance", description: "Sensors for testing position-hold assistance in appropriate environments; performance is conditional and requires controlled validation.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" },
  { id: "drone-gimbal", name: "Stabilized camera gimbal", group: "Drone hardware", use: "Imaging · stabilized inspection view", description: "A camera stabilizer for documenting civilian inspection or mapping work; verify compatibility, payload, and privacy needs.", image: "assets/inspection-drone.svg", serviceTitle: "Computer vision" },
  { id: "drone-correction", name: "GNSS correction base / service", group: "Drone hardware", use: "Mapping · higher-accuracy positioning", description: "A correction source can improve positioning in supported configurations; achieved accuracy depends on equipment, service, setup, and conditions.", image: "assets/inspection-drone.svg", serviceTitle: "Geospatial mapping" },
  { id: "drone-display", name: "Operator display & ground station", group: "Drone hardware", use: "Ground equipment · pilot awareness", description: "A screen or ground station for reviewing permitted flight status, imagery, and mission progress with the operator in control.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" },
  { id: "drone-planner", name: "Civilian mission-planning software", group: "Drone hardware", use: "Ground software · survey planning", description: "Planning software can organize lawful survey routes and data capture while preserving pilot oversight and required checks.", image: "assets/inspection-drone.svg", serviceTitle: "Custom software" },
  { id: "drone-mounts", name: "Vibration-isolating mounts", group: "Drone hardware", use: "Assembly · camera/sensor isolation", description: "Mounting components can reduce vibration transfer to compatible cameras or sensors; test the complete assembly safely.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" },
  { id: "drone-storage", name: "Maintenance kit & battery-safe storage", group: "Drone hardware", use: "Ground support · inspection / storage", description: "Basic maintenance tools, propeller spares, and manufacturer-recommended battery storage support responsible field operations.", image: "assets/inspection-drone.svg", serviceTitle: "AI-assisted drones" }
];
const productGrid = document.querySelector("#product-grid");
const serviceProducts = serviceCatalog.map((service, index) => ({
  id: `service-${index}`,
  name: service.title,
  use: `${service.group} · SERVICE CONCEPT`,
  description: `${service.summary} Illustrative product direction—not a ready-made offering.`,
  image: service.images[0],
  imageAlt: `Illustrative service concept image for ${service.title}`,
  serviceTitle: service.title,
  group: service.group,
  isServiceConcept: true
}));
const products = [
  ...serviceProducts,
  ...droneConcepts.map((product) => ({ ...product, isServiceConcept: false, isDroneConcept: true })),
  ...hardwareSuggestions.map((part) => ({ ...part, imageAlt: `Illustrative component visual for ${part.name}`, isServiceConcept: false, isDroneConcept: false, isHardware: true }))
];
const catalogProducts = products.filter((product) => !product.isHardware);
document.querySelector("#chat-product-count").textContent = String(catalogProducts.length);
document.querySelector("#chat-hardware-count").textContent = String(hardwareSuggestions.length);
let visibleProducts = products;
const productFilters = document.querySelector("#product-filters");
const productSearch = document.querySelector("#product-search");
const productResultCount = document.querySelector("#product-result-count");
const productScrollCount = document.querySelector("#product-scroll-count");
let activeProductFilter = "All";
const comparedProductIds = new Set();
const comparisonOutput = document.querySelector("#comparison-output");
const productDialog = document.querySelector("#product-dialog");
const productDialogImage = document.querySelector("#product-dialog-img");
const productDialogCounter = document.querySelector("#product-dialog-counter");
const productDialogImageCaption = document.querySelector("#product-dialog-image-caption");
const productDialogCategory = document.querySelector("#product-dialog-category");
const productDialogAvailability = document.querySelector("#product-dialog-availability");
const productDialogTitle = document.querySelector("#product-dialog-title");
const productDialogSummary = document.querySelector("#product-dialog-summary");
const productDialogDetail = document.querySelector("#product-dialog-detail");
const productDialogGuide = document.querySelector("#product-dialog-guide");
const productDialogAdd = document.querySelector("#product-dialog-add");
const productDialogInquire = document.querySelector("#product-dialog-inquire");
const productDialogService = document.querySelector("#product-dialog-service");
let activeProductId = null;
let activeProductImageIndex = 0;
let activeProductImages = [];
let activeProductList = products;
let productDialogReturnFocus = null;

function renderComparison() {
  const selected = products.filter((product) => comparedProductIds.has(product.id));
  if (!selected.length) {
    const empty = document.createElement("p");
    empty.textContent = "Select a concept using its Compare checkbox to begin.";
    comparisonOutput.replaceChildren(empty);
    return;
  }
  const table = document.createElement("div");
  table.className = "comparison-table";
  selected.forEach((product) => {
    const column = document.createElement("article");
    column.className = "comparison-column";
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("error", () => { image.src = fallbackImage; });
    const title = document.createElement("h4");
    title.textContent = product.name;
    const type = document.createElement("span");
    type.className = "mono project-tag";
    type.textContent = product.isHardware ? "SUGGESTED COMPONENT" : "CONCEPT ONLY";
    const service = document.createElement("p");
    service.textContent = `Related area: ${product.serviceTitle}`;
    const detail = document.createElement("p");
    detail.textContent = product.description;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "comparison-remove";
    remove.dataset.removeComparison = product.id;
    remove.textContent = "Remove from comparison";
    column.append(image, type, title, service, detail, remove);
    table.append(column);
  });
  comparisonOutput.replaceChildren(table);
}

function renderProductFilters() {
  const groups = ["All", ...new Set(serviceCatalog.map((service) => service.group)), "Drone concepts", "IoT hardware", "Drone hardware"];
  const fragment = document.createDocumentFragment();
  groups.forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `product-filter${group === activeProductFilter ? " is-active" : ""}`;
    button.dataset.productFilter = group;
    button.setAttribute("aria-pressed", String(group === activeProductFilter));
    button.textContent = group;
    const count = group === "All"
      ? products.length
      : group === "Drone concepts"
        ? products.filter((product) => product.isDroneConcept).length
        : products.filter((product) => product.group === group).length;
    const countLabel = document.createElement("span");
    countLabel.textContent = String(count);
    button.append(countLabel);
    fragment.append(button);
  });
  productFilters.replaceChildren(fragment);
}

function renderProducts() {
  const query = productSearch.value.trim().toLowerCase();
  visibleProducts = products.filter((product) => {
    const matchesGroup = activeProductFilter === "All"
      || (activeProductFilter === "Drone concepts" ? product.isDroneConcept : product.group === activeProductFilter);
    const matchesQuery = `${product.name} ${product.use} ${product.description} ${product.serviceTitle}`.toLowerCase().includes(query);
    return matchesGroup && matchesQuery;
  });
  const fragment = document.createDocumentFragment();
  visibleProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.catalogProduct = product.id;
    card.tabIndex = 0;
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", `${product.name}. Press Enter or Space to view details.`);
    const photo = document.createElement("img");
    photo.src = product.image;
    photo.alt = "";
    photo.loading = "lazy";
    photo.addEventListener("error", () => { photo.src = fallbackImage; });
    const relatedService = serviceCatalog.find((service) => service.title === product.serviceTitle);
    registerOptionBackground(card, photo, [product.image, ...(relatedService?.images ?? [])]);
    const copy = document.createElement("div");
    copy.className = "product-copy";
    const label = document.createElement("span");
    label.className = "mono project-tag";
    label.textContent = product.use;
    const availability = document.createElement("span");
    availability.className = `product-availability mono ${product.isHardware ? "status-suggested" : "status-concept"}`;
    availability.textContent = product.isHardware ? "SUGGESTED PART · AVAILABILITY UNCONFIRMED" : "CONCEPT ONLY · NOT FOR SALE";
    const title = document.createElement("h3");
    title.textContent = product.name;
    const description = document.createElement("p");
    description.textContent = product.description;
    const actions = document.createElement("div");
    actions.className = "product-card-actions";
    const learn = document.createElement("button");
    learn.type = "button";
    learn.className = "product-learn";
    learn.dataset.viewService = String(serviceCatalog.findIndex((service) => service.title === product.serviceTitle));
    learn.textContent = "Related service details ↗";
    const details = document.createElement("button");
    details.type = "button";
    details.className = "product-learn";
    details.dataset.productDetails = product.id;
    details.setAttribute("aria-haspopup", "dialog");
    details.textContent = "View product details ↗";
    const add = document.createElement("button");
    add.type = "button";
    add.className = "button button-primary product-add";
    add.dataset.productId = product.id;
    add.dataset.defaultLabel = "Add to inquiry bag";
    add.textContent = add.dataset.defaultLabel;
    const compareLabel = document.createElement("label");
    compareLabel.className = "compare-choice";
    const compare = document.createElement("input");
    compare.type = "checkbox";
    compare.checked = comparedProductIds.has(product.id);
    compare.dataset.compareProduct = product.id;
    compare.setAttribute("aria-label", `Compare ${product.name}`);
    const compareText = document.createElement("span");
    compareText.textContent = "Compare";
    compareLabel.append(compare, compareText);
    actions.append(details, learn, compareLabel, add);
    copy.append(label, availability, title, description, actions);
    card.append(photo, copy);
    fragment.append(card);
  });
  if (!visibleProducts.length) {
    const empty = document.createElement("p");
    empty.className = "product-empty-state";
    empty.textContent = "No product concepts match that search. Try another term or choose a different category.";
    fragment.append(empty);
  }
  productGrid.replaceChildren(fragment);
  const resultLabel = `${visibleProducts.length} OF ${products.length} CONCEPTS`;
  productResultCount.textContent = resultLabel;
  productScrollCount.textContent = resultLabel;
}
let activeTiltCard = null;
productGrid.addEventListener("pointermove", (event) => {
  if (prefersReducedMotion.matches || event.pointerType !== "mouse") return;
  const card = event.target.closest(".product-card");
  if (!card) return;
  if (activeTiltCard && activeTiltCard !== card) {
    activeTiltCard.style.removeProperty("--card-tilt-x");
    activeTiltCard.style.removeProperty("--card-tilt-y");
  }
  activeTiltCard = card;
  const bounds = card.getBoundingClientRect();
  const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
  const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
  card.style.setProperty("--card-tilt-x", `${vertical * -5}deg`);
  card.style.setProperty("--card-tilt-y", `${horizontal * 5}deg`);
});
productGrid.addEventListener("pointerleave", () => {
  if (!activeTiltCard) return;
  activeTiltCard.style.removeProperty("--card-tilt-x");
  activeTiltCard.style.removeProperty("--card-tilt-y");
  activeTiltCard = null;
});

const selectedBomIds = new Set();
function renderHardwareGrid(container, group) {
  const fragment = document.createDocumentFragment();
  hardwareSuggestions.filter((part) => part.group === group).forEach((part, index) => {
    const card = document.createElement("article");
    card.className = "hardware-card";
    card.dataset.catalogProduct = part.id;
    card.tabIndex = 0;
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", `${part.name}. Press Enter or Space to view details.`);
    const photo = document.createElement("img");
    photo.className = "hardware-card-photo";
    const relatedService = serviceCatalog.find((service) => service.title === part.serviceTitle);
    photo.src = relatedService?.images[index % (relatedService.images.length || 1)] ?? part.image;
    photo.alt = "";
    photo.loading = "lazy";
    photo.addEventListener("error", () => { photo.src = fallbackImage; });
    registerOptionBackground(card, photo, [photo.src, ...(relatedService?.images ?? []), part.image]);
    const icon = document.createElement("span");
    icon.className = "hardware-card-icon mono";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = group === "IoT hardware" ? "⌘" : "⌁";
    const text = document.createElement("div");
    text.className = "hardware-card-copy";
    const label = document.createElement("span");
    label.className = "mono project-tag";
    label.textContent = part.use;
    const title = document.createElement("h4");
    title.textContent = part.name;
    const description = document.createElement("p");
    description.textContent = part.description;
    const serviceIndex = serviceCatalog.findIndex((service) => service.title === part.serviceTitle);
    const learn = document.createElement("button");
    learn.type = "button";
    learn.className = "product-learn";
    learn.dataset.viewService = String(serviceIndex);
    learn.textContent = "Related service details ↗";
    const details = document.createElement("button");
    details.type = "button";
    details.className = "product-learn";
    details.dataset.productDetails = part.id;
    details.setAttribute("aria-haspopup", "dialog");
    details.textContent = "View component details ↗";
    const bomLabel = document.createElement("label");
    bomLabel.className = "bom-choice";
    const bomCheckbox = document.createElement("input");
    bomCheckbox.type = "checkbox";
    bomCheckbox.checked = selectedBomIds.has(part.id);
    bomCheckbox.dataset.bomPart = part.id;
    bomCheckbox.setAttribute("aria-label", `Include ${part.name} in draft bill of materials`);
    const bomText = document.createElement("span");
    bomText.textContent = "Add to BOM";
    bomLabel.append(bomCheckbox, bomText);
    const add = document.createElement("button");
    add.type = "button";
    add.className = "hardware-add";
    add.dataset.productId = part.id;
    add.dataset.defaultLabel = "Add to inquiry bag ↗";
    add.textContent = add.dataset.defaultLabel;
    text.append(label, title, description, details, learn, bomLabel, add);
    card.append(photo, icon, text);
    fragment.append(card);
  });
  container.replaceChildren(fragment);
}

renderProductFilters();
renderProducts();
renderHardwareGrid(document.querySelector("#iot-hardware-grid"), "IoT hardware");
renderHardwareGrid(document.querySelector("#drone-hardware-grid"), "Drone hardware");
productFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-filter]");
  if (!button) return;
  activeProductFilter = button.dataset.productFilter;
  productFilters.querySelectorAll("[data-product-filter]").forEach((filter) => {
    const active = filter === button;
    filter.classList.toggle("is-active", active);
    filter.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
});
productSearch.addEventListener("input", renderProducts);
document.querySelector(".hardware-groups").addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-category]");
  if (!button) return;
  activeProductFilter = button.dataset.productCategory;
  productSearch.value = "";
  productFilters.querySelectorAll("[data-product-filter]").forEach((filter) => {
    const active = filter.dataset.productFilter === activeProductFilter;
    filter.classList.toggle("is-active", active);
    filter.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
  document.querySelector("#products").scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
  window.setTimeout(() => productGrid.focus(), 350);
});

const cartDialog = document.querySelector("#cart-dialog");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cart = new Map();
function renderCart() {
  const quantity = [...cart.values()].reduce((total, count) => total + count, 0);
  cartCount.textContent = String(quantity);
  cartCount.setAttribute("aria-label", `${quantity} concepts in inquiry bag`);
  if (!quantity) {
    const empty = document.createElement("p");
    empty.className = "cart-empty";
    empty.textContent = "Your inquiry bag is empty. Add a product or service concept to start a discussion.";
    cartItems.replaceChildren(empty);
    document.querySelector("#cart-inquiry").disabled = true;
    return;
  }
  const fragment = document.createDocumentFragment();
  cart.forEach((count, id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const row = document.createElement("div");
    row.className = "cart-row";
    const summary = document.createElement("span");
    summary.textContent = `${product.name} · ${count}`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.removeProduct = id;
    remove.setAttribute("aria-label", `Remove ${product.name} from inquiry bag`);
    remove.textContent = "Remove";
    row.append(summary, remove);
    fragment.append(row);
  });
  cartItems.replaceChildren(fragment);
  document.querySelector("#cart-inquiry").disabled = false;
}
renderCart();
function addProductToCart(productId) {
  if (!products.some((product) => product.id === productId)) return;
  cart.set(productId, (cart.get(productId) ?? 0) + 1);
  renderCart();
}

function showProductImage() {
  const product = products.find((item) => item.id === activeProductId);
  if (!product || !activeProductImages.length) return;
  delete productDialogImage.dataset.fallbackApplied;
  productDialogImage.src = activeProductImages[activeProductImageIndex];
  productDialogImage.alt = `${product.name}: illustrative photo ${activeProductImageIndex + 1} of ${activeProductImages.length}. ${product.description}`;
  productDialogCounter.textContent = `${String(activeProductImageIndex + 1).padStart(2, "0")} / ${String(activeProductImages.length).padStart(2, "0")}`;
  const productIndex = activeProductList.findIndex((item) => item.id === product.id);
  productDialogImageCaption.textContent = `PRODUCT ${String(productIndex + 1).padStart(2, "0")} OF ${String(activeProductList.length).padStart(2, "0")} / IMAGE ${String(activeProductImageIndex + 1).padStart(2, "0")}`;
}

function showProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  activeProductList = visibleProducts.some((item) => item.id === productId) ? visibleProducts : products;
  activeProductId = product.id;
  activeProductImageIndex = 0;
  const relatedService = serviceCatalog.find((service) => service.title === product.serviceTitle);
  activeProductImages = [...new Set([product.image, ...(relatedService?.images ?? [])])]
    .filter((image) => image.startsWith("https://images.unsplash.com/"));
  setCatalogDialogBackground(productDialog, activeProductImages);
  productDialogCategory.textContent = product.group ?? (product.isDroneConcept ? "DRONE CONCEPTS" : "PRODUCT CONCEPT");
  productDialogAvailability.textContent = product.isHardware
    ? "SUGGESTED PART · AVAILABILITY UNCONFIRMED"
    : "ILLUSTRATIVE CONCEPT · NOT FOR SALE";
  productDialogTitle.textContent = product.name;
  productDialogSummary.textContent = product.use;
  productDialogDetail.textContent = `${product.description} Related service: ${product.serviceTitle}.`;
  productDialogGuide.textContent = product.isHardware
    ? "For a useful quote request, include the required model/specifications, compatible system, quantity, delivery region, budget, and timeline. This is a suggested component; price and stock are unconfirmed."
    : product.isDroneConcept
      ? "For a feasibility discussion, include the civilian use case, operating location, operator requirements, desired sensors, budget, and timeline. This is a concept study, not a purchasable product."
      : "For a useful project estimate, include your goals, users, required features, existing data or integrations, budget range, and timeline. This is a service concept, not a ready-made product.";
  productDialogInquire.textContent = product.isHardware || product.isDroneConcept
    ? "Ask about price & availability ↗"
    : "Enquire about this concept ↗";
  productDialogAdd.textContent = "Add to inquiry bag ↗";
  productDialogService.dataset.viewService = String(serviceCatalog.findIndex((service) => service.title === product.serviceTitle));
  showProductImage();
}

function openProduct(productId, trigger) {
  productDialogReturnFocus = trigger;
  activeProductId = null;
  showProduct(productId);
  if (activeProductId) {
    showDialogWithoutPageScroll(productDialog, productDialog.querySelector("#product-dialog-close"));
  }
}

function moveProduct(direction) {
  const currentIndex = activeProductList.findIndex((product) => product.id === activeProductId);
  if (currentIndex < 0 || !activeProductList.length) return;
  const nextIndex = (currentIndex + direction + activeProductList.length) % activeProductList.length;
  showProduct(activeProductList[nextIndex].id);
}

function moveProductImage(direction) {
  if (!activeProductImages.length) return;
  activeProductImageIndex = (activeProductImageIndex + direction + activeProductImages.length) % activeProductImages.length;
  showProductImage();
}

function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function updateBomCount() {
  document.querySelector("#bom-count").textContent = `${selectedBomIds.size} component${selectedBomIds.size === 1 ? "" : "s"} selected`;
}

document.querySelector(".hardware-groups").addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-bom-part]");
  if (!checkbox) return;
  if (checkbox.checked) selectedBomIds.add(checkbox.dataset.bomPart);
  else selectedBomIds.delete(checkbox.dataset.bomPart);
  updateBomCount();
});
document.querySelector("#bom-clear").addEventListener("click", () => {
  selectedBomIds.clear();
  document.querySelectorAll("[data-bom-part]").forEach((checkbox) => { checkbox.checked = false; });
  updateBomCount();
});
document.querySelector("#bom-download").addEventListener("click", () => {
  const selected = hardwareSuggestions.filter((part) => selectedBomIds.has(part.id));
  if (!selected.length) {
    document.querySelector("#compatibility-result").textContent = "Select component checkboxes in the lists below before downloading a BOM.";
    return;
  }
  const rows = [["Component", "Category", "Role", "Related service", "Selection note"]];
  selected.forEach((part) => rows.push([part.name, part.group, part.use, part.serviceTitle, part.description]));
  const csv = rows.map((row) => row.map((field) => `"${String(field).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  downloadTextFile("goldsmith-draft-hardware-bom.csv", csv, "text/csv;charset=utf-8");
});
document.querySelector("#compat-system").addEventListener("change", (event) => {
  const guidance = {
    "Low-voltage IoT prototype": "Review controller and sensor logic levels, regulated supply voltage/current, interface support, connector pinout, and safe load switching.",
    "Outdoor IoT sensor node": "Also verify sensor operating range, enclosure and cable-entry ratings, condensation/heat management, antenna placement, and power budget.",
    "Civilian mapping drone concept": "Verify airframe, motor/ESC/propeller/battery compatibility, total mass and payload limits, control-link compliance, failsafes, pilot requirements, and local aviation rules."
  };
  document.querySelector("#compatibility-result").textContent = guidance[event.currentTarget.value];
});
document.querySelector("#iot-build").addEventListener("click", () => {
  const controller = document.querySelector("#iot-controller");
  const connectivity = document.querySelector("#iot-connectivity").value;
  const sensor = document.querySelector("#iot-sensor");
  const environment = document.querySelector("#iot-environment").value;
  const selectedIds = [controller.value, sensor.value, "iot-power", "iot-proto-board"];
  selectedIds.push(connectivity === "Wired RS-485 / Modbus" ? "iot-rs485" : "iot-radio");
  if (environment === "Outdoor / weather exposed") selectedIds.push("iot-weatherproof", "iot-fuse");
  if (environment === "Industrial / electrically noisy") selectedIds.push("iot-isolated-io", "iot-fuse");
  selectedIds.forEach((id) => selectedBomIds.add(id));
  document.querySelectorAll("[data-bom-part]").forEach((checkbox) => {
    checkbox.checked = selectedBomIds.has(checkbox.dataset.bomPart);
  });
  updateBomCount();
  const result = document.querySelector("#iot-builder-result");
  result.replaceChildren();
  const summary = document.createElement("p");
  const shortlist = [...new Set(selectedIds)].map((id) => hardwareSuggestions.find((part) => part.id === id)?.name).filter(Boolean);
  summary.textContent = `Configuration: ${controller.selectedOptions[0].textContent}; ${document.querySelector("#iot-connectivity").selectedOptions[0].textContent}; ${sensor.selectedOptions[0].textContent}; ${environment}. Starter shortlist: ${shortlist.join(", ")}.`;
  const caution = document.createElement("p");
  caution.textContent = "Verify power budget, logic levels, supported interfaces, sensor calibration, enclosure/environment ratings, and applicable radio/safety requirements. This is not a validated wiring plan.";
  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "text-link";
  addButton.textContent = "Add shortlist to inquiry bag ↗";
  addButton.addEventListener("click", () => {
    [...new Set(selectedIds)].forEach(addProductToCart);
    addButton.textContent = "Shortlist added to inquiry bag ✓";
  });
  result.append(summary, caution, addButton);
});

let latestSurveyBrief = "";
document.querySelector("#survey-build").addEventListener("click", () => {
  const purpose = document.querySelector("#survey-purpose").value;
  const siteType = document.querySelector("#survey-site-type").value;
  const notes = document.querySelector("#survey-notes").value.trim();
  latestSurveyBrief = [
    "GOLDSMITH / CIVILIAN SURVEY PLANNING BRIEF",
    `Purpose: ${purpose}`,
    `Site context: ${siteType}`,
    `Site notes: ${notes || "Not provided"}`,
    "",
    "Human review checklist:",
    "- Confirm landowner/site authorization and local aviation requirements.",
    "- Check airspace restrictions, weather, site hazards, privacy, and people nearby.",
    "- Verify aircraft condition, battery, control link, failsafes, and pilot readiness.",
    "- Keep the operation human-supervised; define abort and safe-landing criteria.",
    "- Decide what data is necessary, how it will be protected, and when it will be deleted.",
    "",
    "This is a planning checklist, not flight approval, navigation guidance, or a generated flight path. A qualified operator must assess the actual site and applicable rules."
  ].join("\n");
  const result = document.querySelector("#survey-result");
  result.replaceChildren();
  latestSurveyBrief.split("\n").forEach((line) => {
    const item = document.createElement("p");
    item.textContent = line;
    result.append(item);
  });
  document.querySelector("#survey-download").disabled = false;
});
document.querySelector("#survey-download").addEventListener("click", () => {
  if (latestSurveyBrief) downloadTextFile("goldsmith-civilian-survey-planning-brief.txt", latestSurveyBrief);
});

document.querySelector("#product-dialog-close").addEventListener("click", () => productDialog.close());
document.querySelector("#product-prev").addEventListener("click", () => moveProduct(-1));
document.querySelector("#product-next").addEventListener("click", () => moveProduct(1));
document.querySelector("#product-image-prev").addEventListener("click", () => moveProductImage(-1));
document.querySelector("#product-image-next").addEventListener("click", () => moveProductImage(1));
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
});
productDialog.addEventListener("close", () => productDialogReturnFocus?.focus());
productDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveProduct(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    moveProduct(1);
  }
});
productDialogImage.addEventListener("error", () => {
  if (productDialogImage.dataset.fallbackApplied) return;
  productDialogImage.dataset.fallbackApplied = "true";
  productDialogImage.src = fallbackImage;
});
productDialogAdd.addEventListener("click", () => {
  if (!activeProductId) return;
  addProductToCart(activeProductId);
  productDialogAdd.textContent = "Added to inquiry bag ✓";
});
productDialogInquire.addEventListener("click", () => {
  const product = products.find((item) => item.id === activeProductId);
  if (!product) return;
  productDialog.close();
  startProjectInquiry(product.name, product.serviceTitle, product.isHardware ? "hardware component" : "product concept");
});
productDialogService.addEventListener("click", () => {
  const serviceIndex = Number(productDialogService.dataset.viewService);
  if (serviceIndex < 0) return;
  productDialog.close();
  window.setTimeout(() => openService(serviceIndex, productDialogService), 0);
});

function handleCatalogCardClick(event) {
  const detailsButton = event.target.closest("[data-product-details]");
  if (detailsButton) {
    openProduct(detailsButton.dataset.productDetails, detailsButton);
    return;
  }
  const learnButton = event.target.closest("[data-view-service]");
  if (learnButton) {
    const serviceIndex = Number(learnButton.dataset.viewService);
    if (serviceIndex >= 0) openService(serviceIndex, learnButton);
    return;
  }
  const button = event.target.closest("[data-product-id]");
  if (button) {
    const id = button.dataset.productId;
    cart.set(id, (cart.get(id) ?? 0) + 1);
    renderCart();
    button.textContent = "Added to bag ✓";
    window.setTimeout(() => { button.textContent = button.dataset.defaultLabel; }, 1200);
    return;
  }
  const card = event.target.closest("[data-catalog-product]");
  if (!card || event.target.closest("button, input, label, a, select, textarea")) return;
  openProduct(card.dataset.catalogProduct, card);
}
productGrid.addEventListener("click", handleCatalogCardClick);
function handleCatalogCardKeydown(event) {
  const card = event.target.closest("[data-catalog-product]");
  if (event.target !== card || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  openProduct(card.dataset.catalogProduct, card);
}
productGrid.addEventListener("keydown", handleCatalogCardKeydown);
document.querySelector(".hardware-groups").addEventListener("keydown", handleCatalogCardKeydown);
productGrid.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-compare-product]");
  if (!checkbox) return;
  const id = checkbox.dataset.compareProduct;
  if (checkbox.checked && comparedProductIds.size >= 3) {
    checkbox.checked = false;
    comparisonOutput.textContent = "Compare up to three concepts at a time. Remove one selection before adding another.";
    return;
  }
  if (checkbox.checked) comparedProductIds.add(id);
  else comparedProductIds.delete(id);
  renderComparison();
});
comparisonOutput.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-comparison]");
  if (!button) return;
  comparedProductIds.delete(button.dataset.removeComparison);
  productGrid.querySelectorAll("[data-compare-product]").forEach((checkbox) => {
    if (checkbox.dataset.compareProduct === button.dataset.removeComparison) checkbox.checked = false;
  });
  renderComparison();
});
document.querySelector("#compare-clear").addEventListener("click", () => {
  comparedProductIds.clear();
  productGrid.querySelectorAll("[data-compare-product]").forEach((checkbox) => { checkbox.checked = false; });
  renderComparison();
});
document.querySelector(".hardware-groups").addEventListener("click", handleCatalogCardClick);
let cartReturnFocus = null;
document.querySelector("#cart-open").addEventListener("click", (event) => {
  cartReturnFocus = event.currentTarget;
  showDialogWithoutPageScroll(cartDialog, cartDialog.querySelector(".dialog-close"));
});
cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-product]");
  if (!button) return;
  cart.delete(button.dataset.removeProduct);
  renderCart();
});
document.querySelector("#cart-clear").addEventListener("click", () => { cart.clear(); renderCart(); });
document.querySelector("#cart-inquiry").addEventListener("click", () => {
  const requested = [...cart.entries()].map(([id, count]) => {
    const product = products.find((item) => item.id === id);
    return `${product.name} — ${product.serviceTitle} (${count})`;
  });
  const selectedProduct = products.find((product) => cart.has(product.id));
  const serviceSelect = document.querySelector("#contact-service");
  const preferredOption = selectedProduct?.serviceTitle ?? "Something else";
  const optionLabel = preferredOption === "Applied AI" || preferredOption === "Computer vision"
    ? "Applied AI / computer vision"
    : preferredOption;
  let matchingOption = Array.from(serviceSelect.options).find((option) => option.textContent === optionLabel);
  if (!matchingOption) {
    matchingOption = document.createElement("option");
    matchingOption.value = optionLabel;
    matchingOption.textContent = optionLabel;
    serviceSelect.add(matchingOption);
  }
  serviceSelect.value = matchingOption.value;
  document.querySelector("#contact-message").value = `I'd like to discuss these illustrative product/service concepts: ${requested.join("; ")}. Please share project feasibility and next steps.`;
  cartDialog.close();
  document.querySelector("#contact").scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
  window.setTimeout(() => document.querySelector("#contact-name").focus(), 350);
});

const projectConcepts = [
  {
    title: "GS-R01 · Field inspection rover",
    service: "Robotics / inspection",
    category: "Robotics",
    status: "Concept study",
    description: "An unarmed field robot concept exploring camera-assisted inspection and human-supervised navigation.",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85"
    ]
  },
  {
    title: "GS-A02 · Aerial site survey",
    service: "Drone / mapping",
    category: "Drone & mapping",
    status: "Concept study",
    description: "A civilian drone concept for operator-led mapping and documenting locations that are difficult to access.",
    images: [
      "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=85",
      serviceCatalog.find((item) => item.title === "Geospatial mapping").images[0]
    ]
  },
  {
    title: "GS-S03 · Smart facility monitor",
    service: "Sensors / facilities",
    category: "IoT & facilities",
    status: "Concept study",
    description: "A connected-facility study focused on environmental readings, useful alerts, privacy, and human review.",
    images: [
      serviceCatalog.find((item) => item.title === "Smart facilities").images[0],
      serviceCatalog.find((item) => item.title === "Environmental sensing").images[0],
      serviceCatalog.find((item) => item.title === "Smart facilities").images[1]
    ]
  },
  {
    title: "GS-D04 · Customer workspace",
    service: "CRM / custom software",
    category: "Software",
    status: "Concept study",
    description: "A sample CRM concept organizing customer records, a lead pipeline, and follow-up tasks around a team's process.",
    images: [serviceCatalog.find((item) => item.title === "CRM systems").images[0], serviceCatalog.find((item) => item.title === "Reporting dashboards").images[1], serviceCatalog.find((item) => item.title === "Customer support portals").images[2]]
  },
  {
    title: "GS-K05 · Document finder",
    service: "Knowledge / document search",
    category: "Software",
    status: "Concept study",
    description: "A knowledge-search concept that keeps source permissions visible and helps teams locate approved information.",
    images: [serviceCatalog.find((item) => item.title === "Knowledge-base search").images[0], serviceCatalog.find((item) => item.title === "Document management").images[1], serviceCatalog.find((item) => item.title === "Document intelligence").images[2]]
  }
];
const projectGrid = document.querySelector("#project-grid");
const projectFilters = document.querySelector("#project-filters");
let activeProjectFilter = "All concept studies";
function renderProjectFilters() {
  const categories = ["All concept studies", ...new Set(projectConcepts.map((project) => project.category))];
  const fragment = document.createDocumentFragment();
  categories.forEach((category) => {
    const filter = document.createElement("button");
    filter.type = "button";
    filter.className = `project-filter${category === activeProjectFilter ? " is-active" : ""}`;
    filter.dataset.projectFilter = category;
    filter.setAttribute("aria-pressed", String(category === activeProjectFilter));
    filter.textContent = category;
    fragment.append(filter);
  });
  projectFilters.replaceChildren(fragment);
}
function renderProjectCards() {
  const visibleProjects = projectConcepts.map((project, index) => ({ project, index }))
    .filter(({ project }) => activeProjectFilter === "All concept studies" || project.category === activeProjectFilter);
  const fragment = document.createDocumentFragment();
  visibleProjects.forEach(({ project, index }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "project-card";
    button.dataset.projectIndex = String(index);
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-label", `View photos and details for ${project.title}`);
    const image = document.createElement("img");
    image.src = project.images[0];
    image.alt = `Illustrative concept visual for ${project.title}`;
    image.loading = "lazy";
    image.addEventListener("error", () => { image.src = fallbackImage; });
    const meta = document.createElement("span");
    meta.className = "mono project-tag";
    meta.textContent = `${String(index + 1).padStart(2, "0")} / ${project.service}`;
    const title = document.createElement("strong");
    title.textContent = project.title;
    const status = document.createElement("span");
    status.className = "project-status status-concept";
    status.textContent = project.status.toUpperCase();
    const action = document.createElement("span");
    action.className = "project-card-action";
    action.textContent = "View concept gallery ↗";
    button.append(image, meta, title, status, action);
    fragment.append(button);
  });
  projectGrid.replaceChildren(fragment);
}
renderProjectFilters();
renderProjectCards();
projectFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project-filter]");
  if (!button) return;
  activeProjectFilter = button.dataset.projectFilter;
  renderProjectFilters();
  renderProjectCards();
});
const projectDialog = document.querySelector("#project-dialog");
const projectImage = document.querySelector("#project-image");
let activeProjectIndex = 0;
let activeProjectImageIndex = 0;
let projectReturnFocus = null;
function showProject(index, resetImage = false) {
  activeProjectIndex = (index + projectConcepts.length) % projectConcepts.length;
  if (resetImage) activeProjectImageIndex = 0;
  activeProjectImageIndex = (activeProjectImageIndex + projectConcepts[activeProjectIndex].images.length) % projectConcepts[activeProjectIndex].images.length;
  const project = projectConcepts[activeProjectIndex];
  setCatalogDialogBackground(projectDialog, project.images);
  projectImage.src = project.images[activeProjectImageIndex];
  projectImage.alt = `${project.title}: illustrative concept photo ${activeProjectImageIndex + 1} of ${project.images.length}. ${project.description}`;
  document.querySelector("#project-label").textContent = `${project.service} · CONCEPT STUDY`;
  document.querySelector("#project-title").textContent = project.title;
  document.querySelector("#project-description").textContent = project.description;
  document.querySelector("#project-count").textContent = `${String(activeProjectIndex + 1).padStart(2, "0")} / ${String(projectConcepts.length).padStart(2, "0")} · IMAGE ${activeProjectImageIndex + 1} / ${project.images.length}`;
}
document.querySelector("#chat-project-count").textContent = String(projectConcepts.length);
function openProject(index, trigger) {
  projectReturnFocus = trigger;
  activeProjectImageIndex = 0;
  showProject(index);
  showDialogWithoutPageScroll(projectDialog, projectDialog.querySelector(".dialog-close"));
}
projectImage.addEventListener("error", () => { projectImage.src = fallbackImage; });
projectGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-project-index]");
  if (!card) return;
  openProject(Number(card.dataset.projectIndex), card);
});
document.querySelector("#project-prev").addEventListener("click", () => showProject(activeProjectIndex - 1, true));
document.querySelector("#project-next").addEventListener("click", () => showProject(activeProjectIndex + 1, true));
document.querySelector("#project-image-prev").addEventListener("click", () => {
  activeProjectImageIndex = (activeProjectImageIndex - 1 + projectConcepts[activeProjectIndex].images.length) % projectConcepts[activeProjectIndex].images.length;
  showProject(activeProjectIndex);
});
document.querySelector("#project-image-next").addEventListener("click", () => {
  activeProjectImageIndex = (activeProjectImageIndex + 1) % projectConcepts[activeProjectIndex].images.length;
  showProject(activeProjectIndex);
});
projectDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") { event.preventDefault(); showProject(activeProjectIndex - 1, true); }
  if (event.key === "ArrowRight") { event.preventDefault(); showProject(activeProjectIndex + 1, true); }
});
document.querySelector("#project-inquire").addEventListener("click", (event) => {
  event.preventDefault();
  const project = projectConcepts[activeProjectIndex];
  projectDialog.close();
  startProjectInquiry(project.title, project.service, "project concept");
});
projectDialog.addEventListener("close", () => projectReturnFocus?.focus());
cartDialog.addEventListener("close", () => cartReturnFocus?.focus());
for (const dialog of [galleryDialog, projectDialog, cartDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => document.querySelector(`#${button.dataset.closeDialog}`).close());
});

document.querySelectorAll(".catalog-view-controls").forEach((controls) => {
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view-target][data-view-mode]");
    if (!button) return;
    const { viewTarget, viewMode } = button.dataset;
    document.querySelectorAll(`[data-view-container="${viewTarget}"]`).forEach((container) => {
      container.dataset.viewMode = viewMode;
    });
    controls.querySelectorAll("[data-view-target][data-view-mode]").forEach((option) => {
      const active = option === button;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-pressed", String(active));
    });
  });
});

const pageSections = [...document.querySelectorAll("main section[id]")];
const pagePosition = document.querySelector("#section-position");
const blueprintBackdrop = document.querySelector("#blueprint-backdrop");
const circuitThemes = {
  home: "ai",
  about: "software",
  services: "software",
  robotics: "robotics",
  products: "robotics",
  hardware: "robotics",
  projects: "ai",
  help: "software",
  collaboration: "ai",
  contact: "software"
};
function updateCircuitTheme(section) {
  blueprintBackdrop.dataset.circuit = circuitThemes[section?.id] || "software";
}
let activePageSection = 0;
let sectionScrollPending = false;
function updatePageSection() {
  sectionScrollPending = false;
  const headerOffset = document.querySelector(".site-header").getBoundingClientRect().bottom + 24;
  let closestIndex = 0;
  let closestDistance = Infinity;
  pageSections.forEach((section, index) => {
    const distance = Math.abs(section.getBoundingClientRect().top - headerOffset);
    if (section.getBoundingClientRect().top <= headerOffset + window.innerHeight * 0.35 && distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  activePageSection = closestIndex;
  updateCircuitTheme(pageSections[activePageSection]);
  pagePosition.textContent = `${String(activePageSection + 1).padStart(2, "0")} / ${String(pageSections.length).padStart(2, "0")}`;
  document.querySelector("#section-back").disabled = activePageSection === 0;
  document.querySelector("#section-forward").disabled = activePageSection === pageSections.length - 1;
}
function requestPageSectionUpdate() {
  if (sectionScrollPending) return;
  sectionScrollPending = true;
  window.requestAnimationFrame(updatePageSection);
}
window.addEventListener("scroll", requestPageSectionUpdate, { passive: true });
document.querySelector("#section-back").addEventListener("click", () => {
  pageSections[Math.max(0, activePageSection - 1)].scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
});
document.querySelector("#section-forward").addEventListener("click", () => {
  pageSections[Math.min(pageSections.length - 1, activePageSection + 1)].scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
});
updatePageSection();

const blueprintScenes = [
  { selector: ".blueprint-drone", label: "GS / AERIAL SCHEMATICS", phase: "aerial" },
  { selector: ".blueprint-robot", label: "GS / FIELD ROBOTICS", phase: "robotics" },
  { selector: ".blueprint-arm", label: "GS / MECHANICAL SYSTEMS", phase: "mechanical" },
  { selector: ".blueprint-rover", label: "GS / MOBILE PLATFORM", phase: "platform" },
  { selector: ".blueprint-sensor", label: "GS / SENSOR NETWORK", phase: "sensing" }
].map((scene) => ({ ...scene, element: blueprintBackdrop.querySelector(scene.selector) }));
const blueprintLabel = document.querySelector("#blueprint-label");
let blueprintScrollPending = false;
let blueprintAutoSceneOffset = 0;
function updateBlueprintOnScroll() {
  blueprintScrollPending = false;
  if (prefersReducedMotion.matches) {
    blueprintBackdrop.style.setProperty("--blueprint-shift", "0");
    blueprintBackdrop.style.setProperty("--blueprint-tilt", "0deg");
    blueprintBackdrop.style.setProperty("--blueprint-pitch", "0deg");
    blueprintBackdrop.style.setProperty("--blueprint-rotate-y", "0deg");
    blueprintBackdrop.style.setProperty("--blueprint-depth", "0px");
    blueprintScenes.forEach(({ element }, index) => {
      element.style.opacity = index === 1 ? "0.04" : "0";
      element.style.setProperty("--scene-drift", "0px");
      element.style.setProperty("--scene-pitch", "0deg");
    });
    blueprintLabel.textContent = "GS / STATIC BLUEPRINT";
    blueprintBackdrop.dataset.phase = "static";
    return;
  }
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0;
  const scenePosition = (progress * (blueprintScenes.length - 1) + blueprintAutoSceneOffset) % blueprintScenes.length;
  const activeScene = Math.round(scenePosition) % blueprintScenes.length;
  const scene = blueprintScenes[activeScene];
  blueprintBackdrop.style.setProperty("--blueprint-progress", String(progress));
  blueprintBackdrop.dataset.phase = scene.phase;
  blueprintLabel.textContent = scene.label;
  blueprintBackdrop.style.setProperty("--blueprint-shift", `${(progress - 0.5) * 70}px`);
  blueprintBackdrop.style.setProperty("--blueprint-tilt", `${Math.sin(progress * Math.PI * 2) * 2.5}deg`);
  blueprintBackdrop.style.setProperty("--blueprint-pitch", `${Math.sin(progress * Math.PI * 2) * 4}deg`);
  blueprintBackdrop.style.setProperty("--blueprint-rotate-y", `${Math.cos(progress * Math.PI * 2) * 5}deg`);
  blueprintBackdrop.style.setProperty("--blueprint-depth", `${Math.sin(progress * Math.PI * 2) * 34}px`);
  blueprintScenes.forEach(({ element }, index) => {
    const linearDistance = Math.abs(scenePosition - index);
    const distance = Math.min(linearDistance, blueprintScenes.length - linearDistance);
    const opacity = distance < 1 ? 0.14 * (1 - distance) : 0;
    element.style.opacity = String(opacity);
    element.style.setProperty("--scene-drift", `${(index % 2 ? -1 : 1) * progress * 30}px`);
    element.style.setProperty("--scene-pitch", `${Math.sin(progress * Math.PI + index) * 4}deg`);
  });
}
window.addEventListener("scroll", () => {
  if (blueprintScrollPending) return;
  blueprintScrollPending = true;
  window.requestAnimationFrame(updateBlueprintOnScroll);
}, { passive: true });
prefersReducedMotion.addEventListener("change", updateBlueprintOnScroll);
updateBlueprintOnScroll();
window.setInterval(() => {
  if (prefersReducedMotion.matches || document.visibilityState !== "visible") return;
  blueprintAutoSceneOffset = (blueprintAutoSceneOffset + 1) % blueprintScenes.length;
  updateBlueprintOnScroll();
}, 3500);

function setChatOpen(isOpen) {
  chatPanel.classList.toggle("is-open", isOpen);
  chatPanel.setAttribute("aria-hidden", String(!isOpen));
  chatLauncher.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    if (chatMainMenu.hidden) chatInput.focus();
    else chatMainMenu.querySelector("button[data-prompt]")?.focus();
  }
}

function setChatMainMenuOpen(isOpen) {
  chatMainMenu.hidden = !isOpen;
  chatMenuToggle.setAttribute("aria-expanded", String(isOpen));
  chatMenuToggle.querySelector("span").textContent = isOpen ? "⌄" : "☰";
  if (isOpen) chatMainMenu.querySelector("button[data-prompt]")?.focus();
}

chatMenuToggle.addEventListener("click", () => {
  setChatMainMenuOpen(chatMainMenu.hidden);
});
chatMainMenu.addEventListener("click", (event) => {
  const prompt = event.target.closest("button[data-prompt]");
  if (prompt) sendChatMessage(prompt.dataset.prompt);
  if (event.target.closest("a")) setChatOpen(false);
});
chatLauncher.addEventListener("click", () => setChatOpen(!chatPanel.classList.contains("is-open")));
chatClose.addEventListener("click", () => {
  setChatOpen(false);
  chatLauncher.focus();
});
chatClear.addEventListener("click", clearChat);
helpChatLink.addEventListener("click", () => setChatOpen(true));
chatPanel.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setChatOpen(false);
    chatLauncher.focus();
  }
});

function readAnalyticsConsent() {
  try {
    return window.localStorage.getItem(analyticsConsentKey) ?? sessionAnalyticsConsent;
  } catch {
    return sessionAnalyticsConsent;
  }
}

function analyticsIsConfigured() {
  return /^G-[A-Z0-9]{10}$/i.test(analyticsMeasurementId);
}

function writeAnalyticsConsent(value) {
  sessionAnalyticsConsent = value;
  try {
    window.localStorage.setItem(analyticsConsentKey, value);
    return true;
  } catch {
    return false;
  }
}

function loadAnalyticsAfterConsent() {
  if (!analyticsIsConfigured() || readAnalyticsConsent() !== "granted") return;
  window[`ga-disable-${analyticsMeasurementId}`] = false;
  if (analyticsLoaded) {
    window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied" });
    return;
  }
  analyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied" });
  window.gtag("js", new Date());
  window.gtag("config", analyticsMeasurementId);
  const analyticsScript = document.createElement("script");
  analyticsScript.async = true;
  analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsMeasurementId)}`;
  analyticsScript.onerror = () => {
    analyticsLoaded = false;
    privacyDialogStatus.textContent = "Analytics could not be loaded. The website continues to work without it.";
  };
  document.head.append(analyticsScript);
}

function updatePrivacyDialog() {
  const configured = analyticsIsConfigured();
  const consent = readAnalyticsConsent();
  analyticsAccept.disabled = !configured;
  if (!configured) {
    privacyDialogStatus.textContent = "Google Analytics has not been configured because no measurement ID was provided. No analytics tracking or analytics cookies are loaded. Your preference can be saved for this browser.";
  } else if (consent === "granted") {
    privacyDialogStatus.textContent = "You have allowed Google Analytics on this browser. You can turn it off at any time.";
  } else if (consent === "denied") {
    privacyDialogStatus.textContent = "Analytics is off on this browser. You can opt in at any time.";
  } else {
    privacyDialogStatus.textContent = "Optional Google Analytics is off unless you opt in. Your choice is saved in this browser.";
  }
}

document.querySelector("#privacy-settings").addEventListener("click", () => {
  updatePrivacyDialog();
  showDialogWithoutPageScroll(privacyDialog, document.querySelector("#privacy-dialog-close"));
});
document.querySelector("#privacy-dialog-close").addEventListener("click", () => privacyDialog.close());
analyticsAccept.addEventListener("click", () => {
  const saved = writeAnalyticsConsent("granted");
  updatePrivacyDialog();
  loadAnalyticsAfterConsent();
  if (!saved) privacyDialogStatus.textContent += " Your browser couldn't save this preference, so it applies only for this visit.";
});
analyticsDecline.addEventListener("click", () => {
  const saved = writeAnalyticsConsent("denied");
  if (analyticsIsConfigured()) {
    window[`ga-disable-${analyticsMeasurementId}`] = true;
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied" });
    }
  }
  updatePrivacyDialog();
  if (!saved) privacyDialogStatus.textContent += " Your browser couldn't save this preference, so it applies only for this visit.";
});
loadAnalyticsAfterConsent();

const fallbackImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520"><rect width="800" height="520" fill="#171b18"/><path d="M0 390 210 210l115 100 130-170 345 250v130H0Z" fill="#252c24"/><circle cx="600" cy="135" r="44" fill="#353d31"/><text x="400" y="470" fill="#b8c17a" font-family="sans-serif" font-size="18" text-anchor="middle">GOLDSMITH / CONCEPT IMAGE</text></svg>')}`;
document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    if (image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = "true";
    image.src = fallbackImage;
  });
});

function sendChatMessage(message) {
  const trimmedMessage = message.trim();
  if (!trimmedMessage || isAnantaBusy) return;
  setChatMainMenuOpen(false);
  chatInput.focus();
  addMessage(trimmedMessage, "user-message");
  const reply = getAnantaReply(trimmedMessage);
  const action = lastAnantaCatalogAction;
  lastAnantaCatalogAction = null;
  if (reply !== null) {
    window.setTimeout(() => addMessage(reply, "bot-message", action), 220);
    return;
  }

  isAnantaBusy = true;
  chatInput.disabled = true;
  chatClear.disabled = true;
  chatForm.querySelector("button[type='submit']").disabled = true;
  chatForm.setAttribute("aria-busy", "true");
  const pendingMessage = addMessage("Thinking…", "bot-message");
  pendingMessage.dataset.pending = "true";
  void resolveAnantaWithCopilot();
}

const anantaLocalFallback = "I don't have a confirmed answer for that exact question in the Goldsmith site information. You can describe the outcome you want, the people who will use it, and any tools or constraints involved; I'll try to connect it to a relevant service. I can also help outline a project brief, or you can ask the team at services@goldsmith.gold.in.";
let isAnantaBusy = false;

async function resolveAnantaWithCopilot() {
  const messages = Array.from(chatMessages.querySelectorAll(".chat-message"))
    .map((bubble) => {
      const content = bubble.querySelector(":scope > span:first-child");
      if (bubble.hasAttribute("data-pending")) return null;
      return content && {
        role: bubble.classList.contains("user-message") ? "user" : "assistant",
        content: content.textContent.trim().slice(-900)
      };
    })
    .filter((message) => message && message.content.length > 0)
    .slice(-6);
  const pendingMessage = chatMessages.querySelector("[data-pending='true']");

  try {
    const response = await fetch("/.netlify/functions/ananta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });
    const result = await response.json().catch(() => null);
    pendingMessage?.remove();

    if (response.ok && typeof result?.reply === "string" && result.reply.trim()) {
      addMessage(result.reply.trim(), "bot-message");
    } else {
      const unavailable = response.status === 404
        ? "The Copilot function isn't deployed at this site's address."
        : result?.error === "not_configured"
          ? "Copilot needs to be configured in the Netlify site environment."
          : response.status === 429
            ? "Ananta has reached its temporary Copilot request limit."
            : "The Copilot function received the request but couldn't get a reply. Check its Netlify logs and Copilot credentials.";
      addMessage(`${unavailable} ${anantaLocalFallback}`, "bot-message");
    }
  } catch {
    pendingMessage?.remove();
    addMessage(`The Copilot function couldn't be reached. Check that this site is deployed with Netlify Functions and that COPILOT_GITHUB_TOKEN is configured in Netlify. ${anantaLocalFallback}`, "bot-message");
  } finally {
    isAnantaBusy = false;
    chatInput.disabled = false;
    chatClear.disabled = false;
    chatForm.querySelector("button[type='submit']").disabled = false;
    chatForm.removeAttribute("aria-busy");
    chatInput.focus();
  }
}

const anantaKnowledge = [
  {
    topics: ["what can you do", "help", "what do you know", "questions", "topics"],
    answer: "I can answer from Goldsmith's service catalog and FAQs, and help you explore custom software, AI, security-minded design, project collaboration, and robotics concepts. For questions outside the site information, I can use GitHub Copilot when the site's live assistant is configured."
  },
  {
    topics: ["service", "services", "what do you offer", "what do you do", "capabilities"],
    answer: "Goldsmith's portfolio covers custom software and web platforms (including Java, PHP, and Python as stated technology areas), applied AI and data insights, workflow automation, privacy-aware security concepts, connected hardware, supervised robotics concepts, and product discovery/prototyping. The right fit depends on the problem, users, and constraints; ask me to help find a capability and I can guide you through a few questions."
  },
  {
    topics: ["which service is right for me", "help me choose", "recommend a capability", "what should i build", "best fit"],
    answer: "I can help narrow the options. Tell me your main goal, who needs the solution, and what you'd like to improve. I'll map that to relevant portfolio capabilities—not assume a specific product is already built."
  },
  {
    topics: ["java", "php", "python", "programming languages", "technology stack"],
    answer: "The portfolio lists Java, PHP, Python, web platforms, applied AI, and connected-system concepts as technology areas. That does not guarantee a particular stack for every project; the team would confirm feasibility and fit after understanding your requirements."
  },
  {
    topics: ["products", "product concepts", "show products", "product catalog", "software products"],
    answer: `The catalog contains ${catalogProducts.length} illustrative product concepts and ${hardwareSuggestions.length} suggested hardware components (${products.length} entries in the combined catalog). Product concepts are not confirmed ready-made offerings; hardware stock and prices are unconfirmed. Ask me to list either catalog or name an item.`
  },
  {
    topics: ["hardware", "hardware suggestions", "hardware catalog", "components", "parts"],
    answer: `The Hardware section lists ${hardwareSuggestions.length} suggested component concepts. They are not confirmed stock; prices, compatibility, and availability need to be verified for each project. Ask about a component by name or browse Hardware.`
  },
  {
    topics: ["projects", "project concepts", "project portfolio", "show projects", "project studies"],
    answer: `There are ${projectConcepts.length} illustrative project studies covering robotics, mapping, facilities, and software. These are concepts rather than confirmed deployments. Ask about a project by name to open its details.`
  },
  {
    topics: ["visual demos", "visualizations", "visualization", "interactive demos", "system map", "service orbit", "workflow demo"],
    answer: "You can explore the interactive system map, service orbit, workflow demo, and image gallery in the portfolio. These are illustrative browser experiences, not live system monitoring or deployed AI models."
  },
  {
    topics: ["drone", "drones", "uav", "aerial system", "aerial systems"],
    answer: "The portfolio describes exploratory AI-assisted drone concepts for supervised site inspection, mapping, and environmental observation. They are not presented as deployed products; the concept keeps people responsible for decisions and excludes weaponization and autonomous targeting."
  },
  {
    topics: ["workflow automation", "intelligent workflow", "business automation", "automate tasks"],
    answer: "Goldsmith's portfolio now includes AI-assisted workflow concepts to organize information and reduce repetitive tasks while keeping people in control. The site does not claim a ready-made automation product."
  },
  {
    topics: ["artificial intelligence", " ai ", "machine learning", " ml ", "ai project"],
    answer: "Goldsmith's applied-AI work is presented around practical machine learning, automation, and computer vision. The portfolio doesn't claim a particular model, benchmark, or prebuilt AI product."
  },
  {
    topics: ["computer vision", "image recognition", "visual ai", "object detection"],
    answer: "Computer vision is listed as an area of work. Potential applications can include interpreting images or video for a defined task; requirements, accuracy, privacy, and human review should be planned for each project."
  },
  {
    topics: ["custom software", "application", "app development", "web development", "website"],
    answer: "Goldsmith highlights custom applications, web platforms, and business tools designed around users and key workflows. To discuss a specific build, describe the people it should serve and what it needs to accomplish."
  },
  {
    topics: ["security", "cybersecurity", "secure", "secure by design", "data protection"],
    answer: "Goldsmith describes a security-minded approach: consider privacy, access, reliability, and human oversight from the start. The website doesn't publish certifications or promise a specific security standard, so ask the team about your project's requirements."
  },
  {
    topics: ["surveillance", "monitoring", "security system", "situational awareness"],
    answer: "The portfolio mentions responsible monitoring and surveillance concepts intended to support human decisions. Any real deployment should be lawful, privacy-aware, proportionate, and subject to human oversight."
  },
  {
    topics: ["robot", "robotics", "prototype", "military robot", "robot prototype"],
    answer: "The robot and drone imagery represents research concepts, not products available for purchase or deployment. Possible non-weaponized applications include supervised inspection, mapping, environmental observation, situational awareness, and human-robot collaboration."
  },
  {
    topics: ["weapon", "weaponized", "targeting", "autonomous weapon"],
    answer: "Goldsmith's robotics page describes a non-weaponized research concept for inspection and human-robot collaboration. I can't provide weapon design, targeting, or autonomous-harm guidance."
  },
  {
    topics: ["collaboration", "partner", "partnership", "work together", "freelance"],
    answer: "Goldsmith invites founders, teams, and organizations to discuss collaborations. Send a brief outline of the challenge, intended users, desired outcome, and any constraints to services@goldsmith.gold.in."
  },
  {
    topics: ["start a project", "project process", "get started", "first step", "discovery"],
    answer: "A useful first message describes the problem, who it affects, the outcome you want, any existing systems, and your approximate timeline. Email services@goldsmith.gold.in; the team can confirm next steps after reviewing your brief."
  },
  {
    topics: ["requirements", "project brief", "what should i include", "send details"],
    answer: "For a helpful project brief, include: the problem, intended users, essential features, platforms or systems involved, privacy/security considerations, timeline, and how you'll judge success. Please don't send passwords, secrets, or sensitive personal data."
  },
  {
    topics: ["price", "pricing", "cost", "quote", "budget", "how much"],
    answer: "Goldsmith's website doesn't publish prices or fixed packages. Costs depend on scope and requirements, so email services@goldsmith.gold.in with a short brief to ask about an estimate."
  },
  {
    topics: ["timeline", "how long", "delivery date", "deadline", "duration"],
    answer: "The website doesn't specify standard delivery timelines. Timing depends on project scope, integrations, and review needs; share your target date and must-have scope with the team for a realistic discussion."
  },
  {
    topics: ["contact", "email", "reach", "talk to someone", "speak to a person"],
    answer: "Use the contact form or email services@goldsmith.gold.in to share your project goals and timeline. The website does not publish a response timeframe."
  },
  {
    topics: ["where are you", "location", "office", "address", "country"],
    answer: "The portfolio doesn't list a company address or service region. Email services@goldsmith.gold.in to confirm whether Goldsmith can support your location."
  },
  {
    topics: ["support", "maintenance", "after launch", "updates", "ongoing"],
    answer: "The site doesn't describe specific maintenance or support plans. Include your expectations for updates, monitoring, documentation, and ongoing support when you contact the team."
  },
  {
    topics: ["privacy", "store messages", "chat history", "personal data", "data retention"],
    answer: "Catalog and FAQ questions are answered from this site. When a question needs broader guidance and Copilot is configured, Ananta sends that question and up to five recent chat messages through a server-side Netlify Function to GitHub Copilot. This site does not save chat history, but the providers may process requests under their own policies. Avoid sharing personal, confidential, or sensitive information."
  },
  {
    topics: ["is this real ai", "live ai", "large language model", "chatbot ai"],
    answer: "I'm Ananta, a small browser-based demo that matches questions to prepared answers. I don't connect to a live AI model, browse the web, or access a company database."
  },
  {
    topics: ["github", "linkedin", "instagram", "social media", "social links"],
    answer: "Official Goldsmith social-media profiles have not been provided, so the portfolio doesn't link to unverified accounts. Ask the team at services@goldsmith.gold.in for official profile links."
  },
  {
    topics: ["human oversight", "human in the loop", "responsible ai", "ethics"],
    answer: "The portfolio emphasizes human-led outcomes and oversight, especially for security and robotics concepts. A responsible project should define who reviews system outputs, how errors are handled, and what the system must never do."
  },
  {
    topics: ["integrate", "integration", "existing system", "api", "database"],
    answer: "The site doesn't list specific integrations or API support. Mention your current platforms, data formats, and access constraints in your inquiry so the team can assess what's feasible."
  },
  {
    topics: ["mobile app", "ios", "android", "mobile"],
    answer: "Mobile app development isn't specifically described on the portfolio. Ask the team about your target platforms and features at services@goldsmith.gold.in."
  },
  {
    topics: ["open source", "license", "source code", "ownership", "intellectual property"],
    answer: "The site doesn't publish standard licensing, source-code ownership, or intellectual-property terms. Clarify these expectations with the team before a project begins."
  },
  {
    topics: ["data", "analytics", "dashboard", "reporting", "business intelligence"],
    answer: "Custom software and applied AI are listed among Goldsmith's areas, but the site doesn't specify analytics products. Describe your data sources, desired reports, and privacy needs in an inquiry."
  },
  {
    topics: ["hello", "hi", "hey", "good morning", "good afternoon"],
    answer: "Hello! I'm Ananta, Goldsmith's browser-based demo assistant. Ask me about services, technologies, project planning, privacy, or the robotics concept."
  },
  {
    topics: ["thank", "thanks", "appreciate"],
    answer: "You're welcome! If you'd like to discuss a project with the team, email services@goldsmith.gold.in."
  }
];

function getAnantaReply(message) {
  const normalized = normalizeAnantaText(message);
  lastAnantaCatalogAction = null;
  if (!normalized) return "Ask me about a Goldsmith service, project planning, privacy, pricing, or contact details.";
  const mentionedCatalog = getAnantaCatalogType(normalized);
  if (mentionedCatalog) lastAnantaCatalog = mentionedCatalog;
  if (/\b(visual demos?|visualizations?|system map|service orbit|workflow demo|interactive gallery)\b/.test(normalized)) {
    lastAnantaCatalogAction = { kind: "section", target: "#about" };
    return "Explore the portfolio's illustrative system map, service orbit, workflow demo, and visual gallery. They demonstrate interface ideas; they are not live monitoring or deployed AI systems.";
  }
  if (/\b(weapon|weaponized|targeting|kill|attack|autonomous weapon)\b/.test(normalized)) {
    return "Goldsmith's robotics and drone concepts are non-weaponized and intended for supervised inspection, mapping, and observation. I can't help design weapons, targeting, or autonomous-harm capabilities.";
  }
  if (/^(hi|hello|hey|good morning|good afternoon)$/.test(normalized)) {
    return `Hello! I can search all ${serviceCatalog.length} service profiles and the site FAQs. Try asking about a project idea, a service, security, pricing, or how to contact Goldsmith.`;
  }
  if (/\b(thanks|thank you|thx)\b/.test(normalized)) {
    return "You're welcome! Ask me about another service or email services@goldsmith.gold.in to contact the team.";
  }
  if (/\b(buy|purchase|order|checkout|shop|for sale|available to buy)\b/.test(normalized)) {
    anantaDiscovery = null;
    lastAnantaCatalogAction = {
      kind: "choices",
      choices: ["Browse product concepts", "Browse suggested hardware", "Start a project"]
    };
    return "This site doesn't sell items or offer checkout. Product entries are concept studies, and hardware is a suggestion list—not confirmed stock or verified sourcing. You can add concepts to the inquiry bag to discuss feasibility with Goldsmith. What are you interested in?";
  }
  if (lastAnantaCatalog && /\b(more|next|continue|show more|next page)\b/.test(normalized)) {
    anantaDiscovery = null;
    lastAnantaCatalogAction = { kind: "catalog-list", catalog: lastAnantaCatalog, entries: getAnantaCatalogItems(lastAnantaCatalog) };
    return `Here is the ${lastAnantaCatalog} list again. Scroll through the entries and select any item to open its details.`;
  }
  if (isAnantaListRequest(normalized)) {
    const catalog = mentionedCatalog ?? lastAnantaCatalog;
    anantaDiscovery = null;
    if (!catalog) {
      lastAnantaCatalogAction = {
        kind: "choices",
        choices: ["List all services", "List all products", "List all hardware", "List all projects"]
      };
      return "Sure—which list would you like? I can show every service, product concept, hardware suggestion, or project.";
    }
    const entries = getAnantaCatalogItems(catalog);
    lastAnantaCatalogAction = { kind: "catalog-list", catalog, entries };
    const labels = {
      services: `${serviceCatalog.length} services`,
      products: `${catalogProducts.length} product concepts`,
      hardware: `${hardwareSuggestions.length} suggested hardware components`,
      projects: `${projectConcepts.length} project studies`
    };
    return `Here are all ${labels[catalog]}. These are portfolio descriptions and suggestions, not confirmed deployments or stock. Select any item below to open its details.`;
  }
  if (anantaDiscovery) return continueAnantaDiscovery(message);
  if (/\b(help me choose|help me find|best fit|recommend(?: a| me| the)?|not sure where to start|what should we build|understand my needs|find the right service)\b/.test(normalized)) {
    anantaDiscovery = { step: "goal", goal: "", audience: "" };
    lastAnantaCatalogAction = {
      kind: "choices",
      choices: ["Build or improve software", "Use AI or understand data", "Automate a workflow", "Improve security or privacy", "Explore hardware or robotics", "I'm not sure yet"]
    };
    return "I can help narrow it down. First, what are you mainly hoping to do? Choose the closest option—or type your own description. This is a starting point, not a sales commitment. Your answers stay in this browser session; nothing is sent unless you choose to contact the team.";
  }
  const asksCommercialDetails = /\b(price|pricing|cost|quote|budget|timeline|how long|deadline|contact|email)\b/.test(normalized);
  const asksCrm = /\bcrm\b|customer relationship management|sales pipeline|lead management/.test(normalized);
  const asksCrmOrFollowsUp = asksCrm || lastAnantaContext === "crm";
  const mentionsOtherService = serviceCatalog.some((service) => service.title !== "Custom software"
    && [service.title, ...(anantaServiceAliases[service.title] ?? [])]
      .some((phrase) => normalized.includes(normalizeAnantaText(phrase))));
  if (asksCrmOrFollowsUp && /\b(price|pricing|cost|quote|budget)\b/.test(normalized)) {
    lastAnantaContext = "crm";
    return "The Goldsmith site doesn't publish CRM prices or fixed packages. Cost would depend on the features, user roles, data imports, and integrations you need. Share your must-haves and budget range with services@goldsmith.gold.in to ask about a project estimate.";
  }
  if (asksCrmOrFollowsUp && /\b(timeline|how long|deadline)\b/.test(normalized)) {
    lastAnantaContext = "crm";
    return "The website doesn't publish a standard CRM delivery timeline. Timing would depend on the first-release scope, data migration, integrations, and review needs. Include your target date and must-have features in an inquiry to services@goldsmith.gold.in.";
  }
  if (asksCrmOrFollowsUp && /\b(contact|email)\b/.test(normalized)) {
    lastAnantaContext = "crm";
    return "To discuss the CRM idea, use the contact form or email services@goldsmith.gold.in. Include your team's current sales process, must-have features, user count, and any existing customer data or tools.";
  }
  if (asksCrm && !asksCommercialDetails) {
    lastAnantaServiceIndex = serviceCatalog.findIndex((service) => service.title === "Custom software");
    lastAnantaContext = "crm";
    return "Yes—Goldsmith lists custom software and business tools, so CRM systems are a relevant project to discuss. A CRM can be scoped around your workflow with areas such as contacts and companies, lead stages, follow-up tasks and reminders, interaction history, search, reports, and role-based access. Possible integrations or imports depend on your current tools and data. A sensible first step is to describe who will use it, how leads move today, what your must-have first-release features are, and whether you need to bring in existing customer records. Email services@goldsmith.gold.in or use the inquiry form to discuss feasibility; the site doesn't promise a ready-made CRM.";
  }
  if (lastAnantaContext === "crm" && !mentionsOtherService && /\b(feature|features|field|fields|workflow|workflows|integration|integrations|user|users|dashboard|report|reports|security|data|import|imports|mobile|include|requirements|brief|start|begin)\b/.test(normalized) && !asksCommercialDetails) {
    return "For the CRM idea, start with the people and steps in your sales or customer-support process. A first version might include customer/contact records, lead stages, notes and interaction history, tasks and reminders, search, and a simple pipeline view. Then confirm user roles, data imports, reports, mobile needs, integrations, privacy, and access controls based on your workflow. Which part matters most for your team?";
  }
  if (/\b(more|more detail|tell me more|that one|this one|it|explain more)\b/.test(normalized) && lastAnantaServiceIndex !== null) {
    const service = serviceCatalog[lastAnantaServiceIndex];
    if (lastAnantaContext === "crm") {
      return "For your CRM, we can explore a first release around customer/contact records, lead stages, follow-up tasks, notes, search, and a clear pipeline view. The exact feature set, user roles, imports, and integrations should follow your team's current process. Share your team size, current tools, and top three must-haves with services@goldsmith.gold.in.";
    }
    return `${service.title}: ${service.summary} ${service.detail} To discuss it, use the inquiry form or email services@goldsmith.gold.in.`;
  }

  const queryTokens = correctAnantaTokens(tokenizeAnanta(normalized));
  if (!queryTokens.length) return null;
  const ranked = getAnantaCandidates().map((candidate) => ({
    candidate,
    score: scoreAnantaCandidate(queryTokens, candidate)
  })).sort((left, right) => right.score - left.score);
  const best = ranked[0];
  if (!best || best.score < 3) {
    return null;
  }

  if (best.candidate.kind === "service") {
    lastAnantaServiceIndex = best.candidate.serviceIndex;
    lastAnantaCatalogAction = { kind: "service", index: best.candidate.serviceIndex };
    lastAnantaContext = null;
    const service = best.candidate.service;
    const related = ranked
      .filter((entry) => entry.candidate.kind === "service" && entry.candidate.serviceIndex !== best.candidate.serviceIndex && entry.score >= best.score * 0.62)
      .slice(0, 2)
      .map((entry) => entry.candidate.service.title);
    const relatedText = related.length ? ` Related services: ${related.join(" and ")}.` : "";
    return `${service.title} (${service.group}): ${service.summary} ${service.detail}${relatedText} For project-specific details, email services@goldsmith.gold.in.`;
  }
  if (best.candidate.kind === "product" || best.candidate.kind === "hardware") {
    lastAnantaCatalogAction = { kind: "product", id: best.candidate.product.id };
    lastAnantaServiceIndex = null;
    lastAnantaContext = null;
    const product = best.candidate.product;
    const qualifier = product.isHardware
      ? "Suggested hardware component; stock, compatibility, and price are unconfirmed."
      : "Illustrative product concept, not a confirmed ready-made product.";
    return `${product.name}: ${product.use} ${product.description} ${qualifier} Related area: ${product.serviceTitle}.`;
  }
  if (best.candidate.kind === "project") {
    lastAnantaCatalogAction = { kind: "project", index: best.candidate.projectIndex };
    lastAnantaServiceIndex = null;
    lastAnantaContext = null;
    const project = best.candidate.project;
    return `${project.title} (${project.category}): ${project.description} This is an illustrative concept study, not a confirmed deployment.`;
  }
  lastAnantaCatalogAction = null;
  lastAnantaServiceIndex = null;
  lastAnantaContext = null;
  return best.candidate.entry.answer;
}

function continueAnantaDiscovery(message) {
  const answer = message.trim();
  if (!answer || !anantaDiscovery) {
    anantaDiscovery = null;
    return "Let's start again. Tell me what you want to improve, or use the Main menu to browse Goldsmith's capabilities.";
  }
  if (/\b(cancel|stop|never mind)\b/.test(normalizeAnantaText(answer))) {
    anantaDiscovery = null;
    return "No problem—I've stopped the capability finder. Your answers stay in this browser session; nothing was submitted. You can ask a question or reopen the Main menu whenever you're ready.";
  }

  if (anantaDiscovery.step === "goal") {
    anantaDiscovery.goal = answer;
    anantaDiscovery.step = "audience";
    lastAnantaCatalogAction = {
      kind: "choices",
      choices: ["My team", "Customers or public", "Field or operations staff", "I'm still exploring"]
    };
    return "Thanks. Who would use or benefit from it most? Choose an option or describe the people involved.";
  }

  if (anantaDiscovery.step === "audience") {
    anantaDiscovery.audience = answer;
    anantaDiscovery.step = "outcome";
    lastAnantaCatalogAction = {
      kind: "choices",
      choices: ["Save time", "Make information easier to use", "Reduce risks", "Test an idea before building", "Something else"]
    };
    return "Got it. What would a useful improvement look like? This helps me distinguish between building, automation, analytics, security, and early discovery.";
  }

  const { goal, audience } = anantaDiscovery;
  const goalText = normalizeAnantaText(goal);
  const outcomeText = normalizeAnantaText(answer);
  const goalServices = goalText.includes("software")
    ? ["Custom software", "Digital product discovery"]
    : goalText.includes("ai") || goalText.includes("data")
      ? ["Applied AI", "Data insights", "Responsible AI evaluation"]
      : goalText.includes("workflow") || goalText.includes("automate")
        ? ["Process automation", "Intelligent workflows", "Business process mapping"]
        : goalText.includes("security") || goalText.includes("privacy")
          ? ["Cybersecurity reviews", "Security systems", "Privacy-aware computer vision"]
          : goalText.includes("hardware") || goalText.includes("robot")
            ? ["Research prototyping", "Smart facilities", "AI-assisted drones"]
            : ["Digital product discovery", "Technology consulting", "Research prototyping"];
  const outcomeServices = outcomeText.includes("time")
    ? ["Process automation", "Intelligent workflows"]
    : outcomeText.includes("information") || outcomeText.includes("data")
      ? ["Data insights", "Knowledge-base search"]
      : outcomeText.includes("risk")
        ? ["Cybersecurity reviews", "Quality engineering"]
        : outcomeText.includes("test") || outcomeText.includes("idea")
          ? ["Digital product discovery", "Research prototyping"]
          : [];
  const preferredTitles = [...new Set([...outcomeServices, ...goalServices])];
  const recommendations = preferredTitles
    .map((title) => serviceCatalog.findIndex((service) => service.title === title))
    .filter((index) => index >= 0)
    .slice(0, 3);
  anantaDiscovery = null;

  const primary = serviceCatalog[recommendations[0]];
  const alternatives = recommendations.slice(1).map((index) => serviceCatalog[index].title);
  const alternativesText = alternatives.length ? ` Other relevant areas to compare: ${alternatives.join(", ")}.` : "";
  lastAnantaCatalogAction = recommendations.length
    ? { kind: "recommendations", indexes: recommendations }
    : null;
  return `Based on your goal (“${goal}”), the people involved (“${audience}”), and the improvement you want (“${answer}”), a useful starting point is ${primary.title}: ${primary.summary}${alternativesText} This is a preliminary match to Goldsmith's listed capabilities, not a confirmed solution or guarantee. You can compare the suggestions or share a brief with the team; nothing is sent automatically.`;
}

function normalizeAnantaText(text) {
  return text.toLowerCase()
    .replace(/[\u2018\u2019']/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getAnantaCatalogType(normalized) {
  if (/\b(hardware|components?|parts|iot|drone hardware)\b/.test(normalized)) return "hardware";
  if (/\b(products?|product concepts?|catalog products?)\b/.test(normalized)) return "products";
  if (/\b(projects?|project concepts?|case studies)\b/.test(normalized)) return "projects";
  if (/\b(services?|capabilities)\b/.test(normalized)) return "services";
  return null;
}

function isAnantaListRequest(normalized) {
  const explicitListRequest = /\b(list|listing|display|names?|all|everything|each|catalog|browse)\b/.test(normalized);
  const showNamedCatalog = /\b(show|browse)\b/.test(normalized) && getAnantaCatalogType(normalized);
  return Boolean(explicitListRequest || showNamedCatalog);
}

function getAnantaCatalogItems(catalog) {
  if (catalog === "services") {
    return serviceCatalog.map((service, index) => ({
      name: service.title,
      detail: service.group,
      kind: "service",
      index
    }));
  }
  if (catalog === "products") {
    return catalogProducts.map((product) => ({
      name: product.name,
      detail: product.use,
      kind: "product",
      id: product.id
    }));
  }
  if (catalog === "hardware") {
    return hardwareSuggestions.map((part) => ({
      name: part.name,
      detail: part.group,
      kind: "product",
      id: part.id
    }));
  }
  return projectConcepts.map((project, index) => ({
    name: project.title,
    detail: project.category,
    kind: "project",
    index
  }));
}

const anantaStopWords = new Set([
  "a", "an", "and", "are", "about", "can", "could", "do", "does", "for", "from",
  "give", "i", "in", "is", "it", "me", "of", "on", "or", "our", "please", "tell",
  "that", "the", "this", "to", "us", "we", "what", "which", "who", "with", "you",
  "your", "would", "should", "will", "how", "much", "many", "some", "any", "more"
]);

function tokenizeAnanta(text) {
  return normalizeAnantaText(text).split(" ")
    .filter((token) => token.length > 1 && !anantaStopWords.has(token))
    .map((token) => token.length > 4 && token.endsWith("s") ? token.slice(0, -1) : token);
}

const anantaServiceAliases = {
  "Custom software": ["website", "web app", "business application", "digital product", "software development", "custom app", "platform", "crm", "customer relationship management", "customer relationship manager", "client management", "customer database", "lead management", "sales pipeline", "sales crm", "contacts and deals"],
  "Applied AI": ["artificial intelligence", "machine learning", "ai solution", "smart assistant", "generative ai", "predictive model", "language model"],
  "Security systems": ["surveillance", "monitoring", "access control", "security camera", "safety system", "video monitoring", "site monitoring"],
  "R&D collaboration": ["proof of concept", "feasibility study", "technical prototype", "research and development", "validate an idea", "technical experiment"],
  "AI-assisted drones": ["drone", "uav", "aerial mapping", "site survey", "aerial inspection", "environmental survey", "remote inspection", "mapping drone"],
  "Intelligent workflows": ["workflow", "business process", "office automation", "repetitive task", "automate paperwork", "approval workflow"],
  "Computer vision": ["image recognition", "video analysis", "object detection", "visual inspection", "image analysis", "video understanding"],
  "Data insights": ["analytics", "dashboard", "business intelligence", "data visualization", "reporting", "reports", "find patterns", "trend analysis", "metrics", "kpi dashboard"],
  "Cloud platforms": ["cloud hosting", "cloud infrastructure", "scalable hosting", "deployment platform", "cloud migration", "server infrastructure"],
  "Cybersecurity reviews": ["security review", "security reviews", "security audit", "threat review", "secure architecture", "risk assessment", "application security review"],
  "Digital twins": ["virtual model", "system simulation", "digital replica", "virtual representation", "process simulation"],
  "Process automation": ["automate process", "manual task", "workflow automation", "task automation", "repetitive process", "business process automation"],
  "Predictive maintenance": ["equipment failure", "maintenance planning", "machine health", "asset maintenance", "predict machine failure"],
  "Smart facilities": ["building automation", "facility management", "smart building", "connected building", "building operations"],
  "Geospatial mapping": ["map", "location data", "geographic information", "gis", "site mapping", "geospatial analysis", "terrain mapping"],
  "Environmental sensing": ["environment monitoring", "air quality", "sensor network", "weather sensor", "environmental data", "condition monitoring"],
  "Accessibility tools": ["accessible website", "inclusive design", "assistive technology", "screen reader", "keyboard accessibility", "accessible interface"],
  "Research prototyping": ["experiment", "early prototype", "concept test", "pilot project", "minimum viable product", "mvp", "prototype an idea"],
  "Product design": ["user experience", "ux design", "interface design", "product discovery", "user interface", "wireframes", "user research"],
  "System integration": ["connect systems", "api integration", "data integration", "software integration", "connect applications", "synchronize data"],
  "Mobile experiences": ["mobile app", "phone app", "ios app", "android app", "mobile website", "smartphone application"],
  "Quality engineering": ["software testing", "quality assurance", "bug testing", "test automation", "automated tests", "regression testing"],
  "Document intelligence": ["document search", "knowledge base", "document processing", "text extraction", "search documents", "optical character recognition", "ocr"],
  "Decision support": ["decision making", "recommendation system", "decision aid", "human decision", "compare options", "decision dashboard"],
  "Edge AI concepts": ["on device ai", "edge computing", "offline ai", "local ai", "on-device processing", "device machine learning"],
  "Technology consulting": ["technical advice", "technology strategy", "architecture advice", "technology roadmap", "technical planning", "system architecture"],
  "CRM systems": ["crm", "customer relationship management", "customer relationship manager", "client management system", "sales crm", "lead tracking", "customer records"],
  "Inventory & order management": ["inventory management", "stock tracking", "order management", "warehouse inventory", "stock control", "fulfillment tracking"],
  "Accounting workflow tools": ["accounting workflow", "finance workflow", "expense approvals", "invoice tracking", "invoice approval", "financial operations", "accounts payable workflow"],
  "Customer support portals": ["customer support portal", "help desk portal", "support ticket system", "customer service portal", "ticket tracking", "self service support"],
  "Appointment & booking systems": ["booking system", "appointment scheduler", "appointment booking", "reservation system", "calendar booking", "schedule appointments"],
  "Document management": ["document management system", "file management", "document library", "records management", "version control documents"],
  "Knowledge-base search": ["internal search", "company knowledge search", "enterprise search", "search internal documents", "knowledge retrieval"],
  "Identity & access management": ["identity management", "user access management", "iam", "single sign on", "sso", "role based access", "account permissions"],
  "Backup & recovery planning": ["disaster recovery", "backup strategy", "data backup", "restore testing", "business continuity", "recovery planning"],
  "Cloud migration": ["move to cloud", "cloud transition", "migrate servers", "cloud modernization", "move infrastructure"],
  "API & legacy integration": ["legacy integration", "connect legacy software", "api integration", "integrate old systems", "system interoperability"],
  "Data migration & cleanup": ["data migration", "data cleanup", "clean up data", "deduplicate records", "import data", "data conversion"],
  "Business process mapping": ["process mapping", "business workflow mapping", "map business process", "process discovery", "workflow analysis", "map our business workflow"],
  "Reporting dashboards": ["reporting dashboard", "management dashboard", "executive dashboard", "operational reports", "business reporting"],
  "Mobile workforce applications": ["field service app", "mobile workforce", "field worker app", "mobile staff tools", "offline field app"],
  "Accessibility audits": ["accessibility audit", "wcag review", "accessibility assessment", "web accessibility testing", "inclusive usability review"],
  "Software quality & test automation": ["test automation", "automated software testing", "quality engineering", "regression test suite", "software quality assurance", "automate regression testing"],
  "Responsible AI evaluation": ["ai evaluation", "model evaluation", "ai testing", "model risk assessment", "ai quality review", "evaluate model outputs"],
  "Privacy-aware computer vision": ["privacy preserving vision", "privacy friendly video analytics", "video privacy", "privacy-aware vision", "data minimization vision"],
  "Digital product discovery": ["product discovery", "product strategy workshop", "customer discovery", "product research", "feature prioritization", "what should we build"]
};

function getAnantaCandidates() {
  const faqCandidates = anantaKnowledge.map((entry) => ({
    kind: "faq",
    entry,
    searchable: `${entry.topics.join(" ")} ${entry.answer}`
  }));
  const serviceCandidates = serviceCatalog.map((service, serviceIndex) => ({
    kind: "service",
    service,
    serviceIndex,
    searchable: `${service.title} ${service.category} ${service.group} ${service.summary} ${service.detail} ${(anantaServiceAliases[service.title] ?? []).join(" ")}`
  }));
  const productCandidates = products.map((product) => ({
    kind: product.isHardware ? "hardware" : "product",
    product,
    searchable: `${product.name} ${product.group} ${product.serviceTitle} ${product.use} ${product.description} ${product.isHardware ? "hardware component part" : "product software concept"}`
  }));
  const projectCandidates = projectConcepts.map((project, projectIndex) => ({
    kind: "project",
    project,
    projectIndex,
    searchable: `${project.title} ${project.service} ${project.category} ${project.description} project concept study`
  }));
  return [...faqCandidates, ...serviceCandidates, ...productCandidates, ...projectCandidates];
}

function levenshteinDistance(left, right) {
  if (Math.abs(left.length - right.length) > 1) return 2;
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    let rowMinimum = row;
    for (let column = 1; column <= right.length; column += 1) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1;
      current[column] = Math.min(current[column - 1] + 1, previous[column] + 1, previous[column - 1] + cost);
      rowMinimum = Math.min(rowMinimum, current[column]);
    }
    if (rowMinimum > 1) return 2;
    previous = current;
  }
  return previous[right.length];
}

function scoreAnantaCandidate(queryTokens, candidate) {
  const candidateText = normalizeAnantaText(candidate.searchable);
  const candidateTokens = new Set(tokenizeAnanta(candidateText));
  const vocabulary = [...candidateTokens];
  let score = 0;
  const matchedTokens = new Set();
  for (const queryToken of queryTokens) {
    if (candidateTokens.has(queryToken)) {
      matchedTokens.add(queryToken);
      score += Math.min(3, 1.6 + queryToken.length / 8);
      continue;
    }
    if (queryToken.length < 5) continue;
    const correction = vocabulary.find((word) => word.length >= 5 && levenshteinDistance(queryToken, word) === 1);
    if (correction) {
      matchedTokens.add(queryToken);
      score += 1.05;
    }
  }
  const exactPhrases = candidate.kind === "service"
    ? [candidate.service.title, ...(anantaServiceAliases[candidate.service.title] ?? [])]
    : candidate.kind === "product" || candidate.kind === "hardware"
      ? [candidate.product.name, candidate.product.serviceTitle]
      : candidate.kind === "project"
        ? [candidate.project.title, candidate.project.category]
        : candidate.entry.topics;
  const correctedQuery = ` ${queryTokens.join(" ")} `;
  for (const phrase of exactPhrases) {
    const normalizedPhrase = normalizeAnantaText(phrase);
    const phraseTokens = tokenizeAnanta(normalizedPhrase);
    const normalizedCorrectedPhrase = ` ${phraseTokens.join(" ")} `;
    if (phraseTokens.length && correctedQuery.includes(normalizedCorrectedPhrase)) {
      const catalogTitle = candidate.kind === "service"
        ? candidate.service.title
        : candidate.kind === "project"
          ? candidate.project.title
          : candidate.kind === "product" || candidate.kind === "hardware"
            ? candidate.product.name
            : null;
      score += catalogTitle
        ? (phrase === catalogTitle ? 16 : 12)
        : (normalizedPhrase.includes(" ") ? 4 : 2);
    }
  }
  if (queryTokens.length > 1) score *= 0.8 + 0.2 * (matchedTokens.size / queryTokens.length);
  return score;
}

function correctAnantaTokens(queryTokens) {
  const vocabulary = [...new Set(getAnantaCandidates().flatMap((candidate) => tokenizeAnanta(candidate.searchable)))];
  return queryTokens.map((token) => {
    if (vocabulary.includes(token) || token.length < 4) return token;
    const candidates = vocabulary.filter((word) => word.length >= 4 && levenshteinDistance(token, word) === 1);
    const transposed = vocabulary.filter((word) => word.length === token.length && hasAdjacentTransposition(token, word));
    const matches = [...new Set([...candidates, ...transposed])];
    return matches.length === 1 ? matches[0] : token;
  });
}

function hasAdjacentTransposition(left, right) {
  if (left === right || left.length !== right.length) return false;
  const differences = [];
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) differences.push(index);
    if (differences.length > 2) return false;
  }
  return differences.length === 2
    && differences[1] === differences[0] + 1
    && left[differences[0]] === right[differences[1]]
    && left[differences[1]] === right[differences[0]];
}

function addMessage(message, className, catalogAction = null) {
  const bubble = document.createElement("div");
  bubble.className = `chat-message ${className}`;
  const text = document.createElement("span");
  text.textContent = message;
  bubble.append(text);
  if (className === "bot-message" && catalogAction) {
    if (catalogAction.kind === "section") {
      const action = document.createElement("a");
      action.className = "chat-open-detail";
      action.href = catalogAction.target;
      action.textContent = "Explore visual demos ↗";
      action.dataset.anantaSection = "";
      bubble.append(action);
    } else if (catalogAction.kind === "choices") {
      const choices = document.createElement("div");
      choices.className = "chat-choice-list";
      choices.setAttribute("aria-label", "Choose a response");
      catalogAction.choices.forEach((choice) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chat-choice";
        button.dataset.prompt = choice;
        button.textContent = choice;
        choices.append(button);
      });
      bubble.append(choices);
    } else if (catalogAction.kind === "catalog-list") {
      const results = document.createElement("div");
      results.className = "chat-catalog-results";
      results.setAttribute("aria-label", `All ${catalogAction.catalog}`);
      catalogAction.entries.forEach((entry) => {
        const action = document.createElement("button");
        action.type = "button";
        action.className = "chat-catalog-result";
        const name = document.createElement("strong");
        name.textContent = entry.name;
        const detail = document.createElement("span");
        detail.textContent = entry.detail;
        action.append(name, detail);
        if (entry.kind === "service") action.dataset.anantaService = String(entry.index);
        if (entry.kind === "product") action.dataset.anantaProduct = entry.id;
        if (entry.kind === "project") action.dataset.anantaProject = String(entry.index);
        results.append(action);
      });
      bubble.append(results);
    } else if (catalogAction.kind === "recommendations") {
      const choices = document.createElement("div");
      choices.className = "chat-recommendations";
      catalogAction.indexes.forEach((index) => {
        const service = serviceCatalog[index];
        const action = document.createElement("button");
        action.type = "button";
        action.className = "chat-open-detail";
        action.textContent = `Explore ${service.title} ↗`;
        action.dataset.anantaService = String(index);
        choices.append(action);
      });
      bubble.append(choices);
    } else {
      const action = document.createElement("button");
      action.type = "button";
      action.className = "chat-open-detail";
      action.textContent = "Open details ↗";
      if (catalogAction.kind === "service") action.dataset.anantaService = String(catalogAction.index);
      if (catalogAction.kind === "product") action.dataset.anantaProduct = catalogAction.id;
      if (catalogAction.kind === "project") action.dataset.anantaProject = String(catalogAction.index);
      bubble.append(action);
    }
  }
  chatMessages.append(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

function clearChat() {
  lastAnantaServiceIndex = null;
  lastAnantaContext = null;
  lastAnantaCatalogAction = null;
  anantaDiscovery = null;
  lastAnantaCatalog = null;
  setChatMainMenuOpen(true);
  chatMessages.replaceChildren();
  addMessage("Conversation cleared. Browse services, products, hardware, projects, and visual demos, or ask me about a project idea.", "bot-message");
}

chatMessages.addEventListener("click", (event) => {
  const action = event.target.closest("[data-ananta-service], [data-ananta-product], [data-ananta-project], [data-ananta-section]");
  if (!action) return;
  setChatOpen(false);
  if (action.dataset.anantaSection !== undefined) return;
  if (action.dataset.anantaService !== undefined) openService(Number(action.dataset.anantaService), chatLauncher);
  if (action.dataset.anantaProduct !== undefined) openProduct(action.dataset.anantaProduct, chatLauncher);
  if (action.dataset.anantaProject !== undefined) openProject(Number(action.dataset.anantaProject), chatLauncher);
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendChatMessage(chatInput.value);
  chatInput.value = "";
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactConfirmation.textContent = "";
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const honeypot = String(formData.get("bot-field") ?? "").trim();
  if (honeypot) {
    contactForm.reset();
    contactStatus.textContent = "Thanks. If your inquiry is a good fit, the team will be in touch.";
    return;
  }

  if (window.location.protocol === "file:") {
    contactEmailFallback.href = createInquiryMailto(formData);
    contactEmailFallback.hidden = false;
    contactEmailFallback.click();
    contactStatus.textContent = "Your email app should open with a prefilled inquiry. If it doesn't, use the email link above.";
    contactConfirmation.textContent = "This website cannot confirm whether your email was sent.";
    return;
  }

  if (contactForm.dataset.submitting === "true") return;
  contactForm.dataset.submitting = "true";
  contactEmailFallback.href = createInquiryMailto(formData);
  contactEmailFallback.hidden = true;
  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  contactStatus.textContent = "Sending your inquiry...";
  const encodedForm = new URLSearchParams(formData).toString();

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encodedForm,
  }).then((response) => {
    if (!response.ok) throw new Error(`Inquiry submission failed with status ${response.status}`);
    contactForm.reset();
    contactStatus.textContent = "Your inquiry was submitted through the website form. Thank you for contacting Goldsmith.";
    contactConfirmation.textContent = "Submission confirmed by the website form service.";
  }).catch((error) => {
    console.error("Could not submit the project inquiry.", error);
    contactStatus.textContent = "We couldn't submit this form. Please email services@goldsmith.gold.in and include your project details.";
    contactConfirmation.textContent = "No submission confirmation was received. Your details remain in the form; you can open a prefilled email instead.";
    contactEmailFallback.hidden = false;
  }).finally(() => {
    delete contactForm.dataset.submitting;
    submitButton.disabled = false;
  });
});

function createInquiryMailto(formData) {
  const subject = `Goldsmith project inquiry: ${formData.get("service")}`;
  const body = [
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    `Area of interest: ${formData.get("service")}`,
    "Privacy notice acknowledged: yes",
    "",
    formData.get("message")
  ].join("\n");
  return `mailto:services@goldsmith.gold.in?${new URLSearchParams({ subject, body })}`;
}

document.querySelector("#inquiry-export").addEventListener("click", () => {
  if (!contactForm.reportValidity()) {
    contactConfirmation.textContent = "Complete the required inquiry fields before downloading a copy.";
    return;
  }
  const formData = new FormData(contactForm);
  const content = [
    "GOLDSMITH PROJECT INQUIRY — LOCAL COPY",
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    `Area of interest: ${formData.get("service")}`,
    "Privacy notice acknowledged: yes",
    "",
    "Project details:",
    String(formData.get("message") ?? ""),
    "",
    "This file is a local copy only; it has not been submitted to Goldsmith."
  ].join("\n");
  downloadTextFile("goldsmith-project-inquiry.txt", content);
  contactConfirmation.textContent = "Inquiry copy downloaded to your device. This did not submit the inquiry.";
});

document.querySelector("#brief-create").addEventListener("click", () => {
  const service = document.querySelector("#brief-service").value;
  const goal = document.querySelector("#brief-goal").value.trim();
  const users = document.querySelector("#brief-users").value.trim();
  const timeline = document.querySelector("#brief-timeline").value;
  const constraints = document.querySelector("#brief-constraints").value.trim();
  const details = [
    service && `Area of interest: ${service}`,
    goal && `Goal: ${goal}`,
    users && `Intended users: ${users}`,
    timeline && `Preferred timeline: ${timeline}`,
    constraints && `Important needs or constraints: ${constraints}`
  ].filter(Boolean);
  if (!details.length) {
    document.querySelector("#brief-builder-status").textContent = "Add at least one project detail to create a draft.";
    return;
  }

  const contactService = document.querySelector("#contact-service");
  if (service) contactService.value = service;
  const message = document.querySelector("#contact-message");
  const marker = "\n\n--- Project brief ---\n";
  const existing = message.value;
  const baseMessage = existing.includes(marker) ? existing.slice(0, existing.indexOf(marker)).trimEnd() : existing.trimEnd();
  const draft = `${baseMessage ? `${baseMessage}${marker}` : "--- Project brief ---\n"}${details.join("\n")}`;
  if (draft.length > message.maxLength) {
    document.querySelector("#brief-builder-status").textContent = "The draft would exceed the message limit. Shorten the existing message or details and try again.";
    return;
  }
  message.value = draft;
  document.querySelector("#brief-builder-status").textContent = "Draft added. Review and edit your message before submitting.";
  message.focus();
});
