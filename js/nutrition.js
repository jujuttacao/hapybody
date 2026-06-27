/* =====================================================
   HapyBody+ — nutrition.js v2.0 (Rebuild)
   ===================================================== */

const NutritionView = (() => {
  
  function init() {
    // Add click listeners to plate selector cards
    document.querySelectorAll('[data-plate]').forEach(card => {
      card.addEventListener('click', () => {
        const key = card.dataset.plate;
        Storage.Plate.toggle(key);
        render();
      });
    });

    // Add meal button submit listener
    const addBtn = document.getElementById('meal-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const description = document.getElementById('meal-desc').value.trim();
        const healthLevel = document.getElementById('meal-rating').value;
        const type = document.getElementById('meal-type').value;
        const hour = document.getElementById('meal-hour').value;

        if (!description) {
          Toast.show('Por favor ingresa una descripción para tu alimento', 'error');
          return;
        }

        Storage.Meals.add({ type, description, healthLevel, hour });

        // Clear fields
        document.getElementById('meal-desc').value = '';
        
        render();
        Toast.show('Alimento registrado ✓', 'success');
      });
    }
  }

  function render() {
    // 1. Sync nutrient plate cards UI
    const plate = Storage.Plate.get();
    document.querySelectorAll('[data-plate]').forEach(card => {
      const key = card.dataset.plate;
      if (plate[key]) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    // 2. Render today's logged meals
    const container = document.getElementById('meals-list-container');
    if (!container) return;

    const meals = Storage.Meals.getToday();
    // Sort reverse chronological
    meals.sort((a,b) => b.createdAt - a.createdAt);

    if (meals.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align:center; padding:40px; color:var(--text-secondary);">
          <span style="font-size:2.2rem; display:block; margin-bottom:10px;">🥗</span>
          <p>No has registrado ningún alimento hoy.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = meals.map(meal => {
      const ratingText = meal.healthLevel === 'alto' ? 'Calidad Alta 🟢' : (meal.healthLevel === 'medio' ? 'Calidad Media 🟡' : 'Calidad Baja 🔴');
      const ratingColor = meal.healthLevel === 'alto' ? 'var(--accent-green)' : (meal.healthLevel === 'medio' ? 'var(--accent-orange)' : 'var(--accent-red)');
      
      return `
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; gap:16px;">
          <div style="min-width:0; overflow:hidden;">
            <span style="font-size:0.75rem; background:var(--bg-elevated); color:var(--text-secondary); padding:3px 8px; border-radius:var(--radius-sm); font-weight:700; text-transform:uppercase;">${meal.type}</span>
            <h4 style="font-size:1.1rem; margin:6px 0 2px 0; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${meal.description}</h4>
            <div style="display:flex; gap:12px; font-size:0.78rem; color:var(--text-secondary);">
              <span>Hora: ${meal.hour}</span>
              <span>&bull;</span>
              <span style="color:${ratingColor}; font-weight:700;">${ratingText}</span>
            </div>
          </div>
          <button onclick="NutritionView.deleteMeal('${meal.id}')" style="background:transparent; border:none; color:var(--accent-red); cursor:pointer; font-size:1.2rem; opacity:0.6; flex-shrink:0;">✕</button>
        </div>
      `;
    }).join('');
  }

  function deleteMeal(id) {
    if (confirm('¿Seguro que deseas eliminar este registro de comida?')) {
      Storage.Meals.delete(id);
      render();
      Toast.show('Registro eliminado', 'success');
    }
  }

  return {
    init,
    render,
    deleteMeal
  };
})();

window.NutritionView = NutritionView;
