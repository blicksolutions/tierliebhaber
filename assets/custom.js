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

window.obj.cartSidebarRefresh = function (replaceDelivery) {
    if (1 === 3) {

        // donation product shipping removal - probably delete soon when a better solution is found
        const donationProductIDDe = 7973987385612;
        const donationProductIDEn = 8068154949900;
        const shippingSpan = document.querySelector('.Drawer__Footer__Delivery span');
        const cartList = document.querySelector('.Drawer__Container .Cart__ItemList');
        const priceTotalTag = document.querySelector('.Drawer__Footer__Total span');
        let freeShipping = true;

        cartList.childNodes.forEach((item) => {
            if (item instanceof HTMLElement) {
                if (!(item.dataset.productId == donationProductIDDe || item.dataset.productId == donationProductIDEn)) {
                    freeShipping = false;
                }
            }
        });

        if (freeShipping) {
            shippingSpan.innerText = 'kostenlos';
            priceTotalTag.textContent = '€' + ((priceTotalTag.textContent.replace('€', '').replace(',', '.') - 4.90).toFixed(2)).replace('.', ',');
        }
        // /donation product shipping removal
    }

    // console.log('cartSidebarRefresh');

    const cartSidebar = $('#sidebar-cart');
    setTimeout(() => {
        cartSidebar.removeClass('Drawer__Footer-loading');
    }, 1000);
    cartSidebar.attr("data-dcart-calculated", (parseInt(cartSidebar.attr("data-dcart-calculated")) + 1));

    const scData = JSON.parse(sessionStorage.getItem("scDiscountData"));

    /** Delivery after ip +*/

    // elements
    setTimeout(() => {
        const subtotalPriceEl = document.querySelector('.Drawer__Footer__SubtotalPrice span');
        const deliveryCostEl = document.querySelector('.Drawer__Footer__Delivery span');
        const totalPriceEl = document.querySelector('.Drawer__Footer__Total span');
        const deliveryBarValueEl = document.querySelector('.js-cart-drawer-delivery-left-value');
        const deliveryBarLeftTextEl = document.querySelector('.CartMessage__Steps__Text-left');
        const deliveryBarFinalTextEl = document.querySelector('.CartMessage__Steps__Text-final');
        const deliveryBarStepLineEl = document.querySelector('.CartMessage__StepsLines__Active');
        const deliveryBarTextEl = document.querySelector('.CartMessage__Steps__Text');
        const cartItems = document.querySelectorAll('.Drawer__Container .CartItemWrapper[data-price]');
        const giftItemId = 43855770747148;
        let noDeliveryItemsTotalPrice = 0;
        let hasItemWithDeliveryRequired = false;

        console.log("imma bee")

        // vars
        let deliveryPriceValue = window.shippingrates.otherLocations.priceValue;
        const subtotalPriceValue = parseFloat(subtotalPriceEl?.textContent.replace('€', '').replace(',', '.'));

        // exclude items with no shipping requirement from shipping calculation
        cartItems.forEach((cartItem) => {
            if (cartItem.dataset.reqShipping == 'false') {
                noDeliveryItemsTotalPrice += parseFloat(cartItem.dataset.price / 100);
            } else {
                hasItemWithDeliveryRequired = true;
            }
        });

        const subtotalPriceWithoutNoShippingItems = subtotalPriceValue - noDeliveryItemsTotalPrice;

        if (replaceDelivery && subtotalPriceEl && deliveryCostEl && totalPriceEl && deliveryBarValueEl && deliveryBarLeftTextEl && deliveryBarFinalTextEl && deliveryBarStepLineEl && deliveryBarTextEl) {
            if (hasItemWithDeliveryRequired) {
                switch (window.currentCountry) {
                    case 'DE':
                        if (window.shippingrates.de.minSubtotalPriceValue >= subtotalPriceWithoutNoShippingItems) {
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


                        // add free gift if subtotal >= 100
                        if (subtotalPriceValue >= 100) {
                            let giftItemAdded = false;

                            cartItems.forEach((item) => {
                                if (item.dataset.variantId == giftItemId) {
                                    console.log("THERE IS A GIFTITEM")
                                    giftItemAdded = true;
                                }
                            })

                            if (!giftItemAdded) {
                                fetch("/cart/add.json", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json"
                                    },
                                    body: JSON.stringify({
                                        id: 43855770747148,
                                        quantity: 1
                                    })
                                }).then(() => {
                                    document.querySelector('.Cart__ItemList').firstElementChild.classList.add('freeGiftItem');
                                })
                            }
                        } else {

                            console.log("UNTER 100€")
                            // variant 43855770747148
                            // product 8129601700108
                            async function removeItem(data) {
                                const result = await fetch("/cart/change.json", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json"
                                    },
                                    body: JSON.stringify({
                                        id: 43855770747148,
                                        quantity: 0
                                    })
                                });

                                return result.json();
                            }

                            function removeItemById(id) {
                                return removeItem({ id: id });
                            }

                            function removeItemByLine(oneBasedLineIndex) {
                                return removeItem({ line: oneBasedLineIndex });
                            }

                            removeItemById().then(r => console.log(r))

                            console.log("IS DURCH")



                        }
                        break;
                    case 'AT':
                        if (window.shippingrates.at.minSubtotalPriceValue >= subtotalPriceWithoutNoShippingItems) {
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
                        break;
                    case 'CH':
                        if (window.shippingrates.ch.minSubtotalPriceValue >= subtotalPriceWithoutNoShippingItems) {
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
                        break;
                    default:
                        // use de
                        if (window.shippingrates.de.minSubtotalPriceValue >= subtotalPriceWithoutNoShippingItems) {
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
                }
            } else {
                deliveryPriceValue = 0;
                deliveryCostEl.textContent = deliveryCostEl.getAttribute('data-freeshipping-text');
            }

            // set price with location based shipping costs
            const priceWithoutShipping = parseFloat(subtotalPriceEl.textContent.replace('€', '').replace(',', '.'));
            totalPriceEl.textContent = '€' + (priceWithoutShipping + deliveryPriceValue).toFixed(2);

            // console.log("replaced delivery")
        }
        /** /Delivery after ip +*/

        if (scData.stage == 'complete') {
            cartSidebar.attr('data-dcart-code', scData.code);

            /* Percentage */
            const couponPercentage = cartSidebar.find('.Drawer__Footer__Coupon-percentage');

            if (scData.discount.value > 0) {
                couponPercentage.text('-' + parseInt(scData.discount.value) + '%');

            } else {
                couponPercentage.text('');
            }
            /* /Percentage */

            /* Subtotal price */
            const subtotalOldPrice = cartSidebar.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > s > span.money');
            let subtotalOldPriceValue = parseFloat(scData.total);

            const subtotalNewPrice = cartSidebar.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > span.money');
            let subtotalNewPriceValue = parseFloat(scData.subtotal);
            /* /Subtotal price */

            // old deliveryprice
            // const deliveryPrice = $('.Drawer__Footer__Delivery > span');
            // let deliveryPriceValue;
            //
            // const freeDeliveryAmount = parseFloat(cartSidebar.find('.CartMessage__StepsLines__Active').attr('data-free-delivery-amount'));
            // const freeShippingText = deliveryPrice.attr('data-freeshipping-text');
            //
            //
            //   if (forDeliverySubtotalPriceValue > freeDeliveryAmount) {
            //   deliveryPriceValue = 0;
            //   // deliveryPrice.text('upd: ' + freeShippingText);
            //
            // } else {
            //   const deliveryCostText = deliveryPrice.attr('data-shipping-price');
            //   deliveryPriceValue = window.obj.strToPrice(deliveryCostText);
            //
            //   // if (parseFloat(deliveryCostText) > 0) {
            //     // deliveryPrice.text(deliveryCostText);
            //
            //   // } else {
            //     // deliveryPriceValue = 0;
            //     // deliveryPrice.text(freeShippingText);
            //   // }
            // }
            // /* /Delivery price */

            // const giftItem = cartSidebar.find('.CartItemWrapper[data-free-gift="true"]');

            // console.log('giftItem', giftItem.length);
            // /* If the gift item is added */
            // if (giftItem.length) {
            //     const giftItemPriceValue = window.obj.strToPrice(giftItem.find('.CartItem__OriginalPrice').text());
            //     subtotalOldPriceValue -= giftItemPriceValue;
            //
            //     setTimeout(function () {
            //         subtotalOldPrice.text(window.obj.priceToStr(subtotalOldPriceValue));
            //     }, 1500);
            // }

            /* Total price */
            const totalPrice = cartSidebar.find('.Drawer__Footer__Total > span');
            const totalPriceValue = parseFloat(subtotalNewPriceValue + deliveryPriceValue);

            totalPrice.text(window.obj.priceToStr(totalPriceValue));
            /* /Total price */

        } else {
            cartSidebar.removeAttr('data-dcart-code');
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
        // console.log('dcart init');

        const cartSidebar = $('#sidebar-cart');
        cartSidebar.attr("data-dcart-calculated", 0);
        cartSidebar.addClass('Drawer__Footer__DCart-inited').removeClass('Drawer__Footer-loading');

        window.obj.cartSidebarRefresh(true);
    });

    window.addEventListener('sc:discount.calculated', function () {
        // console.log('dcart calculated');
        window.obj.cartSidebarRefresh(true);
    });

    window.addEventListener('sc:discount.remove', function () {
        // console.log('dcart remove');

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
