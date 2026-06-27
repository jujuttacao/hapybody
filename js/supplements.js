/* =====================================================
   HapyBody+ — supplements.js v2.0 (Rebuild)
   ===================================================== */

const SuppsView = (() => {
  
  function init() {
    const addBtn = document.getElementById('supp-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const name = document.getElementById('supp-name').value.trim();
        const category = document.getElementById('supp-type').value;
        const hour = document.getElementById('supp-hour').value;
        const frequency = 'Diario'; // Default
        const note = document.getElementById('supp-note').value.trim();

        if (!name) {
          Toast.show('Por favor ingresa un nombre para el suplemento o medicamento', 'error');
          return;
        }

        Storage.Supplements.add({ name, category, hour, frequency, note });

        // Clear fields
        document.getElementById('supp-name').value = '';
        document.getElementById('supp-note').value = '';

        render();
        Toast.show('Agregado con éxito ✓', 'success');
      });
    }
  }

  function render() {
    const container = document.getElementById('supplements-list-container');
    if (!container) return;

    const list = Storage.Supplements.getAll();
    
    // Sort chronologically by time
    list.sort((a, b) => a.hour.localeCompare(b.hour));

    if (list.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align:center; padding:40px; color:var(--text-secondary);">
          <span style="font-size:2.2rem; display:block; margin-bottom:10px;">💊</span>
          <p>No tienes ningún suplemento o medicamento programado.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => {
      const typeLabel = item.category === 'suplemento' ? 'Suplemento 💊' : 'Medicamento 🧪';
      const color = item.category === 'suplemento' ? 'var(--accent-purple)' : 'var(--accent-orange)';
      
      return `
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; gap:16px; padding:18px 24px;">
          <div style="display:flex; align-items:center; gap:16px; min-width:0; flex-grow:1;">
            <input type="checkbox" ${item.taken ? 'checked' : ''} onchange="SuppsView.toggleTaken('${item.id}')" style="width:20px; height:20px; accent-color:var(--accent-green); cursor:pointer; flex-shrink:0;">
            <div style="min-width:0; overflow:hidden;">
              <h4 style="font-size:1.05rem; white-space:nowrap; text-overflow:ellipsis; overflow:hidden; ${item.taken ? 'text-decoration:line-through; opacity:0.5;' : ''}">${item.name}</h4>
              <p style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">
                <span style="color:${color}; font-weight:700;">${typeLabel}</span> &bull; <span>${item.hour}</span>
                ${item.note ? ` &bull; <span style="font-style:italic;">${item.note}</span>` : ''}
              </p>
            </div>
          </div>
          <button onclick="SuppsView.deleteSupplement('${item.id}')" style="background:transparent; border:none; color:var(--accent-red); cursor:pointer; font-size:1.2rem; opacity:0.6; flex-shrink:0;">✕</button>
        </div>
      `;
    }).join('');
  }

  function toggleTaken(id) {
    Storage.Supplements.toggleTaken(id);
    render();
  }

  function deleteSupplement(id) {
    if (confirm('¿Seguro que deseas eliminar este elemento?')) {
      Storage.Supplements.delete(id);
      render();
      Toast.show('Eliminado con éxito', 'success');
    }
  }

  return {
    init,
    render,
    toggleTaken,
    deleteSupplement
  };
})();

window.SuppsView = SuppsView;
