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
            menu.insertAfter(callerNode);
        });
    }
    initMenu = initMenuFunc;
})();