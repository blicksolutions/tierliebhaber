window.activateAbTlh041 = () => {
	function reformatPrice(text) {
		console.log('reformatPrice');
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

	document.addEventListener('variant:changed', () => {
		setTimeout(() => {
			reformatPricesInNode(document.body);
		}, 100);
	});
};

document.addEventListener('DOMContentLoaded', window.activateAbTlh041);
