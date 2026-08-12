import React from 'react';
import { RotationSpeeds, TesseractSettings } from '../types';
import { Compass, RotateCw, Activity, Layers, PauseCircle } from 'lucide-react';

interface PresetsBarProps {
  onApplyPreset: (speeds: RotationSpeeds, distanceD?: number) => void;
  currentSpeeds: RotationSpeeds;
}

export const PresetsBar: React.FC<PresetsBarProps> = ({ onApplyPreset }) => {
  const PRESETS = [
    {
      id: 'hyper-roll',
      label: 'Hyper-Roll (XW + YW)',
      icon: Activity,
      speeds: { xw: 0.6, yw: 0.4, zw: 0.0, xy: 0.0, xz: 0.0, yz: 0.0 },
      d: 2.2,
    },
    {
      id: 'w-flip',
      label: 'W-Flip Inversion (ZW)',
      icon: Layers,
      speeds: { xw: 0.0, yw: 0.0, zw: 0.8, xy: 0.2, xz: 0.0, yz: 0.0 },
      d: 1.8,
    },
    {
      id: 'full-6d',
      label: 'Full 6D Hyper-Spin',
      icon: RotateCw,
      speeds: { xw: 0.4, yw: 0.3, zw: 0.5, xy: 0.2, xz: 0.25, yz: 0.15 },
      d: 2.5,
    },
    {
      id: 'spatial-3d',
      label: '3D Spatial Spin',
      icon: Compass,
      speeds: { xw: 0.0, yw: 0.0, zw: 0.0, xy: 0.5, xz: 0.4, yz: 0.3 },
      d: 2.5,
    },
    {
      id: 'frozen',
      label: 'Freeze Motion',
      icon: PauseCircle,
      speeds: { xw: 0.0, yw: 0.0, zw: 0.0, xy: 0.0, xz: 0.0, yz: 0.0 },
      d: 2.2,
    },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-10 max-w-[95vw] overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2 bg-[#02040a]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-2xl">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 px-2 whitespace-nowrap hidden sm:inline">
          Matrix Presets:
        </span>

        {PRESETS.map((preset) => {
          const Icon = preset.icon;

          return (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.speeds, preset.d)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-black/40 border border-white/10 text-slate-200 hover:text-cyan-300 hover:bg-white/10 hover:border-cyan-500/40 transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 uppercase tracking-wider text-[11px]"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
