import {
  BarChart3,
  Bike,
  Boxes,
  BrainCircuit,
  Building2,
  CircuitBoard,
  Cloud,
  Code2,
  Database,
  FileArchive,
  Flame,
  Gauge,
  Github,
  Landmark,
  Linkedin,
  LucideIcon,
  Mail,
  Map,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Users,
  Zap,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
}

export interface CurrentSignal {
  label: string
  value: string
  detail: string
}

export interface ExperienceChapter {
  company: string
  role: string
  period: string
  chapter: string
  training: string
  story: string
  signals: string[]
  metric: string
  visual: "ops-flow" | "wealth-graph" | "mobility-grid" | "trust-network"
  icon: LucideIcon
}

export interface ProjectCaseStudy {
  name: string
  label: string
  summary: string
  product: string
  engineering: string
  difficulty: string
  impact: string
  stack: string[]
  href?: string
  accent: "cyan" | "violet" | "amber" | "emerald"
  icon: LucideIcon
}

export interface Principle {
  title: string
  description: string
}

export interface StackNode {
  label: string
  detail: string
  icon: LucideIcon
}

export interface ContactLink {
  label: string
  value: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: "Now", href: "#now" },
  { label: "Journey", href: "#journey" },
  { label: "Restro AI", href: "#restro-ai" },
  { label: "Projects", href: "#projects" },
  { label: "Principles", href: "#principles" },
]

export const commandItems: NavItem[] = [
  { label: "Open the hero", href: "#hero" },
  { label: "See what I am building now", href: "#now" },
  { label: "Read the experience journey", href: "#journey" },
  { label: "Explore Restro AI", href: "#restro-ai" },
  { label: "View signature projects", href: "#projects" },
  { label: "Read product principles", href: "#principles" },
  { label: "Contact Aditya", href: "#contact" },
]

export const currentSignals: CurrentSignal[] = [
  {
    label: "Now",
    value: "Building Restro AI",
    detail: "The current idea I keep returning to: restaurant software that helps teams think ahead.",
  },
  {
    label: "Mode",
    value: "Product-first Android",
    detail: "Small screens, high intent, calm interactions, and no wasted taps.",
  },
  {
    label: "Signal",
    value: "Messy products welcome",
    detail: "I like products that have real users, pressure, edge cases, and business reality baked in.",
  },
]

export const heroRoles = [
  "Android Developer at PhonePe",
  "Previously close to product, fintech, and marketplace reality at Fi and Phool",
  "Building Restro AI and the kind of software that survives real users",
  "Product-minded engineer who enjoys messy products",
]

export const experienceChapters: ExperienceChapter[] = [
  {
    company: "Phool.co",
    role: "Startup operations and marketplace work",
    period: "Early chapter",
    chapter: "Startup hunger, marketing work, and marketplace reality",
    training: "The non-code parts of a startup still move the company.",
    story:
      "At Phool, I was not there as an engineer. That was the point. I worked closer to marketing, operations, listings, and marketplaces. It gave me a useful respect for the non-code parts of a startup.",
    signals: [
      "Worked across product listings, marketplaces, and high-demand festive sales pressure",
      "Understood how Amazon, Blinkit, Flipkart, and Myntra visibility affects real business outcomes",
      "Built hunger for startup work by doing the unglamorous things that still move the company",
    ],
    metric: "Marketplace pressure",
    visual: "ops-flow",
    icon: Boxes,
  },
  {
    company: "Fi",
    role: "Android product engineering",
    period: "Fintech chapter",
    chapter: "Product clarity, founder proximity, and calm finance UX",
    training: "Good fintech products reduce anxiety instead of adding more screens.",
    story:
      "Fi showed me how much product quality comes from taste and focus. I worked close to founder-level priorities on Wealth Builder, a feature built to create traction and make investing feel less intimidating.",
    signals: [
      "Worked on one of the most important marketing and traction-building product bets",
      "Built Android features around wealth, AI-assisted experiences, and consumer clarity",
      "Learned how good fintech products reduce anxiety instead of adding more screens",
    ],
    metric: "Consumer clarity",
    visual: "wealth-graph",
    icon: Landmark,
  },
  {
    company: "Ownly / Rapido",
    role: "Founding mobile engineer",
    period: "Founding chapter",
    chapter: "Founding engineering, ambiguity, and taking responsibility",
    training: "Real teams do not wait for perfect timing.",
    story:
      "Ownly was raw startup energy. I joined as a founding mobile engineer, took responsibility across surfaces, and learned how to ship when the product, team, and assumptions are all moving at once.",
    signals: [
      "Helped build Android, iOS, and web foundations using Kotlin Multiplatform and Compose Multiplatform",
      "Designed and shipped a full restaurant POS in 20 days, which went live and processed real orders in its first month",
      "Took ownership beyond my lane and learned how fast reality exposes weak product assumptions",
    ],
    metric: "20-day POS",
    visual: "mobility-grid",
    icon: Bike,
  },
  {
    company: "PhonePe",
    role: "Android Engineer",
    period: "Current chapter",
    chapter: "Trust, money movement, and fast shipping environments",
    training: "Money movement teaches product judgment quickly.",
    story:
      "PhonePe taught me how serious product work feels when money is involved. I work in a fast-moving, high-ownership pod around DigiMetal, where reliability and speed both matter.",
    signals: [
      "Shipped DigiGold and DigiSilver features for 700M+ registered PhonePe users across India",
      "Built across DigiGold and DigiSilver journeys where trust, clarity, and edge cases matter",
      "Took ownership of flows that needed product judgment, debugging depth, and calm execution",
    ],
    metric: "Trust systems",
    visual: "trust-network",
    icon: Phone,
  },
]

export const restroMetrics = [
  { label: "Projected dinner rush", value: "7:40 PM", icon: Zap },
  { label: "Waste risk", value: "-23%", icon: Gauge },
  { label: "Revenue lift signal", value: "+18.4%", icon: BarChart3 },
]

export const restroSignals = [
  "Prep 14% more paneer before 7:30 PM",
  "Move one floor staff member to checkout after 8 PM",
  "Reduce tomorrow's tomato order by 9%",
  "South outlet demand is trending above baseline",
]

export const restroFlow = [
  { label: "Orders", detail: "POS, delivery, walk-ins", icon: UploadCloud },
  { label: "Context", detail: "Weather, events, local demand", icon: Cloud },
  { label: "Prediction", detail: "Rush, waste, staffing, revenue", icon: BrainCircuit },
  { label: "Action", detail: "Simple operating recommendations", icon: Sparkles },
]

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    name: "Restro AI",
    label: "Restaurant intelligence",
    summary: "Restaurants already have software. Most of it still does not help them think ahead.",
    product:
      "The idea is simple: give restaurant teams a calm operating layer that can read demand, inventory, staffing, and waste before the day gets away from them.",
    engineering:
      "The product should feel less like another dashboard and more like a second brain for the person running the floor.",
    difficulty:
      "A restaurant tool has to respect rush hour. It cannot make operators parse complexity when the floor is already moving.",
    impact: "A current build shaped by restaurant workflows, operational pressure, and product empathy.",
    stack: ["Next.js", "AI systems", "Forecasting UX", "Dashboards"],
    href: "https://restro-ai.com",
    accent: "cyan",
    icon: BrainCircuit,
  },
  {
    name: "FitSpot",
    label: "Consumer fitness product",
    summary: "One of those late-night product ideas that has to survive outside a demo video.",
    product:
      "Built around the question of how a consumer product can feel motivating without becoming another chore.",
    engineering:
      "Focused on mobile-first flows, stateful user journeys, clean interaction loops, and fast feedback moments.",
    difficulty:
      "The challenge was keeping the loop simple enough to feel alive instead of administrative.",
    impact: "Consumer UX, habit loops, and mobile product instincts.",
    stack: ["Android", "Kotlin", "Consumer UX", "Product loops"],
    accent: "violet",
    icon: Flame,
  },
  {
    name: "FileHoster",
    label: "Developer utility",
    summary: "A practical utility product where the value is speed, clarity, and not making the user think.",
    product:
      "Helps users move from file to shareable artifact without ceremony.",
    engineering:
      "Built around upload flows, storage boundaries, secure link states, and predictable failure handling.",
    difficulty:
      "The invisible work is making upload, link, and failure states feel predictable.",
    impact: "Utility-grade UX, storage boundaries, and clean system states.",
    stack: ["Storage", "APIs", "Auth states", "Web UX"],
    accent: "emerald",
    icon: FileArchive,
  },
  {
    name: "HonReview",
    label: "Trust and review systems",
    summary: "A trust product exploring how people decide what feels credible online.",
    product:
      "Turns messy opinions into a clearer trust surface without pretending human reviews are perfectly objective.",
    engineering:
      "Structured around review capture, moderation signals, ranking logic, and high-signal presentation.",
    difficulty:
      "The challenge is not only ranking. It is keeping noise, bias, and low-effort content from dominating the experience.",
    impact: "Credibility, ranking, moderation, and human-centered product thinking.",
    stack: ["Trust UX", "Ranking", "Moderation", "Data modeling"],
    accent: "amber",
    icon: MessageSquareText,
  },
]

export const principles: Principle[] = [
  {
    title: "Product before polish",
    description:
      "I like polish, but only after the core problem is honest. Pretty screens do not save confused products.",
  },
  {
    title: "Speed with taste",
    description:
      "I enjoy moving fast. I care even more about whether the thing feels thoughtful when someone finally uses it.",
  },
  {
    title: "Calm beats clever",
    description:
      "The best products usually feel obvious after someone else has done the hard thinking.",
  },
  {
    title: "Build past the demo",
    description:
      "Some of my favorite projects started as random late-night ideas. The good ones survive outside demo videos.",
  },
]

export const stackNodes: StackNode[] = [
  { label: "Android", detail: "Kotlin, Compose, lifecycle, performance", icon: Phone },
  { label: "AI UX", detail: "Agents, orchestration, recommendation surfaces", icon: BrainCircuit },
  { label: "Product Systems", detail: "Flows, metrics, trust, feedback loops", icon: CircuitBoard },
  { label: "Web Apps", detail: "Next.js, TypeScript, responsive interfaces", icon: Code2 },
  { label: "Data Products", detail: "Dashboards, forecasting, operational signals", icon: Database },
  { label: "Reliability", detail: "Edge cases, recovery, calm failure states", icon: ShieldCheck },
]

export const contactLinks: ContactLink[] = [
  { label: "Email", value: "adityabajaj2222@gmail.com", href: "mailto:adityabajaj2222@gmail.com", icon: Mail },
  { label: "LinkedIn", value: "aditya-bajaj-6128811b6", href: "https://www.linkedin.com/in/aditya-bajaj-6128811b6/", icon: Linkedin },
  { label: "GitHub", value: "adiVIT", href: "https://github.com/adiVIT", icon: Github },
  { label: "Portfolio", value: "adityabajaj.me", href: "https://adityabajaj.me", icon: Building2 },
]

export const architectureNodes = [
  { label: "Restaurant events", detail: "Orders, inventory, staff, waste", icon: Map },
  { label: "Signal layer", detail: "Clean, normalize, detect patterns", icon: CircuitBoard },
  { label: "AI planner", detail: "Forecast and recommend actions", icon: BrainCircuit },
  { label: "Operator UI", detail: "Calm decisions before rush hour", icon: Users },
]
