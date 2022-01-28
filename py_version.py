from psychopy.visual import Window, Rect, TextStim
from psychopy.core import wait, quit
from psychopy.event import globalKeys
from psychopy.hardware import keyboard
from time import gmtime, strftime, sleep
from sys import exit
from random import shuffle
globalKeys.add(key="q",modifiers=["ctrl"],func=quit)

bg_color = 'white' # decide background color: white or black
reps = 50 # how many repetitions per condition

# stimulus color always opposite of background color
if bg_color == 'white':
    stim_color = 'black'
elif bg_color == 'black':
    stim_color = 'white'
else:
    exit('wrong bg_color')

kb = keyboard.Keyboard()
my_win = Window(fullscr = True, size = (1000, 600), units = 'pix', color= 'white')

# define the "stimulus" rectangle whose color is going to be changing
therect = Rect( my_win, width=500, height=500, lineColor = 'lightblue', fillColor = 'red')
# define a small information box for continually updated info about the ongoing trials
info = TextStim(my_win, text ='Info...', height = 30, pos=(-400, 300), color = 'green')
info.autoDraw = True

durations = [16, 50, 150, 300, 500] # variations of stimulus display duration
date_time = str(strftime("%Y_%m%d_%H%M", gmtime())) # current date
data_out = open('disptime_psychopy_' + bg_color + '_' + date_time + '.txt', 'a', encoding='utf-8')

current_stim = {} # dictionary variable in which to store current trial info
input_time = 'NA'
time_start = 'NA'
time_end = 'NA'

# column names for the data to be saved
data_out.write('\t'.join([
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
]) + '\n')

def store_trial():
    data_out.write('\t'.join(
        [str(el) for el in [
        date_time,
        trialnum,
        '_',
        'py',
        current_stim['duration'],
        'py',
        rt_start*1000,
        time_start*1000,
        time_end*1000,
        time_start*1000,
        time_end*1000,
        'NA',
        'NA']]
        ) + '\n');

# display trial information during testing
def disp_text():
    info.text = 'Current trial: ' + str(trialnum) + ' (' + str(len(durations*reps)-trialnum)  + ' left)\nDuration: ' + str(current_stim['duration']) + '\nBackground: ' + bg_color + ''

def t_start():
    global time_start
    time_start = kb.clock.getTime()
def t_end():
    global time_end
    time_end = kb.clock.getTime()

# begin with red rectangle
therect.draw()
my_win.flip()
wait(3)
kb.clock.reset()
therect.fillColor = bg_color # change to the given background color at start
trialnum = 0
therect.draw()
my_win.flip()
xstart = kb.waitKeys(keyList = 'x')[0].rt # start with keypress "x"

for i in range(reps): # repeat cycle for the given number of repetitions
    shuffle(durations)
    for dur in durations:
        trialnum += 1
        current_stim['duration'] = dur
        disp_text() # display the trial info
        therect.fillColor = stim_color # change to given stimulus color
        therect.draw()
        my_win.callOnFlip(t_start) # on flip, time the display
        rt_start = kb.waitKeys(keyList = 'q')[0].rt # wait for keypress "q"

        my_win.flip()

        # wait for the duration (in ms) adjusted with minus 10 ms
        # (to account for the 60 Hz refresh rate; 16.7 ms per frame)
        # convert to second by dividing it with 1000
        wait((dur-10)/1000)
        therect.fillColor = bg_color
        therect.draw()
        my_win.callOnFlip(t_end) # on flip, time display end

        my_win.flip()

        store_trial()

# record client information
data_out.write('client\t' + '/'.join(["os", "os_v", "browser", "browser_v", "screen", "bg", "xstart"]) + '\t' + 'NA/NA/psychopy/NA/NA/' + bg_color + '/' + str(xstart*1000))
data_out.close()
wait(3)
therect.fillColor = 'blue' # indicate ending with blue colored rectangle
therect.draw()
my_win.flip()
kb.waitKeys(keyList = 'b') # wait for (manual) keypress "b" to close the presentation
print("The end.")

quit()
