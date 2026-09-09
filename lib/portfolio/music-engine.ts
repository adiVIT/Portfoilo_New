import { grooveOptions, type GrooveId, type MusicEvent, type MusicLayer } from "@/components/portfolio/music-types";

type VoiceGroup = MusicLayer | "live" | "recording" | "cue";
type Source = OscillatorNode | AudioBufferSourceNode;
type Voice = { sources: Source[]; nodes: AudioNode[]; envelope: GainNode; group: VoiceGroup };
const frequency = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const padNotes = [72, 74, 76, 79];
const chords = [[48, 55, 62, 64, 69], [45, 55, 60, 64, 67], [53, 57, 60, 64, 67], [43, 55, 60, 62, 64]];
const bassRoots = [36, 33, 41, 43];
const initialLayers: Record<MusicLayer, boolean> = { drums: true, bass: true, chords: true };

/** Finite synthesized voices; no downloaded samples or continuously running oscillators. */
function createVoiceBank(context: BaseAudioContext, maxVoices = 80) {
  const master = context.createGain();
  master.gain.value = 0;
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -15; compressor.knee.value = 16; compressor.ratio.value = 4;
  compressor.attack.value = 0.008; compressor.release.value = 0.18;
  master.connect(compressor).connect(context.destination);
  const voices = new Set<Voice>();
  const reverbInput = context.createGain();
  const delayInput = context.createGain();
  const effectNodes: AudioNode[] = [];
  const noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const samples = noise.getChannelData(0);
  let seed = 127;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < samples.length; i++) samples[i] = random() * 2 - 1;
  const impulse = context.createBuffer(2, Math.floor(context.sampleRate * 1.35), context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    let previous = 0;
    for (let i = 0; i < data.length; i++) {
      previous = previous * 0.6 + (random() * 2 - 1) * 0.4;
      data[i] = previous * (1 - i / data.length) ** 3;
    }
  }
  let bpm = 82;
  function resetEffects() {
    reverbInput.disconnect(); delayInput.disconnect();
    effectNodes.forEach((node) => node.disconnect()); effectNodes.length = 0;
    const room = context.createConvolver(); room.buffer = impulse;
    const roomTone = context.createBiquadFilter(); roomTone.type = "lowpass"; roomTone.frequency.value = 4200;
    const roomLevel = context.createGain(); roomLevel.gain.value = 0.19;
    reverbInput.connect(room).connect(roomTone).connect(roomLevel).connect(master);
    const delay = context.createDelay(1); delay.delayTime.value = (60 / bpm) * 0.75;
    const echoTone = context.createBiquadFilter(); echoTone.type = "lowpass"; echoTone.frequency.value = 2300;
    const feedback = context.createGain(); feedback.gain.value = 0.19;
    const echoLevel = context.createGain(); echoLevel.gain.value = 0.13;
    const pan = context.createStereoPanner(); pan.pan.value = 0.25;
    delayInput.connect(delay).connect(echoTone);
    echoTone.connect(feedback).connect(delay);
    echoTone.connect(echoLevel).connect(pan).connect(master);
    effectNodes.push(room, roomTone, roomLevel, delay, echoTone, feedback, echoLevel, pan);
  }
  resetEffects();
  function stopVoice(voice: Voice, at = context.currentTime, fade = 0.016) {
    voice.envelope.gain.cancelScheduledValues(at);
    voice.envelope.gain.setTargetAtTime(0, at, Math.max(0.001, fade / 3));
    [...voice.sources].forEach((source) => { try { source.stop(at + fade); } catch { /* Already ending. */ } });
  }
  function voice(at: number, duration: number, volume: number, group: VoiceGroup, attack = 0.006, pan = 0, wet = 0, echo = 0) {
    if (voices.size >= maxVoices) {
      const oldest = voices.values().next().value as Voice | undefined;
      if (oldest) { stopVoice(oldest); voices.delete(oldest); }
    }
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(volume, at + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    const panner = context.createStereoPanner(); panner.pan.value = pan;
    envelope.connect(panner).connect(master);
    const result: Voice = { sources: [], nodes: [envelope, panner], envelope, group };
    if (wet) { const send = context.createGain(); send.gain.value = wet; panner.connect(send).connect(reverbInput); result.nodes.push(send); }
    if (echo) { const send = context.createGain(); send.gain.value = echo; panner.connect(send).connect(delayInput); result.nodes.push(send); }
    voices.add(result);
    return result;
  }
  function source(voice: Voice, source: Source, at: number, duration: number) {
    voice.sources.push(source); voice.nodes.push(source);
    source.onended = () => {
      const index = voice.sources.indexOf(source);
      if (index !== -1) voice.sources.splice(index, 1);
      if (!voice.sources.length) { voice.nodes.forEach((node) => node.disconnect()); voices.delete(voice); }
    };
    source.start(at); source.stop(at + duration + 0.025);
  }
  function keys(midi: number, at: number, velocity: number, duration = 1.35, group: VoiceGroup = "live", bright = false) {
    const hz = frequency(midi);
    const v = voice(at, duration, velocity * 0.15, group, 0.007, clamp((midi - 64) / 36, -0.45, 0.45), 0.68, group === "live" || group === "recording" ? 0.6 : 0.23);
    const carrier = context.createOscillator(); carrier.type = "sine"; carrier.frequency.value = hz;
    const modulator = context.createOscillator(); modulator.frequency.value = hz * 2;
    const modulation = context.createGain();
    modulation.gain.setValueAtTime(hz * (bright ? 1.6 : 0.95), at);
    modulation.gain.exponentialRampToValueAtTime(hz * 0.025, at + 0.3);
    modulator.connect(modulation).connect(carrier.frequency);
    const tone = context.createBiquadFilter(); tone.type = "lowpass";
    tone.frequency.setValueAtTime(bright ? 6200 : 4100, at);
    tone.frequency.exponentialRampToValueAtTime(1100, at + duration);
    carrier.connect(tone).connect(v.envelope);
    const body = context.createOscillator(); body.type = "sine"; body.frequency.value = hz * 0.998;
    const bodyLevel = context.createGain(); bodyLevel.gain.value = 0.26;
    body.connect(bodyLevel).connect(v.envelope); v.nodes.push(modulation, tone, bodyLevel);
    source(v, carrier, at, duration); source(v, modulator, at, duration); source(v, body, at, duration);
  }
  function bass(midi: number, at: number, duration: number, velocity: number, bright = false) {
    const v = voice(at, duration, 0.23 * velocity, "bass", 0.012);
    const oscillator = context.createOscillator(); oscillator.type = "triangle"; oscillator.frequency.value = frequency(midi);
    const filter = context.createBiquadFilter(); filter.type = "lowpass"; filter.Q.value = 0.75;
    filter.frequency.setValueAtTime(bright ? 900 : 580, at); filter.frequency.exponentialRampToValueAtTime(170, at + duration);
    oscillator.connect(filter).connect(v.envelope);
    const sub = context.createOscillator(); sub.frequency.value = frequency(midi);
    const subLevel = context.createGain(); subLevel.gain.value = 0.4;
    sub.connect(subLevel).connect(v.envelope); v.nodes.push(filter, subLevel);
    source(v, oscillator, at, duration); source(v, sub, at, duration);
  }
  function drum(index: number, at: number, velocity = 1, group: VoiceGroup = "drums") {
    if (index === 0) {
      const v = voice(at, 0.42, 0.52 * velocity, group, 0.003);
      const oscillator = context.createOscillator();
      oscillator.frequency.setValueAtTime(135, at);
      oscillator.frequency.exponentialRampToValueAtTime(48, at + 0.065);
      oscillator.frequency.exponentialRampToValueAtTime(42, at + 0.4);
      oscillator.connect(v.envelope); source(v, oscillator, at, 0.42); return;
    }
    const hat = index === 2; const clap = index === 3;
    const duration = hat ? 0.075 : clap ? 0.21 : 0.24;
    const v = voice(at, duration, velocity * (hat ? 0.105 : clap ? 0.21 : 0.25), group, 0.002, hat ? 0.24 : clap ? -0.17 : -0.07, hat ? 0.1 : 0.34);
    const noiseSource = context.createBufferSource(); noiseSource.buffer = noise;
    const filter = context.createBiquadFilter(); filter.type = hat ? "highpass" : "bandpass";
    filter.frequency.value = hat ? 7600 : clap ? 1550 : 1850; filter.Q.value = hat ? 0.6 : 0.8;
    noiseSource.connect(filter).connect(v.envelope); v.nodes.push(filter);
    if (clap) {
      const peak = velocity * 0.21;
      v.envelope.gain.cancelScheduledValues(at); v.envelope.gain.setValueAtTime(0, at);
      for (let i = 0; i < 3; i++) {
        v.envelope.gain.linearRampToValueAtTime(peak, at + i * 0.012 + 0.002);
        v.envelope.gain.exponentialRampToValueAtTime(0.001, at + i * 0.012 + 0.011);
      }
      v.envelope.gain.linearRampToValueAtTime(peak * 0.7, at + 0.04);
      v.envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    }
    source(v, noiseSource, at, duration);
    if (!hat && !clap) {
      const body = context.createOscillator(); body.type = "triangle";
      body.frequency.setValueAtTime(185, at); body.frequency.exponentialRampToValueAtTime(130, at + 0.09);
      const bodyLevel = context.createGain(); bodyLevel.gain.value = 0.35;
      body.connect(bodyLevel).connect(v.envelope); v.nodes.push(bodyLevel); source(v, body, at, duration);
    }
  }
  return {
    keys, bass, drum,
    setVolume(value: number, audible: boolean) {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(audible ? clamp(value, 0, 1) * 0.78 : 0, context.currentTime, 0.012);
    },
    setTempo(value: number) { bpm = value; resetEffects(); },
    stop(groups?: VoiceGroup[], fade = 0.016) { [...voices].forEach((v) => { if (!groups || groups.includes(v.group)) stopVoice(v, context.currentTime, fade); }); },
    resetEffects,
    dispose() {
      [...voices].forEach((v) => { stopVoice(v, context.currentTime, 0); v.nodes.forEach((node) => node.disconnect()); });
      voices.clear(); reverbInput.disconnect(); delayInput.disconnect();
      effectNodes.forEach((node) => node.disconnect()); master.disconnect(); compressor.disconnect();
    },
  };
}
type VoiceBank = ReturnType<typeof createVoiceBank>;
type Arrangement = {
  kick: number[]; snare: number[]; clap: number[]; hats: number[];
  bass: number[][]; progression: number[]; stabs: number[];
  duration: number; bright: boolean; melody: number[][]; quiet?: boolean;
};
// All five arrangements share the pads' C-major / A-minor palette, so live taps stay musical.
const extraArrangements: Partial<Record<GrooveId, Arrangement>> = {
  rooftop: {
    kick: [0, 4, 8, 12], snare: [], clap: [4, 12], hats: [2, 6, 10, 14, 15],
    bass: [[2, 0, 1.5], [6, 0, 1.5], [10, 12, 1.5], [14, 7, 1.2]],
    progression: [2, 3, 1, 0], stabs: [2, 6, 10, 14], duration: .45, bright: true,
    melody: [[3, 76], [7, 79], [11, 81], [15, 79]],
  },
  "blue-hour": {
    kick: [0, 7, 10], snare: [4, 12], clap: [], hats: [0, 3, 6, 8, 11, 14],
    bass: [[0, 0, 5.5], [7, 7, 2.6], [11, 0, 4]],
    progression: [1, 2, 0, 3], stabs: [0, 11], duration: 2.5, bright: false,
    melody: [[6, 79], [14, 76]], quiet: true,
  },
  pocket: {
    kick: [0, 3, 6, 10, 14], snare: [4, 12], clap: [12], hats: [0, 2, 3, 6, 8, 10, 11, 14, 15],
    bass: [[0, 0, 1.4], [3, 12, .8], [5, 7, 1.2], [7, 12, .8], [10, 0, 1.5], [13, 7, .8], [15, 12, .65]],
    progression: [1, 1, 2, 3], stabs: [1, 7, 11], duration: .36, bright: true,
    melody: [[2, 72], [9, 76], [15, 74]],
  },
  moonwalk: {
    kick: [0, 4, 8, 12], snare: [4, 12], clap: [4, 12], hats: [0, 2, 4, 6, 8, 10, 12, 14],
    bass: [[0, 0, 1.4], [2, 12, 1.2], [4, 7, 1.4], [6, 12, 1.2], [8, 0, 1.4], [10, 12, 1.2], [12, 7, 1.4], [14, 12, 1.2]],
    progression: [0, 2, 1, 3], stabs: [0, 3, 8, 11], duration: .58, bright: true,
    melody: [[1, 79], [5, 76], [9, 74], [13, 72]],
  },
  "first-light": {
    kick: [0], snare: [], clap: [], hats: [6, 14],
    bass: [[0, 0, 10]], progression: [2, 0, 3, 1], stabs: [0], duration: 3.8, bright: false,
    melody: [[2, 72], [7, 79], [12, 76]], quiet: true,
  },
};
function scheduleArrangement(bank: VoiceBank, preset: GrooveId, step: number, bar: number, at: number, beat: number, layers: Record<MusicLayer, boolean>) {
  const arrangement = extraArrangements[preset];
  if (arrangement) {
    const chordIndex = arrangement.progression[bar];
    if (layers.drums) {
      if (arrangement.kick.includes(step)) bank.drum(0, at, arrangement.quiet ? .52 : .76);
      if (arrangement.snare.includes(step)) bank.drum(1, at + .007, arrangement.quiet ? .42 : .62);
      if (arrangement.clap.includes(step)) bank.drum(3, at + .012, .32);
      if (arrangement.hats.includes(step)) bank.drum(2, at, (step % 4 === 2 ? .65 : .35) * (arrangement.quiet ? .6 : 1));
    }
    if (layers.bass) for (const [position, interval, length] of arrangement.bass) {
      if (step === position) bank.bass(bassRoots[chordIndex] + interval, at, beat * length, arrangement.quiet ? .52 : .7, arrangement.bright);
    }
    if (layers.chords) {
      if (arrangement.stabs.includes(step)) chords[chordIndex].forEach((midi, i) =>
        bank.keys(midi, at + i * .012, arrangement.quiet ? .32 : .36, arrangement.duration, "chords", arrangement.bright));
      for (const [position, midi] of arrangement.melody) if (step === position) {
        bank.keys(midi + (bar % 2 ? -12 : 0), at, .34, arrangement.quiet ? 2.4 : .7, "chords", arrangement.bright);
      }
    }
    return;
  }
  const bright = preset === "daylight"; const driving = preset === "night-drive";
  if (layers.drums) {
    const kicks = driving ? [0, 4, 8, 12] : bright ? [0, 6, 8, 14] : [0, 6, 10];
    if (kicks.includes(step)) bank.drum(0, at, step === 0 ? 0.83 : 0.63);
    if (step === 4 || step === 12) bank.drum(1, at + (driving ? 0 : 0.009), 0.7);
    if (step === 12 || (bright && step === 4)) bank.drum(3, at + 0.012, 0.33);
    if (step % 2 === 0 || (driving && step % 4 === 3) || step === 15) bank.drum(2, at, step % 4 === 2 ? 0.8 : step === 15 ? 0.27 : 0.43);
    if (!bright && !driving && step === 11 && bar % 2 === 1) bank.drum(1, at, 0.16);
  }
  if (layers.bass) {
    const pattern = driving || bright
      ? [[0, 0, 2.5], [3, 12, 1], [6, 7, 1.3], [8, 0, 2.3], [11, 12, 1], [14, 7, 1.2]]
      : [[0, 0, 4.2], [7, 7, 1.8], [10, 12, 2.6], [14, 7, 1.2]];
    for (const [position, interval, length] of pattern) if (step === position) bank.bass(bassRoots[bar] + interval, at, beat * length, interval === 0 ? 0.8 : 0.62, driving);
  }
  if (layers.chords && (bright ? [0, 6, 10, 14] : driving ? [0, 6, 10] : [0, 10]).includes(step)) {
    const duration = bright ? 0.68 : driving ? 1.05 : 1.85;
    (step === 0 ? chords[bar] : chords[bar].slice(1)).forEach((midi, i) => bank.keys(midi, at + i * 0.009, (step === 0 ? 0.48 : 0.32) * (bright ? 0.92 : 1), duration, "chords", bright));
  }
}

export function createMusicEngine(onEvent: (event: MusicEvent) => void, onRecordingChange: (steps: boolean[]) => void) {
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) throw new Error("Web Audio is unavailable");
  const context = new AudioContextClass({ latencyHint: "interactive" });
  const bank = createVoiceBank(context);
  let preset: GrooveId = "after-hours";
  let layers = { ...initialLayers }; let volume = 0.65;
  let playing = false; let recording = false; let awake = false; let disposed = false; let operation = 0;
  let activation: Promise<boolean> | null = null;
  let timer: ReturnType<typeof setInterval> | undefined;
  let animationFrame = 0; let stepNumber = 0; let nextStepTime = 0; let origin = 0;
  let events: { at: number; value: MusicEvent }[] = [];
  const recorded = Array.from({ length: 16 }, () => new Map<number, number>());
  const duration = () => 60 / grooveOptions.find((option) => option.id === preset)!.bpm / 4;
  const recordingMask = () => recorded.map((hits) => hits.size > 0);
  const emit = (event: MusicEvent) => { if (!disposed) onEvent(event); };
  function queueEvent(at: number, value: MusicEvent) {
    events.push({ at, value }); events.sort((a, b) => a.at - b.at);
    if (!animationFrame) animationFrame = requestAnimationFrame(draw);
  }
  function draw() {
    animationFrame = 0;
    if (disposed || !awake) return;
    const stamp = context.getOutputTimestamp?.();
    const audibleTime = typeof stamp?.contextTime === "number" && stamp.contextTime > 0 && typeof stamp.performanceTime === "number"
      ? stamp.contextTime + Math.max(0, performance.now() - stamp.performanceTime) / 1000
      : context.currentTime;
    while (events.length && events[0].at <= audibleTime + 0.006) emit(events.shift()!.value);
    if (events.length || playing) animationFrame = requestAnimationFrame(draw);
  }
  function hit(index: number, at: number, group: VoiceGroup = "live", velocity = 0.88) {
    if (index < 4) bank.drum(index, at, velocity, group);
    else bank.keys(padNotes[index - 4], at, velocity, preset === "night-drive" ? 1.05 : 1.6, group, preset === "daylight");
    queueEvent(at, { type: "pad", index });
  }
  function schedule() {
    if (!playing || !awake || context.state !== "running") return;
    const stepDuration = duration();
    if (nextStepTime < context.currentTime - 0.1) {
      const skipped = Math.ceil((context.currentTime - nextStepTime) / stepDuration);
      stepNumber += skipped; nextStepTime += skipped * stepDuration;
    }
    while (nextStepTime < context.currentTime + 0.11) {
      const step = stepNumber % 16; const bar = Math.floor(stepNumber / 16) % 4;
      const swing = grooveOptions.find((option) => option.id === preset)!.swing;
      const at = nextStepTime + (step % 2 ? stepDuration * swing : 0);
      scheduleArrangement(bank, preset, step, bar, at, stepDuration, layers);
      recorded[step].forEach((availableAt, index) => { if (stepNumber >= availableAt) hit(index, at, "recording", 0.72); });
      queueEvent(at, { type: "step", step, bar }); stepNumber++; nextStepTime += stepDuration;
    }
  }
  function stopTransport() {
    if (timer !== undefined) clearInterval(timer); timer = undefined;
    cancelAnimationFrame(animationFrame); animationFrame = 0;
    playing = false; recording = false; events = []; bank.stop(); emit({ type: "stop" });
  }
  function startTransport() {
    if (!awake || disposed || playing) return;
    playing = true; stepNumber = 0; nextStepTime = context.currentTime + 0.07; origin = nextStepTime;
    recorded.forEach((hits) => hits.forEach((_, index) => hits.set(index, 0)));
    schedule(); timer = setInterval(schedule, 25);
  }
  return {
    context,
    get playing() { return playing; }, get recording() { return recording; },
    activate() {
      if (awake && context.state === "running") return Promise.resolve(true);
      if (activation) return activation;
      const request = ++operation;
      const pending = context.resume().then(() => {
        if (disposed || request !== operation || context.state !== "running") return false;
        awake = true; bank.setVolume(volume, true); return true;
      }).finally(() => { if (activation === pending) activation = null; });
      activation = pending;
      return pending;
    },
    async deactivate() {
      const request = ++operation;
      activation = null;
      awake = false; stopTransport(); bank.setVolume(volume, false);
      await new Promise<void>((resolve) => setTimeout(resolve, 32));
      if (disposed || request !== operation) return;
      bank.stop(undefined, 0); bank.resetEffects(); await context.suspend();
    },
    start: startTransport, stop: stopTransport,
    setPreset(value: GrooveId) {
      if (preset === value) return;
      const wasPlaying = playing; const wasRecording = recording; stopTransport(); preset = value;
      bank.setTempo(grooveOptions.find((option) => option.id === value)!.bpm);
      if (wasPlaying) { startTransport(); recording = wasRecording; }
    },
    setLayers(value: Record<MusicLayer, boolean>) {
      (Object.keys(value) as MusicLayer[]).forEach((layer) => { if (!value[layer]) bank.stop([layer]); }); layers = { ...value };
    },
    setVolume(value: number) { volume = clamp(value, 0, 1); bank.setVolume(volume, awake); },
    setRecording(value: boolean) { if (value && !playing) startTransport(); recording = value && playing; },
    clearRecording() { recorded.forEach((hits) => hits.clear()); bank.stop(["recording"]); onRecordingChange(recordingMask()); },
    playPad(index: number) {
      if (!awake || !Number.isInteger(index) || index < 0 || index > 7) return;
      hit(index, context.currentTime + 0.004);
      if (recording && playing) {
        const absolute = Math.max(0, Math.round((context.currentTime - origin) / duration())); const step = absolute % 16;
        const wasEmpty = recorded[step].size === 0;
        if (!recorded[step].has(index)) recorded[step].set(index, absolute + 16);
        if (wasEmpty) onRecordingChange(recordingMask());
      }
    },
    instrument(midi: number, voice: number) {
      if (!awake) return; const at = context.currentTime + 0.004;
      if (voice === 2) bank.drum(0, at, 0.55, "live");
      else bank.keys(midi, at, 0.73, voice === 1 ? 0.85 : 1.5, "live", voice === 1);
    },
    cue() { if (awake && !playing) bank.keys(79, context.currentTime, 0.16, 0.22, "cue"); },
    dispose() { operation++; stopTransport(); disposed = true; awake = false; bank.dispose(); void context.close().catch(() => {}); },
  };
}

/** The production voice graph is also usable for an offline listening preview. */
export async function renderMusicPreview(context: OfflineAudioContext, preset: GrooveId, bars = 4) {
  // All preview voices are scheduled before rendering, so the live polyphony cap does not apply.
  const bank = createVoiceBank(context, Infinity);
  const bpm = grooveOptions.find((option) => option.id === preset)!.bpm;
  bank.setTempo(bpm); bank.setVolume(0.65, true);
  const stepDuration = 60 / bpm / 4;
  const swing = grooveOptions.find((option) => option.id === preset)!.swing;
  for (let position = 0; position < bars * 16; position++) {
    const step = position % 16;
    const at = 0.05 + position * stepDuration + (step % 2 ? stepDuration * swing : 0);
    scheduleArrangement(bank, preset, step, Math.floor(position / 16) % 4, at, stepDuration, initialLayers);
  }
  return context.startRendering();
}
