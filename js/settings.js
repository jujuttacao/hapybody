/* =====================================================
   HapyBody+ — settings.js v2.0 (Rebuild)
   ===================================================== */

const SettingsView = (() => {
  
  function init() {
    // Fill credentials in inputs
    const creds = SupabaseClient.getCredentials();
    const urlInput = document.getElementById('settings-sb-url');
    const keyInput = document.getElementById('settings-sb-key');
    
    if (urlInput) urlInput.value = creds.url;
    if (keyInput) keyInput.value = creds.key;

    // Test connection button
    const testBtn = document.getElementById('settings-db-test-btn');
    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        const key = keyInput.value.trim();

        if (!url || !key) {
          Toast.show('Por favor ingresa la URL y la Anon Key', 'error');
          return;
        }

        testBtn.textContent = 'Probando...';
        testBtn.disabled = true;

        const isOk = await SupabaseClient.testConnection(url, key);
        
        testBtn.textContent = t('settings_btn_test');
        testBtn.disabled = false;

        if (isOk) {
          Toast.show('¡Conexión con Supabase exitosa! ✓', 'success');
        } else {
          Toast.show('Error: No se pudo conectar a Supabase', 'error');
        }
      });
    }

    // Save connection button
    const saveBtn = document.getElementById('settings-db-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        const key = keyInput.value.trim();

        SupabaseClient.setCredentials(url, key);
        Toast.show('Credenciales guardadas con éxito ✓', 'success');
        
        // Reload page to re-initialize Supabase client
        setTimeout(() => location.reload(), 800);
      });
    }

    // Reset day button
    const resetDayBtn = document.getElementById('settings-reset-day-btn');
    if (resetDayBtn) {
      resetDayBtn.addEventListener('click', () => {
        if (confirm('¿Seguro que deseas reiniciar el progreso de hidratación, hábitos y suplementos de hoy?')) {
          Storage.resetDay();
          Toast.show('Día reiniciado correctamente ✓', 'success');
          
          if (window.Router && Router.getCurrent() === 'dashboard') {
            DashboardView.render();
          }
        }
      });
    }
  }

  function render() {
    const creds = SupabaseClient.getCredentials();
    const urlInput = document.getElementById('settings-sb-url');
    const keyInput = document.getElementById('settings-sb-key');
    
    if (urlInput) urlInput.value = creds.url;
    if (keyInput) keyInput.value = creds.key;
  }

  return {
    init,
    render
  };
})();

window.SettingsView = SettingsView;
