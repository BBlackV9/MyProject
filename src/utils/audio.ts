/**
 * Web Audio API synthesizer for Loy Krathong soothing atmosphere.
 * Zero external audio dependencies - works 100% reliably in all browsers.
 */

let audioCtx: AudioContext | null = null;
let ambientGainNode: GainNode | null = null;
let ambientRunning = false;
let ambientOscillators: { stop: () => void }[] = [];

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a peaceful Thai traditional bell / Khim harp note
 * Frequencies correspond to Thai pentatonic scale
 */
export function playThaiChime(type: 'gentle' | 'prayer' | 'float' | 'bless' = 'gentle') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    let frequencies: number[] = [523.25, 659.25, 783.99]; // C5, E5, G5
    if (type === 'prayer') {
      frequencies = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    } else if (type === 'float') {
      frequencies = [261.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
    } else if (type === 'bless') {
      frequencies = [659.25, 783.99, 1046.50];
    }

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft sine wave with a hint of triangle warmth
      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.09);

      gain.gain.setValueAtTime(0.001, now + index * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.12 / (index * 0.3 + 1), now + index * 0.09 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.09);
      osc.stop(now + index * 0.09 + 2.4);
    });
  } catch {
    // Gracefully ignore audio context limitations
  }
}

/**
 * Play soft water splash / ripple sound
 */
export function playWaterRipple() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Buffer for filtered soft water splash
    const bufferSize = ctx.sampleRate * 1.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 1.1);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 1.2);
  } catch {
    // Ignore error
  }
}

/**
 * Start peaceful river ambient stream & gentle background drone
 */
export function toggleAmbientSound(enable?: boolean): boolean {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (enable === undefined) {
      enable = !ambientRunning;
    }

    if (!enable) {
      // Stop ambient
      ambientOscillators.forEach((o) => {
        try { o.stop(); } catch {}
      });
      ambientOscillators = [];
      ambientRunning = false;
      return false;
    }

    // Start ambient
    if (ambientRunning) return true;

    const now = ctx.currentTime;
    ambientGainNode = ctx.createGain();
    ambientGainNode.gain.setValueAtTime(0.001, now);
    ambientGainNode.gain.linearRampToValueAtTime(0.06, now + 2);
    ambientGainNode.connect(ctx.destination);

    // Warm, peaceful drone harmonics (root C & G)
    const chords = [130.81, 196.00, 261.63, 329.63];
    chords.forEach((freq) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscGain.gain.setValueAtTime(0.04, now);
      osc.connect(oscGain);
      if (ambientGainNode) {
        oscGain.connect(ambientGainNode);
      }
      osc.start(now);
      ambientOscillators.push({
        stop: () => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        },
      });
    });

    ambientRunning = true;
    return true;
  } catch {
    ambientRunning = false;
    return false;
  }
}

export function isAmbientAudioRunning(): boolean {
  return ambientRunning;
}
