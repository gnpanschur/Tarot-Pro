class AudioService {
  constructor() {
    this.audioCtx = null;
    this.ambienceGain = null;
    this.ambienceSource = null;
    this.flipSource = null;
    this.shuffleSource = null;
    this.isAmbiencePlaying = localStorage.getItem('tarot_ambience_on') === 'true';

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

    this.handleFirstInteraction = this.handleFirstInteraction.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    
    this.setupInteractionListeners();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  setupInteractionListeners() {
    const runOnce = async () => {
      await this.handleFirstInteraction();
      window.removeEventListener('click', runOnce);
      window.removeEventListener('touchstart', runOnce);
      window.removeEventListener('mousedown', runOnce);
    };
    
    window.addEventListener('click', runOnce);
    window.addEventListener('touchstart', runOnce);
    window.addEventListener('mousedown', runOnce);
  }

  async resumeContext() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
        console.log("AudioContext resumed successfully");
      } catch (e) {
        console.error("Failed to resume AudioContext:", e);
      }
    }
  }

  async handleFirstInteraction() {
    if (this.audioCtx && this.audioCtx.state === 'running' && !this.ambienceAudio.paused) return; // already fine
    
    await this.resumeContext();
    if (this.isAmbiencePlaying) {
      this.playAmbience();
    }
  }

  async handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      await this.resumeContext();
      if (this.isAmbiencePlaying) {
        // Ensure audio element is actually playing
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
    await this.resumeContext();
    
    if (!this.ambienceSource) {
      try {
        this.ambienceSource = this.audioCtx.createMediaElementSource(this.ambienceAudio);
        this.ambienceGain = this.audioCtx.createGain();
        this.ambienceSource.connect(this.ambienceGain);
        this.ambienceGain.connect(this.audioCtx.destination);
      } catch (e) {
        console.warn("Source already connected or context issue:", e);
      }
      
      this.audioCtx.onstatechange = () => {
        if (this.audioCtx.state === 'suspended' && this.isAmbiencePlaying) {
          this.resumeContext();
        }
      };
    }
    
    // Only play if not already playing to prevent "double sound" on some mobile browsers
    if (this.ambienceAudio.paused) {
      this.ambienceAudio.play().catch(e => console.warn("Ambience play failed:", e));
    }
    
    this.isAmbiencePlaying = true;
    localStorage.setItem('tarot_ambience_on', 'true');
    this.updateMediaSession();

    // Reset gain ramp securely
    if (this.ambienceGain) {
      const now = this.audioCtx.currentTime;
      this.ambienceGain.gain.cancelScheduledValues(now);
      this.ambienceGain.gain.setValueAtTime(this.ambienceGain.gain.value, now);
      this.ambienceGain.gain.linearRampToValueAtTime(0.5, now + 3);
    }
  }

  pauseAmbience() {
    if (this.ambienceGain) {
      this.ambienceGain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 2);
    }
    setTimeout(() => {
      if (!this.isAmbiencePlaying) { // check if it wasn't toggled back on
        this.ambienceAudio.pause();
      }
    }, 2000);
    this.isAmbiencePlaying = false;
    localStorage.setItem('tarot_ambience_on', 'false');
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'playback'
      });
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Plays the card flip audio file through the AudioContext to prevent interruption
  async playFlipSound() {
    await this.resumeContext();
    if (!this.flipSource && this.audioCtx) {
      this.flipSource = this.audioCtx.createMediaElementSource(this.flipAudio);
      this.flipSource.connect(this.audioCtx.destination);
    }
    this.flipAudio.currentTime = 0;
    this.flipAudio.play().catch(e => console.warn("Audio playback failed:", e));
  }

  // Plays the card shuffle audio file through the AudioContext to prevent interruption
  async playShuffleSound() {
    await this.resumeContext();
    if (!this.shuffleSource && this.audioCtx) {
      this.shuffleSource = this.audioCtx.createMediaElementSource(this.shuffleAudio);
      this.shuffleSource.connect(this.audioCtx.destination);
    }
    this.shuffleAudio.currentTime = 0;
    this.shuffleAudio.play().catch(e => console.warn("Audio playback failed:", e));
  }

  toggleAmbience() {
    this.init();
    
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
