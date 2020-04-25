import os
import glob

files = [f for f in glob.glob("***/**/*.mid", recursive=True)]

for midi_file in files:
    if '#' in midi_file:
        os.rename(midi_file, midi_file.replace('#', 'x'))
    # os.remove(file)
    # print("removing " + file)
    # midi_file = file.replace("wav", "mid")
    # wav_file = midi_file.replace('mid', 'wav')
    # if '#' in midi_file:
    #     wav_file = wav_file.replace('#', 'x')
    # print("regenerating " + wav_file)
    # cli = "timidity " + midi_file + " -Ow -o " + wav_file
    # print(cli)
    # os.system(cli)
