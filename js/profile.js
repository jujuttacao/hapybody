/* =====================================================
   HapyBody+ — profile.js v2.0 (Rebuild)
   ===================================================== */

const ProfileView = (() => {
  
  function init() {
    // 1. Manage Profile row click listener (Open Edit Modal)
    const editRow = document.getElementById('profile-row-edit');
    if (editRow) {
      editRow.addEventListener('click', () => {
        const user = Storage.User.get() || { name: 'Campeón', goal: 'ganar músculo' };
        document.getElementById('modal-edit-name').value = user.name;
        document.getElementById('modal-edit-goal').value = user.goal || 'ganar músculo';
        document.getElementById('profile-edit-modal').classList.remove('hidden');
      });
    }

    // Modal Edit Cancel listener
    const modalCancel = document.getElementById('modal-edit-cancel');
    if (modalCancel) {
      modalCancel.addEventListener('click', () => {
        document.getElementById('profile-edit-modal').classList.add('hidden');
      });
    }

    // Modal Edit Save listener
    const modalSave = document.getElementById('modal-edit-save');
    if (modalSave) {
      modalSave.addEventListener('click', () => {
        const name = document.getElementById('modal-edit-name').value.trim() || 'Campeón';
        const goal = document.getElementById('modal-edit-goal').value;
        const current = Storage.User.get() || {};
        
        Storage.User.set({
          ...current,
          name,
          goal
        });

        document.getElementById('profile-edit-modal').classList.add('hidden');
        render();
        if (window.updateSidebarUser) updateSidebarUser();
        Toast.show('Perfil actualizado con éxito ✓', 'success');
      });
    }

    // 2. Password & Security row click listener
    const securityRow = document.getElementById('profile-row-security');
    if (securityRow) {
      securityRow.addEventListener('click', () => {
        Toast.show('Seguridad y contraseñas — próximamente', 'info');
      });
    }

    // 3. Language row click listener (Cycle language)
    const langRow = document.getElementById('profile-row-lang');
    if (langRow) {
      langRow.addEventListener('click', () => {
        const current = I18n.getLanguage();
        const cycle = { es: 'en', en: 'de', de: 'zh', zh: 'es' };
        const next = cycle[current] || 'es';
        I18n.setLanguage(next);
        render();
        Toast.show(`Idioma cambiado a: ${next.toUpperCase()}`, 'success');
      });
    }

    // 4. Theme row click listener (Toggle theme in vivo)
    const themeRow = document.getElementById('profile-row-theme');
    if (themeRow) {
      themeRow.addEventListener('click', () => {
        const next = Storage.Theme.toggle();
        ThemeManager.apply(next);
        render();
      });
    }

    // 5. Supabase Sync row click listener (Navigate to database settings)
    const syncRow = document.getElementById('profile-row-sync');
    if (syncRow) {
      syncRow.addEventListener('click', () => {
        Router.navigate('settings');
      });
    }

    // 6. Logout button listener
    const logoutBtn = document.getElementById('profile-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        if (window.SupabaseClient && SupabaseClient.isConnected()) {
          await SupabaseClient.logout();
          Storage.resetAll();
          location.reload();
        } else {
          Storage.resetAll();
          location.reload();
        }
      });
    }
  }

  function render() {
    const user = Storage.User.get();
    
    // User card details
    const userName = document.getElementById('profile-user-name');
    const userEmail = document.getElementById('profile-user-email');
    const userAvatar = document.getElementById('profile-user-avatar');

    if (user) {
      if (userName) userName.textContent = user.name;
      if (userAvatar) userAvatar.textContent = user.name.charAt(0).toUpperCase();
    }

    // Check Cloud auth info if active
    if (window.SupabaseClient && SupabaseClient.getUser()) {
      const sbUser = SupabaseClient.getUser();
      if (userEmail) userEmail.textContent = sbUser.email;
      const syncStatus = document.getElementById('profile-sync-status');
      if (syncStatus) syncStatus.textContent = 'Conectado';
    } else {
      if (userEmail) userEmail.textContent = 'invitado@hapybody.com';
      const syncStatus = document.getElementById('profile-sync-status');
      if (syncStatus) syncStatus.textContent = 'Desconectado';
    }

    // Status variables in list rows
    const langStatus = document.getElementById('profile-lang-status');
    if (langStatus) {
      const langs = { es: 'Español', en: 'English', de: 'Deutsch', zh: '中文' };
      langStatus.textContent = langs[I18n.getLanguage()] || 'Español';
    }

    const themeStatus = document.getElementById('profile-theme-status');
    if (themeStatus) {
      themeStatus.textContent = Storage.Theme.get() === 'dark' ? 'Dark' : 'Light';
    }
  }

  return {
    init,
    render
  };
})();

window.ProfileView = ProfileView;
