window.activateAbTlh035 = () => {
	const productMeta = document.querySelector('.ProductMeta');
	if (!productMeta) return;

	const isBestseller = productMeta.getAttribute('data-js-bestseller');

	if (isBestseller == 'true') {
		const pdpStockBar = document.querySelector('.pdp-stock-bar');
		const taxNotice = document.querySelector('.ProductMeta__TaxNotice');
		const reviews = productMeta.querySelector('.jdgm-widget');
		const desktopLikeBadge = productMeta.querySelector('.LikeBadge.hidden-pocket.-Initialized');

		const newStockBar = pdpStockBar.cloneNode(true);
		const newdesktopLikeBadge = desktopLikeBadge.cloneNode(true);
		newdesktopLikeBadge.classList.add('tlh-035');
		pdpStockBar.remove();
		reviews.remove();
		taxNotice.after(newStockBar);
		taxNotice.after(newdesktopLikeBadge);

		productMeta.setAttribute('data-js-tlh-035', true);
	} else return;
};
