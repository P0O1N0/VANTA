"""
Persian (Farsi) translation catalog for VANTA.
"""

TRANSLATIONS_FA: dict[str, str] = {
    # App info
    "app_title": "وانتا (VANTA)",
    "app_descriptor": "استودیوی هنر مولد و حیات مصنوعی",
    "app_tagline": "دنیای تعاملی دیجیتال بدون نیاز به اینترنت",
    "author_attribution": "توسعه‌یافته توسط P O N",
    "contact_telegram": "تلگرام: @P0O1N0",
    "github_profile": "گیت‌هاب: github.com/P0O1N0",

    # Top Bar & Navigation
    "menu_engines": "موتورهای شبیه‌سازی",
    "menu_presets": "کتابخانه الگوها (Presets)",
    "menu_projects": "پروژه‌ها",
    "btn_play": "اجرا",
    "btn_pause": "توقف",
    "btn_step": "یک گام",
    "btn_reset": "بازنشانی",
    "btn_seed_random": "سید تصادفی",
    "btn_export": "خروجی",
    "btn_settings": "تنظیمات",
    "btn_about": "درباره",
    "theme_dark": "تم تاریک",
    "theme_light": "تم روشن",
    "language_switch": "English",

    # Engines
    "engine_particle_life": "حیات ذرات (Particle Life)",
    "engine_particle_life_desc": "اکوسیستم پیوسته ذرات با ماتریس برهم‌کنش جاذبه و دافعه بین‌گونه‌ای",
    "engine_physarum": "فیزاروم / کپک مخاطی (Physarum)",
    "engine_physarum_desc": "شبکه زیستی خودسازمان‌دهنده بر پایه حسگری و ترشح شیمیایی عامل‌ها",
    "engine_flow_field": "میدان جریان (Flow Field)",
    "engine_flow_field_desc": "میدان برداری نویز کرل بدون دیورژانس با ردهای ارگانیک روان",
    "engine_reaction_diffusion": "واکنش-پخش (Reaction-Diffusion)",
    "engine_reaction_diffusion_desc": "مورفوژنز شیمیایی گری-اسکات شبیه‌ساز مرجان، میتوز سلولی و سالیتون",

    # Quality Profiles
    "quality_profile": "پروفایل عملکرد و کیفیت",
    "profile_lite": "سبک (سخت‌افزار ضعیف / ۸ گیگ رم)",
    "profile_balanced": "متعادل (پیش‌نهادی)",
    "profile_high": "کیفیت بالا",

    # Inspector & Parameters
    "inspector_title": "تنظیمات و پارامترها",
    "section_simulation": "پارامترهای محاسباتی شبیه‌سازی",
    "section_visuals": "جلوه‌های بصری و پالت رنگ",
    "section_matrix": "ماتریس برهم‌کنش گونه‌ها",
    "section_environment": "محیط و مرزها",

    # Common parameters
    "param_particle_count": "تعداد ذرات",
    "param_agent_count": "تعداد عامل‌ها",
    "param_species_count": "تعداد گونه‌ها",
    "param_speed": "سرعت شبیه‌سازی",
    "param_damping": "اصطکاک و میرایی",
    "param_radius": "شعاع اثر متقابل",
    "param_trail_fade": "ماندگاری ردها (Trails)",
    "param_color_palette": "پالت رنگی",
    "param_boundary_mode": "نوع مرزها",
    "boundary_torus": "حلقوی (Torus - عبور از لبه)",
    "boundary_bounce": "برخورد و بازتاب (دیواره)",

    # Physarum parameters
    "param_sensor_angle": "زاویه حسگرها",
    "param_sensor_dist": "فاصله دید حسگر",
    "param_turn_angle": "زاویه چرخش عامل",
    "param_step_size": "طول گام حرکتی",
    "param_deposit_amount": "شدت ترشح سیگنال",
    "param_decay_factor": "نرخ محوشدگی رد شیمیایی",

    # Flow field parameters
    "param_noise_scale": "مقیاس میدان نویز",
    "param_noise_octaves": "تعداد اکتاوهای نویز",
    "param_particle_speed": "سرعت حرکت ذرات",
    "param_vortex_strength": "قدرت گرداب تعاملی",

    # Reaction diffusion parameters
    "param_feed_rate": "نرخ تغذیه (F)",
    "param_kill_rate": "نرخ نابودی (k)",
    "param_diffusion_u": "ضریب پخش ماده U",
    "param_diffusion_v": "ضریب پخش ماده V",
    "param_substeps": "تعداد ریزگام در هر فریم",

    # Presets
    "preset_browser_title": "گالری الگوهای آماده",
    "search_presets_placeholder": "جستجوی الگو...",
    "btn_apply_preset": "اعمال الگو",
    "btn_save_custom_preset": "ذخیره الگوی شخصی",
    "btn_delete_preset": "حذف",
    "preset_category_all": "همه",
    "preset_category_cosmic": "کیهانی",
    "preset_category_biological": "زیستی",
    "preset_category_fluid": "دینامیک سیالات",
    "preset_category_abstract": "ریاضی و انتزاعی",

    # Status Bar & HUD
    "status_fps": "نرخ فریم",
    "status_frame_time": "زمان فریم",
    "status_agents": "تعداد موجودیت‌ها",
    "status_seed": "سید تصادفی",
    "status_renderer": "موتور رندر",
    "status_ready": "آماده",
    "status_simulating": "در حال شبیه‌سازی",
    "status_paused": "متوقف شده",

    # Dialogs & Export
    "export_dialog_title": "خروجی اثر هنری",
    "export_type_png": "تصویر PNG (نمای جاری)",
    "export_type_highres": "رندر با رزولوشن بالا (4K)",
    "export_type_sequence": "توالی فریم‌ها (Image Sequence)",
    "export_resolution": "وضوح تصویر",
    "export_duration_sec": "مدت زمان (ثانیه)",
    "export_framerate": "نرخ فریم (FPS)",
    "btn_start_export": "شروع خروجی‌گیری",
    "export_success_toast": "فایل خروجی با موفقیت ذخیره شد در:",
    "export_error_toast": "خطا در خروجی‌گیری:",

    # Project management
    "project_new": "پروژه جدید",
    "project_open": "باز کردن پروژه (.vanta)",
    "project_save": "ذخیره پروژه",
    "project_save_as": "ذخیره به عنوان...",
    "project_unsaved_warning": "تغییرات ذخیره‌نشده دارید. آیا مایل به ذخیره قبل از ادامه هستید؟",

    # About Dialog
    "about_title": "درباره وانتا (VANTA)",
    "about_heading": "استودیوی حیات مولد VANTA",
    "about_description": (
        "استودیوی دسکتاپ آفلاین برای خلق هنر مولد، حیات مصنوعی و شبیه‌سازی‌های تعاملی پیچیده. "
        "طراحی و مهندسی‌شده با پایتون، PySide6 و محاسبات برداری NumPy."
    ),
    "about_license": "منتشرشده تحت مجوز متن‌باز MIT.",
}
