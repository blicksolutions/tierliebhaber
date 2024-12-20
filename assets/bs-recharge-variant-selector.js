window.replaceVariantSelector = () => {

	const insertMarkUpFinished = new Event('insertMarkUpFinished');

	const uspsMarkup = () => {
		return `
            <ul class="rc-plans__usps" data-js-variant-usps>
                <li class="rc-plans__usp">
                    <svg class="rc-plans__usp-icon" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M8.41206 15.0238L4.17627 10.788L4.78479 10.1803L8.41206 13.8076L16.2155 6.00421L16.8231 6.61188L8.41206 15.0238Z" fill="black"/>
                    </svg>
                    <p class="rc-plans__usp-text">
                        15% Ersparnis pro Bestellung
                    </p>
                </li>
                <li class="rc-plans__usp" data-js-usp-free-shipping="true">
                    <svg class="rc-plans__usp-icon" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M8.41206 15.0238L4.17627 10.788L4.78479 10.1803L8.41206 13.8076L16.2155 6.00421L16.8231 6.61188L8.41206 15.0238Z" fill="black"/>
                    </svg>
                    <p class="rc-plans__usp-text">
                        Kostenloser Versand
                    </p>
                </li>
                <li class="rc-plans__usp">
                    <svg class="rc-plans__usp-icon" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M8.41206 15.0238L4.17627 10.788L4.78479 10.1803L8.41206 13.8076L16.2155 6.00421L16.8231 6.61188L8.41206 15.0238Z" fill="black"/>
                    </svg>
                    <p class="rc-plans__usp-text">
                        Jederzeit kündbar
                    </p>
                </li>
            </ul>
		`;
	};

	const savingsMarkup = (savings, freeShipping) => {
		let savingsMarkUp;
		if (window.tlh043 == true) {
			savingsMarkUp = '';
		} else {
			savingsMarkUp = `                
                <li class="rc-plans__usp">
                    <svg class="rc-plans__usp-icon" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M8.41206 15.0238L4.17627 10.788L4.78479 10.1803L8.41206 13.8076L16.2155 6.00421L16.8231 6.61188L8.41206 15.0238Z" fill="black"/>
                    </svg>
                    <p class="rc-plans__usp-text" data-js-variant-savings-usp>
                        Du sparst ${savings}
                    </p>
                </li>`;
		}
		return `
            <ul class="rc-plans__usps variant-savings__list">
                ${savingsMarkUp}
                ${freeShipping}
            </ul>
		`;
	};

	const discountMarkup = (text) => {
		return `
            <span class="rc-discount__percent">
                - ${text}
            </span>
		`;
	};

	const handleVariantChange = (event) => {
		const selectedValue = event.target.getAttribute('data-js-option-value');
		const originalVariantSelectorInputs = document.querySelectorAll('.ProductForm__Variants .ProductForm__Option .SizeSwatchList input[value]');

		originalVariantSelectorInputs.forEach((input) => {
			const value = input.getAttribute('value');

			if (value === selectedValue) {
				input.click();
			}
		});
	};

	const insertNewMarkup = () => {
		const plansContainer = document.querySelector('.Product__Info [data-plans-container]');
		const radioButtonsContainer = document.querySelector('.rc-radio-group__options');

		const variantSelectorElement = document.querySelector('.VariantSelector__List[data-js-variant-selector-list]');

		if (plansContainer.getAttribute('data-js-variant-selector-replaced') != 'true' && !variantSelectorElement == false) {
			const variantSelectorElementClone = variantSelectorElement.cloneNode(true);
			const variantSelectorCloneInputElements = variantSelectorElementClone.querySelectorAll('[data-js-variant-selector-item]');

			variantSelectorCloneInputElements.forEach((element) => {
				element.addEventListener('click', handleVariantChange);
			});
			// prevent markup from being inserted twice
			plansContainer.setAttribute('data-js-variant-selector-replaced', 'true');
			plansContainer.insertAdjacentHTML('beforeend', uspsMarkup());
			variantSelectorElementClone.setAttribute('data-js-injected', true);
			radioButtonsContainer.after(variantSelectorElementClone);

			const variantWithSavings = document.querySelector('[data-js-savings]');

			if (variantWithSavings != undefined) {
				const savings = variantWithSavings.getAttribute('data-js-savings');
				let freeShipping = '';

				let freeShippingCheck;

				const price = document.querySelector('.ProductMeta__Price.Price').innerText;
				if (!price) return;

				const priceFloat = Number.parseFloat(price.replace('€', '').replace(',', '.'));

				switch (window.Shopify.locale) {
					case 'de':
						if (priceFloat > 49.0) {
							freeShippingCheck = 'true';
						}
						break;

					case 'at':
						if (priceFloat > 69.0) {
							freeShippingCheck = 'true';
						}
						break;

					case 'ch':
						if (priceFloat > 129.0) {
							freeShippingCheck = 'true';
						}
						break;

					default:
						freeShippingCheck = 'false';
						break;
				}

				if (freeShippingCheck == 'true') {

					freeShipping = `
                    <li class="rc-plans__usp rc-plans_usp--free-shipping">
                        <svg class="rc-plans__usp-icon" width="21" height="21" viewBox="0 0 21 21" fill="none">
                            <path d="M8.41206 15.0238L4.17627 10.788L4.78479 10.1803L8.41206 13.8076L16.2155 6.00421L16.8231 6.61188L8.41206 15.0238Z" fill="black"/>
                        </svg>
                        <p class="rc-plans__usp-text">
                            Kostenloser Versand
                        </p>
                    </li>
                    `;
				}

				const variantUsps = document.createElement('div');
				variantUsps.classList.add('variant-savings__container');
				variantUsps.setAttribute('data-js-variant-savings-container', true);

				variantUsps.innerHTML = savingsMarkup(savings, freeShipping);

				variantSelectorElementClone.after(variantUsps);

				if (variantWithSavings.classList.contains('VariantSelector__ListItem--selected')) {
					const savingsList = document.querySelector('[data-js-variant-savings-container]');
					savingsList.classList.add('active');
				}
			}
		} else if (plansContainer.getAttribute('data-js-variant-selector-replaced') != 'true') {
			plansContainer.setAttribute('data-js-variant-selector-replaced', 'true');
			plansContainer.insertAdjacentHTML('beforeend', uspsMarkup());
			radioButtonsContainer.classList.add('variant-selector--round-corners');
		}

		const subscriptionElement = document.querySelector('[data-option-subsave]');

		subscriptionElement.addEventListener('click', () => {
			const savingsList = document.querySelector('[data-js-variant-savings-container]');
			if (!savingsList) return;

			savingsList.classList.remove('active');
		});

		const oneTimeElement = document.querySelector('[data-option-onetime]');

		oneTimeElement.addEventListener('click', () => {
			const subscriptionPlansContainer = document.querySelector('[data-plans-container]');
			if (subscriptionPlansContainer.style.display != 'none') return;

			const variantSelectorCloneInputElementContainer = document.querySelector('.VariantSelector__List[data-js-variant-selector-list][data-js-injected="true"]');
			const variantWithSavings = variantSelectorCloneInputElementContainer.querySelectorAll('[data-js-savings]');
			if (!variantWithSavings) return;

			variantWithSavings.forEach((variant) => {
				if (variant.classList.contains('VariantSelector__ListItem--selected')) {
					const savingsList = document.querySelector('[data-js-variant-savings-container]');
					if (!savingsList) return;

					setTimeout(() => {
						manageOneTimeFreeShipping(variant);
					}, 50);

					savingsList.classList.add('active');
				}
			});
		});
		document.dispatchEvent(insertMarkUpFinished);
	};

	const manageSubscriptionFreeShipping = () => {
		const subscriptionElement = document.querySelector('[data-option-subsave]');
		if (!subscriptionElement) return;

		if (subscriptionElement.classList.contains('rc_widget__option--active')) {
			let freeShippingCheck;

			const price = document.querySelector('.ProductMeta__Price.Price').innerText;
			if (!price) return;

			const priceFloat = Number.parseFloat(price.replace('€', '').replace(',', '.'));

			switch (window.Shopify.locale) {
				case 'de':
					if (priceFloat > 49.0) {
						freeShippingCheck = 'true';
					}
					break;

				case 'at':
					if (priceFloat > 69.0) {
						freeShippingCheck = 'true';
					}
					break;

				case 'ch':
					if (priceFloat > 129.0) {
						freeShippingCheck = 'true';
					}
					break;

				default:
					freeShippingCheck = 'false';
					break;
			}

			const freeShippingUsp = document.querySelector('[data-js-usp-free-shipping]');
			if (!freeShippingUsp) return;

			if (freeShippingCheck == 'true' && subscriptionElement.classList.contains('rc-option--active')) {
				freeShippingUsp.classList.add('rc-plans__usp--active');
			} else {
				freeShippingUsp.classList.remove('rc-plans__usp--active');
			}
		}
	};

	const manageOneTimeFreeShipping = (variant) => {
		const savings = variant.getAttribute('data-js-savings');
		const savingsList = document.querySelector('[data-js-variant-savings-container]');
		if (!savingsList) return;

		let freeShipping = '';

		let freeShippingCheck;

		const price = document.querySelector('.ProductMeta__Price.Price').innerText;
		if (!price) return;

		const priceFloat = Number.parseFloat(price.replace('€', '').replace(',', '.'));

		switch (window.Shopify.locale) {
			case 'de':
				if (priceFloat > 49.0) {
					freeShippingCheck = 'true';
				}
				break;

			case 'at':
				if (priceFloat > 69.0) {
					freeShippingCheck = 'true';
				}
				break;

			case 'ch':
				if (priceFloat > 129.0) {
					freeShippingCheck = 'true';
				}
				break;

			default:
				freeShippingCheck = 'false';
				break;
		}

		if (freeShippingCheck == 'true') {
			let freeShippingText;

			if (window.tlh043 == true) {
				freeShippingText = 'Gratis Versand';
			} else {
				freeShippingText = 'Kostenloser Versand';
			}

			freeShipping = `
            <li class="rc-plans__usp rc-plans_usp--free-shipping">
                <svg class="rc-plans__usp-icon" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M8.41206 15.0238L4.17627 10.788L4.78479 10.1803L8.41206 13.8076L16.2155 6.00421L16.8231 6.61188L8.41206 15.0238Z" fill="black"/>
                </svg>
                <p class="rc-plans__usp-text">
                    ${freeShippingText}
                </p>
            </li>
            `;
		}

		savingsList.innerHTML = savingsMarkup(savings, freeShipping);
	};

	const mutationObserver = new MutationObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.target.classList.contains('rc-widget-injection-parent')) {
				const originalVariantSelectorWrapper = document.querySelector('.Product__Info .ProductForm__Variants');
				if (!originalVariantSelectorWrapper) return;

				originalVariantSelectorWrapper.style.display = 'none';

				const originalVariantSelector = originalVariantSelectorWrapper.querySelector('.ProductForm__Option .SizeSwatchList');

				// Handle variant change
				if (originalVariantSelector != undefined) {
					const variantSelectorInputElements = originalVariantSelector.querySelectorAll('input[value]');

					variantSelectorInputElements.forEach((inputElement) => {
						inputElement.addEventListener('change', (event) => {
							const selectedValue = event.target.getAttribute('value');
							const clonedVariantInputs = document.querySelectorAll('.VariantSelector__List[data-js-variant-selector-list=""][data-js-injected="true"] [data-js-variant-selector-item]');

							clonedVariantInputs.forEach((input) => {
								const value = input.getAttribute('data-js-option-value');

								if (value === selectedValue) {
									input.classList.add('VariantSelector__ListItem--selected');
									setTimeout(manageSubscriptionFreeShipping, 50);

									const savings = input.getAttribute('data-js-savings');
									const savingsListElement = document.querySelector('[data-js-variant-savings-container]');
									const subscriptionElement = document.querySelector('[data-option-subsave]');
									const variantSavingsUsp = savingsListElement.querySelector('[data-js-variant-savings-usp]');

									if (savings != undefined && !subscriptionElement.classList.contains('rc-option--active')) {
										setTimeout(() => {
											manageOneTimeFreeShipping(input);
										}, 50);

										savingsListElement.classList.add('active');
									} else {
										savingsListElement.classList.remove('active');
									}
								} else {
									input.classList.remove('VariantSelector__ListItem--selected');
								}
							});
						});
					});
				}

				const rechargeWrapper = entry.target.querySelector('.Product__Info [data-widget-container-wrapper]');

				const subscribeText = entry.target.querySelector('.Product__Info [data-label-text-subsave]');
				subscribeText.innerText = 'Abonnieren';

				const subscritionContainer = entry.target.querySelector('.Product__Info [data-label-subsave]');
				const discountText = entry.target.querySelector('.Product__Info [data-label-discount]').innerText;

				const discountInserted = document.querySelector('.rc-discount__percent');

				if (!discountInserted) {
					subscritionContainer.insertAdjacentHTML('beforeend', discountMarkup(discountText));
				}
			}

			if (entry.target.classList.contains('rc-template__radio-group')) {
				setTimeout(insertNewMarkup, 50);

				const planOptions = entry.target.querySelectorAll('.Product__Info [data-plan-option]');

				planOptions.forEach((option) => {
					if (option.getAttribute('data-js-variant-selector-replaced') == 'true') return;
					option.innerText = 'Lieferung ' + option.innerText.replace('Alle', 'alle');
					option.setAttribute('data-js-variant-selector-replaced', 'true');
				});
			}

			if (entry.target.classList.contains('rc-selling-plans')) {
				const radioOptionsContainer = document.querySelector('.Product__Info [data-radio-group-options]');

				if (entry.target.getAttribute('style') == 'display: none;') {
					setTimeout(manageSubscriptionFreeShipping, 50);
					radioOptionsContainer.classList.remove('sub-plan--active');
				} else {
					setTimeout(manageSubscriptionFreeShipping, 50);
					radioOptionsContainer.classList.add('sub-plan--active');
				}
			}
		});
	});

	const rechargeInjectionElement = document.querySelector('.rc-widget-injection-parent');

	if (rechargeInjectionElement != undefined) {
		mutationObserver.observe(rechargeInjectionElement, {
			childList: true,
			subtree: true,
			attributes: true,
		});
	}
};
document.addEventListener('DOMContentLoaded', window.replaceVariantSelector);
