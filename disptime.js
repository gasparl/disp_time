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
    },
    images: {},
    preload: sources =>
        Promise.all(
            sources.map(
                src => new Promise(function(resolve, reject) {
                    const img = new Image();
                    DT.images[src] = img;
                    img.onload = function() {
                        resolve(img);
                    };
                    img.onerror = reject;
                    img.src = src;
                }))),
    canvas: {},
    contex: {},
    addCanvas: (id) => {
        DT.canvas[id] = document.getElementById(id);
        DT.contex[id] = DT.canvas[id].getContext('2d');
    },
    clearCanvas: (id) => {
        ctx.clearRect(0, 0, DT.canvas[id].width, DT.canvas[id].height);
    },
    drawCanvas: (id, src) => {
        let image = DT.images[src];
        DT.canvas[id].width = image.naturalWidth;
        DT.canvas[id].height = image.naturalHeight;
        DT.contex[id].drawImage(image, 0, 0);
    },
    drawCanvasDef: (id, src) => {
        DT.contex[id].drawImage(image[src], 0, 0);
    }
};

DT.loopFunction = function() {
    if (DT.loop) {
        requestAnimationFrame(DT.loopFunction);
    }
};
