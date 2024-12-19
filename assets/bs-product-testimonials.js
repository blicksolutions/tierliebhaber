(() => {
	const targetNode = document.querySelector(".shopify-section:has(.section-polaroid-slider) + .shopify-section:has(.shopify-app-block)");

	if(!targetNode) return;

	const config = { attributes: true, childList: true, subtree: true };

	const observer = new MutationObserver((mutationList, observer) => {
		setTimeout(() => {
			const reviewsContainer = document.querySelector('reviewsio-product-reviews-widget');
			if(!reviewsContainer) return;
		
			const reviews = reviewsContainer.querySelectorAll('.ElementsWidget__list .R-ContentList__item');	
			const testimonialsWrapper = document.querySelector('[data-js-product-testimonials-wrapper]');
		
			if(!reviews.length) return;
		
			const reviewWidget = document.querySelector('.ElementsWidget__inner .header__inner .header__group:first-of-type');
			const avgRating = reviewWidget.querySelector('div:first-of-type').innerText;
			const reviewsNumber = reviewWidget.querySelector('div:nth-of-type(3)').innerText.match(/[\d,\.]+/g);
			const avgRatingTarget = document.querySelector('.bs-product-testimonials__rating-product__average span');
			const reviewsNumberTarget = document.querySelector('.bs-product-testimonials__rating-product__reviews-number span');
			const starRatingWidget = reviewWidget.querySelector('div:nth-of-type(2) .R-RatingStars').outerHTML;
			const starRatingWidgetTarget = document.querySelector('.bs-product-testimonials__rating-product');
		
			if(starRatingWidgetTarget && avgRatingTarget && reviewsNumberTarget){
				starRatingWidgetTarget.insertAdjacentHTML('afterbegin', starRatingWidget);
				avgRatingTarget.innerHTML = avgRating;
				reviewsNumberTarget.innerHTML = reviewsNumber;
			}
		
			const effectMetric = document.querySelector('.bs-product-testimonials__rating-metric[data-js-product-testimonials-metric-effect] .bs-product-testimonials__rating-metric__number');
			const effectMetricRatingThumb = document.querySelector('.bs-product-testimonials__rating-metric[data-js-product-testimonials-metric-effect] .bs-product-testimonials__rating-metric__thumb');
			const qualityMetric = document.querySelector('.bs-product-testimonials__rating-metric[data-js-product-testimonials-metric-quality] .bs-product-testimonials__rating-metric__number');
			const qualityMetricRatingThumb = document.querySelector('.bs-product-testimonials__rating-metric[data-js-product-testimonials-metric-quality] .bs-product-testimonials__rating-metric__thumb');
			const shippingMetric = document.querySelector('.bs-product-testimonials__rating-metric[data-js-product-testimonials-metric-shipping] .bs-product-testimonials__rating-metric__number');
			const shippingMetricRatingThumb = document.querySelector('.bs-product-testimonials__rating-metric[data-js-product-testimonials-metric-shipping] .bs-product-testimonials__rating-metric__thumb');
		
			switch (avgRating * 1) {
				case 5.00:
					effectMetric.innerHTML = avgRating;
					qualityMetric.innerHTML = avgRating;
					shippingMetric.innerHTML = avgRating;
					break;
				case 4.99:
					effectMetric.innerHTML = (avgRating - 0.02).toFixed(2);
					qualityMetric.innerHTML = (avgRating * 1 + 0.01).toFixed(2);
					shippingMetric.innerHTML = avgRating;
					break;
				default:
					effectMetric.innerHTML = (avgRating - 0.03).toFixed(2);
					qualityMetric.innerHTML = (avgRating * 1 + 0.02).toFixed(2);
					shippingMetric.innerHTML = (avgRating * 1 + 0.01).toFixed(2);
			}
		
			if(effectMetricRatingThumb && qualityMetricRatingThumb && shippingMetricRatingThumb) {
				effectMetricRatingThumb.style.width = (effectMetric.innerHTML / 5 * 100) + '%';
				qualityMetricRatingThumb.style.width = (qualityMetric.innerHTML / 5 * 100) + '%';
				shippingMetricRatingThumb.style.width = (shippingMetric.innerHTML / 5 * 100) + '%';
			}
		
			reviews.forEach((review) => {
				const reviewSlide = document.createElement('div');

				reviewSlide.classList.add('bs-product-testimonials__card');
				reviewSlide.classList.add('grid-item');

				const icon = review.querySelector('.R-AvatarThumbnail__inner').outerHTML;
				const rating = review.querySelector('.R-RatingStars').innerHTML;
				const author = review.querySelector('.cssVar-authorName').innerText;
				const text = review.querySelector('.item__inner div div div div + div:nth-of-type(3)').innerText;
				const timestamp = review.querySelector('.item__inner > div:nth-of-type(2) > div:nth-of-type(2)').innerHTML;

				reviewSlide.innerHTML = `
					<div class="testimonial__icon">
						${icon}
					</div>
					<div class="testimonial__rating-time">
						<div class="testimonial__rating">
							${rating}
						</div>
						<div class="testimonial__time">
							${timestamp}
						</div>
					</div>
					<div class="testimonial__author-badge">
						<div class="testimonial__author">
							${author}
						</div>
						<div class="testimonial__badge">
							Verifiziert
						</div>
					</div>
					<div class="testimonial__text">
						“${text}”
					</div>

				`;

				if(testimonialsWrapper) {
					testimonialsWrapper.appendChild(reviewSlide);

					const grid = document.querySelector('.bs-product-testimonials__list.grid')

					new Masonry( grid, {
						itemSelector: '.grid-item',
						columnWidth: '.grid-item',
						percentPosition: true,
						gutter: 10
						});
				}
			});
		
			const reviewsButton = document.querySelector('[data-js-product-testimonials-button]');
		
			reviewsButton.addEventListener('click', () => {
				const element = document.querySelector('reviewsio-product-reviews-widget');
				const headerOffset = 300;
				const elementPosition = element.getBoundingClientRect().top;
				const offsetPosition = elementPosition + window.scrollY - headerOffset;
		
				window.scrollTo({
					top: offsetPosition,
					behavior: 'smooth',
				});
			});
		},1000)

		observer.disconnect();
	});

	observer.observe(targetNode, config);
})();