"use client";

import { useCallback, useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function usePortfolioMotion(
  root: RefObject<HTMLDivElement>,
  enabled: boolean,
  sceneProgress: RefObject<{ value: number }>,
  hobbyProgress: RefObject<{ value: number; draw?: (progress: number) => void }>,
) {
  const lenis = useRef<Lenis | null>(null);
  const pauseScroll = useCallback((paused: boolean) => {
    if (paused) lenis.current?.stop();
    else lenis.current?.start();
  }, []);
  useGSAP(
    () => {
      if (!enabled || !root.current) return;
      const media = gsap.matchMedia();
      const scope = gsap.utils.selector(root);
      let disposed = false;
      media.add(
        {
          desktop: "(min-width: 1024px) and (min-height: 700px)",
          mobile: "(max-width: 1023px), (max-height: 699px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          if (!context.conditions?.motion) return;
          const smooth = new Lenis({
            duration: 1.1,
            smoothWheel: true,
            anchors: true,
            autoRaf: false,
          });
          lenis.current = smooth;
          smooth.on("scroll", ScrollTrigger.update);
          const tick = (time: number) => smooth.raf(time * 1000);
          gsap.ticker.add(tick);

          gsap.from(scope(".hero-letter"), {
            yPercent: 115,
            rotation: 7,
            opacity: 0,
            stagger: 0.055,
            duration: 1.15,
            ease: "power4.out",
          });
          gsap.from(scope(".hero-intro > *, .hero-bottom > *"), {
            y: 25,
            opacity: 0,
            duration: 1,
            delay: 0.35,
            ease: "power3.out",
          });
          gsap.from(scope(".hero-art"), {
            scale: 0.65,
            rotation: -15,
            opacity: 0,
            duration: 1.7,
            ease: "power3.out",
          });
          const heroElement = scope(".hero")[0] as HTMLElement;
          const art = scope(".hero-art-scroll")[0] as HTMLElement;
          if (context.conditions.desktop) {
            const opening = gsap.timeline({
              scrollTrigger: {
                id: "portfolio-opening",
                refreshPriority: 3,
                trigger: heroElement,
                start: "top top",
                end: () => "+=" + window.innerHeight * 1.05,
                pin: true,
                scrub: 0.8,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });
            opening
              .to(
                scope(".name-first"),
                {
                  xPercent: -110,
                  rotation: -9,
                  autoAlpha: 0,
                  duration: 0.55,
                  ease: "power2.in",
                },
                0,
              )
              .to(
                scope(".name-last"),
                {
                  xPercent: 110,
                  rotation: 9,
                  autoAlpha: 0,
                  duration: 0.55,
                  ease: "power2.in",
                },
                0,
              )
              .to(
                scope(".hero-intro, .hero-bottom"),
                { autoAlpha: 0, y: -35, duration: 0.2 },
                0,
              )
              .to(
                art,
                {
                  x: () =>
                    innerWidth / 2 - (art.offsetLeft + art.offsetWidth / 2),
                  y: () =>
                    heroElement.clientHeight / 2 -
                    (art.offsetTop + art.offsetHeight / 2),
                  scale: 1.85,
                  rotation: 55,
                  duration: 1,
                  ease: "power2.inOut",
                },
                0,
              )
              .to(art, { opacity: 0.22, duration: 0.4 }, 0.5)
              .fromTo(
                scope(".hero-portal"),
                { autoAlpha: 0, y: 80, scale: 0.82 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.45,
                  ease: "power3.out",
                },
                0.45,
              );
            if (sceneProgress.current)
              opening.to(
                sceneProgress.current,
                { value: 1, duration: 1, ease: "none" },
                0,
              );
          } else {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: heroElement,
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.8,
                },
              })
              .to(
                scope(".name-first"),
                { xPercent: -28, rotation: -5, ease: "none" },
                0,
              )
              .to(
                scope(".name-last"),
                { xPercent: 28, rotation: 5, ease: "none" },
                0,
              )
              .to(
                art,
                { yPercent: 18, rotation: 40, scale: 1.12, ease: "none" },
                0,
              )
              .to(
                scope(".hero-bottom"),
                { y: -40, opacity: 0, ease: "none" },
                0,
              );
          }
          gsap.fromTo(
            scope(".manifesto-word"),
            { color: "#62685c" },
            {
              color: "#f0f1e9",
              stagger: 0.2,
              ease: "none",
              scrollTrigger: {
                trigger: scope(".manifesto"),
                start: "top 78%",
                end: "bottom 50%",
                scrub: 0.4,
              },
            },
          );
          gsap.fromTo(
            scope(".portrait-frame"),
            {
              rotation: -7,
              y: 65,
              scale: 0.9,
              clipPath: "inset(12% 20% 12% 20% round 180px)",
            },
            {
              rotation: 0,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 8px)",
              scrollTrigger: {
                trigger: scope(".about-grid"),
                start: "top 85%",
                end: "center 50%",
                scrub: 0.8,
              },
            },
          );
          gsap.to(scope(".portrait-frame img"), {
            yPercent: -8,
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: scope(".about-grid"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
          if (hobbyProgress.current) {
            const driver = hobbyProgress.current;
            gsap.fromTo(driver, { value: 0 }, {
              value: 1,
              ease: "none",
              onUpdate: () => driver.draw?.(driver.value),
              scrollTrigger: {
                id: "portfolio-hobbies",
                refreshPriority: 2.5,
                trigger: scope(".hobbies-pin"),
                start: "top 100px",
                end: () => "+=" + innerHeight * 2.6,
                pin: innerHeight >= 550,
                scrub: 0.4,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });
          }
          const chapters = scope(".chapter") as HTMLElement[];
          const chapterButtons = scope(
            ".chapter-index button",
          ) as HTMLElement[];
          if (context.conditions.desktop) {
            gsap.set(scope(".chapter-list"), {
              height: () => Math.min(innerHeight * 0.59, 520),
            });
            gsap.set(chapters, {
              position: "absolute",
              inset: 0,
              width: "100%",
              margin: 0,
            });
            gsap.set(chapters.slice(1), {
              yPercent: 110,
              rotation: 6,
              autoAlpha: 0,
            });
            const setChapter = (progress: number) => {
              const index = Math.min(
                chapters.length - 1,
                Math.round(progress * (chapters.length - 1)),
              );
              chapters.forEach((card, i) => {
                card.inert = i !== index;
              });
              chapterButtons.forEach((button, i) => {
                if (i === index) button.setAttribute("aria-current", "step");
                else button.removeAttribute("aria-current");
              });
            };
            setChapter(0);
            const story = gsap.timeline({
              onUpdate: function () {
                setChapter(this.progress());
              },
              scrollTrigger: {
                id: "portfolio-journey",
                refreshPriority: 1,
                trigger: scope(".journey-pin"),
                start: "top 100px",
                end: () => "+=" + (chapters.length - 1) * innerHeight * 0.8,
                pin: true,
                scrub: 0.65,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });
            chapters.slice(1).forEach((card, i) => {
              story
                .to(
                  chapters[i],
                  { scale: 0.86, rotation: -5, autoAlpha: 0, duration: 0.8 },
                  i,
                )
                .to(
                  card,
                  {
                    yPercent: 0,
                    rotation: 0,
                    autoAlpha: 1,
                    duration: 1,
                    ease: "power2.inOut",
                  },
                  i,
                )
                .from(
                  card.querySelector(".chapter-sculpture"),
                  { rotation: -65, scale: 0.55, duration: 1 },
                  i,
                );
            });
          } else {
            chapters.forEach((card) => {
              gsap.from(card, {
                y: 80,
                rotation: 4,
                scale: 0.92,
                autoAlpha: 0,
                scrollTrigger: {
                  trigger: card,
                  start: "top 95%",
                  end: "top 48%",
                  scrub: 0.5,
                },
              });
              gsap.to(card.querySelector(".chapter-sculpture"), {
                rotation: 60,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                },
              });
            });
          }
          const gallery = scope(".project-viewport")[0] as HTMLElement;
          const track = scope(".project-track")[0] as HTMLElement;
          if (context.conditions.desktop && gallery && track) {
            gsap.set(gallery, { overflowX: "clip" });
            const distance = () =>
              Math.max(0, track.scrollWidth - gallery.clientWidth);
            const horizontal = gsap.to(track, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                id: "portfolio-projects",
                refreshPriority: 2,
                trigger: scope(".projects-pin"),
                start: "top 100px",
                end: () => `+=${distance()}`,
                pin: true,
                scrub: 0.7,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });
            scope(".project-art-inner").forEach((art: HTMLElement) => {
              gsap.fromTo(
                art,
                { x: -30, rotation: -5 },
                {
                  x: 30,
                  rotation: 5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: art.parentElement,
                    containerAnimation: horizontal,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                },
              );
            });
          }
          scope(".reveal").forEach((element: HTMLElement) => {
            gsap.from(element, {
              y: 42,
              opacity: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 92%",
                toggleActions: "play none none reverse",
              },
            });
          });
          scope(".work-row").forEach((row: HTMLElement) => {
            gsap.from(row, {
              y: 55,
              autoAlpha: 0,
              scrollTrigger: {
                trigger: row,
                start: "top 93%",
                end: "top 65%",
                scrub: 0.5,
              },
            });
            gsap.from(row.querySelector(".work-preview"), {
              rotation: -12,
              scale: 0.8,
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "top 45%",
                scrub: 0.7,
              },
            });
          });
          scope(".kinetic-band").forEach((band: HTMLElement, index: number) => {
            gsap.fromTo(
              band,
              { xPercent: index % 2 ? -18 : 0 },
              {
                xPercent: index % 2 ? 0 : -18,
                ease: "none",
                scrollTrigger: {
                  trigger: band.parentElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                },
              },
            );
          });
          gsap.from(scope(".contact-title span"), {
            yPercent: 70,
            rotation: 4,
            stagger: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: scope(".contact"),
              start: "top 88%",
              end: "top 25%",
              scrub: 0.7,
            },
          });
          gsap.fromTo(
            scope(".contact-orb"),
            { scale: 0.4, rotation: -90 },
            {
              scale: 1,
              rotation: 0,
              ease: "none",
              scrollTrigger: {
                trigger: scope(".contact"),
                start: "top bottom",
                end: "center center",
                scrub: 0.8,
              },
            },
          );
          gsap.to(scope(".page-progress"), {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: true },
          });
          const detach: (() => void)[] = [];
          if (window.matchMedia("(pointer: fine)").matches) {
            scope(".magnetic").forEach((button: HTMLElement) => {
              const x = gsap.quickTo(button, "x", {
                duration: 0.4,
                ease: "power3.out",
              });
              const y = gsap.quickTo(button, "y", {
                duration: 0.4,
                ease: "power3.out",
              });
              const move = (event: PointerEvent) => {
                const rect = button.getBoundingClientRect();
                x((event.clientX - rect.left - rect.width / 2) * 0.15);
                y((event.clientY - rect.top - rect.height / 2) * 0.15);
              };
              const leave = () => {
                x(0);
                y(0);
              };
              button.addEventListener("pointermove", move);
              button.addEventListener("pointerleave", leave);
              detach.push(() => {
                button.removeEventListener("pointermove", move);
                button.removeEventListener("pointerleave", leave);
              });
            });
          }
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
          let refreshFrame = 0;
          const layoutObserver = new ResizeObserver(() => {
            cancelAnimationFrame(refreshFrame);
            refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
          });
          scope(".principle-list").forEach((element: HTMLElement) =>
            layoutObserver.observe(element),
          );
          return () => {
            chapters.forEach((card) => {
              card.inert = false;
            });
            chapterButtons.forEach((button) =>
              button.removeAttribute("aria-current"),
            );
            layoutObserver.disconnect();
            cancelAnimationFrame(refreshFrame);
            detach.forEach((remove) => remove());
            gsap.ticker.remove(tick);
            smooth.destroy();
            lenis.current = null;
          };
        },
      );
      document.fonts.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
      return () => {
        disposed = true;
        media.revert();
      };
    },
    { scope: root, dependencies: [enabled], revertOnUpdate: true },
  );
  return {
    pauseScroll,
    moveHobbies(index: number) {
      const trigger = ScrollTrigger.getById("portfolio-hobbies");
      const position = (index + 0.3) / 4;
      if (trigger) {
        const destination = trigger.start + (trigger.end - trigger.start) * position;
        if (lenis.current) lenis.current.scrollTo(destination, { duration: 0.65 });
        else window.scrollTo({ top: destination, behavior: "smooth" });
      } else hobbyProgress.current?.draw?.(position);
    },
    moveJourney(index: number) {
      const trigger = ScrollTrigger.getById("portfolio-journey");
      const chapters = root.current?.querySelectorAll<HTMLElement>(".chapter");
      if (!chapters?.[index]) return;
      if (trigger) {
        const destination =
          trigger.start +
          ((trigger.end - trigger.start) * index) / (chapters.length - 1);
        if (lenis.current)
          lenis.current.scrollTo(destination, { duration: 0.8 });
        else
          window.scrollTo({
            top: destination,
            behavior: enabled ? "smooth" : "instant",
          });
      } else
        chapters[index].scrollIntoView({
          behavior: enabled ? "smooth" : "instant",
          block: "center",
        });
    },
    moveGallery(index: number) {
      const trigger = ScrollTrigger.getById("portfolio-projects");
      const viewport =
        root.current?.querySelector<HTMLElement>(".project-viewport");
      const card =
        root.current?.querySelectorAll<HTMLElement>(".project-card")[index];
      if (!card || !viewport) return;
      if (trigger) {
        const destination =
          trigger.start +
          Math.min(card.offsetLeft, trigger.end - trigger.start);
        if (lenis.current)
          lenis.current.scrollTo(destination, { duration: 0.8 });
        else
          window.scrollTo({
            top: destination,
            behavior: enabled ? "smooth" : "instant",
          });
      } else
        viewport.scrollTo({
          left: card.offsetLeft,
          behavior: enabled ? "smooth" : "instant",
        });
    },
  };
}
