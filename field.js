/* =================================================================
   NOVA / 7  —  cinematic particle field
   Three.js · holographic substrate
   ================================================================= */

import * as THREE from 'three';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('bgfx');
const dpr = Math.min(window.devicePixelRatio || 1, 1.8);

const renderer = new THREE.WebGLRenderer({
  canvas, antialias: false, alpha: true, powerPreference: 'high-performance',
});
renderer.setPixelRatio(dpr);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
camera.position.set(0, 0, 14);

/* ── helper: build a soft circular sprite texture ────────────── */
function makeDot(size = 64) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  g.addColorStop(0,    'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.18)');
  g.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,size,size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const dotTex = makeDot();

/* ── 1 · primary luminous particle field ─────────────────────── */
const PARTICLES = reduced ? 6000 : 24576;
const positions = new Float32Array(PARTICLES * 3);
const colors    = new Float32Array(PARTICLES * 3);
const seeds     = new Float32Array(PARTICLES);

const palette = [
  new THREE.Color('#9be7ff'),
  new THREE.Color('#7c5cff'),
  new THREE.Color('#22d3ee'),
  new THREE.Color('#ff5cf0'),
  new THREE.Color('#ffd166'),
];

for (let i = 0; i < PARTICLES; i++) {
  // distribute on a spherical shell with falloff toward center
  const r = 6 + Math.pow(Math.random(), 1.6) * 28;
  const theta = Math.random() * Math.PI * 2;
  const phi   = Math.acos(2 * Math.random() - 1);
  positions[i*3 + 0] = r * Math.sin(phi) * Math.cos(theta);
  positions[i*3 + 1] = r * Math.cos(phi) * 0.55;
  positions[i*3 + 2] = r * Math.sin(phi) * Math.sin(theta);

  const c = palette[(Math.random() * palette.length) | 0];
  colors[i*3+0] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
  seeds[i] = Math.random();
}

const geom = new THREE.BufferGeometry();
geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geom.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
geom.setAttribute('seed',     new THREE.BufferAttribute(seeds, 1));

const fieldMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime:     { value: 0 },
    uTex:      { value: dotTex },
    uScroll:   { value: 0 },
    uPointer:  { value: new THREE.Vector2(0, 0) },
    uSize:     { value: 1.0 * dpr },
  },
  vertexShader: /* glsl */`
    attribute float seed;
    varying vec3 vColor;
    varying float vAlpha;
    uniform float uTime;
    uniform float uScroll;
    uniform vec2  uPointer;
    uniform float uSize;

    // hash-noise so each particle wobbles uniquely
    float hash(float n){ return fract(sin(n)*43758.5453); }

    void main(){
      vColor = color;
      vec3 p = position;

      // breathing motion — slow per-particle phase
      float t = uTime * 0.25;
      float s = seed * 6.28318;
      p.x += sin(t + s) * 0.45;
      p.y += cos(t * 0.7 + s * 1.3) * 0.55 + uScroll * (0.5 - seed) * 8.0;
      p.z += sin(t * 0.5 + s * 0.6) * 0.45;

      // gentle attraction toward pointer (in screen-aligned space)
      vec2 pull = uPointer * 3.0;
      p.x += pull.x * (0.05 + 0.15 * seed);
      p.y += pull.y * (0.05 + 0.15 * seed);

      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      float d = -mv.z;

      // distance-based fade and depth scaling
      vAlpha = smoothstep(40.0, 8.0, d) * (0.45 + 0.55 * seed);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = uSize * (140.0 / d) * (0.4 + seed * 1.4);
    }
  `,
  fragmentShader: /* glsl */`
    varying vec3 vColor;
    varying float vAlpha;
    uniform sampler2D uTex;
    void main(){
      vec4 t = texture2D(uTex, gl_PointCoord);
      gl_FragColor = vec4(vColor, t.a * vAlpha);
      if (gl_FragColor.a < 0.005) discard;
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

const field = new THREE.Points(geom, fieldMat);
scene.add(field);

/* ── 2 · faraway dust plane ─────────────────────────────────── */
const DUST = reduced ? 1500 : 5000;
const dustPos = new Float32Array(DUST * 3);
const dustCol = new Float32Array(DUST * 3);
for (let i = 0; i < DUST; i++) {
  dustPos[i*3+0] = (Math.random() - .5) * 90;
  dustPos[i*3+1] = (Math.random() - .5) * 90;
  dustPos[i*3+2] = -25 - Math.random() * 25;
  const c = palette[(Math.random() * palette.length) | 0];
  dustCol[i*3+0] = c.r * 0.6; dustCol[i*3+1] = c.g * 0.6; dustCol[i*3+2] = c.b * 0.6;
}
const dustGeom = new THREE.BufferGeometry();
dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
dustGeom.setAttribute('color',    new THREE.BufferAttribute(dustCol, 3));
const dustMat = new THREE.PointsMaterial({
  map: dotTex,
  size: 0.18 * dpr,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
  opacity: 0.55,
});
const dust = new THREE.Points(dustGeom, dustMat);
scene.add(dust);

/* ── 3 · floating wire-icosahedron core ─────────────────────── */
const ico = new THREE.LineSegments(
  new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(3.2, 1)),
  new THREE.LineBasicMaterial({
    color: 0x9be7ff,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
);
ico.position.set(0, 0, 0);
scene.add(ico);

const ico2 = new THREE.LineSegments(
  new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(5.2, 0)),
  new THREE.LineBasicMaterial({
    color: 0x7c5cff,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
);
scene.add(ico2);

/* ── 4 · ambient glow ring (sprite) ─────────────────────────── */
const glow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: dotTex,
  color: 0x7c5cff,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  opacity: 0.65,
}));
glow.scale.set(22, 22, 1);
glow.position.z = -2;
scene.add(glow);

/* ── pointer + scroll signals ───────────────────────────────── */
const pointer = new THREE.Vector2(0, 0);
const pointerSmooth = new THREE.Vector2(0, 0);
let scrollY = 0, scrollSmooth = 0;

window.addEventListener('pointermove', (e) => {
  pointer.x =  (e.clientX / window.innerWidth)  * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
}, { passive: true });

window.addEventListener('scroll', () => {
  scrollY = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
}, { passive: true });

/* ── resize ─────────────────────────────────────────────────── */
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

/* ── telemetry hooks (consumed by ui.js) ─────────────────────── */
window.__nova = {
  fps: 0,
  flux: 0,
  particles: PARTICLES,
  pointer: pointerSmooth,
};

/* ── animation loop ─────────────────────────────────────────── */
const clock = new THREE.Clock();
let fpsAcc = 0, fpsFrames = 0, fpsTime = 0;

function tick() {
  const t = clock.getElapsedTime();
  const dt = clock.getDelta();

  // smooth pointer + scroll
  pointerSmooth.x += (pointer.x - pointerSmooth.x) * 0.05;
  pointerSmooth.y += (pointer.y - pointerSmooth.y) * 0.05;
  scrollSmooth   += (scrollY - scrollSmooth) * 0.05;

  // camera drift (parallax)
  camera.position.x = pointerSmooth.x * 1.2;
  camera.position.y = pointerSmooth.y * 0.8 - scrollSmooth * 2.0;
  camera.position.z = 14 - scrollSmooth * 3.0;
  camera.lookAt(0, 0, 0);

  // field uniforms
  fieldMat.uniforms.uTime.value    = t;
  fieldMat.uniforms.uScroll.value  = scrollSmooth;
  fieldMat.uniforms.uPointer.value.copy(pointerSmooth);

  // wireframe icosahedra slow rotate
  ico.rotation.x  =  t * 0.08;
  ico.rotation.y  =  t * 0.11;
  ico2.rotation.x = -t * 0.05;
  ico2.rotation.y =  t * 0.07;

  // glow pulse
  const pulse = 1 + Math.sin(t * 0.9) * 0.08;
  glow.scale.set(22 * pulse, 22 * pulse, 1);

  // dust gentle drift
  dust.rotation.y = t * 0.01;

  renderer.render(scene, camera);

  // telemetry
  fpsAcc += dt; fpsFrames++; fpsTime += dt;
  if (fpsTime > 0.5) {
    window.__nova.fps = Math.round(fpsFrames / fpsAcc);
    window.__nova.flux = Math.abs(pointerSmooth.x) + Math.abs(pointerSmooth.y) + scrollSmooth;
    fpsAcc = 0; fpsFrames = 0; fpsTime = 0;
  }

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
