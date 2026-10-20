"""
English translation catalog for VANTA.
"""

TRANSLATIONS_EN: dict[str, str] = {
    # App info
    "app_title": "VANTA",
    "app_descriptor": "Generative Life Studio",
    "app_tagline": "Offline-First Interactive Digital Universe",
    "author_attribution": "Created by P O N",
    "contact_telegram": "Telegram: @P0O1N0",
    "github_profile": "GitHub: github.com/P0O1N0",

    # Top Bar & Navigation
    "menu_engines": "Simulation Engines",
    "menu_presets": "Preset Library",
    "menu_projects": "Projects",
    "btn_play": "Play",
    "btn_pause": "Pause",
    "btn_step": "Step",
    "btn_reset": "Reset",
    "btn_seed_random": "Random Seed",
    "btn_export": "Export",
    "btn_settings": "Settings",
    "btn_about": "About",
    "theme_dark": "Dark Theme",
    "theme_light": "Light Theme",
    "language_switch": "فارسی",

    # Engines
    "engine_particle_life": "Particle Life",
    "engine_particle_life_desc": "Continuous-space multi-species particle ecosystem with attractive & repulsive forces",
    "engine_physarum": "Physarum (Slime Mold)",
    "engine_physarum_desc": "Agent-based emergent biological transport network with chemical trail dynamics",
    "engine_flow_field": "Flow Field",
    "engine_flow_field_desc": "Procedural divergence-free curl-noise vector field with organic trails",
    "engine_reaction_diffusion": "Reaction-Diffusion",
    "engine_reaction_diffusion_desc": "Gray-Scott chemical morphogenesis simulating coral, mitosis, and solitons",

    # Quality Profiles
    "quality_profile": "Quality Profile",
    "profile_lite": "Lite (Low-Spec / 8GB)",
    "profile_balanced": "Balanced (Recommended)",
    "profile_high": "High Quality",

    # Inspector & Parameters
    "inspector_title": "Parameters Inspector",
    "section_simulation": "Simulation Parameters",
    "section_visuals": "Visuals & Palette",
    "section_matrix": "Species Interaction Matrix",
    "section_environment": "Environment & Boundaries",

    # Common parameters
    "param_particle_count": "Particle Count",
    "param_agent_count": "Agent Count",
    "param_species_count": "Species Count",
    "param_speed": "Simulation Speed",
    "param_damping": "Friction / Damping",
    "param_radius": "Interaction Radius",
    "param_trail_fade": "Trail Persistence",
    "param_color_palette": "Color Palette",
    "param_boundary_mode": "Boundary Mode",
    "boundary_torus": "Toroidal (Wrap)",
    "boundary_bounce": "Bounce (Walls)",

    # Physarum parameters
    "param_sensor_angle": "Sensor Angle",
    "param_sensor_dist": "Sensor Distance",
    "param_turn_angle": "Turn Angle",
    "param_step_size": "Step Size",
    "param_deposit_amount": "Deposit Amount",
    "param_decay_factor": "Trail Decay Rate",

    # Flow field parameters
    "param_noise_scale": "Field Scale",
    "param_noise_octaves": "Noise Octaves",
    "param_particle_speed": "Particle Speed",
    "param_vortex_strength": "Vortex Strength",

    # Reaction diffusion parameters
    "param_feed_rate": "Feed Rate (F)",
    "param_kill_rate": "Kill Rate (k)",
    "param_diffusion_u": "Diffusion U",
    "param_diffusion_v": "Diffusion V",
    "param_substeps": "Substeps per Frame",

    # Presets
    "preset_browser_title": "Curated Preset Gallery",
    "search_presets_placeholder": "Search presets...",
    "btn_apply_preset": "Apply Preset",
    "btn_save_custom_preset": "Save As Custom Preset",
    "btn_delete_preset": "Delete",
    "preset_category_all": "All",
    "preset_category_cosmic": "Cosmic",
    "preset_category_biological": "Biological",
    "preset_category_fluid": "Fluid Dynamics",
    "preset_category_abstract": "Abstract Math",

    # Status Bar & HUD
    "status_fps": "FPS",
    "status_frame_time": "Frame Time",
    "status_agents": "Entities",
    "status_seed": "Seed",
    "status_renderer": "Renderer",
    "status_ready": "Ready",
    "status_simulating": "Simulating",
    "status_paused": "Paused",

    # Dialogs & Export
    "export_dialog_title": "Export Visual Work",
    "export_type_png": "PNG Screenshot (Current View)",
    "export_type_highres": "High-Resolution Render (4K)",
    "export_type_sequence": "Image Sequence (PNG frames)",
    "export_resolution": "Resolution",
    "export_duration_sec": "Duration (seconds)",
    "export_framerate": "Frame Rate (FPS)",
    "btn_start_export": "Start Export",
    "export_success_toast": "Export saved successfully to",
    "export_error_toast": "Export failed:",

    # Project management
    "project_new": "New Project",
    "project_open": "Open Project (.vanta)",
    "project_save": "Save Project",
    "project_save_as": "Save Project As...",
    "project_unsaved_warning": "You have unsaved changes. Do you want to save before continuing?",

    # About Dialog
    "about_title": "About VANTA",
    "about_heading": "VANTA — Generative Life Studio",
    "about_description": (
        "An offline-first desktop studio for generative art, artificial life, and interactive simulations. "
        "Engineered with Python, PySide6, and NumPy."
    ),
    "about_license": "Licensed under the MIT License.",
}
