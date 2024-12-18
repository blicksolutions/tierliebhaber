window.activateAbTlh066 = () => {
    const footer = document.querySelector(".shopify-section.shopify-section--footer");

    if(!footer) return;

    footer.setAttribute("data-bs-ab-tlh-066", "");

    const initiateKeypoints = () => {
        const keypointsComponent = document.querySelector(".bs-keypoints");

        if(!keypointsComponent) return;

        keypointsComponent.setAttribute("data-bs-ab-tlh-066", "");

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
    };

    const initiateFooterAccordions = () => {
        const targetFooterBlocks = Array.from(document.querySelectorAll(".Footer__Block.Footer__Block--links h2"));
        targetFooterBlocks.push(document.querySelector(".Footer__Block.Footer__Block--reachability h2"));

        targetFooterBlocks.forEach((targetFooterBlock) => {
            targetFooterBlock.addEventListener("click", (e) => e.currentTarget.parentElement.classList.toggle("active"));
        })
    };

    initiateKeypoints();
    initiateFooterAccordions();

    const klaviyoForm = document.querySelector(".shopify-section:has(.klaviyo-form-XEs6zR):not(:has(footer))");

    if(klaviyoForm) {
        klaviyoForm.style.display = "none";
    }
};

// document.addEventListener("DOMContentLoaded", () => {
//     window.activateAbTlh066();
// });