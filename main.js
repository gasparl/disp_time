/*jshint esversion: 6 */

let use_images, date_time, jscd_text, listenkey, text_to_show, js_times,
    bg_color, stim_color, input_time, disp_func, canvas, ctx;
let trialnum = 0;
let startclicked = false;
let allimages = [];

document.addEventListener("DOMContentLoaded", function() {
    let heads = ["os", "os_v", "browser", "browser_v", "screen"];
    let cols = [jscd.os, jscd.osVersion, jscd.browser, jscd.browserVersion, jscd.screen];
    let jscd_show = heads.map(function(hed, ind) {
        return ('<br>' + hed + ': <b>' + cols[ind] + '</b>');
    });
    date_time = neat_date();
    jscd_text = 'client\t' + heads.join('/') + '/bg/xstart\t' + cols.join('/');
    document.getElementById('jscd_id').innerHTML = jscd_show;
    canvas = document.getElementById('canvas_id');
    ctx = canvas.getContext('2d');
    document.body.addEventListener('keydown', function(e) {
        input_time = DT.now();
        if (listenkey && e.key == 'q') {
            listenkey = false;
            disp_func();
        } else if (startclicked && e.key == 'x') {
            jscd_text += input_time;
            next_trial();
            startclicked = false;
        }
    });
});

function begin(colr, imguse) {
    bg_color = colr;
    use_images = imguse;
    if (bg_color == 'black') {
        stim_color = 'white';
        document.getElementById('stimulus_id').style.color = "white";
        ctx.fillStyle = "white";
        document.getElementById('bg_id').style.backgroundColor = "black";
        jscd_text += '/black';
    } else {
        stim_color = 'black';
        jscd_text += '/white';
        document.getElementById('bg_id').style.backgroundColor = "white";
    }
    document.getElementById('btns_id').style.visibility = 'hidden';
    stim_gen();
    startclicked = true;
}

function stim_gen() {
    let times = 10;
    let durs = [16, 50, 150, 300, 500];
    let methods;
    if (use_images === true) {
        methods = [
            'canvas', 'opacity', 'none'
        ];
    } else {
        methods = [
            'rPAF_alone', 'rPAF_1rAF', 'rPAF_2rAF', 'rPAF_loop',
            'rAF_single', 'rAF_double', 'rAF_loop', 'none', 'rPAF_1rAF_loop'
        ];
    }
    let types = {};
    if (use_images === true) {
        const imgtypes = {
            'img_tiny': 'png',
            'img_small': 'jpg',
            'img_medium': 'bmp',
            'img_large': 'bmp'
        };
        Object.keys(imgtypes).forEach((img_x) => {
            types[img_x] = Array(10).fill(0).map(function(x, y) {
                let fnam = './images/' + img_x + y + '_' + stim_color + '.' + imgtypes[img_x];
                allimages.push(fnam);
                return (fnam);
            });
        });
        DT.addCanvas('canvas_id');
        DT.preload(allimages)
            .then(function(images) {
                console.log('Preloaded all', images);
                document.getElementById('bg_id').style.border = "solid 3px blue";
            })
            .catch(function(err) {
                console.error('Failed', err);
            });
    } else {
        types = {
            'text': Array(times).fill('■'),
            'img_canvas': Array(times).fill('_')
        };
        document.getElementById('bg_id').style.border = "solid 3px blue";
    }

    allstims = [];
    methods.forEach((tmr) => {
        durs.forEach((dur) => {
            Object.keys(types).forEach((typ) => {
                let stims = shuffle(types[typ]).slice(0, times);
                stims.forEach((itm) => {
                    allstims.push({
                        'item': itm,
                        'duration': dur,
                        'type': typ,
                        'method': tmr
                    });
                });
            });
        });
    });
    allstims = shuffle(allstims);
}

function next_trial() {
    trialnum++;
    js_times = {};
    current_stim = allstims.shift();
    console.log(current_stim);
    document.getElementById('info_id').innerHTML =
        'Current trial: <b>' + trialnum + '</b> (' + allstims.length +
        ' left)<br>Item: <b>' + current_stim.item +
        '</b><br>Type: <b>' + current_stim.type +
        '</b><br>Duration: <b>' + current_stim.duration +
        '</b><br>Method: <b>' + current_stim.method +
        '</b><br>Background: <b>' + bg_color + '</b>';
    DT.loopOff();
    if (current_stim.method != 'canvas') {
        if (current_stim.method == 'none') {
            DT.images[current_stim.item].style.visibility = 'hidden';
        } else {
            DT.images[current_stim.item].style.opacity = 0;
            DT.images[current_stim.item].style.willChange = 'opacity';
        }
        document.getElementById('stimulus_id').appendChild(DT.images[current_stim.item]);
    }
    setTimeout(function() {
        if (use_images === true) {
            set_img_conds();
        } else {
            set_disp_conds();
        }
        setTimeout(function() {
            listenkey = true;
        }, 100);
    }, 100);
}

function set_img_conds() {
    disp_func = disp_image;
    DT.loopOn();
}

function set_disp_conds() {
    if (current_stim.method == 'rAF_single') {
        disp_func = disp_rAF1_text;
    } else if (current_stim.method == 'rAF_double') {
        disp_func = disp_rAF2_text;
    } else if (current_stim.method == 'rAF_loop') {
        disp_func = disp_rAF1_text;
        DT.loopOn();
    } else if (current_stim.method == 'rPAF_alone') {
        disp_func = disp_rPAF1_text;
    } else if (current_stim.method == 'rPAF_1rAF') {
        disp_func = disp_rPAF2_text;
    } else if (current_stim.method == 'rPAF_2rAF') {
        disp_func = disp_rPAF3_text;
    } else if (current_stim.method == 'rPAF_loop') {
        disp_func = disp_rPAF1_text;
        DT.loopOn();
    } else if (current_stim.method == 'rPAF_1rAF_loop') {
        disp_func = disp_rPAF2_text;
        DT.loopOn();
    } else if (current_stim.method == 'none') {
        disp_func = disp_none_text;
    } else {
        console.error('No display function found');
        store_trial();
    }
}

//*** display functions ***//

// image methods

function disp_image() {
    console.log('disp_image', neat_date());
    js_times.start_other = DT.now();

    requestAnimationFrame(function(stamp) {
        if (current_stim.method == 'canvas') {
            DT.drawCanvas('canvas_id', current_stim.item);
        } else if (current_stim.method == 'none') {
            DT.images[current_stim.item].style.visibility = 'visible';
        } else {
            DT.images[current_stim.item].style.opacity = 1;
        }
        js_times.start_nextline = DT.now();
        js_times.start_stamp = stamp;

        setTimeout(function() {
            js_times.end_other = DT.now();

            requestAnimationFrame(function(stamp2) {
                if (current_stim.method == 'canvas') {
                    DT.clearCanvas('canvas_id');
                } else if (current_stim.method == 'none') {
                    DT.images[current_stim.item].style.visibility = 'hidden';
                } else {
                    DT.images[current_stim.item].style.opacity = 0;
                }
                js_times.end_nextline = DT.now();
                js_times.end_stamp = stamp2;
                store_trial();
            });

        }, current_stim.duration - 10);

    });
}

// timing methods

function disp_rPAF1_text() {
    console.log('disp_rPAF1_text', neat_date());
    if (current_stim.type == 'text') {
        document.getElementById('stimulus_id').textContent = current_stim.item;
    } else {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    js_times.start_nextline = DT.now();
    DT.rPAF(function(stamp) {
        js_times.start_other = DT.now();
        js_times.start_stamp = stamp;

        setTimeout(function() {
            if (current_stim.type == 'text') {
                document.getElementById('stimulus_id').textContent = '';
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            js_times.end_nextline = DT.now();
            DT.rPAF(function(stamp2) {
                js_times.end_other = DT.now();
                js_times.end_stamp = stamp2;
                store_trial();
            });

        }, current_stim.duration - 10);

    });
}


function disp_rPAF2_text() {
    requestAnimationFrame(function() {
        console.log('disp_rPAF2_text', neat_date());
        if (current_stim.type == 'text') {
            document.getElementById('stimulus_id').textContent = current_stim.item;
        } else {
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        js_times.start_nextline = DT.now();
        DT.rPAF(function(stamp) {
            js_times.start_other = DT.now();
            js_times.start_stamp = stamp;

            setTimeout(function() {

                requestAnimationFrame(function() {
                    if (current_stim.type == 'text') {
                        document.getElementById('stimulus_id').textContent = '';
                    } else {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                    js_times.end_nextline = DT.now();
                    DT.rPAF(function(stamp2) {
                        js_times.end_other = DT.now();
                        js_times.end_stamp = stamp2;
                        store_trial();
                    });
                });

            }, current_stim.duration - 10);

        });
    });
}

function disp_rPAF3_text() {
    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            console.log('disp_rPAF3_text', neat_date());
            if (current_stim.type == 'text') {
                document.getElementById('stimulus_id').textContent = current_stim.item;
            } else {
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            js_times.start_nextline = DT.now();
            DT.rPAF(function(stamp) {
                js_times.start_other = DT.now();
                js_times.start_stamp = stamp;

                setTimeout(function() {

                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            if (current_stim.type == 'text') {
                                document.getElementById('stimulus_id').textContent = '';
                            } else {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                            }
                            js_times.end_nextline = DT.now();
                            DT.rPAF(function(stamp2) {
                                js_times.end_other = DT.now();
                                js_times.end_stamp = stamp2;
                                store_trial();
                            });
                        });
                    });

                }, current_stim.duration - 10);

            });
        });
    });
}

function disp_rAF1_text() {
    console.log('disp_rAF1_text', neat_date());
    js_times.start_other = DT.now();

    requestAnimationFrame(function(stamp) {
        if (current_stim.type == 'text') {
            document.getElementById('stimulus_id').textContent = current_stim.item;
        } else {
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        js_times.start_nextline = DT.now();
        js_times.start_stamp = stamp;

        setTimeout(function() {
            js_times.end_other = DT.now();

            requestAnimationFrame(function(stamp2) {
                if (current_stim.type == 'text') {
                    document.getElementById('stimulus_id').textContent = '';
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                js_times.end_nextline = DT.now();
                js_times.end_stamp = stamp2;
                store_trial();
            });

        }, current_stim.duration - 10);

    });
}

function disp_rAF2_text() {
    requestAnimationFrame(function() {
        console.log('disp_rAF2_text', neat_date());
        js_times.start_other = DT.now();
        requestAnimationFrame(function(stamp) {
            if (current_stim.type == 'text') {
                document.getElementById('stimulus_id').textContent = current_stim.item;
            } else {
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            js_times.start_nextline = DT.now();
            js_times.start_stamp = stamp;

            setTimeout(function() {

                requestAnimationFrame(function() {
                    js_times.end_other = DT.now();
                    requestAnimationFrame(function(stamp2) {
                        if (current_stim.type == 'text') {
                            document.getElementById('stimulus_id').textContent = '';
                        } else {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                        }
                        js_times.end_nextline = DT.now();
                        js_times.end_stamp = stamp2;
                        store_trial();
                    });
                });

            }, current_stim.duration - 10);

        });
    });
}

function disp_rAF3_text() {
    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            console.log('disp_rAF3_text', neat_date());
            js_times.start_other = DT.now();
            requestAnimationFrame(function(stamp) {
                if (current_stim.type == 'text') {
                    document.getElementById('stimulus_id').textContent = current_stim.item;
                } else {
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                js_times.start_nextline = DT.now();
                js_times.start_stamp = stamp;

                setTimeout(function() {

                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            js_times.end_other = DT.now();
                            requestAnimationFrame(function(stamp2) {
                                if (current_stim.type == 'text') {
                                    document.getElementById('stimulus_id').textContent = '';
                                } else {
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                }
                                js_times.end_nextline = DT.now();
                                js_times.end_stamp = stamp2;
                                store_trial();
                            });
                        });
                    });

                }, current_stim.duration - 10);

            });
        });
    });
}

function disp_none_text() {
    console.log('disp_none_text', neat_date());
    if (current_stim.type == 'text') {
        document.getElementById('stimulus_id').textContent = current_stim.item;
    } else {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    js_times.start_nextline = DT.now();
    js_times.start_stamp = js_times.start_nextline;
    js_times.start_other = js_times.start_nextline;
    setTimeout(function() {
        if (current_stim.type == 'text') {
            document.getElementById('stimulus_id').textContent = '';
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        js_times.end_nextline = DT.now();
        js_times.end_stamp = js_times.end_nextline;
        js_times.end_other = js_times.end_nextline;
        store_trial();
    }, current_stim.duration - 10);
}

// store

let full_data = [
    "datetime",
    "trial_number",
    "stimulus",
    "type",
    "duration",
    "method",
    "js_input",
    "js_start_nextline",
    "js_end_nextline",
    "js_start_stamp",
    "js_end_stamp",
    "js_start_other",
    "js_end_other"
].join('\t') + '\n';

function store_trial() {
    let c_item;
    c_item = current_stim.item.replace('./images/', '');
    full_data += [
        date_time,
        trialnum,
        c_item,
        current_stim.type,
        current_stim.duration,
        current_stim.method,
        input_time,
        js_times.start_nextline || 'NA',
        js_times.end_nextline || 'NA',
        js_times.start_stamp || 'NA',
        js_times.end_stamp || 'NA',
        js_times.start_other || 'NA',
        js_times.end_other || 'NA'
    ].join('\t') + '\n';
    input_time = 'NA';
    document.getElementById('stimulus_id').innerHTML = '';
    DT.images[current_stim.item].style.visibility = 'visible';
    DT.images[current_stim.item].style.opacity = 1;
    if (allstims.length > 0) {
        next_trial();
    } else {
        ending();
    }
}

function ending() {
    console.log('THE END');
    full_data += jscd_text;
    document.getElementById('dl_id').style.display = 'block';
    setTimeout(function() {
        document.getElementById('bg_id').style.backgroundColor = "blue";
    }, 5000);
}

function dl_as_file() {
    filename_to_dl = 'disptime_' + jscd.os + '_' +
        jscd.browser + '_' + bg_color + '_' + date_time + '.txt';
    data_to_dl = full_data;
    let blobx = new Blob([data_to_dl], {
        type: 'text/plain'
    });
    let elemx = window.document.createElement('a');
    elemx.href = window.URL.createObjectURL(blobx);
    elemx.download = filename_to_dl;
    document.body.appendChild(elemx);
    elemx.click();
    document.body.removeChild(elemx);
}

function neat_date() {
    let m = new Date();
    return m.getFullYear() + "_" +
        ("0" + (m.getMonth() + 1)).slice(-2) + "" +
        ("0" + m.getDate()).slice(-2) + "_" +
        ("0" + m.getHours()).slice(-2) + "" +
        ("0" + m.getMinutes()).slice(-2);
}

function shuffle(arr) {
    let array = JSON.parse(JSON.stringify(arr));
    let newarr = [];
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        newarr[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return newarr;
}
