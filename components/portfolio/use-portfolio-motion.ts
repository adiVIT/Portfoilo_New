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

          gsap.from(scope(".hero-glyph"), {
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
          const cinematicStage = scope(".manifesto-stage")[0] as HTMLElement | undefined;
          if (context.conditions.desktop) {
            const opening = gsap.timeline({
              scrollTrigger: {
                id: "portfolio-opening",
                refreshPriority: 5,
                trigger: heroElement,
                start: "top top",
                end: () => "+=" + window.innerHeight * 1.35,
                pin: true,
                scrub: 0.7,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });
            opening
              .to(scope(".name-first .hero-letter"), {
                yPercent: (index: number) => -80 - index * 14,
                xPercent: -20,
                rotation: -12,
                stagger: 0.025,
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.in",
              }, 0)
              .to(scope(".name-last .hero-letter, .name-period"), {
                yPercent: (index: number) => 100 + index * 15,
                rotation: 14,
                stagger: 0.025,
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.in",
              }, 0)
              .to(scope(".hero-intro, .hero-bottom, .hero-side-note"), {
                autoAlpha: 0, y: -25, duration: 0.23,
              }, 0)
              .to(art, {
                x: () => heroElement.clientWidth / 2 - (art.offsetLeft + art.offsetWidth / 2),
                y: () => heroElement.clientHeight / 2 - (art.offsetTop + art.offsetHeight / 2),
                scale: 1.24,
                rotation: -18,
                duration: 1.1,
                ease: "none",
              }, 0)
              .to(art, { opacity: 0.14, duration: 0.4 }, 0.65)
              .fromTo(scope(".hero-portal"), {
                autoAlpha: 0, y: 80, scale: 0.82,
              }, {
                autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out",
              }, 0.6);
            if (sceneProgress.current) {
              opening.fromTo(sceneProgress.current, { value: 0 }, {
                value: 1, duration: 1.1, ease: "none",
              }, 0);
            }

            if (cinematicStage) {
              cinematicStage.dataset.enhanced = "true";
              const planes = scope(".manifesto-plane") as HTMLElement[];
              const finalPlane = scope(".manifesto-final")[0] as HTMLElement;
              gsap.set(planes[0], { z: -180, rotationY: -12, autoAlpha: 1 });
              gsap.set(planes[1], { z: -1100, rotationY: 16, autoAlpha: 0 });
              gsap.set(planes[2], { z: -700, rotationX: 12, autoAlpha: 0 });
              const tunnel = gsap.timeline({
                scrollTrigger: {
                  id: "portfolio-manifesto",
                  refreshPriority: 4,
                  trigger: scope(".manifesto-pin"),
                  start: "top top",
                  end: () => "+=" + innerHeight * 2,
                  pin: true,
                  scrub: 0.65,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });
              tunnel
                .to(planes[0], { z: 250, rotationY: 0, duration: 0.65, ease: "none" }, 0)
                .to(planes[0], { z: 1050, duration: 0.5, ease: "power1.in" }, 0.65)
                .to(planes[0], { autoAlpha: 0, duration: 0.22, ease: "power1.in" }, 0.65)
                .to(planes[1], { z: -100, rotationY: 0, autoAlpha: 1, duration: 0.68, ease: "power2.out" }, 0.85)
                .to(planes[1], { z: 1000, rotationY: -8, duration: 0.7, ease: "power1.in" }, 1.55)
                .to(planes[1], { autoAlpha: 0, duration: 0.25, ease: "power1.in" }, 1.55)
                .to(finalPlane, { z: 0, rotationX: 0, autoAlpha: 1, duration: 0.85, ease: "power2.out" }, 1.8)
                .from(scope(".manifesto-feel"), { xPercent: -10, duration: 0.7, ease: "power2.out" }, 2.05)
                .to({}, { duration: 0.25 });
            }
          } else {
            const mobileOpening = gsap.timeline({
              scrollTrigger: {
                trigger: heroElement,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            });
            mobileOpening
              .to(scope(".name-first"), { xPercent: -15, yPercent: -25, rotation: -4, ease: "none" }, 0)
              .to(scope(".name-last"), { xPercent: 12, yPercent: 20, rotation: 4, ease: "none" }, 0)
              .to(art, { yPercent: 15, rotation: 20, scale: 1.1, ease: "none" }, 0)
              .to(scope(".hero-side-note"), { autoAlpha: 0, ease: "none" }, 0);
            if (sceneProgress.current) {
              mobileOpening.fromTo(sceneProgress.current, { value: 0 }, { value: 0.55, ease: "none" }, 0);
            }
            gsap.from(scope(".manifesto-statement > span"), {
              yPercent: 45, rotation: -4, stagger: 0.12, opacity: 0, ease: "none",
              scrollTrigger: { trigger: cinematicStage, start: "top 85%", end: "center 65%", scrub: 0.5 },
            });
          }
          gsap.fromTo(
            scope(".manifesto-word"),
            { opacity: 0.35 },
            {
              opacity: 1,
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
            },
            {
              rotation: 0,
              y: 0,
              scale: 1,
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
          if (context.conditions.desktop && hobbyProgress.current) {
            const driver = hobbyProgress.current;
            gsap.fromTo(driver, { value: 0 }, {
              value: 1,
              ease: "none",
              onUpdate: () => driver.draw?.(driver.value),
              scrollTrigger: {
                id: "portfolio-hobbies",
                refreshPriority: 3,
                trigger: scope(".hobbies-pin"),
                start: "top 100px",
                end: () => "+=" + innerHeight * 2.4,
                pin: true,
                scrub: 0.4,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });
          }
          const workViewport = scope(".work-gallery-viewport")[0] as HTMLElement | undefined;
          const workTrack = scope(".work-gallery-track")[0] as HTMLElement | undefined;
          const workCards = scope(".work-gallery-card") as HTMLElement[];
          if (context.conditions.desktop && workViewport && workTrack && workCards.length) {
            workViewport.dataset.pinned = "true";
            workViewport.scrollLeft = 0;
            gsap.set(workViewport, { overflow: "clip" });
            const distance = () => Math.max(0, workTrack.scrollWidth - workViewport.clientWidth);
            let activeWork = -1;
            let galleryWidth = workViewport.clientWidth;
            let galleryDistance = distance();
            let centers = workCards.map((card) => card.offsetLeft + card.offsetWidth / 2);
            const measureGallery = () => {
              galleryWidth = workViewport.clientWidth;
              galleryDistance = distance();
              centers = workCards.map((card) => card.offsetLeft + card.offsetWidth / 2);
            };
            const setters = workCards.map((card) => ({
              rotation: gsap.quickSetter(card, "rotationY", "deg"),
              y: gsap.quickSetter(card, "y", "px"),
              scale: gsap.quickSetter(card, "scale"),
            }));
            const poseGallery = (progress: number) => {
              const travel = progress * galleryDistance;
              let nearest = 0;
              let minimum = Infinity;
              workCards.forEach((card, index) => {
                const offset = (centers[index] - travel - galleryWidth / 2) / galleryWidth;
                const bend = gsap.utils.clamp(-1, 1, offset);
                setters[index].rotation(-bend * 24);
                setters[index].y(Math.abs(bend) * 42);
                setters[index].scale(1 - Math.abs(bend) * 0.08);
                if (Math.abs(offset) < minimum) { minimum = Math.abs(offset); nearest = index; }
              });
              if (nearest !== activeWork) {
                activeWork = nearest;
                workViewport.dataset.activeIndex = String(nearest);
                workViewport.dispatchEvent(new CustomEvent("workgallerychange", { detail: { index: nearest } }));
              }
            };
            gsap.to(workTrack, {
              x: () => -distance(),
              ease: "none",
              onUpdate: function () { poseGallery(this.progress()); },
              scrollTrigger: {
                id: "portfolio-work",
                refreshPriority: 2.5,
                trigger: scope(".work-gallery-pin"),
                start: "top 95px",
                end: () => "+=" + Math.max(distance(), innerHeight * 1.5),
                pin: true,
                scrub: 0.65,
                invalidateOnRefresh: true,
                anticipatePin: 1,
                onRefresh: (self) => { measureGallery(); poseGallery(self.progress); },
              },
            });
            poseGallery(0);
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
            cinematicStage?.removeAttribute("data-enhanced");
            workViewport?.removeAttribute("data-pinned");
            workViewport?.removeAttribute("data-active-index");
            workCards.forEach((card) => gsap.set(card, { clearProps: "transform" }));
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
      } else if (hobbyProgress.current) {
        hobbyProgress.current.value = position;
        hobbyProgress.current.draw?.(position);
      }
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
    moveWork(index: number) {
      const trigger = ScrollTrigger.getById("portfolio-work");
      const viewport = root.current?.querySelector<HTMLElement>(".work-gallery-viewport");
      const track = root.current?.querySelector<HTMLElement>(".work-gallery-track");
      const card = root.current?.querySelectorAll<HTMLElement>(".work-gallery-card")[index];
      if (!card || !viewport || !track) return;
      const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const left = Math.max(0, Math.min(distance, card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2));
      if (trigger && distance) {
        const destination = trigger.start + (trigger.end - trigger.start) * left / distance;
        if (lenis.current) lenis.current.scrollTo(destination, { duration: 0.8 });
        else window.scrollTo({ top: destination, behavior: enabled ? "smooth" : "instant" });
      } else {
        viewport.scrollTo({ left, behavior: enabled ? "smooth" : "instant" });
      }
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
