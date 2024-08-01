window.activateAbTlh042 = () => {
	const pagecontainerElement = document.querySelector('.PageContainer');
	const headerElement = document.querySelector('#shopify-section-header');
	pagecontainerElement.setAttribute('data-js-tlh-042', 'true');
	headerElement.setAttribute('style', 'top: 0 !important;');
};
document.addEventListener('DOMContentLoaded', window.activateAbTlh042);
