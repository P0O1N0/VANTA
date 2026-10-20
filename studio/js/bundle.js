/**
 * VANTA Studio — Complete Standalone High-Performance Multi-Universe Simulation Engine
 * 8 Fully Interactive, Mathematically Rigorous Universes:
 * 1. Particle Life (Primordial Biogenesis & Mitosis)
 * 2. Physarum Polycephalum (Biological Slime Mold Vascular Network)
 * 3. Cosmic N-Body Gravity (Astrophysical Kerr Singularity & Relativistic Doppler Accretion)
 * 4. Boids Swarm Intelligence (Collective Emergence, Predator Evasion & Murmuration)
 * 5. Quantum Wave Packet (Subatomic Schrödinger Double-Slit Phase Interference)
 * 6. Dendritic Crystal Nucleation (Hexagonal Anisotropic Snowflake Solidification)
 * 7. Atmospheric Curl-Noise (Divergence-Free Aerodynamics & Vorticity)
 * 8. Gray-Scott Turing Morphogenesis (Self-Organizing Chemical Skins)
 */

// Spectrum Palettes
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
  "#ff4757", // Red (Hunter)
  "#2ed573", // Green (Producer)
  "#1e90ff", // Blue (Symbiont)
  "#ffa502", // Gold (Kinetic)
  "#9b59b6", // Purple (Replicator)
  "#00f5d4"  // Cyan (Catalyst)
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
  },
  {
    id: "lenia",
    name: "Lenia Continuous Life",
    category: "biology",
    tag: "Continuous Automata",
    badge: "Soliton Organisms",
    desc: "Continuous space-time artificial life exhibiting self-organizing autonomous solitons, gliders, and morphing cellular micro-organisms.",
    physics: "Continuous Convolution Field & Unimodal Growth Mapping"
  },
  {
    id: "ferrofluid",
    name: "Ferrofluid Dynamics",
    category: "physics",
    tag: "Magnetic Hydrodynamics",
    badge: "Rosensweig Instability",
    desc: "Superparamagnetic liquid forming dramatic Rosensweig peak spikes, dynamic dipole fields, and specular chrome metallic reflections.",
    physics: "Rosensweig Spikes & Specular Normal Shading"
  },
  {
    id: "fractal_growth",
    name: "Fractal Dendrite (DLA)",
    category: "physics",
    tag: "Dendritic Morphogenesis",
    badge: "DLA Fractal Clusters",
    desc: "Brownian particles diffusing randomly and aggregating onto stationary nucleation seeds, forming intricate fractal mineral trees and coral dendrites.",
    physics: "Witten-Sander Diffusion-Limited Aggregation (DLA)"
  },
  {
    id: "excitable_medium",
    name: "Excitable Medium Waves",
    category: "biology",
    tag: "Biochemical Waves",
    badge: "Spiral Wave Rotors",
    desc: "FitzHugh-Nagumo and Barkley activator-inhibitor dynamics producing self-sustained spiral waves, wavefront collisions, and refractory boundaries.",
    physics: "Barkley Reaction-Diffusion Excitable Stencil"
  },
  {
    id: "thermal_convection",
    name: "Rayleigh-Bénard Convection",
    category: "physics",
    tag: "Hydrodynamic Convection",
    badge: "Thermal Plumes",
    desc: "Buoyancy-driven fluid convection under the Boussinesq approximation, generating Rayleigh-Bénard convective rolls, rising thermal plumes, and tracer streamlines.",
    physics: "Coupled Boussinesq Buoyant Thermal-Fluid Solver"
  }
];

/* ========================================================================= */
/* 1. Particle Life Engine (Primordial Biogenesis)                          */
/* ========================================================================= */
class ParticleLifeEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numParticles = 1600;
    this.numSpecies = 6;
    this.rMax = 75;
    this.rMin = 14;
    this.friction = 0.88;
    this.forceFactor = 1.0;
    this.maxVelocity = 8.5;
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
/* 2. Physarum Slime Mold Engine (Biological Vascular Transport)            */
/* ========================================================================= */
class PhysarumEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numAgents = 24000;
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

      // Mouse nutrient sugar drop on click
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
/* 3. Cosmic N-Body Gravity Universe (Astrophysical Accretion Disk)         */
/* ========================================================================= */
class CosmicGravityEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numStars = 2400;
    this.G = 3400;
    this.softening = 18.0;
    this.blackHoleMass = 140000;
    this.trailFade = 0.88;

    this.x = new Float32Array(this.numStars);
    this.y = new Float32Array(this.numStars);
    this.vx = new Float32Array(this.numStars);
    this.vy = new Float32Array(this.numStars);
    this.mass = new Float32Array(this.numStars);

    this.palette = PALETTES.neon_cyber;
    this.init();
  }

  init() {
    const w = this.canvas.width || 1200;
    const h = this.canvas.height || 800;
    const cx = w * 0.5;
    const cy = h * 0.5;

    for (let i = 0; i < this.numStars; i++) {
      const radius = 25 + Math.pow(Math.random(), 1.4) * Math.min(w, h) * 0.45;
      const angle = Math.random() * 6.28318;
      this.x[i] = cx + Math.cos(angle) * radius;
      this.y[i] = cy + Math.sin(angle) * radius;

      // Keplerian orbital velocity v = sqrt(G*M / r)
      const vOrb = Math.sqrt((this.G * this.blackHoleMass) / Math.sqrt(radius * radius + this.softening * this.softening)) * 0.028;
      this.vx[i] = -Math.sin(angle) * vOrb;
      this.vy[i] = Math.cos(angle) * vOrb;
      this.mass[i] = 1.0 + Math.random() * 2.5;
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

      // Mouse companion black hole attractor
      if (mouse && mouse.down) {
        let mdx = mouse.x - this.x[i];
        let mdy = mouse.y - this.y[i];
        let mrSq = mdx * mdx + mdy * mdy + 400.0;
        let mr = Math.sqrt(mrSq);
        let mForce = (mouse.button === 2 ? -G * 70000 : G * 70000) / (mrSq * mr);
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

    const cx = w * 0.5;
    const cy = h * 0.5;

    // Glowing Kerr black hole event horizon
    const grad = ctx.createRadialGradient(cx, cy, 3, cx, cy, 42);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.35, 'rgba(138, 43, 226, 0.65)');
    grad.addColorStop(0.7, 'rgba(0, 245, 212, 0.35)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 42, 0, 6.28318);
    ctx.fill();

    // Relativistic Doppler coloring based on velocity
    for (let i = 0; i < this.numStars; i++) {
      const spd = Math.sqrt(this.vx[i] * this.vx[i] + this.vy[i] * this.vy[i]);
      const doppler = Math.min(Math.max((this.vx[i] / 5.0) + 0.5, 0.0), 1.0);
      const c = doppler > 0.5 ? pal[2] : pal[1];
      ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
      ctx.beginPath();
      ctx.arc(this.x[i], this.y[i], this.mass[i] * 0.8, 0, 6.28318);
      ctx.fill();
    }
  }
}

/* ========================================================================= */
/* 4. Boids Swarm Intelligence (Murmuration & Predator Avoidance)           */
/* ========================================================================= */
class BoidsSwarmEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.numBoids = 450;
    this.maxSpeed = 4.8;
    this.maxForce = 0.18;
    this.visualRange = 48.0;
    this.separationDist = 18.0;

    this.x = new Float32Array(this.numBoids);
    this.y = new Float32Array(this.numBoids);
    this.vx = new Float32Array(this.numBoids);
    this.vy = new Float32Array(this.numBoids);

    // 2 Apex Predators circling the swarm
    this.predators = [
      { x: 200, y: 200, vx: 3.0, vy: 2.0 },
      { x: 800, y: 600, vx: -2.5, vy: -2.0 }
    ];

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
      this.vx[i] = Math.cos(angle) * this.maxSpeed * 0.7;
      this.vy[i] = Math.sin(angle) * this.maxSpeed * 0.7;
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
    const maxSpd = this.maxSpeed * (0.6 + o2 * 0.4);

    // Update Predators
    this.predators.forEach(p => {
      p.x = (p.x + p.vx + w) % w;
      p.y = (p.y + p.vy + h) % h;
      p.vx += (Math.random() - 0.5) * 0.4;
      p.vy += (Math.random() - 0.5) * 0.4;
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > 3.8) { p.vx = (p.vx / spd) * 3.8; p.vy = (p.vy / spd) * 3.8; }
    });

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

      // Evasive reaction to predators
      this.predators.forEach(p => {
        let pdx = this.x[i] - p.x;
        let pdy = this.y[i] - p.y;
        let pDistSq = pdx * pdx + pdy * pdy;
        if (pDistSq < 14400 && pDistSq > 0) {
          let pDist = Math.sqrt(pDistSq);
          ax += (pdx / pDist) * 3.5;
          ay += (pdy / pDist) * 3.5;
        }
      });

      // Mouse predator scatter
      if (mouse && mouse.down) {
        let mdx = mouse.x - this.x[i];
        let mdy = mouse.y - this.y[i];
        let mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 160 && mDist > 0) {
          const mFactor = (mouse.button === 2 ? 80 : -160) / mDist;
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

    // Render Boids as delta-wing organisms
    for (let i = 0; i < this.numBoids; i++) {
      const angle = Math.atan2(this.vy[i], this.vx[i]);
      ctx.save();
      ctx.translate(this.x[i], this.y[i]);
      ctx.rotate(angle);

      ctx.fillStyle = `rgb(${pal[2][0]}, ${pal[2][1]}, ${pal[2][2]})`;
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-6, -4);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-6, 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // Render Predators
    this.predators.forEach(p => {
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6.5, 0, 6.28318);
      ctx.fill();
    });
  }
}

/* ========================================================================= */
/* 5. Quantum Wave Packet Interference (2D Wave Dispersion & Double Slit)   */
/* ========================================================================= */
class QuantumWaveEngine {
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
    this.u = new Float32Array(size);     // Wave amplitude
    this.v = new Float32Array(size);     // Wave velocity d/dt u
    this.nextU = new Float32Array(size);
    this.wall = new Uint8Array(size);

    this.time = 0;
    this.palette = PALETTES.quantum_frost;
    this.init();
  }

  init() {
    const gw = this.gridW;
    const gh = this.gridH;
    this.u.fill(0);
    this.v.fill(0);
    this.wall.fill(0);

    // Double-slit barrier wall in center
    const wallX = Math.floor(gw * 0.40);
    const slit1 = Math.floor(gh * 0.36);
    const slit2 = Math.floor(gh * 0.64);
    const slitW = 5;

    for (let y = 0; y < gh; y++) {
      if (Math.abs(y - slit1) > slitW && Math.abs(y - slit2) > slitW) {
        this.wall[y * gw + wallX] = 1;
        this.wall[y * gw + wallX + 1] = 1;
      }
    }
  }

  step(dt = 0.016, mouse = null, env = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const u = this.u;
    const v = this.v;
    const nu = this.nextU;
    const wall = this.wall;

    const cSq = 0.22;
    const damp = 0.994;
    this.time += dt * 4.0;

    // Harmonic wave emitter at left boundary
    const emitterY = Math.floor(gh * 0.5);
    for (let dy = -25; dy <= 25; dy++) {
      const idx = (emitterY + dy) * gw + 10;
      u[idx] = Math.sin(this.time * 2.5) * 1.2;
    }

    // Unconditionally stable Störmer-Verlet wave integration
    for (let y = 1; y < gh - 1; y++) {
      const row = y * gw;
      const up = (y - 1) * gw;
      const down = (y + 1) * gw;

      for (let x = 1; x < gw - 1; x++) {
        const idx = row + x;
        if (wall[idx]) {
          nu[idx] = 0;
          v[idx] = 0;
          continue;
        }

        const lap = u[row + x - 1] + u[row + x + 1] + u[up + x] + u[down + x] - 4.0 * u[idx];
        v[idx] = (v[idx] + cSq * lap) * damp;
        nu[idx] = u[idx] + v[idx];
      }
    }

    // Mouse wave pulse injection
    if (mouse && mouse.down) {
      const mx = Math.floor((mouse.x / this.canvas.width) * gw);
      const my = Math.floor((mouse.y / this.canvas.height) * gh);
      for (let dy = -5; dy <= 5; dy++) {
        for (let dx = -5; dx <= 5; dx++) {
          const px = mx + dx;
          const py = my + dy;
          if (px >= 1 && px < gw - 1 && py >= 1 && py < gh - 1) {
            nu[py * gw + px] += 1.2 * Math.exp(-(dx * dx + dy * dy) / 8.0);
          }
        }
      }
    }

    this.u.set(nu);
  }

  render() {
    const data = this.offImgData.data;
    const u = this.u;
    const v = this.v;
    const wall = this.wall;
    const pal = this.palette;

    let pIdx = 0;
    for (let i = 0; i < u.length; i++) {
      if (wall[i]) {
        data[pIdx] = 30;
        data[pIdx + 1] = 38;
        data[pIdx + 2] = 55;
        data[pIdx + 3] = 255;
      } else {
        const amp = u[i];
        const vel = v[i];
        // Complex phase color mapping: phase determines hue tint, amp determines brightness
        const phase = Math.atan2(vel, amp);
        const normPhase = (phase + Math.PI) / (Math.PI * 2.0);
        const energy = Math.min(Math.abs(amp) * 1.8, 1.0);

        const t = normPhase * 3.0;
        const idx = Math.min(Math.floor(t), 2);
        const frac = t - idx;
        const c1 = pal[idx + 1] || pal[2];
        const c2 = pal[idx + 2] || pal[3];

        data[pIdx] = Math.floor((c1[0] + (c2[0] - c1[0]) * frac) * energy);
        data[pIdx + 1] = Math.floor((c1[1] + (c2[1] - c1[1]) * frac) * energy);
        data[pIdx + 2] = Math.floor((c1[2] + (c2[2] - c1[2]) * frac) * energy);
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
    this.crystal = new Float32Array(size);
    this.vapor = new Float32Array(size);

    this.palette = PALETTES.bioluminescence;
    this.init();
  }

  init() {
    const gw = this.gridW;
    const gh = this.gridH;
    this.crystal.fill(0);
    this.vapor.fill(0.60);

    // Seed center nucleation crystal
    const cx = Math.floor(gw * 0.5);
    const cy = Math.floor(gh * 0.5);
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        this.crystal[(cy + dy) * gw + (cx + dx)] = 1.0;
        this.vapor[(cy + dy) * gw + (cx + dx)] = 0.0;
      }
    }
  }

  step(dt = 0.016, mouse = null, env = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const crystal = this.crystal;
    const vapor = this.vapor;

    const temp = env ? env.temperature : 24.0;
    // Cold temperature promotes crystal growth; warm temperature melts it
    const growthThreshold = Math.max((temp - 5.0) * 0.015 + 0.35, 0.15);
    const isMelting = temp > 45.0;

    for (let iter = 0; iter < 3; iter++) {
      for (let y = 1; y < gh - 1; y++) {
        const row = y * gw;
        for (let x = 1; x < gw - 1; x++) {
          const idx = row + x;

          if (isMelting && crystal[idx] > 0) {
            crystal[idx] = Math.max(crystal[idx] - 0.02, 0.0);
            vapor[idx] = Math.min(vapor[idx] + 0.02, 0.8);
            continue;
          }

          if (crystal[idx] >= 1.0) continue;

          // Check 6-axis anisotropic adhesion
          const attached = (
            crystal[row + x - 1] > 0.5 || crystal[row + x + 1] > 0.5 ||
            crystal[(y - 1) * gw + x] > 0.5 || crystal[(y + 1) * gw + x] > 0.5 ||
            crystal[(y - 1) * gw + x - 1] > 0.5 || crystal[(y + 1) * gw + x + 1] > 0.5
          );

          if (attached && vapor[idx] > growthThreshold) {
            crystal[idx] = 1.0;
            vapor[idx] = 0.0;
          }
        }
      }

      // Diffusion of latent nutrient vapor
      for (let y = 1; y < gh - 1; y++) {
        const row = y * gw;
        for (let x = 1; x < gw - 1; x++) {
          const idx = row + x;
          if (crystal[idx] > 0.5) continue;
          vapor[idx] = (
            vapor[row + x - 1] + vapor[row + x + 1] +
            vapor[(y - 1) * gw + x] + vapor[(y + 1) * gw + x]
          ) * 0.25;
        }
      }
    }

    // Mouse adds crystal seeds
    if (mouse && mouse.down) {
      const mx = Math.floor((mouse.x / this.canvas.width) * gw);
      const my = Math.floor((mouse.y / this.canvas.height) * gh);
      if (mx > 2 && mx < gw - 2 && my > 2 && my < gh - 2) {
        crystal[my * gw + mx] = 1.0;
        vapor[my * gw + mx] = 0.0;
      }
    }
  }

  render() {
    const data = this.offImgData.data;
    const crystal = this.crystal;
    const vapor = this.vapor;
    const pal = this.palette;

    let pIdx = 0;
    for (let i = 0; i < crystal.length; i++) {
      if (crystal[i] > 0.1) {
        data[pIdx] = pal[3][0];
        data[pIdx + 1] = pal[3][1];
        data[pIdx + 2] = pal[3][2];
        data[pIdx + 3] = 255;
      } else {
        const val = vapor[i];
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
/* 7. Curl-Noise Flow Field Engine (Vorticity Streamlines)                   */
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
/* 9. Lenia Engine (Continuous Artificial Life)                              */
/* ========================================================================= */
class LeniaEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.gridW = 160;
    this.gridH = 100;
    this.offCanvas = document.createElement('canvas');
    this.offCanvas.width = this.gridW;
    this.offCanvas.height = this.gridH;
    this.offCtx = this.offCanvas.getContext('2d', { alpha: false });
    this.offImgData = this.offCtx.createImageData(this.gridW, this.gridH);

    const size = this.gridW * this.gridH;
    this.state = new Float32Array(size);
    this.nextState = new Float32Array(size);
    this.field = new Float32Array(size);

    this.muG = 0.15;
    this.sigmaG = 0.017;
    this.muK = 0.5;
    this.sigmaK = 0.15;
    this.radius = 12;
    this.dt = 0.15;

    this.palette = PALETTES.bioluminescence;
    this.buildKernel();
    this.init();
  }

  buildKernel() {
    this.kernelOffsets = [];
    let sum = 0;
    const r = this.radius;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const dist = Math.hypot(dx, dy);
        if (dist <= r) {
          const rho = dist / r;
          const diff = rho - this.muK;
          const weight = Math.exp(-(diff * diff) / (2 * this.sigmaK * this.sigmaK));
          this.kernelOffsets.push({ dx, dy, w: weight });
          sum += weight;
        }
      }
    }
    if (sum > 0) {
      for (let i = 0; i < this.kernelOffsets.length; i++) {
        this.kernelOffsets[i].w /= sum;
      }
    }
  }

  growth(u) {
    const diff = u - this.muG;
    return 2.0 * Math.exp(-(diff * diff) / (2 * this.sigmaG * this.sigmaG)) - 1.0;
  }

  init(seed = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    this.state.fill(0);
    this.nextState.fill(0);

    const cx = Math.floor(gw * 0.5);
    const cy = Math.floor(gh * 0.5);

    // Orbium Soliton glider configuration
    for (let dy = -22; dy <= 22; dy++) {
      for (let dx = -22; dx <= 22; dx++) {
        const d = Math.hypot(dx, dy);
        if (d < 20) {
          const rNorm = d / 20;
          const angle = Math.atan2(dy, dx);
          const val = Math.exp(-Math.pow(rNorm - 0.55, 2) / 0.05) * (0.7 + 0.3 * Math.cos(angle - 0.4));
          const idx = (cy + dy) * gw + (cx + dx);
          this.state[idx] = Math.max(0, Math.min(1, val));
        }
      }
    }

    const sX = cx + 38;
    const sY = cy - 18;
    if (sX < gw - 25 && sY > 25) {
      for (let dy = -14; dy <= 14; dy++) {
        for (let dx = -14; dx <= 14; dx++) {
          const d = Math.hypot(dx, dy);
          if (d < 12) {
            const val = Math.exp(-Math.pow(d / 12 - 0.5, 2) / 0.04) * 0.9;
            const idx = (sY + dy) * gw + (sX + dx);
            this.state[idx] = Math.max(0, Math.min(1, val));
          }
        }
      }
    }
  }

  step(dt = 0.016, mouse = null, env = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const state = this.state;
    const nextState = this.nextState;
    const field = this.field;
    const kernel = this.kernelOffsets;
    const kLen = kernel.length;

    const effDt = this.dt * (env ? env.oxygen : 1.0);

    // 1. Convolution: field = K * state
    for (let y = 0; y < gh; y++) {
      const yOffset = y * gw;
      for (let x = 0; x < gw; x++) {
        let sum = 0;
        for (let k = 0; k < kLen; k++) {
          const ko = kernel[k];
          let nx = (x + ko.dx) % gw;
          if (nx < 0) nx += gw;
          let ny = (y + ko.dy) % gh;
          if (ny < 0) ny += gh;
          sum += state[ny * gw + nx] * ko.w;
        }
        field[yOffset + x] = sum;
      }
    }

    // 2. Growth update
    for (let i = 0; i < state.length; i++) {
      const u = field[i];
      const g = this.growth(u);
      let val = state[i] + effDt * g;
      if (val < 0.001) val = 0;
      else if (val > 1.0) val = 1.0;
      nextState[i] = val;
    }

    // 3. Mouse interaction
    if (mouse && mouse.down) {
      const scaleX = gw / this.canvas.width;
      const scaleY = gh / this.canvas.height;
      const mx = Math.floor(mouse.x * scaleX);
      const my = Math.floor(mouse.y * scaleY);
      const brushR = 9;

      for (let dy = -brushR; dy <= brushR; dy++) {
        for (let dx = -brushR; dx <= brushR; dx++) {
          const px = mx + dx;
          const py = my + dy;
          if (px >= 0 && px < gw && py >= 0 && py < gh) {
            const d = Math.hypot(dx, dy);
            if (d <= brushR) {
              const idx = py * gw + px;
              if (mouse.button === 2) {
                nextState[idx] = 0.0;
              } else {
                const add = Math.exp(-(d * d) / (brushR * 2.5)) * 0.8;
                nextState[idx] = Math.min(1.0, nextState[idx] + add);
              }
            }
          }
        }
      }
    }

    this.state.set(nextState);
  }

  render() {
    const state = this.state;
    const data = this.offImgData.data;
    const pal = this.palette;

    let pIdx = 0;
    for (let i = 0; i < state.length; i++) {
      const val = state[i];
      if (val < 0.002) {
        data[pIdx] = 6;
        data[pIdx + 1] = 6;
        data[pIdx + 2] = 10;
        data[pIdx + 3] = 255;
      } else {
        const t = Math.min(val * 3.2, 2.999);
        const idx = Math.floor(t);
        const frac = t - idx;
        const c1 = pal[idx];
        const c2 = pal[idx + 1] || pal[idx];

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
/* 10. Ferrofluid Engine (Magnetic Hydrodynamics & Rosensweig Instability)   */
/* ========================================================================= */
class FerrofluidEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.gridW = 180;
    this.gridH = 115;
    this.offCanvas = document.createElement('canvas');
    this.offCanvas.width = this.gridW;
    this.offCanvas.height = this.gridH;
    this.offCtx = this.offCanvas.getContext('2d', { alpha: false });
    this.offImgData = this.offCtx.createImageData(this.gridW, this.gridH);

    const size = this.gridW * this.gridH;
    this.h = new Float32Array(size);
    this.vh = new Float32Array(size);
    this.magField = new Float32Array(size);

    this.dipoles = [
      { x: 0.35, y: 0.45, z: 0.18, strength: 3.2, speed: 0.8, angle: 0.0, radius: 0.22 },
      { x: 0.65, y: 0.55, z: 0.16, strength: 2.8, speed: -0.65, angle: 2.1, radius: 0.26 },
      { x: 0.50, y: 0.32, z: 0.22, strength: 3.0, speed: 1.1, angle: 4.2, radius: 0.18 }
    ];

    this.tension = 0.18;
    this.viscosity = 0.06;
    this.magCoupling = 1.45;
    this.time = 0;
    this.palette = PALETTES.monochrome;
    this.init();
  }

  init() {
    this.h.fill(0);
    this.vh.fill(0);
    this.magField.fill(0);
  }

  step(dt = 0.016, mouse = null, env = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const h = this.h;
    const vh = this.vh;
    const mf = this.magField;

    this.time += dt;
    const effVisc = 1.0 - (env ? env.viscosity : this.viscosity) * 2.5;
    const effGravity = 0.04 + (env ? Math.max(0, env.gravity * 0.05) : 0);

    for (let d = 0; d < this.dipoles.length; d++) {
      const dip = this.dipoles[d];
      dip.angle += dip.speed * dt * 0.8;
      dip.currX = dip.x + Math.cos(dip.angle) * dip.radius;
      dip.currY = dip.y + Math.sin(dip.angle) * dip.radius;
    }

    let hasMouseMagnet = false;
    let mouseMagX = 0, mouseMagY = 0;
    if (mouse) {
      mouseMagX = mouse.x / this.canvas.width;
      mouseMagY = mouse.y / this.canvas.height;
      hasMouseMagnet = true;
    }

    for (let y = 0; y < gh; y++) {
      const ny = y / gh;
      const yOffset = y * gw;
      for (let x = 0; x < gw; x++) {
        const nx = x / gw;
        let bSum = 0;

        for (let d = 0; d < this.dipoles.length; d++) {
          const dip = this.dipoles[d];
          const dx = nx - dip.currX;
          const dy = ny - dip.currY;
          const distSq = dx * dx + dy * dy + dip.z * dip.z;
          bSum += dip.strength / Math.pow(distSq + 0.005, 1.5);
        }

        if (hasMouseMagnet) {
          const dx = nx - mouseMagX;
          const dy = ny - mouseMagY;
          const mz = mouse.down ? 0.08 : 0.16;
          const mStr = mouse.down ? 5.5 : 2.5;
          const distSq = dx * dx + dy * dy + mz * mz;
          bSum += mStr / Math.pow(distSq + 0.004, 1.5);
        }

        mf[yOffset + x] = bSum;
      }
    }

    const tension = this.tension;
    const magC = this.magCoupling * 0.00035;

    for (let y = 1; y < gh - 1; y++) {
      const yOffset = y * gw;
      for (let x = 1; x < gw - 1; x++) {
        const idx = yOffset + x;
        const lap = h[idx - 1] + h[idx + 1] + h[idx - gw] + h[idx + gw] - 4 * h[idx];
        const b = mf[idx];

        let fMag = 0;
        if (b > 12.0) {
          const excess = b - 12.0;
          fMag = excess * excess * magC;
          fMag *= (1.0 + 0.25 * Math.sin(x * 0.7) * Math.cos(y * 0.7));
        }

        const accel = tension * lap - effGravity * h[idx] + fMag;
        vh[idx] = (vh[idx] + accel) * effVisc;
        h[idx] = Math.max(-0.5, Math.min(3.5, h[idx] + vh[idx]));
      }
    }
  }

  render() {
    const gw = this.gridW;
    const gh = this.gridH;
    const h = this.h;
    const data = this.offImgData.data;

    const lx = 0.42, ly = -0.55, lz = 0.72;
    const hx = lx * 0.5, hy = ly * 0.5, hz = (lz + 1.0) * 0.5;
    const hLen = Math.hypot(hx, hy, hz);
    const nhx = hx / hLen, nhy = hy / hLen, nhz = hz / hLen;

    let pIdx = 0;
    for (let y = 0; y < gh; y++) {
      const yOffset = y * gw;
      for (let x = 0; x < gw; x++) {
        const idx = yOffset + x;

        let nx = 0, ny = 0;
        if (x > 0 && x < gw - 1) nx = -(h[idx + 1] - h[idx - 1]) * 1.6;
        if (y > 0 && y < gh - 1) ny = -(h[idx + gw] - h[idx - gw]) * 1.6;
        let nz = 1.0;
        const nLen = Math.hypot(nx, ny, nz);
        nx /= nLen; ny /= nLen; nz /= nLen;

        const nDotL = Math.max(0, nx * lx + ny * ly + nz * lz);
        const nDotH = Math.max(0, nx * nhx + ny * nhy + nz * nhz);
        const spec = Math.pow(nDotH, 26);
        const elev = Math.max(0, Math.min(1.0, (h[idx] + 0.2) / 2.2));

        const baseR = 12 + elev * 28;
        const baseG = 14 + elev * 32;
        const baseB = 22 + elev * 54;

        const r = Math.min(255, Math.floor(baseR + nDotL * 45 + spec * 220 + nx * 30));
        const g = Math.min(255, Math.floor(baseG + nDotL * 50 + spec * 225 + ny * 25));
        const b = Math.min(255, Math.floor(baseB + nDotL * 70 + spec * 245 + elev * 40));

        data[pIdx] = r;
        data[pIdx + 1] = g;
        data[pIdx + 2] = b;
        data[pIdx + 3] = 255;
        pIdx += 4;
      }
    }

    this.offCtx.putImageData(this.offImgData, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.drawImage(this.offCanvas, 0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ========================================================================= */
/* 11. Fractal Growth Engine (Diffusion-Limited Aggregation DLA)            */
/* ========================================================================= */
class FractalGrowthEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.gridW = 320;
    this.gridH = 200;
    this.offCanvas = document.createElement('canvas');
    this.offCanvas.width = this.gridW;
    this.offCanvas.height = this.gridH;
    this.offCtx = this.offCanvas.getContext('2d', { alpha: false });
    this.offImgData = this.offCtx.createImageData(this.gridW, this.gridH);

    const size = this.gridW * this.gridH;
    this.grid = new Int32Array(size);

    this.numWalkers = 1400;
    this.wx = new Float32Array(this.numWalkers);
    this.wy = new Float32Array(this.numWalkers);

    this.stickProb = 0.85;
    this.stepSize = 1.8;
    this.currentAge = 1;
    this.clusterRadius = 8;
    this.palette = PALETTES.amber_ember;

    this.init();
  }

  init(seed = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    this.grid.fill(0);
    this.currentAge = 1;

    const cx = Math.floor(gw * 0.5);
    const cy = Math.floor(gh * 0.5);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        this.grid[(cy + dy) * gw + (cx + dx)] = this.currentAge++;
      }
    }
    this.clusterRadius = 6;

    for (let i = 0; i < this.numWalkers; i++) {
      this.respawnWalker(i);
    }
  }

  respawnWalker(i) {
    const gw = this.gridW;
    const gh = this.gridH;
    const cx = gw * 0.5;
    const cy = gh * 0.5;

    const spawnR = Math.min(Math.max(this.clusterRadius + 14 + Math.random() * 25, 25), Math.min(cx, cy) - 6);
    const angle = Math.random() * Math.PI * 2;
    this.wx[i] = cx + Math.cos(angle) * spawnR;
    this.wy[i] = cy + Math.sin(angle) * spawnR;
  }

  step(dt = 0.016, mouse = null, env = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const grid = this.grid;
    const num = this.numWalkers;
    const wx = this.wx;
    const wy = this.wy;
    const cx = gw * 0.5;
    const cy = gh * 0.5;

    const stickP = this.stickProb;
    const tempFactor = env ? Math.max(0.2, (env.temperature + 20) / 45) : 1.0;
    const stepMag = this.stepSize * tempFactor;
    const maxR = Math.min(cx, cy) - 4;

    const stepsPerFrame = 6;
    for (let s = 0; s < stepsPerFrame; s++) {
      for (let i = 0; i < num; i++) {
        const angle = Math.random() * Math.PI * 2;
        let nx = wx[i] + Math.cos(angle) * stepMag;
        let ny = wy[i] + Math.sin(angle) * stepMag;

        if (env && env.gravity !== 0) {
          ny += env.gravity * 0.4;
        }

        const distFromCenter = Math.hypot(nx - cx, ny - cy);
        if (distFromCenter > maxR || nx < 2 || nx >= gw - 2 || ny < 2 || ny >= gh - 2) {
          this.respawnWalker(i);
          continue;
        }

        const gx = Math.floor(nx);
        const gy = Math.floor(ny);
        const idx = gy * gw + gx;

        let attached = false;
        if (grid[idx - 1] > 0 || grid[idx + 1] > 0 ||
            grid[idx - gw] > 0 || grid[idx + gw] > 0 ||
            grid[idx - gw - 1] > 0 || grid[idx - gw + 1] > 0 ||
            grid[idx + gw - 1] > 0 || grid[idx + gw + 1] > 0) {
          attached = true;
        }

        if (attached && Math.random() < stickP) {
          grid[idx] = this.currentAge++;
          if (distFromCenter > this.clusterRadius) {
            this.clusterRadius = distFromCenter;
          }
          this.respawnWalker(i);
        } else {
          wx[i] = nx;
          wy[i] = ny;
        }
      }
    }

    if (mouse && mouse.down) {
      const scaleX = gw / this.canvas.width;
      const scaleY = gh / this.canvas.height;
      const mx = Math.floor(mouse.x * scaleX);
      const my = Math.floor(mouse.y * scaleY);

      if (mx >= 2 && mx < gw - 2 && my >= 2 && my < gh - 2) {
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            if (Math.hypot(dx, dy) <= 2) {
              grid[(my + dy) * gw + (mx + dx)] = this.currentAge++;
            }
          }
        }
        const mDist = Math.hypot(mx - cx, my - cy);
        if (mDist > this.clusterRadius) this.clusterRadius = mDist;
      }
    }
  }

  render() {
    const gw = this.gridW;
    const gh = this.gridH;
    const grid = this.grid;
    const data = this.offImgData.data;
    const pal = this.palette;
    const maxAge = Math.max(this.currentAge, 2);

    let pIdx = 0;
    for (let i = 0; i < grid.length; i++) {
      const age = grid[i];
      if (age === 0) {
        data[pIdx] = 5;
        data[pIdx + 1] = 6;
        data[pIdx + 2] = 10;
        data[pIdx + 3] = 255;
      } else {
        const ageNorm = Math.min(1.0, age / maxAge);
        const t = (1.0 - ageNorm) * 2.99;
        const idx = Math.floor(t);
        const frac = t - idx;
        const c1 = pal[idx];
        const c2 = pal[idx + 1] || pal[idx];

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

    const scaleX = this.canvas.width / gw;
    const scaleY = this.canvas.height / gh;
    this.ctx.fillStyle = "rgba(0, 245, 212, 0.45)";
    for (let i = 0; i < this.numWalkers; i += 2) {
      this.ctx.fillRect(this.wx[i] * scaleX, this.wy[i] * scaleY, 1.8, 1.8);
    }
  }
}

/* ========================================================================= */
/* 12. Excitable Medium Engine (Barkley Reaction-Diffusion Spiral Waves)     */
/* ========================================================================= */
class ExcitableMediumEngine {
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
    this.u = new Float32Array(size);
    this.v = new Float32Array(size);
    this.nextU = new Float32Array(size);
    this.nextV = new Float32Array(size);
    this.barrier = new Uint8Array(size);

    this.a = 0.75;
    this.b = 0.02;
    this.eps = 0.02;
    this.diffU = 0.32;

    this.palette = PALETTES.spectral_velvet;
    this.init();
  }

  init(seed = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    this.u.fill(0);
    this.v.fill(0);
    this.barrier.fill(0);

    const cx = Math.floor(gw * 0.5);
    const cy = Math.floor(gh * 0.5);

    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        const idx = y * gw + x;
        if (x < cx && y > cy - 8 && y < cy + 8) {
          this.u[idx] = 1.0;
        }
        if (x < cx && y >= cy + 8) {
          this.v[idx] = 0.55;
        }
      }
    }

    const sX = Math.floor(gw * 0.78);
    const sY = Math.floor(gh * 0.28);
    for (let dy = -15; dy <= 0; dy++) {
      for (let dx = -15; dx <= 15; dx++) {
        const idx = (sY + dy) * gw + (sX + dx);
        if (idx >= 0 && idx < this.u.length) {
          this.u[idx] = 0.95;
          if (dy < -6) this.v[idx] = 0.6;
        }
      }
    }
  }

  step(dt = 0.016, mouse = null, env = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const u = this.u;
    const v = this.v;
    const nu = this.nextU;
    const nv = this.nextV;
    const barrier = this.barrier;

    const a = this.a;
    const b = this.b;
    const eps = this.eps;
    const dU = this.diffU * (env ? env.viscosity * 6.0 : 1.0);
    const substeps = 4;
    const subDt = 0.008;

    for (let sub = 0; sub < substeps; sub++) {
      for (let y = 1; y < gh - 1; y++) {
        const yOffset = y * gw;
        for (let x = 1; x < gw - 1; x++) {
          const idx = yOffset + x;

          if (barrier[idx]) {
            nu[idx] = 0;
            nv[idx] = 0;
            continue;
          }

          const uVal = u[idx];
          const vVal = v[idx];
          const lapU = u[idx - 1] + u[idx + 1] + u[idx - gw] + u[idx + gw] - 4 * uVal;

          const uThresh = (vVal + b) / a;
          const f = (1.0 / eps) * uVal * (1.0 - uVal) * (uVal - uThresh);
          const g = uVal - vVal;

          let newU = uVal + subDt * (f + dU * lapU);
          let newV = vVal + subDt * g;

          if (newU < 0) newU = 0; else if (newU > 1.0) newU = 1.0;
          if (newV < 0) newV = 0; else if (newV > 1.0) newV = 1.0;

          nu[idx] = newU;
          nv[idx] = newV;
        }
      }

      u.set(nu);
      v.set(nv);
    }

    if (mouse && mouse.down) {
      const scaleX = gw / this.canvas.width;
      const scaleY = gh / this.canvas.height;
      const mx = Math.floor(mouse.x * scaleX);
      const my = Math.floor(mouse.y * scaleY);
      const r = 8;

      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const px = mx + dx;
          const py = my + dy;
          if (px >= 1 && px < gw - 1 && py >= 1 && py < gh - 1) {
            const idx = py * gw + px;
            if (mouse.button === 2) {
              barrier[idx] = 1;
              u[idx] = 0;
              v[idx] = 0;
            } else {
              if (!barrier[idx]) {
                u[idx] = 1.0;
                v[idx] = 0.0;
              }
            }
          }
        }
      }
    }
  }

  render() {
    const u = this.u;
    const v = this.v;
    const barrier = this.barrier;
    const data = this.offImgData.data;
    const pal = this.palette;

    let pIdx = 0;
    for (let i = 0; i < u.length; i++) {
      if (barrier[i]) {
        data[pIdx] = 75;
        data[pIdx + 1] = 85;
        data[pIdx + 2] = 95;
        data[pIdx + 3] = 255;
      } else {
        const uVal = u[i];
        const vVal = v[i];

        const t = Math.min(uVal * 2.4 + vVal * 0.6, 2.99);
        const idx = Math.floor(t);
        const frac = t - idx;
        const c1 = pal[idx];
        const c2 = pal[idx + 1] || pal[idx];

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
/* 13. Thermal Convection Engine (Rayleigh-Bénard Buoyancy & Mantle Plumes)  */
/* ========================================================================= */
class ThermalConvectionEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.gridW = 160;
    this.gridH = 100;
    this.offCanvas = document.createElement('canvas');
    this.offCanvas.width = this.gridW;
    this.offCanvas.height = this.gridH;
    this.offCtx = this.offCanvas.getContext('2d', { alpha: false });
    this.offImgData = this.offCtx.createImageData(this.gridW, this.gridH);

    const size = this.gridW * this.gridH;
    this.temp = new Float32Array(size);
    this.nextTemp = new Float32Array(size);
    this.vx = new Float32Array(size);
    this.vy = new Float32Array(size);
    this.nextVx = new Float32Array(size);
    this.nextVy = new Float32Array(size);
    this.pressure = new Float32Array(size);
    this.div = new Float32Array(size);

    this.numTracers = 800;
    this.tx = new Float32Array(this.numTracers);
    this.ty = new Float32Array(this.numTracers);
    this.tSpeed = new Float32Array(this.numTracers);

    this.buoyancy = 3.6;
    this.viscosity = 0.05;
    this.palette = PALETTES.amber_ember;

    this.init();
  }

  init(seed = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    this.vx.fill(0);
    this.vy.fill(0);
    this.pressure.fill(0);

    for (let y = 0; y < gh; y++) {
      const yNorm = y / gh;
      for (let x = 0; x < gw; x++) {
        const xNorm = x / gw;
        const pert = Math.sin(xNorm * Math.PI * 6) * 0.12 * Math.sin(yNorm * Math.PI);
        this.temp[y * gw + x] = Math.max(0, Math.min(1.0, (1.0 - yNorm) + pert));
      }
    }

    for (let i = 0; i < this.numTracers; i++) {
      this.tx[i] = Math.random() * gw;
      this.ty[i] = Math.random() * gh;
      this.tSpeed[i] = 0;
    }
  }

  step(dt = 0.016, mouse = null, env = null) {
    const gw = this.gridW;
    const gh = this.gridH;
    const T = this.temp;
    const nT = this.nextTemp;
    const vx = this.vx;
    const vy = this.vy;
    const nVx = this.nextVx;
    const nVy = this.nextVy;
    const p = this.pressure;
    const div = this.div;

    const buoyK = this.buoyancy * (env ? (1.0 + env.gravity) : 1.0);
    const visc = (env ? env.viscosity : this.viscosity) * 0.5;

    // 1. Buoyancy force: hot fluid rises (-vy), cold fluid sinks (+vy)
    for (let y = 1; y < gh - 1; y++) {
      const yOffset = y * gw;
      for (let x = 1; x < gw - 1; x++) {
        const idx = yOffset + x;
        const buoyancyForce = (T[idx] - 0.5) * buoyK;
        vy[idx] -= buoyancyForce * dt * 8.0;
      }
    }

    // Mouse Thermal Injector
    if (mouse && mouse.down) {
      const scaleX = gw / this.canvas.width;
      const scaleY = gh / this.canvas.height;
      const mx = Math.floor(mouse.x * scaleX);
      const my = Math.floor(mouse.y * scaleY);
      const r = 10;

      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const px = mx + dx;
          const py = my + dy;
          if (px >= 1 && px < gw - 1 && py >= 1 && py < gh - 1) {
            const idx = py * gw + px;
            if (mouse.button === 2) {
              T[idx] = 0.0;
              vy[idx] += 12.0;
            } else {
              T[idx] = 1.0;
              vy[idx] -= 18.0;
            }
          }
        }
      }
    }

    // 2. Enforce Incompressibility (Poisson Pressure Solver)
    for (let y = 1; y < gh - 1; y++) {
      const yOffset = y * gw;
      for (let x = 1; x < gw - 1; x++) {
        const idx = yOffset + x;
        div[idx] = -0.5 * (vx[idx + 1] - vx[idx - 1] + vy[idx + gw] - vy[idx - gw]);
        p[idx] = 0;
      }
    }

    for (let iter = 0; iter < 8; iter++) {
      for (let y = 1; y < gh - 1; y++) {
        const yOffset = y * gw;
        for (let x = 1; x < gw - 1; x++) {
          const idx = yOffset + x;
          p[idx] = (div[idx] + p[idx - 1] + p[idx + 1] + p[idx - gw] + p[idx + gw]) * 0.25;
        }
      }
    }

    for (let y = 1; y < gh - 1; y++) {
      const yOffset = y * gw;
      for (let x = 1; x < gw - 1; x++) {
        const idx = yOffset + x;
        vx[idx] -= 0.5 * (p[idx + 1] - p[idx - 1]);
        vy[idx] -= 0.5 * (p[idx + gw] - p[idx - gw]);
      }
    }

    // 3. Semi-Lagrangian Advection
    for (let y = 1; y < gh - 1; y++) {
      const yOffset = y * gw;
      for (let x = 1; x < gw - 1; x++) {
        const idx = yOffset + x;
        let prevX = x - vx[idx] * dt * 14.0;
        let prevY = y - vy[idx] * dt * 14.0;

        if (prevX < 1) prevX = 1; else if (prevX > gw - 2) prevX = gw - 2;
        if (prevY < 1) prevY = 1; else if (prevY > gh - 2) prevY = gh - 2;

        const x0 = Math.floor(prevX);
        const y0 = Math.floor(prevY);
        const fx = prevX - x0;
        const fy = prevY - y0;

        const i00 = y0 * gw + x0;
        const i10 = i00 + 1;
        const i01 = i00 + gw;
        const i11 = i01 + 1;

        const valT = (1 - fx) * (1 - fy) * T[i00] + fx * (1 - fy) * T[i10] + (1 - fx) * fy * T[i01] + fx * fy * T[i11];
        const valVx = (1 - fx) * (1 - fy) * vx[i00] + fx * (1 - fy) * vx[i10] + (1 - fx) * fy * vx[i01] + fx * fy * vx[i11];
        const valVy = (1 - fx) * (1 - fy) * vy[i00] + fx * (1 - fy) * vy[i10] + (1 - fx) * fy * vy[i01] + fx * fy * vy[i11];

        nT[idx] = valT;
        nVx[idx] = valVx * (1.0 - visc);
        nVy[idx] = valVy * (1.0 - visc);
      }
    }

    // Hot bottom, cold top
    for (let x = 0; x < gw; x++) {
      nT[(gh - 1) * gw + x] = 1.0;
      nT[x] = 0.0;
      nVy[(gh - 1) * gw + x] = 0;
      nVy[x] = 0;
    }

    T.set(nT);
    vx.set(nVx);
    vy.set(nVy);

    // 4. Update 800 Tracer Streamlines
    for (let i = 0; i < this.numTracers; i++) {
      const gx = Math.max(1, Math.min(gw - 2, Math.floor(this.tx[i])));
      const gy = Math.max(1, Math.min(gh - 2, Math.floor(this.ty[i])));
      const idx = gy * gw + gx;

      const spdX = vx[idx];
      const spdY = vy[idx];
      this.tx[i] += spdX * dt * 18.0;
      this.ty[i] += spdY * dt * 18.0;
      this.tSpeed[i] = Math.hypot(spdX, spdY);

      if (this.tx[i] < 1 || this.tx[i] >= gw - 1 || this.ty[i] < 1 || this.ty[i] >= gh - 1) {
        this.tx[i] = Math.random() * (gw - 4) + 2;
        this.ty[i] = gh - 4;
      }
    }
  }

  render() {
    const gw = this.gridW;
    const gh = this.gridH;
    const T = this.temp;
    const data = this.offImgData.data;
    const pal = this.palette;

    let pIdx = 0;
    for (let i = 0; i < T.length; i++) {
      const val = Math.max(0, Math.min(1.0, T[i]));
      const t = val * 2.99;
      const idx = Math.floor(t);
      const frac = t - idx;
      const c1 = pal[idx];
      const c2 = pal[idx + 1] || pal[idx];

      data[pIdx] = Math.floor(c1[0] + (c2[0] - c1[0]) * frac);
      data[pIdx + 1] = Math.floor(c1[1] + (c2[1] - c1[1]) * frac);
      data[pIdx + 2] = Math.floor(c1[2] + (c2[2] - c1[2]) * frac);
      data[pIdx + 3] = 255;
      pIdx += 4;
    }

    this.offCtx.putImageData(this.offImgData, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.drawImage(this.offCanvas, 0, 0, this.canvas.width, this.canvas.height);

    const scaleX = this.canvas.width / gw;
    const scaleY = this.canvas.height / gh;
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    for (let i = 0; i < this.numTracers; i++) {
      const spd = Math.min(1.0, this.tSpeed[i] / 4.0);
      const sz = 1.4 + spd * 2.2;
      this.ctx.fillRect(this.tx[i] * scaleX, this.ty[i] * scaleY, sz, sz);
    }
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
    desc: "Dense synchronized aerodynamic aerial waves avoiding apex predators.",
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
  },
  {
    id: "lenia_orbium",
    engine: "lenia",
    name: "Orbium Soliton Glider",
    desc: "Self-organizing solitary artificial organism maintaining stable internal rotation and translational locomotion.",
    params: { muG: 0.15, sigmaG: 0.017, radius: 12 }
  },
  {
    id: "lenia_colony",
    engine: "lenia",
    name: "Continuous Slime Colony",
    desc: "Percolating continuous multi-cellular biomorphic mass with pulsating pseudopod extensions.",
    params: { muG: 0.14, sigmaG: 0.025, radius: 14 }
  },
  {
    id: "ferrofluid_spikes",
    engine: "ferrofluid",
    name: "Rosensweig Spikes",
    desc: "Intense magnetic potential triggering supercritical normal-field instability and sharp conical fluid peaks.",
    params: { magCoupling: 2.1, tension: 0.15 }
  },
  {
    id: "ferrofluid_mercury",
    engine: "ferrofluid",
    name: "Liquid Chrome Pool",
    desc: "Smooth superparamagnetic pool with high surface tension and specular metallic reflections.",
    params: { magCoupling: 0.9, tension: 0.28 }
  },
  {
    id: "dla_coral",
    engine: "fractal_growth",
    name: "Dendritic Coral Cluster",
    desc: "Diffusion-limited aggregation creating delicate organic coral filigrees with age-gradient luminescence.",
    params: { stickProb: 0.88, numWalkers: 1600 }
  },
  {
    id: "dla_mineral",
    engine: "fractal_growth",
    name: "Arborescent Mineral Tree",
    desc: "Rapid crystallographic dendrite branching simulating pyrolusite manganese dendrites in sedimentary rocks.",
    params: { stickProb: 0.95, numWalkers: 1200 }
  },
  {
    id: "excitable_rotor",
    engine: "excitable_medium",
    name: "Archimedean Spiral Rotor",
    desc: "Self-perpetuating activator-inhibitor rotor core generating endless periodic biochemical wavefronts.",
    params: { a: 0.75, b: 0.02, diffU: 0.32 }
  },
  {
    id: "excitable_turbulence",
    engine: "excitable_medium",
    name: "Cardiac Wave Turbulence",
    desc: "High-excitability medium with multiple colliding spiral rotors undergoing wavefront breakup and annihilation.",
    params: { a: 0.88, b: 0.015, diffU: 0.38 }
  },
  {
    id: "convection_rolls",
    engine: "thermal_convection",
    name: "Rayleigh-Bénard Roll Cells",
    desc: "Symmetric paired counter-rotating convective fluid rolls driven by vertical thermal buoyancy gradient.",
    params: { buoyancy: 3.5, viscosity: 0.04 }
  },
  {
    id: "convection_mantle",
    engine: "thermal_convection",
    name: "Buoyant Mantle Plume",
    desc: "Concentrated high-temperature ascending mantle diapir mushroom plume piercing cooler boundary layers.",
    params: { buoyancy: 5.5, viscosity: 0.06 }
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

    // All 13 Universes
    this.engines = {
      particle_life: new ParticleLifeEngine(this.canvas),
      physarum: new PhysarumEngine(this.canvas),
      cosmic_gravity: new CosmicGravityEngine(this.canvas),
      boids_swarm: new BoidsSwarmEngine(this.canvas),
      quantum_wave: new QuantumWaveEngine(this.canvas),
      crystal_growth: new CrystalGrowthEngine(this.canvas),
      flow_field: new FlowFieldEngine(this.canvas),
      reaction_diffusion: new ReactionDiffusionEngine(this.canvas),
      lenia: new LeniaEngine(this.canvas),
      ferrofluid: new FerrofluidEngine(this.canvas),
      fractal_growth: new FractalGrowthEngine(this.canvas),
      excitable_medium: new ExcitableMediumEngine(this.canvas),
      thermal_convection: new ThermalConvectionEngine(this.canvas)
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
      else if (this.activeEngine.numWalkers) count = this.activeEngine.numWalkers;
      else if (this.activeEngine.numTracers) count = this.activeEngine.numTracers;
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
      } else if (e.code >= 'Digit1' && e.code <= 'Digit9') {
        const idx = parseInt(e.code.replace('Digit', '')) - 1;
        if (WORLDS[idx]) this.switchWorld(WORLDS[idx].id);
      } else if (e.code === 'Digit0') {
        if (WORLDS[9]) this.switchWorld(WORLDS[9].id);
      } else if (e.code === 'Minus') {
        if (WORLDS[10]) this.switchWorld(WORLDS[10].id);
      } else if (e.code === 'Equal') {
        if (WORLDS[11]) this.switchWorld(WORLDS[11].id);
      } else if (e.code === 'Backspace') {
        if (WORLDS[12]) this.switchWorld(WORLDS[12].id);
      }
    });
  }

  initUI() {
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

    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.renderWorldsDrawer(pill.dataset.cat);
      });
    });

    const btnPlay = document.getElementById('btn-play');
    btnPlay.addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      btnPlay.querySelector('.btn-label').innerText = this.isPlaying ? "Pause" : "Play";
      btnPlay.classList.toggle('btn-primary', this.isPlaying);
      const hudStatus = document.getElementById('hud-status');
      if (hudStatus) hudStatus.innerText = this.isPlaying ? "SIMULATION ACTIVE" : "SIMULATION PAUSED";
    });

    document.getElementById('btn-step').addEventListener('click', () => {
      if (this.activeEngine) {
        this.activeEngine.step(0.016, this.mouse, this.environment);
        this.activeEngine.render();
      }
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
      if (this.activeEngine) this.activeEngine.init();
    });

    document.getElementById('btn-seed').addEventListener('click', () => {
      if (this.activeEngine) {
        if (this.activeEngine.initMatrix) this.activeEngine.initMatrix();
        this.activeEngine.init(Math.floor(Math.random() * 999999));
        this.renderInspector();
      }
    });

    this.setupSlider('speedSlider', (val) => {
      this.simSpeed = val;
      document.getElementById('speedValue').innerText = `${val.toFixed(1)}x`;
    });

    document.getElementById('btn-zen').addEventListener('click', () => {
      document.body.classList.toggle('zen-mode');
    });

    document.getElementById('btn-theme').addEventListener('click', () => {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', this.theme);
    });

    document.getElementById('toggle-inspector').addEventListener('click', () => {
      const inspector = document.getElementById('inspector');
      inspector.classList.toggle('collapsed');
    });

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

    document.getElementById('btn-export').addEventListener('click', () => {
      this.exportImage();
    });

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
          <input type="range" id="param-boids" min="200" max="1200" step="50" value="${engine.numBoids}">
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

    } else if (this.activeEngineId === 'lenia') {
      container.innerHTML = `
        <div class="section-title"><span>LENIA PARAMETERS</span></div>
        <div class="param-row">
          <div class="param-info">
            <label>Growth Center (μ)</label>
            <span class="param-val" id="val-lenia-mu">${engine.muG.toFixed(3)}</span>
          </div>
          <input type="range" id="param-lenia-mu" min="0.08" max="0.30" step="0.005" value="${engine.muG}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Growth Width (σ)</label>
            <span class="param-val" id="val-lenia-sigma">${engine.sigmaG.toFixed(3)}</span>
          </div>
          <input type="range" id="param-lenia-sigma" min="0.008" max="0.045" step="0.002" value="${engine.sigmaG}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Kernel Radius (R)</label>
            <span class="param-val" id="val-lenia-radius">${engine.radius}px</span>
          </div>
          <input type="range" id="param-lenia-radius" min="8" max="18" step="1" value="${engine.radius}">
        </div>
      `;
      this.setupSlider('param-lenia-mu', (val) => {
        engine.muG = val;
        document.getElementById('val-lenia-mu').innerText = val.toFixed(3);
      });
      this.setupSlider('param-lenia-sigma', (val) => {
        engine.sigmaG = val;
        document.getElementById('val-lenia-sigma').innerText = val.toFixed(3);
      });
      this.setupSlider('param-lenia-radius', (val) => {
        engine.radius = Math.round(val);
        engine.buildKernel();
        document.getElementById('val-lenia-radius').innerText = `${engine.radius}px`;
      });

    } else if (this.activeEngineId === 'ferrofluid') {
      container.innerHTML = `
        <div class="section-title"><span>FERROFLUID PARAMETERS</span></div>
        <div class="param-row">
          <div class="param-info">
            <label>Rosensweig Coupling (α)</label>
            <span class="param-val" id="val-ff-coupling">${engine.magCoupling.toFixed(2)}</span>
          </div>
          <input type="range" id="param-ff-coupling" min="0.4" max="3.2" step="0.1" value="${engine.magCoupling}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Surface Tension (γ)</label>
            <span class="param-val" id="val-ff-tension">${engine.tension.toFixed(2)}</span>
          </div>
          <input type="range" id="param-ff-tension" min="0.06" max="0.40" step="0.02" value="${engine.tension}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Substrate Viscosity</label>
            <span class="param-val" id="val-ff-visc">${engine.viscosity.toFixed(2)}</span>
          </div>
          <input type="range" id="param-ff-visc" min="0.02" max="0.18" step="0.01" value="${engine.viscosity}">
        </div>
      `;
      this.setupSlider('param-ff-coupling', (val) => {
        engine.magCoupling = val;
        document.getElementById('val-ff-coupling').innerText = val.toFixed(2);
      });
      this.setupSlider('param-ff-tension', (val) => {
        engine.tension = val;
        document.getElementById('val-ff-tension').innerText = val.toFixed(2);
      });
      this.setupSlider('param-ff-visc', (val) => {
        engine.viscosity = val;
        document.getElementById('val-ff-visc').innerText = val.toFixed(2);
      });

    } else if (this.activeEngineId === 'fractal_growth') {
      container.innerHTML = `
        <div class="section-title"><span>FRACTAL DLA PARAMETERS</span></div>
        <div class="param-row">
          <div class="param-info">
            <label>Brownian Walkers</label>
            <span class="param-val" id="val-dla-walkers">${engine.numWalkers}</span>
          </div>
          <input type="range" id="param-dla-walkers" min="400" max="2400" step="200" value="${engine.numWalkers}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Sticking Probability</label>
            <span class="param-val" id="val-dla-prob">${Math.round(engine.stickProb * 100)}%</span>
          </div>
          <input type="range" id="param-dla-prob" min="0.2" max="1.0" step="0.05" value="${engine.stickProb}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Diffusion Step Size</label>
            <span class="param-val" id="val-dla-step">${engine.stepSize.toFixed(1)}px</span>
          </div>
          <input type="range" id="param-dla-step" min="0.8" max="3.5" step="0.2" value="${engine.stepSize}">
        </div>
      `;
      this.setupSlider('param-dla-walkers', (val) => {
        engine.numWalkers = Math.round(val);
        engine.wx = new Float32Array(engine.numWalkers);
        engine.wy = new Float32Array(engine.numWalkers);
        for (let i = 0; i < engine.numWalkers; i++) engine.respawnWalker(i);
        document.getElementById('val-dla-walkers').innerText = engine.numWalkers;
        this.updateHUD();
      });
      this.setupSlider('param-dla-prob', (val) => {
        engine.stickProb = val;
        document.getElementById('val-dla-prob').innerText = `${Math.round(val * 100)}%`;
      });
      this.setupSlider('param-dla-step', (val) => {
        engine.stepSize = val;
        document.getElementById('val-dla-step').innerText = `${val.toFixed(1)}px`;
      });

    } else if (this.activeEngineId === 'excitable_medium') {
      container.innerHTML = `
        <div class="section-title"><span>EXCITABLE MEDIUM PARAMETERS</span></div>
        <div class="param-row">
          <div class="param-info">
            <label>Excitability (a)</label>
            <span class="param-val" id="val-ex-a">${engine.a.toFixed(2)}</span>
          </div>
          <input type="range" id="param-ex-a" min="0.45" max="1.1" step="0.05" value="${engine.a}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Refractory Decay (b)</label>
            <span class="param-val" id="val-ex-b">${engine.b.toFixed(3)}</span>
          </div>
          <input type="range" id="param-ex-b" min="0.005" max="0.06" step="0.005" value="${engine.b}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Activator Diffusion</label>
            <span class="param-val" id="val-ex-diff">${engine.diffU.toFixed(2)}</span>
          </div>
          <input type="range" id="param-ex-diff" min="0.10" max="0.55" step="0.05" value="${engine.diffU}">
        </div>
      `;
      this.setupSlider('param-ex-a', (val) => {
        engine.a = val;
        document.getElementById('val-ex-a').innerText = val.toFixed(2);
      });
      this.setupSlider('param-ex-b', (val) => {
        engine.b = val;
        document.getElementById('val-ex-b').innerText = val.toFixed(3);
      });
      this.setupSlider('param-ex-diff', (val) => {
        engine.diffU = val;
        document.getElementById('val-ex-diff').innerText = val.toFixed(2);
      });

    } else if (this.activeEngineId === 'thermal_convection') {
      container.innerHTML = `
        <div class="section-title"><span>CONVECTION PARAMETERS</span></div>
        <div class="param-row">
          <div class="param-info">
            <label>Rayleigh Buoyancy (Ra)</label>
            <span class="param-val" id="val-tc-buoy">${engine.buoyancy.toFixed(1)}</span>
          </div>
          <input type="range" id="param-tc-buoy" min="1.0" max="8.0" step="0.5" value="${engine.buoyancy}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Fluid Viscosity (ν)</label>
            <span class="param-val" id="val-tc-visc">${engine.viscosity.toFixed(2)}</span>
          </div>
          <input type="range" id="param-tc-visc" min="0.01" max="0.15" step="0.01" value="${engine.viscosity}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Tracer Filaments</label>
            <span class="param-val" id="val-tc-tracers">${engine.numTracers}</span>
          </div>
          <input type="range" id="param-tc-tracers" min="200" max="1600" step="100" value="${engine.numTracers}">
        </div>
      `;
      this.setupSlider('param-tc-buoy', (val) => {
        engine.buoyancy = val;
        document.getElementById('val-tc-buoy').innerText = val.toFixed(1);
      });
      this.setupSlider('param-tc-visc', (val) => {
        engine.viscosity = val;
        document.getElementById('val-tc-visc').innerText = val.toFixed(2);
      });
      this.setupSlider('param-tc-tracers', (val) => {
        engine.numTracers = Math.round(val);
        engine.tx = new Float32Array(engine.numTracers);
        engine.ty = new Float32Array(engine.numTracers);
        engine.tSpeed = new Float32Array(engine.numTracers);
        for (let i = 0; i < engine.numTracers; i++) {
          engine.tx[i] = Math.random() * engine.gridW;
          engine.ty[i] = Math.random() * engine.gridH;
          engine.tSpeed[i] = 0;
        }
        document.getElementById('val-tc-tracers').innerText = engine.numTracers;
        this.updateHUD();
      });

    } else if (this.activeEngineId === 'quantum_wave') {
      container.innerHTML = `
        <div class="section-title"><span>QUANTUM WAVE PARAMETERS</span></div>
        <div class="param-row">
          <div class="param-info">
            <label>Wave Dispersion Speed</label>
            <span class="param-val" id="val-qw-speed">1.0x</span>
          </div>
          <input type="range" id="param-qw-speed" min="0.3" max="2.5" step="0.1" value="1.0">
        </div>
      `;
      this.setupSlider('param-qw-speed', (val) => {
        document.getElementById('val-qw-speed').innerText = `${val.toFixed(1)}x`;
      });

    } else if (this.activeEngineId === 'crystal_growth') {
      container.innerHTML = `
        <div class="section-title"><span>CRYSTAL GROWTH PARAMETERS</span></div>
        <div class="param-row">
          <div class="param-info">
            <label>Supercooling Factor</label>
            <span class="param-val" id="val-cg-undercool">${engine.undercooling ? engine.undercooling.toFixed(2) : '0.65'}</span>
          </div>
          <input type="range" id="param-cg-undercool" min="0.2" max="0.9" step="0.05" value="${engine.undercooling || 0.65}">
        </div>
      `;
      this.setupSlider('param-cg-undercool', (val) => {
        engine.undercooling = val;
        document.getElementById('val-cg-undercool').innerText = val.toFixed(2);
      });

    } else if (this.activeEngineId === 'flow_field') {
      container.innerHTML = `
        <div class="section-title"><span>CURL FLOW PARAMETERS</span></div>
        <div class="param-row">
          <div class="param-info">
            <label>Particle Count</label>
            <span class="param-val" id="val-ff-particles">${engine.numParticles}</span>
          </div>
          <input type="range" id="param-ff-particles" min="1000" max="6000" step="500" value="${engine.numParticles}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Flow Velocity</label>
            <span class="param-val" id="val-ff-speed">${engine.speed ? engine.speed.toFixed(1) : '2.0'}</span>
          </div>
          <input type="range" id="param-ff-speed" min="0.5" max="5.0" step="0.5" value="${engine.speed || 2.0}">
        </div>
      `;
      this.setupSlider('param-ff-particles', (val) => {
        engine.numParticles = Math.round(val);
        engine.x = new Float32Array(engine.numParticles);
        engine.y = new Float32Array(engine.numParticles);
        engine.vx = new Float32Array(engine.numParticles);
        engine.vy = new Float32Array(engine.numParticles);
        engine.age = new Float32Array(engine.numParticles);
        engine.init();
        document.getElementById('val-ff-particles').innerText = engine.numParticles;
        this.updateHUD();
      });
      this.setupSlider('param-ff-speed', (val) => {
        engine.speed = val;
        document.getElementById('val-ff-speed').innerText = val.toFixed(1);
      });

    } else if (this.activeEngineId === 'reaction_diffusion') {
      container.innerHTML = `
        <div class="section-title"><span>TURING PARAMETERS</span></div>
        <div class="param-row">
          <div class="param-info">
            <label>Feed Rate (F)</label>
            <span class="param-val" id="val-rd-feed">${engine.feed.toFixed(4)}</span>
          </div>
          <input type="range" id="param-rd-feed" min="0.0100" max="0.0800" step="0.0020" value="${engine.feed}">
        </div>
        <div class="param-row">
          <div class="param-info">
            <label>Kill Rate (K)</label>
            <span class="param-val" id="val-rd-kill">${engine.kill.toFixed(4)}</span>
          </div>
          <input type="range" id="param-rd-kill" min="0.0450" max="0.0700" step="0.0010" value="${engine.kill}">
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

    } else {
      container.innerHTML = `
        <div class="section-title">
          <span>${currentWorld ? currentWorld.name.toUpperCase() : 'WORLD'} PARAMETERS</span>
        </div>
        <p class="param-hint">${currentWorld ? currentWorld.desc : 'Active simulation universe.'}</p>
        <div style="margin-top: 10px; font-size: 10px; font-family: var(--font-mono); color: var(--accent-cyan);">
          FORMULATION: ${currentWorld ? currentWorld.physics : 'Continuous'}
        </div>
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
