"use strict";

(() => {
  /******************************************************************/
  /* GLOBAL VARS
    /******************************************************************/

  let scData;
  let minSubtotalPriceValue;
  let shippingPrice;
  let currentCountry;

  const cartMessageSteps = document.querySelector(".CartMessage__Steps");
  const deliveryBarValueEl = document.querySelector(
    ".js-cart-drawer-delivery-left-value"
  );
  const deliveryBarLeftTextEl = document.querySelector(
    ".CartMessage__Steps__Text-left"
  );
  const deliveryBarFinalTextEl = document.querySelector(
    ".CartMessage__Steps__Text-final"
  );
  const deliveryBarStepLineEl = document.querySelector(
    ".CartMessage__StepsLines__Active"
  );
  const giftIcon = document.querySelector(".CartMessage__StepsLines__Gift");
  const deliveryIcon = document.querySelector(
    ".CartMessage__StepsLines__Delivery"
  );

  /******************************************************************/
  /* PLACE DCART
    /******************************************************************/

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
  };

  /******************************************************************/
  /* DOMContentLoaded
    /******************************************************************/

  document.addEventListener("DOMContentLoaded", async () => {
    scData = JSON.parse(sessionStorage.getItem("scDiscountData"));
    const cartDrawer = document.querySelector("#sidebar-cart");

    // Call functions on first load
    window.unlockCheckoutButton();
    //console.log("unlock in DOMCONTENTLOADED");

    checkGeoLocation();
    toggleDCart();

    document.addEventListener("rerenderCart", () => {
      const targetObserver = new MutationObserver((mutationsList, observer) => {
        /* Call functions on cart drawer changes */
        /*****************************************/

        totalCalculation(false);

        // call only if discount code has been entered
        if (scData?.stage === "complete") {
          dCartCalculation();
        }

        cheeringBar();
        showHideCheeringBar();
        toggleDCart();
        // handle free gift, if enabled. Else unlock checkout button
        if (
          window.cartDrawerEnableGift &&
          (currentCountry === "DE" ||
            currentCountry === "AT" ||
            currentCountry === "CH" )
        ) {
          handleFreeGift();
        } else {
          window.unlockCheckoutButton();
          //console.log("unlock when Gift if not enabled");
        }

        // handle other locations
        if (
          currentCountry !== "DE" &&
          currentCountry !== "AT" &&
          currentCountry !== "CH"
        ) {
          handleOtherLocations();
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
    // console.log("sc:discount.init");

    dCartCalculation();
  });

  window.addEventListener("sc:discount.calculated", () => {
    // console.log("sc:discount.calculated");

    dCartCalculation();
  });

  window.addEventListener("sc:discount.remove", () => {
    // console.log("sc:discount.remove");

    dCartCalculation();
  });

  window.addEventListener("sc:discount.error", () => {
    // console.log("sc:discount.error");

    dCartCalculation();
  });

  /******************************************************************/
  /* WINDOW FUNCTIONS - LOCK/UNLOCK CHECKOUT BUTTON
    /******************************************************************/

  window.lockCheckoutButton = () => {
    const checkoutButton = document.querySelector(".Cart__Checkout");
    if (checkoutButton) {
      checkoutButton.disabled = true;
    }
  };

  window.unlockCheckoutButton = () => {
    const checkoutButton = document.querySelector(".Cart__Checkout");
    if (checkoutButton) {
      checkoutButton.disabled = false;

      document
        .querySelectorAll(".CartItemWrapper.disable-click")
        .forEach((disableClick) => {
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
            minSubtotalPriceValue =
              window.shippingrates.de.minSubtotalPriceValue;
            shippingPrice = window.shippingrates.de.priceValue;
            break;
          case "AT":
            minSubtotalPriceValue =
              window.shippingrates.at.minSubtotalPriceValue;
            shippingPrice = window.shippingrates.at.priceValue;
            break;
          case "CH":
            minSubtotalPriceValue =
              window.shippingrates.ch.minSubtotalPriceValue;
            shippingPrice = window.shippingrates.ch.priceValue;
            break;
          default:
            minSubtotalPriceValue = 0;
            shippingPrice = 0;
            break;
        }

        cheeringBar();
      });
  };

  /******************************************************************/
  /* HANDLE OTHER LOCATIONS
    /******************************************************************/

  const handleOtherLocations = () => {
    const cartMessageSteps = document.querySelector("#sidebar-cart .CartMessage__Steps");
    const drawerFooter = document.querySelector("#sidebar-cart .Drawer__Footer");
    const drawerFooterTotal = document.querySelector("#sidebar-cart .Drawer__Footer__Total");
    const drawerFooterDelivery = document.querySelector("#sidebar-cart .Drawer__Footer__Delivery");

    if (cartMessageSteps) {
      cartMessageSteps.style.display = "none";
    }

    if (drawerFooter) {
      drawerFooter.style.height = "259px";
    }

    if (drawerFooterTotal) {
      drawerFooterTotal.style.display = "none";
    }

    if (drawerFooterDelivery) {
      drawerFooterDelivery.innerHTML = "* Die Versandkosten werden im Checkout berechnet.";
      drawerFooterDelivery.style.bottom = "32px";
      drawerFooterDelivery.style.lineHeight = "20px";
    }
  };

  /******************************************************************/
  /* CHEERING BAR
    /******************************************************************/

  const cheeringBar = () => {
    const cartItems = document.querySelectorAll(
      ".Drawer__Container .CartItemWrapper[data-price]"
    );
    let subtotalPrice = parseFloat(
      document.querySelector(".Cart__values")?.dataset.cartTotalPriceFloat || 0
    );

    let noDeliveryItemsTotalPrice = 0;
    let hasItemWithDeliveryRequired = false;

    if (scData?.stage === "complete") {
      subtotalPrice = parseFloat(scData?.totalCents / 100);
    }

    // Exclude items with no shipping requirement from shipping calculation
    cartItems.forEach((cartItem) => {
      if (cartItem.dataset.reqShipping == "false") {
        noDeliveryItemsTotalPrice += parseFloat(cartItem.dataset.price / 100);
      } else {
        hasItemWithDeliveryRequired = true;
      }
    });

    // console.log("COUNTRY: " + currentCountry);
    // console.log("MINSUBTOTAL: " + minSubtotalPriceValue);

    if (hasItemWithDeliveryRequired) {
      switch (currentCountry) {
        case "DE":
        case "AT":
          handleCheeringBar(subtotalPrice, noDeliveryItemsTotalPrice);
          break;
        case "CH":
          handleCheeringBarCH(subtotalPrice, noDeliveryItemsTotalPrice);
          break;
        default:
          handleCheeringBarOtherLocation(
            subtotalPrice,
            noDeliveryItemsTotalPrice
          );
          break;
      }
    } else {
      if (deliveryIcon) {
        deliveryIcon.style.left = "100%";
      }

      if (giftIcon) {
        giftIcon.style.display = "none";
      }

      if (deliveryBarStepLineEl) {
        deliveryBarStepLineEl.style.width = "0%";
      }

      if (deliveryBarValueEl) {
        deliveryBarValueEl.innerHTML = Shopify.scFormatMoney(
          minSubtotalPriceValue * 100
        );
      }
    }
  };

  const handleCheeringBar = (subtotalPrice, noDeliveryItemsTotalPrice) => {
    let deliveryIconPosition;
    let subtotalPriceWithoutNoShippingItems =
      subtotalPrice - noDeliveryItemsTotalPrice;

    if (window.cartDrawerEnableGift) {
      const percentPerEuro = 100 / parseInt(window.cartDrawerMinPriceForGift);
      if (deliveryBarStepLineEl) {
        deliveryBarStepLineEl.style.width =
          subtotalPriceWithoutNoShippingItems * percentPerEuro + "%";
      }

      if (giftIcon) {
        giftIcon.style.display = "block";
      }

      // Delivery icon position
      deliveryIconPosition =
        (minSubtotalPriceValue * 100) /
        parseInt(window.cartDrawerMinPriceForGift);
      if (deliveryIcon) {
        deliveryIcon.style.left = deliveryIconPosition + "%";
      }

      // Cheerin Bar styles only for AT
      if (currentCountry === "AT" && cartMessageSteps && giftIcon) {
        cartMessageSteps.style.height = "105px";
        const giftIconSpan = giftIcon.querySelector("span");
        if (giftIconSpan) {
          giftIconSpan.style.width = "60px";
          giftIconSpan.style.lineHeight = "12px";
          giftIconSpan.style.bottom = "-10px";
        }
      }

      if (minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
        let remainingPriceFreeShipping =
          parseFloat(minSubtotalPriceValue) -
          parseFloat(subtotalPriceWithoutNoShippingItems);

        if (deliveryBarFinalTextEl) {
          deliveryBarFinalTextEl.style.display = "none";
        }
        if (deliveryBarLeftTextEl) {
          deliveryBarLeftTextEl.style.display = "block";
        }
        if (deliveryBarValueEl) {
          deliveryBarValueEl.textContent = Shopify.scFormatMoney(
            remainingPriceFreeShipping * 100
          );
        }
      } else {
        let remainingPriceFreeGift =
          parseFloat(window.cartDrawerMinPriceForGift) -
          parseFloat(subtotalPriceWithoutNoShippingItems);

        if (deliveryBarFinalTextEl) {
          deliveryBarFinalTextEl.style.display = "block";
          deliveryBarFinalTextEl.textContent =
            "Noch " +
            Shopify.scFormatMoney(remainingPriceFreeGift * 100) +
            " bis zum Geschenk";
        }
        if (deliveryBarLeftTextEl) {
          deliveryBarLeftTextEl.style.display = "none";
        }

        if (
          subtotalPriceWithoutNoShippingItems >=
            parseInt(window.cartDrawerMinPriceForGift) &&
          deliveryBarFinalTextEl
        ) {
          deliveryBarFinalTextEl.innerHTML = "Kostenloser Versand & Geschenk!";
        }
      }
    } else {
      if (giftIcon) {
        giftIcon.style.display = "none";
      }
      if (deliveryIcon) {
        deliveryIcon.style.left = "100%";
      }

      if (minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
        let remainingPrice =
          parseFloat(minSubtotalPriceValue) -
          parseFloat(subtotalPriceWithoutNoShippingItems);
        if (deliveryBarFinalTextEl) {
          deliveryBarFinalTextEl.style.display = "none";
        }
        if (deliveryBarLeftTextEl) {
          deliveryBarLeftTextEl.style.display = "block";
        }
        if (deliveryBarValueEl) {
          deliveryBarValueEl.textContent = Shopify.scFormatMoney(
            remainingPrice * 100
          );
        }
        if (deliveryBarStepLineEl) {
          deliveryBarStepLineEl.style.width =
            (
              (subtotalPriceWithoutNoShippingItems / minSubtotalPriceValue) *
              100
            ).toFixed(2) + "%";
        }
      } else {
        if (deliveryBarFinalTextEl) {
          deliveryBarFinalTextEl.style.display = "block";
        }
        if (deliveryBarLeftTextEl) {
          deliveryBarLeftTextEl.style.display = "none";
        }
        if (deliveryBarStepLineEl) {
          deliveryBarStepLineEl.style.width = "100%";
        }
      }
    }
  };

  const handleCheeringBarCH = (subtotalPrice, noDeliveryItemsTotalPrice) => {
    let subtotalPriceWithoutNoShippingItems =
      subtotalPrice - noDeliveryItemsTotalPrice;

    if (window.cartDrawerEnableGift) {
      const giftIcon = document.querySelector(".CartMessage__StepsLines__Gift");
      let giftIconPosition;
      let percentPerEuro = 100 / parseInt(window.cartDrawerMinPriceForGift);

      percentPerEuro = 100 / parseInt(minSubtotalPriceValue);
      giftIconPosition =
        parseInt(window.cartDrawerMinPriceForGift) * percentPerEuro;

      if (giftIcon) {
        giftIcon.style.left = giftIconPosition + "%";
        giftIcon.style.right = "auto";
        giftIcon.style.display = "block";
      }
      if (deliveryIcon) {
        deliveryIcon.style.left = "100%";
      }

      if (
        subtotalPriceWithoutNoShippingItems < window.cartDrawerMinPriceForGift
      ) {
        let remainingPriceFreeGift =
          parseFloat(window.cartDrawerMinPriceForGift) -
          parseFloat(subtotalPriceWithoutNoShippingItems);

        if (deliveryBarFinalTextEl) {
          deliveryBarFinalTextEl.style.display = "block";
          deliveryBarFinalTextEl.textContent =
            "Noch " +
            Shopify.scFormatMoney(remainingPriceFreeGift * 100) +
            " bis zum Geschenk";
        }
        if (deliveryBarLeftTextEl) {
          deliveryBarLeftTextEl.style.display = "none";
        }
      } else {
        let remainingPriceFreeShipping =
          parseFloat(minSubtotalPriceValue) -
          parseFloat(subtotalPriceWithoutNoShippingItems);

        if (deliveryBarFinalTextEl) {
          deliveryBarFinalTextEl.style.display = "none";
        }
        if (deliveryBarLeftTextEl) {
          deliveryBarLeftTextEl.style.display = "block";
        }

        if (subtotalPriceWithoutNoShippingItems >= minSubtotalPriceValue && deliveryBarLeftTextEl) {
          deliveryBarLeftTextEl.innerHTML = "Kostenloser Versand & Geschenk!";
        } else if (deliveryBarLeftTextEl) {
          deliveryBarLeftTextEl.textContent =
            "Noch " +
            Shopify.scFormatMoney(remainingPriceFreeShipping * 100) +
            " bis zum kostenlosen Versand";
        }
      }

      if (deliveryBarStepLineEl) {
        deliveryBarStepLineEl.style.width =
          subtotalPriceWithoutNoShippingItems * percentPerEuro + "%";
      }
    } else {
      if (giftIcon) {
        giftIcon.style.display = "none";
      }
      if (deliveryIcon) {
        deliveryIcon.style.left = "100%";
      }

      if (minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
        let remainingPriceFreeShipping =
          parseFloat(minSubtotalPriceValue) -
          parseFloat(subtotalPriceWithoutNoShippingItems);

        if (deliveryBarFinalTextEl) {
          deliveryBarFinalTextEl.style.display = "none";
        }
        if (deliveryBarLeftTextEl) {
          deliveryBarLeftTextEl.style.display = "block";
        }
        if (deliveryBarValueEl) {
          deliveryBarValueEl.textContent = Shopify.scFormatMoney(
            remainingPriceFreeShipping * 100
          );
        }
        if (deliveryBarStepLineEl) {
          deliveryBarStepLineEl.style.width =
            (
              (subtotalPriceWithoutNoShippingItems / minSubtotalPriceValue) *
              100
            ).toFixed(2) + "%";
        }
      } else {
        if (deliveryBarFinalTextEl) {
          deliveryBarFinalTextEl.style.display = "block";
        }
        if (deliveryBarLeftTextEl) {
          deliveryBarLeftTextEl.style.display = "none";
        }
        if (deliveryBarStepLineEl) {
          deliveryBarStepLineEl.style.width = "100%";
        }
      }
    }
  };

  const handleCheeringBarOtherLocation = (
    subtotalPrice,
    noDeliveryItemsTotalPrice
  ) => {
    let subtotalPriceWithoutNoShippingItems =
      subtotalPrice - noDeliveryItemsTotalPrice;

    if (giftIcon) {
      giftIcon.style.display = "none";
    }
    if (deliveryIcon) {
      deliveryIcon.style.left = "100%";
    }

    if (minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
      let remainingPriceFreeShipping =
        parseFloat(minSubtotalPriceValue) -
        parseFloat(subtotalPriceWithoutNoShippingItems);

      if (deliveryBarFinalTextEl) {
        deliveryBarFinalTextEl.style.display = "none";
      }
      if (deliveryBarLeftTextEl) {
        deliveryBarLeftTextEl.style.display = "block";
      }
      if (deliveryBarValueEl) {
        deliveryBarValueEl.textContent = Shopify.scFormatMoney(
          remainingPriceFreeShipping * 100
        );
      }
      if (deliveryBarStepLineEl) {
        deliveryBarStepLineEl.style.width =
          (
            (subtotalPriceWithoutNoShippingItems / minSubtotalPriceValue) *
            100
          ).toFixed(2) + "%";
      }
    } else {
      if (deliveryBarFinalTextEl) {
        deliveryBarFinalTextEl.style.display = "block";
      }
      if (deliveryBarLeftTextEl) {
        deliveryBarLeftTextEl.style.display = "none";
      }
      if (deliveryBarStepLineEl) {
        deliveryBarStepLineEl.style.width = "100%";
      }
    }
  };

  const showHideCheeringBar = () => {
    const cartItems = document.querySelectorAll(
      ".Drawer__Container .CartItemWrapper[data-price]"
    );
    const cartMessageSteps = document.querySelector(".CartMessage__Steps");

    // Show/hide cheering bar
    if (cartItems.length === 0 && cartMessageSteps) {
      cartMessageSteps.style.opacity = 0;
    } else if (cartMessageSteps) {
      cartMessageSteps.style.opacity = 1;
    }
  };

  /******************************************************************/
  /* FREE GIFT
    /******************************************************************/

  const handleFreeGift = async () => {
    const cartItems = document.querySelectorAll(
      ".Drawer__Container .CartItemWrapper[data-price]"
    );
    let subtotalPrice = parseFloat(
      document.querySelector(".Cart__values")?.dataset.cartTotalPriceFloat || 0
    );
    let noDeliveryItemsTotalPrice = 0;

    cartItems.forEach((cartItem) => {
      if (cartItem.dataset.reqShipping == "false") {
        noDeliveryItemsTotalPrice += parseFloat(cartItem.dataset.price / 100);
      }
    });

    subtotalPrice = subtotalPrice - noDeliveryItemsTotalPrice;

    try {
      const cartResponse = await fetch("/cart.js");
      const cart = await cartResponse.json();

      const giftContained = cart.items.some(
        (cartItem) =>
          cartItem.variant_id === parseInt(window.cartDrawerGiftVariantId)
      );

      /** PRODUCT SPECIFIC GIFTS **/
      // CREATE ARRAY OF GIFTS TO ADD
      const triggeringCartItems = document.querySelectorAll(
        ".CartItemWrapper[data-triggers]"
      );
      const triggeringItemsSet = [];

      triggeringCartItems.forEach((triggerItem) => {
        const triggerItemQty = parseInt(
          triggerItem.querySelector(".QuantitySelector__CurrentQuantity")
            ?.value || 0
        );
        const triggeredGiftId = parseInt(triggerItem.dataset.triggers);
        const existingItem = triggeringItemsSet.find(
          (item) => item.id === triggeredGiftId
        );

        if (existingItem) {
          existingItem.qty += triggerItemQty;
        } else {
          triggeringItemsSet.push({
            id: triggeredGiftId,
            qty: triggerItemQty,
          });
        }
      });

      // CHECK WHETHER THERE ARE GIFTS WHICH SHOULDN'T BE ADDED BECAUSE A TRIGGER ITEM IS MISSING
      const giftItems = document.querySelectorAll(
        ".CartItemWrapper.cartGiftItem"
      );

      giftItems.forEach((giftItem) => {
        const giftItemVariantId = parseInt(giftItem.dataset.variantId);
        const triggerItem = document.querySelector(
          '.CartItemWrapper[data-triggers="' + giftItemVariantId + '"]'
        );

        if (
          triggerItem == null &&
          giftItemVariantId != parseInt(window.cartDrawerGiftVariantId)
        ) {
          triggeringItemsSet.push({ id: giftItemVariantId, qty: 0 });
        }
      });

      /** END PRODUCT SPECIFIC GIFTS **/

      if (subtotalPrice < window.cartDrawerMinPriceForGift && giftContained) {
        // console.log("REMOVE GIFT")

        const cartUpdates = {
          updates: {
            [window.cartDrawerGiftVariantId]: 0,
          },
        };

        triggeringItemsSet.forEach((item) => {
          cartUpdates.updates[item.id] = item.qty;
        });

        await updateCart(cartUpdates);
      } else if (
        !giftContained &&
        subtotalPrice >= window.cartDrawerMinPriceForGift
      ) {
        // console.log("ADD GIFT")

        const cartUpdates = {
          updates: {
            [window.cartDrawerGiftVariantId]: 1,
          },
        };

        triggeringItemsSet.forEach((item) => {
          cartUpdates.updates[item.id] = item.qty;
        });

        await updateCart(cartUpdates);
      } else if (Object.keys(triggeringItemsSet).length > 0) {
        // console.log("ELSE ONLY CHECK OTHER GIFTS")

        const cartUpdates = {
          updates: {},
        };

        triggeringItemsSet.forEach((item) => {
          cartUpdates.updates[item.id] = item.qty;
        });

        if (Object.keys(cartUpdates.updates).length > 0) {
          await updateCart(cartUpdates);
        }
      } else {
        window.unlockCheckoutButton();
        // console.log("unlock in handle freegift");
      }
    } catch (error) {
      console.error("Error in handleFreeGift:", error);
      window.unlockCheckoutButton();
    }
  };

  /******************************************************************/
  /* HELPER: UPDATE CART
    /******************************************************************/

  const updateCart = async (cartUpdates) => {
    try {
      // Cart fetch update request
      const updateResponse = await fetch(
        window.Shopify.routes.root + "cart/update.js",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify(cartUpdates),
        }
      );

      // Check if update response is ok
      if (!updateResponse.ok) {
        throw new Error(
          `Update request failed with status ${updateResponse.status}`
        );
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

      if (newItemsWrapper && oldItemsWrapper) {
        oldItemsWrapper.innerHTML = newItemsWrapper.innerHTML;
      } else {
        location.reload();
      }

      // Unlock checkout button after timeout
      setTimeout(() => {
        window.unlockCheckoutButton();
        
        // console.log("unlock after updating free gift");
      }, 1000);
    } catch (error) {
      console.error("Error updating the cart:", error);
      setTimeout(() => {
        window.unlockCheckoutButton();
        // console.log("unlock after updating free gift");
      }, 1000);
    }
  };

  /******************************************************************/
  /* TOTAL CALCULATION
    /******************************************************************/

  const totalCalculation = (isDcart) => {
    const cartItems = document.querySelectorAll(
      ".Drawer__Container .CartItemWrapper[data-price]"
    );
    const subTotalPriceCompareAtEl = document.querySelector(
      ".Drawer__Footer__Subtotal .Drawer__Footer__SubtotalPrice .Drawer__Footer__SubtotalPrice_Compare-at"
    );
    const subTotalPriceEl = document.querySelector(
      ".Drawer__Footer__Subtotal .Drawer__Footer__SubtotalPrice .Drawer__Footer__SubtotalPrice_Value"
    );
    const deliveryCostEl = document.querySelector(
      ".Drawer__Footer__Delivery span"
    );
    const totalPriceEl = document.querySelector(".Drawer__Footer__Total span");
    const cartValuesEl = document.querySelector(".Cart__values");

    let subTotalPrice;
    let scCompareAtPrice;
    let noDeliveryItemsTotalPrice = 0;

    if (isDcart) {
      subTotalPrice = scData?.subtotalCents / 100;
      scCompareAtPrice = scData?.totalCents / 100;
    } else {
      subTotalPrice = parseFloat(
        cartValuesEl?.dataset.cartTotalPriceFloat || 0
      );
    }

    let shippingRate = shippingPrice;
    let hasItemWithDeliveryRequired = false;

    // Exclude items with no shipping requirement from shipping calculation
    cartItems.forEach((cartItem) => {
      if (cartItem.dataset.reqShipping == "false") {
        noDeliveryItemsTotalPrice += parseFloat(cartItem.dataset.price / 100);
      } else {
        hasItemWithDeliveryRequired = true;
      }
    });

    let subtotalPriceWithoutNoShippingItems =
      subTotalPrice - noDeliveryItemsTotalPrice;

    if (subTotalPrice > 0) {
      if (
        subtotalPriceWithoutNoShippingItems >= parseFloat(minSubtotalPriceValue)
      ) {
        shippingRate = 0;
      }

      let subtotalPriceFormatted = Shopify.scFormatMoney(subTotalPrice * 100);
      console.log("subtotalPriceWithoutNoShippingItems", subtotalPriceWithoutNoShippingItems);
      console.log("minSubtotalPriceValue", parseFloat(minSubtotalPriceValue));
      if (
        subtotalPriceWithoutNoShippingItems >= parseFloat(minSubtotalPriceValue)
      ) {
        let totalPrice = parseFloat(subTotalPrice) + parseFloat(shippingRate);
        let totalPriceFormatted = Shopify.scFormatMoney(
          totalPrice.toFixed(2) * 100
        );

        if (subTotalPriceEl) {
          subTotalPriceEl.textContent = subtotalPriceFormatted;
        }
        if (deliveryCostEl) {
          deliveryCostEl.textContent = deliveryCostEl.getAttribute(
            "data-freeshipping-text"
          );
          deliveryCostEl.classList.add("highlight-free-shipping");
        }
        if (totalPriceEl) {
          totalPriceEl.textContent = totalPriceFormatted;
        }
      } else {
        if (!hasItemWithDeliveryRequired) {
          if (deliveryCostEl) {
            deliveryCostEl.textContent = deliveryCostEl.getAttribute(
              "data-freeshipping-text"
            );
            deliveryCostEl.classList.add("highlight-free-shipping");
          }

          subTotalPriceEl.textContent = subtotalPriceFormatted;
          totalPriceEl.textContent = subtotalPriceFormatted;
        } else {
          shippingRate = shippingPrice;
          let shippingPriceFormatted = Shopify.scFormatMoney(
            shippingRate * 100
          );
          let totalPrice = parseFloat(subTotalPrice) + parseFloat(shippingRate);
          let totalPriceFormatted = Shopify.scFormatMoney(
            totalPrice.toFixed(2) * 100
          );

          subTotalPriceEl.textContent = subtotalPriceFormatted;
          if (deliveryCostEl) {
            if(subtotalPriceWithoutNoShippingItems >= parseFloat(minSubtotalPriceValue)){
                  deliveryCostEl.textContent = deliveryCostEl.getAttribute(
              "data-freeshipping-text"
            );
            deliveryCostEl.classList.add("highlight-free-shipping");
            }else{
            deliveryCostEl.textContent = shippingPriceFormatted;
            deliveryCostEl.classList.remove("highlight-free-shipping");
            }
          }
          totalPriceEl.textContent = totalPriceFormatted;
        }
      }

      // Compare at price
      if (isDcart) {
        // Do only if no dCart error occured
        if (scData?.subtotalCents !== scData?.totalCents) {
          let scCompareAtPriceFormatted = Shopify.scFormatMoney(
            scCompareAtPrice * 100
          );
          subTotalPriceCompareAtEl.textContent = scCompareAtPriceFormatted;
        }
      }
    }
  };

  /******************************************************************/
  /* DCART
    /******************************************************************/
  /*
  const toggleDCart = () => {
  const cartDrawer = document.querySelector("#sidebar-cart");
  if (!cartDrawer) return;

  // Use event delegation to handle clicks on .Drawer__Footer__Coupon-title
  cartDrawer.addEventListener("click", (event) => {
    const couponTitle = event.target.closest(".Drawer__Footer__Coupon-title");
    if (couponTitle) {
      cartDrawer.classList.toggle("Drawer__Footer__CouponActive");

      if (
        currentCountry !== "DE" &&
        currentCountry !== "AT" &&
        currentCountry !== "CH"
      ) {
        cartDrawer.classList.toggle("Drawer__Footer__CouponActive--other-location");
      }
    }
  });
};
  */
   const toggleDCart = () => {
  const cartDrawer = document.querySelector("#sidebar-cart");
  if (!cartDrawer) return;

  // Remove existing listener to prevent duplicates
  cartDrawer.removeEventListener("click", handleCouponClick);
  cartDrawer.addEventListener("click", handleCouponClick);
};

function handleCouponClick(event) {
  const couponTitle = event.target.closest(".Drawer__Footer__Coupon-title");
  if (couponTitle) {
    const cartDrawer = document.querySelector("#sidebar-cart");
    cartDrawer.classList.toggle("Drawer__Footer__CouponActive");
    if (
      currentCountry !== "DE" &&
      currentCountry !== "AT" &&
      currentCountry !== "CH"
    ) {
      cartDrawer.classList.toggle("Drawer__Footer__CouponActive--other-location");
    }
  }
}
  const dCartCalculation = () => {
    const cartDrawerElement = document.querySelector("#sidebar-cart");

    const dCartObserver = new MutationObserver((mutationsList, observer) => {
      scData = JSON.parse(sessionStorage.getItem("scDiscountData"));

      if (scData?.code) {
        cartDrawerElement.classList.add("Drawer--hasCoupon");
      } else {
        cartDrawerElement.classList.remove("Drawer--hasCoupon");
      }

      // do calculation only if discount is added
      if (
        (scData.stage === "complete" && scData.subtotalCents > 0) ||
        (scData.stage === "initial" && scData.subtotalCents > 0)
      ) {
        const couponPercentage = document.querySelector(
          "#sidebar-cart .Drawer__Footer__Coupon-percentage"
        );

        // Discount saving
        if (scData?.code) {
          const saving = parseFloat(scData?.discount?.amount) * 100;
          couponPercentage.textContent = "-" + Shopify.scFormatMoney(saving);
        }

        // Gift saving
        if (scData.gifts.length > 0) {
          const saving = parseFloat(scData?.gifts[0]?.amount_used) * 100;
          couponPercentage.textContent = "-" + Shopify.scFormatMoney(saving);
        }

        cheeringBar();
        totalCalculation(true);
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

  /******************************************************************/
  /* Black Week Badge
    /******************************************************************/

  const blackWeekBadge = () => {
    const blackWeekBadgeElement = document.querySelector(
      "[data-js-black-week-badge]"
    );
    if (!blackWeekBadgeElement) return;

    const mutationObserverPrice = new MutationObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.type == "childList") {
          if (entry.target.classList.contains("Badge__Savings")) return;
          const cartSavingsElement = document.querySelector(
            "[data-js-black-week-cart-savings]"
          );

          if (!cartSavingsElement) return;

          const cartSavings = cartSavingsElement.getAttribute(
            "data-js-black-week-cart-savings"
          );
          const badgeSavingsElement = document.querySelector(
            "[data-js-black-week-badge-savings]"
          );

          if (badgeSavingsElement.innerText != cartSavings) {
            badgeSavingsElement.innerText = cartSavings;
          }
        }
      });
    });

    const cartDrawer = document.querySelector("#shopify-section-cart-drawer");

    if (cartDrawer != undefined) {
      mutationObserverPrice.observe(cartDrawer, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
  };

  document.addEventListener("DOMContentLoaded", blackWeekBadge);

  


  /******************************************************************/
  /* End: Black Week Badge
    /******************************************************************/

  // TESTING: OPEN CART
  // setTimeout(() => {
  // 	document.querySelector('.Header__Icon[data-action="open-drawer"][data-drawer-id="sidebar-cart"]').click()
  // }, 1000);
})();
