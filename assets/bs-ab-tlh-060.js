window.activateAbTlh060 = () => {
    // anchor component
    const pdpAnchor = document.querySelector('[data-bs-tlh-060-anchor]');

    if(!pdpAnchor) return;

    pdpAnchor.setAttribute('data-bs-tlh-060-anchor', true)

    // amount info component
    const pdpAmountInfo = document.querySelector('[data-bs-tlh-060-amount-info]');

    if(!pdpAmountInfo) return;

    pdpAmountInfo.setAttribute('data-bs-tlh-060-amount-info', true)
};

document.addEventListener('DOMContentLoaded', () => {
    window.activateAbTlh060();
})
