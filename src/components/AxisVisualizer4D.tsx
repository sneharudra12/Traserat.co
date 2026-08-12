import React, { useEffect, useRef, useState } from 'react';
import { AngleState, rotate4D, project4Dto3D } from '../math/tesseract';
import { Vec4 } from '../types';
import { Compass } from 'lucide-react';

interface AxisVisualizer4DProps {
  anglesRef: React.MutableRefObject<AngleState>;
  projectionD: number;
}

// 4D Basis Vectors
const BASIS_VECTORS: { name: 'X' | 'Y' | 'Z' | 'W'; v: Vec4; color: string; labelColor: string }[] = [
  { name: 'X', v: [1, 0, 0, 0], color: '#00f2ff', labelColor: 'text-cyan-400' },
  { name: 'Y', v: [0, 1, 0, 0], color: '#10b981', labelColor: 'text-emerald-400' },
  { name: 'Z', v: [0, 0, 1, 0], color: '#818cf8', labelColor: 'text-indigo-400' },
  { name: 'W', v: [0, 0, 0, 1], color: '#f43f5e', labelColor: 'text-rose-400' },
];

export const AxisVisualizer4D: React.FC<AxisVisualizer4DProps> = ({
  anglesRef,
  projectionD,
}) => {
  const [, setFrame] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  // Smooth 60FPS tick to re-render axis orientation as 4D rotation angles advance
  useEffect(() => {
    let active = true;
    const update = () => {
      if (active) {
        setFrame((f) => (f + 1) % 100000);
        animFrameRef.current = requestAnimationFrame(update);
      }
    };
    animFrameRef.current = requestAnimationFrame(update);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const angles = anglesRef.current;

  // Calculate rotated basis vectors & 2D screen projections
  const center = 65;
  const scaleLen = 38;
  const isoAngle = Math.PI / 6; // 30 degrees for 3D isometric projection

  const projectedAxes = BASIS_VECTORS.map(({ name, v, color, labelColor }) => {
    const rotated = rotate4D(v, angles);
    const { point3D } = project4Dto3D(rotated, projectionD);
    const [px, py, pz] = point3D;

    // 3D Isometric to 2D Screen Conversion
    const sx = center + (px - pz) * Math.cos(isoAngle) * scaleLen;
    const sy = center - py * scaleLen + (px + pz) * Math.sin(isoAngle) * scaleLen * 0.5;

    return {
      name,
      color,
      labelColor,
      rotated,
      point3D,
      screenPos: { x: sx, y: sy },
    };
  });

  const wAxisInfo = projectedAxes.find((a) => a.name === 'W');
  const wRot = wAxisInfo ? wAxisInfo.rotated : [0, 0, 0, 1];

  return (
    <div className="pointer-events-auto bg-[#02040a]/85 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl font-sans text-slate-200 w-52 sm:w-56">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Compass className="w-3.5 h-3.5 text-rose-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-[10px] font-black uppercase tracking-[0.18em]">4D W-Axis Radar</span>
        </div>
        <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 uppercase font-bold">
          4th Dim
        </span>
      </div>

      {/* 2D SVG Axis Canvas */}
      <div className="relative flex justify-center items-center my-1">
        <svg width="130" height="130" className="overflow-visible">
          {/* Outer Grid Rings */}
          <circle cx={center} cy={center} r={scaleLen} fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2,2" />
          <circle cx={center} cy={center} r={scaleLen * 0.5} fill="none" stroke="rgba(255,255,255,0.05)" />

          {/* Coordinate Origin */}
          <circle cx={center} cy={center} r="2.5" fill="#00f2ff" />

          {/* Axis Vectors */}
          {projectedAxes.map(({ name, color, screenPos }) => {
            const isW = name === 'W';
            return (
              <g key={name}>
                {/* Line from origin to projected head */}
                <line
                  x1={center}
                  y1={center}
                  x2={screenPos.x}
                  y2={screenPos.y}
                  stroke={color}
                  strokeWidth={isW ? '2.5' : '1.5'}
                  opacity={isW ? 1 : 0.75}
                />

                {/* Arrowhead / Tip Indicator */}
                <circle
                  cx={screenPos.x}
                  cy={screenPos.y}
                  r={isW ? '4' : '2.5'}
                  fill={color}
                  className={isW ? 'animate-pulse' : ''}
                />

                {/* W-Axis Glow Ring */}
                {isW && (
                  <circle
                    cx={screenPos.x}
                    cy={screenPos.y}
                    r="8"
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.6"
                  >
                    <animate attributeName="r" values="5;11;5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Axis Label */}
                <text
                  x={screenPos.x + (screenPos.x >= center ? 7 : -12)}
                  y={screenPos.y + (screenPos.y >= center ? 10 : -6)}
                  fill={color}
                  fontSize={isW ? '11' : '9'}
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* W-Vector Telemetry Breakdown */}
      <div className="mt-2 bg-black/40 p-2 rounded border border-white/10 space-y-1 font-mono text-[9px]">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-sans uppercase font-bold text-[8.5px] tracking-wider">
            W Orientation:
          </span>
          <span className="text-rose-400 font-bold">
            [{wRot[0].toFixed(2)}, {wRot[1].toFixed(2)}, {wRot[2].toFixed(2)}, {wRot[3].toFixed(2)}]
          </span>
        </div>
      </div>
    </div>
  );
};
