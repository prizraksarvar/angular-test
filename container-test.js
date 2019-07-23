// In Iframe
(function () {
    var event = new CustomEvent(
        "iframeUrlLoaded",
        {
            detail: {
                location: location,
                childWindow: window,
                time: new Date(),
            },
            bubbles: true,
            cancelable: true
        }
    );
    window.parent.document.dispatchEvent(event);
});
(function () {
    var currentUrl = "/not-loaded/";
    //all domains test
    document.addEventListener('iframeUrlLoaded', function (e) {
        console.log(e);
        var iframeWindow = e.detail.childWindow;
        if (currentUrl !== iframeWindow.location.href) {
            currentUrl = iframeWindow.location.href;
        } else {
            return;
        }

        new Ajax('if1.html', function (response) {
            console.log(response);
            iframeWindow.document.documentElement.innerHTML = response.documentElement.innerHTML;
            setTimeout(function () {
                execDomScripts(iframeWindow.document.documentElement);
            },30);
        }, function (e, msg) {
            console.log(e, msg);
        })
    }, false);

    function execDomScripts(dom) {
        function evalScript(elem, parent) {
            var data = (elem.text || elem.textContent || elem.innerHTML || ""),
                src = elem.src,
                head = parent,
                script = document.createElement("script");

            script.type = "text/javascript";
            if (!src) {
                try {
                    // doesn't work on ie...
                    script.appendChild(document.createTextNode(data));
                } catch (e) {
                    // IE has funky script nodes
                    script.text = data;
                }
            } else {
                script.src = src;
            }

            head.insertBefore(script, head.firstChild);
        }

        // main section of function
        var scripts = dom.querySelectorAll('script'),
            script,
            parent,
            i;

        for (i = 0; scripts[i]; i++) {
            script = scripts[i];
            parent = script.parentNode;
            if (parent) {
                parent.removeChild(script);
            }
            evalScript(script, parent);
        }
    }

    function Ajax(url, successCallback, errorCallback) {
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.xhr = new XMLHttpRequest();
        this._registerEvents();
        this._prepare();
        this.xhr.open("GET", url);
        this.xhr.responseType = 'document';
        this.xhr.send();
    }

    Ajax.prototype._registerEvents = function () {
        this.xhr.addEventListener('loadstart', this);
        this.xhr.addEventListener('load', this._handleEvent.bind(this));
        this.xhr.addEventListener('loadend', this._handleEvent.bind(this));
        this.xhr.addEventListener('progress', this._handleEvent.bind(this));
        this.xhr.addEventListener('error', this._handleEvent.bind(this));
        this.xhr.addEventListener('abort', this._handleEvent.bind(this));
    };

    Ajax.prototype._handleEvent = function (e) {
        console.log(`${e.type}: ${e.loaded} bytes transferred`);
    };

    Ajax.prototype._prepare = function () {
        this.xhr.onreadystatechange = function () {
            switch (this.xhr.readyState) {
                case XMLHttpRequest.UNSENT:
                    break;
                case XMLHttpRequest.OPENED:
                    this._setHeaders();
                    break;
                case XMLHttpRequest.HEADERS_RECEIVED:
                    this._proccessResponseHeaders();
                    break;
                case XMLHttpRequest.LOADING:
                    break;
                case XMLHttpRequest.DONE:
                    this._proccessDone();
                    break;
            }
        }.bind(this);
    };

    Ajax.prototype._setHeaders = function () {
        this.xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml');
        this.xhr.setRequestHeader('X-M-App-Iframe', '1');
    };

    Ajax.prototype._proccessResponseHeaders = function () {
        // this.xhr.status;
        // this.xhr.statusText;
        // this.xhr.getAllResponseHeaders();
        if (this.xhr.status !== 200) {
            this.errorCallback({}, `Response status ${this.xhr.status} ${this.xhr.statusText}`);
            this.xhr.abort();
        }
    };

    Ajax.prototype._proccessDone = function () {
        this.xhr.status;
        this.xhr.statusText;
        if (this.xhr.status === 200) {
            this._handleSuccess();
        } else {
            this.errorCallback({}, `Response status ${this.xhr.status} ${this.xhr.statusText}`);
        }
    };

    Ajax.prototype._handleSuccess = function () {
        this.successCallback(this.xhr.response);
    };

    Ajax.prototype._handleError = function (e, msg) {
        this.errorCallback(e, msg);
    };

    function observerIframe() {
        var targetNode = document.getElementById('container-iframe');
        var config = {attributes: true, childList: false, subtree: false};

        var callback = function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                }
                else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.', mutation, targetNode);
                }
            }
        };

        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        //observer.disconnect();

        //Only current domein
        /*targetNode.addEventListener('load',function () {
            console.log(this.contentWindow.location);
        },false);*/
    }
})();
