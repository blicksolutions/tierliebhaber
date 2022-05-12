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
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            centerPadding: '60px',
            dots: false,
            arrows: false,
            centerMode: true,
            centerPadding: "30px",
            infinite: true,
          },
        },
      ],
    });
  });
