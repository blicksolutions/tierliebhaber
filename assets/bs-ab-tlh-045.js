const changeShippingColor = () => {
	setTimeout(() => {
		const shippingCostElement = document.querySelector('.Drawer__Footer__Delivery');
		console.log('shippingCostElement', shippingCostElement);
		const subTotalElement = document.querySelector('.Drawer__Footer__SubtotalPrice');
		console.log('subTotalElement', subTotalElement);
		if (!subTotalElement) return;

		const price = parseFloat(subTotalElement.getAttribute('data-price').replace('€', '').replace(',', '.'));
		console.log('price', price);

		switch (window.Shopify.locale) {
			case 'de':
				if (price > 49.0) {
					shippingCostElement.setAttribute('data-js-tlh-045', 'true');
				}
				break;

			case 'at':
				if (price > 69.0) {
					shippingCostElement.setAttribute('data-js-tlh-045', 'true');
				}
				break;

			case 'ch':
				if (price > 129.0) {
					shippingCostElement.setAttribute('data-js-tlh-045', 'true');
				}
				break;

			default:
				break;
		}
	}, 1000);
};

window.activateAbTlh045 = () => {
	changeShippingColor();
	document.addEventListener('rerenderCart', changeShippingColor);
};

document.addEventListener('DOMContentLoaded', window.activateAbTlh045);
