window.activateAbTlh059B = () => {

}

window.activateAbTlh059C = () => {
	const productMetaElement = document.querySelector(".ProductMeta");
	const content = `
	<div class="ProductMeta__visitor-ping">
		<svg class="ProductMeta__visitor-ping__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
			<g fill="none" stroke="black" stroke-width="2">
				<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
				<circle cx="12" cy="12" r="3"/>
			</g>
		</svg>
		<span class="ProductMeta__visitor-ping__text">
			<span>${Math.floor(Math.random() * (150 - 50 + 1) + 50)}</span> Kunden sehen sich dieses Produkt im Moment an
		</span>
	</div>
	`

	if(productMetaElement) {
		productMetaElement.insertAdjacentHTML("beforebegin",content)
	}
}

document.addEventListener("DOMContentLoaded", () => {
	window.activateAbTlh059B();
	window.activateAbTlh059C();
})
