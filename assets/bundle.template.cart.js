console.log("CARTTTTTTT")
window.addEventListener('load', function () {
    const cartFooter = document.querySelector('.Cart__Footer');

    if (cartFooter) {
        const discountCodeName = cartFooter.querySelector('.code-name');

        if (discountCodeName) {
            console.log("DISCOUNTCODE IS THERE")
        }
    }




}, false);
