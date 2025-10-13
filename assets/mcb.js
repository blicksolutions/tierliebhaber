document.addEventListener("DOMContentLoaded", function () {
  let state = {
    buttonMoved: false,
    wrapper: null,
    originalParent: null,
    originalNextSibling: null,
    isProcessing: false
  };

  // Findet den "Ablehnen"/"Decline"-Button in verschiedenen Templates
  function findDeclineButton() {
    console.log("[MCB] Searching for decline button...");
    
    // Desktop-Template
    var desktopBtn = document.querySelector("#CybotCookiebotDialogBodyButtonDecline");
    if (desktopBtn) {
      console.log("[MCB] ✓ Found desktop button:", desktopBtn.id);
      return desktopBtn;
    }
    
    // Mobile-Template: Suche nach Button mit Text "Ablehnen" oder "Decline"
    var allButtons = document.querySelectorAll('#CybotCookiebotDialog button, #CybotCookiebotDialog a');
    console.log("[MCB] Searching in", allButtons.length, "buttons");
    
    for (var i = 0; i < allButtons.length; i++) {
      var btn = allButtons[i];
      var text = btn.textContent.toLowerCase().trim();
      console.log("[MCB] Button", i, ":", text.substring(0, 20), "ID:", btn.id);
      
      if (text.includes('ablehnen') || text.includes('decline')) {
        console.log("[MCB] ✓ Found decline button by text!");
        return btn;
      }
    }
    
    console.log("[MCB] ✗ No decline button found");
    return null;
  }

  // Findet den Content-Container
  function findTextContainer() {
    console.log("[MCB] Searching for text container...");
    
    var selectors = [
      "#CybotCookiebotDialogBodyContentText",
      "#CybotCookiebotDialogBodyContent",
      ".CybotCookiebotDialogBodyContentText",
      "#CybotCookiebotDialogTabContent"
    ];
    
    for (var i = 0; i < selectors.length; i++) {
      var container = document.querySelector(selectors[i]);
      if (container) {
        console.log("[MCB] ✓ Found container:", selectors[i]);
        return container;
      }
    }
    
    console.log("[MCB] ✗ No container found");
    return null;
  }

  function moveDeclineButton() {
    if (state.isProcessing) return;
    state.isProcessing = true;

    try {
      const viewportWidth = window.innerWidth;
      console.log("[MCB] moveDeclineButton called, viewport:", viewportWidth);
      
      const declineBtn = findDeclineButton();
      const textContainer = findTextContainer();

      if (!declineBtn) {
        console.log("[MCB] ✗ Button not found, aborting");
        state.isProcessing = false;
        return;
      }

      if (!textContainer) {
        console.log("[MCB] ✗ Container not found, aborting");
        state.isProcessing = false;
        return;
      }

      if (!state.originalParent) {
        state.originalParent = declineBtn.parentElement;
        state.originalNextSibling = declineBtn.nextElementSibling;
        console.log("[MCB] 💾 Saved original position");
      }

      const shouldBeMobile = viewportWidth <= 600;
      console.log("[MCB] Should be mobile?", shouldBeMobile, "Already moved?", state.buttonMoved);

      if (shouldBeMobile && !state.buttonMoved) {
        console.log("[MCB] 📱 Moving to mobile...");
        
        state.wrapper = document.createElement("div");
        state.wrapper.id = "CybotCookiebotDialogFooter";
        state.wrapper.style.paddingLeft = "0 !important";
        state.wrapper.className = "padding-left-0";

        state.wrapper.appendChild(declineBtn);
        textContainer.appendChild(state.wrapper);
        declineBtn.style.display = "block";

        state.buttonMoved = true;
        console.log("[MCB] ✅ Moved to content!");
      }
      else if (!shouldBeMobile && state.buttonMoved) {
        console.log("[MCB] 🖥️ Moving back to desktop...");
        
        declineBtn.style.visibility = "hidden";
        if (state.wrapper) {
          state.wrapper.style.visibility = "hidden";
        }

        if (state.originalParent) {
          const alreadyInParent = state.originalParent.contains(declineBtn);
          
          if (!alreadyInParent) {
            if (state.originalNextSibling && state.originalNextSibling.parentElement === state.originalParent) {
              state.originalParent.insertBefore(declineBtn, state.originalNextSibling);
            } else {
              state.originalParent.appendChild(declineBtn);
            }
          }
        }

        declineBtn.style.visibility = "";

        if (state.wrapper && state.wrapper.parentNode) {
          state.wrapper.parentNode.removeChild(state.wrapper);
        }

        declineBtn.style.display = "";

        state.buttonMoved = false;
        state.wrapper = null;
        console.log("[MCB] ✅ Restored to footer");
      } else {
        console.log("[MCB] ℹ️ No action needed");
      }

    } catch (error) {
      console.error("[MCB] ❌ Error:", error);
    } finally {
      state.isProcessing = false;
    }
  }

  const observer = new MutationObserver(() => {
    if (!state.originalParent || !findDeclineButton()) {
      moveDeclineButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log("[MCB] Script loaded, starting init...");
  setTimeout(() => moveDeclineButton(), 100);
  setTimeout(() => moveDeclineButton(), 500);
  setTimeout(() => moveDeclineButton(), 1000);

  let lastWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    const currentWidth = window.innerWidth;
    const crossedThreshold = (lastWidth <= 600 && currentWidth > 600) || (lastWidth > 600 && currentWidth <= 600);
    
    if (crossedThreshold) {
      console.log("[MCB] 📏 Threshold crossed");
      setTimeout(function() {
        moveDeclineButton();
      }, 50);
    }
    
    lastWidth = currentWidth;
  });

  window.addEventListener("orientationchange", function () {
    setTimeout(() => {
      console.log("[MCB] 🔄 Orientation changed");
      lastWidth = window.innerWidth;
      moveDeclineButton();
    }, 200);
  });
});