# VANTA — Conservative Evidence-Based Dead-Code Audit

This document records the systematic codebase audit conducted to identify, categorize, and safely remove demonstrably unused files while strictly preserving application functionality and test integrity.

---

## Audit Methodology & Principles

1. **Evidence-Based Criteria**: A file is classified as **Confirmed Unused** only if:
   - It is not imported, referenced, or loaded by any HTML, JS, CSS, Python, C#, or build script.
   - Removing it causes zero regressions across all automated unit and smoke tests.
   - Its logic is demonstrably a legacy or intermediate duplicate of functionality now provided by another file.
2. **Conservative Retention**: Files with utility for builds, diagnostics, benchmarks, specifications, or native Qt desktop execution are retained intentionally.

---

## 1. Confirmed Unused (Safely Removed)

| File Path | Original Size | Purpose & Justification | Status |
| :--- | :--- | :--- | :--- |
| `studio/js/app.js` | 20,689 bytes | Early split UI controller created during initial prototyping. Fully superseded by unified `studio/js/bundle.js`. Not referenced by `studio/index.html`. | **Deleted via Git** |
| `studio/js/engines.js` | 20,319 bytes | Early split engine file containing only the initial 4 engines. Fully superseded by `studio/js/bundle.js` which houses all 13 simulation engines. Not referenced by `studio/index.html`. | **Deleted via Git** |

**Impact Assessment**:
- Build & runtime verified: `studio/index.html` exclusively loads `<script src="js/bundle.js"></script>`.
- Full pytest test suite (26 tests) passes 100% after removal.

---

## 2. Possibly Unused (Under Observation / Retained for Now)

| Component / Path | Observations & Analysis | Recommendation |
| :--- | :--- | :--- |
| `build/` | Temporary intermediate artifacts created by PyInstaller during native packaging. | Retain in `.gitignore` or clean during dedicated release builds. |
| `dist/` | Standalone executable output from earlier packaging iterations. | Retain for local distribution. |

---

## 3. Retained Intentionally (Essential or Tooling Files)

| File / Module | Rationale for Retention |
| :--- | :--- |
| `scripts/Launcher.cs` & `VANTA.exe` | High-performance C# Windows launcher enabling instant double-click execution of the studio in app mode without a console window. |
| `scripts/benchmark.py` | Standalone diagnostic performance benchmark tool for simulation step timings. |
| `scripts/server.py` | Local Python HTTP fallback server for environments lacking direct file access. |
| `scripts/build_windows.ps1` | Production build automation script for compiling C# and Python targets. |
| `vanta.spec` | PyInstaller build specification for bundling native Python desktop application. |
| `src/vanta/...` | Native Python/Qt application engine and UI codebase, covered by 21 unit tests. |
| `tests/...` | Automated smoke and unit test suites ensuring zero regressions. |
| `docs/...` | Engineering specifications, architectural documentation, and validation logs. |
