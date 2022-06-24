/* Cart sidebar coupon */
$(document).ready(function () {
  const obj = function(){};
  
  obj.cartSidebar = (function(){
    
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
      
      const couponPercentage = sidebarCart.find('.Drawer__Footer__Coupon-percentage');
      const totalOldPrice = sidebarCart.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > s > span.money');

      if (totalOldPrice.length) {
        /* Total price */
        const totalOldPriceValue = parseFloat(totalOldPrice.text().trim().replace(/\,/, '.').replace(/[^0-9\.]+/, ''));

        const totalNewPrice = sidebarCart.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > span.money');
        const totalNewPriceValue = parseFloat(totalNewPrice.text().trim().replace(/\,/, '.').replace(/[^0-9\.]+/, ''));
        
        const percentageValue = (totalOldPriceValue - totalNewPriceValue) / totalOldPriceValue * 100;
        couponPercentage.text('-' + Math.ceil(percentageValue) + '%');
        /* /Total price */

        /* Delivery price */
        const deliveryPrice = $('.Drawer__Footer__Delivery > span');
        const deliveryPriceValue = parseFloat(deliveryPrice.text().trim().replace(/\,/, '.').replace(/[^0-9\.]+/, ''));
        /* /Delivery price */

        /* Products total price */
        const totalProductsPrice = $('.Drawer__Footer__ProductsTotal > span');
        totalProductsPrice.text($('body').attr('data-currency-symbol') + (totalNewPriceValue - deliveryPriceValue).toFixed(2).replace(/\./, ','));
        /* /Products total price */
        
        $('.Drawer__Footer__ProductsTotal, .Drawer__Footer__Subtotal').addClass('Loaded');
        
      } else {
        couponPercentage.text('');
      }
      
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

    }, 1000);
    
  })();
});
/* /Cart sidebar coupon */