"use strict";

(() => {
    new Swiper(".bs-keypoints__swiper", {
        spaceBetween: 24,
        autoHeight: true,
        breakpoints: {
            641: {
                spaceBetween: 50,
                slidesPerView: 2
            },
            1140: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        },
        grabCursor: true
    });
})();