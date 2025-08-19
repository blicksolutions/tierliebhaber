(() => {
    let thirdPartyScriptAdded = false;

    const thirdPartysSriptPaths = [
        'https://t.tierliebhaber.de/v1/lst/universal-script?ph=c0c3ea6be250a0a3cfb45f6840a85c4afb26c43413b4d3fa71c57e1e03aaf233&tag=!clicked&ref_url=' + encodeURI(document.URL),
    ];

    const superChatScriptPath = `https://widget.superchat.de/snippet.js?applicationKey=WCjPxDo0Ol8v91gpB51bp4NVn6`;

    const addThirdPartyScripts = () => {
        if (!thirdPartyScriptAdded) {
            thirdPartysSriptPaths.forEach((thirdPartyScriptPath) => {
                try {
                    const thirdPartyScript = document.createElement("script");
                    thirdPartyScript.src = thirdPartyScriptPath;
                    
                    // Silent error handling - just log, don't throw
                    thirdPartyScript.onerror = () => {
                        console.error(`Script failed to load: ${thirdPartyScriptPath}`);
                    };
                    
                    thirdPartyScript.onload = () => {
                        console.log(`Script loaded successfully: ${thirdPartyScriptPath}`);
                    };

                    document.head.appendChild(thirdPartyScript);
                } catch (e) {
                    console.error('Script loading error:', e);
                }
            });

            thirdPartyScriptAdded = true;
            window.removeEventListener("click", addThirdPartyScripts);
            window.removeEventListener("mousemove", addThirdPartyScripts);
            window.removeEventListener("scroll", addThirdPartyScripts);
            window.removeEventListener("touchstart", addThirdPartyScripts);
        }
    };

    window.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            window.addEventListener("click", addThirdPartyScripts);
            window.addEventListener("mousemove", addThirdPartyScripts);
            window.addEventListener("scroll", addThirdPartyScripts);
            window.addEventListener("touchstart", addThirdPartyScripts);
        }, 1000);

        if (window.enable_superchat == true) {
            setTimeout(() => {
                try {
                    const thirdPartyScript = document.createElement("script");
                    thirdPartyScript.src = superChatScriptPath;
                    thirdPartyScript.onerror = () => {
                        console.error(`SuperChat script failed to load: ${superChatScriptPath}`);
                    };
                    thirdPartyScript.onload = () => {
                        console.log(`SuperChat script loaded successfully: ${superChatScriptPath}`);
                    };
                    document.head.appendChild(thirdPartyScript);
                } catch (e) {
                    console.error('SuperChat script error:', e);
                }
            }, window.superchat_delay);
        }
    });
})();