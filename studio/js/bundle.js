/**
 * VANTA Studio — Complete Standalone High-Performance Simulation Engine & UI
 * Zero Server Dependency, Hardware-Accelerated Blit Shaders, Ramotion Animated Tab Bar,
 * Dynamic Sliders, and Environmental Dynamics.
 */

// Color Palettes
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
  "#9b59b6"  // Purple
];

/* ========================================================================= */
/* 1. Particle Life Engine                                                  */
/* ========================================================================= */
class ParticleLifeEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numParticles = 1600;
    this.numSpecies = 5;
    this.rMax = 75;
    this.rMin = 14;
    this.friction = 0.88;
    this.forceFactor = 1.0;
    this.maxVelocity = 8.0;
    this.trailFade = 0.90;
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
    const w = this.canvas.width || 1200;
    const h = this.canvas.height || 800;
    for (let i = 0; i < this.numParticles; i++) {
      this.x[i] = Math.random() * w;
      this.y[i] = Math.random() * h;
      this.vx[i] = 0;
      this.vy[i] = 0;
      this.species[i] = Math.floor(Math.random() * this.numSpecies);
    }
  }

  step(dt = 0.016, mouse = null, env = null) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const N = this.numParticles;
    const rMax = this.rMax;
    const rMin = this.rMin;
    const rDiff = Math.max(rMax - rMin, 1);

    const o2 = env ? env.oxygen : 1.0;
    const temp = env ? env.temperature : 24.0;
    const visc = env ? env.viscosity : 0.05;
    const grav = env ? env.gravity : 0.0;

    const thermalJitter = Math.max((temp - 4.0) / 40.0, 0.0) * 10.0;
    const effectiveFriction = Math.max(0.4, (this.friction - visc * 0.7));

    // Spatial hash grid
    const cellSize = Math.max(rMax, 25);
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
      let fy = grav * 80.0;
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
              const inv = (f * o2) / dist;
              fx += dx * inv;
              fy += dy * inv;
            }
          }
        }
      }

      if (thermalJitter > 0) {
        fx += (Math.random() - 0.5) * thermalJitter;
        fy += (Math.random() - 0.5) * thermalJitter;
      }

      if (mouse && mouse.down) {
        let mdx = mouse.x - xi;
        let mdy = mouse.y - yi;
        const mDistSq = mdx * mdx + mdy * mdy;
        if (mDistSq < 160000 && mDistSq > 10) {
          const mDist = Math.sqrt(mDistSq);
          const pull = (mouse.button === 2 ? -1800 : 1800) / mDist;
          fx += (mdx / mDist) * pull;
          fy += (mdy / mDist) * pull;
        }
      }

      this.vx[i] = (this.vx[i] + fx * this.forceFactor * dt * 45.0) * effectiveFriction;
      this.vy[i] = (this.vy[i] + fy * this.forceFactor * dt * 45.0) * effectiveFriction;

      const maxSpd = this.maxVelocity * (0.4 + o2 * 0.6);
      const curSpd = Math.sqrt(this.vx[i] * this.vx[i] + this.vy[i] * this.vy[i]);
      if (curSpd > maxSpd) {
        const factor = maxSpd / curSpd;
        this.vx[i] *= factor;
        this.vy[i] *= factor;
      }

      this.x[i] = (this.x[i] + this.vx[i] + w) % w;
      this.y[i] = (this.y[i] + this.vy[i] + h) % h;
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = `rgba(6, 8, 14, ${1.0 - this.trailFade})`;
    ctx.fillRect(0, 0, w, h);

    const rad = this.pointSize;
    for (let i = 0; i < this.numParticles; i++) {
      ctx.fillStyle = SPECIES_COLORS[this.species[i]];
      ctx.beginPath();
      ctx.arc(this.x[i], this.y[i], rad, 0, 6.28318);
      ctx.fill();
    }
  }
}

/* ========================================================================= */
/* 2. Physarum Slime Mold Engine (Hardware-Accelerated Bilinear Blit)         */
/* ========================================================================= */
class PhysarumEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numAgents = 22000;
    this.sensorAngle = 0.45;
    this.sensorDist = 9.0;
    this.turnSpeed = 0.35;
    this.moveSpeed = 1.6;
    this.decayFactor = 0.94;
    this.depositAmount = 5.0;

    // Fixed internal simulation grid (320x200 = 64,000 pixels)
    this.gridW = 320;
    this.gridH = 200;
    this.offCanvas = document.createElement('canvas');
    this.offCanvas.width = this.gridW;
    this.offCanvas.height = this.gridH;
    this.offCtx = this.offCanvas.getContext('2d', { alpha: false });
    this.offImgData = this.offCtx.createImageData(this.gridW, this.gridH);

    this.trailMap = new Float32Array(this.gridW * this.gridH);
    this.agentX = new Float32Array(this.numAgents);
    this.agentY = new Float32Array(this.numAgents);
    this.agentAngle = new Float32Array(this.numAgents);

    this.palette = PALETTES.bioluminescence;
    this.init();
  }

  init() {
    const gw = this.gridW;
    const gh = this.gridH;
    this.trailMap.fill(0);

    const centerX = gw * 0.5;
    const centerY = gh * 0.5;
    const spawnRad = Math.min(gw, gh) * 0.38;

    for (let i = 0; i < this.numAgents; i++) {
      const theta = Math.random() * 6.28318;
      const r = Math.sqrt(Math.random()) * spawnRad;
      this.agentX[i] = centerX + Math.cos(theta) * r;
      this.agentY[i] = centerY + Math.sin(theta) * r;
      this.agentAngle[i] = theta + Math.PI;
    }
  }

  step(dt = 0.016, mouse = null, env = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const trail = this.trailMap;

    const o2 = env ? env.oxygen : 1.0;
    const temp = env ? env.temperature : 24.0;
    const visc = env ? env.viscosity : 0.05;
    const grav = env ? env.gravity : 0.0;

    const curDecay = Math.min(0.98, this.decayFactor - (temp - 24.0) * 0.001);
    const curDeposit = this.depositAmount * (0.5 + o2 * 0.5);
    const curSpeed = this.moveSpeed * (1.0 - visc * 1.5);
    const sDist = this.sensorDist;
    const sAngle = this.sensorAngle;

    const sampleTrail = (x, y) => {
      let gx = Math.floor(x);
      let gy = Math.floor(y);
      gx = (gx % gw + gw) % gw;
      gy = (gy % gh + gh) % gh;
      return trail[gy * gw + gx];
    };

    for (let i = 0; i < this.numAgents; i++) {
      const a = this.agentAngle[i];
      const x = this.agentX[i];
      const y = this.agentY[i];

      const fX = x + Math.cos(a) * sDist;
      const fY = y + Math.sin(a) * sDist;
      const fVal = sampleTrail(fX, fY);

      const lX = x + Math.cos(a - sAngle) * sDist;
      const lY = y + Math.sin(a - sAngle) * sDist;
      const lVal = sampleTrail(lX, lY);

      const rX = x + Math.cos(a + sAngle) * sDist;
      const rY = y + Math.sin(a + sAngle) * sDist;
      const rVal = sampleTrail(rX, rY);

      let steer = 0;
      if (fVal > lVal && fVal > rVal) {
        // Continue forward
      } else if (fVal < lVal && fVal < rVal) {
        steer = (Math.random() < 0.5 ? 1 : -1) * this.turnSpeed;
      } else if (lVal > rVal) {
        steer = -this.turnSpeed;
      } else if (rVal > lVal) {
        steer = this.turnSpeed;
      }

      this.agentAngle[i] += steer;

      if (mouse && mouse.down) {
        const mx = (mouse.x / this.canvas.width) * gw;
        const my = (mouse.y / this.canvas.height) * gh;
        const dx = mx - x;
        const dy = my - y;
        if (dx * dx + dy * dy < 3500) {
          const targetAngle = Math.atan2(dy, dx);
          this.agentAngle[i] += (mouse.button === 2 ? -1 : 1) * (targetAngle - this.agentAngle[i]) * 0.15;
        }
      }

      let nx = x + Math.cos(this.agentAngle[i]) * curSpeed;
      let ny = y + Math.sin(this.agentAngle[i]) * curSpeed + grav * 0.6;

      this.agentX[i] = (nx % gw + gw) % gw;
      this.agentY[i] = (ny % gh + gh) % gh;

      const dgx = Math.min(Math.max(Math.floor(this.agentX[i]), 0), gw - 1);
      const dgy = Math.min(Math.max(Math.floor(this.agentY[i]), 0), gh - 1);
      trail[dgy * gw + dgx] = Math.min(trail[dgy * gw + dgx] + curDeposit, 255);
    }

    for (let i = 0; i < trail.length; i++) {
      trail[i] *= curDecay;
    }
  }

  render() {
    const trail = this.trailMap;
    const data = this.offImgData.data;
    const pal = this.palette;

    let pIdx = 0;
    for (let i = 0; i < trail.length; i++) {
      const val = Math.min(trail[i] / 40.0, 1.0);
      if (val <= 0.01) {
        data[pIdx] = pal[0][0];
        data[pIdx + 1] = pal[0][1];
        data[pIdx + 2] = pal[0][2];
        data[pIdx + 3] = 255;
      } else {
        const t = val * 3.0;
        const idx = Math.min(Math.floor(t), 2);
        const frac = t - idx;
        const c1 = pal[idx];
        const c2 = pal[idx + 1];

        data[pIdx] = Math.floor(c1[0] + (c2[0] - c1[0]) * frac);
        data[pIdx + 1] = Math.floor(c1[1] + (c2[1] - c1[1]) * frac);
        data[pIdx + 2] = Math.floor(c1[2] + (c2[2] - c1[2]) * frac);
        data[pIdx + 3] = 255;
      }
      pIdx += 4;
    }

    this.offCtx.putImageData(this.offImgData, 0, 0);

    // Hardware accelerated GPU bilinear blit
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.ctx.drawImage(this.offCanvas, 0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ========================================================================= */
/* 3. Curl-Noise Flow Field Engine                                          */
/* ========================================================================= */
class FlowFieldEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numParticles = 7500;
    this.trailLength = 0.94;
    this.noiseScale = 0.0035;
    this.noiseSpeed = 0.2;
    this.particleSpeed = 2.2;

    this.x = new Float32Array(this.numParticles);
    this.y = new Float32Array(this.numParticles);
    this.prevX = new Float32Array(this.numParticles);
    this.prevY = new Float32Array(this.numParticles);
    this.age = new Int32Array(this.numParticles);
    this.maxAge = new Int32Array(this.numParticles);

    this.time = 0;
    this.palette = PALETTES.neon_cyber;
    this.init();
  }

  init() {
    const w = this.canvas.width || 1200;
    const h = this.canvas.height || 800;
    for (let i = 0; i < this.numParticles; i++) {
      this.x[i] = Math.random() * w;
      this.y[i] = Math.random() * h;
      this.prevX[i] = this.x[i];
      this.prevY[i] = this.y[i];
      this.maxAge[i] = Math.floor(100 + Math.random() * 200);
      this.age[i] = Math.floor(Math.random() * this.maxAge[i]);
    }
  }

  step(dt = 0.016, mouse = null, env = null) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const o2 = env ? env.oxygen : 1.0;
    const temp = env ? env.temperature : 24.0;
    const visc = env ? env.viscosity : 0.05;
    const grav = env ? env.gravity : 0.0;

    const spd = this.particleSpeed * (1.0 - visc) * (0.6 + o2 * 0.4);
    const chaos = 1.0 + Math.max(temp - 24, 0) * 0.03;

    this.time += dt * this.noiseSpeed * chaos;
    const t = this.time;
    const nScale = this.noiseScale;

    for (let i = 0; i < this.numParticles; i++) {
      this.prevX[i] = this.x[i];
      this.prevY[i] = this.y[i];

      const nx = this.x[i] * nScale;
      const ny = this.y[i] * nScale;

      const angle = (Math.sin(nx * 3.0 + t) + Math.cos(ny * 3.0 - t)) * Math.PI * 2.0;
      let vx = Math.cos(angle) * spd;
      let vy = (Math.sin(angle) * spd) + grav * 1.5;

      if (mouse && mouse.down) {
        const mdx = mouse.x - this.x[i];
        const mdy = mouse.y - this.y[i];
        const mDistSq = mdx * mdx + mdy * mdy;
        if (mDistSq < 80000 && mDistSq > 10) {
          const mDist = Math.sqrt(mDistSq);
          const swirl = (mouse.button === 2 ? -4.0 : 4.0);
          vx += (-mdy / mDist) * swirl;
          vy += (mdx / mDist) * swirl;
        }
      }

      this.x[i] += vx;
      this.y[i] += vy;
      this.age[i]++;

      if (this.age[i] > this.maxAge[i] || this.x[i] < 0 || this.x[i] >= w || this.y[i] < 0 || this.y[i] >= h) {
        this.x[i] = Math.random() * w;
        this.y[i] = Math.random() * h;
        this.prevX[i] = this.x[i];
        this.prevY[i] = this.y[i];
        this.age[i] = 0;
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = `rgba(6, 8, 14, ${1.0 - this.trailLength})`;
    ctx.fillRect(0, 0, w, h);

    ctx.lineWidth = 1.4;
    const pal = this.palette;
    ctx.strokeStyle = `rgb(${pal[2][0]}, ${pal[2][1]}, ${pal[2][2]})`;

    ctx.beginPath();
    for (let i = 0; i < this.numParticles; i++) {
      const dx = this.x[i] - this.prevX[i];
      const dy = this.y[i] - this.prevY[i];
      if (dx * dx + dy * dy < 200) {
        ctx.moveTo(this.prevX[i], this.prevY[i]);
        ctx.lineTo(this.x[i], this.y[i]);
      }
    }
    ctx.stroke();
  }
}

/* ========================================================================= */
/* 4. Gray-Scott Reaction-Diffusion Engine (Hardware-Accelerated Blit)       */
/* ========================================================================= */
class ReactionDiffusionEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.gridW = 240;
    this.gridH = 150;
    this.offCanvas = document.createElement('canvas');
    this.offCanvas.width = this.gridW;
    this.offCanvas.height = this.gridH;
    this.offCtx = this.offCanvas.getContext('2d', { alpha: false });
    this.offImgData = this.offCtx.createImageData(this.gridW, this.gridH);

    this.feed = 0.0545;
    this.kill = 0.0620;
    this.diffU = 1.0;
    this.diffV = 0.5;
    this.substeps = 5;

    const size = this.gridW * this.gridH;
    this.u = new Float32Array(size);
    this.v = new Float32Array(size);
    this.nextU = new Float32Array(size);
    this.nextV = new Float32Array(size);

    this.palette = PALETTES.spectral_velvet;
    this.init();
  }

  init() {
    const size = this.gridW * this.gridH;
    this.u.fill(1.0);
    this.v.fill(0.0);

    const gw = this.gridW;
    const gh = this.gridH;
    const seedCenters = [
      [Math.floor(gw * 0.5), Math.floor(gh * 0.5)],
      [Math.floor(gw * 0.3), Math.floor(gh * 0.4)],
      [Math.floor(gw * 0.7), Math.floor(gh * 0.6)]
    ];

    seedCenters.forEach(([cx, cy]) => {
      for (let y = cy - 6; y <= cy + 6; y++) {
        for (let x = cx - 6; x <= cx + 6; x++) {
          if (x >= 0 && x < gw && y >= 0 && y < gh) {
            const idx = y * gw + x;
            this.u[idx] = 0.5 + Math.random() * 0.1;
            this.v[idx] = 0.25 + Math.random() * 0.1;
          }
        }
      }
    });
  }

  step(dt = 0.016, mouse = null, env = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const u = this.u;
    const v = this.v;
    const nu = this.nextU;
    const nv = this.nextV;

    const o2 = env ? env.oxygen : 1.0;
    const temp = env ? env.temperature : 24.0;
    const tempScale = 1.0 + (temp - 24.0) * 0.01;

    const du = this.diffU * tempScale;
    const dv = this.diffV * tempScale;
    const F = this.feed * (0.8 + o2 * 0.2);
    const K = this.kill;

    for (let step = 0; step < this.substeps; step++) {
      for (let y = 1; y < gh - 1; y++) {
        const row = y * gw;
        const rowUp = (y - 1) * gw;
        const rowDown = (y + 1) * gw;

        for (let x = 1; x < gw - 1; x++) {
          const idx = row + x;
          const uVal = u[idx];
          const vVal = v[idx];

          const lapU = (
            u[rowUp + x] + u[rowDown + x] + u[row + x - 1] + u[row + x + 1]
          ) * 0.2 + (
            u[rowUp + x - 1] + u[rowUp + x + 1] + u[rowDown + x - 1] + u[rowDown + x + 1]
          ) * 0.05 - uVal;

          const lapV = (
            v[rowUp + x] + v[rowDown + x] + v[row + x - 1] + v[row + x + 1]
          ) * 0.2 + (
            v[rowUp + x - 1] + v[rowUp + x + 1] + v[rowDown + x - 1] + v[rowDown + x + 1]
          ) * 0.05 - vVal;

          const uvv = uVal * vVal * vVal;
          nu[idx] = Math.min(Math.max(uVal + (du * lapU - uvv + F * (1.0 - uVal)), 0.0), 1.0);
          nv[idx] = Math.min(Math.max(vVal + (dv * lapV + uvv - (F + K) * vVal), 0.0), 1.0);
        }
      }

      if (mouse && mouse.down) {
        const mx = Math.floor((mouse.x / this.canvas.width) * gw);
        const my = Math.floor((mouse.y / this.canvas.height) * gh);
        for (let dy = -4; dy <= 4; dy++) {
          for (let dx = -4; dx <= 4; dx++) {
            const px = mx + dx;
            const py = my + dy;
            if (px >= 1 && px < gw - 1 && py >= 1 && py < gh - 1) {
              const pIdx = py * gw + px;
              nu[pIdx] = 0.4;
              nv[pIdx] = 0.6;
            }
          }
        }
      }

      this.u.set(nu);
      this.v.set(nv);
    }
  }

  render() {
    const v = this.v;
    const data = this.offImgData.data;
    const pal = this.palette;

    let pIdx = 0;
    for (let i = 0; i < v.length; i++) {
      const val = Math.min(Math.max(v[i] * 2.8, 0.0), 1.0);
      const t = val * 3.0;
      const idx = Math.min(Math.floor(t), 2);
      const frac = t - idx;
      const c1 = pal[idx];
      const c2 = pal[idx + 1];

      data[pIdx] = Math.floor(c1[0] + (c2[0] - c1[0]) * frac);
      data[pIdx + 1] = Math.floor(c1[1] + (c2[1] - c1[1]) * frac);
      data[pIdx + 2] = Math.floor(c1[2] + (c2[2] - c1[2]) * frac);
      data[pIdx + 3] = 255;
      pIdx += 4;
    }

    this.offCtx.putImageData(this.offImgData, 0, 0);

    // Hardware accelerated GPU bilinear blit
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.ctx.drawImage(this.offCanvas, 0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ========================================================================= */
/* Curated Presets                                                          */
/* ========================================================================= */
const PRESETS = [
  {
    id: "primordial_soup",
    engine: "particle_life",
    name: "Primordial Soup",
    desc: "Chaotic early-universe cellular symbiosis with balanced multi-species clustering.",
    params: { rMax: 85, rMin: 14, friction: 0.88, particles: 1600 }
  },
  {
    id: "planetary_rings",
    engine: "particle_life",
    name: "Cosmic Orbital Ring",
    desc: "Vortical planetary accretion disk with orbital friction and species clustering.",
    params: { rMax: 100, rMin: 20, friction: 0.92, particles: 2200 }
  },
  {
    id: "crystalline_lattice",
    engine: "particle_life",
    name: "Crystalline Geometry",
    desc: "Quasi-crystal lattices formed by strong localized inter-particle repulsion.",
    params: { rMax: 65, rMin: 26, friction: 0.78, particles: 1200 }
  },
  {
    id: "slime_vascular",
    engine: "physarum",
    name: "Vascular Venation",
    desc: "Interconnected transport network resembling bio-vascular leaf venation.",
    params: { sensorAngle: 0.45, sensorDist: 10.0, turnSpeed: 0.35, decay: 0.95 }
  },
  {
    id: "neural_connectome",
    engine: "physarum",
    name: "Neural Connectome",
    desc: "High-density dendritic filaments forming cognitive synaptic highways.",
    params: { sensorAngle: 0.30, sensorDist: 18.0, turnSpeed: 0.50, decay: 0.92 }
  },
  {
    id: "oceanic_turbulence",
    engine: "flow_field",
    name: "Oceanic Vortices",
    desc: "Divergence-free fluid flow lines tracing deep oceanic atmospheric currents.",
    params: { speed: 2.4, noiseScale: 0.0035, trail: 0.94 }
  },
  {
    id: "turing_coral",
    engine: "reaction_diffusion",
    name: "Turing Reef Coral",
    desc: "Labyrinthine Turing patterns and bio-calcification morphogenetic growth.",
    params: { feed: 0.0545, kill: 0.0620, substeps: 5 }
  },
  {
    id: "solitary_soliton",
    engine: "reaction_diffusion",
    name: "Soliton Wave Pulses",
    desc: "Traveling solitary wave pulses maintaining coherence in low-feed substrates.",
    params: { feed: 0.0300, kill: 0.0620, substeps: 5 }
  }
];

/* ========================================================================= */
/* Main Studio Application Controller                                      */
/* ========================================================================= */
class VantaStudioApp {
  constructor() {
    this.canvas = document.getElementById('simCanvas');
    this.theme = 'dark';
    this.isPlaying = true;
    this.simSpeed = 1.0;

    this.mouse = { x: 0, y: 0, down: false, button: 1 };

    this.environment = {
      oxygen: 1.0,     // 0.0 - 2.0 (100%)
      temperature: 24, // -10 - 80 (°C)
      viscosity: 0.05, // 0.01 - 0.30
      gravity: 0.0     // -1.0 - 1.0
    };

    this.fps = 60;
    this.frameTime = 16.6;
    this.lastTime = performance.now();
    this.fpsTimer = performance.now();
    this.framesCount = 0;

    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];

    // CRITICAL: Instantiate engines BEFORE resizeCanvas()
    this.engines = {
      particle_life: new ParticleLifeEngine(this.canvas),
      physarum: new PhysarumEngine(this.canvas),
      flow_field: new FlowFieldEngine(this.canvas),
      reaction_diffusion: new ReactionDiffusionEngine(this.canvas)
    };
    this.activeEngineId = 'particle_life';

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.initUI();
    this.initMouseInteractions();
    this.renderInspector();

    // Position initial Ramotion Tab Pill
    requestAnimationFrame(() => {
      const activeTab = document.querySelector('.engine-tab.active');
      if (activeTab) this.updateTabPill(activeTab);
    });

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

    if (this.isPlaying && this.activeEngine) {
      this.activeEngine.step(dt * this.simSpeed, this.mouse, this.environment);
    }
    if (this.activeEngine) {
      this.activeEngine.render();
    }

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
    const engVal = document.getElementById('hud-engine');
    const coordVal = document.getElementById('hud-coords');

    if (fpsVal) fpsVal.innerText = `${this.fps}`;
    if (latVal) latVal.innerText = `${this.frameTime}ms`;
    if (coordVal) coordVal.innerText = `X: ${Math.round(this.mouse.x)} Y: ${Math.round(this.mouse.y)}`;

    const engineNames = {
      particle_life: "Particle Life",
      physarum: "Physarum Polycephalum",
      flow_field: "Curl-Noise Flow",
      reaction_diffusion: "Reaction-Diffusion"
    };
    if (engVal) engVal.innerText = engineNames[this.activeEngineId] || this.activeEngineId;

    if (entVal && this.activeEngine) {
      let count = 0;
      if (this.activeEngine.numParticles) count = this.activeEngine.numParticles;
      else if (this.activeEngine.numAgents) count = this.activeEngine.numAgents;
      else if (this.activeEngine.gridW) count = this.activeEngine.gridW * this.activeEngine.gridH;
      entVal.innerText = count.toLocaleString();
    }
  }

  updateTabPill(tab) {
    const pill = document.getElementById('tab-pill');
    if (!pill || !tab) return;
    const nav = document.getElementById('engine-tabs-nav');
    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    pill.style.width = `${tabRect.width}px`;
    pill.style.transform = `translateX(${tabRect.left - navRect.left - 4}px)`;
  }

  setupSlider(id, onInput) {
    const el = document.getElementById(id);
    if (!el) return;
    const update = () => {
      const min = parseFloat(el.min) || 0;
      const max = parseFloat(el.max) || 100;
      const val = parseFloat(el.value);
      const pct = Math.min(Math.max(((val - min) / (max - min)) * 100, 0), 100);
      el.style.background = `linear-gradient(to right, var(--accent-purple) 0%, var(--accent-purple) ${pct}%, rgba(255,255,255,0.12) ${pct}%, rgba(255,255,255,0.12) 100%)`;
      if (onInput) onInput(val, el);
    };
    el.addEventListener('input', update);
    update();
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
      if (e.target.closest('#topbar') || e.target.closest('#inspector') || e.target.closest('.modal-overlay')) return;
      this.mouse.down = true;
      this.mouse.button = e.button === 2 ? 2 : 1;
      if (ring) ring.classList.add('active');
    });

    window.addEventListener('mouseup', () => {
      this.mouse.down = false;
      if (ring) ring.classList.remove('active');
    });

    window.addEventListener('contextmenu', (e) => {
      if (!e.target.closest('#inspector') && !e.target.closest('#topbar')) {
        e.preventDefault();
      }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        document.getElementById('btn-play').click();
      } else if (e.code === 'KeyN') {
        document.getElementById('btn-step').click();
      } else if (e.code === 'KeyC') {
        document.getElementById('btn-reset').click();
      } else if (e.code === 'KeyR') {
        document.getElementById('btn-seed').click();
      } else if (e.code === 'KeyP') {
        document.getElementById('btn-presets').click();
      } else if (e.code === 'Digit1') {
        document.querySelector('.engine-tab[data-engine="particle_life"]').click();
      } else if (e.code === 'Digit2') {
        document.querySelector('.engine-tab[data-engine="physarum"]').click();
      } else if (e.code === 'Digit3') {
        document.querySelector('.engine-tab[data-engine="flow_field"]').click();
      } else if (e.code === 'Digit4') {
        document.querySelector('.engine-tab[data-engine="reaction_diffusion"]').click();
      }
    });
  }

  initUI() {
    // Engine Tab Switching with Ramotion Pill Animation
    document.querySelectorAll('.engine-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.engine-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.updateTabPill(tab);
        this.activeEngineId = tab.dataset.engine;
        this.activeEngine.init();
        this.renderInspector();
        this.updateHUD();
      });
    });

    // Play / Pause
    const btnPlay = document.getElementById('btn-play');
    btnPlay.addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      btnPlay.querySelector('.btn-label').innerText = this.isPlaying ? "Pause" : "Play";
      btnPlay.classList.toggle('btn-primary', this.isPlaying);
      const hudStatus = document.getElementById('hud-status');
      if (hudStatus) hudStatus.innerText = this.isPlaying ? "SIMULATION ACTIVE" : "SIMULATION PAUSED";
    });

    // Step
    document.getElementById('btn-step').addEventListener('click', () => {
      if (this.activeEngine) {
        this.activeEngine.step(0.016, this.mouse, this.environment);
        this.activeEngine.render();
      }
    });

    // Reset
    document.getElementById('btn-reset').addEventListener('click', () => {
      if (this.activeEngine) this.activeEngine.init();
    });

    // Seed Randomizer
    document.getElementById('btn-seed').addEventListener('click', () => {
      if (this.activeEngine) {
        if (this.activeEngine.initMatrix) this.activeEngine.initMatrix();
        this.activeEngine.init(Math.floor(Math.random() * 999999));
        this.renderInspector();
      }
    });

    // Speed Slider
    this.setupSlider('speedSlider', (val) => {
      this.simSpeed = val;
      document.getElementById('speedValue').innerText = `${val.toFixed(1)}x`;
    });

    // Theme Toggle
    document.getElementById('btn-theme').addEventListener('click', () => {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', this.theme);
    });

    // Inspector Minimize Toggle
    document.getElementById('toggle-inspector').addEventListener('click', () => {
      const inspector = document.getElementById('inspector');
      inspector.classList.toggle('collapsed');
    });

    // Environmental Sliders with live gradient fill
    this.setupSlider('envOxygen', (val) => {
      this.environment.oxygen = val / 100.0;
      document.getElementById('envOxygenVal').innerText = `${Math.round(val)}%`;
    });

    this.setupSlider('envTemp', (val) => {
      this.environment.temperature = val;
      document.getElementById('envTempVal').innerText = `${Math.round(val)}°C`;
    });

    this.setupSlider('envViscosity', (val) => {
      this.environment.viscosity = val;
      document.getElementById('envViscosityVal').innerText = val.toFixed(2);
    });

    this.setupSlider('envGravity', (val) => {
      this.environment.gravity = val;
      let label = "Zero-G";
      if (val > 0.05) label = `+${val.toFixed(1)}g (Down)`;
      else if (val < -0.05) label = `${val.toFixed(1)}g (Up)`;
      document.getElementById('envGravityVal').innerText = label;
    });

    // Presets Modal
    const modal = document.getElementById('presets-modal');
    document.getElementById('btn-presets').addEventListener('click', () => {
      this.renderPresetsGrid();
      modal.classList.add('open');
    });
    document.getElementById('close-presets').addEventListener('click', () => {
      modal.classList.remove('open');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });

    // 4K PNG Snapshot Export
    document.getElementById('btn-export').addEventListener('click', () => {
      this.exportImage();
    });

    // WebM Video Recording
    document.getElementById('btn-record').addEventListener('click', () => {
      this.toggleVideoRecording();
    });
  }

  renderInspector() {
    const container = document.getElementById('engine-params-container');
    if (!container) return;
    container.innerHTML = '';

    const engine = this.activeEngine;
    if (this.activeEngineId === 'particle_life') {
      container.innerHTML = `
        <div class="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>PARTICLE LIFE PARAMETERS</span>
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Population Count</label>
            <span class="param-val" id="val-particles">${engine.numParticles}</span>
          </div>
          <input type="range" id="param-particles" min="600" max="3600" step="200" value="${engine.numParticles}">
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Interaction Radius (R_max)</label>
            <span class="param-val" id="val-rmax">${engine.rMax}px</span>
          </div>
          <input type="range" id="param-rmax" min="30" max="150" step="5" value="${engine.rMax}">
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Core Repulsion (R_min)</label>
            <span class="param-val" id="val-rmin">${engine.rMin}px</span>
          </div>
          <input type="range" id="param-rmin" min="6" max="32" step="2" value="${engine.rMin}">
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Substrate Friction</label>
            <span class="param-val" id="val-fric">${engine.friction.toFixed(2)}</span>
          </div>
          <input type="range" id="param-fric" min="0.65" max="0.98" step="0.01" value="${engine.friction}">
        </div>

        <div class="matrix-container">
          <div class="section-title" style="margin-bottom: 4px;">
            <span>SPECIES ATTRACTION MATRIX</span>
          </div>
          <div id="matrix-grid" class="matrix-grid"></div>
        </div>
      `;

      this.setupSlider('param-particles', (val) => {
        engine.numParticles = Math.round(val);
        engine.x = new Float32Array(engine.numParticles);
        engine.y = new Float32Array(engine.numParticles);
        engine.vx = new Float32Array(engine.numParticles);
        engine.vy = new Float32Array(engine.numParticles);
        engine.species = new Int32Array(engine.numParticles);
        engine.init();
        document.getElementById('val-particles').innerText = engine.numParticles;
        this.updateHUD();
      });

      this.setupSlider('param-rmax', (val) => {
        engine.rMax = Math.round(val);
        document.getElementById('val-rmax').innerText = `${engine.rMax}px`;
      });

      this.setupSlider('param-rmin', (val) => {
        engine.rMin = Math.round(val);
        document.getElementById('val-rmin').innerText = `${engine.rMin}px`;
      });

      this.setupSlider('param-fric', (val) => {
        engine.friction = val;
        document.getElementById('val-fric').innerText = val.toFixed(2);
      });

      // Render Matrix Cells
      const grid = document.getElementById('matrix-grid');
      grid.innerHTML = '';
      for (let i = 0; i < engine.numSpecies; i++) {
        for (let j = 0; j < engine.numSpecies; j++) {
          const cell = document.createElement('div');
          cell.className = 'matrix-cell';
          const val = engine.matrix[i][j];
          cell.innerText = val.toFixed(1);
          cell.style.backgroundColor = val >= 0 ? `rgba(0, 245, 212, ${Math.abs(val) * 0.75})` : `rgba(255, 71, 87, ${Math.abs(val) * 0.75})`;
          cell.style.color = '#fff';
          cell.title = `Species ${i + 1} to Species ${j + 1}: ${val.toFixed(2)}`;

          cell.addEventListener('click', () => {
            let newVal = engine.matrix[i][j] + 0.4;
            if (newVal > 1.0) newVal = -1.0;
            engine.matrix[i][j] = newVal;
            cell.innerText = newVal.toFixed(1);
            cell.style.backgroundColor = newVal >= 0 ? `rgba(0, 245, 212, ${Math.abs(newVal) * 0.75})` : `rgba(255, 71, 87, ${Math.abs(newVal) * 0.75})`;
          });

          grid.appendChild(cell);
        }
      }

    } else if (this.activeEngineId === 'physarum') {
      container.innerHTML = `
        <div class="section-title">
          <span>PHYSARUM SLIME MOLD PARAMETERS</span>
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Agent Count</label>
            <span class="param-val" id="val-phys-agents">${engine.numAgents.toLocaleString()}</span>
          </div>
          <input type="range" id="param-phys-agents" min="10000" max="48000" step="2000" value="${engine.numAgents}">
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Sensor Angle</label>
            <span class="param-val" id="val-phys-angle">${(engine.sensorAngle * (180 / Math.PI)).toFixed(0)}°</span>
          </div>
          <input type="range" id="param-phys-angle" min="0.15" max="1.1" step="0.05" value="${engine.sensorAngle}">
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Sensor Distance</label>
            <span class="param-val" id="val-phys-dist">${engine.sensorDist}px</span>
          </div>
          <input type="range" id="param-phys-dist" min="5" max="30" step="1" value="${engine.sensorDist}">
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Trail Decay Factor</label>
            <span class="param-val" id="val-phys-decay">${engine.decayFactor.toFixed(3)}</span>
          </div>
          <input type="range" id="param-phys-decay" min="0.88" max="0.99" step="0.005" value="${engine.decayFactor}">
        </div>
      `;

      this.setupSlider('param-phys-agents', (val) => {
        engine.numAgents = Math.round(val);
        engine.agentX = new Float32Array(engine.numAgents);
        engine.agentY = new Float32Array(engine.numAgents);
        engine.agentAngle = new Float32Array(engine.numAgents);
        engine.init();
        document.getElementById('val-phys-agents').innerText = engine.numAgents.toLocaleString();
        this.updateHUD();
      });

      this.setupSlider('param-phys-angle', (val) => {
        engine.sensorAngle = val;
        document.getElementById('val-phys-angle').innerText = `${(val * (180 / Math.PI)).toFixed(0)}°`;
      });

      this.setupSlider('param-phys-dist', (val) => {
        engine.sensorDist = val;
        document.getElementById('val-phys-dist').innerText = `${val.toFixed(0)}px`;
      });

      this.setupSlider('param-phys-decay', (val) => {
        engine.decayFactor = val;
        document.getElementById('val-phys-decay').innerText = val.toFixed(3);
      });

    } else if (this.activeEngineId === 'flow_field') {
      container.innerHTML = `
        <div class="section-title">
          <span>FLOW FIELD PARAMETERS</span>
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Particle Count</label>
            <span class="param-val" id="val-flow-parts">${engine.numParticles.toLocaleString()}</span>
          </div>
          <input type="range" id="param-flow-parts" min="3000" max="18000" step="1000" value="${engine.numParticles}">
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Field Noise Scale</label>
            <span class="param-val" id="val-flow-scale">${(engine.noiseScale * 1000).toFixed(1)}</span>
          </div>
          <input type="range" id="param-flow-scale" min="0.001" max="0.010" step="0.0005" value="${engine.noiseScale}">
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Particle Velocity</label>
            <span class="param-val" id="val-flow-speed">${engine.particleSpeed.toFixed(1)}</span>
          </div>
          <input type="range" id="param-flow-speed" min="0.8" max="5.0" step="0.2" value="${engine.particleSpeed}">
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Trail Persistence</label>
            <span class="param-val" id="val-flow-trail">${engine.trailLength.toFixed(2)}</span>
          </div>
          <input type="range" id="param-flow-trail" min="0.80" max="0.98" step="0.01" value="${engine.trailLength}">
        </div>
      `;

      this.setupSlider('param-flow-parts', (val) => {
        engine.numParticles = Math.round(val);
        engine.x = new Float32Array(engine.numParticles);
        engine.y = new Float32Array(engine.numParticles);
        engine.prevX = new Float32Array(engine.numParticles);
        engine.prevY = new Float32Array(engine.numParticles);
        engine.age = new Int32Array(engine.numParticles);
        engine.maxAge = new Int32Array(engine.numParticles);
        engine.init();
        document.getElementById('val-flow-parts').innerText = engine.numParticles.toLocaleString();
        this.updateHUD();
      });

      this.setupSlider('param-flow-scale', (val) => {
        engine.noiseScale = val;
        document.getElementById('val-flow-scale').innerText = (val * 1000).toFixed(1);
      });

      this.setupSlider('param-flow-speed', (val) => {
        engine.particleSpeed = val;
        document.getElementById('val-flow-speed').innerText = val.toFixed(1);
      });

      this.setupSlider('param-flow-trail', (val) => {
        engine.trailLength = val;
        document.getElementById('val-flow-trail').innerText = val.toFixed(2);
      });

    } else if (this.activeEngineId === 'reaction_diffusion') {
      container.innerHTML = `
        <div class="section-title">
          <span>REACTION-DIFFUSION PARAMETERS</span>
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Feed Rate (F)</label>
            <span class="param-val" id="val-rd-feed">${engine.feed.toFixed(4)}</span>
          </div>
          <input type="range" id="param-rd-feed" min="0.0100" max="0.0800" step="0.0010" value="${engine.feed}">
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Kill Rate (K)</label>
            <span class="param-val" id="val-rd-kill">${engine.kill.toFixed(4)}</span>
          </div>
          <input type="range" id="param-rd-kill" min="0.0450" max="0.0700" step="0.0005" value="${engine.kill}">
        </div>

        <div class="param-row">
          <div class="param-info">
            <label>Diffusion Substeps</label>
            <span class="param-val" id="val-rd-sub">${engine.substeps}</span>
          </div>
          <input type="range" id="param-rd-sub" min="2" max="10" step="1" value="${engine.substeps}">
        </div>
      `;

      this.setupSlider('param-rd-feed', (val) => {
        engine.feed = val;
        document.getElementById('val-rd-feed').innerText = val.toFixed(4);
      });

      this.setupSlider('param-rd-kill', (val) => {
        engine.kill = val;
        document.getElementById('val-rd-kill').innerText = val.toFixed(4);
      });

      this.setupSlider('param-rd-sub', (val) => {
        engine.substeps = Math.round(val);
        document.getElementById('val-rd-sub').innerText = engine.substeps;
      });
    }

    this.renderPalettes();
  }

  renderPalettes() {
    const grid = document.getElementById('palette-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const paletteNames = {
      bioluminescence: "Bioluminescent",
      neon_cyber: "Neon Cyber",
      amber_ember: "Amber Ember",
      spectral_velvet: "Spectral Velvet",
      toxic_emerald: "Toxic Emerald",
      monochrome: "Monochrome"
    };

    Object.keys(PALETTES).forEach(key => {
      const pal = PALETTES[key];
      const card = document.createElement('div');
      card.className = 'palette-card';
      if (this.activeEngine.palette === pal) card.classList.add('active');

      card.innerHTML = `
        <span class="palette-name">${paletteNames[key] || key}</span>
        <div class="palette-swatches">
          ${pal.map(c => `<div class="palette-swatch" style="background: rgb(${c[0]}, ${c[1]}, ${c[2]});"></div>`).join('')}
        </div>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.palette-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (this.activeEngine.palette !== undefined) {
          this.activeEngine.palette = pal;
        }
      });

      grid.appendChild(card);
    });
  }

  renderPresetsGrid() {
    const grid = document.getElementById('presets-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const modal = document.getElementById('presets-modal');
    PRESETS.forEach(p => {
      const card = document.createElement('div');
      card.className = 'preset-card';
      card.innerHTML = `
        <div class="preset-card-header">
          <span class="preset-card-title">${p.name}</span>
          <span class="preset-card-engine">${p.engine.toUpperCase()}</span>
        </div>
        <p class="preset-card-desc">${p.desc}</p>
      `;

      card.addEventListener('click', () => {
        modal.classList.remove('open');
        const targetTab = document.querySelector(`.engine-tab[data-engine="${p.engine}"]`);
        if (targetTab) targetTab.click();

        const eng = this.activeEngine;
        if (p.engine === 'particle_life') {
          if (p.params.rMax) eng.rMax = p.params.rMax;
          if (p.params.rMin) eng.rMin = p.params.rMin;
          if (p.params.friction) eng.friction = p.params.friction;
        } else if (p.engine === 'physarum') {
          if (p.params.sensorAngle) eng.sensorAngle = p.params.sensorAngle;
          if (p.params.sensorDist) eng.sensorDist = p.params.sensorDist;
          if (p.params.turnSpeed) eng.turnSpeed = p.params.turnSpeed;
          if (p.params.decay) eng.decayFactor = p.params.decay;
        } else if (p.engine === 'flow_field') {
          if (p.params.speed) eng.particleSpeed = p.params.speed;
          if (p.params.noiseScale) eng.noiseScale = p.params.noiseScale;
          if (p.params.trail) eng.trailLength = p.params.trail;
        } else if (p.engine === 'reaction_diffusion') {
          if (p.params.feed) eng.feed = p.params.feed;
          if (p.params.kill) eng.kill = p.params.kill;
          if (p.params.substeps) eng.substeps = p.params.substeps;
        }

        eng.init();
        this.renderInspector();
      });

      grid.appendChild(card);
    });
  }

  exportImage() {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 3840;
    offCanvas.height = 2160;
    const offCtx = offCanvas.getContext('2d');
    offCtx.drawImage(this.canvas, 0, 0, 3840, 2160);

    const a = document.createElement('a');
    a.href = offCanvas.toDataURL('image/png');
    a.download = `VANTA_${this.activeEngineId}_${Date.now()}.png`;
    a.click();
  }

  toggleVideoRecording() {
    const btn = document.getElementById('btn-record');
    if (this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      btn.querySelector('.btn-label').innerText = "Record";
      btn.classList.remove('recording');
    } else {
      this.recordedChunks = [];
      const stream = this.canvas.captureStream(60);
      try {
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      } catch (e) {
        this.mediaRecorder = new MediaRecorder(stream);
      }

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VANTA_${this.activeEngineId}_${Date.now()}.webm`;
        a.click();
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      btn.querySelector('.btn-label').innerText = "Recording...";
      btn.classList.add('recording');
    }
  }
}

// Bootstrap on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new VantaStudioApp();
});
