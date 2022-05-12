/* Polaroid Slider */

$(document).ready(function () {
    $(".section-polaroid-slider .slider").slick({
      slidesToShow: 7,
      slidesToScroll: 1,
      infinite: true,
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
  