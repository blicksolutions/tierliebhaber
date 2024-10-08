"use strict";

(() => {
	window.activateAbTlh053 = () => {
		const infoTextVC = document.querySelector(".ProductForm__ShippingEta--version-c");
		const infoTextOg = document.querySelector(".ProductForm__ShippingEta");
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes(); 

		const calculateTimeDifference = (currentHours, currentMinutes, targetHours) => {
			const currentTotalMinutes = (currentHours * 60) + currentMinutes;
			const targetTotalMinutes = targetHours * 60;  // Target time is in hours only (12:00 or 24:00)
			
			const diffMinutes = targetTotalMinutes - currentTotalMinutes;
			const hours = Math.floor(diffMinutes / 60);
			const minutes = diffMinutes % 60;
			
			return { hours, minutes };
		}

		const insertContent = (hours, minutes, deliveryDate) => {
			const hoursSpan = infoTextVC.querySelector(".ProductForm__ShippingEta--version-c__hours");
			const minutesSpan = infoTextVC.querySelector(".ProductForm__ShippingEta--version-c__minutes");
			const deliveryDateSpan = infoTextVC.querySelector(".ProductForm__ShippingEta--version-c__delivery-date");

			hoursSpan.innerHTML = hours;
			minutesSpan.innerHTML = minutes;
			deliveryDateSpan.innerHTML = deliveryDate;
		}

		if(hours < 12) {
			const { diffHours, diffMinutes } = calculateTimeDifference(hours, minutes, 12);

			insertContent(diffHours, diffMinutes, "morgen");
		} else {
			const { hours: diffHours, minutes: diffMinutes } = calculateTimeDifference(hours, minutes, 24);

			insertContent(diffHours, diffMinutes, "übermorgen");
		}

		if(infoTextVC && infoTextOg) {
			infoTextVC.style.display = "flex";
			infoTextOg.style.display = "none";
		}
	};
	
	document.addEventListener("DOMContentLoaded", () => {
		window.activateAbTlh053();
	})
})();
