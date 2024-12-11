window.activateAbTlh066 = () => {
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
    }

    initiateKeypoints();
};

document.addEventListener("DOMContentLoaded", () => {
    window.activateAbTlh066();
});