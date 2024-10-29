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
	})
}
document.addEventListener('DOMContentLoaded', window.activateAbTlh058)
