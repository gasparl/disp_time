from psychopy.visual import Window, Rect, TextStim
from psychopy.core import wait, quit, Clock
from psychopy.hardware import keyboard
from time import gmtime, strftime, sleep
from sys import exit

bg_color = 'white' # white black
#
if bg_color == 'white':
    stim_color = 'black'
elif bg_color == 'black':
    stim_color = 'white'
else:
    exit('wrong bg_color')

kb = keyboard.Keyboard()
my_win = Window(fullscr = True, units = 'pix', color= 'white')

therect = Rect( my_win, width=800, height=400, lineColor = 'lightblue', fillColor = 'red')
info = TextStim(my_win, text ='Info...', height = 50, pos=(0, 0))

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
    data_out.write('\t'.join([
        date_time,
        trialnum,
        '_',
        'py',
        current_stim['duration'],
        'py',
        pressed_key.rt,
        time_start,
        time_end,
        time_start,
        time_end,
        'NA',
        'NA'
    ]) + '\n');

def waitKeys(keyList = None):
    kb.clock.reset()
    while True:
        keys = kb.getKeys(keyList=keyList)
        if keys:
            return keys[1]
        sleep(0.00001)

def disp_text():
    info.text = 'Current trial: <b>' + str(trialnum) + '</b> (' + str(len(durations)-trialnum)  + ' left)\nDuration: <b>' + str(current_stim['duration']) + '</b>\nBackground: <b>' + bg_color + '</b>'

def t_start():
    global time_start
    time_start = timer.getTime()
def t_end():
    global time_end
    time_end = timer.getTime()

trialnum = 0
therect.draw()
my_win.flip()
waitKeys('x')
timer = Clock()

for dur in durations:    
    trialnum += 1
    current_stim['duration'] = dur
    therect.fillColor = stim_color
    therect.draw()
    my_win.callOnFlip(t_start)
    pressed_key = waitKeys('q')
    
    my_win.flip()
    
    wait((dur-10)/1000)
    therect.fillColor = bg_color
    therect.draw()
    my_win.callOnFlip(t_end)
    
    my_win.flip()
    
    store_trial()
    print( pressed_key.name, pressed_key.rt )

data_out.close()
wait(3)
therect.fillColor = 'blue'
therect.draw()
my_win.flip()
waitKeys()

quit()

