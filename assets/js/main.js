/* ==========================================================================
   main.js — 页面级渐进增强
   · 滚动入场动画（IntersectionObserver，尊重 prefers-reduced-motion）
   · 回到顶部按钮
   · 页脚年份自动填充
   所有能力都会先检测再使用，任一失败都不影响页面内容显示。
   ========================================================================== */
(function () {
  'use strict';

  function prefersReducedMotion() {
    return typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------- 1. 页脚年份 ---------- */
  function initYear() {
    var nodes = document.querySelectorAll('[data-year]');
    var year = String(new Date().getFullYear());
    for (var i = 0; i < nodes.length; i += 1) {
      nodes[i].textContent = year;
    }
  }

  /* ---------- 2. 滚动入场动画 ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) {
      return;
    }

    function showAll() {
      for (var i = 0; i < items.length; i += 1) {
        items[i].classList.add('is-visible');
      }
    }

    if (prefersReducedMotion() || typeof window.IntersectionObserver !== 'function') {
      showAll();
      return;
    }

    var revealed = 0;
    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i += 1) {
        var entry = entries[i];
        if (!entry.isIntersecting) {
          continue;
        }
        entry.target.classList.add('is-visible');
        revealed += 1;
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    for (var i = 0; i < items.length; i += 1) {
      observer.observe(items[i]);
    }

    /* 兜底：若 1.5 秒内一个元素都没显现，说明观察器没起作用，直接全部显示 */
    window.setTimeout(function () {
      if (revealed === 0) {
        showAll();
      }
    }, 1500);
  }

  /* ---------- 3. 回到顶部 ---------- */
  function initToTop() {
    var button = document.querySelector('[data-to-top]');
    if (!button) {
      return;
    }

    var ticking = false;

    function update() {
      button.classList.toggle('is-visible', window.scrollY > 480);
      ticking = false;
    }

    update();
    window.addEventListener('scroll', function () {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    button.addEventListener('click', function () {
      try {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
      } catch (error) {
        window.scrollTo(0, 0);
      }
    });
  }

  function init() {
    try {
      initYear();
    } catch (error) {
      /* 年份没填上也无所谓 */
    }
    try {
      initReveal();
    } catch (error) {
      /* 动画失败：内容本来就可见，直接跳过 */
    }
    try {
      initToTop();
    } catch (error) {
      /* 没有回到顶部按钮也能用 */
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
