import pyautogui
import random
import tkinter as tk

x = 1400
cycle = 0
check = 1
idle_num = [1, 2, 3, 4]
sleep_num = [10, 11, 12, 13, 15]
walk_left = [6, 7]
walk_right = [8, 9]
event_number = random.randrange(1, 3, 1)
impath = './image/'

def event(cycle, check, event_number, x):
    if event_number in idle_num:
        check = 0
        print('idle')
        window.after(400, update, cycle, check, event_number, x)
    elif event_number == 5:
        check = 1
        print('from idle to sleep')
        window.after(100, update, cycle, check, event_number, x)
    elif event_number in walk_left:
        check = 4
        print('walking towards left')
        window.after(100, update, cycle, check, event_number, x)
    elif event_number in walk_right:
        check = 5
        print('walking towards right')
        window.after(100, update, cycle, check, event_number, x)
    elif event_number in sleep_num:
        check = 2
        print('sleep')
        window.after(1000, update, cycle, check, event_number, x)
    elif event_number == 14:
        check = 3
        print('from sleep to idle')
        window.after(100, update, cycle, check, event_number, x)

def gif_work(cycle, frames, event_number, first_num, last_num):
    if cycle < len(frames) - 1:
        cycle += 1
    else:
        cycle = 0
        event_number = random.randrange(first_num, last_num + 1, 1)
    return cycle, event_number

def update(cycle, check, event_number, x):
    if check == 0:
        frame = idle[cycle]
        cycle, event_number = gif_work(cycle, idle, event_number, 1, 9)
    elif check == 1:
        frame = idle_to_sleep[cycle]
        cycle, event_number = gif_work(cycle, idle_to_sleep, event_number, 10, 10)
    elif check == 2:
        frame = sleep[cycle]
        cycle, event_number = gif_work(cycle, sleep, event_number, 10, 15)
    elif check == 3:
        frame = sleep_to_idle[cycle]
        cycle, event_number = gif_work(cycle, sleep_to_idle, event_number, 1, 1)
    elif check == 4:
        frame = walk_positive[cycle]
        cycle, event_number = gif_work(cycle, walk_positive, event_number, 1, 9)
        x -= 3
    elif check == 5:
        frame = walk_negative[cycle]
        cycle, event_number = gif_work(cycle, walk_negative, event_number, 1, 9)
        x += 3

    window.geometry(f'100x100+{x}+1050')
    label.configure(image=frame)
    window.after(1, event, cycle, check, event_number, x)

# Create the main window
window = tk.Tk()

# Load all the GIF frames
idle = [tk.PhotoImage(file=impath+'idle.gif', format='gif -index %i' % i) for i in range(5)]
idle_to_sleep = [tk.PhotoImage(file=impath+'idle_to_sleep.gif', format='gif -index %i' % i) for i in range(8)]
sleep = [tk.PhotoImage(file=impath+'sleep.gif', format='gif -index %i' % i) for i in range(3)]
sleep_to_idle = [tk.PhotoImage(file=impath+'sleep_to_idle.gif', format='gif -index %i' % i) for i in range(8)]
walk_positive = [tk.PhotoImage(file=impath+'walking_positive.gif', format='gif -index %i' % i) for i in range(8)]
walk_negative = [tk.PhotoImage(file=impath+'walking_negative.gif', format='gif -index %i' % i) for i in range(8)]

# Configure window
window.config(highlightbackground='black')
label = tk.Label(window, bd=0, bg='black')
window.overrideredirect(True)
window.wm_attributes('-topmost', True)  # Changed from '-transparent' to '-transparentcolor'
window.attributes('-topmost', True)  # Keep window on top

label.pack()

# Start the animation loop
window.after(1, update, cycle, check, event_number, x)
window.mainloop()