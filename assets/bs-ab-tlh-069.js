window.activateAbTlh069 = () => {
	const announcementBar = document.querySelector('#shopify-section-announcement')
	if (!announcementBar) return

	announcementBar.setAttribute('data-js-tlh-069', 'true')

};

document.addEventListener('DOMContentLoaded', window.activateAbTlh069)
