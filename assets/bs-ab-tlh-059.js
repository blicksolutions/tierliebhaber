const insertSection = (snippetMarkup) => {
	const productMetaElement = document.querySelector(".ProductMeta");

	if(productMetaElement) {
		productMetaElement.insertAdjacentHTML("beforebegin",snippetMarkup)
	}
};

window.activateAbTlh059B = () => {
	let randomNumber = Math.floor(Math.random() * (150 - 50 + 1) + 50);
	const sessionStorageValue = window.sessionStorage.getItem(`current-visitors-${productTitle.toLowerCase()}`);

	if(sessionStorageValue) {
		let maxValue = sessionStorageValue * 1 + 10;
		let minValue = sessionStorageValue - 10;

		if(maxValue >= 150) {
			const maxValueOffset = maxValue - 150;
			minValue = minValue - maxValueOffset;

			randomNumber = Math.floor(Math.random() * (150 - minValue + 1) + minValue);
		} else if(minValue <= 50) {
			const minValueOffset = 50 - minValue;
			maxValue = maxValue + minValueOffset;

			randomNumber = Math.floor(Math.random() * (maxValue - 50 + 1) + 50);
		} else {
			randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
		}

		sessionStorage.setItem(`current-visitors-${productTitle.toLowerCase()}`, randomNumber);
	} else {
		sessionStorage.setItem(`current-visitors-${productTitle.toLowerCase()}`, randomNumber);
	}

	const content = `
	<div class="ProductMeta__visitor-ping" ping-current-users>
		<svg class="ProductMeta__visitor-ping__icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
			<path d="M10.0005 8C10.0005 9.1046 9.10507 10 8.00047 10C6.89594 10 6.00049 9.1046 6.00049 8C6.00049 6.8954 6.89594 6 8.00047 6C9.10507 6 10.0005 6.8954 10.0005 8Z" stroke="#525252" stroke-width="1.47439" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M8.00082 3.33325C5.01572 3.33325 2.48886 5.29517 1.63934 7.99992C2.48885 10.7047 5.01572 12.6666 8.00082 12.6666C10.9859 12.6666 13.5128 10.7047 14.3623 7.99992C13.5128 5.29519 10.9859 3.33325 8.00082 3.33325Z" stroke="#525252" stroke-width="1.47439" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		<span class="ProductMeta__visitor-ping__text">
			<span>${randomNumber} Kunden</span> sehen sich dieses Produkt im Moment an
		</span>
	</div>
	`;

	insertSection(content);
}

window.activateAbTlh059C = () => {
	let randomNumber = Math.floor(Math.random() * (100 - 50 + 1) + 50);
	const sessionStorageValue = window.sessionStorage.getItem(`recent-buy-${productTitle.toLowerCase()}`) * 1;

	if(sessionStorageValue) {
		let maxValue = sessionStorageValue * 1 + 3; 

		if(maxValue >= 150) {
			randomNumber = 150;
		} else {
			randomNumber = Math.floor(Math.random() * (maxValue - sessionStorageValue + 1) + sessionStorageValue);
		}

		sessionStorage.setItem(`recent-buy-${productTitle.toLowerCase()}`, randomNumber);
	} else {
		sessionStorage.setItem(`recent-buy-${productTitle.toLowerCase()}`, randomNumber);
	}

	const content = `
	<div class="ProductMeta__visitor-ping" ping-recent-buys>
		<svg class="ProductMeta__visitor-ping__icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M11.7926 12.6001H2.20744C1.78113 12.6001 1.45423 12.2228 1.51443 11.8014L2.31454 6.20129C2.36354 5.85619 2.65894 5.60006 3.00755 5.60006H3.49966V7.00008C3.49966 7.38648 3.81326 7.70009 4.19966 7.70009C4.58677 7.70009 4.89967 7.38648 4.89967 7.00008V5.60006H9.09972V7.00008C9.09972 7.38648 9.41332 7.70009 9.79973 7.70009C10.1868 7.70009 10.4997 7.38648 10.4997 7.00008V5.60006H10.9925C11.3411 5.60006 11.6365 5.85619 11.6855 6.20129L12.4856 11.8014C12.5458 12.2228 12.219 12.6001 11.7926 12.6001ZM4.89967 3.50004C4.89967 2.34223 5.84188 1.40002 6.99969 1.40002C8.15821 1.40002 9.09972 2.10002 9.09972 3.50004V4.20005H4.89967V3.50004ZM13.9858 12.4021L12.9855 5.40199C12.8875 4.71248 12.2967 4.20005 11.5994 4.20005H10.4997V3.50004C10.4997 1.40002 8.92962 0 6.99969 0C5.07047 0 3.49966 1.57012 3.49966 3.50004V4.20005H2.61415C1.91764 4.20005 1.11262 4.71248 1.01392 5.40199L0.0143138 12.4021C-0.106088 13.2456 0.548417 14.0002 1.40033 14.0002H12.5998C13.4517 14.0002 14.1062 13.2456 13.9858 12.4021Z" fill="#525252"/>
		</svg>
		<span class="ProductMeta__visitor-ping__text">
			<span>${randomNumber} Mal</span> in den letzten 24 Stunden gekauft
		</span>
	</div>
	`;

	insertSection(content);
}

// document.addEventListener("DOMContentLoaded", () => {
// 	window.activateAbTlh059C();
// 	window.activateAbTlh059B();
// })
