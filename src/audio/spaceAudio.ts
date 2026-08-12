// Procedural Sci-Fi Space Audio Engine using Web Audio API

class SpaceAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Deep cosmic drone oscillator 1 (Root pitch 55Hz - A1)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);

    // Warm harmonics oscillator 2 (110Hz - A2)
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(110, this.ctx.currentTime);

    // Low-pass filter for cosmic space atmospheric warmth
    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(280, this.ctx.currentTime);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc2.connect(this.droneFilter);
    this.droneFilter.connect(droneGain);
    droneGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      if (!this.ctx) {
        this.init();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(0.2, this.ctx.currentTime, 0.5);
      }
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
      }
    }
  }

  public updateSpeedPitch(speedFactor: number) {
    if (!this.ctx || this.isMuted || !this.droneFilter || !this.droneOsc1) return;
    const now = this.ctx.currentTime;
    const targetFreq = 55 + Math.min(120, speedFactor * 40);
    const filterFreq = 200 + Math.min(800, speedFactor * 300);

    this.droneOsc1.frequency.setTargetAtTime(targetFreq, now, 0.2);
    this.droneFilter.frequency.setTargetAtTime(filterFreq, now, 0.2);
  }

  public playVertexBeep(wFactor: number) {
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Frequency mapped to 4D W dimension (220Hz to 880Hz)
    const pitch = 220 + wFactor * 660;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }
}

export const spaceAudio = new SpaceAudioEngine();
