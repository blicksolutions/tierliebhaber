console.log("CARTTTTTTT")
window.addEventListener('load', function () {
    const interval = setInterval(() => {
        const cartFooter = document.querySelector('.Cart__Footer');
        if (cartFooter) {
            console.log("CARTFOOTER IS THERE")

            const discountCodeName = cartFooter.querySelector('.code-name');
            console.log("INTERVALLLLL")

            console.log(discountCodeName)

            if (discountCodeName) {
                console.log("DISCOUNTCODE IS THERE")
                clearInterval(interval);
            }
        }
    }, 500);
}, false);
