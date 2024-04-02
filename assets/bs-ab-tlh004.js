window.activateAbTlh004 = () => {
    if (window.Shopify.Checkout.step == 'shipping_method') {

        const shippingMethodListTitle = document.querySelector('.section--shipping-method #main-header')
        if (!shippingMethodListTitle) return
        const shippingMethodLabel = document.querySelector('.section--shipping-method [data-shipping-methods] [data-shipping-method-label-title]')
        if (!shippingMethodLabel) return

        shippingMethodListTitle.innerText = 'DHL Blitzversand'

        shippingMethodLabel.innerHTML = shippingMethodLabel.innerHTML.replace('Standard','Versicherter Premium Versand + DHL green Logo')

    } else return
}