/* ==========================================================================
   nav.js — 导航交互
   · 移动端汉堡菜单开关（aria-expanded / Escape / 点击外部关闭 / 锁定滚动）
   · 当前页高亮（比较规范化后的路径，兼容 file:// 与静态服务器）
   · 首页 scroll-spy：滚动到某个分区时点亮对应的导航项
   · 滚动超过 24px 后给吸顶导航加半透明底、模糊与细线
   全部为渐进增强：任一环节失败都只是少了效果，链接依旧可点。
   ========================================================================== */
(function () {
  'use strict';

  var header = document.querySelector('[data-site-header]');
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-site-nav]');
  var MOBILE_QUERY = '(max-width: 768px)';
  var SCROLL_THRESHOLD = 24;           /* 滚动多少像素后浮出底边 */
  var CURRENT_SECTION_CLASS = 'is-current-section';

  function navLinks() {
    return document.querySelectorAll('[data-site-nav] a[href]');
  }

  /* ---------- 1. 当前页高亮 ---------- */
  function normalizePath(pathname) {
    var path = String(pathname || '').replace(/\\/g, '/');
    path = path.replace(/index\.html?$/i, '');
    if (path.length > 1 && path.charAt(path.length - 1) !== '/') {
      path += '/';
    }
    return path.toLowerCase();
  }

  function sameOriginLink(link) {
    var url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (error) {
      return null;
    }
    if (url.protocol !== window.location.protocol || url.host !== window.location.host) {
      return null; /* 站外链接不参与任何高亮 */
    }
    return url;
  }

  function highlightCurrentPage() {
    var here = normalizePath(window.location.pathname);
    var links = navLinks();
    for (var i = 0; i < links.length; i += 1) {
      var link = links[i];
      var raw = link.getAttribute('href') || '';
      if (raw.charAt(0) === '#') {
        continue; /* 纯锚点交给 scroll-spy，不标当前页 */
      }
      var url = sameOriginLink(link);
      if (!url || url.hash) {
        continue; /* 同页锚点（如 index.html#about）不标为当前页 */
      }
      if (normalizePath(url.pathname) !== here) {
        continue;
      }
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  }

  /* ---------- 2. 首页 scroll-spy ----------
     只处理「指向本页锚点」的导航项：从 href 自动推导，不依赖额外标记。
     子页面导航里没有同页锚点 → 一个都匹配不上 → 静默退出，不会误高亮。 */
  function initScrollSpy() {
    if (typeof window.IntersectionObserver !== 'function') {
      return; /* 不支持就降级：本来就没加过高亮，不留残留 */
    }

    var here = normalizePath(window.location.pathname);
    var links = navLinks();
    var pairs = [];

    for (var i = 0; i < links.length; i += 1) {
      var link = links[i];
      var raw = link.getAttribute('href') || '';
      var url;
      if (raw.charAt(0) === '#') {
        try {
          url = new URL(link.href, window.location.href);
        } catch (error) {
          continue;
        }
      } else {
        url = sameOriginLink(link);
      }
      if (!url || !url.hash) {
        continue;
      }
      if (normalizePath(url.pathname) !== here) {
        continue; /* 指向别的页面：不参与本页 scroll-spy */
      }
      var id = decodeURIComponent(url.hash.slice(1));
      var section = id ? document.getElementById(id) : null;
      if (!section) {
        continue; /* 锚点元素不存在：跳过，绝不报错 */
      }
      pairs.push({ link: link, section: section });
    }

    if (!pairs.length) {
      return; /* 非首页（或没有同页锚点）：什么都不做 */
    }

    var visible = {};
    var current = null;

    function setCurrent(pair) {
      if (current === pair) {
        return;
      }
      for (var i = 0; i < pairs.length; i += 1) {
        pairs[i].link.classList.remove(CURRENT_SECTION_CLASS);
        if (pairs[i].link.getAttribute('aria-current') === 'true') {
          pairs[i].link.removeAttribute('aria-current');
        }
      }
      current = pair;
      if (pair) {
        pair.link.classList.add(CURRENT_SECTION_CLASS);
        pair.link.setAttribute('aria-current', 'true'); /* 与「当前页」的 page 区分 */
      }
    }

    /* rootMargin 收成视口 30%~45% 的一条窄带：同一时刻基本只会命中一个分区 */
    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i += 1) {
        visible[entries[i].target.id] = entries[i].isIntersecting;
      }
      var picked = null;
      for (var j = 0; j < pairs.length; j += 1) {
        if (visible[pairs[j].section.id]) {
          picked = pairs[j];
          break;
        }
      }
      setCurrent(picked); /* 全部离开窄带时 picked 为 null → 清空高亮 */
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

    for (var k = 0; k < pairs.length; k += 1) {
      observer.observe(pairs[k].section);
    }
  }

  /* ---------- 3. 移动端菜单 ---------- */
  function isMobile() {
    return typeof window.matchMedia === 'function'
      ? window.matchMedia(MOBILE_QUERY).matches
      : window.innerWidth <= 768;
  }

  function setMenuOpen(open) {
    if (!header || !toggle) {
      return;
    }
    header.classList.toggle('is-nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    /* 展开时锁定页面滚动；关闭/变宽/导航跳转都会走到这里恢复 */
    if (document.body) {
      document.body.classList.toggle('nav-open', open);
    }
  }

  function isMenuOpen() {
    return Boolean(header && header.classList.contains('is-nav-open'));
  }

  function initMenu() {
    if (!header || !toggle || !nav) {
      return;
    }

    toggle.addEventListener('click', function () {
      setMenuOpen(!isMenuOpen());
    });

    /* 点击菜单里的链接后收起 */
    nav.addEventListener('click', function (event) {
      var target = event.target;
      if (target && target.closest && target.closest('a') && isMobile()) {
        setMenuOpen(false);
      }
    });

    /* 点击菜单/按钮以外的区域收起 */
    document.addEventListener('click', function (event) {
      if (!isMenuOpen()) {
        return;
      }
      var target = event.target;
      if (target && header.contains(target)) {
        return;
      }
      setMenuOpen(false);
    });

    /* Escape 收起并把焦点还给按钮 */
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isMenuOpen()) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    /* 视口变宽时重置状态，避免桌面端残留展开样式与滚动锁 */
    if (typeof window.matchMedia === 'function') {
      var query = window.matchMedia(MOBILE_QUERY);
      var onChange = function (event) {
        if (!event.matches) {
          setMenuOpen(false);
        }
      };
      if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', onChange);
      } else if (typeof query.addListener === 'function') {
        query.addListener(onChange);
      }
    }
  }

  /* ---------- 4. 滚动状态 ---------- */
  function initScrollShadow() {
    if (!header) {
      return;
    }
    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
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
  }

  try {
    highlightCurrentPage();
    initScrollSpy();
    initMenu();
    initScrollShadow();
  } catch (error) {
    /* 导航交互失败不影响阅读：所有链接仍是普通的 <a> */
  }
})();
