import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  HelpCircle,
  Sliders,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Boxes,
  Zap,
  X,
} from 'lucide-react';
import { AngleState } from '../math/tesseract';
import { COLOR_SCHEMES } from '../data/colorSchemes';
import { ColorSchemeId, RotationSpeeds, TesseractSettings } from '../types';
import { AxisVisualizer4D } from './AxisVisualizer4D';

interface HUDProps {
  settings: TesseractSettings;
  anglesRef: React.MutableRefObject<AngleState>;
  onUpdateSettings: (updater: (prev: TesseractSettings) => TesseractSettings) => void;
  onResetRotations: () => void;
  onOpenInfo: () => void;
  onOpenIntro?: () => void;
  fps: number;
  isUiHidden?: boolean;
  onToggleUiHidden?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  settings,
  anglesRef,
  onUpdateSettings,
  onResetRotations,
  onOpenInfo,
  onOpenIntro,
  fps,
  isUiHidden = false,
  onToggleUiHidden,
}) => {
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'rotations' | 'geometry' | 'style'>('rotations');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleSpeedChange = (key: keyof RotationSpeeds, value: number) => {
    onUpdateSettings((prev) => ({
      ...prev,
      speeds: {
        ...prev.speeds,
        [key]: value,
      },
    }));
  };

  // If UI is completely hidden (Clean Full Screen View Mode)
  if (isUiHidden) {
    return (
      <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <button
          onClick={onToggleUiHidden}
          className="px-3.5 py-2 rounded-xl bg-[#02040a]/90 backdrop-blur-md border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all shadow-2xl flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
          title="Show Settings & HUD Controls (Shortcut: Press 'H')"
        >
          <Eye className="w-4 h-4 animate-pulse text-cyan-400" />
          <span>Show Settings Controls</span>
          <span className="text-[10px] text-slate-400 font-mono bg-white/10 px-1.5 py-0.5 rounded ml-1">H</span>
        </button>
      </div>
    );
  }

  // Calculate live phase lock and depth metrics
  const totalPhase = (
    Math.abs(settings.speeds.xw) +
    Math.abs(settings.speeds.yw) +
    Math.abs(settings.speeds.zw)
  ).toFixed(3);

  const depthFieldAU = Math.round(settings.projectionD * 1110);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 text-slate-200 font-sans z-10">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between pointer-events-auto bg-[#02040a]/80 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 shadow-2xl">
        <div className="flex items-center gap-4">
          <div
            onClick={onOpenIntro}
            className="cursor-pointer group flex items-center gap-3.5 transition-all"
            title="Open Intro Screen - TRASERAT CUBE by Rudra Seth"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 group-hover:scale-105 transition-all">
              <Boxes className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                <h1 className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  TRASERAT CUBE
                </h1>
              </div>
              <p className="text-[10px] text-fuchsia-300/80 font-mono uppercase tracking-wider pl-4">
                BY RUDRA SETH • {fps} FPS
              </p>
            </div>
          </div>
        </div>

        {/* Phase Lock & Depth Telemetry Badges */}
        <div className="hidden lg:flex items-center gap-8 px-4">
          <div className="text-right">
            <p className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider">Phase Lock</p>
            <p className="text-xl font-light tabular-nums text-white font-mono">
              {totalPhase}<span className="text-xs opacity-50 ml-0.5">rad/s</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Depth Field</p>
            <p className="text-xl font-light tabular-nums text-white font-mono">
              {depthFieldAU.toLocaleString()}<span className="text-xs opacity-50 ml-0.5">AU</span>
            </p>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({ ...prev, isPaused: !prev.isPaused }))
            }
            className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2 text-xs font-semibold ${
              settings.isPaused
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : 'bg-black/40 border-white/10 text-cyan-300 hover:bg-white/10'
            }`}
            title={settings.isPaused ? 'Resume 4D Rotation' : 'Pause 4D Rotation'}
          >
            {settings.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="hidden md:inline">{settings.isPaused ? 'Paused' : 'Playing'}</span>
          </button>

          <button
            onClick={() =>
              onUpdateSettings((prev) => {
                const nextSound = !prev.soundEnabled;
                return { ...prev, soundEnabled: nextSound };
              })
            }
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              settings.soundEnabled
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-black/40 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
            title={settings.soundEnabled ? 'Mute Ambient Audio' : 'Enable Space Audio Drone'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Settings Deck Toggle Button */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-1.5 text-xs font-medium ${
              panelOpen
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-black/40 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            title={panelOpen ? 'Hide Settings Deck' : 'Show Settings Deck'}
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{panelOpen ? 'Hide Settings' : 'Settings'}</span>
          </button>

          {/* Clean View / Hide All UI Button */}
          {onToggleUiHidden && (
            <button
              onClick={onToggleUiHidden}
              className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
              title="Clean Screen View (Hide All UI) - Shortcut 'H'"
            >
              <EyeOff className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">Clean View</span>
            </button>
          )}

          <button
            onClick={onOpenInfo}
            className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
            title="4D Geometry Guide"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden lg:inline">4D Guide</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
            title="Toggle Fullscreen View"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
          </button>
        </div>
      </header>

      {/* Main Body Layout with Floating Control Panel */}
      <div className="flex-1 flex justify-between items-start mt-4 gap-4 overflow-hidden">
        {/* Left Side Panel - Collapsible Control HUD */}
        {panelOpen ? (
          <aside
            className="pointer-events-auto transition-all duration-300 ease-in-out flex flex-col bg-black/50 backdrop-blur-md border border-white/10 rounded-sm p-4 shadow-2xl overflow-hidden max-h-[calc(100vh-140px)] w-80 sm:w-96"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase">
                <Sliders className="w-4 h-4" />
                <span>Control Deck</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg text-xs border border-white/10">
                  <button
                    onClick={() => setActiveTab('rotations')}
                    className={`px-2.5 py-1 rounded transition-all text-[11px] ${
                      activeTab === 'rotations'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    4D Rotation
                  </button>
                  <button
                    onClick={() => setActiveTab('geometry')}
                    className={`px-2.5 py-1 rounded transition-all text-[11px] ${
                      activeTab === 'geometry'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Projection
                  </button>
                  <button
                    onClick={() => setActiveTab('style')}
                    className={`px-2.5 py-1 rounded transition-all text-[11px] ${
                      activeTab === 'style'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Style
                  </button>
                </div>

                <button
                  onClick={() => setPanelOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition"
                  title="Hide Settings Deck"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

          {/* Panel Body Scrollable */}
          <div className="overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-cyan-500/30 pr-1">
            {/* Tab 1: 4D Rotation Hyperplanes */}
            {activeTab === 'rotations' && (
              <div className="space-y-4">
                <div className="bg-white/5 p-3 rounded-sm border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-cyan-300 font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      4D Hyperplane Rotations
                    </span>
                    <button
                      onClick={onResetRotations}
                      className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded transition"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  {/* XW Rotation Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="uppercase tracking-tighter opacity-70 font-bold text-[10px]">
                        XW Rotational Speed
                      </span>
                      <span className="text-cyan-400 font-bold">{settings.speeds.xw.toFixed(2)} rad/s</span>
                    </div>
                    <input
                      type="range"
                      min="-2.0"
                      max="2.0"
                      step="0.05"
                      value={settings.speeds.xw}
                      onChange={(e) => handleSpeedChange('xw', parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 bg-white/10 rounded h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* YW Rotation Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="uppercase tracking-tighter opacity-70 font-bold text-[10px]">
                        YW Hyperplane
                      </span>
                      <span className="text-cyan-400 font-bold">{settings.speeds.yw.toFixed(2)} rad/s</span>
                    </div>
                    <input
                      type="range"
                      min="-2.0"
                      max="2.0"
                      step="0.05"
                      value={settings.speeds.yw}
                      onChange={(e) => handleSpeedChange('yw', parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 bg-white/10 rounded h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* ZW Rotation Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="uppercase tracking-tighter opacity-70 font-bold text-[10px]">
                        ZW Hyperplane
                      </span>
                      <span className="text-fuchsia-400 font-bold">{settings.speeds.zw.toFixed(2)} rad/s</span>
                    </div>
                    <input
                      type="range"
                      min="-2.0"
                      max="2.0"
                      step="0.05"
                      value={settings.speeds.zw}
                      onChange={(e) => handleSpeedChange('zw', parseFloat(e.target.value))}
                      className="w-full accent-fuchsia-400 bg-white/10 rounded h-1.5 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3D Spatial Plane Rotations */}
                <div className="bg-white/5 p-3 rounded-sm border border-white/10 space-y-3">
                  <div className="text-slate-300 font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-teal-400" />
                    3D Spatial Rotations
                  </div>

                  {/* XY Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="uppercase tracking-tighter opacity-70 font-bold text-[10px]">XY Plane</span>
                      <span className="text-teal-400 font-bold">{settings.speeds.xy.toFixed(2)} rad/s</span>
                    </div>
                    <input
                      type="range"
                      min="-2.0"
                      max="2.0"
                      step="0.05"
                      value={settings.speeds.xy}
                      onChange={(e) => handleSpeedChange('xy', parseFloat(e.target.value))}
                      className="w-full accent-teal-400 bg-white/10 rounded h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* XZ Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="uppercase tracking-tighter opacity-70 font-bold text-[10px]">XZ Plane</span>
                      <span className="text-teal-400 font-bold">{settings.speeds.xz.toFixed(2)} rad/s</span>
                    </div>
                    <input
                      type="range"
                      min="-2.0"
                      max="2.0"
                      step="0.05"
                      value={settings.speeds.xz}
                      onChange={(e) => handleSpeedChange('xz', parseFloat(e.target.value))}
                      className="w-full accent-teal-400 bg-white/10 rounded h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* YZ Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="uppercase tracking-tighter opacity-70 font-bold text-[10px]">YZ Plane</span>
                      <span className="text-teal-400 font-bold">{settings.speeds.yz.toFixed(2)} rad/s</span>
                    </div>
                    <input
                      type="range"
                      min="-2.0"
                      max="2.0"
                      step="0.05"
                      value={settings.speeds.yz}
                      onChange={(e) => handleSpeedChange('yz', parseFloat(e.target.value))}
                      className="w-full accent-teal-400 bg-white/10 rounded h-1.5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Projection & Geometry */}
            {activeTab === 'geometry' && (
              <div className="space-y-4">
                <div className="bg-white/5 p-3 rounded-sm border border-white/10 space-y-3">
                  <div className="text-cyan-300 font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
                    Projection Distance (d)
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="uppercase tracking-tighter opacity-70 font-bold text-[10px]">
                        Projection Distortion
                      </span>
                      <span className="text-cyan-400 font-bold">{settings.projectionD.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="1.2"
                      max="4.5"
                      step="0.05"
                      value={settings.projectionD}
                      onChange={(e) =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          projectionD: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-cyan-400 bg-white/10 rounded h-1.5 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 leading-tight">
                      4D Perspective formula: scale = d / (d - w). Lower d exaggerates 4D depth!
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-sm border border-white/10 space-y-3">
                  <div className="text-cyan-300 font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
                    Mesh Thickness & Bloom
                  </div>

                  {/* Tube Radius */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="uppercase tracking-tighter opacity-70 font-bold text-[10px]">
                        Hyper-Tube Radius
                      </span>
                      <span className="text-cyan-400 font-bold">{settings.tubeRadius.toFixed(3)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.10"
                      step="0.005"
                      value={settings.tubeRadius}
                      onChange={(e) =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          tubeRadius: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-cyan-400 bg-white/10 rounded h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Node Radius */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="uppercase tracking-tighter opacity-70 font-bold text-[10px]">
                        Vertex Sphere Size
                      </span>
                      <span className="text-cyan-400 font-bold">{settings.nodeRadius.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.04"
                      max="0.25"
                      step="0.01"
                      value={settings.nodeRadius}
                      onChange={(e) =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          nodeRadius: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-cyan-400 bg-white/10 rounded h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Bloom Strength */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="uppercase tracking-tighter opacity-70 font-bold text-[10px]">
                        Bloom Intensity
                      </span>
                      <span className="text-fuchsia-400 font-bold">{settings.bloomStrength.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="3.0"
                      step="0.1"
                      value={settings.bloomStrength}
                      onChange={(e) =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          bloomStrength: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-fuchsia-400 bg-white/10 rounded h-1.5 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Camera & Render Toggles */}
                <div className="bg-white/5 p-3 rounded-sm border border-white/10 space-y-2">
                  <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                    <span className="flex items-center gap-2 text-xs font-medium">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      Auto-Orbit Camera
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.autoRotateCamera}
                      onChange={(e) =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          autoRotateCamera: e.target.checked,
                        }))
                      }
                      className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-slate-300 cursor-pointer pt-1 border-t border-white/10">
                    <span className="flex items-center gap-2 text-xs font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Wireframe Overlay Only
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.wireframeOnly}
                      onChange={(e) =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          wireframeOnly: e.target.checked,
                        }))
                      }
                      className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Tab 3: Themes & Visual Styles */}
            {activeTab === 'style' && (
              <div className="space-y-3">
                <div className="text-cyan-300 font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
                  Color Presets
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(COLOR_SCHEMES) as ColorSchemeId[]).map((schemeId) => {
                    const scheme = COLOR_SCHEMES[schemeId];
                    const isSelected = settings.colorScheme === schemeId;

                    return (
                      <button
                        key={schemeId}
                        onClick={() =>
                          onUpdateSettings((prev) => ({ ...prev, colorScheme: schemeId }))
                        }
                        className={`p-3 rounded-sm border transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-xs">{scheme.name}</p>
                          <p className="text-[10px] text-slate-400">
                            Depth interpolation gradient
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: scheme.cyanColor }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: scheme.magentaColor }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>
        ) : (
          <button
            onClick={() => setPanelOpen(true)}
            className="pointer-events-auto bg-[#02040a]/90 hover:bg-white/10 border border-white/10 text-cyan-400 px-3.5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold tracking-wider uppercase backdrop-blur-md transition-all hover:scale-105"
            title="Open Settings Control Deck"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Show Settings</span>
          </button>
        )}

        {/* Right Side Panel: Telemetry Logs & Persistent 4D Axis Radar */}
        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          <div className="hidden lg:block text-[10px] font-mono text-right uppercase tracking-wider text-slate-400 bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-sm space-y-1">
            <p className="text-cyan-300 font-bold">Vertex Matrix: [±1, ±1, ±1, ±1]</p>
            <p className="text-slate-300">
              4D Euler Angles: {settings.speeds.xw.toFixed(2)}, {settings.speeds.yw.toFixed(2)},{' '}
              {settings.speeds.zw.toFixed(2)}
            </p>
            <p className="text-emerald-400">FPS: {fps}.0 [Stable]</p>
          </div>

          <AxisVisualizer4D anglesRef={anglesRef} projectionD={settings.projectionD} />
        </div>
      </div>
    </div>
  );
};

