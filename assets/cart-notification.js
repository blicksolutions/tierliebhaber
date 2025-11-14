// Product Notification Drawer - Production Version
// Features: Variant selection, cart filtering, remove on quantity 0, clean code

(function() {
  'use strict';

  const notificationDrawer = document.querySelector('#product-notification-drawer');
  let currentVariantId = null;
  let currentLineKey = null;
  let currentQuantity = 1;
  let isUpdating = false;
  let currentCart = null;

  if (!notificationDrawer) return;

  // Main function to show product notification
  window._showProductNotification = function(productDetail) {
    if (!notificationDrawer || !productDetail) return;

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

    // Fetch cart to check existing items and get line key
    fetch('/cart.js')
      .then(r => r.json())
      .then(cart => {
        currentCart = cart;
        
        // Filter out upsells that are already in cart
        upsellProducts = filterUpsellsNotInCart(upsellProducts, cart);
        
        // Check if we should show notification or go straight to cart
        if (upsellProducts.length === 0 && productDetail.upsell_products && productDetail.upsell_products.length > 0) {
          // All upsells are in cart, open cart drawer directly
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

        // Update notification content
        updateNotificationContent(variant, quantity);

        // Store upsell products globally
        window._currentUpsellProducts = upsellProducts;

        // Update upsell products
        updateUpsellProducts(upsellProducts);

        // Show the drawer
        notificationDrawer.style.display = 'block';
        setTimeout(() => {
          notificationDrawer.classList.add('is-visible');
        }, 10);
      })
      .catch(err => {
        // Fallback: show notification anyway
        updateNotificationContent(variant, quantity);
        window._currentUpsellProducts = upsellProducts;
        updateUpsellProducts(upsellProducts);
        notificationDrawer.style.display = 'block';
        setTimeout(() => {
          notificationDrawer.classList.add('is-visible');
        }, 10);
      });
  };

  // Filter out upsells already in cart
  function filterUpsellsNotInCart(upsellProducts, cart) {
    if (!upsellProducts || upsellProducts.length === 0) return [];
    
    const cartVariantIds = cart.items.map(item => item.variant_id);
    
    return upsellProducts.filter(product => {
      // Get all variant IDs for this product
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
      
      // Check if any variant is in cart
      return !productVariantIds.some(vid => cartVariantIds.includes(vid));
    });
  }

  // Open cart drawer
  function openCartDrawer() {
    const cartTrigger = document.querySelector('[data-action="open-drawer"][data-drawer-id="sidebar-cart"]');
    if (cartTrigger) {
      cartTrigger.click();
    }
  }

  // Update notification content
  function updateNotificationContent(variant, quantity) {
    updateNotificationImage(variant);

    const titleEl = notificationDrawer.querySelector('.ProductNotification__ProductTitle');
    // if (titleEl) {
    //   titleEl.textContent = variant.product_title || variant.name || 'Product';
    // }
    if (titleEl) {
      //console.log("variant.product_title: ", variant.product_title, "variant.name: ", variant.name);
      
      const name = variant.product_title || variant.name || 'Product';
      const cleanedName = name.split(' - ')[0].trim();
      
      titleEl.textContent = cleanedName;
    }

    const variantEl = notificationDrawer.querySelector('.ProductNotification__VariantValue');
    const variantContainer = notificationDrawer.querySelector('.ProductNotification__ProductVariant');
    if (variantEl && variantContainer) {
      if (variant.title && variant.title !== 'Default Title') {
        variantEl.textContent = variant.title;
        variantContainer.style.display = 'block';
      } else {
        variantContainer.style.display = 'none';
      }
    }

    updatePricing(variant);

    const quantityInput = notificationDrawer.querySelector('.QuantitySelector__Input');
    if (quantityInput) {
      quantityInput.value = quantity;
    }
  }

  // Update pricing
  function updatePricing(variant) {
    const priceEl = notificationDrawer.querySelector('.ProductNotification__ProductPrice');
    const comparePriceEl = notificationDrawer.querySelector('.ProductNotification__ComparePrice');
    
    if (!priceEl) return;

    let formattedPrice;
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      formattedPrice = Shopify.formatMoney(variant.price, window.theme.moneyFormat || '{{amount}}');
    } else {
      formattedPrice = '€' + (variant.price / 100).toFixed(2);
    }

    const hasComparePrice = variant.compare_at_price && variant.compare_at_price > variant.price;

    if (hasComparePrice && comparePriceEl) {
      let formattedComparePrice;
      if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
        formattedComparePrice = Shopify.formatMoney(variant.compare_at_price, window.theme.moneyFormat || '{{amount}}');
      } else {
        formattedComparePrice = '€' + (variant.compare_at_price / 100).toFixed(2);
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

  // Update notification image
  function updateNotificationImage(variantOrImageUrl) {
    const imageContainer = notificationDrawer.querySelector('.ProductNotification__Image');
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

  // Update upsell products
  function updateUpsellProducts(upsellProducts) {
    const upsellSection = notificationDrawer.querySelector('.ProductNotification__Upsells');
    const upsellList = notificationDrawer.querySelector('.ProductNotification__UpsellList');
    
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

  // Create upsell product element
  function createUpsellProductElement(product, index) {
    console.log("testing", product);
    const hasMultipleVariants = product.variants && product.variants.length > 1;
    
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

    // Get first variant for single variant products
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
      formattedPrice = '€' + (price / 100).toFixed(2);
      if (comparePrice) {
        formattedComparePrice = '€' + (comparePrice / 100).toFixed(2);
      }
    }

    const hasComparePrice = comparePrice && comparePrice > price;
    const priceClass = hasComparePrice ? 'UpsellProduct__Price on-sale' : 'UpsellProduct__Price';
    const comparePriceClass = hasComparePrice ? 'UpsellProduct__ComparePrice has-compare-price' : 'UpsellProduct__ComparePrice';

    // Show first variant title for all products (if not "Default Title")
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

  // Add upsell product to cart
  function addUpsellToCart(product, buttonElement) {
    // Always add the first available variant directly
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : product;
    addVariantToCart(variant, product, buttonElement);
  }

  // Show variant selector modal
  function showVariantSelector(product, buttonElement) {
    const modal = createVariantSelectorModal(product);
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('is-visible'), 10);
    
    // Handle variant selection
    modal.addEventListener('click', function(e) {
      const variantOption = e.target.closest('[data-variant-index]');
      if (variantOption) {
        const variantIndex = parseInt(variantOption.dataset.variantIndex);
        const selectedVariant = product.variants[variantIndex];
        
        addVariantToCart(selectedVariant, product, buttonElement);
        closeVariantSelector(modal);
      }
      
      if (e.target.closest('[data-action="close-variant-selector"]') || e.target.classList.contains('VariantSelector__Overlay')) {
        closeVariantSelector(modal);
      }
    });
  }

  // Create variant selector modal
  function createVariantSelectorModal(product) {
    const modal = document.createElement('div');
    modal.className = 'VariantSelector';
    
    const variantsHTML = product.variants.map((variant, index) => {
      let price = variant.price;
      let comparePrice = variant.compare_at_price;
      
      let formattedPrice, formattedComparePrice;
      if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
        formattedPrice = Shopify.formatMoney(price, window.theme.moneyFormat || '{{amount}}');
        if (comparePrice) {
          formattedComparePrice = Shopify.formatMoney(comparePrice, window.theme.moneyFormat || '{{amount}}');
        }
      } else {
        formattedPrice = '€' + (price / 100).toFixed(2);
        if (comparePrice) {
          formattedComparePrice = '€' + (comparePrice / 100).toFixed(2);
        }
      }
      
      const hasComparePrice = comparePrice && comparePrice > price;
      const available = variant.available !== false;
      
      return `
        <div class="VariantSelector__Option ${!available ? 'is-unavailable' : ''}" data-variant-index="${index}">
          <div class="VariantSelector__OptionInfo">
            <span class="VariantSelector__OptionTitle">${variant.title}</span>
            <div class="VariantSelector__OptionPrice">
              ${hasComparePrice ? `<span class="VariantSelector__ComparePrice">${formattedComparePrice}</span>` : ''}
              <span class="VariantSelector__Price ${hasComparePrice ? 'on-sale' : ''}">${formattedPrice}</span>
            </div>
          </div>
          ${!available ? '<span class="VariantSelector__Unavailable">Out of Stock</span>' : ''}
        </div>
      `;
    }).join('');
    
    modal.innerHTML = `
      <div class="VariantSelector__Overlay"></div>
      <div class="VariantSelector__Content">
        <button class="VariantSelector__Close" data-action="close-variant-selector" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <h3 class="VariantSelector__Title">Select a variant</h3>
        <div class="VariantSelector__Options">
          ${variantsHTML}
        </div>
      </div>
    `;
    
    return modal;
  }

  // Close variant selector
  function closeVariantSelector(modal) {
    modal.classList.remove('is-visible');
    setTimeout(() => modal.remove(), 300);
  }

  // Add specific variant to cart
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
          refreshCartDrawer();
          
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

  // Add upsell product card
  function addUpsellProductCard(product, lineItem) {
    const addedSection = notificationDrawer.querySelector('.ProductNotification__AddedUpsells');
    if (!addedSection) return;

    addedSection.style.display = 'flex';

    const cardElement = createAddedUpsellCard(product, lineItem);
    addedSection.appendChild(cardElement);
  }

  // Create added upsell card
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
      formattedPrice = '€' + ((product.price || lineItem.price) / 100).toFixed(2);
      if (product.compare_at_price) {
        formattedComparePrice = '€' + (product.compare_at_price / 100).toFixed(2);
      }
    }

    const hasComparePrice = product.compare_at_price && product.compare_at_price > product.price;
    const priceClass = hasComparePrice ? 'AddedUpsellCard__Price on-sale' : 'AddedUpsellCard__Price';
    const comparePriceClass = hasComparePrice ? 'AddedUpsellCard__ComparePrice has-compare-price' : 'AddedUpsellCard__ComparePrice';

    const variantTitle = product.title && product.title !== 'Default Title' ? product.title : lineItem.variant_title;
    
    // Get the product title and split on '-' to get the first part
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

  // Update added upsell quantity
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
      refreshCartDrawer();
      
      if (newQuantity === 0) {
        // Re-enable the upsell button before removing the card
        const variantId = parseInt(cardElement.dataset.variantId);
        const upsellItems = notificationDrawer.querySelectorAll('.UpsellProduct');
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
        
        const addedSection = notificationDrawer.querySelector('.ProductNotification__AddedUpsells');
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

  // Close notification
  function closeNotification() {
    notificationDrawer.classList.remove('is-visible');
    setTimeout(() => {
      notificationDrawer.style.display = 'none';
      
      const addedSection = notificationDrawer.querySelector('.ProductNotification__AddedUpsells');
      if (addedSection) {
        addedSection.innerHTML = '';
        addedSection.style.display = 'none';
      }
      
      const upsellItems = notificationDrawer.querySelectorAll('.UpsellProduct');
      upsellItems.forEach(item => {
        item.style.opacity = '1';
        item.style.pointerEvents = 'auto';
      });
    }, 300);
  }

  // Update cart quantity for main product
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
      refreshCartDrawer();
      
      if (newQuantity === 0) {
        closeNotification();
      }
    })
    .catch(error => {
      isUpdating = false;
      
      const input = notificationDrawer.querySelector('.QuantitySelector__Input');
      if (input) {
        input.value = currentQuantity;
      }
    });
  }

  // Refresh cart drawer
  function refreshCartDrawer() {
    const cartDrawer = document.querySelector('#sidebar-cart');
    if (!cartDrawer) return;

    fetch(window.location.origin + '?view=ajax-cart')
      .then(response => response.text())
      .then(html => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const newCartContent = temp.querySelector('#sidebar-cart');
        
        if (newCartContent) {
          cartDrawer.innerHTML = newCartContent.innerHTML;
        }
      })
      .catch(error => {});
  }

  // Update cart count
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
  if (notificationDrawer) {
    const closeBtn = notificationDrawer.querySelector('[data-action="close-notification"]');
    if (closeBtn) closeBtn.addEventListener('click', closeNotification);

    const overlay = notificationDrawer.querySelector('.ProductNotification__Overlay');
    if (overlay) overlay.addEventListener('click', closeNotification);

    const continueBtn = notificationDrawer.querySelector('[data-action="continue-shopping"]');
    if (continueBtn) continueBtn.addEventListener('click', closeNotification);

    const viewCartBtn = notificationDrawer.querySelector('[data-action="view-cart"]');
    if (viewCartBtn) {
      viewCartBtn.addEventListener('click', function() {
        closeNotification();
        openCartDrawer();
      });
    }

    // Main product quantity
    const decreaseBtn = notificationDrawer.querySelector('[data-action="decrease-notification-qty"]');
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', function() {
        const input = notificationDrawer.querySelector('.QuantitySelector__Input');
        const qty = parseInt(input.value);
        const newQty = qty - 1;
        
        if (newQty >= 0) {
          currentQuantity = newQty;
          input.value = newQty;
          updateCartQuantity(newQty);
        }
      });
    }

    const increaseBtn = notificationDrawer.querySelector('[data-action="increase-notification-qty"]');
    if (increaseBtn) {
      increaseBtn.addEventListener('click', function() {
        const input = notificationDrawer.querySelector('.QuantitySelector__Input');
        const qty = parseInt(input.value);
        const newQty = qty + 1;
        
        currentQuantity = newQty;
        input.value = newQty;
        updateCartQuantity(newQty);
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && notificationDrawer.classList.contains('is-visible')) {
        closeNotification();
      }
    });

    // Event delegation for dynamic elements
    notificationDrawer.addEventListener('click', function(e) {
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

  // Listen for product:added event
  document.addEventListener('product:added', function(e) {
    if (e.detail && typeof window._showProductNotification === 'function') {
      setTimeout(function() {
        if (!notificationDrawer.classList.contains('is-visible')) {
          window._showProductNotification(e.detail);
        }
      }, 100);
    }
  });

})();