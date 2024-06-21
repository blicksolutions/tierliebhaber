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

    let wait = false;

    searchInput.addEventListener('input', () => {
        if (validNewsSearchStrings.includes(searchInput.value.toLowerCase())) {
            if (!wait) {
                wait = true;

                setTimeout(() => {
                    console.log("BIN EIN NEWS SEARCH")
                    wait = false;

                    // close search
                    toggleSearchButton.click()

                    // scroll to newsletter signup
                    newsletterEl.scrollIntoView({block: 'center'});
                }, 1000);
            }
        }
    });

    // open search
    setTimeout(() => {
        toggleSearchButton.click()
    }, 2000);
})();
