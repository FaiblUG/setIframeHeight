setIframeHeight
==============================

Automatically adjust iframe height to fit the lenght of the displayed page - works cross-domain


Demo
----

[http://faiblug.github.io/setIframeHeight/](http://faiblug.github.io/setIframeHeight/)


Usage
-----

### Parent Page

#### 1. Include iframe
    
    <iframe scrolling="no" src="..."></iframe>

#### 2. Include jQuery
    
You can skip this step if jQuery is already included in your page. 
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    
#### 3. Include Script
    
    <script src="dist/set-iframe-height-parent-min.js" async></script>

### Iframe Page

#### 1. Include Script
    
    <script src="dist/set-iframe-height-child-min.js" async></script>

#### 2. Include jQuery
    
You can skip this step if jQuery is already included in the iframe page. 
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    
### Advanced Options

#### Deep Links

If you want you parent url to be updated whenever the iframe url changes, you need to supply a deep link pattern on the iframe tag:

    <iframe src="..." data-iframeAutoHeight-deepLinkPattern="/path/to/parent-page/?iframe_target=%deepLinkIframeSrc%"></iframe>
    
When rendering your page, you need to validate the value of the iframe_target GET Parameter and if it is valid, you can put the value into the iframe src attribute.

This allows the user to reload, bookmark or share deep-linked iframe content within your parent frame.

If you need to take action whenever the deep link changes, e.g. to dynamically update social share buttons, you can listen to the window.setIframeHeight:deepLink:changed event:

    jQuery(window).on('setIframeHeight:deepLink:changed', function(e, data) {
        console.log(data);
        // Object {childUrl: "http://..", parentUrl: "http://..."}
    });

This event is fired in the parent page and in the iframe itself.

#### Events

The following events are triggered on the window object of the parent page:

setIframeHeight: is periodically triggered (fires very often)
setIframeHeight:enlarged: is triggered whenever the iframe got enlarged
setIframeHeight:shrinked: is triggered whenever the iframe got shrinked

Example usage:

    jQuery(window)
        .on('setIframeHeight:shrinked', function (e, data) {
            console.log('iframe shrinked', data);
            window.scroll(0,0);
        })
        .on('setIframeHeight:enlarged', function (e, data) {
            console.log('iframe enlarged', data);
        })
    ;


#### Support for amp-iframe (Accelerated Mobile Pages Project)

[Demo](https://rawgit.com/FaiblUG/setIframeHeight/master/demo/amp-iframe-demo.html)

For implementation details, check the [demo sourcecode](https://github.com/FaiblUG/setIframeHeight/blob/master/demo/amp-iframe-demo.html) and the [amp-iframe documentation](https://github.com/ampproject/amphtml/blob/master/extensions/amp-iframe/amp-iframe.md)

Thanks to [mthiele](https://github.com/mthieleguj) for this contribution.
