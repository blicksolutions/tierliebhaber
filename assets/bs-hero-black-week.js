(() => {
	document.addEventListener("DOMContentLoaded", () => {
		const targetDate = new Date('December 1, 2024 23:59:59').getTime();
		const countDownCounterElement = document.querySelector('.bs-hero-black-week__countdown-counter');
	
		const updateCountdown = () => {
			const now = new Date().getTime();
			const timeRemaining = targetDate - now;
	
			if (timeRemaining > 0) {
				const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
				const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
	
				document.querySelector('.bs-hero-black-week__countdown-counter-days').textContent = `${days}d`;
				document.querySelector('.bs-hero-black-week__countdown-counter-hours').textContent = `${hours}h`;
				document.querySelector('.bs-hero-black-week__countdown-counter-minutes').textContent = `${minutes}m`;
				document.querySelector('.bs-hero-black-week__countdown-counter-seconds').textContent = `${seconds}s`;
			} else {
				document.querySelector('.bs-hero-black-week__info-countdown').innerHTML = '<span>Sale has ended!</span>';
				clearInterval(countdownInterval);
			}
		}
	
		const countdownInterval = setInterval(updateCountdown, 1000);
	
		updateCountdown();
	
		countDownCounterElement.classList.add('active');
	});

	/******************************************************************/
	/* bestseller swiper
	/******************************************************************/

	const blackWeekSwiper = () => {
		const blackWeek = new Swiper(".bestseller__swiper", {
			slidesPerView: 5,
			centerInsufficientSlides: true,
			spaceBetween: 10,
			allowTouchMove: false,
		});
	};

	/******************************************************************/
	/* counter
	/******************************************************************/

 
})();
