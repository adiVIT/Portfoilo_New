"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import {
  ArrowRight,
  ChevronRight,
  Command,
  ExternalLink,
  Mail,
  MousePointer2,
  MoveUpRight,
  Search,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import {
  architectureNodes,
  commandItems,
  contactLinks,
  currentSignals,
  experienceChapters,
  heroRoles,
  navItems,
  principles,
  projectCaseStudies,
  restroFlow,
  restroMetrics,
  restroSignals,
  stackNodes,
} from "@/lib/portfolio/content"

const sectionIds = ["hero", "now", "journey", "restro-ai", "projects", "principles", "contact"]
const demandBars = [38, 46, 58, 54, 72, 83, 92, 86, 96, 74, 66, 52]
const heatmapCells = [42, 58, 71, 64, 85, 93, 76, 69, 54, 88, 97, 82, 61, 73, 90, 66]
const accentMap = {
  cyan: "from-cyan-300/20 via-sky-300/10 to-transparent text-cyan-100",
  violet: "from-violet-300/20 via-fuchsia-300/10 to-transparent text-violet-100",
  amber: "from-amber-300/20 via-orange-300/10 to-transparent text-amber-100",
  emerald: "from-emerald-300/20 via-teal-300/10 to-transparent text-emerald-100",
}
const premiumEase = [0.22, 1, 0.36, 1] as const

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  align?: "left" | "center"
}

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

function useActiveSection() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((firstEntry, secondEntry) => secondEntry.intersectionRatio - firstEntry.intersectionRatio)[0]

        if (visibleEntry?.target.id) setActiveSection(visibleEntry.target.id)
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0.1, 0.2, 0.4, 0.6] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return activeSection
}

function Reveal({ children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: premiumEase, delay }}
      className={cn("min-w-0", className)}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={cn("min-w-0 max-w-3xl", align === "center" && "mx-auto text-center")}>
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-3 sm:text-[11px] sm:tracking-[0.28em]",
          align === "center" && "justify-center",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
        {eyebrow}
      </div>
      <h2 className="mt-5 text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:mt-6 sm:text-5xl sm:leading-[1.05] lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-[34rem] text-pretty text-sm leading-7 text-slate-400 sm:mt-5 sm:max-w-2xl sm:text-lg sm:leading-8">
          {description}
        </p>
      ) : null}
    </div>
  )
}

function Surface({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={cn(
        "premium-surface relative overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-white/[0.035] shadow-2xl shadow-black/25 backdrop-blur-xl sm:rounded-[1.75rem]",
        className,
      )}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease: premiumEase }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-px rounded-[inherit] bg-gradient-to-b from-white/[0.075] to-transparent opacity-70" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

function AmbientBackground() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#03040a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(148,163,184,0.18),transparent_34%),radial-gradient(circle_at_12%_18%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_85%_12%,rgba(168,85,247,0.1),transparent_26%),linear-gradient(180deg,#03040a_0%,#060713_48%,#03040a_100%)]" />
      <motion.div
        className="absolute left-1/2 top-[-24rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-white/[0.055] blur-3xl"
        animate={shouldReduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <div className="premium-noise absolute inset-0 opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.76)_78%)]" />
    </div>
  )
}

function CursorLight() {
  const shouldReduceMotion = useReducedMotion()
  const mouseX = useMotionValue(-300)
  const mouseY = useMotionValue(-300)
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 700, mass: 0.12 })
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 700, mass: 0.12 })

  useEffect(() => {
    if (shouldReduceMotion) return

    function handlePointerMove(event: PointerEvent) {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }

    window.addEventListener("pointermove", handlePointerMove)
    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [mouseX, mouseY, shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),rgba(125,211,252,0.055)_36%,transparent_70%)] opacity-80 mix-blend-screen blur-sm md:block"
      style={{ x: smoothX, y: smoothY }}
    />
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[70] h-px w-full origin-left bg-white/60"
      style={{ scaleX }}
    />
  )
}

function CommandPalette({ activeSection }: { activeSection: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const activeLabel = useMemo(() => navItems.find((item) => item.href === `#${activeSection}`)?.label ?? "Home", [activeSection])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setIsOpen((currentValue) => !currentValue)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  function navigateTo(href: string) {
    setIsOpen(false)
    window.requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white lg:flex"
        aria-label="Open command palette"
      >
        <Command className="h-4 w-4" />
        <span>{activeLabel}</span>
        <kbd className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-slate-500">⌘K</kbd>
      </button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Jump to a section..." />
        <CommandList>
          <CommandEmpty>No section found.</CommandEmpty>
          <CommandGroup heading="Portfolio">
            {commandItems.map((item) => (
              <CommandItem key={item.href} onSelect={() => navigateTo(item.href)} className="cursor-pointer">
                <Search className="h-4 w-4" />
                <span>{item.label}</span>
                <CommandShortcut>{item.href}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

function Navigation({ activeSection }: { activeSection: string }) {
  const isHeroActive = activeSection === "hero"

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-6">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border border-white/10 p-1.5 shadow-2xl shadow-black/35 backdrop-blur-2xl transition duration-500 sm:gap-3 sm:p-2",
          isHeroActive ? "bg-[#070812]/62" : "bg-[#070812]/86",
        )}
        aria-label="Primary"
      >
        <Link href="#hero" className="group flex min-w-0 items-center gap-2 rounded-full px-1.5 py-1 sm:gap-3 sm:px-2 sm:py-1.5">
          <span className="grid h-8 w-8 flex-none place-items-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-semibold text-white shadow-inner shadow-white/5 sm:h-9 sm:w-9 sm:text-sm">
            AB
          </span>
          <span className="block truncate text-xs font-medium text-slate-200 xs:text-sm sm:text-sm">Aditya Bajaj</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "")

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  isActive ? "bg-white text-black" : "text-slate-400 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <CommandPalette activeSection={activeSection} />
          <Button asChild className="magnetic-action h-9 rounded-full bg-white px-3 text-black shadow-xl shadow-white/10 hover:bg-slate-200 sm:h-10 sm:px-4">
            <Link href="mailto:adityabajaj2222@gmail.com">
              <span className="hidden sm:inline">Let's Build</span>
              <Mail className="h-4 w-4 sm:ml-2" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

function MobileDock({ activeSection }: { activeSection: string }) {
  const mobileItems = navItems.slice(0, 4)

  return (
    <nav
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 rounded-full border border-white/10 bg-black/72 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-2xl md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 gap-1">
        {mobileItems.map((item) => {
          const isActive = activeSection === item.href.replace("#", "")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-2 py-3 text-center text-[11px] font-medium transition active:scale-95",
                isActive ? "bg-white text-black" : "text-slate-400",
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  const [roleIndex, setRoleIndex] = useState(0)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.28], [0, 90])

  useEffect(() => {
    if (shouldReduceMotion) return

    const intervalId = window.setInterval(() => {
      setRoleIndex((currentIndex) => (currentIndex + 1) % heroRoles.length)
    }, 2600)

    return () => window.clearInterval(intervalId)
  }, [shouldReduceMotion])

  return (
    <section id="hero" className="relative px-4 pb-16 pt-28 sm:min-h-screen sm:px-6 sm:pb-24 sm:pt-44 lg:px-8">
      <motion.div
        aria-hidden="true"
        style={{ y }}
        className="absolute right-[7%] top-32 hidden h-56 w-56 rounded-full border border-white/10 bg-white/[0.025] shadow-2xl shadow-cyan-950/20 backdrop-blur-xl lg:block"
      >
        <div className="absolute inset-6 rounded-full border border-white/10" />
        <motion.div
          className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white/60"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ transformOrigin: "0 112px" }}
        />
      </motion.div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 overflow-hidden sm:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <Reveal className="min-w-0 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-300 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-3 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.45)] sm:h-2 sm:w-2" />
            Product engineer. Independent builder.
          </div>

          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:mt-8 sm:text-7xl sm:leading-[0.95] lg:text-8xl">
            Ideas are easy. Making them survive reality is the fun part.
          </h1>

          <motion.p
            key={heroRoles[roleIndex]}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            className="mt-5 hidden min-h-20 max-w-2xl text-pretty text-lg leading-8 text-slate-300 sm:block sm:text-xl sm:leading-9"
          >
            {heroRoles[roleIndex]}. I care about products that work when users are impatient, teams are moving fast, and the real world refuses to behave like a neat mockup.
          </motion.p>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-slate-300 sm:hidden">
            I&apos;m an Android Developer at PhonePe and a builder at heart. I care about products that work when users are impatient and the real world refuses to behave like a neat mockup.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:gap-3">
            <Button asChild size="lg" className="magnetic-action group h-11 rounded-full bg-white px-5 text-black shadow-2xl shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-200 sm:h-12 sm:px-6">
              <Link href="#projects">
                View Builds
                <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="magnetic-action h-11 rounded-full border-white/15 bg-white/[0.035] px-5 text-white hover:border-white/25 hover:bg-white/[0.075] hover:text-white sm:h-12 sm:px-6"
            >
              <Link href="#restro-ai">Explore Restro AI</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal className="w-full min-w-0" delay={0.12}>
          <Surface className="p-3 sm:p-5">
            <div className="rounded-[1.15rem] border border-white/10 bg-black/35 p-3.5 sm:rounded-[1.35rem] sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 sm:text-xs sm:tracking-[0.24em]">Pocket OS</p>
                  <p className="mt-1 text-sm font-medium text-white sm:mt-2 sm:text-lg">Tap, explore, move fast</p>
                </div>
                <Sparkles className="h-4 w-4 text-slate-300 sm:h-5 sm:w-5" />
              </div>
              <div className="mt-4 grid gap-2 sm:mt-8 sm:gap-3">
                {currentSignals.map((signal, index) => (
                  <motion.div
                    key={signal.label}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 + index * 0.08 }}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3 sm:rounded-3xl sm:p-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:text-xs sm:tracking-[0.22em]">{signal.label}</p>
                    <p className="mt-1 text-sm font-medium text-white sm:mt-2 sm:text-base">{signal.value}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400 sm:mt-2 sm:text-sm sm:leading-6">{signal.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Surface>
        </Reveal>
      </div>
    </section>
  )
}

function NowSection() {
  return (
    <section id="now" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-6xl overflow-hidden">
        <Reveal>
          <SectionHeader
            eyebrow="Currently building"
            title="A small window into what I keep thinking about while building."
            description="Half-formed thoughts, product beliefs, experiments, and the kind of notes that usually start in too many open tabs."
          />
        </Reveal>

        <div className="mt-10 grid w-full min-w-0 gap-3 sm:gap-4 lg:grid-cols-3">
          {currentSignals.map((signal, index) => (
            <Reveal key={signal.label} delay={index * 0.06}>
              <Surface className="h-full rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl backdrop-blur-xl sm:rounded-[1.75rem] sm:p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{signal.label}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-white sm:mt-5 sm:text-2xl">{signal.value}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400 sm:mt-4">{signal.detail}</p>
              </Surface>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function JourneyVisual({ visual }: { visual: string }) {
  if (visual === "wealth-graph") {
    return (
      <div className="flex h-24 items-end gap-2 rounded-2xl bg-white/[0.025] p-3 sm:h-32 sm:rounded-3xl sm:border sm:border-white/10 sm:bg-black/25 sm:p-4">
        {[34, 48, 42, 66, 78, 72, 88, 94].map((height, index) => (
          <motion.div
            key={`${height}-${index}`}
            className="flex-1 rounded-t-xl bg-white/45"
            initial={{ height: 12 }}
            whileInView={{ height: `${height}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.04 }}
          />
        ))}
      </div>
    )
  }

  if (visual === "mobility-grid") {
    return (
      <div className="relative h-24 overflow-hidden rounded-2xl bg-white/[0.025] sm:h-32 sm:rounded-3xl sm:border sm:border-white/10 sm:bg-black/25">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <motion.div
          className="absolute left-5 top-1/2 h-1 w-32 rounded-full bg-white/45"
          initial={{ x: -24, opacity: 0.4 }}
          whileInView={{ x: 170, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
      </div>
    )
  }

  if (visual === "trust-network") {
    return (
      <div className="relative h-24 rounded-2xl bg-white/[0.025] p-3 sm:h-32 sm:rounded-3xl sm:border sm:border-white/10 sm:bg-black/25 sm:p-4">
        <div className="absolute left-1/2 top-1/2 h-px w-2/3 -translate-x-1/2 bg-white/15" />
        <div className="absolute left-1/2 top-1/2 h-2/3 w-px -translate-y-1/2 bg-white/15" />
        {[["left-5 top-5"], ["right-5 top-5"], ["bottom-5 left-5"], ["bottom-5 right-5"], ["left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"]].map((classes, index) => (
          <motion.div
            key={classes[0]}
            className={cn("absolute grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.07]", classes[0])}
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <span className="h-2 w-2 rounded-full bg-white/55" />
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid h-24 grid-cols-3 gap-2 rounded-2xl bg-white/[0.025] p-3 sm:h-32 sm:gap-3 sm:rounded-3xl sm:border sm:border-white/10 sm:bg-black/25 sm:p-4">
      {["Supply", "Demand", "Timing"].map((label, index) => (
        <motion.div
          key={label}
          className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-3"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
        >
          <span className="h-2 w-2 rounded-full bg-white/45" />
          <span className="text-xs text-slate-400">{label}</span>
        </motion.div>
      ))}
    </div>
  )
}

function ExperienceJourneySection() {
  return (
    <section id="journey" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto w-full max-w-6xl overflow-hidden">
        <Reveal>
          <SectionHeader
            eyebrow="Experience journey"
            title="Not just where I worked. What those places trained me to understand."
            description="Each environment taught a different kind of building: trust, clarity, ownership, ambiguity, and the boring business details that decide whether products actually work."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5">
          {experienceChapters.map((chapter, index) => (
            <Reveal key={chapter.company} delay={index * 0.06}>
              <Surface className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl backdrop-blur-xl sm:rounded-[1.75rem] sm:p-7">
                <article className="grid min-w-0 gap-5 sm:gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200 sm:h-11 sm:w-11">
                        <chapter.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:px-3 sm:text-xs sm:tracking-[0.22em]">
                        Chapter 0{index + 1}
                      </span>
                    </div>
                    <p className="mt-5 text-xs text-slate-500 sm:mt-7 sm:text-sm">{chapter.period} / {chapter.role}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">{chapter.company}</h3>
                    <p className="mt-3 text-lg leading-7 text-slate-200 sm:mt-4 sm:text-xl sm:leading-8">{chapter.training}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-400 sm:mt-4 sm:text-base">{chapter.story}</p>
                  </div>

                  <div className="grid min-w-0 gap-4">
                    <JourneyVisual visual={chapter.visual} />
                    <div className="grid gap-3">
                      {chapter.signals.map((signal) => (
                        <div key={signal} className="flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 sm:rounded-3xl sm:p-4">
                          <ChevronRight className="mt-0.5 h-4 w-4 flex-none text-slate-500" />
                          <p className="text-sm leading-6 text-slate-300">{signal}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </Surface>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function RestroCommandCenter({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  return (
    <div className="mt-3 overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/30 p-4 sm:mt-4 sm:rounded-3xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Operations loop</p>
          <p className="mt-1 text-sm font-medium text-white">Sense. Predict. Recommend. Learn.</p>
        </div>
        <MousePointer2 className="h-4 w-4 text-slate-400" />
      </div>

      <div className="relative grid gap-2 sm:grid-cols-4">
        <motion.div
          aria-hidden="true"
          className="absolute left-8 right-8 top-8 hidden h-px bg-gradient-to-r from-transparent via-white/25 to-transparent sm:block"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: premiumEase }}
        />
        {restroFlow.map((step, index) => (
          <motion.div
            key={step.label}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.42, delay: index * 0.08, ease: premiumEase }}
            className="relative rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3"
          >
            <motion.div
              className="grid h-9 w-9 place-items-center rounded-2xl bg-white/[0.06] text-slate-200 sm:border sm:border-white/10"
              animate={shouldReduceMotion ? undefined : { y: [0, -3, 0] }}
              transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: index * 0.35 }}
            >
              <step.icon className="h-4 w-4" />
            </motion.div>
            <p className="mt-4 text-sm font-medium text-white">{step.label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{step.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function RestroMobileSnapshot({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  return (
    <Surface className="w-full min-w-0 rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl">
      <div className="rounded-[1.15rem] border border-white/10 bg-black/35 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400">Restaurant intelligence</p>
            <h3 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-white">Tomorrow&apos;s rush preview</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">Currently in early access with 20+ restaurants on the waitlist.</p>
          </div>
          <motion.span
            className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-emerald-300"
            animate={shouldReduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {restroMetrics.slice(0, 2).map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <metric.icon className="h-4 w-4 text-slate-300" />
              <p className="mt-4 text-lg font-semibold text-white">{metric.value}</p>
              <p className="mt-1 text-xs text-slate-500">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-white">Demand curve</p>
            <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[11px] text-slate-400">sample</span>
          </div>
          <div className="flex h-20 items-end gap-1.5">
            {demandBars.slice(0, 8).map((height, index) => (
              <motion.div
                key={`${height}-${index}`}
                className="flex-1 rounded-t-lg bg-white/45"
                initial={{ height: 10, opacity: 0.35 }}
                whileInView={{ height: `${height}%`, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: index * 0.025 }}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-white/[0.08] bg-black/25 p-3">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">AI note</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{restroSignals[0]}</p>
        </div>
      </div>
    </Surface>
  )
}

function RestroAiSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="restro-ai" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto w-full max-w-6xl overflow-hidden">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <SectionHeader
                eyebrow="Restro AI"
                title="Restro AI is an idea I keep coming back to."
                description="Restaurants already have software. Most of it still does not help them think ahead. The idea is simple: give restaurant teams a calm operating layer that can read demand, inventory, staffing, and waste before the day gets away from them. I want it to feel less like another dashboard and more like a second brain for the person running the floor."
              />
              <div className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
                <Button asChild className="magnetic-action rounded-full bg-white px-5 text-black hover:bg-slate-200">
                  <Link href="https://restro-ai.com" target="_blank" rel="noreferrer">
                    Visit Restro AI
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="magnetic-action rounded-full border-white/15 bg-white/[0.035] px-5 text-white hover:bg-white/[0.075] hover:text-white">
                  <Link href="#projects">See product thinking</Link>
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal className="sm:hidden" delay={0.12}>
            <RestroMobileSnapshot shouldReduceMotion={shouldReduceMotion} />
          </Reveal>

          <Reveal className="hidden sm:block" delay={0.12}>
            <Surface className="w-full min-w-0 rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl sm:rounded-[1.75rem] sm:p-5">
              <div className="rounded-[1.15rem] border border-white/10 bg-black/35 p-4 sm:rounded-[1.4rem] sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-400 sm:text-sm">Restaurant intelligence</p>
                    <h3 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl">Tomorrow's rush, a little less mysterious.</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">Currently in early access with 20+ restaurants on the waitlist.</p>
                  </div>
                  <motion.span
                    className="h-2.5 w-2.5 rounded-full bg-emerald-300"
                    animate={shouldReduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>

                <div className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
                  {restroMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:rounded-3xl sm:p-4">
                      <metric.icon className="h-4 w-4 text-slate-300 sm:h-5 sm:w-5" />
                      <p className="mt-5 text-xl font-semibold text-white sm:mt-7 sm:text-2xl">{metric.value}</p>
                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">{metric.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:mt-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-white">Demand curve</p>
                    <span className="rounded-full bg-white/[0.06] px-2 py-1 text-xs text-slate-400">live simulation</span>
                  </div>
                  <div className="flex h-28 items-end gap-1.5 sm:h-44 sm:gap-2">
                    {demandBars.map((height, index) => (
                      <motion.div
                        key={`${height}-${index}`}
                        className="flex-1 rounded-t-xl bg-white/45"
                        initial={{ height: 12, opacity: 0.35 }}
                        whileInView={{ height: `${height}%`, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: index * 0.035 }}
                      />
                    ))}
                  </div>
                </div>

                <RestroCommandCenter shouldReduceMotion={shouldReduceMotion} />

                <div className="mt-3 grid min-w-0 gap-3 sm:mt-4 sm:gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-sm font-medium text-white">Outlet heatmap</p>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {heatmapCells.map((intensity, index) => (
                        <motion.div
                          key={`${intensity}-${index}`}
                          className="aspect-square rounded-xl border border-white/10"
                          initial={{ opacity: 0.25 }}
                          whileInView={{ opacity: 0.4 + intensity / 190 }}
                          viewport={{ once: true }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: index * 0.018 }}
                          style={{ backgroundColor: `rgba(148, 163, 184, ${0.08 + intensity / 330})` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-sm font-medium text-white">AI recommendation feed</p>
                    <div className="mt-4 space-y-3">
                      {restroSignals.map((signal, index) => (
                        <motion.div
                          key={signal}
                          initial={{ opacity: 0, x: 14 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: index * 0.06 }}
                          className="rounded-2xl border border-white/[0.08] bg-black/25 p-3 text-sm leading-6 text-slate-300"
                        >
                          {signal}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Surface>
          </Reveal>
        </div>

        <div className="mt-6 hidden gap-3 sm:mt-8 sm:grid sm:gap-4 lg:grid-cols-4">
          {restroFlow.map((step, index) => (
            <Reveal key={step.label} delay={index * 0.05}>
              <Surface className="h-full rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl backdrop-blur-xl sm:rounded-[1.75rem]">
                <step.icon className="h-4 w-4 text-slate-300 sm:h-5 sm:w-5" />
                <p className="mt-5 text-xs uppercase tracking-[0.22em] text-slate-500 sm:mt-6 sm:text-sm">0{index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">{step.label}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{step.detail}</p>
              </Surface>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectMockup({ projectName }: { projectName: string }) {
  if (projectName === "FileHoster") {
    return (
      <div className="rounded-2xl bg-white/[0.025] p-3 sm:rounded-3xl sm:border sm:border-white/10 sm:bg-black/25 sm:p-4">
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.035] p-5 text-center sm:p-6">
          <MoveUpRight className="mx-auto h-6 w-6 text-slate-300" />
          <p className="mt-4 text-sm text-slate-300">Drop file. Generate secure link. Track state.</p>
        </div>
        <div className="mt-4 space-y-2">
          {["uploading", "scanning", "ready"].map((state) => (
            <div key={state} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-3 py-2 text-xs text-slate-400">
              <span>{state}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (projectName === "HonReview") {
    return (
      <div className="rounded-2xl bg-white/[0.025] p-3 sm:rounded-3xl sm:border sm:border-white/10 sm:bg-black/25 sm:p-4">
        {[92, 78, 61].map((score, index) => (
          <div key={score} className="mb-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 last:mb-0">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>trust signal 0{index + 1}</span>
              <span>{score}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-white/45" style={{ width: `${score}%` }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (projectName === "FitSpot") {
    return (
      <div className="grid min-w-0 grid-cols-[0.7fr_1fr] gap-3 rounded-2xl bg-white/[0.025] p-3 sm:rounded-3xl sm:border sm:border-white/10 sm:bg-black/25 sm:p-4">
        <div className="rounded-[1.25rem] bg-white/[0.04] p-3 sm:rounded-[1.5rem] sm:border sm:border-white/10">
          <div className="h-24 rounded-2xl bg-gradient-to-br from-white/20 to-white/[0.03]" />
          <div className="mt-3 h-2 w-16 rounded-full bg-white/20" />
          <div className="mt-2 h-2 w-10 rounded-full bg-white/10" />
        </div>
        <div className="space-y-2">
          {["discover", "book", "progress"].map((label) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-sm text-slate-300">
              {label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/[0.025] p-3 sm:rounded-3xl sm:border sm:border-white/10 sm:bg-black/25 sm:p-4">
      <div className="grid grid-cols-2 gap-3">
        {architectureNodes.map((node) => (
          <div key={node.label} className="rounded-2xl bg-white/[0.035] p-3 sm:border sm:border-white/10">
            <node.icon className="h-4 w-4 text-slate-300" />
            <p className="mt-4 text-sm font-medium text-white">{node.label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{node.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsSection() {
  const [activeProjectName, setActiveProjectName] = useState(projectCaseStudies[0].name)
  const activeProject = projectCaseStudies.find((project) => project.name === activeProjectName) ?? projectCaseStudies[0]

  return (
    <section id="projects" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto w-full max-w-6xl overflow-hidden">
        <Reveal>
          <SectionHeader
            eyebrow="Signature projects"
            title="Some of my favorite projects started as random late-night ideas."
            description="The good ones survive outside demo videos. I care about what made the product difficult, what the system had to handle, and whether the experience felt useful when it left the prototype."
          />
        </Reveal>

        <div className="mt-10 grid min-w-0 gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid min-w-0 gap-3">
            {projectCaseStudies.map((project) => {
              const isActive = activeProject.name === project.name

              return (
                <button
                  key={project.name}
                  type="button"
                  onClick={() => setActiveProjectName(project.name)}
                  className={cn(
                    "group rounded-[1.5rem] border p-5 text-left transition duration-300",
                    isActive
                      ? "border-white/20 bg-white/[0.07] shadow-2xl shadow-black/25"
                      : "border-white/10 bg-white/[0.025] hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.045]",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200">
                        <project.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{project.label}</p>
                        <h3 className="mt-1 text-xl font-semibold text-white">{project.name}</h3>
                      </div>
                    </div>
                    <ArrowRight className={cn("h-4 w-4 transition", isActive ? "text-white" : "text-slate-600 group-hover:text-slate-300")} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400 sm:mt-4">{project.summary}</p>
                </button>
              )
            })}
          </div>

          <Surface className="w-full min-w-0 rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl sm:rounded-[1.75rem] sm:p-6">
            <motion.div
              key={activeProject.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className={cn("w-full min-w-0 rounded-[1.25rem] bg-gradient-to-br p-px sm:rounded-[1.4rem]", accentMap[activeProject.accent])}>
                <div className="rounded-[1.2rem] bg-[#070812]/95 p-4 sm:rounded-[1.35rem] sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{activeProject.label}</p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:mt-3 sm:text-3xl">{activeProject.name}</h3>
                    </div>
                    {activeProject.href ? (
                      <Link href={activeProject.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08] hover:text-white">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>

                  <div className="mt-6">
                    <ProjectMockup projectName={activeProject.name} />
                  </div>

                  <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4">
                    {[
                      ["Product", activeProject.product],
                      ["Engineering", activeProject.engineering],
                      ["Hard part", activeProject.difficulty],
                      ["Impact", activeProject.impact],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 sm:rounded-3xl sm:p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {activeProject.stack.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </Surface>
        </div>
      </div>
    </section>
  )
}

function PrinciplesSection() {
  return (
    <section id="principles" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto w-full max-w-6xl overflow-hidden">
        <div className="grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal>
            <SectionHeader
              eyebrow="Product philosophy"
              title="I care a lot about products feeling alive."
              description="Not loud. Not overdesigned. Just useful, quick, thoughtful, and a little memorable. I like building with people who care about the same details users may never name but always feel."
            />
          </Reveal>

          <div className="grid gap-3 sm:gap-4">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.05}>
                <Surface className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl sm:rounded-[1.75rem] sm:p-5">
                  <div className="flex gap-3 sm:gap-4">
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-xs text-slate-300 sm:h-10 sm:w-10 sm:text-sm">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-white sm:text-xl">{principle.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{principle.description}</p>
                    </div>
                  </div>
                </Surface>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {stackNodes.map((node, index) => (
            <Reveal key={node.label} delay={index * 0.035}>
              <Surface className="group h-full rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.055] sm:rounded-[1.75rem] sm:p-5">
                <node.icon className="h-5 w-5 text-slate-300 transition group-hover:text-white" />
                <h3 className="mt-5 text-lg font-semibold text-white sm:mt-6 sm:text-xl">{node.label}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{node.detail}</p>
              </Surface>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" className="px-4 py-24 pb-36 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto w-full max-w-6xl overflow-hidden">
        <Surface className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl backdrop-blur-xl sm:rounded-[1.75rem] sm:p-10 lg:p-12">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <Reveal>
              <SectionHeader
                eyebrow="Let's build"
                title="If you are building something interesting, I would probably like to hear about it."
                description="Especially if it needs someone who can think through product, write the code, notice the details, and still keep the room calm when things get messy."
              />
              <div className="mt-8">
                <Button asChild size="lg" className="magnetic-action rounded-full bg-white px-6 text-black hover:bg-slate-200">
                  <Link href="mailto:adityabajaj2222@gmail.com">
                    Email Aditya
                    <Mail className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <div className="grid gap-2.5 sm:gap-3">
              {contactLinks.map((item, index) => (
                <Reveal key={item.label} delay={index * 0.04}>
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="group flex items-center gap-3 rounded-3xl border border-white/10 bg-black/25 p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055] sm:gap-4"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.06] text-slate-200 sm:h-11 sm:w-11">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-slate-500">{item.label}</span>
                      <span className="block truncate font-medium text-slate-200">{item.value}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </Surface>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl justify-center text-sm text-slate-500 sm:justify-end">
        <div className="flex gap-4">
          <Link href="#restro-ai" className="hover:text-white">Restro AI</Link>
          <Link href="#projects" className="hover:text-white">Projects</Link>
          <Link href="mailto:adityabajaj2222@gmail.com" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  )
}

export function PortfolioPage() {
  const activeSection = useActiveSection()

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-[#03040a] text-white selection:bg-white selection:text-black">
      <AmbientBackground />
      <CursorLight />
      <ScrollProgress />
      <Navigation activeSection={activeSection} />
      <MobileDock activeSection={activeSection} />
      <div className="relative z-10">
        <HeroSection />
        <NowSection />
        <ExperienceJourneySection />
        <RestroAiSection />
        <ProjectsSection />
        <PrinciplesSection />
        <ContactSection />
      </div>
      <Footer />
    </main>
  )
}
