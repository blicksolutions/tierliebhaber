window.addEventListener('load', function () {

    const bundle = document.querySelector('#rbr-container-element-false');
    console.log("HIERERERERREER")
    console.log(bundle)

    if (bundle) {
        const section = bundle.closest('.shopify-section');

        bundle.remove();
        section.appendChild(bundle);
    }



}, false);