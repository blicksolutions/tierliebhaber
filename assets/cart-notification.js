// Product Upsell Drawer - Production Version with ReCharge + Subscription Interval Support
// Features: Shows subscription interval, dynamic pricing, variant selection, cart filtering

(function() {
  'use strict';

  const upsellDrawer = document.querySelector('#product-notification-drawer');
  let currentVariantId = null;
  let currentLineKey = null;
  let currentQuantity = 1;
  let isUpdating = false;
  let currentCart = null;

  if (!upsellDrawer) return;

  // ============================================
  // SUBSCRIPTION INTERVAL DETECTION
  // ============================================

  function getSubscriptionInterval() {
    // Check ReCharge widget
    const rechargeSelect = document.querySelector('.rc_selling_plans__dropdown select, select[name="selling_plan"]');
    if (rechargeSelect && rechargeSelect.value) {
      const selectedOption = rechargeSelect.options[rechargeSelect.selectedIndex];
      const intervalText = selectedOption.textContent || selectedOption.innerText;
      
      // Extract interval (e.g., "Lieferung alle 60 Tage" or "Alle 60 Tage")
      const match = intervalText.match(/(\d+)\s*(Tag|Woche|Monat)/i);
      if (match) {
        const number = match[1];
        const unit = match[2].toLowerCase();
        
        const unitMap = {
          'tag': number == 1 ? 'Tag' : 'Tage',
          'tage': 'Tage',
          'woche': number == 1 ? 'Woche' : 'Wochen',
          'wochen': 'Wochen',
          'monat': number == 1 ? 'Monat' : 'Monate',
          'monate': 'Monate'
        };
        
        return `Lieferung alle ${number} ${unitMap[unit] || 'Tage'}`;
      }
    }

    // Check ABlyft frequency selector
    const ablyftFrequency = document.querySelector('#frequency');
    if (ablyftFrequency && ablyftFrequency.value) {
      const selectedOption = ablyftFrequency.options[ablyftFrequency.selectedIndex];
      const optionText = selectedOption.getAttribute('data-plan-option') || selectedOption.textContent;
      return optionText; // e.g., "Alle 60 Tage"
    }

    return null;
  }

  function isSubscriptionSelected() {
    // Check for ABlyft sections
    const ablyftSubscriptionSection = document.querySelector('#subscriptionSection.active');
    if (ablyftSubscriptionSection) return true;

    // Check for ReCharge
    const rechargeSubscription = document.querySelector('input[name="purchase_type"][value="autodeliver"]:checked');
    if (rechargeSubscription) return true;

    const rechargeWidget = document.querySelector('.rc_widget__option--active');
    if (rechargeWidget && rechargeWidget.textContent.toLowerCase().includes('abo')) return true;

    return false;
  }

  // ============================================
  // PRICE DETECTION (from previous version)
  // ============================================

  function getActualDisplayedPrice() {
    if (typeof window.getCurrentDisplayedPrice === 'function') {
      const priceData = window.getCurrentDisplayedPrice();
      if (priceData) {
        console.log('✅ Using universal pricing system:', priceData);
        return priceData.price;
      }
    }

    const priceSelectors = [
      '.ProductMeta__Price .Price--highlight',
      '.ProductMeta__PriceList .Price--highlight',
      '.product__price .price-item--sale',
      '.price__regular .price-item--regular',
      '.tl-0050-section.active .tl-0050-section-price-current'
    ];
    
    for (const selector of priceSelectors) {
      const priceEl = document.querySelector(selector);
      if (priceEl && priceEl.offsetParent !== null) {
        const priceText = priceEl.textContent.trim();
        const priceMatch = priceText.match(/[\d.,]+/);
        if (priceMatch) {
          const price = priceMatch[0].replace(',', '.');
          const priceInCents = Math.round(parseFloat(price) * 100);
          console.log('✅ Price from DOM:', selector, '→', priceInCents);
          return priceInCents;
        }
      }
    }
    
    console.log('⚠️ No displayed price found, using variant price');
    return null;
  }

  // ============================================
  // MAIN NOTIFICATION FUNCTION
  // ============================================

  window._showProductNotification = function(productDetail) {
    if (!upsellDrawer || !productDetail) return;

    const variant = productDetail.variant;
    const quantity = productDetail.quantity;
    let upsellProducts = productDetail.upsell_products || [];
    
    if (!variant) return;
    
    let variantId = variant.id || variant.variant_id;
    
    if (typeof variantId === 'string') {
      if (variantId.includes(':')) {
        variantId = variantId.split(':').pop();
      }
      variantId = variantId.replace(/\D/g, '');
    }
    variantId = parseInt(variantId, 10);
    
    currentVariantId = variantId;
    currentQuantity = quantity;

    // Get subscription info
    const isSubscription = isSubscriptionSelected();
    const subscriptionInterval = isSubscription ? getSubscriptionInterval() : null;

    // Get actual price
    const originalCompareAtPrice = variant.compare_at_price;
    const displayedPrice = getActualDisplayedPrice();
    
    if (displayedPrice !== null && displayedPrice !== variant.price) {
      console.log('✅ Price override - Original:', variant.price, 'New:', displayedPrice);
      if (!originalCompareAtPrice || originalCompareAtPrice <= variant.price) {
        variant.compare_at_price = variant.price;
      }
      variant.price = displayedPrice;
    }

    // Store subscription info globally
    window._currentSubscriptionInterval = subscriptionInterval;

    fetch('/cart.js')
      .then(r => r.json())
      .then(cart => {
        currentCart = cart;
        upsellProducts = filterUpsellsNotInCart(upsellProducts, cart);
        
        if (upsellProducts.length === 0 && productDetail.upsell_products && productDetail.upsell_products.length > 0) {
          openCartDrawer();
          return;
        }
        
        const lineItem = cart.items.find(item => item.variant_id === currentVariantId);
        
        if (lineItem) {
          currentLineKey = lineItem.key;
          
          if (!variant.featured_image && !variant.image && lineItem.image) {
            variant.featured_image = lineItem.image;
            updateNotificationImage(lineItem.image);
          }
        }

        updateNotificationContent(variant, quantity, subscriptionInterval);
        window._currentUpsellProducts = upsellProducts;
        updateUpsellProducts(upsellProducts);

        upsellDrawer.style.display = 'block';
        setTimeout(() => {
          upsellDrawer.classList.add('is-visible');
        }, 10);
      })
      .catch(err => {
        updateNotificationContent(variant, quantity, subscriptionInterval);
        window._currentUpsellProducts = upsellProducts;
        updateUpsellProducts(upsellProducts);
        upsellDrawer.style.display = 'block';
        setTimeout(() => {
          upsellDrawer.classList.add('is-visible');
        }, 10);
      });
  };

  // Filter out upsells already in cart
  function filterUpsellsNotInCart(upsellProducts, cart) {
    if (!upsellProducts || upsellProducts.length === 0) return [];
    
    const cartVariantIds = cart.items.map(item => item.variant_id);
    
    return upsellProducts.filter(product => {
      const productVariantIds = [];
      
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(v => {
          let vid = v.id || v.variant_id;
          if (typeof vid === 'string') {
            if (vid.includes(':')) vid = vid.split(':').pop();
            vid = vid.replace(/\D/g, '');
          }
          productVariantIds.push(parseInt(vid, 10));
        });
      } else {
        let vid = product.id || product.variant_id;
        if (typeof vid === 'string') {
          if (vid.includes(':')) vid = vid.split(':').pop();
          vid = vid.replace(/\D/g, '');
        }
        productVariantIds.push(parseInt(vid, 10));
      }
      
      return !productVariantIds.some(vid => cartVariantIds.includes(vid));
    });
  }

  function openCartDrawer() {
    const cartTrigger = document.querySelector('[data-action="open-drawer"][data-drawer-id="sidebar-cart"]');
    if (cartTrigger) {
      cartTrigger.click();
    }
  }

  // Update notification content with subscription interval
  function updateNotificationContent(variant, quantity, subscriptionInterval) {
    updateNotificationImage(variant);

    const titleEl = upsellDrawer.querySelector('.ProductNotification__ProductTitle');
    if (titleEl) {
      const name = variant.product_title || variant.name || 'Product';
      const cleanedName = name.split(' - ')[0].trim();
      titleEl.textContent = cleanedName;
    }

    // Update variant info INCLUDING subscription interval
    const variantEl = upsellDrawer.querySelector('.ProductNotification__VariantValue');
    const variantContainer = upsellDrawer.querySelector('.ProductNotification__ProductVariant');
    
    if (variantEl && variantContainer) {
      let variantText = '';
      
      // Show variant title
      if (variant.title && variant.title !== 'Default Title') {
        variantText = variant.title;
      }
      
      // Add subscription interval if exists
      if (subscriptionInterval) {
        if (variantText) {
          variantText += ` • ${subscriptionInterval}`;
        } else {
          variantText = subscriptionInterval;
        }
        console.log('✅ Showing subscription interval:', subscriptionInterval);
      }
      
      if (variantText) {
        variantEl.innerHTML = variantText;
        variantContainer.style.display = 'block';
      } else {
        variantContainer.style.display = 'none';
      }
    }

    updatePricing(variant);

    const quantityInput = upsellDrawer.querySelector('.QuantitySelector__Input');
    if (quantityInput) {
      quantityInput.value = quantity;
    }
  }

  function updatePricing(variant) {
    const priceEl = upsellDrawer.querySelector('.ProductNotification__ProductPrice');
    const comparePriceEl = upsellDrawer.querySelector('.ProductNotification__ComparePrice');
    
    if (!priceEl) return;

    let formattedPrice;
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      formattedPrice = Shopify.formatMoney(variant.price, window.theme.moneyFormat || '{{amount}}');
    } else {
      formattedPrice = '€' + (variant.price / 100).toFixed(2).replace('.', ',');
    }

    const hasComparePrice = variant.compare_at_price && variant.compare_at_price > variant.price;

    if (hasComparePrice && comparePriceEl) {
      let formattedComparePrice;
      if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
        formattedComparePrice = Shopify.formatMoney(variant.compare_at_price, window.theme.moneyFormat || '{{amount}}');
      } else {
        formattedComparePrice = '€' + (variant.compare_at_price / 100).toFixed(2).replace('.', ',');
      }

      comparePriceEl.textContent = formattedComparePrice;
      comparePriceEl.classList.add('has-compare-price');
      priceEl.classList.add('on-sale');
      priceEl.textContent = formattedPrice;
    } else {
      if (comparePriceEl) {
        comparePriceEl.textContent = '';
        comparePriceEl.classList.remove('has-compare-price');
      }
      priceEl.classList.remove('on-sale');
      priceEl.textContent = formattedPrice;
    }
  }

  function updateNotificationImage(variantOrImageUrl) {
    const imageContainer = upsellDrawer.querySelector('.ProductNotification__Image');
    if (!imageContainer) return;

    let imageSrc = null;
    
    if (typeof variantOrImageUrl === 'string') {
      imageSrc = variantOrImageUrl;
    } else {
      const variant = variantOrImageUrl;
      
      if (variant.featured_image && variant.featured_image.src) {
        imageSrc = variant.featured_image.src;
      } else if (variant.featured_image && typeof variant.featured_image === 'string') {
        imageSrc = variant.featured_image;
      } else if (variant.image) {
        imageSrc = variant.image;
      } else if (variant.featured_media && variant.featured_media.preview_image) {
        imageSrc = variant.featured_media.preview_image.src;
      }
    }
    
    if (imageSrc) {
      if (!imageSrc.startsWith('http')) {
        imageSrc = 'https:' + imageSrc;
      }
      
      imageSrc = imageSrc.replace(/\.(jpg|jpeg|png|gif|webp)/, '_300x300.$1');
      imageContainer.src = imageSrc;
    }
  }

  function updateUpsellProducts(upsellProducts) {
    const upsellSection = upsellDrawer.querySelector('.ProductNotification__Upsells');
    const upsellList = upsellDrawer.querySelector('.ProductNotification__UpsellList');
    
    if (!upsellSection || !upsellList) return;

    upsellList.innerHTML = '';

    if (!upsellProducts || upsellProducts.length === 0) {
      upsellSection.style.display = 'none';
      return;
    }

    upsellSection.style.display = 'block';

    upsellProducts.forEach((product, index) => {
      const upsellItem = createUpsellProductElement(product, index);
      upsellList.appendChild(upsellItem);
    });
  }

  function createUpsellProductElement(product, index) {
    const div = document.createElement('div');
    div.className = 'UpsellProduct';

    let imageSrc = '';
    if (product.featured_image && product.featured_image.src) {
      imageSrc = product.featured_image.src;
    } else if (product.featured_image && typeof product.featured_image === 'string') {
      imageSrc = product.featured_image;
    } else if (product.image) {
      imageSrc = product.image;
    }

    if (imageSrc && !imageSrc.startsWith('http')) {
      imageSrc = 'https:' + imageSrc;
    }

    if (imageSrc) {
      imageSrc = imageSrc.replace(/\.(jpg|jpeg|png|gif|webp)/, '_200x200.$1');
    }

    const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : product;
    
    let formattedPrice, formattedComparePrice;
    const price = firstVariant.price || product.price;
    const comparePrice = firstVariant.compare_at_price || product.compare_at_price;
    
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      formattedPrice = Shopify.formatMoney(price, window.theme.moneyFormat || '{{amount}}');
      if (comparePrice) {
        formattedComparePrice = Shopify.formatMoney(comparePrice, window.theme.moneyFormat || '{{amount}}');
      }
    } else {
      formattedPrice = '€' + (price / 100).toFixed(2).replace('.', ',');
      if (comparePrice) {
        formattedComparePrice = '€' + (comparePrice / 100).toFixed(2).replace('.', ',');
      }
    }

    const hasComparePrice = comparePrice && comparePrice > price;
    const priceClass = hasComparePrice ? 'UpsellProduct__Price on-sale' : 'UpsellProduct__Price';
    const comparePriceClass = hasComparePrice ? 'UpsellProduct__ComparePrice has-compare-price' : 'UpsellProduct__ComparePrice';
    const variantTitle = firstVariant.title && firstVariant.title !== 'Default Title' ? firstVariant.title : '';

    div.innerHTML = `
      <div class="UpsellProduct__ImageWrapper">
        <img class="UpsellProduct__Image" src="${imageSrc}" alt="${product.product_title || product.name || 'Product'}" />
      </div>
      <div class="UpsellProduct__Info">
        <h4 class="UpsellProduct__Title">${product.title}</h4>
        ${variantTitle ? `<p class="UpsellProduct__Variant">Variante: ${variantTitle}</p>` : ''}
        <div class="UpsellProduct__PriceContainer">
          ${hasComparePrice ? `<span class="${comparePriceClass}">${formattedComparePrice}</span>` : ''}
          <span class="${priceClass}">${formattedPrice}</span>
        </div>
      </div>
      <button class="UpsellProduct__AddButton" data-action="add-upsell" data-upsell-index="${index}" aria-label="Add to cart">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    `;

    return div;
  }

  function addUpsellToCart(product, buttonElement) {
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : product;
    addVariantToCart(variant, product, buttonElement);
  }

  function addVariantToCart(variant, product, buttonElement) {
    let variantId = variant.id || variant.variant_id;
    
    if (typeof variantId === 'string') {
      if (variantId.includes(':')) variantId = variantId.split(':').pop();
      variantId = variantId.replace(/\D/g, '');
    }
    
    variantId = parseInt(variantId, 10);
    
    if (!variantId || isNaN(variantId)) {
      alert('Invalid product variant');
      return;
    }

    buttonElement.classList.add('is-loading');
    buttonElement.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="40" stroke-dashoffset="10" opacity="0.5"><animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="1s" repeatCount="indefinite"/></circle></svg>';

    const formData = {
      items: [{
        id: variantId,
        quantity: 1
      }]
    };

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.description || err.message || 'Failed to add to cart');
        });
      }
      return response.json();
    })
    .then(data => {
      fetch('/cart.js')
        .then(r => r.json())
        .then(cart => {
          updateCartCount(cart);
          refreshCartDrawerHTML(cart);
          
          const lineItem = cart.items.find(item => item.variant_id === variantId);
          if (lineItem) {
            const productData = {
              ...product,
              ...variant,
              product_title: product.product_title || product.name,
              title: variant.title
            };
            addUpsellProductCard(productData, lineItem);
          }
        });

      buttonElement.classList.remove('is-loading');
      buttonElement.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10L8 14L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      buttonElement.style.background = '#86BC99';
      buttonElement.disabled = true;
      
      const upsellItem = buttonElement.closest('.UpsellProduct');
      if (upsellItem) {
        upsellItem.style.display = 'none';
        upsellItem.style.pointerEvents = 'none';
        upsellItem.dataset.variantId = variantId;
      }
    })
    .catch(error => {
      buttonElement.classList.remove('is-loading');
      buttonElement.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      alert('Unable to add product: ' + error.message);
    });
  }

  function addUpsellProductCard(product, lineItem) {
    const addedSection = upsellDrawer.querySelector('.ProductNotification__AddedUpsells');
    if (!addedSection) return;

    addedSection.style.display = 'flex';

    const cardElement = createAddedUpsellCard(product, lineItem);
    addedSection.appendChild(cardElement);
  }

  function createAddedUpsellCard(product, lineItem) {
    const div = document.createElement('div');
    div.className = 'AddedUpsellCard';
    div.dataset.lineKey = lineItem.key;
    div.dataset.variantId = product.id || product.variant_id || lineItem.variant_id;

    let imageSrc = lineItem.image || '';
    if (!imageSrc) {
      if (product.featured_image && product.featured_image.src) {
        imageSrc = product.featured_image.src;
      } else if (product.featured_image && typeof product.featured_image === 'string') {
        imageSrc = product.featured_image;
      } else if (product.image) {
        imageSrc = product.image;
      }
    }

    if (imageSrc && !imageSrc.startsWith('http')) {
      imageSrc = 'https:' + imageSrc;
    }

    if (imageSrc) {
      imageSrc = imageSrc.replace(/\.(jpg|jpeg|png|gif|webp)/, '_300x300.$1');
    }

    let formattedPrice, formattedComparePrice;
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      formattedPrice = Shopify.formatMoney(product.price || lineItem.price, window.theme.moneyFormat || '{{amount}}');
      if (product.compare_at_price) {
        formattedComparePrice = Shopify.formatMoney(product.compare_at_price, window.theme.moneyFormat || '{{amount}}');
      }
    } else {
      formattedPrice = '€' + ((product.price || lineItem.price) / 100).toFixed(2).replace('.', ',');
      if (product.compare_at_price) {
        formattedComparePrice = '€' + (product.compare_at_price / 100).toFixed(2).replace('.', ',');
      }
    }

    const hasComparePrice = product.compare_at_price && product.compare_at_price > product.price;
    const priceClass = hasComparePrice ? 'AddedUpsellCard__Price on-sale' : 'AddedUpsellCard__Price';
    const comparePriceClass = hasComparePrice ? 'AddedUpsellCard__ComparePrice has-compare-price' : 'AddedUpsellCard__ComparePrice';

    const variantTitle = product.title && product.title !== 'Default Title' ? product.title : lineItem.variant_title;
    const productName = product.product_title || product.name || lineItem.product_title || 'Product';
    const cleanedProductName = productName.split(' - ')[0].trim();

    div.innerHTML = `
      <div class="AddedUpsellCard__ImageWrapper">
        <img class="AddedUpsellCard__Image" src="${imageSrc}" alt="${product.product_title || product.name || lineItem.product_title || 'Product'}" />
      </div>
      <div class="AddedUpsellCard__Details">
        <h4 class="AddedUpsellCard__Title">${cleanedProductName}</h4>
        ${variantTitle && variantTitle !== 'Default Title' ? `<p class="AddedUpsellCard__Variant">Variante: <span class="AddedUpsellCard__VariantValue">${variantTitle}</span></p>` : ''}
        <div class="AddedUpsellCard__PriceContainer">
          ${hasComparePrice ? `<span class="${comparePriceClass}">${formattedComparePrice}</span>` : ''}
          <span class="${priceClass}">${formattedPrice}</span>
        </div>
        <div class="AddedUpsellCard__QuantityWrapper">
          <div class="QuantitySelector">
            <button class="QuantitySelector__Button QuantitySelector__Button--Minus" 
                    data-action="decrease-added-upsell-qty" 
                    aria-label="Decrease quantity">
              <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                <path d="M0 1H10" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <input type="number" 
                   class="QuantitySelector__Input" 
                   value="1" 
                   min="0" 
                   readonly 
                   aria-label="Quantity" />
            <button class="QuantitySelector__Button QuantitySelector__Button--Plus" 
                    data-action="increase-added-upsell-qty" 
                    aria-label="Increase quantity">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 0V10M0 5H10" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    return div;
  }

  function updateAddedUpsellQuantity(cardElement, newQuantity) {
    const lineKey = cardElement.dataset.lineKey;
    if (!lineKey) return;

    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: lineKey,
        quantity: newQuantity
      })
    })
    .then(response => response.json())
    .then(cart => {
      updateCartCount(cart);
      refreshCartDrawerHTML(cart);
      
      if (newQuantity === 0) {
        const variantId = parseInt(cardElement.dataset.variantId);
        const upsellItems = upsellDrawer.querySelectorAll('.UpsellProduct');
        upsellItems.forEach(item => {
          if (parseInt(item.dataset.variantId) === variantId) {
            item.style.display = 'flex';
            item.style.pointerEvents = 'auto';
            const button = item.querySelector('.UpsellProduct__AddButton');
            if (button) {
              button.disabled = false;
              button.style.background = '';
              button.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
            }
          }
        });
        
        cardElement.remove();
        
        const addedSection = upsellDrawer.querySelector('.ProductNotification__AddedUpsells');
        if (addedSection && addedSection.children.length === 0) {
          addedSection.style.display = 'none';
        }
      } else {
        const variantId = parseInt(cardElement.dataset.variantId);
        const lineItem = cart.items.find(item => item.variant_id === variantId);
        if (lineItem) {
          cardElement.dataset.lineKey = lineItem.key;
        }
      }
    })
    .catch(error => {
      const input = cardElement.querySelector('.QuantitySelector__Input');
      if (input) {
        input.value = parseInt(input.value) === newQuantity + 1 ? newQuantity : newQuantity + 1;
      }
    });
  }

  function closeNotification() {
    upsellDrawer.classList.remove('is-visible');
    setTimeout(() => {
      upsellDrawer.style.display = 'none';
      
      const addedSection = upsellDrawer.querySelector('.ProductNotification__AddedUpsells');
      if (addedSection) {
        addedSection.innerHTML = '';
        addedSection.style.display = 'none';
      }
      
      const upsellItems = upsellDrawer.querySelectorAll('.UpsellProduct');
      upsellItems.forEach(item => {
        item.style.opacity = '1';
        item.style.pointerEvents = 'auto';
      });
    }, 300);
  }

  function updateCartQuantity(newQuantity) {
    if (isUpdating || !currentLineKey) return;

    isUpdating = true;

    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: currentLineKey,
        quantity: newQuantity
      })
    })
    .then(response => response.json())
    .then(cart => {
      isUpdating = false;
      currentQuantity = newQuantity;
      
      updateCartCount(cart);
      refreshCartDrawerHTML(cart);
      
      if (newQuantity === 0) {
        closeNotification();
      }
    })
    .catch(error => {
      isUpdating = false;
      
      const input = upsellDrawer.querySelector('.QuantitySelector__Input');
      if (input) {
        input.value = currentQuantity;
      }
    });
  }

  function refreshCartDrawerHTML(cartData) {
    const cartDrawer = document.querySelector('#sidebar-cart');
    if (!cartDrawer) return;

    fetch(window.location.origin + '?view=ajax-cart&timestamp=' + Date.now())
      .then(response => response.text())
      .then(html => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        const newCartItems = temp.querySelector('.Cart__ItemList');
        const currentCartItems = cartDrawer.querySelector('.Cart__ItemList');
        
        if (newCartItems && currentCartItems) {
          currentCartItems.innerHTML = newCartItems.innerHTML;
        }
        
        const newFooter = temp.querySelector('.Drawer__Footer__Inner');
        const currentFooter = cartDrawer.querySelector('.Drawer__Footer__Inner');
        
        if (newFooter && currentFooter) {
          const dcartElement = currentFooter.querySelector('.Drawer__Footer__Coupon-dcart');
          currentFooter.innerHTML = newFooter.innerHTML;
          
          if (dcartElement) {
            const couponContent = currentFooter.querySelector('.Drawer__Footer__Coupon-content');
            if (couponContent) {
              couponContent.appendChild(dcartElement);
            }
          }
        }
        
        const newCartValues = temp.querySelector('.Cart__values');
        const currentCartValues = cartDrawer.querySelector('.Cart__values');
        
        if (newCartValues && currentCartValues) {
          currentCartValues.dataset.cartTotalPriceFloat = newCartValues.dataset.cartTotalPriceFloat;
        }
        
        setTimeout(() => {
          const changeEvent = new Event('change', { bubbles: true });
          cartDrawer.dispatchEvent(changeEvent);
          
          if (typeof window.unlockCheckoutButton === 'function') {
            window.unlockCheckoutButton();
          }
        }, 100);
      })
      .catch(error => {
        console.error('Cart refresh error:', error);
      });
  }

  function updateCartCount(cartData) {
    const selectors = [
      '.Header__CartCount',
      '.cart-count',
      '[data-cart-count]',
      '.CartCount',
      '#cart-count'
    ];
    
    let cartCountEl = null;
    for (const selector of selectors) {
      cartCountEl = document.querySelector(selector);
      if (cartCountEl) break;
    }
    
    if (cartCountEl && cartData.item_count !== undefined) {
      cartCountEl.textContent = cartData.item_count;
    }
  }

  // Event Listeners
  if (upsellDrawer) {
    const closeBtn = upsellDrawer.querySelector('[data-action="close-notification"]');
    if (closeBtn) closeBtn.addEventListener('click', closeNotification);

    const overlay = upsellDrawer.querySelector('.ProductNotification__Overlay');
    if (overlay) overlay.addEventListener('click', closeNotification);

    const continueBtn = upsellDrawer.querySelector('[data-action="continue-shopping"]');
    if (continueBtn) continueBtn.addEventListener('click', closeNotification);

    const viewCartBtn = upsellDrawer.querySelector('[data-action="view-cart"]');
    if (viewCartBtn) {
      viewCartBtn.addEventListener('click', function() {
        closeNotification();
        openCartDrawer();
      });
    }

    const decreaseBtn = upsellDrawer.querySelector('[data-action="decrease-notification-qty"]');
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', function() {
        const input = upsellDrawer.querySelector('.QuantitySelector__Input');
        const qty = parseInt(input.value);
        const newQty = qty - 1;
        
        if (newQty >= 0) {
          currentQuantity = newQty;
          input.value = newQty;
          updateCartQuantity(newQty);
        }
      });
    }

    const increaseBtn = upsellDrawer.querySelector('[data-action="increase-notification-qty"]');
    if (increaseBtn) {
      increaseBtn.addEventListener('click', function() {
        const input = upsellDrawer.querySelector('.QuantitySelector__Input');
        const qty = parseInt(input.value);
        const newQty = qty + 1;
        
        currentQuantity = newQty;
        input.value = newQty;
        updateCartQuantity(newQty);
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && upsellDrawer.classList.contains('is-visible')) {
        closeNotification();
      }
    });

    upsellDrawer.addEventListener('click', function(e) {
      const addButton = e.target.closest('[data-action="add-upsell"]');
      if (addButton) {
        const index = parseInt(addButton.dataset.upsellIndex);
        if (window._currentUpsellProducts && window._currentUpsellProducts[index]) {
          addUpsellToCart(window._currentUpsellProducts[index], addButton);
        }
        return;
      }

      const decreaseAddedBtn = e.target.closest('[data-action="decrease-added-upsell-qty"]');
      if (decreaseAddedBtn) {
        const card = decreaseAddedBtn.closest('.AddedUpsellCard');
        const input = card.querySelector('.QuantitySelector__Input');
        const qty = parseInt(input.value);
        const newQty = qty - 1;
        
        if (newQty >= 0) {
          input.value = newQty;
          updateAddedUpsellQuantity(card, newQty);
        }
        return;
      }

      const increaseAddedBtn = e.target.closest('[data-action="increase-added-upsell-qty"]');
      if (increaseAddedBtn) {
        const card = increaseAddedBtn.closest('.AddedUpsellCard');
        const input = card.querySelector('.QuantitySelector__Input');
        const qty = parseInt(input.value);
        const newQty = qty + 1;
        
        input.value = newQty;
        updateAddedUpsellQuantity(card, newQty);
        return;
      }
    });
  }

  document.addEventListener('product:added', function(e) {
    if (e.detail && typeof window._showProductNotification === 'function') {
      setTimeout(function() {
        if (!upsellDrawer.classList.contains('is-visible')) {
          window._showProductNotification(e.detail);
        }
      }, 100);
    }
  });

  console.log('✅ Product Upsell Drawer Loaded (with Subscription Interval Support)');

})();