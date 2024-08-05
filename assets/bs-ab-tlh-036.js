window.activateAbTlh036 = (variant) => {
	console.log('activateAbTlh036');
	const body = document.querySelector('body');

	if (body.classList.contains('template-index')) {
		const searchElement = document.querySelector('#Search');
		if (!searchElement) return;

		const searchInputElement = searchElement.querySelector('.Search__Form input.Search__Input.Heading');

		searchElement.setAttribute('data-js-tlh-036', variant);

		const searchQuickLinksElement = searchElement.querySelector(`[data-js-search-quick-links="${variant}"]`);
		const searchQuickLinksMobileElement = searchQuickLinksElement.querySelector('[data-js-search-quick-links-mobile]');

		const swiper = new Swiper(searchQuickLinksMobileElement, {
			direction: 'horizontal',
			slidesPerView: 'auto',
			spaceBetween: 10,
			slidesOffsetAfter: 10,
			slidesOffsetBefore: 10,
			scrollbar: {
				dragSize: 107,
				el: '.quick-links__scrollbar.swiper-scrollbar',
			},
		});

		document.addEventListener('click', () => {
			if (document.activeElement == searchInputElement) {
				searchElement.classList.add('active');
				searchQuickLinksElement.classList.add('active');
			} else {
				searchElement.classList.remove('active');
				searchQuickLinksElement.classList.remove('active');
			}
		});

		searchInputElement.addEventListener('change', () => {
			console.log('searchInputElement.value', searchInputElement.value);
			if (searchInputElement.value != '') {
				searchQuickLinksElement.classList.add('hidden');
				searchQuickLinksElement.classList.remove('active');
			} else {
				searchQuickLinksElement.classList.remove('hidden');
				searchQuickLinksElement.classList.remove('active');
			}
		});
	}
};

document.addEventListener('DOMContentLoaded', () => {
	const queryString = window.location.search;
	const urlParameters = new URLSearchParams(queryString);
	const variant = urlParameters.get('test-variant');
	if (!variant) return;
	activateAbTlh036(variant);
});
