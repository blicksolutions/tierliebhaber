
/** DO NOT MODIFY THIS CODE**/
  !function(_window, _document) {
    var OB_ADV_ID = '000c96d7841015fffe2f8e27581bf5e809';
    if (_window.obApi) {
      var toArray = function(object) {
        return Object.prototype.toString.call(object) === '[object Array]' ? object : [object];
      };
      _window.obApi.marketerId = toArray(_window.obApi.marketerId).concat(toArray(OB_ADV_ID));
      return;
    }
    var api = _window.obApi = function() {
      api.dispatch ? api.dispatch.apply(api, arguments) : api.queue.push(arguments);
    };
    api.version = '1.1';
    api.loaded = true;
    api.marketerId = OB_ADV_ID;
    api.queue = [];
    var tag = _document.createElement('script');
    tag.async = true;
    tag.src = '//amplify.outbrain.com/cp/obtp.js';
    tag.type = 'text/javascript';
    var script = _document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(tag, script);
  }(window, document);

  obApi('track', 'PAGE_VIEW');

