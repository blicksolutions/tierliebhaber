window.activateAbTlh063 = () => {
	const container = document.querySelector('[data-effect-of-ingredient-container]')
	if(!container) return

	container.setAttribute('data-js-tlh-063-container', 'true')

	const button = container.querySelector('[data-effect-of-ingredient-button]')
	if(!button) return

	button.addEventListener('click', ()=>{
		container.classList.toggle('open')
	})
};
