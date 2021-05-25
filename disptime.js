/*jshint esversion: 6 */

const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

const DT = {
    now: function() {
        let performance = window.performance || {};
        performance.now = (function() {
            return (
                performance.now ||
                performance.webkitNow ||
                performance.msNow ||
                performance.oNow ||
                performance.mozNow ||
                function() {
                    return new Date().getTime();
                }
            );
        })();
        return performance.now();
    },
    rPAF: (function() {
        if (typeof requestPostAnimationFrame === 'function') {
            return (requestPostAnimationFrame);
        } else {
            const channel = new MessageChannel();
            const callbacks = [];
            let timestamp = 0;
            let called = false;
            channel.port2.onmessage = e => {
                called = false;
                const toCall = callbacks.slice();
                callbacks.length = 0;
                toCall.forEach(fn => {
                    try {
                        fn(timestamp);
                    } catch (e) {}
                });
            };
            return (function(callback) {
                if (typeof callback !== 'function') {
                    throw new TypeError('Argument 1 is not callable');
                }
                callbacks.push(callback);
                if (!called) {
                    requestAnimationFrame((time) => {
                        timestamp = time;
                        channel.port1.postMessage('');
                    });
                    called = true;
                }
            });
        }
    })(),
    loop: false,
    loopFunction: undefined,
    loopOn: function(warn = true) {
        if (warn) {
            console.warn('loopOn()');
        }
        this.loop = true;
        this.loopFunction();
    },
    loopOff: function(warn = true) {
        if (warn) {
            console.warn('loopOff()');
        }
        this.loop = false;
    }
};

DT.loopFunction = function() {
    if (DT.loop) {
        requestAnimationFrame(DT.loopFunction);
    }
};
