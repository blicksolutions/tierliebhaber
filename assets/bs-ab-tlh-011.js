window.activateAbTlh011 = () => {
    const replaceImages = (newImages) => {
        const sliderImages = document.querySelectorAll('.Product__SlideItem--image img');
        const sliderThumbImages = document.querySelectorAll('.Product__SlideshowNavImage img');

        sliderThumbImages.forEach((thumbImage, i) => {
            if (i < newImages.length) {
                thumbImage.srcset = '';
                thumbImage.src = newImages[i];
            }
        });

        sliderImages.forEach((sliderImage, i) => {
            if (i < newImages.length) {
                sliderImage.srcset = '';
                sliderImage.dataset.src = '';
                sliderImage.dataset.srcset = '';
                sliderImage.dataset.originalSrc = '';
                sliderImage.src = newImages[i];
                sliderImage.classList.remove('Image--fadeIn');
            }
        });
    }

    /** Dentalspray **/
    if (location.pathname === '/products/dentalspray' || location.pathname === '/products/dentalspray-tl0010-fb-d4') {
        const newImages = [
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Dental-Spray-1.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Dental-Spray-2.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Dental-Spray-3.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Dental-Spray-4.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Dental-Spray-5.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Dental-Spray-6.jpg'
        ];

        replaceImages(newImages);
    }

    /** Gras- & Kotfresser Drops **/
    if (location.pathname.includes('/products/gras-kotfresser-drops-2') || location.pathname.includes('/products/gras-kotfresser-drops-3')) {
        const newImages = [
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gras-kotfresser-drops-1.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gras-kotfresser-drops-2.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gras-kotfresser-drops-3.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gras-kotfresser-drops-4.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gras-kotfresser-drops-5.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gras-kotfresser-drops-6.jpg'
        ];

        replaceImages(newImages);
    }

    /** Z-Snack **/
    if (location.pathname.includes('/products/tl0036-fb-z2') || location.pathname.includes('/collections/z-produkte/products/z-snack')) {
        const newImages = [
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-snack-1.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-snack-2.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-snack-3.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-snack-4.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-snack-5.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-snack-6.jpg'
        ];

        replaceImages(newImages);
    }

    /** Z-Spot **/
    if (location.pathname.includes('/products/z-spot')) {
        const newImages = [
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-spot-1.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-spot-2.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-spot-3.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-spot-4.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-spot-5.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/z-spot-6.jpg'
        ];

        replaceImages(newImages);
    }

    /** Z-Bundle **/
    if (location.pathname.includes('/products/z-bundle-r20') || location.pathname.includes('/products/z-bundle-zb')) {
        const newImages = [
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/bundle-1.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/bundle-2.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/bundle-3.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/bundle-4.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/bundle-5.jpg',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/bundle-6.jpg'
        ];

        replaceImages(newImages);
    }
};
