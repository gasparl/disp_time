from psychopy.visual import Window, Rect, TextStim
from psychopy.core import wait, quit
from psychopy.event import globalKeys
from psychopy.hardware import keyboard
from time import gmtime, strftime, sleep
from sys import exit
from random import shuffle
globalKeys.add(key="q",modifiers=["ctrl"],func=quit)

bg_color = 'white' # white black
reps = 50
#
if bg_color == 'white':
    stim_color = 'black'
elif bg_color == 'black':
    stim_color = 'white'
else:
    exit('wrong bg_color')

kb = keyboard.Keyboard()
my_win = Window(fullscr = True, size = (1000, 600), units = 'pix', color= 'white')

therect = Rect( my_win, width=500, height=500, lineColor = 'lightblue', fillColor = 'red')
info = TextStim(my_win, text ='Info...', height = 30, pos=(-400, 300), color = 'green')
info.autoDraw = True

durations = [16, 50, 150, 300, 500]
date_time = str(strftime("%Y_%m%d_%H%M", gmtime()))
data_out = open('disptime_psychopy_' + bg_color + '_' + date_time + '.txt', 'a', encoding='utf-8')

current_stim = {}
input_time = 'NA'
time_start = 'NA'
time_end = 'NA'

data_out.write('\t'.join([
    "datetime",
    "trial_number",
    "stimulus",
    "type",
    "duration",
    "timer",
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

def waitKeys(keyList = None):
    while True:
        keys = kb.getKeys(keyList=keyList)
        if keys:
            return keys[0].rt
        sleep(0.00001)

def disp_text():
    info.text = 'Current trial: ' + str(trialnum) + ' (' + str(len(durations*reps)-trialnum)  + ' left)\nDuration: ' + str(current_stim['duration']) + '\nBackground: ' + bg_color + ''

def t_start():
    global time_start
    time_start = kb.clock.getTime()
def t_end():
    global time_end
    time_end = kb.clock.getTime()


therect.draw()
my_win.flip()
wait(3)
kb.clock.reset()
therect.fillColor = bg_color
trialnum = 0
therect.draw()
my_win.flip()
xstart = waitKeys('x')

for i in range(reps):
    shuffle(durations)
    for dur in durations:
        trialnum += 1
        current_stim['duration'] = dur
        disp_text()
        therect.fillColor = stim_color
        therect.draw()
        my_win.callOnFlip(t_start)
        rt_start = waitKeys('q')

        my_win.flip()

        wait((dur-5)/1000)
        therect.fillColor = bg_color
        therect.draw()
        my_win.callOnFlip(t_end)

        my_win.flip()

        store_trial()


data_out.write('client\t' + '/'.join(["os", "os_v", "browser", "browser_v", "screen", "bg", "xstart"]) + '\t' + 'NA/NA/psychopy/NA/NA/' + bg_color + '/' + str(xstart*1000))
data_out.close()
wait(3)
therect.fillColor = 'blue'
therect.draw()
my_win.flip()
waitKeys("b")
print("The end.")

quit()
