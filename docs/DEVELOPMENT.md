# VANTA — Developer Guide & Contribution Handbook

**Project:** VANTA — Generative Life Studio  
**Creator:** P O N ([@P0O1N0](https://github.com/P0O1N0))  
**Telegram:** [@P0O1N0](https://t.me/P0O1N0)

---

## 1. Development Environment Setup

### Prerequisites
- Python 3.11+
- Node.js (Optional, only if using external linters)
- Modern web browser (Chrome, Edge, Firefox)

### Setup Steps
```bash
git clone https://github.com/P0O1N0/VANTA.git
cd VANTA

# Setup Python virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

---

## 2. Running Automated Tests & Verification

### Pytest Unit Test Suite
```bash
pytest
```
Runs all 29 automated tests verifying:
- Simulation mathematical logic
- QPainter / OpenGL offscreen rendering
- Splash screen event-loop coordination
- Project state serialization and preset integrity

### Studio Bundle Verification
```bash
python scripts/verify_bundle.py
```
Validates bracket, brace, and parenthesis balance in `studio/js/bundle.js` and verifies that all 13 world classes are registered and instantiated.

---

## 3. Creating a New Simulation Engine

To add a new simulation world to VANTA:

1. **Define the Engine Class** in `studio/js/bundle.js`:
   ```javascript
   class MyNewEngine {
     constructor(canvas) {
       this.canvas = canvas;
       this.ctx = canvas.getContext('2d');
       // Allocate typed arrays or state buffers
     }

     init(seed = 12345) {
       // Seed initial state
     }

     step(dt, mouse, environment) {
       // Numerical physics update
     }

     render() {
       // Rasterize to this.ctx
     }
   }
   ```

2. **Register Metadata in `WORLDS`**:
   ```javascript
   {
     id: "my_new_world",
     name: "My New Universe",
     category: "physics", // "biology" | "physics" | "chaos"
     tag: "Sub-Title Tag",
     badge: "Archetype Badge",
     desc: "Description of the physical or mathematical model.",
     physics: "Governing PDE or equation"
   }
   ```

3. **Instantiate Engine in `VantaStudioApp`**:
   Add to `this.engines` map in `VantaStudioApp` constructor.

4. **Add Parameter Sliders** in `renderInspector()`:
   Connect interactive controls to your engine's state variables.

5. **Verify Bundle**:
   Run `python scripts/verify_bundle.py` to ensure syntax integrity.

---

## 4. Code Style & Architecture Guidelines

- **No Framework Overhead:** The Web Studio engine relies strictly on clean, dependency-free ECMAScript 2022+ and Canvas 2D/WebGL.
- **Zero Transient Allocation in Render Loops:** Never create temporary `{ x, y }` objects or arrays inside per-frame `step()` or `render()` methods. Mutate pre-allocated typed arrays.
- **Maintain Determinism:** Numerical seeds should yield reproducible initial configurations whenever possible.
- **Maintain Safe Parameter Boundaries:** Always clamp inputs to mathematically stable regimes to prevent numerical overflow ($\text{NaN} / \infty$).
