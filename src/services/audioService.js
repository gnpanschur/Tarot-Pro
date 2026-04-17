class AudioService {
  constructor() {
    this.audioCtx = null;
    this.ambienceGain = null;
    this.ambienceSource = null;
    this.isAmbiencePlaying = false;

    // Real audio files from public/Audio
    this.flipAudio = new Audio('/Audio/KarteAuf.mp3');
    this.shuffleAudio = new Audio('/Audio/KarteMischen.mp3');
    this.ambienceAudio = new Audio('/Audio/TarotOrganDrawn.mp3');
    
    // Settings
    this.ambienceAudio.loop = true;
    
    // Pre-load
    this.flipAudio.load();
    this.shuffleAudio.load();
    this.ambienceAudio.load();
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playFlipSound() {
    this.flipAudio.currentTime = 0;
    this.flipAudio.play().catch(e => console.warn("Audio playback failed:", e));
  }

  playShuffleSound() {
    this.shuffleAudio.currentTime = 0;
    this.shuffleAudio.play().catch(e => console.warn("Audio playback failed:", e));
  }

  toggleAmbience() {
    this.init();
    
    if (this.isAmbiencePlaying) {
      // Fade out
      if (this.ambienceGain) {
        this.ambienceGain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 2);
      }
      setTimeout(() => {
        this.ambienceAudio.pause();
        this.isAmbiencePlaying = false;
      }, 2000);
      return false;
    } else {
      // Lazy-init the source node (can only be done once)
      if (!this.ambienceSource) {
        this.ambienceSource = this.audioCtx.createMediaElementSource(this.ambienceAudio);
        this.ambienceGain = this.audioCtx.createGain();
        this.ambienceSource.connect(this.ambienceGain);
        this.ambienceGain.connect(this.audioCtx.destination);
      }
      
      // Fade in
      this.ambienceGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      this.ambienceGain.gain.linearRampToValueAtTime(0.5, this.audioCtx.currentTime + 3);
      
      this.ambienceAudio.play().catch(e => console.warn("Ambience play failed:", e));
      this.isAmbiencePlaying = true;
      return true;
    }
  }
}

export const audio = new AudioService();
