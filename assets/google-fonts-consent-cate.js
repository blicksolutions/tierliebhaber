(function(){
  'use strict';
  if (window.__GOOGLEFONTS_CONSENT_GATE_LOADED__) return;
  window.__GOOGLEFONTS_CONSENT_GATE_LOADED__ = true;

  var BLOCKED_HOSTS = [
    "fonts.googleapis.com",
    "fonts.gstatic.com"
  ];

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
  var blockedFontsQueue = [];

  function loadFont(href){
    if (!href || __loaded.has(href)) return Promise.resolve();
    
    return new Promise(function(res, rej){
      var l = document.createElement('link');
      l.href = href;
      l.rel = 'stylesheet';
      l.onload = function(){
        __loaded.add(href);
        res(href);
      };
      l.onerror = function(){
        rej(new Error("Font load failed: " + href));
      };
      document.head.appendChild(l);
    });
  }

  // Patch fetch (blockt font files von gstatic)
  (function(){
    var _f = window.fetch;
    if (!_f.__googlefontsPatched) {
      window.fetch = function(r, i){
        var u = (typeof r === "string") ? r : (r && r.url);
        if (!marketingOn() && u && isBlockedUrl(u)) {
          return Promise.reject(new TypeError("Blocked by consent gate"));
        }
        return _f.apply(this, arguments);
      };
      window.fetch.__googlefontsPatched = true;
    }
  })();

  // DOM Blocker für <link> Tags
  function patchElementMethod(methodName){
    var original = Element.prototype[methodName];
    if (!original || original.__googlefontsPatched) return;
    
    function wrapped(child){
      try{
        if (child && child.tagName) {
          var tagName = child.tagName.toLowerCase();
          
          // Block <link rel="stylesheet" href="fonts.googleapis.com...">
          if (tagName === "link") {
            var href = child.href || (child.getAttribute && child.getAttribute("href"));
            var rel = child.rel || (child.getAttribute && child.getAttribute("rel"));
            
            if (href && __loaded.has(href)) return child;
            
            if (href && rel === "stylesheet" && !marketingOn() && isBlockedUrl(href)) {
              if (!blockedFontsQueue.includes(href)) {
                blockedFontsQueue.push(href);
              }
              return child; // nicht einfügen
            }
          }
        }
      }catch(e){}
      return original.call(this, child);
    }
    wrapped.__googlefontsPatched = true;
    Element.prototype[methodName] = wrapped;
  }
  
  patchElementMethod("appendChild");
  patchElementMethod("insertBefore");

  // MutationObserver für nachträglich eingefügte Links
  var mo = new MutationObserver(function(mutations){
    if (marketingOn()) return;
    mutations.forEach(function(mutation){
      (mutation.addedNodes || []).forEach(function(node){
        try{
          if (node && node.tagName && node.tagName.toLowerCase() === 'link') {
            var href = node.href || (node.getAttribute && node.getAttribute("href"));
            var rel = node.rel || (node.getAttribute && node.getAttribute("rel"));
            
            if (href && rel === "stylesheet" && isBlockedUrl(href)) {
              if (!blockedFontsQueue.includes(href)) {
                blockedFontsQueue.push(href);
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
        
        if (blockedFontsQueue.length) {
          for (var i = 0; i < blockedFontsQueue.length; i++) {
            await loadFont(blockedFontsQueue[i]);
          }
          blockedFontsQueue.length = 0;
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