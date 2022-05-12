/* Polaroid Slider */

$(document).ready(function () {
    $(".section-polaroid-slider .slider").slick({
      centerMode: true,
      centerPadding: '60px',
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: true,
      //autoplay: true,
      //autoplaySpeed: 5000,
      touchMove: true,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
            arrows: false,
            centerMode: true,
            infinite: true,
            centerPadding: '130px',
          },
        },
        {
          breakpoint: 767,
          settings: {
            dots: false,
          },
        },
         {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            dots: false,
            arrows: false,
            centerMode: true,
            infinite: true,
            centerPadding: '80px',
          },
        },
      ],
    });
  });
