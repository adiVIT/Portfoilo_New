"use client";

import { useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Asterisk, Shuffle } from "lucide-react";
import { SoundRoom } from "./sound-room";
import type { MusicController } from "./music-types";

const experiments = [
  { name: "Form", hint: "Nothing stays in one shape." },
  { name: "Type", hint: "Letters with a little personality." },
  { name: "Rhythm", hint: "Find your own pace." },
];
const wave = [
  18, 32, 57, 83, 45, 66, 100, 76, 48, 93, 62, 38, 72, 95, 55, 28, 65, 88, 42,
  20,
];

const melody = [
  { midi: 69, label: "A" }, { midi: 72, label: "C" },
  { midi: 76, label: "E" }, { midi: 79, label: "G" },
  { midi: 76, label: "E" }, { midi: 74, label: "D" },
  { midi: 72, label: "C" }, { midi: 67, label: "G" },
];

export function Playground({ onJump, onNote, music, soundError, soundOn, onMute }: {
  onJump: (index: number) => void;
  onNote: (midi: number, voice: number) => Promise<void>;
  music: MusicController;
  soundError: string;
  soundOn: boolean;
  onMute: () => Promise<void>;
}) {
  const [variations, setVariations] = useState([0, 0, 0]);
  const nextNote = useRef(0);
  function playNote(index: number, voice = 0) {
    nextNote.current = (index + 1) % melody.length;
    void onNote(melody[index].midi, voice);
  }
  function remix(index: number) {
    playNote(nextNote.current, index);
    setVariations((current) => current.map((value, i) => i === index ? (value + 1) % 3 : value));
  }
  return (
    <section id="playground" className="projects-section section-space">
      <SoundRoom music={music} soundError={soundError} soundOn={soundOn} onMute={onMute} />
      <div className="projects-pin">
        <div className="projects-heading">
          <h2>
            Keep <em>playing.</em>
          </h2>
          <div className="gallery-controls">
            <button
              className="circle-button"
              aria-label="First experiment"
              onClick={() => onJump(0)}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              className="circle-button"
              aria-label="Last experiment"
              onClick={() => onJump(2)}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        <div
          className="project-viewport"
          role="region"
          aria-label="Interactive playground"
          tabIndex={0}
        >
          <div className="project-track">
            {experiments.map((experiment, index) => (
              <article className="project-card" key={experiment.name}>
                <button
                  className={
                    "project-art-button experiment experiment-" + index
                  }
                  data-variation={variations[index]}
                  data-instrument
                  onClick={() => remix(index)}
                  onFocus={(event) => {
                    const card = event.currentTarget.getBoundingClientRect();
                    const viewport = event.currentTarget.closest(".project-viewport")?.getBoundingClientRect();
                    if (viewport && (card.left < viewport.left - 1 || card.right > viewport.right + 1)) onJump(index);
                  }}
                  aria-label={
                    "Remix " +
                    experiment.name.toLowerCase() +
                    ", variation " +
                    (variations[index] + 1) +
                    " of 3"
                  }
                >
                  <div className="project-art" aria-hidden="true">
                    <div className="project-art-inner">
                      {index === 0 && (
                        <div className="play-form">
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <Asterisk strokeWidth={0.65} />
                        </div>
                      )}
                      {index === 1 && (
                        <strong className="play-type">
                          {["Aa.", "Oh!", "Hey."][variations[index]]}
                        </strong>
                      )}
                      {index === 2 && (
                        <div
                          className="play-wave"
                          style={
                            {
                              "--beat": ["1.4s", "0.7s", "2.1s"][
                                variations[index]
                              ],
                            } as CSSProperties
                          }
                        >
                          {wave.map((height, i) => (
                            <i
                              key={i}
                              style={{
                                height: height + "%",
                                animationDelay: i * -0.12 + "s",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="project-open" aria-hidden="true">
                    <Shuffle size={20} />
                  </span>
                </button>
                <div className="project-card-meta">
                  <span>{experiment.hint}</span>
                  <span>Tap to remix ↗</span>
                </div>
                <h3 className="project-name">{experiment.name}</h3>
              </article>
            ))}
          </div>
        </div>
        <div className="project-index" aria-label="Jump to experiment">
          {experiments.map((experiment, index) => (
            <button key={experiment.name} onClick={() => onJump(index)}>
              {experiment.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
