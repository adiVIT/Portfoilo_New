export const grooveOptions = [
  { id: "after-hours", name: "After hours", description: "Smoky electric piano. Late-night jazz.", bpm: 82, swing: .13, notes: [72, 74, 76, 79] },
  { id: "daylight", name: "Daylight", description: "Wooden marimba. A sunlit melody.", bpm: 96, swing: .08, notes: [74, 76, 78, 81] },
  { id: "night-drive", name: "Night drive", description: "Analog synths. A minor-key chase.", bpm: 112, swing: .025, notes: [69, 72, 74, 76] },
  { id: "rooftop", name: "Rooftop", description: "House organ. A rising piano-house hook.", bpm: 112, swing: .02, notes: [77, 79, 81, 84] },
  { id: "blue-hour", name: "Blue hour", description: "Glass bells. A drifting minor melody.", bpm: 82, swing: .16, notes: [74, 77, 79, 81] },
  { id: "pocket", name: "Pocket", description: "Muted clav. A syncopated funk riff.", bpm: 96, swing: .19, notes: [76, 79, 81, 83] },
  { id: "moonwalk", name: "Moonwalk", description: "Disco strings. A soaring refrain.", bpm: 112, swing: .04, notes: [79, 81, 83, 86] },
  { id: "first-light", name: "First light", description: "Floating pads. A slow, open horizon.", bpm: 82, swing: .03, notes: [72, 75, 77, 79] },
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

export function padsForGroove(preset: GrooveId) {
  const notes = grooveOptions.find((option) => option.id === preset)!.notes;
  const names = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
  return musicPads.map((pad, index) => index < 4 ? pad : { ...pad, name: names[notes[index - 4] % 12] });
}
