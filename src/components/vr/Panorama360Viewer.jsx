import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  Compass,
  Volume2,
  VolumeX,
  Info,
  Navigation,
  X,
  Crosshair,
  Eye,
  RotateCcw,
  Glasses,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

const VERT_SHADER = `
  attribute vec2 a_pos;
  varying vec2 v_ndc;
  void main() {
    v_ndc = a_pos;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

const FRAG_SHADER = `
  precision highp float;
  varying vec2 v_ndc;
  uniform sampler2D u_tex;
  uniform vec3 u_right;
  uniform vec3 u_up;
  uniform vec3 u_forward;
  uniform float u_aspect;
  uniform float u_invF;
  uniform float u_stereo;

  const float PI = 3.14159265359;

  void main() {
    vec2 ndc = v_ndc;
    float eyeOffset = 0.0;

    if (u_stereo > 0.5) {
      if (ndc.x < 0.0) {
        ndc.x = (ndc.x + 0.5) * 2.0;
        eyeOffset = -0.015;
      } else {
        ndc.x = (ndc.x - 0.5) * 2.0;
        eyeOffset = 0.015;
      }
    }

    float aspect = u_stereo > 0.5 ? u_aspect * 0.5 : u_aspect;
    vec3 ray = normalize(
      (ndc.x * aspect / u_invF + eyeOffset) * u_right +
      (ndc.y / u_invF) * u_up +
      u_forward
    );

    float pitch = asin(clamp(ray.y, -1.0, 1.0));
    float yaw = atan(ray.x, ray.z);

    float u = fract(yaw / (2.0 * PI) + 0.5);
    float v = clamp(0.5 - pitch / PI, 0.001, 0.999);

    gl_FragColor = texture2D(u_tex, vec2(u, v));
  }
`;

function computeCameraBasis(yawDeg, pitchDeg) {
  const yaw = yawDeg * DEG2RAD;
  const pitch = pitchDeg * DEG2RAD;

  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  const forward = [cosP * sinY, sinP, cosP * cosY];
  const right = [cosY, 0, -sinY];
  const up = [-sinP * sinY, cosP, -sinP * cosY];

  return { forward, right, up };
}

function projectHotspotToScreen(yawDeg, pitchDeg, camYaw, camPitch, fovDeg, width, height) {
  if (!width || !height) return null;
  const { forward, right, up } = computeCameraBasis(camYaw, camPitch);
  const hy = yawDeg * DEG2RAD;
  const hp = pitchDeg * DEG2RAD;

  const vx = Math.cos(hp) * Math.sin(hy);
  const vy = Math.sin(hp);
  const vz = Math.cos(hp) * Math.cos(hy);

  const zc = vx * forward[0] + vy * forward[1] + vz * forward[2];
  if (zc <= 0.1) return null;

  const xc = vx * right[0] + vy * right[1] + vz * right[2];
  const yc = vx * up[0] + vy * up[1] + vz * up[2];

  const invF = 1 / Math.tan((fovDeg * DEG2RAD) / 2);
  const aspect = width / height;

  const nx = (xc * invF) / (zc * aspect);
  const ny = (yc * invF) / zc;

  if (Math.abs(nx) > 1.25 || Math.abs(ny) > 1.25) return null;

  return {
    x: ((nx + 1) / 2) * width,
    y: ((1 - ny) / 2) * height,
  };
}

function screenToSpherical(px, py, width, height, camYaw, camPitch, fovDeg) {
  const { forward, right, up } = computeCameraBasis(camYaw, camPitch);
  const nx = (2 * px) / width - 1;
  const ny = 1 - (2 * py) / height;

  const invF = 1 / Math.tan((fovDeg * DEG2RAD) / 2);
  const aspect = width / height;

  const xc = (nx * aspect) / invF;
  const yc = ny / invF;

  let dx = xc * right[0] + yc * up[0] + forward[0];
  let dy = xc * right[1] + yc * up[1] + forward[1];
  let dz = xc * right[2] + yc * up[2] + forward[2];

  const len = Math.hypot(dx, dy, dz) || 1;
  dx /= len;
  dy /= len;
  dz /= len;

  const pitch = Math.asin(Math.max(-1, Math.min(1, dy))) * RAD2DEG;
  const yaw = Math.atan2(dx, dz) * RAD2DEG;

  return {
    yaw: Math.round(yaw * 10) / 10,
    pitch: Math.round(Math.max(-85, Math.min(85, pitch)) * 10) / 10,
  };
}

const Panorama360Viewer = ({
  scene,
  allScenes = [],
  onSelectScene,
  editorMode = false,
  pickedCoords = null,
  onPickCoordinates,
  className = '',
  compact = false,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const texRef = useRef(null);
  const programRef = useRef(null);
  const uniformsRef = useRef({});
  const imageObjRef = useRef(null);

  const cameraRef = useRef({
    yaw: scene?.initialYaw || 0,
    pitch: scene?.initialPitch || 0,
    fov: 75,
    velYaw: 0,
    velPitch: 0,
  });

  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    moved: 0,
  });

  const audioCtxRef = useRef(null);
  const audioTimerRef = useRef(null);

  const [viewSize, setViewSize] = useState({ width: 800, height: 450 });
  const [renderTick, setRenderTick] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [autoRotate, setAutoRotate] = useState(!editorMode);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [stereoVr, setStereoVr] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showRoomDesc, setShowRoomDesc] = useState(true);
  const [activeInfoHotspot, setActiveInfoHotspot] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [webglReady, setWebglReady] = useState(true);

  const sceneImage = scene?.image || '/images/destinasi/makam-imogiri.jpg';
  const sceneId = scene?.id;

  // Fade transition & reset camera orientation when scene changes
  useEffect(() => {
    setActiveInfoHotspot(null);
    setIsFading(true);
    cameraRef.current.yaw = Number(scene?.initialYaw) || 0;
    cameraRef.current.pitch = Number(scene?.initialPitch) || 0;
    cameraRef.current.velYaw = 0;
    cameraRef.current.velPitch = 0;
    const t = setTimeout(() => setIsFading(false), 260);
    return () => clearTimeout(t);
  }, [sceneId, scene?.initialYaw, scene?.initialPitch]);

  // Turn off auto-rotate automatically in editor mode for easy clicking
  useEffect(() => {
    if (editorMode) {
      setAutoRotate(false);
    }
  }, [editorMode]);

  // Soft Ambient Javanese Pentatonic Synth (Web Audio API, no external files)
  useEffect(() => {
    if (isMuted) {
      if (audioTimerRef.current) {
        clearInterval(audioTimerRef.current);
        audioTimerRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend().catch(() => {});
      }
      return undefined;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return undefined;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Pelog / Slendro serene ambient notes (Hz)
      const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
      let step = 0;

      const playChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], now);
        step += 2 + Math.floor(Math.random() * 2);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 3.0);
      };

      playChime();
      audioTimerRef.current = setInterval(playChime, 2600);
    } catch (err) {
      console.error('Ambient audio error:', err);
    }

    return () => {
      if (audioTimerRef.current) {
        clearInterval(audioTimerRef.current);
        audioTimerRef.current = null;
      }
    };
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Init WebGL context & shaders once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: false });
    if (!gl) {
      setWebglReady(false);
      return;
    }

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_SHADER);
    if (!vs || !fs) {
      setWebglReady(false);
      return;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setWebglReady(false);
      return;
    }

    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    glRef.current = gl;
    programRef.current = prog;
    texRef.current = tex;
    uniformsRef.current = {
      u_tex: gl.getUniformLocation(prog, 'u_tex'),
      u_right: gl.getUniformLocation(prog, 'u_right'),
      u_up: gl.getUniformLocation(prog, 'u_up'),
      u_forward: gl.getUniformLocation(prog, 'u_forward'),
      u_aspect: gl.getUniformLocation(prog, 'u_aspect'),
      u_invF: gl.getUniformLocation(prog, 'u_invF'),
      u_stereo: gl.getUniformLocation(prog, 'u_stereo'),
    };
  }, []);

  // Load texture whenever sceneImage changes
  useEffect(() => {
    setImageError(false);
    const img = new Image();
    if (sceneImage.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      imageObjRef.current = img;
      const gl = glRef.current;
      const tex = texRef.current;
      if (gl && tex) {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        } catch (err) {
          console.error('WebGL texture upload failed:', err);
          setWebglReady(false);
        }
      }
    };
    img.onerror = () => {
      setImageError(true);
    };
    img.src = sceneImage;
  }, [sceneImage]);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width && rect.height) {
        setViewSize({ width: rect.width, height: rect.height });
        if (canvasRef.current) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvasRef.current.width = Math.round(rect.width * dpr);
          canvasRef.current.height = Math.round(rect.height * dpr);
        }
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // DeviceOrientation (Gyroscope) listener
  useEffect(() => {
    if (!gyroEnabled) return undefined;
    let lastAlpha = null;
    let lastBeta = null;

    const handleOrientation = (e) => {
      if (e.alpha == null || e.beta == null) return;
      if (lastAlpha !== null && lastBeta !== null) {
        let dAlpha = e.alpha - lastAlpha;
        if (dAlpha > 180) dAlpha -= 360;
        if (dAlpha < -180) dAlpha += 360;
        const dBeta = e.beta - lastBeta;
        cameraRef.current.yaw -= dAlpha * 0.65;
        cameraRef.current.pitch = Math.max(-80, Math.min(80, cameraRef.current.pitch + dBeta * 0.45));
      }
      lastAlpha = e.alpha;
      lastBeta = e.beta;
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [gyroEnabled]);

  // Fullscreen listener
  useEffect(() => {
    const handleFs = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  // Main animation loop (renders WebGL + triggers React hotspot sync smoothly)
  useEffect(() => {
    let rafId;
    let frameCount = 0;

    const loop = () => {
      const cam = cameraRef.current;

      if (!dragRef.current.active) {
        if (Math.abs(cam.velYaw) > 0.01 || Math.abs(cam.velPitch) > 0.01) {
          cam.yaw += cam.velYaw;
          cam.pitch = Math.max(-85, Math.min(85, cam.pitch + cam.velPitch));
          cam.velYaw *= 0.92;
          cam.velPitch *= 0.92;
        } else if (autoRotate && !activeInfoHotspot) {
          cam.yaw += 0.08;
        }
      }

      if (cam.yaw > 180) cam.yaw -= 360;
      if (cam.yaw < -180) cam.yaw += 360;

      const gl = glRef.current;
      const canvas = canvasRef.current;
      const prog = programRef.current;

      if (gl && canvas && prog && imageObjRef.current && webglReady) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(prog);
        const { forward, right, up } = computeCameraBasis(cam.yaw, cam.pitch);
        const invF = 1 / Math.tan((cam.fov * DEG2RAD) / 2);
        const aspect = (canvas.width || 1) / (canvas.height || 1);
        const u = uniformsRef.current;

        gl.uniform3fv(u.u_right, right);
        gl.uniform3fv(u.u_up, up);
        gl.uniform3fv(u.u_forward, forward);
        gl.uniform1f(u.u_aspect, aspect);
        gl.uniform1f(u.u_invF, invF);
        gl.uniform1f(u.u_stereo, stereoVr ? 1.0 : 0.0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      frameCount += 1;
      if (frameCount % 2 === 0) {
        setRenderTick((t) => (t + 1) % 100000);
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [autoRotate, activeInfoHotspot, stereoVr, webglReady]);

  // Pointer & Wheel Handlers
  const handlePointerDown = (e) => {
    if (e.target.closest('[data-vr-ui="true"]')) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      moved: 0,
    };
    cameraRef.current.velYaw = 0;
    cameraRef.current.velPitch = 0;
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    dragRef.current.moved += Math.hypot(dx, dy);

    const sensitivity = (cameraRef.current.fov / 75) * 0.22;
    const dYaw = -dx * sensitivity;
    const dPitch = dy * sensitivity;

    cameraRef.current.yaw += dYaw;
    cameraRef.current.pitch = Math.max(-85, Math.min(85, cameraRef.current.pitch + dPitch));
    cameraRef.current.velYaw = dYaw * 0.7;
    cameraRef.current.velPitch = dPitch * 0.7;
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current.active) return;
    const moved = dragRef.current.moved;
    dragRef.current.active = false;

    if (moved < 6 && editorMode && onPickCoordinates && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const cam = cameraRef.current;
      const coords = screenToSpherical(px, py, rect.width, rect.height, cam.yaw, cam.pitch, cam.fov);
      onPickCoordinates(coords);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const cam = cameraRef.current;
    cam.fov = Math.max(35, Math.min(100, cam.fov + (e.deltaY > 0 ? 4 : -4)));
  };

  const handleZoom = useCallback((delta) => {
    const cam = cameraRef.current;
    cam.fov = Math.max(35, Math.min(100, cam.fov + delta));
  }, []);

  const handleResetView = () => {
    cameraRef.current.yaw = Number(scene?.initialYaw) || 0;
    cameraRef.current.pitch = Number(scene?.initialPitch) || 0;
    cameraRef.current.fov = 75;
    cameraRef.current.velYaw = 0;
    cameraRef.current.velPitch = 0;
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const toggleGyro = async () => {
    if (gyroEnabled) {
      setGyroEnabled(false);
      return;
    }
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === 'granted') {
          setGyroEnabled(true);
        }
      } catch (err) {
        console.error('Gyro permission denied:', err);
      }
    } else {
      setGyroEnabled(true);
    }
  };

  const toggleVrMode = async () => {
    const next = !stereoVr;
    setStereoVr(next);
    if (next && containerRef.current && !document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch {
        // Optional fullscreen for VR stereo mode
      }
    }
  };

  const cam = cameraRef.current;
  const hotspots = Array.isArray(scene?.hotspots) ? scene.hotspots : [];

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      className={`relative select-none overflow-hidden rounded-2xl border border-border/40 bg-black touch-none ${
        editorMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
      } ${className}`}
    >
      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${!webglReady || imageError ? 'hidden' : ''}`}
      />

      {/* CSS Fallback if WebGL unavailable or image blocked */}
      {(!webglReady || imageError) && (
        <div className="absolute inset-0 bg-secondary/40 flex items-center justify-center">
          <img
            src={sceneImage}
            alt={scene?.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/batik.jpg';
            }}
          />
          {imageError && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 text-center text-white text-xs">
              Gagal memuat foto panorama. Periksa URL atau unggah ulang foto di Panel Admin.
            </div>
          )}
        </div>
      )}

      {/* Stereo VR Divider Line */}
      {stereoVr && (
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-0.5 bg-white/40 z-20" />
      )}

      {/* Smooth Fade Overlay when switching scenes */}
      <div
        className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-300 z-30 ${
          isFading ? 'opacity-90' : 'opacity-0'
        }`}
      />

      {/* Top Left Room Pill & Editor Hint */}
      <div
        data-vr-ui="true"
        className="absolute top-3 left-3 right-14 z-20 flex flex-wrap items-center gap-2 pointer-events-none"
      >
        <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-lg max-w-full">
          <Eye className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="truncate">{scene?.name || 'Panorama 360°'}</span>
        </div>

        {editorMode && (
          <div className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-black text-[11px] font-bold shadow-lg">
            <Crosshair className="w-3.5 h-3.5" />
            <span>Mode Editor: Klik titik panorama untuk ambil koordinat</span>
          </div>
        )}
      </div>

      {/* Compass Yaw Readout (Top Right) */}
      <div
        data-vr-ui="true"
        className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/90 pointer-events-none"
      >
        {Math.round(cam.yaw)}°
      </div>

      {/* Projected 3D Hotspots */}
      {!stereoVr && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" data-tick={renderTick}>
          {hotspots.map((hs) => {
            const pos = projectHotspotToScreen(
              Number(hs.yaw) || 0,
              Number(hs.pitch) || 0,
              cam.yaw,
              cam.pitch,
              cam.fov,
              viewSize.width,
              viewSize.height
            );
            if (!pos) return null;

            const isNav = hs.type === 'nav';
            const targetRoom = isNav ? allScenes.find((s) => s.id === hs.targetSceneId) : null;
            const navLabel = hs.label || (targetRoom ? `Masuk ke ${targetRoom.name}` : 'Pindah Ruangan');

            return (
              <div
                key={hs.id}
                data-vr-ui="true"
                style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              >
                {isNav ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (editorMode && onPickCoordinates) {
                        onPickCoordinates({ yaw: Number(hs.yaw), pitch: Number(hs.pitch), hotspot: hs });
                      } else if (onSelectScene && hs.targetSceneId) {
                        onSelectScene(hs.targetSceneId);
                      }
                    }}
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground shadow-xl border-2 border-white/80 text-xs font-bold transition-transform hover:scale-105 whitespace-nowrap"
                  >
                    <Navigation className="w-3.5 h-3.5 rotate-45 group-hover:translate-x-0.5 transition-transform" />
                    <span className="max-w-[180px] truncate">{navLabel}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (editorMode && onPickCoordinates) {
                        onPickCoordinates({ yaw: Number(hs.yaw), pitch: Number(hs.pitch), hotspot: hs });
                      } else {
                        setActiveInfoHotspot(hs);
                      }
                    }}
                    className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-xl border-2 border-white transition-transform hover:scale-110"
                    title={hs.title || 'Info Objek'}
                  >
                    <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-35" />
                    <Info className="w-4 h-4 relative z-10" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Editor Picked Crosshair Marker */}
          {editorMode && pickedCoords && (() => {
            const pPos = projectHotspotToScreen(
              Number(pickedCoords.yaw) || 0,
              Number(pickedCoords.pitch) || 0,
              cam.yaw,
              cam.pitch,
              cam.fov,
              viewSize.width,
              viewSize.height
            );
            if (!pPos) return null;
            return (
              <div
                style={{ left: `${pPos.x}px`, top: `${pPos.y}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-emerald-400/20 flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Room Brief Description HUD (Bottom Left) */}
      {!compact && !stereoVr && scene?.description && showRoomDesc && !activeInfoHotspot && (
        <div
          data-vr-ui="true"
          className="hidden sm:block absolute bottom-3 left-3 z-20 max-w-xs md:max-w-sm bg-black/70 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-white shadow-xl"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              {scene.category && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                  {scene.category}
                </span>
              )}
              <h4 className="text-xs font-bold leading-snug mb-1">{scene.name}</h4>
              <p className="text-[11px] text-white/80 leading-relaxed line-clamp-3">
                {scene.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowRoomDesc(false)}
              className="p-1 rounded-lg hover:bg-white/15 text-white/70 hover:text-white"
              title="Sembunyikan deskripsi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Info Hotspot Detail Panel */}
      {activeInfoHotspot && (
        <div
          data-vr-ui="true"
          className="absolute bottom-14 sm:bottom-4 left-3 right-3 sm:right-auto sm:w-80 z-30 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden text-foreground"
        >
          {activeInfoHotspot.image && (
            <div className="aspect-[16/9] w-full overflow-hidden bg-secondary/40">
              <img
                src={activeInfoHotspot.image}
                alt={activeInfoHotspot.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className="text-sm font-bold leading-snug">{activeInfoHotspot.title}</h4>
              <button
                type="button"
                onClick={() => setActiveInfoHotspot(null)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeInfoHotspot.description}
            </p>
          </div>
        </div>
      )}

      {/* Control Toolbar (Bottom Right / Center on Mobile) */}
      <div
        data-vr-ui="true"
        className="absolute bottom-3 right-3 z-20 flex items-center gap-1 p-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 shadow-lg"
      >
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => handleZoom(-10)}
          className="h-7 w-7 text-white hover:bg-white/15 rounded-lg"
          title="Perbesar (Zoom In)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => handleZoom(10)}
          className="h-7 w-7 text-white hover:bg-white/15 rounded-lg"
          title="Perkecil (Zoom Out)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => setAutoRotate((v) => !v)}
          className={`h-7 w-7 rounded-lg ${
            autoRotate ? 'bg-primary text-primary-foreground' : 'text-white hover:bg-white/15'
          }`}
          title="Putar Otomatis"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleResetView}
          className="h-7 w-7 text-white hover:bg-white/15 rounded-lg"
          title="Reset Arah Kamera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
        {!compact && (
          <>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={toggleGyro}
              className={`h-7 w-7 rounded-lg ${
                gyroEnabled ? 'bg-primary text-primary-foreground' : 'text-white hover:bg-white/15'
              }`}
              title="Giroskop HP"
            >
              <Compass className="w-3.5 h-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setIsMuted((m) => !m)}
              className={`h-7 w-7 rounded-lg ${
                !isMuted ? 'bg-primary text-primary-foreground' : 'text-white hover:bg-white/15'
              }`}
              title={isMuted ? 'Nyalakan Musik Latar' : 'Bisukan Musik Latar'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={toggleVrMode}
              className={`h-7 w-7 rounded-lg ${
                stereoVr ? 'bg-primary text-primary-foreground' : 'text-white hover:bg-white/15'
              }`}
              title="Mode VR Headset (Stereo Split-Screen)"
            >
              <Glasses className="w-3.5 h-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={toggleFullscreen}
              className="h-7 w-7 text-white hover:bg-white/15 rounded-lg"
              title="Layar Penuh"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Panorama360Viewer;
