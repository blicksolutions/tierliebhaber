(() => {
  function initSwiper() {
    const slider = document.querySelector('.Benefits.swiper');
    if (!slider) return;

    const swiper = new Swiper(slider, {
      centerInsufficientSlides: true,
      pagination: {
        el: ".swiper-pagination-benefits",
        clickable: true
      },
      autoHeight: true,
      spaceBetween: 30,
      breakpoints: {
        600: {
          slidesPerView: 2,
          spaceBetween: 40
        },
        1008: {
          slidesPerView: 3,
          spaceBetween: 0
        }
      },
      simulateTouch: true
    });
  }

  function waitForSwiper() {
    if (typeof Swiper !== 'undefined') {
      initSwiper();
    } else {
      setTimeout(waitForSwiper, 50); // Check alle 50ms
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSwiper);
  } else {
    waitForSwiper();
  }
})();