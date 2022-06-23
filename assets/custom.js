/* Cart sidebar coupon */
$(document).ready(function () {
  const obj = function(){};
  
  obj.cartSidebar = (function(){
    $(document).on('click', '#sidebar-cart .Drawer__Footer .Drawer__Footer__Coupon-title', function() {
      const sidebarCart = $('#sidebar-cart');
      sidebarCart.toggleClass('Drawer__Footer__CouponActive');
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
      const oldPrice = sidebarCart.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > s > span.money');
      const percentage = sidebarCart.find('.Drawer__Footer__Coupon-percentage');

      if (oldPrice.length) {
        const oldPriceValue = parseFloat(oldPrice.text().trim().replace(/\,/, ''));

        const newPrice = sidebarCart.find('.Drawer__Footer .Drawer__Footer__SubtotalPrice > span.money');
        
        if (newPrice.length) {
          const newPriceValue = parseFloat(newPrice.text().trim().replace(/\,/, ''));
          console.log('newPriceValue', newPriceValue);

          const percentageValue = (oldPriceValue - newPriceValue) /oldPriceValue * 100;

          console.log('newPriceValue', newPriceValue, 'oldPriceValue', oldPriceValue, 'percentageValue', percentageValue);
          percentage.text('-' + Math.ceil(percentageValue) + '%');
        
        } else {
          percentage.text('');
        }

      } else {
        percentage.text('');
      }

    }, 1000);
  
    
    
  })();
});
/* /Cart sidebar coupon */