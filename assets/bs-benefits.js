 (() => {

	const slider = document.querySelector('.Benefits.swiper');

	const swiper = new Swiper(slider, {
		centerInsufficientSlides: true,
		pagination: {
		  el: ".swiper-pagination-benefits",
		  clickable: true
		},
		autoHeight: true,
		spaceBetween: 30,
		breakpoints: {
			600: {
				slidesPerView: 2,
				spaceBetween: 40
			},
			1008: {
				slidesPerView: 3,
				spaceBetween: 0
			}
		},
		simulateTouch: true
	  });
})()
