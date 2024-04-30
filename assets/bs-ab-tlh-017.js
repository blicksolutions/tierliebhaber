window.activateAbTlh017 = () => {
    const searchElement = document.querySelector('.Search');
    if (!searchElement) return;

    searchElement.setAttribute('data-js-tlh-017', true);
};

document.addEventListener('DOMContentLoaded', ()=>{
    window.activateAbTlh017()
});
