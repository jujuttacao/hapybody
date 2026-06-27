/* =====================================================
   HapyBody+ — i18n.js v2.0 (Rebuild)
   Español, English, Deutsch, 中文
   ===================================================== */

const I18n = (() => {
  const KEYS = {
    LANG: 'hb_lang'
  };

  const translations = {
    es: {
      // Landing Page
      land_title: "Esculpe tu cuerpo. Domina tus hábitos.",
      land_subtitle: "HapyBody+ es tu asistente premium e inteligente de fitness, nutrición y suplementos diseñado para lograr resultados reales.",
      land_btn_app: "Acceder a la App ⚡",
      land_feat_title: "Diseñado para el bienestar integral",
      land_feat_sub: "Un ecosistema minimalista y potente que se adapta a tu ritmo de vida.",
      land_feat_train: "Entrenamiento Inteligente",
      land_feat_train_desc: "Planifica tus rutinas semanales por grupo muscular y completa tus series fácilmente.",
      land_feat_nutri: "Nutrición Balanceada",
      land_feat_nutri_desc: "Evalúa la composición de tu plato diario y mantén el equilibrio nutricional perfecto.",
      land_feat_supp: "Suplementos y Fórmulas",
      land_feat_supp_desc: "Lleva el control de tus tomas diarias y dosis de vitaminas o medicamentos sin olvidos.",
      land_feat_prog: "Evolución Física",
      land_feat_prog_desc: "Registra tus medidas antropométricas y visualiza tu peso con gráficos interactivos.",
      land_footer: "© 2026 HapyBody+. Desarrollado con pasión para tu salud.",

      // Onboarding Splash
      onboard_main_title: "Bienvenido a HapyBody+",
      onboard_main_desc: "Tu compañero premium de entrenamiento, nutrición y suplementos.",
      onboard_next_btn: "Siguiente",
      onboard_login_prompt: "¿Ya tienes una cuenta?",
      onboard_login_link: "Iniciar Sesión",

      // Onboarding Form
      onboard_welcome: "¡Bienvenido a tu asistente fitness!",
      onboard_subtitle: "Cuéntanos quién eres para personalizar tu experiencia de bienestar.",
      onboard_label_name: "¿CÓMO TE LLAMAS?",
      onboard_placeholder_name: "Ej: Carlos, Ana...",
      onboard_label_lang: "¿IDIOMA PREFERIDO?",
      onboard_label_theme: "¿APARIENCIA PREFERIDA?",
      onboard_theme_dark: "Modo Oscuro",
      onboard_theme_light: "Modo Claro",
      onboard_label_goal: "¿CUÁL ES TU OBJETIVO PRINCIPAL?",
      onboard_btn_start: "Comenzar",

      // Navigation
      nav_dashboard: "Panel",
      nav_training: "Entrenamientos",
      nav_supplements: "Suplementos",
      nav_nutrition: "Nutrición",
      nav_progress: "Progreso",
      nav_profile: "Perfil",
      nav_settings: "Configuración",
      nav_reset_day: "Reiniciar día",

      // General Toasts
      toast_save_success: "Datos guardados ✓",
      toast_conn_success: "Conexión exitosa ✓",
      toast_conn_error: "Error de conexión",
      toast_reset_day: "Día reiniciado ✓",

      // Dashboard View
      dash_hello: "Hola",
      dash_welcome: "¡Bienvenido de vuelta!",
      dash_streak_title: "Racha Activa",
      dash_streak_sub: "días seguidos",
      dash_water_title: "Hidratación",
      dash_water_sub: "Objetivo: 8 vasos",
      dash_water_btn: "+ Agregar vaso",
      dash_plate_title: "Plato de hoy",
      dash_plate_sub: "Nutrientes balanceados",
      dash_training_title: "Entrenamiento de hoy",
      dash_training_completed: "completados",
      dash_training_empty: "Día de descanso",
      dash_training_go: "Ir a entrenamientos",
      dash_supps_title: "Suplementos",
      dash_supps_empty: "Todo al día",
      dash_supps_go: "Ir a suplementos",

      // Settings View
      settings_title: "Configuración ⚙",
      settings_sub: "Personaliza la aplicación",
      settings_section_app: "Apariencia",
      settings_label_theme: "Modo claro",
      settings_desc_theme: "Alterna entre tema oscuro y claro",
      settings_section_lang: "Idioma / Language 🌐",
      settings_label_lang: "Seleccionar idioma",
      settings_desc_lang: "Elige tu idioma preferido",
      settings_section_db: "Base de Datos Supabase ☁",
      settings_desc_db: "Credenciales de Supabase para activar la sincronización.",
      settings_db_url: "URL de Supabase",
      settings_db_key: "Anon Key de Supabase",
      settings_btn_test: "Probar Conexión",
      settings_btn_save: "Guardar Conexión",
      settings_section_reset: "Día actual",
      settings_label_reset: "Reiniciar progreso del día",
      settings_desc_reset: "Agua, hábitos y estado de suplementos",
      settings_btn_reset: "Reiniciar",
      settings_section_data: "Datos",
      settings_label_export: "Exportar todos los datos",
      settings_desc_export: "Descarga un archivo JSON de respaldo de tus datos",
      settings_btn_export: "Exportar JSON",
      settings_label_clear: "Eliminar todos los datos",
      settings_desc_clear: "Borra toda la configuración e historial locales de forma permanente",
      settings_btn_clear: "Borrar todo",

      // Goals Translations
      goal_muscle: "Ganar músculo",
      goal_fat: "Perder grasa",
      goal_weight: "Mantener peso",
      goal_habits: "Mejorar hábitos",
      goal_energy: "Más energía",
      goal_condition: "Mejor condición",
      goal_healthy: "Mantenerme sano",
      goal_define: "Definir mi cuerpo"
    },
    en: {
      land_title: "Sculpt your body. Master your habits.",
      land_subtitle: "HapyBody+ is your premium, smart fitness, nutrition and supplements assistant designed to deliver real results.",
      land_btn_app: "Access App ⚡",
      land_feat_title: "Designed for holistic wellness",
      land_feat_sub: "A minimalist and powerful ecosystem that adapts to your rhythm of life.",
      land_feat_train: "Smart Workouts",
      land_feat_train_desc: "Plan your weekly routines by muscle group and log your sets with ease.",
      land_feat_nutri: "Balanced Nutrition",
      land_feat_nutri_desc: "Evaluate your daily plate composition and maintain perfect nutritional balance.",
      land_feat_supp: "Supplements & Formulas",
      land_feat_supp_desc: "Track your daily intakes and doses of vitamins or medications without missing any.",
      land_feat_prog: "Body Evolution",
      land_feat_prog_desc: "Log your body measurements and visualize your weight with interactive charts.",
      land_footer: "© 2026 HapyBody+. Crafted with passion for your health.",

      onboard_main_title: "Welcome to HapyBody+",
      onboard_main_desc: "Your premium fitness, meal tracker and supplements companion.",
      onboard_next_btn: "Next",
      onboard_login_prompt: "Already have an account?",
      onboard_login_link: "Log In",

      onboard_welcome: "Welcome to your fitness assistant!",
      onboard_subtitle: "Tell us about yourself to personalize your wellness experience.",
      onboard_label_name: "WHAT IS YOUR NAME?",
      onboard_placeholder_name: "E.g.: Carlos, Ana...",
      onboard_label_lang: "PREFERRED LANGUAGE?",
      onboard_label_theme: "PREFERRED APPEARANCE?",
      onboard_theme_dark: "Dark Mode",
      onboard_theme_light: "Light Mode",
      onboard_label_goal: "WHAT IS YOUR MAIN GOAL?",
      onboard_btn_start: "Get Started",

      nav_dashboard: "Dashboard",
      nav_training: "Workouts",
      nav_supplements: "Supplements",
      nav_nutrition: "Nutrition",
      nav_progress: "Progress",
      nav_profile: "Profile",
      nav_settings: "Settings",
      nav_reset_day: "Reset day",

      toast_save_success: "Data saved successfully ✓",
      toast_conn_success: "Connection successful ✓",
      toast_conn_error: "Connection failed",
      toast_reset_day: "Day reset successfully ✓",

      dash_hello: "Hello",
      dash_welcome: "Welcome back!",
      dash_streak_title: "Active Streak",
      dash_streak_sub: "days in a row",
      dash_water_title: "Hydration",
      dash_water_sub: "Goal: 8 glasses",
      dash_water_btn: "+ Add glass",
      dash_plate_title: "Today's Plate",
      dash_plate_sub: "Balanced nutrients",
      dash_training_title: "Today's Workout",
      dash_training_completed: "completed",
      dash_training_empty: "Rest day",
      dash_training_go: "Go to workouts",
      dash_supps_title: "Supplements",
      dash_supps_empty: "All clean",
      dash_supps_go: "Go to supplements",

      settings_title: "Settings ⚙",
      settings_sub: "Customize your application",
      settings_section_app: "Appearance",
      settings_label_theme: "Light mode",
      settings_desc_theme: "Toggle between dark and light themes",
      settings_section_lang: "Language / Idioma 🌐",
      settings_label_lang: "Select language",
      settings_desc_lang: "Choose your preferred language",
      settings_section_db: "Supabase Database ☁",
      settings_desc_db: "Enter Supabase credentials to enable cloud sync.",
      settings_db_url: "Supabase URL",
      settings_db_key: "Supabase Anon Key",
      settings_btn_test: "Test Connection",
      settings_btn_save: "Save Connection",
      settings_section_reset: "Current Day",
      settings_label_reset: "Reset today's progress",
      settings_desc_reset: "Water, habits and supplement states",
      settings_btn_reset: "Reset",
      settings_section_data: "Data",
      settings_label_export: "Export all data",
      settings_desc_export: "Download a backup JSON file of your data",
      settings_btn_export: "Export JSON",
      settings_label_clear: "Delete all data",
      settings_desc_clear: "Permanently delete all configuration and history",
      settings_btn_clear: "Clear All",

      goal_muscle: "Gain muscle",
      goal_fat: "Lose fat",
      goal_weight: "Maintain weight",
      goal_habits: "Improve habits",
      goal_energy: "More energy",
      goal_condition: "Better condition",
      goal_healthy: "Stay healthy",
      goal_define: "Define my body"
    },
    de: {
      land_title: "Forme deinen Körper. Meistere deine Gewohnheiten.",
      land_subtitle: "HapyBody+ ist Ihr erstklassiger, intelligenter Fitness-, Ernährungs- und Nahrungsergänzungsassistent, der für echte Ergebnisse entwickelt wurde.",
      land_btn_app: "Zur App ⚡",
      land_feat_title: "Entwickelt für ganzheitliches Wohlbefinden",
      land_feat_sub: "Ein minimalistisches und leistungsstarkes Ökosystem, das sich Ihrem Lebensrhythmus anpasst.",
      land_feat_train: "Intelligentes Training",
      land_feat_train_desc: "Planen Sie Ihre wöchentlichen Routinen nach Muskelgruppen und protokollieren Sie Ihre Sätze mühelos.",
      land_feat_nutri: "Ausgewogene Ernährung",
      land_feat_nutri_desc: "Bewerten Sie die Zusammensetzung Ihres täglichen Tellers und halten Sie das perfekte Gleichgewicht.",
      land_feat_supp: "Ergänzungsmittel & Formeln",
      land_feat_supp_desc: "Verfolgen Sie Ihre tägliche Einnahme und Dosierung von Vitaminen oder Medikamenten lückenlos.",
      land_feat_prog: "Körperentwicklung",
      land_feat_prog_desc: "Protokollieren Sie Ihre Körpermaße und visualisieren Sie Ihr Gewicht in Diagrammen.",
      land_footer: "© 2026 HapyBody+. Mit Leidenschaft für Ihre Gesundheit hergestellt.",

      onboard_main_title: "Willkommen bei HapyBody+",
      onboard_main_desc: "Dein Premium-Begleiter für Fitness, Ernährung und Ergänzungen.",
      onboard_next_btn: "Weiter",
      onboard_login_prompt: "Hast du bereits ein Konto?",
      onboard_login_link: "Einloggen",

      onboard_welcome: "Willkommen bei deinem Fitness-Assistenten!",
      onboard_subtitle: "Erzähle uns etwas über dich, um deine Wellness-Erfahrung anzupassen.",
      onboard_label_name: "WIE HEISST DU?",
      onboard_placeholder_name: "Z.B.: Carlos, Ana...",
      onboard_label_lang: "BEVORZUGTE SPRACHE?",
      onboard_label_theme: "BEVORZUGTES DESIGN?",
      onboard_theme_dark: "Dunkles Design",
      onboard_theme_light: "Helles Design",
      onboard_label_goal: "WAS IST DEIN HAUPTZIEL?",
      onboard_btn_start: "Starten",

      nav_dashboard: "Dashboard",
      nav_training: "Training",
      nav_supplements: "Ergänzungen",
      nav_nutrition: "Ernährung",
      nav_progress: "Fortschritt",
      nav_profile: "Profil",
      nav_settings: "Einstellungen",
      nav_reset_day: "Tag zurücksetzen",

      toast_save_success: "Daten erfolgreich gespeichert ✓",
      toast_conn_success: "Verbindung erfolgreich ✓",
      toast_conn_error: "Verbindung fehlgeschlagen",
      toast_reset_day: "Tag erfolgreich zurückgesetzt ✓",

      dash_hello: "Hallo",
      dash_welcome: "Willkommen zurück!",
      dash_streak_title: "Aktuelle Racha",
      dash_streak_sub: "Tage in Folge",
      dash_water_title: "Hydratation",
      dash_water_sub: "Ziel: 8 Gläser",
      dash_water_btn: "+ Glas hinzufügen",
      dash_plate_title: "Teller von heute",
      dash_plate_sub: "Ausgewogene Nährstoffe",
      dash_training_title: "Heutiges Training",
      dash_training_completed: "abgeschlossen",
      dash_training_empty: "Ruhetag",
      dash_training_go: "Zum Training gehen",
      dash_supps_title: "Ergänzungen",
      dash_supps_empty: "Alles erledigt",
      dash_supps_go: "Zu den Ergänzungen",

      settings_title: "Einstellungen ⚙",
      settings_sub: "Passe die Anwendung an",
      settings_section_app: "Aussehen",
      settings_label_theme: "Helles Design",
      settings_desc_theme: "Wechsle zwischen dunklem und hellem Design",
      settings_section_lang: "Sprache / Language 🌐",
      settings_label_lang: "Sprache auswählen",
      settings_desc_lang: "Wähle deine bevorzugte Sprache",
      settings_section_db: "Supabase Datenbank ☁",
      settings_desc_db: "Supabase-Zugangsdaten zur Aktivierung der Cloud-Sync.",
      settings_db_url: "Supabase URL",
      settings_db_key: "Supabase Anon Key",
      settings_btn_test: "Verbindung testen",
      settings_btn_save: "Verbindung speichern",
      settings_section_reset: "Aktueller Tag",
      settings_label_reset: "Heutigen Fortschritt zurücksetzen",
      settings_desc_reset: "Wasser, Gewohnheiten und Ergänzungszustände",
      settings_btn_reset: "Zurücksetzen",
      settings_section_data: "Daten",
      settings_label_export: "Alle Daten exportieren",
      settings_desc_export: "Lade eine Backup-JSON-Datei deiner Daten herunter",
      settings_btn_export: "JSON exportieren",
      settings_label_clear: "Alle Daten löschen",
      settings_desc_clear: "Lösche dauerhaft alle Einstellungen und den Verlauf",
      settings_btn_clear: "Alles löschen",

      goal_muscle: "Muskelaufbau",
      goal_fat: "Fettabbau",
      goal_weight: "Gewicht halten",
      goal_habits: "Gewohnheiten verbessern",
      goal_energy: "Mehr Energie",
      goal_condition: "Bessere Ausdauer",
      goal_healthy: "Gesund bleiben",
      goal_define: "Körper definieren"
    },
    zh: {
      land_title: "雕刻完美身材。掌控健康习惯。",
      land_subtitle: "HapyBody+ 是一款专为实现真实效果而设计的智能高端健身、膳食营养和补剂药品管理助手。",
      land_btn_app: "进入应用 ⚡",
      land_feat_title: "为全方位健康设计",
      land_feat_sub: "契合您生活节奏的极简且强大的健康生态系统。",
      land_feat_train: "智能健身训练",
      land_feat_train_desc: "按目标肌群科学规划每周训练方案，轻松完成并记录组数。",
      land_feat_nutri: "膳食均衡盘评估",
      land_feat_nutri_desc: "科学登记每日餐食结构，完美维持膳食营养盘比例均衡。",
      land_feat_supp: "补剂及处方药追踪",
      land_feat_supp_desc: "精确管理每日维生素、药品服用剂量 and 时间，远离漏服烦恼。",
      land_feat_prog: "身体进化指标",
      land_feat_prog_desc: "记录围度和体重，使用直观的图表追踪身体的进化趋势。",
      land_footer: "© 2026 HapyBody+. 用激情与爱为您的健康保驾护航。",

      onboard_main_title: "欢迎使用 HapyBody+",
      onboard_main_desc: "您的高端健身、营养餐食及补剂药品管理助手。",
      onboard_next_btn: "下一步",
      onboard_login_prompt: "已经有账户了？",
      onboard_login_link: "立即登录",

      onboard_welcome: "欢迎使用您的健身小助手！",
      onboard_subtitle: "告诉我们您是谁，开启个性化的健康之旅。",
      onboard_label_name: "您叫什么名字？",
      onboard_placeholder_name: "例如：Carlos、Ana...",
      onboard_label_lang: "首选语言是什么？",
      onboard_label_theme: "首选界面主题？",
      onboard_theme_dark: "深色模式",
      onboard_theme_light: "浅色模式",
      onboard_label_goal: "您的核心健身目标是什么？",
      onboard_btn_start: "立即开启",

      nav_dashboard: "首页面板",
      nav_training: "健身训练",
      nav_supplements: "补剂健康",
      nav_nutrition: "膳食营养",
      nav_progress: "身体进化",
      nav_profile: "个人中心",
      nav_settings: "设置中心",
      nav_reset_day: "重置今日",

      toast_save_success: "数据保存成功 ✓",
      toast_conn_success: "数据库连接成功 ✓",
      toast_conn_error: "数据库连接失败",
      toast_reset_day: "今日进度重置成功 ✓",

      dash_hello: "您好",
      dash_welcome: "欢迎回来！",
      dash_streak_title: "连续打卡",
      dash_streak_sub: "天",
      dash_water_title: "今日饮水",
      dash_water_sub: "目标：8 杯水",
      dash_water_btn: "+ 喝一杯水",
      dash_plate_title: "今日餐食盘",
      dash_plate_sub: "均衡膳食结构",
      dash_training_title: "今日运动",
      dash_training_completed: "已完成",
      dash_training_empty: "好好休息（休息日）",
      dash_training_go: "去查看训练",
      dash_supps_title: "今日补剂用药",
      dash_supps_empty: "都已吃完",
      dash_supps_go: "去管理项目",

      settings_title: "设置中心 ⚙",
      settings_sub: "个性化您的应用",
      settings_section_app: "外观设置",
      settings_label_theme: "明亮模式",
      settings_desc_theme: "在深色与浅色模式之间自由切换",
      settings_section_lang: "语言选择 / Language 🌐",
      settings_label_lang: "首选语言",
      settings_desc_lang: "设置应用显示的系统语言",
      settings_section_db: "Supabase 云端数据库 ☁",
      settings_desc_db: "输入您的 Supabase 项目凭据以激活账户同步功能。",
      settings_db_url: "Supabase URL",
      settings_db_key: "Supabase Anon Key",
      settings_btn_test: "测试连接",
      settings_btn_save: "保存连接",
      settings_section_reset: "清空今天",
      settings_label_reset: "一键重置今日状态",
      settings_desc_reset: "清空今日水杯、打卡习惯和补剂药物状态",
      settings_btn_reset: "确认重置",
      settings_section_data: "备份与数据",
      settings_label_export: "导出全部个人数据",
      settings_desc_export: "下载包含您历史记录的备份 JSON 文件",
      settings_btn_export: "导出 JSON",
      settings_label_clear: "删除全部个人数据",
      settings_desc_clear: "永久抹除本设备上的所有历史记录和设置",
      settings_btn_clear: "抹除数据",

      goal_muscle: "增肌塑形",
      goal_fat: "减脂瘦身",
      goal_weight: "维持体重",
      goal_habits: "养成好习惯",
      goal_energy: "精力充沛",
      goal_condition: "提高心肺耐力",
      goal_healthy: "保持身体健康",
      goal_define: "雕刻肌肉线条"
    }
  };

  let locale = 'es';

  function init() {
    const saved = localStorage.getItem(KEYS.LANG);
    if (saved && translations[saved]) {
      locale = saved;
    } else {
      const browserLang = navigator.language.split('-')[0];
      locale = translations[browserLang] ? browserLang : 'es';
      localStorage.setItem(KEYS.LANG, locale);
    }
    translateDOM();
  }

  function getLanguage() {
    return locale;
  }

  function setLanguage(lang) {
    if (translations[lang]) {
      locale = lang;
      localStorage.setItem(KEYS.LANG, lang);
      translateDOM();
      
      // Update sidebar/nav views dynamically if active
      if (window.updateSidebarUser) updateSidebarUser();
      
      try {
        if (window.DashboardView && window.Router && Router.getCurrent() === 'dashboard') DashboardView.render();
        if (window.TrainingView && window.Router && Router.getCurrent() === 'training') TrainingView.render();
        if (window.SuppsView && window.Router && Router.getCurrent() === 'supplements') SuppsView.render();
        if (window.NutritionView && window.Router && Router.getCurrent() === 'nutrition') NutritionView.render();
        if (window.ProgressView && window.Router && Router.getCurrent() === 'progress') ProgressView.render();
        if (window.ProfileView && window.Router && Router.getCurrent() === 'profile') ProfileView.render();
        if (window.SettingsView && window.Router && Router.getCurrent() === 'settings') SettingsView.render();
      } catch (e) {
        console.warn('Re-rendering active views on lang change failed:', e);
      }
    }
  }

  function translate(key) {
    if (translations[locale] && translations[locale][key] !== undefined) {
      return translations[locale][key];
    }
    if (translations['en'] && translations['en'][key] !== undefined) {
      return translations['en'][key];
    }
    return key;
  }

  function translateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = translate(key);
      if (translation !== key) {
        el.textContent = translation;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = translate(key);
      if (translation !== key) {
        el.setAttribute('placeholder', translation);
      }
    });
  }

  return {
    init,
    getLanguage,
    setLanguage,
    translate,
    t: translate,
    translateDOM
  };
})();

const t = I18n.t;
window.I18n = I18n;
window.t = t;
