let initAppToasts = () => {};
(function() {
    const scriptLocation = document.currentScript.src;
    const pageName = (new URL(document.currentScript.baseURI)).pathname.replace(/\//g, '');
    function getAppDir() {
        return scriptLocation.substring(0, scriptLocation.lastIndexOf("/") + 1);
    }
    function initColorMode(appToasts, options) {
        const setMode = (isDark) => appToasts.attr('data-bs-theme', isDark ? 'dark' : 'light');
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
    function initAppToastsFunc(appName, options) {
        const format = (str, ...args) =>
            str.replace(/\{(\d+)\}/g, function (_, n) { return args[n]; });
        const callerNode = document.currentScript;
        const appDir = getAppDir();
        return $.ajax(appDir + 'app-toasts.html.in').done((appToastCode) => {
            const appToasts = $(format(appToastCode, appName));
            initColorMode(appToasts, options);
            appToasts.insertAfter(callerNode);

            // Wait a bit before doing toasts
            setTimeout(() => {
                androidAppToast();
                androidAppUpdateToast();
            }, 5000);
        });
    }
    initAppToasts = initAppToastsFunc;

    /** Shows a toast to Android users that don't use the app that it is available. */
    function androidAppToast()
    {
        // Don't show if:
        if (
            // Already shown the ad
            localStorage.getItem(`${pageName}-shownAndroidAd`) ||
            // Not running on Android
            !navigator.userAgent.includes('Android') ||
            // Running within the Android application
            navigator.userAgent.includes('huroutes') ||
            // Running within PWA application
            navigator.standalone === true ||
            window.matchMedia('(display-mode: standalone)').matches)
            return;

        let androidToast = $('#toast-android-app');
        androidToast.toast('show');
        // The toast is not shown again once closed.
        androidToast.on('hide.bs.toast', () =>
            localStorage.setItem(`${pageName}-shownAndroidAd`, true));
        androidToast.find('a[href]').on('click', () => androidToast.toast('hide'));
    }

    /** Shows a toast for Android app users when an updated version is available. */
    function androidAppUpdateToast()
    {
        if (!navigator.userAgent.includes('huroutes'))
            return;

        const ghRelease = 'https://api.github.com/repos/Sp3EdeR/huroutes-android/releases/latest';
        $.getJSON(ghRelease, data => {
            try
            {
                const url = data.assets[0].browser_download_url;
                const ver = data.tag_name.slice(1);
                const appVer = navigator.userAgent.match(/\bhuroutes\/(\d+(?:\.\d+)*)\b/)[1];
                if (ver.localeCompare(appVer, undefined, { numeric: true, sensitivity: 'base' }) == 1)
                {
                    let androidToast = $('#toast-app-update');
                    androidToast.find('a[href]').attr('href', url);
                    androidToast.toast('show');
                }
            }
            catch
            {
                console.error('Invalid GitHub release JSON.');
            }
        });
    }
})();
