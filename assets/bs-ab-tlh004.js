window.activateAbTlh004 = () => {
    const shippingLogoMarkup = () => {
        return `
            <img class="shipping__logo" src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/dhl-go-green-logo.png?v=1712064022">
        `;
    };

    if (window.Shopify.Checkout.step == 'shipping_method') {
        const shippingMethodListTitle = document.querySelector('.section--shipping-method #main-header');
        if (!shippingMethodListTitle) return;
        
        const shippingMethodContainer = document.querySelector('[data-shipping-methods]');
        if (!shippingMethodContainer) return;

        const shippingMethodLabel = document.querySelector('.section--shipping-method [data-shipping-methods] [data-shipping-method-label-title]');
        if (!shippingMethodLabel) return;

        shippingMethodListTitle.innerText = 'DHL Blitzversand';

        shippingMethodLabel.innerHTML = shippingMethodLabel.innerHTML.replace('Standard','Versicherter Premium Versand');
        
        shippingMethodContainer.insertAdjacentHTML('beforeend', shippingLogoMarkup());

    } else return;
};