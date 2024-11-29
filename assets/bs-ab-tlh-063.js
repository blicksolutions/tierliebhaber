window.activateAbTlh063 = () => {
	const container = document.querySelector('[data-js-tlh-063-container]')
	if(!container) return

	container.setAttribute('data-js-tlh-063-container', 'true')

	const button = container.querySelector('[data-js-tlh-063-button]')
	if(!button) return

	button.addEventListener('click', ()=>{
		container.classList.toggle('open')
	})
};
