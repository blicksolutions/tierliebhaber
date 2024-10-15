window.activateAbTlh055 = () => {
	const versionA = document.querySelector(".bs-hero-banner:first-of-type");
	const versionB = document.querySelector(".bs-hero-banner.bs-hero-banner--version-b");

	if(versionA && versionB) {
		versionA.style.display = "none";
		versionB.style.display = "flex";
	}
};
