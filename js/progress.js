/* =====================================================
   HapyBody+ — progress.js v2.0 (Rebuild)
   ===================================================== */

const ProgressView = (() => {
  
  function init() {
    const addBtn = document.getElementById('prog-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('prog-weight').value);
        const waist = parseInt(document.getElementById('prog-waist').value) || null;
        const arm = parseInt(document.getElementById('prog-arm').value) || null;
        const chest = parseInt(document.getElementById('prog-chest').value) || null;
        const note = document.getElementById('prog-note').value.trim();

        if (isNaN(weight) || weight <= 0) {
          Toast.show('Por favor ingresa un peso corporal válido', 'error');
          return;
        }

        Storage.Progress.add({ weight, waist, arm, chest, note });

        // Clear fields
        document.getElementById('prog-weight').value = '';
        document.getElementById('prog-waist').value = '';
        document.getElementById('prog-arm').value = '';
        document.getElementById('prog-chest').value = '';
        document.getElementById('prog-note').value = '';

        render();
        Toast.show('Registro guardado con éxito ✓', 'success');
      });
    }
  }

  function render() {
    const tableBody = document.getElementById('progress-table-body');
    if (!tableBody) return;

    const list = Storage.Progress.getAll();

    if (list.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="padding:24px; text-align:center; color:var(--text-secondary); font-style:italic;">
            No hay registros guardados. ¡Agrega tu primera medición arriba!
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = list.map(item => {
      const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      return `
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:14px 8px; font-weight:600;">${dateStr}</td>
          <td style="padding:14px 8px; font-weight:700; color:var(--accent-green);">${item.weight} kg</td>
          <td style="padding:14px 8px; color:var(--text-secondary);">${item.waist ? `${item.waist} cm` : '-'}</td>
          <td style="padding:14px 8px; color:var(--text-secondary);">${item.arm ? `${item.arm} cm` : '-'}</td>
          <td style="padding:14px 8px; color:var(--text-secondary);">${item.chest ? `${item.chest} cm` : '-'}</td>
          <td style="padding:14px 8px;">
            <button onclick="ProgressView.deleteRecord('${item.id}')" style="background:transparent; border:none; color:var(--accent-red); cursor:pointer; font-size:1.1rem; opacity:0.7;">✕</button>
          </td>
        </tr>
        ${item.note ? `
          <tr style="border-bottom:1px solid var(--border); background:rgba(255,255,255,0.01);">
            <td colspan="6" style="padding:8px 8px 12px 16px; font-size:0.78rem; color:var(--text-secondary); font-style:italic;">
              Nota: ${item.note}
            </td>
          </tr>
        ` : ''}
      `;
    }).join('');
  }

  function deleteRecord(id) {
    if (confirm('¿Seguro que deseas eliminar este registro de progreso?')) {
      Storage.Progress.delete(id);
      render();
      Toast.show('Registro eliminado', 'success');
    }
  }

  return {
    init,
    render,
    deleteRecord
  };
})();

window.ProgressView = ProgressView;
