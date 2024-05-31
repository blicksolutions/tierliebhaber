window.activateAbTlh025 = () => {
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
    if (location.pathname.includes('/products/dentalspray') || location.pathname.includes('/products/dentalspray-tl0010-fb-d4')) {
        const newImages = [
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/ds1_99c3c653-f4f4-4b1f-809e-db047c26456c.jpg?v=1717161832',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/ds2_af497c49-626b-418e-9788-787b7d535c58.jpg?v=1717161833',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/ds3_5c5750e0-f5e2-4945-be91-1c591d464fab.jpg?v=1717161832',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/ds4_02e13f58-ee8c-4c6d-b54f-9871c0c148b6.jpg?v=1717161833',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/ds5_3c41f0c9-535c-4045-b1ed-b01d188ad0ab.jpg?v=1717161833',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/ds6_62db5dff-00be-4a4b-8ba9-cf0bda1b9203.jpg?v=1717161833'
        ];

        replaceImages(newImages);
    }

    /** Gras- & Kotfresser Drops **/
    if (location.pathname.includes('/products/gras-kotfresser-drops-2') || location.pathname.includes('/products/gras-kotfresser-drops-3')) {
        const newImages = [
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gk1_54fb0091-c1aa-4567-89e3-e9c71794d90d.jpg?v=1717161839',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gk2_52f2d7b6-345d-4ec0-8ff7-80068cc0335e.jpg?v=1717161841',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gk3_de6c9063-6e17-4bdd-89e6-3a0a82a35f78.jpg?v=1717161840',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gk4_c41a3b7e-d19f-4eaa-a185-09c8ef3aac77.jpg?v=1717161840',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gk5.jpg?v=1717161840',
            'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/gk6_74332157-9ff8-45a8-8d35-e584bc6ea089.jpg?v=1717161839'
        ];

        replaceImages(newImages);
    }
};

document.addEventListener('DOMContentLoaded',()=>{
    window.activateAbTlh025()
})
