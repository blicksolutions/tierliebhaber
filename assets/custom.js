/* Cart sidebar coupon */

if (1 === 3) {

$(document).ready(function () {
  const obj = function(){};
  
  obj.priceToStr = function(price) {
    const currencySymbol = document.body.getAttribute('data-currency-symbol');
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
      const sidebarCart = document.querySelector('#sidebar-cart');
      
      if (sidebarCart.classList.contains('Drawer__Footer__CouponActive')) {
        sidebarCart.classList.add('Drawer__Footer__CouponActive');

      } else {
        sidebarCart.classList.add('Drawer__Footer__CouponActive');
      }
    });

    $(document).on('click', '#sidebar-cart .CartItem__Actions__UpsellBtn', function() {
      const btn = $(this);
      btn.prop('disabled', true);
    });

    /* Remove discount */
    $(document).on('click', '#sidebar-cart .Drawer__Footer .sc_simple-info .sc-tag', function() {
      const field = document.querySelector('#sidebar-cart .Drawer__Footer .scDiscount input[type="text"]');
      field.classList.remove('active');

      const percentage = document.querySelector('.Drawer__Footer__Coupon-percentage');
      percentage.innerHTML = '';
    });

    $(document).on('change keyup', '#sidebar-cart .Drawer__Footer .scDiscount input[type="text"]', function() {
      let field = $(this);
      let fieldLabel = field.next('label');
      let fieldButton = field.siblings('input[type="button"]');

      if (!fieldLabel.length) {
        field.after(
          '<label>' + field.getAttribute('placeholder') + '</label>'
        );
      }

      if (field.value.trim().length) {
        field.classList.add('active');

      } else {
        field.classList.add('active');
      }
    });

    setInterval(function() {
      const sidebarCart = $('#sidebar-cart');
      
      const couponPercentage = document.querySelector('#sidebar-cart .Drawer__Footer__Coupon-percentage');
      
      /* Subtotal price */
      const subtotalOldPrice = document.querySelector('#sidebar-cart .Drawer__Footer .Drawer__Footer__SubtotalPrice > s > span.money');
      
      const subtotalNewPrice = document.querySelector('#sidebar-cart .Drawer__Footer .Drawer__Footer__SubtotalPrice > span.money');
      const subtotalNewPriceValue = obj.strToPrice(subtotalNewPrice.text());
      let subtotalPriceValue;
      
      let subtotalOldPriceValue;

      if (subtotalOldPrice.length) {
        subtotalOldPriceValue = obj.strToPrice(subtotalOldPrice.innerHTML);
        subtotalPriceValue = subtotalOldPriceValue;
        
        const giftItem = document.querySelector('#sidebar-cart .CartItemWrapper[data-free-gift="true"]');
        
        if (giftItem) {
          const giftItemPriceValue = obj.strToPrice(giftItem.querySelector('.CartItem__OriginalPrice').innerHTML);
          subtotalOldPriceValue -= giftItemPriceValue;
        }

        const percentageValue = (subtotalOldPriceValue - subtotalNewPriceValue) / subtotalOldPriceValue * 100;
        couponPercentage.text('-' + Math.ceil(percentageValue.toFixed(4)) + '%');
        
      } else {
        subtotalPriceValue = subtotalNewPriceValue;
        couponPercentage.innerHTML = '';
      }
      /* /Subtotal price */
      
      /* Delivery price */
      const deliveryPrice = document.querySelector('#sidebar-cart .Drawer__Footer__Delivery > span');
      const deliveryPriceValue = obj.strToPrice(deliveryPrice.getAttribute('data-price'));
      /* /Delivery price */
      
      /* Total price */
      const totalPrice = document.querySelector('#sidebar-cart .Drawer__Footer__Total > span');
      const totalPriceValue = subtotalPriceValue + deliveryPriceValue;
      
      if (totalPriceValue > 1) {
        totalPrice.innerHTML = obj.priceToStr(totalPriceValue);
      }
      /* /Total price */
      
      /* Error */
      const couponError = document.querySelector('#sidebar-cart .scDiscount__container .scError');
      
      if (couponError && !couponError.classList.contains('Hidden')) {
        couponError.classList.add('Hidden');

        setTimeout(function() {
          couponError.style.opacity = 0;

          setTimeout(function() {
            couponError.parentNode.removeChild(couponError);
            
          }, 450);
        }, 3000);
      }
      /* /Error */

    }, 500);
    
  })();
});
}
/* /Cart sidebar coupon */