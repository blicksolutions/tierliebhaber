window.activateAbTlh010 = () => {
    const megamenuElement = document.querySelector('.Header__MainNav');
    if (!megamenuElement) return;

    megamenuElement.setAttribute('data-js-tlh-010', true);
};
