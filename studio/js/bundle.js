/**
 * VANTA Studio — Complete Standalone High-Performance Multi-Universe Simulation Engine
 * 8 Complete Diverse Universes:
 * 1. Particle Life (Primordial Biogenesis)
 * 2. Physarum Polycephalum (Biological Slime Mold Network)
 * 3. Cosmic N-Body Gravity (Astrophysical Accretion & Galaxy Web)
 * 4. Boids Swarm Intelligence (Collective Emergence & Murmuration)
 * 5. Quantum Wave Packet (Subatomic Schrödinger Interference)
 * 6. Crystalline Dendritic Growth (Phase Transition & Snowflake Nucleation)
 * 7. Atmospheric Curl-Noise Flow (Fluid Aerodynamics & Vortices)
 * 8. Gray-Scott Turing Morphogenesis (Self-Organizing Chemical Reaction)
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
  quantum_frost: [
    [4, 8, 20],
    [20, 60, 140],
    [60, 170, 255],
    [240, 250, 255]
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
/* Universe Metadata Catalog                                                */
/* ========================================================================= */
const WORLDS = [
  {
    id: "particle_life",
    name: "Particle Life",
    category: "biology",
    tag: "Primordial Biogenesis",
    badge: "Cellular Emergence",
    desc: "Multi-species artificial chemistry where asymmetric attraction rules yield self-replicating cells, predatory pursuit, and mutualism.",
    physics: "Non-reciprocal Lennard-Jones variant on spatial grid"
  },
  {
    id: "physarum",
    name: "Physarum Slime Mold",
    category: "biology",
    tag: "Amoeboid Network",
    badge: "Biological Transport",
    desc: "Single-celled polycephalum intelligent foraging network computing optimal vascular paths via cyclic chemo-attractant streaming.",
    physics: "Agent-based Chemoreceptor Gradient Field"
  },
  {
    id: "cosmic_gravity",
    name: "Cosmic N-Body Gravity",
    category: "physics",
    tag: "Astrophysical Space",
    badge: "Newtonian Orbitals",
    desc: "Astrophysical star clusters and accretion disks orbiting supermassive gravitational wells under relativistic Keplerian mechanics.",
    physics: "Inverse-Square Gravitational Field with Softening Core"
  },
  {
    id: "boids_swarm",
    name: "Boids Swarm Intelligence",
    category: "biology",
    tag: "Collective Behavior",
    badge: "Flocking Murmuration",
    desc: "Craig Reynolds' artificial life flocking dynamics governed by local separation, velocity alignment, and swarm cohesion.",
    physics: "Emergent Swarm Dynamics & Predator Avoidance"
  },
  {
    id: "quantum_wave",
    name: "Quantum Wave Packet",
    category: "quantum",
    tag: "Subatomic Dispersion",
    badge: "Schrödinger Dynamics",
    desc: "Quantum wave function psi dispersing, interfering through double slits, and tunneling through localized potential barriers.",
    physics: "2D Complex Discretized Schrödinger Equation"
  },
  {
    id: "crystal_growth",
    name: "Dendritic Solidification",
    category: "quantum",
    tag: "Phase Transition",
    badge: "Snowflake Nucleation",
    desc: "Anisotropic crystal lattice nucleation and snowflake branching formed by diffusion-limited aggregation and thermal undercooling.",
    physics: "Phase-Field Dendrite Solidification"
  },
  {
    id: "flow_field",
    name: "Curl-Noise Flow Field",
    category: "physics",
    tag: "Atmospheric Fluid",
    badge: "Vortex Streamlines",
    desc: "Divergence-free fluid flow lines simulating atmospheric jet streams, oceanic whirlpools, and chaotic aerodynamic boundary layers.",
    physics: "Analytical Vector Potential Curl Field"
  },
  {
    id: "reaction_diffusion",
    name: "Turing Morphogenesis",
    category: "quantum",
    tag: "Reaction Kinetics",
    badge: "Gray-Scott Patterns",
    desc: "Alan Turing's morphogenetic pattern formation: chemical activators and inhibitors generating leopards spots, coral reefs, and soliton pulses.",
    physics: "Coupled Non-Linear Reaction-Diffusion Stencil"
  }
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
/* 2. Physarum Slime Mold Engine (Hardware-Accelerated Blit)                 */
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
        // Forward
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
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.ctx.drawImage(this.offCanvas, 0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ========================================================================= */
/* 3. Cosmic N-Body Gravity Universe (Astrophysical Mechanics)              */
/* ========================================================================= */
class CosmicGravityEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numStars = 2200;
    this.G = 3200;
    this.softening = 18.0;
    this.blackHoleMass = 120000;
    this.trailFade = 0.88;

    this.x = new Float32Array(this.numStars);
    this.y = new Float32Array(this.numStars);
    this.vx = new Float32Array(this.numStars);
    this.vy = new Float32Array(this.numStars);
    this.mass = new Float32Array(this.numStars);
    this.colorIdx = new Int32Array(this.numStars);

    this.palette = PALETTES.neon_cyber;
    this.init();
  }

  init() {
    const w = this.canvas.width || 1200;
    const h = this.canvas.height || 800;
    const cx = w * 0.5;
    const cy = h * 0.5;

    for (let i = 0; i < this.numStars; i++) {
      const radius = 30 + Math.pow(Math.random(), 1.5) * Math.min(w, h) * 0.45;
      const angle = Math.random() * 6.28318;
      this.x[i] = cx + Math.cos(angle) * radius;
      this.y[i] = cy + Math.sin(angle) * radius;

      // Keplerian orbital velocity v = sqrt(G*M / r)
      const vOrb = Math.sqrt((this.G * this.blackHoleMass) / Math.sqrt(radius * radius + this.softening * this.softening)) * 0.028;
      this.vx[i] = -Math.sin(angle) * vOrb;
      this.vy[i] = Math.cos(angle) * vOrb;
      this.mass[i] = 1.0 + Math.random() * 3.0;
      this.colorIdx[i] = Math.min(Math.floor((radius / (w * 0.4)) * 3), 3);
    }
  }

  step(dt = 0.016, mouse = null, env = null) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w * 0.5;
    const cy = h * 0.5;
    const N = this.numStars;
    const epsSq = this.softening * this.softening;
    const G = this.G;
    const bhMass = this.blackHoleMass;

    const visc = env ? env.viscosity : 0.05;
    const o2 = env ? env.oxygen : 1.0;
    const gravBias = env ? env.gravity * 60.0 : 0.0;
    const damp = 1.0 - visc * 0.4;

    for (let i = 0; i < N; i++) {
      let dx = cx - this.x[i];
      let dy = cy - this.y[i];
      let rSq = dx * dx + dy * dy + epsSq;
      let r = Math.sqrt(rSq);
      let f = (G * bhMass * o2) / (rSq * r);

      let ax = dx * f;
      let ay = dy * f + gravBias;

      // Mouse massive attractor / repulsion well
      if (mouse && mouse.down) {
        let mdx = mouse.x - this.x[i];
        let mdy = mouse.y - this.y[i];
        let mrSq = mdx * mdx + mdy * mdy + 400.0;
        let mr = Math.sqrt(mrSq);
        let mForce = (mouse.button === 2 ? -G * 60000 : G * 60000) / (mrSq * mr);
        ax += mdx * mForce;
        ay += mdy * mForce;
      }

      this.vx[i] = (this.vx[i] + ax * dt) * damp;
      this.vy[i] = (this.vy[i] + ay * dt) * damp;

      this.x[i] += this.vx[i] * dt * 50.0;
      this.y[i] += this.vy[i] * dt * 50.0;
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const pal = this.palette;

    ctx.fillStyle = `rgba(6, 8, 14, ${1.0 - this.trailFade})`;
    ctx.fillRect(0, 0, w, h);

    // Render central supermassive black hole horizon
    const cx = w * 0.5;
    const cy = h * 0.5;
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 38);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.3, 'rgba(138, 43, 226, 0.6)');
    grad.addColorStop(0.7, 'rgba(0, 245, 212, 0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, 6.28318);
    ctx.fill();

    for (let i = 0; i < this.numStars; i++) {
      const c = pal[this.colorIdx[i] + 1] || pal[2];
      ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
      ctx.beginPath();
      ctx.arc(this.x[i], this.y[i], this.mass[i] * 0.8, 0, 6.28318);
      ctx.fill();
    }
  }
}

/* ========================================================================= */
/* 4. Boids Swarm Intelligence (Craig Reynolds Collective Flocking)         */
/* ========================================================================= */
class BoidsSwarmEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numBoids = 700;
    this.maxSpeed = 4.5;
    this.maxForce = 0.16;
    this.visualRange = 48.0;
    this.separationDist = 20.0;

    this.x = new Float32Array(this.numBoids);
    this.y = new Float32Array(this.numBoids);
    this.vx = new Float32Array(this.numBoids);
    this.vy = new Float32Array(this.numBoids);

    this.palette = PALETTES.amber_ember;
    this.init();
  }

  init() {
    const w = this.canvas.width || 1200;
    const h = this.canvas.height || 800;
    for (let i = 0; i < this.numBoids; i++) {
      this.x[i] = Math.random() * w;
      this.y[i] = Math.random() * h;
      const angle = Math.random() * 6.28318;
      this.vx[i] = Math.cos(angle) * this.maxSpeed * 0.6;
      this.vy[i] = Math.sin(angle) * this.maxSpeed * 0.6;
    }
  }

  step(dt = 0.016, mouse = null, env = null) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const N = this.numBoids;
    const vRange = this.visualRange;
    const vRangeSq = vRange * vRange;
    const sepDist = this.separationDist;
    const sepDistSq = sepDist * sepDist;

    const o2 = env ? env.oxygen : 1.0;
    const temp = env ? env.temperature : 24.0;
    const maxSpd = this.maxSpeed * (0.6 + o2 * 0.4);
    const maxF = this.maxForce;

    for (let i = 0; i < N; i++) {
      let sepX = 0, sepY = 0;
      let aliX = 0, aliY = 0;
      let cohX = 0, cohY = 0;
      let neighbors = 0;

      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        let dx = this.x[j] - this.x[i];
        let dy = this.y[j] - this.y[i];

        if (dx > w * 0.5) dx -= w;
        else if (dx < -w * 0.5) dx += w;
        if (dy > h * 0.5) dy -= h;
        else if (dy < -h * 0.5) dy += h;

        const dSq = dx * dx + dy * dy;
        if (dSq < vRangeSq) {
          neighbors++;
          aliX += this.vx[j];
          aliY += this.vy[j];
          cohX += dx;
          cohY += dy;

          if (dSq < sepDistSq && dSq > 0) {
            const d = Math.sqrt(dSq);
            sepX -= (dx / d) * (1.0 - d / sepDist);
            sepY -= (dy / d) * (1.0 - d / sepDist);
          }
        }
      }

      let ax = sepX * 1.5;
      let ay = sepY * 1.5;

      if (neighbors > 0) {
        aliX /= neighbors;
        aliY /= neighbors;
        cohX /= neighbors;
        cohY /= neighbors;
        ax += (aliX - this.vx[i]) * 0.05 + cohX * 0.01;
        ay += (aliY - this.vy[i]) * 0.05 + cohY * 0.01;
      }

      // Mouse predator / attractor
      if (mouse && mouse.down) {
        let mdx = mouse.x - this.x[i];
        let mdy = mouse.y - this.y[i];
        let mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 160 && mDist > 0) {
          const mFactor = (mouse.button === 2 ? 80 : -140) / mDist;
          ax += (mdx / mDist) * mFactor;
          ay += (mdy / mDist) * mFactor;
        }
      }

      this.vx[i] += ax;
      this.vy[i] += ay;

      const spd = Math.sqrt(this.vx[i] * this.vx[i] + this.vy[i] * this.vy[i]);
      if (spd > maxSpd) {
        this.vx[i] = (this.vx[i] / spd) * maxSpd;
        this.vy[i] = (this.vy[i] / spd) * maxSpd;
      }

      this.x[i] = (this.x[i] + this.vx[i] + w) % w;
      this.y[i] = (this.y[i] + this.vy[i] + h) % h;
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const pal = this.palette;

    ctx.fillStyle = 'rgba(6, 8, 14, 0.22)';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < this.numBoids; i++) {
      const angle = Math.atan2(this.vy[i], this.vx[i]);
      ctx.save();
      ctx.translate(this.x[i], this.y[i]);
      ctx.rotate(angle);

      ctx.fillStyle = `rgb(${pal[2][0]}, ${pal[2][1]}, ${pal[2][2]})`;
      ctx.beginPath();
      ctx.moveTo(7, 0);
      ctx.lineTo(-5, -3.5);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-5, 3.5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }
}

/* ========================================================================= */
/* 5. Quantum Wave Packet Interference (2D Schrödinger Simulation)          */
/* ========================================================================= */
class QuantumWaveEngine {
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

    const size = this.gridW * this.gridH;
    this.psiRe = new Float32Array(size);
    this.psiIm = new Float32Array(size);
    this.nextRe = new Float32Array(size);
    this.nextIm = new Float32Array(size);
    this.potential = new Float32Array(size);

    this.palette = PALETTES.quantum_frost;
    this.init();
  }

  init() {
    const gw = this.gridW;
    const gh = this.gridH;
    this.psiRe.fill(0);
    this.psiIm.fill(0);
    this.potential.fill(0);

    // Double-slit barrier potential wall in center
    const wallX = Math.floor(gw * 0.42);
    const slit1Y = Math.floor(gh * 0.38);
    const slit2Y = Math.floor(gh * 0.62);
    const slitWidth = 6;

    for (let y = 0; y < gh; y++) {
      if (Math.abs(y - slit1Y) > slitWidth && Math.abs(y - slit2Y) > slitWidth) {
        this.potential[y * gw + wallX] = 1.0;
        this.potential[y * gw + wallX + 1] = 1.0;
      }
    }

    // Launch Gaussian wave packet with initial momentum k_x
    const cx = gw * 0.18;
    const cy = gh * 0.50;
    const sigma = 9.0;
    const kx = 1.2;

    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const envelope = Math.exp(-(dx * dx + dy * dy) / (2.0 * sigma * sigma));
        const idx = y * gw + x;
        this.psiRe[idx] = envelope * Math.cos(kx * dx);
        this.psiIm[idx] = envelope * Math.sin(kx * dx);
      }
    }
  }

  step(dt = 0.016, mouse = null, env = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const re = this.psiRe;
    const im = this.psiIm;
    const nRe = this.nextRe;
    const nIm = this.nextIm;
    const V = this.potential;

    // Discretized kinetic dispersion parameter
    const c = 0.22;

    for (let y = 1; y < gh - 1; y++) {
      const row = y * gw;
      const up = (y - 1) * gw;
      const down = (y + 1) * gw;

      for (let x = 1; x < gw - 1; x++) {
        const idx = row + x;
        if (V[idx] > 0.5) {
          nRe[idx] = 0;
          nIm[idx] = 0;
          continue;
        }

        const lapRe = re[row + x - 1] + re[row + x + 1] + re[up + x] + re[down + x] - 4.0 * re[idx];
        const lapIm = im[row + x - 1] + im[row + x + 1] + im[up + x] + im[down + x] - 4.0 * im[idx];

        // i d/dt psi = -c laplacian psi
        // d/dt Re = -c lapIm,  d/dt Im = +c lapRe
        nRe[idx] = re[idx] - c * lapIm;
        nIm[idx] = im[idx] + c * lapRe;
      }
    }

    // Mouse creates quantum potential perturbing wave
    if (mouse && mouse.down) {
      const mx = Math.floor((mouse.x / this.canvas.width) * gw);
      const my = Math.floor((mouse.y / this.canvas.height) * gh);
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const px = mx + dx;
          const py = my + dy;
          if (px >= 1 && px < gw - 1 && py >= 1 && py < gh - 1) {
            nRe[py * gw + px] += 0.4 * Math.cos(dx + dy);
            nIm[py * gw + px] += 0.4 * Math.sin(dx + dy);
          }
        }
      }
    }

    this.psiRe.set(nRe);
    this.psiIm.set(nIm);
  }

  render() {
    const data = this.offImgData.data;
    const re = this.psiRe;
    const im = this.psiIm;
    const V = this.potential;
    const pal = this.palette;

    let pIdx = 0;
    for (let i = 0; i < re.length; i++) {
      if (V[i] > 0.5) {
        data[pIdx] = 40;
        data[pIdx + 1] = 48;
        data[pIdx + 2] = 60;
        data[pIdx + 3] = 255;
      } else {
        const prob = Math.min((re[i] * re[i] + im[i] * im[i]) * 4.0, 1.0);
        const t = prob * 3.0;
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
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.drawImage(this.offCanvas, 0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ========================================================================= */
/* 6. Dendritic Crystal Nucleation & Snowflake Growth                       */
/* ========================================================================= */
class CrystalGrowthEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.gridW = 280;
    this.gridH = 180;
    this.offCanvas = document.createElement('canvas');
    this.offCanvas.width = this.gridW;
    this.offCanvas.height = this.gridH;
    this.offCtx = this.offCanvas.getContext('2d', { alpha: false });
    this.offImgData = this.offCtx.createImageData(this.gridW, this.gridH);

    const size = this.gridW * this.gridH;
    this.crystal = new Uint8Array(size);
    this.diffuse = new Float32Array(size);

    this.palette = PALETTES.bioluminescence;
    this.init();
  }

  init() {
    const gw = this.gridW;
    const gh = this.gridH;
    this.crystal.fill(0);
    this.diffuse.fill(0.65);

    // Seed center nucleation crystal
    const cx = Math.floor(gw * 0.5);
    const cy = Math.floor(gh * 0.5);
    this.crystal[cy * gw + cx] = 255;
    this.diffuse[cy * gw + cx] = 0.0;
  }

  step(dt = 0.016, mouse = null, env = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const crystal = this.crystal;
    const diff = this.diffuse;

    const temp = env ? env.temperature : 24.0;
    const undercooling = Math.max((15.0 - temp) * 0.02 + 0.12, 0.02);

    for (let iter = 0; iter < 4; iter++) {
      for (let y = 1; y < gh - 1; y++) {
        const row = y * gw;
        for (let x = 1; x < gw - 1; x++) {
          const idx = row + x;
          if (crystal[idx] > 0) continue;

          // Check 6-neighbor anisotropic crystalline adhesion
          const hasNeighbor =
            crystal[row + x - 1] > 0 || crystal[row + x + 1] > 0 ||
            crystal[(y - 1) * gw + x] > 0 || crystal[(y + 1) * gw + x] > 0 ||
            crystal[(y - 1) * gw + x - 1] > 0 || crystal[(y + 1) * gw + x + 1] > 0;

          if (hasNeighbor && diff[idx] > undercooling) {
            crystal[idx] = 255;
            diff[idx] = 0.0;
          }
        }
      }

      // Diffusion step
      for (let y = 1; y < gh - 1; y++) {
        const row = y * gw;
        for (let x = 1; x < gw - 1; x++) {
          const idx = row + x;
          if (crystal[idx] > 0) continue;
          diff[idx] = (
            diff[row + x - 1] + diff[row + x + 1] +
            diff[(y - 1) * gw + x] + diff[(y + 1) * gw + x]
          ) * 0.25;
        }
      }
    }

    // Mouse spawns crystal seeds
    if (mouse && mouse.down) {
      const mx = Math.floor((mouse.x / this.canvas.width) * gw);
      const my = Math.floor((mouse.y / this.canvas.height) * gh);
      if (mx > 2 && mx < gw - 2 && my > 2 && my < gh - 2) {
        crystal[my * gw + mx] = 255;
      }
    }
  }

  render() {
    const data = this.offImgData.data;
    const crystal = this.crystal;
    const diff = this.diffuse;
    const pal = this.palette;

    let pIdx = 0;
    for (let i = 0; i < crystal.length; i++) {
      if (crystal[i] > 0) {
        data[pIdx] = pal[3][0];
        data[pIdx + 1] = pal[3][1];
        data[pIdx + 2] = pal[3][2];
        data[pIdx + 3] = 255;
      } else {
        const val = diff[i];
        data[pIdx] = Math.floor(pal[0][0] * (1.0 - val) + pal[1][0] * val);
        data[pIdx + 1] = Math.floor(pal[0][1] * (1.0 - val) + pal[1][1] * val);
        data[pIdx + 2] = Math.floor(pal[0][2] * (1.0 - val) + pal[1][2] * val);
        data[pIdx + 3] = 255;
      }
      pIdx += 4;
    }

    this.offCtx.putImageData(this.offImgData, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.drawImage(this.offCanvas, 0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ========================================================================= */
/* 7. Curl-Noise Flow Field Engine                                          */
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
/* 8. Gray-Scott Turing Morphogenesis Engine                                */
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
    this.ctx.imageSmoothingEnabled = true;
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
    id: "galactic_spiral",
    engine: "cosmic_gravity",
    name: "Milky Way Spiral",
    desc: "Keplerian rotation curves around supermassive central black hole singularity.",
    params: {}
  },
  {
    id: "murmuration_wave",
    engine: "boids_swarm",
    name: "Starling Murmuration",
    desc: "Dense synchronized aerodynamic aerial waves avoiding phantom predators.",
    params: {}
  },
  {
    id: "quantum_diffraction",
    engine: "quantum_wave",
    name: "Double Slit Diffraction",
    desc: "Subatomic phase interference fringes displaying quantum wave-particle duality.",
    params: {}
  },
  {
    id: "ice_snowflake",
    engine: "crystal_growth",
    name: "Hexagonal Snowflake",
    desc: "Phase-transition dendritic nucleation in sub-zero thermal undercooling conditions.",
    params: {}
  },
  {
    id: "oceanic_turbulence",
    engine: "flow_field",
    name: "Atmospheric Jet Stream",
    desc: "Divergence-free fluid flow lines tracing deep oceanic currents and planetary vortices.",
    params: { speed: 2.4, noiseScale: 0.0035, trail: 0.94 }
  },
  {
    id: "turing_coral",
    engine: "reaction_diffusion",
    name: "Turing Reef Coral",
    desc: "Labyrinthine Turing morphogenetic patterns and biocatalytic skin morphogenesis.",
    params: { feed: 0.0545, kill: 0.0620, substeps: 5 }
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
      oxygen: 1.0,
      temperature: 24,
      viscosity: 0.05,
      gravity: 0.0
    };

    this.fps = 60;
    this.frameTime = 16.6;
    this.lastTime = performance.now();
    this.fpsTimer = performance.now();
    this.framesCount = 0;

    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];

    // All 8 Universes
    this.engines = {
      particle_life: new ParticleLifeEngine(this.canvas),
      physarum: new PhysarumEngine(this.canvas),
      cosmic_gravity: new CosmicGravityEngine(this.canvas),
      boids_swarm: new BoidsSwarmEngine(this.canvas),
      quantum_wave: new QuantumWaveEngine(this.canvas),
      crystal_growth: new CrystalGrowthEngine(this.canvas),
      flow_field: new FlowFieldEngine(this.canvas),
      reaction_diffusion: new ReactionDiffusionEngine(this.canvas)
    };
    this.activeEngineId = 'particle_life';

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.initUI();
    this.initMouseInteractions();
    this.renderWorldsDrawer();
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

    const currentWorld = WORLDS.find(w => w.id === this.activeEngineId);
    if (engVal && currentWorld) engVal.innerText = currentWorld.name;

    if (entVal && this.activeEngine) {
      let count = 0;
      if (this.activeEngine.numParticles) count = this.activeEngine.numParticles;
      else if (this.activeEngine.numStars) count = this.activeEngine.numStars;
      else if (this.activeEngine.numBoids) count = this.activeEngine.numBoids;
      else if (this.activeEngine.numAgents) count = this.activeEngine.numAgents;
      else if (this.activeEngine.gridW) count = this.activeEngine.gridW * this.activeEngine.gridH;
      entVal.innerText = count.toLocaleString();
    }
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

  // Cinematic World Switching with Portal Loader
  switchWorld(targetWorldId) {
    if (targetWorldId === this.activeEngineId) return;

    const targetWorld = WORLDS.find(w => w.id === targetWorldId);
    if (!targetWorld) return;

    const loader = document.getElementById('world-loader');
    const title = document.getElementById('loader-title');
    const desc = document.getElementById('loader-desc');
    const bar = document.getElementById('loader-bar');

    title.innerText = targetWorld.name.toUpperCase();
    desc.innerText = `${targetWorld.desc} [${targetWorld.physics}]`;
    bar.style.width = '0%';
    loader.classList.remove('hidden');

    // Close Worlds Drawer
    this.closeDrawer();

    setTimeout(() => {
      bar.style.width = '70%';
      this.activeEngineId = targetWorldId;
      this.activeEngine.init();
      document.getElementById('active-world-name').innerText = targetWorld.name;
      this.renderWorldsDrawer();
      this.renderInspector();
      this.updateHUD();
    }, 120);

    setTimeout(() => {
      bar.style.width = '100%';
    }, 220);

    setTimeout(() => {
      loader.classList.add('hidden');
    }, 380);
  }

  toggleDrawer() {
    const drawer = document.getElementById('worlds-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const btn = document.getElementById('btn-hamburger');
    const isOpen = drawer.classList.contains('open');

    if (isOpen) {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      btn.classList.remove('active');
    } else {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      btn.classList.add('active');
    }
  }

  closeDrawer() {
    const drawer = document.getElementById('worlds-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const btn = document.getElementById('btn-hamburger');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (btn) btn.classList.remove('active');
  }

  renderWorldsDrawer(activeCategory = 'all') {
    const list = document.getElementById('worlds-list');
    if (!list) return;
    list.innerHTML = '';

    const filtered = activeCategory === 'all'
      ? WORLDS
      : WORLDS.filter(w => w.category === activeCategory);

    filtered.forEach(world => {
      const card = document.createElement('div');
      card.className = `world-card ${world.id === this.activeEngineId ? 'active' : ''}`;
      card.innerHTML = `
        <div class="world-card-top">
          <div class="world-card-title-group">
            <div class="world-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </div>
            <div>
              <div class="world-card-title">${world.name}</div>
            </div>
          </div>
          <span class="world-card-badge">${world.badge}</span>
        </div>
        <p class="world-card-desc">${world.desc}</p>
        <div class="world-card-meta">
          <span>${world.tag.toUpperCase()}</span>
          <span>•</span>
          <span>${world.physics}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        this.switchWorld(world.id);
      });

      list.appendChild(card);
    });
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
      if (e.target.closest('#topbar') || e.target.closest('#inspector') || e.target.closest('#worlds-drawer') || e.target.closest('.modal-overlay')) return;
      this.mouse.down = true;
      this.mouse.button = e.button === 2 ? 2 : 1;
      if (ring) ring.classList.add('active');
    });

    window.addEventListener('mouseup', () => {
      this.mouse.down = false;
      if (ring) ring.classList.remove('active');
    });

    window.addEventListener('contextmenu', (e) => {
      if (!e.target.closest('#inspector') && !e.target.closest('#topbar') && !e.target.closest('#worlds-drawer')) {
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
      } else if (e.code === 'KeyM' || e.code === 'Tab') {
        e.preventDefault();
        this.toggleDrawer();
      } else if (e.code === 'KeyH') {
        document.getElementById('btn-zen').click();
      } else if (e.code === 'Escape') {
        this.closeDrawer();
        document.getElementById('presets-modal').classList.remove('open');
        document.body.classList.remove('zen-mode');
      } else if (e.code >= 'Digit1' && e.code <= 'Digit8') {
        const idx = parseInt(e.code.replace('Digit', '')) - 1;
        if (WORLDS[idx]) this.switchWorld(WORLDS[idx].id);
      }
    });
  }

  initUI() {
    // Hamburger Drawer Toggle
    document.getElementById('btn-hamburger').addEventListener('click', () => {
      this.toggleDrawer();
    });
    document.getElementById('close-drawer').addEventListener('click', () => {
      this.closeDrawer();
    });
    document.getElementById('drawer-backdrop').addEventListener('click', () => {
      this.closeDrawer();
    });
    document.getElementById('active-world-pill').addEventListener('click', () => {
      this.toggleDrawer();
    });

    // Drawer Categories
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.renderWorldsDrawer(pill.dataset.cat);
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

    // Immersive Zen Mode
    document.getElementById('btn-zen').addEventListener('click', () => {
      document.body.classList.toggle('zen-mode');
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
    const currentWorld = WORLDS.find(w => w.id === this.activeEngineId);

    if (this.activeEngineId === 'particle_life') {
      container.innerHTML = `
        <div class="section-title">
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

    } else if (this.activeEngineId === 'cosmic_gravity') {
      container.innerHTML = `
        <div class="section-title">
          <span>COSMIC GRAVITY PARAMETERS</span>
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Star Population</label>
            <span class="param-val" id="val-stars">${engine.numStars}</span>
          </div>
          <input type="range" id="param-stars" min="800" max="4000" step="200" value="${engine.numStars}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Gravitational Constant (G)</label>
            <span class="param-val" id="val-gconst">${engine.G}</span>
          </div>
          <input type="range" id="param-gconst" min="1000" max="8000" step="500" value="${engine.G}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Central Black Hole Mass</label>
            <span class="param-val" id="val-bhmass">${(engine.blackHoleMass / 1000).toFixed(0)}k</span>
          </div>
          <input type="range" id="param-bhmass" min="40000" max="300000" step="20000" value="${engine.blackHoleMass}">
        </div>
      `;

      this.setupSlider('param-stars', (val) => {
        engine.numStars = Math.round(val);
        engine.x = new Float32Array(engine.numStars);
        engine.y = new Float32Array(engine.numStars);
        engine.vx = new Float32Array(engine.numStars);
        engine.vy = new Float32Array(engine.numStars);
        engine.mass = new Float32Array(engine.numStars);
        engine.colorIdx = new Int32Array(engine.numStars);
        engine.init();
        document.getElementById('val-stars').innerText = engine.numStars;
        this.updateHUD();
      });

      this.setupSlider('param-gconst', (val) => {
        engine.G = Math.round(val);
        document.getElementById('val-gconst').innerText = engine.G;
      });

      this.setupSlider('param-bhmass', (val) => {
        engine.blackHoleMass = Math.round(val);
        document.getElementById('val-bhmass').innerText = `${(val / 1000).toFixed(0)}k`;
      });

    } else if (this.activeEngineId === 'boids_swarm') {
      container.innerHTML = `
        <div class="section-title">
          <span>BOIDS SWARM PARAMETERS</span>
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Boid Count</label>
            <span class="param-val" id="val-boids">${engine.numBoids}</span>
          </div>
          <input type="range" id="param-boids" min="200" max="1500" step="50" value="${engine.numBoids}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Visual Radar Range</label>
            <span class="param-val" id="val-boid-range">${engine.visualRange}px</span>
          </div>
          <input type="range" id="param-boid-range" min="20" max="90" step="5" value="${engine.visualRange}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Separation Distance</label>
            <span class="param-val" id="val-boid-sep">${engine.separationDist}px</span>
          </div>
          <input type="range" id="param-boid-sep" min="10" max="40" step="2" value="${engine.separationDist}">
        </div>
      `;

      this.setupSlider('param-boids', (val) => {
        engine.numBoids = Math.round(val);
        engine.x = new Float32Array(engine.numBoids);
        engine.y = new Float32Array(engine.numBoids);
        engine.vx = new Float32Array(engine.numBoids);
        engine.vy = new Float32Array(engine.numBoids);
        engine.init();
        document.getElementById('val-boids').innerText = engine.numBoids;
        this.updateHUD();
      });

      this.setupSlider('param-boid-range', (val) => {
        engine.visualRange = val;
        document.getElementById('val-boid-range').innerText = `${val}px`;
      });

      this.setupSlider('param-boid-sep', (val) => {
        engine.separationDist = val;
        document.getElementById('val-boid-sep').innerText = `${val}px`;
      });

    } else if (this.activeEngineId === 'physarum') {
      container.innerHTML = `
        <div class="section-title">
          <span>PHYSARUM PARAMETERS</span>
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

    } else {
      container.innerHTML = `
        <div class="section-title">
          <span>${currentWorld ? currentWorld.name.toUpperCase() : 'WORLD'} PARAMETERS</span>
        </div>
        <p class="param-hint">${currentWorld ? currentWorld.desc : 'Active simulation universe.'}</p>
      `;
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
      quantum_frost: "Quantum Frost",
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
        this.switchWorld(p.engine);

        const eng = this.activeEngine;
        if (p.engine === 'particle_life') {
          if (p.params.rMax) eng.rMax = p.params.rMax;
          if (p.params.rMin) eng.rMin = p.params.rMin;
          if (p.params.friction) eng.friction = p.params.friction;
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
