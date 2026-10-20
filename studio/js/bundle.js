/**
 * VANTA Studio — Unified Standalone Bundle
 * 100% Offline, Zero Server Dependency, Runs natively via file:/// or HTTP.
 */

// Palettes
const PALETTES = {
  bioluminescence: [
    [5, 12, 18],
    [0, 115, 122],
    [38, 242, 166],
    [217, 255, 230]
  ],
  neon_cyber: [
    [10, 5, 23],
    [61, 20, 138],
    [0, 217, 242],
    [250, 250, 255]
  ],
  amber_ember: [
    [13, 5, 3],
    [166, 31, 10],
    [250, 140, 13],
    [255, 235, 153]
  ],
  spectral_velvet: [
    [20, 5, 31],
    [140, 26, 115],
    [242, 89, 140],
    [255, 217, 179]
  ],
  toxic_emerald: [
    [3, 13, 5],
    [13, 102, 38],
    [51, 230, 77],
    [230, 255, 204]
  ],
  monochrome: [
    [13, 13, 15],
    [77, 82, 89],
    [179, 186, 194],
    [250, 250, 252]
  ]
};

const SPECIES_COLORS = [
  "#ff4757", // Red
  "#2ed573", // Green
  "#1e90ff", // Blue
  "#ffa502", // Gold
  "#9b59b6", // Purple
  "#00f5d4"  // Cyan
];

/* ========================================================================= */
/* 1. Particle Life Engine                                                  */
/* ========================================================================= */
class ParticleLifeEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numParticles = 2400;
    this.numSpecies = 5;
    this.rMax = 80;
    this.rMin = 14;
    this.friction = 0.86;
    this.forceFactor = 1.0;
    this.maxVelocity = 8.0;
    this.trailFade = 0.92;
    this.pointSize = 2.4;

    this.x = new Float32Array(this.numParticles);
    this.y = new Float32Array(this.numParticles);
    this.vx = new Float32Array(this.numParticles);
    this.vy = new Float32Array(this.numParticles);
    this.species = new Int32Array(this.numParticles);

    this.matrix = [];
    this.initMatrix();
    this.init();
  }

  initMatrix() {
    this.matrix = [];
    for (let i = 0; i < this.numSpecies; i++) {
      const row = [];
      for (let j = 0; j < this.numSpecies; j++) {
        row.push(i === j ? (Math.random() * 0.8 - 0.2) : (Math.random() * 2.0 - 1.0));
      }
      this.matrix.push(row);
    }
  }

  init(seed = 42) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    for (let i = 0; i < this.numParticles; i++) {
      this.x[i] = Math.random() * w;
      this.y[i] = Math.random() * h;
      this.vx[i] = 0;
      this.vy[i] = 0;
      this.species[i] = Math.floor(Math.random() * this.numSpecies);
    }
  }

  step(dt = 0.016, mouse = null) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const N = this.numParticles;
    const rMax = this.rMax;
    const rMin = this.rMin;
    const rDiff = rMax - rMin;

    const cellSize = rMax;
    const gridW = Math.max(Math.floor(w / cellSize), 1);
    const gridH = Math.max(Math.floor(h / cellSize), 1);
    const grid = new Array(gridW * gridH);
    for (let i = 0; i < grid.length; i++) grid[i] = [];

    for (let i = 0; i < N; i++) {
      const gx = Math.min(Math.max(Math.floor(this.x[i] / cellSize), 0), gridW - 1);
      const gy = Math.min(Math.max(Math.floor(this.y[i] / cellSize), 0), gridH - 1);
      grid[gy * gridW + gx].push(i);
    }

    for (let i = 0; i < N; i++) {
      let fx = 0;
      let fy = 0;
      const xi = this.x[i];
      const yi = this.y[i];
      const si = this.species[i];

      const gx = Math.min(Math.max(Math.floor(xi / cellSize), 0), gridW - 1);
      const gy = Math.min(Math.max(Math.floor(yi / cellSize), 0), gridH - 1);

      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const nx = (gx + ox + gridW) % gridW;
          const ny = (gy + oy + gridH) % gridH;
          const cell = grid[ny * gridW + nx];

          for (let k = 0; k < cell.length; k++) {
            const j = cell[k];
            if (i === j) continue;

            let dx = this.x[j] - xi;
            let dy = this.y[j] - yi;

            if (dx > w * 0.5) dx -= w;
            else if (dx < -w * 0.5) dx += w;
            if (dy > h * 0.5) dy -= h;
            else if (dy < -h * 0.5) dy += h;

            const distSq = dx * dx + dy * dy;
            if (distSq > 0 && distSq < rMax * rMax) {
              const dist = Math.sqrt(distSq);
              let f = 0;
              if (dist < rMin) {
                f = (dist / rMin) - 1.0;
              } else {
                const sj = this.species[j];
                const coeff = this.matrix[si][sj];
                f = coeff * (1.0 - Math.abs(2.0 * dist - rMin - rMax) / rDiff);
              }
              const inv = f / dist;
              fx += dx * inv;
              fy += dy * inv;
            }
          }
        }
      }

      if (mouse && mouse.down) {
        let mdx = mouse.x - xi;
        let mdy = mouse.y - yi;
        const mDistSq = mdx * mdx + mdy * mdy;
        if (mDistSq < 200 * 200) {
          const mDist = Math.sqrt(mDistSq) + 0.1;
          const mForce = (mouse.button === 1 ? 5.0 : -5.0) * (1.0 - mDist / 200);
          fx += (mdx / mDist) * mForce;
          fy += (mdy / mDist) * mForce;
        }
      }

      this.vx[i] = (this.vx[i] * this.friction) + fx * (dt * this.forceFactor * 50.0);
      this.vy[i] = (this.vy[i] * this.friction) + fy * (dt * this.forceFactor * 50.0);

      const spd = Math.sqrt(this.vx[i] * this.vx[i] + this.vy[i] * this.vy[i]);
      if (spd > this.maxVelocity) {
        this.vx[i] = (this.vx[i] / spd) * this.maxVelocity;
        this.vy[i] = (this.vy[i] / spd) * this.maxVelocity;
      }

      this.x[i] = (this.x[i] + this.vx[i] + w) % w;
      this.y[i] = (this.y[i] + this.vy[i] + h) % h;
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const N = this.numParticles;

    ctx.fillStyle = `rgba(6, 8, 13, ${1.0 - this.trailFade})`;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'lighter';
    const pt = this.pointSize;

    for (let i = 0; i < N; i++) {
      ctx.fillStyle = SPECIES_COLORS[this.species[i]];
      ctx.beginPath();
      ctx.arc(this.x[i], this.y[i], pt, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}

/* ========================================================================= */
/* 2. Physarum Polycephalum Engine                                           */
/* ========================================================================= */
class PhysarumEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numAgents = 5000;
    this.stepSize = 1.6;
    this.sensorAngle = 35 * (Math.PI / 180);
    this.sensorDist = 14;
    this.turnAngle = 24 * (Math.PI / 180);
    this.depositAmount = 18;
    this.decayFactor = 0.08;
    this.palette = PALETTES.bioluminescence;

    this.gridW = 320;
    this.gridH = 240;
    this.trailMap = new Float32Array(this.gridW * this.gridH);
    this.blurMap = new Float32Array(this.gridW * this.gridH);

    this.x = new Float32Array(this.numAgents);
    this.y = new Float32Array(this.numAgents);
    this.angle = new Float32Array(this.numAgents);

    this.imgData = this.ctx.createImageData(this.gridW, this.gridH);
    this.init();
  }

  init() {
    const gw = this.gridW;
    const gh = this.gridH;
    const cx = gw * 0.5;
    const cy = gh * 0.5;
    for (let i = 0; i < this.numAgents; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * Math.min(gw, gh) * 0.35;
      this.x[i] = cx + Math.cos(a) * r;
      this.y[i] = cy + Math.sin(a) * r;
      this.angle[i] = Math.random() * Math.PI * 2;
    }
    this.trailMap.fill(0);
  }

  sample(x, y) {
    const gw = this.gridW;
    const gh = this.gridH;
    const ix = ((Math.floor(x) % gw) + gw) % gw;
    const iy = ((Math.floor(y) % gh) + gh) % gh;
    return this.trailMap[iy * gw + ix];
  }

  step(dt = 0.016, mouse = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const so = this.sensorAngle;
    const sd = this.sensorDist;
    const N = this.numAgents;

    for (let i = 0; i < N; i++) {
      const ang = this.angle[i];
      const xi = this.x[i];
      const yi = this.y[i];

      const sf = this.sample(xi + Math.cos(ang) * sd, yi + Math.sin(ang) * sd);
      const sl = this.sample(xi + Math.cos(ang - so) * sd, yi + Math.sin(ang - so) * sd);
      const sr = this.sample(xi + Math.cos(ang + so) * sd, yi + Math.sin(ang + so) * sd);

      if (sf > sl && sf > sr) {
      } else if (sl > sr) {
        this.angle[i] -= this.turnAngle;
      } else if (sr > sl) {
        this.angle[i] += this.turnAngle;
      } else {
        this.angle[i] += (Math.random() - 0.5) * this.turnAngle;
      }

      this.x[i] = (xi + Math.cos(this.angle[i]) * this.stepSize + gw) % gw;
      this.y[i] = (yi + Math.sin(this.angle[i]) * this.stepSize + gh) % gh;

      const idx = Math.floor(this.y[i]) * gw + Math.floor(this.x[i]);
      this.trailMap[idx] = Math.min(this.trailMap[idx] + this.depositAmount, 255);
    }

    if (mouse && mouse.down) {
      const mx = Math.floor((mouse.x / this.canvas.width) * gw);
      const my = Math.floor((mouse.y / this.canvas.height) * gh);
      for (let dy = -6; dy <= 6; dy++) {
        for (let dx = -6; dx <= 6; dx++) {
          if (dx * dx + dy * dy <= 36) {
            const idx = ((my + dy + gh) % gh) * gw + ((mx + dx + gw) % gw);
            this.trailMap[idx] = 255;
          }
        }
      }
    }

    const decay = 1.0 - this.decayFactor;
    for (let y = 0; y < gh; y++) {
      const y0 = ((y - 1 + gh) % gh) * gw;
      const y1 = y * gw;
      const y2 = ((y + 1) % gh) * gw;

      for (let x = 0; x < gw; x++) {
        const x0 = (x - 1 + gw) % gw;
        const x1 = x;
        const x2 = (x + 1) % gw;

        const sum = (
          this.trailMap[y0 + x0] + this.trailMap[y0 + x1] + this.trailMap[y0 + x2] +
          this.trailMap[y1 + x0] + this.trailMap[y1 + x1] + this.trailMap[y1 + x2] +
          this.trailMap[y2 + x0] + this.trailMap[y2 + x1] + this.trailMap[y2 + x2]
        ) * (1.0 / 9.0);

        this.blurMap[y1 + x1] = sum * decay;
      }
    }

    const temp = this.trailMap;
    this.trailMap = this.blurMap;
    this.blurMap = temp;
  }

  render() {
    const gw = this.gridW;
    const gh = this.gridH;
    const data = this.imgData.data;
    const pal = this.palette;
    const nKeys = pal.length;

    for (let i = 0; i < this.trailMap.length; i++) {
      const val = Math.min(this.trailMap[i] * 0.02, 1.0);
      const pos = val * (nKeys - 1);
      const idx0 = Math.floor(pos);
      const idx1 = Math.min(idx0 + 1, nKeys - 1);
      const frac = pos - idx0;

      const c0 = pal[idx0];
      const c1 = pal[idx1];

      const p4 = i * 4;
      data[p4]     = c0[0] + (c1[0] - c0[0]) * frac;
      data[p4 + 1] = c0[1] + (c1[1] - c0[1]) * frac;
      data[p4 + 2] = c0[2] + (c1[2] - c0[2]) * frac;
      data[p4 + 3] = 255;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = gw;
    tempCanvas.height = gh;
    tempCanvas.getContext('2d').putImageData(this.imgData, 0, 0);

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.drawImage(tempCanvas, 0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ========================================================================= */
/* 3. Curl-Noise Flow Field Engine                                           */
/* ========================================================================= */
class FlowFieldEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numParticles = 5000;
    this.scale = 0.0035;
    this.speed = 2.8;
    this.trailFade = 0.96;
    this.palette = PALETTES.spectral_velvet;

    this.x = new Float32Array(this.numParticles);
    this.y = new Float32Array(this.numParticles);
    this.vx = new Float32Array(this.numParticles);
    this.vy = new Float32Array(this.numParticles);
    this.life = new Int32Array(this.numParticles);
    this.maxLife = new Int32Array(this.numParticles);

    this.init();
  }

  curl(x, y) {
    const eps = 1.0;
    const n1 = Math.sin((y + eps) * this.scale * 3.0) + Math.cos(x * this.scale * 2.0);
    const n2 = Math.sin((y - eps) * this.scale * 3.0) + Math.cos(x * this.scale * 2.0);
    const n3 = Math.sin(y * this.scale * 3.0) + Math.cos((x + eps) * this.scale * 2.0);
    const n4 = Math.sin(y * this.scale * 3.0) + Math.cos((x - eps) * this.scale * 2.0);

    const dPdy = (n1 - n2) / (2.0 * eps);
    const dPdx = (n3 - n4) / (2.0 * eps);

    return [dPdy, -dPdx];
  }

  init() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    for (let i = 0; i < this.numParticles; i++) {
      this.respawn(i, w, h);
    }
  }

  respawn(i, w, h) {
    this.x[i] = Math.random() * w;
    this.y[i] = Math.random() * h;
    this.vx[i] = 0;
    this.vy[i] = 0;
    this.life[i] = 0;
    this.maxLife[i] = 100 + Math.floor(Math.random() * 200);
  }

  step(dt = 0.016, mouse = null) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const N = this.numParticles;

    for (let i = 0; i < N; i++) {
      const [cx, cy] = this.curl(this.x[i], this.y[i]);
      let tvx = cx * this.speed;
      let tvy = cy * this.speed;

      if (mouse && mouse.down) {
        const dx = this.x[i] - mouse.x;
        const dy = this.y[i] - mouse.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < 220 * 220) {
          const d = Math.sqrt(dSq) + 1.0;
          const factor = (mouse.button === 1 ? 8.0 : -8.0) * (1.0 - d / 220);
          tvx += (-dy / d) * factor;
          tvy += (dx / d) * factor;
        }
      }

      this.vx[i] = this.vx[i] * 0.90 + tvx * 0.10;
      this.vy[i] = this.vy[i] * 0.90 + tvy * 0.10;

      this.x[i] = (this.x[i] + this.vx[i] + w) % w;
      this.y[i] = (this.y[i] + this.vy[i] + h) % h;

      this.life[i]++;
      if (this.life[i] >= this.maxLife[i]) {
        this.respawn(i, w, h);
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const N = this.numParticles;

    ctx.fillStyle = `rgba(6, 8, 13, ${1.0 - this.trailFade})`;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'lighter';
    const pal = this.palette;

    for (let i = 0; i < N; i++) {
      const angle = Math.atan2(this.vy[i], this.vx[i]);
      const norm = (angle + Math.PI) / (Math.PI * 2);
      const cIdx = Math.floor(norm * (pal.length - 1));
      const col = pal[cIdx];

      ctx.fillStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, 0.85)`;
      ctx.fillRect(this.x[i], this.y[i], 2.0, 2.0);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}

/* ========================================================================= */
/* 4. Gray-Scott Reaction-Diffusion Engine                                   */
/* ========================================================================= */
class ReactionDiffusionEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.feed = 0.0545;
    this.kill = 0.0620;
    this.du = 0.2097;
    this.dv = 0.1050;
    this.substeps = 6;
    this.palette = PALETTES.amber_ember;

    this.gridW = 200;
    this.gridH = 150;
    const size = this.gridW * this.gridH;
    this.u = new Float32Array(size);
    this.v = new Float32Array(size);
    this.nextU = new Float32Array(size);
    this.nextV = new Float32Array(size);

    this.imgData = this.ctx.createImageData(this.gridW, this.gridH);
    this.init();
  }

  init() {
    this.u.fill(1.0);
    this.v.fill(0.0);
    const gw = this.gridW;
    const gh = this.gridH;

    for (let s = 0; s < 5; s++) {
      const cx = Math.floor(Math.random() * (gw - 40)) + 20;
      const cy = Math.floor(Math.random() * (gh - 40)) + 20;
      const r = Math.floor(Math.random() * 8) + 6;

      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy <= r * r) {
            const idx = (cy + dy) * gw + (cx + dx);
            this.u[idx] = 0.5;
            this.v[idx] = 0.25;
          }
        }
      }
    }
  }

  step(dt = 0.016, mouse = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const F = this.feed;
    const K = this.kill;
    const Du = this.du;
    const Dv = this.dv;

    for (let sub = 0; sub < this.substeps; sub++) {
      for (let y = 0; y < gh; y++) {
        const y0 = ((y - 1 + gh) % gh) * gw;
        const y1 = y * gw;
        const y2 = ((y + 1) % gh) * gw;

        for (let x = 0; x < gw; x++) {
          const x0 = (x - 1 + gw) % gw;
          const x1 = x;
          const x2 = (x + 1) % gw;

          const idx = y1 + x1;
          const uVal = this.u[idx];
          const vVal = this.v[idx];

          const lapU = (
            -uVal +
            0.20 * (this.u[y0 + x1] + this.u[y2 + x1] + this.u[y1 + x0] + this.u[y1 + x2]) +
            0.05 * (this.u[y0 + x0] + this.u[y0 + x2] + this.u[y2 + x0] + this.u[y2 + x2])
          );

          const lapV = (
            -vVal +
            0.20 * (this.v[y0 + x1] + this.v[y2 + x1] + this.v[y1 + x0] + this.v[y1 + x2]) +
            0.05 * (this.v[y0 + x0] + this.v[y0 + x2] + this.v[y2 + x0] + this.v[y2 + x2])
          );

          const uvv = uVal * vVal * vVal;
          this.nextU[idx] = Math.min(Math.max(uVal + (Du * lapU - uvv + F * (1.0 - uVal)), 0.0), 1.0);
          this.nextV[idx] = Math.min(Math.max(vVal + (Dv * lapV + uvv - (F + K) * vVal)), 0.0), 1.0);
        }
      }

      const tempU = this.u;
      this.u = this.nextU;
      this.nextU = tempU;

      const tempV = this.v;
      this.v = this.nextV;
      this.nextV = tempV;
    }

    if (mouse && mouse.down) {
      const mx = Math.floor((mouse.x / this.canvas.width) * gw);
      const my = Math.floor((mouse.y / this.canvas.height) * gh);
      for (let dy = -5; dy <= 5; dy++) {
        for (let dx = -5; dx <= 5; dx++) {
          if (dx * dx + dy * dy <= 25) {
            const idx = ((my + dy + gh) % gh) * gw + ((mx + dx + gw) % gw);
            if (mouse.button === 1) {
              this.u[idx] = 0.5;
              this.v[idx] = 0.35;
            } else {
              this.u[idx] = 1.0;
              this.v[idx] = 0.0;
            }
          }
        }
      }
    }
  }

  render() {
    const gw = this.gridW;
    const gh = this.gridH;
    const data = this.imgData.data;
    const pal = this.palette;
    const nKeys = pal.length;

    for (let i = 0; i < this.v.length; i++) {
      const val = Math.min(this.v[i] * 3.4, 1.0);
      const pos = val * (nKeys - 1);
      const idx0 = Math.floor(pos);
      const idx1 = Math.min(idx0 + 1, nKeys - 1);
      const frac = pos - idx0;

      const c0 = pal[idx0];
      const c1 = pal[idx1];

      const p4 = i * 4;
      data[p4]     = c0[0] + (c1[0] - c0[0]) * frac;
      data[p4 + 1] = c0[1] + (c1[1] - c0[1]) * frac;
      data[p4 + 2] = c0[2] + (c1[2] - c0[2]) * frac;
      data[p4 + 3] = 255;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = gw;
    tempCanvas.height = gh;
    tempCanvas.getContext('2d').putImageData(this.imgData, 0, 0);

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.drawImage(tempCanvas, 0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ========================================================================= */
/* Application Controller                                                   */
/* ========================================================================= */
const I18N = {
  fa: {
    app_title: "VANTA",
    app_descriptor: "استودیوی حیات مولد",
    engine_particle_life: "حیات ذرات",
    engine_physarum: "فیزاروم",
    engine_flow_field: "میدان جریان",
    engine_reaction_diffusion: "واکنش-پخش",
    btn_play: "اجرا",
    btn_pause: "توقف",
    btn_step: "یک گام",
    btn_reset: "بازنشانی",
    btn_seed: "سید تصادفی",
    btn_presets: "الگوها",
    btn_export: "خروجی ۴K",
    btn_record: "ضبط ویدیو",
    btn_theme: "تم",
    btn_lang: "EN",
    inspector_title: "پارامترهای شبیه‌سازی",
    matrix_title: "ماتریس برهم‌کنش گونه‌ها",
    randomize_matrix: "ماتریس تصادفی",
    status_fps: "نرخ فریم",
    status_entities: "موجودیت‌ها",
    status_latency: "تاخیر",
    modal_presets_title: "گالری الگوهای شبیه‌سازی",
    category_all: "همه",
    category_cosmic: "کیهانی",
    category_biological: "زیستی",
    category_fluid: "سیالات",
    category_abstract: "ریاضی"
  },
  en: {
    app_title: "VANTA",
    app_descriptor: "Generative Life Studio",
    engine_particle_life: "Particle Life",
    engine_physarum: "Physarum",
    engine_flow_field: "Flow Field",
    engine_reaction_diffusion: "Reaction-Diffusion",
    btn_play: "Play",
    btn_pause: "Pause",
    btn_step: "Step",
    btn_reset: "Reset",
    btn_seed: "Random Seed",
    btn_presets: "Presets",
    btn_export: "4K Capture",
    btn_record: "Record Video",
    btn_theme: "Theme",
    btn_lang: "فا",
    inspector_title: "Parameters Inspector",
    matrix_title: "Species Interaction Matrix",
    randomize_matrix: "Randomize Matrix",
    status_fps: "FPS",
    status_entities: "Entities",
    status_latency: "Latency",
    modal_presets_title: "Curated Preset Gallery",
    category_all: "All",
    category_cosmic: "Cosmic",
    category_biological: "Biological",
    category_fluid: "Fluid",
    category_abstract: "Abstract"
  }
};

const PRESETS = [
  {
    name: "Nebula Swarm",
    engine: "particle_life",
    category: "Cosmic",
    desc: "Gravitationally bound multi-species orbital clusters.",
    params: { numParticles: 3000, rMax: 90, rMin: 14, friction: 0.88 }
  },
  {
    name: "Balanced Ecosystem",
    engine: "particle_life",
    category: "Biological",
    desc: "Cyclic multi-tier predator-prey chasing patterns.",
    params: { numParticles: 2500, rMax: 80, rMin: 16, friction: 0.84 }
  },
  {
    name: "Living Coral",
    engine: "physarum",
    category: "Biological",
    desc: "Self-organizing slime mold transport network.",
    params: { numAgents: 6000, stepSize: 1.5, sensorAngle: 32, sensorDist: 14, decayFactor: 0.075 }
  },
  {
    name: "Silk Current",
    engine: "flow_field",
    category: "Fluid",
    desc: "Laminar incompressible fluid ribbons with velocity color ramps.",
    params: { numParticles: 6000, speed: 2.8, trailFade: 0.97 }
  },
  {
    name: "Diffusion Garden",
    engine: "reaction_diffusion",
    category: "Abstract",
    desc: "Pearson Coral and cellular mitosis morphogenesis.",
    params: { feed: 0.0545, kill: 0.0620, substeps: 6 }
  },
  {
    name: "Soliton Waves",
    engine: "reaction_diffusion",
    category: "Abstract",
    desc: "Solitary chemical wave pulses in low-feed medium.",
    params: { feed: 0.0300, kill: 0.0620, substeps: 7 }
  }
];

class VantaStudioApp {
  constructor() {
    this.canvas = document.getElementById('simCanvas');
    this.locale = 'fa';
    this.theme = 'dark';
    this.isPlaying = true;
    this.simSpeed = 1.0;

    this.mouse = { x: 0, y: 0, down: false, button: 1 };

    this.fps = 60;
    this.frameTime = 16.6;
    this.lastTime = performance.now();
    this.fpsTimer = performance.now();
    this.framesCount = 0;

    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.engines = {
      particle_life: new ParticleLifeEngine(this.canvas),
      physarum: new PhysarumEngine(this.canvas),
      flow_field: new FlowFieldEngine(this.canvas),
      reaction_diffusion: new ReactionDiffusionEngine(this.canvas)
    };
    this.activeEngineId = 'particle_life';

    this.initUI();
    this.initMouseInteractions();
    this.applyLocale();
    this.renderInspector();

    requestAnimationFrame((t) => this.loop(t));
  }

  get activeEngine() {
    return this.engines[this.activeEngineId];
  }

  resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    if (this.activeEngine && this.activeEngine.init) {
      this.activeEngine.init();
    }
  }

  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    if (this.isPlaying) {
      this.activeEngine.step(dt * this.simSpeed, this.mouse);
    }
    this.activeEngine.render();

    this.framesCount++;
    if (currentTime - this.fpsTimer >= 500) {
      this.fps = Math.round((this.framesCount * 1000) / (currentTime - this.fpsTimer));
      this.frameTime = (1000 / Math.max(this.fps, 1)).toFixed(1);
      this.framesCount = 0;
      this.fpsTimer = currentTime;
      this.updateHUD();
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  updateHUD() {
    const fpsVal = document.getElementById('hud-fps');
    const entVal = document.getElementById('hud-entities');
    const latVal = document.getElementById('hud-latency');
    if (fpsVal) fpsVal.innerText = `${this.fps}`;
    if (latVal) latVal.innerText = `${this.frameTime}ms`;
    if (entVal) {
      let count = 0;
      if (this.activeEngine.numParticles) count = this.activeEngine.numParticles;
      else if (this.activeEngine.numAgents) count = this.activeEngine.numAgents;
      else if (this.activeEngine.gridW) count = this.activeEngine.gridW * this.activeEngine.gridH;
      entVal.innerText = count.toLocaleString();
    }
  }

  initMouseInteractions() {
    const ring = document.getElementById('cursor-ring');

    window.addEventListener('mousemove', (e) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.mouse.x = e.clientX * dpr;
      this.mouse.y = e.clientY * dpr;
      if (ring) {
        ring.style.left = `${e.clientX}px`;
        ring.style.top = `${e.clientY}px`;
      }
    });

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('#studio-ui') && !e.target.closest('#viewport-container')) return;
      this.mouse.down = true;
      this.mouse.button = e.button === 2 ? 2 : 1;
      if (ring) ring.classList.add('active');
    });

    window.addEventListener('mouseup', () => {
      this.mouse.down = false;
      if (ring) ring.classList.remove('active');
    });

    window.addEventListener('contextmenu', (e) => {
      if (!e.target.closest('#studio-ui')) e.preventDefault();
    });
  }

  initUI() {
    document.querySelectorAll('.engine-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.engine-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeEngineId = tab.dataset.engine;
        this.activeEngine.init();
        this.renderInspector();
      });
    });

    const btnPlay = document.getElementById('btn-play');
    btnPlay.addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      btnPlay.querySelector('.btn-label').innerText = this.isPlaying ? I18N[this.locale].btn_pause : I18N[this.locale].btn_play;
      btnPlay.classList.toggle('btn-primary', this.isPlaying);
    });

    document.getElementById('btn-step').addEventListener('click', () => {
      this.activeEngine.step(0.016, this.mouse);
      this.activeEngine.render();
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
      this.activeEngine.init();
    });

    document.getElementById('btn-seed').addEventListener('click', () => {
      this.activeEngine.init(Math.floor(Math.random() * 999999));
    });

    document.getElementById('speedSlider').addEventListener('input', (e) => {
      this.simSpeed = parseFloat(e.target.value);
      document.getElementById('speedValue').innerText = `${this.simSpeed.toFixed(1)}x`;
    });

    document.getElementById('btn-theme').addEventListener('click', () => {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', this.theme);
    });

    document.getElementById('btn-lang').addEventListener('click', () => {
      this.locale = this.locale === 'fa' ? 'en' : 'fa';
      this.applyLocale();
    });

    const modal = document.getElementById('presets-modal');
    document.getElementById('btn-presets').addEventListener('click', () => {
      this.renderPresetsGrid();
      modal.classList.add('open');
    });
    document.getElementById('close-presets').addEventListener('click', () => {
      modal.classList.remove('open');
    });

    document.getElementById('btn-export').addEventListener('click', () => {
      this.exportImage();
    });

    document.getElementById('btn-record').addEventListener('click', () => {
      this.toggleVideoRecording();
    });
  }

  applyLocale() {
    const dict = I18N[this.locale];
    document.body.setAttribute('dir', this.locale === 'fa' ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.innerText = dict[key];
    });

    const btnPlay = document.getElementById('btn-play');
    if (btnPlay) {
      btnPlay.querySelector('.btn-label').innerText = this.isPlaying ? dict.btn_pause : dict.btn_play;
    }

    this.renderInspector();
  }

  renderInspector() {
    const container = document.getElementById('inspector-controls');
    if (!container) return;
    container.innerHTML = '';

    const engine = this.activeEngine;
    const eid = this.activeEngineId;

    if (eid === 'particle_life') {
      this.addSlider(container, "Particle Count", engine.numParticles, 500, 5000, 100, (v) => {
        engine.numParticles = v;
        engine.init();
      });
      this.addSlider(container, "Interaction Radius", engine.rMax, 40, 180, 5, (v) => engine.rMax = v);
      this.addSlider(container, "Repulsion Radius", engine.rMin, 8, 40, 2, (v) => engine.rMin = v);
      this.addSlider(container, "Friction", engine.friction, 0.60, 0.98, 0.01, (v) => engine.friction = v);
      this.addSlider(container, "Trail Persistence", engine.trailFade, 0.70, 0.98, 0.01, (v) => engine.trailFade = v);

      this.renderMatrixEditor(container);
    } else if (eid === 'physarum') {
      this.addSlider(container, "Agent Count", engine.numAgents, 1000, 12000, 500, (v) => {
        engine.numAgents = v;
        engine.init();
      });
      this.addSlider(container, "Sensor Angle", Math.round(engine.sensorAngle * (180 / Math.PI)), 15, 80, 1, (v) => engine.sensorAngle = v * (Math.PI / 180));
      this.addSlider(container, "Sensor Distance", engine.sensorDist, 5, 35, 1, (v) => engine.sensorDist = v);
      this.addSlider(container, "Step Size", engine.stepSize, 0.5, 4.0, 0.1, (v) => engine.stepSize = v);
      this.addSlider(container, "Decay Factor", engine.decayFactor, 0.02, 0.20, 0.01, (v) => engine.decayFactor = v);
      this.addPaletteSelector(container, engine);
    } else if (eid === 'flow_field') {
      this.addSlider(container, "Particle Count", engine.numParticles, 1000, 10000, 500, (v) => {
        engine.numParticles = v;
        engine.init();
      });
      this.addSlider(container, "Field Scale", engine.scale * 10000, 10, 80, 2, (v) => engine.scale = v / 10000);
      this.addSlider(container, "Speed", engine.speed, 1.0, 8.0, 0.2, (v) => engine.speed = v);
      this.addSlider(container, "Trail Persistence", engine.trailFade, 0.85, 0.99, 0.01, (v) => engine.trailFade = v);
      this.addPaletteSelector(container, engine);
    } else if (eid === 'reaction_diffusion') {
      this.addSlider(container, "Feed Rate (F)", engine.feed * 1000, 10, 80, 1, (v) => engine.feed = v / 1000);
      this.addSlider(container, "Kill Rate (k)", engine.kill * 1000, 40, 75, 1, (v) => engine.kill = v / 1000);
      this.addSlider(container, "Substeps", engine.substeps, 2, 12, 1, (v) => engine.substeps = v);
      this.addPaletteSelector(container, engine);
    }
  }

  addSlider(parent, label, current, min, max, step, onChange) {
    const row = document.createElement('div');
    row.className = 'control-row';

    const lblWrap = document.createElement('div');
    lblWrap.className = 'control-label-wrap';

    const lbl = document.createElement('span');
    lbl.className = 'control-label';
    lbl.innerText = label;

    const val = document.createElement('span');
    val.className = 'control-value';
    val.innerText = typeof current === 'number' && current % 1 !== 0 ? current.toFixed(2) : current;

    lblWrap.appendChild(lbl);
    lblWrap.appendChild(val);

    const input = document.createElement('input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = current;

    input.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      val.innerText = v % 1 !== 0 ? v.toFixed(2) : v;
      onChange(v);
    });

    row.appendChild(lblWrap);
    row.appendChild(input);
    parent.appendChild(row);
  }

  renderMatrixEditor(parent) {
    const engine = this.activeEngine;
    const box = document.createElement('div');
    box.className = 'matrix-container';

    const hdr = document.createElement('div');
    hdr.style.display = 'flex';
    hdr.style.justifyContent = 'space-between';
    hdr.style.alignItems = 'center';

    const title = document.createElement('span');
    title.className = 'control-label';
    title.innerText = I18N[this.locale].matrix_title;
    hdr.appendChild(title);

    const btnRand = document.createElement('button');
    btnRand.className = 'btn';
    btnRand.style.height = '24px';
    btnRand.style.padding = '0 8px';
    btnRand.style.fontSize = '10px';
    btnRand.innerText = I18N[this.locale].randomize_matrix;
    btnRand.addEventListener('click', () => {
      engine.initMatrix();
      this.renderMatrixEditor(parent);
    });
    hdr.appendChild(btnRand);
    box.appendChild(hdr);

    const grid = document.createElement('div');
    grid.className = 'matrix-grid';
    grid.style.gridTemplateColumns = `repeat(${engine.numSpecies}, 1fr)`;

    for (let r = 0; r < engine.numSpecies; r++) {
      for (let c = 0; c < engine.numSpecies; c++) {
        const val = engine.matrix[r][c];
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        cell.innerText = val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1);

        if (val > 0.05) {
          const alpha = Math.min(val, 1.0) * 0.75;
          cell.style.background = `rgba(46, 213, 115, ${alpha})`;
          cell.style.color = '#ffffff';
        } else if (val < -0.05) {
          const alpha = Math.min(Math.abs(val), 1.0) * 0.75;
          cell.style.background = `rgba(255, 71, 87, ${alpha})`;
          cell.style.color = '#ffffff';
        } else {
          cell.style.background = 'rgba(255, 255, 255, 0.06)';
          cell.style.color = '#8b9bb4';
        }

        cell.addEventListener('click', () => {
          let next = engine.matrix[r][c] + 0.4;
          if (next > 1.0) next = -1.0;
          engine.matrix[r][c] = next;
          this.renderMatrixEditor(parent);
        });

        grid.appendChild(cell);
      }
    }

    box.appendChild(grid);
    parent.appendChild(box);
  }

  addPaletteSelector(parent, engine) {
    const row = document.createElement('div');
    row.className = 'control-row';

    const lbl = document.createElement('span');
    lbl.className = 'control-label';
    lbl.innerText = "Color Palette";
    row.appendChild(lbl);

    const select = document.createElement('select');
    select.style.background = 'rgba(0,0,0,0.3)';
    select.style.color = 'var(--text-main)';
    select.style.border = '1px solid var(--border-subtle)';
    select.style.borderRadius = '6px';
    select.style.padding = '6px 10px';
    select.style.fontSize = '12px';
    select.style.outline = 'none';

    for (let key in PALETTES) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.innerText = key.replace('_', ' ').toUpperCase();
      select.appendChild(opt);
    }

    select.addEventListener('change', (e) => {
      engine.palette = PALETTES[e.target.value];
    });

    row.appendChild(select);
    parent.appendChild(row);
  }

  renderPresetsGrid() {
    const grid = document.getElementById('presets-grid');
    if (!grid) return;
    grid.innerHTML = '';

    PRESETS.forEach(p => {
      const card = document.createElement('div');
      card.className = 'preset-card';

      const badge = document.createElement('span');
      badge.className = 'preset-badge';
      badge.innerText = p.category;
      card.appendChild(badge);

      const name = document.createElement('span');
      name.className = 'preset-name';
      name.innerText = p.name;
      card.appendChild(name);

      const desc = document.createElement('span');
      desc.className = 'preset-desc';
      desc.innerText = p.desc;
      card.appendChild(desc);

      card.addEventListener('click', () => {
        this.applyPreset(p);
        document.getElementById('presets-modal').classList.remove('open');
      });

      grid.appendChild(card);
    });
  }

  applyPreset(preset) {
    if (preset.engine !== this.activeEngineId) {
      document.querySelectorAll('.engine-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.engine === preset.engine);
      });
      this.activeEngineId = preset.engine;
    }

    const eng = this.activeEngine;
    Object.assign(eng, preset.params);
    eng.init();
    this.renderInspector();
  }

  exportImage() {
    const link = document.createElement('a');
    link.download = `VANTA_${this.activeEngineId}_${Date.now()}.png`;
    link.href = this.canvas.toDataURL('image/png', 1.0);
    link.click();
  }

  toggleVideoRecording() {
    const btn = document.getElementById('btn-record');
    if (this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      btn.querySelector('.btn-label').innerText = I18N[this.locale].btn_record;
      btn.classList.remove('btn-primary');
    } else {
      this.recordedChunks = [];
      const stream = this.canvas.captureStream(60);
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VANTA_Simulation_${Date.now()}.webm`;
        a.click();
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      btn.querySelector('.btn-label').innerText = "Recording...";
      btn.classList.add('btn-primary');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new VantaStudioApp();
});
