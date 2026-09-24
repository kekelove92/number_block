/**
 * Audio Engine for Numberblocks Magic Lab
 * Powered by Web Audio API for zero-latency synthesized sound effects
 * and Web Speech API for natural English pronunciation.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
    this.englishVoice = null;

    // Musical scale for numbers 1-10 (Pentatonic / Diatonic C Major scale)
    this.numberPitches = {
      1: 261.63, // C4
      2: 293.66, // D4
      3: 329.63, // E4
      4: 349.23, // F4
      5: 392.00, // G4
      6: 440.00, // A4
      7: 493.88, // B4
      8: 523.25, // C5
      9: 587.33, // D5
      10: 659.25 // E5
    };

    this.numberNames = {
      1: "One",
      2: "Two",
      3: "Three",
      4: "Four",
      5: "Five",
      6: "Six",
      7: "Seven",
      8: "Eight",
      9: "Nine",
      10: "Ten"
    };

    this.initVoices();
  }

  // Initialize Web Audio Context on first user gesture
  initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initVoices() {
    if (!('speechSynthesis' in window)) return;

    const findVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer high-quality British or American English voices (kid/female friendly)
      this.englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('George'))) 
        || voices.find(v => v.lang.startsWith('en')) 
        || null;
    };

    findVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = findVoice;
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  // Play a wooden xylophone chime for a specific number
  playNumberChime(number) {
    if (!this.soundEnabled) return;
    this.initAudioContext();

    const freq = this.numberPitches[number] || 261.63;
    const now = this.ctx.currentTime;

    // Fundamental oscillator (triangle/sine blend for wooden warmth)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Harmonics for rich bell/marimba tone
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 3, now); // Overtones

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    gain2.gain.setValueAtTime(0.12, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(this.ctx.destination);
    gain2.connect(this.ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.6);
    osc2.stop(now + 0.3);
  }

  // Play juicy pop sound when dragging or touching
  playPop() {
    if (!this.soundEnabled) return;
    this.initAudioContext();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Play magical snap/merge sound when 2 blocks join
  playMergeMagic() {
    if (!this.soundEnabled) return;
    this.initAudioContext();

    const now = this.ctx.currentTime;
    const notes = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5 arpeggio

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.25, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.35);
    });
  }

  // Play slice sound when splitting a block
  playSlice() {
    if (!this.soundEnabled) return;
    this.initAudioContext();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Play victory celebration fanfare
  playVictory() {
    if (!this.soundEnabled) return;
    this.initAudioContext();

    const now = this.ctx.currentTime;
    // Major chord triumphant fanfare
    const chords = [
      { t: 0.0, f: [261.63, 329.63, 392.00], d: 0.15 },
      { t: 0.18, f: [261.63, 329.63, 392.00], d: 0.15 },
      { t: 0.36, f: [261.63, 329.63, 392.00], d: 0.15 },
      { t: 0.54, f: [349.23, 440.00, 523.25], d: 0.45 }
    ];

    chords.forEach(chord => {
      chord.f.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + chord.t);

        gain.gain.setValueAtTime(0.18, now + chord.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + chord.t + chord.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + chord.t);
        osc.stop(now + chord.t + chord.d);
      });
    });
  }

  // English Speech Synthesis with energetic, cheerful child-friendly voice
  speak(text, onEnd) {
    if (!this.soundEnabled || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel(); // Stop prior speeches
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.englishVoice) {
      utterance.voice = this.englishVoice;
    }
    utterance.lang = 'en-US';
    utterance.pitch = 1.25; // Slightly higher pitch for playful kid feel
    utterance.rate = 0.95;  // Clear, readable speed

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  speakNumber(number, onEnd) {
    const name = this.numberNames[number] || number.toString();
    this.speak(name, onEnd);
  }

  speakAddition(a, b, sum, onEnd) {
    const nameA = this.numberNames[a] || a;
    const nameB = this.numberNames[b] || b;
    const nameSum = this.numberNames[sum] || sum;
    this.speak(`${nameA} plus ${nameB} equals ${nameSum}!`, onEnd);
  }

  speakSplit(original, partA, partB, onEnd) {
    const nameOrig = this.numberNames[original] || original;
    const nameA = this.numberNames[partA] || partA;
    const nameB = this.numberNames[partB] || partB;
    this.speak(`${nameOrig} splits into ${nameA} and ${nameB}!`, onEnd);
  }
}

// Global instance
window.audioEngine = new AudioEngine();
