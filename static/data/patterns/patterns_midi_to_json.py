import os
import glob
import json

files = [f for f in glob.glob("***/**/*.wav", recursive=True)]

output_dict = {'sia': {}, 'centos': {}, 'tfidf': {}}

for category in output_dict:
    for i in range(1, 12):
        output_dict[category][str(i)] = []

for file in files:
    file_sep = file.split('/')
    output_dict[file_sep[0]][file_sep[1]].append(file_sep[2].replace('.wav',''))

with open('patterns.json', 'w') as json_file:
    json.dump(output_dict, json_file)
