let initMenu = () => {};
(function() {
    if (navigator.userAgent.includes('huroutes'))
        return;
    const scriptLocation = document.currentScript.src;
    function getMenuDir() {
        return scriptLocation.substring(0, scriptLocation.lastIndexOf("/") + 1);
    }
    function initColorMode(menu, options) {
        const setMode = (isDark) => menu.attr('data-bs-theme', isDark ? 'dark' : 'light');
        const mode = options?.colorMode || 'auto';
        if (mode === 'manual')
            return;

        const media = window.matchMedia?.('(prefers-color-scheme: dark)');
        const isDark = mode === 'dark' || (mode === 'auto' && !!media?.matches);
        setMode(isDark);

        if (mode === 'auto' && media) {
            const onChange = (event) => setMode(event.matches);
            media.addEventListener
                ? media.addEventListener('change', onChange)
                : media.addListener(onChange);
        }
    }
    function initTooltip(elements) {
        elements.each((_, elem) => {
            const inst = bootstrap.Tooltip.getOrCreateInstance(elem, {
                boundary: 'viewport',
                placement: 'bottom'
            });
            const autoHideEvents = [
                'pointerdown', 'pointerup', 'pointercancel', 'mousedown', 'mouseup', 'contextmenu',
                'wheel', 'keydown', 'keyup', 'touchstart', 'touchend', 'touchcancel', 'scroll',
                'focusin', 'input'
            ];
            let autoHideBound = false;

            const autoHideListener = (e) => {
                if (elem.contains(e.target))
                    return;
                inst.hide();
            };

            const bindAutoHide = () => {
                if (autoHideBound)
                    return;
                autoHideEvents.forEach(type => document.addEventListener(type, autoHideListener, true));
                autoHideBound = true;
            };

            const unbindAutoHide = () => {
                if (!autoHideBound)
                    return;
                autoHideEvents.forEach(type => document.removeEventListener(type, autoHideListener, true));
                autoHideBound = false;
            };

            elem.addEventListener('shown.bs.tooltip', bindAutoHide);
            elem.addEventListener('hide.bs.tooltip', unbindAutoHide);
            elem.addEventListener('hidden.bs.tooltip', unbindAutoHide);
        });
    }
    function initMenuFunc(activeTabId, extraMenuItems, options) {
        const format = (str, ...args) =>
            str.replace(/\{(\d+)\}/g, function (_, n) { return args[n]; });
        const callerNode = document.currentScript;
        const menuDir = getMenuDir();
        return $.ajax(menuDir + 'menu.html.in').then((menuCode) => {
            const menu = $(format(menuCode, menuDir));
            if (extraMenuItems)
                menu.find('.offcanvas-body').append(extraMenuItems);
            menu.find('#' + activeTabId).addClass('active').removeAttr('href');
            initColorMode(menu, options);
            initTooltip(menu.find('[title]'));
            menu.insertAfter(callerNode);
        });
    }
    initMenu = initMenuFunc;
})();