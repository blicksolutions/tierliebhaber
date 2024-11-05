const adjustHolidayCards = () => {
    const mobileMenuItemsWrapper = document.querySelector('.SidebarMenu__menu');
    const desktopMenuItemsWrapper = document.querySelector('.HorizontalList');

    if(!mobileMenuItemsWrapper) return;
    if(!desktopMenuItemsWrapper) return;

    mobileMenuItemsWrapper.setAttribute('bs-tlh-064', true);
    desktopMenuItemsWrapper.setAttribute('bs-tlh-064', true);
}

window.activateAbTlh064B = () => {
	adjustHolidayCards();
}

window.activateAbTlh064C = () => {
	
}

document.addEventListener("DOMContentLoaded", () => {
	window.activateAbTlh064B();
    window.activateAbTlh064C();
})
