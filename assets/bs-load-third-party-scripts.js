(() => {
    let thirdPartyScriptAdded = false;

    const thirdPartysSriptPaths = [
        'https://t.tierliebhaber.de/v1/lst/universal-script?ph=c0c3ea6be250a0a3cfb45f6840a85c4afb26c43413b4d3fa71c57e1e03aaf233&tag=!clicked&ref_url=' + encodeURI(document.URL),
    ];

    const superChatScriptPath = `https://widget.superchat.de/snippet.js?applicationKey=WCjPxDo0Ol8v91gpB51bp4NVn6`;

    const loadScriptSafely = (src, scriptName = 'Third-party script') => {
        return new Promise((resolve, reject) => {
            try {
                const script = document.createElement("script");
                script.src = src;
                
                script.onload = () => {
                    console.log(`✅ ${scriptName} loaded successfully`);
                    resolve();
                };
                
                script.onerror = (event) => {
                    console.warn(`⚠️ ${scriptName} failed to load (SSL/Network error): ${src}`);
                    resolve(); // Resolve instead of reject to continue execution
                };

                // Wrap appendChild in try-catch to handle immediate network errors
                try {
                    document.head.appendChild(script);
                } catch (appendError) {
                    console.warn(`⚠️ Failed to append ${scriptName} (Network error):`, appendError);
                    resolve(); // Continue execution
                }
                
            } catch (error) {
                console.warn(`⚠️ Error creating ${scriptName}:`, error);
                resolve(); // Continue execution
            }
        });
    };

    const addThirdPartyScripts = async () => {
        if (!thirdPartyScriptAdded) {
            
            // Load scripts one by one, handling each failure gracefully
            for (let i = 0; i < thirdPartysSriptPaths.length; i++) {
                try {
                    await loadScriptSafely(thirdPartysSriptPaths[i], `Tierliebhaber Script ${i + 1}`);
                } catch (error) {
                    console.warn(`⚠️ Skipping script ${i + 1}, continuing...`);
                }
            }

            thirdPartyScriptAdded = true;
            
            // Clean up event listeners
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
            setTimeout(async () => {
                try {
                    await loadScriptSafely(superChatScriptPath, 'SuperChat Script');
                } catch (error) {
                    console.warn('⚠️ SuperChat failed, but website continues normally');
                }
            }, window.superchat_delay);
        }
    });
})();