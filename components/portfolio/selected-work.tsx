"use client";

import { ArrowUpRight, Asterisk } from "lucide-react";

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

export function SelectedWork() {
  return (
    <section id="work" className="selected-work section-space">
      <div className="work-heading reveal">
        <h2>
          A few things <em>I’ve built.</em>
        </h2>
        <a
          className="text-link"
          href="https://github.com/adiVIT"
          target="_blank"
          rel="noreferrer"
        >
          More on GitHub <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="work-list">
        {work.map((project) => (
          <a
            className="work-row"
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            aria-label={"Visit " + project.name + " website"}
          >
            <div
              className={"work-preview work-preview-" + project.art}
              aria-hidden="true"
            >
              {project.art === "restro" && (
                <div className="work-orbits">
                  <i />
                  <i />
                  <i />
                  <Asterisk strokeWidth={1} />
                </div>
              )}
              {project.art === "nurture" && (
                <div className="work-growth">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              )}
              {project.art === "fitspot" && (
                <div className="work-pitch"><i /><span /></div>
              )}
            </div>
            <div className="work-title">
              <span>{project.category}</span>
              <h3>{project.name}</h3>
            </div>
            <p>{project.description}</p>
            <ArrowUpRight className="work-arrow" strokeWidth={1.3} />
          </a>
        ))}
      </div>
    </section>
  );
}
