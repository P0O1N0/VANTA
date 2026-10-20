# VANTA — Scientific Foundations & Mathematical Models

This document outlines the theoretical physics, non-linear dynamics, partial differential equations, and discrete algorithmic foundations underlying the thirteen simulation engines in **VANTA — Generative Life Studio**.

---

## 1. Particle Life (Asymmetric Cellular Primordia)

### Theoretical Model
Particle Life models self-organizing macroscopic structures emerging from microscopic asymmetric pairwise interactions. Unlike classical Newtonian gravitation where forces obey Newton's third law ($\vec{F}_{ij} = -\vec{F}_{ji}$), Particle Life implements non-reciprocal force matrices $M_{\alpha \beta} \ne M_{\beta \alpha}$ across distinct particle species.

### Mathematical Formulation
For $N$ particles distributed in a two-dimensional toroidal manifold $\mathbb{T}^2 = [0, W) \times [0, H)$, particle $i$ with species $\alpha = s(i)$ experiences a net force from all neighbors $j$ within interaction horizon $r_{\max}$:

$$\vec{F}_i = \sum_{j \ne i, r_{ij} < r_{\max}} f(r_{ij}, M_{s(i), s(j)}) \, \hat{r}_{ij} - \gamma \vec{v}_i$$

where $\vec{r}_{ij} = \vec{x}_j - \vec{x}_i$ (under periodic minimal displacement), $r_{ij} = \|\vec{r}_{ij}\|$, and $\hat{r}_{ij} = \vec{r}_{ij} / r_{ij}$.

The piece-wise radial interaction kernel $f(r, A)$ is defined with a short-range repulsive Pauli-like core and an intermediate interaction zone:

$$f(r, A) = \begin{cases} 
\frac{r}{\beta} - 1 & \text{if } 0 \le r < \beta \\
A \cdot \left(1 - \frac{|2r - 1 - \beta|}{1 - \beta}\right) & \text{if } \beta \le r < 1 \\
0 & \text{if } r \ge 1
\end{cases}$$

Here, $\beta \in (0, 1)$ establishes the universal repulsive core radius, and $A = M_{\alpha \beta} \in [-1, 1]$ designates the attraction ($A > 0$) or repulsion ($A < 0$) coefficient.

### Numerical Integration
Equations of motion are integrated via symplectic Euler stepping with viscous Stokes drag $\gamma$:

$$\vec{v}_i(t + \Delta t) = (1 - \gamma \Delta t)\vec{v}_i(t) + \frac{\Delta t}{m_i} \vec{F}_i(t)$$
$$\vec{x}_i(t + \Delta t) = \left(\vec{x}_i(t) + \vec{v}_i(t + \Delta t)\Delta t\right) \bmod (W, H)$$

Spatial partitioning uses a uniform 2D grid bucket structure with cell dimension $r_{\max}$, reducing pairwise complexity from $\mathcal{O}(N^2)$ to $\mathcal{O}(N)$ for localized neighborhoods.

---

## 2. Physarum Polycephalum (Slime Mold Network Morphogenesis)

### Theoretical Model
Inspired by Jeff Jones's multi-agent model (2010) of the plasmodial slime mold *Physarum polycephalum*, this engine simulates emergent biological transport networks through coupled agent chemo-taxis and nutrient field diffusion.

### Mathematical Formulation
The environment consists of a continuous scalar chemoattractant field $C(\vec{x}, t)$ overlaid with $N_a$ discrete mobile agents.

Each agent possesses position $\vec{x}_k \in \mathbb{R}^2$ and orientation heading $\theta_k \in [0, 2\pi)$. At each timestep, agents sample $C$ at three forward sensory probes:
- **Forward Sensor**: $\vec{s}_F = \vec{x}_k + d_{so} (\cos \theta_k, \sin \theta_k)$
- **Left Sensor**: $\vec{s}_L = \vec{x}_k + d_{so} (\cos(\theta_k - \phi_{so}), \sin(\theta_k - \phi_{so}))$
- **Right Sensor**: $\vec{s}_R = \vec{x}_k + d_{so} (\cos(\theta_k + \phi_{so}), \sin(\theta_k + \phi_{so}))$

where $d_{so}$ is the sensor offset distance and $\phi_{so}$ is the sensory angular spread.

#### Steering Rule
Let $C_F = C(\vec{s}_F)$, $C_L = C(\vec{s}_L)$, and $C_R = C(\vec{s}_R)$. The angular update $\Delta \theta_k$ follows:

$$\Delta \theta_k = \begin{cases}
0 & \text{if } C_F > C_L \text{ and } C_F > C_R \\
\pm \text{uniform}(0, \text{RA}) & \text{if } C_F < C_L \text{ and } C_F < C_R \\
-\text{RA} & \text{if } C_L > C_R \\
+\text{RA} & \text{if } C_R > C_L
\end{cases}$$

where $\text{RA}$ is the rotation angle. Agents deposit chemical attractant at their coordinates:

$$C(\vec{x}_k, t) \leftarrow C(\vec{x}_k, t) + \delta_{\text{dep}}$$

#### Field Dynamics
The macroscopic chemical field obeys the discrete diffusion-decay partial differential equation:

$$\frac{\partial C}{\partial t} = D_C \nabla^2 C - \lambda_{\text{evap}} C$$

discretized on a 2D regular lattice via a 9-point Laplacian stencil:

$$\nabla^2 C_{x,y} \approx \frac{1}{6}\left(4(C_{x+1,y} + C_{x-1,y} + C_{x,y+1} + C_{x,y-1}) + (C_{x+1,y+1} + C_{x-1,y+1} + C_{x+1,y-1} + C_{x-1,y-1}) - 20 C_{x,y}\right)$$

---

## 3. Cosmic Gravity (N-Body Relativistic & Stellar Dynamics)

### Theoretical Model
Simulates gravitational interactions across stellar clusters, galactic discs, and black hole event horizons, incorporating Plummer potential softening and velocity Verlet numerical integration.

### Mathematical Formulation
Newton's law of universal gravitation for $N$ stellar bodies:

$$\vec{F}_i = G \sum_{j \ne i}^N \frac{m_i m_j}{(\|\vec{r}_{ij}\|^2 + \epsilon^2)^{3/2}} \vec{r}_{ij}$$

where $\epsilon > 0$ denotes the Plummer softening parameter, preventing numerical singularities and artificial scattering during close stellar encounters.

#### Barnes-Hut Tree Decomposition
To support thousands of bodies at interactive framerates, spatial decomposition is conducted using a quadtree. Nodes are evaluated according to the multipole acceptance criterion (MAC):

$$\frac{s}{d} < \theta_{\text{BH}}$$

where $s$ is the cell bounding box width, $d$ is the distance from the body to the cell center of mass, and $\theta_{\text{BH}} \approx 0.5$ is the accuracy threshold. Multipole approximations reduce computation from $\mathcal{O}(N^2)$ to $\mathcal{O}(N \log N)$.

#### Velocity Verlet Integration
$$\vec{x}(t + \Delta t) = \vec{x}(t) + \vec{v}(t)\Delta t + \frac{1}{2} \vec{a}(t)\Delta t^2$$
$$\vec{a}(t + \Delta t) = \frac{1}{m} \vec{F}(\vec{x}(t + \Delta t))$$
$$\vec{v}(t + \Delta t) = \vec{v}(t) + \frac{1}{2}\left(\vec{a}(t) + \vec{a}(t + \Delta t)\right)\Delta t$$

---

## 4. Quantum Wave Packet (Schrödinger Wavepacket Dynamics)

### Theoretical Model
Direct visual integration of the time-dependent Schrödinger equation (TDSE) describing non-relativistic quantum mechanical wavefunctions interacting with scalar potential barriers:

$$i \hbar \frac{\partial \psi(\vec{x}, t)}{\partial t} = \hat{H}\psi(\vec{x}, t) = \left( -\frac{\hbar^2}{2m} \nabla^2 + V(\vec{x}) \right) \psi(\vec{x}, t)$$

### Mathematical Formulation
The complex wavefunction $\psi(\vec{x}, t) = u(\vec{x}, t) + i v(\vec{x}, t)$ is decomposed into real and imaginary components. The Born probability density is given by:

$$\rho(\vec{x}, t) = |\psi(\vec{x}, t)|^2 = u^2 + v^2$$

The quantum probability current density $\vec{j}(\vec{x}, t)$ satisfies the continuity equation $\frac{\partial \rho}{\partial t} + \nabla \cdot \vec{j} = 0$:

$$\vec{j}(\vec{x}, t) = \frac{\hbar}{m} \operatorname{Im}\left(\psi^* \nabla \psi\right) = \frac{\hbar}{m} (u \nabla v - v \nabla u)$$

### Numerical Scheme
VANTA implements an alternating-direction staggered time-domain leapfrog scheme preserving unitarity:

$$u(t + \Delta t) = u(t) + \Delta t \left[ -\frac{\hbar}{2m} \nabla^2 v(t + \Delta t/2) + \frac{1}{\hbar} V(\vec{x}) v(t + \Delta t/2) \right]$$
$$v(t + 3\Delta t/2) = v(t + \Delta t/2) - \Delta t \left[ -\frac{\hbar}{2m} \nabla^2 u(t + \Delta t) + \frac{1}{\hbar} V(\vec{x}) u(t + \Delta t) \right]$$

Boundary conditions implement absorbing boundary layers (PML-inspired damping) to suppress artificial edge reflections:

$$\psi_{\text{damped}}(\vec{x}) = \psi(\vec{x}) \cdot \exp\left(-\sigma(\vec{x}) \Delta t\right)$$

---

## 5. Gray-Scott Reaction-Diffusion (Turing Morphogenesis)

### Theoretical Model
Alan Turing's 1952 paradigm of chemical morphogenesis, instantiated via the non-linear two-species cubic autocatalytic Gray-Scott reaction equations:

$$\begin{aligned}
U + 2V &\xrightarrow{k} 3V \\
V &\xrightarrow{k} P
\end{aligned}$$

### Coupled System of PDEs
$$\frac{\partial u}{\partial t} = D_u \nabla^2 u - u v^2 + F(1 - u)$$
$$\frac{\partial v}{\partial t} = D_v \nabla^2 v + u v^2 - (F + k)v$$

where:
- $u(\vec{x}, t), v(\vec{x}, t)$ are local concentrations of substrate and autocatalyst ($u, v \in [0, 1]$).
- $D_u, D_v$ are isotropic spatial diffusion coefficients ($D_u \gg D_v$).
- $F$ is the external feed rate supplying substrate $U$.
- $k$ is the kill rate converting catalyst $V$ into inert product $P$.

### Morphological Regimes
By tuning $(F, k)$, the engine traverses distinct dynamical phases:
- **Soliton Spots / Mitosis**: $F \approx 0.030, k \approx 0.062$
- **Labyrinthine Stripes**: $F \approx 0.038, k \approx 0.061$
- **Chaos & Spatiotemporal Turbulence**: $F \approx 0.026, k \approx 0.055$
- **Hole / Bubble Tessellations**: $F \approx 0.039, k \approx 0.058$

---

## 6. Continuous Lenia (Continuous Cellular Automata)

### Theoretical Model
Proposed by Bert Wang-Chak Chan (2019), Lenia extends Conway's Game of Life into continuous space, continuous time, and continuous state values $\mathbf{A} \in [0, 1]$.

### Mathematical Formulation
Given state configuration $\mathbf{A}: \mathbb{R}^2 \to [0, 1]$, local field potential $U(\vec{x})$ is computed via spatial convolution with a kernel $K$:

$$U(\vec{x}) = (K * \mathbf{A})(\vec{x}) = \int_{\mathbb{R}^2} K(\vec{y}) \mathbf{A}(\vec{x} - \vec{y}) \, d\vec{y}$$

The kernel $K(r)$ is typically an annular concentric ring with radial parameter $r = \|\vec{x}\| / R$:

$$K(r) = K_{\text{core}}\left(\frac{r - \mu_k}{\sigma_k}\right)$$

The continuous growth mapping $G: [0, 1] \to [-1, 1]$ acts as a non-linear bell-shaped potential:

$$G(u) = 2 \exp\left(-\frac{(u - \mu)^2}{2\sigma^2}\right) - 1$$

State integration advances smoothly in time:

$$\mathbf{A}^{t + \Delta t} = \left[ \mathbf{A}^t + \Delta t \cdot G(K * \mathbf{A}^t) \right]_0^1$$

where $[x]_0^1 = \max(0, \min(1, x))$ clips values to the unit interval.

---

## 7. Ferrofluid Rosensweig Spikes (Magnetic Fluid Dynamics)

### Theoretical Model
Simulates the normal-field instability in colloidal suspensions of single-domain ferromagnetic nanoparticles subjected to a perpendicular external magnetic field $\vec{H}$.

### Governing Interfacial Equations
The critical balance at the free ferrofluid interface $\eta(x, y)$ is governed by the ferrohydrodynamic Bernoulli equation:

$$\Delta p_{\text{mag}} - \rho g \eta + \sigma \nabla^2 \eta = 0$$

where:
- $\Delta p_{\text{mag}} = \frac{1}{2} \mu_0 \frac{\chi^2}{1 + \chi} H_n^2$ is the magnetic normal traction tensor.
- $\sigma \nabla^2 \eta$ is the Young-Laplace capillary restorative pressure.
- $\rho g \eta$ is the gravitational hydrostatic head.

The system develops spontaneous hexagonal spike lattices when the external field exceeds the critical Rosensweig threshold:

$$H_c = \sqrt{\frac{2}{\mu_0 \chi} \sqrt{\rho g \sigma}}$$

---

## 8. Dendritic Crystal Growth (Phase-Field Solidification)

### Theoretical Model
Based on the Kobayashi phase-field formulation for non-isothermal dendritic crystal growth in undercooled liquid melts.

### Mathematical Formulation
The order parameter $\phi \in [-1, 1]$ distinguishes solid ($\phi = 1$) from liquid ($\phi = -1$), coupled to dimensionless thermal field $\theta$:

$$\tau \frac{\partial \phi}{\partial t} = \nabla \cdot \left(\epsilon^2(\theta_n) \nabla \phi\right) + \phi(1 - \phi^2) + m(\theta, \phi)$$
$$\frac{\partial \theta}{\partial t} = D_{\theta} \nabla^2 \theta + \frac{L}{c_p} \frac{\partial \phi}{\partial t}$$

Four-fold anisotropic surface energy is parameterized by orientation angle $\theta_n = \arctan(\partial_y \phi / \partial_x \phi)$:

$$\epsilon(\theta_n) = \epsilon_0 \left[1 + \delta_m \cos(m \theta_n)\right]$$

---

## 9. Curl Noise Flow Field (Incompressible Streamlines)

### Theoretical Model
Generates physically plausible divergence-free fluid velocity fields without solving full Poisson pressure projection equations, as formalized by Bridson et al. (2007).

### Mathematical Formulation
Given a continuous 3D vector potential $\vec{\Psi}(x, y, z)$ derived from simplex noise lattices, the velocity field $\vec{v}$ is constructed via the curl operator:

$$\vec{v} = \nabla \times \vec{\Psi}$$

By vector calculus identity, the divergence of the curl of any twice-differentiable field is identically zero:

$$\nabla \cdot \vec{v} = \nabla \cdot (\nabla \times \vec{\Psi}) \equiv 0$$

This guarantees strict mass conservation (incompressibility) for tracer advection:

$$\frac{d\vec{x}_p}{dt} = \vec{v}(\vec{x}_p, t)$$

---

## 10. Boids Flocking (Emergent Autonomous Swarms)

### Theoretical Model
Craig Reynolds's 1987 artificial life model of collective animal motion, governed by three localized behavioral steering rules.

### Steering Vectors
For each boid $i$ with neighborhood $\mathcal{N}_i = \{j : \|\vec{x}_j - \vec{x}_i\| < r_v\}$:
1. **Separation**: Avoid crowding local flockmates:
   $$\vec{F}_{\text{sep}} = -\sum_{j \in \mathcal{N}_i} \frac{\vec{x}_j - \vec{x}_i}{\|\vec{x}_j - \vec{x}_i\|^2}$$
2. **Alignment**: Steer towards the average heading of flockmates:
   $$\vec{F}_{\text{align}} = \left(\frac{1}{|\mathcal{N}_i|} \sum_{j \in \mathcal{N}_i} \vec{v}_j\right) - \vec{v}_i$$
3. **Cohesion**: Steer towards the center of mass of local flockmates:
   $$\vec{F}_{\text{coh}} = \left(\frac{1}{|\mathcal{N}_i|} \sum_{j \in \mathcal{N}_i} \vec{x}_j\right) - \vec{x}_i$$

Net acceleration combines the forces with weights $w_s, w_a, w_c$, subject to maximum speed clamp $v_{\max}$.

---

## 11. Fractal Growth (Diffusion-Limited Aggregation)

### Theoretical Model
The Witten-Sander model (1981) of cluster formation by particles undergoing Brownian motion in a diffusion field.

### Mathematical Formulation
Tracer particles execute independent stochastic 2D random walks:

$$\vec{x}(t + \Delta t) = \vec{x}(t) + \sqrt{2 D \Delta t} \, \vec{\xi}(t), \quad \langle \xi_i(t) \xi_j(t') \rangle = \delta_{ij}\delta(t - t')$$

Upon contacting any aggregate boundary node, sticking occurs with sticking probability $p_s \in (0, 1]$. The resulting fractal cluster exhibits scale invariance with Hausdorff fractal dimension:

$$D_H \approx 1.71 \pm 0.02 \quad (\text{in } d = 2)$$

---

## 12. Excitable Medium (FitzHugh-Nagumo Spiral Waves)

### Theoretical Model
Models non-linear spatiotemporal excitability, replicating rotating spiral waves and action potential propagation in cardiac electrophysiology and the Belousov-Zhabotinsky chemical reaction.

### System of Coupled Equations
$$\frac{\partial u}{\partial t} = D_u \nabla^2 u + \frac{1}{\epsilon} u(1 - u)\left(u - \frac{v + b}{a}\right)$$
$$\frac{\partial v}{\partial t} = u - v$$

where:
- $u$ represents membrane excitation (fast activator variable).
- $v$ represents repolarization / recovery (slow inhibitor variable).
- $\epsilon \ll 1$ dictates timescale separation between wavefront excitation and refractory recovery.

---

## 13. Thermal Convection (Rayleigh-Bénard Roll Cells & Mantle Plumes)

### Theoretical Model
Simulates buoyancy-driven fluid convection under the Oberbeck-Boussinesq approximation, where density variations are neglected except in the gravitational body force term.

### Governing Equations
$$\frac{\partial \vec{u}}{\partial t} + (\vec{u} \cdot \nabla)\vec{u} = -\frac{1}{\rho_0} \nabla p + \nu \nabla^2 \vec{u} + g \alpha (T - T_0) \hat{z}$$
$$\frac{\partial T}{\partial t} + (\vec{u} \cdot \nabla)T = \kappa \nabla^2 T$$
$$\nabla \cdot \vec{u} = 0$$

where:
- $\nu$ is fluid kinematic viscosity.
- $\kappa$ is thermal diffusivity.
- $\alpha$ is volumetric thermal expansion coefficient.
- $g$ is gravitational acceleration.

The non-dimensional dynamical regime is governed by the **Rayleigh number** $Ra$ and **Prandtl number** $Pr$:

$$Ra = \frac{g \alpha \Delta T H^3}{\nu \kappa}, \quad Pr = \frac{\nu}{\kappa}$$

When $Ra > Ra_c \approx 1708$, pure conductive equilibrium breaks down, yielding stable counter-rotating convective roll cells and buoyant upward mantle plumes.

---

## Summary Matrix

| Simulation Engine | Formulation Type | Primary Mathematical Rule | Numerical Discretization |
| :--- | :--- | :--- | :--- |
| **Particle Life** | Discrete Particle | Non-reciprocal matrix $F(r, M)$ | Symplectic Euler ($\mathcal{O}(N)$ spatial grid) |
| **Physarum Polycephalum** | Agent-Field Hybrid | Sensory chemo-taxis + discrete diffusion | 9-point Laplacian + agent stochastic walk |
| **Cosmic Gravity** | $N$-Body Particle | Newton-Plummer potential $\frac{Gm}{(r^2+\epsilon^2)^{3/2}}$ | Velocity Verlet + Barnes-Hut quadtree |
| **Boids Swarm** | Discrete Autonomous | Separation, Alignment, Cohesion | Euler integration with field-of-view cones |
| **Quantum Wave** | Complex Field PDE | TDSE $i\hbar \partial_t \psi = \hat{H}\psi$ | Staggered leapfrog finite difference |
| **Crystal Growth** | Phase-Field PDE | Kobayashi order parameter $\phi$ & temperature | 5-point explicit Laplacian finite difference |
| **Flow Field** | Continuum Vector Field | Incompressible curl $\vec{v} = \nabla \times \vec{\Psi}$ | Simplex noise gradient advection |
| **Reaction-Diffusion** | Non-Linear PDE | Gray-Scott cubic autocatalysis | Explicit Forward-Euler 9-point stencil |
| **Continuous Lenia** | Continuous CA | Field convolution $K * A$ & growth $G$ | Toroidal discrete kernel convolution |
| **Ferrofluid** | Ferrohydrodynamics | Rosensweig normal magnetic stress | Height-field relaxed finite difference |
| **Fractal Growth** | Stochastic Aggregation | Diffusion-limited Brownian random walk | Discrete lattice boundary absorption |
| **Excitable Medium** | Reaction-Diffusion PDE | FitzHugh-Nagumo activator-inhibitor | 5-point Laplacian finite difference |
| **Thermal Convection** | Incompressible Navier-Stokes | Oberbeck-Boussinesq thermal buoyancy | Pressure-Poisson velocity projection |
