window.addEventListener('load', function () {
    const interval = setInterval(() => {
        const cartFooter = document.querySelector('.Cart__Footer');
        if (cartFooter) {
            const discountCodeName = cartFooter.querySelector('.code-name');

            if (discountCodeName) {
                clearInterval(interval);
                console.log("IMMA RELOAD CYA")
                // window.location.reload();
            }
        }
    }, 500);
}, false);
