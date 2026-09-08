// Short synthesized cues built with the Web Audio API. No audio files are shipped.
export type Cue = 'hit' | 'miss' | 'win' | 'tap';

let context: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean) { muted = value; }

function tone(ctx: AudioContext, frequency: number, start: number, duration: number, type: OscillatorType = 'sine', peak = 0.07) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

// Must be called from a user gesture so the browser allows audio to start.
export function play(cue: Cue) {
  if (muted || typeof window === 'undefined' || !('AudioContext' in window)) return;
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') void context.resume();
    const t = context.currentTime + 0.01;
    switch (cue) {
      case 'hit': tone(context, 523.25, t, 0.16); tone(context, 783.99, t + 0.11, 0.3); break;
      case 'miss': tone(context, 196, t, 0.2, 'triangle', 0.06); tone(context, 146.83, t + 0.14, 0.32, 'triangle', 0.06); break;
      case 'win': [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(context!, f, t + i * 0.12, 0.55)); tone(context, 261.63, t, 1.1, 'triangle', 0.035); break;
      case 'tap': tone(context, 880, t, 0.05, 'sine', 0.035); break;
    }
  } catch { /* Audio is optional: ignore browsers that block it. */ }
}
