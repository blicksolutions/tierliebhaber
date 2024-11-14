const shippingEtaComponent = document.querySelector(".bs-shipping-eta");

if(shippingEtaComponent) {
	const now = new Date();
	const hours = now.getHours();
	const minutes = now.getMinutes(); 

	const formatDate = () => {
		const futureDate = new Date(now);
		futureDate.setDate(futureDate.getDate() + 3);

		const day = String(futureDate.getDate()).padStart(2, '0');
		const month = String(futureDate.getMonth() + 1).padStart(2, '0');
		const year = futureDate.getFullYear();

		return `${day}.${month}.${year}`;
	}

	const calculateTimeDifference = (currentHours, currentMinutes, targetHours) => {
		const currentTotalMinutes = (currentHours * 60) + currentMinutes;
		const targetTotalMinutes = targetHours * 60;
		
		const diffMinutes = targetTotalMinutes - currentTotalMinutes;
		let hours = Math.floor(diffMinutes / 60);
		const minutes = diffMinutes % 60;

		if(targetHours === 24) {
			hours = hours + 12;
		}
		
		return { hours, minutes };
	}

	const insertContent = (hours, minutes, deliveryDate) => {
		const hoursSpan = shippingEtaComponent.querySelector(".ProductForm__ShippingEta--version-c__hours");
		const minutesSpan = shippingEtaComponent.querySelector(".ProductForm__ShippingEta--version-c__minutes");
		const deliveryDateSpan = shippingEtaComponent.querySelector(".ProductForm__ShippingEta--version-c__delivery-date");

		if(hoursSpan, minutesSpan, deliveryDateSpan) {
			hoursSpan.innerHTML = hours;
			minutesSpan.innerHTML = minutes;
			deliveryDateSpan.innerHTML = deliveryDate;
		}
	}

	if(hours < 12) {
		const { hours: diffHours, minutes: diffMinutes } = calculateTimeDifference(hours, minutes, 12);

		insertContent(diffHours, diffMinutes, "übermorgen");
	} else {
		const { hours: diffHours, minutes: diffMinutes } = calculateTimeDifference(hours, minutes, 24);
		const formattedDate = formatDate();

		insertContent(diffHours, diffMinutes, formattedDate);
	}
}
