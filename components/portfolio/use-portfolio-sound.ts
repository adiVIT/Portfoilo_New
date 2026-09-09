"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createMusicEngine } from "@/lib/portfolio/music-engine";
import type { GrooveId, MusicController, MusicEvent, MusicLayer } from "./music-types";

import { applyGrooveTheme, savedGroove } from "./music-theme";

type SoundEngine = ReturnType<typeof createMusicEngine>;
const initialLayers: Record<MusicLayer, boolean> = { drums: true, bass: true, chords: true };

export function usePortfolioSound(root: RefObject<HTMLDivElement>) {
  const engine = useRef<SoundEngine | null>(null);
  const listeners = useRef(new Set<(event: MusicEvent) => void>());
  const alive = useRef(true);
  const active = useRef(false);
  const generation = useRef(0);
  const [soundOn, setSoundOn] = useState(false);
  const [soundError, setSoundError] = useState("");
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [preset, updatePreset] = useState<GrooveId>("after-hours");
  const [layers, updateLayers] = useState(initialLayers);
  const [volume, updateVolume] = useState(0.65);
  const [recordedSteps, setRecordedSteps] = useState<boolean[]>(() => Array(16).fill(false));
  const settings = useRef({ preset, layers, volume });

  const reportError = useCallback(() => {
    active.current = false;
    engine.current?.stop();
    if (alive.current) {
      setSoundOn(false); setPlaying(false); setRecording(false);
      setSoundError("Sound couldn’t start. Try tapping again or using another browser.");
    }
  }, []);

  const getEngine = useCallback(() => {
    if (!engine.current) {
      const audio = createMusicEngine(
        (event) => listeners.current.forEach((listener) => listener(event)),
        (steps) => { if (alive.current) setRecordedSteps(steps); },
      );
      audio.setPreset(settings.current.preset);
      audio.setLayers(settings.current.layers);
      audio.setVolume(settings.current.volume);
      engine.current = audio;
    }
    return engine.current;
  }, []);

  const enable = useCallback(async () => {
    const request = generation.current;
    const audio = getEngine();
    if (!active.current || audio.context.state !== "running") {
      const enabled = await audio.activate();
      if (!enabled || !alive.current || request !== generation.current) return null;
    }
    if (!alive.current || request !== generation.current || document.hidden) return null;
    active.current = true;
    setSoundOn(true); setSoundError("");
    return audio;
  }, [getEngine]);

  const mute = useCallback(async () => {
    generation.current++;
    active.current = false;
    if (alive.current) { setSoundOn(false); setPlaying(false); setRecording(false); }
    await engine.current?.deactivate();
  }, []);

  const toggleSound = useCallback(async () => {
    try {
      if (active.current) await mute();
      else {
        const audio = await enable();
        if (!audio) return;
        audio.start(); setPlaying(audio.playing);
      }
    } catch { reportError(); }
  }, [enable, mute, reportError]);

  const togglePlayback = useCallback(async () => {
    try {
      if (engine.current?.playing) {
        engine.current.stop(); setPlaying(false); setRecording(false); return;
      }
      const audio = await enable();
      if (!audio) return;
      audio.start(); setPlaying(audio.playing);
    } catch { reportError(); }
  }, [enable, reportError]);

  const playPad = useCallback(async (index: number) => {
    try { (await enable())?.playPad(index); } catch { reportError(); }
  }, [enable, reportError]);

  const playInstrument = useCallback(async (midi: number, voice: number) => {
    try { (await enable())?.instrument(midi, voice); } catch { reportError(); }
  }, [enable, reportError]);

  const setPreset = useCallback((value: GrooveId) => {
    applyGrooveTheme(value, true);
    settings.current.preset = value; engine.current?.setPreset(value); updatePreset(value);
  }, []);

  const toggleLayer = useCallback((layer: MusicLayer) => {
    const next = { ...settings.current.layers, [layer]: !settings.current.layers[layer] };
    settings.current.layers = next; engine.current?.setLayers(next); updateLayers(next);
  }, []);

  const setVolume = useCallback((value: number) => {
    const next = Math.min(1, Math.max(0, value));
    settings.current.volume = next; engine.current?.setVolume(next); updateVolume(next);
  }, []);

  const toggleRecording = useCallback(async () => {
    try {
      if (engine.current?.recording) { engine.current.setRecording(false); setRecording(false); return; }
      const audio = await enable();
      if (!audio) return;
      audio.setRecording(true); setPlaying(audio.playing); setRecording(audio.recording);
    } catch { reportError(); }
  }, [enable, reportError]);

  const clearRecording = useCallback(() => {
    engine.current?.clearRecording(); setRecordedSteps(Array(16).fill(false));
  }, []);

  const subscribe = useCallback((listener: (event: MusicEvent) => void) => {
    listeners.current.add(listener);
    return () => { listeners.current.delete(listener); };
  }, []);

  useEffect(() => {
    alive.current = true;
    const saved = savedGroove();
    settings.current.preset = saved;
    engine.current?.setPreset(saved);
    updatePreset(saved);
    applyGrooveTheme(saved);
    const visibility = () => { if (document.hidden) void mute().catch(reportError); };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      alive.current = false; active.current = false; generation.current++;
      document.removeEventListener("visibilitychange", visibility);
      engine.current?.dispose(); engine.current = null;
    };
  }, [mute, reportError]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let previousCue = 0;
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("button, a") : null;
      if (!active.current || !target || target.closest("[data-instrument], .sound-room, [data-sound-toggle]")) return;
      if (!target.matches('a[href^="#"]') || performance.now() - previousCue < 220) return;
      previousCue = performance.now(); engine.current?.cue();
    };
    element.addEventListener("click", click);
    return () => element.removeEventListener("click", click);
  }, [root]);

  const music: MusicController = useMemo(() => ({
    playing, preset, layers, volume, recording, recordedSteps,
    togglePlayback, setPreset, toggleLayer, setVolume, playPad,
    toggleRecording, clearRecording, subscribe,
  }), [playing, preset, layers, volume, recording, recordedSteps, togglePlayback, setPreset, toggleLayer, setVolume, playPad, toggleRecording, clearRecording, subscribe]);

  return { soundOn, soundError, toggleSound, playInstrument, music };
}
