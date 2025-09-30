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

  // Advanced 1980s Synthwave Music Generator
  private createAdvancedSynthLayer(config: {
    frequency: number;
    type: OscillatorType;
    volume: number;
    delay: number;
    filterFreq: number;
    filterQ: number;
    envelope?: { attack: number; decay: number; sustain: number; release: number };
    lfo?: { rate: number; depth: number; target: 'frequency' | 'filter' | 'volume' };
  }): {
    oscillator: OscillatorNode | null;
    gainNode: GainNode | null;
    lfo?: OscillatorNode | null;
    filterNode?: BiquadFilterNode | null;
    nodes?: AudioNode[];
  } {
    if (!this.audioContext) return { oscillator: null, gainNode: null, nodes: [] };

    const oscillator = this.createOscillator(config.frequency, config.type);
    const gainNode = this.createGainNode(config.volume * this.backgroundMusic.volume);
    const filterNode = this.audioContext.createBiquadFilter();
    
    if (!oscillator || !gainNode) return { oscillator: null, gainNode: null, nodes: [] };

    const nodes = [oscillator, gainNode, filterNode];

    // Configure filter
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(config.filterFreq, this.audioContext.currentTime);
    filterNode.Q.setValueAtTime(config.filterQ, this.audioContext.currentTime);

    // Create audio chain
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime + config.delay;

    // Add envelope if specified
    if (config.envelope) {
      const { attack, decay, sustain, release } = config.envelope;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(config.volume * this.backgroundMusic.volume, now + attack);
      gainNode.gain.linearRampToValueAtTime(sustain * config.volume * this.backgroundMusic.volume, now + attack + decay);
    }

    // Add LFO if specified
    let lfo = null;
    if (config.lfo) {
      lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.frequency.setValueAtTime(config.lfo.rate, this.audioContext.currentTime);
      lfoGain.gain.setValueAtTime(config.lfo.depth, this.audioContext.currentTime);
      
      lfo.connect(lfoGain);
      
      // Connect LFO to different targets
      switch (config.lfo.target) {
        case 'frequency':
          lfoGain.connect(oscillator.frequency);
          break;
        case 'filter':
          lfoGain.connect(filterNode.frequency);
          break;
        case 'volume':
          lfoGain.connect(gainNode.gain);
          break;
      }
      
      lfo.start(now);
      nodes.push(lfo);
    }

    oscillator.start(now);

    return { oscillator, gainNode, lfo, filterNode, nodes };
  }

  // Create a musical sequence with chord progressions
  private createSynthwaveSequence(): Array<{
    oscillator: OscillatorNode | null;
    gainNode: GainNode | null;
    lfo?: OscillatorNode | null;
    filterNode?: BiquadFilterNode | null;
    nodes?: AudioNode[];
  }> {
    if (!this.audioContext) return [];

    // Epic synthwave chord progression: Am - F - C - G (i - VI - III - VII)
    const chordProgression = [
      // A minor (A, C, E)
      { root: 220, third: 261.63, fifth: 329.63, duration: 8 },
      // F major (F, A, C) 
      { root: 174.61, third: 220, fifth: 261.63, duration: 8 },
      // C major (C, E, G)
      { root: 130.81, third: 164.81, fifth: 196, duration: 8 },
      // G major (G, B, D)
      { root: 196, third: 246.94, fifth: 293.66, duration: 8 }
    ];

    const layers: Array<{
      oscillator: OscillatorNode | null;
      gainNode: GainNode | null;
      lfo?: OscillatorNode | null;
      filterNode?: BiquadFilterNode | null;
      nodes?: AudioNode[];
    }> = [];
    let currentTime = 0;

    // Create multiple passes through the progression for a 64-second loop
    for (let pass = 0; pass < 2; pass++) {
      chordProgression.forEach((chord, chordIndex) => {
        const variation = pass; // Different variations for each pass
        
        // Deep bass line following root notes
        layers.push(this.createAdvancedSynthLayer({
          frequency: chord.root * 0.5, // One octave lower
          type: 'sawtooth',
          volume: 0.3,
          delay: currentTime,
          filterFreq: 120,
          filterQ: 2,
          lfo: { rate: 0.5, depth: 5, target: 'frequency' }
        }));

        // Mid bass harmony
        layers.push(this.createAdvancedSynthLayer({
          frequency: chord.root,
          type: 'triangle', 
          volume: 0.2,
          delay: currentTime,
          filterFreq: 300,
          filterQ: 1
        }));

        // Arpeggiated lead (playing chord notes in sequence)
        const arpNotes = [chord.root * 2, chord.third * 2, chord.fifth * 2, chord.third * 2];
        arpNotes.forEach((noteFreq, noteIndex) => {
          layers.push(this.createAdvancedSynthLayer({
            frequency: noteFreq,
            type: variation === 0 ? 'square' : 'sawtooth',
            volume: 0.15,
            delay: currentTime + (noteIndex * chord.duration / 4),
            filterFreq: 1200 + (variation * 200),
            filterQ: 0.8,
            envelope: { attack: 0.1, decay: 0.5, sustain: 0.7, release: 1.0 },
            lfo: { rate: 4.2, depth: 8, target: 'frequency' }
          }));
        });

        // Pad/Atmosphere layer
        layers.push(this.createAdvancedSynthLayer({
          frequency: chord.third * 0.75,
          type: 'sine',
          volume: 0.12,
          delay: currentTime,
          filterFreq: 600,
          filterQ: 0.5,
          lfo: { rate: 0.3, depth: 50, target: 'filter' }
        }));

        // High sparkle layer (every other chord for variation)
        if (chordIndex % 2 === variation) {
          layers.push(this.createAdvancedSynthLayer({
            frequency: chord.fifth * 4,
            type: 'sine',
            volume: 0.08,
            delay: currentTime + 2,
            filterFreq: 3000,
            filterQ: 2,
            envelope: { attack: 0.2, decay: 1.0, sustain: 0.3, release: 2.0 },
            lfo: { rate: 6, depth: 100, target: 'filter' }
          }));
        }

        currentTime += chord.duration;
      });
    }

    return layers;
  }

  // Start continuous synthwave background music
  startBackgroundMusic() {
    if (!this.audioContext || this.backgroundMusic.isPlaying || this.isMuted) return;

    // Resume audio context if suspended (required by some browsers)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Create the sophisticated synthwave sequence
    const synthLayers = this.createSynthwaveSequence();
    
    // Store all oscillators and gain nodes
    synthLayers.forEach(layer => {
      if (layer.oscillator && layer.gainNode) {
        this.backgroundMusic.oscillators.push(layer.oscillator);
        this.backgroundMusic.gainNodes.push(layer.gainNode);
        
        // Add any additional nodes (LFOs, filters, etc.)
        if (layer.nodes) {
          layer.nodes.forEach((node: AudioNode) => {
            if (node !== layer.oscillator && node !== layer.gainNode) {
              this.backgroundMusic.oscillators.push(node as OscillatorNode);
            }
          });
        }
      }
    });

    this.backgroundMusic.isPlaying = true;

    // Restart the music every 64 seconds for seamless looping of the complete progression
    setTimeout(() => {
      if (this.backgroundMusic.isPlaying) {
        this.stopBackgroundMusic();
        setTimeout(() => this.startBackgroundMusic(), 500);
      }
    }, 64000);
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

