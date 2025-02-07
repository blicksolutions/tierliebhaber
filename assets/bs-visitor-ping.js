"use strict";

(() => {
    const visitorPingComponent = document.querySelector('.ProductMeta__visitor-ping');
    const spanTarget = document.querySelector('.ProductMeta__visitor-ping__text span');

	if (productTitle) {
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

        spanTarget.innerHTML = randomNumber;
        visitorPingComponent.classList.add('active');
	}
})();