/*jshint esversion: 6 */

let date_time, jscd_text, listenkey, text_to_show, raf_times,
    stim_color, input_time, stim_starts, stim_ends,
    disp_func, canvas, ctx;
let trialnum = 0;
let startclicked = false;

document.addEventListener("DOMContentLoaded", function() {
    let heads = ["os", "os_v", "browser", "browser_v", "screen"];
    let cols = [jscd.os, jscd.osVersion, jscd.browser, jscd.browserVersion, jscd.screen];
    let jscd_show = heads.map(function(hed, ind) {
        return ('<br>' + hed + ': <b>' + cols[ind] + '</b>');
    });
    date_time = neat_date();
    jscd_text = 'client\t' + heads.join('/') + '\t' + cols.join('/');
    document.getElementById('jscd_id').innerHTML = jscd_show;
    canvas = document.getElementById('canvas_id');
    ctx = canvas.getContext('2d');
    document.body.addEventListener('keydown', function(e) {
        input_time = DT.now();
        if (listenkey && e.key == 'q') {
            listenkey = false;
            disp_func();
        } else if (startclicked && e.key == 'x') {
            next_trial();
            startclicked = false;
        }
    });
});

function begin(colr) {
    stim_color = colr;
    if (stim_color == 'white') {
        document.getElementById('stimulus_id').style.color = "white";
        ctx.fillStyle = "white";
        document.getElementById('bg_id').style.backgroundColor = "black";
    }
    document.getElementById('btns_id').style.visibility = 'hidden';
    stim_gen();
    startclicked = true;
}

function stim_gen() {
    let times = 10;
    let durs = [16, 50, 150, 300, 500];
    let timers = [
        'rpaf1', 'rpaf2', 'rpaf3', 'rpaf_loop',
        'raf1', 'raf2', 'raf3', 'raf_loop', 'none'
    ];
    let types = {
        'text': Array(times).fill('■'),
        'img_canvas': Array(times).fill('_'),
        'img_tiny': [1, 2, 3],
        'img_small': [1, 2, 3],
        'img_medium': [1, 2, 3],
        'img_large': [1, 2, 3]
    };

    // TODO: remove
    types = {
        'text': Array(times).fill('■'),
        'img_canvas': Array(times).fill('_')
    };

    allstims = [];
    timers.forEach((tmr) => {
        durs.forEach((dur) => {
            Object.keys(types).forEach((typ) => {
                let stims = shuffle(types[typ]).slice(0, times);
                stims.forEach((itm) => {
                    allstims.push({
                        'item': itm,
                        'duration': dur,
                        'type': typ,
                        'timer': tmr
                    });
                });
            });
        });
    });
    allstims = shuffle(allstims);
}

function next_trial() {
    trialnum++;
    raf_times = {};
    current_stim = allstims.shift();
    console.log(current_stim);
    document.getElementById('info_id').innerHTML =
        'Current trial: <b>' + trialnum + '</b> (' + allstims.length +
        ' left)<br>Item: <b>' + current_stim.item +
        '</b><br>Type: <b>' + current_stim.type +
        '</b><br>Duration: <b>' + current_stim.duration +
        '</b><br>Timer: <b>' + current_stim.timer +
        '</b><br>Color: <b>' + stim_color + '</b>';
    DT.loopOff();
    setTimeout(function() {
        if (current_stim.timer == 'raf1') {
            disp_func = disp_rAF1_text;
        } else if (current_stim.timer == 'raf2') {
            disp_func = disp_rAF2_text;
        } else if (current_stim.timer == 'raf3') {
            disp_func = disp_rAF3_text;
        } else if (current_stim.timer == 'raf_loop') {
            disp_func = disp_rAF1_text;
            DT.loopOn();
        } else if (current_stim.timer == 'rpaf1') {
            disp_func = disp_rPAF1_text;
        } else if (current_stim.timer == 'rpaf2') {
            disp_func = disp_rPAF2_text;
        } else if (current_stim.timer == 'rpaf3') {
            disp_func = disp_rPAF3_text;
        } else if (current_stim.timer == 'rpaf_loop') {
            disp_func = disp_rPAF1_text;
            DT.loopOn();
        } else if (current_stim.timer == 'none') {
            disp_func = disp_none_text;
        } else {
            console.error('No display function found');
            store_trial();
        }
        setTimeout(function() {
            listenkey = true;
        }, 100);
    }, 100);
}

// display functions

function disp_rPAF1_text() {
    console.log('disp_rPAF1_text', neat_date());
    if (current_stim.type == 'text') {
        document.getElementById('stimulus_id').textContent = current_stim.item;
    } else {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    raf_times.start_before = DT.now();
    DT.rPAF(function(stamp) {
        stim_starts = DT.now();
        raf_times.start_stamp = stamp;

        setTimeout(function() {
            if (current_stim.type == 'text') {
                document.getElementById('stimulus_id').textContent = '';
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            raf_times.end_before = DT.now();
            DT.rPAF(function(stamp2) {
                stim_ends = DT.now();
                raf_times.end_stamp = stamp2;
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
        raf_times.start_before = DT.now();
        DT.rPAF(function(stamp) {
            stim_starts = DT.now();
            raf_times.start_stamp = stamp;

            setTimeout(function() {

                requestAnimationFrame(function() {
                    if (current_stim.type == 'text') {
                        document.getElementById('stimulus_id').textContent = '';
                    } else {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                    raf_times.end_before = DT.now();
                    DT.rPAF(function(stamp2) {
                        stim_ends = DT.now();
                        raf_times.end_stamp = stamp2;
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
            raf_times.start_before = DT.now();
            DT.rPAF(function(stamp) {
                stim_starts = DT.now();
                raf_times.start_stamp = stamp;

                setTimeout(function() {

                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            if (current_stim.type == 'text') {
                                document.getElementById('stimulus_id').textContent = '';
                            } else {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                            }
                            raf_times.end_before = DT.now();
                            DT.rPAF(function(stamp2) {
                                stim_ends = DT.now();
                                raf_times.end_stamp = stamp2;
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
    raf_times.start_before = DT.now();

    requestAnimationFrame(function(stamp) {
        if (current_stim.type == 'text') {
            document.getElementById('stimulus_id').textContent = current_stim.item;
        } else {
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        stim_starts = DT.now();
        raf_times.start_stamp = stamp;

        setTimeout(function() {
            raf_times.end_before = DT.now();

            requestAnimationFrame(function(stamp2) {
                if (current_stim.type == 'text') {
                    document.getElementById('stimulus_id').textContent = '';
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                stim_ends = DT.now();
                raf_times.end_stamp = stamp2;
                store_trial();
            });

        }, current_stim.duration - 10);

    });
}

function disp_rAF2_text() {
    requestAnimationFrame(function() {
        console.log('disp_rAF2_text', neat_date());
        raf_times.start_before = DT.now();
        requestAnimationFrame(function(stamp) {
            if (current_stim.type == 'text') {
                document.getElementById('stimulus_id').textContent = current_stim.item;
            } else {
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            stim_starts = DT.now();
            raf_times.start_stamp = stamp;

            setTimeout(function() {

                requestAnimationFrame(function() {
                    raf_times.end_before = DT.now();
                    requestAnimationFrame(function(stamp2) {
                        if (current_stim.type == 'text') {
                            document.getElementById('stimulus_id').textContent = '';
                        } else {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                        }
                        stim_ends = DT.now();
                        raf_times.end_stamp = stamp2;
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
            raf_times.start_before = DT.now();
            requestAnimationFrame(function(stamp) {
                if (current_stim.type == 'text') {
                    document.getElementById('stimulus_id').textContent = current_stim.item;
                } else {
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                stim_starts = DT.now();
                raf_times.start_stamp = stamp;

                setTimeout(function() {

                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            raf_times.end_before = DT.now();
                            requestAnimationFrame(function(stamp2) {
                                if (current_stim.type == 'text') {
                                    document.getElementById('stimulus_id').textContent = '';
                                } else {
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                }
                                stim_ends = DT.now();
                                raf_times.end_stamp = stamp2;
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
    stim_starts = DT.now();
    setTimeout(function() {
        if (current_stim.type == 'text') {
            document.getElementById('stimulus_id').textContent = '';
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        stim_ends = DT.now();
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
    "timer",
    "t_input",
    "t_disp_start",
    "t_disp_end",
    "raf_start_before",
    "raf_start_stamp",
    "raf_end_before",
    "raf_end_stamp"
].join('\t') + '\n';

function store_trial() {
    full_data += [
        date_time,
        trialnum,
        current_stim.item,
        current_stim.type,
        current_stim.duration,
        current_stim.timer,
        input_time,
        stim_starts,
        stim_ends,
        raf_times.start_before || 'na',
        raf_times.start_stamp || 'na',
        raf_times.end_before || 'na',
        raf_times.end_stamp || 'na'
    ].join('\t') + '\n';
    input_time = 'na';
    stim_starts = 'na';
    stim_ends = 'na';
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
    document.getElementById('bg_id').style.backgroundColor = "white";
    setTimeout(function() {
        document.getElementById('bg_id').style.backgroundColor = "black";
    }, 3000);
}

function dl_as_file() {
    filename_to_dl = 'disptime_' + jscd.os + '_' +
        jscd.browser + '_' + stim_color + '_' + date_time + '.txt';
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
    return m.getFullYear() + "" +
        ("0" + (m.getMonth() + 1)).slice(-2) + "" +
        ("0" + m.getDate()).slice(-2) + "" +
        ("0" + m.getHours()).slice(-2) + "" +
        ("0" + m.getMinutes()).slice(-2) + "" +
        ("0" + m.getSeconds()).slice(-2);
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
