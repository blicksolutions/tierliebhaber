const adjustHolidayCards = () => {
    const mobileMenuItemsWrapper = document.querySelector('.SidebarMenu__menu');
    const desktopMenuItemsWrapper = document.querySelector('.HorizontalList');

    if(!mobileMenuItemsWrapper) return;
    if(!desktopMenuItemsWrapper) return;

    mobileMenuItemsWrapper.setAttribute('data-ab-tlh-064', true);
    desktopMenuItemsWrapper.setAttribute('data-ab-tlh-064', true);
}

const content = (linkUrl, imgUrl, title) => { 
    return `<a class="bestseller__link"  href="${linkUrl}"><img class="bestseller__image" src="${imgUrl}" alt="${title}">${title}</a>`;
};

window.activateAbTlh064B = () => {
	adjustHolidayCards();
}

window.activateAbTlh064C = () => {
	
}

document.addEventListener("DOMContentLoaded", () => {
	window.activateAbTlh064B();
    window.activateAbTlh064C();
})
