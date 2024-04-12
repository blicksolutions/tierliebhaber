window.activateAbTlh006 = () => {
    if (location.href.includes('/products/dentalspray')) {
        document.querySelector('.ContentBlock__Title').textContent = 'So einfach sorgt das Dentalspray für gesunde Zähne…';
    } else if (location.href.includes('/products/z-snack')) {
        document.querySelector('.ContentBlock__Title').textContent = 'Von Tierheilpraktikern entwickelte Natur-Formel für deinen Hund…';
    } else if (location.href.includes('/products/gras-kotfresser-drops-2')) {
        document.querySelector('.ContentBlock__Title').textContent = '100% natürliche Sofort-Hilfe bei Sodbrennen und Grasfressen…';
    } else if (location.href.includes('/products/zahnfee-sticks')) {
        document.querySelector('.ContentBlock__Title').textContent = 'Leckere Kau-Sticks für frischen Atem und gesunde Hunde-Zähne…';
    } else if (location.href.includes('/products/darmpflege-drops')) {
        document.querySelector('.ContentBlock__Title').textContent = 'Für feste Hunde-Häufchen und einen kerngesunden Darm…';
    }
};

// document.addEventListener('DOMContentLoaded', () => {
    // window.activateAbTlh006()
// });
