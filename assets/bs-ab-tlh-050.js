window.activateAbTlh050 = () => {
    const versionA = document.querySelector(".ProductForm__ShippingEta");
    const versionB = document.querySelector(".ProductForm__ShippingEta--version-b");

    if(versionB && versionA) {
        versionA.style.display = "none";
        versionB.style.display = "block";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.activateAbTlh050();
})
