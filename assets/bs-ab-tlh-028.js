const injectIngredientsSectionTLH28 = (imageElements, description, productName) => {
    const targetElement = document.querySelector('.shopify-section:has(.Benefits)');

    targetElement?.insertAdjacentHTML('afterend', `
        <div class="ingredients-highlights ${productName}">
            <h2 class="ingredients-highlights__title">
                Highlight-Inhaltsstoffe
            </h2>     
            <div class="ingredients-highlights__ingredients-list">
                ${imageElements.map(imageElement => imageElement).join('')}
            </div>
            <p class="ingredients-highlights__description">
                ${description}
            </p>
        </div>
    `);
};

window.activateAbTlh028DS = () => {
    // Dentalspray
    if (location.pathname.includes('/products/dentalspray')) {
        const imageElements = [
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Ebene_1_Kopie_2.png?v=1720609236" alt="Himbeerblätter">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Subtract.png?v=1720609236" alt="Römische Kamille">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Subtract_1.png?v=1720609236" alt="Fermentierte Kräuter">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Subtract_2.png?v=1720609236" alt="Mikroorganismen">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Subtract_3.png?v=1720609236" alt="Minze">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Ebene_1_Kopie_1.png?v=1720609236" alt="Brombeerblätter">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Ebene_1_Kopie_7.png?v=1720609236" alt="Rosmarin">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Subtract_4.png?v=1720609236" alt="Salbei">'
        ];
        const description = 'Zusammensetzung: Quellwasser, Mineralstoffe (Meersalz und flüssiges Kalzium), fermentierte Kräuter (aus Basilikum, Brombeerblätter, Römische Kamille, Liebstöckel, Hirtentäschel, Spitzwegerich, Rin-gelblumen, Himbeerblätter, Rosmarin, Salbei, Weidenröschen, Schafgarbe, Lungenkraut, Eibisch, Frauenmantel, Taubnessel, Brennnessel, Thymian), Minze, Melasse';
        const productName = 'Dentalspray';

        injectIngredientsSectionTLH28(imageElements, description, productName);
    }
};

window.activateAbTlh028DS2 = () => {
    // Dentalspray
    if (location.pathname.includes('/zahnpflege/products/dentalspray-tl0010-fb-d4')) {
        const imageElements = [
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Ebene_1_Kopie_2.png?v=1720609236" alt="Himbeerblätter">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Subtract.png?v=1720609236" alt="Römische Kamille">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Subtract_1.png?v=1720609236" alt="Fermentierte Kräuter">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Subtract_2.png?v=1720609236" alt="Mikroorganismen">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Subtract_3.png?v=1720609236" alt="Minze">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Ebene_1_Kopie_1.png?v=1720609236" alt="Brombeerblätter">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Ebene_1_Kopie_7.png?v=1720609236" alt="Rosmarin">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Subtract_4.png?v=1720609236" alt="Salbei">'
        ];
        const description = 'Zusammensetzung: Quellwasser, Mineralstoffe (Meersalz und flüssiges Kalzium), fermentierte Kräuter (aus Basilikum, Brombeerblätter, Römische Kamille, Liebstöckel, Hirtentäschel, Spitzwegerich, Rin-gelblumen, Himbeerblätter, Rosmarin, Salbei, Weidenröschen, Schafgarbe, Lungenkraut, Eibisch, Frauenmantel, Taubnessel, Brennnessel, Thymian), Minze, Melasse';
        const productName = 'Dentalspray';

        injectIngredientsSectionTLH28(imageElements, description, productName);
    }
};

window.activateAbTlh028ZS = () => {
    // Z snack
    if (location.pathname.includes('/products/z-snack')) {
        const imageElements = [
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_1_1.png?v=1719913955" alt="Schwarzkümmel">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_2.png?v=1719913955" alt="Lavendel">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_3.png?v=1719913955" alt="Wermut">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_4.png?v=1719913955" alt="Zistrosenkraut">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_5.png?v=1719913955" alt="Rosmarin">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_6.png?v=1719913955" alt="Kokosraspeln">'
        ];
        const description = 'Zusammensetzung: Süßkartoffel, Pflanzliches Glycerin aus Sonnenblumenkernen, Insektenmehl aus Hermetia-Larven, Bierhefe (6%), Kokosraspel (6%), Lecithin, Lavendel (4,5%), Krill (4%), Schwarzkümmelöl (3%), Hermetiafett, Zistrosenkraut (2%), Wermutkraut (2%), Kokosöl (1%), Rapsöl, Zitronengras (0,5%), Rosmarin';
        const productName = 'Z-Snack';

        injectIngredientsSectionTLH28(imageElements, description, productName);
    }
};

window.activateAbTlh028ZS2 = () => {
    // Z snack
    if (location.pathname.includes('/products/tl0036-fb-z2')) {
        const imageElements = [
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_1_1.png?v=1719913955" alt="Schwarzkümmel">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_2.png?v=1719913955" alt="Lavendel">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_3.png?v=1719913955" alt="Wermut">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_4.png?v=1719913955" alt="Zistrosenkraut">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_5.png?v=1719913955" alt="Rosmarin">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_6.png?v=1719913955" alt="Kokosraspeln">'
        ];
        const description = 'Zusammensetzung: Süßkartoffel, Pflanzliches Glycerin aus Sonnenblumenkernen, Insektenmehl aus Hermetia-Larven, Bierhefe (6%), Kokosraspel (6%), Lecithin, Lavendel (4,5%), Krill (4%), Schwarzkümmelöl (3%), Hermetiafett, Zistrosenkraut (2%), Wermutkraut (2%), Kokosöl (1%), Rapsöl, Zitronengras (0,5%), Rosmarin';
        const productName = 'Z-Snack';

        injectIngredientsSectionTLH28(imageElements, description, productName);
    }
};

window.activateAbTlh028GK = () => {
    // Gras- & Kotfresser Drops
    if (location.pathname.includes('/products/gras-kotfresser-drops-2')) {
        const imageElements = [
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_1.png?v=1720608806" alt="Karotte">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_3.png?v=1720608805" alt="Löwenzahn">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_4.png?v=1720608805" alt="Fenchel">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_5.png?v=1720608805" alt="Hagebutte">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_6.png?v=1720608805" alt="Ulmenrinde">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_7.png?v=1720608805" alt="Melisse">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_8.png?v=1720608805" alt="Anis">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_9.png?v=1720608805" alt="Leinsamen">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_2.png?v=1720608805" alt="Kamille">'
        ];
        const description = 'Zusammensetzung: Süßkartoffel, Pflanzliches Glycerin (aus Sonnenblumenkernen), Insektenproteine aus Hermetia- Larven, Hagebutte (5%),  Melisse (3%), Fenchel (2,5%), Anis, Löwenzahn, Kamille, Ulmenrinde, Karotte, Leinsamen, Hermetiafett, Moor, Rosmarin';
        const productName = 'Gras-Kotfresser';

        injectIngredientsSectionTLH28(imageElements, description, productName);
    }
};

window.activateAbTlh028GK2 = () => {
    // Gras- & Kotfresser Drops
    if (location.pathname.includes('/products/gras-kotfresser-drops-3')) {
        const imageElements = [
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_1.png?v=1720608806" alt="Karotte">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_3.png?v=1720608805" alt="Löwenzahn">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_4.png?v=1720608805" alt="Fenchel">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_5.png?v=1720608805" alt="Hagebutte">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_6.png?v=1720608805" alt="Ulmenrinde">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_7.png?v=1720608805" alt="Melisse">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_8.png?v=1720608805" alt="Anis">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_9.png?v=1720608805" alt="Leinsamen">',
            '<img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/Braun_2.png?v=1720608805" alt="Kamille">'
        ];
        const description = 'Zusammensetzung: Süßkartoffel, Pflanzliches Glycerin (aus Sonnenblumenkernen), Insektenproteine aus Hermetia- Larven, Hagebutte (5%),  Melisse (3%), Fenchel (2,5%), Anis, Löwenzahn, Kamille, Ulmenrinde, Karotte, Leinsamen, Hermetiafett, Moor, Rosmarin';
        const productName = 'Gras-Kotfresser';

        injectIngredientsSectionTLH28(imageElements, description, productName);
    }
};
