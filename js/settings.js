/* =====================================================
   HapyBody+ — settings.js v2.0
   Vista de Configuración
   ===================================================== */

const SettingsView = (() => {
  // ---- Render settings view ----
  function render() {
    const theme = Storage.Theme.get();
    const themeToggle = document.getElementById('settings-theme-toggle');
    if (themeToggle) themeToggle.checked = theme === 'light';
  }

  // ---- Export data to JSON ----
  function exportData() {
    const json = Storage.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `hapybody-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Toast.show('Datos exportados correctamente ✓', 'success');
  }

  // ---- Reset all data ----
  function resetAllData() {
    if (!confirm('⚠️ ¿Estás seguro de que quieres borrar TODOS tus datos? Esta acción no se puede deshacer.')) return;
    if (!confirm('🚨 Última confirmación: se borrarán todos tus registros, ejercicios, comidas, suplementos y progreso.')) return;

    Storage.resetAll();
    Toast.show('Todos los datos han sido eliminados', 'warning');
    setTimeout(() => location.reload(), 1200);
  }

  // ---- Init ----
  function init() {
    // Theme toggle in settings
    const themeToggle = document.getElementById('settings-theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('change', () => {
        const next = Storage.Theme.toggle();
        ThemeManager.apply(next);
        Toast.show(next === 'dark' ? 'Modo oscuro activado 🌙' : 'Modo claro activado ☀️', 'default', 1800);
      });
    }

    // Export button
    document.getElementById('settings-export-btn')?.addEventListener('click', exportData);

    // Reset button
    document.getElementById('settings-reset-btn')?.addEventListener('click', resetAllData);

    // Reset day button in settings
    document.getElementById('settings-reset-day-btn')?.addEventListener('click', () => {
      if (!confirm('¿Reiniciar el progreso del día de hoy?')) return;
      Storage.resetDay();
      DashboardView.render();
      Toast.show('Día reiniciado ✓', 'success');
    });
  }

  return { render, init };
})();
