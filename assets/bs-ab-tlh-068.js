window.activateAbTlh068B = () => {
const cartDrawer = document.getElementById('sidebar-cart');

if(!cartDrawer) return;

cartDrawer.setAttribute('data-bs-tlh-068b', "");
};

window.activateAbTlh068C = () => {
    const cartDrawer = document.getElementById('sidebar-cart');

    if(!cartDrawer) return;
    
    cartDrawer.setAttribute('data-bs-tlh-068c', "");
};

document.addEventListener("DOMContentLoaded", () => {
    window.activateAbTlh068B();
})

