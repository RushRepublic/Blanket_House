"use client";

import { useEffect, useRef } from "react";

/*
  Realistic mist over the whole site, built as a small smoke (fluid) simulation on the GPU.

  - The mist is a density field that is carried by a velocity field, like real fog in moving air.
  - Moving the cursor (or a finger) pushes the air: the mist parts, swirls and curls behind it,
    then slowly drifts back in.
  - Scrolling lifts the mist gently upwards with the page.
  - Left alone, the mist keeps rolling on its own, drawn back towards a slowly drifting cloud shape.

  The simulation runs at low resolution and is stretched to the screen, so it costs little.
  Without WebGL2 the page simply has no mist; visitors who reduce motion get one still frame.
*/

// How dense the mist is while each section fills the middle of the screen (0 = none, 1 = thick).
const DENSITY: [string, number][] = [
  [".hero", 0.95],
  [".intro", 0.6],
  [".lands", 0.5],
  [".exp", 0.55],
  [".stays", 0.5],
  [".moments", 0.3],
  [".dest", 0.65],
  [".journey", 0.75],
  [".offers", 0.4],
  [".journal", 0.7],
  [".resp", 0.6],
  [".reviews", 0.85],
  [".map", 0.35],
  [".plan", 0.75],
  [".footer", 0.25],
];

const VERT = `#version 300 es
in vec2 aPos;
uniform vec2 uTexel;
out vec2 vUv, vL, vR, vT, vB;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0);
  vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y);
  vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv, vL, vR, vT, vB;
out vec4 o;
`;

const NOISE = `
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p, int oct) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) { if (i >= oct) break; v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}`;

// Cursor push added to the air.
const FORCE = `${HEAD}
uniform sampler2D uVel;
uniform vec2 uPoint, uForce, uWind;
uniform float uRadius, uAspect;
void main() {
  vec2 d = vUv - uPoint; d.x *= uAspect;
  float g = exp(-dot(d, d) / uRadius);
  o = vec4(texture(uVel, vUv).xy + uForce * g + uWind, 0.0, 1.0);
}`;

const CURL = `${HEAD}
uniform sampler2D uVel;
void main() {
  float L = texture(uVel, vL).y, R = texture(uVel, vR).y, T = texture(uVel, vT).x, B = texture(uVel, vB).x;
  o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`;

// Vorticity confinement keeps the small swirls alive, which is what makes it read as smoke.
const VORTICITY = `${HEAD}
uniform sampler2D uVel, uCurl;
uniform float uCurlStrength, uDt;
void main() {
  float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x, T = texture(uCurl, vT).x, B = texture(uCurl, vB).x, C = texture(uCurl, vUv).x;
  vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  f /= length(f) + 0.0001;
  f *= uCurlStrength * C; f.y *= -1.0;
  vec2 v = texture(uVel, vUv).xy + f * uDt;
  o = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
}`;

const DIVERGENCE = `${HEAD}
uniform sampler2D uVel;
void main() {
  vec2 C = texture(uVel, vUv).xy;
  float L = texture(uVel, vL).x, R = texture(uVel, vR).x, T = texture(uVel, vT).y, B = texture(uVel, vB).y;
  if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x; if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

const PRESSURE = `${HEAD}
uniform sampler2D uPressure, uDiv;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  o = vec4((L + R + B + T - texture(uDiv, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`;

const GRADIENT = `${HEAD}
uniform sampler2D uPressure, uVel;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  o = vec4(texture(uVel, vUv).xy - vec2(R - L, T - B), 0.0, 1.0);
}`;

const ADVECT_VEL = `${HEAD}
uniform sampler2D uVel;
uniform vec2 uVelTexel;
uniform float uDt, uDissipation;
void main() {
  vec2 coord = vUv - uDt * texture(uVel, vUv).xy * uVelTexel;
  o = vec4(texture(uVel, coord).xy / (1.0 + uDissipation * uDt), 0.0, 1.0);
}`;

// The mist itself: carried by the air, thinned a little in the cursor's wake,
// and slowly drawn back towards a rolling cloud shape so it always refills.
const ADVECT_MIST = `${HEAD}
uniform sampler2D uVel, uMist;
uniform vec2 uVelTexel, uPoint;
uniform float uDt, uRelax, uTime, uAspect, uRadius, uClear;
uniform vec2 uDrift;   // how far the wind has carried the air so far
uniform vec2 uBreeze;  // wind speed, in screen widths/heights per second
${NOISE}
float cloud(vec2 uv) {
  // Stretch the noise sideways so the mist forms long horizontal banks instead of round blobs.
  vec2 stretch = vec2(uAspect * 0.55, 1.35);
  // Far bank: broad and slow, travelling at half the wind speed (it is further away).
  vec2 pf = (uv - uDrift * 0.5) * stretch * 0.85;
  vec2 qf = vec2(fbm(pf + vec2(0.0, uTime * 0.006), 3), fbm(pf + vec2(5.2, 1.3) - uTime * 0.005, 3));
  float far = fbm(pf + 1.1 * qf, 4);
  // Near wisps: finer, carried at full wind speed, curling slowly as they go.
  vec2 pn = (uv - uDrift) * stretch * 1.9;
  vec2 qn = vec2(fbm(pn + vec2(1.7, uTime * 0.014), 3), fbm(pn + vec2(8.3, 2.8) - uTime * 0.012, 3));
  float near = fbm(pn + 1.3 * qn, 5);
  // Wide, soft threshold: gentle gradients rather than hard-edged patches.
  return smoothstep(0.3, 0.92, far * 0.6 + near * 0.45);
}
void main() {
  vec2 coord = vUv - uDt * (texture(uVel, vUv).xy * uVelTexel + uBreeze);
  // Mist blowing in from off-screen is fresh cloud, so the wind never leaves an empty edge.
  bool outside = coord.x < 0.0 || coord.x > 1.0 || coord.y < 0.0 || coord.y > 1.0;
  float m = outside ? cloud(coord) : texture(uMist, coord).x;
  m = mix(m, cloud(vUv), uRelax);
  vec2 d = vUv - uPoint; d.x *= uAspect;
  m *= 1.0 - uClear * exp(-dot(d, d) / uRadius);
  o = vec4(clamp(m, 0.0, 1.0), 0.0, 0.0, 1.0);
}`;

// Final look: soft white mist with fine wisps, heavier at the top and bottom of the screen.
const DISPLAY = `${HEAD}
uniform sampler2D uMist;
uniform float uDensity, uStrength, uTime, uAspect;
uniform vec2 uDrift;
${NOISE}
void main() {
  float m = texture(uMist, vUv).x;
  float wisps = fbm((vUv - uDrift * 1.1) * vec2(uAspect * 0.45, 1.6) * 6.0 + vec2(0.0, -uTime * 0.008), 3);
  m *= 0.82 + 0.36 * wisps;
  float middle = smoothstep(0.0, 0.3, vUv.y) * (1.0 - smoothstep(0.72, 1.0, vUv.y));
  float a = clamp(m * uDensity * mix(1.0, 0.55, middle) * uStrength, 0.0, 0.4);
  o = vec4(vec3(0.93, 0.95, 0.92) * a, a);
}`;

type Target = { tex: WebGLTexture; fb: WebGLFramebuffer; w: number; h: number };
type Double = { read: Target; write: Target; swap: () => void };

export default function MistLayer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) return;
    // Floating-point render targets are needed for the air to move smoothly.
    if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 900px)").matches;
    const SIM = small ? 64 : 128; // air resolution (short side)
    const MIST = small ? 160 : 288; // mist resolution (short side)
    const DISPLAY_SCALE = small ? 0.35 : 0.5;
    const PRESSURE_STEPS = small ? 10 : 18;
    const STRENGTH = small ? 0.24 : 0.36;

    /* ---------- WebGL helpers ---------- */
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
      return s;
    };
    const vert = compile(gl.VERTEX_SHADER, VERT);
    const program = (src: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, vert);
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, src));
      gl.bindAttribLocation(p, 0, "aPos");
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link");
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const name = gl.getActiveUniform(p, i)!.name;
        uniforms[name] = gl.getUniformLocation(p, name);
      }
      return { p, u: uniforms };
    };

    let progs: Record<string, ReturnType<typeof program>>;
    try {
      progs = {
        force: program(FORCE),
        curl: program(CURL),
        vorticity: program(VORTICITY),
        divergence: program(DIVERGENCE),
        pressure: program(PRESSURE),
        gradient: program(GRADIENT),
        advectVel: program(ADVECT_VEL),
        advectMist: program(ADVECT_MIST),
        display: program(DISPLAY),
      };
    } catch {
      return; // shaders not supported on this device: no mist
    }

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const target = (w: number, h: number): Target => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fb, w, h };
    };
    const double = (w: number, h: number): Double => {
      const d = {
        read: target(w, h),
        write: target(w, h),
        swap() {
          const t = d.read;
          d.read = d.write;
          d.write = t;
        },
      };
      return d;
    };
    const size = (short: number) => {
      const aspect = window.innerWidth / window.innerHeight;
      return aspect >= 1 ? [Math.round(short * aspect), short] : [short, Math.round(short / aspect)];
    };

    let vel: Double, mist: Double, pressure: Double, div: Target, curl: Target;
    let aspect = 1;
    const build = () => {
      aspect = window.innerWidth / window.innerHeight;
      const [sw, sh] = size(SIM);
      const [mw, mh] = size(MIST);
      vel = double(sw, sh);
      pressure = double(sw, sh);
      div = target(sw, sh);
      curl = target(sw, sh);
      mist = double(mw, mh);
      canvas.width = Math.max(1, Math.round(window.innerWidth * DISPLAY_SCALE));
      canvas.height = Math.max(1, Math.round(window.innerHeight * DISPLAY_SCALE));
    };
    build();

    const bindProgram = (name: string, texelOf: { w: number; h: number }) => {
      const pr = progs[name];
      gl.useProgram(pr.p);
      gl.uniform2f(pr.u.uTexel, 1 / texelOf.w, 1 / texelOf.h);
      return pr.u;
    };
    let unit = 0;
    const tex = (loc: WebGLUniformLocation | null, t: Target) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.uniform1i(loc, unit++);
    };
    const draw = (out: Target | null) => {
      if (out) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, out.fb);
        gl.viewport(0, 0, out.w, out.h);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      unit = 0;
    };

    /* ---------- Input: cursor, touch, scroll ---------- */
    const pointer = { x: 0.5, y: 0.5, dx: 0, dy: 0, moved: false, ready: false };
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      if (pointer.ready) {
        pointer.dx += x - pointer.x;
        pointer.dy += y - pointer.y;
        pointer.moved = true;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.ready = true;
    };
    const onLeave = () => (pointer.ready = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let lastScroll = window.scrollY;

    const targetDensity = () => {
      const mid = window.innerHeight / 2;
      for (const [sel, d] of DENSITY) {
        for (const el of document.querySelectorAll<HTMLElement>(sel)) {
          const r = el.getBoundingClientRect();
          if (r.top <= mid && r.bottom >= mid) return d;
        }
      }
      return 0.4;
    };
    let density = targetDensity();

    const onResize = () => build();
    window.addEventListener("resize", onResize);

    /* ---------- One simulation step ---------- */
    const start = performance.now();
    // Wind in screen-widths per second; gusts come and go on slow, overlapping rhythms.
    const drift = { x: 0, y: 0 };
    let scrollSpeed = 0; // pixels per second, smoothed
    const breezeAt = (t: number) => ({
      x: 0.022 * (1 + 0.45 * Math.sin(t * 0.11) + 0.25 * Math.sin(t * 0.37 + 1.3)),
      y: 0.004 * Math.sin(t * 0.07 + 0.6),
    });

    const step = (dt: number, time: number, relax: number) => {
      const breeze = breezeAt(time);
      drift.x += breeze.x * dt;
      drift.y += breeze.y * dt;
      gl.disable(gl.BLEND);

      // 1. Cursor push and scroll lift.
      const scroll = window.scrollY;
      const scrollDelta = scroll - lastScroll;
      lastScroll = scroll;
      let u = bindProgram("force", vel.read);
      tex(u.uVel, vel.read);
      gl.uniform2f(u.uPoint, pointer.x, pointer.y);
      gl.uniform2f(u.uForce, pointer.moved ? pointer.dx * 1800 : 0, pointer.moved ? pointer.dy * 1800 : 0);
      gl.uniform2f(u.uWind, 0, 0);
      scrollSpeed += (scrollDelta / Math.max(dt, 0.001) - scrollSpeed) * 0.12;
      const lift = Math.max(-0.25, Math.min(0.25, (scrollSpeed / window.innerHeight) * 0.22));
      drift.y += lift * dt; // keep the cloud shape moving with the lifted mist
      gl.uniform1f(u.uRadius, small ? 0.012 : 0.008);
      gl.uniform1f(u.uAspect, aspect);
      draw(vel.write);
      vel.swap();

      // 2. Keep the swirls alive.
      u = bindProgram("curl", vel.read);
      tex(u.uVel, vel.read);
      draw(curl);
      u = bindProgram("vorticity", vel.read);
      tex(u.uVel, vel.read);
      tex(u.uCurl, curl);
      gl.uniform1f(u.uCurlStrength, 6);
      gl.uniform1f(u.uDt, dt);
      draw(vel.write);
      vel.swap();

      // 3. Make the air incompressible so it flows around itself instead of piling up.
      u = bindProgram("divergence", vel.read);
      tex(u.uVel, vel.read);
      draw(div);
      for (let i = 0; i < PRESSURE_STEPS; i++) {
        u = bindProgram("pressure", vel.read);
        tex(u.uPressure, pressure.read);
        tex(u.uDiv, div);
        draw(pressure.write);
        pressure.swap();
      }
      u = bindProgram("gradient", vel.read);
      tex(u.uPressure, pressure.read);
      tex(u.uVel, vel.read);
      draw(vel.write);
      vel.swap();

      // 4. Move the air along itself; it slowly calms down.
      u = bindProgram("advectVel", vel.read);
      tex(u.uVel, vel.read);
      gl.uniform2f(u.uVelTexel, 1 / vel.read.w, 1 / vel.read.h);
      gl.uniform1f(u.uDt, dt);
      gl.uniform1f(u.uDissipation, 1.6);
      draw(vel.write);
      vel.swap();

      // 5. Carry the mist with the air, then let it drift back towards the cloud shape.
      u = bindProgram("advectMist", mist.read);
      tex(u.uVel, vel.read);
      tex(u.uMist, mist.read);
      gl.uniform2f(u.uVelTexel, 1 / vel.read.w, 1 / vel.read.h);
      gl.uniform2f(u.uPoint, pointer.x, pointer.y);
      gl.uniform1f(u.uDt, dt);
      gl.uniform1f(u.uRelax, relax);
      gl.uniform1f(u.uTime, time);
      gl.uniform2f(u.uDrift, drift.x, drift.y);
      gl.uniform1f(u.uAspect, aspect);
      gl.uniform1f(u.uRadius, small ? 0.004 : 0.0022);
      gl.uniform1f(u.uClear, pointer.moved ? Math.min(0.04, Math.hypot(pointer.dx, pointer.dy) * 1.5) : 0);
      gl.uniform2f(u.uBreeze, breeze.x, breeze.y + lift);
      draw(mist.write);
      mist.swap();

      pointer.dx = 0;
      pointer.dy = 0;
      pointer.moved = false;
    };

    const render = (time: number) => {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ZERO);
      const u = bindProgram("display", mist.read);
      tex(u.uMist, mist.read);
      gl.uniform1f(u.uDensity, density);
      gl.uniform1f(u.uStrength, STRENGTH);
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uAspect, aspect);
      gl.uniform2f(u.uDrift, drift.x, drift.y);
      gl.clearColor(0, 0, 0, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clear(gl.COLOR_BUFFER_BIT);
      draw(null);
    };

    // Fill the screen with mist straight away.
    step(0.016, 0, 1);

    if (reduced) {
      const still = () => {
        density = targetDensity() * 0.6;
        render(10);
      };
      still();
      window.addEventListener("scroll", still, { passive: true });
      return () => {
        window.removeEventListener("scroll", still);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("resize", onResize);
      };
    }

    let raf = 0;
    let last = performance.now();
    const minFrame = small ? 1000 / 30 : 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < minFrame) return;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const time = (now - start) / 1000;
      density += (targetDensity() - density) * 0.04;
      step(dt, time, 0.012);
      render(time);
    };
    raf = requestAnimationFrame(loop);
    canvas.classList.add("is-on");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="mist" aria-hidden="true" />;
}
