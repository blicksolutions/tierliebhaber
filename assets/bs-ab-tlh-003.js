window.activateAbTlh003 = () => {
    const targetCollection = document.querySelector('[data-section-type="collection"]');
    const targetCallout = document.querySelector('.subscriptionReminderCallout');

    if (targetCallout && targetCollection) {
        targetCallout.classList.add('active');
    }
}
