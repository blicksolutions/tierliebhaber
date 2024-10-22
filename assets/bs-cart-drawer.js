"use strict";

(() => {
	/******************************************************************/
	/* GLOBAL VARS
    /******************************************************************/

	let scData;
	let minSubtotalPriceValue;
	let shippingPrice;
	let currentCountry

	// Define shippingrates
	window.shippingrates = {
		de: {
			minSubtotalPriceValue: 49,
			priceValue: 4.9,
		},
		at: {
			minSubtotalPriceValue: 69,
			priceValue: 6.9,
		},
		ch: {
			minSubtotalPriceValue: 129,
			priceValue: 12.9,
		},
		otherLocations: {
			country: null,
			minSubtotalPriceValue: 170,
			priceValue: 15.9,
			price: null,
			freeShipping: false,
			message: null,
		},
	};

	// Place dcart
	window.scThemeConfig = {
		cartDiscountSelector: {
			path: "#shopify-section-cart-template section div.Container div.PageContent form.Cart footer.Cart__Footer div.Cart__Recap p.Cart__Total",
			type: 1,
		},
		cartTotalSelector: {
			path: "#shopify-section-cart-template section div.Container div.PageContent form.Cart footer.Cart__Footer div.Cart__Recap p.Cart__Total span",
			type: 0,
		},
		ajaxDicountSelector: {
			path: "#sidebar-cart form.Cart div.Drawer__Footer div.Drawer__Footer__Inner div.Drawer__Footer__Coupon div.Drawer__Footer__Coupon-content div.Drawer__Footer__Coupon-dcart",
			type: 1,
		},
		ajaxTotalSelector: {
			path: "#sidebar-cart form.Cart div.Drawer__Footer div.Drawer__Footer__Inner div.Drawer__Footer__Subtotal span.Drawer__Footer__SubtotalPrice",
			type: 0,
		},
	};

	document.addEventListener("DOMContentLoaded", async () => {
		scData = JSON.parse(sessionStorage.getItem("scDiscountData"));
		const cartDrawer = document.querySelector("#sidebar-cart");

		// Call functions on first load
		window.unlockCheckoutButton();
		checkGeoLocation();
		toggleDCart()

		document.addEventListener("rerenderCart", () => {
			const targetObserver = new MutationObserver((mutationsList, observer) => {
				/* Call functions on cart drawer changes */
				/*****************************************/

				// call only if discount code has been entered
				if(scData?.stage === "complete") {
					dCartCalculation();
				}

				cheeringBar();
				toggleDCart();

				// handle free gift, if enabled. Else unlock checkout button
				if (window.cartDrawerEnableGift) {
					handleFreeGift();
				} else {
					window.unlockCheckoutButton();
				}

				observer.disconnect();
			});

			if (cartDrawer) {
				targetObserver.observe(cartDrawer, {
					childList: true,
					subtree: true,
				});
			}
		});
	});

	/******************************************************************/
	/* DCART EVENT LISTENER
    /******************************************************************/

	window.addEventListener("sc:discount.init", function () {
		console.log("sc:discount.init");

		dCartCalculation();
	});

	window.addEventListener("sc:discount.calculated", () => {
		console.log("sc:discount.calculated");

		const martinCartData = JSON.parse(sessionStorage.getItem("DCART:cart"));
		console.log("MARTIN LOG")
		console.log(martinCartData)

		dCartCalculation();
	});

	window.addEventListener("sc:discount.remove", () => {
		console.log("sc:discount.remove");

		dCartCalculation();
	});

	window.addEventListener("sc:discount.error", () => {
		console.log("sc:discount.error");

		dCartCalculation();
	});

	/******************************************************************/
	/* WINDOW FUNCTIONS - LOCK/UNLOCK CHECKOUT BUTTON
    /******************************************************************/

	window.lockCheckoutButton = () => {
		// console.log("LOCK BUTTON")
		document.querySelector(".Cart__Checkout").disabled = true;
	};

	window.unlockCheckoutButton = () => {
		// console.log("UNLOCK BUTTON")
		if (document.querySelector(".Cart__Checkout") !== null) {
			document.querySelector(".Cart__Checkout").disabled = false;

			document.querySelectorAll(".CartItemWrapper.disable-click").forEach((disableClick) => {
				disableClick.classList.remove("disable-click");
			});
		}
	};

	/******************************************************************/
	/* GEOLOCATION
    /******************************************************************/

	const checkGeoLocation = () => {
		fetch("/browsing_context_suggestions.json")
			.then((response) => response.json())
			.then((json) => {
				currentCountry = json.detected_values.country.handle;

				switch (currentCountry) {
					case "DE":
						minSubtotalPriceValue = window.shippingrates.de.minSubtotalPriceValue;
						shippingPrice = window.shippingrates.de.priceValue;
						break;
					case "AT":
						minSubtotalPriceValue = window.shippingrates.at.minSubtotalPriceValue;
						shippingPrice = window.shippingrates.at.priceValue;
						break;
					case "CH":
						minSubtotalPriceValue = window.shippingrates.ch.minSubtotalPriceValue;
						shippingPrice = window.shippingrates.ch.priceValue;
						break;
					default:
						minSubtotalPriceValue = window.shippingrates.otherLocations.minSubtotalPriceValue;
						shippingPrice = window.shippingrates.otherLocations.priceValue;
						break;
				}

				cheeringBar();
			});
	};

	/******************************************************************/
	/* CHEERING BAR
    /******************************************************************/

	const cheeringBar = () => {
		const deliveryIcon = document.querySelector(".CartMessage__StepsLines__Delivery");
		const cartItems = document.querySelectorAll(".Drawer__Container .CartItemWrapper[data-price]");

		let cartValues = {
			cartTotalPriceFloat: document.querySelector(".Cart__values").dataset.cartTotalPriceFloat,
		};

		let noDeliveryItemsTotalPrice = 0;
		let hasItemWithDeliveryRequired = false;

		if (document.querySelector(".Cart__Empty") !== null) {
			document.querySelector(".CartMessage__Steps").style.opacity = 0;
		} else {
			document.querySelector(".CartMessage__Steps").style.opacity = 1;
		}

		// exclude items with no shipping requirement from shipping calculation
		cartItems.forEach((cartItem) => {
			if (cartItem.dataset.reqShipping == "false") {
				noDeliveryItemsTotalPrice += parseFloat(cartItem.dataset.price / 100);
			} else {
				hasItemWithDeliveryRequired = true;
			}
		});



		console.log("COUNTRY: " + currentCountry);
		console.log("MINSUBTOTAL: " + minSubtotalPriceValue);

		if (hasItemWithDeliveryRequired) {

			switch (currentCountry) {
				case 'DE':
					handleCheeringBarDE(cartValues, noDeliveryItemsTotalPrice);
					break;
				case 'AT':
					handleCheeringBarAT(cartValues, noDeliveryItemsTotalPrice);
					break;
				case 'CH':
					handleCheeringBarCH(cartValues, noDeliveryItemsTotalPrice);
					break;
				default:
			}
		
		} else {
			deliveryIcon.style.left = "100%";
			giftIcon.style.display = "none";
		}
	};

	const handleCheeringBarDE = (cartValues, noDeliveryItemsTotalPrice) => {
		const deliveryBarValueEl = document.querySelector(".js-cart-drawer-delivery-left-value");
		const deliveryBarLeftTextEl = document.querySelector(".CartMessage__Steps__Text-left");
		const deliveryBarFinalTextEl = document.querySelector(".CartMessage__Steps__Text-final");
		const deliveryBarStepLineEl = document.querySelector(".CartMessage__StepsLines__Active");
		const deliveryCostEl = document.querySelector(".Drawer__Footer__Delivery span");
		const giftIcon = document.querySelector(".CartMessage__StepsLines__Gift");
		const deliveryIcon = document.querySelector(".CartMessage__StepsLines__Delivery");

		let deliveryIconPosition;
		let subtotalPriceWithoutNoShippingItems = cartValues.cartTotalPriceFloat - noDeliveryItemsTotalPrice;

		if (window.cartDrawerEnableGift) {
			const percentPerEuro = 100 / parseInt(window.cartDrawerMinPriceForGift);
			deliveryBarStepLineEl.style.width = subtotalPriceWithoutNoShippingItems * percentPerEuro + "%";

			giftIcon.style.display = "block";

			// Delivery icon position
			deliveryIconPosition = (minSubtotalPriceValue * 100) / parseInt(window.cartDrawerMinPriceForGift);
			deliveryIcon.style.left = deliveryIconPosition + "%";

			if (minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
				let remainingPriceFreeShipping = parseFloat(minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems);

				deliveryBarFinalTextEl.style.display = "none";
				deliveryBarLeftTextEl.style.display = "block";
				deliveryBarValueEl.textContent = Shopify.scFormatMoney(remainingPriceFreeShipping * 100);
			} else {
				let remainingPriceFreeGift = parseFloat(window.cartDrawerMinPriceForGift) - parseFloat(subtotalPriceWithoutNoShippingItems);

				deliveryBarFinalTextEl.style.display = "block";
				deliveryBarLeftTextEl.style.display = "none";
				deliveryCostEl.textContent = deliveryCostEl.getAttribute("data-freeshipping-text");
				deliveryBarFinalTextEl.textContent = "Noch " + Shopify.scFormatMoney(remainingPriceFreeGift * 100) + " bis zum Geschenk";

				if (subtotalPriceWithoutNoShippingItems >= parseInt(window.cartDrawerMinPriceForGift)) {
					deliveryBarFinalTextEl.innerHTML = "Kostenloser Versand & Geschenk!";
				}
			}
		} else {
			giftIcon.style.display = "none";

			if (minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
				let remainingPrice = parseFloat(minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems);
				deliveryBarFinalTextEl.style.display = "none";
				deliveryBarLeftTextEl.style.display = "block";
				deliveryBarValueEl.textContent = Shopify.scFormatMoney(remainingPrice * 100);
				deliveryBarStepLineEl.style.width = ((subtotalPriceWithoutNoShippingItems / minSubtotalPriceValue) * 100).toFixed(2) + "%";
			} else {
				deliveryBarFinalTextEl.style.display = "block";
				deliveryBarLeftTextEl.style.display = "none";
				deliveryCostEl.textContent = deliveryCostEl.getAttribute("data-freeshipping-text");
				deliveryBarStepLineEl.style.width = "100%";
			}
		}
	}

	const handleCheeringBarAT = (cartValues, noDeliveryItemsTotalPrice) => {
		if (window.cartDrawerEnableGift) {
			const percentPerEuro = 100 / parseInt(window.cartDrawerMinPriceForGift); // 1.33333
			const giftItemInCart = document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]');

			if (giftItemInCart && sessionStorage.getItem('giftItemAdded') != 'true') {
				subtotalPriceWithoutNoShippingItems -= window.cartDrawerGiftPrice;
			}

			deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems * percentPerEuro) + '%'
			giftIcon.style.display = 'block';

			deliveryIconPosition = (window.shippingrates.at.minSubtotalPriceValue * 100) / parseInt(window.cartDrawerMinPriceForGift) ;
			deliveryIcon.style.left = deliveryIconPosition + "%";

			if (window.shippingrates.at.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
				deliveryCostEl.textContent = '€' + window.shippingrates.at.priceValue.replace('.', ',');
				deliveryPriceValue = parseFloat(window.shippingrates.at.priceValue);
				deliveryBarFinalTextEl.style.display = 'none';
				deliveryBarLeftTextEl.style.display = 'block';
				deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.at.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
				window.cartBarWidth = ((subtotalPriceWithoutNoShippingItems / window.shippingrates.at.minSubtotalPriceValue * 100) - 15).toFixed(2) + '%';
				window.cartBarValue = '€' + (parseFloat(window.shippingrates.at.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
			} else {
				deliveryBarFinalTextEl.style.display = 'block';
				deliveryBarLeftTextEl.style.display = 'none';
				deliveryPriceValue = 0;
				deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
				deliveryBarFinalTextEl.textContent = 'Noch ' + '€' + (parseInt(window.cartDrawerMinPriceForGift) - subtotalPriceWithoutNoShippingItems).toFixed(2).replace('.', ',') + ' bis zum Geschenk';

				if (subtotalPriceWithoutNoShippingItems >= parseInt(window.cartDrawerMinPriceForGift)) {
					deliveryBarFinalTextEl.innerHTML = 'Kostenloser Versand & Geschenk!';
				}
			}
		} else {
			giftIcon.style.display = 'none';

			if (window.shippingrates.at.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
				deliveryCostEl.textContent = '€' + window.shippingrates.at.priceValue.replace('.', ',');
				deliveryPriceValue = parseFloat(window.shippingrates.at.priceValue);
				deliveryBarFinalTextEl.style.display = 'none';
				deliveryBarLeftTextEl.style.display = 'block';
				deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.at.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
				deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems / window.shippingrates.at.minSubtotalPriceValue * 100).toFixed(2) + '%';
				window.cartBarWidth = (subtotalPriceWithoutNoShippingItems / window.shippingrates.at.minSubtotalPriceValue * 100).toFixed(2) + '%';
				window.cartBarValue = '€' + (parseFloat(window.shippingrates.at.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
			} else {
				deliveryBarFinalTextEl.style.display = 'block';
				deliveryBarLeftTextEl.style.display = 'none';
				deliveryPriceValue = 0;
				deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
				deliveryBarStepLineEl.style.width = '100%';
			}
		}
	}

	const handleCheeringBarCH = (cartValues, noDeliveryItemsTotalPrice) => {
		const deliveryBarValueEl = document.querySelector(".js-cart-drawer-delivery-left-value");
		const deliveryBarLeftTextEl = document.querySelector(".CartMessage__Steps__Text-left");
		const deliveryBarFinalTextEl = document.querySelector(".CartMessage__Steps__Text-final");
		const deliveryBarStepLineEl = document.querySelector(".CartMessage__StepsLines__Active");
		const deliveryCostEl = document.querySelector(".Drawer__Footer__Delivery span");
		const giftIcon = document.querySelector(".CartMessage__StepsLines__Gift");
		const deliveryIcon = document.querySelector(".CartMessage__StepsLines__Delivery");

		let deliveryIconPosition;
		let subtotalPriceWithoutNoShippingItems = cartValues.cartTotalPriceFloat - noDeliveryItemsTotalPrice;

		if (window.cartDrawerEnableGift) {
			const giftIcon = document.querySelector('.CartMessage__StepsLines__Gift');
			let giftIconPosition;
			let percentPerEuro = 100 / parseInt(window.cartDrawerMinPriceForGift);
			const giftItemInCart = document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]');

			if (giftItemInCart && sessionStorage.getItem('giftItemAdded') != 'true') {
				subtotalPriceWithoutNoShippingItems -= window.cartDrawerGiftPrice;
			}

			if (minSubtotalPriceValue > window.cartDrawerMinPriceForGift) {
				percentPerEuro = 100 / parseInt(minSubtotalPriceValue);
				deliveryIcon.style.left = "100%";

				giftIconPosition = (parseInt(window.cartDrawerMinPriceForGift) * percentPerEuro);
				giftIcon.style.left = giftIconPosition + "%";
				giftIcon.style.right = 'auto';

				if (subtotalPriceWithoutNoShippingItems < window.cartDrawerMinPriceForGift) {
					let remainingPriceFreeGift = parseFloat(window.cartDrawerMinPriceForGift) - parseFloat(subtotalPriceWithoutNoShippingItems);

					deliveryBarFinalTextEl.style.display = 'block';
					deliveryBarLeftTextEl.style.display = 'none';
					//deliveryCostEl.textContent = '€' + priceValue.replace('.', ',');
					deliveryBarFinalTextEl.textContent = 'Noch ' + Shopify.scFormatMoney(remainingPriceFreeGift * 100) + ' bis zum Geschenk';
				} else {
					let remainingPriceFreeShipping = parseFloat(minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems);

					deliveryBarFinalTextEl.style.display = 'none';
					deliveryBarLeftTextEl.style.display = 'block';

					if(deliveryBarValueEl !== null) {
						deliveryBarValueEl.textContent = Shopify.scFormatMoney(remainingPriceFreeShipping * 100);
					}
					
					if (subtotalPriceWithoutNoShippingItems >= minSubtotalPriceValue) {
						deliveryBarLeftTextEl.innerHTML = 'Kostenloser Versand & Geschenk!';
						deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
					}
				}
			} else {
				deliveryIconPosition = (minSubtotalPriceValue * 100) / parseInt(window.cartDrawerMinPriceForGift) ;
				deliveryIcon.style.left = deliveryIconPosition + "%";

				if (minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
					let remainingPriceFreeShipping = parseFloat(minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems);

					deliveryBarFinalTextEl.style.display = 'none';
					deliveryBarLeftTextEl.style.display = 'block';
					deliveryBarValueEl.textContent = Shopify.scFormatMoney(remainingPriceFreeShipping * 100);
				} else {
					let remainingPriceFreeGift = parseFloat(window.cartDrawerMinPriceForGift) - parseFloat(subtotalPriceWithoutNoShippingItems);

					deliveryBarFinalTextEl.style.display = 'block';
					deliveryBarLeftTextEl.style.display = 'none';
					deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
					deliveryBarFinalTextEl.textContent = 'Noch ' + Shopify.scFormatMoney(remainingPriceFreeGift * 100) + ' bis zum Geschenk';

					if (subtotalPriceWithoutNoShippingItems >= parseInt(window.cartDrawerMinPriceForGift)) {
						deliveryBarFinalTextEl.innerHTML = 'Kostenloser Versand & Geschenk!';
					}
				}
			}

			deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems * percentPerEuro) + '%'

		} else {
			giftIcon.style.display = 'none';

			if (minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
				let remainingPriceFreeShipping = parseFloat(minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems);

				deliveryBarFinalTextEl.style.display = 'none';
				deliveryBarLeftTextEl.style.display = 'block';
				deliveryBarValueEl.textContent = Shopify.scFormatMoney(remainingPriceFreeShipping * 100);
				deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems / minSubtotalPriceValue * 100).toFixed(2) + '%';
			} else {
				deliveryBarFinalTextEl.style.display = 'block';
				deliveryBarLeftTextEl.style.display = 'none';
				deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
				deliveryBarStepLineEl.style.width = '100%';
			}
		}
	}

	/******************************************************************/
	/* FREE GIFT
    /******************************************************************/

	const handleFreeGift = async () => {
		let cartValues = {
			cartTotalPriceFloat: document.querySelector(".Cart__values").dataset.cartTotalPriceFloat,
		};

		let subtotalPrice;

		if (document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]')) {
			subtotalPrice = cartValues.cartTotalPriceFloat - window.cartDrawerGiftPrice;
		} else {
			subtotalPrice = cartValues.cartTotalPriceFloat;
		}

		const giftContained = document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]') !== null;

		if (subtotalPrice < window.cartDrawerMinPriceForGift && giftContained) {
			// console.log("REMOVE GIFT")
			const cartUpdates = {
				updates: {
					[window.cartDrawerGiftVariantId]: 0,
				},
			};

			updateCart(cartUpdates);
		} else if (!giftContained && subtotalPrice >= window.cartDrawerMinPriceForGift) {
			// console.log("ADD GIFT")
			const cartUpdates = {
				updates: {
					[window.cartDrawerGiftVariantId]: 1,
				},
			};

			updateCart(cartUpdates);
		} else {
			window.unlockCheckoutButton();
		}
	};

	/******************************************************************/
	/* HELPER: UPDATE CART
    /******************************************************************/

	const updateCart = async (cartUpdates) => {
		try {
			// Cart fetch update request
			const updateResponse = await fetch(window.Shopify.routes.root + "cart/update.js", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "no-cache",
				},
				body: JSON.stringify(cartUpdates),
			});

			// Check if update response is ok
			if (!updateResponse.ok) {
				throw new Error(`Update request failed with status ${updateResponse.status}`);
			}

			// Page fetch request
			const pageResponse = await fetch(window.location.href);

			if (!pageResponse.ok) {
				throw new Error(`Page fetch failed with status ${pageResponse.status}`);
			}

			const responseText = await pageResponse.text();
			const oldItemsWrapper = document.querySelector(".Cart__ItemList");
			const html = new DOMParser().parseFromString(responseText, "text/html");
			const newItemsWrapper = html.querySelector(".Cart__ItemList");

			if (newItemsWrapper) {
				oldItemsWrapper.innerHTML = newItemsWrapper.innerHTML;
			} else {
				location.reload();
			}

			// Unlock checkout button after timeout
			setTimeout(() => {
				window.unlockCheckoutButton();
			}, 1000);
		} catch (error) {
			console.error("Error updating the cart:", error);
		}
	};

	/******************************************************************/
	/* DCART
    /******************************************************************/

	const toggleDCart = () => {
		if(document.querySelector("#sidebar-cart .Drawer__Footer .Drawer__Footer__Coupon-title")) {
			const couponTitle = document.querySelector("#sidebar-cart .Drawer__Footer .Drawer__Footer__Coupon-title");

			couponTitle.addEventListener("click", () => {
				document.querySelector("#sidebar-cart").classList.toggle("Drawer__Footer__CouponActive")
			})
		}
	}

	const dCartCalculation = () => {
		const cartDrawerElement = document.querySelector("#sidebar-cart");

		const dCartObserver = new MutationObserver((mutationsList, observer) => {
			scData = JSON.parse(sessionStorage.getItem("scDiscountData"));

			// do calculation only if discount is added
			if ((scData.stage === "complete" && scData.subtotalCents > 0) || (scData.stage === "initial" && scData.subtotalCents > 0)) {
				if(scData?.code) {
					const couponPercentage = document.querySelector('#sidebar-cart .Drawer__Footer__Coupon-percentage');
					const saving = parseFloat(scData?.discount?.amount) * 100;
					couponPercentage.textContent = Shopify.scFormatMoney(saving);
				}
			}

			observer.disconnect();
		});

		if (cartDrawerElement) {
			dCartObserver.observe(cartDrawerElement, {
				childList: true,
				subtree: true,
			});
		}
	};
})();
