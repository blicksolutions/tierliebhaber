(() => {
    let thirdPartyScriptAdded = false;

    const thirdPartysSriptPaths = [
        'https://tierliebhaber.de/v1/lst/universal-script?ph=c0c3ea6be250a0a3cfb45f6840a85c4afb26c43413b4d3fa71c57e1e03aaf233&tag=!clicked&ref_url=' + encodeURI(document.URL),
    ];

    const superChatScriptPath = `https://widget.superchat.de/snippet.js?applicationKey=WCjPxDo0Ol8v91gpB51bp4NVn6`;

    const addThirdPartyScripts = () => {
        if (!thirdPartyScriptAdded) {
            
            thirdPartysSriptPaths.forEach((thirdPartyScriptPath, index) => {
                // Create and append script - browser error will happen here but won't break JS
                const script = document.createElement("script");
                script.src = thirdPartyScriptPath;
                
                script.onload = () => {
                    console.log(`✅ Script ${index + 1} loaded successfully`);
                };
                
                script.onerror = () => {
                    console.log(`⚠️ Script ${index + 1} failed (expected due to SSL issue) - website continues normally`);
                };

                // This line will trigger the browser error, but JS execution continues
                document.head.appendChild(script);
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
                const script = document.createElement("script");
                script.src = superChatScriptPath;
                script.onload = () => console.log(`✅ SuperChat loaded successfully`);
                script.onerror = () => console.log(`⚠️ SuperChat failed - website continues normally`);
                document.head.appendChild(script);
            }, window.superchat_delay);
        }
    });
})();