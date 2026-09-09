export const grooveOptions = [
  { id: "after-hours", name: "After hours", description: "Warm keys. A laid-back pocket.", bpm: 82, swing: 0.13 },
  { id: "daylight", name: "Daylight", description: "Bright chords. A little bounce.", bpm: 96, swing: 0.08 },
  { id: "night-drive", name: "Night drive", description: "Deep bass. Keep it moving.", bpm: 112, swing: 0.025 },
  { id: "rooftop", name: "Rooftop", description: "House drums. Sunset energy.", bpm: 120, swing: 0.02 },
  { id: "blue-hour", name: "Blue hour", description: "Soft chords. A slower heartbeat.", bpm: 74, swing: 0.16 },
  { id: "pocket", name: "Pocket", description: "Skipping bass. Loose and funky.", bpm: 104, swing: 0.19 },
  { id: "moonwalk", name: "Moonwalk", description: "Disco pulse. Glittering keys.", bpm: 116, swing: 0.04 },
  { id: "first-light", name: "First light", description: "Airy notes. Room to breathe.", bpm: 68, swing: 0.03 },
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
