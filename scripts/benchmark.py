"""
Repeatable benchmark suite for VANTA simulation engines.
Measures update rate (UPS), step latency (ms), and computational throughput.
"""

from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path
import numpy as np

# Ensure vanta is in path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir / "src"))

from vanta.core.engine_registry import EngineRegistry
from vanta.utilities.platform_detector import detect_system_hardware


def run_engine_benchmark(engine_id: str, duration_sec: float = 2.0, count_override: int | None = None) -> dict[str, float]:
    """Execute timed simulation steps for an engine and report throughput."""
    engine = EngineRegistry.create_engine(engine_id)
    engine.initialize(800, 600, seed=42)

    if count_override:
        params = engine.get_parameters()
        if "num_particles" in params:
            params["num_particles"] = count_override
        elif "num_agents" in params:
            params["num_agents"] = count_override
        engine.set_parameters(params)

    # Warmup
    for _ in range(10):
        engine.step(0.016)

    # Measurement
    steps = 0
    start_time = time.perf_counter()
    end_time = start_time + duration_sec

    while time.perf_counter() < end_time:
        engine.step(0.016)
        steps += 1

    actual_duration = time.perf_counter() - start_time
    ups = steps / actual_duration
    avg_latency_ms = (actual_duration / steps) * 1000.0

    render_data = engine.get_render_data()

    return {
        "engine_id": engine_id,
        "name": engine.name,
        "active_entities": render_data.active_count,
        "total_steps": steps,
        "duration_sec": actual_duration,
        "ups": ups,
        "latency_ms": avg_latency_ms,
    }


def main():
    parser = argparse.ArgumentParser(description="VANTA Simulation Engines Benchmark Suite")
    parser.add_argument("--duration", type=float, default=2.0, help="Duration in seconds per engine test")
    parser.add_argument("--count", type=int, default=None, help="Override entity count for particle/agent engines")
    args = parser.parse_args()

    hw = detect_system_hardware()

    print("=" * 72)
    print("  VANTA Generative Life Studio — Simulation Benchmark Suite")
    print("=" * 72)
    print(f"  OS: {hw.os_name} {hw.os_release} ({hw.architecture})")
    print(f"  Python: {hw.python_version} | CPU Cores: {hw.cpu_count} | RAM: {hw.total_ram_gb:.1f} GB")
    print("-" * 72)
    print(f"  {'Engine':<24} | {'Entities':<10} | {'Steps':<8} | {'UPS':<10} | {'Latency (ms)':<12}")
    print("-" * 72)

    for eid in EngineRegistry.list_engine_ids():
        res = run_engine_benchmark(eid, duration_sec=args.duration, count_override=args.count)
        print(
            f"  {res['name']:<24} | "
            f"{res['active_entities']:<10,d} | "
            f"{res['total_steps']:<8,d} | "
            f"{res['ups']:<10.1f} | "
            f"{res['latency_ms']:<12.3f}"
        )

    print("=" * 72)
    print("  Benchmark finished successfully.")
    print("=" * 72)


if __name__ == "__main__":
    main()
