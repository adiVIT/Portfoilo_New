"use client";

import { ArrowUpRight, Asterisk, Plus } from "lucide-react";
import {
  experienceChapters,
  type ExperienceChapter,
} from "@/lib/portfolio/content";

const highlights = [
  "Marketing, marketplaces, and startup operations.",
  "Android experiences for Wealth Builder.",
  "A restaurant POS, from idea to live orders.",
  "DigiGold and DigiSilver on mobile.",
  "Building at Synthiolabs.",
];
const verbs = ["LEARN", "BUILD", "SHIP", "CARE", "NEXT"];

export function JourneyStack({
  onOpen,
  onJump,
}: {
  onOpen: (chapter: ExperienceChapter) => void;
  onJump: (index: number) => void;
}) {
  return (
    <section id="journey" className="journey section-space">
      <div className="journey-pin">
        <div className="journey-heading">
          <h2>
            What shaped <em>my work.</em>
          </h2>
          <a
            className="text-link"
            href="https://www.linkedin.com/in/aditya-bajaj-6128811b6/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="chapter-list">
          {experienceChapters.map((chapter, index) => (
            <article
              className={"chapter chapter-" + index}
              key={chapter.company}
            >
              <div className="chapter-art" aria-hidden="true">
                <span className="chapter-verb">{verbs[index]}</span>
                <div className="chapter-sculpture">
                  <i />
                  <i />
                  <i />
                  <i />
                  <Asterisk strokeWidth={0.65} />
                </div>
              </div>
              <div className="chapter-meta">
                <span>
                  {index === 0 ? "2023" : index === 1 ? "2025" : chapter.period}
                </span>
                <chapter.icon size={20} strokeWidth={1.5} />
              </div>
              <div className="chapter-content">
                <h3 className="chapter-brand">{chapter.company}</h3>
                <span className="chapter-role">{chapter.role}</span>
                <p className="chapter-proof">{highlights[index]}</p>
                <button
                  className="text-link"
                  onClick={() => onOpen(chapter)}
                  aria-label={"Read the " + chapter.company + " story"}
                >
                  The story <Plus size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="chapter-index" aria-label="Jump to career chapter">
          {experienceChapters.map((chapter, index) => (
            <button key={chapter.company} onClick={() => onJump(index)}>
              {chapter.company}
              <span />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
