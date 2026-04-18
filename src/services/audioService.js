class AudioService {
  constructor() {
    this.audioCtx = null;
    this.flipSource = null;
    this.shuffleSource = null;
    
    // Persistent state
    this.isAmbiencePlaying = localStorage.getItem('tarot_ambience_on') === 'true';
    this.isInitializing = false;
    this.fadeInterval = null;

    // Real audio files from public/Audio
    this.flipAudio = new Audio('/Audio/KarteAuf.mp3');
    this.shuffleAudio = new Audio('/Audio/KarteMischen.mp3');
    this.ambienceAudio = new Audio('/Audio/TarotOrganDrawn.mp3');
    
    // Settings
    this.ambienceAudio.loop = true;
    this.ambienceAudio.volume = 0; // Start muted for fading
    
    // Pre-load
    this.flipAudio.load();
    this.shuffleAudio.load();
    this.ambienceAudio.load();

    this.handleFirstInteraction = this.handleFirstInteraction.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    
    this.setupInteractionListeners();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  setupInteractionListeners() {
    const runOnce = async () => {
      // Synchronously remove EVERYTHING immediately to stop rapid-fire events
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
      if (this.isAmbiencePlaying) {
        await this.playAmbience();
      }
    } finally {
      this.isInitializing = false;
    }
  }

  async handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      await this.resumeContext();
      if (this.isAmbiencePlaying) {
        // Just ensure it's playing, fade logic will handle volume
        this.ambienceAudio.play().catch(() => {});
      }
    }
  }

  updateMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Mystic Tarot Ambient',
        artist: 'Tarot Pro',
        album: 'Rider-Waite Orakel',
        artwork: [
          { src: '/favicon.svg', sizes: '96x96', type: 'image/svg+xml' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => this.playAmbience());
      navigator.mediaSession.setActionHandler('pause', () => this.pauseAmbience());
    }
  }

  async playAmbience() {
    // 1. Ensure AudioContext is ready for other sounds
    await this.resumeContext();
    
    // 2. Start playback if paused
    if (this.ambienceAudio.paused) {
      try {
        await this.ambienceAudio.play();
      } catch (e) {
        console.warn("Ambience play failed:", e);
      }
    }

    this.isAmbiencePlaying = true;
    localStorage.setItem('tarot_ambience_on', 'true');
    this.updateMediaSession();

    // 3. Manual volume fading (Pure HTML approach is more robust for mobile doubling)
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    this.fadeInterval = setInterval(() => {
      if (this.ambienceAudio.volume < 0.5) {
        this.ambienceAudio.volume = Math.min(0.5, this.ambienceAudio.volume + 0.05);
      } else {
        clearInterval(this.fadeInterval);
      }
    }, 150);
  }

  pauseAmbience() {
    this.isAmbiencePlaying = false;
    localStorage.setItem('tarot_ambience_on', 'false');

    if (this.fadeInterval) clearInterval(this.fadeInterval);
    this.fadeInterval = setInterval(() => {
      if (this.ambienceAudio.volume > 0.02) {
        this.ambienceAudio.volume = Math.max(0, this.ambienceAudio.volume - 0.05);
      } else {
        this.ambienceAudio.volume = 0;
        this.ambienceAudio.pause();
        clearInterval(this.fadeInterval);
      }
    }, 150);
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

  toggleAmbience() {
    if (this.isAmbiencePlaying) {
      this.pauseAmbience();
      return false;
    } else {
      this.playAmbience();
      return true;
    }
  }
}

export const audio = new AudioService();
