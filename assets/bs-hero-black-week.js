(() => {
	document.addEventListener("DOMContentLoaded", () => {


		const countdownInterval = setInterval(updateCountdown, 1000);

		updateCountdown();
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

	const targetDate = new Date('December 1, 2024 23:59:59').getTime();
    const countDownCounterElement = document.querySelector('.bs-black-week-collection-banner__countdown__counter');

    const updateCountdown = () => {
        const now = new Date().getTime();
        const timeRemaining = targetDate - now;

        if (timeRemaining > 0) {
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            document.querySelector('.bs-black-week-collection-banner__countdown__counter__days').textContent = `${days}d`;
            document.querySelector('.bs-black-week-collection-banner__countdown__counter__hours').textContent = `${hours}h`;
            document.querySelector('.bs-black-week-collection-banner__countdown__counter__minutes').textContent = `${minutes}m`;
            document.querySelector('.bs-black-week-collection-banner__countdown__counter__seconds').textContent = `${seconds}s`;
        } else {
            document.querySelector('.bs-black-week-collection-banner__countdown').innerHTML = '<span>Sale has ended!</span>';
            clearInterval(countdownInterval);
        }
    }
	

})();
