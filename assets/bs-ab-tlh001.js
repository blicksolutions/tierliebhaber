window.activateAbTlh001 = () => {

    const variantBMarkup = () => {
        return `
            <ul class="rc-plans__usps">
                <li class="rc-plans__usp">
                    <svg class="rc-plans__usp-icon" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M8.41206 15.0238L4.17627 10.788L4.78479 10.1803L8.41206 13.8076L16.2155 6.00421L16.8231 6.61188L8.41206 15.0238Z" fill="black"/>
                    </svg>
                    <p class="rc-plans__usp-text">
                        15% Ersparnis pro Bestellung
                    </p>
                </li>
                <li class="rc-plans__usp">
                    <svg class="rc-plans__usp-icon" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M8.41206 15.0238L4.17627 10.788L4.78479 10.1803L8.41206 13.8076L16.2155 6.00421L16.8231 6.61188L8.41206 15.0238Z" fill="black"/>
                    </svg>
                    <p class="rc-plans__usp-text">
                        Kostenloser Versand
                    </p>
                </li>
                <li class="rc-plans__usp">
                    <svg class="rc-plans__usp-icon" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M8.41206 15.0238L4.17627 10.788L4.78479 10.1803L8.41206 13.8076L16.2155 6.00421L16.8231 6.61188L8.41206 15.0238Z" fill="black"/>
                    </svg>
                    <p class="rc-plans__usp-text">
                        Jederzeit kündbar
                    </p>
                </li>
            </ul>

		`;
    }
    const discountMarkup = (text) => {
        return `
            <span class="rc-discount__percent">
                - ${text}
            </span>

		`;
    }

    const insertNewMarkup = () => {
       
        const plansContainer = document.querySelector('.Product__Info [data-plans-container]')
        if ( plansContainer.getAttribute('data-js-variant-b') == 'true') return

        // prevent markup from being inserted twice
        plansContainer.setAttribute('data-js-variant-b','true')

        plansContainer.insertAdjacentHTML('beforeend', variantBMarkup());
    }



    const mutationObserver = new MutationObserver(entries => {

        entries.forEach(entry => {
            if (entry.target.classList.contains('rc-widget-injection-parent')) {
                const rechargeWrapper = entry.target.querySelector('.Product__Info [data-widget-container-wrapper]')
                rechargeWrapper.setAttribute('tlh001-variant','b')
                

                const subscribeText = entry.target.querySelector('.Product__Info [data-label-text-subsave]')
                subscribeText.innerText = 'Abonnieren'
                const subscritionContainer = entry.target.querySelector('.Product__Info [data-label-subsave]')
                const discountText = entry.target.querySelector('.Product__Info [data-label-discount]').innerText
                subscritionContainer.insertAdjacentHTML('beforeend', discountMarkup(discountText));




            }

            if (entry.target.classList.contains('rc-template__radio-group')) {
                insertNewMarkup()
                const planOptions = entry.target.querySelectorAll('.Product__Info [data-plan-option]')
                
                planOptions.forEach((option)=>{
                    if ( option.getAttribute('data-js-variant-b') == 'true') return                    
                    option.innerText = 'Lieferung ' + option.innerText.replace('Alle','alle')
                    option.setAttribute('data-js-variant-b','true')

                })
                
            }

            if (entry.target.classList.contains('rc-selling-plans')) {
                const radioOptionsContainer = document.querySelector('.Product__Info [data-radio-group-options]')

                if (entry.target.getAttribute('style') == 'display: none;') {
                    radioOptionsContainer.classList.remove('sub-plan--active')
                } else {
                    radioOptionsContainer.classList.add('sub-plan--active')
                }

            }


        })


        // mutationObserver.disconnect();
    });

    const rechargeInjectionElement = document.querySelector('.rc-widget-injection-parent')

    mutationObserver.observe(rechargeInjectionElement, {
        childList: true,
        subtree: true,
        attributes: true
    });
};

window.activateAbTlh001()