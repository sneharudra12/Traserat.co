import { ColorScheme, ColorSchemeId } from '../types';

export const COLOR_SCHEMES: Record<ColorSchemeId, ColorScheme> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    cyanColor: '#00f3ff', // W low
    magentaColor: '#ff00a0', // W high
    nodeColor: '#00ffff',
    glowColor: '#00e5ff',
    backgroundNebula: ['#030712', '#0f172a', '#1e1b4b'],
  },
  quantum: {
    id: 'quantum',
    name: 'Quantum Gold & Violet',
    cyanColor: '#f59e0b', // Amber/Gold
    magentaColor: '#a855f7', // Purple/Violet
    nodeColor: '#fef08a',
    glowColor: '#d97706',
    backgroundNebula: ['#09090b', '#2e1065', '#1e1b4b'],
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Code Green',
    cyanColor: '#22c55e', // Bright Green
    magentaColor: '#86efac', // Pale Emerald
    nodeColor: '#4ade80',
    glowColor: '#16a34a',
    backgroundNebula: ['#022c22', '#064e3b', '#020617'],
  },
  supernova: {
    id: 'supernova',
    name: 'Supernova Fire',
    cyanColor: '#ef4444', // Flame Red
    magentaColor: '#f97316', // Bright Orange
    nodeColor: '#fde047',
    glowColor: '#ea580c',
    backgroundNebula: ['#18181b', '#450a0a', '#2a0808'],
  },
  rainbow: {
    id: 'rainbow',
    name: '4D Spectrum W-Depth',
    cyanColor: '#3b82f6', // Electric Blue
    magentaColor: '#ec4899', // Hot Pink
    nodeColor: '#ffffff',
    glowColor: '#8b5cf6',
    backgroundNebula: ['#030712', '#1e1b4b', '#311042'],
  },
};
