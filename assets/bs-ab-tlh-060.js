window.activateAbTlh060 = () => {
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

    // popup progressbar
    const progressbarActiveThumb = document.querySelector('.bs-amount-calculator-popup__progress-bar__thumb-active');
    const bullets = document.querySelectorAll('.bs-amount-calculator-popup__progress-bar__bullet');
    let currentActiveBullet = document.querySelector('.bs-amount-calculator-popup__progress-bar__bullet.active')

    bullets.forEach((bullet) => {
        bullet.addEventListener('click', (e) => {
            if(e.currentTarget != currentActiveBullet) {
                currentActiveBullet.classList.remove('active');
                progressbarActiveThumb.style.width = `${e.currentTarget.dataset.activeThumbWidth}%`;
                e.currentTarget.classList.add('active');
                currentActiveBullet = e.currentTarget;
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    window.activateAbTlh060();
})
