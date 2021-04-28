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
    rPAF1: (function() {
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
    rPAF2: function(callback) {
        requestAnimationFrame(() => this.rPAF2(callback));
    },
    loop: true,
    loopOn: undefined,
    loopOff: function() {
        this.loop = false;
    }
};

DT.loopOn = function() {
    if (DT.loop) {
        requestAnimationFrame(DT.loopOn);
        console.log('ON2');
    } else {
        DT.loop = true;
    }
};
