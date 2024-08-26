window.activateAbTlh040 = () => {
	const productHandle = window.location.pathname.split('/').slice(-1).toString();
	let bestseller;

	switch (productHandle) {
		case 'dentalspray':
			bestseller = true;
			break;

		case 'dentalspray-katzen-1':
			bestseller = true;
			break;

		case 'gras-kotfresser-drops-2':
			bestseller = true;
			break;

		default:
			bestseller = false;
			break;
	}

	if (bestseller == false) return;

	const reviewsContainer = document.querySelector('#judgeme_product_reviews');
	if (!reviewsContainer) return;

	const reviews = reviewsContainer.querySelectorAll('.jdgm-widget .jdgm-rev-widg .jdgm-rev-widg__reviews .jdgm-rev');
	const testimonialsSection = document.querySelector('[data-js-tlh-040]');
	const testimonialsWrapper = testimonialsSection.querySelector('[data-js-tlh-040-swiper-wrapper]');

	reviews.forEach((review) => {
		const mutationObserver = new MutationObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.attributeName == 'class' && entry.target.classList.contains('jdgm-rev__timestamp') && !entry.target.classList.contains('jdgm-spinner')) {
					const reviewSlide = document.createElement('div');
					reviewSlide.classList.add('testimonials__slide');
					reviewSlide.classList.add('swiper-slide');

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
					testimonialsWrapper.appendChild(reviewSlide);
				}
			});
		});

		mutationObserver.observe(review, {
			childList: true,
			subtree: true,
			attributes: true,
		});
	});

	const swiper = new Swiper('[data-js-tlh-040-swiper]', {
		// Optional parameters
		direction: 'horizontal',
		slidesPerView: 1.3,
		spaceBetween: 10,
		slidesOffsetAfter: 24,
		slidesOffsetBefore: 24,
		breakpoints: {
			768: {
				slidesPerView: 3,
				slidesOffsetAfter: 0,
				slidesOffsetBefore: 0,
				spaceBetween: 15,
			},
		},

		// Navigation arrows
		navigation: {
			nextEl: '.testimonials__swiper-button-next',
			prevEl: '.testimonials__swiper-button-prev',
		},

		// And if we need scrollbar
		scrollbar: {
			el: '.testimonials__swiper-scrollbar',
		},
	});

	testimonialsSection.setAttribute('data-js-tlh-040', 'true');

	const reviewsButton = testimonialsSection.querySelector('[data-js-tlh-040-button]');

	reviewsButton.addEventListener('click', () => {
		var element = document.querySelector('#judgeme_product_reviews');
		var headerOffset = 300;
		var elementPosition = element.getBoundingClientRect().top;
		var offsetPosition = elementPosition + window.scrollY - headerOffset;

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth',
		});
	});
};

document.addEventListener('DOMContentLoaded', window.activateAbTlh040);
