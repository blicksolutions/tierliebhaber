(()=>{
    const stickyATC = document.querySelector('[data-js-sticky-atc]');
    console.log('stickyATC', stickyATC)
    const atcButton = document.querySelector('[data-js-atc-button]');

    window.addEventListener('scroll', () => {
        if (!atcButton || !stickyATC) return;
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
})()