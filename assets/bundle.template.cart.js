console.log("CARTTTTTTT")
window.addEventListener('load', function () {
    const cartFooter = document.querySelector('.Cart__Footer');

    if (cartFooter) {
        console.log("CARTFOOTER IS THERE")

        const interval = setInterval(() => {
            const discountCodeName = cartFooter.querySelector('.code-name');

            if (discountCodeName) {
                console.log("DISCOUNTCODE IS THERE")

                clearInterval(interval);
            }
        }, 500);
    }
}, false);
