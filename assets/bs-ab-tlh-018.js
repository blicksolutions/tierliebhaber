window.activateAbTlh018 = () => {
	const productItems = document.querySelectorAll('.CollectionInner__Products .ProductItem[data-js-product-item]');
	if (!productItems) return;

	const animateSwiper = (swiper) => {
		console.log('swiper', swiper);
		setTimeout(() => {
			swiper.slideNext(300);
			console.log('300', 300);
			setTimeout(() => {
				swiper.slideTo(1, 300);
			}, 200);
			console.log('200', 200);
		}, 150);
	};

	const triggerFirstSlider = () => {
		const firstCollectionSlider = document.querySelectorAll('.CollectionInner__Products .ProductItem__Swiper .swiper-wrapper')[0];
		firstCollectionSlider.style.transform = 'translate3d(-35%, 0px, 0px)';

		setTimeout(() => {
			firstCollectionSlider.style.transform = 'translate3d(0px, 0px, 0px)';
		}, 500);
	};

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
