window.addEventListener('load', function () {
    const bundleSection = document.querySelector('#rbr-container-element-false');
    const bundles = bundleSection.querySelectorAll('.rbr-page-container');
    const buyInBundleButtons = document.querySelectorAll('.rbr-addBundleBtn-container');

    if (bundleSection) {
        const section = bundleSection.closest('.shopify-section');
        bundleSection.remove();
        section.appendChild(bundleSection);
    }

    if (bundles) {
        bundles.forEach((bundle) => {
            const title = bundle.querySelector('.rbr-standard-bundle__title');
            const totalbox = bundle.querySelector('.rbr-total-box');
            const atcButton = bundle.querySelector('.rbr-addBundleBtn-container');
            const totalText = bundle.querySelector('.rbr-total-box-text');
            const wrapperDiv = document.createElement('div');

            wrapperDiv.classList.add('rbr__atc__wrapper')
            bundle.append(wrapperDiv);

            if (title.innerHTML !== '') {
                title.remove();
                wrapperDiv.append(title);
            }

            totalText.remove();
            totalbox.remove();
            atcButton.remove();
            wrapperDiv.append(totalbox, atcButton);
        });

        bundleSection.style.display = 'block';
    }

    if (buyInBundleButtons) {
        buyInBundleButtons.forEach((button) => {
            button.addEventListener('click', () => {
                window.location = '/cart';
            });
        });
    }
}, false);
