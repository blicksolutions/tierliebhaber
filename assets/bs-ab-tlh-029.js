window.activateAbTlh029 = () => {
	const bestSellerProductCards = document.querySelectorAll(`.CollectionInner__Products .ProductItem[data-js-bestseller]`);
	if (bestSellerProductCards.length < 1) return;

	bestSellerProductCards.forEach((bestSellerProductCard) => {
		const bestSellerItem = bestSellerProductCard.querySelector('.ProductItem__Wrapper.ProductBadge__Bestseller');

		bestSellerItem.setAttribute('data-js-tlh-029', 'true');
	});
};

document.addEventListener('DOMContentLoaded', () => {
	window.activateAbTlh029();
});
