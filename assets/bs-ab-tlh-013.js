window.activateAbTlh013 = () => {
    console.log('TLH-013 start')
    const atcButton = document.querySelector('[data-js-atc-button]');
    if (atcButton.getAttribute('disabled') == 'disabled') return

    const stickyAtcContainer = document.querySelector('[data-js-sticky-atc-container]');
    if (!stickyAtcContainer) return

    const stickyAtcButton = document.querySelector('[data-js-sticky-atc-button]');
    const stickyVariantSelector = document.querySelector('[data-js-sticky-atc-variant-selector]');
    const stickyVariantSelectorList = document.querySelector('[data-js-sticky-atc-variant-selector-list]');
    const stickyVariantSelectorItems = stickyVariantSelectorList.querySelectorAll('[data-js-sticky-atc-variant-selector-item]');
    const variantSelectorItems = document.querySelectorAll('.SizeSwatchList .HorizontalList__Item .SizeSwatch__Radio[name]');
    const pageOverlay = document.querySelector('[data-js-sticky-atc-overlay]');

    const closeStickyAtcModal = () => {
        stickyVariantSelector.classList.remove('open');
        pageOverlay.classList.remove('is-visible');
        pageOverlay.removeEventListener('click', closeStickyAtcModal);
    };

    const openStickyAtcModal = () => {
        stickyVariantSelector.classList.add('open');
        pageOverlay.classList.add('is-visible');
        pageOverlay.addEventListener('click', closeStickyAtcModal);
    };

    const clickOnVariant = (selectedOptionName) => {
        // Manage selected option in sticky atc
        stickyVariantSelectorItems.forEach((item) => {
            const optionName = item.getAttribute('data-js-option-value');

            if (optionName === selectedOptionName) {
                item.classList.add('VariantSelector__ListItem--selected');
            } else {
                item.classList.remove('VariantSelector__ListItem--selected');
            };
        });

        variantSelectorItems.forEach((item) => {
            const optionName = item.getAttribute('value');

            if (optionName === selectedOptionName) {
                item.click();
                atcButton.click();
                closeStickyAtcModal();
            };
        });
    };

    if (variantSelectorItems.length > 1) {

        variantSelectorItems.forEach((item) => {
            item.addEventListener('click', () => {
                const selectedOptionName = item.getAttribute('value');
                console.log('selectedOptionName', selectedOptionName)
    
                stickyVariantSelectorItems.forEach((item) => {
                    const optionName = item.getAttribute('data-js-option-value');
        
                    if (optionName === selectedOptionName) {
                        item.classList.add('VariantSelector__ListItem--selected');
                    } else {
                        item.classList.remove('VariantSelector__ListItem--selected');
                    };
                });
            });
        });
    

        stickyVariantSelectorItems.forEach((item) => {
            item.addEventListener('click', () => {
                clickOnVariant(item.getAttribute('data-js-option-value'));
            });
        });

        stickyAtcButton.addEventListener('click', openStickyAtcModal);
    } else {
        stickyAtcButton.addEventListener('click', () => {
            atcButton.click()
        })
    }


    window.addEventListener('scroll', () => {
        if (!atcButton || !stickyAtcContainer) return;
        const atcButtonPosition = atcButton.getBoundingClientRect();

        if (atcButtonPosition.top < 0) {
            stickyAtcContainer.classList.add('active');

            // Hiding other app overlays
            const superchatWidget = document.querySelector('#superchat-widget');
            const smileUiContainer = document.querySelector('#smile-ui-lite-container');

            superchatWidget.style.display = 'none';
            smileUiContainer.style.display = 'none';
        }

        if (atcButtonPosition.top > 0) {
            stickyAtcContainer.classList.remove('active');

            // Showing other app overlays
            const superchatWidget = document.querySelector('#superchat-widget');
            const smileUiContainer = document.querySelector('#smile-ui-lite-container');

            superchatWidget.style.display = 'block';
            smileUiContainer.style.display = 'block';
        };
    });
    
    if (stickyAtcButton) {
        stickyAtcButton.addEventListener('click', () => {

            gtag('event', 'bs_click_sticky_atc', {
                'bs_click_sticky_atc': '1'
            });
        });

    }
};
