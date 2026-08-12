import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { COLOR_SCHEMES } from '../data/colorSchemes';
import {
  AngleState,
  computeVerticesInfo,
  generateEdges4D,
  generateVertices4D,
} from '../math/tesseract';
import { TesseractSettings, Vertex4DInfo } from '../types';
import { spaceAudio } from '../audio/spaceAudio';

interface TesseractCanvasProps {
  settings: TesseractSettings;
  anglesRef: React.MutableRefObject<AngleState>;
  onSelectVertex: (vInfo: Vertex4DInfo | null) => void;
  hoveredVertexId: number | null;
  setFps: (fps: number) => void;
}

export const TesseractCanvas: React.FC<TesseractCanvasProps> = ({
  settings,
  anglesRef,
  onSelectVertex,
  hoveredVertexId,
  setFps,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Mesh references for 16 nodes and 32 tubes
  const nodesMeshRef = useRef<THREE.Mesh[]>([]);
  const tubesMeshRef = useRef<THREE.Mesh[]>([]);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const dustParticlesRef = useRef<THREE.Points | null>(null);

  // Static geometry data
  const baseVertices = useRef(generateVertices4D()).current;
  const edges = useRef(generateEdges4D()).current;

  // Raycaster for vertex interaction
  const raycaster = useRef(new THREE.Raycaster()).current;
  const mouse = useRef(new THREE.Vector2()).current;

  // Setup Three.js Scene, Camera, Renderer, Post-processing, and Objects
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x030712, 0.015);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 2.5;
    controlsRef.current = controls;

    // 5. Post-processing Bloom
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      settings.bloomStrength,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;
    bloomPassRef.current = bloomPass;

    // 6. Space Background - Starfield Particles (6,000 depth stars)
    const starCount = 6000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const activeScheme = COLOR_SCHEMES[settings.colorScheme];
    const c1 = new THREE.Color(activeScheme.cyanColor);
    const c2 = new THREE.Color(activeScheme.magentaColor);

    for (let i = 0; i < starCount; i++) {
      const radius = 30 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const colorMix = Math.random();
      const starColor = colorMix > 0.7 ? c1 : colorMix > 0.4 ? c2 : new THREE.Color(0xffffff);
      starColors[i * 3] = starColor.r;
      starColors[i * 3 + 1] = starColor.g;
      starColors[i * 3 + 2] = starColor.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 7. Ambient Cosmic Dust Particles around origin
    const dustCount = 150;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 12;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.6,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);
    dustParticlesRef.current = dustParticles;

    // 8. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 3, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00a0, 3, 20);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // 9. Inner Core Glowing Pulse Sphere
    const coreGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00f3ff,
      emissiveIntensity: 3.5,
      roughness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // 10. Instantiate 16 Node Spheres
    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);
    const nodesMesh: THREE.Mesh[] = [];

    for (let i = 0; i < 16; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: activeScheme.nodeColor,
        emissiveIntensity: 1.8,
        roughness: 0.2,
        metalness: 0.8,
      });
      const node = new THREE.Mesh(sphereGeo, mat);
      node.userData = { vertexIndex: i };
      scene.add(node);
      nodesMesh.push(node);
    }
    nodesMeshRef.current = nodesMesh;

    // 11. Instantiate 32 Edge Hyper-Tubes
    const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 16);
    const tubesMesh: THREE.Mesh[] = [];

    for (let i = 0; i < 32; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: activeScheme.cyanColor,
        emissiveIntensity: 1.5,
        roughness: 0.15,
        metalness: 0.85,
      });
      const tube = new THREE.Mesh(cylinderGeo, mat);
      scene.add(tube);
      tubesMesh.push(tube);
    }
    tubesMeshRef.current = tubesMesh;

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera || !composer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Bloom Strength dynamically
  useEffect(() => {
    if (bloomPassRef.current) {
      bloomPassRef.current.strength = settings.bloomStrength;
    }
  }, [settings.bloomStrength]);

  // Main Animation & Render Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const upVector = new THREE.Vector3(0, 1, 0);

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Calculate FPS
      frameCount++;
      if (currentTime - fpsTimer >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - fpsTimer)));
        frameCount = 0;
        fpsTimer = currentTime;
      }

      // 1. Advance 4D rotation angles if not paused
      if (!settings.isPaused) {
        const s = settings.speeds;
        anglesRef.current.xw += s.xw * delta;
        anglesRef.current.yw += s.yw * delta;
        anglesRef.current.zw += s.zw * delta;
        anglesRef.current.xy += s.xy * delta;
        anglesRef.current.xz += s.xz * delta;
        anglesRef.current.yz += s.yz * delta;

        // Calculate total 4D rotation speed for audio pitch adjustment
        const totalSpeed =
          Math.abs(s.xw) +
          Math.abs(s.yw) +
          Math.abs(s.zw) +
          Math.abs(s.xy) +
          Math.abs(s.xz) +
          Math.abs(s.yz);
        spaceAudio.updateSpeedPitch(totalSpeed);
      }

      // 2. Compute 4D vertices rotation & projection to 3D
      const vertexInfos = computeVerticesInfo(
        baseVertices,
        anglesRef.current,
        settings.projectionD
      );

      const scheme = COLOR_SCHEMES[settings.colorScheme];
      const cyanColor = new THREE.Color(scheme.cyanColor);
      const magentaColor = new THREE.Color(scheme.magentaColor);

      // 3. Update 16 Nodes (Sphere Vertices)
      vertexInfos.forEach((info, i) => {
        const node = nodesMeshRef.current[i];
        if (!node) return;

        const [px, py, pz] = info.projected;
        node.position.set(px, py, pz);

        // Scale node according to 4D projection wFactor
        const baseRad = settings.nodeRadius;
        const scaleFactor = baseRad * (0.6 + info.wFactor * 0.8);
        const isHovered = hoveredVertexId === i;
        const finalScale = isHovered ? scaleFactor * 1.6 : scaleFactor;

        node.scale.set(finalScale, finalScale, finalScale);

        // Interpolate emissive color based on wFactor
        const mat = node.material as THREE.MeshStandardMaterial;
        if (isHovered) {
          mat.emissive.setHex(0xffffff);
          mat.emissiveIntensity = 3.5;
        } else {
          const colorLerp = new THREE.Color().copy(cyanColor).lerp(magentaColor, info.wFactor);
          mat.emissive.copy(colorLerp);
          mat.emissiveIntensity = 1.8 + info.wFactor * 0.8;
        }
      });

      // 4. Update 32 Edge Hyper-Tubes
      edges.forEach(([v1Idx, v2Idx], edgeIdx) => {
        const tube = tubesMeshRef.current[edgeIdx];
        if (!tube) return;

        const info1 = vertexInfos[v1Idx];
        const info2 = vertexInfos[v2Idx];

        const p1 = new THREE.Vector3(...info1.projected);
        const p2 = new THREE.Vector3(...info2.projected);

        // Position: midpoint
        const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        tube.position.copy(midpoint);

        // Orientation: rotate cylinder from Y axis to p2 - p1 direction
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const length = dir.length();
        dir.normalize();

        if (length > 0.001) {
          const quaternion = new THREE.Quaternion().setFromUnitVectors(upVector, dir);
          tube.quaternion.copy(quaternion);
        }

        // Scale: X/Z radius, Y length
        const avgWFactor = (info1.wFactor + info2.wFactor) / 2;
        const radius = settings.wireframeOnly ? 0.012 : settings.tubeRadius * (0.6 + avgWFactor * 0.7);
        tube.scale.set(radius, length, radius);

        // Emissive Color
        const mat = tube.material as THREE.MeshStandardMaterial;
        const edgeColor = new THREE.Color().copy(cyanColor).lerp(magentaColor, avgWFactor);
        mat.emissive.copy(edgeColor);
        mat.emissiveIntensity = 1.4 + avgWFactor * 0.8;
      });

      // 5. Pulse Core Light & Core Sphere
      if (coreMeshRef.current) {
        const pulse = 1 + Math.sin(currentTime * 0.004) * 0.2;
        coreMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      // 6. Slowly drift cosmic dust
      if (dustParticlesRef.current) {
        dustParticlesRef.current.rotation.y += 0.0005;
        dustParticlesRef.current.rotation.x += 0.0003;
      }

      // 7. Camera Auto-Orbit if enabled
      if (settings.autoRotateCamera && controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 0.8;
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Render through composer
      if (composerRef.current) {
        composerRef.current.render();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [settings, hoveredVertexId, setFps]);

  // Pointer Click / Hover Raycasting for Vertex Selection
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current || !cameraRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(nodesMeshRef.current);

    if (intersects.length > 0) {
      const hitObj = intersects[0].object as THREE.Mesh;
      const vIndex = hitObj.userData.vertexIndex as number;

      const vertexInfos = computeVerticesInfo(
        baseVertices,
        anglesRef.current,
        settings.projectionD
      );
      const clickedInfo = vertexInfos[vIndex];
      onSelectVertex(clickedInfo);
      spaceAudio.playVertexBeep(clickedInfo.wFactor);
    } else {
      onSelectVertex(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-slate-950 cursor-grab active:cursor-grabbing select-none overflow-hidden"
      onPointerDown={handlePointerDown}
    />
  );
};
