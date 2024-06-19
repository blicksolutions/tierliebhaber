window.activateAbTlh008 = () => {
	const pageContainer = document.querySelector('.PageContainer');
	console.log('pageContainer', pageContainer);

	pageContainer.setAttribute('data-js-tlh-008', 'true');
};

document.addEventListener('DOMContentLoaded', () => {
	window.activateAbTlh008();
});
