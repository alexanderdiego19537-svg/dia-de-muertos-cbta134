'use client';

import { useEffect, useRef } from 'react';

interface AuroraProps {
  colorStops?: string[];
  speed?: number;
  amplitude?: number;
  opacity?: number;
  blend?: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.substring(0, 2), 16) / 255,
    parseInt(clean.substring(2, 4), 16) / 255,
    parseInt(clean.substring(4, 6), 16) / 255,
  ];
}

function parseAnyColor(color: string): [number, number, number] {
  if (color.trim().startsWith('#')) return hexToRgb(color.trim());
  const m = color.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    return [parseInt(m[0]) / 255, parseInt(m[1]) / 255, parseInt(m[2]) / 255];
  }
  return [0.976, 0.451, 0.086]; // naranja por defecto
}

const VS = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FS = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_res;
  uniform vec3  u_c0;
  uniform vec3  u_c1;
  uniform vec3  u_c2;
  uniform float u_amp;
  uniform float u_blend;

  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p); vec2 f=fract(p);
    vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }
  float fbm(vec2 p){
    float v=0.0,a=0.5;
    for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.1+vec2(1.3,0.7); a*=0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / u_res;
    float t  = u_time * 0.22;

    float b0 = fbm(vec2(uv.x*2.4 + t*0.6,  uv.y*1.2 - t*0.3));
    float b1 = fbm(vec2(uv.x*1.7 - t*0.45, uv.y*1.5 + t*0.4 + 2.1));
    float b2 = fbm(vec2(uv.x*2.9 + t*0.35, uv.y*0.9 - t*0.5 + 4.7));

    float yMask = smoothstep(0.0,0.5,uv.y) * smoothstep(1.0,0.45,uv.y);
    yMask = pow(yMask, 0.65);

    float i0 = smoothstep(0.3, 0.72, b0 * u_amp) * yMask;
    float i1 = smoothstep(0.3, 0.70, b1 * u_amp) * yMask;
    float i2 = smoothstep(0.3, 0.68, b2 * u_amp) * yMask;

    vec3 col = u_c0*i0*u_blend + u_c1*i1*u_blend*0.85 + u_c2*i2*u_blend*0.75;

    float hi = fbm(vec2(uv.x*1.5+t*0.5, uv.y*2.0-t*0.3+8.3));
    col += u_c0 * smoothstep(0.62,0.85,hi) * yMask * 0.22;

    float alpha = clamp(length(col)*1.5, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function Aurora({
  colorStops = ['#F97316', '#7C3AED', '#C2410C'],
  speed = 1.4,
  amplitude = 1.0,
  opacity = 1,
  blend = 0.6,
}: AuroraProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const propsRef   = useRef({ colorStops, speed, amplitude, blend });
  const startRef   = useRef(performance.now());

  // Mantener props actualizados sin recrear WebGL (safe: solo en render, no en commit)
  useEffect(() => {
    propsRef.current = { colorStops, speed, amplitude, blend };
  }, [colorStops, speed, amplitude, blend]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!gl) {
      console.warn('Aurora: WebGL no disponible, usando fondo simple');
      return;
    }

    // Compilar shader
    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error('Shader error:', gl!.getShaderInfoLog(s));
      }
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Quad fullscreen
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Ubicaciones de uniforms (cacheadas)
    const uTime  = gl.getUniformLocation(prog, 'u_time');
    const uRes   = gl.getUniformLocation(prog, 'u_res');
    const uC0    = gl.getUniformLocation(prog, 'u_c0');
    const uC1    = gl.getUniformLocation(prog, 'u_c1');
    const uC2    = gl.getUniformLocation(prog, 'u_c2');
    const uAmp   = gl.getUniformLocation(prog, 'u_amp');
    const uBlend = gl.getUniformLocation(prog, 'u_blend');

    let isVisible = true;
    let isRunning = false;

    function startLoop() {
      if (!isRunning && isVisible) {
        isRunning = true;
        rafRef.current = requestAnimationFrame(frame);
      }
    }

    function stopLoop() {
      isRunning = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    }

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25); // max 1.25x para fluidez absoluta
      const w = Math.floor(canvas.clientWidth  * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    function frame() {
      if (!gl || !isVisible) {
        isRunning = false;
        return;
      }

      const elapsed = (performance.now() - startRef.current) / 1000;
      const { colorStops: cs, speed: sp, amplitude: amp, blend: bl } = propsRef.current;

      const c0 = parseAnyColor(cs[0] ?? '#F97316');
      const c1 = parseAnyColor(cs[1] ?? '#7C3AED');
      const c2 = parseAnyColor(cs[2] ?? '#C2410C');

      gl.uniform1f(uTime,  elapsed * sp);
      gl.uniform2f(uRes,   gl.canvas.width, gl.canvas.height);
      gl.uniform3fv(uC0,   c0);
      gl.uniform3fv(uC1,   c1);
      gl.uniform3fv(uC2,   c2);
      gl.uniform1f(uAmp,   amp);
      gl.uniform1f(uBlend, bl);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      rafRef.current = requestAnimationFrame(frame);
    }

    resize();
    startLoop();

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    // Pausar render WebGL cuando el Hero no esté visible en pantalla (ahorro masivo de GPU al navegar)
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      }
    }, { threshold: 0.02 });
    io.observe(canvas);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      try { gl.deleteProgram(prog); gl.deleteBuffer(buf); } catch {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // solo montar/desmontar

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
