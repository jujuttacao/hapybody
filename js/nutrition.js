/* =====================================================
   HapyBody+ — nutrition.js v2.0
   Vista de Alimentación
   ===================================================== */

const NutritionView = (() => {
  // ---- Plate messages ----
  const PLATE_MESSAGES = {
    5: '🌟 ¡Excelente! Tu plato está perfectamente equilibrado. ¡Sigue así!',
    4: '💪 Muy buen plato. Solo falta un elemento para la perfección.',
    3: '👍 Plato bastante completo. Agrega más variedad si puedes.',
    2: '⚠️ Tu plato puede estar más equilibrado. Agrega proteína, verduras o fruta.',
    1: '💡 Mucho por mejorar. Un buen plato incluye proteína, carbohidratos y verduras.',
    0: 'Marca lo que incluiste en tus comidas de hoy para evaluar tu plato.',
  };

  // ---- Nutrient bar colors ----
  const NUTRIENT_COLORS = {
    protein:  '#00f07a',
    carb:     '#38bdf8',
    veggies:  '#4ade80',
    fruit:    '#fb923c',
    water:    '#60a5fa',
  };

  // ---- Fitness meal suggestions ----
  const FITNESS_MEALS = [
    { name: '🥚 Huevos + avena',        nutrients: ['Proteína', 'Carbohidrato'] },
    { name: '🍗 Pollo + arroz integral', nutrients: ['Proteína', 'Carbohidrato', 'Verduras'] },
    { name: '🐟 Atún + ensalada verde',  nutrients: ['Proteína', 'Verduras'] },
    { name: '🫛 Lentejas + quinoa',      nutrients: ['Proteína', 'Carbohidrato', 'Fibra'] },
    { name: '🫐 Yogur + frutos rojos',   nutrients: ['Proteína', 'Fruta'] },
    { name: '🥦 Brócoli + tofu',         nutrients: ['Proteína', 'Verduras'] },
    { name: '🌾 Pan integral + aguacate',nutrients: ['Carbohidrato', 'Grasa sana'] },
    { name: '🍌 Banana + mantequilla de maní', nutrients: ['Carbohidrato', 'Proteína', 'Energía'] },
  ];

  // ---- Render plate bars ----
  function renderPlate() {
    const plate = Storage.Plate.get();
    const keys = ['protein', 'carb', 'veggies', 'fruit', 'water'];
    const labels = {
      protein: { emoji: '🥩', labelKey: 'nutri_item_prot' },
      carb:    { emoji: '🌾', labelKey: 'nutri_item_carb' },
      veggies: { emoji: '🥦', labelKey: 'nutri_item_veg' },
      fruit:   { emoji: '🍎', labelKey: 'nutri_item_fruit' },
      water:   { emoji: '💧', labelKey: 'nutri_item_water' },
    };

    // Update hidden checkboxes (for backward compat)
    keys.forEach(key => {
      const cb = document.getElementById(`plate-${key}`);
      if (cb) cb.checked = plate[key] || false;
    });

    // Render bar items
    const barsContainer = document.getElementById('plate-bars');
    if (barsContainer) {
      barsContainer.innerHTML = keys.map(key => {
        const checked = plate[key] || false;
        const color   = NUTRIENT_COLORS[key];
        const info    = labels[key];
        const translatedLabel = t(info.labelKey);
        return `
          <div class="plate-bar-item" onclick="NutritionView.togglePlateItem('${key}')">
            <div class="plate-bar-label ${checked ? 'checked' : ''}">
              <span class="plate-bar-emoji">${info.emoji}</span>
              <span>${translatedLabel}</span>
            </div>
            <div class="plate-bar-track">
              <div class="plate-bar-fill ${checked ? 'active' : ''}" style="background:${color}"></div>
            </div>
            <div class="plate-bar-check ${checked ? 'checked' : ''}">${checked ? '✓' : ''}</div>
          </div>
        `;
      }).join('');
    }

    const count   = Object.values(plate).filter(Boolean).length;
    const msgEl   = document.getElementById('plate-message');
    const scoreEl = document.getElementById('plate-score-badge');

    // Simple translated status texts
    const countMessages = {
      5: `🌟 ${t('nutri_score_exc')}!`,
      4: `💪 ${t('nutri_score_good')}`,
      3: `👍 ${t('nutri_score_fair')}`,
      2: `⚠️ ${t('nutri_score_poor')}`,
      1: `💡 ${t('nutri_score_poor')}`,
      0: t('nutri_meals_empty')
    };

    if (msgEl) msgEl.textContent = countMessages[count] || countMessages[0];

    // Score badge
    if (scoreEl) {
      scoreEl.className = 'plate-score-badge';
      if (count === 5)     { scoreEl.textContent = `⭐ ${t('nutri_score_exc')}`;  scoreEl.classList.add('excellent'); }
      else if (count >= 4) { scoreEl.textContent = `✅ ${t('nutri_score_good')}`;   scoreEl.classList.add('good'); }
      else if (count >= 3) { scoreEl.textContent = `👍 ${t('nutri_score_fair')}`;       scoreEl.classList.add('fair'); }
      else if (count >= 1) { scoreEl.textContent = `⚠️ ${t('nutri_score_poor')}`;   scoreEl.classList.add('poor'); }
      else                 { scoreEl.textContent = '—'; }
    }
  }

  // ---- Toggle a plate item ----
  function togglePlateItem(key) {
    Storage.Plate.toggle(key);
    renderPlate();
  }

  // ---- Render meals by type ----
  function renderMeals() {
    const meals  = Storage.Meals.getToday();
    const types  = ['desayuno', 'almuerzo', 'cena', 'snack'];
    const emptyEl = document.getElementById('nutrition-empty');

    if (emptyEl) emptyEl.style.display = meals.length > 0 ? 'none' : 'flex';

    types.forEach(type => {
      const container = document.getElementById(`list-${type}`);
      if (!container) return;

      const typeMeals = meals.filter(m => m.type === type);
      if (typeMeals.length === 0) {
        container.innerHTML = `<div style="color:var(--text-muted);font-size:0.76rem;padding:8px 0;font-style:italic;">Sin registros</div>`;
        return;
      }

      container.innerHTML = typeMeals.map(meal => `
        <div class="meal-item" id="meal-${meal.id}">
          <div class="meal-item-body">
            <div class="meal-item-desc">${escapeHtml(meal.description)}</div>
            <div class="meal-item-meta">
              ${meal.hour ? `<span class="meal-item-hour">⏰ ${formatTime(meal.hour)}</span>` : ''}
              <span class="badge badge-${meal.healthLevel}">${healthLabel(meal.healthLevel)}</span>
            </div>
          </div>
          <button class="meal-item-delete" onclick="NutritionView.deleteMeal('${meal.id}')"
                  aria-label="Eliminar comida">✕</button>
        </div>
      `).join('');
    });
  }

  // ---- Render fitness suggestions ----
  function renderFitnessSuggestions() {
    const container = document.getElementById('fitness-suggestions-grid');
    if (!container) return;

    container.innerHTML = FITNESS_MEALS.map(meal => `
      <div class="fit-meal-card">
        <div class="fit-meal-name">${meal.name}</div>
        <div class="fit-meal-nutrients">
          ${meal.nutrients.map(n => `<span class="fit-meal-chip">${n}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // ---- Health level label ----
  function healthLabel(level) {
    const map = { alto: '🟢 Saludable', medio: '🟡 Moderado', bajo: '🔴 Bajo' };
    return map[level] || level;
  }

  // ---- Render all ----
  function render() {
    renderPlate();
    renderMeals();
    renderFitnessSuggestions();
  }

  // ---- Open meal modal ----
  function openMealModal() {
    const descEl = document.getElementById('meal-desc');
    const hourEl = document.getElementById('meal-hour');
    if (descEl) descEl.value = '';
    if (hourEl) hourEl.value = new Date().toTimeString().slice(0, 5);
    Modal.open('meal-modal');
  }

  // ---- Save meal ----
  function saveMeal() {
    const descEl = document.getElementById('meal-desc');
    const desc = descEl ? descEl.value.trim() : '';
    if (!desc) { Toast.show('Describe la comida', 'error'); return; }

    Storage.Meals.add({
      type:        document.getElementById('meal-type').value,
      description: desc,
      healthLevel: document.getElementById('meal-health').value,
      hour:        document.getElementById('meal-hour').value,
    });

    Modal.close('meal-modal');
    render();
    DashboardView.render();
    Toast.show('Comida registrada ✓', 'success');
  }

  // ---- Delete meal ----
  function deleteMeal(id) {
    Storage.Meals.delete(id);
    render();
    DashboardView.render();
    Toast.show('Comida eliminada', 'default');
  }

  // ---- Init ----
  function init() {
    // Legacy checkboxes (plate)
    document.querySelectorAll('.plate-check-item input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const key = cb.dataset.nutrient;
        Storage.Plate.toggle(key);
        renderPlate();
      });
    });

    // Add meal buttons
    document.getElementById('add-meal-btn')?.addEventListener('click', openMealModal);
    document.getElementById('add-meal-btn-empty')?.addEventListener('click', openMealModal);

    // Save meal
    document.getElementById('meal-modal-save')?.addEventListener('click', saveMeal);
    document.getElementById('meal-desc')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.ctrlKey) saveMeal();
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { render, init, deleteMeal, togglePlateItem };
})();
