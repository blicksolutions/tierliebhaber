window.addEventListener('load', function () {
    let i = 0;

    const interval = setInterval(() => {
        const cartFooter = document.querySelector('.Cart__Footer');
        if (cartFooter) {
            const discountCodeName = cartFooter.querySelector('.code-name');

            if (discountCodeName) {
                if (discountCodeName.scrollWidth < 2) {
                    clearInterval(interval)
                    window.location.reload();
                } else {
                    clearInterval(interval)
                }
            }
            if (i === 10) clearInterval(interval);
            i++;
        }
    }, 500);
}, false);
