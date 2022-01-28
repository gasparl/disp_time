/*jshint esversion: 6 */

// get the appropriate version of "requestAnimationFrame()"
const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

const DT = {
    // now: gets the appropriate version of "performance.now()"
    // normally available in all modern browsers, but it can resort to the still precise Date()
    // see https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
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
    // the complex mechanism below is from https://stackoverflow.com/a/57549862/9593181
    // (see the same link for explanation)
    // it turns out that it does not really make a difference, see e.g. https://osf.io/7h5tw/
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
    // loop decides whether the RAF loop should continue, see below
    loop: false,
    // loopFunction actually defined below, because of self-reference
    loopFunction: undefined,
    // sets the RAF loop on by setting loop true and initiating the loop function
    // (optionally prints warning info to console)
    loopOn: function(warn = true) {
        if (warn) {
            console.warn('loopOn()');
        }
        this.loop = true;
        this.loopFunction();
    },
    // sets the RAF loop off by setting loop false
    // (optionally prints warning info to console)
    loopOff: function(warn = true) {
        if (warn) {
            console.warn('loopOff()');
        }
        this.loop = false;
    },
    // this images dictionary is to contain all preloaded image objects
    images: {},
    // function to preload a list of images (via their given paths)
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
    // canvas on which one can draw
    canvas: {},
    // the canvas context objects needed for drawings
    contex: {},
    // add given canvas (via its ID) to the (webpage) document
    addCanvas: (id) => {
        DT.canvas[id] = document.getElementById(id);
        DT.contex[id] = DT.canvas[id].getContext('2d');
    },
    // clear the given canvas (via its ID)
    clearCanvas: (id) => {
        ctx.clearRect(0, 0, DT.canvas[id].width, DT.canvas[id].height);
    },
    // draw on the given canvas (via its ID) with original width and height
    drawCanvas: (id, src) => {
        let image = DT.images[src];
        DT.canvas[id].width = image.naturalWidth;
        DT.canvas[id].height = image.naturalHeight;
        DT.contex[id].drawImage(image, 0, 0);
    },
    // draw on the given canvas (via its ID) without changing canvas size
    drawCanvasDef: (id, src) => {
        DT.contex[id].drawImage(image[src], 0, 0);
    }
};

// add the RAF loop function definition
DT.loopFunction = function() {
    if (DT.loop) {
        requestAnimationFrame(DT.loopFunction);
    }
};
