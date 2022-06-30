function delegate(el, evt, sel, handler) {
  
  el.addEventListener(evt, function(event) {
    var t = event.target;
    
    while (t && t !== this) {
      
      if (t.matches(sel)) {
        handler.call(t, event);
      }
      
      t = t.parentNode;
    }
  });
}

/* Cart sidebar coupon */
document.addEventListener("DOMContentLoaded", function(event) { 
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
  
  obj.cartSidebar = function(){
    console.log('cartSidebar');
    
    const cartSidebarSettings = {
      sidebar: document.querySelector('#sidebar-cart'),
      scrollButton: document.querySelector('#sidebar-cart .CartUpsells__ScrollBtn'),
      upsells: {
        buttons: document.querySelectorAll('#sidebar-cart .CartItem__Actions__UpsellBtn')
      },
      coupon: {
        title: document.querySelector('#sidebar-cart .Drawer__Footer .Drawer__Footer__Coupon-title')
      }
    };
    
    cartSidebarSettings.scrollButton.addEventListener('click', function() {
      cartSidebarSettings.scrollButton.classList.remove('Visible');
      document.querySelector('#sidebar-cart .Drawer__Main').scrollIntoView();
      
//       $('#sidebar-cart .Drawer__Main').animate({
//         scrollTop: 1000
//       }, 2000);
    });
    
    for (var i = 0; i < cartSidebarSettings.upsells.buttons.length; i++) {
      
      cartSidebarSettings.upsells.buttons.addEventListener('click', function() {
        let upsellBtn = cartSidebarSettings.upsells.buttons[i];
        upsellBtn.disabled = true;
      });
    }
    
//     $(document).on('click', '#sidebar-cart .CartItem__Actions__UpsellBtn', function() {
//       const btn = $(this);
//       btn.prop('disabled', true);
//     });
      console.log('coupon title', cartSidebarSettings.coupon.title);
    
    cartSidebarSettings.coupon.title.addEventListener('click', function() {
      console.log('coupon title');
      if (!cartSidebarSettings.sidebarCart.classList.contains('Drawer__Footer__CouponActive')) {
        cartSidebarSettings.sidebarCart.classList.add('Drawer__Footer__CouponActive');

      } else {
        cartSidebarSettings.sidebarCart.classList.remove('Drawer__Footer__CouponActive');
      }
    });
    
    delegate(document, 'click', '#sidebar-cart .Drawer__Footer .Drawer__Footer__Coupon-title', function(e) {
      
      if (!cartSidebarSettings.sidebarCart.classList.contains('Drawer__Footer__CouponActive')) {
        cartSidebarSettings.sidebarCart.classList.add('Drawer__Footer__CouponActive');

      } else {
        cartSidebarSettings.sidebarCart.classList.remove('Drawer__Footer__CouponActive');
      }
    });
    
    /* Remove discount */
    delegate(document, 'click', '#sidebar-cart .Drawer__Footer .sc_simple-info .sc-tag', function(e) {
      const field = document.querySelector('#sidebar-cart .Drawer__Footer .scDiscount input[type="text"]');
      field.classList.remove('active');

      const percentage = document.querySelector('.Drawer__Footer__Coupon-percentage');
      percentage.innerHTML = '';
    });
    
    delegate(document, 'change keyup', '#sidebar-cart .Drawer__Footer .scDiscount input[type="text"]', function(e) {
      let field = e;
      let fieldLabel = field.parentNode.querySelector('label');
          
      if (!fieldLabel) {
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
    
//     $(document).on('change keyup', '#sidebar-cart .Drawer__Footer .scDiscount input[type="text"]', function() {
//       let field = $(this);
//       let fieldLabel = field.next('label');
//       let fieldButton = field.siblings('input[type="button"]');

//       if (!fieldLabel.length) {
//         field.after(
//           '<label>' + field.getAttribute('placeholder') + '</label>'
//         );
//       }

//       if (field.value.trim().length) {
//         field.classList.add('active');

//       } else {
//         field.classList.add('active');
//       }
//     });

    setInterval(function() {
      const couponPercentage = document.querySelector('#sidebar-cart .Drawer__Footer__Coupon-percentage');
      
      /* Subtotal price */
      const subtotalOldPrice = document.querySelector('#sidebar-cart .Drawer__Footer .Drawer__Footer__SubtotalPrice > s > span.money');
      
      const subtotalNewPrice = document.querySelector('#sidebar-cart .Drawer__Footer .Drawer__Footer__SubtotalPrice > span.money');
      const subtotalNewPriceValue = obj.strToPrice(subtotalNewPrice.innerHTML);
      let subtotalPriceValue;
      
      let subtotalOldPriceValue;

      if (subtotalOldPrice) {
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
  };
  
  obj.cartSidebar();
});
/* /Cart sidebar coupon */