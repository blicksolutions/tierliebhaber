window.activateAbTlh009 = () => {
	const mutationObserver = new MutationObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.target.classList.contains('rc-widget-injection-parent')) {
				const subscroptionOption = document.querySelector('.rc-option__subsave[data-option-subsave]');
				if (!subscroptionOption) return;

				if (window.Shopify.isUserLoggedIn == true) {
					setTimeout(() => {
						subscroptionOption.click();
					}, 100);
					console.log('subscroptionOption');
				}
			}
		});
	});

	const rechargeInjectionElement = document.querySelector('.rc-widget-injection-parent');

	if (rechargeInjectionElement != undefined) {
		mutationObserver.observe(rechargeInjectionElement, {
			childList: true,
			subtree: true,
			attributes: true,
		});
	}
};
