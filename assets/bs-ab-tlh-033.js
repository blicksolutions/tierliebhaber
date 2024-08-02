window.activateAbTlh033 = () => {
	if (
		location.pathname.endsWith("/products/dentalspray") ||
		location.pathname.endsWith("/products/dentalspray-tl0010-fb-d4") ||
		location.pathname.endsWith("/products/gras-kotfresser-drops-2") ||
		location.pathname.endsWith("/products/gras-kotfresser-drops-3") ||
		location.pathname.endsWith("/products/z-snack") ||
		location.pathname.endsWith("/products/tl0036-fb-z2") ||
		location.pathname.endsWith("/products/z-spot") ||
		location.pathname.endsWith("/products/z-bundle-zb") ||
		location.pathname.endsWith("/products/z-bundle-r20")
	) {
		document.querySelector(".Product__SlideshowMobileNav").classList.add("Product__SlideshowMobileNav--hidden");
		document.querySelector(".Product__SlideshowMobileNav--variation-b").style.display = "block";

		new Flickity(".Product__SlideshowMobileNav--variation-b", {
			asNavFor: ".Product__Slideshow",
			contain: true,
			pageDots: false,
			prevNextButtons: true,
			cellAlign: "left",
		});
	}
};
