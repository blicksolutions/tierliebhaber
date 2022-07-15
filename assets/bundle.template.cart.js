window.addEventListener('load', function () {
    let i = 0;

    const interval = setInterval(() => {
        const cartFooter = document.querySelector('.Cart__Footer');
        if (cartFooter) {
            const discountCodeName = cartFooter.querySelector('.code-name');

            if (discountCodeName) {
                if (discountCodeName.scrollWidth < 2) {
                    clearInterval(interval)
                    console.log("empty code SO RELOAD")
                    window.location.reload();
                } else {
                    console.log("CODE IS THERE!")
                    clearInterval(interval)
                }
            }
            if (i === 10) clearInterval(interval);
            i++;
        }
    }, 500);
}, false);
