window.activateAbTlh028 = () => {
    const targetElement = document.querySelector(".shopify-section:has(.Benefits)")

    targetElement?.insertAdjacentHTML('afterend', `
        <div class="ingredients-highlights">
            <h2 class="ingredients-highlights__title">
                Highlight-Inhaltsstoffe
            </h2>     
            <div class="ingredients-highlights__ingredients-list">
                <img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_1_1.png?v=1719913955" alt="Schwarzkümmel">
                <img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_2.png?v=1719913955" alt="Lavendel">
                <img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_3.png?v=1719913955" alt="Wermut">
                <img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_4.png?v=1719913955" alt="Zistrosenkraut">
                <img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_5.png?v=1719913955" alt="Rosmarin">
                <img src="https://cdn.shopify.com/s/files/1/0587/2746/5119/files/20220914_jb_amzaplus_zsnack-02_6.png?v=1719913955" alt="Kokosraspeln">
            </div>
            <p class="ingredients-highlights__description">
                Zusammensetzung: Süßkartoffel, Pflanzliches Glycerin aus Sonnenblumenkernen, Insektenmehl aus Hermetia-Larven, Bierhefe (6%), Kokosraspel (6%), Lecithin, Lavendel (4,5%), Krill (4%), Schwarzkümmelöl (3%), Hermetiafett, Zistrosenkraut (2%), Wermutkraut (2%), Kokosöl (1%), Rapsöl, Zitronengras (0,5%), Rosmarin
            </p>
        </div>
    `);
};

window.addEventListener("DOMContentLoaded", () => {
    activateAbTlh028();
})
