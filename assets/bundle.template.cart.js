window.addEventListener('load', function () {

    let i = 0;

    const interval = setInterval(() => {
        const cartFooter = document.querySelector('.Cart__Footer');
        if (cartFooter) {
            const discountCodeName = cartFooter.querySelector('.code-name');

            if (discountCodeName) {

                console.log("I FOUND IT!!!")
                console.log(discountCodeName)


            }

            if (i == 5) clearInterval(interval);

            i++;
        }
    }, 500);
}, false);
