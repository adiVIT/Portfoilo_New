"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Circle, Music2, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { grooveOptions, padsForGroove, type MusicController, type MusicLayer } from "./music-types";
import "./sound-room.css";

const layers: { id: MusicLayer; label: string }[] = [
  { id: "drums", label: "Drums" },
  { id: "bass", label: "Bass" },
  { id: "chords", label: "Keys" },
];
const steps = Array.from({ length: 16 }, (_, i) => i);

export function SoundRoom({ music, soundError, soundOn, onMute }: {
  music: MusicController;
  soundError: string;
  soundOn: boolean;
  onMute: () => Promise<void>;
}) {
  const room = useRef<HTMLDivElement>(null);
  const padTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const recordRotation = useRef(0);
  const [touched, setTouched] = useState(false);
  const groove = grooveOptions.find((option) => option.id === music.preset) ?? grooveOptions[0];
  const hasLoop = music.recordedSteps.some(Boolean);

  useEffect(() => music.subscribe((event) => {
    const element = room.current;
    if (!element) return;
    if (event.type === "step") {
      element.querySelectorAll<HTMLElement>(".sound-step").forEach((step, index) => {
        step.dataset.current = String(index === event.step);
      });
      const counter = element.querySelector(".sound-bar-count");
      if (counter) counter.textContent = `${String(event.bar + 1).padStart(2, "0")} / 04`;
      recordRotation.current += 5.625;
      element.style.setProperty("--record-angle", `${recordRotation.current}deg`);
      element.dataset.beat = String(event.step % 4 === 0);
    } else if (event.type === "pad") {
      const pad = element.querySelector<HTMLElement>(`[data-pad="${event.index}"]`);
      if (pad) {
        pad.dataset.hit = "true";
        clearTimeout(padTimers.current[event.index]);
        padTimers.current[event.index] = setTimeout(() => { pad.dataset.hit = "false"; }, 160);
      }
      element.dataset.lastPad = String(event.index);
    } else {
      element.dataset.beat = "false";
      element.querySelectorAll<HTMLElement>(".sound-step").forEach((step) => { step.dataset.current = "false"; });
    }
  }), [music.subscribe]);

  useEffect(() => () => padTimers.current.forEach(clearTimeout), []);

  function strike(index: number) {
    setTouched(true);
    void music.playPad(index);
  }

  return (
    <div className="sound-room" ref={room} data-instrument data-playing={music.playing}
      data-recording={music.recording} data-preset={music.preset}
      style={{ "--groove-duration": `${240 / groove.bpm}s` } as CSSProperties}
      onKeyDown={(event) => {
        if (event.repeat || event.altKey || event.ctrlKey || event.metaKey ||
          !(event.target instanceof HTMLElement) || event.target.isContentEditable ||
          event.target.closest("input, textarea, select") || !/^[1-8]$/.test(event.key)) return;
        event.preventDefault();
        strike(Number(event.key) - 1);
      }}>
      <div className="sound-room-heading">
        <h2>Make a little <br /><em>noise.</em></h2>
        <p>Pick a groove. Tap the pads. Make it yours.</p>
      </div>

      <div className="sound-console">
        <div className="sound-record-side">
          <div className="sound-record-top"><Music2 size={16} /><span>A little music, by you</span></div>
          <button className="sound-record" onClick={() => void music.togglePlayback()}
            aria-label={music.playing ? "Pause the groove" : "Play the groove"} aria-pressed={music.playing}>
            <span className="sound-record-grooves" aria-hidden="true" />
            <span className="sound-record-label" aria-hidden="true">
              <span>{music.playing ? "FEELING IT?" : "GO ON."}</span>
              <strong>{music.playing ? <>MAKE IT<br />YOURS.</> : <>GIVE IT<br />A SPIN.</>}</strong>
              {music.playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </span>
          </button>
          <div className="sound-record-footer">
            <span className="sound-tempo">{groove.bpm}<small>BPM</small></span>
            <span className="sound-groove-name">{groove.name}<small>{groove.description}</small></span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </div>
        </div>

        <div className="sound-desk">
          <div className="sound-presets" role="group" aria-label="Choose a groove">
            {grooveOptions.map((option) => (
              <button key={option.id} aria-pressed={music.preset === option.id}
                onClick={() => music.setPreset(option.id)}><span>{option.name}</span><small aria-hidden="true">{option.bpm} BPM</small></button>
            ))}
          </div>

          <div className="sound-pad-hint"><span>{touched ? "Nice. Keep going." : "Every tap belongs here."}</span><span>Tap or use keys 1–8</span></div>
          <div className="sound-pads" role="group" aria-label="Drum and melody pads">
            {padsForGroove(music.preset).map((pad, index) => (
              <button key={pad.key} className={`sound-pad sound-pad-${pad.kind}`} data-pad={index}
                aria-label={`Play ${pad.name}, key ${pad.key}`} aria-keyshortcuts={pad.key}
                onPointerDown={(event) => {
                  if (event.button !== 0) return;
                  event.preventDefault();
                  event.currentTarget.focus({ preventScroll: true });
                  strike(index);
                }}
                onClick={(event) => { if (event.detail === 0) strike(index); }}>
                <span className="sound-pad-number" aria-hidden="true">{pad.key}</span>
                <span className={`sound-pad-symbol symbol-${pad.glyph}`} aria-hidden="true"><i /><i /><i /></span>
                <span className="sound-pad-name">{pad.name}</span>
              </button>
            ))}
          </div>

          <div className="sound-sequence" aria-label="Your loop">
            <div className="sound-sequence-label"><span>{music.recording ? "Listening to your taps" : hasLoop ? "Your taps are in the mix" : "Leave your mark on the loop"}</span><span className="sound-bar-count" aria-hidden="true">01 / 04</span></div>
            <div className="sound-steps" aria-hidden="true">
              {steps.map((step) => <i className="sound-step" key={step} data-recorded={music.recordedSteps[step] ?? false} />)}
            </div>
          </div>

          <div className="sound-transport">
            <button className="sound-play-button" onClick={() => void music.togglePlayback()} aria-pressed={music.playing}>
              {music.playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
              {music.playing ? "Pause groove" : "Start a groove"}
            </button>
            <button className="sound-loop-button" onClick={() => void music.toggleRecording()} aria-pressed={music.recording}>
              <Circle size={12} fill={music.recording ? "currentColor" : "none"} />
              {music.recording ? "Finish loop" : "Loop my taps"}
            </button>
            <button className="sound-clear-button" onClick={music.clearRecording} disabled={!hasLoop} aria-label="Clear your recorded taps" title="Clear your taps"><RotateCcw size={17} /></button>
          </div>

          <div className="sound-mixer">
            <div className="sound-layers" role="group" aria-label="Backing layers">
              {layers.map((layer) => <button key={layer.id} onClick={() => music.toggleLayer(layer.id)}
                aria-pressed={music.layers[layer.id]} aria-label={`${layer.label} backing layer`}><i aria-hidden="true" />{layer.label}</button>)}
            </div>
            <label className="sound-volume"><Volume2 size={14} aria-hidden="true" /><span className="sr-only">Music volume</span>
              <input type="range" min="0" max="100" value={Math.round(music.volume * 100)} onChange={(event) => music.setVolume(Number(event.target.value) / 100)} aria-valuetext={`${Math.round(music.volume * 100)} percent`} />
            </label>
          </div>
          <div className="sound-status" role="status">
            {soundError || (music.recording ? "Tap a pad. It comes back around, right on the beat." : music.playing ? "Your groove is playing. Switch off a layer and fill the space." : "Sound starts with you. Headphones make it even better.")}
            {soundOn && <button onClick={() => void onMute()}>Mute all</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
