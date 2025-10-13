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
    // Desktop-Template
    var desktopBtn = document.querySelector("#CybotCookiebotDialogBodyButtonDecline");
    if (desktopBtn) return desktopBtn;
    
    // Mobile-Template: Suche nach Button mit Text "Ablehnen" oder "Decline"
    var allButtons = document.querySelectorAll('#CybotCookiebotDialog button, #CybotCookiebotDialog a');
    for (var i = 0; i < allButtons.length; i++) {
      var btn = allButtons[i];
      var text = btn.textContent.toLowerCase().trim();
      if (text.includes('ablehnen') || text.includes('decline')) {
        return btn;
      }
    }
    
    // Fallback: Button mit "Decline" in der ID
    var declineById = document.querySelector('[id*="Decline"]');
    if (declineById) return declineById;
    
    return null;
  }

  // Findet den Content-Container
  function findTextContainer() {
    // Desktop
    var desktop = document.querySelector("#CybotCookiebotDialogBodyContentText");
    if (desktop) return desktop;
    
    // Mobile - kann verschiedene IDs haben
    var mobile = document.querySelector("#CybotCookiebotDialogBodyContent");
    if (mobile) return mobile;
    
    // Fallback
    var fallback = document.querySelector(".CybotCookiebotDialogBodyContentText");
    if (fallback) return fallback;
    
    return null;
  }

  function moveDeclineButton() {
    if (state.isProcessing) return;
    state.isProcessing = true;

    try {
      const viewportWidth = window.innerWidth;
      const declineBtn = findDeclineButton();
      const textContainer = findTextContainer();

      if (!declineBtn) {
        state.isProcessing = false;
        return;
      }

      if (!state.originalParent) {
        state.originalParent = declineBtn.parentElement;
        state.originalNextSibling = declineBtn.nextElementSibling;
      }

      const shouldBeMobile = viewportWidth <= 600;

      if (shouldBeMobile && !state.buttonMoved) {
        if (textContainer) {
          state.wrapper = document.createElement("div");
          state.wrapper.id = "CybotCookiebotDialogFooter";
          state.wrapper.style.paddingLeft = "0 !important";
          state.wrapper.className = "padding-left-0";

          state.wrapper.appendChild(declineBtn);
          textContainer.appendChild(state.wrapper);
          declineBtn.style.display = "block";

          state.buttonMoved = true;
        }
      }
      else if (!shouldBeMobile && state.buttonMoved) {
        declineBtn.style.visibility = "hidden";
        if (state.wrapper) {
          state.wrapper.style.visibility = "hidden";
        }

        if (state.originalParent) {
          const alreadyInParent = state.originalParent.contains(declineBtn);
          
          if (!alreadyInParent) {
            // Auf Desktop: Als erstes Kind
            // Auf Mobile original: Button war vermutlich letztes Kind
            // Prüfe ob es einen nextSibling gab
            if (state.originalNextSibling && state.originalNextSibling.parentElement === state.originalParent) {
              // Füge VOR dem gespeicherten Sibling ein
              state.originalParent.insertBefore(declineBtn, state.originalNextSibling);
            } else {
              // War letztes Element - ans Ende
              state.originalParent.appendChild(declineBtn);
            }
          }
        } else {
          const footer = document.querySelector("#CybotCookiebotDialogFooter:not(.padding-left-0)");
          if (footer) {
            footer.appendChild(declineBtn);
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

  const observer = new MutationObserver(() => {
    if (!state.originalParent || !findDeclineButton()) {
      moveDeclineButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(() => moveDeclineButton(), 100);
  // Zweiter Versuch für Mobile (manchmal lädt es langsamer)
  setTimeout(() => moveDeclineButton(), 500);

  let lastWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    const currentWidth = window.innerWidth;
    const crossedThreshold = (lastWidth <= 600 && currentWidth > 600) || (lastWidth > 600 && currentWidth <= 600);
    
    if (crossedThreshold) {
      setTimeout(function() {
        moveDeclineButton();
      }, 50);
    }
    
    lastWidth = currentWidth;
  });

  window.addEventListener("orientationchange", function () {
    setTimeout(() => {
      lastWidth = window.innerWidth;
      moveDeclineButton();
    }, 200);
  });
});