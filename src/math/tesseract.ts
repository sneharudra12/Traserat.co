import { Vec3, Vec4, Vertex4DInfo } from '../types';

// Generate 16 vertices of a 4D Hypercube
export function generateVertices4D(): Vec4[] {
  const vertices: Vec4[] = [];
  for (let i = 0; i < 16; i++) {
    const x = (i & 1) ? 1 : -1;
    const y = (i & 2) ? 1 : -1;
    const z = (i & 4) ? 1 : -1;
    const w = (i & 8) ? 1 : -1;
    vertices.push([x, y, z, w]);
  }
  return vertices;
}

// Generate 32 edges connecting vertices that differ in exactly 1 coordinate
export function generateEdges4D(): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const xor = i ^ j;
      // Check if power of 2 (differs by exactly 1 bit)
      if ((xor & (xor - 1)) === 0) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

export interface AngleState {
  xw: number;
  yw: number;
  zw: number;
  xy: number;
  xz: number;
  yz: number;
}

// Rotate a 4D vector across 6 hyperplanes
export function rotate4D(v: Vec4, a: AngleState): Vec4 {
  let [x, y, z, w] = v;

  // XW Rotation
  if (a.xw !== 0) {
    const cos = Math.cos(a.xw);
    const sin = Math.sin(a.xw);
    const nx = x * cos - w * sin;
    const nw = x * sin + w * cos;
    x = nx;
    w = nw;
  }

  // YW Rotation
  if (a.yw !== 0) {
    const cos = Math.cos(a.yw);
    const sin = Math.sin(a.yw);
    const ny = y * cos - w * sin;
    const nw = y * sin + w * cos;
    y = ny;
    w = nw;
  }

  // ZW Rotation
  if (a.zw !== 0) {
    const cos = Math.cos(a.zw);
    const sin = Math.sin(a.zw);
    const nz = z * cos - w * sin;
    const nw = z * sin + w * cos;
    z = nz;
    w = nw;
  }

  // XY Rotation
  if (a.xy !== 0) {
    const cos = Math.cos(a.xy);
    const sin = Math.sin(a.xy);
    const nx = x * cos - y * sin;
    const ny = x * sin + y * cos;
    x = nx;
    y = ny;
  }

  // XZ Rotation
  if (a.xz !== 0) {
    const cos = Math.cos(a.xz);
    const sin = Math.sin(a.xz);
    const nx = x * cos - z * sin;
    const nz = x * sin + z * cos;
    x = nx;
    z = nz;
  }

  // YZ Rotation
  if (a.yz !== 0) {
    const cos = Math.cos(a.yz);
    const sin = Math.sin(a.yz);
    const ny = y * cos - z * sin;
    const nz = y * sin + z * cos;
    y = ny;
    z = nz;
  }

  return [x, y, z, w];
}

// 4D to 3D Perspective Projection formula: scale = d / (d - w)
export function project4Dto3D(v: Vec4, distanceD: number): { point3D: Vec3; wFactor: number; scale: number } {
  const [x, y, z, w] = v;
  // Guard against camera passing through/behind point in 4D space
  const denominator = Math.max(0.1, distanceD - w);
  const scale = distanceD / denominator;

  const point3D: Vec3 = [x * scale, y * scale, z * scale];
  // Normalized wFactor between 0 and 1 (when w in [-sqrt(2), sqrt(2)])
  const wFactor = Math.min(1, Math.max(0, (w + 1.8) / 3.6));

  return { point3D, wFactor, scale };
}

export function computeVerticesInfo(
  baseVertices: Vec4[],
  angles: AngleState,
  distanceD: number
): Vertex4DInfo[] {
  return baseVertices.map((v, index) => {
    const rotated = rotate4D(v, angles);
    const { point3D, wFactor } = project4Dto3D(rotated, distanceD);
    return {
      id: index,
      original: v,
      rotated,
      projected: point3D,
      wFactor
    };
  });
}
