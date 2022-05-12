/* Polaroid Slider */

$(document).ready(function () {
    $(".section-polaroid-slider .slider").slick({
      centerMode: true,
      centerPadding: '60px',
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
  

$(".section-polaroid-slider .slider").on("afterChange", testingThings);
$(".section-polaroid-slider .slider").on("breakpoint", testingThings);
$(".section-polaroid-slider .slider").on("init", testingThings);

function testingThings (event, slick) {
  var slidesToShow = slick.slickGetOption("slidesToShow");

  if (slidesToShow % 2 == 0) {
    // Even number of slides in Slick Carousel is incorrectly offset.
    // Adjust active slides.
    slick["$slides"][slick.slickCurrentSlide()].previousElementSibling.classList.add("slick-test")
    slick["$slides"][slick.slickCurrentSlide()].nextElementSibling.classList.remove("slick-test")
  }
}