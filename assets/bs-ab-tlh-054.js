window.activateAbTlh054 = () => {
	const productBadgesElement = document.querySelector(".ProductMeta .ProductBadges");

	const applyABAdjustments = () => {
		const productBadgeText = productBadgesElement.querySelector(".ProductBadge__Text");
		const bannerMarkup = () => {
			return `
			<div class="bs-info-badge">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M14.6672 8C14.6672 11.682 11.6823 14.6669 8.00037 14.6669C4.31835 14.6669 1.3335 11.682 1.3335 8C1.3335 4.31799 4.31835 1.33313 8.00037 1.33313C11.6823 1.33313 14.6672 4.31799 14.6672 8ZM8.00037 11.8334C8.27651 11.8334 8.50038 11.6096 8.50038 11.3334V7.33331C8.50038 7.05717 8.27651 6.8333 8.00037 6.8333C7.72422 6.8333 7.50035 7.05717 7.50035 7.33331V11.3334C7.50035 11.6096 7.72422 11.8334 8.00037 11.8334ZM8.00037 4.66656C8.36858 4.66656 8.66705 4.96505 8.66705 5.33325C8.66705 5.70145 8.36858 5.99994 8.00037 5.99994C7.63215 5.99994 7.33368 5.70145 7.33368 5.33325C7.33368 4.96505 7.63215 4.66656 8.00037 4.66656Z" fill="#ABCDBE"/>
				</svg>
				<p class="bs-info-badge__description">
					Für beste Wirkung <strong>4 Wochen vor Silvester</strong> mit der Anwendung beginnen!
				</p>	
			</div>
			`;
		};

		productBadgeText.style.color = "#1C1B1B";
		productBadgesElement.insertAdjacentHTML("afterbegin", bannerMarkup());
	}

	if (productBadgesElement && window.location.href.match(/\/chillout-sticks(\?.*)?$/) || productBadgesElement && window.location.href.includes("chillout-drops")) {
		applyABAdjustments();
	}	
};