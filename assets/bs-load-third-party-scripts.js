(() => {
    let thirdPartyScriptAdded = false;

    // third party scripts
    const thirdPartysSriptPaths = [
        'https://t.tierliebhaber.de/v1/lst/universal-script?ph=c0c3ea6be250a0a3cfb45f6840a85c4afb26c43413b4d3fa71c57e1e03aaf233&tag=!clicked&ref_url=' + encodeURI(document.URL),
        'https://widget.superchat.de/snippet.js?applicationKey=WCjPxDo0Ol8v91gpB51bp4NVn6',

    ];

    const addThirdPartyScripts = () => {
        // check if script was added, to prevent multiple script adding
        if (!thirdPartyScriptAdded) {
            thirdPartysSriptPaths.forEach((thirdPartyScriptPath) => {
                const thirdPartyScript = document.createElement("script");
                thirdPartyScript.src = thirdPartyScriptPath;
                document.head.appendChild(thirdPartyScript);
            });

            thirdPartyScriptAdded = true;
        }
    };

    window.addEventListener("click", addThirdPartyScripts);
    window.addEventListener("mousemove", addThirdPartyScripts);
    window.addEventListener("scroll", addThirdPartyScripts);
    window.addEventListener("touchstart", addThirdPartyScripts);
})();
