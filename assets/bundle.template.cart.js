window.addEventListener('load', function () {
    const interval = setInterval(() => {
        const cartFooter = document.querySelector('.Cart__Footer');
        if (cartFooter) {
            const discountCodeName = cartFooter.querySelector('.code-name');

            if (discountCodeName) {

                console.log("TEST!!!")
                console.log("I FOUND IT!!!")
                console.log(discountCodeName)


                clearInterval(interval);
                // window.location.reload();
            }
        }
    }, 500);
}, false);
