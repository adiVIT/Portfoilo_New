"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  Bike,
  Boxes,
  BrainCircuit,
  Building2,
  ChevronRight,
  CircuitBoard,
  Cpu,
  Gauge,
  Github,
  Landmark,
  Linkedin,
  Mail,
  Map,
  MoveUpRight,
  Orbit,
  Phone,
  Route,
  Sparkles,
  ThumbsUp,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Paths", href: "#paths" },
  { label: "Builds", href: "#restro-ai" },
  { label: "Journeys", href: "#journeys" },
  { label: "Principles", href: "#about" },
  { label: "Contact", href: "#contact" },
]

const explorerPaths = [
  {
    id: "product",
    title: "Product Mind",
    label: "How I think",
    description: "For the person checking if I understand users, taste, and messy product reality.",
    destination: "#console",
    note: "Most software breaks emotionally before it breaks technically.",
  },
  {
    id: "builder",
    title: "Builder Mode",
    label: "What I am making",
    description: "For the person who wants to see the current idea I keep returning to.",
    destination: "#restro-ai",
    note: "Restaurants already have software. Most of it still does not help them think ahead.",
  },
  {
    id: "journey",
    title: "Operator Path",
    label: "Where I learned",
    description: "For the person looking for capability, not just company names.",
    destination: "#journeys",
    note: "Trust, clarity, ambiguity, and business pressure all teach different things.",
  },
  {
    id: "principles",
    title: "Working Style",
    label: "How I build",
    description: "For the person wondering what I am like when the product gets real.",
    destination: "#about",
    note: "Pretty screens do not save confused products.",
  },
]

const restroFeatures = [
  "Revenue forecasting",
  "Inventory clarity",
  "Peak-hour prediction",
  "Simple analytics",
  "Staffing signals",
  "Multi-location view",
]

const builderConsoleLines = [
  { command: "idea", response: "Ideas are easy. Making them survive reality is the fun part." },
  { command: "thought", response: "Most software breaks emotionally before it breaks technically." },
  { command: "shipping", response: "Build the smallest honest version. Then let real users make it uncomfortable." },
  { command: "notes", response: "Too many open tabs. One useful thread. Probably redesigning this section again." },
]

const aiRecommendationFeed = [
  "Prep 14% more paneer before 7:30 PM",
  "Move one floor staff member to checkout after 8 PM",
  "Reduce tomorrow’s tomato order by 9%",
  "South outlet demand is trending above baseline",
]

const heatmapCells = [42, 58, 71, 64, 85, 93, 76, 69, 54, 88, 97, 82, 61, 73, 90, 66]

const hiddenTorchNotes = [
  { text: "built at 3AM energy", className: "left-6 top-[18rem]" },
  { text: "too many tabs, one useful thread", className: "right-8 top-[32rem]" },
  { text: "pretty screens do not save confused products", className: "left-8 top-[58rem]" },
  { text: "real users make every idea honest", className: "right-10 top-[82rem]" },
]

const mobileDockItems = [
  { label: "Paths", href: "#paths" },
  { label: "Build", href: "#restro-ai" },
  { label: "Story", href: "#journeys" },
  { label: "Talk", href: "#contact" },
]

const pocketCards = [
  { label: "Now", value: "Building Restro AI" },
  { label: "Mode", value: "Product-first Android" },
  { label: "Signal", value: "Messy products welcome" },
]

const mobileSkillCards = [
  {
    label: "Android craft",
    title: "Interfaces that feel fast, calm, and native.",
    detail: "I care about touch states, loading moments, empty states, motion, and the little details that make an app feel alive.",
    icon: Phone,
  },
  {
    label: "System thinking",
    title: "Mobile flows that survive real users.",
    detail: "Payments, trust, retries, offline-ish moments, and production debugging taught me to design beyond the happy path.",
    icon: CircuitBoard,
  },
  {
    label: "Product speed",
    title: "Small screens. High intent. No wasted taps.",
    detail: "The best mobile products compress complexity without making users feel rushed or lost.",
    icon: Zap,
  },
]

const journeyItems = [
  {
    company: "Phool.co",
    chapter: "Startup hunger, marketing work, and marketplace reality",
    icon: Boxes,
    glow: "shadow-rose-500/20",
    story:
      "At Phool, I was not there as an engineer. That was the point. I worked closer to marketing, operations, listings, and marketplaces. It gave me a useful respect for the non-code parts of a startup.",
    signals: [
      "Worked across product listings, marketplaces, and high-demand festive sales pressure",
      "Understood how Amazon, Blinkit, Flipkart, and Myntra visibility affects real business outcomes",
      "Built hunger for startup work by doing the unglamorous things that still move the company",
    ],
    visual: "ops flow",
  },
  {
    company: "Fi",
    chapter: "Product clarity, founder proximity, and calm finance UX",
    icon: Landmark,
    glow: "shadow-cyan-500/20",
    story:
      "Fi showed me how much product quality comes from taste and focus. I worked close to founder-level priorities on Wealth Builder, a feature built to create traction and make investing feel less intimidating.",
    signals: [
      "Worked on one of the most important marketing and traction-building product bets",
      "Built Android features around wealth, AI-assisted experiences, and consumer clarity",
      "Learned how good fintech products reduce anxiety instead of adding more screens",
    ],
    visual: "craft loops",
  },
  {
    company: "Ownly / Rapido",
    chapter: "Founding engineering, ambiguity, and taking responsibility",
    icon: Bike,
    glow: "shadow-orange-500/20",
    story:
      "Ownly was raw startup energy. I joined as a founding mobile engineer, took responsibility across surfaces, and learned how to ship when the product, team, and assumptions are all moving at once.",
    signals: [
      "Helped build Android, iOS, and web foundations using Kotlin Multiplatform and Compose Multiplatform",
      "Designed and shipped a full restaurant POS in 20 days because real teams do not wait for perfect timing",
      "Took ownership beyond my lane and learned how fast reality exposes weak product assumptions",
    ],
    visual: "mobility grid",
  },
  {
    company: "PhonePe",
    chapter: "Trust, money movement, and fast shipping environments",
    icon: Phone,
    story:
      "PhonePe taught me how serious product work feels when money is involved. I work in a fast-moving, high-ownership pod around DigiMetal, where reliability and speed both matter.",
    signals: [
      "Shipped features quickly inside one of the biggest and fastest-moving product environments I have worked in",
      "Built across DigiGold and DigiSilver journeys where trust, clarity, and edge cases matter",
      "Took ownership of flows that needed product judgment, debugging depth, and calm execution",
    ],
    visual: "wealth graph",
  },
]

const founderSignals = [
  "Android architecture",
  "Fintech products",
  "AI tools",
  "Restaurant workflows",
  "Marketplace ops",
  "Consumer UX",
  "Fast shipping",
  "Messy products",
]

const principles = [
  {
    title: "Product before polish",
    description: "I like polish, but only after the core problem is honest. Pretty screens do not save confused products.",
  },
  {
    title: "Speed with taste",
    description: "I enjoy moving fast. I care even more about whether the thing feels thoughtful when someone finally uses it.",
  },
  {
    title: "Build past the demo",
    description: "Some of my favorite projects started as random late-night ideas. The good ones survive outside demo videos.",
  },
]

const obsessions = [
  "AI Agents",
  "Consumer AI",
  "Android Systems",
  "Product Strategy",
  "Startup Building",
  "Human-Centered Software",
]

const stackItems = ["Kotlin", "Android", "Next.js", "TypeScript", "AI UX", "APIs", "Data Products", "System Design"]

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

interface SectionEyebrowProps {
  children: React.ReactNode
  className?: string
}

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-200 sm:rounded-full sm:border sm:border-cyan-100/15 sm:bg-cyan-100/[0.045] sm:px-3 sm:py-1 sm:shadow-xl sm:shadow-cyan-950/20 sm:backdrop-blur-xl",
        className,
      )}
    >
      <Sparkles className="h-3.5 w-3.5 text-cyan-100" />
      {children}
    </div>
  )
}

function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[1.5rem] border border-white/[0.09] bg-white/[0.032] shadow-xl shadow-black/15 ring-1 ring-white/[0.025] sm:rounded-[2rem] sm:border-white/12 sm:bg-white/[0.052] sm:shadow-2xl sm:shadow-cyan-950/20 sm:backdrop-blur-2xl",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-px rounded-[inherit] bg-[radial-gradient(circle_at_20%_0%,rgba(125,211,252,0.08),transparent_34%),radial-gradient(circle_at_90%_15%,rgba(216,180,254,0.07),transparent_28%)] opacity-80"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
      <div className="relative">{children}</div>
    </div>
  )
}

function PageLabel({ title }: { title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.26em] text-slate-500">
      <span className="h-px w-8 bg-white/20" />
      <span>{title}</span>
    </div>
  )
}

function BookProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-px w-full origin-left bg-white/55"
      style={{ scaleX }}
    />
  )
}

function MobileDock() {
  return (
    <nav
      className="fixed inset-x-4 bottom-4 z-50 rounded-3xl border border-white/10 bg-black/80 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl md:hidden"
      aria-label="Mobile quick paths"
    >
      <div className="grid grid-cols-4 gap-1">
        {mobileDockItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl px-1.5 py-2.5 text-center text-[11px] font-medium text-slate-300 transition active:scale-95 active:bg-white/[0.08]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

function SmoothScroll() {
  return null
}

function TorchCursor() {
  const shouldReduceMotion = useReducedMotion()
  const mouseX = useMotionValue(-400)
  const mouseY = useMotionValue(-400)
  const smoothX = useSpring(mouseX, { damping: 24, stiffness: 1200, mass: 0.08 })
  const smoothY = useSpring(mouseY, { damping: 24, stiffness: 1200, mass: 0.08 })

  useEffect(() => {
    if (shouldReduceMotion) return

    document.documentElement.classList.add("torch-cursor")

    function handlePointerMove(event: PointerEvent) {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }

    window.addEventListener("pointermove", handlePointerMove)
    return () => {
      document.documentElement.classList.remove("torch-cursor")
      window.removeEventListener("pointermove", handlePointerMove)
    }
  }, [mouseX, mouseY, shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_42%,transparent_72%)] opacity-90 will-change-transform md:block"
        style={{ x: smoothX, y: smoothY }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[71] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45 bg-black/50 will-change-transform md:block"
        style={{ x: smoothX, y: smoothY }}
      />
    </>
  )
}

function HiddenTorchNotes() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] hidden md:block">
      {hiddenTorchNotes.map((note) => (
        <div
          key={note.text}
          className={cn(
            "torch-secret absolute max-w-44 rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-xs leading-5 text-white/80 opacity-0 shadow-2xl shadow-black/40 backdrop-blur-xl transition-opacity duration-300",
            note.className,
          )}
        >
          {note.text}
        </div>
      ))}
    </div>
  )
}

function AnimatedBackground() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#02030a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(45,212,191,0.2),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_60%_84%,rgba(244,114,182,0.1),transparent_28%),linear-gradient(180deg,#02030a_0%,#050716_46%,#02030a_100%)]" />
      <div aria-hidden="true" className="absolute left-[18%] top-[-18rem] h-[42rem] w-[42rem] rounded-full bg-cyan-300/[0.055] blur-3xl" />
      <div aria-hidden="true" className="absolute right-[-12rem] top-[12rem] h-[36rem] w-[36rem] rounded-full bg-fuchsia-300/[0.045] blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-[-16rem] left-[25%] h-[34rem] w-[34rem] rounded-full bg-emerald-300/[0.035] blur-3xl" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_256_256%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noise%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.8%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22256%22_height=%22256%22_filter=%22url(%23noise)%22_opacity=%220.45%22/%3E%3C/svg%3E')]" />
      {[0, 1, 2, 3, 4].map((item) => (
        <motion.div
          key={item}
          aria-hidden="true"
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan-100/30 shadow-[0_0_18px_rgba(125,211,252,0.22)]"
          style={{
            left: `${16 + item * 17}%`,
            top: `${24 + (item % 3) * 18}%`,
          }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, -18, 0],
                  opacity: [0.18, 0.55, 0.18],
                }
          }
          transition={{ duration: 5 + item, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: item * 0.4 }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.78))]" />
    </div>
  )
}

function Navigation() {
  const [likeCount, setLikeCount] = useState(127)

  useEffect(() => {
    const storedLikeCount = window.localStorage.getItem("portfolio-like-count")
    if (storedLikeCount) setLikeCount(Number(storedLikeCount))
  }, [])

  function handleLike() {
    setLikeCount((currentCount) => {
      const nextCount = currentCount + 1
      window.localStorage.setItem("portfolio-like-count", String(nextCount))
      return nextCount
    })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#040612]/55 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-8 sm:py-4" aria-label="Primary">
        <Link href="#" className="group flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-2xl border border-cyan-100/20 bg-cyan-100/[0.08] text-sm font-semibold text-white shadow-xl shadow-cyan-950/20">
            AB
          </span>
          <span className="truncate text-sm font-medium text-slate-200">
            Aditya<span className="hidden sm:inline"> Bajaj</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-cyan-100/[0.08] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-none items-center gap-2">
          <Button
            type="button"
            onClick={handleLike}
            variant="outline"
            className="h-10 rounded-full border-white/15 bg-white/[0.04] px-3 text-white transition hover:-translate-y-0.5 hover:border-cyan-100/25 hover:bg-cyan-100/[0.08] sm:px-4"
          >
            <ThumbsUp className="mr-1.5 h-4 w-4 sm:mr-2" />
            {likeCount}
          </Button>
          <Button asChild className="hidden rounded-full bg-white text-black shadow-xl shadow-cyan-950/20 transition hover:-translate-y-0.5 hover:bg-cyan-100 sm:inline-flex">
            <Link href="mailto:adityabajaj2222@gmail.com">
              Let&apos;s Build
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

function BuilderConsoleSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="console" className="px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6 }}
        >
          <PageLabel title="Thinking Log" />
          <SectionEyebrow>Thinking log</SectionEyebrow>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            A small window into how I think while building.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Half-formed thoughts, product beliefs, experiments, and the kind of notes that usually start in too many
            open tabs.
          </p>
        </motion.div>

        <GlassCard className="min-w-0 overflow-hidden p-4 sm:p-5">
          <div className="relative rounded-[1.5rem] border border-white/10 bg-black/45 p-4 font-mono shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              </div>
              <span className="text-xs text-slate-500">founder-os / live</span>
            </div>

            <div className="space-y-4">
              {builderConsoleLines.map((line, index) => (
                <motion.div
                  key={line.command}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: index * 0.16 }}
                >
                  <p className="text-sm text-slate-200">
                    <span className="text-slate-500">aditya@build</span> ~ % {line.command}
                  </p>
                  <motion.p
                    className="mt-1 text-sm leading-6 text-slate-300"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.25 + index * 0.16 }}
                  >
                    {line.response}
                  </motion.p>
                </motion.div>
              ))}
              <div className="flex items-center gap-2 pt-2 text-sm text-cyan-100">
                <span className="text-slate-500">aditya@build</span> ~ %
                <motion.span
                  className="h-4 w-2 rounded-sm bg-white"
                  animate={shouldReduceMotion ? undefined : { opacity: [1, 0, 1] }}
                  transition={{ duration: 1.1, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function PathExplorerSection() {
  const [activePath, setActivePath] = useState(explorerPaths[0])

  return (
    <section id="paths" className="px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <PageLabel title="Choose a Path" />
          <SectionEyebrow>Explore</SectionEyebrow>
          <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
            Pick the route you care about.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Not everyone visits a portfolio for the same reason. Choose a path and the page will point you toward the
            part of me that matters most to you.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="grid gap-3" aria-label="Choose an exploration path">
            {explorerPaths.map((path, index) => {
              const isActive = activePath.id === path.id

              return (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => setActivePath(path)}
                  className={cn(
                    "group rounded-[1.5rem] border p-4 text-left transition duration-300 sm:p-5",
                    isActive
                      ? "border-white/25 bg-white/[0.075] text-white shadow-2xl shadow-black/25"
                      : "border-white/10 bg-white/[0.035] text-slate-400 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055] hover:text-slate-200",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Path 0{index + 1}</p>
                      <h3 className="mt-2 text-xl font-semibold">{path.title}</h3>
                    </div>
                    <ArrowRight className={cn("h-5 w-5 transition", isActive ? "text-cyan-100" : "text-slate-600 group-hover:text-slate-300")} />
                  </div>
                  <p className="mt-3 text-sm leading-6">{path.description}</p>
                </button>
              )
            })}
          </div>

          <GlassCard className="min-w-0 overflow-hidden p-4 sm:p-5 lg:p-8">
            <motion.div
              key={activePath.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="flex h-full flex-col justify-between"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-100">{activePath.label}</p>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">{activePath.title}</h3>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{activePath.note}</p>
              </div>

              <div className="mt-10">
                <Link
                  href={activePath.destination}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]"
                >
                  Follow this path
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

function HeroSection() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.35], [0, 90])
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-20 pt-28 sm:px-8 sm:pb-20 sm:pt-40">
      <motion.div
        style={{ y }}
        className="absolute right-8 top-28 hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 backdrop-blur-xl lg:block"
      >
        Currently building Restro AI
      </motion.div>

      <div className="mx-auto max-w-7xl">
        <motion.div initial={false} animate="visible" variants={fadeIn} transition={{ duration: 0.7 }}>
          <PageLabel title="Opening" />
          <SectionEyebrow>Product engineer. Independent builder.</SectionEyebrow>

          <h1 className="mt-7 max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:mt-8 sm:text-6xl lg:text-7xl xl:text-8xl">
            Ideas are easy. Making them survive reality is the fun part.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:mt-7 sm:text-xl sm:leading-8">
            I’m an Android Developer at PhonePe and a builder at heart. I care about products that work when users are
            impatient, teams are moving fast, and the real world refuses to behave like a neat mockup.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-white px-6 text-black shadow-xl shadow-cyan-950/20 transition active:scale-[0.98] hover:-translate-y-0.5 hover:bg-cyan-100">
              <Link href="#journeys">
                View Journeys
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/15 bg-white/[0.03] px-6 text-white transition active:scale-[0.98] hover:-translate-y-0.5 hover:border-cyan-100/25 hover:bg-cyan-100/[0.08] hover:text-white"
            >
              <Link href="mailto:adityabajaj2222@gmail.com">Let&apos;s Build</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full bg-white/[0.03] text-slate-200 transition active:scale-[0.98] hover:-translate-y-0.5 hover:bg-fuchsia-100/[0.07] hover:text-white"
            >
              <Link href="#restro-ai">
                Restro AI
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <motion.div
            className="mt-8 flex flex-wrap gap-2 sm:mt-10"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.045,
                },
              },
            }}
          >
            {founderSignals.map((signal) => (
              <motion.span
                key={signal}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-sm text-slate-300 shadow-lg shadow-black/20 backdrop-blur-xl transition active:scale-95 hover:-translate-y-0.5 hover:border-cyan-100/20 hover:bg-cyan-100/[0.07] hover:text-white"
              >
                {signal}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="relative mt-10 max-w-2xl overflow-hidden rounded-[1.5rem] border border-cyan-100/[0.12] bg-cyan-100/[0.035] p-4 text-slate-300 shadow-xl shadow-cyan-950/10 sm:mt-12 sm:rounded-[2rem] sm:border-white/10 sm:bg-white/[0.045] sm:p-5 sm:shadow-2xl sm:backdrop-blur-2xl"
          >
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/40 to-transparent" />
            <p className="text-base leading-7 sm:text-lg sm:leading-8">
              Most software breaks emotionally before it breaks technically. A finance app has to feel calm. A restaurant
              tool has to respect rush hour. A marketplace listing has to understand that visibility is survival.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-8 rounded-[1.5rem] border border-cyan-100/[0.1] bg-white/[0.035] p-4 shadow-xl shadow-black/20 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pocket OS</p>
                <p className="mt-1 text-sm font-medium text-white">Tap, explore, move fast</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05]">
                <Sparkles className="h-4 w-4 text-cyan-100" />
              </div>
            </div>

            <div className="mt-5 grid gap-3" aria-label="Mobile profile highlights">
              {pocketCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/[0.07] bg-black/20 p-3 active:scale-[0.98]"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">{card.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

function RestroAiSection() {
  const shouldReduceMotion = useReducedMotion()
  const [activeMobileSkill, setActiveMobileSkill] = useState(mobileSkillCards[0])

  return (
    <section id="restro-ai" className="relative px-4 py-20 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={fadeIn}
          transition={{ duration: 0.7 }}
          className="mb-10 max-w-3xl"
        >
          <PageLabel title="Current Build" />
          <SectionEyebrow>Current build</SectionEyebrow>
          <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Restro AI is an idea I keep coming back to.
          </h2>
          <p className="mt-6 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Restaurants already have software. Most of it still does not help them think ahead. The idea is simple:
            give restaurant teams a calm operating layer that can read demand, inventory, staffing, and waste before
            the day gets away from them.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            I want it to feel less like another dashboard and more like a second brain for the person running the floor.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full bg-white text-black hover:bg-slate-200">
              <Link href="https://restro-ai.com" target="_blank" rel="noreferrer">
                Visit restro-ai.com
                <MoveUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/15 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="#journeys">See what shaped the thinking</Link>
            </Button>
          </div>
        </motion.div>

        <GlassCard className="hidden min-w-0 overflow-hidden p-3 sm:block sm:p-6 lg:p-8">
          <div className="relative grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-4 shadow-2xl sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Restaurant intelligence</p>
                  <h3 className="mt-1 text-xl font-semibold leading-tight text-white sm:text-2xl">Tomorrow’s rush, a little less mysterious</h3>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-slate-200">
                  <BrainCircuit className="h-5 w-5" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Revenue view", value: "+18.4%", icon: BarChart3 },
                  { label: "Waste risk", value: "-23%", icon: Gauge },
                  { label: "Peak window", value: "7:40 PM", icon: Zap },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                    <item.icon className="mb-6 h-5 w-5 text-slate-300" />
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-white">Demand curve</p>
                  <span className="rounded-full bg-white/[0.06] px-2 py-1 text-xs text-slate-300">live</span>
                </div>
                <div className="flex h-36 items-end gap-1.5 sm:h-44 sm:gap-2">
                  {[44, 52, 68, 61, 74, 86, 92, 88, 96, 73, 67, 58].map((height, index) => (
                    <motion.div
                      key={`${height}-${index}`}
                      className="flex-1 rounded-t-xl bg-white/45"
                      initial={{ height: 12, opacity: 0.4 }}
                      whileInView={{ height: `${height}%`, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.04 }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-white">Demand heatmap</p>
                    <span className="text-xs text-slate-500">BLR outlets</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {heatmapCells.map((intensity, index) => (
                      <motion.div
                        key={`${intensity}-${index}`}
                        className="aspect-square rounded-xl border border-white/10"
                        initial={{ opacity: 0.25 }}
                        whileInView={{ opacity: 0.45 + intensity / 180 }}
                        viewport={{ once: true }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: index * 0.025 }}
                        style={{
                          backgroundColor: `rgba(34, 211, 238, ${0.08 + intensity / 260})`,
                          boxShadow: `0 0 ${intensity / 3}px rgba(34, 211, 238, 0.16)`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-white">Staffing forecast</p>
                    <span className="rounded-full bg-white/[0.06] px-2 py-1 text-xs text-slate-300">stable</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Kitchen", value: 82 },
                      { label: "Floor", value: 64 },
                      { label: "Delivery", value: 74 },
                    ].map((item, index) => (
                      <div key={item.label}>
                        <div className="mb-1 flex justify-between text-xs text-slate-400">
                          <span>{item.label}</span>
                          <span>{item.value}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className="h-full rounded-full bg-white/55"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: index * 0.08 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {restroFeatures.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className="group rounded-3xl border border-white/10 bg-white/[0.045] p-4 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <div className="mb-5 h-2 w-2 rounded-full bg-white/45" />
                    <p className="font-medium text-white">{feature}</p>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">AI recommendation feed</p>
                  <motion.span
                    className="h-2 w-2 rounded-full bg-white/55"
                    animate={shouldReduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>
                <div className="space-y-3">
                  {aiRecommendationFeed.map((recommendation, index) => (
                    <motion.div
                      key={recommendation}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: index * 0.08 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-300"
                    >
                      {recommendation}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">A small belief</p>
                <p className="mt-4 text-2xl font-medium leading-tight text-white">
                  “Most good products are really just empathy scaled through software.”
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Forecast", "Recommend", "Act", "Learn"].map((step) => (
                    <span key={step} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-slate-300">
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="min-w-0 overflow-hidden p-4 sm:hidden">
          <div>
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Mobile craft</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Android instincts, not just screens.</h3>
                </div>
                <motion.div
                  className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.06]"
                  animate={shouldReduceMotion ? undefined : { scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Phone className="h-5 w-5 text-cyan-100" />
                </motion.div>
              </div>

              <div className="relative mt-6 overflow-hidden">
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-black/20 px-3 py-2">
                  <span className="text-xs text-slate-400">aditya.mobile</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                </div>

                <motion.div
                  key={activeMobileSkill.label}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-white/[0.08] bg-black/20 p-4"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <activeMobileSkill.icon className="h-5 w-5 text-slate-200" />
                    <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      live
                    </span>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">{activeMobileSkill.label}</p>
                  <h4 className="mt-3 text-xl font-semibold leading-tight tracking-[-0.03em] text-white">{activeMobileSkill.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{activeMobileSkill.detail}</p>
                </motion.div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {mobileSkillCards.map((skill) => {
                    const isActive = activeMobileSkill.label === skill.label

                    return (
                      <button
                        key={skill.label}
                        type="button"
                        onClick={() => setActiveMobileSkill(skill)}
                        className={cn(
                          "rounded-2xl px-2 py-3 text-center text-[11px] font-medium transition active:scale-95",
                          isActive
                            ? "bg-white/[0.09] text-white"
                            : "bg-white/[0.035] text-slate-500",
                        )}
                      >
                        {skill.label.split(" ")[0]}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                {["Jetpack Compose mindset", "Performance and lifecycle awareness", "Fintech-grade reliability"].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: index * 0.08 }}
                    className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-3"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-xl bg-white/[0.06] text-xs text-slate-300">0{index + 1}</span>
                    <span className="text-sm text-slate-300">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function JourneyVisual({ visual }: { visual: string }) {
  if (visual === "mobility grid") {
    return (
      <div className="relative h-24 overflow-hidden rounded-3xl border border-white/10 bg-black/30 sm:h-28">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <motion.div
          className="absolute left-4 top-1/2 h-1 w-28 rounded-full bg-white/35"
          initial={{ x: -30, opacity: 0.4 }}
          whileInView={{ x: 150, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          style={{ maxWidth: "calc(100% - 3rem)" }}
        />
        <motion.div
          className="absolute left-10 top-8 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.08] text-white shadow-xl shadow-black/20"
          initial={{ x: 0 }}
          whileInView={{ x: 150 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          style={{ maxWidth: "calc(100% - 4rem)" }}
        >
          <Route className="h-4 w-4" />
        </motion.div>
      </div>
    )
  }

  if (visual === "wealth graph") {
    return (
      <div className="flex h-24 items-end gap-1.5 rounded-3xl border border-white/10 bg-black/30 p-3 sm:h-28 sm:gap-2 sm:p-4">
        {[38, 52, 45, 68, 74, 86, 78, 92].map((height, index) => (
          <motion.div
            key={`${height}-${index}`}
            className="flex-1 rounded-t-lg bg-white/40"
            initial={{ height: 10 }}
            whileInView={{ height: `${height}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: index * 0.05 }}
          />
        ))}
      </div>
    )
  }

  if (visual === "ops flow") {
    return (
      <div className="grid h-24 grid-cols-3 gap-2 rounded-3xl border border-white/10 bg-black/30 p-3 sm:h-28 sm:gap-3 sm:p-4">
        {["Supply", "Route", "Demand"].map((label, index) => (
          <motion.div
            key={label}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-2 sm:p-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <Map className="h-4 w-4 text-rose-200" />
            <span className="text-xs text-slate-400">{label}</span>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative h-24 overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-3 sm:h-28 sm:p-4">
      <div className="relative flex h-full items-center justify-between gap-3">
        {[1, 2, 3].map((item, index) => (
          <motion.div
            key={item}
            className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] sm:h-14 sm:w-14"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <CircuitBoard className="h-5 w-5 text-slate-300" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function WorkSection() {
  return (
    <section id="journeys" className="px-4 py-20 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <PageLabel title="Journeys" />
            <SectionEyebrow>Capabilities through journeys</SectionEyebrow>
            <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
              Not just where I worked. What those places trained in me.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-400">
            Each environment taught a different kind of building: trust, clarity, ownership, ambiguity, and the boring
            business details that decide whether products actually work.
          </p>
        </div>

        <GlassCard className="min-w-0 overflow-hidden border-white/[0.08] bg-white/[0.025] p-4 shadow-black/20 sm:p-6 lg:p-8">
          <div className="absolute left-8 top-12 hidden h-[calc(100%-6rem)] w-px bg-white/10 md:block" />
          <motion.div
            className="absolute left-8 top-12 hidden h-24 w-px bg-white/35 md:block"
            initial={{ y: 0 }}
            whileInView={{ y: 420 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />

          <div className="relative grid gap-5">
            {journeyItems.map((journey, index) => (
              <motion.article
                key={journey.company}
                initial={{ opacity: 0, y: 34, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -6, rotateX: 1.5, rotateY: index % 2 === 0 ? -1.5 : 1.5 }}
                className="group relative ml-0 overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-black/20 p-4 transition sm:rounded-[1.7rem] sm:bg-black/25 sm:p-5 sm:shadow-xl sm:shadow-black/20 sm:backdrop-blur-xl sm:hover:-translate-y-1 sm:hover:border-white/18 sm:hover:bg-white/[0.035] md:ml-12 lg:p-6 [transform-style:preserve-3d]"
              >
                <div className="absolute -left-[3.7rem] top-8 hidden md:block">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-cyan-100 shadow-xl shadow-black/20">
                    <journey.icon className="h-5 w-5" />
                  </div>
                </div>
                <motion.div
                  aria-hidden="true"
                  className="absolute right-5 top-5 hidden h-24 w-24 rounded-full border border-white/10 md:block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24 + index * 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white/45" />
                </motion.div>
                <Orbit className="absolute right-14 top-14 hidden h-6 w-6 text-white/10 md:block" />

                <div className="relative grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
                  <div>
                    <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.06] text-cyan-100 md:hidden">
                        <journey.icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                        Chapter 0{index + 1}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-300">{journey.chapter}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                      {journey.company}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-slate-300">{journey.story}</p>
                  </div>

                  <div className="grid gap-4">
                    <JourneyVisual visual={journey.visual} />
                    <div className="grid gap-3">
                      {journey.signals.map((signal) => (
                        <div key={signal} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 sm:rounded-3xl sm:border-white/10 sm:bg-white/[0.04] sm:p-4">
                          <ChevronRight className="mt-0.5 h-4 w-4 flex-none text-slate-500 sm:h-5 sm:w-5 sm:text-slate-400" />
                          <p className="text-sm leading-6 text-slate-300">{signal}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </GlassCard>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Products", value: "How people behave when the app is no longer a prototype" },
            { label: "Systems", value: "How small technical choices become big product feelings" },
            { label: "Business", value: "How orders, inventory, money, and timing quietly shape software" },
          ].map((item) => (
            <GlassCard key={item.label} className="p-4 sm:p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-100">{item.label}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.value}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="px-4 py-20 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <PageLabel title="Principles" />
          <SectionEyebrow>Principles</SectionEyebrow>
          <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
            I care a lot about products feeling alive.
          </h2>
          <p className="mt-6 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Not loud. Not overdesigned. Just useful, quick, thoughtful, and a little memorable. I like building with
            people who care about the same details users may never name but always feel.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {stackItems.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-300">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <GlassCard className="p-4 transition hover:-translate-y-1 hover:border-white/20 sm:p-6">
                <div className="flex gap-4">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-2xl bg-white/[0.05] text-sm text-slate-300 sm:h-10 sm:w-10 sm:border sm:border-white/10 sm:bg-white/[0.06] sm:text-slate-200">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{principle.title}</h3>
                    <p className="mt-2 leading-7 text-slate-400">{principle.description}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ObsessionsSection() {
  return (
    <section className="px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <GlassCard className="min-w-0 overflow-hidden p-4 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <SectionEyebrow>Current obsessions</SectionEyebrow>
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                The ideas I keep coming back to.
              </h2>
              <p className="mt-5 leading-7 text-slate-400">
                Some are practical. Some are weirdly persistent. Usually that is a good sign.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {obsessions.map((obsession, index) => (
                <motion.div
                  key={obsession}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-white sm:rounded-3xl sm:border-white/10 sm:bg-white/[0.045] sm:p-5 sm:shadow-xl sm:shadow-black/20"
                >
                  <div className="mb-4 flex items-center justify-between sm:mb-5">
                    <Cpu className="h-5 w-5 text-slate-300" />
                    <MoveUpRight className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="font-medium">{obsession}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" className="px-4 py-20 pb-32 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <GlassCard className="min-w-0 overflow-hidden p-4 sm:p-10 lg:p-12">
          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <SectionEyebrow>Let&apos;s build</SectionEyebrow>
              <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                If you are building something interesting, I would probably like to hear about it.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Especially if it needs someone who can think through product, write the code, notice the details, and
                still keep the room calm when things get messy.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-white px-6 text-black hover:bg-cyan-100">
                  <Link href="mailto:adityabajaj2222@gmail.com">
                    Email Aditya
                    <Mail className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/[0.03] px-6 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="https://www.linkedin.com/in/aditya-bajaj-6128811b6/" target="_blank" rel="noreferrer">
                    LinkedIn
                    <Linkedin className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: Mail, label: "Email", value: "adityabajaj2222@gmail.com", href: "mailto:adityabajaj2222@gmail.com" },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  value: "aditya-bajaj-6128811b6",
                  href: "https://www.linkedin.com/in/aditya-bajaj-6128811b6/",
                },
                { icon: Building2, label: "Portfolio", value: "adityabajaj.me", href: "https://adityabajaj.me" },
                { icon: Github, label: "GitHub", value: "adiVIT", href: "https://github.com/adiVIT" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-black/25 p-4 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.06] text-cyan-100">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-slate-500">{item.label}</span>
                    <span className="block truncate font-medium text-slate-200">{item.value}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-100" />
                </Link>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl justify-center text-sm text-slate-500">
        <div className="flex flex-wrap gap-4">
          <Link href="#restro-ai" className="hover:text-white">
            Restro AI
          </Link>
          <Link href="mailto:adityabajaj2222@gmail.com" className="hover:text-white">
            Contact
          </Link>
          <Link href="https://adityabajaj.me" target="_blank" rel="noreferrer" className="hover:text-white">
            Portfolio
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default function Portfolio() {
  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-[#03040a] text-white selection:bg-white selection:text-black">
      <SmoothScroll />
      <AnimatedBackground />
      <TorchCursor />
      <HiddenTorchNotes />
      <BookProgress />
      <MobileDock />
      <Navigation />
      <div className="relative z-10">
        <HeroSection />
        <PathExplorerSection />
        <BuilderConsoleSection />
        <WorkSection />
        <RestroAiSection />
        <AboutSection />
        <ObsessionsSection />
        <ContactSection />
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  )
}
