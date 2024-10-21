"use strict";

(() => {
	/******************************************************************/
	/* GLOBAL VARS
    /******************************************************************/

	let scData;
	let minSubtotalPriceValue;
	let shippingPrice;

	// Define shippingrates
	window.shippingrates = {
		de: {
			minSubtotalPriceValue: 49,
			priceValue: 4.90,
		},
		at: {
			minSubtotalPriceValue: 69,
			priceValue: 6.90,
		},
		ch: {
			minSubtotalPriceValue: 129,
			priceValue: 12.90,
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

		// unlock checkout button
		window.unlockCheckoutButton();

		checkGeoLocation();

		document.addEventListener("rerenderCart", () => {
			const targetObserver = new MutationObserver((mutationsList, observer) => {
				cheeringBar();

				// if (freeGiftActivate) {
				// 	if (scData.stage === "initial") {
				// 		window.unlockCheckoutButton();
				// 	}
				// } else {
				// 	window.unlockCheckoutButton();
				// }

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

	// window.addEventListener("sc:discount.init", function () {
	// 	console.log("sc:discount.init");

	// 	scData = JSON.parse(sessionStorage.getItem("scDiscountData"));

	// 	dCartCalculation();
	// });

	// window.addEventListener("sc:discount.calculated", () => {
	// 	console.log("sc:discount.calculated");

	// 	scData = JSON.parse(sessionStorage.getItem("scDiscountData"));

	// 	dCartCalculation();
	// });

	// window.addEventListener("sc:discount.remove", () => {
	// 	console.log("sc:discount.remove");

	// 	dCartCalculation();
	// });

	// window.addEventListener("sc:discount.error", () => {
	// 	console.log("sc:discount.error");

	// 	dCartCalculation();
	// });

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
				let currentCountry = json.detected_values.country.handle;
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
		const deliveryBarValueEl = document.querySelector(".js-cart-drawer-delivery-left-value");
		const deliveryBarLeftTextEl = document.querySelector(".CartMessage__Steps__Text-left");
		const deliveryBarFinalTextEl = document.querySelector(".CartMessage__Steps__Text-final");
		const deliveryBarStepLineEl = document.querySelector(".CartMessage__StepsLines__Active");
		const deliveryCostEl = document.querySelector(".Drawer__Footer__Delivery span");
		const cartItems = document.querySelectorAll(".Drawer__Container .CartItemWrapper[data-price]");
		const giftIcon = document.querySelector(".CartMessage__StepsLines__Gift");
		const deliveryIcon = document.querySelector(".CartMessage__StepsLines__Delivery");

		let cartValues = {
			cartTotalPrice: document.querySelector(".Cart__values").dataset.cartTotalPrice,
			cartTotalPriceFloat: document.querySelector(".Cart__values").dataset.cartTotalPriceFloat,
		};


		let noDeliveryItemsTotalPrice = 0;
		let hasItemWithDeliveryRequired = false;
		let deliveryIconPosition;

		// exclude items with no shipping requirement from shipping calculation
		cartItems.forEach((cartItem) => {
			if (cartItem.dataset.reqShipping == "false") {
				noDeliveryItemsTotalPrice += parseFloat(cartItem.dataset.price / 100);
			} else {
				hasItemWithDeliveryRequired = true;
			}
		});

		let subtotalPriceWithoutNoShippingItems = cartValues.cartTotalPriceFloat / 100 - noDeliveryItemsTotalPrice;


		if(hasItemWithDeliveryRequired) {
			if (window.cartDrawerEnableGift) {
				const percentPerEuro = 100 / parseInt(window.cartDrawerMinPriceForGift);
				deliveryBarStepLineEl.style.width = subtotalPriceWithoutNoShippingItems * percentPerEuro + "%";
	
				giftIcon.style.display = "block";
	
				// Delivery icon position
				deliveryIconPosition = (minSubtotalPriceValue * 100) / parseInt(window.cartDrawerMinPriceForGift);
				deliveryIcon.style.left = deliveryIconPosition + "%";
	
				if (minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
					deliveryCostEl.textContent = Shopify.scFormatMoney(window.shippingrates.de.priceValue);
					deliveryBarFinalTextEl.style.display = "none";
					deliveryBarLeftTextEl.style.display = "block";
					deliveryBarValueEl.textContent = Shopify.scFormatMoney(parseFloat(minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems));
				} else {
					deliveryBarFinalTextEl.style.display = "block";
					deliveryBarLeftTextEl.style.display = "none";
					deliveryCostEl.textContent = deliveryCostEl.getAttribute("data-freeshipping-text");
					deliveryBarFinalTextEl.textContent = "Noch " + Shopify.scFormatMoney(parseInt(window.cartDrawerMinPriceForGift) - subtotalPriceWithoutNoShippingItems) + " bis zum Geschenk";
	
					if (subtotalPriceWithoutNoShippingItems >= parseInt(window.cartDrawerMinPriceForGift)) {
						deliveryBarFinalTextEl.innerHTML = "Kostenloser Versand & Geschenk!";
					}
				}
			} else {
				giftIcon.style.display = "none";
	
				if (minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
					deliveryCostEl.textContent = "€" + window.shippingrates.de.priceValue.replace(".", ",");
					deliveryBarFinalTextEl.style.display = "none";
					deliveryBarLeftTextEl.style.display = "block";
					deliveryBarValueEl.textContent =  Shopify.scFormatMoney(parseFloat(minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems));
					deliveryBarStepLineEl.style.width = ((subtotalPriceWithoutNoShippingItems / window.shippingrates.de.minSubtotalPriceValue) * 100).toFixed(2) + "%";
				} else {
					deliveryBarFinalTextEl.style.display = "block";
					deliveryBarLeftTextEl.style.display = "none";
					deliveryCostEl.textContent = deliveryCostEl.getAttribute("data-freeshipping-text");
					deliveryBarStepLineEl.style.width = "100%";
				}
			}
		} else {
			deliveryIcon.style.left = "100%"
			giftIcon.style.display = 'none';
			deliveryPriceValue = 0;
			deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
		}
	};

	/******************************************************************/
	/* FREE GIFT
    /******************************************************************/

	const handleFreeGift = async (cartUpdates) => {};

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

			// Check if update respons is ok
			if (!updateResponse.ok) {
				throw new Error(`Update request failed with status ${updateResponse.status}`);
			}

			const updateJsonData = await updateResponse.json();

			// Page fetch request
			const pageResponse = await fetch(window.location.href);

			if (!pageResponse.ok) {
				throw new Error(`Page fetch failed with status ${pageResponse.status}`);
			}

			const responseText = await pageResponse.text();
			const oldItemsWrapper = document.querySelector(".drawer__inner");
			const html = new DOMParser().parseFromString(responseText, "text/html");
			const newItemsWrapper = html.querySelector(".drawer__inner");
			const cartDrawer = document.querySelector("cart-drawer");
			const oldIconCart = document.querySelector(".cart-count-bubble");
			const newIconCart = html.querySelector(".cart-count-bubble");

			// Update cart drawer if elements are found, otherwise reload the page
			if (newIconCart && newItemsWrapper) {
				oldIconCart.innerHTML = newIconCart.innerHTML;
				oldItemsWrapper.innerHTML = newItemsWrapper.innerHTML;
			} else {
				location.reload();
			}

			// Update cart empty state
			if (updateJsonData.item_count == 0) {
				cartDrawer.classList.add("is-empty");
			} else {
				cartDrawer.classList.remove("is-empty");
			}
		} catch (error) {
			console.error("Error updating the cart:", error);
		}
	};

	/******************************************************************/
	/* DCART
    /******************************************************************/

	const dCartCalculation = () => {
		const cartDrawerElement = document.querySelector(".cart-drawer");

		const dCartObserver = new MutationObserver((mutationsList, observer) => {
			scData = JSON.parse(sessionStorage.getItem("scDiscountData"));

			// do calculation only if discount is added
			if ((scData.stage === "complete" && scData.subtotalCents > 0) || (scData.stage === "initial" && scData.subtotalCents > 0)) {
				const subTotalFormatted = scData?.totalFormatted;
				const totalFormatted = scData?.subtotalFormatted;

				const compareAtPriceElement = document.querySelector(".cart-drawer__footer .totals__subtotal-value-wrapper .totals__subtotal-compare-at-price s");
				const totalPriceElement = document.querySelector(".cart-drawer__footer .totals__subtotal-value-wrapper .totals__subtotal-price-value");

				// compare at price
				if (scData.subtotalCents !== scData.totalCents) {
					compareAtPriceElement.textContent = subTotalFormatted;
				} else {
					compareAtPriceElement.textContent = "";
				}

				// totalprice
				totalPriceElement.textContent = totalFormatted;
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
