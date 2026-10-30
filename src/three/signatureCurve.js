import * as THREE from 'three';

// Vertex shader with 3D mouse parallax and scroll dispersion
const SIGNATURE_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uDisperse;
  varying vec2 vUv;
  varying float vWorldZ;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Disperse outward dynamically when user scrolls down
    if (uDisperse > 0.001) {
      float ang = (uv.x + uv.y) * 6.2831853 + uTime * 0.7;
      vec3 outward = vec3(cos(ang) * 1.8, sin(ang) * 1.4, -1.8) * (uDisperse * 2.8);
      pos += outward;
    }

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldZ = worldPos.z;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Fragment shader rendering user's exact hand-drawn signature with glowing neon-cyan pen stroke
const SIGNATURE_FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform float uDraw;
  uniform float uOpacity;
  uniform float uCameraZ;
  uniform vec3 uColorCore;
  uniform vec3 uColorGlow;
  uniform float uTime;

  varying vec2 vUv;
  varying float vWorldZ;

  void main() {
    // Smooth animated ink stroke reveal from left to right
    float reveal = smoothstep(vUv.x - 0.05, vUv.x, uDraw);
    if (reveal < 0.01) discard;

    vec4 tex = texture2D(uTexture, vUv);
    if (tex.a < 0.02) discard;

    // Luminous glowing pen nib traveling at the head of the draw line
    float nibDist = abs(vUv.x - uDraw);
    float nibGlow = (1.0 - smoothstep(0.0, 0.065, nibDist)) * step(vUv.x, uDraw);

    // Subtle moving wave shimmer along the signature lines
    float sheen = sin(vUv.x * 9.0 - uTime * 2.2) * 0.5 + 0.5;

    // Blend between pure brilliant white core and ice-cyan neon rim
    vec3 color = mix(uColorCore, uColorGlow, nibGlow * 0.85 + sheen * 0.25);

    // Fade smoothly behind camera as user flies forward
    float behindFade = smoothstep(0.4, 2.5, uCameraZ - vWorldZ);
    float alpha = tex.a * reveal * uOpacity * behindFade;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function createSignatureGroup() {
  const group = new THREE.Group();
  // Enlarge and position behind the 3D particle portrait
  // Positioned so the left loop sweeps out gracefully on the left, the underline sweeps below the chest, and the right loop rises on the right
  group.position.set(-0.12, 0.18, -0.22);

  // Load user's authentic signature texture (transparent white ink) with cache-buster
  const loader = new THREE.TextureLoader();
  const signatureTex = loader.load('/signature.png?t=' + Date.now());
  signatureTex.colorSpace = THREE.SRGBColorSpace;
  signatureTex.generateMipmaps = true;
  signatureTex.minFilter = THREE.LinearMipmapLinearFilter;
  signatureTex.magFilter = THREE.LinearFilter;

  // Aspect ratio of the signature: 973 x 639 (~1.52269)
  // Scaled down to 7.2 units so the signature frames the silhouette softly without overpowering the face
  const planeWidth = 7.2;
  const planeHeight = planeWidth / (973 / 639); // ~4.73

  const planeGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);
  const planeMat = new THREE.ShaderMaterial({
    vertexShader: SIGNATURE_VERTEX_SHADER,
    fragmentShader: SIGNATURE_FRAGMENT_SHADER,
    uniforms: {
      uTexture: { value: signatureTex },
      uTime: { value: 0 },
      uDraw: { value: 0 },
      uDisperse: { value: 0 },
      uOpacity: { value: 0.72 },
      uCameraZ: { value: 9.5 },
      uColorCore: { value: new THREE.Color('#FFFFFF') },
      uColorGlow: { value: new THREE.Color('#38BDF8') }
    },
    transparent: true,
    depthWrite: false
  });

  const planeMesh = new THREE.Mesh(planeGeo, planeMat);
  planeMesh.frustumCulled = false;
  group.add(planeMesh);

  return {
    group,
    update: (time, introProgress, scrollProgress, cameraZ, isProjectSelected, pointer) => {
      // 3D Parallax tilt tracking mouse
      const targetRotY = pointer.x * 0.055;
      const targetRotX = -pointer.y * 0.038;
      group.rotation.y += (targetRotY - group.rotation.y) * 0.08;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.08;

      const disperse = Math.min(1, Math.max(0, scrollProgress / 0.03));
      const fadeOut = Math.max(0, 1 - scrollProgress / 0.03);
      const dimFactor = isProjectSelected ? 0.2 : 1;

      // Update shader uniforms
      planeMat.uniforms.uTime.value = time;
      planeMat.uniforms.uDraw.value = Math.min(1.05, introProgress * 1.08);
      planeMat.uniforms.uDisperse.value = disperse;
      planeMat.uniforms.uCameraZ.value = cameraZ;
      planeMat.uniforms.uOpacity.value = 0.72 * fadeOut * dimFactor;
      planeMesh.visible = fadeOut > 0.005;
    }
  };
}
