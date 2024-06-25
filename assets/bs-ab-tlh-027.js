window.activateAbTlh027 = () => {
    const firstAnnouncement = document.querySelectorAll('.AnnouncementBar .topbar_inner')[0].querySelector('span');
    const secondAnnouncement = document.querySelectorAll('.AnnouncementBar .topbar_inner')[1].querySelector('span');
    const thirdAnnouncement = document.querySelectorAll('.AnnouncementBar .topbar_inner')[2].querySelector('span');

    firstAnnouncement.textContent = 'Über 310.000 zufriedene Kunden';
    secondAnnouncement.textContent = 'Kein Risiko, dank Geld Zurück Garantie';
    thirdAnnouncement.textContent = 'Natürliche Formeln mit Tierärzten entwickeln';
};
