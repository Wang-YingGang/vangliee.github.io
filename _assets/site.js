/* ==========================================================================
   站点交互脚本
   1. 明暗主题切换（跟随系统 + 手动记忆）
   2. 代码块一键复制
   3. 外链新窗口打开
   4. 回到顶部
   依赖 docsify 的插件钩子 (doneEach) 在每次渲染后增强内容。
   ========================================================================== */
(function () {
    'use strict';

    var THEME_KEY = 'notes-theme';
    var THEME_COLOR = { light: '#ffffff', dark: '#14171c' };

    var root = document.documentElement;
    var body = document.body;

    /* ---------- 主题 ---------- */

    function storedTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (e) {
            return null; // 隐私模式下 localStorage 可能不可用
        }
    }

    function currentTheme() {
        return root.dataset.theme === 'dark' ? 'dark' : 'light';
    }

    function applyTheme(theme, persist) {
        root.dataset.theme = theme;

        var meta = document.getElementById('theme-color');
        if (meta) {
            meta.setAttribute('content', THEME_COLOR[theme] || THEME_COLOR.light);
        }

        if (persist) {
            try {
                localStorage.setItem(THEME_KEY, theme);
            } catch (e) {
                /* 忽略写入失败 */
            }
        }

        updateThemeButton();
    }

    function updateThemeButton() {
        var btn = document.querySelector('.theme-toggle');
        if (!btn) return;

        var next = currentTheme() === 'dark' ? '浅色' : '深色';
        var label = '切换到' + next + '模式';
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
    }

    function toggleTheme() {
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
    }

    /* ---------- 代码复制 ---------- */

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }

        // 非 HTTPS / 旧浏览器兜底
        return new Promise(function (resolve, reject) {
            var area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.cssText = 'position:fixed;top:-1000px;opacity:0';
            body.appendChild(area);
            area.select();

            var ok = false;
            try {
                ok = document.execCommand('copy');
            } catch (e) {
                ok = false;
            }
            body.removeChild(area);

            ok ? resolve() : reject(new Error('copy failed'));
        });
    }

    function addCopyButtons() {
        body.querySelectorAll('.markdown-section pre').forEach(function (pre) {
            if (pre.querySelector('.code-copy')) return;

            var code = pre.querySelector('code');
            if (!code) return;

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'code-copy';
            btn.textContent = '复制';

            btn.addEventListener('click', function () {
                copyText(code.textContent).then(function () {
                    flash(btn, '已复制');
                }).catch(function () {
                    flash(btn, '复制失败');
                });
            });

            pre.appendChild(btn);
        });
    }

    function flash(btn, text) {
        window.clearTimeout(btn._timer);
        btn._text = btn._text || btn.textContent;
        btn.textContent = text;
        btn.classList.add('is-done');

        btn._timer = window.setTimeout(function () {
            btn.textContent = btn._text;
            btn.classList.remove('is-done');
        }, 1600);
    }

    /* ---------- 外链 ---------- */

    function markExternalLinks() {
        body.querySelectorAll('.markdown-section a[href]').forEach(function (a) {
            if (a.target === '_blank' || a.href.indexOf('http') !== 0) return;
            if (a.hostname === window.location.hostname) return;

            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        });
    }

    /* ---------- 每次渲染后执行 ---------- */

    function enhanceContent() {
        addCopyButtons();
        markExternalLinks();
    }

    /* ---------- 浮动按钮 ---------- */

    var ICONS = {
        moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
        sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2M12 20.5v2M3.5 12h-2M22.5 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4"/></svg>',
        up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
    };

    function mountTools() {
        if (body.querySelector('.site-tools')) return;

        var tools = document.createElement('div');
        tools.className = 'site-tools';
        tools.innerHTML =
            '<button class="site-tool theme-toggle" type="button">' +
            '<span class="icon-moon">' + ICONS.moon + '</span>' +
            '<span class="icon-sun">' + ICONS.sun + '</span>' +
            '</button>' +
            '<button class="site-tool back-to-top" type="button" aria-label="回到顶部" title="回到顶部">' +
            ICONS.up +
            '</button>';

        body.appendChild(tools);

        tools.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

        var top = tools.querySelector('.back-to-top');
        top.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        updateThemeButton();
    }

    function trackScroll() {
        var btn = body.querySelector('.back-to-top');
        if (!btn) return;

        var ticking = false;

        function update() {
            btn.classList.toggle('is-visible', window.scrollY > 320);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        }, { passive: true });

        update();
    }

    /* ---------- 启动 ---------- */

    // 必须在 docsify init 之前注册插件钩子，本脚本是同步加载的，时机刚好
    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
        hook.doneEach(function () {
            enhanceContent();
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        mountTools();
        trackScroll();
        applyTheme(currentTheme(), false);

        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var followSystem = function (e) {
            if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light', false);
        };

        if (mq.addEventListener) {
            mq.addEventListener('change', followSystem);
        } else if (mq.addListener) {
            mq.addListener(followSystem); // Safari < 14
        }

        // 兜底：万一插件钩子没触发，首屏也应具备复制按钮
        window.setTimeout(enhanceContent, 600);
    });
})();
