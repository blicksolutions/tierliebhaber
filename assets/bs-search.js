document.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body');

	if (body.classList.contains('template-index')) {
		const header = document.querySelector('#shopify-section-header');
		if (!header) return;

		const search = header.querySelector('#Search');
		if (!search) return;

		if (window.innerWidth <= 641) {
			search.setAttribute('aria-hidden', 'false');
		}

		window.addEventListener('resize', () => {
			if (window.innerWidth <= 641) {
				search.setAttribute('aria-hidden', 'false');
			} else {
				search.setAttribute('aria-hidden', 'true');
			}
		});

		const searchInput = header.querySelector('#Search .Search__Input');
		if (!searchInput) return;

		searchInput.setAttribute('placeholder', 'Was suchst du?');

		const searchCloseButton = header.querySelector('.Search__Close');
		if (!searchCloseButton) return;

		searchCloseButton.addEventListener('click', () => {
			if (window.innerWidth <= 641 && searchInput.value != '') {
				searchInput.value = '';

				const searchResults = header.querySelector('.Search__Results');
				searchResults.setAttribute('aria-hidden', 'true');
			}
		});
	}
});
