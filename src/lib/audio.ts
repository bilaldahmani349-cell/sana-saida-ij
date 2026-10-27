// Synthesized Web Audio API sound generator for birthday music and chimes

let audioCtx: AudioContext | null = null;
let isSongPlaying = false;
let songTimeout: NodeJS.Timeout | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Note frequencies in Hz
const NOTES: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

// Happy Birthday melody notes and durations (in beats, tempo = 110 bpm)
const MELODY: Array<{ note: string; duration: number }> = [
  { note: "C4", duration: 0.75 },
  { note: "C4", duration: 0.25 },
  { note: "D4", duration: 1 },
  { note: "C4", duration: 1 },
  { note: "F4", duration: 1 },
  { note: "E4", duration: 2 },

  { note: "C4", duration: 0.75 },
  { note: "C4", duration: 0.25 },
  { note: "D4", duration: 1 },
  { note: "C4", duration: 1 },
  { note: "G4", duration: 1 },
  { note: "F4", duration: 2 },

  { note: "C4", duration: 0.75 },
  { note: "C4", duration: 0.25 },
  { note: "C5", duration: 1 },
  { note: "A4", duration: 1 },
  { note: "F4", duration: 1 },
  { note: "E4", duration: 1 },
  { note: "D4", duration: 2 },

  { note: "Bb4", duration: 0.75 },
  { note: "Bb4", duration: 0.25 },
  { note: "A4", duration: 1 },
  { note: "F4", duration: 1 },
  { note: "G4", duration: 1 },
  { note: "F4", duration: 2.5 },
];

function playNote(ctx: AudioContext, freq: number, startTime: number, duration: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Music box / celesta tone: sine + soft overtone
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.95);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function startBirthdayMusic(onEnd?: () => void) {
  const ctx = getAudioContext();
  if (!ctx) return;

  isSongPlaying = true;
  let currentTime = ctx.currentTime + 0.1;
  const beatLength = 0.55; // seconds per beat

  MELODY.forEach(({ note, duration }) => {
    const freq = NOTES[note];
    if (freq) {
      playNote(ctx, freq, currentTime, duration * beatLength);
    }
    currentTime += duration * beatLength;
  });

  const totalTimeMs = (currentTime - ctx.currentTime) * 1000;

  songTimeout = setTimeout(() => {
    if (isSongPlaying) {
      // Loop smoothly
      startBirthdayMusic(onEnd);
    } else if (onEnd) {
      onEnd();
    }
  }, totalTimeMs);
}

export function stopBirthdayMusic() {
  isSongPlaying = false;
  if (songTimeout) {
    clearTimeout(songTimeout);
    songTimeout = null;
  }
}

export function toggleBirthdayMusic(isPlaying: boolean): boolean {
  if (isPlaying) {
    stopBirthdayMusic();
    return false;
  } else {
    startBirthdayMusic();
    return true;
  }
}

// Sparkling celebration chime sound
export function playChimeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const freqs = [523.25, 659.25, 783.99, 1046.5];

  freqs.forEach((f, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, now + idx * 0.08);

    gain.gain.setValueAtTime(0.001, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.08 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.65);
  });
}

// Candle blow-out whoosh sound
export function playBlowCandleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Gentle white noise buffer for blowing sound
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(800, now);
  filter.Q.setValueAtTime(3, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.exponentialRampToValueAtTime(0.2, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

  whiteNoise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  whiteNoise.start(now);
  whiteNoise.stop(now + 0.42);
}
