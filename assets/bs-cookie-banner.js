const getCookie = (name) => {
    let documentCookies = document.cookie;
    let prefix = name + '=';
    let begin = documentCookies.indexOf('; ' + prefix);
    let end;

    if (begin == -1) {
        begin = documentCookies.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
        end = document.cookie.indexOf(';', begin);
        if (end == -1) {
            end = documentCookies.length;
        }
    }
    return decodeURI(documentCookies.substring(begin + prefix.length, end));
};

const displayBanner = (banner) => {
    const checkCookie = getCookie('cookies');

    if (!checkCookie) {
        banner.classList.remove('cookie-banner--hidden');
    }
};

const openModal = (modal, overlay, htmlElement, banner) => {
    if (modal.classList.contains('cookie-banner__modal--hidden')) {
        banner.classList.add('cookie-banner--hidden');

        modal.classList.remove('cookie-banner__modal--hidden');
        htmlElement.classList.add('no-scroll');
        overlay.classList.add('is-visible');
    }
};

const closeModal = (modal, overlay, htmlElement, banner) => {
    if (!modal.classList.contains('cookie-banner__modal--hidden')) {
        modal.classList.add('cookie-banner__modal--hidden');
        htmlElement.classList.remove('no-scroll');
        overlay.classList.remove('is-visible');

        displayBanner(banner);
    }
};

const setCookie = () => {
    document.cookie = 'cookies=interacted';
};

(() => {
    //prevent overlap with smile ui elements
    const waitForSmileUi = new MutationObserver((mutationRecords, observer) => {
        Array.from(document.querySelectorAll('#smile-ui-lite-container')).forEach((element) => {
            element.style.zIndex = '10000';
            observer.disconnect();
        });
    }).observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    const cookieBannerSection = document.querySelector('.cookie-banner.cookie-banner--hidden');
    const cookieBanner = document.querySelector('[data-js-cookie-banner]');
    const cookieModal = document.querySelector('[data-js-cookie-modal]');
    const cookieBannerSettingsButton = document.querySelector('[data-js-cookie-banner-settings-button]');
    const cookieBannerAcceptAllButton = document.querySelector('[data-js-cookie-banner-accept-all-button]');
    const modalSaveButton = document.querySelector('[data-js-cookie-modal-save-button]');
    const modalAcceptAllButton = document.querySelector('[data-js-cookie-modal-accept-all-button]');
    const closeButton = document.querySelector('[data-js-cookie-modal-close-button]');
    const htmlElement = document.querySelector('html');
    const pageOverlay = document.querySelector('.PageOverlay');

    displayBanner(cookieBannerSection);

    cookieBannerSettingsButton.addEventListener('click', () => {
        openModal(cookieModal, pageOverlay, htmlElement, cookieBanner);
    });

    [pageOverlay, closeButton].forEach((element) => {
        element.addEventListener('click', () => {
            closeModal(cookieModal, pageOverlay, htmlElement, cookieBanner);
        });
    });

    cookieBannerAcceptAllButton.addEventListener('click', () => {
        setCookie();
        closeModal(cookieModal, pageOverlay, htmlElement, cookieBanner);
        cookieBannerSection.classList.add('cookie-banner--hidden');
    });
    modalSaveButton.addEventListener('click', () => {
        setCookie();
        closeModal(cookieModal, pageOverlay, htmlElement, cookieBanner);
    });
    modalAcceptAllButton.addEventListener('click', () => {
        setCookie();
        closeModal(cookieModal, pageOverlay, htmlElement, cookieBanner);
    });
})();
