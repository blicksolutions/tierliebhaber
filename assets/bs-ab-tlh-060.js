window.activateAbTlh060 = () => {
    let quantityPerUnit = 40;
    const anchorValueTarget = document.querySelector('.bs-pdp-anchor__value');

    if(usageQuantity) {
        quantityPerUnit = usageQuantity;
    }

    anchorValueTarget.innerHTML = (Math.trunc((productPrice / (quantityPerUnit * 100)) * 100) / 100) + '€';

    // anchor component
    const pdpAnchor = document.querySelector('[data-bs-tlh-060-anchor]');
    const pdpAmountInfo = document.querySelector('[data-bs-tlh-060-amount-info]');
    const popupContainer = document.querySelector('[data-bs-tlh-060-popup]');
    const popupContent = document.querySelector('.bs-amount-calculator-popup');
    const closeButton = document.querySelector('.bs-amount-calculator-popup__header');

    if(!pdpAnchor) return;
    if(!pdpAmountInfo) return;
    if(!popupContainer) return;

    pdpAnchor.setAttribute('data-bs-tlh-060-anchor', true);
    pdpAmountInfo.setAttribute('data-bs-tlh-060-amount-info', true);
    popupContainer.setAttribute('data-bs-tlh-060-popup', true);

    pdpAnchor.addEventListener('click', () => {
        popupContainer.classList.add('active');
        document.querySelector('html').style.overflow = 'hidden';
    });
 
    pdpAmountInfo.addEventListener('click', () => {
        popupContainer.classList.add('active');
        document.querySelector('html').style.overflow = 'hidden';
    });

    closeButton.addEventListener('click', () => {
        popupContainer.classList.remove('active');
        document.querySelector('html').style.overflow = 'unset';
    });

    popupContainer.addEventListener('click', (e) => {
        if(!popupContent.contains(e.target)) {
            popupContainer.classList.remove('active');
            document.querySelector('html').style.overflow = 'unset';
        }
    });

    // popup
    if(dailyUnit) {
        const popupUnitTarget = document.querySelector('.bs-amount-calculator-popup__metrics-card__unit');

        popupUnitTarget.innerHTML = dailyUnit;
    }

    // popup progressbar
    const progressbarActiveThumb = document.querySelector('.bs-amount-calculator-popup__progress-bar__thumb-active');
    const bullets = document.querySelectorAll('.bs-amount-calculator-popup__progress-bar__bullet');
    let currentActiveBullet = document.querySelector('.bs-amount-calculator-popup__progress-bar__bullet.active');

    const handleBulletSwitch = (id) => {
        const amountPerDayValueTarget = document.querySelector('.bs-amount-calculator-popup__metrics-card__value span:first-child');
        const monthsTarget = document.querySelector('.bs-amount-calculator-popup__metrics-card__info span');
        const imageTarget = document.querySelector('.bs-amount-calculator-popup__image');
        let monthsValue;

        const insertNewContent = (dailyAmount, months, imageUrl) => {
            amountPerDayValueTarget.innerHTML = dailyAmount;
            monthsTarget.innerHTML = months;
            imageTarget.innerHTML = `<img src="${imageUrl}" alt="dog">`;
        };

        switch(id * 1) {
            case 1:
                monthsValue = Math.round(((quantityPerUnit / 1) / 30));

                if(monthsValue < 1) {
                    monthsValue = '1/2 Monat';
                } else if(monthsValue === 1) {
                    monthsValue = '1 Monat';
                } else {
                    monthsValue = monthsValue + ' Monate';
                }

                insertNewContent(1, monthsValue, 'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20241104_jb_hundegroessen_1.png?v=1730945541');
                break;
            case 2:
                monthsValue = Math.round(((quantityPerUnit / 2) / 30));

                if(monthsValue < 1) {
                    monthsValue = '1/2 Monat';
                } else if(monthsValue === 1) {
                    monthsValue = '1 Monat';
                } else {
                    monthsValue = monthsValue + ' Monate';
                }

                insertNewContent(2, monthsValue, 'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20241104_jb_hundegroessen_2.png?v=1730945542');
                break;
            case 3:
                monthsValue = Math.round(((quantityPerUnit / 3) / 30));

                if(monthsValue < 1) {
                    monthsValue = '1/2 Monat';
                } else if(monthsValue === 1) {
                    monthsValue = '1 Monat';
                } else {
                    monthsValue = monthsValue + ' Monate';
                }

                insertNewContent(4, monthsValue, 'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20241104_jb_hundegroessen_3.png?v=1730945542');
                break;
            case 4:
                monthsValue = Math.round(((quantityPerUnit / 4) / 30));

                if(monthsValue < 1) {
                    monthsValue = '1/2 Monat';
                } else if(monthsValue === 1) {
                    monthsValue = '1 Monat';
                } else {
                    monthsValue = monthsValue + ' Monate';
                }

                insertNewContent(6, monthsValue, 'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20241104_jb_hundegroessen_4.png?v=1730945542');
                break;
            case 5:
                monthsValue = Math.round(((quantityPerUnit / 5) / 30));

                if(monthsValue < 1) {
                    monthsValue = '1/2 Monat';
                } else if(monthsValue === 1) {
                    monthsValue = '1 Monat';
                } else {
                    monthsValue = monthsValue + ' Monate';
                }

                insertNewContent(7, monthsValue, 'https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20241104_jb_hundegroessen_5.png?v=1730945542');
                break;
            default:
                break;
        }
    }

    bullets.forEach((bullet) => {
        bullet.addEventListener('click', (e) => {
            if(e.currentTarget != currentActiveBullet) {
                currentActiveBullet.classList.remove('active');
                progressbarActiveThumb.style.width = `${e.currentTarget.dataset.activeThumbWidth}%`;
                handleBulletSwitch(e.currentTarget.attributes.id.value);
                e.currentTarget.classList.add('active');
                currentActiveBullet = e.currentTarget;
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    window.activateAbTlh060();
})
