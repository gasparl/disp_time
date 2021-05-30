from psychopy.hardware import keyboard
from psychopy import visual, core, event
mywin = visual.Window([600, 400])
myrect = visual.Rect(mywin, 1.8, 1.8, fillColor = "red")
kb = keyboard.Keyboard()
event.globalKeys.add(key='q', modifiers= 'ctrl', func=core.quit)

backg = "white" # "black" / "white"

times = 10
durs = [16, 50, 150, 300, 500]

###
if backg == "white":
    stimcolor = 'black'
else:
    stimcolor = 'white'
allstims = []
for i in range(times):
    for dur in durs:
        allstims.append(dur)

lasttime = 0
timer = core.Clock()
    
#    mywin.callOnFlip(onflp)

for duration in allstims:
    core.wait(0.5)
    myrect.fillColor = "white"
    myrect.draw()
    mywin.flip()
    core.wait(duration)
    myrect.fillColor = "black"
    myrect.draw()
    mywin.flip()    

mywin.close()
core.quit()