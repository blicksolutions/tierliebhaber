document.addEventListener("DOMContentLoaded", function () {
  let state = {
    buttonMoved: false,
    wrapper: null,
    originalParent: null,
    originalNextSibling: null,
    isProcessing: false
  };

  function moveDeclineButton() {
    if (state.isProcessing) return;
    state.isProcessing = true;

    try {
      const viewportWidth = window.innerWidth;
      const declineBtn = document.querySelector("#CybotCookiebotDialogBodyButtonDecline");
      const textContainer = document.querySelector("#CybotCookiebotDialogBodyContentText");

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
            const firstChild = state.originalParent.firstElementChild;
            if (firstChild) {
              state.originalParent.insertBefore(declineBtn, firstChild);
            } else {
              state.originalParent.appendChild(declineBtn);
            }
          }
        } else {
          const footer = document.querySelector("#CybotCookiebotDialogFooter:not(.padding-left-0)");
          if (footer) {
            const firstChild = footer.firstElementChild;
            if (firstChild) {
              footer.insertBefore(declineBtn, firstChild);
            } else {
              footer.appendChild(declineBtn);
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

  const observer = new MutationObserver(() => {
    if (!state.originalParent || !document.querySelector("#CybotCookiebotDialogBodyButtonDecline")) {
      moveDeclineButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(() => moveDeclineButton(), 100);

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