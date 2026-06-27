/* =====================================================
   HapyBody+ — training.js v2.0 (Rebuild)
   ===================================================== */

const TrainingView = (() => {
  let activeDayFilter = 'Todos';

  function init() {
    // Add exercise submit button listener
    const addBtn = document.getElementById('ex-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const day = document.getElementById('ex-day').value;
        const muscleGroup = document.getElementById('ex-muscle').value.trim();
        const exercise = document.getElementById('ex-name').value.trim();
        const sets = parseInt(document.getElementById('ex-sets').value) || 4;
        const reps = parseInt(document.getElementById('ex-reps').value) || 10;
        const weight = parseFloat(document.getElementById('ex-weight').value) || 0;

        if (!muscleGroup || !exercise) {
          Toast.show('Por favor completa todos los campos del ejercicio', 'error');
          return;
        }

        Storage.Exercises.add({ day, muscleGroup, exercise, sets, reps, weight });
        
        // Clear fields
        document.getElementById('ex-muscle').value = '';
        document.getElementById('ex-name').value = '';
        document.getElementById('ex-weight').value = '0';
        
        render();
        Toast.show('Ejercicio agregado con éxito ✓', 'success');
      });
    }

    // Set filter day listeners
    document.querySelectorAll('.filter-day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-day-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeDayFilter = btn.dataset.day;
        render();
      });
    });
  }

  function render() {
    const container = document.getElementById('training-list-container');
    if (!container) return;

    let exercises = Storage.Exercises.getAll();
    
    // Sort by creation time so newest are displayed clearly, or group by muscle group
    exercises.sort((a,b) => b.createdAt - a.createdAt);

    // Apply active day filter
    if (activeDayFilter !== 'Todos') {
      exercises = exercises.filter(ex => ex.day === activeDayFilter);
    }

    if (exercises.length === 0) {
      container.innerHTML = `
        <div class="card" style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-secondary);">
          <span style="font-size:2.2rem; display:block; margin-bottom:10px;">🏋️</span>
          <p>No hay ejercicios registrados para esta selección.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = exercises.map(ex => `
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; gap:16px;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
            <span style="font-size:0.75rem; background:rgba(56, 189, 248, 0.12); color:var(--accent-blue); padding:4px 10px; border-radius:var(--radius-full); font-weight:700;">${ex.day}</span>
            <button onclick="TrainingView.deleteExercise('${ex.id}')" style="background:transparent; border:none; color:var(--accent-red); cursor:pointer; font-size:1.1rem; opacity:0.7;" title="Eliminar">✕</button>
          </div>
          
          <h4 style="font-size:1.15rem; margin-bottom:4px;">${ex.exercise}</h4>
          <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:600;">Grupo: ${ex.muscleGroup}</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:12px;">
          <div style="font-size:0.88rem; color:var(--text-secondary);">
            <strong style="color:var(--text-primary);">${ex.sets}</strong> series × <strong style="color:var(--text-primary);">${ex.reps}</strong> reps
            ${ex.weight > 0 ? `<br><span style="font-size:0.76rem;">Peso: ${ex.weight} kg</span>` : ''}
          </div>
          
          <button onclick="TrainingView.toggleComplete('${ex.id}')" class="btn ${ex.completed ? 'btn-primary' : 'btn-secondary'}" style="padding:6px 14px; font-size:0.8rem; border-radius:var(--radius-full);">
            ${ex.completed ? '✓ Completado' : 'Pendiente'}
          </button>
        </div>
      </div>
    `).join('');
  }

  function toggleComplete(id) {
    Storage.Exercises.toggleComplete(id);
    render();
  }

  function deleteExercise(id) {
    if (confirm('¿Seguro que deseas eliminar este ejercicio?')) {
      Storage.Exercises.delete(id);
      render();
      Toast.show('Ejercicio eliminado', 'success');
    }
  }

  return {
    init,
    render,
    toggleComplete,
    deleteExercise
  };
})();

window.TrainingView = TrainingView;
