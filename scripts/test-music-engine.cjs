const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

// A deterministic clock and minimal Web Audio graph test transport behavior;
// native OfflineAudioContext is used separately to verify the actual sound.
function fixture() {
  let now = 0, sequence = 0;
  const tasks = new Map();
  const contexts = [];
  const schedule = (fn, delay, repeat = 0) => {
    const id = ++sequence; tasks.set(id, { fn, time: now + delay, repeat }); return id;
  };
  class Param {
    value = 0;
    setValueAtTime(value) { this.value = value; }
    linearRampToValueAtTime(value) { this.value = value; }
    exponentialRampToValueAtTime(value) { assert(value > 0, 'Exponential ramps must stay positive'); this.value = value; }
    setTargetAtTime(value) { this.value = value; }
    cancelScheduledValues() {}
  }
  class Node {
    constructor(context, kind) {
      this.context = context; this.kind = kind; this.connections = new Set();
      for (const key of ['gain', 'frequency', 'Q', 'pan', 'delayTime', 'threshold', 'knee', 'ratio', 'attack', 'release']) this[key] = new Param();
      context.nodes.push(this);
    }
    connect(target) { this.connections.add(target); return target; }
    disconnect() { this.connections.clear(); }
    start(at) {
      assert(!this.started, 'A source can only start once');
      assert(at >= this.context.currentTime - 0.005, 'Notes should not be scheduled in the past');
      this.started = true; this.startAt = at;
    }
    stop(at) { this.stopAt = at; }
  }
  class AudioContext {
    state = 'suspended'; currentTime = 0; sampleRate = 8000; nodes = []; resumeCalls = 0;
    constructor() { this.destination = new Node(this, 'destination'); contexts.push(this); }
    createGain() { return new Node(this, 'gain'); }
    createDynamicsCompressor() { return new Node(this, 'compressor'); }
    createConvolver() { return new Node(this, 'convolver'); }
    createBiquadFilter() { return new Node(this, 'filter'); }
    createDelay() { return new Node(this, 'delay'); }
    createStereoPanner() { return new Node(this, 'panner'); }
    createOscillator() { return new Node(this, 'oscillator'); }
    createBufferSource() { return new Node(this, 'buffer-source'); }
    createBuffer(channels, length) { const data = Array.from({ length: channels }, () => new Float32Array(length)); return { getChannelData: (index) => data[index] }; }
    async resume() { this.resumeCalls++; this.state = 'running'; }
    async suspend() { this.state = 'suspended'; }
    async close() { this.state = 'closed'; }
    getOutputTimestamp() { return { contextTime: this.currentTime, performanceTime: now }; }
  }
  function move(to) {
    const elapsed = (to - now) / 1000;
    for (const context of contexts) {
      if (context.state !== 'running') continue;
      context.currentTime += elapsed;
      context.nodes.forEach((node) => {
        if (node.started && !node.ended && node.stopAt <= context.currentTime) { node.ended = true; node.onended?.(); }
      });
    }
    now = to;
  }
  function advance(ms) {
    const end = now + ms;
    while (true) {
      const next = [...tasks].filter(([, task]) => task.time <= end).sort((a, b) => a[1].time - b[1].time)[0];
      if (!next) break;
      move(next[1].time); tasks.delete(next[0]);
      if (next[1].repeat) tasks.set(next[0], { ...next[1], time: now + next[1].repeat });
      next[1].fn();
    }
    move(end);
  }
  const sandbox = vm.createContext({
    window: { AudioContext }, performance: { now: () => now }, Float32Array,
    setInterval: (fn, ms) => schedule(fn, ms, ms), clearInterval: (id) => tasks.delete(id),
    setTimeout: (fn, ms) => schedule(fn, ms), clearTimeout: (id) => tasks.delete(id),
    requestAnimationFrame: (fn) => schedule(fn, 16), cancelAnimationFrame: (id) => tasks.delete(id),
  });
  function load(relative) {
    const source = readFileSync(path.resolve(__dirname, '..', relative), 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const module = { exports: {} };
    const factory = vm.runInContext(`(function(require, module, exports) { ${compiled}\n })`, sandbox);
    factory((name) => {
      if (name === '@/components/portfolio/music-types') return load('components/portfolio/music-types.ts');
      throw new Error(`Unexpected dependency: ${name}`);
    }, module, module.exports);
    return module.exports;
  }
  const events = [], masks = [];
  const engine = load('lib/portfolio/music-engine.ts').createMusicEngine((event) => events.push(event), (mask) => masks.push([...mask]));
  return { engine, options: load('components/portfolio/music-types.ts').grooveOptions, context: contexts[0], events, masks, advance, tasks, sources: () => contexts[0].nodes.filter((node) => node.started) };
}

test('audio is opt-in; simultaneous first gestures share one resume', async () => {
  const f = fixture();
  f.engine.start(); f.engine.playPad(4);
  assert.equal(f.engine.playing, false); assert.equal(f.sources().length, 0); assert.equal(f.tasks.size, 0);
  const first = f.engine.activate(), second = f.engine.activate();
  assert.equal(first, second); await first;
  assert.equal(f.context.resumeCalls, 1);
  f.engine.playPad(4); f.advance(40);
  assert(f.sources().length > 0); assert(f.events.some((event) => event.type === 'pad' && event.index === 4));
  f.engine.dispose();
});

test('recording starts transport, quantizes overdubs, and clearing removes playback', async () => {
  const f = fixture(); await f.engine.activate(); f.engine.setRecording(true);
  assert.equal(f.engine.playing, true); assert.equal(f.engine.recording, true);
  f.engine.playPad(4); f.engine.playPad(5);
  assert.equal(f.masks.length, 1, 'Only newly occupied steps notify React');
  assert.equal(f.masks[0].filter(Boolean).length, 1);
  f.advance(3500);
  assert(f.events.filter((event) => event.type === 'pad').length >= 4, 'Both recorded pads return on the next loop');
  f.engine.clearRecording();
  assert.equal(f.masks.at(-1).some(Boolean), false);
  const played = f.events.filter((event) => event.type === 'pad').length;
  f.advance(3500);
  assert.equal(f.events.filter((event) => event.type === 'pad').length, played);
  f.engine.dispose();
});

test('mute cancels scheduled voices, freezes no stale notes, and tears down timers', async () => {
  const f = fixture(); await f.engine.activate(); f.engine.start(); f.engine.playPad(7);
  f.advance(90);
  const muted = f.engine.deactivate(); f.advance(40); await muted;
  assert.equal(f.context.state, 'suspended'); assert.equal(f.engine.playing, false); assert.equal(f.engine.recording, false);
  assert.equal(f.tasks.size, 0);
  assert(f.sources().every((source) => source.ended || source.stopAt <= f.context.currentTime));
  const sourceCount = f.sources().length;
  await f.engine.activate(); f.advance(1000);
  assert.equal(f.sources().length, sourceCount, 'Unmuting alone never re-schedules old sources');
  f.engine.dispose();
  assert.equal(f.context.state, 'closed'); assert.equal(f.tasks.size, 0);
  assert(f.context.nodes.every((node) => node.connections.size === 0), 'Disposal disconnects the complete graph');
});

test('preset changes restart one scheduler, retaining recorded taps and layer choices', async () => {
  const f = fixture(); await f.engine.activate();
  f.engine.setLayers({ drums: false, bass: false, chords: false });
  f.engine.setRecording(true); f.engine.playPad(0); f.advance(200);
  f.engine.setPreset('night-drive');
  assert.equal(f.engine.playing, true); assert.equal(f.engine.recording, true);
  f.advance(2400);
  assert(f.events.some((event) => event.type === 'pad' && event.index === 0));
  assert.equal(f.sources().filter((source) => source.kind === 'buffer-source').length, 0, 'Disabled percussion stays disabled');
  f.engine.stop(); f.advance(100);
  assert.equal(f.tasks.size, 0);
  f.engine.dispose();
});


test('all eight grooves play four bars with distinct arrangements and respect disabled layers', async () => {
  const catalog = fixture();
  const options = catalog.options; catalog.engine.dispose();
  assert.equal(options.length, 8);
  assert.deepEqual([...new Set(options.map((option) => option.bpm))].sort((a, b) => a - b), [82, 96, 112]);
  assert.equal(new Set(options.map((option) => option.id)).size, 8);
  const fingerprints = new Set();
  for (const option of options) {
    const f = fixture(); await f.engine.activate(); f.engine.setPreset(option.id); f.engine.start();
    f.advance(16 * 60 / option.bpm * 1000 + 150);
    assert(f.events.filter((event) => event.type === 'step').length >= 64, option.id);
    assert(f.sources().length > 50, `${option.id} schedules a complete arrangement`);
    assert(f.sources().every((node) => Number.isFinite(node.frequency.value) && Number.isFinite(node.stopAt)), `${option.id} has finite voices`);
    fingerprints.add(JSON.stringify(f.sources().slice(0, 160).map((node) => [node.kind, node.frequency.value])));
    f.engine.setLayers({ drums: false, bass: false, chords: false });
    const count = f.sources().length; f.advance(1500);
    assert.equal(f.sources().length, count, `${option.id} honors all mixer switches`);
    f.engine.dispose(); assert.equal(f.tasks.size, 0);
  }
  assert.equal(fingerprints.size, 8, 'Every groove has its own arrangement, not just a tempo change');
});


test('melodic layers remain distinct with drums and bass removed', async () => {
  const catalog = fixture(); const options = catalog.options; catalog.engine.dispose();
  const musicalSignatures = new Set();
  for (const option of options) {
    const f = fixture(); await f.engine.activate(); f.engine.setPreset(option.id);
    f.engine.setLayers({ drums: false, bass: false, chords: true }); f.engine.start();
    f.advance(16 * 60 / option.bpm * 1000);
    const voices = f.sources();
    assert(voices.every((node) => node.kind === 'oscillator'));
    musicalSignatures.add(JSON.stringify(voices.map((node) => [node.type, Math.round(node.frequency.value)])));
    f.engine.stop();
    const before = f.sources().length;
    f.engine.playPad(4);
    const pad = f.sources().slice(before);
    const fundamental = 440 * 2 ** ((option.notes[0] - 69) / 12);
    assert(pad.some((node) => Math.abs(node.frequency.value / fundamental - 1) < .004), `${option.id} live pads follow its key`);
    f.engine.dispose();
  }
  assert.equal(musicalSignatures.size, 8, 'All eight harmonic and instrument arrangements differ without percussion or tempo');
});
