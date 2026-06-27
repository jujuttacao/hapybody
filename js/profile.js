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
  async function render() {
    const isConnected = SupabaseClient.isConnected();
    const authSection = document.getElementById('profile-auth-section');
    const loggedSection = document.getElementById('profile-logged-section');
    const cloudCard = document.getElementById('profile-cloud-status-card');
    const cloudInfo = document.getElementById('profile-cloud-sync-info');

    if (!isConnected) {
      // Local-only mode
      authSection?.classList.add('hidden');
      loggedSection?.classList.remove('hidden');
      cloudCard?.classList.add('hidden');
    } else {
      const user = await SupabaseClient.getSessionUser();
      if (!user) {
        // Connected but not logged in -> show login form
        authSection?.classList.remove('hidden');
        loggedSection?.classList.add('hidden');
      } else {
        // Connected and logged in -> show profile + logout card
        authSection?.classList.add('hidden');
        loggedSection?.classList.remove('hidden');
        cloudCard?.classList.remove('hidden');
        if (cloudInfo) cloudInfo.textContent = `Sesión iniciada con: ${user.email}. Tus datos están sincronizados en la nube.`;
      }
    }

    const userObj = Storage.User.get() || { name: 'Campeón', goal: 'ganar músculo', joinDate: Storage.todayStr() };
    renderHeader(userObj);
    renderStats(userObj);
    renderGoalSelector(userObj);
    renderNameForm(userObj);
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
    // Save profile actions
    document.getElementById('profile-save-name-btn')?.addEventListener('click', saveName);
    document.getElementById('profile-name-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') saveName();
    });

    // Toggle login/signup forms
    document.getElementById('auth-goto-signup')?.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('auth-login-box')?.classList.add('hidden');
      document.getElementById('auth-signup-box')?.classList.remove('hidden');
    });

    document.getElementById('auth-goto-login')?.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('auth-signup-box')?.classList.add('hidden');
      document.getElementById('auth-login-box')?.classList.remove('hidden');
    });

    // Login submit
    document.getElementById('auth-login-submit-btn')?.addEventListener('click', async () => {
      const email = document.getElementById('auth-login-email')?.value.trim();
      const pass  = document.getElementById('auth-login-pass')?.value.trim();
      if (!email || !pass) { Toast.show('Por favor completa todos los campos', 'error'); return; }

      Toast.show('Iniciando sesión...', 'default');
      try {
        await SupabaseClient.login(email, pass);
        const user = await SupabaseClient.getSessionUser();
        
        Toast.show('¡Sesión iniciada! Sincronizando...', 'success');
        
        // Sincronizar: descargar datos de Supabase a LocalStorage
        await SupabaseClient.downloadAllCloudToLocal(user.id);
        
        // Recargar aplicación
        location.reload();
      } catch (err) {
        Toast.show('Error: ' + err.message, 'error');
      }
    });

    // Signup submit
    document.getElementById('auth-signup-submit-btn')?.addEventListener('click', async () => {
      const name  = document.getElementById('auth-signup-name')?.value.trim();
      const email = document.getElementById('auth-signup-email')?.value.trim();
      const pass  = document.getElementById('auth-signup-pass')?.value.trim();
      if (!name || !email || !pass) { Toast.show('Por favor completa todos los campos', 'error'); return; }
      if (pass.length < 6) { Toast.show('La contraseña debe tener al menos 6 caracteres', 'error'); return; }

      Toast.show('Creando cuenta...', 'default');
      try {
        const goal = Storage.User.get()?.goal || 'ganar músculo';
        await SupabaseClient.signUp(email, pass, name, goal);
        
        const user = await SupabaseClient.getSessionUser();
        // Si se crea correctamente, subir el estado local actual (para no perder su progreso)
        if (user) {
          await SupabaseClient.uploadAllLocalToCloud(user.id);
        }
        
        Toast.show('¡Cuenta creada y sincronizada! Revisa tu correo.', 'success');
        location.reload();
      } catch (err) {
        Toast.show('Error: ' + err.message, 'error');
      }
    });

    // Logout button
    document.getElementById('profile-logout-btn')?.addEventListener('click', async () => {
      if (confirm('¿Cerrar sesión? Los datos locales se limpiarán.')) {
        await SupabaseClient.logout();
        Storage.resetAll(); // Clear local cache to prevent data overlap
        location.reload();
      }
    });

    // Force Sync button
    document.getElementById('profile-cloud-sync-btn')?.addEventListener('click', async () => {
      const user = await SupabaseClient.getSessionUser();
      if (!user) return;
      Toast.show('Subiendo datos locales a la nube...', 'default');
      await SupabaseClient.uploadAllLocalToCloud(user.id);
      Toast.show('¡Sincronización completada! ☁️', 'success');
      render();
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { render, init, selectGoal };
})();
