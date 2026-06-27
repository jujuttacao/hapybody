/* =====================================================
   HapyBody+ — training.js v2.0
   Vista de entrenamiento
   ===================================================== */

const TrainingView = (() => {
  const DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

  function getTodayDayName() {
    const map = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    return map[new Date().getDay()];
  }

  let selectedDay = getTodayDayName();

  // ---- Render day tabs with today marker ----
  function renderDayTabs() {
    const today = getTodayDayName();
    document.querySelectorAll('.day-tab').forEach(tab => {
      const isActive = tab.dataset.day === selectedDay;
      const isToday  = tab.dataset.day === today;
      tab.classList.toggle('active', isActive);
      tab.classList.toggle('today-marker', isToday);
    });
  }

  // ---- Render exercises for selected day ----
  function renderExercises() {
    const list      = Storage.Exercises.getByDay(selectedDay);
    const container = document.getElementById('exercise-list');
    const empty     = document.getElementById('exercise-empty');
    const dayLabel  = document.getElementById('training-day-label');
    const dayCount  = document.getElementById('training-day-count');
    const dayBar    = document.getElementById('training-day-bar');

    if (dayLabel) dayLabel.textContent = selectedDay;

    if (list.length === 0) {
      container.innerHTML = '';
      container.appendChild(empty);
      empty.style.display = 'flex';
      if (dayCount) dayCount.textContent = '0/0 completados';
      if (dayBar)   dayBar.style.width   = '0%';
      return;
    }

    empty.style.display = 'none';
    const completed = list.filter(e => e.completed).length;
    if (dayCount) dayCount.textContent = `${completed}/${list.length} completados`;
    if (dayBar)   dayBar.style.width   = `${Math.round((completed / list.length) * 100)}%`;

    container.innerHTML = list.map(ex => `
      <div class="exercise-item ${ex.completed ? 'completed' : ''}" id="ex-${ex.id}">
        <button class="exercise-check ${ex.completed ? 'checked' : ''}"
                onclick="TrainingView.toggleExercise('${ex.id}')"
                aria-label="${ex.completed ? 'Desmarcar' : 'Marcar'} ${escapeHtml(ex.exercise)}">
          ${ex.completed ? '✓' : ''}
        </button>
        <div class="exercise-body">
          <div class="exercise-name">${escapeHtml(ex.exercise)}</div>
          <div class="exercise-chips">
            <span class="exercise-chip group-chip">${escapeHtml(ex.muscleGroup)}</span>
            <span class="exercise-chip">📊 ${ex.sets} × ${ex.reps}</span>
            ${ex.weight ? `<span class="exercise-chip">⚖️ ${ex.weight} kg</span>` : ''}
          </div>
        </div>
        <button class="exercise-delete" onclick="TrainingView.deleteExercise('${ex.id}')"
                aria-label="Eliminar ${escapeHtml(ex.exercise)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    `).join('');
  }

  function render() {
    renderDayTabs();
    renderExercises();
  }

  // ---- Open modal ----
  function openModal() {
    const select = document.getElementById('ex-day');
    if (select) select.value = selectedDay;
    const nameEl  = document.getElementById('ex-name');
    const setsEl  = document.getElementById('ex-sets');
    const repsEl  = document.getElementById('ex-reps');
    const weightEl= document.getElementById('ex-weight');
    if (nameEl)   nameEl.value   = '';
    if (setsEl)   setsEl.value   = '4';
    if (repsEl)   repsEl.value   = '10';
    if (weightEl) weightEl.value = '';
    Modal.open('exercise-modal');
  }

  // ---- Save exercise ----
  function saveExercise() {
    const nameEl = document.getElementById('ex-name');
    const name = nameEl ? nameEl.value.trim() : '';
    if (!name) { Toast.show('Escribe el nombre del ejercicio', 'error'); return; }

    Storage.Exercises.add({
      day:         document.getElementById('ex-day').value,
      muscleGroup: document.getElementById('ex-group').value,
      exercise:    name,
      sets:        parseInt(document.getElementById('ex-sets').value) || 3,
      reps:        parseInt(document.getElementById('ex-reps').value) || 10,
      weight:      parseFloat(document.getElementById('ex-weight').value) || 0,
    });

    Modal.close('exercise-modal');
    selectedDay = document.getElementById('ex-day').value;
    render();
    DashboardView.render();
    Toast.show('Ejercicio agregado ✓', 'success');
  }

  // ---- Toggle exercise completion ----
  function toggleExercise(id) {
    Storage.Exercises.toggleComplete(id);
    render();
    DashboardView.render();
  }

  // ---- Delete exercise ----
  function deleteExercise(id) {
    if (!confirm('¿Eliminar este ejercicio?')) return;
    Storage.Exercises.delete(id);
    render();
    DashboardView.render();
    Toast.show('Ejercicio eliminado', 'default');
  }

  // ---- Init ----
  function init() {
    // Day tab clicks
    const tabsEl = document.getElementById('day-tabs');
    if (tabsEl) {
      tabsEl.addEventListener('click', e => {
        const tab = e.target.closest('.day-tab');
        if (tab) { selectedDay = tab.dataset.day; render(); }
      });
    }

    // Add exercise buttons
    const addBtn      = document.getElementById('add-exercise-btn');
    const addBtnEmpty = document.getElementById('add-exercise-btn-empty');
    if (addBtn)      addBtn.addEventListener('click', openModal);
    if (addBtnEmpty) addBtnEmpty.addEventListener('click', openModal);

    // Save
    const saveBtn = document.getElementById('exercise-modal-save');
    if (saveBtn) saveBtn.addEventListener('click', saveExercise);

    // Enter key in name field
    const nameField = document.getElementById('ex-name');
    if (nameField) nameField.addEventListener('keydown', e => { if (e.key === 'Enter') saveExercise(); });

    // Mark today's tab
    const today = getTodayDayName();
    document.querySelectorAll('.day-tab').forEach(tab => {
      if (tab.dataset.day === today) tab.title = 'Hoy';
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { render, init, toggleExercise, deleteExercise };
})();
