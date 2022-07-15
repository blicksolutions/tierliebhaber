console.log("CARTTTTTTT")
window.addEventListener('load', function () {
    const cartFooter = document.querySelector('.Cart__Footer');

    if (cartFooter) {
        console.log("CARTFOOTER IS THERE")

        setTimeout(() => {
            const discountCodeName = cartFooter.querySelector('.code-name');

            if (discountCodeName) {
                console.log("DISCOUNTCODE IS THERE")
            }
        }, 5000);
    }
}, false);
