import React, { useRef, useState, useEffect } from 'react';
import { AngleState } from './math/tesseract';
import { RotationSpeeds, TesseractSettings, Vertex4DInfo } from './types';
import { TesseractCanvas } from './components/TesseractCanvas';
import { HUD } from './components/HUD';
import { PresetsBar } from './components/PresetsBar';
import { VertexInspector } from './components/VertexInspector';
import { InfoModal } from './components/InfoModal';
import { IntroModal } from './components/IntroModal';
import { spaceAudio } from './audio/spaceAudio';

export default function App() {
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(true);
  const [settings, setSettings] = useState<TesseractSettings>({
    projectionD: 2.2,
    speeds: {
      xw: 0.5,
      yw: 0.35,
      zw: 0.0,
      xy: 0.0,
      xz: 0.0,
      yz: 0.0,
    },
    isPaused: false,
    tubeRadius: 0.035,
    nodeRadius: 0.12,
    bloomStrength: 1.4,
    colorScheme: 'cyberpunk',
    autoRotateCamera: true,
    showVertexLabels: true,
    soundEnabled: false,
    wireframeOnly: false,
  });

  // Current accumulated 4D rotation angles state
  const anglesRef = useRef<AngleState>({
    xw: 0,
    yw: 0,
    zw: 0,
    xy: 0,
    xz: 0,
    yz: 0,
  });

  const [selectedVertex, setSelectedVertex] = useState<Vertex4DInfo | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isUiHidden, setIsUiHidden] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  // Keyboard shortcut listener ('h' or 'H' to toggle UI visibility)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setIsUiHidden((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync sound engine state with settings
  useEffect(() => {
    spaceAudio.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleResetRotations = () => {
    anglesRef.current = { xw: 0, yw: 0, zw: 0, xy: 0, xz: 0, yz: 0 };
    setSettings((prev) => ({
      ...prev,
      speeds: { xw: 0, yw: 0, zw: 0, xy: 0, xz: 0, yz: 0 },
    }));
  };

  const handleApplyPreset = (speeds: RotationSpeeds, distanceD?: number) => {
    setSettings((prev) => ({
      ...prev,
      isPaused: false,
      speeds,
      projectionD: distanceD ?? prev.projectionD,
    }));
  };

  return (
    <div className="relative w-screen h-screen bg-[#02040a] text-slate-200 overflow-hidden select-none font-sans">
      {/* Immersive UI Background Ambient Glow & Grid Texture */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 70% 30%, #4c1d95 0%, transparent 50%), radial-gradient(circle at 20% 80%, #701a75 0%, transparent 50%)',
          filter: 'blur(80px)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-10" />

      {/* Interactive WebGL 3D Canvas */}
      <TesseractCanvas
        settings={settings}
        anglesRef={anglesRef}
        onSelectVertex={setSelectedVertex}
        hoveredVertexId={selectedVertex?.id ?? null}
        setFps={setFps}
      />

      {/* Futuristic HUD Control Overlay */}
      <HUD
        settings={settings}
        anglesRef={anglesRef}
        onUpdateSettings={setSettings}
        onResetRotations={handleResetRotations}
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenIntro={() => setIsIntroOpen(true)}
        fps={fps}
        isUiHidden={isUiHidden}
        onToggleUiHidden={() => setIsUiHidden((prev) => !prev)}
      />

      {/* Quick 4D Rotation Presets Bar (hidden in clean full screen view) */}
      {!isUiHidden && (
        <PresetsBar
          onApplyPreset={handleApplyPreset}
          currentSpeeds={settings.speeds}
        />
      )}

      {/* Vertex Data Inspector Card */}
      {!isUiHidden && (
        <VertexInspector
          vertexInfo={selectedVertex}
          onClose={() => setSelectedVertex(null)}
        />
      )}

      {/* Educational Guide Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {/* Intro Page Modal with Glass Animation */}
      <IntroModal
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
      />

      {/* Immersive UI Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none z-30" />
    </div>
  );
}
