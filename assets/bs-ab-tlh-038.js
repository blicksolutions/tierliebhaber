window.activateAbTlh038 = () => {
    const giftTextSwitch = () => {
        const versionA = document.querySelector(".gift__text--version-a");
        const versionB = document.querySelector(".gift__text--version-b");
    
        if(versionA && versionB) {
            versionA.style.display = "none";
            versionB.style.display = "block";
        }
    }

    giftTextSwitch();

    document.addEventListener("rerenderingFinished", () => {
        giftTextSwitch();
    });
};

document.addEventListener("DOMContentLoaded", () => {
    window.activateAbTlh038();
})