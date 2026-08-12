export type Vec4 = [number, number, number, number];
export type Vec3 = [number, number, number];

export interface RotationSpeeds {
  xw: number; // Hyperplane X-W
  yw: number; // Hyperplane Y-W
  zw: number; // Hyperplane Z-W
  xy: number; // Hyperplane X-Y
  xz: number; // Hyperplane X-Z
  yz: number; // Hyperplane Y-Z
}

export type ColorSchemeId = 'cyberpunk' | 'quantum' | 'matrix' | 'supernova' | 'rainbow';

export interface ColorScheme {
  id: ColorSchemeId;
  name: string;
  cyanColor: string; // Inner/Primary
  magentaColor: string; // Outer/Secondary
  nodeColor: string;
  glowColor: string;
  backgroundNebula: [string, string, string];
}

export interface TesseractSettings {
  projectionD: number; // 4D perspective distance d
  speeds: RotationSpeeds;
  isPaused: boolean;
  tubeRadius: number;
  nodeRadius: number;
  bloomStrength: number;
  colorScheme: ColorSchemeId;
  autoRotateCamera: boolean;
  showVertexLabels: boolean;
  soundEnabled: boolean;
  wireframeOnly: boolean;
}

export interface Vertex4DInfo {
  id: number;
  original: Vec4;
  rotated: Vec4;
  projected: Vec3;
  wFactor: number; // normalized 0 to 1 based on W
}
