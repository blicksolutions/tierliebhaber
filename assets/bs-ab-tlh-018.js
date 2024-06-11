window.activateAbTlh018 = () => {
	const productItems = document.querySelectorAll('.CollectionInner__Products .ProductItem[data-js-product-item]');
	if (!productItems) return;

	productItems.forEach((productItem, index) => {
		const imageWrapper = productItem.querySelector('.ProductItem__ImageWrapper[tlh-018]');
		if (!imageWrapper) return;

		const productItemSwiper = productItem.querySelector('[data-js-product-item-swiper]');

		const swiper = new Swiper(productItemSwiper, {
			loop: true,
			direction: 'horizontal',
			speed: 300,
			slidesPerView: 1,
			lazyPreloadPrevNext: 2,
		});

		imageWrapper.setAttribute('tlh-018', true);

		if (index == 0) {
			setTimeout(() => {
				swiper.slideNext(1500);

				setTimeout(() => {
					swiper.slideTo(1, 1000);
				}, 500);
			}, 1800);
		}
	});
};

// document.addEventListener('DOMContentLoaded', window.activateAbTlh018);
