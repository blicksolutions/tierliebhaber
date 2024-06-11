window.activateAbTlh020 = () => {
    const payLaterSnippet = document.querySelector('[data-pp-message]');

    if (payLaterSnippet != undefined) {
        // payLaterSnippet.setAttribute('ab-test-active', 'true');

        const mutationObserver = new MutationObserver((entries) => {
            entries.forEach((entry) => {
                const newPrice = parseFloat(document.querySelector('.ProductMeta__PriceList .ProductMeta__Price').textContent.replace('€', '').replace(',', '.'));
                payLaterSnippet.dataset.ppAmount = newPrice;
            });
        });

        const priceMutationEl = document.querySelector('.ProductMeta__PriceList');

        if (priceMutationEl != undefined) {
            mutationObserver.observe(priceMutationEl, {
                childList: true,
                subtree: true
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', window.activateAbTlh020);
