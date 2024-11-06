const adjustHolidayCards = () => {
    const mobileMenuItemsWrapper = document.querySelector('.SidebarMenu__menu');
    const desktopMenuItemsWrapper = document.querySelector('.HorizontalList');

    if(!mobileMenuItemsWrapper) return;
    if(!desktopMenuItemsWrapper) return;

    mobileMenuItemsWrapper.setAttribute('data-ab-tlh-064', true);
    desktopMenuItemsWrapper.setAttribute('data-ab-tlh-064', true);
}

const replaceBestsellerLinkAttributes = (target, linkUrl, imgUrl, title) => {
    if(target) {
        target.setAttribute('href', linkUrl);
        target.setAttribute('data-ab-tlh-064', true);
        target.classList.remove('bestseller__link--highlight');
        target.innerHTML = `<img class="bestseller__image" src="${imgUrl}" alt="${title}"><span>${title}</span>`
    }
};

window.activateAbTlh064B = () => {
	// adjustHolidayCards();
}

window.activateAbTlh064C = () => {
    const zSnackTarget = document.querySelector('.bestseller__link:has(.bestseller__image[alt="Z-Snack"])');
    const darmwohlTarget = document.querySelector('.bestseller__link:has(.bestseller__image[alt="Darmwohl Sticks"])');
    const grasKotfresserTarget = document.querySelector('.bestseller__link:has(.bestseller__image[alt="Gras- & Kotfresser Drops"])');
    const darmpflegeTarget = document.querySelector('.bestseller__link:has(.bestseller__image[alt="Darmpflege Drops"])');
    const bestsellerTitle = document.querySelector('.bestseller__title'); 

    replaceBestsellerLinkAttributes(zSnackTarget, 'https://tierliebhaber.de/collections/z-produkte/products/z-bundle-zb', 'https://tierliebhaber.de/cdn/shop/files/bundle1_9e3d58a5-cd0d-483a-9773-b3f03634ebcb_1200x.jpg?v=1716366913', 'Z Bundle');
    replaceBestsellerLinkAttributes(darmwohlTarget, 'https://tierliebhaber.de/collections/zahnpflege/products/zahnpflege-bundle', 'https://tierliebhaber.de/cdn/shop/files/20240705_Tierliebhaber2448_1200x.jpg?v=1724063840', 'Zahnpflege');
    replaceBestsellerLinkAttributes(grasKotfresserTarget, 'https://tierliebhaber.de/collections/darmpflege/products/sodbrennen-bundle', 'https://tierliebhaber.de/cdn/shop/files/SodbrennenBundle_1000x.jpg?v=1713261808', 'Sodbrennen');
    replaceBestsellerLinkAttributes(darmpflegeTarget, 'https://tierliebhaber.de/collections/darmpflege/products/analdrusen-bundle', 'https://tierliebhaber.de/cdn/shop/files/analdruesen_bundle_gzg_1000x.jpg?v=1717012761', 'Analdrüsen');

	adjustHolidayCards();
    bestsellerTitle.innerHTML = 'Bundles & Bestseller';
}

document.addEventListener("DOMContentLoaded", () => {
	window.activateAbTlh064B();
    window.activateAbTlh064C();
})
