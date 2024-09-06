window.activateAbTlh050 = () => {
	const versionA = document.querySelector(".ProductForm__ShippingEta");
	const versionB = document.querySelector(".ProductForm__ShippingEta--version-b");

	if (versionB && versionA) {
		versionA.style.display = "none";
		versionB.style.display = "block";
	}
};

document.addEventListener("DOMContentLoaded", () => {
    if(window.location.href.includes("products")) {
        document.querySelector(".ProductForm__AddToCart").addEventListener("click", () => {
            window["ablyft"] = window["ablyft"] || [];
            window["ablyft"].push({
                eventType: "custom",
                eventName: "click-pdp-atc",
                eventValue: 1,
            });
        });
    }
});
