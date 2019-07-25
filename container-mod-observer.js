//container-mod-observer
(function () {
            var el = document.querySelector('iframe');
            var containerEl = window.parent.document.body.querySelector('iframe');

            setInterval(function () {
                el.style.width = (Math.random()*100+200).toPrecision(1)+'px';
                el.style.height = (Math.random()*100+100).toPrecision(1)+'px';
            },1000);

            observerIframe(el, containerEl);

            function observerIframe(el, containerEl) {
                var targetNode = el;
                var config = {attributes: true, childList: false, subtree: false};

                var callback = function (mutationsList, observer) {
                    for (var mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            console.log('A child node has been added or removed.');
                        }
                        else if (mutation.type === 'attributes') {
                            console.log('The ' + mutation.attributeName + ' attribute was modified.', mutation, targetNode);
                            containerEl.setAttribute(mutation.attributeName,el.getAttribute(mutation.attributeName));
                            containerEl.style.width = (parseInt(containerEl.style.width)+3) + 'px';
                            containerEl.style.height = (parseInt(containerEl.style.height)+7) + 'px';

                        }
                    }
                };

                var observer = new MutationObserver(callback);
                observer.observe(targetNode, config);
                //observer.disconnect();
            }
        })();
