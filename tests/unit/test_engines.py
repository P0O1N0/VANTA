"""
Unit tests for simulation engines: determinism, reproducibility, parameter validation, and stability.
"""

import numpy as np
import pytest
from vanta.core.engine_registry import EngineRegistry


@pytest.mark.parametrize("engine_id", EngineRegistry.list_engine_ids())
def test_engine_reproducibility(engine_id: str):
    """Verify that identical seeds produce identical states after identical steps."""
    e1 = EngineRegistry.create_engine(engine_id)
    e2 = EngineRegistry.create_engine(engine_id)

    seed = 12345
    e1.initialize(400, 300, seed=seed)
    e2.initialize(400, 300, seed=seed)

    # Step both engines exactly 5 times with dt=0.016
    for _ in range(5):
        e1.step(0.016)
        e2.step(0.016)

    d1 = e1.get_render_data()
    d2 = e2.get_render_data()

    assert d1.mode == d2.mode
    assert d1.active_count == d2.active_count

    if d1.mode == "particles":
        assert d1.positions is not None and d2.positions is not None
        np.testing.assert_allclose(d1.positions, d2.positions, rtol=1e-5, atol=1e-5)
    elif d1.mode == "field":
        assert d1.field_rgba is not None and d2.field_rgba is not None
        np.testing.assert_array_equal(d1.field_rgba, d2.field_rgba)


@pytest.mark.parametrize("engine_id", EngineRegistry.list_engine_ids())
def test_engine_reset_validity(engine_id: str):
    """Verify that reset returns engine to initial valid state without NaN or infinite values."""
    engine = EngineRegistry.create_engine(engine_id)
    engine.initialize(300, 200, seed=999)

    for _ in range(10):
        engine.step(0.016)

    engine.reset()
    data = engine.get_render_data()

    if data.positions is not None:
        assert not np.any(np.isnan(data.positions))
        assert not np.any(np.isinf(data.positions))
    if data.field_rgba is not None:
        assert not np.any(np.isnan(data.field_rgba))


@pytest.mark.parametrize("engine_id", EngineRegistry.list_engine_ids())
def test_engine_parameters_roundtrip(engine_id: str):
    """Verify that get_parameters and set_parameters roundtrip safely."""
    engine = EngineRegistry.create_engine(engine_id)
    engine.initialize(300, 200, seed=42)

    params = engine.get_parameters()
    assert isinstance(params, dict)
    assert len(params) > 0

    # Mutate and re-apply
    engine.set_parameters(params)
    params_after = engine.get_parameters()
    assert params == params_after


def test_particle_life_matrix_update():
    """Verify that changing interaction matrix takes immediate effect."""
    engine = EngineRegistry.create_engine("particle_life")
    engine.initialize(300, 200, seed=77)

    # Set strong attraction between species 0 and 1
    engine.set_matrix_value(0, 1, 0.95)
    assert np.isclose(engine.matrix[0, 1], 0.95)
    engine.step(0.016)
    assert not np.any(np.isnan(engine.positions))


def test_reaction_diffusion_stability():
    """Verify Gray-Scott numerical integration remains bounded in [0, 1]."""
    engine = EngineRegistry.create_engine("reaction_diffusion")
    engine.initialize(200, 150, seed=123)

    for _ in range(15):
        engine.step(0.016)

    assert np.all(engine.u >= 0.0) and np.all(engine.u <= 1.0)
    assert np.all(engine.v >= 0.0) and np.all(engine.v <= 1.0)
    assert not np.any(np.isnan(engine.u))
    assert not np.any(np.isnan(engine.v))
