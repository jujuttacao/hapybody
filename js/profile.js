/* =====================================================
   HapyBody+ — profile.js v2.0
   Vista de Perfil de Usuario
   ===================================================== */

const ProfileView = (() => {
  // ---- Goal options ----
  const GOALS = [
    { id: 'ganar músculo',       icon: '💪', label: 'Ganar músculo' },
    { id: 'perder grasa',        icon: '🔥', label: 'Perder grasa' },
    { id: 'mantener peso',       icon: '⚖️', label: 'Mantener peso' },
    { id: 'mejorar hábitos',     icon: '✅', label: 'Mejorar hábitos' },
    { id: 'tener más energía',   icon: '⚡', label: 'Más energía' },
    { id: 'mejorar condición',   icon: '🏃', label: 'Mejor condición' },
    { id: 'mantenerme saludable',icon: '🌿', label: 'Mantenerme sano' },
    { id: 'definir mi cuerpo',   icon: '⚡', label: 'Definir mi cuerpo' },
  ];

  // ---- Render profile header ----
  function renderHeader(user) {
    const headerEl = document.getElementById('profile-header-card');
    if (!headerEl) return;

    const daysActive = user.joinDate
      ? Math.floor((Date.now() - new Date(user.joinDate)) / 86400000) + 1
      : 1;

    const goalObj = GOALS.find(g => g.id === user.goal) || { icon: '🎯', label: user.goal };

    headerEl.innerHTML = `
      <div class="profile-big-avatar">${user.name.charAt(0).toUpperCase()}</div>
      <div class="profile-header-info">
        <div class="profile-header-name">${escapeHtml(user.name)}</div>
        <div class="profile-header-date">Activo desde: ${new Date(user.joinDate || Date.now()).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <div class="profile-header-goal">${goalObj.icon} ${goalObj.label}</div>
      </div>
    `;
  }

  // ---- Render profile stats ----
  function renderStats(user) {
    const container = document.getElementById('profile-stats-row');
    if (!container) return;

    const streak  = Storage.Streak.get();
    const supps   = Storage.Supplements.getAll().length;
    const progLen = Storage.Progress.getAll().length;

    container.innerHTML = `
      <div class="profile-stat-card">
        <div class="profile-stat-value" style="color:var(--accent-orange)">🔥 ${streak}</div>
        <div class="profile-stat-label">Días racha</div>
      </div>
      <div class="profile-stat-card">
        <div class="profile-stat-value" style="color:var(--accent-purple)">${supps}</div>
        <div class="profile-stat-label">Suplementos</div>
      </div>
      <div class="profile-stat-card">
        <div class="profile-stat-value" style="color:var(--accent-blue)">${progLen}</div>
        <div class="profile-stat-label">Registros</div>
      </div>
    `;
  }

  // ---- Render goal selector ----
  function renderGoalSelector(user) {
    const container = document.getElementById('profile-goal-grid');
    if (!container) return;

    container.innerHTML = GOALS.map(g => `
      <div class="profile-goal-card ${user.goal === g.id ? 'selected' : ''}"
           onclick="ProfileView.selectGoal('${g.id}')"
           data-goal="${g.id}">
        <div class="profile-goal-icon">${g.icon}</div>
        <div class="profile-goal-text">${g.label}</div>
      </div>
    `).join('');
  }

  // ---- Render edit name form ----
  function renderNameForm(user) {
    const nameInput = document.getElementById('profile-name-input');
    if (nameInput) nameInput.value = user.name || '';
  }

  // ---- Full render ----
  function render() {
    const user = Storage.User.get() || { name: 'Campeón', goal: 'ganar músculo', joinDate: Storage.todayStr() };
    renderHeader(user);
    renderStats(user);
    renderGoalSelector(user);
    renderNameForm(user);
  }

  // ---- Select goal ----
  function selectGoal(goalId) {
    const user = Storage.User.get() || {};
    user.goal = goalId;
    Storage.User.set(user);

    // Update UI
    document.querySelectorAll('.profile-goal-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.goal === goalId);
    });

    updateSidebarUser();
    DashboardView.render();
    Toast.show('Objetivo actualizado ✓', 'success');
  }

  // ---- Save name ----
  function saveName() {
    const input = document.getElementById('profile-name-input');
    const name  = input ? input.value.trim() : '';
    if (!name) { Toast.show('Escribe tu nombre', 'error'); return; }

    const user = Storage.User.get() || {};
    user.name = name;
    Storage.User.set(user);

    render();
    updateSidebarUser();
    DashboardView.render();
    Toast.show(`¡Hola, ${name}! Nombre actualizado ✓`, 'success');
  }

  // ---- Init ----
  function init() {
    document.getElementById('profile-save-name-btn')?.addEventListener('click', saveName);
    document.getElementById('profile-name-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') saveName();
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { render, init, selectGoal };
})();
