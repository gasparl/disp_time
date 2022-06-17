Repository for the experiment scripts (HTML/JS website, as well as codes for PsychoPy and the Arduino) for the paper "[Precise display time measurement in JavaScript for web-based experiments](https://psyarxiv.com/jqk8m/)". The verbatim scripts used for the studies are available via the [release v1.0.0](https://github.com/gasparl/disp_time/releases/tag/v1.0.0), while the present scripts is updated with comments throughout (in the JS and PY files).

The live website using the HTML/JS files in the present repository is available via [https://gasparl.github.io/disp_time/index.html](https://gasparl.github.io/disp_time/index.html). (The studies used this same live website for the presentation of stimuli and the recording of JS timings.)

The _index.html_ file contains all essential HTML elements of this website (including CSS styling). The _main.js_ file contains the main code (general flow). The _jscd.js_ file is just a small external plugin (by [Christian Ludwig](https://github.com/gasparl/disp_time/blob/main/jscd.js)) for automatically detecting "client" information (computer, browser types and versions, and screen size). The crucial timing methods are in the _disptime.js_ file. A shortened version of this latter file is available via [https://github.com/gasparl/dtjs](https://github.com/gasparl/dtjs), along with usage instructions, for general use in future experiments.

The PsychoPy version of the test is given in the file _py_version.py_.

The code for sending keypress triggers via the Arduino device is given in the file _Keyboard_Trigger.ino_.

The "_images_" folder contains the (fully black or fully white) images presented in Study 2. The corresponding original (multicolor) images (from GAPED, OASIS, and BASS) are under the subfolder "_originals_". The Python file used for the color conversion is given as _conversion.py_.

---

All files (for each "release") in this repository are permanently stored at https://doi.org/10.5281/zenodo.5912059

[![DOI](https://zenodo.org/badge/329712803.svg)](https://zenodo.org/badge/latestdoi/329712803)

---

The contents of this repository are licensed under [CC-BY 4.0 International](https://github.com/gasparl/disp_time/blob/master/LICENSE.md). (In essence, you can use all material for any purpose as long as you give credit to the original authors in a reasonable manner, e.g. cite it in case of a publication; for details, see the included [LICENSE file](https://github.com/gasparl/disp_time/blob/master/LICENSE.md).)

An appropriate reference for citation is:

Lukács, G., & Gartus, A. (2022). Precise display time measurement in JavaScript for web-based experiments. _Behavior Research Methods_. https://doi.org/10.3758/s13428-022-01835-2

---

For further material related to the study (such as the results data and analysis scripts), see [https://osf.io/wyebt/](https://osf.io/wyebt/).
