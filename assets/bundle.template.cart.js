window.addEventListener('load', function () {

    let i = 0;

    const interval = setInterval(() => {
        const cartFooter = document.querySelector('.Cart__Footer');
        if (cartFooter) {
            const discountCodeName = cartFooter.querySelector('.code-name');

            if (discountCodeName) {

                console.log("TEST!!!")
                console.log("I FOUND IT!!!")
                console.log(discountCodeName)

                if (discountCodeName.title == '') {
                    console.log("EMPTY CODE I WILL RELODAD")
                    clearInterval(interval);
                    window.location.reload();
                }

            }

            if (i == 10) clearInterval(interval);

            i++;
        }
    }, 500);
}, false);
