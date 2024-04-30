window.activateAbTlh010 = () => {
    const megamenuElement = document.querySelector('.Header__MainNav');
    if (!megamenuElement) return;

    megamenuElement.setAttribute('data-js-tlh-010', true);

    const targetElements = megamenuElement.querySelectorAll('.ProductItem, .collection-dropdown__link');

    targetElements.forEach((targetElement) => {
        targetElement.addEventListener('click',() => {
            gtag('event', 'bs_megamenu_collection_clickrate', {
                'bs_megamenu_collection_clickrate': '1'
            });
        });
    });
};
