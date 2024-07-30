window.activateAbTlh038 = () => {
	const setGiftStepVisibility = () => {
		const giftIcon = document.querySelector(".CartMessage__StepsLines__Gift img");
		const giftInfo = document.querySelector(".CartMessage__StepsLines__Gift span");

		if (giftIcon && giftInfo) {
			giftIcon.style.display = "none";
			giftInfo.style.display = "block";
		}
	};

	setGiftStepVisibility();

	document.addEventListener("rerenderingFinished", () => {
		setGiftStepVisibility();
	});
};
