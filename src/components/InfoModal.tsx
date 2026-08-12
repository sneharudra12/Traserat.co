import React from 'react';
import { X, Boxes, Compass, Layers, Zap, BookOpen } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#02040a] border border-white/10 rounded-sm p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6 max-h-[90vh] overflow-y-auto font-sans scrollbar-thin scrollbar-thumb-cyan-500/30">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-[0.2em] text-white">
                4D Tesseract Geometry Architecture
              </h2>
              <p className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
                Hyperplane Rotations & Perspective Projection Formulae
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Sections */}
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* Section 1: Dimensional Hierarchy */}
          <div className="bg-black/40 p-4 sm:p-5 rounded border border-white/10 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              1. Dimensional Progression
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-white/5 p-2.5 rounded border border-white/10">
                <span className="block font-bold text-slate-400">0D Point</span>
                <span className="text-[10px] text-slate-500">1 Vertex</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded border border-white/10">
                <span className="block font-bold text-slate-400">1D Line</span>
                <span className="text-[10px] text-slate-500">2 Vertices</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded border border-white/10">
                <span className="block font-bold text-slate-400">2D Square</span>
                <span className="text-[10px] text-slate-500">4 Vertices</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded border border-white/10">
                <span className="block font-bold text-teal-400">3D Cube</span>
                <span className="text-[10px] text-teal-500">8 Vertices</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded border border-cyan-500/40 col-span-2 sm:col-span-1">
                <span className="block font-bold text-cyan-300">4D Tesseract</span>
                <span className="text-[10px] text-cyan-400">16 Vertices</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Just as a 3D cube is formed by connecting two 2D squares in the 3rd dimension (Z), a
              4D Tesseract is formed by connecting two 3D cubes across the 4th dimension (W).
            </p>
          </div>

          {/* Section 2: 4D Perspective Projection */}
          <div className="bg-black/40 p-4 sm:p-5 rounded border border-white/10 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              2. Perspective Projection: 4D to 3D
            </h3>

            <p className="text-xs text-slate-300">
              Because human eyes see in 3D, we view a 3D perspective shadow of the 4D object. The
              4D perspective formula calculates scale based on distance d along the W axis:
            </p>

            <div className="bg-white/5 p-3 rounded border border-white/10 font-mono text-center text-xs text-cyan-300">
              scale = d / (d - w) &nbsp;⟹&nbsp; (x', y', z') = (x · scale, y · scale, z · scale)
            </div>

            <p className="text-xs text-slate-400">
              As a vertex moves toward +W (closer in 4D space), its scale increases and it forms
              the large outer cube. As it rotates toward -W (further away), its scale shrinks to
              form the smaller inner cube.
            </p>
          </div>

          {/* Section 3: Hyperplane Rotations */}
          <div className="bg-black/40 p-4 sm:p-5 rounded border border-white/10 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              3. The 6 Planes of Rotation
            </h3>

            <p className="text-xs text-slate-300">
              In 2D space, rotation occurs around a point. In 3D, rotation occurs around an axis.
              In 4D space, rotation occurs around a 2D plane (hyperplane)! There are 6 orthogonal
              planes:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <li className="bg-white/5 p-2.5 rounded border border-white/10 font-mono text-cyan-300">
                • XW: Rotates X into 4D W
              </li>
              <li className="bg-white/5 p-2.5 rounded border border-white/10 font-mono text-cyan-300">
                • YW: Rotates Y into 4D W
              </li>
              <li className="bg-white/5 p-2.5 rounded border border-white/10 font-mono text-cyan-300">
                • ZW: Rotates Z into 4D W
              </li>
              <li className="bg-white/5 p-2.5 rounded border border-white/10 font-mono text-teal-300">
                • XY, XZ, YZ: 3D Spatial
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded hover:bg-cyan-300 transition"
          >
            Explore Tesseract Matrix
          </button>
        </div>
      </div>
    </div>
  );

};
