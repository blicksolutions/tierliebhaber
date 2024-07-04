window.activateAbTlh031 = () => {
    const currentPageUrl = window.location.href;

    if(currentPageUrl.includes("products/dentalspray") || currentPageUrl.includes("products/gras-kotfresser-drops")) {
        const SliderSlidesInner = document.querySelectorAll(".flickity-slider .Product__SlideItem .AspectRatio");

        SliderSlidesInner.forEach((slideInner) => {
            slideInner.insertAdjacentHTML("beforeend",`
                <div class="image-banner-popup">
                    <span class="image-banner-popup__benefit">
                        Beugt Neubildung vor
                    </span>
                    <div class="image-banner-popup__info">
                        <button class="image-banner-popup__info__button">
                            <span>
                                Mehr Infos
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0.5C12.4183 0.5 16 4.08173 16 8.5C16 12.9183 12.4183 16.5 8 16.5C3.58173 16.5 0 12.9183 0 8.5C0 4.08173 3.58173 0.5 8 0.5ZM9.86498 6.39289C9.62722 6.14655 9.29976 6.06003 8.95475 6.0641C8.49454 6.06958 8.00311 6.2363 7.65158 6.40006C6.8104 6.79193 6.16496 7.48585 5.62739 8.22766C5.53059 8.3612 5.48008 8.51888 5.65039 8.6418C5.79563 8.74663 5.90021 8.65283 5.98781 8.55933L5.99356 8.55316C6.00023 8.54598 6.00682 8.53883 6.01331 8.53178C6.1116 8.42535 6.20659 8.31513 6.30158 8.20481L6.32533 8.17723L6.34909 8.14966C6.63435 7.81893 6.92456 7.49295 7.30863 7.27178C7.53696 7.1403 7.70148 7.34338 7.66623 7.57148C7.6451 7.70825 7.57318 7.83709 7.52289 7.96934C7.34423 8.43903 7.16292 8.90773 6.98238 9.37674C6.78454 9.89091 6.58733 10.4053 6.39549 10.9217L6.37883 10.9666L6.36218 11.0114C6.19293 11.4667 6.02618 11.9186 5.91589 12.3938C5.82777 12.7738 5.70913 13.2347 5.87958 13.608C5.97776 13.823 6.186 13.9707 6.41764 14.0043C6.73358 14.0502 7.07519 14.0555 7.38433 13.9851C7.54447 13.9487 7.702 13.9012 7.85575 13.8434C8.3278 13.6659 8.75763 13.3922 9.14476 13.0704C9.53859 12.7422 9.88575 12.354 10.2023 11.9513C10.3041 11.8219 10.4273 11.6788 10.462 11.513C10.4946 11.3576 10.3558 11.1355 10.176 11.2258C10.081 11.2734 10.0099 11.3913 9.94069 11.4697C9.85386 11.568 9.76533 11.6649 9.67581 11.7607C9.49674 11.9522 9.3132 12.1395 9.12886 12.3259C9.01603 12.44 8.87578 12.5365 8.73168 12.6073C8.55176 12.6957 8.40847 12.5977 8.42794 12.3984C8.44581 12.2155 8.49057 12.0306 8.55333 11.8574C8.80588 11.1601 9.06324 10.4646 9.31861 9.76833C9.47825 9.33322 9.63708 8.89783 9.7936 8.46153C9.93988 8.0538 10.0646 7.64934 10.1172 7.21737C10.1535 6.91978 10.0764 6.61198 9.86498 6.39289ZM10.396 3.04708C9.63479 2.75093 8.72738 3.25634 8.57453 4.06172C8.46411 4.64325 8.68566 5.1553 9.14118 5.37134C10.0226 5.78934 11.0769 5.12173 11.0769 4.14564C11.077 3.604 10.8385 3.21927 10.396 3.04708Z" fill="#1C1B1B"/>
                            </svg>
                        </button>
                        <div class="image-banner-popup__info__popup">
                            <p>
                                Wende es dauerhaft an und beuge der Neubildung von Zahnbelag und Maulgeruch 100% natürlich vor.
                            </p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8" fill="none">
                            <path d="M5.5 7.5L0 0H11L5.5 7.5Z" fill="white"/>
                            </svg>
                        </div>
                    </div>    
                </div>
            `)
        })
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.activateAbTlh031();
})