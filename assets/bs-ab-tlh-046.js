window.activateAbTlh046 = () => {
	const productHandle = window.location.pathname.split('/').slice(-1).toString();
	console.log('productHandle', productHandle)
	let bestseller;

	switch (productHandle) {
		case 'dentalspray':
			bestseller = true;
			break;
		case 'dentalspray-katzen-1':
			bestseller = true;
			break;
		case 'gras-kotfresser-drops-2':
			bestseller = true;
			break;
		case 'darmpflege-drops':
			bestseller = true;
			break;
		case 'hustenkrautersaft':
			bestseller = true;
			break;
		case 'hustenkrautersaft-pferd':
			bestseller = true;
			break;
		case 'chillloutsaft-fur-hunde':
			bestseller = true;
			break;
		case 'chillout-drops':
			bestseller = true;
			break;
		case 'gelenk-sticks':
			bestseller = true;
			break;
		case 'gelenkkrautersaft-pferd':
			bestseller = true;
			break;
		case 'chilloutsaft-pferd':
			bestseller = true;
			break;
		case 'darmwohl-sticks':
			bestseller = true;
			break;
		case 'z-snack':
			bestseller = true;
			break;
		case 'z-spot':
			bestseller = true;
			break;
		case 'chillout-sticks':
			bestseller = true;
			break;
		case 'dentalspray-tl0010-fb-d4':
			bestseller = true;
			break;
		case 'gras-kotfresser-drops-3':
			bestseller = true;
			break;
		case 'chillout-drops-1':
			bestseller = true;
			break;
		case 'hustenkrautersaft-pferd-1':
			bestseller = true;
			break;

		default:
			bestseller = false;
			break;
	}

	if (bestseller == true) {
		window.tlh046 = true
	} else return

	const rechargeContainer = document.querySelector('[data-js-tlh-046-recharge-container]')
	if (!rechargeContainer) return
	rechargeContainer.setAttribute('data-js-tlh-046-recharge-container', 'true')

	const variantSelectorContainer = document.querySelector('[data-js-tlh-046-variant-selector]')
	if (!variantSelectorContainer) return
	variantSelectorContainer.setAttribute('data-js-tlh-046-variant-selector', 'true')

	

	const variantSelector = document.querySelector('[data-js-tlh-046-variant-selector-list]')
	if (!variantSelector) return
	variantSelector.setAttribute('data-js-tlh-046-variant-selector-list', 'true')

	const optionElements = variantSelector.querySelectorAll('[data-js-option-value]')
	if (!optionElements) return

	//get amount for calculating individual price
	const getAmount = (optionElement) => {
		const optionValue = optionElement.getAttribute('data-js-option-value')

		const regex = /([\d][xX])/g

		const parsedInt = parseInt(optionValue.match(regex))

		let amount

		if (Number.isInteger(parsedInt)) {
			amount = parsedInt

		} else {
			amount = 1

		}

		return amount
	}
	
	const getPrice = (optionElement,amount) => {
		const optionPrice = optionElement.getAttribute('data-js-price').replace(',', '.')

		const price = parseFloat(optionPrice)

		const pricePerUnit = (price / amount).toFixed(2)

		return pricePerUnit
	}

	// Handle variant change

	const handleVariantChange = (optionElement) => {
		const selectedValue = optionElement.getAttribute('data-js-option-value');
		const originalVariantSelectorInputs = document.querySelectorAll('.ProductForm__Variants .ProductForm__Option .SizeSwatchList input[value]');

		originalVariantSelectorInputs.forEach((input) => {
			const value = input.getAttribute('value');

			if (value === selectedValue) {
				input.click();
			}
		});
	};

	const compareAtPrice = (option) => {
		const priceContainer = document.querySelector('.ProductMeta__PriceList')
		const compareAtPriceElements = priceContainer.querySelectorAll('.ProductMeta__Price.Price.Price--compareAt')
		if (!compareAtPriceElements) return

		const priceDifferenceElement = priceContainer.querySelector('.price-difference')
		if (!priceDifferenceElement) return

		if (option.classList.contains('rc-option__subsave')) {
					const selectedVariant = variantSelectorContainer.querySelector('.VariantSelector__ListItem--selected')

					const originalCompareAtPrice = parseFloat(selectedVariant.getAttribute('data-js-compare-at-price').replace(',','.'))
					const price = parseFloat(selectedVariant.getAttribute('data-js-price').replace(',','.'))
					const subscriptionCompareAtPrice = originalCompareAtPrice * 0.85
					const priceDifference = subscriptionCompareAtPrice - (price * 0.85)
			
					const priceDifferenceMessage = `Du sparst €${priceDifference.toFixed(2).toString().replace('.',',')}` 
			
					priceDifferenceElement.innerText = priceDifferenceMessage
					compareAtPriceElements.forEach((compareAtPriceElement)=>{
						compareAtPriceElement.innerText = `${subscriptionCompareAtPrice.toFixed(2).toString().replace('.',',')}€` 
					})
		} else if (option.classList.contains('rc-option__onetime')) {
			const selectedVariant = variantSelectorContainer.querySelector('.VariantSelector__ListItem--selected')
			const originalCompareAtPrice = parseFloat(selectedVariant.getAttribute('data-js-compare-at-price').replace(',','.'))
			const price = parseFloat(selectedVariant.getAttribute('data-js-price').replace(',','.'))
			const priceDifference = originalCompareAtPrice - price
	
			const priceDifferenceMessage = `Du sparst €${priceDifference.toFixed(2).toString().replace('.',',')}` 
	
			priceDifferenceElement.innerText = priceDifferenceMessage
			compareAtPriceElements.forEach((compareAtPriceElement)=>{
				compareAtPriceElement.innerText = `${originalCompareAtPrice.toFixed(2).toString().replace('.',',')}€` 
			})
		}
	}

	const originalVariantSelectorWrapper = document.querySelector('.Product__Info .ProductForm__Variants');
	if (!originalVariantSelectorWrapper) return;

	originalVariantSelectorWrapper.style.display = 'none';

	const originalVariantSelector = originalVariantSelectorWrapper.querySelector('.ProductForm__Option .SizeSwatchList');


	if (originalVariantSelector != undefined) {
		const variantSelectorInputElements = originalVariantSelector.querySelectorAll('input[value]');

		variantSelectorInputElements.forEach((inputElement) => {
			inputElement.addEventListener('change', (event) => {
				const selectedValue = event.target.getAttribute('value');
				const clonedVariantInputs = variantSelector.querySelectorAll('[data-js-variant-selector-item]');

				clonedVariantInputs.forEach((input) => {
					const value = input.getAttribute('data-js-option-value');

					if (value === selectedValue) {
						input.classList.add('VariantSelector__ListItem--selected');
					} else {
						input.classList.remove('VariantSelector__ListItem--selected');
					}
				});

				setTimeout(()=>{
					const rechargeOption = document.querySelector('.rc-option--active')
					compareAtPrice(rechargeOption)
				}, 110)
			});
			
		});
	}
	optionElements.forEach((optionElement)=>{
		optionElement.addEventListener('click',()=>{
				handleVariantChange(optionElement)
			}
		)
	})

	optionElements.forEach((optionElement)=>{
		const amount = getAmount(optionElement)
		const optionPrefix = optionElement.querySelector('[data-js-option-prefix]')
		optionPrefix.innerHTML = amount + 'x'

		const pricePerUnit = getPrice(optionElement, amount)
		const optionSuffix = optionElement.querySelector('[data-js-option-suffix]')
		optionSuffix.innerHTML = `je ${pricePerUnit.replace('.',',')}€` 

		const imageContainer = optionElement.querySelector('[data-js-tlh-046-image-container]')
		const imageSrc = imageContainer.getAttribute('data-js-src')

		imageContainer.style.setProperty('--container-width', (16 * amount) + 'px')
		imageContainer.classList.add(`Images--${amount}`)
		
		for (let index = 0; index < amount; index++) {
			const imageElement = document.createElement('img')

			const horizontalPosition = index * 12

			imageElement.src = imageSrc
			imageElement.classList.add('VariantSelector__Image')
			imageElement.setAttribute('index', index)
			imageElement.style.setProperty('--horizontal-position',`${horizontalPosition}px`)
			imageContainer.appendChild(imageElement)
		}

	})

	const mutationObserverPrice = new MutationObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.type == 'childList') {
				const clonedUnitPrice = document.querySelectorAll('[data-js-tlh-046-unit-price]')
				clonedUnitPrice.forEach((unitPrice) => {
					unitPrice.innerText = entry.target.innerText
				})
			}
		});
	});

	const unitPrice= document.querySelector('.ProductMeta__UnitPriceMeasurement .UnitPriceMeasurement__Price')

	if (unitPrice != undefined) {
		mutationObserverPrice.observe(unitPrice, {
			childList: true,
			subtree: true,
			attributes: true,
		});
	}

	const uspsMarkup = () => {
		return `
            <ul class="rc-plans__usps" data-js-variant-usps>
                <li class="rc-plans__usp">
					<svg class="rc-plans__usp-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="8" r="8" fill="#EFA38F"/>
						<path d="M6.66367 10.8953L3.95276 8.18436L4.34221 7.79545L6.66367 10.1169L11.6578 5.12273L12.0468 5.51164L6.66367 10.8953Z" fill="#1C1B1B"/>
					</svg>

                    <p class="rc-plans__usp-text">
                        <s>15% Ersparnis</s> pro Bestellung
                    </p>
                </li>
                <li class="rc-plans__usp">
					<svg class="rc-plans__usp-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="8" r="8" fill="#EFA38F"/>
						<path d="M6.66367 10.8953L3.95276 8.18436L4.34221 7.79545L6.66367 10.1169L11.6578 5.12273L12.0468 5.51164L6.66367 10.8953Z" fill="#1C1B1B"/>
					</svg>
                    <p class="rc-plans__usp-text">
                        Jederzeit kündbar
                    </p>
                </li>
            </ul>
		`;
	};

	const subscriptionMarkup = () => {
		return `
			<p class="rc__subsave-text">
				Abonnieren
			</p>
			<div class="rc__subsave-bestseller">
				<svg class="rc__subsave-bestseller-icon" width="13" height="13" viewBox="0 0 13 13" fill="none">
					<path d="M9.83975 11.9167L8.95954 8.11146L11.9116 5.55208L8.01162 5.21354L6.49495 1.625L4.97829 5.21354L1.07829 5.55208L4.03037 8.11146L3.15016 11.9167L6.49495 9.89896L9.83975 11.9167Z" fill="#D4AF37"/>
				</svg>
				<p class="rc__subsave-bestseller-text">
					Bestseller
				</p>
			</div>
		`;
	};

	const rechargeInjectionElement = document.querySelector('.rc-widget-injection-parent');


	const initReCharge = () => {
		//widget layout and notices
		const widgetContainer = rechargeInjectionElement.querySelector('[data-widget-container]')
		const noticeContainer = document.querySelector('[data-js-tlh-046-notice-container]').cloneNode(true)

		widgetContainer.appendChild(noticeContainer)

		//usps
		const subsaveContainer = rechargeInjectionElement.querySelector('[data-option-subsave]')
		subsaveContainer.insertAdjacentHTML('beforeend', uspsMarkup());

		//dropdown-options
		setTimeout(()=>{
			const planOptions = rechargeInjectionElement.querySelectorAll('[data-plan-option]');
	
			planOptions.forEach((option) => {

				if (option.getAttribute('data-js-variant-selector-replaced') == 'true') return;
				option.innerText = 'Lieferung ' + option.innerText.replace('Alle', 'alle');
				option.setAttribute('data-js-variant-selector-replaced', 'true');
			});
		},50)

		const options = document.querySelectorAll('.rc-radio.rc-option')
		options.forEach((option) => {
				//handle subscription compare at price
				option.addEventListener('click', ()=>{
					setTimeout(()=>{
						
						compareAtPrice(option)
					, 110})
				})
		})

		//subscription text
		const subSaveText = rechargeInjectionElement.querySelector('[data-label-text-subsave]')
		subSaveText.innerHTML = subscriptionMarkup()

	}

	const mutationObserverRecharge = new MutationObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.target.classList.contains('rc-widget-injection-parent')) {
				initReCharge()
			}
		});
	});
	
	
	if (rechargeInjectionElement != undefined) {
		mutationObserverRecharge.observe(rechargeInjectionElement, {
			childList: true,
			subtree: true,
			attributes: true,
		});
	}
};

document.addEventListener('DOMContentLoaded', window.activateAbTlh046)
