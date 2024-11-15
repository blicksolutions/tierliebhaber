window.activateAbTlh056 = (testVariant) => {
	if (testVariant == '') return

	const cartDrawerElement = document.querySelector('[data-js-tlh-056]')
	if (!cartDrawerElement) return

	cartDrawerElement.setAttribute('data-js-tlh-056', testVariant)

	if (testVariant == 'b') {

		const mutationObserverPrice = new MutationObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.type == 'childList') {
					if (entry.target.classList.contains('Badge__Savings')) return
						const cartSavingsElement = document.querySelector('[tlh-056-cart-savings]')
						if (!cartSavingsElement) return
		
						const cartSavings = cartSavingsElement.getAttribute('tlh-056-cart-savings')
	
						const badgeSavingsElement = document.querySelector('[data-js-tlh-056-badge-savings]')
						if (badgeSavingsElement.innerText != cartSavings) {
							badgeSavingsElement.innerText = cartSavings
						}
					
				}
			});
		});
	
		const cartDrawer= document.querySelector('#shopify-section-cart-drawer')
	
		if (cartDrawer != undefined) {
			mutationObserverPrice.observe(cartDrawer, {
				childList: true,
				subtree: true,
				attributes: true,
			});
		}
	}

};

