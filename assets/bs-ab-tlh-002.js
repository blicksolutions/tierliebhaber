window.activateAbTlh002 = () => {
    const stickyATC = document.querySelector('[tlh-002]');
    const atcButton = document.querySelector('[data-js-atc-button]');
    const stickyAtcClickEvent = new Event('click_on_sticky_atc')
    console.log("tlh002 activated")

    window.addEventListener('scroll', () => {
        if (!atcButton) return;
        const atcButtonPosition = atcButton.getBoundingClientRect();

        if (atcButtonPosition.top < 0) {
            stickyATC.classList.add('active');

            if (window.innerWidth <= 768) {
                // Hiding other app overlays
                const superchatWidget = document.querySelector('#superchat-widget')
                const smileUiContainer = document.querySelector('#smile-ui-lite-container')
    
                superchatWidget.style.display = 'none'
                smileUiContainer.style.display = 'none'
            }
        }

        if (atcButtonPosition.top > 0) {
            stickyATC.classList.remove('active');

            if (window.innerWidth <= 768) {
                // Showing other app overlays
                const superchatWidget = document.querySelector('#superchat-widget')
                const smileUiContainer = document.querySelector('#smile-ui-lite-container')
    
                superchatWidget.style.display = 'block'
                smileUiContainer.style.display = 'block'
            }
        }
    });

    if (stickyATC) {
        stickyATC.addEventListener('click', () => {
            stickyATC.dispatchEvent(stickyAtcClickEvent)

            gtag('event', 'bs_click_sticky_atc', {
                'bs_click_sticky_atc': '1'
            });
        });

    }
}
