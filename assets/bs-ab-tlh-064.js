const adjustHolidayCards = () => {
    const cardWrapper = document.querySelector('.SidebarMenu__menu');

    if(!cardWrapper) return;

    cardWrapper.setAttribute('bs-tlh-064', true);
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
