window.activateAbTlh029 = () => {
	const bestsellerProductItemId = window.Shopify.collectionBestsellerProductId;
	if (!bestsellerProductItemId) return;

	const bestSellerProductCard = document.querySelector(`.CollectionInner__Products .ProductItem[data-js-product-item="${bestsellerProductItemId}"]`);
	if (!bestSellerProductCard) return;

	const bestSellerItem = bestSellerProductCard.querySelector('.ProductItem__Wrapper.ProductBadge__Bestseller');

	bestSellerItem.setAttribute('data-js-tlh-029', 'true');
};

document.addEventListener('DOMContentLoaded', () => {
	window.activateAbTlh029();
});
