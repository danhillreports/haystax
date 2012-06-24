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
  };

  $.fn.nodeFromXPath = function(xpath) {
    var root = this[0];
    var document = root.ownerDocument;
    var customResolver, evaluateXPath, namespace, node, segment;
    evaluateXPath = function(xp, nsResolver) {
      if (nsResolver == null) nsResolver = null;
      return document.evaluate('.' + xp, root, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    };
    if (!$.isXMLDoc(document.documentElement)) {
      return $(evaluateXPath(xpath));
    } else {
      customResolver = document.createNSResolver(document.ownerDocument === null ? document.documentElement : document.ownerDocument.documentElement);
      node = evaluateXPath(xpath, customResolver);
      if (!node) {
        xpath = ((function() {
          var _k, _len3, _ref2, _results;
          _ref2 = xpath.split('/');
          _results = [];
          for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
            segment = _ref2[_k];
            if (segment && segment.indexOf(':') === -1) {
              _results.push(segment.replace(/^([a-z]+)/, 'xhtml:$1'));
            } else {
              _results.push(segment);
            }
          }
          return _results;
        })()).join('/');
        namespace = document.lookupNamespaceURI(null);
        customResolver = function(ns) {
          if (ns === 'xhtml') {
            return namespace;
          } else {
            return document.documentElement.getAttribute('xmlns:' + ns);
          }
        };
        node = evaluateXPath(xpath, customResolver);
      }
      return $(node);
    }
  };
})(jQuery);
