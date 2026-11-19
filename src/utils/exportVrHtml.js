// Utilitas validasi foto equirectangular 2:1, kompresi gambar, dan generator 1 file HTML VR Tour 360° mandiri

export function compressImageElementToDataUrl(img, maxWidth = 2048, quality = 0.82) {
  const ratio = img.naturalWidth / (img.naturalHeight || 1);
  let targetW = img.naturalWidth;
  let targetH = img.naturalHeight;

  if (targetW > maxWidth) {
    targetW = maxWidth;
    targetH = Math.round(maxWidth / ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, targetW, targetH);
  return canvas.toDataURL('image/jpeg', quality);
}

export function validateAndCompressPanoramaFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar (JPG, PNG, WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar rusak atau tidak didukung browser.'));
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const ratio = Number((width / (height || 1)).toFixed(2));
        const isEquirectangular = ratio >= 1.85 && ratio <= 2.15;

        const dataUrl = compressImageElementToDataUrl(img, 2048, 0.82);
        const originalSizeKb = Math.round(file.size / 1024);
        const compressedSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        let warning = '';
        if (!isEquirectangular) {
          warning = `Rasio foto terdeteksi ${ratio}:1 (${width}x${height}px). Foto 360° equirectangular idealnya memiliki rasio tepat 2:1 agar tidak melengkung di kutub atas/bawah.`;
        } else if (width < 1200) {
          warning = `Resolusi ${width}x${height}px terbaca (rasio 2:1 sesuai), namun disarankan minimal 2048x1024px agar lebih tajam.`;
        }

        resolve({
          dataUrl,
          width,
          height,
          ratio,
          isEquirectangular,
          originalSizeKb,
          compressedSizeKb,
          warning,
        });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function inspectImageUrlDimensions(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ ok: false, error: 'URL kosong' });
      return;
    }
    const img = new Image();
    if (url.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const ratio = Number((width / (height || 1)).toFixed(2));
      const isEquirectangular = ratio >= 1.85 && ratio <= 2.15;
      resolve({ ok: true, width, height, ratio, isEquirectangular });
    };
    img.onerror = () => {
      resolve({ ok: false, error: 'Foto tidak dapat dimuat' });
    };
    img.src = url;
  });
}

async function resolveAssetToDataUrl(url, maxWidth = 1600) {
  if (!url || url.startsWith('data:')) return url;
  try {
    const absUrl = url.startsWith('/') ? `${window.location.origin}${url}` : url;
    const res = await fetch(absUrl);
    if (!res.ok) return url;
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve(compressImageElementToDataUrl(img, maxWidth, 0.8));
        };
        img.onerror = reject;
        img.src = objectUrl;
      });
      return dataUrl;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return url;
  }
}

export async function inlineAssetsInVrTour(vrTourData) {
  const scenes = await Promise.all(
    (vrTourData.scenes || []).map(async (scene) => {
      const inlinedImage = await resolveAssetToDataUrl(scene.image, 1800);
      const hotspots = await Promise.all(
        (scene.hotspots || []).map(async (hs) => {
          if (hs.type === 'info' && hs.image) {
            return {
              ...hs,
              image: await resolveAssetToDataUrl(hs.image, 720),
            };
          }
          return hs;
        })
      );
      return {
        ...scene,
        image: inlinedImage,
        hotspots,
      };
    })
  );
  return {
    ...vrTourData,
    scenes,
  };
}

export function generateStandaloneVrHtml(vrTourData) {
  const safeJson = JSON.stringify(vrTourData).replace(/</g, '\\u003c');
  const safeTitle = String(vrTourData?.title || 'VR Tour 360°').replace(/[<>]/g, '');

  return `<!DOCTYPE html>
<html lang="id" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>
    :root {
      --bg: #0b0f17;
      --card: rgba(17, 24, 39, 0.84);
      --border: rgba(255, 255, 255, 0.14);
      --text: #f8fafc;
      --muted: #94a3b8;
      --accent: #f59e0b;
      --accent-text: #0f172a;
    }
    [data-theme="light"] {
      --bg: #f8fafc;
      --card: rgba(255, 255, 255, 0.9);
      --border: rgba(15, 23, 42, 0.12);
      --text: #0f172a;
      --muted: #475569;
      --accent: #d97706;
      --accent-text: #ffffff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    body, html { width: 100%; height: 100%; overflow: hidden; background: var(--bg); color: var(--text); }
    #app { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; }
    #viewport { position: relative; flex: 1; overflow: hidden; cursor: grab; touch-action: none; background: #000; }
    #viewport.grabbing { cursor: grabbing; }
    canvas { width: 100%; height: 100%; display: block; }
    #fade { position: absolute; inset: 0; background: #000; opacity: 0; pointer-events: none; transition: opacity .3s ease; z-index: 30; }
    #fade.on { opacity: .9; }
    #stereoLine { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: rgba(255,255,255,.4); display: none; z-index: 25; pointer-events: none; }
    .topbar {
      position: absolute; top: 12px; left: 12px; right: 12px; z-index: 20;
      display: flex; align-items: center; justify-content: space-between; gap: 8px; pointer-events: none; flex-wrap: wrap;
    }
    .pill {
      pointer-events: auto; display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 14px; border-radius: 999px; background: var(--card); border: 1px solid var(--border);
      backdrop-filter: blur(12px); color: var(--text); font-size: 13px; font-weight: 700; box-shadow: 0 8px 24px rgba(0,0,0,.28);
    }
    .btn {
      pointer-events: auto; border: 1px solid var(--border); background: var(--card); color: var(--text);
      backdrop-filter: blur(12px); padding: 7px 11px; border-radius: 10px; font-size: 12px; font-weight: 600;
      cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: .2s;
    }
    .btn:hover, .btn.active { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
    .controls { display: flex; gap: 6px; flex-wrap: wrap; }
    #hotspots { position: absolute; inset: 0; pointer-events: none; z-index: 15; overflow: hidden; }
    .hs { position: absolute; transform: translate(-50%, -50%); pointer-events: auto; }
    .hs-nav {
      display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; border-radius: 999px;
      background: var(--accent); color: var(--accent-text); border: 2px solid #fff; font-size: 12px; font-weight: 800;
      cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,.35); white-space: nowrap;
    }
    .hs-info {
      width: 34px; height: 34px; border-radius: 999px; background: #fff; color: #0f172a; border: 2px solid var(--accent);
      font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 6px 16px rgba(0,0,0,.35);
    }
    .room-card {
      position: absolute; bottom: 82px; left: 12px; z-index: 20; max-width: 320px;
      background: var(--card); border: 1px solid var(--border); backdrop-filter: blur(12px);
      border-radius: 16px; padding: 12px 14px; font-size: 12px; box-shadow: 0 10px 28px rgba(0,0,0,.3);
    }
    .room-card h4 { font-size: 13px; margin-bottom: 4px; color: var(--text); }
    .room-card p { color: var(--muted); line-height: 1.45; }
    .info-modal {
      position: absolute; bottom: 82px; right: 12px; z-index: 28; width: min(330px, calc(100vw - 24px));
      background: var(--card); border: 1px solid var(--border); backdrop-filter: blur(16px);
      border-radius: 16px; overflow: hidden; display: none; box-shadow: 0 16px 40px rgba(0,0,0,.45);
    }
    .info-modal.open { display: block; }
    .info-modal img { width: 100%; height: 150px; object-fit: cover; display: block; }
    .info-modal .body { padding: 12px 14px; }
    .info-modal h4 { font-size: 14px; margin-bottom: 6px; }
    .info-modal p { font-size: 12px; color: var(--muted); line-height: 1.5; }
    .roombar {
      display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: var(--bg);
      border-top: 1px solid var(--border); overflow-x: auto; z-index: 25;
    }
    .room-item {
      display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 12px;
      border: 1px solid var(--border); background: var(--card); color: var(--text);
      cursor: pointer; flex-shrink: 0; font-size: 12px; font-weight: 600;
    }
    .room-item.active { border-color: var(--accent); background: rgba(245, 158, 11, 0.16); }
    .room-item img { width: 38px; height: 28px; object-fit: cover; border-radius: 6px; }
    @media (max-width: 640px) { .room-card { display: none; } }
  </style>
</head>
<body>
  <div id="app">
    <div id="viewport">
      <canvas id="glcanvas"></canvas>
      <div id="stereoLine"></div>
      <div id="hotspots"></div>
      <div id="fade"></div>

      <div class="topbar">
        <div class="pill" id="roomTitle">Memuat Tur...</div>
        <div class="controls">
          <button class="btn" id="btnZoomIn" title="Zoom In">+</button>
          <button class="btn" id="btnZoomOut" title="Zoom Out">-</button>
          <button class="btn active" id="btnAuto" title="Putar Otomatis">Putar</button>
          <button class="btn" id="btnGyro" title="Giroskop HP">Giroskop</button>
          <button class="btn" id="btnAudio" title="Musik Latar">Audio: Mati</button>
          <button class="btn" id="btnVr" title="Mode VR Headset">Mode VR</button>
          <button class="btn" id="btnTheme" title="Mode Terang/Gelap">Tema</button>
          <button class="btn" id="btnFull" title="Layar Penuh">Layar Penuh</button>
        </div>
      </div>

      <div class="room-card" id="roomCard">
        <h4 id="cardName"></h4>
        <p id="cardDesc"></p>
      </div>

      <div class="info-modal" id="infoModal">
        <img id="infoImg" alt="" style="display:none;" />
        <div class="body">
          <div style="display:flex;justify-content:space-between;align-items:start;gap:8px;">
            <h4 id="infoTitle"></h4>
            <button class="btn" id="closeInfo" style="padding:3px 8px;">✕</button>
          </div>
          <p id="infoDesc"></p>
        </div>
      </div>
    </div>

    <div class="roombar" id="roombar"></div>
  </div>

  <script>
    const TOUR = ${safeJson};
    const D2R = Math.PI / 180;
    const viewport = document.getElementById('viewport');
    const canvas = document.getElementById('glcanvas');
    const hotspotsEl = document.getElementById('hotspots');
    const fadeEl = document.getElementById('fade');
    const roombarEl = document.getElementById('roombar');
    const infoModal = document.getElementById('infoModal');

    let currentScene = TOUR.scenes.find(s => s.id === TOUR.startSceneId) || TOUR.scenes[0];
    let camYaw = Number(currentScene?.initialYaw) || 0;
    let camPitch = Number(currentScene?.initialPitch) || 0;
    let fov = 75;
    let velY = 0, velP = 0, autoRotate = true, stereo = false, gyro = false;
    let drag = { on: false, lx: 0, ly: 0, moved: 0 };
    let gl, prog, tex, uLoc = {}, loadedImg = null;
    let audioCtx = null, audioTimer = null, audioOn = false;

    function basis(yDeg, pDeg) {
      const y = yDeg * D2R, p = pDeg * D2R;
      return {
        f: [Math.cos(p)*Math.sin(y), Math.sin(p), Math.cos(p)*Math.cos(y)],
        r: [Math.cos(y), 0, -Math.sin(y)],
        u: [-Math.sin(p)*Math.sin(y), Math.cos(p), -Math.sin(p)*Math.cos(y)]
      };
    }

    function initGL() {
      gl = canvas.getContext('webgl');
      if (!gl) return;
      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, 'attribute vec2 a;varying vec2 v;void main(){v=a;gl_Position=vec4(a,0.,1.);}');
      gl.compileShader(vs);
      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, 'precision highp float;varying vec2 v;uniform sampler2D t;uniform vec3 r,u,f;uniform float a,k,s;const float PI=3.14159265;void main(){vec2 n=v;float e=0.;if(s>.5){if(n.x<0.){n.x=(n.x+.5)*2.;e=-.015;}else{n.x=(n.x-.5)*2.;e=.015;}}float ap=s>.5?a*.5:a;vec3 d=normalize((n.x*ap/k+e)*r+(n.y/k)*u+f);float pt=asin(clamp(d.y,-1.,1.));float yw=atan(d.x,d.z);gl_FragColor=texture2D(t,vec2(fract(yw/(2.*PI)+.5),clamp(.5-pt/PI,.001,.999)));}');
      gl.compileShader(fs);
      prog = gl.createProgram();
      gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); gl.useProgram(prog);
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      const ap = gl.getAttribLocation(prog, 'a');
      gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
      tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      ['r','u','f','a','k','s'].forEach(n => uLoc[n] = gl.getUniformLocation(prog, n));
    }

    function loadScene(sceneId) {
      const next = TOUR.scenes.find(s => s.id === sceneId);
      if (!next) return;
      fadeEl.classList.add('on');
      infoModal.classList.remove('open');
      setTimeout(() => {
        currentScene = next;
        camYaw = Number(next.initialYaw) || 0;
        camPitch = Number(next.initialPitch) || 0;
        document.getElementById('roomTitle').textContent = next.name;
        document.getElementById('cardName').textContent = next.name;
        document.getElementById('cardDesc').textContent = next.description || '';
        renderRoomBar();
        const img = new Image();
        img.onload = () => {
          loadedImg = img;
          if (gl && tex) {
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          }
          fadeEl.classList.remove('on');
        };
        img.onerror = () => fadeEl.classList.remove('on');
        img.src = next.image;
      }, 220);
    }

    function renderRoomBar() {
      roombarEl.innerHTML = '';
      TOUR.scenes.forEach(s => {
        const b = document.createElement('button');
        b.className = 'room-item' + (s.id === currentScene.id ? ' active' : '');
        b.innerHTML = '<img src="' + s.image + '" alt=""><span>' + s.name + '</span>';
        b.onclick = () => loadScene(s.id);
        roombarEl.appendChild(b);
      });
    }

    function renderHotspots() {
      if (stereo) { hotspotsEl.innerHTML = ''; return; }
      const w = viewport.clientWidth, h = viewport.clientHeight;
      const b = basis(camYaw, camPitch);
      const invF = 1 / Math.tan(fov * D2R / 2);
      const asp = w / (h || 1);
      hotspotsEl.innerHTML = '';
      (currentScene.hotspots || []).forEach(hs => {
        const hy = (Number(hs.yaw)||0)*D2R, hp = (Number(hs.pitch)||0)*D2R;
        const vx = Math.cos(hp)*Math.sin(hy), vy = Math.sin(hp), vz = Math.cos(hp)*Math.cos(hy);
        const zc = vx*b.f[0] + vy*b.f[1] + vz*b.f[2];
        if (zc <= 0.1) return;
        const xc = vx*b.r[0] + vy*b.r[1] + vz*b.r[2];
        const yc = vx*b.u[0] + vy*b.u[1] + vz*b.u[2];
        const nx = (xc * invF) / (zc * asp), ny = (yc * invF) / zc;
        if (Math.abs(nx) > 1.2 || Math.abs(ny) > 1.2) return;
        const wrap = document.createElement('div');
        wrap.className = 'hs';
        wrap.style.left = ((nx + 1) / 2 * w) + 'px';
        wrap.style.top = ((1 - ny) / 2 * h) + 'px';
        const btn = document.createElement('button');
        if (hs.type === 'nav') {
          btn.className = 'hs-nav';
          btn.textContent = '➜ ' + (hs.label || 'Pindah Ruangan');
          btn.onclick = (e) => { e.stopPropagation(); loadScene(hs.targetSceneId); };
        } else {
          btn.className = 'hs-info';
          btn.textContent = 'i';
          btn.onclick = (e) => {
            e.stopPropagation();
            document.getElementById('infoTitle').textContent = hs.title || 'Info';
            document.getElementById('infoDesc').textContent = hs.description || '';
            const im = document.getElementById('infoImg');
            if (hs.image) { im.src = hs.image; im.style.display = 'block'; } else { im.style.display = 'none'; }
            infoModal.classList.add('open');
          };
        }
        wrap.appendChild(btn);
        hotspotsEl.appendChild(wrap);
      });
    }

    function loop() {
      if (!drag.on) {
        if (Math.abs(velY) > 0.01 || Math.abs(velP) > 0.01) {
          camYaw += velY; camPitch = Math.max(-85, Math.min(85, camPitch + velP));
          velY *= 0.92; velP *= 0.92;
        } else if (autoRotate && !infoModal.classList.contains('open')) {
          camYaw += 0.08;
        }
      }
      if (gl && prog && loadedImg) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cw = Math.round(viewport.clientWidth * dpr), ch = Math.round(viewport.clientHeight * dpr);
        if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
        gl.viewport(0, 0, cw, ch);
        const b = basis(camYaw, camPitch);
        gl.uniform3fv(uLoc.r, b.r); gl.uniform3fv(uLoc.u, b.u); gl.uniform3fv(uLoc.f, b.f);
        gl.uniform1f(uLoc.a, cw / (ch || 1));
        gl.uniform1f(uLoc.k, 1 / Math.tan(fov * D2R / 2));
        gl.uniform1f(uLoc.s, stereo ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      renderHotspots();
      requestAnimationFrame(loop);
    }

    viewport.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.controls,.btn,.room-card,.info-modal,.hs')) return;
      drag = { on: true, lx: e.clientX, ly: e.clientY, moved: 0 };
      viewport.classList.add('grabbing');
    });
    viewport.addEventListener('pointermove', (e) => {
      if (!drag.on) return;
      const dx = e.clientX - drag.lx, dy = e.clientY - drag.ly;
      drag.lx = e.clientX; drag.ly = e.clientY; drag.moved += Math.hypot(dx, dy);
      const s = (fov / 75) * 0.22;
      velY = -dx * s; velP = dy * s;
      camYaw += velY; camPitch = Math.max(-85, Math.min(85, camPitch + velP));
    });
    viewport.addEventListener('pointerup', () => {
      if (!drag.on) return;
      drag.on = false; viewport.classList.remove('grabbing');
    });
    viewport.addEventListener('wheel', (e) => { e.preventDefault(); fov = Math.max(35, Math.min(100, fov + (e.deltaY > 0 ? 4 : -4))); }, { passive: false });

    document.getElementById('btnZoomIn').onclick = () => fov = Math.max(35, fov - 10);
    document.getElementById('btnZoomOut').onclick = () => fov = Math.min(100, fov + 10);
    document.getElementById('btnAuto').onclick = (e) => { autoRotate = !autoRotate; e.target.classList.toggle('active', autoRotate); };
    document.getElementById('btnVr').onclick = (e) => { stereo = !stereo; e.target.classList.toggle('active', stereo); document.getElementById('stereoLine').style.display = stereo ? 'block' : 'none'; };
    document.getElementById('btnTheme').onclick = () => { const h = document.documentElement; h.setAttribute('data-theme', h.getAttribute('data-theme') === 'light' ? 'dark' : 'light'); };
    document.getElementById('btnFull').onclick = () => { if (!document.fullscreenElement) viewport.requestFullscreen(); else document.exitFullscreen(); };
    document.getElementById('closeInfo').onclick = () => infoModal.classList.remove('open');

    document.getElementById('btnGyro').onclick = async (e) => {
      if (!gyro && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== 'granted') return;
      }
      gyro = !gyro; e.target.classList.toggle('active', gyro);
    };
    let lA = null, lB = null;
    window.addEventListener('deviceorientation', (e) => {
      if (!gyro || e.alpha == null || e.beta == null) return;
      if (lA !== null) {
        let dA = e.alpha - lA; if (dA > 180) dA -= 360; if (dA < -180) dA += 360;
        camYaw -= dA * 0.65; camPitch = Math.max(-80, Math.min(80, camPitch + (e.beta - lB) * 0.45));
      }
      lA = e.alpha; lB = e.beta;
    });

    document.getElementById('btnAudio').onclick = (e) => {
      audioOn = !audioOn;
      e.target.textContent = audioOn ? 'Audio: Nyala' : 'Audio: Mati';
      e.target.classList.toggle('active', audioOn);
      if (audioOn) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!audioCtx && AC) audioCtx = new AC();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
        let step = 0;
        const chime = () => {
          if (!audioOn || !audioCtx) return;
          const now = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(notes[step++ % notes.length], now);
          g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.03, now + 0.4); g.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
          o.connect(g); g.connect(audioCtx.destination); o.start(now); o.stop(now + 2.7);
        };
        chime();
        audioTimer = setInterval(chime, 2600);
      } else {
        if (audioTimer) clearInterval(audioTimer);
        if (audioCtx && audioCtx.state === 'running') audioCtx.suspend();
      }
    };

    initGL();
    loadScene(currentScene.id);
    requestAnimationFrame(loop);
  <\/script>
</body>
</html>`;
}

export async function downloadStandaloneVrHtml(vrTourData) {
  const prepared = await inlineAssetsInVrTour(vrTourData);
  const html = generateStandaloneVrHtml(prepared);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'vr-tour-360-wukirsari.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
