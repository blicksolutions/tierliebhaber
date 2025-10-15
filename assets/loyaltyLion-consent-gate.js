/* ================= remove Loyalty Lion sccripts if no Marketing Consent ============== */ 

(function(){
  'use strict';
  if (window.__LOYALTYLION_CONSENT_GATE_LOADED__) return;
  window.__LOYALTYLION_CONSENT_GATE_LOADED__ = true;

  var BLOCKED_HOSTS = [
    "sdk.loyaltylion.net",
    "sdk-static.loyaltylion.net",
    "api.loyaltylion.com"
  ];
  
  var DEFAULT_SCRIPT = "https://sdk.loyaltylion.net/static/2/loader.js?t=" + Date.now();

  function hasCookiebot(){ return !!(window.Cookiebot && window.Cookiebot.consent); }
  function marketingOn(){
    try{
      if (!hasCookiebot()) return false;
      return window.Cookiebot.consent.marketing === true;
    }catch(e){ return false; }
  }
  
  function isBlockedUrl(url){
    try{
      var u = new URL(url, location.href);
      var h = u.hostname;
      return BLOCKED_HOSTS.some(function(b){ return h === b || h.endsWith("." + b); });
    }catch(e){ return false; }
  }

  var __loaded = new Set();
  var blockedScriptQueue = [];

  function loadScript(src){
    if (!src || __loaded.has(src)) return Promise.resolve();
    
    return new Promise(function(res, rej){
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.onload = function(){
        __loaded.add(src);
        res(src);
      };
      s.onerror = function(){
        rej(new Error("Script load failed: " + src));
      };
      document.head.appendChild(s);
    });
  }

  // Patch XHR
  (function(){
    var open = XMLHttpRequest.prototype.open;
    if (!XMLHttpRequest.prototype.__loyaltylionPatched) {
      XMLHttpRequest.prototype.__loyaltylionPatched = true;
      XMLHttpRequest.prototype.open = function(m, u){
        if (!marketingOn() && isBlockedUrl(u)) return;
        return open.apply(this, arguments);
      };
    }
  })();

  // Patch fetch
  (function(){
    var _f = window.fetch;
    if (!_f.__loyaltylionPatched) {
      window.fetch = function(r, i){
        var u = (typeof r === "string") ? r : (r && r.url);
        if (!marketingOn() && u && isBlockedUrl(u)) {
          return Promise.reject(new TypeError("Blocked by consent gate"));
        }
        return _f.apply(this, arguments);
      };
      window.fetch.__loyaltylionPatched = true;
    }
  })();

  // DOM Blocker
  function patchElementMethod(methodName){
    var original = Element.prototype[methodName];
    if (!original || original.__loyaltylionPatched) return;
    
    function wrapped(child){
      try{
        if (child && child.tagName) {
          var tagName = child.tagName.toLowerCase();
          var src = child.src || (child.getAttribute && child.getAttribute("src"));
          
          if (tagName === "script" && src && __loaded.has(src)) return child;
          
          if ((tagName === "script" || tagName === "iframe") && src && !marketingOn() && isBlockedUrl(src)) {
            if (tagName === "script" && !blockedScriptQueue.includes(src)) {
              blockedScriptQueue.push(src);
            }
            return child;
          }
        }
      }catch(e){}
      return original.call(this, child);
    }
    wrapped.__loyaltylionPatched = true;
    Element.prototype[methodName] = wrapped;
  }
  
  patchElementMethod("appendChild");
  patchElementMethod("insertBefore");

  // MutationObserver
  var mo = new MutationObserver(function(mutations){
    if (marketingOn()) return;
    mutations.forEach(function(mutation){
      (mutation.addedNodes || []).forEach(function(node){
        try{
          if (node && node.tagName) {
            var tagName = node.tagName.toLowerCase();
            var src = node.src || (node.getAttribute && node.getAttribute('src'));
            if ((tagName === 'script' || tagName === 'iframe') && src && isBlockedUrl(src)) {
              if (tagName === 'script' && !blockedScriptQueue.includes(src)) {
                blockedScriptQueue.push(src);
              }
              node.remove();
            }
          }
        }catch(e){}
      });
    });
  });
  mo.observe(document.documentElement, {childList: true, subtree: true});

  // Enable
  var enabledOnce = false;
  function enable(){
    if (enabledOnce || !marketingOn()) return;
    enabledOnce = true;

    (async function(){
      try{
        await new Promise(function(r){ setTimeout(r, 100); });
        
        var toLoad = blockedScriptQueue.length ? blockedScriptQueue.slice() : [DEFAULT_SCRIPT];
        blockedScriptQueue.length = 0;
        
        for (var i = 0; i < toLoad.length; i++) {
          await loadScript(toLoad[i]);
        }
        
        if (mo && mo.disconnect) mo.disconnect();
      }catch(err){}
    })();
  }

  // Events
  function on(evt, fn){ window.addEventListener(evt, fn, false); }
  
  if (marketingOn()) enable();
  on("CookiebotOnLoad", enable);
  on("CookiebotOnConsentReady", enable);
  on("CookiebotOnAccept", enable);
  document.addEventListener("DOMContentLoaded", enable);
  window.addEventListener("load", enable);
  document.addEventListener("visibilitychange", function(){
    if (document.visibilityState === "visible") enable();
  });
})();

/* ================= hide revenuehunt Section from homepage ============== */ 


(function(){
  'use strict';
  
  if (window.__LOYALTYLION_SECTION_MANAGER_LOADED__) return;
  window.__LOYALTYLION_SECTION_MANAGER_LOADED__ = true;
  
  function hasMarketingConsent() {
    try {
      return window.Cookiebot && 
             window.Cookiebot.consent && 
             window.Cookiebot.consent.marketing === true;
    } catch(e) {
      return false;
    }
  }
  
  function toggleLoyaltyLionSection() {
    var hasConsent = hasMarketingConsent();
    var loyaltyLionSection = document.querySelector('#shopify-section-slideshow_xFQ8td');
    
    if (loyaltyLionSection) {
      loyaltyLionSection.style.display = hasConsent ? 'block' : 'none';
    }
  }
  
  toggleLoyaltyLionSection();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', toggleLoyaltyLionSection);
  }
  
  window.addEventListener('CookiebotOnAccept', toggleLoyaltyLionSection);
  window.addEventListener('CookiebotOnDecline', toggleLoyaltyLionSection);
  window.addEventListener('CookiebotOnLoad', toggleLoyaltyLionSection);
})();