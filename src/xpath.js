(function(jQuery) {
  "use strict";
  
  var $ = jQuery;

  $.fn.xpath = function(relativeRoot) {
    var jq = this.map(function() {
      var path = '';
      var elem = this;

      // elementNode nodeType == 1
      while(elem && elem.nodeType == 1 && elem !== relativeRoot) {
        var idx = $(elem.parentNode).children(elem.tagName).index(elem) + 1;

        idx  = "[" + idx + "]";
        path = "/" + elem.tagName.toLowerCase() + idx + path;
        elem = elem.parentNode;
      }

      return path;
    });

    return jq.get();
  }
})(jQuery);
