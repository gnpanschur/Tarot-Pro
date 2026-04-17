class AudioService {
  constructor() {
    this.audioCtx = null;
    this.ambienceOscillators = [];
    this.ambienceGain = null;

    // Real audio files from public/Audio
    this.flipAudio = new Audio('/Audio/KarteAuf.mp3');
    this.shuffleAudio = new Audio('/Audio/KarteMischen.mp3');
    
    // Pre-load settings
    this.flipAudio.load();
    this.shuffleAudio.load();
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Plays the card flip audio file
  playFlipSound() {
    this.flipAudio.currentTime = 0;
    this.flipAudio.play().catch(e => console.warn("Audio playback failed:", e));
  }

  // Plays the card shuffle audio file
  playShuffleSound() {
    this.shuffleAudio.currentTime = 0;
    this.shuffleAudio.play().catch(e => console.warn("Audio playback failed:", e));
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
      // Start ambient drone (synthesized)
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
