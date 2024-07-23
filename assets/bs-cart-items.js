"use strict";

(() => {
	const adjustSnippetOpacity = () => {
		const gifttextsnippets = document.querySelectorAll(".gift__text");

		gifttextsnippets.forEach((gifttextsnippet) => {
			gifttextsnippet.style.opacity = 1;
		});
	};

	adjustSnippetOpacity();

	document.addEventListener("rerenderingFinished", () => {
		adjustSnippetOpacity();
	});
})();
