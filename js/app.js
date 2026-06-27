/* =====================================================
   HapyBody+ — app.js v2.0
   Router SPA, Estado Global, Tema, Init
   ===================================================== */

// ======================================================
// TOAST UTILITY
// ======================================================
const Toast = (() => {
  const el = document.getElementById('toast');
  let timer;

  const icons = {
    success: '✓',
    error:   '✕',
    warning: '⚠',
    default: '•',
  };

  return {
    show(msg, type = 'default', duration = 2800) {
      clearTimeout(timer);
      el.innerHTML = `<span>${icons[type] || '•'}</span><span>${msg}</span>`;
      el.className = `toast show ${type}`;
      timer = setTimeout(() => { el.className = 'toast'; }, duration);
    }
  };
})();

// ======================================================
// THEME MANAGER
// ======================================================
const ThemeManager = (() => {
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update all theme toggle buttons
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.title = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    });
    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#080c14' : '#f0f4f8';
  }

  function init() {
    const saved = Storage.Theme.get();
    apply(saved);

    // Bind all theme toggle buttons
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = Storage.Theme.toggle();
        apply(next);
        Toast.show(next === 'dark' ? 'Modo oscuro activado 🌙' : 'Modo claro activado ☀️', 'default', 1800);
      });
    });
  }

  return { init, apply };
})();

// ======================================================
// ROUTER
// ======================================================
const Router = (() => {
  const views = ['dashboard', 'training', 'supplements', 'nutrition', 'progress', 'profile', 'settings'];
  let currentView = 'dashboard';

  function navigate(viewId) {
    if (!views.includes(viewId)) return;
    currentView = viewId;

    // Toggle views
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) el.classList.toggle('active', v === viewId);
    });

    // Update sidebar nav items
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    // Update bottom nav items
    document.querySelectorAll('.bottom-nav-item[data-view]').forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    // Trigger view render
    switch (viewId) {
      case 'dashboard':   DashboardView.render(); break;
      case 'training':    TrainingView.render();  break;
      case 'supplements': SuppsView.render();     break;
      case 'nutrition':   NutritionView.render(); break;
      case 'progress':    ProgressView.render();  break;
      case 'profile':     ProfileView.render();   break;
      case 'settings':    SettingsView.render();  break;
    }

    // Scroll to top
    const main = document.getElementById('main-content');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function init() {
    // Sidebar nav links
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        navigate(item.dataset.view);
      });
    });

    // Bottom nav links
    document.querySelectorAll('.bottom-nav-item[data-view]').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        navigate(item.dataset.view);
      });
    });

    // Any element with data-view-target
    document.addEventListener('click', e => {
      const target = e.target.closest('[data-view-target]');
      if (target) navigate(target.dataset.viewTarget);
    });
  }

  return { navigate, init, getCurrent: () => currentView };
})();

// ======================================================
// MODAL UTILITY
// ======================================================
const Modal = (() => {
  function open(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const firstInput = overlay.querySelector('input:not([type="hidden"]), select, textarea');
      if (firstInput) firstInput.focus();
    }, 120);
  }

  function close(id) {
    const overlay = document.getElementById(id);
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    // Close buttons (✕ and Cancel)
    document.querySelectorAll('.modal-close, [id$="-modal-cancel"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    // ESC key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
          m.classList.remove('open');
          document.body.style.overflow = '';
        });
      }
    });
  }

  return { open, close, init };
})();

// ======================================================
// ONBOARDING
// ======================================================
function initOnboarding() {
  const overlay = document.getElementById('onboarding-overlay');
  if (!overlay) return;
  const user = Storage.User.get();

  if (!user) {
    overlay.classList.remove('hidden');

    // Goal card selection
    let selectedGoal = 'ganar músculo';
    document.querySelectorAll('.goal-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedGoal = card.dataset.goal;
      });
    });

    // Submit
    document.getElementById('onboarding-submit-btn').addEventListener('click', () => {
      const nameInput = document.getElementById('user-name-input');
      const name = nameInput.value.trim() || 'Campeón';
      Storage.User.set({ name, goal: selectedGoal, joinDate: Storage.todayStr() });
      overlay.classList.add('hidden');
      // Update sidebar user info
      updateSidebarUser();
      DashboardView.render();
      Toast.show(`¡Bienvenido, ${name}! 💪`, 'success');
    });

    document.getElementById('user-name-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('onboarding-submit-btn').click();
    });
  }
}

// ======================================================
// SIDEBAR USER DISPLAY
// ======================================================
function updateSidebarUser() {
  const user = Storage.User.get();
  if (!user) return;

  const nameEl = document.getElementById('sidebar-user-name');
  const goalEl = document.getElementById('sidebar-user-goal');
  const avatarEl = document.getElementById('sidebar-avatar');

  const goalLabels = {
    'ganar músculo':       '💪 Ganar músculo',
    'perder grasa':        '🔥 Perder grasa',
    'mantener peso':       '⚖️ Mantener peso',
    'mejorar hábitos':     '✅ Mejorar hábitos',
    'tener más energía':   '⚡ Más energía',
    'mejorar condición':   '🏃 Mejor condición',
    'mantenerme saludable':'🌿 Salud',
    'definir mi cuerpo':   '⚡ Definición',
  };

  if (nameEl) nameEl.textContent = user.name;
  if (goalEl) goalEl.textContent = goalLabels[user.goal] || user.goal;
  if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
}

// ======================================================
// RESET DAY BUTTON
// ======================================================
function initResetDay() {
  const btn = document.getElementById('reset-day-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (confirm('¿Reiniciar el progreso diario? Se reseteará agua, hábitos, plato, suplementos y medicamentos.')) {
      Storage.resetDay();
      Router.navigate(Router.getCurrent());
      Toast.show('Día reiniciado ✓', 'success');
    }
  });
}

// ======================================================
// DATE FORMATTERS
// ======================================================
function formatDate(date = new Date()) {
  const days   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

function formatDateShort(ts) {
  const d = new Date(ts);
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'p.m.' : 'a.m.';
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2,'0')} ${ampm}`;
}

// ======================================================
// APP INIT
// ======================================================
function initApp() {
  // 1. Sincronización asíncrona en segundo plano si está conectado a Supabase
  if (window.SupabaseClient && SupabaseClient.isConnected()) {
    SupabaseClient.getSessionUser().then(user => {
      if (user) {
        SupabaseClient.downloadAllCloudToLocal(user.id).then(success => {
          if (success) {
            Router.navigate(Router.getCurrent());
            updateSidebarUser();
          }
        });
      }
    });
  }

  // 2. Check/reset day
  Storage.checkAndResetDay();

  // 2. Seed demo data on first visit
  if (!Storage.User.get()) {
    Storage.seedDemoData();
  }

  // 3. Apply theme
  ThemeManager.init();

  // 4. Init utilities
  Modal.init();
  Router.init();

  // 5. Init all view modules
  DashboardView.init();
  TrainingView.init();
  SuppsView.init();
  NutritionView.init();
  ProgressView.init();
  ProfileView.init();
  SettingsView.init();

  // 6. Onboarding
  initOnboarding();

  // 7. Reset day button
  initResetDay();

  // 8. Update sidebar user
  updateSidebarUser();

  // 9. Sidebar user click → profile
  const sidebarUser = document.getElementById('sidebar-user');
  if (sidebarUser) {
    sidebarUser.addEventListener('click', () => Router.navigate('profile'));
  }

  // 10. Update topbar date
  const dateEl = document.getElementById('today-date-topbar');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  // 11. Initial render
  Router.navigate('dashboard');
}

document.addEventListener('DOMContentLoaded', initApp);
