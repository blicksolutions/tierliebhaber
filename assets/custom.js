/* Cart sidebar coupon */
$(document).ready(function () {
  const obj = function(){};
  
  obj.priceToStr = function(price) {
    const currencySymbol = $('body').attr('data-currency-symbol');
    const str = currencySymbol + price.toFixed(2).replace(/\./, ',').replace(/^([0-9]+)([0-9]{3})\,/, '$1.$2,');
    return str;
  };
  
  obj.strToPrice = function(str) {
    const price = parseFloat(str.trim().replace(/\./, '').replace(/\,/, '.').replace(/[^0-9\.]+/, ''));
    return price;
  };
  
  obj.cartSidebar = (function(){
    
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

    setInterval(function() {
      const sidebarCart = $('#sidebar-cart');
      
      console.log('old price __');
      
      const couponPercentage = sidebarCart.find('.Drawer__Footer__Coupon-percentage');
      
      /* Subtotal price */
      const subtotalOldPrice = sidebarCart.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > s > span.money');
      
      const subtotalNewPrice = sidebarCart.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > span.money');
      const subtotalNewPriceValue = obj.strToPrice(subtotalNewPrice.text());
      let subtotalOldPriceValue;

      if (subtotalOldPrice.length) {
        subtotalOldPriceValue = obj.strToPrice(subtotalOldPrice.text());
        console.log('old price found');
        
      } else {
        subtotalOldPriceValue = obj.strToPrice(subtotalNewPrice.text());
        console.log('old price not found');
      }
      
      if (subtotalOldPrice.length) {
        subtotalOldPriceValue = obj.strToPrice(subtotalOldPrice.text());
        
        const giftItem = sidebarCart.find('.CartItemWrapper[data-free-gift="true"]');
        
        if (giftItem.length) {
          const giftItemPriceValue = obj.strToPrice(giftItem.find('.CartItem__OriginalPrice').text());
          console.log('giftItemPriceValue', giftItemPriceValue);
          subtotalOldPriceValue -= giftItemPriceValue;
        }

        const percentageValue = (subtotalOldPriceValue - subtotalNewPriceValue) / subtotalOldPriceValue * 100;
        couponPercentage.text('-' + Math.ceil(percentageValue.toFixed(4)) + '%');
      
      } else {
        couponPercentage.text('');
      }
      /* /Subtotal price */
      
      /* Delivery price */
      const deliveryPrice = $('.Drawer__Footer__Delivery > span');
      const deliveryPriceValue = obj.strToPrice(deliveryPrice.attr('data-price'));
      /* /Delivery price */
      
      /* Total price */
      const totalPrice = $('.Drawer__Footer__Total > span');
      const totalPriceValue = subtotalNewPriceValue + deliveryPriceValue;
      totalPrice.text(obj.priceToStr(totalPriceValue));
      /* /Total price */
      
      console.log('subtotalOldPriceValue', subtotalOldPriceValue, 'deliveryPriceValue', deliveryPriceValue, 'totalPriceValue', totalPriceValue);
      
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

    }, 500);
    
  })();
});
/* /Cart sidebar coupon */