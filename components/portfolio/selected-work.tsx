"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import "./selected-work.css";

const work = [
  {
    name: "Restro AI",
    category: "Cofounder / AI Product",
    description: "AI for the people running restaurants.",
    href: "https://www.restro-ai.com/",
    art: "restro",
  },
  {
    name: "Nurture",
    category: "Web / Finance",
    description: "Financial planning, made easier to explore.",
    href: "https://www.nurtureinvestments.in/",
    art: "nurture",
  },
  {
    name: "FitSpot",
    category: "Web / Sports",
    description: "Find a game. Book a ground. Get playing.",
    href: "https://play-spot-zqau.vercel.app/",
    art: "fitspot",
  },
];

type SelectedWorkProps = {
  onJump?: (index: number) => void;
};

export function SelectedWork({ onJump }: SelectedWorkProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const restoredIndex = Number(viewport.dataset.activeIndex);
    if (Number.isInteger(restoredIndex) && restoredIndex >= 0 && restoredIndex < work.length) {
      setActiveIndex(restoredIndex);
    }
    const onGalleryChange = (event: Event) => {
      const index = (event as CustomEvent<{ index: number }>).detail?.index;
      if (Number.isInteger(index) && index >= 0 && index < work.length) setActiveIndex(index);
    };
    viewport.addEventListener("workgallerychange", onGalleryChange);

    // Continuous motion stays in the parent timeline; only item changes
    // enter React state. Native swipe navigation uses visibility thresholds.
    const cards = Array.from(viewport.querySelectorAll<HTMLElement>(".work-gallery-card"));
    const visible = new Map<Element, number>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target, entry.intersectionRatio));
      if (viewport.dataset.pinned === "true") return;
      let bestIndex = 0;
      let bestVisibility = 0;
      cards.forEach((card, index) => {
        const visibility = visible.get(card) ?? 0;
        if (visibility > bestVisibility) { bestIndex = index; bestVisibility = visibility; }
      });
      if (bestVisibility > 0) setActiveIndex(bestIndex);
    }, { root: viewport, threshold: [0, 0.25, 0.5, 0.65, 0.8, 0.95, 1] });
    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
      viewport.removeEventListener("workgallerychange", onGalleryChange);
    };
  }, []);

  const goTo = (index: number) => {
    const destination = Math.max(0, Math.min(work.length - 1, index));
    if (onJump) { onJump(destination); return; }
    const viewport = viewportRef.current;
    const card = viewport?.querySelectorAll<HTMLElement>(".work-gallery-card")[destination];
    if (!viewport || !card) return;
    const gutter = parseFloat(getComputedStyle(viewport).scrollPaddingLeft) || 0;
    const left = card.getBoundingClientRect().left - viewport.getBoundingClientRect().left + viewport.scrollLeft - gutter;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionPaused = document.querySelector(".portfolio")?.getAttribute("data-motion") === "off";
    viewport.scrollTo({ left, behavior: reducedMotion || motionPaused ? "auto" : "smooth" });
  };

  const handleKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const cards = Array.from(viewport.querySelectorAll<HTMLAnchorElement>(".work-gallery-card"));
    const focusedCard = (event.target as HTMLElement).closest(".work-gallery-card");
    const focusedIndex = cards.findIndex((card) => card === focusedCard);
    const origin = focusedIndex >= 0 ? focusedIndex : activeIndex;
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? work.length - 1
      : origin + (event.key === "ArrowRight" ? 1 : -1);
    const destination = Math.max(0, Math.min(work.length - 1, nextIndex));
    cards[destination]?.focus({ preventScroll: true });
    // Pinned cards navigate in onFocus. Native scrolling must be requested
    // explicitly so focus and the visible project always refer to one link.
    if (viewport.dataset.pinned !== "true" || focusedIndex === destination) goTo(destination);
  };

  return (
    <section id="work" className="selected-work work-gallery" aria-labelledby="work-gallery-title">
      <div className="work-gallery-pin">
        <div className="work-gallery-heading">
          <div>
            <span className="work-gallery-eyebrow">Selected work</span>
            <h2 id="work-gallery-title">A few things<br /><em>out in the world.</em></h2>
          </div>
          <a className="work-gallery-github" href="https://github.com/adiVIT" target="_blank" rel="noopener noreferrer">
            More on GitHub <ArrowUpRight size={17} strokeWidth={1.5} />
          </a>
        </div>

        <div ref={viewportRef} className="work-gallery-viewport" role="region" aria-label="Selected projects. Use left and right arrow keys to browse." tabIndex={0} onKeyDown={handleKeyboard}>
          <div className="work-gallery-track">
            {work.map((project, index) => (
              <a
                className={"work-gallery-card work-gallery-card-" + project.art}
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={"Visit " + project.name + " website (opens in a new tab)"}
                onFocus={() => { if (viewportRef.current?.dataset.pinned === "true") goTo(index); }}
              >
                <div className={"work-gallery-art work-gallery-art-" + project.art} aria-hidden="true">
                  {project.art === "restro" && (
                    <Image className="work-gallery-restaurant" src="/images/restro-restaurant.webp" width={1280} height={720} alt="" sizes="(max-width: 640px) 84vw, 62vw" />
                  )}
                  {project.art === "nurture" && (
                    <><div className="work-growth-sculpture"><i /><i /><i /><i /><i /><i /></div><span className="work-art-wordmark work-art-wordmark-nurture">Nurture.</span></>
                  )}
                  {project.art === "fitspot" && (
                    <>
                      <span className="work-art-wordmark work-art-wordmark-fitspot">PLAY.</span>
                      <div className="work-court"><i className="work-court-line" /><span className="work-court-circle" /><i className="work-court-area work-court-area-left" /><i className="work-court-area work-court-area-right" /></div>
                      <span className="work-court-ball" />
                    </>
                  )}
                </div>
                <div className="work-gallery-caption">
                  <div className="work-gallery-name"><h3>{project.name}</h3><span>{project.category}</span></div>
                  <p>{project.description}</p>
                  <span className="work-gallery-open"><ArrowUpRight strokeWidth={1.5} /></span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="work-gallery-controls" aria-label="Project navigation">
          <div className="work-gallery-tabs">
            {work.map((project, index) => (
              <button key={project.name} type="button" aria-label={"Show " + project.name} aria-pressed={index === activeIndex} onClick={() => goTo(index)}>
                <span>{String(index + 1).padStart(2, "0")}</span><span>{project.name}</span>
              </button>
            ))}
          </div>
          <div className="work-gallery-arrows">
            <button type="button" aria-label="Previous project" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}><ArrowLeft size={21} strokeWidth={1.5} /></button>
            <button type="button" aria-label="Next project" disabled={activeIndex === work.length - 1} onClick={() => goTo(activeIndex + 1)}><ArrowRight size={21} strokeWidth={1.5} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
