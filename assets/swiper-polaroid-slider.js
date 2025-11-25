document.addEventListener('DOMContentLoaded', function() {
  const swiperEl = document.querySelector('.section-polaroid-slider .slider');
  
  if (swiperEl) {
    const swiper = new Swiper(swiperEl, {
      slidesPerView: 3,
      centeredSlides: true,
      spaceBetween: 20,
      loop: true,
      watchOverflow: false, // Wichtig!
      
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      
      navigation: {
        nextEl: '.section-polaroid-slider .swiper-button-next',
        prevEl: '.section-polaroid-slider .swiper-button-prev',
      },
      
      breakpoints: {
        0: {
          slidesPerView: 1.4, // Zeigt angeschnittene Slides
          spaceBetween: 10,
          centeredSlides: true,
        },
        700: {
          slidesPerView: 2.4,
          spaceBetween: 15,
          centeredSlides: true,
        },
        980: {
          slidesPerView: 3.5,
          spaceBetween: 20,
          centeredSlides: true,
        }
      }
    });
  }
});