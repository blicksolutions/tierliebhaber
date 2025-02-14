(() => {
	const container = document.querySelector('[data-effect-of-ingredient-container]');
	if (!container) return;

	container.setAttribute('data-effect-of-ingredient-container', 'true');

	const button = container.querySelector('[data-effect-of-ingredient-button]');
	if (!button) return;

	button.addEventListener('click', () => {
		container.classList.toggle('open');
	});
})();
