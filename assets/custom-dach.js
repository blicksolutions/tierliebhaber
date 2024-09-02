/* Cart sidebar coupon */

// define shippingrates
window.shippingrates = {
    de: {
        minSubtotalPriceValue: 49,
        priceValue: '4.90'
    },
    at: {
        minSubtotalPriceValue: 69,
        priceValue: '6.90'
    },
    ch: {
        minSubtotalPriceValue: 129,
        priceValue: '12.90'
    },
    otherLocations: {
        country: null,
        minSubtotalPriceValue: 170,
        priceValue: 15.90,
        price: null,
        freeShipping: false,
        message: null
    }
}

// place dcart
window.scThemeConfig = {
    "cartDiscountSelector": {
        "path": "#shopify-section-cart-template section div.Container div.PageContent form.Cart footer.Cart__Footer div.Cart__Recap p.Cart__Total",
        "type": 1
    },
    "cartTotalSelector": {
        "path": "#shopify-section-cart-template section div.Container div.PageContent form.Cart footer.Cart__Footer div.Cart__Recap p.Cart__Total span",
        "type": 0
    },
    "ajaxDicountSelector": {
        "path": "#sidebar-cart form.Cart div.Drawer__Footer div.Drawer__Footer__Inner div.Drawer__Footer__Coupon div.Drawer__Footer__Coupon-content div.Drawer__Footer__Coupon-dcart",
        "type": 1
    },
    "ajaxTotalSelector": {
        "path": "#sidebar-cart form.Cart div.Drawer__Footer div.Drawer__Footer__Inner div.Drawer__Footer__Subtotal span.Drawer__Footer__SubtotalPrice",
        "type": 0
    },
};

let deliveryPriceValue = 0;

window.currentCountry = undefined;
window.obj = function () {
};

window.obj.priceToStr = function (price) {
    const currencySymbol = $('body').attr('data-currency-symbol');
    const str = currencySymbol + price.toFixed(2).replace(/\./, ',').replace(/^([0-9]+)([0-9]{3})\,/, '$1.$2,');
    return str;
};

window.obj.strToPrice = function (str) {
    if (!str) {
        return null;
    }

    const price = parseFloat(str.trim().replace(/\./, '').replace(/\,/, '.').replace(/[^0-9\.]+/, ''));
    return price;
};

document.addEventListener('DOMContentLoaded', () => {
    const cartDrawer = document.querySelector('#sidebar-cart');

    const handleQuantitySelectors = (cartQuantitySelectors) => {
        const cartDrawerContent = document.querySelector('.Cart.Drawer__Content');
        cartQuantitySelectors.forEach((selector) => {
            selector.addEventListener('click', () => {
                cartDrawerContent.classList.add('quantityLock');
                setTimeout(() => {
                    cartDrawerContent.classList.remove('quantityLock');
                }, 2000);
            });
        });
    };

    document.addEventListener('rerenderCart', () => {
        setTimeout(() => {
            handleQuantitySelectors(document.querySelectorAll('.Cart__ItemList .QuantitySelector__Button'));
        }, 1000);

        setTimeout(() => {
            handleQuantitySelectors(document.querySelectorAll('.Cart__ItemList .QuantitySelector__Button'));

            // hide and show CartMessage__Steps
            if(document.querySelector(".Cart__Empty") !== null) {
                document.querySelector(".CartMessage__Steps").style.opacity = 0;
            } else {
                document.querySelector(".CartMessage__Steps").style.opacity = 1;
            }
        }, 600);
    });

    window.lockCheckoutButton = () => {
        // console.log("LOCK BUTTON")
        cartDrawer.querySelector('.Cart__Checkout').disabled = true;
    };

    window.unlockCheckoutButton = () => {
        // console.log("UNLOCK BUTTON")
        cartDrawer.querySelector('.Cart__Checkout').disabled = false;
        document.dispatchEvent(new CustomEvent("rerenderingFinished"));
    };

    window.handleGift = (subtotalPrice) => {
        if(window.tlh047) {
            const giftContained = cartDrawer.querySelector('.cartGiftItem') != null;
            const secondGiftContained = cartDrawer.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerSecondGiftVariantId + '"]') != null;

            if (subtotalPrice < window.cartDrawerMinPriceForGift && giftContained) {
                // console.log("REMOVE GIFT")
                const cartUpdates = {
                    updates: {
                        [window.cartDrawerGiftVariantId]: 0,
                        [window.cartDrawerSecondGiftVariantId]: 0,
                    }
                };
                fetch(window.Shopify.routes.root + 'cart/update.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cartUpdates)
                })
                    .then((response) => response.json())
                    .then(response => {
                        fetch(window.location.href)
                            .then((response) => response.text())
                            .then((responseText) => {
                                const oldItemsWrapper = document.querySelector('.Cart__ItemList');
                                const html = new DOMParser().parseFromString(responseText, 'text/html');
                                const newItemsWrapper = html.querySelector('.Cart__ItemList');
    
                                if (newItemsWrapper) {
                                    oldItemsWrapper.innerHTML = newItemsWrapper.innerHTML;
                                } else {
                                    location.reload()
                                }
    
                                // else update cart
                                setTimeout(() => {
                                    window.obj.cartSidebarRefresh(true);
                                    window.unlockCheckoutButton();
                                }, 1000);
                            })
                            .catch(e => {
                                console.error(e);
                            });
                    });
            } else if (!giftContained && subtotalPrice >= window.cartDrawerMinPriceForGift){
                //console.log("ADDED FIRST GIFT")
                const cartUpdates = {
                    updates: {
                        [window.cartDrawerGiftVariantId]: 1,
                        [window.cartDrawerSecondGiftVariantId]: 0
                    }
                };
                fetch(window.Shopify.routes.root + 'cart/update.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cartUpdates)
                })
                    .then((response) => response.json())
                    .then(response => {
                        fetch(window.location.href)
                            .then((response) => response.text())
                            .then((responseText) => {
                                const oldItemsWrapper = document.querySelector('.Cart__ItemList');
                                const html = new DOMParser().parseFromString(responseText, 'text/html');
                                const newItemsWrapper = html.querySelector('.Cart__ItemList');
    
                                if (newItemsWrapper) {
                                    oldItemsWrapper.innerHTML = newItemsWrapper.innerHTML;
                                } else {
                                    location.reload()
                                }
    
                                // else update cart
                                setTimeout(() => {
                                    window.obj.cartSidebarRefresh(true);
                                    window.unlockCheckoutButton();
                                }, 1000);
                            })
                            .catch(e => {
                                console.error(e);
                            });
                    });
            } else if (secondGiftContained && subtotalPrice < window.cartDrawerMinPriceForSecondGift){
                const cartUpdates = {
                    updates: {
                        [window.cartDrawerSecondGiftVariantId]: 0
                    }
                };
                fetch(window.Shopify.routes.root + 'cart/update.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cartUpdates)
                })
                    .then((response) => response.json())
                    .then(response => {
                        fetch(window.location.href)
                            .then((response) => response.text())
                            .then((responseText) => {
                                const oldItemsWrapper = document.querySelector('.Cart__ItemList');
                                const html = new DOMParser().parseFromString(responseText, 'text/html');
                                const newItemsWrapper = html.querySelector('.Cart__ItemList');
    
                                if (newItemsWrapper) {
                                    oldItemsWrapper.innerHTML = newItemsWrapper.innerHTML;
                                } else {
                                    location.reload()
                                }
    
                                // else update cart
                                setTimeout(() => {
                                    window.obj.cartSidebarRefresh(true);
                                    window.unlockCheckoutButton();
                                }, 1000);
                            })
                            .catch(e => {
                                console.error(e);
                            });
                    });
            } else if (!secondGiftContained && subtotalPrice >= window.cartDrawerMinPriceForSecondGift){
                //console.log("ADD SECOND GIFT")
                const cartUpdates = {
                    updates: {
                        [window.cartDrawerSecondGiftVariantId]: 1
                    }
                };
                fetch(window.Shopify.routes.root + 'cart/update.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cartUpdates)
                })
                    .then((response) => response.json())
                    .then(response => {
                        fetch(window.location.href)
                            .then((response) => response.text())
                            .then((responseText) => {
                                const oldItemsWrapper = document.querySelector('.Cart__ItemList');
                                const html = new DOMParser().parseFromString(responseText, 'text/html');
                                const newItemsWrapper = html.querySelector('.Cart__ItemList');
    
                                if (newItemsWrapper) {
                                    oldItemsWrapper.innerHTML = newItemsWrapper.innerHTML;
                                } else {
                                    location.reload()
                                }
    
                                // else update cart
                                setTimeout(() => {
                                    window.obj.cartSidebarRefresh(true);
                                    window.unlockCheckoutButton();
                                }, 1000);
                            })
                            .catch(e => {
                                console.error(e);
                            });
                    });
            } else {
                // console.log("DONE NOTHIN!")
                window.unlockCheckoutButton();
            }
        } else {
            const giftContained = cartDrawer.querySelector('.cartGiftItem') != null;

            if (subtotalPrice < window.cartDrawerMinPriceForGift && giftContained) {
                // console.log("REMOVE GIFT")
                const cartUpdates = {
                    updates: {
                        [window.cartDrawerGiftVariantId]: 0
                    }
                };
                fetch(window.Shopify.routes.root + 'cart/update.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cartUpdates)
                })
                    .then((response) => response.json())
                    .then(response => {
                        fetch(window.location.href)
                            .then((response) => response.text())
                            .then((responseText) => {
                                const oldItemsWrapper = document.querySelector('.Cart__ItemList');
                                const html = new DOMParser().parseFromString(responseText, 'text/html');
                                const newItemsWrapper = html.querySelector('.Cart__ItemList');
    
                                if (newItemsWrapper) {
                                    oldItemsWrapper.innerHTML = newItemsWrapper.innerHTML;
                                } else {
                                    location.reload()
                                }
    
                                // else update cart
                                setTimeout(() => {
                                    window.obj.cartSidebarRefresh(true);
                                    window.unlockCheckoutButton();
                                }, 1000);
                            })
                            .catch(e => {
                                console.error(e);
                            });
                    });
            } else if (!giftContained && subtotalPrice >= window.cartDrawerMinPriceForGift){
                // console.log("ADDE GIFT")
                const cartUpdates = {
                    updates: {
                        [window.cartDrawerGiftVariantId]: 1
                    }
                };
                fetch(window.Shopify.routes.root + 'cart/update.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cartUpdates)
                })
                    .then((response) => response.json())
                    .then(response => {
                        fetch(window.location.href)
                            .then((response) => response.text())
                            .then((responseText) => {
                                const oldItemsWrapper = document.querySelector('.Cart__ItemList');
                                const html = new DOMParser().parseFromString(responseText, 'text/html');
                                const newItemsWrapper = html.querySelector('.Cart__ItemList');
    
                                if (newItemsWrapper) {
                                    oldItemsWrapper.innerHTML = newItemsWrapper.innerHTML;
                                } else {
                                    location.reload()
                                }
    
                                // else update cart
                                setTimeout(() => {
                                    window.obj.cartSidebarRefresh(true);
                                    window.unlockCheckoutButton();
                                }, 1000);
                            })
                            .catch(e => {
                                console.error(e);
                            });
                    });
            } else {
                // console.log("DONE NOTHIN!")
                window.unlockCheckoutButton();
            }
        }
    }
});

if (window.tlh047) {
    window.obj.cartSidebarRefresh = function (replaceDelivery) {
        if (window.cartDrawerEnableGift) {
            window.giftItemId = window.cartDrawerGiftVariantId;
            sessionStorage.setItem('giftItemAdded', sessionStorage.getItem('giftItemAdded'));
        }
    
        window.cartItems = document.querySelectorAll('.Drawer__Container .CartItemWrapper[data-price]');
        window.cartData = JSON.parse(sessionStorage.getItem('scCartData'))
    
        const cartSidebar = $('#sidebar-cart');
        setTimeout(() => {
            cartSidebar.removeClass('Drawer__Footer-loading');
        }, 2000);
        cartSidebar.attr("data-dcart-calculated", (parseInt(cartSidebar.attr("data-dcart-calculated")) + 1));
    
        const scData = JSON.parse(sessionStorage.getItem("scDiscountData"));
    
        /** Delivery after ip +*/
    
        // elements
        setTimeout(() => {
            // console.log("----------- new refresh ---------------")
            const subtotalPriceEl = document.querySelector('.Drawer__Footer__SubtotalPrice span');
            const deliveryCostEl = document.querySelector('.Drawer__Footer__Delivery span');
            const totalPriceEl = document.querySelector('.Drawer__Footer__Total span');
            const deliveryBarValueEl = document.querySelector('.js-cart-drawer-delivery-left-value');
            const deliveryBarLeftTextEl = document.querySelector('.CartMessage__Steps__Text-left');
            const deliveryBarFinalTextEl = document.querySelector('.CartMessage__Steps__Text-final');
            const deliveryBarStepLineEl = document.querySelector('.CartMessage__StepsLines__Active');
            const deliveryStepLine = document.querySelector(".CartMessage__StepsLines__Delivery");
            const deliveryBarTextEl = document.querySelector('.CartMessage__Steps__Text');
            const cartItems = document.querySelectorAll('.Drawer__Container .CartItemWrapper[data-price]');
            let noDeliveryItemsTotalPrice = 0;
            let hasItemWithDeliveryRequired = false;
            const giftIcon = document.querySelector('.CartMessage__StepsLines__Gift');
            const secondGiftIcon = document.querySelector('.CartMessage__StepsLines__Second-Gift');


            const deliveryIcon = document.querySelector('.CartMessage__StepsLines__Delivery');
            let deliveryIconPosition;
    
            // vars
            let deliveryPriceValue = window.shippingrates.otherLocations.priceValue;
    
            // exclude items with no shipping requirement from shipping calculation
            cartItems.forEach((cartItem) => {
                if (cartItem.dataset.reqShipping == 'false') {
                    noDeliveryItemsTotalPrice += parseFloat(cartItem.dataset.price / 100);
                } else {
                    hasItemWithDeliveryRequired = true;
                }
            });
    
            let subtotalPriceWithoutNoShippingItems = (window.cartData.items_subtotal_price / 100) - noDeliveryItemsTotalPrice;
           
            document.querySelector(".CartMessage__StepsLines__Delivery").style.display = "block";

            // console.log("----- new refresh ----")
            if (replaceDelivery && subtotalPriceEl && deliveryCostEl && totalPriceEl && deliveryBarValueEl && deliveryBarLeftTextEl && deliveryBarFinalTextEl && deliveryBarStepLineEl && deliveryBarTextEl) {
                if (hasItemWithDeliveryRequired) {
                    switch (window.currentCountry) {
                        case 'DE':
                            if (window.cartDrawerEnableGift) {
                                const percentPerEuro = 100 / parseInt(window.cartDrawerMinPriceForSecondGift);
                                deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems * percentPerEuro) + '%';

                                // delivery 
                                deliveryStepLine.style.display = "block";
                                deliveryIconPosition = (window.shippingrates.de.minSubtotalPriceValue * 100) / parseInt(window.cartDrawerMinPriceForSecondGift) ;
                                deliveryIcon.style.left = deliveryIconPosition + "%";

                                // first gift 
                                giftIcon.style.display = 'block';
                                giftIconPosition = (window.cartDrawerMinPriceForGift * 100) / parseInt(window.cartDrawerMinPriceForSecondGift);
                                giftIcon.style.left = giftIconPosition + "%";

                                // second gift 
                                secondGiftIcon.style.display = 'block';
    
                                if (window.shippingrates.de.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
                                    deliveryCostEl.textContent = '€' + window.shippingrates.de.priceValue.replace('.', ',');
                                    deliveryPriceValue = parseFloat(window.shippingrates.de.priceValue);
                                    deliveryBarFinalTextEl.style.display = 'none';
                                    deliveryBarLeftTextEl.style.display = 'block';
                                    deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                    window.cartBarWidth = ((subtotalPriceWithoutNoShippingItems / window.shippingrates.de.minSubtotalPriceValue * 100) - 15).toFixed(2) + '%';
                                    window.cartBarValue = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                } else if(window.cartDrawerMinPriceForGift > subtotalPriceWithoutNoShippingItems) {
                                    deliveryBarFinalTextEl.style.display = 'block';
                                    deliveryBarLeftTextEl.style.display = 'none';
                                    deliveryPriceValue = 0;
                                    deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                                    deliveryBarFinalTextEl.textContent = 'Noch ' + '€' + (parseInt(window.cartDrawerMinPriceForGift) - subtotalPriceWithoutNoShippingItems).toFixed(2).replace('.', ',') + ' bis zum ersten Geschenk';
                                }  else {
                                    deliveryBarFinalTextEl.style.display = 'block';
                                    deliveryBarLeftTextEl.style.display = 'none';
                                    deliveryPriceValue = 0;
                                    deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                                    deliveryBarFinalTextEl.textContent = 'Noch ' + '€' + (parseInt(window.cartDrawerMinPriceForSecondGift) - subtotalPriceWithoutNoShippingItems).toFixed(2).replace('.', ',') + ' bis zum zweiten Geschenk';
    
                                    if (subtotalPriceWithoutNoShippingItems >= parseInt(window.cartDrawerMinPriceForSecondGift)) {
                                        deliveryBarFinalTextEl.innerHTML = 'Kostenloser Versand & Geschenk!';
                                    }
                                }
    
                                let subtotalReal;
    
                                if (document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]')) {
                                    subtotalReal = (window.cartData.original_total_price / 100) - window.cartDrawerGiftPrice;
                                } else {
                                    subtotalReal = window.cartData.original_total_price / 100;
                                }
    
                                // handle gift
                                window.handleGift(subtotalReal);
    
                                setTimeout(() => {
                                    const totalPrice = document.querySelector('.Drawer__Footer__Total span')
                                    const couponCodeSet = document.querySelector('#sidebar-cart[data-dcart-code]')
    
                                    if (totalPrice && couponCodeSet == null && window.shippingrates.de.minSubtotalPriceValue <= subtotalPriceWithoutNoShippingItems) {
                                        totalPrice.textContent = totalPrice?.dataset?.price
                                    }
                                }, 500);
                            } else {
                                giftIcon.style.display = 'none';
    
                                if (window.shippingrates.de.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
                                    deliveryCostEl.textContent = '€' + window.shippingrates.de.priceValue.replace('.', ',');
                                    deliveryPriceValue = parseFloat(window.shippingrates.de.priceValue);
                                    deliveryBarFinalTextEl.style.display = 'none';
                                    deliveryBarLeftTextEl.style.display = 'block';
                                    deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                    deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems / window.shippingrates.de.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                    window.cartBarWidth = (subtotalPriceWithoutNoShippingItems / window.shippingrates.de.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                    window.cartBarValue = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                } else {
                                    deliveryBarFinalTextEl.style.display = 'block';
                                    deliveryBarLeftTextEl.style.display = 'none';
                                    deliveryPriceValue = 0;
                                    deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                                    deliveryBarStepLineEl.style.width = '100%';
                                }
    
                                window.unlockCheckoutButton();
                            }
                            break;
                        case 'AT':
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
    
                                let subtotalReal;
    
                                if (document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]')) {
                                    subtotalReal = (window.cartData.original_total_price / 100) - window.cartDrawerGiftPrice;
                                } else {
                                    subtotalReal = window.cartData.original_total_price / 100;
                                }
    
                                // handle gift
                                window.handleGift(subtotalReal);
    
                                setTimeout(() => {
                                    const totalPrice = document.querySelector('.Drawer__Footer__Total span')
                                    const couponCodeSet = document.querySelector('#sidebar-cart[data-dcart-code]')
    
                                    if (totalPrice && couponCodeSet == null && window.shippingrates.at.minSubtotalPriceValue <= subtotalPriceWithoutNoShippingItems) {
                                        totalPrice.textContent = totalPrice?.dataset?.price
                                    }
                                }, 500);
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
    
                                window.unlockCheckoutButton();
                            }
                            break;
                        case 'CH':
                            if (window.cartDrawerEnableGift) {
                                const giftIcon = document.querySelector('.CartMessage__StepsLines__Gift');
                                let giftIconPosition;
                                let percentPerEuro = 100 / parseInt(window.cartDrawerMinPriceForGift); // 1.33333
                                const giftItemInCart = document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]');
    
                                if (giftItemInCart && sessionStorage.getItem('giftItemAdded') != 'true') {
                                    subtotalPriceWithoutNoShippingItems -= window.cartDrawerGiftPrice;
                                }
    
                                giftIcon.style.display = 'block';
    
                                if (window.shippingrates.ch.minSubtotalPriceValue > window.cartDrawerMinPriceForGift) {
                                    percentPerEuro = 100 / parseInt(window.shippingrates.ch.minSubtotalPriceValue); // 1.33333
                                    deliveryIcon.style.left = "100%";
                                    giftIconPosition = (parseInt(window.cartDrawerMinPriceForGift) * percentPerEuro);
                                    giftIcon.style.left = giftIconPosition + "%";
                                    giftIcon.style.right = 'auto';
    
                                    if (subtotalPriceWithoutNoShippingItems < window.cartDrawerMinPriceForGift) {
                                        deliveryBarFinalTextEl.style.display = 'block';
                                        deliveryBarLeftTextEl.style.display = 'none';
                                        deliveryCostEl.textContent = '€' + window.shippingrates.ch.priceValue.replace('.', ',');
                                        deliveryBarFinalTextEl.textContent = 'Noch ' + '€' + (parseInt(window.cartDrawerMinPriceForGift) - subtotalPriceWithoutNoShippingItems).toFixed(2).replace('.', ',') + ' bis zum Geschenk';
                                    } else {
                                        deliveryCostEl.textContent = '€' + window.shippingrates.ch.priceValue.replace('.', ',');
                                        deliveryPriceValue = parseFloat(window.shippingrates.ch.priceValue);
                                        deliveryBarFinalTextEl.style.display = 'none';
                                        deliveryBarLeftTextEl.style.display = 'block';
                                        deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                        window.cartBarWidth = ((subtotalPriceWithoutNoShippingItems / window.shippingrates.ch.minSubtotalPriceValue * 100) - 15).toFixed(2) + '%';
                                        window.cartBarValue = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
    
                                        if (subtotalPriceWithoutNoShippingItems >= window.shippingrates.ch.minSubtotalPriceValue) {
                                            deliveryBarLeftTextEl.innerHTML = 'Kostenloser Versand & Geschenk!';
                                            deliveryPriceValue = 0;
                                            deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                                        }
                                    }
                                } else {
                                    deliveryIconPosition = (window.shippingrates.ch.minSubtotalPriceValue * 100) / parseInt(window.cartDrawerMinPriceForGift) ;
                                    deliveryIcon.style.left = deliveryIconPosition + "%";
    
                                    if (window.shippingrates.ch.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
                                        deliveryCostEl.textContent = '€' + window.shippingrates.ch.priceValue.replace('.', ',');
                                        deliveryPriceValue = parseFloat(window.shippingrates.ch.priceValue);
                                        deliveryBarFinalTextEl.style.display = 'none';
                                        deliveryBarLeftTextEl.style.display = 'block';
                                        deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                        window.cartBarWidth = ((subtotalPriceWithoutNoShippingItems / window.shippingrates.ch.minSubtotalPriceValue * 100) - 15).toFixed(2) + '%';
                                        window.cartBarValue = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
    
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
    
                                    window.unlockCheckoutButton();
                                }
    
                                deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems * percentPerEuro) + '%'
    
                                let subtotalReal;
    
                                if (document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]')) {
                                    subtotalReal = (window.cartData.original_total_price / 100) - window.cartDrawerGiftPrice;
                                } else {
                                    subtotalReal = window.cartData.original_total_price / 100;
                                }
    
                                // handle gift
                                window.handleGift(subtotalReal);
    
                                setTimeout(() => {
                                    const totalPrice = document.querySelector('.Drawer__Footer__Total span')
                                    const couponCodeSet = document.querySelector('#sidebar-cart[data-dcart-code]')
    
                                    if (totalPrice && couponCodeSet == null && window.shippingrates.ch.minSubtotalPriceValue <= subtotalPriceWithoutNoShippingItems) {
                                        totalPrice.textContent = totalPrice?.dataset?.price
                                    }
                                }, 500);
                            } else {
                                giftIcon.style.display = 'none';
    
                                if (window.shippingrates.ch.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
                                    deliveryCostEl.textContent = '€' + window.shippingrates.ch.priceValue.replace('.', ',');
                                    deliveryPriceValue = parseFloat(window.shippingrates.ch.priceValue);
                                    deliveryBarFinalTextEl.style.display = 'none';
                                    deliveryBarLeftTextEl.style.display = 'block';
                                    deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                    deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems / window.shippingrates.ch.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                    window.cartBarWidth = (subtotalPriceWithoutNoShippingItems / window.shippingrates.ch.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                    window.cartBarValue = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                } else {
                                    deliveryBarFinalTextEl.style.display = 'block';
                                    deliveryBarLeftTextEl.style.display = 'none';
                                    deliveryPriceValue = 0;
                                    deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                                    deliveryBarStepLineEl.style.width = '100%';
                                }
                                window.unlockCheckoutButton();
    
                            }
                            break;
                        default:
                            deliveryIcon.style.left = "100%"
                            // use de
                            if (window.shippingrates.de.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
                                deliveryCostEl.textContent = '€' + window.shippingrates.de.priceValue.replace('.', ',');
                                deliveryPriceValue = parseFloat(window.shippingrates.de.priceValue);
                                deliveryBarFinalTextEl.style.display = 'none';
                                deliveryBarLeftTextEl.style.display = 'block';
                                deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems / window.shippingrates.de.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                window.cartBarWidth = (subtotalPriceWithoutNoShippingItems / window.shippingrates.de.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                window.cartBarValue = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                            } else {
                                deliveryBarFinalTextEl.style.display = 'block';
                                deliveryBarLeftTextEl.style.display = 'none';
                                deliveryPriceValue = 0;
                                deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                                deliveryBarStepLineEl.style.width = '100%';
                            }
                            window.unlockCheckoutButton();
    
                    }
                } else {
                    deliveryIcon.style.left = "100%"
                    deliveryPriceValue = 0;
                    deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                    window.unlockCheckoutButton();
                }
    
                // set price with location based shipping costs
                const priceWithoutShipping = parseFloat(subtotalPriceEl.textContent.replace('€', '').replace(',', '.'));
                totalPriceEl.textContent = '€' + (priceWithoutShipping + deliveryPriceValue).toFixed(2);
            }
            /** /Delivery after ip +*/
    
            if (scData.stage == 'complete') {
                cartSidebar.attr('data-dcart-code', scData.code);
                const cartCouponSection = document.querySelector('.Drawer__Footer__Coupon');
                const coupon = cartCouponSection.querySelector('.Drawer__Footer__Coupon-percentage');
                const discountAmount = cartCouponSection.querySelector('.sc_code-info .money.mw-price')?.textContent;
    
                if (discountAmount === undefined) {
                    const cartSidebar = $('#sidebar-cart');
                    cartSidebar.removeAttr('data-dcart-code');
    
                    setTimeout(function () {
                        const subtotalPrice = cartSidebar.find('.Drawer__Footer__Subtotal > span');
    
                        if (subtotalPrice.children('span.money').length) {
                            subtotalPrice.children('span.money').text(subtotalPrice.attr('data-price'));
                            // subtotalPrice.children('span.money').text("yobro");
    
                        } else {
                            subtotalPrice.text(subtotalPrice.attr('data-price'));
                            // subtotalPrice.text("yobro");
                        }
    
                        const totalPrice = cartSidebar.find('.Drawer__Footer__Total > span');
                        totalPrice.text(totalPrice.attr('data-price'));
                    }, 125);
    
                    const field = $('#sidebar-cart .Drawer__Footer .scDiscount input[type="text"]');
                    field.removeClass('active');
    
                    const percentage = $('.Drawer__Footer__Coupon-percentage');
                    percentage.text('');
    
                    const totalPrice = document.querySelector('.Drawer__Footer__Total span')
                    const couponCodeSet = document.querySelector('#sidebar-cart[data-dcart-code]')
    
                    if (totalPrice && couponCodeSet == null) {
                        totalPrice.textContent = totalPrice?.dataset?.price
                    }
                }
    
                if (scData.discount.value > 0) {
                    coupon.textContent = '-' + discountAmount;
    
                } else {
                    coupon.textContent = '';
                }
    
                /* Subtotal price */
                const subtotalOldPrice = cartSidebar.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > s > span.money');
                let subtotalOldPriceValue = parseFloat(scData.total);
    
                const subtotalNewPrice = cartSidebar.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > span.money');
               
                let subTotalPrice = scData?.subtotalCents / 100;
                let subtotalNewPriceValue = parseFloat(subTotalPrice);
                // console.log(scData)
      
                /* /Subtotal price */
                document.querySelector("#sidebar-cart .Drawer__Footer__SubtotalPrice").dataset.price = scData?.subtotalFormatted;
    
                /* Total price */
                const totalPrice = cartSidebar.find('.Drawer__Footer__Total > span');
    
                subtotalNewPrice.text('€' + subtotalNewPriceValue)
    
                const totalPriceValue = parseFloat(subtotalNewPriceValue + deliveryPriceValue);
    
                totalPrice.text(window.obj.priceToStr(totalPriceValue));
    
                /* /Total price */
            }
    
            if (deliveryBarTextEl) {
                deliveryBarTextEl.style.filter = 'blur(0)';
            }
        }, 550);
    
        /* Error */
        const couponError = cartSidebar.find('.scDiscount__container .scError');
    
        if (couponError.length && !couponError.hasClass('Hidden')) {
            couponError.addClass('Hidden');
    
            setTimeout(function () {
                couponError.css('opacity', 0);
    
                setTimeout(function () {
                    couponError.remove();
                }, 450);
            }, 3000);
        }
        /* /Error */
    };
} else {
    window.obj.cartSidebarRefresh = function (replaceDelivery) {
        if (window.cartDrawerEnableGift) {
            window.giftItemId = window.cartDrawerGiftVariantId;
            sessionStorage.setItem('giftItemAdded', sessionStorage.getItem('giftItemAdded'));
        }
    
        window.cartItems = document.querySelectorAll('.Drawer__Container .CartItemWrapper[data-price]');
        window.cartData = JSON.parse(sessionStorage.getItem('scCartData'))
    
        const cartSidebar = $('#sidebar-cart');
        setTimeout(() => {
            cartSidebar.removeClass('Drawer__Footer-loading');
        }, 2000);
        cartSidebar.attr("data-dcart-calculated", (parseInt(cartSidebar.attr("data-dcart-calculated")) + 1));
    
        const scData = JSON.parse(sessionStorage.getItem("scDiscountData"));
    
        /** Delivery after ip +*/
    
        // elements
        setTimeout(() => {
            // console.log("----------- new refresh ---------------")
            const subtotalPriceEl = document.querySelector('.Drawer__Footer__SubtotalPrice span');
            const deliveryCostEl = document.querySelector('.Drawer__Footer__Delivery span');
            const totalPriceEl = document.querySelector('.Drawer__Footer__Total span');
            const deliveryBarValueEl = document.querySelector('.js-cart-drawer-delivery-left-value');
            const deliveryBarLeftTextEl = document.querySelector('.CartMessage__Steps__Text-left');
            const deliveryBarFinalTextEl = document.querySelector('.CartMessage__Steps__Text-final');
            const deliveryBarStepLineEl = document.querySelector('.CartMessage__StepsLines__Active');
            const deliveryBarTextEl = document.querySelector('.CartMessage__Steps__Text');
            const cartItems = document.querySelectorAll('.Drawer__Container .CartItemWrapper[data-price]');
            let noDeliveryItemsTotalPrice = 0;
            let hasItemWithDeliveryRequired = false;
            const giftIcon = document.querySelector('.CartMessage__StepsLines__Gift');
            const deliveryIcon = document.querySelector('.CartMessage__StepsLines__Delivery');
            let deliveryIconPosition;
    
            // vars
            let deliveryPriceValue = window.shippingrates.otherLocations.priceValue;
    
            // exclude items with no shipping requirement from shipping calculation
            cartItems.forEach((cartItem) => {
                if (cartItem.dataset.reqShipping == 'false') {
                    noDeliveryItemsTotalPrice += parseFloat(cartItem.dataset.price / 100);
                } else {
                    hasItemWithDeliveryRequired = true;
                }
            });
    
            let subtotalPriceWithoutNoShippingItems = (window.cartData.items_subtotal_price / 100) - noDeliveryItemsTotalPrice;
           
            document.querySelector(".CartMessage__StepsLines__Delivery").style.display = "block";
            document.querySelector(".CartMessage__StepsLines__Gift").style.display = "block";
            document.querySelector(".CartMessage__StepsLines__Gift").style.right = 0;
            
            // console.log("----- new refresh ----")
            if (replaceDelivery && subtotalPriceEl && deliveryCostEl && totalPriceEl && deliveryBarValueEl && deliveryBarLeftTextEl && deliveryBarFinalTextEl && deliveryBarStepLineEl && deliveryBarTextEl) {
                if (hasItemWithDeliveryRequired) {
                    switch (window.currentCountry) {
                        case 'DE':
                            if (window.cartDrawerEnableGift) {
                                const percentPerEuro = 100 / parseInt(window.cartDrawerMinPriceForGift); // 1.33333
                                deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems * percentPerEuro) + '%'

                                giftIcon.style.display = 'block';
    
                                deliveryIconPosition = (window.shippingrates.de.minSubtotalPriceValue * 100) / parseInt(window.cartDrawerMinPriceForGift) ;
                                deliveryIcon.style.left = deliveryIconPosition + "%";
    
                                if (window.shippingrates.de.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
                                    deliveryCostEl.textContent = '€' + window.shippingrates.de.priceValue.replace('.', ',');
                                    deliveryPriceValue = parseFloat(window.shippingrates.de.priceValue);
                                    deliveryBarFinalTextEl.style.display = 'none';
                                    deliveryBarLeftTextEl.style.display = 'block';
                                    deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                    window.cartBarWidth = ((subtotalPriceWithoutNoShippingItems / window.shippingrates.de.minSubtotalPriceValue * 100) - 15).toFixed(2) + '%';
                                    window.cartBarValue = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
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
    
                                let subtotalReal;
    
                                if (document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]')) {
                                    subtotalReal = (window.cartData.original_total_price / 100) - window.cartDrawerGiftPrice;
                                } else {
                                    subtotalReal = window.cartData.original_total_price / 100;
                                }
    
                                // handle gift
                                window.handleGift(subtotalReal);
    
                                setTimeout(() => {
                                    const totalPrice = document.querySelector('.Drawer__Footer__Total span')
                                    const couponCodeSet = document.querySelector('#sidebar-cart[data-dcart-code]')
    
                                    if (totalPrice && couponCodeSet == null && window.shippingrates.de.minSubtotalPriceValue <= subtotalPriceWithoutNoShippingItems) {
                                        totalPrice.textContent = totalPrice?.dataset?.price
                                    }
                                }, 500);
                            } else {
                                giftIcon.style.display = 'none';
    
                                if (window.shippingrates.de.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
                                    deliveryCostEl.textContent = '€' + window.shippingrates.de.priceValue.replace('.', ',');
                                    deliveryPriceValue = parseFloat(window.shippingrates.de.priceValue);
                                    deliveryBarFinalTextEl.style.display = 'none';
                                    deliveryBarLeftTextEl.style.display = 'block';
                                    deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                    deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems / window.shippingrates.de.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                    window.cartBarWidth = (subtotalPriceWithoutNoShippingItems / window.shippingrates.de.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                    window.cartBarValue = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                } else {
                                    deliveryBarFinalTextEl.style.display = 'block';
                                    deliveryBarLeftTextEl.style.display = 'none';
                                    deliveryPriceValue = 0;
                                    deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                                    deliveryBarStepLineEl.style.width = '100%';
                                }
    
                                window.unlockCheckoutButton();
                            }
                            break;
                        case 'AT':
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
    
                                let subtotalReal;
    
                                if (document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]')) {
                                    subtotalReal = (window.cartData.original_total_price / 100) - window.cartDrawerGiftPrice;
                                } else {
                                    subtotalReal = window.cartData.original_total_price / 100;
                                }
    
                                // handle gift
                                window.handleGift(subtotalReal);
    
                                setTimeout(() => {
                                    const totalPrice = document.querySelector('.Drawer__Footer__Total span')
                                    const couponCodeSet = document.querySelector('#sidebar-cart[data-dcart-code]')
    
                                    if (totalPrice && couponCodeSet == null && window.shippingrates.at.minSubtotalPriceValue <= subtotalPriceWithoutNoShippingItems) {
                                        totalPrice.textContent = totalPrice?.dataset?.price
                                    }
                                }, 500);
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
    
                                window.unlockCheckoutButton();
                            }
                            break;
                        case 'CH':
                            if (window.cartDrawerEnableGift) {
                                const giftIcon = document.querySelector('.CartMessage__StepsLines__Gift');
                                let giftIconPosition;
                                let percentPerEuro = 100 / parseInt(window.cartDrawerMinPriceForGift); // 1.33333
                                const giftItemInCart = document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]');
    
                                if (giftItemInCart && sessionStorage.getItem('giftItemAdded') != 'true') {
                                    subtotalPriceWithoutNoShippingItems -= window.cartDrawerGiftPrice;
                                }
    
                                giftIcon.style.display = 'block';
    
                                if (window.shippingrates.ch.minSubtotalPriceValue > window.cartDrawerMinPriceForGift) {
                                    percentPerEuro = 100 / parseInt(window.shippingrates.ch.minSubtotalPriceValue); // 1.33333
                                    deliveryIcon.style.left = "100%";
                                    giftIconPosition = (parseInt(window.cartDrawerMinPriceForGift) * percentPerEuro);
                                    giftIcon.style.left = giftIconPosition + "%";
                                    giftIcon.style.right = 'auto';
    
                                    if (subtotalPriceWithoutNoShippingItems < window.cartDrawerMinPriceForGift) {
                                        deliveryBarFinalTextEl.style.display = 'block';
                                        deliveryBarLeftTextEl.style.display = 'none';
                                        deliveryCostEl.textContent = '€' + window.shippingrates.ch.priceValue.replace('.', ',');
                                        deliveryBarFinalTextEl.textContent = 'Noch ' + '€' + (parseInt(window.cartDrawerMinPriceForGift) - subtotalPriceWithoutNoShippingItems).toFixed(2).replace('.', ',') + ' bis zum Geschenk';
                                    } else {
                                        deliveryCostEl.textContent = '€' + window.shippingrates.ch.priceValue.replace('.', ',');
                                        deliveryPriceValue = parseFloat(window.shippingrates.ch.priceValue);
                                        deliveryBarFinalTextEl.style.display = 'none';
                                        deliveryBarLeftTextEl.style.display = 'block';
                                        deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                        window.cartBarWidth = ((subtotalPriceWithoutNoShippingItems / window.shippingrates.ch.minSubtotalPriceValue * 100) - 15).toFixed(2) + '%';
                                        window.cartBarValue = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
    
                                        if (subtotalPriceWithoutNoShippingItems >= window.shippingrates.ch.minSubtotalPriceValue) {
                                            deliveryBarLeftTextEl.innerHTML = 'Kostenloser Versand & Geschenk!';
                                            deliveryPriceValue = 0;
                                            deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                                        }
                                    }
                                } else {
                                    deliveryIconPosition = (window.shippingrates.ch.minSubtotalPriceValue * 100) / parseInt(window.cartDrawerMinPriceForGift) ;
                                    deliveryIcon.style.left = deliveryIconPosition + "%";

                                    if (window.shippingrates.ch.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
                                        deliveryCostEl.textContent = '€' + window.shippingrates.ch.priceValue.replace('.', ',');
                                        deliveryPriceValue = parseFloat(window.shippingrates.ch.priceValue);
                                        deliveryBarFinalTextEl.style.display = 'none';
                                        deliveryBarLeftTextEl.style.display = 'block';
                                        deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                        window.cartBarWidth = ((subtotalPriceWithoutNoShippingItems / window.shippingrates.ch.minSubtotalPriceValue * 100) - 15).toFixed(2) + '%';
                                        window.cartBarValue = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
    
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
    
                                    window.unlockCheckoutButton();
                                }
    
                                deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems * percentPerEuro) + '%'
    
                                let subtotalReal;
    
                                if (document.querySelector('.CartItemWrapper[data-variant-id="' + window.cartDrawerGiftVariantId + '"]')) {
                                    subtotalReal = (window.cartData.original_total_price / 100) - window.cartDrawerGiftPrice;
                                } else {
                                    subtotalReal = window.cartData.original_total_price / 100;
                                }
    
                                // handle gift
                                window.handleGift(subtotalReal);
    
                                setTimeout(() => {
                                    const totalPrice = document.querySelector('.Drawer__Footer__Total span')
                                    const couponCodeSet = document.querySelector('#sidebar-cart[data-dcart-code]')
    
                                    if (totalPrice && couponCodeSet == null && window.shippingrates.ch.minSubtotalPriceValue <= subtotalPriceWithoutNoShippingItems) {
                                        totalPrice.textContent = totalPrice?.dataset?.price
                                    }
                                }, 500);
                            } else {
                                giftIcon.style.display = 'none';
    
                                if (window.shippingrates.ch.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
                                    deliveryCostEl.textContent = '€' + window.shippingrates.ch.priceValue.replace('.', ',');
                                    deliveryPriceValue = parseFloat(window.shippingrates.ch.priceValue);
                                    deliveryBarFinalTextEl.style.display = 'none';
                                    deliveryBarLeftTextEl.style.display = 'block';
                                    deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                    deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems / window.shippingrates.ch.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                    window.cartBarWidth = (subtotalPriceWithoutNoShippingItems / window.shippingrates.ch.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                    window.cartBarValue = '€' + (parseFloat(window.shippingrates.ch.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                } else {
                                    deliveryBarFinalTextEl.style.display = 'block';
                                    deliveryBarLeftTextEl.style.display = 'none';
                                    deliveryPriceValue = 0;
                                    deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                                    deliveryBarStepLineEl.style.width = '100%';
                                }
                                window.unlockCheckoutButton();
    
                            }
                            break;
                        default:
                            deliveryIcon.style.left = "100%"
                            // use de
                            if (window.shippingrates.de.minSubtotalPriceValue > subtotalPriceWithoutNoShippingItems) {
                                deliveryCostEl.textContent = '€' + window.shippingrates.de.priceValue.replace('.', ',');
                                deliveryPriceValue = parseFloat(window.shippingrates.de.priceValue);
                                deliveryBarFinalTextEl.style.display = 'none';
                                deliveryBarLeftTextEl.style.display = 'block';
                                deliveryBarValueEl.textContent = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                                deliveryBarStepLineEl.style.width = (subtotalPriceWithoutNoShippingItems / window.shippingrates.de.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                window.cartBarWidth = (subtotalPriceWithoutNoShippingItems / window.shippingrates.de.minSubtotalPriceValue * 100).toFixed(2) + '%';
                                window.cartBarValue = '€' + (parseFloat(window.shippingrates.de.minSubtotalPriceValue) - parseFloat(subtotalPriceWithoutNoShippingItems)).toFixed(2).replace('.', ',');
                            } else {
                                deliveryBarFinalTextEl.style.display = 'block';
                                deliveryBarLeftTextEl.style.display = 'none';
                                deliveryPriceValue = 0;
                                deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                                deliveryBarStepLineEl.style.width = '100%';
                            }
                            window.unlockCheckoutButton();
    
                    }
                } else {
                    deliveryIcon.style.left = "100%"
                    deliveryPriceValue = 0;
                    deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
                    window.unlockCheckoutButton();
                }
    
                // set price with location based shipping costs
                const priceWithoutShipping = parseFloat(subtotalPriceEl.textContent.replace('€', '').replace(',', '.'));
                totalPriceEl.textContent = '€' + (priceWithoutShipping + deliveryPriceValue).toFixed(2);
            }
            /** /Delivery after ip +*/
    
            if (scData.stage == 'complete') {
                cartSidebar.attr('data-dcart-code', scData.code);
                const cartCouponSection = document.querySelector('.Drawer__Footer__Coupon');
                const coupon = cartCouponSection.querySelector('.Drawer__Footer__Coupon-percentage');
                const discountAmount = cartCouponSection.querySelector('.sc_code-info .money.mw-price')?.textContent;
    
                if (discountAmount === undefined) {
                    const cartSidebar = $('#sidebar-cart');
                    cartSidebar.removeAttr('data-dcart-code');
    
                    setTimeout(function () {
                        const subtotalPrice = cartSidebar.find('.Drawer__Footer__Subtotal > span');
    
                        if (subtotalPrice.children('span.money').length) {
                            subtotalPrice.children('span.money').text(subtotalPrice.attr('data-price'));
                            // subtotalPrice.children('span.money').text("yobro");
    
                        } else {
                            subtotalPrice.text(subtotalPrice.attr('data-price'));
                            // subtotalPrice.text("yobro");
                        }
    
                        const totalPrice = cartSidebar.find('.Drawer__Footer__Total > span');
                        totalPrice.text(totalPrice.attr('data-price'));
                    }, 125);
    
                    const field = $('#sidebar-cart .Drawer__Footer .scDiscount input[type="text"]');
                    field.removeClass('active');
    
                    const percentage = $('.Drawer__Footer__Coupon-percentage');
                    percentage.text('');
    
                    const totalPrice = document.querySelector('.Drawer__Footer__Total span')
                    const couponCodeSet = document.querySelector('#sidebar-cart[data-dcart-code]')
    
                    if (totalPrice && couponCodeSet == null) {
                        totalPrice.textContent = totalPrice?.dataset?.price
                    }
                }
    
                if (scData.discount.value > 0) {
                    coupon.textContent = '-' + discountAmount;
    
                } else {
                    coupon.textContent = '';
                }
    
                /* Subtotal price */
                const subtotalOldPrice = cartSidebar.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > s > span.money');
                let subtotalOldPriceValue = parseFloat(scData.total);
    
                const subtotalNewPrice = cartSidebar.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > span.money');
               
                let subTotalPrice = scData?.subtotalCents / 100;
                let subtotalNewPriceValue = parseFloat(subTotalPrice);
                // console.log(scData)
      
                /* /Subtotal price */
                document.querySelector("#sidebar-cart .Drawer__Footer__SubtotalPrice").dataset.price = scData?.subtotalFormatted;
    
                /* Total price */
                const totalPrice = cartSidebar.find('.Drawer__Footer__Total > span');
    
                subtotalNewPrice.text('€' + subtotalNewPriceValue)
    
                const totalPriceValue = parseFloat(subtotalNewPriceValue + deliveryPriceValue);
    
                totalPrice.text(window.obj.priceToStr(totalPriceValue));
    
                /* /Total price */
            }
    
            if (deliveryBarTextEl) {
                deliveryBarTextEl.style.filter = 'blur(0)';
            }
        }, 550);
    
        /* Error */
        const couponError = cartSidebar.find('.scDiscount__container .scError');
    
        if (couponError.length && !couponError.hasClass('Hidden')) {
            couponError.addClass('Hidden');
    
            setTimeout(function () {
                couponError.css('opacity', 0);
    
                setTimeout(function () {
                    couponError.remove();
                }, 450);
            }, 3000);
        }
        /* /Error */
    };
}


window.obj.cartSidebar = function () {

    $(document).on('click', '#sidebar-cart .CartUpsells__ScrollBtn', function () {
        const btn = $(this);
        btn.removeClass('Visible');

        $('#sidebar-cart .Drawer__Main').animate({
            scrollTop: 1000
        }, 2000);
    });

    $(document).on('click', '#sidebar-cart .CartItem__Actions__UpsellBtn', function () {
        const btn = $(this);
        btn.prop('disabled', true);
    });

    $(document).on('click', '#sidebar-cart .Drawer__Footer .Drawer__Footer__Coupon-title', function () {
        const cartSidebar = $('#sidebar-cart');
        cartSidebar.toggleClass('Drawer__Footer__CouponActive');
    });

    $(document).on('click', '#sidebar-cart .CartItem__Actions__UpsellBtn', function () {
        const btn = $(this);
        btn.prop('disabled', true);
    });

    /* Remove discount */
    $(document).on('change keyup', '#sidebar-cart .Drawer__Footer .scDiscount input[type="text"]', function () {
        let field = $(this);
        let fieldLabel = field.next('label');
        let fieldButton = field.siblings('input[type="button"]');

        if (!fieldLabel.length) {
            field.after(
                '<label>' + field.attr('placeholder') + '</label>'
            );
        }

        if (field.val().trim().length) {
            field.addClass('active');

        } else {
            field.removeClass('active');
        }
    });


    window.addEventListener('sc:discount.init', function () {
        //console.log('dcart init');

        const cartSidebar = $('#sidebar-cart');
        cartSidebar.attr("data-dcart-calculated", 0);
        cartSidebar.addClass('Drawer__Footer__DCart-inited').removeClass('Drawer__Footer-loading');
        window.obj.cartSidebarRefresh(true);
        const scData = JSON.parse(sessionStorage.getItem("scDiscountData"));

        setTimeout(() => {
            const totalPrice = document.querySelector('.Drawer__Footer__Total span')
            const couponCodeSet = document.querySelector('#sidebar-cart[data-dcart-code]')

            if (totalPrice && couponCodeSet == null) {
                let scSubTotalPrice = scData?.subtotalCents / 100;
                let subTotalNewPriceValue = parseFloat(scSubTotalPrice + deliveryPriceValue);
                totalPrice.textContent = Shopify.scFormatMoney(subTotalNewPriceValue * 100);
            }
        }, 1000);
    });

    window.addEventListener('sc:discount.calculated', function () {


        const scData = JSON.parse(sessionStorage.getItem("scDiscountData"));

        setTimeout(() => {
            const totalPrice = document.querySelector('.Drawer__Footer__Total span')
            const couponCodeSet = document.querySelector('#sidebar-cart[data-dcart-code]')

            if (totalPrice && couponCodeSet == null) {
                let scSubTotalPrice = scData?.subtotalCents / 100;
                let subTotalNewPriceValue = parseFloat(scSubTotalPrice + deliveryPriceValue);
                totalPrice.textContent = Shopify.scFormatMoney(subTotalNewPriceValue * 100);
            }
        }, 1000);
        window.obj.cartSidebarRefresh(true);
    });

    window.addEventListener('sc:discount.remove', function () {
        const cartSidebar = $('#sidebar-cart');
        cartSidebar.removeAttr('data-dcart-code');

        setTimeout(function () {
            const subtotalPrice = cartSidebar.find('.Drawer__Footer__Subtotal > span');

            if (subtotalPrice.children('span.money').length) {
                subtotalPrice.children('span.money').text(subtotalPrice.attr('data-price'));

            } else {
                subtotalPrice.text(subtotalPrice.attr('data-price'));
            }

            const totalPrice = cartSidebar.find('.Drawer__Footer__Total > span');
            totalPrice.text(totalPrice.attr('data-price'));
        }, 125);

        const field = $('#sidebar-cart .Drawer__Footer .scDiscount input[type="text"]');
        field.removeClass('active');

        const percentage = $('.Drawer__Footer__Coupon-percentage');
        percentage.text('');

        window.obj.cartSidebarRefresh(true);

        const totalPrice = document.querySelector('.Drawer__Footer__Total span')
        const couponCodeSet = document.querySelector('#sidebar-cart[data-dcart-code]')

        if (totalPrice && couponCodeSet == null) {
            totalPrice.textContent = totalPrice?.dataset?.price
        }
    });
};

$(document).ready(function () {
    window.obj.cartSidebar();

    fetch('/browsing_context_suggestions.json')
        .then(response => response.json())
        .then(json => {
            window.currentCountry = json.detected_values.country.handle;
            // console.log("window.currentCountry: " + window.currentCountry);
        });
});
/* /Cart sidebar coupon */
