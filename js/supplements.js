/* =====================================================
   HapyBody+ — supplements.js v2.0
   Vista de Suplementos y Medicamentos
   ===================================================== */

const SuppsView = (() => {
  // ---- Emoji map ----
  const SUPP_EMOJIS = {
    'Creatina':        '⚡', 'Proteína Whey': '🥛', 'Pre-entreno':    '🔥',
    'Vitamina D':      '☀️', 'Omega 3':       '🐟', 'Colágeno':       '💎',
    'Magnesio':        '🪨', 'Zinc':          '⚙️', 'BCAA':           '💊',
    'Multivitamínico': '🌿', 'L-Carnitina':   '🏃', 'Glutamina':      '🧬',
  };

  // ---- Category map ----
  const CATEGORIES = {
    proteina:   { label: 'Proteína',   class: 'cat-protein',    icon: '🥛' },
    creatina:   { label: 'Creatina',   class: 'cat-creatina',   icon: '⚡' },
    vitaminas:  { label: 'Vitaminas',  class: 'cat-vitaminas',  icon: '☀️' },
    preentreno: { label: 'Pre-entreno',class: 'cat-preentreno', icon: '🔥' },
    otro:       { label: 'Otro',       class: 'cat-otro',       icon: '💊' },
  };

  function getEmoji(name, category) {
    if (SUPP_EMOJIS[name]) return SUPP_EMOJIS[name];
    if (category && CATEGORIES[category]) return CATEGORIES[category].icon;
    return '💊';
  }

  function getCategoryBadge(category) {
    const cat = CATEGORIES[category];
    if (!cat) return '';
    return `<span class="category-chip ${cat.class}">${cat.icon} ${cat.label}</span>`;
  }

  let activeTab = 'supplements-tab';

  // ---- Render counts ----
  function renderCounts() {
    const supps = Storage.Supplements.getAll();
    const meds  = Storage.Medications.getAll();

    const suppPending = document.getElementById('supp-pending-count');
    const suppDone    = document.getElementById('supp-done-count');
    const medPending  = document.getElementById('med-pending-count');
    const medDone     = document.getElementById('med-done-count');

    if (suppPending) suppPending.textContent = `${supps.filter(s => !s.taken).length} pendientes`;
    if (suppDone)    suppDone.textContent    = `${supps.filter(s =>  s.taken).length} tomados`;
    if (medPending)  medPending.textContent  = `${meds.filter(m  => !m.taken).length} pendientes`;
    if (medDone)     medDone.textContent     = `${meds.filter(m  =>  m.taken).length} tomados`;
  }

  // ---- Render supplements list ----
  function renderSupplements() {
    const list      = Storage.Supplements.getAll();
    const container = document.getElementById('supp-list');
    const empty     = document.getElementById('supp-empty');

    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = '';
      container.appendChild(empty);
      empty.style.display = 'flex';
      return;
    }
    empty.style.display = 'none';

    // Sort: pending first
    const sorted = [...list].sort((a, b) => a.taken - b.taken);

    container.innerHTML = sorted.map(s => `
      <div class="supp-item ${s.taken ? 'taken' : ''}" id="supp-${s.id}">
        <div class="supp-icon-circle">${getEmoji(s.name, s.category)}</div>
        <div class="supp-body">
          <div class="supp-name">${escapeHtml(s.name)}</div>
          <div class="supp-meta">
            ${s.category ? getCategoryBadge(s.category) : ''}
            ${s.hour ? `<span class="meta-chip">⏰ ${formatTime(s.hour)}</span>` : ''}
            <span class="meta-chip">${escapeHtml(s.frequency || 'Diario')}</span>
            <span class="badge ${s.taken ? 'badge-done' : 'badge-pending'}">${s.taken ? 'tomado ✓' : 'pendiente'}</span>
          </div>
          ${s.note ? `<div class="supp-note-text">📝 ${escapeHtml(s.note)}</div>` : ''}
        </div>
        <div class="supp-actions">
          <button class="btn-take ${s.taken ? 'btn-take-done' : 'btn-take-pending'}"
                  onclick="SuppsView.toggleSupp('${s.id}')">
            ${s.taken ? '↩ Deshacer' : '✓ Marcar'}
          </button>
          <button class="btn-icon" onclick="SuppsView.deleteSupp('${s.id}')"
                  aria-label="Eliminar ${escapeHtml(s.name)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  // ---- Render medications list ----
  function renderMedications() {
    const list      = Storage.Medications.getAll();
    const container = document.getElementById('med-list');
    const empty     = document.getElementById('med-empty');

    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = '';
      container.appendChild(empty);
      empty.style.display = 'flex';
      return;
    }
    empty.style.display = 'none';

    const sorted = [...list].sort((a, b) => a.taken - b.taken);

    container.innerHTML = sorted.map(m => `
      <div class="supp-item ${m.taken ? 'taken' : ''}" id="med-${m.id}">
        <div class="supp-icon-circle">🩺</div>
        <div class="supp-body">
          <div class="supp-name">${escapeHtml(m.name)}</div>
          <div class="supp-meta">
            ${m.dose ? `<span class="meta-chip">💊 ${escapeHtml(m.dose)}</span>` : ''}
            ${m.hour ? `<span class="meta-chip">⏰ ${formatTime(m.hour)}</span>` : ''}
            <span class="meta-chip">${escapeHtml(m.frequency || 'Diario')}</span>
            <span class="badge ${m.taken ? 'badge-done' : 'badge-pending'}">${m.taken ? 'tomado ✓' : 'pendiente'}</span>
          </div>
        </div>
        <div class="supp-actions">
          <button class="btn-take ${m.taken ? 'btn-take-done' : 'btn-take-pending'}"
                  onclick="SuppsView.toggleMed('${m.id}')">
            ${m.taken ? '↩ Deshacer' : '✓ Marcar'}
          </button>
          <button class="btn-icon" onclick="SuppsView.deleteMed('${m.id}')"
                  aria-label="Eliminar ${escapeHtml(m.name)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  function render() {
    renderCounts();
    renderSupplements();
    renderMedications();
  }

  // ---- Switch tabs ----
  function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('#supp-tabs .view-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    document.querySelectorAll('#view-supplements .tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === tabId);
    });
  }

  // ---- Open supplement modal ----
  function openSuppModal() {
    const select = document.getElementById('supp-name-select');
    const custom = document.getElementById('supp-name-custom');
    const note   = document.getElementById('supp-note');
    if (select) select.value = '';
    if (custom) custom.value = '';
    if (note)   note.value   = '';
    document.getElementById('supp-custom-group')?.classList.add('hidden');
    // Reset category selection
    document.querySelectorAll('.supp-cat-option').forEach(o => o.classList.remove('active'));
    Modal.open('supp-modal');
  }

  // ---- Open medication modal ----
  function openMedModal() {
    const nameEl = document.getElementById('med-name');
    const doseEl = document.getElementById('med-dose');
    if (nameEl) nameEl.value = '';
    if (doseEl) doseEl.value = '';
    Modal.open('med-modal');
  }

  // ---- Save supplement ----
  function saveSupp() {
    const select = document.getElementById('supp-name-select').value;
    const custom = document.getElementById('supp-name-custom').value.trim();
    let name = select === 'otro' ? custom : select;
    if (!name) { Toast.show('Selecciona o escribe un suplemento', 'error'); return; }

    // Get selected category
    let category = 'otro';
    document.querySelectorAll('.supp-cat-option').forEach(o => {
      if (o.classList.contains('active')) category = o.dataset.cat;
    });

    Storage.Supplements.add({
      name,
      category,
      hour:      document.getElementById('supp-hour').value,
      frequency: document.getElementById('supp-freq').value,
      note:      document.getElementById('supp-note').value.trim(),
    });

    Modal.close('supp-modal');
    render();
    DashboardView.render();
    Toast.show(`${name} agregado ✓`, 'success');
  }

  // ---- Save medication ----
  function saveMed() {
    const name = document.getElementById('med-name').value.trim();
    if (!name) { Toast.show('Escribe el nombre del medicamento', 'error'); return; }

    Storage.Medications.add({
      name,
      dose:      document.getElementById('med-dose').value.trim(),
      hour:      document.getElementById('med-hour').value,
      frequency: document.getElementById('med-freq').value,
    });

    Modal.close('med-modal');
    render();
    DashboardView.render();
    Toast.show(`${name} agregado ✓`, 'success');
  }

  // ---- Toggle supplement ----
  function toggleSupp(id) {
    const s = Storage.Supplements.toggleTaken(id);
    render();
    DashboardView.render();
    if (s && s.taken) Toast.show(`${s.name} tomado ✓`, 'success');
  }

  // ---- Toggle medication ----
  function toggleMed(id) {
    const m = Storage.Medications.toggleTaken(id);
    render();
    DashboardView.render();
    if (m && m.taken) Toast.show(`${m.name} tomado ✓`, 'success');
  }

  // ---- Delete supplement ----
  function deleteSupp(id) {
    if (!confirm('¿Eliminar este suplemento?')) return;
    Storage.Supplements.delete(id);
    render();
    DashboardView.render();
    Toast.show('Suplemento eliminado', 'default');
  }

  // ---- Delete medication ----
  function deleteMed(id) {
    if (!confirm('¿Eliminar este medicamento?')) return;
    Storage.Medications.delete(id);
    render();
    DashboardView.render();
    Toast.show('Medicamento eliminado', 'default');
  }

  // ---- Init ----
  function init() {
    // Tabs
    const tabs = document.getElementById('supp-tabs');
    if (tabs) {
      tabs.addEventListener('click', e => {
        const tab = e.target.closest('.view-tab');
        if (tab) switchTab(tab.dataset.tab);
      });
    }

    // Open modals
    document.getElementById('add-supp-btn')?.addEventListener('click', openSuppModal);
    document.getElementById('add-supp-btn-empty')?.addEventListener('click', openSuppModal);
    document.getElementById('add-med-btn')?.addEventListener('click', openMedModal);
    document.getElementById('add-med-btn-empty')?.addEventListener('click', openMedModal);

    // Supplement name select → show custom field
    document.getElementById('supp-name-select')?.addEventListener('change', e => {
      const customGroup = document.getElementById('supp-custom-group');
      customGroup?.classList.toggle('hidden', e.target.value !== 'otro');
      if (e.target.value === 'otro') document.getElementById('supp-name-custom')?.focus();
    });

    // Category option buttons
    document.querySelectorAll('.supp-cat-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.supp-cat-option').forEach(o => o.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Save buttons
    document.getElementById('supp-modal-save')?.addEventListener('click', saveSupp);
    document.getElementById('med-modal-save')?.addEventListener('click', saveMed);

    // Enter key
    document.getElementById('med-name')?.addEventListener('keydown', e => { if (e.key === 'Enter') saveMed(); });
    document.getElementById('supp-name-custom')?.addEventListener('keydown', e => { if (e.key === 'Enter') saveSupp(); });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { render, init, toggleSupp, toggleMed, deleteSupp, deleteMed };
})();
