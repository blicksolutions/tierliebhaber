window.activateAbTlh069 = () => {
	const announcementBar = document.querySelector('#shopify-section-announcement')
	console.log('announcementBar', announcementBar)
	if (!announcementBar) return

	announcementBar.setAttribute('data-js-tlh-069', 'true')

};

document.addEventListener('DOMContentLoaded', window.activateAbTlh069)
