window.activateAbTlh052 = () => {
	const cartDrawer = document.querySelector('#sidebar-cart[data-js-tlh-052]')
	console.log('cartDrawer', cartDrawer)
	if (!cartDrawer) return

	cartDrawer.setAttribute('data-js-tlh-052', 'true')

	const mutationObserver = new MutationObserver(entries => {
        entries.forEach(entry => {
            if (entry.target.classList.contains('Drawer__Main')) {
				console.log('droggelbecher')
            }
        });
    });

	mutationObserver.observe(cartDrawer, {
		childList: true,
		subtree: true,
		attributes: true
	});
    
};

document.addEventListener('DOMContentLoaded', window.activateAbTlh052)
