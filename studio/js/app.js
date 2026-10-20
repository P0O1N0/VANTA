/**
 * VANTA Studio — Main Application Controller
 * Bilingual Localization (FA/EN), Glassmorphic Controls, HUD Telemetry, and Exporters.
 */

import {
  ParticleLifeEngine,
  PhysarumEngine,
  FlowFieldEngine,
  ReactionDiffusionEngine,
  PALETTES,
  SPECIES_COLORS
} from './engines.js';

// Localization catalogs (ZERO emojis, pure professional UI)
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

// Curated Preset Definitions
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
    this.locale = 'fa'; // Persian default
    this.theme = 'dark';
    this.isPlaying = true;
    this.simSpeed = 1.0;

    // Mouse state
    this.mouse = { x: 0, y: 0, down: false, button: 1 };

    // Performance telemetry
    this.fps = 60;
    this.frameTime = 16.6;
    this.lastTime = performance.now();
    this.fpsTimer = performance.now();
    this.framesCount = 0;

    // Video Recording
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];

    // Initialize Canvas Dimensions
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Instantiate Engines
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

    // Start Simulation Loop
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

    // Telemetry updates
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
      // Don't capture when clicking on studio UI controls
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
    // Engine tabs
    document.querySelectorAll('.engine-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.engine-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeEngineId = tab.dataset.engine;
        this.activeEngine.init();
        this.renderInspector();
      });
    });

    // Play / Pause
    const btnPlay = document.getElementById('btn-play');
    btnPlay.addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      btnPlay.querySelector('.btn-label').innerText = this.isPlaying ? I18N[this.locale].btn_pause : I18N[this.locale].btn_play;
      btnPlay.classList.toggle('btn-primary', this.isPlaying);
    });

    // Step
    document.getElementById('btn-step').addEventListener('click', () => {
      this.activeEngine.step(0.016, this.mouse);
      this.activeEngine.render();
    });

    // Reset
    document.getElementById('btn-reset').addEventListener('click', () => {
      this.activeEngine.init();
    });

    // Seed Randomize
    document.getElementById('btn-seed').addEventListener('click', () => {
      this.activeEngine.init(Math.floor(Math.random() * 999999));
    });

    // Speed Slider
    document.getElementById('speedSlider').addEventListener('input', (e) => {
      this.simSpeed = parseFloat(e.target.value);
      document.getElementById('speedValue').innerText = `${this.simSpeed.toFixed(1)}x`;
    });

    // Theme Toggle
    document.getElementById('btn-theme').addEventListener('click', () => {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', this.theme);
    });

    // Language Toggle
    document.getElementById('btn-lang').addEventListener('click', () => {
      this.locale = this.locale === 'fa' ? 'en' : 'fa';
      this.applyLocale();
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

    // Export 4K PNG
    document.getElementById('btn-export').addEventListener('click', () => {
      this.exportImage();
    });

    // Record Video
    document.getElementById('btn-record').addEventListener('click', () => {
      this.toggleVideoRecording();
    });
  }

  applyLocale() {
    const dict = I18N[this.locale];
    document.body.setAttribute('dir', this.locale === 'fa' ? 'rtl' : 'ltr');

    // Update static texts
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.innerText = dict[key];
    });

    // Update play button text
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

      // Matrix Heatmap Editor
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

        // Color coding
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
          // Cycle through attractive -> repulsive -> neutral
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
      // Stop recording
      this.mediaRecorder.stop();
      this.isRecording = false;
      btn.querySelector('.btn-label').innerText = I18N[this.locale].btn_record;
      btn.classList.remove('btn-primary');
    } else {
      // Start recording
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

// Bootstrap on DOM Loaded
window.addEventListener('DOMContentLoaded', () => {
  new VantaStudioApp();
});
