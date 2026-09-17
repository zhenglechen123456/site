/* ==========================================================================
   theme.js — 深/浅色主题切换
   · 首次访问跟随系统 prefers-color-scheme
   · 手动切换后写入 localStorage 记住选择
   · 所有逻辑包裹在 try/catch 中，失败也只是没有切换按钮，不会影响页面
   ========================================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  var root = document.documentElement;
  var media = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  function readStoredTheme() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* 隐私模式下可能写入失败，忽略即可 */
    }
  }

  function systemTheme() {
    return media && media.matches ? 'dark' : 'light';
  }

  function currentTheme() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') {
      return attr;
    }
    return systemTheme();
  }

  function syncToggleButtons(theme) {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    var isDark = theme === 'dark';
    for (var i = 0; i < buttons.length; i += 1) {
      var button = buttons[i];
      button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      button.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
      button.setAttribute('title', isDark ? '切换到浅色模式' : '切换到深色模式');
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    syncToggleButtons(theme);
  }

  function initToggle() {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        storeTheme(next);
        applyTheme(next);
      });
    }
    syncToggleButtons(currentTheme());
  }

  /* 用户没有手动选择过时，跟随系统变化实时更新 */
  function watchSystem() {
    if (!media) {
      return;
    }
    var onChange = function () {
      if (!readStoredTheme()) {
        applyTheme(systemTheme());
      }
    };
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange);
    } else if (typeof media.addListener === 'function') {
      media.addListener(onChange);
    }
  }

  try {
    /* 首屏的 data-theme 已由 <head> 里的内联脚本设置，这里只做按钮同步 */
    applyTheme(currentTheme());
    initToggle();
    watchSystem();
  } catch (error) {
    /* 静默降级：页面按系统主题正常显示 */
  }
})();
