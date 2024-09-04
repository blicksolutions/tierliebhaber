window.activateAbTlh037 = () => {
    const slideshowA = document.querySelector(".Slideshow--versionA");
    const slideshowB = document.querySelector(".Slideshow--versionB");

    if (slideshowA) {
        slideshowA.style.display = "none";
    }

    if (slideshowB) {
        slideshowB.style.display = "flex";
    }
};