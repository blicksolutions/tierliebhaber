window.activateAbTlh033 = () => {
	document.querySelector(".Product__SlideshowMobileNav").classList.add("Product__SlideshowMobileNav--hidden");
	document.querySelector(".Product__SlideshowMobileNav--variation-b").style.display = "block";

	new Flickity('.Product__SlideshowMobileNav--variation-b', {
		asNavFor: '.Product__Slideshow',
		contain: true,
		pageDots: false,
		prevNextButtons: true,
		cellAlign: 'left'
	  });
};

document.addEventListener("DOMContentLoaded", () => {
    window.activateAbTlh033();
});