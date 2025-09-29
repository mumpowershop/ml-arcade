// Arcade Sound System for ML ARCADE
// Uses Web Audio API to create retro gaming sound effects

class ArcadeAudioSystem {
  private audioContext: AudioContext | null = null;
  private isMuted = false;

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
    isMuted: arcadeAudio.muted
  };
};
