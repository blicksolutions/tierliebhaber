/* Cart sidebar coupon */
$(document).ready(function () {
  window.obj = function(){};
  
  window.obj.priceToStr = function(price) {
    const currencySymbol = $('body').attr('data-currency-symbol');
    const str = currencySymbol + price.toFixed(2).replace(/\./, ',').replace(/^([0-9]+)([0-9]{3})\,/, '$1.$2,');
    return str;
  };
  
  window.obj.strToPrice = function(str) {
    
    if (!str) {
      return null;
    }
    
    const price = parseFloat(str.trim().replace(/\./, '').replace(/\,/, '.').replace(/[^0-9\.]+/, ''));
    return price;
  };
  
  window.obj.cartSidebarRefresh = function() {
    console.log('cartSidebarRefresh');
    
    const cartSidebar = $('#sidebar-cart');
    cartSidebar.removeClass('Drawer__Footer-loading');
    cartSidebar.attr("data-dcart-calculated", (parseInt(cartSidebar.attr("data-dcart-calculated")) + 1));
    

    const scData = JSON.parse(sessionStorage.getItem("scDiscountData"));
    
    if (scData.stage == 'complete') {
      /* Percentage */
      const couponPercentage = cartSidebar.find('.Drawer__Footer__Coupon-percentage');

      if (scData.discount.value > 0) {
        couponPercentage.text(parseInt(scData.discount.value) + '%');

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

    /* Delivery price */
      let forDeliverySubtotalPriceValue = scData.total;

      const giftItem = cartSidebar.find('.CartItemWrapper[data-free-gift="true"]');

      /* If the gift item is added */
      if (giftItem.length) {
        const giftItemPriceValue = window.obj.strToPrice(giftItem.find('.CartItem__OriginalPrice').text());
        subtotalOldPriceValue -= giftItemPriceValue;
        subtotalOldPrice.text(window.obj.priceToStr(subtotalOldPriceValue));
      }

      const deliveryPrice = $('.Drawer__Footer__Delivery > span');
      let deliveryPriceValue;

      if (forDeliverySubtotalPriceValue > 39) {
        const freeShippingText = deliveryPrice.attr('data-freeshipping-text');
        deliveryPriceValue = 0;
        deliveryPrice.text(freeShippingText);

      } else {
        const deliveryCostText = deliveryPrice.attr('data-shipping-price');
        deliveryPriceValue = window.obj.strToPrice(deliveryCostText);
        deliveryPrice.text(deliveryCostText);
      }
      /* /Delivery price */

      /* Total price */
      const totalPrice = cartSidebar.find('.Drawer__Footer__Total > span');
      const totalPriceValue = parseFloat(subtotalNewPriceValue + deliveryPriceValue);
      
      console.log('__');
      console.log('subtotalNewPriceValue', subtotalNewPriceValue);
      console.log('deliveryPriceValue', deliveryPriceValue);
      console.log('totalPriceValue', totalPriceValue);
      
      totalPrice.text(window.obj.priceToStr(totalPriceValue) + '/');
      /* /Total price */
    }

    /* Error */
    const couponError = cartSidebar.find('.scDiscount__container .scError');

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
  };
  
  window.obj.cartSidebar = (function(){
    
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
      const cartSidebar = $('#sidebar-cart');
      cartSidebar.toggleClass('Drawer__Footer__CouponActive');
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

    window.addEventListener('sc:discount.init', function() {
      console.log('dcart init');
      
      const cartSidebar = $('#sidebar-cart');
      cartSidebar.attr("data-dcart-calculated", 0);
      cartSidebar.addClass('Drawer__Footer__DCart-inited').removeClass('Drawer__Footer-loading');
      
      window.obj.cartSidebarRefresh();
    });
    
    window.addEventListener('sc:discount.calculated', function() {
      console.log('dcart calculated');
      
      window.obj.cartSidebarRefresh();
    });
    
    window.addEventListener('sc:discount.remove', function() {
      console.log('dcart remove');
      
      const cartSidebar = $('#sidebar-cart');
      
      const totalPrice = cartSidebar.find('.Drawer__Footer__Total > span');
      totalPrice.text(totalPrice.attr('data-price')); 
    });
    
  })();
});
/* /Cart sidebar coupon */