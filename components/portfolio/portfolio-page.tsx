"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  Check,
  Command,
  Copy,
  Menu,
  VolumeX,
  Pause,
  Play,
  Plus,
  Shuffle,
  Volume2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  commandItems,
  contactLinks,
  navItems,
  principles,
  stackNodes,
  type ExperienceChapter,
} from "@/lib/portfolio/content";
import { usePortfolioMotion } from "./use-portfolio-motion";
import { JourneyStack } from "./journey-stack";
import { Playground } from "./playground";
import { SelectedWork } from "./selected-work";
import { usePortfolioSound } from "./use-portfolio-sound";
import { PersonalScenes } from "./personal-scenes";
import { KineticManifesto } from "./kinetic-manifesto";

const HeroSculpture = dynamic(() => import("./hero-sculpture"), {
  ssr: false,
  loading: () => (
    <div className="sculpture-fallback">
      <span />
      <span />
      <span />
    </div>
  ),
});
const manifesto = "I care how it works. And how it feels.";

function SplitName({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((letter, i) => (
        <span className="hero-letter" key={i}>
          <span className="hero-glyph">{letter}</span>
        </span>
      ))}
    </>
  );
}

export function PortfolioPage() {
  const root = useRef<HTMLDivElement>(null);
  const [motionOn, setMotionOn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] =
    useState<ExperienceChapter | null>(null);
  const [form, setForm] = useState(0);
  const [principle, setPrinciple] = useState<number | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [active, setActive] = useState("hero");
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();
  const enabled = motionOn && !reducedMotion;
  const sceneProgress = useRef({ value: 0 });
  const hobbyProgress = useRef<{ value: number; draw?: (progress: number) => void }>({ value: 0 });
  const { soundOn, soundError, toggleSound, playInstrument, music } = usePortfolioSound(root);
  const { moveGallery, moveWork, moveJourney, moveHobbies, moveHome, pauseScroll } = usePortfolioMotion(
    root,
    enabled,
    sceneProgress,
    hobbyProgress,
  );

  useEffect(() => {
    pauseScroll(Boolean(selectedChapter) || commandOpen);
    return () => pauseScroll(false);
  }, [selectedChapter, commandOpen, enabled, pauseScroll]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    try {
      if (localStorage.getItem("portfolio-motion") === "off")
        setMotionOn(false);
    } catch {
      /* Storage is optional. */
    }
    const keyboard = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", keyboard);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    root.current
      ?.querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    return () => {
      preference.removeEventListener("change", sync);
      window.removeEventListener("keydown", keyboard);
      observer.disconnect();
      clearTimeout(copyTimer.current);
    };
  }, []);

  function toggleMotion() {
    setMotionOn((current) => {
      try {
        localStorage.setItem("portfolio-motion", current ? "off" : "on");
      } catch {
        /* Storage is optional. */
      }
      return !current;
    });
  }
  async function copyEmail() {
    clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(contactLinks[0].value);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    copyTimer.current = setTimeout(() => setCopyState("idle"), 3500);
  }
  function returnToStart(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    // Lenis's window anchor listener would otherwise target the pinned hero's current position.
    event.stopPropagation();
    moveHome();
    history.replaceState(null, "", "#hero");
  }
  function navigate(href: string) {
    setCommandOpen(false);
    setMenuOpen(false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>(href)
          ?.scrollIntoView({ behavior: enabled ? "smooth" : "instant" });
        history.replaceState(null, "", href);
      }),
    );
  }

  return (
    <div ref={root} className="portfolio portfolio-experience" data-motion={enabled ? "on" : "off"}>
      <a className="skip-link" href="#now">
        Skip to content
      </a>
      <div className="page-progress" aria-hidden="true" />
      <header className="site-header" data-menu-open={menuOpen}>
        <a className="brand" href="#hero" onClick={returnToStart} aria-label="Aditya Bajaj, home">
          <strong className="brand-wordmark">ADI<span aria-hidden="true">.</span></strong>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setActive(item.href.slice(1))}
              aria-current={
                active === item.href.slice(1) ? "location" : undefined
              }
            >
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="sound-toggle"
            data-sound-toggle
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute all audio" : "Play music"}
            title="Sound and music"
            data-tooltip={soundOn ? "Mute sound & music" : "Play music"}
          >
            {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
            <span className="sr-only">Sound {soundOn ? "on" : "off"}</span>
          </button>
          <button
            className="motion-toggle"
            onClick={toggleMotion}
            aria-pressed={enabled}
            aria-label={enabled ? "Pause motion" : "Enable motion"}
            data-tooltip={reducedMotion ? "System: reduced motion" : enabled ? "Motion on" : "Motion off"}
            disabled={reducedMotion}
            title={
              reducedMotion
                ? "Reduced motion follows your system preference"
                : "Toggle animation"
            }
          >
            {enabled ? <Pause size={16} /> : <Play size={16} />}
            <span className="sr-only">Motion {enabled ? "on" : "off"}</span>
          </button>
          <button
            className="command-toggle"
            onClick={() => setCommandOpen(true)}
            aria-label="Search portfolio, Command or Control K"
            data-tooltip="Jump to… ⌘ / Ctrl K"
          >
            <Command size={16} />
          </button>
          <a className="header-contact" href="#contact" aria-label="Let’s talk">
            <span>Let’s talk</span> <ArrowUpRight size={18} />
          </a>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen ? (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {[...navItems, { label: "Contact", href: "#contact" }].map(
              (item) => (
                <a
                  href={item.href}
                  aria-current={active === item.href.slice(1) ? "location" : undefined}
                  onClick={() => {
                    setActive(item.href.slice(1));
                    setMenuOpen(false);
                  }}
                  key={item.href}
                >
                  {item.label}
                  <ArrowUpRight />
                </a>
              ),
            )}
            <a href="https://www.instagram.com/adityabajaj_____/" target="_blank" rel="noreferrer">
              Instagram
              <ArrowUpRight />
            </a>
          </nav>
        ) : null}
      </header>
      <main>
        <section id="hero" className="hero">
          <div className="hero-intro">
            <span>Design-minded.</span>
            <span className="hero-current">Engineer at heart.</span>
          </div>
          <h1 className="hero-name" aria-label="Aditya Bajaj">
            <span className="name-line name-first" aria-hidden="true">
              <SplitName text="ADITYA" />
            </span>
            <span className="name-line name-last" aria-hidden="true">
              <SplitName text="BAJAJ" />
              <span className="name-period">.</span>
            </span>
          </h1>
          <div className="hero-art-scroll">
            <div className="hero-art">
              <HeroSculpture
                animated={enabled}
                variant={form}
                progress={sceneProgress}
              />
            </div>
          </div>
          <p className="hero-side-note">I build the interface.<br />And what makes it work.<br /><span>From first sketch to shipped product.</span></p>
          <div className="hero-portal" aria-hidden="true">
            <div className="portal-story">
              <span>FROM AN IDEA TO</span>
              <strong>SOMETHING<br /><em>YOU CAN USE.</em></strong>
            </div>
          </div>
          <div className="hero-bottom">
            <p>
              Built to be used.
              <br />
              <em>Made to be felt.</em>
            </p>
            <div className="hero-interaction">
              <span className="sculpture-instruction">Drag the sculpture to rotate</span>
              <button
                className="remix-button"
                onClick={() => setForm((value) => value + 1)}
              >
                <Shuffle size={15} />
                Remix the form
                <span className="sr-only">
                  , current variation {(form % 3) + 1}
                </span>
              </button>
            </div>
            <a href="#creative" className="hero-work magnetic">
              Scroll to explore
              <span>
                <ArrowDown size={22} />
              </span>
            </a>
          </div>
        </section>

        <KineticManifesto />

        <section id="now" className="about section-space">
          <div className="section-kicker">
            <span>Behind the interface</span>
            <Asterisk size={22} />
          </div>
          <div className="about-grid">
            <h2 className="manifesto" aria-label={manifesto}>
              {manifesto.split(" ").map((word, index) => (
                <span className="manifesto-word" aria-hidden="true" key={index}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            <div className="portrait-frame">
              <Image
                src="/images/aditya-portrait.webp"
                alt="Aditya smiling over coffee"
                width={1200}
                height={1600}
                sizes="(max-width: 640px) 80vw, 440px"
              />
              <span className="portrait-signature" aria-hidden="true">
                Aditya, away from the keyboard.
              </span>
            </div>
          </div>
        </section>
        <PersonalScenes animated={enabled} progress={hobbyProgress} onJump={moveHobbies}
          onAction={(index) => { if (soundOn) void playInstrument([60, 64, 67, 72][index], 0); }} />
        <div className="type-interlude" aria-hidden="true">
          <div className="kinetic-band">
            MAKE SOMETHING <Asterisk /> MAKE IT YOURS <Asterisk /> MAKE SOMETHING{" "}
            <Asterisk />
          </div>
        </div>

        <SelectedWork onJump={moveWork} />

        <Playground onJump={moveGallery} onNote={playInstrument} music={music} soundError={soundError} soundOn={soundOn} onMute={toggleSound} />

        <JourneyStack onOpen={setSelectedChapter} onJump={moveJourney} />

        <section id="principles" className="principles-section section-space">
          <div className="principles-intro reveal">
            <Asterisk size={62} strokeWidth={1} />
            <h2>
              How I <em>build.</em>
            </h2>
          </div>
          <div className="principle-list">
            {principles.map((item, index) => (
              <article className="principle reveal" key={item.title}>
                <button
                  aria-expanded={principle === index}
                  aria-controls={`principle-${index}`}
                  onClick={() =>
                    setPrinciple(principle === index ? null : index)
                  }
                >
                  <h3>{item.title}</h3>
                  <Plus
                    className={principle === index ? "is-open" : ""}
                    strokeWidth={1.3}
                  />
                </button>
                <div
                  className="principle-body"
                  id={`principle-${index}`}
                  hidden={principle !== index}
                >
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <div className="stack-section">
          <div className="stack-label">The things I build with</div>
          <div className="stack-bands">
            {[stackNodes.slice(0, 3), stackNodes.slice(3)].map(
              (group, index) => (
                <div
                  className={`kinetic-band stack-band stack-band-${index}`}
                  key={index}
                >
                  {[...group, ...group].map((item, i) => (
                    <span
                      key={i}
                      aria-hidden={i >= group.length ? true : undefined}
                      title={item.detail}
                    >
                      {item.label}
                      <Asterisk strokeWidth={1} />
                    </span>
                  ))}
                </div>
              ),
            )}
          </div>
          <p className="stack-details">
            Kotlin / Jetpack Compose / Flutter / Next.js / TypeScript / Python /
            Firebase
          </p>
        </div>

        <section id="contact" className="contact section-space">
          <span className="eyebrow">Have something worth building?</span>
          <div className="contact-heading">
            <h2 className="contact-title">
              <span>SAY</span>
              <span>HELLO.</span>
            </h2>
            <a
              className="contact-orb magnetic"
              href={contactLinks[0].href}
              aria-label="Email Aditya"
            >
              <ArrowUpRight strokeWidth={1} />
            </a>
          </div>
          <div className="contact-bottom">
            <div>
              <a className="email-link" href={contactLinks[0].href}>
                {contactLinks[0].value}
              </a>
              <button
                className="copy-button"
                onClick={copyEmail}
                aria-label="Copy email address"
              >
                {copyState === "copied" ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </button>
              <p role="status">
                {copyState === "copied"
                  ? "Email copied. Your move."
                  : copyState === "failed"
                    ? "Please select the email above to copy it."
                    : "Tell me what you’re working on."}
              </p>
            </div>
            <div className="social-links">
              {contactLinks.slice(1, 3).map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                  <ArrowUpRight size={17} />
                </a>
              ))}
              <a href="https://www.instagram.com/adityabajaj_____/" target="_blank" rel="noreferrer">
                Instagram
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="contact-signoff"><span>Designed, coded, and remixed by Aditya.</span><a href="#hero" onClick={returnToStart}>Back to the beginning <ArrowUpRight size={16} /></a></div>
        </section>
      </main>
      <Dialog
        open={Boolean(selectedChapter)}
        onOpenChange={(open) => {
          if (!open) setSelectedChapter(null);
        }}
      >
        <DialogContent className="project-dialog" data-lenis-prevent>
          {selectedChapter ? (
            <>
              <DialogHeader>
                <span className="eyebrow">{selectedChapter.period}</span>
                <DialogTitle>{selectedChapter.company}</DialogTitle>
                <DialogDescription>{selectedChapter.role}</DialogDescription>
              </DialogHeader>
              <p className="chapter-story">{selectedChapter.training}</p>
              <a
                className="button button-lime"
                href="https://www.linkedin.com/in/aditya-bajaj-6128811b6/"
                target="_blank"
                rel="noreferrer"
              >
                More on LinkedIn <ArrowUpRight size={18} />
              </a>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogTitle className="sr-only">Navigate the portfolio</DialogTitle>
        <DialogDescription className="sr-only">
          Search sections and jump directly to them.
        </DialogDescription>
        <CommandInput placeholder="Where would you like to go?" />
        <CommandList data-lenis-prevent>
          <CommandEmpty>No matching sections.</CommandEmpty>
          <CommandGroup heading="Explore">
            {commandItems.map((item) => (
              <CommandItem key={item.href} onSelect={() => navigate(item.href)}>
                {item.label}
                <ArrowUpRight className="ml-auto h-4 w-4" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
