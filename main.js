/*jshint esversion: 6 */

document.addEventListener("DOMContentLoaded", function() {
    let heads = ["os", "os_v", "browser", "browser_v", "screen"];
    let cols = [jscd.os, jscd.osVersion, jscd.browser, jscd.browserVersion, jscd.screen];
    let jscd_show = heads.map(function(hed, ind) {
        return ('<br>' + hed + ': <b>' + cols[ind] + '</b>');
    });
    date_time = neat_date();
    jscd_text = 'client\t' + heads.join('/') + '\t' + cols.join('/');
    document.getElementById('jscd_id').innerHTML = jscd_show;
    document.body.addEventListener('keydown', function(e) {
        input_time = now();
        if (listenkey) {
            keycode = e.which || e.keyCode || 0;
            pressed_key = e.key;
            if (pressed_key == 'q' || pressed_key == 'w') {
                disp_func();
            }
        }
    });
});

let date_time, jscd_text, listenkey, text_to_show, raf_times,
    stim_color, input_time, stim_starts, stim_ends, pressed_key, keycode;
let trialnum = 0;

function begin(colr) {
    stim_color = colr;
    if (stim_color == 'white') {
        document.getElementById('stimulus_id').style.color = "white";
        document.getElementById('bg_id').style.backgroundColor = "black";
    }
    document.getElementById('btns_id').style.visibility = 'hidden';
    stim_gen();
    next_trial();
}

function stim_gen() {
    let times = 10;
    let durs = [16.66, 50, 150, 300, 500];
    let timers = ['rpaf', 'raf', 'none'];
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
        'text': Array(times).fill('■')
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
        'Item: <b>' + current_stim.item +
        '</b><br>Type: <b>' + current_stim.type +
        '</b><br>Duration: <b>' + current_stim.duration +
        '</b><br>Timer: <b>' + current_stim.timer +
        '</b><br>Color: <b>' + stim_color + '</b>';
    setTimeout(function() {
        if (current_stim.timer == 'rpaf') {
            disp_func = disp_rPAF_text;
            rAF_loop();
        } else if (current_stim.timer == 'raf') {
            disp_func = disp_rAF_text;
        } else {
            disp_func = disp_none_text;
        }
        setTimeout(function() {
            listenkey = true;
        }, 100);
    }, 100);
}

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
    "pressed_key",
    "key_code",
    "raf_start_before",
    "raf_start_call",
    "raf_end_before",
    "raf_end_call"
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
        pressed_key,
        keycode,
        raf_times.start_before || 'na',
        raf_times.start_call || 'na',
        raf_times.end_before || 'na',
        raf_times.end_call || 'na'
    ].join('\t') + '\n';
    input_time = 'na';
    stim_starts = 'na';
    stim_ends = 'na';
    pressed_key = 'na';
    keycode = 'na';
    if (allstims.length > 0) {
        next_trial();
    } else {
        ending();
    }
}

function disp_rPAF_text() {
    console.log('disp_rPAF_text', neat_date());
    document.getElementById('stimulus_id').textContent = current_stim.item;
    raf_times.start_before = now();
    requestPostAnimationFrame(function() {
        stim_starts = now();

        requestAnimationFrame(function() {

            document.getElementById('stimulus_id').textContent = '';
            raf_times.end_before = now();
            requestPostAnimationFrame(function() {
                stim_ends = now();
                rAF_loop_on = false;
                store_trial();
            });

        }, current_stim.duration);

    });
}

function disp_rAF_text() {
    console.log('disp_rAF_text', neat_date());
    raf_times.start_before = now();

    requestAnimationFrame(function(stamp) {
        stim_starts = stamp;
        document.getElementById('stimulus_id').textContent = current_stim.item;
        raf_times.start_call = now();

        requestAnimationFrame(function() {
            raf_times.end_before = now();

            requestAnimationFrame(function(stamp2) {
                stim_ends = stamp2;
                document.getElementById('stimulus_id').textContent = '';
                raf_times.end_call = now();
                rAF_loop_on = false;
                store_trial();
            });

        }, current_stim.duration);

    });
}

function disp_none_text() {
    console.log('disp_none_text', neat_date());
    document.getElementById('stimulus_id').textContent = current_stim.item;
    stim_starts = now();
    requestAnimationFrame(function() {
        document.getElementById('stimulus_id').textContent = '';
        raf_times.end_before = now();
        stim_ends = now();
        rAF_loop_on = false;
        store_trial();
    }, current_stim.duration);
}

function dl_as_file() {
    filename_to_dl = 'disptime_' + this_os + '_' +
        this_browser + '_' + stim_color + '_' + neat_date() + '.txt';
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
