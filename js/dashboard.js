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
    'ganar músculo':       { icon: '💪', msg: 'Enfócate en proteína y peso progresivo hoy.' },
    'perder grasa':        { icon: '🔥', msg: 'Déficit calórico + cardio. ¡Hoy quemas más!' },
    'mantener peso':       { icon: '⚖️', msg: 'Equilibrio es clave. Come bien y muévete.' },
    'mejorar hábitos':     { icon: '✅', msg: 'Un hábito a la vez cambia todo. Tú puedes.' },
    'tener más energía':   { icon: '⚡', msg: 'Hidratación + sueño + movimiento = energía.' },
    'mejorar condición':   { icon: '🏃', msg: 'Cardio progresivo. ¡Supérate cada día!' },
    'mantenerme saludable':{ icon: '🌿', msg: 'Salud es riqueza. Cada elección importa.' },
    'definir mi cuerpo':   { icon: '⚡', msg: 'Déficit + proteína + entrenamiento = definición.' },
  };

  let quoteIndex = Math.floor(Math.random() * QUOTES.length);

  // ---- Greeting by time ----
  function getGreeting(name) {
    const h = new Date().getHours();
    if (h < 12) return `¡Buenos días, ${name}! ☀️`;
    if (h < 18) return `¡Buenas tardes, ${name}! ⚡`;
    return `¡Buenas noches, ${name}! 🌙`;
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
    const data = GOAL_DATA[goal] || { icon: '🎯', msg: 'Sigue tus metas hoy.' };

    bannerEl.innerHTML = `
      <div class="goal-banner-icon">${data.icon}</div>
      <div class="goal-banner-info">
        <div class="goal-banner-label">Mi objetivo</div>
        <div class="goal-banner-title">${capitalizeFirst(goal)}</div>
        <div class="goal-banner-msg">${data.msg}</div>
      </div>
    `;
  }

  // ---- Render today's training quick view ----
  function renderTodayTraining() {
    const container = document.getElementById('dash-today-training');
    if (!container) return;
    const exercises = Storage.Exercises.getTodayGroup();

    if (exercises.length === 0) {
      container.innerHTML = `<div class="empty-state-small">
        <span>No tienes ejercicios para hoy.</span>
        <button class="btn-link" data-view-target="training">+ Agregar</button>
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
      container.innerHTML = `<div class="empty-state-small"><span>¡Todo al día! 🎉</span></div>`;
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
        <span class="badge badge-pending">pendiente</span>
      </div>
    `).join('');
  }

  // ---- Render today's goals checklist ----
  function renderTodaysGoals() {
    const container = document.getElementById('todays-goals-list');
    if (!container) return;

    const habits = Storage.Habits.get();
    container.innerHTML = habits.map(h => `
      <div class="goal-check-item ${h.done ? 'done' : ''}"
           onclick="DashboardView.toggleHabitFromDash('${h.id}')">
        <div class="goal-check-circle">${h.done ? '✓' : ''}</div>
        <span class="goal-check-emoji">${h.icon}</span>
        <span class="goal-check-label">${h.name}</span>
      </div>
    `).join('');
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
    if (trainVal) trainVal.textContent = todayEx.length > 0 ? `${completedEx}/${todayEx.length} ejercicios` : 'Sin rutina';
    if (trainSub) trainSub.textContent = todayEx.length > 0 ? (todayEx[0].muscleGroup || 'Entrenamiento') : 'Agrega ejercicios para hoy';

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
    if (suppVal) suppVal.textContent = `${pendingSupps} pendiente${pendingSupps !== 1 ? 's' : ''}`;
    if (suppSub) suppSub.textContent = pendingSupps === 0 ? '¡Todo al día! ✓' : `${supps.filter(s => s.taken).length} tomados`;

    // Medications card
    const meds       = Storage.Medications.getAll();
    const pendingMeds = meds.filter(m => !m.taken).length;
    const medVal = document.getElementById('dash-med-value');
    const medSub = document.getElementById('dash-med-sub');
    if (medVal) medVal.textContent = `${pendingMeds} pendiente${pendingMeds !== 1 ? 's' : ''}`;
    if (medSub) medSub.textContent = meds.length === 0 ? 'Sin registros' : `${meds.filter(m => m.taken).length} tomados`;

    // Nutrition card
    const meals    = Storage.Meals.getToday();
    const nutriVal = document.getElementById('dash-nutri-value');
    const nutriSub = document.getElementById('dash-nutri-sub');
    if (nutriVal) nutriVal.textContent = `${meals.length} comida${meals.length !== 1 ? 's' : ''}`;
    if (nutriSub) nutriSub.textContent = meals.length === 0 ? 'Sin registros hoy' : 'Registradas hoy';

    // Habits card
    const habits    = Storage.Habits.get();
    const doneHabits = habits.filter(h => h.done).length;
    const habitsVal = document.getElementById('dash-habits-value');
    const habitsSub = document.getElementById('dash-habits-sub');
    if (habitsVal) habitsVal.textContent = `${doneHabits}/6`;
    if (habitsSub) habitsSub.textContent = doneHabits === 6 ? '¡Día perfecto! 🌟' : 'Completados hoy';

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
