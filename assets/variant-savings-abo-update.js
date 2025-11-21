// ========================================
// VARIANT SAVINGS - ABO PRICE UPDATE
// Updated savings when switching to subscription
// ========================================

(function() {
  'use strict';

  console.log('💰 Variant Savings - Abo Update initialized');

  // Get original variant prices
  const getOriginalVariantPrice = (variantElement) => {
    const optionValue = variantElement.getAttribute('data-js-option-value');
    
    // Find variant by option value
    const variants = window.productVariants || [];
    const variant = variants.find(v => v.option1 === optionValue || v.option2 === optionValue || v.option3 === optionValue);
    
    return variant ? variant.price : null;
  };

  // Update savings display
  const updateVariantSavings = () => {
    // Check if subscription is selected
    const isSubscription = document.querySelector('input[name="purchase_type"][value="autodeliver"]:checked') ||
                          document.querySelector('.rc_widget__option--active:not(.rc-option__onetime)');
    
    if (!isSubscription) {
      console.log('ℹ️ One-time purchase - resetting to original savings');
      
      // Reset to original savings
      const variantItems = document.querySelectorAll('[data-js-variant-selector-item]');
      variantItems.forEach(item => {
        const savingsElement = item.querySelector('.VariantSelector__OptionSavings');
        if (!savingsElement) return;
        
        const originalSavings = item.getAttribute('data-js-savings');
        if (originalSavings && savingsElement.classList.contains('VariantSelector__OptionSavings--subscription')) {
          // Add - if not present
          const formattedOriginal = originalSavings.startsWith('-') ? originalSavings : `-${originalSavings}`;
          savingsElement.textContent = formattedOriginal;
          savingsElement.classList.remove('VariantSelector__OptionSavings--subscription');
          console.log(`🔄 Reset to original: ${formattedOriginal}`);
        }
      });
      
      return;
    }

    // Get subscription discount percentage
    let subscriptionDiscount = 0;
    const discountElement = document.querySelector('.rc_widget__option__discount, [data-discount]');
    if (discountElement) {
      const discountText = discountElement.textContent;
      const match = discountText.match(/(\d+)%/);
      if (match) {
        subscriptionDiscount = parseInt(match[1]);
        console.log(`🔖 Subscription discount: ${subscriptionDiscount}%`);
      }
    }

    if (subscriptionDiscount === 0) {
      console.log('ℹ️ No subscription discount found');
      return;
    }

    // Update all variant savings
    const variantItems = document.querySelectorAll('[data-js-variant-selector-item]');
    
    variantItems.forEach(item => {
      const savingsElement = item.querySelector('.VariantSelector__OptionSavings');
      if (!savingsElement) return;

      const optionValue = item.getAttribute('data-js-option-value');
      
      // Get variant by option value
      const variant = getVariantByOption(optionValue);
      if (!variant) {
        console.log(`⚠️ Variant not found for: ${optionValue}`);
        return;
      }

      // Calculate subscription price
      const subscriptionPrice = Math.round(variant.price * (1 - subscriptionDiscount / 100));
      
      // Calculate savings: compare_at_price - subscription_price
      let savings = 0;
      if (variant.compare_at_price && variant.compare_at_price > subscriptionPrice) {
        savings = variant.compare_at_price - subscriptionPrice;
      } else {
        // Fallback: if no compare_at_price, use original price - subscription price
        savings = variant.price - subscriptionPrice;
      }
      
      if (savings <= 0) return;
      
      // Format with Shopify money format
      const formattedSavings = formatMoney(savings);
      
      savingsElement.textContent = `-${formattedSavings}`;
      savingsElement.classList.add('VariantSelector__OptionSavings--subscription');
      
      console.log(`✅ Updated savings for ${optionValue}: compare(${variant.compare_at_price || variant.price}) - sub(${subscriptionPrice}) = ${savings}`);
    });
  };

  // Get variant by option value - Match Liquid structure
  const getVariantByOption = (optionValue) => {
    const productData = document.querySelector('script[type="application/json"][data-product-json]');
    if (!productData) {
      console.log('⚠️ Product JSON not found');
      return null;
    }

    try {
      const data = JSON.parse(productData.textContent);
      const product = data.product;
      
      // Match by title (e.g., "150ml" in variant.title)
      const variant = product.variants.find(v => 
        v.title === optionValue || 
        v.title.includes(optionValue) ||
        v.option1 === optionValue ||
        v.option2 === optionValue ||
        v.option3 === optionValue
      );
      
      if (variant) {
        console.log(`✅ Found variant for ${optionValue}:`, {
          title: variant.title,
          price: variant.price,
          compare_at_price: variant.compare_at_price
        });
      } else {
        console.log(`⚠️ Variant not found for: ${optionValue}`);
        console.log('Available variants:', product.variants.map(v => v.title));
      }
      
      return variant;
    } catch (e) {
      console.error('Error parsing product data:', e);
      return null;
    }
  };

  // Format money using Shopify format
  const formatMoney = (cents) => {
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      return Shopify.formatMoney(cents, window.theme.moneyFormat || '{{amount}}');
    }
    return '€' + (cents / 100).toFixed(2).replace('.', ',');
  };

  // Watch for ReCharge widget changes
  const watchRechargeChanges = () => {
    // Watch for clicks on ReCharge options
    document.addEventListener('click', (e) => {
      const rechargeOption = e.target.closest('.rc_widget__option');
      if (rechargeOption) {
        console.log('🔄 ReCharge option clicked');
        setTimeout(updateVariantSavings, 100);
      }
    }, { once: false });
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      watchRechargeChanges();
      updateVariantSavings();
    });
  } else {
    watchRechargeChanges();
    setTimeout(updateVariantSavings, 1000);
  }

  console.log('✅ Variant Savings Abo Update ready');

})();