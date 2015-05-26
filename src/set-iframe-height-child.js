(function() {
  if (!window.parent || parent === self) {
    return;
  }

  $(window).bind('message', onMessage);

  function postCurrentHeight() {
    postHeight(getDocumentHeight());
  }

  function getDocumentHeight() {
    var D = document;

    var matches = navigator.userAgent.match(/MSIE (\d)/);
    if (matches && parseInt(matches[1], 10) <=10) {

      return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight);
    }

    return Math.min(
      Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
      Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
      )
    );
  }

  function postHeight(height) {
    if (parent.postMessage) {
      parent.postMessage('setIframeHeight::{ "iframeSrc": "'+document.location.href+'", "iframeReferrer": "'+document.referrer+'", "height":'+height+' }', '*');
    }
  }

  function onMessage(e) {
    var data = e.originalEvent.data;
    if (data.indexOf('::')) {
      var data = data.split('::');
      if (data.length === 2 && data[0] === 'setIframeHeight:deepLink:changed') {
        var params = $.parseJSON(data[1]);
        $(window).trigger('setIframeHeight:deepLink:changed', params);
      }
    }
  }

  setInterval(postCurrentHeight, 350);
  postCurrentHeight();
})();