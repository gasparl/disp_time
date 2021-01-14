/*jshint esversion: 6 */

let now = function() {
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
};
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// item display timing
function monkeyPatchRequestPostAnimationFrame() {
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
    window.requestPostAnimationFrame = function(callback) {
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
    };
}

if (typeof requestPostAnimationFrame !== 'function') {
    monkeyPatchRequestPostAnimationFrame();
}

let rAF_loop_on = true;

function rAF_loop() {
    if (rAF_loop_on) {
        requestAnimationFrame(rAF_loop);
    }
}
