window.activateAbTlh029 = () => {
	const bestSellerItem = document.querySelector('.CollectionInner__Products .ProductItem__Wrapper.ProductBadge__Bestseller');
	console.log('bestSellerItem', bestSellerItem);
	if (!bestSellerItem) return;

	bestSellerItem.setAttribute('data-js-tlh-029', 'true');
};

document.addEventListener('DOMContentLoaded', () => {
	window.activateAbTlh029();
});
