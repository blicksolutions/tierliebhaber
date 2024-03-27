window.activateAbTlh001 = () => {


    const quantityButtonTemplate = (setQuantity, newPricePerItem, relativeDiscount) => {
        return `
			<div class="product-form__quantityDiscount__item" data-qty="${setQuantity}">
				<div class="product-form__quantityDiscount__item__body">
					<span class="product-form__quantityDiscount__item__header">ab ${setQuantity} Stk*</span>
					<span class="product-form__quantityDiscount__item__price">${newPricePerItem}€</span>
				</div>
				<div class="product-form__quantityDiscount__item__badge">${relativeDiscount}% Ersparnis</div>
			</div>
		`;
    }



    /** START EXECUTION AFTER DISCOUNT APP HAS BEEN LOADED **/
    const mutationObserver = new MutationObserver(entries => {
        // updateQuantitySelector(window.shopdocsVolumeDiscounts.volumeDiscountData);

        entries.forEach(entry => {

            console.log(entry)

            if (entry.classList == 'rc-widget-injection-parent') {
                // has been loaded






                // wrapper unten mit infos und tagesswtich wie oft

                quantityDiscountWrapper.insertAdjacentHTML('beforeend', quantityButtonTemplate(minQty, (newPrice).toFixed(2).replace('.', ','), relativeDiscount));


            }


        })


        // mutationObserver.disconnect();
    });

    // OBSERVE DISCOUNT APP WRAPPER FOR CHANGES (OBSERVER ALSO TRIGGERS AT VARIANT CHANGE)
    mutationObserver.observe(discountPromotionWrapper, {
        childList: true,
        subtree: true,
        attributes: true
    });

};
