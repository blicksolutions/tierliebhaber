window.activateAbTlh067 = () => {
	switch (productHandle) {
		case 'dentalspray-katzen-1':
			bestseller = true;
			break;
		case 'gras-kotfresser-drops-2':
			bestseller = true;
			break;
		case 'darmpflege-drops':
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


		default:
			bestseller = false;
			break;
	}
	if (bestseller != true) return

	const variantPopup = document.querySelector('[data-js-tlh-067-variant-popup]')
	if (!variantPopup) return

	const productForm = document.querySelector('.ProductForm')
	productForm.setAttribute('data-js-tlh-067', 'true')

	variantPopup.setAttribute('data-js-tlh-067', 'true')

	const pageOverlay = document.querySelector('.PageOverlay');

	const confirmButton = variantPopup.querySelector('[data-js-confirm-button]')
	const denyButton = variantPopup.querySelector('[data-js-deny-button]')

	const variantList = variantPopup.querySelector('[data-js-variant-list]')

	function preventScroll(event) {
		event.preventDefault();  // Verhindert das Scrollen
	}

	function toggleScroll(enable) {
		if (enable) {
			// Event-Listener entfernen, um das Scrollen zu ermöglichen
			window.removeEventListener('wheel', preventScroll, { passive: false });
			window.removeEventListener('touchmove', preventScroll, { passive: false });
		} else {
			// Event-Listener hinzufügen, um das Scrollen zu verhindern
			window.addEventListener('wheel', preventScroll, { passive: false });
			window.addEventListener('touchmove', preventScroll, { passive: false });
		}
	}

	const togglePopup = () => {

		if (variantPopup.style.display === "none" || !variantPopup.classList.contains('show')) {
			pageOverlay.classList.add('is-visible')

			// Popup anzeigen mit Animation
			variantPopup.style.display = "flex";  // Zuerst auf block setzen
			setTimeout(() => {
				variantPopup.classList.add('show');  // Nach kurzer Verzögerung die Animation starten
			}, 10); // Verzögerung, um sicherzustellen, dass der display-Wert auf "block" gesetzt wurde
			toggleScroll(false)
			pageOverlay.addEventListener('click', togglePopup)

		} else {

			// variantPopup ausblenden mit Animation
			toggleScroll(true)
			pageOverlay.removeEventListener('click', togglePopup)

			variantPopup.classList.remove('show');  // Animation rückgängig machen
			setTimeout(() => {
				variantPopup.style.display = "none";  // Popup auf display: none setzen, nachdem die Animation abgeschlossen ist
				pageOverlay.classList.remove('is-visible')

			}, 300);  // Warten bis die Animation fertig ist
		}
	}
	


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

	const uspMarkup = (freeShipping, savingsAmount, savingsPercent) => {
		let shippingUsp = ''
		if (freeShipping == 'true') {
			shippingUsp = `
				<li class="variant-popup__usp">
					<svg class="variant-popup__usp-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
						<g clip-path="url(#clip0_7802_280)">
						<path d="M11.9333 3.66673C11.7419 3.46404 11.4786 3.34439 11.2 3.3334H10.6667V2.66673C10.6713 2.53416 10.6486 2.40204 10.6 2.27861C10.5514 2.15518 10.4779 2.04307 10.3841 1.94927C10.2903 1.85546 10.1782 1.78197 10.0548 1.73337C9.93136 1.68476 9.79925 1.66208 9.66667 1.66673H1.66667C1.5341 1.66208 1.40198 1.68476 1.27855 1.73337C1.15512 1.78197 1.04301 1.85546 0.949207 1.94927C0.855404 2.04307 0.781911 2.15518 0.733304 2.27861C0.684697 2.40204 0.662016 2.53416 0.666672 2.66673V11.6667C0.662016 11.7993 0.684697 11.9314 0.733304 12.0549C0.781911 12.1783 0.855404 12.2904 0.949207 12.3842C1.04301 12.478 1.15512 12.5515 1.27855 12.6001C1.40198 12.6487 1.5341 12.6714 1.66667 12.6667H2.43334C2.5784 13.1461 2.87386 13.5661 3.27605 13.8646C3.67824 14.1631 4.16581 14.3243 4.66667 14.3243C5.16753 14.3243 5.6551 14.1631 6.05729 13.8646C6.45948 13.5661 6.75495 13.1461 6.90001 12.6667H9.10001C9.24506 13.1461 9.54053 13.5661 9.94272 13.8646C10.3449 14.1631 10.8325 14.3243 11.3333 14.3243C11.8342 14.3243 12.3218 14.1631 12.724 13.8646C13.1261 13.5661 13.4216 13.1461 13.5667 12.6667H14.3333C14.4659 12.6714 14.598 12.6487 14.7215 12.6001C14.8449 12.5515 14.957 12.478 15.0508 12.3842C15.1446 12.2904 15.2181 12.1783 15.2667 12.0549C15.3153 11.9314 15.338 11.7993 15.3333 11.6667V7.40007L11.9333 3.66673ZM11.0333 4.66673L13.4667 7.3334H10.6667V4.66673H11.0333ZM2.00001 3.00007H9.33334V10.8001C9.23559 10.9684 9.15731 11.1473 9.10001 11.3334H6.90001C6.75495 10.854 6.45948 10.434 6.05729 10.1355C5.6551 9.837 5.16753 9.67584 4.66667 9.67584C4.16581 9.67584 3.67824 9.837 3.27605 10.1355C2.87386 10.434 2.5784 10.854 2.43334 11.3334H2.00001V3.00007ZM4.66667 13.0001C4.46889 13.0001 4.27555 12.9414 4.1111 12.8315C3.94665 12.7217 3.81848 12.5655 3.74279 12.3827C3.66711 12.2 3.6473 11.999 3.68589 11.805C3.72447 11.611 3.81971 11.4328 3.95957 11.293C4.09942 11.1531 4.2776 11.0579 4.47158 11.0193C4.66556 10.9807 4.86663 11.0005 5.04936 11.0762C5.23208 11.1519 5.38826 11.28 5.49814 11.4445C5.60802 11.6089 5.66667 11.8023 5.66667 12.0001C5.67133 12.1326 5.64865 12.2648 5.60004 12.3882C5.55143 12.5116 5.47794 12.6237 5.38414 12.7175C5.29034 12.8113 5.17823 12.8848 5.0548 12.9334C4.93136 12.982 4.79925 13.0047 4.66667 13.0001ZM11.3333 13.0001C11.1356 13.0001 10.9422 12.9414 10.7778 12.8315C10.6133 12.7217 10.4851 12.5655 10.4095 12.3827C10.3338 12.2 10.314 11.999 10.3526 11.805C10.3911 11.611 10.4864 11.4328 10.6262 11.293C10.7661 11.1531 10.9443 11.0579 11.1382 11.0193C11.3322 10.9807 11.5333 11.0005 11.716 11.0762C11.8987 11.1519 12.0549 11.28 12.1648 11.4445C12.2747 11.6089 12.3333 11.8023 12.3333 12.0001C12.338 12.1326 12.3153 12.2648 12.2667 12.3882C12.2181 12.5116 12.1446 12.6237 12.0508 12.7175C11.957 12.8113 11.8449 12.8848 11.7215 12.9334C11.598 12.982 11.4659 13.0047 11.3333 13.0001ZM13.5667 11.3334C13.4232 10.8523 13.1285 10.4303 12.7261 10.1301C12.3238 9.82981 11.8354 9.66732 11.3333 9.66673C11.1072 9.66452 10.8822 9.69828 10.6667 9.76673V8.66673H14V11.3334H13.5667Z" fill="white"/>
						</g>
						<defs>
						<clipPath id="clip0_7802_280">
						<rect width="16" height="16" fill="white"/>
						</clipPath>
						</defs>
					</svg>
					<p class="variant-popup__usp-text">
						Gratis Versand
					</p>
				</li>
			`
		}

		const savingsUsp = `
			<li class="variant-popup__usp">
				<i class="variant-popup__usp-icon">
					€
				</i>
				<p class="variant-popup__usp-badge">
					${savingsPercent}% Rabatt
				</p>
				<p class="variant-popup__usp-text">
					Du sparst <s>${savingsAmount}</s>!
				</p>
			</li>
		`
		return `
			${shippingUsp}
			${savingsUsp}
		`
	}

	const optionElements = variantPopup.querySelectorAll('[data-js-option-value]')
	if (!optionElements) return

	const uspList = variantPopup.querySelector('[data-js-usp-list]')
	if (!uspList) return


	const makeUsps = (optionElement) => {		
		const shipping = optionElement.getAttribute('data-js-free-shipping')
		const savingsPercent = optionElement.getAttribute('data-js-savings-percent')
		const savingsAmount = optionElement.getAttribute('data-js-savings-amount')
		
		const uspListContent = uspMarkup(shipping, savingsAmount, savingsPercent)
		
		uspList.innerHTML = uspListContent

	}

	const variantChange = (optionElement) => {
		makeUsps(optionElement)
		const optionValue = optionElement.getAttribute('data-js-option-value')
		confirmButton.setAttribute('data-js-selected-option-value', optionValue)

		const oldSelection = variantList.querySelector('.variant-popup__variant-list-item--selected')
		oldSelection.classList.remove('variant-popup__variant-list-item--selected')
		optionElement.classList.add('variant-popup__variant-list-item--selected')
	}

	optionElements.forEach((optionElement)=>{
		const amount = getAmount(optionElement)
		const optionPrefix = optionElement.querySelector('[data-js-option-prefix]')
		console.log('optionPrefix', optionPrefix)
		optionPrefix.innerHTML = amount + 'x'

		const pricePerUnit = getPrice(optionElement, amount)
		const optionSuffix = optionElement.querySelector('[data-js-option-suffix]')
		optionSuffix.innerHTML = `je <s>${pricePerUnit.replace('.',',')}€</s>` 

		const imageContainer = optionElement.querySelector('[data-js-image-container]')
		const imageSrc = imageContainer.getAttribute('data-js-src')

		imageContainer.style.setProperty('--container-width', (23 * amount) + 'px')
		imageContainer.classList.add(`Images--${amount}`)
		
		for (let index = 0; index < amount; index++) {
			const imageElement = document.createElement('img')

			const horizontalPosition = index * 18

			imageElement.src = imageSrc
			imageElement.classList.add('variant-popup__variant-image')
			imageElement.setAttribute('index', index)
			imageElement.style.setProperty('--horizontal-position',`${horizontalPosition}px`)
			imageContainer.appendChild(imageElement)
		}

		const shipping = optionElement.getAttribute('data-js-free-shipping')
		const savingsPercent = optionElement.getAttribute('data-js-savings-percent')
		const savingsAmount = optionElement.getAttribute('data-js-savings-amount')
		
		const uspListContent = uspMarkup(shipping, savingsAmount, savingsPercent)
		
		uspList.innerHTML = uspListContent

		optionElement.addEventListener('click',()=>{
			variantChange(optionElement)
		})
	})

	const confirmUpsell = () => {
		togglePopup()
		
		const originalVariantSelectorInputs = document.querySelectorAll('.ProductForm__Variants .ProductForm__Option .SizeSwatchList input[value]');
		const selectedValue = confirmButton.getAttribute('data-js-selected-option-value')
		const origianlAtc = document.querySelector('[data-js-atc-button]')

		originalVariantSelectorInputs.forEach((input) => {
			const value = input.getAttribute('value');

			if (value === selectedValue) {
				input.click();

				window.requestAnimationFrame(()=>{
					origianlAtc.click()
				})
			}
		});
	}

	confirmButton.addEventListener('click', confirmUpsell)
	denyButton.addEventListener('click', ()=>{
		togglePopup()

		const originalVariantSelectorInputs = document.querySelectorAll('.ProductForm__Variants .ProductForm__Option .SizeSwatchList input[value]');
		const selectedValue = denyButton.getAttribute('data-js-selected-option-value')
		const origianlAtc = document.querySelector('[data-js-atc-button]')

		originalVariantSelectorInputs.forEach((input) => {
			const value = input.getAttribute('value');

			if (value === selectedValue) {
				input.click();

				window.requestAnimationFrame(()=>{
					origianlAtc.click()
				})
			}
		});
	})
	
	const newAtcButton = document.querySelector('[data-js-tlh-067-atc-button]')

	newAtcButton.addEventListener('click', togglePopup)

	const closeButton = variantPopup.querySelector('[data-js-close-button]')
	closeButton.addEventListener('click', togglePopup)
};

document.addEventListener('DOMContentLoaded', window.activateAbTlh067)
