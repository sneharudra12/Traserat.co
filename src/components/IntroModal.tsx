import React, { useState } from 'react';
import { Boxes, Sparkles, Compass, Zap, Play, User, Layers } from 'lucide-react';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleEnter = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 350);
  };

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-auto bg-[#02040a]/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-in fade-in zoom-in-95'
      }`}
    >
      {/* Background Ambient Glow Orbs for Glass Effect Reflection */}
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none -top-10 -left-10 animate-pulse" />
      <div className="absolute w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none -bottom-10 -right-10 animate-pulse" style={{ animationDuration: '4s' }} />

      {/* Main Glassmorphism Container */}
      <div className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-100 space-y-6 overflow-hidden animate-float-gentle">
        
        {/* Glass Shimmer Sheen Effect Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-glass-sheen" />
        </div>

        {/* Top Header Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[11px] font-mono uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>HYPERDIMENSIONAL SIMULATOR</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-slate-300 text-[11px] font-mono uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>BY RUDRA SETH</span>
          </div>
        </div>

        {/* Center Title Section */}
        <div className="space-y-3 text-center pt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_30px_rgba(0,242,255,0.3)] mb-2">
            <Boxes className="w-9 h-9 animate-pulse" />
          </div>

          {/* ALL CAPITAL WEBSITE NAME */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-[0.25em] bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 bg-clip-text text-transparent uppercase font-sans drop-shadow-[0_4px_20px_rgba(0,242,255,0.4)]">
            TRASERAT CUBE
          </h1>

          <p className="text-xs sm:text-sm text-cyan-200/80 uppercase tracking-[0.3em] font-mono font-medium">
            BY RUDRA SETH
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-left">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>4D Rotations</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Simulate 6 simultaneous hyperplanes in XW, YW, and ZW dimensions.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-2 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-fuchsia-400" />
              <span>W-Axis Radar</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Real-time 4D coordinate telemetry and orientation visualization.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>WebGL Shader</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              High-performance 60FPS Bloom mesh rendering and perspective depth.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sound Synthesizer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Ambient space drones tuned dynamically to 4D rotational momentum.
            </p>
          </div>
        </div>

        {/* Glass Effect Enter Action Button */}
        <div className="pt-2 text-center">
          <button
            onClick={handleEnter}
            className="w-full py-4 rounded-2xl glass-button text-white font-black text-sm uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
          >
            <Play className="w-4 h-4 fill-cyan-400 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            <span>ENTER TRASERAT CUBE</span>
          </button>
          
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2 font-mono">
            Interactive 4D Experience • Press H anytime for clean full screen
          </p>
        </div>

      </div>
    </div>
  );
};
