/* =====================================================
   HapyBody+ — app.js v2.0 (Premium Rebuild)
   Núcleo Orquestador, Enrutador SPA, Temas y Onboarding
   ===================================================== */

// ======================================================
// TOAST NOTIFICATIONS
// ======================================================
const Toast = {
  show: (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    
    // Quick inline styling for premium glass toast
    toast.style.background = 'var(--bg-surface)';
    toast.style.border = `1px solid ${type === 'success' ? 'var(--accent-green)' : (type === 'error' ? 'var(--accent-red)' : 'var(--border)')}`;
    toast.style.color = 'var(--text-primary)';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.backdropFilter = 'blur(10px)';
    toast.style.webkitBackdropFilter = 'blur(10px)';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '700';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    // Trigger reflow for transition
    toast.offsetHeight;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};
window.Toast = Toast;


// ======================================================
// THEME MANAGER
// ======================================================
const ThemeManager = {
  init: () => {
    const savedTheme = Storage.Theme.get();
    ThemeManager.apply(savedTheme);

    const btn = document.getElementById('header-theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const next = Storage.Theme.toggle();
        ThemeManager.apply(next);
        
        // Re-render Profile view to update the theme status text if active
        if (Router.getCurrent() === 'profile') ProfileView.render();
      });
    }
  },
  apply: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('header-theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
};
window.ThemeManager = ThemeManager;


// ======================================================
// ROUTER (SPA navigation)
// ======================================================
const Router = (() => {
  let currentView = 'dashboard';

  function init() {
    // Navigation click handler (desktop sidebar & mobile bottom bar)
    const links = document.querySelectorAll('[data-view]');
    links.forEach(link => {
      link.addEventListener('click', () => {
        const view = link.getAttribute('data-view');
        navigate(view);
      });
    });

    // Handle view redirects inside elements (e.g. Dashboard "Ir" links)
    document.body.addEventListener('click', (e) => {
      const redirect = e.target.closest('.view-redirect-link');
      if (redirect) {
        e.preventDefault();
        const view = redirect.dataset.targetView;
        navigate(view);
      }
    });
  }

  function navigate(viewId) {
    const panels = document.querySelectorAll('.view-panel');
    const panel = document.getElementById(`view-${viewId}`);
    if (!panel) return;

    currentView = viewId;

    // Toggle panels visibility
    panels.forEach(p => p.classList.remove('active'));
    panel.classList.add('active');

    // Update active state in sidebar and bottom navbar
    document.querySelectorAll('[data-view]').forEach(link => {
      if (link.getAttribute('data-view') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update title text in header
    const titleText = document.getElementById('header-title-text');
    if (titleText) {
      titleText.setAttribute('data-i18n', `nav_${viewId}`);
    }

    // Run render function on target view
    const renderers = {
      dashboard: DashboardView.render,
      training: TrainingView.render,
      supplements: SuppsView.render,
      nutrition: NutritionView.render,
      progress: ProgressView.render,
      profile: ProfileView.render,
      settings: SettingsView.render
    };

    if (renderers[viewId]) {
      renderers[viewId]();
    }

    // Refresh translation terms in DOM
    I18n.translateDOM();
  }

  function getCurrent() {
    return currentView;
  }

  return {
    init,
    navigate,
    getCurrent
  };
})();
window.Router = Router;


// ======================================================
// ONBOARDING
// ======================================================
function initOnboarding() {
  const overlay = document.getElementById('onboarding-overlay');
  if (!overlay) return;

  const user = Storage.User.get();

  if (!user) {
    overlay.classList.remove('hidden');

    // Slide 1 "Next" button transition
    const nextBtn = document.getElementById('onboarding-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        document.getElementById('onboard-step-1').classList.add('hidden');
        document.getElementById('onboard-step-2').classList.remove('hidden');
      });
    }

    // Slide 1 direct login redirect link — skip to step 2 in demo mode
    const loginLink = document.getElementById('onboarding-login-link');
    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('onboard-step-1').classList.add('hidden');
        document.getElementById('onboard-step-2').classList.remove('hidden');
      });
    }

    // Language selector changer
    const langSelect = document.getElementById('onboard-lang-select');
    if (langSelect) {
      langSelect.value = I18n.getLanguage();
      langSelect.addEventListener('change', (e) => {
        I18n.setLanguage(e.target.value);
      });
    }

    // Theme selector changer
    const themeSelect = document.getElementById('onboard-theme-select');
    if (themeSelect) {
      themeSelect.value = Storage.Theme.get();
      themeSelect.addEventListener('change', (e) => {
        ThemeManager.apply(e.target.value);
      });
    }

    // Goals card selections
    let activeGoal = 'ganar músculo';
    const goalCards = document.querySelectorAll('.goal-card');
    goalCards.forEach(card => {
      card.addEventListener('click', () => {
        goalCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        activeGoal = card.dataset.goal;
      });
    });

    // Form submit button
    const submitBtn = document.getElementById('onboarding-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('user-name-input');
        const name = nameInput.value.trim() || 'Campeón';
        const lang = langSelect ? langSelect.value : 'es';
        const theme = themeSelect ? themeSelect.value : 'dark';

        Storage.Theme.set(theme);
        I18n.setLanguage(lang);
        Storage.User.set({
          name,
          goal: activeGoal,
          joinDate: Storage.todayStr()
        });

        // Seed demo data on initial load
        Storage.seedDemoData();

        overlay.classList.add('hidden');
        updateSidebarUser();
        Router.navigate('dashboard');
        
        Toast.show(`${t('dash_hello')}, ${name}! 💪`, 'success');
      });
    }

    // Name Enter press shortcut
    document.getElementById('user-name-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') submitBtn.click();
    });
  } else {
    // If user is already set up, we still make sure we seed demo data if they are new
    Storage.seedDemoData();
    updateSidebarUser();
    Router.navigate('dashboard');
  }
}

// ======================================================
// AUTHENTICATION MODAL (Supabase login)
// ======================================================
function initAuthModal() {
  const modal = document.getElementById('auth-modal');
  const closeBtn = document.getElementById('auth-modal-close');
  const switchLink = document.getElementById('auth-switch-link');
  const switchText = document.getElementById('auth-switch-text');
  const nameGroup = document.getElementById('auth-name-group');
  const modalTitle = document.getElementById('auth-modal-title');
  const submitBtn = document.getElementById('auth-submit-btn');

  if (!modal) return;

  let isSignUpMode = false;

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  const guestBtn = document.getElementById('auth-guest-btn');
  if (guestBtn) {
    guestBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      Toast.show('Modo Invitado Activo ✓', 'success');
    });
  }

  switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    
    if (isSignUpMode) {
      modalTitle.textContent = 'Registrarse';
      switchText.textContent = '¿Ya tienes cuenta?';
      switchLink.textContent = 'Inicia Sesión';
      nameGroup.classList.remove('hidden');
      submitBtn.textContent = 'Crear Cuenta';
    } else {
      modalTitle.textContent = 'Iniciar Sesión';
      switchText.textContent = '¿No tienes cuenta?';
      switchLink.textContent = 'Regístrate';
      nameGroup.classList.add('hidden');
      submitBtn.textContent = 'Entrar';
    }
  });

  submitBtn.addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    const name = document.getElementById('auth-name').value.trim();

    if (!email || !password || (isSignUpMode && !name)) {
      Toast.show('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    submitBtn.textContent = 'Cargando...';
    submitBtn.disabled = true;

    try {
      if (isSignUpMode) {
        // Sign Up Flow
        const defaultGoal = 'ganar músculo';
        await SupabaseClient.signUp(email, password, name, defaultGoal);
        
        Storage.User.set({ name, goal: defaultGoal, joinDate: Storage.todayStr() });
        Toast.show('¡Registro exitoso! Por favor inicia sesión.', 'success');
        
        // Switch mode to login
        isSignUpMode = false;
        switchLink.click();
      } else {
        // Login Flow
        const res = await SupabaseClient.login(email, password);
        Toast.show('Sesión iniciada con éxito ✓', 'success');
        
        // Sync cloud database contents to local storage
        await SupabaseClient.downloadAllCloudToLocal(res.user.id);
        
        modal.classList.add('hidden');
        location.reload(); // Reload to refresh views with new synced data
      }
    } catch (e) {
      console.error(e);
      Toast.show(e.message || 'Error en la autenticación', 'error');
    } finally {
      submitBtn.textContent = isSignUpMode ? 'Crear Cuenta' : 'Entrar';
      submitBtn.disabled = false;
    }
  });
}


// ======================================================
// AUXILIARY HELPERS
// ======================================================
function updateSidebarUser() {
  const user = Storage.User.get();
  const sidebarName = document.getElementById('sidebar-user-name');
  const sidebarGoal = document.getElementById('sidebar-user-goal');
  const sidebarAvatar = document.getElementById('sidebar-user-avatar');

  if (user) {
    if (sidebarName) sidebarName.textContent = user.name;
    if (sidebarGoal) sidebarGoal.textContent = user.goal || 'ganar músculo';
    if (sidebarAvatar) sidebarAvatar.textContent = user.name.charAt(0).toUpperCase();
  }
}
window.updateSidebarUser = updateSidebarUser;


// ======================================================
// INITIALIZATION
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n
  I18n.init();

  // Initialize Theme manager
  ThemeManager.init();

  // Initialize SPA Router
  Router.init();

  // Initialize View modules
  DashboardView.init();
  TrainingView.init();
  SuppsView.init();
  NutritionView.init();
  ProgressView.init();
  ProfileView.init();
  SettingsView.init();

  // Onboarding overlay setup
  initOnboarding();

  // Authentication Setup
  initAuthModal();

  // Render active view (Router does this automatically on navigate)
  Router.navigate(Router.getCurrent());

  // Date banner update
  const dateEl = document.getElementById('header-subtitle-date');
  if (dateEl) {
    const opts = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = new Date().toLocaleDateString(undefined, opts);
    dateEl.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  }

  // Sidebar profile click directs to Profile panel
  const sidebarProfileBtn = document.getElementById('sidebar-profile-btn');
  if (sidebarProfileBtn) {
    sidebarProfileBtn.addEventListener('click', () => {
      Router.navigate('profile');
    });
  }
});
