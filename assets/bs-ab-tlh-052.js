window.activateAbTlh052 = () => {
	const cartDrawer = document.querySelector('#sidebar-cart[data-js-tlh-052]')
	if (!cartDrawer) return

	cartDrawer.setAttribute('data-js-tlh-052', 'true')

};

document.addEventListener('DOMContentLoaded',window.activateAbTlh052)

const tlh052Click = (productId) => {
	const productContainer = document.querySelector(`[data-js-tlh-052-product-container][data-js-product-id="${productId}"]`)
	productContainer.classList.toggle('open')
}
