window.activateAbTlh043 = () => {
	const rechargeInjectionElement = document.querySelector('.rc-widget-injection-parent');
	if (!rechargeInjectionElement) return;
	rechargeInjectionElement.setAttribute('data-js-tlh-043', 'true');

	document.addEventListener('insertMarkUpFinished', () => {
		const oneTimeOptionElement = document.querySelector('[data-option-onetime]');
		const oneTimeLabelElement = oneTimeOptionElement.querySelector('[data-label-onetime]');
		const subscriptionOptionElement = document.querySelector('[data-option-subsave]');
		const subscriptionLabelElement = subscriptionOptionElement.querySelector('[data-label-subsave]');

		const oneTimeSeperator = oneTimeOptionElement.querySelector('[data-js-seperator]');
		const subscriptionSeperator = subscriptionOptionElement.querySelector('[data-js-seperator]');

		if (!oneTimeSeperator || !subscriptionSeperator) {
			const seperator = document.createElement('div');
			seperator.classList.add('label--seperator');
			seperator.setAttribute('data-js-seperator', 'true');

			if (!oneTimeSeperator) {
				oneTimeLabelElement.after(seperator);
			}
			if (!subscriptionSeperator) {
				subscriptionLabelElement.after(seperator);
			}
		}

		const oneTimeBackgroundExtention = oneTimeOptionElement.querySelector('[data-js-background-extention]');
		const subscriptionBackgroundExtention = subscriptionOptionElement.querySelector('[data-js-background-extention]');

		if (!oneTimeBackgroundExtention || !subscriptionBackgroundExtention) {
			const backgroundExtention = document.createElement('div');
			backgroundExtention.classList.add('label--background-extention');
			backgroundExtention.setAttribute('data-js-background-extention', 'true');

			if (!oneTimeBackgroundExtention) {
				oneTimeLabelElement.after(backgroundExtention);
			}
			if (!subscriptionBackgroundExtention) {
				subscriptionLabelElement.after(backgroundExtention);
			}
		}

		const oneTimeCurve = oneTimeOptionElement.querySelector('[data-js-curve]');
		const subscriptionCurve = subscriptionOptionElement.querySelector('[data-js-curve]');

		if (!oneTimeBackgroundExtention || !subscriptionBackgroundExtention) {
			const curveElement = document.createElement('div');
			curveElement.classList.add('label--curve');
			curveElement.setAttribute('data-js-curve', 'true');
			curveElement.innerHTML = `
                <svg
                    viewBox="0 0 41.37738 53.417366"
                    fill="none"
                    id="svg1"
                    >
                    <defs
                        id="defs1" />
                    <sodipodi:namedview
                        id="namedview1"
                        pagecolor="#ffffff"
                        bordercolor="#000000"
                        borderopacity="0.25"
                        inkscape:showpageshadow="2"
                        inkscape:pageopacity="0.0"
                        inkscape:pagecheckerboard="0"
                        inkscape:deskcolor="#d1d1d1"
                        showgrid="false" />
                    <path
                        d="M 40.666606,52.919063 0.71008581,52.815092 c 0,0 -0.44314,-52.31430701 -0.0754,-52.31430701 11.33100019,0 20.47300019,8.72626001 20.47300019,19.43810001 v 13.3993 c 0,10.7696 8.731,19.5001 19.5,19.5001 0.56932,0 0.0589,0.08078 0.0589,0.08078 z"
                        fill="#f5f5f5"
                        id="path1"
                        sodipodi:nodetypes="ccsssscc"
                        inkscape:export-filename="tlh043kurve.svg"
                        inkscape:export-xdpi="96"
                        inkscape:export-ydpi="96"
                        style="stroke-width:1.00157;stroke-dasharray:none" />
                    <path
                        d="m 0.77258581,0.62759209 c 0,0 -0.50564,-0.1268071 -0.1379,-0.1268071 11.33100019,0 20.47300019,8.72626001 20.47300019,19.43810001 v 13.3993 c 0,10.7696 8.731,19.5001 19.5,19.5001 0.56932,0 0.0589,0.08078 0.0589,0.08078 l 2e-5,-2e-6 0.0324,-0.130398"
                        fill="#f5f5f5"
                        id="path2"
                        sodipodi:nodetypes="cssssccc"
                        inkscape:export-filename="tlh043kurve2.svg"
                        inkscape:export-xdpi="96"
                        inkscape:export-ydpi="96"
                        style="display:inline;fill:#000000;fill-opacity:0;stroke:#cccccc;stroke-width:1.00157;stroke-dasharray:none;stroke-opacity:1" />
                    </svg>
                `;

			if (!oneTimeCurve) {
				oneTimeLabelElement.after(curveElement);
			}
			if (!subscriptionCurve) {
				subscriptionLabelElement.after(curveElement);
			}
		}
		const savingsContainer = document.querySelector('[data-js-variant-savings-container]');
		const variantList = document.querySelector('[data-js-variant-selector-list]');

		if (!savingsContainer.classList.contains('variant-savings__container--align-right')) {
			const isFullWidth = variantList.querySelector('.VariantSelector__ListItem--full-width');
			const isWraped = variantList.querySelector('.VariantSelector__ListItem--wrap');

			if (isFullWidth == undefined && isWraped == undefined) {
				savingsContainer.classList.add('variant-savings__container--align-right');
			}
		}

		const bestsellerOption = variantList.querySelector('[data-js-variant-selector-item]:last-child');
		const bestsellerItem = variantList.querySelector('[data-js-bestseller-item]');

		if (bestsellerItem == undefined) {
			const bestsellerElement = document.createElement('div');
			bestsellerElement.classList.add('bestseller');
			bestsellerElement.setAttribute('data-js-bestseller-item', 'true');
			bestsellerElement.innerHTML = `
            <div class="bestseller-container">
                <svg class="bestseller__triangle-left" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 0L9.33013 9.75H0.669873L5 0Z" fill="#D4AF37"/>
                </svg>
                <p class="bestseller__text">
                    Bestseller
                </p>
                <svg class="bestseller__triangle-right" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 0L9.33013 9.75H0.669873L5 0Z" fill="#D4AF37"/>
                </svg>
            </div>
            `;

			bestsellerOption.appendChild(bestsellerElement);
		}
	});
};
