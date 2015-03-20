setIframeHeight
==============================

Set iframe height to fit iframe content - works cross-domain


Demo
----

[https://demo.jonasfischer.net/Faibl/setIframeHeight/](https://demo.jonasfischer.net/Faibl/setIframeHeight/)


Usage
-----

### Parent Page

#### 1. Include iframe
    
    <iframe scrolling="no" src="..."></iframe>

#### 2. Include jQuery
    
You can skip this step if jQuery is already included in your page. 
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    
Or, if you need to support IE8 Browsers:

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    
#### 3. Include Script
    
    <script src="dist/set-iframe-height-parent-min.js" async></script>

### Iframe Page

#### 1. Include Script
    
    <script src="dist/set-iframe-height-child-min.js" async></script>

    
### Advanced Options

#### Deep Links

If you want you parent url to be updated whenever the iframe url changes, you need to supply a deep link pattern on the iframe tag:

    <iframe src="..." data-iframeAutoHeight-deepLinkPattern="//www.your-host.com/your-path/?iframe_target=%deepLinkIframeSrc%"></iframe>
    
When rendering your page, you need to validate the value of the iframe_target GET Parameter and if it is valid, you can put the value into the iframe src attribute.

This allows the user to reload, bookmark or share deep-linked iframe content within your parent frame.

If you need to take action in your parent page whenever the deep link changes, e.g. to dynamically update social share buttons, you can listen to the window.setIframeHeight:deepLink:changed event:

    jQuery(window).on('setIframeHeight:deepLink:changed', function(e, data) {
        console.lg(data);
        // Object {childUrl: "http://..", parentUrl: "http://..."}
    });

#### Events

The following events are triggered on the window object of the parent page:

setIframeHeight: is periodically triggered (fires very often)
setIframeHeight:enlarged: is triggered whenever the iframe got enlarged
setIframeHeight:shrinked: is triggered whenever the iframe got shrinked

Example usage:

    jQuery(window)
        .on('setIframeHeight:shrinked', function (e, data) {
            console.log('iframe shrinked', data);
        })
        .on('setIframeHeight:enlarged', function (e, data) {
            console.log('iframe enlarged', data);
        })
    ;
