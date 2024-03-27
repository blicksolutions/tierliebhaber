window.activateAbTlh001 = () => {
    /** START EXECUTION AFTER DISCOUNT APP HAS BEEN LOADED **/
    const mutationObserver = new MutationObserver(entries => {
        // updateQuantitySelector(window.shopdocsVolumeDiscounts.volumeDiscountData);

        entries.forEach(entry => {

            console.log(entry)

            if (entry.classList == 'rc-widget-injection-parent') {
                // has been loaded
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
