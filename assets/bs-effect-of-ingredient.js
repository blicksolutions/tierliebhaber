(() => {
	console.log("GO")
	const container = document.querySelector('[data-effect-of-ingredient-container]')
	console.log(container)
	if (!container) return

	container.setAttribute('data-effect-of-ingredient-container', 'true')

	const button = container.querySelector('[data-effect-of-ingredient-button]')
	if (!button) return

	console.log(container)
	console.log(button)

	button.addEventListener('click', () => {
		container.classList.toggle('open')
	})
})();
