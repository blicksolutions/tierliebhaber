window.activateAbTlh060 = () => {
    const pdpAnchor = document.querySelector('[data-bs-tlh-060-anchor]');

    if(!pdpAnchor) return;

    pdpAnchor.setAttribute('data-bs-tlh-060-anchor', true)
};

document.addEventListener('DOMContentLoaded', () => {
    window.activateAbTlh060();
})
