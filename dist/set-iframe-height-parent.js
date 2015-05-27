(function (root, factory) {
  var $ = root.jQuery;

  if (typeof define === 'function' && define.amd) {
    // AMD
    if ($) {
      define([], factory.bind(null, $));
    }
    else {
      define(['jquery'], factory);
    }
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    if ($) {
      module.exports = factory($);
    }
    else {
      module.exports = factory(require('jquery'));
    }
  } else {
    // Browser globals (root is window)
    if ($) {
      root.setIframeHeight = factory($);
    }
    else {
      throw 'Missing required jQuery dependency';
    }
  }
}(this, function ($) {
  /************** EVENT BINDINGS **************/

  $(window).
    bind('setIframeHeight', onSetIframeHeight).
    bind('message', onMessage);


  /************** PUBLIC INTERFACE **************/

  var that = {
    setHeight: function(params) {
      params.height = parseInt(params.height, 10);
      $(window).trigger('setIframeHeight', [params]);
    }
  };

  var lastHeights = {};

  var _idCounter = 0;

  /************** PRIVATE VARS AND FUNCTIONS **************/

  function findIframeBySrc(src) {
    var bestMatchingIframe = null;

    $('iframe').each(function(idx, iframe) {

      var $iframe = $(iframe);
      var iframeSrc = $iframe.attr('data-iframeAutoHeight-currentSrc') || iframe.src;
      if (iframeSrc) {
        if (iframeSrc.indexOf('/') === 0) {
          iframeSrc = getHostForUrl(document.location.href) + iframeSrc;
        }
        if (iframeSrc === src) {

          if (!$iframe.data('setIframeHeight_id')) {
            $iframe.data('setIframeHeight_id', getNextId());
          }

          bestMatchingIframe = iframe;

          return false; //break jQuery.each loop
        }
      }
    });

    return bestMatchingIframe;
  }

  function findIframeById(iframeId) {
    var bestMatchingIframe = null;

    $('iframe').each(function(idx, iframe) {
      var $iframe = $(iframe);

      if ($iframe.data('setIframeHeight_id') === iframeId) {
        bestMatchingIframe = iframe;

        return false; //break jQuery.each loop
      }
    });

    return bestMatchingIframe;
  }

  function getNextId() {
    return ++_idCounter+'';
  }

  function getHostForUrl(url) {
    var matches = url.match(/https?:\/\/.[^/]+/) || [];
    return matches[0];
  }

  function normalizeUrl(url) {
    return url.replace(/^https?:\/\//, '//');
  }

  function onSetIframeHeight(e, data) {
    var iframe;

    if (data.iframeId) {
      iframe = findIframeById(data.iframeId);
    }

    if (!iframe) {
      iframe = findIframeBySrc(data.iframeSrc);
    }

    if (!iframe && data.iframeReferrer) {
      iframe = findIframeBySrc(data.iframeReferrer);
    }

    if (iframe) {
      var $iframe = $(iframe);
      var $window = $(window);

      $iframe.height(data.height);

      var urlHasChanged = normalizeUrl($iframe.attr('data-iframeAutoHeight-currentSrc') || iframe.src) !== normalizeUrl(data.iframeSrc);

      $iframe.attr('data-iframeAutoHeight-currentSrc', data.iframeSrc);

      iframeId = $iframe.data('setIframeHeight_id');
      var lastHeight = lastHeights[iframeId];
      var height = data.height;
      if (lastHeight === undefined) {
        $window.trigger('setIframeHeight:determined', data);
      }
      else if (lastHeight > height) {
        $window.trigger('setIframeHeight:shrinked', data);
      }
      else if (lastHeight < height) {
        $(window).trigger('setIframeHeight:enlarged', data);
      }

      lastHeights[iframeId] = height;

      if (iframeId !== data.iframeId && iframe.contentWindow && iframe.contentWindow.postMessage) {
        iframe.contentWindow.postMessage('setIframeHeight:setIframeId::{ "iframeId": "'+iframeId+'"}', '*');
      }

      if (window.history.replaceState && $iframe.attr('data-iframeAutoHeight-deepLinkPattern') && urlHasChanged) {
        var parentUrl = $iframe.attr('data-iframeAutoHeight-deepLinkPattern').replace(/%deepLinkIframeSrc%/, encodeURIComponent(data.iframeSrc));
        if (normalizeUrl(document.location.href) !== normalizeUrl(parentUrl)) {
          window.history.replaceState({}, '', parentUrl);
          $(window).trigger('setIframeHeight:deepLink:changed', {
            childUrl: data.iframeSrc,
            parentUrl: parentUrl
          });

          if (iframe.contentWindow && iframe.contentWindow.postMessage) {
            iframe.contentWindow.postMessage('setIframeHeight:deepLink:changed::{ "parentUrl": "'+parentUrl+'", "childUrl": "'+data.iframeUrl+'"}', '*');
          }
        }
      }
    }
  }

  function onMessage(e) {
    var data = e.originalEvent.data;
    if (data.indexOf('::')) {
      var data = data.split('::');
      if (data.length === 2 && data[0] === 'setIframeHeight') {
        var params = $.parseJSON(data[1]);
        that.setHeight(params);
      }
    }
  }

  return that;
}));
