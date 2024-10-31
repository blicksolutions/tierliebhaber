window.activateAbTlh060 = () => {
    // anchor component
    const pdpAnchor = document.querySelector('[data-bs-tlh-060-anchor]');

    if(!pdpAnchor) return;

    pdpAnchor.setAttribute('data-bs-tlh-060-anchor', true)

    // amount info component
    const pdpAmountInfo = document.querySelector('[data-bs-tlh-060-amount-info]');

    if(!pdpAmountInfo) return;

    pdpAmountInfo.setAttribute('data-bs-tlh-060-amount-info', true)

    // popup component
    const progressbarActiveThumb = document.querySelector('.bs-amount-calculator-popup__progress-bar__thumb-active');
    const bullets = document.querySelectorAll('.bs-amount-calculator-popup__progress-bar__bullet');
    let currentActiveBullet = document.querySelector('.bs-amount-calculator-popup__progress-bar__bullet.active')

    bullets.forEach((bullet) => {
        bullet.addEventListener('click', (e) => {
            if(e.currentTarget != currentActiveBullet) {
                currentActiveBullet.classList.remove('active');
                progressbarActiveThumb.attributes.style.value = `width: ${e.currentTarget.dataset.activeThumbWidth}%;`;
                e.currentTarget.classList.add('active');
                currentActiveBullet = e.currentTarget;
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    window.activateAbTlh060();
})
