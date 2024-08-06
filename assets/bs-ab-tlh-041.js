window.activateAbTlh041 = () => {
	function reformatPrice(text) {
		return text.replace(/€\s*([0-9]+(?:[.,][0-9]{1,3})?(?:[.,][0-9]{2})?)/g, '$1€');
	}

	function reformatPricesInNode(node) {
		if (node.nodeType === Node.TEXT_NODE) {
			node.nodeValue = reformatPrice(node.nodeValue);
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			node.childNodes.forEach(reformatPricesInNode);
		}
	}

	reformatPricesInNode(document.body);

	const pdpPriceListElement = document.querySelector('.ProductMeta__PriceList');

	if (pdpPriceListElement != undefined) {
		const mutationObserver = new MutationObserver((entries) => {
			reformatPricesInNode(document.body);
		});

		mutationObserver.observe(pdpPriceListElement, {
			childList: true,
			subtree: true,
			attributes: true,
		});
	}
};
