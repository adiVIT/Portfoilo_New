"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type SoundEngine = ReturnType<typeof createSoundEngine>;

function createSoundEngine() {
  const AudioContextClass =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) throw new Error("Web Audio is unavailable");
  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.value = 0.32;
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.value = -18;
  limiter.ratio.value = 8;
  master.connect(limiter).connect(context.destination);

  // Every sound is a finite cue; there are no looping sources or idle audio.
  function note(frequency: number, delay = 0, duration = 0.45, volume = 0.12, type: OscillatorType = "sine") {
    if (context.state !== "running") return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 0.998,
      start + duration,
    );
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(volume, start + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope).connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  }

  return {
    context,
    note,
    chord(step = 0) {
      const notes = [
        [220, 329.63, 440],
        [261.63, 392, 523.25],
        [293.66, 440, 587.33],
      ];
      notes[step % notes.length].forEach((frequency, index) =>
        note(frequency, index * 0.04, 0.3, 0.085),
      );
    },
    instrument(midi: number, voice: number) {
      const frequency = 440 * 2 ** ((midi - 69) / 12);
      if (voice === 0) {
        // Soft electric keys with a quick harmonic attack and one finite echo.
        note(frequency, 0, 0.65, 0.18);
        note(frequency * 2, 0, 0.18, 0.035, "triangle");
        note(frequency, 0.18, 0.35, 0.045);
      } else if (voice === 1) {
        note(frequency * 2, 0, 0.23, 0.11, "triangle");
        note(frequency * 3, 0, 0.12, 0.025);
        note(frequency * 2, 0.16, 0.22, 0.03);
      } else {
        note(frequency / 4, 0, 0.3, 0.23, "triangle");
        note(frequency / 2, 0, 0.12, 0.065);
      }
    },
    dispose() {
      master.disconnect();
      limiter.disconnect();
      void context.close().catch(() => {});
    },
  };
}

export function usePortfolioSound(
  root: RefObject<HTMLDivElement>,
) {
  const engine = useRef<SoundEngine | null>(null);
  const busy = useRef(false);
  const active = useRef(false);
  const alive = useRef(true);
  const generation = useRef(0);
  const [soundOn, setSoundOn] = useState(false);
  const [soundError, setSoundError] = useState("");

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      active.current = false;
      engine.current?.dispose();
      engine.current = null;
    };
  }, []);

  async function toggleSound() {
    if (busy.current) return;
    busy.current = true;
    generation.current += 1;
    try {
      if (active.current) {
        active.current = false;
        await engine.current?.context.suspend();
        if (alive.current) setSoundOn(false);
      } else {
        engine.current ??= createSoundEngine();
        await engine.current.context.resume();
        if (!alive.current) return;
        active.current = true;
        setSoundOn(true);
        setSoundError("");
        engine.current.chord();
      }
    } catch {
      active.current = false;
      if (alive.current) {
        setSoundOn(false);
        setSoundError("Sound is unavailable in this browser.");
      }
    } finally {
      busy.current = false;
    }
  }

  async function playInstrument(midi: number, voice: number) {
    if (busy.current) return;
    const request = generation.current;
    try {
      engine.current ??= createSoundEngine();
      if (engine.current.context.state !== "running")
        await engine.current.context.resume();
      if (!alive.current || request !== generation.current) return;
      active.current = true;
      setSoundOn(true);
      setSoundError("");
      engine.current.instrument(midi, voice);
    } catch {
      if (alive.current) setSoundError("Sound is unavailable in this browser.");
    }
  }

  useEffect(() => {
    if (!soundOn || !root.current || !engine.current) return;
    const element = root.current;
    const audio = engine.current;
    let remix = 0;
    const click = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest("button, a")
          : null;
      if (
        !target ||
        target.hasAttribute("data-sound-toggle") ||
        target.closest("[data-instrument]") ||
        !active.current
      )
        return;
      if (target.closest(".remix-button")) audio.chord(++remix);
      else audio.note(660, 0, 0.14, 0.075);
    };
    const visibility = async () => {
      try {
        if (document.hidden) await audio.context.suspend();
        else if (active.current) {
          await audio.context.resume();
        }
      } catch {
        /* A subsequent gesture can resume audio on restricted devices. */
      }
    };
    element.addEventListener("click", click);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      element.removeEventListener("click", click);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [soundOn, root]);

  return { soundOn, soundError, toggleSound, playInstrument };
}
