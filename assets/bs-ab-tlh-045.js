const changeShippingColor = () => {
	setTimeout(() => {
		const shippingCostElement = document.querySelector('.Drawer__Footer__Delivery');

		switch (window.Shopify.locale) {
			case 'de':
				if (window.cartTotal > 4900) {
					shippingCostElement.setAttribute('data-js-tlh-045', 'true');
				}
				break;

			case 'at':
				if (window.cartTotal > 6900) {
					shippingCostElement.setAttribute('data-js-tlh-045', 'true');
				}
				break;

			case 'ch':
				if (window.cartTotal > 12900) {
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
