window.activateAbTlh058 = () => {
	const productWrapper = document.querySelector('[data-js-tlh-058]')
	if (!productWrapper) return

	productWrapper.setAttribute('data-js-tlh-058', 'true')

	const likeBadges = document.querySelectorAll('[data-js-tlh-058-like-badge]')
	if (!likeBadges) return

	likeBadges.forEach((likeBadge)=>{
		const likeBadgetext = likeBadge.querySelector('[data-js-tlh-058-like-badge-text]')

		likeBadgetext.innerHTML='<s>Samy</s>, <s>Bella</s> und <s>7964 andere Hunde</s> finden dieses Produkt super'

	})

	const stockBars = document.querySelectorAll('[data-js-tlh-058-stock-bar]')
	if (!stockBars) return


	stockBars.forEach((stockBar)=>{
		const title = stockBar.querySelector('.acc-pr39-title')

		if (window.innerWidth <= 768) {
			title.innerText = 'Nur solange der Vorrat reicht!'
		}
		if (window.innerWidth >= 768) {
			title.innerText = 'Verfügbar nur solange der Vorrat reicht!'
		}

		window.addEventListener('resize',() => {
			if (window.innerWidth <= 768) {
				title.innerText = 'Nur solange der Vorrat reicht!'
			}
			if (window.innerWidth >= 768) {
				title.innerText = 'Verfügbar nur solange der Vorrat reicht!'
			}
		})

		const productMeta = document.querySelector('.ProductMeta')
		if (!productMeta || productMeta.getAttribute('data-js-bestseller') == 'true') return

		const likeBadgeStockBarContainer = document.createElement('div')
		likeBadgeStockBarContainer.classList.add('like-stock__container')

		const desktopLikeBadge = document.querySelector('.hidden-pocket[data-js-tlh-058-like-badge]')
		const newDesktopLikeBadge = desktopLikeBadge.cloneNode(true)
		desktopLikeBadge.remove()
		
		const newStockBar = stockBar.cloneNode(true)
		stockBar.remove()

		likeBadgeStockBarContainer.appendChild(newDesktopLikeBadge)
		likeBadgeStockBarContainer.appendChild(newStockBar)
		productMeta.appendChild(likeBadgeStockBarContainer)

		const newStockTitle = newStockBar.querySelector('.acc-pr39-title')

		window.addEventListener('resize',() => {
			if (window.innerWidth <= 768) {
				newStockTitle.innerText = 'Nur solange der Vorrat reicht!'
			}
			if (window.innerWidth >= 768) {
				newStockTitle.innerText = 'Verfügbar nur solange der Vorrat reicht!'
			}
		})

	})

	const sliderContainer = document.querySelector('[data-js-tlh-058-slider]');

	if(!sliderContainer) return;

	sliderContainer.setAttribute('data-js-tlh-058-slider', true)
	const slider = sliderContainer.querySelector('.BenefitsTwo.swiper');

	const swiper = new Swiper(slider, {
		centerInsufficientSlides: true,
		pagination: {
		  el: ".swiper-pagination-benefits-two",
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
				spaceBetween: 102
			}
		},
		simulateTouch: true
	  });
}

document.addEventListener('DOMContentLoaded', window.activateAbTlh058)
