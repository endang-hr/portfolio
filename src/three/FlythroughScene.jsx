import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { loadPortraitParticles, generateFallbackParticles } from './particlesGenerator';
import { getParticleAtlasTexture, getProjectCardTexture } from './textureGenerator';
import { createSignatureGroup } from './signatureCurve';
import { projectsList } from '../data/portfolioData';

const PARTICLE_VERTEX_SHADER = `
  attribute vec3 aPortraitPos;
  attribute vec3 aTunnelPos;
  attribute float aLuminance;
  attribute float aAtlasIndex;
  attribute float aSeed;
  attribute float aScale;

  uniform float uTime;
  uniform float uMorph;
  uniform float uIntro;
  uniform vec2 uMouseWorld;

  varying vec2 vUv;
  varying float vLuminance;
  varying float vAtlasIndex;
  varying float vMorph;
  varying float vWorldZ;
  varying vec3 vWorldCoord;
  varying float vSeed;

  void main() {
    vUv = uv;
    vLuminance = aLuminance;
    vAtlasIndex = aAtlasIndex;
    vSeed = aSeed;

    // Organic morph progress per micro-card
    float stagger = aSeed * 0.24;
    float localMorph = smoothstep(stagger, 0.76 + stagger, uMorph);
    vMorph = localMorph;

    // Intro assembly from dispersed halo into crisp portrait
    float introEase = smoothstep(0.0, 1.0, clamp((uIntro - aSeed * 0.25) / 0.75, 0.0, 1.0));
    float introAngle = aSeed * 6.2831853 + (1.0 - introEase) * 2.4;
    vec3 introOffset = vec3(
      cos(introAngle) * (1.0 - introEase) * (2.8 + aSeed * 3.5),
      sin(introAngle) * (1.0 - introEase) * (2.8 + aSeed * 3.5),
      (1.0 - introEase) * (4.5 + aSeed * 4.0)
    );

    vec3 portraitPos = aPortraitPos + introOffset;

    // Interactive cursor ripple when in Portrait state
    vec2 toCursor = portraitPos.xy - uMouseWorld;
    float cursorDist = length(toCursor);
    float cursorInfluence = (1.0 - smoothstep(0.0, 1.25, cursorDist)) * (1.0 - localMorph) * introEase;
    vec2 pushDir = cursorDist > 0.001 ? normalize(toCursor) : vec2(0.0, 1.0);
    portraitPos.xy += pushDir * cursorInfluence * 0.11;
    portraitPos.z += cursorInfluence * 0.34;

    // Gentle ambient breathing in portrait state
    portraitPos.z += sin(uTime * 1.3 + aPortraitPos.y * 1.4 + aSeed * 6.28) * 0.025 * (1.0 - localMorph);

    // Floating drift in deep tunnel
    vec3 tunnelPos = aTunnelPos;
    tunnelPos.x += sin(uTime * 0.55 + aSeed * 12.0) * 0.18 * localMorph;
    tunnelPos.y += cos(uTime * 0.48 + aSeed * 9.0) * 0.18 * localMorph;

    // Spiral burst mid-transition
    float burstArc = sin(localMorph * 3.14159265);
    float swirlAngle = aSeed * 6.2831853 + burstArc * 1.35;
    vec3 swirlOffset = vec3(
      cos(swirlAngle) * burstArc * 1.4,
      sin(swirlAngle) * burstArc * 1.1,
      -burstArc * 2.2
    );

    vec3 centerPos = mix(portraitPos, tunnelPos, localMorph) + swirlOffset;

    // As particles morph outward or travel down the tunnel, ensure they never cross the central card corridor
    float corridorClear = smoothstep(0.04, 0.40, localMorph);
    vec2 dirFromCenter = length(centerPos.xy) > 0.001 ? normalize(centerPos.xy) : vec2(cos(aSeed * 6.28), sin(aSeed * 6.28));
    float currentRadius = length(vec2(centerPos.x / 2.7, centerPos.y / 1.7));
    if (currentRadius < 1.0) {
      centerPos.xy += dirFromCenter * (1.0 - currentRadius) * 2.8 * corridorClear;
    }

    // Scale transitions from fine pointillist mosaic tile -> floating thumbnail card
    float portraitTileSize = 0.082 * aScale * (0.4 + 0.6 * introEase);
    float tunnelTileSize = 0.38 * (0.75 + aSeed * 0.55);
    float cardScale = mix(portraitTileSize, tunnelTileSize, localMorph);

    // Banking angle per card in deep space
    float tiltAngle = (aSeed - 0.5) * 0.36 * localMorph + burstArc * (aSeed - 0.5) * 1.2;
    float c = cos(tiltAngle);
    float s = sin(tiltAngle);
    vec2 rotatedXY = vec2(
      position.x * c - position.y * s,
      position.x * s + position.y * c
    ) * cardScale;

    vec4 worldPosition = vec4(centerPos + vec3(rotatedXY, 0.0), 1.0);
    vWorldZ = worldPosition.z;
    vWorldCoord = worldPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const PARTICLE_FRAGMENT_SHADER = `
  uniform sampler2D uAtlas;
  uniform float uCameraZ;
  uniform float uDimFactor;
  uniform float uIntro;
  uniform float uThemeLight;

  varying vec2 vUv;
  varying float vLuminance;
  varying float vAtlasIndex;
  varying float vMorph;
  varying float vWorldZ;
  varying vec3 vWorldCoord;
  varying float vSeed;

  float roundedBoxSDF(vec2 centerPos, vec2 size, float radius) {
    return length(max(abs(centerPos) - size + radius, 0.0)) - radius;
  }

  void main() {
    // Crisp rounded micro-card corners with airy negative space
    vec2 centered = vUv - 0.5;
    float sdf = roundedBoxSDF(centered, vec2(0.48, 0.48), 0.08);
    if (sdf > 0.0) discard;

    // Sample 8x8 micro-card atlas tile
    float idx = floor(vAtlasIndex + 0.5);
    float col = mod(idx, 8.0);
    float row = floor(idx / 8.0);
    vec2 innerUv = clamp(vUv, 0.025, 0.975);
    vec2 atlasUv = (vec2(col, 7.0 - row) + innerUv) / 8.0;

    vec4 texColor = texture2D(uAtlas, atlasUv);

    // Portrait mode: Luminous silver-on-black in dark mode, crisp graphite positive ink on white in light mode
    float texLuma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 bwDark = vec3(1.15 * vLuminance * (0.52 + 0.52 * texLuma));
    vec3 bwLight = vec3(0.08 + 0.56 * vLuminance * (0.45 + 0.55 * texLuma));
    vec3 bwShade = mix(bwDark, bwLight, uThemeLight);

    // Tunnel mode: Vibrant micro-card artwork
    vec3 tunnelShade = texColor.rgb * mix(1.15, 0.98, uThemeLight) + vec3(mix(0.04, 0.0, uThemeLight));

    vec3 cardColor = mix(bwShade, tunnelShade, smoothstep(0.06, 0.62, vMorph));

    // Subtle glass rim highlight on card edge
    float borderMask = smoothstep(-0.045, -0.005, sdf);
    cardColor = clamp(cardColor + mix(vec3(0.22), vec3(-0.08), uThemeLight) * borderMask * (0.35 + 0.65 * vMorph), 0.0, 1.0);

    // Distance fog fade
    float distToCam = abs(uCameraZ - vWorldZ);
    float fogFactor = exp(-pow(max(0.0, distToCam - 11.0) * 0.024, 1.55));
    vec3 fogColor = mix(vec3(0.0196, 0.0196, 0.0196), vec3(0.9686, 0.9686, 0.9765), uThemeLight);
    vec3 dimTarget = mix(vec3(0.0), fogColor, uThemeLight);
    vec3 dimmedCard = mix(dimTarget, cardColor, uDimFactor);
    vec3 finalRgb = mix(fogColor, dimmedCard, fogFactor);

    // Smooth alpha fade as particles pass close to camera
    float frontDelta = uCameraZ - vWorldZ;
    float nearLensFade = mix(1.0, smoothstep(0.35, 2.8, frontDelta), smoothstep(0.05, 0.25, vMorph));

    // Clear card viewing corridor: any particle inside or directly facing the card corridor fades out
    float corridorDist = length(vec2(vWorldCoord.x / 2.5, vWorldCoord.y / 1.65));
    float corridorMask = mix(1.0, smoothstep(0.70, 1.15, corridorDist), smoothstep(0.05, 0.28, vMorph));

    float alpha = nearLensFade * smoothstep(0.0, 0.25, uIntro) * clamp(fogFactor + 0.08, 0.0, 1.0) * corridorMask;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(finalRgb, alpha);
  }
`;

const CARD_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CARD_FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uHover;
  uniform float uSelected;
  uniform vec3 uAccent;
  uniform float uTime;
  uniform float uThemeLight;

  varying vec2 vUv;

  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    return length(max(abs(p) - b + r, 0.0)) - r;
  }

  void main() {
    if (uOpacity < 0.01) discard;

    vec2 aspectScale = vec2(1.55, 1.0);
    vec2 centered = (vUv - 0.5) * aspectScale;
    float sdf = roundedBoxSDF(centered, vec2(0.765, 0.49), 0.045);

    if (sdf > 0.0) discard;

    vec4 tex = texture2D(uTexture, vUv);
    vec3 col = tex.rgb;

    // Moving diagonal glass sheen on hover/selected
    float sheenSweep = sin((vUv.x * 1.4 + vUv.y * 0.9) * 5.0 - uTime * 2.2) * 0.5 + 0.5;
    col += vec3(0.08) * sheenSweep * max(uHover, uSelected * 0.65);

    // Accent luminous rim border
    float edgeMask = smoothstep(-0.02, -0.001, sdf);
    vec3 idleBorder = mix(vec3(0.45), vec3(0.28), uThemeLight);
    vec3 borderCol = mix(idleBorder, uAccent, max(uHover * 0.85, uSelected));
    col = mix(col, borderCol, edgeMask * (0.55 + 0.45 * max(uHover, uSelected)));

    // Pure 1:1 color fidelity matching original uploaded graphic
    float alpha = clamp(uOpacity, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function FlythroughScene({
  scrollProgress,
  selectedProjectId,
  onSelectProject,
  hoveredProjectId,
  setHoveredProjectId,
  onActiveProjectChange,
  onLoaded,
  theme = 'dark'
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    scrollProgress: 0,
    selectedProjectId: null,
    hoveredProjectId: null,
    targetThemeLight: theme === 'light' ? 1 : 0,
    introProgress: 0,
    pointer: new THREE.Vector2(0, 0),
    mouseWorld: new THREE.Vector2(99, 99)
  });

  // Keep stateRef fresh for requestAnimationFrame loop
  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress;
    stateRef.current.selectedProjectId = selectedProjectId;
    stateRef.current.hoveredProjectId = hoveredProjectId;
    stateRef.current.targetThemeLight = theme === 'light' ? 1 : 0;
  }, [scrollProgress, selectedProjectId, hoveredProjectId, theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const darkBgColor = new THREE.Color('#050505');
    const lightBgColor = new THREE.Color('#F7F7F9');
    let smoothThemeLight = stateRef.current.targetThemeLight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = darkBgColor.clone().lerp(lightBgColor, smoothThemeLight);
    scene.fog = new THREE.FogExp2(scene.background.getHex(), 0.018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.touchAction = 'pan-y';
    container.appendChild(renderer.domElement);

    // 2. Atlas Texture
    const atlasTex = getParticleAtlasTexture();

    // 3. Signature Spline Group
    const signature = createSignatureGroup();
    scene.add(signature.group);

    // 4. Instanced Particle Mesh
    const PARTICLE_COUNT = 2400;
    const initialParticles = generateFallbackParticles(PARTICLE_COUNT);

    const particleGeo = new THREE.PlaneGeometry(1, 0.76, 1, 1);
    const aPortraitPos = new THREE.InstancedBufferAttribute(initialParticles.portraitPositions, 3);
    const aTunnelPos = new THREE.InstancedBufferAttribute(initialParticles.tunnelPositions, 3);
    const aLuminance = new THREE.InstancedBufferAttribute(initialParticles.luminances, 1);
    const aAtlasIndex = new THREE.InstancedBufferAttribute(initialParticles.atlasIndices, 1);
    const aSeed = new THREE.InstancedBufferAttribute(initialParticles.randomSeeds, 1);
    const aScale = new THREE.InstancedBufferAttribute(initialParticles.scales, 1);

    particleGeo.setAttribute('aPortraitPos', aPortraitPos);
    particleGeo.setAttribute('aTunnelPos', aTunnelPos);
    particleGeo.setAttribute('aLuminance', aLuminance);
    particleGeo.setAttribute('aAtlasIndex', aAtlasIndex);
    particleGeo.setAttribute('aSeed', aSeed);
    particleGeo.setAttribute('aScale', aScale);

    const particleMat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uIntro: { value: 0 },
        uMouseWorld: { value: new THREE.Vector2(99, 99) },
        uCameraZ: { value: 9.5 },
        uDimFactor: { value: 1 },
        uThemeLight: { value: smoothThemeLight },
        uAtlas: { value: atlasTex }
      },
      transparent: true,
      depthWrite: false
    });

    const instancedMesh = new THREE.InstancedMesh(particleGeo, particleMat, PARTICLE_COUNT);
    instancedMesh.frustumCulled = false;
    instancedMesh.renderOrder = 0;
    const dummy = new THREE.Matrix4();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      instancedMesh.setMatrixAt(i, dummy);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    scene.add(instancedMesh);

    // Load actual portrait image asynchronously and update buffer
    loadPortraitParticles('/portrait.jpg?t=' + Date.now(), PARTICLE_COUNT).then(data => {
      aPortraitPos.copyArray(data.portraitPositions);
      aPortraitPos.needsUpdate = true;
      aTunnelPos.copyArray(data.tunnelPositions);
      aTunnelPos.needsUpdate = true;
      aLuminance.copyArray(data.luminances);
      aLuminance.needsUpdate = true;
      aScale.copyArray(data.scales);
      aScale.needsUpdate = true;
      if (onLoaded) onLoaded();
    });

    // 5. Project 3D Cards
    const cardGroup = new THREE.Group();
    const cardMeshes = [];
    const cardGeo = new THREE.PlaneGeometry(3.72, 2.4, 1, 1);

    projectsList.forEach((project, idx) => {
      const cardTex = getProjectCardTexture(project);
      if (cardTex && renderer) {
        cardTex.colorSpace = THREE.NoColorSpace;
        cardTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        cardTex.needsUpdate = true;
      }
      const cardMat = new THREE.ShaderMaterial({
        vertexShader: CARD_VERTEX_SHADER,
        fragmentShader: CARD_FRAGMENT_SHADER,
        uniforms: {
          uTexture: { value: cardTex },
          uOpacity: { value: 0 },
          uHover: { value: 0 },
          uSelected: { value: 0 },
          uAccent: { value: new THREE.Color(project.accentColor) },
          uTime: { value: 0 },
          uThemeLight: { value: smoothThemeLight }
        },
        transparent: true,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(cardGeo, cardMat);
      mesh.position.set(project.offsetX, project.offsetY, project.zPosition);
      mesh.renderOrder = 50;
      mesh.userData = {
        project,
        index: idx,
        currentOpacity: 0,
        currentScale: 0.55,
        currentHover: 0,
        currentSelected: 0,
        isInteractable: false
      };
      cardGroup.add(mesh);
      cardMeshes.push(mesh);
    });
    scene.add(cardGroup);

    // 6. Raycasting for Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(99, 99);

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      stateRef.current.pointer.set(x, y);
      mouse.set(x, y);

      // Map to world plane at z=0 for cursor ripple in portrait
      const aspect = camera.aspect || 1.77;
      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      const viewH = Math.abs(camera.position.z) * Math.tan(0.5 * fovRad) * 2;
      const viewW = viewH * aspect;
      stateRef.current.mouseWorld.set(x * viewW * 0.5, y * viewH * 0.5);

      // Check hover on visible 3D cards
      raycaster.setFromCamera(mouse, camera);
      const interactableMeshes = cardMeshes.filter(m => m.userData.isInteractable);
      const intersects = raycaster.intersectObjects(interactableMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        setHoveredProjectId(hit.userData.project.id);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        if (stateRef.current.hoveredProjectId) {
          setHoveredProjectId(null);
        }
        renderer.domElement.style.cursor = 'auto';
      }
    };

    const onClick = (e) => {
      if (e.clientX !== undefined && e.clientY !== undefined) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      }
      raycaster.setFromCamera(mouse, camera);
      const interactableMeshes = cardMeshes.filter(m => m.userData.isInteractable);
      const intersects = raycaster.intersectObjects(interactableMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        onSelectProject(hit.userData.project.id);
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    const onTouchStart = (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = performance.now();
      }
    };

    const onTouchEnd = (e) => {
      if (e.changedTouches && e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const dt = performance.now() - touchStartTime;
        const dist = Math.hypot(dx, dy);

        // Tap detected if finger moved < 16px and tap duration < 350ms
        if (dt < 350 && dist < 16) {
          const clientX = e.changedTouches[0].clientX;
          const clientY = e.changedTouches[0].clientY;
          mouse.x = (clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(clientY / window.innerHeight) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
          const interactableMeshes = cardMeshes.filter(m => m.userData.isInteractable);
          const intersects = raycaster.intersectObjects(interactableMeshes);

          if (intersects.length > 0) {
            const hit = intersects[0].object;
            onSelectProject(hit.userData.project.id);
          }
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('click', onClick);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // 7. Animation Loop
    const clock = new THREE.Clock();
    let animId;
    let smoothMorph = 0;
    let smoothCamZ = 9.5;
    let smoothCamX = 0;
    let smoothCamY = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Smoothly interpolate scene background and fog between Dark (#050505) and Light (#F7F7F9)
      smoothThemeLight = THREE.MathUtils.lerp(smoothThemeLight, stateRef.current.targetThemeLight, 1 - Math.exp(-8 * delta));
      scene.background.copy(darkBgColor).lerp(lightBgColor, smoothThemeLight);
      scene.fog.color.copy(scene.background);

      // Intro progress lerp to 1
      stateRef.current.introProgress = Math.min(1, stateRef.current.introProgress + 0.65 * delta);

      const { scrollProgress: sp, selectedProjectId: selId, hoveredProjectId: hovId } = stateRef.current;

      // Morph progress (from 0 = portrait to 1 = vortex)
      const targetMorph = THREE.MathUtils.clamp((sp - 0.003) / 0.045, 0, 1);
      smoothMorph = THREE.MathUtils.lerp(smoothMorph, targetMorph, 1 - Math.exp(-6.5 * delta));

      // Calculate camera flight position along Z
      const aspect = camera.aspect || 1.77;
      let targetCamX = stateRef.current.pointer.x * (selId ? 0.08 : 0.45);
      let targetCamY = stateRef.current.pointer.y * (selId ? 0.06 : 0.3);
      const lastProject = projectsList[projectsList.length - 1];
      const endCamZ = lastProject ? (lastProject.zPosition - 14) : -65;
      let targetCamZ = THREE.MathUtils.lerp(9.5, endCamZ, sp);

      if (selId) {
        const selProject = projectsList.find(p => p.id === selId);
        if (selProject) {
          const isDesktop = aspect >= 1.05;
          const camDist = aspect < 0.75 ? 8.6 : aspect < 1.05 ? 7.2 : 6.15;
          targetCamZ = selProject.zPosition + camDist;

          // Dynamic horizontal offset for laptop/desktop layout:
          // Left drawer takes ~45% width. The center of the remaining 55% is at ~72.5% (+0.225 from screen center).
          const visibleWidth = 2 * camDist * 0.41421356 * aspect;
          const shiftX = isDesktop ? (0.225 * visibleWidth) : 0;

          targetCamX = (aspect < 0.75 ? 0 : selProject.offsetX) - shiftX + stateRef.current.pointer.x * 0.05;
          targetCamY = selProject.offsetY + stateRef.current.pointer.y * 0.05;
        }
      }

      smoothCamZ = THREE.MathUtils.lerp(smoothCamZ, targetCamZ, 1 - Math.exp(-7 * delta));
      smoothCamX = THREE.MathUtils.lerp(smoothCamX, targetCamX, 1 - Math.exp(-5 * delta));
      smoothCamY = THREE.MathUtils.lerp(smoothCamY, targetCamY, 1 - Math.exp(-5 * delta));

      camera.position.set(smoothCamX, smoothCamY, smoothCamZ);

      // Track active project index when flying through tunnel
      if (!selId && sp > 0.035 && onActiveProjectChange) {
        let bestIdx = 0;
        let bestDist = Infinity;
        const inspectDist = aspect < 0.75 ? 8.6 : aspect < 1.05 ? 7.2 : 6.35;
        for (let i = 0; i < projectsList.length; i++) {
          const targetZ = projectsList[i].zPosition + inspectDist;
          const d = Math.abs(camera.position.z - targetZ);
          if (d < bestDist) {
            bestDist = d;
            bestIdx = i;
          }
        }
        onActiveProjectChange(bestIdx);
      }

      // Update particle uniforms
      particleMat.uniforms.uTime.value = elapsedTime;
      particleMat.uniforms.uMorph.value = smoothMorph;
      particleMat.uniforms.uIntro.value = stateRef.current.introProgress;
      particleMat.uniforms.uCameraZ.value = camera.position.z;
      particleMat.uniforms.uDimFactor.value = selId ? 0.35 : 1;
      particleMat.uniforms.uThemeLight.value = smoothThemeLight;
      particleMat.uniforms.uMouseWorld.value.lerp(stateRef.current.mouseWorld, 1 - Math.exp(-10 * delta));

      // Update Signature group
      signature.update(
        elapsedTime,
        stateRef.current.introProgress,
        sp,
        camera.position.z,
        Boolean(selId),
        stateRef.current.pointer,
        smoothThemeLight
      );

      // Update project cards
      cardMeshes.forEach(mesh => {
        const u = mesh.userData;
        const p = u.project;
        const distZ = camera.position.z - p.zPosition;
        const isSel = selId === p.id;
        const hasOtherSel = selId !== null && !isSel;
        const isHov = hovId === p.id;

        let targetOpacity = 0;
        let targetScale = 0.55;

        if (isSel) {
          targetOpacity = 1;
          targetScale = 1.04;
          u.isInteractable = true;
        } else if (sp < 0.02) {
          targetOpacity = 0;
          targetScale = 0.45;
          u.isInteractable = false;
        } else {
          // Card appears in view when camera approaches, fades only after camera passes behind it
          const forwardFactor = 1 - THREE.MathUtils.smoothstep(distZ, 14, 38);
          const approachFactor = THREE.MathUtils.smoothstep(distZ, -0.4, 1.2);
          const scrollFactor = THREE.MathUtils.smoothstep(sp, 0.01, 0.04);

          targetOpacity = forwardFactor * approachFactor * scrollFactor * (hasOtherSel ? 0.08 : 1);
          targetScale = 0.55 + 0.45 * (1 - THREE.MathUtils.clamp((distZ - 5.5) / 22, 0, 1)) + (isHov ? 0.05 : 0);
          if (aspect < 0.75) targetScale *= 0.78;

          u.isInteractable = !hasOtherSel && distZ > (aspect < 0.75 ? 1 : 1.4) && distZ < 24 && targetOpacity > 0.2;
        }

        u.currentOpacity = THREE.MathUtils.lerp(u.currentOpacity, targetOpacity, 1 - Math.exp(-7.5 * delta));
        u.currentScale = THREE.MathUtils.lerp(u.currentScale, targetScale, 1 - Math.exp(-7.5 * delta));
        u.currentHover = THREE.MathUtils.lerp(u.currentHover, isHov ? 1 : 0, 1 - Math.exp(-10 * delta));
        u.currentSelected = THREE.MathUtils.lerp(u.currentSelected, isSel ? 1 : 0, 1 - Math.exp(-8 * delta));

        mesh.visible = u.currentOpacity > 0.012;
        mesh.scale.setScalar(u.currentScale);

        // Gentle floating bob
        const bob = 0.045 * Math.sin(1.1 * elapsedTime + 1.3 * u.index);
        const posX = aspect < 0.75 ? 0 : p.offsetX;
        mesh.position.set(posX, p.offsetY + bob, p.zPosition);

        // 3D Card tilt towards cursor
        const tiltIntensity = isSel ? 0.14 : (isHov ? 0.08 : 0.025);
        const rotY = -stateRef.current.pointer.x * tiltIntensity;
        const rotX = stateRef.current.pointer.y * tiltIntensity * 0.75;
        mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, rotY, 1 - Math.exp(-6 * delta));
        mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, rotX, 1 - Math.exp(-6 * delta));

        // Shader uniforms
        const mat = mesh.material;
        mat.uniforms.uOpacity.value = u.currentOpacity;
        mat.uniforms.uHover.value = u.currentHover;
        mat.uniforms.uSelected.value = u.currentSelected;
        mat.uniforms.uTime.value = elapsedTime;
        mat.uniforms.uThemeLight.value = smoothThemeLight;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-auto z-0 touch-pan-y" style={{ touchAction: 'pan-y' }} />;
}
