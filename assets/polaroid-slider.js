/* Polaroid Slider */

$(document).ready(function () {
    $(".section-polaroid-slider .slider").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: false,
      autoplay: true,
      autoplaySpeed: 5000,
      touchMove: true,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
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
  