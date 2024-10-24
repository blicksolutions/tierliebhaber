window.activateAbTlh062 = () => {
		const socialProofsB = document.querySelectorAll(".LikeBadge--version-b");

		if(socialProofsB.length > 0) {
			socialProofsB.forEach((socialProofB) => {
				socialProofB.classList.add("active");
				socialProofB.style.display = "flex";
			});
		}
};

