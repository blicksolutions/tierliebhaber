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
				document.querySelector('.bs-hero-black-week__countdown').innerHTML = '<span>Sale has ended!</span>';
				clearInterval(countdownInterval);
			}
		}

		const countdownInterval = setInterval(updateCountdown, 1000);

		updateCountdown();
		blackWeekSwiper();

		countDownCounterElement.classList.add('active');

		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('tlh-057')) {
			window.activateAbTlh057();
		}
	});

	/******************************************************************/
	/* bestseller swiper
	/******************************************************************/

	const blackWeekSwiper = () => {
		const blackWeek = new Swiper(".bs-hero-black-week__swiper", {
			centerInsufficientSlides: true,
			spaceBetween: 16,
			navigation: {
				prevEl: document.querySelector(".bs-hero-black-week .swiper-button-prev"),
				nextEl: document.querySelector(".bs-hero-black-week .swiper-button-next")
			},
			scrollbar: {
				el: document.querySelector(".bs-hero-black-week__swiper .swiper-scrollbar"),
				draggable: true,
			},
			breakpoints: {
				0: {
					slidesPerView: 1.95,
					slidesOffsetBefore: 25,
					slidesOffsetAfter: 25
				},
				768: {
					slidesPerView: 4,
					slidesOffsetBefore: 0,
					slidesOffsetAfter: 0
				},
				992: {
					slidesPerView: 5
				},
			},
		});
	};
})();

/******************************************************************/
/* AB TEST
/******************************************************************/

window.activateAbTlh057 = () => {
	const blackWeekSection = document.querySelector('section.bs-hero-black-week');

	blackWeekSection.classList.add('bs-hero-black-week--b');
};

// custom goal (count clicks on product links
(() => {
	document.addEventListener("DOMContentLoaded", () => {
		const blackWeekProductButtons = document.querySelectorAll('.bs-hero-black-week__product-button a');

		blackWeekProductButtons.forEach((link) => {
			link.addEventListener('click', () => {
				console.log("TRIGGER tlh057 GOAL")
				window['ablyft'].push({
					eventType: 'custom',
					eventName: 'tlh-057-clicks-on-product-links'
				});
			});
		});
	});
})();
