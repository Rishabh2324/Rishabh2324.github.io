import * as THREE from "three";
import { gsap, scrollVelocity } from "../motion";
import { intro, sceneState } from "./state";

/* Ashima Arts / Stefan Gustavson 3D simplex noise (MIT). */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

/* Violet → cyan → lime → coral loop, shared by the orb and its halo. */
const RAMP = /* glsl */ `
vec3 ramp(float t){
  t=fract(t)*4.0;
  vec3 c0=vec3(0.545,0.424,1.0);
  vec3 c1=vec3(0.302,0.882,1.0);
  vec3 c2=vec3(0.784,1.0,0.302);
  vec3 c3=vec3(1.0,0.420,0.290);
  vec3 c=mix(c0,c1,smoothstep(0.0,1.0,t));
  c=mix(c,c2,smoothstep(1.0,2.0,t));
  c=mix(c,c3,smoothstep(2.0,3.0,t));
  return mix(c,c0,smoothstep(3.0,4.0,t));
}
`;

const orbVertex = /* glsl */ `
uniform float uTime;
uniform float uDistort;
uniform float uFreq;
uniform vec3 uMouse;
uniform float uMouseForce;
varying vec3 vViewPos;
varying vec3 vDir;
varying float vNoise;
${NOISE}
void main(){
  vec3 n=normalize(position);
  float t=uTime;
  float n1=snoise(n*uFreq+vec3(t*0.18,t*0.12,t*0.15));
  float n2=snoise(n*uFreq*2.2+vec3(-t*0.21,t*0.26,t*0.07));
  float bulge=pow(max(dot(n,uMouse),0.0),5.0)*uMouseForce;
  float d=n1*uDistort+n2*uDistort*0.12+bulge;
  vNoise=n1;
  vDir=n;
  vec4 mv=modelViewMatrix*vec4(position+n*d,1.0);
  vViewPos=mv.xyz;
  gl_Position=projectionMatrix*mv;
}
`;

const orbFragment = /* glsl */ `
uniform float uTime;
uniform float uHue;
uniform float uIntensity;
varying vec3 vViewPos;
varying vec3 vDir;
varying float vNoise;
${RAMP}
void main(){
  vec3 n=normalize(cross(dFdx(vViewPos),dFdy(vViewPos)));
  vec3 v=normalize(-vViewPos);
  float ndv=clamp(dot(n,v),0.0,1.0);
  float fres=pow(1.0-ndv,2.0);
  vec3 irid=ramp(uHue+fres*0.5+vNoise*0.2+vDir.y*0.12+uTime*0.012);
  vec3 col=mix(vec3(0.024,0.024,0.034)+irid*0.07,irid*0.95,smoothstep(0.0,0.95,fres));
  // Soft key light from the smooth base direction (derivative normals are faceted).
  float key=pow(max(dot(vDir,normalize(vec3(-0.5,0.65,0.55))),0.0),6.0);
  col+=key*(0.1+irid*0.18);
  float stripe=fract(vNoise*3.5+uTime*0.04);
  col+=irid*(smoothstep(0.46,0.5,stripe)-smoothstep(0.5,0.54,stripe))*0.08;
  gl_FragColor=vec4(col,uIntensity);
}
`;

const haloVertex = /* glsl */ `
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
`;

const haloFragment = /* glsl */ `
uniform float uTime;
uniform float uHue;
uniform float uIntensity;
varying vec2 vUv;
${RAMP}
void main(){
  float d=length(vUv-0.5)*2.0;
  float a=pow(smoothstep(1.0,0.0,d),2.4)*0.32*uIntensity;
  gl_FragColor=vec4(ramp(uHue+0.1+uTime*0.01)*a,a);
}
`;

const pointsVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
varying float vAlpha;
void main(){
  vec3 p=position;
  p.y+=sin(uTime*0.25+position.x*0.6)*0.12;
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  gl_PointSize=28.0*aScale*uPixelRatio/-mv.z;
  vAlpha=smoothstep(22.0,5.0,-mv.z)*(0.35+0.65*aScale);
  gl_Position=projectionMatrix*mv;
}
`;

const pointsFragment = /* glsl */ `
varying float vAlpha;
void main(){
  float a=smoothstep(0.5,0.05,length(gl_PointCoord-0.5))*vAlpha*0.6;
  gl_FragColor=vec4(0.95,0.94,0.9,a);
}
`;

export interface SceneHandle {
  destroy(): void;
}

export function createScene(canvas: HTMLCanvasElement, opts: { reduced: boolean }): SceneHandle {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !coarse,
    alpha: false,
    powerPreference: "high-performance",
  });
  const pixelRatio = Math.min(window.devicePixelRatio, coarse ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x060608, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
  camera.position.set(0, 0, 6.5);

  /* Orb ------------------------------------------------------------------ */
  const orbUniforms = {
    uTime: { value: 0 },
    uDistort: { value: sceneState.distort },
    uFreq: { value: 0.95 },
    uMouse: { value: new THREE.Vector3(0, 0, 1) },
    uMouseForce: { value: 0 },
    uHue: { value: 0 },
    uIntensity: { value: 0 },
  };
  const orb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, coarse ? 32 : 72),
    new THREE.ShaderMaterial({
      vertexShader: orbVertex,
      fragmentShader: orbFragment,
      uniforms: orbUniforms,
      transparent: true,
    }),
  );
  orb.renderOrder = 2;

  const haloUniforms = { uTime: orbUniforms.uTime, uHue: orbUniforms.uHue, uIntensity: { value: 0 } };
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(6.5, 6.5),
    new THREE.ShaderMaterial({
      vertexShader: haloVertex,
      fragmentShader: haloFragment,
      uniforms: haloUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  halo.position.z = -1.2;
  halo.renderOrder = 1;

  const orbGroup = new THREE.Group();
  orbGroup.add(halo, orb);
  scene.add(orbGroup);

  /* Particle field --------------------------------------------------------- */
  const count = coarse ? 700 : 1800;
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = -Math.random() * 14 + 2;
    scales[i] = Math.random();
  }
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pointsGeo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  const pointsUniforms = { uTime: orbUniforms.uTime, uPixelRatio: { value: pixelRatio } };
  const points = new THREE.Points(
    pointsGeo,
    new THREE.ShaderMaterial({
      vertexShader: pointsVertex,
      fragmentShader: pointsFragment,
      uniforms: pointsUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(points);

  /* Sizing ------------------------------------------------------------------ */
  let width = 0;
  let height = 0;
  let halfH = 1;
  let halfW = 1;
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Ignore the mobile URL-bar show/hide jitter.
    if (coarse && w === width && Math.abs(h - height) < 140) return;
    width = w;
    height = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    halfW = halfH * camera.aspect;
  };
  resize();
  window.addEventListener("resize", resize);

  /* Pointer ------------------------------------------------------------------ */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, speed: 0 };
  const onPointer = (e: PointerEvent) => {
    const nx = (e.clientX / width) * 2 - 1;
    const ny = -(e.clientY / height) * 2 + 1;
    pointer.speed = Math.min(pointer.speed + Math.hypot(nx - pointer.tx, ny - pointer.ty) * 0.6, 0.4);
    pointer.tx = nx;
    pointer.ty = ny;
  };
  if (!opts.reduced) window.addEventListener("pointermove", onPointer, { passive: true });

  /* Loop ------------------------------------------------------------------- */
  const live = { x: sceneState.x, y: sceneState.y, scale: 0.001, distort: sceneState.distort, boost: 0 };
  const mouseWorld = new THREE.Vector3();
  const invQuat = new THREE.Quaternion();
  const tmp = new THREE.Vector3();
  let elapsed = 0;

  const tick = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs / 1000, 1 / 20);
    elapsed += dt * (opts.reduced ? 0.15 : 1);
    const k = 1 - Math.exp(-dt * 6);

    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;
    pointer.speed *= 0.94;

    // Narrow screens keep the orb centred and lifted behind the type.
    const portrait = camera.aspect < 0.9;
    const targetX = sceneState.x * halfW * (portrait ? 0.15 : 1);
    const targetY = sceneState.y * halfH + (portrait ? halfH * 0.18 : 0);
    const targetScale = sceneState.scale * intro.reveal * (portrait ? 0.78 : 1);
    live.x += (targetX - live.x) * k;
    live.y += (targetY - live.y) * k;
    live.scale += (targetScale - live.scale) * k;

    const velocity = Math.min(Math.abs(scrollVelocity()) * 0.012, 0.3);
    live.boost += (velocity + pointer.speed - live.boost) * k;
    live.distort += (sceneState.distort + intro.wobble + live.boost - live.distort) * k;

    orbGroup.position.set(live.x, live.y, 0);
    orbGroup.scale.setScalar(Math.max(live.scale, 0.001));
    orb.rotation.y += dt * 0.09;
    orb.rotation.x = Math.sin(elapsed * 0.12) * 0.25;

    // Bulge the orb toward the cursor, strongest when it is close.
    mouseWorld.set(pointer.x * halfW, pointer.y * halfH, 0);
    tmp.copy(mouseWorld).sub(orbGroup.position);
    const dist = tmp.length() / Math.max(live.scale, 0.2);
    tmp.z = 1.4;
    tmp.normalize();
    invQuat.copy(orb.quaternion).invert();
    orbUniforms.uMouse.value.copy(tmp.applyQuaternion(invQuat));
    orbUniforms.uMouseForce.value += ((1 - THREE.MathUtils.smoothstep(dist, 0.4, 3)) * 0.32 - orbUniforms.uMouseForce.value) * k;

    orbUniforms.uTime.value = elapsed;
    orbUniforms.uDistort.value = live.distort;
    orbUniforms.uHue.value += (sceneState.hue - orbUniforms.uHue.value) * k;
    orbUniforms.uIntensity.value += (sceneState.intensity * intro.reveal - orbUniforms.uIntensity.value) * k;
    haloUniforms.uIntensity.value = orbUniforms.uIntensity.value;
    orb.visible = halo.visible = orbUniforms.uIntensity.value > 0.005;

    camera.position.x += (pointer.x * 0.3 - camera.position.x) * k * 0.5;
    camera.position.y += (pointer.y * 0.2 - camera.position.y) * k * 0.5;
    camera.lookAt(0, 0, 0);

    points.rotation.y = elapsed * 0.012;
    points.position.y = (window.scrollY / height) * 1.1;

    renderer.render(scene, camera);
  };

  renderer.compile(scene, camera);
  gsap.ticker.add(tick);

  return {
    destroy() {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      renderer.dispose();
    },
  };
}
