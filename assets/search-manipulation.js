(() => {
    const searchInput = document.querySelector('.Search__Input');
    const toggleSearchButton = document.querySelector('[data-action="toggle-search"]');
    const newsletterEl = document.querySelector('.KlaviyoForm');

    window.validNewsSearchStrings = [
        'news',
        'newsl',
        'newsle',
        'newslet',
        'newslett',
        'newslette',
        'newsletter'
    ];

    // check if newsSearch redirect has been happened
    if (sessionStorage.getItem('newsSearch') == 'true' && newsletterEl) {
        sessionStorage.setItem('newsSearch', 'false');
        newsletterEl.scrollIntoView({block: 'center'});
    }

    /** news search manipulation **/
    let wait = false;
    searchInput.addEventListener('input', () => {
        if (validNewsSearchStrings.includes(searchInput.value.toLowerCase())) {
            if (!wait) {
                wait = true;

                setTimeout(() => {
                    wait = false;

                    // close search
                    toggleSearchButton.click()

                    // scroll to newsletter signup
                    if (newsletterEl) {
                        if(document.querySelector('.shopify-section[style="display: none;"]:has(.KlaviyoForm)')) {
                            const footerEl = document.querySelector('footer');
                            const headerHeight = document.querySelector('header').offsetHeight;

                            const scrollOffset = footerEl.getBoundingClientRect().top + window.scrollY - headerHeight;

                            window.scrollTo({
                            top: scrollOffset,
                            behavior: 'smooth'
                            });
                        } else {
                            newsletterEl.scrollIntoView({block: 'center'});
                        }
                    } else {
                        sessionStorage.setItem('newsSearch', 'true');
                        window.location = '/';
                    }
                }, 1000);
            }
        }
    });

    // testing: open search
    // setTimeout(() => {
        // toggleSearchButton.click()
    // }, 2000);
})();
