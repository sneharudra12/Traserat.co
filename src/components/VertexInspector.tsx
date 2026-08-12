import React from 'react';
import { Vertex4DInfo } from '../types';
import { X, Sparkles, Binary } from 'lucide-react';

interface VertexInspectorProps {
  vertexInfo: Vertex4DInfo | null;
  onClose: () => void;
}

export const VertexInspector: React.FC<VertexInspectorProps> = ({ vertexInfo, onClose }) => {
  if (!vertexInfo) return null;

  const [origX, origY, origZ, origW] = vertexInfo.original;
  const [rotX, rotY, rotZ, rotW] = vertexInfo.rotated;
  const [projX, projY, projZ] = vertexInfo.projected;

  const isInner = rotW < 0;

  return (
    <div className="absolute top-20 right-6 pointer-events-auto z-20 w-80 bg-[#02040a]/90 backdrop-blur-md border border-white/10 rounded-sm p-4 shadow-2xl text-slate-100 space-y-3 font-sans animate-in fade-in zoom-in-95 duration-200">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-[0.2em]">
          <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Vertex #{vertexInfo.id} Inspector</span>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 4D Depth Indicator Badge */}
      <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded border border-white/10">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">4D W-Space Region:</span>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
            isInner
              ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
          }`}
        >
          {isInner ? 'Inner Core (W < 0)' : 'Outer Shell (W > 0)'}
        </span>
      </div>

      {/* Coordinate Data Blocks */}
      <div className="space-y-2 text-xs font-mono">
        {/* Base 4D Vector */}
        <div className="bg-black/40 p-2.5 rounded border border-white/10 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-sans font-bold flex items-center gap-1 tracking-wider">
            <Binary className="w-3 h-3 text-cyan-400" />
            Base Hypercube Vector (X, Y, Z, W)
          </div>
          <p className="text-cyan-300">
            [{origX > 0 ? '+1' : '-1'}, {origY > 0 ? '+1' : '-1'}, {origZ > 0 ? '+1' : '-1'},{' '}
            {origW > 0 ? '+1' : '-1'}]
          </p>
        </div>

        {/* Real-time Rotated 4D Coordinates */}
        <div className="bg-black/40 p-2.5 rounded border border-white/10 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-sans font-bold tracking-wider">
            Rotated 4D Space Coordinates
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-200">
            <div>
              X: <span className="text-teal-300">{rotX.toFixed(3)}</span>
            </div>
            <div>
              Y: <span className="text-teal-300">{rotY.toFixed(3)}</span>
            </div>
            <div>
              Z: <span className="text-teal-300">{rotZ.toFixed(3)}</span>
            </div>
            <div>
              W: <span className="text-fuchsia-300">{rotW.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Projected 3D Coordinates */}
        <div className="bg-black/40 p-2.5 rounded border border-white/10 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-sans font-bold tracking-wider">
            Projected 3D Camera Coordinates
          </div>
          <div className="text-slate-300">
            X': <span className="text-cyan-400">{projX.toFixed(3)}</span>, Y':{' '}
            <span className="text-cyan-400">{projY.toFixed(3)}</span>, Z':{' '}
            <span className="text-cyan-400">{projZ.toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  );

};
