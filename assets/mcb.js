(function() {
  'use strict';
  
  let state = {
    buttonMoved: false,
    wrapper: null,
    originalParent: null,
    originalNextSibling: null,
    isProcessing: false
  };

  function findDeclineButton() {
    var desktopBtn = document.querySelector("#CybotCookiebotDialogBodyButtonDecline");
    if (desktopBtn) return desktopBtn;
    
    var allButtons = document.querySelectorAll('#CybotCookiebotDialog button, #CybotCookiebotDialog a');
    for (var i = 0; i < allButtons.length; i++) {
      var btn = allButtons[i];
      var text = btn.textContent.toLowerCase().trim();
      if (text.includes('ablehnen') || text.includes('decline')) {
        return btn;
      }
    }
    return null;
  }

  function findTextContainer() {
    var selectors = [
      "#CybotCookiebotDialogBodyContentText",
      "#CybotCookiebotDialogBodyContent",
      "#CybotCookiebotDialogTabContent",
      ".CybotCookiebotDialogBodyContentText"
    ];
    
    for (var i = 0; i < selectors.length; i++) {
      var container = document.querySelector(selectors[i]);
      if (container) return container;
    }
    return null;
  }

  function moveDeclineButton() {
    if (state.isProcessing) return;
    state.isProcessing = true;

    try {
      var viewportWidth = window.innerWidth;
      var declineBtn = findDeclineButton();
      var textContainer = findTextContainer();

      if (!declineBtn || !textContainer) {
        state.isProcessing = false;
        return;
      }

      if (!state.originalParent) {
        state.originalParent = declineBtn.parentElement;
        state.originalNextSibling = declineBtn.nextElementSibling;
      }

      var shouldBeMobile = viewportWidth <= 600;

      if (shouldBeMobile && !state.buttonMoved) {
        state.wrapper = document.createElement("div");
        state.wrapper.id = "CybotCookiebotDialogFooter";
        state.wrapper.style.paddingLeft = "0";
        state.wrapper.style.setProperty("padding-left", "0", "important");
        state.wrapper.className = "padding-left-0";

        state.wrapper.appendChild(declineBtn);
        textContainer.appendChild(state.wrapper);
        declineBtn.style.display = "block";

        state.buttonMoved = true;
      }
      else if (!shouldBeMobile && state.buttonMoved) {
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
      }

    } catch (error) {
      // Silent error handling
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
  
  setTimeout(function() { moveDeclineButton(); }, 100);
  setTimeout(function() { moveDeclineButton(); }, 500);
  setTimeout(function() { moveDeclineButton(); }, 1000);
  setTimeout(function() { moveDeclineButton(); }, 2000);

  var lastWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    var currentWidth = window.innerWidth;
    var crossedThreshold = (lastWidth <= 600 && currentWidth > 600) || (lastWidth > 600 && currentWidth <= 600);
    
    if (crossedThreshold) {
      setTimeout(function() {
        moveDeclineButton();
      }, 50);
    }
    
    lastWidth = currentWidth;
  });

  window.addEventListener("orientationchange", function () {
    setTimeout(function() {
      lastWidth = window.innerWidth;
      moveDeclineButton();
    }, 200);
  });
})();