"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, MoveUpRight, RotateCcw } from "lucide-react";
import { chessSquare, hobbyScenes } from "./hobby-world-data";
import "./personal-scenes.css";

const HobbyWorld = dynamic(() => import("./hobby-world"), {
  ssr: false,
  loading: () => <div className="hobby-loading-object" aria-hidden="true"><i /><i /><i /></div>,
});

export function PersonalScenes({ animated, progress, onJump, onAction }: {
  animated: boolean;
  progress: RefObject<{ value: number; draw?: (progress: number) => void }>;
  onJump: (index: number) => void;
  onAction?: (index: number) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);
  const [actions, setActions] = useState([0, 0, 0, 0]);
  const [announcement, setAnnouncement] = useState("");
  const selected = useRef(0);
  const current = hobbyScenes[scene];
  const action = actions[scene];

  useEffect(() => {
    const driver = progress.current;
    if (!driver) return;
    const draw = (value: number) => {
      const position = Math.min(3.999, Math.max(0, value * 4));
      const index = Math.floor(position);
      stage.current?.style.setProperty("--hobby-drift", `${(position % 1 - 0.3) * -28}px`);
      if (selected.current !== index) {
        selected.current = index;
        setScene(index);
        setAnnouncement("");
      }
    };
    driver.draw = draw;
    draw(driver.value);
    return () => { if (driver.draw === draw) driver.draw = undefined; };
  }, [progress]);

  function play() {
    const next = actions[scene] + 1;
    setActions((values) => values.map((value, index) => index === scene ? value + 1 : value));
    setAnnouncement(scene === 0 ? `Shot ${next}. Go on, one more.`
      : scene === 1 ? `Knight moved from ${chessSquare(next - 1)} to ${chessSquare(next)}.`
      : scene === 2 ? (next % 2 ? "The build is pulled apart. Put it back together." : "All the pieces, back in place.")
      : `Launch ${next}. Another idea out in the world.`);
    onAction?.(scene);
  }

  function choose(index: number, focus = false) {
    onJump(index);
    if (focus) stage.current?.querySelectorAll<HTMLButtonElement>(".hobby-world-nav button")[index]?.focus({ preventScroll: true });
  }

  const readout = scene === 0 ? (action ? "Go on, one more." : "A little friendly competition.")
    : scene === 1 ? `Knight at ${chessSquare(action)}`
    : scene === 2 ? (action % 2 ? "Every piece has its place." : "Nothing is finished forever.")
    : action ? "An idea is better out in the world." : "Good things happen when we build together.";

  return (
    <section id="hobbies" className="hobbies section-space" aria-labelledby="hobbies-title">
      <div className="hobby-section-heading">
        <h2 id="hobbies-title">Between <em>builds.</em></h2>
        <p>The games, experiments, and detours that keep me going.</p>
      </div>
      <div ref={stage} className="hobbies-pin hobby-stage" data-scene={scene} data-motion={animated ? "on" : "off"}
        style={{ "--hobby-color": "var(--theme-light)", "--hobby-ink": "var(--ink)" } as CSSProperties}>
        <div className="hobby-stage-grain" aria-hidden="true" />
        <span className="hobby-giant-word" key={scene} aria-hidden="true">{current.word}</span>
        <span className="hobby-stage-corner" aria-hidden="true"><MoveUpRight size={26} strokeWidth={1.2} /></span>
        <div id="hobby-scene-panel" className="hobby-scene-panel" role="tabpanel" aria-labelledby={`hobby-tab-${scene}`}>
          <div className="hobby-model-space" role="img" aria-label={[
            "A sculptural football and a miniature goal. Use Take a shot to play.",
            "A sculptural knight on a chessboard. Use Move the knight to explore its moves.",
            "A modular cube made of individual blocks. Pull it apart and put it back together.",
            "A miniature rocket ready for liftoff. Use Launch the idea to send it flying.",
          ][scene]}>
            <HobbyWorld animated={animated} scene={scene} action={action} progress={progress} />
          </div>
          <div className="hobby-scene-copy" key={scene}>
            <h3>{current.name}</h3>
            <p>{current.line}</p>
          </div>
          <div className="hobby-play-controls">
            <button className="hobby-play-button" onClick={play}>
              {scene === 2 && action % 2 ? "Put it together" : current.action}
              {scene === 2 && action % 2 ? <RotateCcw size={17} /> : <ArrowUpRight size={19} />}
            </button>
            <span className="hobby-action-readout">{readout}</span>
          </div>
        </div>
        <div className="hobby-world-nav" role="tablist" aria-label="Choose an interest">
          {hobbyScenes.map((item, index) => <button key={item.name} role="tab" id={`hobby-tab-${index}`}
            aria-selected={scene === index} aria-controls="hobby-scene-panel" tabIndex={scene === index ? 0 : -1}
            onClick={() => choose(index)} onKeyDown={(event) => {
              const next = event.key === "ArrowRight" ? (index + 1) % 4 : event.key === "ArrowLeft" ? (index + 3) % 4 : event.key === "Home" ? 0 : event.key === "End" ? 3 : -1;
              if (next !== -1) { event.preventDefault(); choose(next, true); }
            }}><span>{item.name}</span><ArrowUpRight size={15} aria-hidden="true" /></button>)}
        </div>
        <span className="sr-only" role="status">{announcement}</span>
      </div>
    </section>
  );
}
