class AudioService {
  constructor() {
    this.audioCtx = null;
    this.flipSource = null;
    this.shuffleSource = null;
    
    this.isInitializing = false;

    // SFX Files (Action sounds)
    this.flipAudio = new Audio('/Audio/KarteAuf.mp3');
    this.shuffleAudio = new Audio('/Audio/KarteMischen.mp3');
    
    // Pre-load
    this.flipAudio.load();
    this.shuffleAudio.load();

    this.handleFirstInteraction = this.handleFirstInteraction.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    
    this.setupInteractionListeners();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  setupInteractionListeners() {
    const runOnce = async () => {
      window.removeEventListener('click', runOnce, true);
      window.removeEventListener('touchstart', runOnce, { capture: true });
      window.removeEventListener('mousedown', runOnce, true);
      
      await this.handleFirstInteraction();
    };
    
    window.addEventListener('click', runOnce, true);
    window.addEventListener('touchstart', runOnce, { passive: true, capture: true });
    window.addEventListener('mousedown', runOnce, true);
  }

  async resumeContext() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch (e) {
        console.warn("Failed to resume AudioContext:", e);
      }
    }
  }

  async handleFirstInteraction() {
    if (this.isInitializing) return;
    this.isInitializing = true;
    try {
      await this.resumeContext();
    } finally {
      this.isInitializing = false;
    }
  }

  async handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      await this.resumeContext();
    }
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'playback'
      });
    }
  }

  async playFlipSound() {
    await this.resumeContext();
    if (!this.flipSource && this.audioCtx) {
      this.flipSource = this.audioCtx.createMediaElementSource(this.flipAudio);
      this.flipSource.connect(this.audioCtx.destination);
    }
    this.flipAudio.currentTime = 0;
    this.flipAudio.play().catch(e => console.warn("Flip sound failed:", e));
  }

  async playShuffleSound() {
    await this.resumeContext();
    if (!this.shuffleSource && this.audioCtx) {
      this.shuffleSource = this.audioCtx.createMediaElementSource(this.shuffleAudio);
      this.shuffleSource.connect(this.audioCtx.destination);
    }
    this.shuffleAudio.currentTime = 0;
    this.shuffleAudio.play().catch(e => console.warn("Shuffle sound failed:", e));
  }
}

export const audio = new AudioService();
