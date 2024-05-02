window.activateAbTlh014 = () => {
    const productInfoMobile = document.querySelector('.Product__InfoWrapper');
    if (!productInfoMobile) return;

    productInfoMobile.setAttribute('data-js-tlh-014', 'true');

    const productInfoDesktop = document.querySelector('.Product__Wrapper');
    if (!productInfoDesktop) return;

    productInfoDesktop.setAttribute('data-js-tlh-014', 'true');
};

document.addEventListener('DOMContentLoaded',()=>{
    window.activateAbTlh014();
});