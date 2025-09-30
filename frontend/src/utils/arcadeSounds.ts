// Arcade Sound System for ML ARCADE
// Uses Web Audio API to create retro gaming sound effects

class ArcadeAudioSystem {
  private audioContext: AudioContext | null = null;
  private isMuted = false;
  private backgroundMusic: {
    oscillators: OscillatorNode[];
    gainNodes: GainNode[];
    isPlaying: boolean;
    volume: number;
  } = {
    oscillators: [],
    gainNodes: [],
    isPlaying: false,
    volume: 0.15
  };

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported', error);
    }
  }

  private createOscillator(frequency: number, type: OscillatorType = 'square'): OscillatorNode | null {
    if (!this.audioContext || this.isMuted) return null;
    
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    return oscillator;
  }

  private createGainNode(initialGain: number = 0.1): GainNode | null {
    if (!this.audioContext) return null;
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(initialGain, this.audioContext.currentTime);
    return gainNode;
  }

  // Classic arcade button press sound
  playButtonPress() {
    if (!this.audioContext || this.isMuted) return;

    const oscillator = this.createOscillator(800, 'square');
    const gainNode = this.createGainNode(0.1);
    
    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    
    // Quick frequency sweep down
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }

  // Success/achievement sound
  playSuccess() {
    if (!this.audioContext || this.isMuted) return;

    const frequencies = [523, 659, 784, 1047]; // C, E, G, C (major chord)
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.createOscillator(freq, 'triangle');
      const gainNode = this.createGainNode(0.08);
      
      if (!oscillator || !gainNode) return;

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      const now = this.audioContext!.currentTime;
      const startTime = now + index * 0.1;
      
      gainNode.gain.setValueAtTime(0.08, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }

  // Error/fail sound
  playError() {
    if (!this.audioContext || this.isMuted) return;

    const oscillator = this.createOscillator(200, 'sawtooth');
    const gainNode = this.createGainNode(0.1);
    
    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    
    // Harsh downward sweep
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);
    oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.4);
    
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    oscillator.start(now);
    oscillator.stop(now + 0.5);
  }

  // Level up/power up sound
  playLevelUp() {
    if (!this.audioContext || this.isMuted) return;

    const frequencies = [440, 554, 659, 880, 1108, 1319, 1760];
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.createOscillator(freq, 'triangle');
      const gainNode = this.createGainNode(0.06);
      
      if (!oscillator || !gainNode) return;

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      const now = this.audioContext!.currentTime;
      const startTime = now + index * 0.08;
      
      gainNode.gain.setValueAtTime(0.06, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
    });
  }

  // Hover sound for UI elements
  playHover() {
    if (!this.audioContext || this.isMuted) return;

    const oscillator = this.createOscillator(1200, 'sine');
    const gainNode = this.createGainNode(0.05);
    
    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  // Typing/coding sound
  playTyping() {
    if (!this.audioContext || this.isMuted) return;

    const frequencies = [800, 850, 900, 950, 1000];
    const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
    
    const oscillator = this.createOscillator(randomFreq, 'square');
    const gainNode = this.createGainNode(0.03);
    
    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    
    gainNode.gain.setValueAtTime(0.03, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }

  // Ambient cyberpunk background tone
  playAmbientTone() {
    if (!this.audioContext || this.isMuted) return;

    const oscillator1 = this.createOscillator(110, 'sine');
    const oscillator2 = this.createOscillator(165, 'sine');
    const gainNode = this.createGainNode(0.02);
    
    if (!oscillator1 || !oscillator2 || !gainNode) return;

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    
    gainNode.gain.setValueAtTime(0.02, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 3);

    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + 3);
    oscillator2.stop(now + 3);
  }

  // 1980s Synthwave Background Music Generator
  private createSynthwaveLayer(frequency: number, type: OscillatorType, volume: number, delay: number = 0) {
    if (!this.audioContext) return { oscillator: null, gainNode: null };

    const oscillator = this.createOscillator(frequency, type);
    const gainNode = this.createGainNode(volume * this.backgroundMusic.volume);
    const filterNode = this.audioContext.createBiquadFilter();
    
    if (!oscillator || !gainNode) return { oscillator: null, gainNode: null };

    // Add some filtering for that retro sound
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(800 + frequency * 0.5, this.audioContext.currentTime);
    filterNode.Q.setValueAtTime(1, this.audioContext.currentTime);

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Add some subtle vibrato and filter modulation
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.setValueAtTime(4.5, this.audioContext.currentTime);
    lfoGain.gain.setValueAtTime(2, this.audioContext.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    
    const now = this.audioContext.currentTime + delay;
    oscillator.start(now);
    lfo.start(now);

    return { oscillator, gainNode, lfo, filterNode };
  }

  // Start continuous synthwave background music
  startBackgroundMusic() {
    if (!this.audioContext || this.backgroundMusic.isPlaying || this.isMuted) return;

    // Resume audio context if suspended (required by some browsers)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Create multiple layers for rich synthwave sound
    const layers = [
      // Bass line - deep foundation
      { freq: 55, type: 'sawtooth' as OscillatorType, vol: 0.3, delay: 0 },
      { freq: 82.5, type: 'triangle' as OscillatorType, vol: 0.2, delay: 0 },
      
      // Mid range - the main melody
      { freq: 220, type: 'sawtooth' as OscillatorType, vol: 0.25, delay: 0.5 },
      { freq: 330, type: 'square' as OscillatorType, vol: 0.15, delay: 1.0 },
      
      // High range - sparkly cyberpunk touches
      { freq: 880, type: 'sine' as OscillatorType, vol: 0.1, delay: 1.5 },
      { freq: 1320, type: 'triangle' as OscillatorType, vol: 0.08, delay: 2.0 },
      
      // Atmospheric pad
      { freq: 165, type: 'sine' as OscillatorType, vol: 0.12, delay: 0 }
    ];

    layers.forEach(layer => {
      const { oscillator, gainNode, lfo } = this.createSynthwaveLayer(
        layer.freq, layer.type, layer.vol, layer.delay
      );
      
      if (oscillator && gainNode) {
        this.backgroundMusic.oscillators.push(oscillator);
        this.backgroundMusic.gainNodes.push(gainNode);
        if (lfo) this.backgroundMusic.oscillators.push(lfo);
      }
    });

    this.backgroundMusic.isPlaying = true;

    // Restart the music every 16 seconds for seamless looping
    setTimeout(() => {
      if (this.backgroundMusic.isPlaying) {
        this.stopBackgroundMusic();
        setTimeout(() => this.startBackgroundMusic(), 100);
      }
    }, 16000);
  }

  // Stop background music
  stopBackgroundMusic() {
    if (!this.backgroundMusic.isPlaying) return;

    // Fade out gracefully
    const fadeTime = 0.5;
    const now = this.audioContext?.currentTime || 0;
    
    this.backgroundMusic.gainNodes.forEach(gainNode => {
      if (gainNode) {
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + fadeTime);
      }
    });

    // Stop all oscillators
    setTimeout(() => {
      this.backgroundMusic.oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      
      this.backgroundMusic.oscillators = [];
      this.backgroundMusic.gainNodes = [];
      this.backgroundMusic.isPlaying = false;
    }, fadeTime * 1000 + 100);
  }

  // Toggle background music
  toggleBackgroundMusic() {
    if (this.backgroundMusic.isPlaying) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
    return this.backgroundMusic.isPlaying;
  }

  // Set background music volume (0.0 to 1.0)
  setBackgroundMusicVolume(volume: number) {
    this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
    
    // Update existing gain nodes
    this.backgroundMusic.gainNodes.forEach(gainNode => {
      if (gainNode && this.audioContext) {
        const currentGain = gainNode.gain.value;
        const baseVolume = currentGain / (this.backgroundMusic.volume || 1);
        gainNode.gain.setValueAtTime(baseVolume * this.backgroundMusic.volume, this.audioContext.currentTime);
      }
    });
  }

  // Get background music status
  get backgroundMusicStatus() {
    return {
      isPlaying: this.backgroundMusic.isPlaying,
      volume: this.backgroundMusic.volume
    };
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Check if muted
  get muted() {
    return this.isMuted;
  }
}

// Singleton instance
export const arcadeAudio = new ArcadeAudioSystem();

// React hook for using arcade sounds
export const useArcadeSound = () => {
  return {
    playButtonPress: () => arcadeAudio.playButtonPress(),
    playSuccess: () => arcadeAudio.playSuccess(),
    playError: () => arcadeAudio.playError(),
    playLevelUp: () => arcadeAudio.playLevelUp(),
    playHover: () => arcadeAudio.playHover(),
    playTyping: () => arcadeAudio.playTyping(),
    playAmbientTone: () => arcadeAudio.playAmbientTone(),
    toggleMute: () => arcadeAudio.toggleMute(),
    isMuted: arcadeAudio.muted,
    
    // Background music controls
    startBackgroundMusic: () => arcadeAudio.startBackgroundMusic(),
    stopBackgroundMusic: () => arcadeAudio.stopBackgroundMusic(),
    toggleBackgroundMusic: () => arcadeAudio.toggleBackgroundMusic(),
    setBackgroundMusicVolume: (volume: number) => arcadeAudio.setBackgroundMusicVolume(volume),
    backgroundMusicStatus: arcadeAudio.backgroundMusicStatus
  };
};

