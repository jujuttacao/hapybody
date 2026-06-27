/* =====================================================
   HapyBody+ — dashboard.js v2.0 (Rebuild)
   ===================================================== */

const DashboardView = (() => {
  
  function init() {
    // Add event listener to add water button
    const addBtn = document.getElementById('water-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        Storage.Water.add();
        render();
        Toast.show('¡Vaso de agua agregado! 💧', 'success');
      });
    }
  }

  function render() {
    // 1. Check and reset day if date changed
    Storage.checkAndResetDay();

    // 2. Render active streak
    const streakDays = document.getElementById('dash-streak-days');
    if (streakDays) {
      streakDays.textContent = Storage.Streak.get();
    }

    // 3. Render circular water progress
    const water = Storage.Water.get();
    const progressCircle = document.getElementById('water-progress-circle');
    const progressText = document.getElementById('water-progress-text');
    
    if (progressCircle && progressText) {
      const goal = 8;
      const r = progressCircle.r.baseVal.value;
      const circumference = 2 * Math.PI * r; // ~314.16
      
      const pct = Math.min(water / goal, 1.5); // Allow overachieving visually up to 150%
      const offset = circumference - (Math.min(pct, 1) * circumference);
      
      progressCircle.style.strokeDashoffset = offset;
      progressText.textContent = water;
    }

    // 4. Render habits checklist
    const habitsList = document.getElementById('dashboard-habits-checklist');
    if (habitsList) {
      const list = Storage.Habits.get();
      
      // Dynamic habit translation labels
      const habitNames = {
        es: { water: 'Tomar Agua', training: 'Entrenamiento', sleep: 'Buen Sueño', food: 'Comida Sana', supps: 'Suplementos', stretch: 'Estiramiento' },
        en: { water: 'Drink Water', training: 'Workout', sleep: 'Good Sleep', food: 'Healthy Food', supps: 'Supplements', stretch: 'Stretching' },
        de: { water: 'Wasser trinken', training: 'Training', sleep: 'Guter Schlaf', food: 'Gesundes Essen', supps: 'Ergänzung', stretch: 'Dehnen' },
        zh: { water: '今日饮水', training: '健身锻炼', sleep: '充足睡眠', food: '健康餐食', supps: '服用补剂', stretch: '拉伸放松' }
      };

      const lang = I18n.getLanguage();
      const labels = habitNames[lang] || habitNames['es'];

      habitsList.innerHTML = list.map(h => {
        const name = labels[h.id] || h.name;
        return `
          <div class="habit-checkbox-card ${h.done ? 'checked' : ''}" onclick="DashboardView.toggleHabit('${h.id}')">
            <span class="habit-icon">${h.icon}</span>
            <span class="habit-name">${name}</span>
          </div>
        `;
      }).join('');
    }

    // 5. Render today's training quickview
    const trainingContainer = document.getElementById('dash-today-training-container');
    if (trainingContainer) {
      const todayExercises = Storage.Exercises.getTodayGroup();
      if (todayExercises.length === 0) {
        trainingContainer.innerHTML = `
          <p style="color:var(--text-secondary); font-size:0.86rem; font-style:italic;" data-i18n="dash_training_empty">Día de descanso</p>
        `;
      } else {
        trainingContainer.innerHTML = todayExercises.map(ex => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border);">
            <div style="display:flex; align-items:center; gap:10px;">
              <input type="checkbox" ${ex.completed ? 'checked' : ''} onchange="DashboardView.toggleExercise('${ex.id}')" style="accent-color:var(--accent-green); cursor:pointer;">
              <span style="${ex.completed ? 'text-decoration:line-through; opacity:0.5;' : ''} font-weight:600; font-size:0.9rem;">${ex.exercise}</span>
            </div>
            <span style="font-size:0.78rem; background:var(--bg-elevated); padding:3px 8px; border-radius:var(--radius-sm); color:var(--text-secondary); font-weight:700;">${ex.sets}x${ex.reps}</span>
          </div>
        `).join('');
      }
    }

    // 6. Render today's meals quickview
    const mealsContainer = document.getElementById('dash-today-meals-container');
    if (mealsContainer) {
      const todayMeals = Storage.Meals.getToday();
      if (todayMeals.length === 0) {
        mealsContainer.innerHTML = `
          <p style="color:var(--text-secondary); font-size:0.86rem; font-style:italic;">No hay alimentos registrados hoy</p>
        `;
      } else {
        mealsContainer.innerHTML = todayMeals.map(m => {
          const color = m.healthLevel === 'alto' ? 'var(--accent-green)' : (m.healthLevel === 'medio' ? 'var(--accent-orange)' : 'var(--accent-red)');
          return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border);">
              <div style="display:flex; flex-direction:column; overflow:hidden;">
                <span style="font-weight:600; font-size:0.88rem; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${m.description}</span>
                <span style="font-size:0.74rem; color:var(--text-secondary);">${m.hour} - ${m.type}</span>
              </div>
              <span style="width:10px; height:10px; border-radius:50%; background-color:${color}; flex-shrink:0;" title="Calidad ${m.healthLevel}"></span>
            </div>
          `;
        }).join('');
      }
    }

    // Retranslate view static DOM elements
    I18n.translateDOM();
  }

  function toggleHabit(id) {
    Storage.Habits.toggle(id);
    render();
  }

  function toggleExercise(id) {
    Storage.Exercises.toggleComplete(id);
    render();
  }

  return {
    init,
    render,
    toggleHabit,
    toggleExercise
  };
})();

window.DashboardView = DashboardView;
