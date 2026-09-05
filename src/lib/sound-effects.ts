/**
 * Web Audio API Synthesizer untuk Efek Suara Kocokan Arisan
 * Menggunakan AudioContext browser bawaan sehingga tanpa dependensi file mp3 eksternal
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * 1. Efek Gemerincing Kaleng Logam Kocokan (Rattle / Shake Sound)
 */
export function playCanisterShakeSound(durationMs: number = 3000) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const startTime = ctx.currentTime;
  const interval = 0.08; // rattle hit every 80ms
  const count = Math.floor((durationMs / 1000) / interval);

  for (let i = 0; i < count; i++) {
    const hitTime = startTime + i * interval + (Math.random() * 0.02 - 0.01);
    
    // Metallic resonant frequency
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Alternate metallic pitches
    const freqs = [380, 520, 640, 820, 950, 1100];
    const freq = freqs[Math.floor(Math.random() * freqs.length)];

    osc.type = Math.random() > 0.5 ? "triangle" : "sawtooth";
    osc.frequency.setValueAtTime(freq, hitTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, hitTime + 0.06);

    gain.gain.setValueAtTime(0.18, hitTime);
    gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(hitTime);
    osc.stop(hitTime + 0.07);
  }
}

/**
 * 2. Suara Letupan Kertas Keluar dari Kaleng (Pop Sound)
 */
export function playPopSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.13);
}

/**
 * 3. Suara Kemenangan / Fanfare saat Gulungan Kertas Terbuka (Triumphant Chords)
 */
export function playFanfareSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Melodi Fanfare: G4 -> C5 -> E5 -> G5 (Chord C Major Arpeggio ke klimaks)
  const notes = [
    { freq: 392.0, time: 0.0, duration: 0.15 },  // G4
    { freq: 523.25, time: 0.16, duration: 0.15 }, // C5
    { freq: 659.25, time: 0.32, duration: 0.2 },  // E5
    { freq: 783.99, time: 0.52, duration: 0.6 },  // G5 panjang
    { freq: 1046.5, time: 0.7, duration: 0.8 },  // C6 puncak
  ];

  notes.forEach(({ freq, time, duration }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + time);

    gain.gain.setValueAtTime(0.22, now + time);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + time);
    osc.stop(now + time + duration + 0.05);
  });
}
