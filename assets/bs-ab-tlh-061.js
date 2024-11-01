window.activateAbTlh061 = () => {
	const reviewsContainer = document.querySelector('#judgeme_product_reviews');
	if(!reviewsContainer) return;

	const reviews = reviewsContainer.querySelectorAll('.jdgm-widget .jdgm-rev-widg .jdgm-rev-widg__reviews .jdgm-rev');	
	const testimonialsSection = document.querySelector('[data-js-tlh-061]');
	const testimonialsWrapper = document.querySelector('[data-js-tlh-061-wrapper]');

	if(!reviews.length) return;

	const reviewWidget = document.querySelector('.jdgm-rev-widg');
	const avgRating = reviewWidget.dataset.averageRating;
	const reviewsNumber = reviewWidget.dataset.numberOfReviews;
	const avgRatingTarget = document.querySelector('.testimonials__rating-product__average span');
	const reviewsNumberTarget = document.querySelector('.testimonials__rating-product__reviews-number span');
	const starRatingWidget = document.querySelector('.jdgm-rev-widg__summary-stars').outerHTML;
	const starRatingWidgetTarget = document.querySelector('.testimonials__rating-product');

	if(starRatingWidgetTarget && avgRatingTarget && reviewsNumberTarget){
		starRatingWidgetTarget.insertAdjacentHTML('afterbegin', starRatingWidget);
		avgRatingTarget.innerHTML = avgRating;
		reviewsNumberTarget.innerHTML = reviewsNumber;
	}

	const effectMetric = document.querySelector('.testimonials__rating-metric[data-js-tlh-061-metric-effect] .testimonials__rating-metric__number');
	const effectMetricRatingThumb = document.querySelector('.testimonials__rating-metric[data-js-tlh-061-metric-effect] .testimonials__rating-metric__thumb');
	const qualityMetric = document.querySelector('.testimonials__rating-metric[data-js-tlh-061-metric-quality] .testimonials__rating-metric__number');
	const qualityMetricRatingThumb = document.querySelector('.testimonials__rating-metric[data-js-tlh-061-metric-quality] .testimonials__rating-metric__thumb');
	const shippingMetric = document.querySelector('.testimonials__rating-metric[data-js-tlh-061-metric-shipping] .testimonials__rating-metric__number');
	const shippingMetricRatingThumb = document.querySelector('.testimonials__rating-metric[data-js-tlh-061-metric-shipping] .testimonials__rating-metric__thumb');

	switch (avgRating * 1) {
		case 5.00:
			effectMetric.innerHTML = avgRating.toFixed(2);
			qualityMetric.innerHTML = avgRating.toFixed(2);
			shippingMetric.innerHTML = avgRating.toFixed(2);
			break;
		case 4.99:
			effectMetric.innerHTML = (avgRating - 0.02).toFixed(2);
			qualityMetric.innerHTML = (avgRating * 1 + 0.01).toFixed(2);
			shippingMetric.innerHTML = avgRating.toFixed(2);
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
		const mutationObserver = new MutationObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.attributeName == 'class' && entry.target.classList.contains('jdgm-rev__timestamp') && !entry.target.classList.contains('jdgm-spinner')) {
					const reviewSlide = document.createElement('div');
					reviewSlide.classList.add('testimonials__card');
					reviewSlide.classList.add('grid-item');

					const icon = review.querySelector('.jdgm-rev__icon').outerHTML;
					const rating = review.querySelector('.jdgm-rev__rating').outerHTML;
					const author = review.querySelector('.jdgm-rev__author').innerText;
					const text = review.querySelector('.jdgm-rev__body').innerText;
					const timestamp = review.querySelector('.jdgm-rev__timestamp').innerText;

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

						const grid = document.querySelector('.testimonials__list.grid')

					    new Masonry( grid, {
							itemSelector: '.grid-item',
							columnWidth: '.grid-item',
							percentPosition: true,
							gutter: 10
						  });
					}
				}
			});
		});

		mutationObserver.observe(review, {
			childList: true,
			subtree: true,
			attributes: true,
		});
	});

	if(testimonialsSection) {
		testimonialsSection.setAttribute('data-js-tlh-061', 'true');
	}

	const reviewsButton = testimonialsSection.querySelector('[data-js-tlh-061-button]');

	reviewsButton.addEventListener('click', () => {
		const element = document.querySelector('#judgeme_product_reviews');
		const headerOffset = 300;
		const elementPosition = element.getBoundingClientRect().top;
		const offsetPosition = elementPosition + window.scrollY - headerOffset;

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth',
		});
	});
};