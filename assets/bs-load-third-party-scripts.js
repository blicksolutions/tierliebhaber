(() => {
    let thirdPartyScriptAdded = false;

    // third party scripts
    const thirdPartysSriptPaths = [
        'https://t.tierliebhaber.de/v1/lst/universal-script?ph=c0c3ea6be250a0a3cfb45f6840a85c4afb26c43413b4d3fa71c57e1e03aaf233&tag=!clicked&ref_url=' + encodeURI(document.URL),
    ];

    const superChatScriptPath = `https://widget.superchat.de/snippet.js?applicationKey=WCjPxDo0Ol8v91gpB51bp4NVn6`;

    const loadScriptSafely = (src, scriptName = 'Third-party script') => {
        try {
            const script = document.createElement("script");
            script.src = src;
            
            script.onerror = (error) => {
                // Log the error but don't break the website
                console.error(`${scriptName} failed to load:`, src);
                console.error('Error details:', error);
                
                // Optionally throw a custom error for debugging (won't break the site)
                const customError = new Error(`Failed to load ${scriptName}: ${src}`);
                customError.scriptSrc = src;
                customError.scriptName = scriptName;
                throw customError;
            };
            
            script.onload = () => {
                console.log(`${scriptName} loaded successfully:`, src);
            };

            document.head.appendChild(script);
            
        } catch (error) {
            // Catch any synchronous errors and log them
            console.error(`Error creating/loading ${scriptName}:`, error);
            // Don't re-throw here - just log and continue
        }
    };

    const addThirdPartyScripts = () => {
        // check if script was added, to prevent multiple script adding
        if (!thirdPartyScriptAdded) {
            
            thirdPartysSriptPaths.forEach((thirdPartyScriptPath, index) => {
                try {
                    loadScriptSafely(thirdPartyScriptPath, `Tierliebhaber Script ${index + 1}`);
                } catch (error) {
                    // Log the error but continue with the next script
                    console.warn(`Skipping failed script ${index + 1}, continuing with others...`);
                }
            });

            thirdPartyScriptAdded = true;
            
            // Clean up event listeners
            try {
                window.removeEventListener("click", addThirdPartyScripts);
                window.removeEventListener("mousemove", addThirdPartyScripts);
                window.removeEventListener("scroll", addThirdPartyScripts);
                window.removeEventListener("touchstart", addThirdPartyScripts);
            } catch (error) {
                console.error('Error removing event listeners:', error);
            }
        }
    };

    try {
        window.addEventListener("DOMContentLoaded", () => {
            try {
                setTimeout(() => {
                    try {
                        window.addEventListener("click", addThirdPartyScripts);
                        window.addEventListener("mousemove", addThirdPartyScripts);
                        window.addEventListener("scroll", addThirdPartyScripts);
                        window.addEventListener("touchstart", addThirdPartyScripts);
                    } catch (error) {
                        console.error('Error adding event listeners:', error);
                    }
                }, 1000);

                // Handle SuperChat script separately
                if (window.enable_superchat == true) {
                    setTimeout(() => {
                        try {
                            loadScriptSafely(superChatScriptPath, 'SuperChat Script');
                        } catch (error) {
                            console.warn('SuperChat script failed to load, but website will continue normally');
                        }
                    }, window.superchat_delay);
                }
                
            } catch (error) {
                console.error('Error in DOMContentLoaded handler:', error);
            }
        });
        
    } catch (error) {
        console.error('Error setting up DOMContentLoaded listener:', error);
    }
})();