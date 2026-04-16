class AudioService {
  constructor() {
    this.audioCtx = null;
    this.ambienceOscillators = [];
    this.ambienceGain = null;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Plays a synthesized card flip sound (a quick swish)
  playFlipSound() {
    this.init();
    const duration = 0.15;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'sine';
    // Frequency sweeps down
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.audioCtx.currentTime);

    // Envelope
    gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  // Synthesized card shuffle (rapid succession of swishes/noise)
  playShuffleSound() {
    this.init();
    const bufferSize = this.audioCtx.sampleRate * 0.5; // half second of noise
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Create brown-ish noise
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // compensate gain
    }

    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    
    const gainNode = this.audioCtx.createGain();
    
    // Create multiple amplitude peaks for shuffle "flapping"
    gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    for(let r=0; r<6; r++) {
       let t = this.audioCtx.currentTime + (r * 0.08);
       gainNode.gain.linearRampToValueAtTime(0.5, t);
       gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    }

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    noiseSource.start();
  }

  toggleAmbience() {
    this.init();
    if (this.ambienceGain) {
      // Fade out and stop
      this.ambienceGain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 1);
      setTimeout(() => {
        this.ambienceOscillators.forEach(osc => osc.stop());
        this.ambienceOscillators = [];
        this.ambienceGain.disconnect();
        this.ambienceGain = null;
      }, 1000);
      return false; // is playing = false
    } else {
      // Start ambient drone
      this.ambienceGain = this.audioCtx.createGain();
      this.ambienceGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      this.ambienceGain.gain.linearRampToValueAtTime(0.1, this.audioCtx.currentTime + 3); // Slow fade in
      this.ambienceGain.connect(this.audioCtx.destination);

      const freqs = [110, 164.81, 220]; // A2, E3, A3 frequencies for a mystic root chord
      freqs.forEach(freq => {
        const osc = this.audioCtx.createOscillator();
        osc.type = 'triangle';
        
        // Add extremely slow LFO to frequency for detune effect
        osc.frequency.value = freq;
        
        osc.connect(this.ambienceGain);
        osc.start();
        this.ambienceOscillators.push(osc);
      });
      return true; // is playing = true
    }
  }
}

export const audio = new AudioService();
