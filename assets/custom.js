/* Cart sidebar coupon */
$(document).ready(function () {
  const obj = function(){};
  
  obj.priceToStr = function(price) {
    const currencySymbol = $('body').attr('data-currency-symbol');
    const str = currencySymbol + price.toFixed(2).replace(/\./, ',').replace(/^([0-9]+)([0-9]{3})\,/, '$1.$2,');
    return str;
  };
  
  obj.strToPrice = function(str) {
    
    if (!str) {
      return null;
    }
    
    const price = parseFloat(str.trim().replace(/\./, '').replace(/\,/, '.').replace(/[^0-9\.]+/, ''));
    return price;
  };
  
  obj.cartSidebarRefresh = function() {
    
  };
  
  obj.cartSidebar = (function(){
    
    window.addEventListener('sc:discount.init', function() {
      console.log('dcart init');
      
    });
    
    
    $(document).on('click', '#sidebar-cart .CartUpsells__ScrollBtn', function() {
      const btn = $(this);
      btn.removeClass('Visible');
      
      $('#sidebar-cart .Drawer__Main').animate({
        scrollTop: 1000
      }, 2000);
    });

    $(document).on('click', '#sidebar-cart .CartItem__Actions__UpsellBtn', function() {
      const btn = $(this);
      btn.prop('disabled', true);
    });
    
    $(document).on('click', '#sidebar-cart .Drawer__Footer .Drawer__Footer__Coupon-title', function() {
      const sidebarCart = $('#sidebar-cart');
      sidebarCart.toggleClass('Drawer__Footer__CouponActive');
    });

    $(document).on('click', '#sidebar-cart .CartItem__Actions__UpsellBtn', function() {
      const btn = $(this);
      btn.prop('disabled', true);
    });

    /* Remove discount */
    $(document).on('click', '#sidebar-cart .Drawer__Footer .sc_simple-info .sc-tag', function() {
      const field = $('#sidebar-cart .Drawer__Footer .scDiscount input[type="text"]');
      field.removeClass('active');

      const percentage = $('.Drawer__Footer__Coupon-percentage');
      percentage.text('');
    });

    $(document).on('change keyup', '#sidebar-cart .Drawer__Footer .scDiscount input[type="text"]', function() {
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

    window.addEventListener('sc:discount.calculated', function() {
      console.log('dcart calculated');
      
      const sidebarCart = $('#sidebar-cart');
      
      const couponPercentage = sidebarCart.find('.Drawer__Footer__Coupon-percentage');
      
      /* Subtotal price */
      const subtotalOldPrice = sidebarCart.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > s > span.money');
      
      const subtotalNewPrice = sidebarCart.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > span.money');
      let subtotalNewPriceValue = obj.strToPrice(subtotalNewPrice.text());
      
      let forDeliverySubtotalPriceValue;

      if (subtotalOldPrice.length) {
        let subtotalOldPriceValue = obj.strToPrice(subtotalOldPrice.text());
        forDeliverySubtotalPriceValue = subtotalOldPriceValue;
        
        const giftItem = sidebarCart.find('.CartItemWrapper[data-free-gift="true"]');
        
        /* If the gift item is added */
        if (giftItem.length) {
          const giftItemPriceValue = obj.strToPrice(giftItem.find('.CartItem__OriginalPrice').text());
          
          if ((subtotalOldPriceValue - giftItemPriceValue) > subtotalNewPriceValue) {
            subtotalOldPriceValue -= giftItemPriceValue;
            subtotalOldPrice.attr('data-updated-price', obj.priceToStr(subtotalOldPriceValue));
          
          } else {
            subtotalOldPrice.removeAttr('data-updated-price');
          }
        }

        const percentageValue = (subtotalOldPriceValue - subtotalNewPriceValue) / subtotalOldPriceValue * 100;
        
        if (percentageValue > 0) {
          couponPercentage.text('-' + Math.ceil(percentageValue.toFixed(4)) + '%');
        
        } else {
          couponPercentage.text('');
        }
        
      } else {
        couponPercentage.text('');
        
        if (subtotalNewPrice.text().trim() != subtotalNewPrice.parent().attr('data-price')) {
          subtotalNewPrice.text(subtotalNewPrice.parent().attr('data-price'));
          subtotalNewPriceValue = obj.strToPrice(subtotalNewPrice.parent().attr('data-price'));
        }
        
        forDeliverySubtotalPriceValue = subtotalNewPriceValue;
      }
      
      const subtotalPriceValue = subtotalNewPriceValue;
      /* /Subtotal price */
      
      /* Delivery price */
      const deliveryPrice = $('.Drawer__Footer__Delivery > span');
      let deliveryPriceValue;
      
      if (forDeliverySubtotalPriceValue > 39) {
        const freeShippingText = deliveryPrice.attr('data-freeshipping-text');
        deliveryPriceValue = 0;
        deliveryPrice.text(freeShippingText);
        
      } else {
        const deliveryCostText = deliveryPrice.attr('data-shipping-price');
        deliveryPriceValue = obj.strToPrice(deliveryCostText);
        deliveryPrice.text(deliveryCostText);
      }
      /* /Delivery price */
      
      /* Total price */
      const totalPrice = $('.Drawer__Footer__Total > span');
      const totalPriceValue = subtotalPriceValue + deliveryPriceValue;
      
      if (totalPriceValue > 1) {
        totalPrice.text(obj.priceToStr(totalPriceValue));
      }
      /* /Total price */
      
      /* Error */
      const couponError = sidebarCart.find('.scDiscount__container .scError');
      
      if (couponError.length && !couponError.hasClass('Hidden')) {
        couponError.addClass('Hidden');

        setTimeout(function() {
          couponError.css('opacity', 0);

          setTimeout(function() {
            couponError.remove();
          }, 450);
        }, 3000);
      }
      /* /Error */
    });
    
  })();
});
/* /Cart sidebar coupon */