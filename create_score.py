import os
import json
import music21 as m21

nawba_colors = {"1": "#14AA06",
                "2": "#87CEEB",
                "3": "#065003",
                "4": "#F08080",
                "5": "#B22222",
                "6": "#00BFFF",
                "7": "#494B4B",
                "8": "#0000FF",
                "9": "#4682B4",
                "10": "#FF0000",
                "11": "#7B68EE"}

def separate_string_pattern_in_notes(pattern):
    output = []
    cont = 0
    for idx in range(len(pattern) - 1):
        if (pattern[idx + 1] == '#' or pattern[idx + 1] == '-'):
            output.append(pattern[idx] + pattern[idx + 1])
        elif pattern[idx] != '#' and pattern[idx] != '-':
            output.append(pattern[idx])
    if pattern[-1] != '#' and pattern[-1] != '-':
        output.append(pattern[-1])
    return output

def paint_patterns_in_score(selected_algorithms, selected_nawbas, selected_mbid):

    s = m21.converter.parse('static/data/scores/scores_xml/' + selected_mbid + '.xml')
    p = s.parts[0]
    notes_and_rests = p.flat.notesAndRests.stream()

    with open('static/data/patterns/patterns.json') as json_file:
        all_patterns = json.load(json_file)

    for algorithm in selected_algorithms:
        for nawba in selected_nawbas:
            for pattern in all_patterns[algorithm][nawba]:
                length = len(separate_string_pattern_in_notes(pattern))
                for i in range(len(notes_and_rests[:-length+1])):
                    buffer = []
                    for j in range(length):
                        buffer.append(notes_and_rests[i+j])
                    phrase = ''
                    for n in buffer:
                        if n.isRest:
                            phrase += "R"
                        else:
                            phrase += n.name
                    if phrase == pattern:
                        for bn in buffer:
                            bn.style.color = nawba_colors[nawba]
    output_path = 'static/data/scores/output_scores/' + selected_mbid + '.musicxml'
    s.write('musicxml', fp= output_path)
    return output_path

