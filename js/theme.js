/**
 * QuickConvert - Universal Global Dark Mode Controller
 * Shared across index.html, feedback.html, and all tools/*.html
 */
(function () {
  'use strict';

  var THEME_KEY = 'qc_theme';

  // Apply theme to DOM (both <html> and <body>) and persist to localStorage
  function setTheme(theme, save) {
    if (save === undefined) save = true;
    var isDark = theme === 'dark';

    if (isDark) {
      document.documentElement.classList.add('dark');
      if (document.body) document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      if (document.body) document.body.classList.remove('dark');
    }

    if (save) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (e) {}
    }

    updateToggleIcons(isDark);
  }

  // Update icons and ARIA attributes on all toggle buttons
  function updateToggleIcons(isDark) {
    var buttons = document.querySelectorAll('.theme-toggle-btn, [data-theme-toggle]');
    buttons.forEach(function (btn) {
      var icon = btn.querySelector('.theme-icon') || btn.querySelector('i');
      if (icon) {
        if (isDark) {
          icon.className = 'theme-icon fa-solid fa-sun text-sm text-amber-400';
          btn.setAttribute('title', 'Switch to Light Mode');
          btn.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
          icon.className = 'theme-icon fa-solid fa-moon text-sm text-slate-600 dark:text-slate-300';
          btn.setAttribute('title', 'Switch to Dark Mode');
          btn.setAttribute('aria-label', 'Switch to Dark Mode');
        }
      }
    });
  }

  // Toggle between dark and light
  function toggleTheme() {
    var isDark = document.documentElement.classList.contains('dark') || (document.body && document.body.classList.contains('dark'));
    setTheme(isDark ? 'light' : 'dark', true);
  }

  // Delegated click event: catches clicks on any button, icon, or container for dark mode toggle
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.theme-toggle-btn') || 
              e.target.closest('[data-theme-toggle]') || 
              e.target.closest('#theme-toggle') || 
              e.target.closest('.fa-moon') || 
              e.target.closest('.fa-sun') ||
              e.target.closest('.theme-icon');
    if (btn) {
      e.preventDefault();
      toggleTheme();
    }
  });

  // Cross-tab synchronization
  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY) {
      var newTheme = e.newValue || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setTheme(newTheme, false);
    }
  });

  // Initialize icon state and ensure <body> has the class when DOM is ready
  function init() {
    var savedTheme = null;
    try {
      savedTheme = localStorage.getItem(THEME_KEY);
    } catch (e) {}

    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setTheme(isDark ? 'dark' : 'light', false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose globally
  window.qcToggleTheme = toggleTheme;
  window.qcSetTheme = setTheme;
})();
