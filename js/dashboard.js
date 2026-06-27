/* =====================================================
   HapyBody+ — dashboard.js v2.0
   Panel principal / Vista de inicio
   ===================================================== */

const DashboardView = (() => {
  // ---- Motivational quotes ----
  const QUOTES = [
    '\"La constancia supera al talento.\" 💪',
    '\"Cada rep te acerca a tu mejor versión.\" 🔥',
    '\"El cuerpo logra lo que la mente cree.\" 🧠',
    '\"Hoy es el día perfecto para entrenar.\" ⚡',
    '\"No pares cuando estés cansado. Para cuando hayas terminado.\" 🏆',
    '\"El progreso, no la perfección.\" 📈',
    '\"Tu único competidor eres tú de ayer.\" 🥇',
    '\"La disciplina es el puente entre metas y logros.\" 🌉',
    '\"Pequeñas acciones consistentes = grandes resultados.\" ✨',
    '\"Sé el héroe de tu propia historia.\" 🦸',
    '\"El dolor de hoy es la fuerza de mañana.\" 💎',
    '\"Suda ahora, brilla después.\" 🌟',
  ];

  // ---- Goal data ----
  const GOAL_DATA = {
    'ganar músculo':       { icon: '💪', msg: 'Proteína y peso progresivo hoy.' },
    'perder grasa':        { icon: '🔥', msg: 'Déficit calórico + cardio.' },
    'mantener peso':       { icon: '⚖️', msg: 'Equilibrio es clave.' },
    'mejorar hábitos':     { icon: '✅', msg: 'Un hábito a la vez.' },
    'tener más energía':   { icon: '⚡', msg: 'Hidratación + sueño.' },
    'mejorar condición':   { icon: '🏃', msg: 'Cardio progresivo.' },
    'mantenerme saludable':{ icon: '🌿', msg: 'Salud es riqueza.' },
    'definir mi cuerpo':   { icon: '⚡', msg: 'Déficit + proteína.' },
  };

  const GOAL_KEYS = {
    'ganar músculo':       'goal_muscle',
    'perder grasa':        'goal_fat',
    'mantener peso':       'goal_weight',
    'mejorar hábitos':     'goal_habits',
    'tener más energía':   'goal_energy',
    'mejorar condición':   'goal_condition',
    'mantenerme saludable':'goal_healthy',
    'definir mi cuerpo':   'goal_define'
  };

  let quoteIndex = Math.floor(Math.random() * QUOTES.length);

  // ---- Greeting by time ----
  function getGreeting(name) {
    const h = new Date().getHours();
    const timeGreeting = h < 12 ? '☀️' : (h < 18 ? '⚡' : '🌙');
    return `${t('dash_hello')}, ${name}! ${timeGreeting}`;
  }

  // ---- Daily progress calculation ----
  function calculateDayProgress() {
    const exercises   = Storage.Exercises.getTodayGroup();
    const supplements = Storage.Supplements.getAll();
    const medications = Storage.Medications.getAll();
    const habits      = Storage.Habits.get();
    const water       = Storage.Water.get();
    const meals       = Storage.Meals.getToday();

    let total = 0, done = 0;

    if (exercises.length > 0) {
      total += 20;
      done  += Math.round((exercises.filter(e => e.completed).length / exercises.length) * 20);
    }

    if (supplements.length > 0) {
      total += 20;
      done  += Math.round((supplements.filter(s => s.taken).length / supplements.length) * 20);
    }

    if (medications.length > 0) {
      total += 10;
      done  += Math.round((medications.filter(m => m.taken).length / medications.length) * 10);
    }

    total += 20;
    done  += Math.round(Math.min(water / 8, 1) * 20);

    total += 20;
    done  += Math.round((habits.filter(h => h.done).length / habits.length) * 20);

    total += 10;
    done  += meals.length >= 2 ? 10 : meals.length * 5;

    return total > 0 ? Math.min(Math.round((done / total) * 100), 100) : 0;
  }

  // ---- Render goal banner ----
  function renderGoalBanner(user) {
    const bannerEl = document.getElementById('goal-display-banner');
    if (!bannerEl) return;

    const goal = user.goal || 'ganar músculo';
    const data = GOAL_DATA[goal] || { icon: '🎯', msg: 'Sigue tus metas.' };
    const goalKey = GOAL_KEYS[goal] || 'goal_muscle';

    bannerEl.innerHTML = `
      <div class="goal-banner-icon">${data.icon}</div>
      <div class="goal-banner-info">
        <div class="goal-banner-label">${t('prof_goal_title')}</div>
        <div class="goal-banner-title">${t(goalKey)}</div>
        <div class="goal-banner-msg">${data.msg}</div>
      </div>
    `;
  }

  const habitNames = {
    es: {
      water: 'Tomé agua',
      training: 'Entrené hoy',
      sleep: 'Dormí bien',
      food: 'Comí saludable',
      supps: 'Tomé suplemento',
      stretch: 'Estiramientos'
    },
    en: {
      water: 'Drank water',
      training: 'Worked out today',
      sleep: 'Slept well',
      food: 'Ate healthy',
      supps: 'Took supplements',
      stretch: 'Stretched'
    },
    de: {
      water: 'Wasser getrunken',
      training: 'Trainiert heute',
      sleep: 'Gut geschlafen',
      food: 'Gesund gegessen',
      supps: 'Präparat genommen',
      stretch: 'Gedehnt'
    },
    zh: {
      water: '今日饮水',
      training: '今日训练',
      sleep: '睡眠充足',
      food: '健康饮食',
      supps: '服用补剂',
      stretch: '拉伸放松'
    }
  };

  // ---- Render today's training quick view ----
  function renderTodayTraining() {
    const container = document.getElementById('dash-today-training');
    if (!container) return;
    const exercises = Storage.Exercises.getTodayGroup();

    if (exercises.length === 0) {
      container.innerHTML = `<div class="empty-state-small">
        <span>${t('dash_training_empty')}</span>
      </div>`;
      return;
    }

    container.innerHTML = exercises.map(ex => `
      <div class="exercise-item ${ex.completed ? 'completed' : ''}" style="padding:12px 16px;">
        <div class="exercise-check ${ex.completed ? 'checked' : ''}"
             onclick="DashboardView.toggleExercise('${ex.id}')">
          ${ex.completed ? '✓' : ''}
        </div>
        <div class="exercise-body">
          <div class="exercise-name">${escapeHtml(ex.exercise)}</div>
          <div class="exercise-chips">
            <span class="exercise-chip">${ex.sets}×${ex.reps}</span>
            ${ex.weight ? `<span class="exercise-chip">${ex.weight}kg</span>` : ''}
            <span class="exercise-chip group-chip">${escapeHtml(ex.muscleGroup)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ---- Render pending supplements/meds ----
  function renderPendingList() {
    const container = document.getElementById('dash-pending-list');
    if (!container) return;
    const pendingSupps = Storage.Supplements.getAll().filter(s => !s.taken);
    const pendingMeds  = Storage.Medications.getAll().filter(m => !m.taken);
    const all = [
      ...pendingSupps.map(s => ({ ...s, type: 'supp' })),
      ...pendingMeds.map(m  => ({ ...m, type: 'med'  })),
    ];

    if (all.length === 0) {
      container.innerHTML = `<div class="empty-state-small"><span>${t('dash_supps_empty')}</span></div>`;
      return;
    }

    container.innerHTML = all.slice(0, 4).map(item => `
      <div class="item-card" style="padding:10px 14px;">
        <span style="font-size:1.2rem">${item.type === 'supp' ? '💊' : '🩺'}</span>
        <div class="item-card-content">
          <div class="item-card-name">${escapeHtml(item.name)}</div>
          <div class="item-card-meta">
            ${item.hour ? `<span class="meta-chip">⏰ ${formatTime(item.hour)}</span>` : ''}
            ${item.dose ? `<span class="meta-chip">${escapeHtml(item.dose)}</span>` : ''}
          </div>
        </div>
        <span class="badge badge-pending">${t('supps_status_pending')}</span>
      </div>
    `).join('');
  }

  // ---- Render today's goals checklist ----
  function renderTodaysGoals() {
    const container = document.getElementById('todays-goals-list');
    if (!container) return;

    const habits = Storage.Habits.get();
    const currentLang = I18n.getLanguage();
    const trans = habitNames[currentLang] || habitNames['es'];

    container.innerHTML = habits.map(h => {
      const translatedName = trans[h.id] || h.name;
      return `
        <div class="goal-check-item ${h.done ? 'done' : ''}"
             onclick="DashboardView.toggleHabitFromDash('${h.id}')">
          <div class="goal-check-circle">${h.done ? '✓' : ''}</div>
          <span class="goal-check-emoji">${h.icon}</span>
          <span class="goal-check-label">${translatedName}</span>
        </div>
      `;
    }).join('');
  }

  // ---- Main render ----
  function render() {
    const user = Storage.User.get() || { name: 'Campeón', goal: 'ganar músculo' };

    // Greeting & date
    const greetEl = document.getElementById('dashboard-greeting');
    const dateEl  = document.getElementById('dashboard-date');
    if (greetEl) greetEl.textContent = getGreeting(user.name);
    if (dateEl)  dateEl.textContent  = formatDate();

    // Quote (rotate daily)
    const quoteEl = document.getElementById('motivational-quote');
    if (quoteEl) quoteEl.textContent = QUOTES[quoteIndex];

    // Streak
    const streakEl = document.getElementById('streak-count');
    if (streakEl) streakEl.textContent = Storage.Streak.get();

    // Day progress
    const pct = calculateDayProgress();
    const pctEl = document.getElementById('day-progress-pct');
    const barEl = document.getElementById('day-progress-bar');
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;

    // Goal banner
    renderGoalBanner(user);

    // Training card
    const todayEx    = Storage.Exercises.getTodayGroup();
    const completedEx = todayEx.filter(e => e.completed).length;
    const trainVal = document.getElementById('dash-training-value');
    const trainSub = document.getElementById('dash-training-sub');
    if (trainVal) {
      trainVal.textContent = todayEx.length > 0 
        ? `${completedEx}/${todayEx.length} ${t('nav_training').toLowerCase()}` 
        : t('dash_training_empty');
    }
    if (trainSub) {
      trainSub.textContent = todayEx.length > 0 
        ? (todayEx[0].muscleGroup || t('nav_training')) 
        : t('dash_training_go');
    }

    // Water card
    const water    = Storage.Water.get();
    const waterVal = document.getElementById('dash-water-value');
    const waterBar = document.getElementById('dash-water-bar');
    if (waterVal) waterVal.textContent = `${water}/8`;
    if (waterBar) waterBar.style.width = `${Math.min((water / 8) * 100, 100)}%`;

    // Supplements card
    const supps        = Storage.Supplements.getAll();
    const pendingSupps = supps.filter(s => !s.taken).length;
    const suppVal = document.getElementById('dash-supp-value');
    const suppSub = document.getElementById('dash-supp-sub');
    if (suppVal) {
      suppVal.textContent = `${pendingSupps} ${t('supps_status_pending').toLowerCase()}`;
    }
    if (suppSub) {
      suppSub.textContent = pendingSupps === 0 ? '✓' : `${supps.filter(s => s.taken).length} ${t('supps_status_taken').toLowerCase()}`;
    }

    // Medications card
    const meds       = Storage.Medications.getAll();
    const pendingMeds = meds.filter(m => !m.taken).length;
    const medVal = document.getElementById('dash-med-value');
    const medSub = document.getElementById('dash-med-sub');
    if (medVal) {
      medVal.textContent = `${pendingMeds} ${t('supps_status_pending').toLowerCase()}`;
    }
    if (medSub) {
      medSub.textContent = meds.length === 0 ? '—' : `${meds.filter(m => m.taken).length} ${t('supps_status_taken').toLowerCase()}`;
    }

    // Nutrition card
    const meals    = Storage.Meals.getToday();
    const nutriVal = document.getElementById('dash-nutri-value');
    const nutriSub = document.getElementById('dash-nutri-sub');
    if (nutriVal) {
      nutriVal.textContent = `${meals.length} ${t('nav_nutrition').toLowerCase()}`;
    }
    if (nutriSub) {
      nutriSub.textContent = meals.length === 0 ? '—' : t('nutri_meals_title');
    }

    // Habits card
    const habits    = Storage.Habits.get();
    const doneHabits = habits.filter(h => h.done).length;
    const habitsVal = document.getElementById('dash-habits-value');
    const habitsSub = document.getElementById('dash-habits-sub');
    if (habitsVal) habitsVal.textContent = `${doneHabits}/6`;
    if (habitsSub) {
      habitsSub.textContent = doneHabits === 6 ? '🏆' : t('onboard_label_goal').toLowerCase();
    }

    // Sub-sections
    renderTodayTraining();
    renderPendingList();
    renderTodaysGoals();
  }

  // ---- Toggle exercise from dashboard ----
  function toggleExercise(id) {
    Storage.Exercises.toggleComplete(id);
    render();
    TrainingView.render();
  }

  // ---- Toggle habit from dashboard ----
  function toggleHabitFromDash(id) {
    Storage.Habits.toggle(id);
    render();
    if (document.getElementById('view-progress').classList.contains('active')) {
      ProgressView.render();
    }
    Toast.show('Hábito actualizado ✓', 'success', 1500);
  }

  // ---- Init ----
  function init() {
    const quickWaterBtn = document.getElementById('quick-water-plus');
    if (quickWaterBtn) {
      quickWaterBtn.addEventListener('click', () => {
        const val = Storage.Water.add();
        render();
        if (val >= 8) Toast.show('¡Meta de agua alcanzada! 💧', 'success');
        else          Toast.show(`+1 vaso · ${val}/8 hoy`, 'default', 1600);
      });
    }
  }

  // ---- Helpers ----
  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { render, init, toggleExercise, toggleHabitFromDash };
})();
