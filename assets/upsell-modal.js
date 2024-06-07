document.addEventListener('DOMContentLoaded', function () {
    if (window.innerWidth > 1024) {
        const countdownElement = document.getElementById('acc-upsell-countdown');
        initializeCountdown(countdownElement);
        initializeSlider();
        checkAllProductHandlesInCart();
        checkUrlAndAdjustUpsellDisplay();
        checkProductAvailability('darmpflege-bundle')
            .then(isDarmpflegeAvailable => {
                fetch('/cart.js')
                    .then(response => response.json())
                    .then(cart => {
                        const zahnpflegeBundleInCart = cart.items.some(item => item.handle === 'zahnpflege-bundle');
                        const darmpflegeBundleInCart = cart.items.some(item => item.handle === 'darmpflege-bundle');
                        var zahnpflegeUpsell = document.querySelector('.zahnpflege-upsell');
                        var darmpflegeUpsell = document.querySelector('.darmpflege-upsell');
                        updateUpsellDisplay(zahnpflegeBundleInCart, darmpflegeBundleInCart, zahnpflegeUpsell, darmpflegeUpsell, isDarmpflegeAvailable);
                        var addToCartButton = document.querySelector('.ProductForm__AddToCart');
                        var cartDrawer = document.getElementById('sidebar-cart');
                        var upsellModal = document.querySelector('.acc-modal');
                        var upsellModalWrapper = document.querySelector('.acc_tl_upsell_24');
                        var closeButton = document.querySelector('.acc-upsell-close-icon');
                        var pageOverlay = document.querySelector('.PageOverlay');
                        if (upsellModalWrapper && pageOverlay && pageOverlay.parentNode) {
                            pageOverlay.parentNode.insertBefore(upsellModalWrapper, pageOverlay);
                        }
                        if (addToCartButton) {
                            addToCartButton.addEventListener('click', function (event) {
                                event.preventDefault();
                                checkProductsInCartAndToggleModal(upsellModal, isDarmpflegeAvailable, zahnpflegeBundleInCart, darmpflegeBundleInCart);
                                cartDrawer.style.display = 'none';
                            });
                        }
                        if (closeButton && upsellModal && cartDrawer) {
                            closeButton.addEventListener('click', function () {
                                upsellModal.style.visibility = 'hidden';
                                cartDrawer.style.display = 'block';
                            });
                        }
                        document.addEventListener('click', function (event) {
                            if (event.target === upsellModal) {
                                upsellModal.style.display = 'hidden';
                                cartDrawer.style.display = 'block';
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching cart:', error));
            });
    }
});

function checkUrlAndAdjustUpsellDisplay() {
    var currentUrl = window.location.href;
    // console.log("Current URL:", currentUrl);
    if (currentUrl.includes('zahn') || currentUrl.includes('dental')) {
        // console.log("URL contains 'zahn' or 'dental'. Hiding .zahnpflege-upsell element.");
        
        var zahnpflegeUpsell = document.querySelector('.zahnpflege-upsell');
        if (zahnpflegeUpsell) {
            zahnpflegeUpsell.style.display = 'none';
        }
    } else {
        // console.log("URL does not contain 'zahn' or 'dental'.");
    }
}

function updateUpsellDisplay(zahnpflegeInCart, darmpflegeInCart, zahnpflegeUpsell, darmpflegeUpsell, isDarmpflegeAvailable, isZahnpflegeAvailable) {
    if (zahnpflegeInCart && zahnpflegeUpsell) {
        zahnpflegeUpsell.style.display = 'none';
        if (darmpflegeUpsell && isDarmpflegeAvailable) {
            darmpflegeUpsell.style.display = 'flex';
        }
    } else if (darmpflegeInCart && darmpflegeUpsell) {
        darmpflegeUpsell.style.display = 'none';
    }
    // console.log("Upsell display updated");
}

function checkProductAvailability(productHandle) {
    return fetch(`https://tierliebhaber.de/products/${productHandle}.json`)
        .then(response => response.json())
        .then(data => {
            // console.log(`${productHandle} data:`, data);
            return data.product.variants.some(variant => variant.inventory_management === 'shopify' && variant.available);
        })
        .catch(error => {
            console.error(`Error checking ${productHandle} availability:`, error);
            return false;
        });
}

function checkProductsInCartAndToggleModal(upsellModal, isDarmpflegeAvailable, isZahnpflegeAvailable) {
    fetch('/cart.js')
        .then(response => response.json())
        .then(cart => {
            // console.log("Cart items in checkProductsInCartAndToggleModal:", cart.items);

            const zahnpflegeBundleInCart = cart.items.some(item => item.handle === 'zahnpflege-bundle');
            const darmpflegeBundleInCart = cart.items.some(item => item.handle === 'darmpflege-bundle');

            var zahnpflegeUpsell = document.querySelector('.zahnpflege-upsell');
            var darmpflegeUpsell = document.querySelector('.darmpflege-upsell');

            updateUpsellDisplay(zahnpflegeBundleInCart, darmpflegeBundleInCart, zahnpflegeUpsell, darmpflegeUpsell, isDarmpflegeAvailable, isZahnpflegeAvailable);
            checkIfUpsellProductInCartAndUpdateCartDisplay(document.getElementById('sidebar-cart'), ['zahnpflege-bundle', 'darmpflege-bundle']);

            if (zahnpflegeBundleInCart && darmpflegeUpsell && isDarmpflegeAvailable) {
                showModal(upsellModal);
            } else if (darmpflegeBundleInCart) {
                upsellModal.style.display = 'none'; 
            } else if (!zahnpflegeBundleInCart && !darmpflegeBundleInCart) {
                showModal(upsellModal);
            }
        })
        .catch(error => console.error('Error fetching cart:', error));
}


function initializeSlider() {
    var reviewSlider = $('.acc-upsell-trustpilot-reviews');
    if (reviewSlider.length && !reviewSlider.hasClass('slick-initialized')) {
        reviewSlider.slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
            nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>'
        });
        // console.log("Slider initialized");
    } else {
        // console.log("Slider already initialized or not present");
    }
}


function initializeCountdown(element) {
    let endTime = localStorage.getItem('countdownEndTime');
    if (!endTime || new Date(endTime) <= new Date()) {
        endTime = new Date(new Date().getTime() + 8 * 60 * 1000 + 35 * 1000);
        localStorage.setItem('countdownEndTime', endTime);
        // console.log("Countdown initialized with new endTime:", endTime);
    }

    setInterval(function() {
        const now = new Date();
        const distance = new Date(endTime) - now;
        if (distance <= 0) {
            localStorage.removeItem('countdownEndTime');
            initializeCountdown(element);
        } else {
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            element.textContent = formatTime(minutes) + ":" + formatTime(seconds);
        }
    }, 1000);
}

function formatTime(number) {
    return number < 10 ? "0" + number : number;
}

function showModal(upsellModal) {
    if (upsellModal) {
        upsellModal.style.visibility = 'visible';
        // console.log("Show modal");
    }
}

function checkIfUpsellProductInCartAndUpdateCartDisplay(cartDrawer, upsellProducts) {
    fetch('/cart.js')
        .then(response => response.json())
        .then(cart => {
            // console.log("Cart items in checkIfUpsellProductInCartAndUpdateCartDisplay:", cart.items);
            const isUpsellProductInCart = cart.items.some(item => upsellProducts.includes(item.handle));
            // console.log("Is upsell product in cart:", isUpsellProductInCart);
            if (isUpsellProductInCart) {
                cartDrawer.style.display = 'block';
                // console.log("Displaying cart drawer");
            } else {
                cartDrawer.style.display = 'none';
                // console.log("Hiding cart drawer");
            }
        })
        .catch(error => console.error('Error fetching cart:', error));
}

function checkAllProductHandlesInCart() {
    fetch('/cart.js')
        .then(response => response.json())
        .then(cart => {
            // console.log("All product handles in cart:");
            cart.items.forEach(item => {
                // console.log(item.handle);
            });
        })
        .catch(error => console.error('Error fetching cart:', error));
}

function fetchProductHandle(productId) {
  fetch(`/products/${productId}.js`)
    .then(response => response.json())
    .then(product => {
      // console.log("Product handle:", product.handle);
      // Use the product handle as needed
    })
    .catch(error => console.error("Fetching product data failed", error));
}
