export const grooveOptions = [
  { id: "after-hours", name: "After hours", description: "Warm keys. A laid-back pocket.", bpm: 82 },
  { id: "daylight", name: "Daylight", description: "Bright chords. A little bounce.", bpm: 96 },
  { id: "night-drive", name: "Night drive", description: "Deep bass. Keep it moving.", bpm: 112 },
] as const;

export type GrooveId = (typeof grooveOptions)[number]["id"];
export type MusicLayer = "drums" | "bass" | "chords";
export type MusicEvent =
  | { type: "step"; step: number; bar: number }
  | { type: "pad"; index: number }
  | { type: "stop" };

export const musicPads = [
  { name: "Kick", key: "1", kind: "drum", glyph: "kick" },
  { name: "Snare", key: "2", kind: "drum", glyph: "snare" },
  { name: "Hi-hat", key: "3", kind: "drum", glyph: "hat" },
  { name: "Clap", key: "4", kind: "drum", glyph: "clap" },
  { name: "C", key: "5", kind: "note", glyph: "note-c" },
  { name: "D", key: "6", kind: "note", glyph: "note-d" },
  { name: "E", key: "7", kind: "note", glyph: "note-e" },
  { name: "G", key: "8", kind: "note", glyph: "note-g" },
] as const;

export interface MusicController {
  playing: boolean;
  preset: GrooveId;
  layers: Record<MusicLayer, boolean>;
  volume: number;
  recording: boolean;
  recordedSteps: boolean[];
  togglePlayback: () => Promise<void>;
  setPreset: (preset: GrooveId) => void;
  toggleLayer: (layer: MusicLayer) => void;
  setVolume: (volume: number) => void;
  playPad: (index: number) => Promise<void>;
  toggleRecording: () => Promise<void>;
  clearRecording: () => void;
  subscribe: (listener: (event: MusicEvent) => void) => () => void;
}
