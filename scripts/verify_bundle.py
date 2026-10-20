import re

with open('studio/js/bundle.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Check open/close braces balance
open_b = content.count('{')
close_b = content.count('}')
print(f'Braces: {open_b} vs {close_b}')
assert open_b == close_b, f'Brace mismatch: {open_b} open, {close_b} close'

# Check parentheses balance
open_p = content.count('(')
close_p = content.count(')')
print(f'Parentheses: {open_p} vs {close_p}')
assert open_p == close_p, f'Parentheses mismatch: {open_p} open, {close_p} close'

# Check brackets balance
open_k = content.count('[')
close_k = content.count(']')
print(f'Square brackets: {open_k} vs {close_k}')
assert open_k == close_k, f'Bracket mismatch: {open_k} open, {close_k} close'

required_worlds = [
    'particle_life', 'physarum', 'cosmic_gravity', 'boids_swarm',
    'quantum_wave', 'crystal_growth', 'flow_field', 'reaction_diffusion',
    'lenia', 'ferrofluid', 'fractal_growth', 'excitable_medium', 'thermal_convection'
]

required_classes = [
    'ParticleLifeEngine', 'PhysarumEngine', 'CosmicGravityEngine', 'BoidsSwarmEngine',
    'QuantumWaveEngine', 'CrystalGrowthEngine', 'FlowFieldEngine', 'ReactionDiffusionEngine',
    'LeniaEngine', 'FerrofluidEngine', 'FractalGrowthEngine', 'ExcitableMediumEngine', 'ThermalConvectionEngine'
]

for w in required_worlds:
    assert f'id: "{w}"' in content or f"id: '{w}'" in content, f'Missing world id: {w}'
    assert f'{w}: new' in content, f'Missing engine instantiation: {w}'

for c in required_classes:
    assert f'class {c}' in content, f'Missing class: {c}'

print('All 13 simulation worlds and classes verified successfully!')
