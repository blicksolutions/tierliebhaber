"use strict";

(() => {
    const klaviyoForms = document.querySelectorAll(".shopify-section:has(.klaviyo-form-XEs6zR):not(:has(footer))");

    if(klaviyoForms.length !== 0) {
        klaviyoForms.forEach((klaviyoForm) => {
            klaviyoForm.style.display = "none";
        });
    }
})();