/* Polaroid Slider */

$(document).ready(function () {
    $(".section-polaroid-slider .slider").slick({
      centerMode: true,
      centerPadding: '100px',
      slidesToShow: 5,
      slidesToScroll: 1,
      slidesPerRow: 3,
      infinite: true,
      //autoplay: true,
      //autoplaySpeed: 5000,
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
