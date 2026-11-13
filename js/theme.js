/**
 * QuickConvert - Universal Global Dark Mode & Privacy Controller
 * Shared across index.html, feedback.html, and all tools/*.html
 */
(function () {
  'use strict';

  var THEME_KEY = 'qc_theme';
  var CONSENT_KEY = 'qc_cookie_consent';

  // ==========================================
  // 1. THEME CONTROLLER
  // ==========================================

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

  function toggleTheme() {
    var isDark = document.documentElement.classList.contains('dark') || (document.body && document.body.classList.contains('dark'));
    setTheme(isDark ? 'light' : 'dark', true);
  }

  // Delegated click event for theme toggle buttons and icons
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

  // Delegated accordion click event for FAQ items
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.faq-trigger');
    if (!trigger) return;
    var item = trigger.closest('.faq-item');
    if (!item) return;
    var content = item.querySelector('.faq-content');
    var icon = trigger.querySelector('.faq-icon') || trigger.querySelector('i');
    if (!content) return;

    var isOpen = content.classList.contains('open') || (content.style.maxHeight && content.style.maxHeight !== '0px');

    if (isOpen) {
      content.classList.remove('open');
      content.style.maxHeight = null;
      if (icon) icon.style.transform = 'rotate(0deg)';
    } else {
      content.classList.add('open');
      content.style.maxHeight = (content.scrollHeight + 30) + 'px';
      if (icon) icon.style.transform = 'rotate(180deg)';
    }
  });

  // Cross-tab theme synchronization
  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY) {
      var newTheme = e.newValue || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setTheme(newTheme, false);
    }
  });

  // ==========================================
  // 2. COOKIE CONSENT & CONDITIONAL ANALYTICS
  // ==========================================

  function loadConsentedAnalytics() {
    if (window._gtmLoaded) return;
    window._gtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-PF96NZS9';
    document.head.appendChild(s);
  }

  function initCookieConsent() {
    var banner = document.getElementById('cookie-consent-banner');
    var consent = null;
    try {
      consent = localStorage.getItem(CONSENT_KEY);
    } catch (e) {}

    if (consent === 'accepted') {
      loadConsentedAnalytics();
      if (banner) banner.classList.add('hidden');
    } else if (consent === 'declined' || consent === 'essential') {
      if (banner) banner.classList.add('hidden');
    } else {
      if (banner) banner.classList.remove('hidden');
    }

    var acceptBtn = document.getElementById('btn-accept-cookies');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        try {
          localStorage.setItem(CONSENT_KEY, 'accepted');
        } catch (e) {}
        if (banner) banner.classList.add('hidden');
        loadConsentedAnalytics();
        if (typeof showToast === 'function') showToast('Cookie preferences saved', 'info');
      });
    }

    var declineBtn = document.getElementById('btn-decline-cookies');
    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        try {
          localStorage.setItem(CONSENT_KEY, 'declined');
        } catch (e) {}
        if (banner) banner.classList.add('hidden');
        if (typeof showToast === 'function') showToast('Non-essential cookies declined', 'info');
      });
    }

    var closeBtn = document.getElementById('btn-close-cookie-banner');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (banner) banner.classList.add('hidden');
      });
    }
  }

  // ==========================================
  // 3. INITIALIZATION ON DOM READY
  // ==========================================

  function init() {
    var savedTheme = null;
    try {
      savedTheme = localStorage.getItem(THEME_KEY);
    } catch (e) {}

    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setTheme(isDark ? 'dark' : 'light', false);
    initCookieConsent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose globally
  window.qcToggleTheme = toggleTheme;
  window.qcSetTheme = setTheme;
  window.qcInitCookieConsent = initCookieConsent;
  window.qcLoadAnalytics = loadConsentedAnalytics;
})();
