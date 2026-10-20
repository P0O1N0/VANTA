/**
 * VANTA — 4 High-Performance Simulation Engines
 * Particle Life, Physarum Slime Mold, Curl-Noise Flow Field, Gray-Scott Reaction-Diffusion.
 */

// Palettes
export const PALETTES = {
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

export const SPECIES_COLORS = [
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
export class ParticleLifeEngine {
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

    // Spatial Grid Partitioning
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

    // Force evaluation
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

            // Torus wrap
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

      // Mouse attraction / repulsion
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

      // Velocity integration
      this.vx[i] = (this.vx[i] * this.friction) + fx * (dt * this.forceFactor * 50.0);
      this.vy[i] = (this.vy[i] * this.friction) + fy * (dt * this.forceFactor * 50.0);

      // Clamp velocity
      const spd = Math.sqrt(this.vx[i] * this.vx[i] + this.vy[i] * this.vy[i]);
      if (spd > this.maxVelocity) {
        this.vx[i] = (this.vx[i] / spd) * this.maxVelocity;
        this.vy[i] = (this.vy[i] / spd) * this.maxVelocity;
      }

      // Position update with toroidal boundary
      this.x[i] = (this.x[i] + this.vx[i] + w) % w;
      this.y[i] = (this.y[i] + this.vy[i] + h) % h;
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const N = this.numParticles;

    // Trail Fade overlay
    ctx.fillStyle = `rgba(6, 8, 13, ${1.0 - this.trailFade})`;
    ctx.fillRect(0, 0, w, h);

    // Additive glow rendering
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
/* 2. Physarum Polycephalum (Slime Mold) Engine                             */
/* ========================================================================= */
export class PhysarumEngine {
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

    // 1. Sense and Steer
    for (let i = 0; i < N; i++) {
      const ang = this.angle[i];
      const xi = this.x[i];
      const yi = this.y[i];

      const sf = this.sample(xi + Math.cos(ang) * sd, yi + Math.sin(ang) * sd);
      const sl = this.sample(xi + Math.cos(ang - so) * sd, yi + Math.sin(ang - so) * sd);
      const sr = this.sample(xi + Math.cos(ang + so) * sd, yi + Math.sin(ang + so) * sd);

      if (sf > sl && sf > sr) {
        // Continue forward
      } else if (sl > sr) {
        this.angle[i] -= this.turnAngle;
      } else if (sr > sl) {
        this.angle[i] += this.turnAngle;
      } else {
        this.angle[i] += (Math.random() - 0.5) * this.turnAngle;
      }

      // Move forward
      this.x[i] = (xi + Math.cos(this.angle[i]) * this.stepSize + gw) % gw;
      this.y[i] = (yi + Math.sin(this.angle[i]) * this.stepSize + gh) % gh;

      // Deposit
      const idx = Math.floor(this.y[i]) * gw + Math.floor(this.x[i]);
      this.trailMap[idx] = Math.min(this.trailMap[idx] + this.depositAmount, 255);
    }

    // Mouse chemoattractant seeding
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

    // 2. Diffuse & Decay (3x3 Box blur)
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

    // Swap maps
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

    // Scale up to canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = gw;
    tempCanvas.height = gh;
    tempCanvas.getContext('2d').putImageData(this.imgData, 0, 0);

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.drawImage(tempCanvas, 0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ========================================================================= */
/* 3. Curl-Noise Flow Field Engine                                          */
/* ========================================================================= */
export class FlowFieldEngine {
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

    this.vortices = [];
    this.init();
  }

  noise(x, y) {
    // Fast simplex-like procedural pseudo-gradient noise
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return (s - Math.floor(s)) * 2.0 - 1.0;
  }

  curl(x, y) {
    const eps = 1.0;
    // Central differences
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

      // Mouse vortex influence
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
export class ReactionDiffusionEngine {
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

    // Seed 4-6 circular colonies
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

          // 9-point Laplacian stencil
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

      // Swap
      const tempU = this.u;
      this.u = this.nextU;
      this.nextU = tempU;

      const tempV = this.v;
      this.v = this.nextV;
      this.nextV = tempV;
    }

    // Mouse reactant painting
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
