(function() {
  'use strict';
  
  console.log("[MCB] Script started immediately");
  
  let state = {
    buttonMoved: false,
    wrapper: null,
    originalParent: null,
    originalNextSibling: null,
    isProcessing: false
  };

  function findDeclineButton() {
    console.log("[MCB] Searching for decline button...");
    
    var desktopBtn = document.querySelector("#CybotCookiebotDialogBodyButtonDecline");
    if (desktopBtn) {
      console.log("[MCB] ✓ Found desktop button");
      return desktopBtn;
    }
    
    var allButtons = document.querySelectorAll('#CybotCookiebotDialog button, #CybotCookiebotDialog a');
    console.log("[MCB] Found", allButtons.length, "buttons in dialog");
    
    for (var i = 0; i < allButtons.length; i++) {
      var btn = allButtons[i];
      var text = btn.textContent.toLowerCase().trim();
      console.log("[MCB] Button " + i + ":", text.substring(0, 20));
      
      if (text.includes('ablehnen') || text.includes('decline')) {
        console.log("[MCB] ✓ Found decline button by text!");
        return btn;
      }
    }
    
    console.log("[MCB] ✗ No decline button found");
    return null;
  }

  function findTextContainer() {
    console.log("[MCB] Searching for text container...");
    
    var selectors = [
      "#CybotCookiebotDialogBodyContentText",
      "#CybotCookiebotDialogBodyContent",
      "#CybotCookiebotDialogTabContent",
      ".CybotCookiebotDialogBodyContentText"
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
    if (state.isProcessing) {
      console.log("[MCB] Already processing, skip");
      return;
    }
    state.isProcessing = true;

    try {
      var viewportWidth = window.innerWidth;
      console.log("[MCB] moveDeclineButton - viewport:", viewportWidth);
      
      var declineBtn = findDeclineButton();
      var textContainer = findTextContainer();

      if (!declineBtn) {
        console.log("[MCB] ✗ Button not found");
        state.isProcessing = false;
        return;
      }

      if (!textContainer) {
        console.log("[MCB] ✗ Container not found");
        state.isProcessing = false;
        return;
      }

      if (!state.originalParent) {
        state.originalParent = declineBtn.parentElement;
        state.originalNextSibling = declineBtn.nextElementSibling;
        console.log("[MCB] 💾 Saved original position");
      }

      var shouldBeMobile = viewportWidth <= 600;
      console.log("[MCB] Mobile?", shouldBeMobile, "Moved?", state.buttonMoved);

      if (shouldBeMobile && !state.buttonMoved) {
        console.log("[MCB] 📱 Moving to mobile...");
        
        state.wrapper = document.createElement("div");
        state.wrapper.id = "CybotCookiebotDialogFooter";
        state.wrapper.style.paddingLeft = "0";
        state.wrapper.style.setProperty("padding-left", "0", "important");
        state.wrapper.className = "padding-left-0";

        state.wrapper.appendChild(declineBtn);
        textContainer.appendChild(state.wrapper);
        declineBtn.style.display = "block";

        state.buttonMoved = true;
        console.log("[MCB] ✅ Moved to content!");
      }
      else if (!shouldBeMobile && state.buttonMoved) {
        console.log("[MCB] 🖥️ Moving back...");
        
        declineBtn.style.visibility = "hidden";
        if (state.wrapper) {
          state.wrapper.style.visibility = "hidden";
        }

        if (state.originalParent) {
          var alreadyInParent = state.originalParent.contains(declineBtn);
          
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
        console.log("[MCB] ✅ Restored!");
      }

    } catch (error) {
      console.error("[MCB] ❌ Error:", error);
    } finally {
      state.isProcessing = false;
    }
  }

  var observer = new MutationObserver(function() {
    if (!state.originalParent || !findDeclineButton()) {
      moveDeclineButton();
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.log("[MCB] Observer started");
  
  // Mehrere Init-Versuche
  setTimeout(function() { moveDeclineButton(); }, 100);
  setTimeout(function() { moveDeclineButton(); }, 500);
  setTimeout(function() { moveDeclineButton(); }, 1000);
  setTimeout(function() { moveDeclineButton(); }, 2000);

  var lastWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    var currentWidth = window.innerWidth;
    var crossedThreshold = (lastWidth <= 600 && currentWidth > 600) || (lastWidth > 600 && currentWidth <= 600);
    
    if (crossedThreshold) {
      console.log("[MCB] 📏 Threshold crossed");
      setTimeout(function() {
        moveDeclineButton();
      }, 50);
    }
    
    lastWidth = currentWidth;
  });

  window.addEventListener("orientationchange", function () {
    setTimeout(function() {
      console.log("[MCB] 🔄 Orientation changed");
      lastWidth = window.innerWidth;
      moveDeclineButton();
    }, 200);
  });

  console.log("[MCB] ✅ Script fully loaded");
})();