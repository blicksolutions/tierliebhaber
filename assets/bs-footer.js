"use strict";

(() => {
    const targetFooterBlocks = Array.from(document.querySelectorAll(".Footer__Block.Footer__Block--links h2"));
    targetFooterBlocks.push(document.querySelector(".Footer__Block.Footer__Block--reachability h2"));

    targetFooterBlocks.forEach((targetFooterBlock) => {
        targetFooterBlock.addEventListener("click", (e) => e.currentTarget.parentElement.classList.toggle("active"));
    });
})();