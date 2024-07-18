(() => {
	const productInfo = document.querySelector('.Product__Info');
	if (!productInfo) return;

	const atcButton = document.querySelector('[data-js-atc-button]');
	if (atcButton.getAttribute('disabled') == 'disabled') return;

	const stickyAtcContainer = document.querySelector('[data-js-sticky-atc-container]');
	if (!stickyAtcContainer) return;

	const stickyAtcButton = document.querySelector('[data-js-sticky-atc-button]');
	const stickyVariantSelector = document.querySelector('[data-js-sticky-atc-variant-selector]');
	const stickyVariantSelectorList = document.querySelector('[data-js-sticky-atc-variant-selector-list]');
	const stickyVariantSelectorItems = stickyVariantSelectorList.querySelectorAll('[data-js-sticky-atc-variant-selector-item]');
	const variantSelectorItems = document.querySelectorAll('.SizeSwatchList .HorizontalList__Item .SizeSwatch__Radio[name]');
	const pageOverlay = document.querySelector('[data-js-sticky-atc-overlay]');

	const getCookie = (name) => {
		let documentCookies = document.cookie;
		let prefix = name + '=';
		let begin = documentCookies.indexOf('; ' + prefix);
		let end;

		if (begin == -1) {
			begin = documentCookies.indexOf(prefix);
			if (begin != 0) return null;
		} else {
			begin += 2;
			end = document.cookie.indexOf(';', begin);
			if (end == -1) {
				end = documentCookies.length;
			}
		}
		return decodeURI(documentCookies.substring(begin + prefix.length, end));
	};

	const moveForCookieBanner = () => {
		const checkCookie = getCookie('cookieconsent_status');

		if (!checkCookie) {
			stickyAtcContainer.classList.add('ProductMeta__StickyATC--HigherPosition');
			const cookieBannerInjectionParent = document.querySelector('.SOYR0oPj0Q6UOw2AemzM');
			const mutationObserver = new MutationObserver((entries) => {
				const checkCookie = getCookie('cookieconsent_status');
				if (!checkCookie) return;

				stickyAtcContainer.classList.remove('ProductMeta__StickyATC--HigherPosition');
			});

			mutationObserver.observe(cookieBannerInjectionParent, {
				childList: true,
				subtree: true,
				attributes: true,
			});
		}
	};

	const closeStickyAtcModal = () => {
		stickyVariantSelector.classList.remove('open');
		pageOverlay.classList.remove('is-visible');
		pageOverlay.removeEventListener('click', closeStickyAtcModal);
	};

	const openStickyAtcModal = () => {
		stickyVariantSelector.classList.add('open');
		pageOverlay.classList.add('is-visible');
		pageOverlay.addEventListener('click', closeStickyAtcModal);
	};

	const clickOnVariant = (selectedOptionName) => {
		// Manage selected option in sticky atc
		stickyVariantSelectorItems.forEach((item) => {
			const optionName = item.getAttribute('data-js-option-value');

			if (optionName === selectedOptionName) {
				item.classList.add('VariantSelector__ListItem--selected');
			} else {
				item.classList.remove('VariantSelector__ListItem--selected');
			}
		});

		variantSelectorItems.forEach((item) => {
			const optionName = item.getAttribute('value');

			if (optionName === selectedOptionName) {
				item.click();
				atcButton.click();
				closeStickyAtcModal();
			}
		});
	};

	if (variantSelectorItems.length > 1) {
		variantSelectorItems.forEach((item) => {
			item.addEventListener('click', () => {
				const selectedOptionName = item.getAttribute('value');

				stickyVariantSelectorItems.forEach((item) => {
					const optionName = item.getAttribute('data-js-option-value');

					if (optionName === selectedOptionName) {
						item.classList.add('VariantSelector__ListItem--selected');
					} else {
						item.classList.remove('VariantSelector__ListItem--selected');
					}
				});
			});
		});

		stickyVariantSelectorItems.forEach((item) => {
			item.addEventListener('click', () => {
				clickOnVariant(item.getAttribute('data-js-option-value'));
			});
		});

		stickyAtcButton.addEventListener('click', openStickyAtcModal);
	} else {
		stickyAtcButton.addEventListener('click', () => {
			atcButton.click();
		});
	}

	window.addEventListener('scroll', () => {
		if (!atcButton || !stickyAtcContainer) return;
		const atcButtonPosition = atcButton.getBoundingClientRect();

		if (atcButtonPosition.top < 0) {
			moveForCookieBanner();
			stickyAtcContainer.classList.add('active');

			if (window.innerWidth < 768) {
				// Hiding other app overlays
				const superchatWidget = document.querySelector('#superchat-widget');
				const smileUiContainer = document.querySelector('#smile-ui-lite-container');

				if (superchatWidget) {
					superchatWidget.style.display = 'none';
				}

				if (smileUiContainer) {
					smileUiContainer.style.display = 'none';
				}
			}
		}

		if (atcButtonPosition.top > 0) {
			stickyAtcContainer.classList.remove('active');

			// Showing other app overlays
			const superchatWidget = document.querySelector('#superchat-widget');
			const smileUiContainer = document.querySelector('#smile-ui-lite-container');

			if (superchatWidget) {
				superchatWidget.style.display = 'block';
			}

			if (smileUiContainer) {
				smileUiContainer.style.display = 'block';
			}
		}
	});

	moveForCookieBanner();
})();
